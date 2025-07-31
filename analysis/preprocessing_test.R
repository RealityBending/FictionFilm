library(jsonlite)
library(progress)

# Define the path to the data
path <- "/Users/millyhouldey/Desktop/osf_data"

# Get all CSV files in the folder
files <- list.files(path, pattern = "*.csv")

# Progress bar setup
progbar <- progress_bar$new(total = length(files))

# Initialize storage for all participants
alldata_ppt <- data.frame()
alldata_task <- data.frame()
# all_raffle_data <- data.frame()  # COMMENTED OUT RAFFLE

# Loop through each file
for (file in files) {
  # file = ("7n8xj9q70y.csv")
  progbar$tick()
  message(paste("\nProcessing:", file))
  
  tryCatch({
    # Load the data
    rawdata <- read.csv(file.path(path, file), stringsAsFactors = FALSE)
    
    # Skip files missing core identifiers
    if (!"screen" %in% names(rawdata)) {
      warning("Skipping file (no 'screen' column):", file)
      next
    }
    
    # Basic metadata for this participant
    dat <- rawdata[rawdata$screen == "browser_info", ]
    if (nrow(dat) == 0) {
      warning("Skipping file (no 'browser_info'):", file)
      next
    }
    
    participant_id <- dat$participantID[1]
    message(paste("Participant ID:", participant_id))
    
    # Raffle (COMMENTED OUT)
    # raffle_df <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographics_raffle", ]$response) 
    # raffle_data <- data.frame(email = ifelse(is.null(raffle_df$Raffle_Email), NA, raffle_df$Raffle_Email))
    # raffle_data$Participant <- participant_id
    # all_raffle_data <- rbind(all_raffle_data, raffle_data)
    
    # Build participant-level dataframe
    data_ppt <- data.frame(
      Participant = participant_id,
      Recruitment = dat$researcher,
      Experiment_StartDate = as.POSIXct(paste(dat$date, dat$time), format = "%d/%m/%Y %H:%M:%S"),
      Experiment_Duration = rawdata[rawdata$screen == "demographics_debrief", "time_elapsed"] / 1000 / 60,
      Browser_Version = paste(dat$browser, dat$browser_version),
      Mobile = dat$mobile,
      Platform = dat$os,
      Screen_Width = dat$screen_width,
      Screen_Height = dat$screen_height
    )
    
    # Demographics
    demo_row <- rawdata[rawdata$screen == "demographic_questions", "response"]
    if (length(demo_row) == 1 && !is.na(demo_row)) {
      demog <- fromJSON(demo_row)
      
      # Handle 'other' fields
      demog$Gender <- ifelse(demog$Gender == "other", demog$`Gender-Comment`, demog$Gender)
      demog$Education <- ifelse(demog$Education == "other", demog$`Education-Comment`, demog$Education)
      demog$Ethnicity <- ifelse(!is.null(demog$Ethnicity), demog$Ethnicity, NA)
      demog$Ethnicity <- ifelse(demog$Ethnicity == "other", demog$`Ethnicity-Comment`, demog$Ethnicity)
      
      # Clean up
      demog$`Gender-Comment` <- NULL
      demog$`Education-Comment` <- NULL
      demog$`Discipline-Comment` <- NULL
      demog$`Ethnicity-Comment` <- NULL
      
      data_ppt <- cbind(data_ppt, as.data.frame(demog))
    } else {
      warning("Missing or invalid demographic data for:", participant_id)
    }
    
    # Feedback
    feedback_row <- rawdata[rawdata$screen == "experiment_feedback", "response"]
    if (length(feedback_row) == 1 && !is.na(feedback_row)) {
      feedback <- fromJSON(feedback_row)
      data_ppt$Experiment_Enjoyment <- feedback$Feedback_Enjoyment %||% NA
      data_ppt$Experiment_Quality <- feedback$Feedback_Quality %||% NA
      data_ppt$Experiment_Unusual <- feedback$Feedback_Unusual %||% NA
      data_ppt$Experiment_PerceptionChange <- feedback$Feedback_PerceptionChange %||% NA
      data_ppt$Experiment_Feedback <- feedback$Feedback_Text %||% NA
    }
    
    # BAIT Questionnaire
    bait_row <- rawdata[rawdata$screen == "questionnaire_bait", "response"]
    if (length(bait_row) == 1 && !is.na(bait_row)) {
      bait <- fromJSON(bait_row)
      for (i in seq_along(bait)) {
        if (is.null(bait[[i]])) bait[[i]] <- 0
      }
      data_ppt <- cbind(data_ppt, as.data.frame(bait))
    }
    
    # Media questions
    media_row <- rawdata[rawdata$screen == "media", "response"]
    if (length(media_row) == 1 && !is.na(media_row)) {
      media <- fromJSON(media_row)
      media$media_area <- media$media_area %||% NA
      media$media_seniority <- media$media_seniority %||% NA
      data_ppt <- cbind(data_ppt, as.data.frame(media))
    }
    
    # TASK DATA: Phase 1
    stims1 <- rawdata[rawdata$screen == "video_phase_1",]
    ratings1 <- rawdata[rawdata$screen == "fiction_ratings1", ]
    cues <- rawdata[rawdata$screen == "fiction_cue",]
    
    if (nrow(stims1) > 0 && nrow(ratings1) > 0 && nrow(cues) > 0) {
      data_task <- data.frame(
        Participant = participant_id,
        Stimulus = gsub("\\.mp4|\\\"|\\[|\\]|media/", "", stims1$stimulus),
        Rating_RT_Phase1 = ratings1$rt,
        Condition = cues$condition
      )
      ratings1_json <- lapply(ratings1$response, fromJSON)
      data_task$Enjoyable <- sapply(ratings1_json, function(x) x$enjoyable)
      data_task$Likeable <- sapply(ratings1_json, function(x) x$likeable)
      data_task$Pleasing <- sapply(ratings1_json, function(x) x$pleasing)
      data_task$Expressive <- sapply(ratings1_json, function(x) x$expressive)
      data_task$Emotional <- sapply(ratings1_json, function(x) x$emotional)
    } else {
      warning("Missing phase 1 data for:", participant_id)
      data_task <- data.frame()
    }
    
    # TASK DATA: Phase 2
    stims2 <- rawdata[rawdata$screen == "video_phase_2",]
    ratings2 <- rawdata[rawdata$screen == "fiction_ratings2", ]
    
    if (nrow(stims2) > 0 && nrow(ratings2) > 0) {
      dftask2 <- data.frame(
        Participant = participant_id,
        Stimulus = gsub("\\.mp4|\\\"|\\[|\\]|media/", "", stims2$stimulus),
        Rating_RT_Phase2 = ratings2$rt
      )
      ratings2_json <- lapply(ratings2$response, fromJSON)
      dftask2$Confidence_label <- sapply(ratings2_json, function(x) x$Confidence_in_label)
      
      # Merge phase 1 and 2 task data
      if (nrow(data_task) > 0) {
        data_task <- merge(data_task, dftask2, by = c("Participant", "Stimulus"), all.x = TRUE)
      }
    }
    
    # Store the data
    if (nrow(data_ppt) > 0) alldata_ppt <- rbind(alldata_ppt, data_ppt)
    if (nrow(data_task) > 0) alldata_task <- rbind(alldata_task, data_task)
    
  }, error = function(e) {
    message(paste("Error in file", file, ":", e$message))
  })
}

# Reanonymize participants
alldata_ppt <- alldata_ppt[order(alldata_ppt$Experiment_StartDate), ]
correspondance <- setNames(paste0("S", sprintf("%03d", seq_along(unique(alldata_ppt$Participant)))), unique(alldata_ppt$Participant))
alldata_ppt$Participant <- correspondance[alldata_ppt$Participant]
alldata_task$Participant <- correspondance[alldata_task$Participant]

# Merge participant and task-level data
combined_data <- merge(alldata_task, alldata_ppt, by = "Participant", all.x = TRUE)
# 
# # Save the cleaned datasets
# write.csv(combined_data, "../data/combined_rawdata.csv", row.names = FALSE)
# write.csv(alldata_ppt, "../data/rawdata_participants.csv", row.names = FALSE)
# write.csv(alldata_task, "../data/rawdata_task.csv", row.names = FALSE)
# 
# # write.csv(all_raffle_data, "C:/Users/millyhouldey/Desktop/Raffle/raffle_data.csv", row.names = FALSE)  # COMMENTED
