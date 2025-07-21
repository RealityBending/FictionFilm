library(jsonlite)
library(progress)

# path for data
path <- "C:/Users/asf25/Box/FictionFilm/"

# JsPsych Experiment ----------------------------

files <- list.files(path, pattern = "*.csv")

# Progress bar
progbar <- progress_bar$new(total = length(files))

alldata <- data.frame()
for (file in files){
  progbar$tick()
  rawdata <- read.csv(paste0(path, "/", file))
  
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
  demog$`Discipline-Comment` <- NULL

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
  
  # delete later, this was to deal with no responses on the BAIT --? it is now required to answer the questionnaire 
  for (i in seq_along(bait)) {
    if (is.null(bait[[i]])) {
      bait[[i]] <- 0
    }
  }
  
  bait <- as.data.frame(bait)

  data_ppt <- cbind(data_ppt, bait)
  
  # Media
  media <- jsonlite::fromJSON(rawdata[rawdata$screen == "media", "response"])
  media$media_area <- ifelse(!is.null(media$media_area), media$media_area, NA)
  media$media_seniority <- ifelse(!is.null(media$media_seniority), media$media_seniority, NA)
  media <- as.data.frame(media)
  
  data_ppt <- cbind(data_ppt, media)
  
  # TASK DATA ====================================================================================

  # phase 1
  stims1 <- rawdata[rawdata$screen == "video_phase_1",]
  ratings1 = rawdata[rawdata$screen == "fiction_ratings1", ]
  cues <- rawdata[rawdata$screen == "fiction_cue",]

  dftask <- data.frame(
    Participant = dat$participantID,
    Stimulus = gsub("\\.mp4|\\\"|\\[|\\]|media/", "", stims1$stimulus),
    Rating_RT_Phase1 = ratings1$rt,
    Condition = cues$label
  )
  
  ratings1 <- lapply(ratings1$response, fromJSON)
  dftask$Enjoyable <- sapply(ratings1, function(x) x$enjoyable)
  dftask$Likeable <- sapply(ratings1, function(x) x$likeable)
  dftask$Pleasing <- sapply(ratings1, function(x) x$pleasing)
  dftask$Expressive <- sapply(ratings1, function(x) x$expressive)
  dftask$Emotional <- sapply(ratings1, function(x) x$emotional)
  
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
  dftask <- merge(dftask, dftask2, by = c("Participant", "Stimulus"), all.x = TRUE)
  
}

# Reanonimize ============================================================

# order based on the date of the experiment
data_ppt <- data_ppt[order(data_ppt$Experiment_StartDate), ]
# Create correspondence map (mapping original Participant IDs to new ones)
correspondance <- setNames(paste0("S", sprintf("%03d", seq_along(data_ppt$Participant))), data_ppt$Participant)
# Reanonymize both datasets by updating the 'Participant' column
data_ppt$Participant <- correspondance[data_ppt$Participant]
dftask$Participant <- correspondance[dftask$Participant]

# Save --------------------------------------------------------------------

write.csv(data_ppt, "../data/rawdata_participants.csv", row.names = FALSE)
write.csv(dftask, "../data/rawdata_task.csv", row.names = FALSE)


