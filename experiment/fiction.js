// Experiment Instructions Task 1 ========================================================================================================================
var Experiment_Instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h1>Task 1 Instructions</h1>" +
        "<div style='text-align: left'>" +
        "<p>In this part of the experiment, short clips will be shown on the screen with different labels.</p>" +
        "<p>After each clip, you will be asked a series of questions, such as:</p><ul>" +
        "<li><p>How emotional did you find the clip?</p></li>" +
        "<li><p>How visually pleasing or beautiful was the clip? </p></li>" +
        "<div style='text-align: left'>" +
        "<p>We are interested in your first impressions. Please respond according to your gut feelings.</p>",
    choices: ["Start"],
    data: { screen: "Experiment_Instructions" },
}

//Experiment Task 1
var video_stimuli = [
    { stimulus: ["media/stimuli1.mp4"] },
    { stimulus: ["media/stimuli2.mp4"] },
    // { stimulus: ["media/stimuli3.mp4"] },
    // { stimulus: ["media/stimuli4.mp4"] },
    // { stimulus: ["media/stimuli16.mp4"] },
    // { stimulus: ["media/stimuli18.mp4"] },
]

var fiction_preload = {
    type: jsPsychPreload,
    video: video_stimuli.map((item) => item.stimulus).flat(),
}

// Assign half stimuli to each label
for (let i = 0; i < video_stimuli.length; i++) {
    video_stimuli[i].label = i < video_stimuli.length / 2 ? "Human" : "AI"
}

// Reshuffle after assigning labels
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

var video_stimuli = shuffleArray(video_stimuli)

// Label screen
var fiction_cue = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return (
            "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%" +
            "'><b>" +
            jsPsych.timelineVariable("label") +
            "</b></div>"
        )
    },
    trial_duration: 1000,
    choices: ["NO_KEYS"],
    data: { screen: "fiction_cue" },
}

// Video screen phase 1
var video_trial_1 = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: function () {
        return jsPsych.timelineVariable("stimulus")
    },
    trial_duration: 4000,
    response_allowed_while_playing: false,
    choices: "NO_KEYS",
    width: 1000,
    // post_trial_gap: 500,
    data: { screen: "video_phase_1" },
}

// Post Viewing Questions 1

var post_viewing_1 = {
    type: jsPsychSurveyLikert,
    questions: [
        {
            prompt: "To what extent do you agree that this visual representation is enjoyable?",
            name: "enjoyable",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this visual representation is likable?",
            name: "likeable",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this visual representation is pleasing?",
            name: "pleasing",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this visual representation is nice?",
            name: "nice",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this visual representation is appealing?",
            name: "appealing",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        { prompt: "How much are you moved by this image?", name: "moved", labels: ["Not at all", "-", "-", "-", "-", "-", "Very much"] },
    ],
    data: {
        screen: "post_viewing_1",
    },
    randomize_question_order: false,
}

var test_procedure_1 = {
    timeline: [fiction_cue, video_trial_1, post_viewing_1],
    timeline_variables: video_stimuli,
    randomize_order: false,
}

// Experiment Instructions 2 ================================================================================================================================
var Experiment_Instructions_2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h1>Task 2</h1>" +
        "<div style='text-align: left'>" +
        "<p>In this part of the experiment, you will be shown each of the clips again.</p>" +
        "<p>After each clip, you will be asked to identify to the best of your ability, how confident you are that the clip was AI generated, or human made</p><ul>" +
        "<p>Please respond according to your gut feelings.</p>",
    choices: ["Start"],
    data: { screen: "Experiment_Instructions_2" },
}

// Video screen phase 2
var video_trial_2 = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: function () {
        return jsPsych.timelineVariable("stimulus")
    },
    trial_duration: 4000,
    response_allowed_while_playing: false,
    choices: "NO_KEYS",
    width: 1000,
    post_trial_gap: 500,
    data: { screen: "video_phase_2" },
}

// Post Viewing Questions 3
var Participant_labelling_task = {
    type: jsPsychSurveyLikert,
    questions: [
        {
            prompt: "Please indicate your confidence that the clip was AI generated or human made:",
            name: "Confidence in label",
            labels: ["AI generated", "-", "-", "Not sure", "-", "-", "Human made"],
        },
    ],
    data: {
        screen: "post_viewing_2",
    },
    randomize_question_order: true,
}

var test_procedure_2 = {
    timeline: [video_trial_2, Participant_labelling_task],
    timeline_variables: video_stimuli,
    randomize_order: true,
}
