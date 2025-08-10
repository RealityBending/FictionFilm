library(tableone)
library(dplyr)

# Load combined dataset
data <- read.csv("/combined_data.csv")  # update path

# Keep only one row per participant
data_unique <- data %>%
  distinct(Participant, .keep_all = TRUE)

# Check what variables we have
names(data_unique)

# Pick your demographic variables
vars <- c("Age", "Gender", "Education")  # replace with actual names
group_var <- "media_professional"       

# Create table
demo_table <- CreateTableOne(vars = vars,
                             strata = group_var,
                             data = data_unique,
                             factorVars = c("Gender", "Education"))

# Print table
print(demo_table, showAllLevels = TRUE, quote = FALSE, noSpaces = TRUE)
