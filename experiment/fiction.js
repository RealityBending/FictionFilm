//Experiment Task 1
var video_stimuli = [
    { stimulus: ["media/stimuli1.mp4"] },
    { stimulus: ["media/stimuli2.mp4"] },
    { stimulus: ["media/stimuli3.mp4"] },
    { stimulus: ["media/stimuli4.mp4"] },
    { stimulus: ["media/stimuli16.mp4"] },
    { stimulus: ["media/stimuli18.mp4"] },
]

timeline.push({
    type: jsPsychPreload,
    video: video_stimuli.map((item) => item.stimulus).flat(),
})

// Assign labels===============================================================================================================================

// Assign half stimuli to each label
for (let i = 0; i < video_stimuli.length; i++) {
    video_stimuli[i].label = i < video_stimuli.length / 2 ? "Human" : "AI"
}

// Reshuffle after assigning labels
var video_stimuli = jsPsych.randomization.shuffle(video_stimuli)

// Label screen
var fiction_cue = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        return jsPsych.timelineVariable("label")

        // Displays [object Object]
        // var lbl = jsPsych.timelineVariable("label")
        //     return (
        //         "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%" +
        //         "'><b>" + lbl +
        //         "</b></div>"
        //       )
    },
    trial_duration: 1000,
    choices: ["NO_KEYS"],
    data: { screen: "fiction_cue" },
}

// Video screen phase 1
var video_trial_1 = {
    type: jsPsychVideoKeyboardResponse,
    stimulus: jsPsych.timelineVariable("stimulus"),
    trial_duration: 4000,
    response_allowed_while_playing: false,
    choices: "NO_KEYS",
    width: 1000,
    post_trial_gap: 500,
    data: { screen: "video_phase_1" },
}

// Post Viewing Questions 1
var likert_scale = ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"]

var likert_scale2 = ["Not at all", "-", "-", "-", "-", "-", "Very much"]

var post_viewing_1 = {
    type: jsPsychSurveyLikert,
    questions: [
        {
            prompt: "To what extent do you agree that this visual representation is enjoyable?",
            name: "enjoyable",
            labels: likert_scale,
        },
        {
            prompt: "To what extent do you agree that this visual representation is likable?",
            name: "likeable",
            labels: likert_scale,
        },
        {
            prompt: "To what extent do you agree that this visual representation is pleasing?",
            name: "pleasing",
            labels: likert_scale,
        },
        { prompt: "To what extent do you agree that this visual representation is nice?", name: "nice", labels: likert_scale },
        {
            prompt: "To what extent do you agree that this visual representation is appealing?",
            name: "appealing",
            labels: likert_scale,
        },
        { prompt: "How much are you moved by this image?", name: "moved", labels: likert_scale2 },
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
