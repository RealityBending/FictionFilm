library(jsonlite)
library(progress)

# path for data
# path <- "/Users/millyhouldey/Desktop/osf_data"
path <- "C:/Users/asf25/Box/FictionFilm/data/"

# JsPsych Experiment ----------------------------

files <- list.files(path, pattern = "*.csv")

# Progress bar
progbar <- progress_bar$new(total = length(files))

all_ppt <- data.frame()
all_task <- data.frame()
all_bait_names <- c()

for (file in files){
  # file <- "hyb47wjvbs.csv"
  progbar$tick()
  rawdata <- read.csv(paste0(path, "/", file))
  message(paste("\nProcessing:", file))
  
  # Raffle data
  raffle_df <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographics_raffle", ]$response) 
  raffle_data <- data.frame(email = ifelse(is.null(raffle_df$Raffle_Email), NA, raffle_df$Raffle_Email))
    
  # PARTCIPANT DATA ====================================================================================
  
  # Initialize participant-level data
  dat <- rawdata[rawdata$screen == "browser_info", ]
  
    data_ppt <- data.frame(
      Participant = dat$participantID,
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
  demog <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographic_questions", ]$response)

  # Gender
  demog$Gender <- ifelse(demog$Gender == "other", demog$`Gender-Comment`, demog$Gender)
  demog$`Gender-Comment` <- NULL

  # Education
  demog$Education <- ifelse(demog$Education == "other", demog$`Education-Comment`, demog$Education)
  demog$`Education-Comment` <- NULL
  
  demog$Student <- ifelse(!is.null(demog$Student), demog$Student, NA)
  demog$Student <-  ifelse(demog$Student == "other", demog$`Student-Comment`, demog$Student)
  demog$`Student-Comment` <- NULL
  
  # Discipline
  demog$Discipline <- ifelse(!is.null(demog$Discipline), demog$Discipline, NA)
  demog$Discipline <-  ifelse(demog$Discipline == "other", demog$`Discipline-Comment`, demog$Discipline)
  demog$`Discipline-Comment` <- NULL

  # Country
  demog$Country <- ifelse(!is.null(demog$Country), demog$Country, NA)
  demog$Country <-  ifelse(demog$Country == "other", demog$`Country-Comment`, demog$Country)
  demog$`Country-Comment` <- NULL
  
  # Ethnicity
  demog$Ethnicity <- ifelse(!is.null(demog$Ethnicity), demog$Ethnicity, NA)
  demog$Ethnicity <- ifelse(demog$Ethnicity == "other", demog$`Ethnicity-Comment`, demog$Ethnicity)
  demog$`Ethnicity-Comment` <- NULL

  demog <- as.data.frame(demog)
  data_ppt <- cbind(data_ppt, demog)
  
  # # Feedback
  feedback <- jsonlite::fromJSON(rawdata[rawdata$screen == "experiment_feedback", "response"])
  data_ppt$Experiment_Enjoyment <- ifelse(is.null(feedback$Feedback_Enjoyment), NA, feedback$Feedback_Enjoyment)
  data_ppt$Experiment_Quality <- ifelse(is.null(feedback$Feedback_Quality), NA, feedback$Feedback_Quality)
  data_ppt$Experiment_Unusual <- ifelse(is.null(feedback$Feedback_Unusual), NA, feedback$Feedback_Unusual)
  data_ppt$Experiment_PerceptionChange <- ifelse(is.null(feedback$Feedback_Unusual), NA, feedback$Feedback_Unusual)
  data_ppt$Experiment_Feedback <- ifelse(is.null(feedback$Feedback_Text), NA, feedback$Feedback_Text)
  
  
  # Questionnaires 
  
  # Bait
  bait <- jsonlite::fromJSON(rawdata[rawdata$screen == "questionnaire_bait", "response"])
  
  all_bait_names <- union(all_bait_names, names(bait))
  
  for (i in seq_along(bait)) {
    if (is.null(bait[[i]])) {
      bait[[i]] <- NA
    }
  }
  
  bait <- as.data.frame(bait)
  
  #Add any missing columns and fill with NA
  missing_cols <- setdiff(all_bait_names, names(bait))
  bait[missing_cols] <- NA
  
  data_ppt <- cbind(data_ppt, bait)
  
  # Media
  media <- jsonlite::fromJSON(rawdata[rawdata$screen == "media", "response"])
  media$media_area <- ifelse(!is.null(media$media_area), media$media_area, NA)
  media$media_seniority <- ifelse(!is.null(media$media_seniority), media$media_seniority, NA)
  media <- as.data.frame(media)
  
  data_ppt <- cbind(data_ppt, media)
  all_ppt <- rbind(all_ppt, data_ppt)
  
  # TASK DATA ====================================================================================

  # phase 1
  stims1 <- rawdata[rawdata$screen == "video_phase_1",]
  ratings1 = rawdata[rawdata$screen == "fiction_ratings1", ]
  cues <- rawdata[rawdata$screen == "fiction_cue",]

  data_task <- data.frame(
    Participant = dat$participantID,
    Stimulus = gsub("\\.mp4|\\\"|\\[|\\]|media/", "", stims1$stimulus),
    Rating_RT_Phase1 = ratings1$rt,
    Condition = cues$condition
  )
  
  ratings1 <- lapply(ratings1$response, fromJSON)
  data_task$Enjoyable <- sapply(ratings1, function(x) x$enjoyable)
  data_task$Likeable <- sapply(ratings1, function(x) x$likeable)
  data_task$Pleasing <- sapply(ratings1, function(x) x$pleasing)
  data_task$Expressive <- sapply(ratings1, function(x) x$expressive)
  data_task$Emotional <- sapply(ratings1, function(x) x$emotional)
  
  # phase 2 
  stims2 <- rawdata[rawdata$screen == "video_phase_2",]
  ratings2 = rawdata[rawdata$screen == "fiction_ratings2", ]
  
  dftask2 <- data.frame(
    Participant = dat$participantID,
    Stimulus = gsub("\\.mp4|\\\"|\\[|\\]|media/", "", stims2$stimulus),
    Rating_RT_Phase2 = ratings2$rt
  )
  
  ratings2 <- lapply(ratings2$response, fromJSON)
  dftask2$Confidence_label <- sapply(ratings2, function(x) x$Confidence_in_label)

  # Merge and clean
  data_task <- merge(data_task, dftask2, by = c("Participant", "Stimulus"), all.x = TRUE)
  all_task <- rbind(all_task, data_task)

}

# Reanonimize ============================================================

# order based on the date of the experiment
all_ppt <- all_ppt[order(all_ppt$Experiment_StartDate), ]
# Create correspondence map (mapping original Participant IDs to new ones)
correspondance <- setNames(paste0("S", sprintf("%03d", seq_along(all_ppt$Participant))), all_ppt$Participant)
# Reanonymize both datasets by updating the 'Participant' column
all_ppt$Participant <- correspondance[all_ppt$Participant]
all_task$Participant <- correspondance[all_task$Participant]

# Save --------------------------------------------------------------------

write.csv(all_ppt, "../data/rawdata_participants.csv", row.names = FALSE)
write.csv(all_task, "../data/rawdata_task.csv", row.names = FALSE)
# 
# # Change path to box folder of fiction film
# write.csv(raffle_data, "C:/Users/millyhouldey/Desktop/Raffle/raffle_data.csv", row.names = FALSE)
write.csv(raffle_data, "C:/Users/asf25/Box/FictionFilm/raffle/raffle_data.csv", row.names = FALSE)


nrow(all_ppt)








