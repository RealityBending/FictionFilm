// Experiment Instructions Task 1 ========================================================================================================================
var Experiment_Instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h1>Task 1 Instructions</h1>" +
        "<div style='text-align: left'>" +
        "<p>In this part of the experiment, short clips will be shown on the screen with different labels.</p>" +
        "<p>After each clip, you will be asked a series of questions related to your aesthetic experience.</p>" +
        "<p>The first set of questions relate to how the clip makes you feel (the level of satisfaction from watching the clip and whether you liked how it looked):</p>" +
        "<ul>" +
        "<li>To what extent do you agree that this clip is enjoyable?</li>" +
        "<li>To what extent do you agree that this clip is likeable?</li>" +
        "<li>To what extent do you agree that this clip is pleasing?</li>" +
        "</ul>" +
        "<p>The final questions relate to what you think the clip is trying to convey or show:</p>" +
        "<ul>" +
        "<li>How expressive would you describe the clip?</li>" +
        "<li>How emotional would you describe the clip?</li>" +
        "</ul>" +
        "<p>We are interested in your first impressions. Please respond according to your gut feelings.</p>" +
        "</div>",
    choices: ["Start"],
    data: { screen: "Experiment_Instructions" },
}

//Experiment Task 1
var video_stimuli = [
    { stimulus: ["media/stimuli1.mp4"] },
    { stimulus: ["media/stimuli2.mp4"] },
    { stimulus: ["media/stimuli3.mp4"] },
    { stimulus: ["media/stimuli4.mp4"] },
    { stimulus: ["media/Stimuli5.mp4"] },
    { stimulus: ["media/Stimuli6.mp4"] },
    { stimulus: ["media/Stimuli7.mp4"] },
    { stimulus: ["media/Stimuli8.mp4"] },
    { stimulus: ["media/Stimuli9.mp4"] },
    { stimulus: ["media/Stimuli10.mp4"] },
    { stimulus: ["media/Stimuli11.mp4"] },
    { stimulus: ["media/Stimuli12.mp4"] },
    { stimulus: ["media/Stimuli13.mp4"] },
    { stimulus: ["media/Stimuli14.mp4"] },
    { stimulus: ["media/Stimuli15.mp4"] },
    // { stimulus: ["media/Stimuli16.mp4"] },
    { stimulus: ["media/Stimuli17.mp4"] },
    // { stimulus: ["media/Stimuli18.mp4"] },
    { stimulus: ["media/Stimuli19.mp4"] },
    { stimulus: ["media/Stimuli20.mp4"] },
    { stimulus: ["media/Stimuli21.mp4"] },
    { stimulus: ["media/Stimuli22.mp4"] },
    { stimulus: ["media/Stimuli23.mp4"] },
    { stimulus: ["media/Stimuli24.mp4"] },
    { stimulus: ["media/Stimuli25.mp4"] },
    { stimulus: ["media/Stimuli26.mp4"] },
    { stimulus: ["media/Stimuli27.mp4"] },
    { stimulus: ["media/Stimuli28.mp4"] },
    { stimulus: ["media/Stimuli29.mp4"] },
    { stimulus: ["media/Stimuli30.mp4"] },
    { stimulus: ["media/Stimuli31.mp4"] },
    { stimulus: ["media/Stimuli33.mp4"] },
    { stimulus: ["media/Stimuli34.mp4"] },
    { stimulus: ["media/Stimuli35.mp4"] },
    { stimulus: ["media/Stimuli36.mp4"] },
    { stimulus: ["media/Stimuli37.mp4"] },
    { stimulus: ["media/Stimuli38.mp4"] },
    { stimulus: ["media/Stimuli39.mp4"] },
    { stimulus: ["media/Stimuli40.mp4"] },
    { stimulus: ["media/Stimuli41.mp4"] },
    { stimulus: ["media/Stimuli42.mp4"] },
    { stimulus: ["media/Stimuli43.mp4"] },
    { stimulus: ["media/Stimuli44.mp4"] },
    { stimulus: ["media/Stimuli45.mp4"] },
    { stimulus: ["media/Stimuli46.mp4"] },
    { stimulus: ["media/Stimuli47.mp4"] },
    { stimulus: ["media/Stimuli48.mp4"] },
    { stimulus: ["media/Stimuli49.mp4"] },
    { stimulus: ["media/Stimuli50.mp4"] },
    { stimulus: ["media/Stimuli51.mp4"] },
    { stimulus: ["media/Stimuli52.mp4"] },
    { stimulus: ["media/Stimuli53.mp4"] },
    { stimulus: ["media/Stimuli54.mp4"] },
    { stimulus: ["media/Stimuli55.mp4"] },
    { stimulus: ["media/Stimuli56.mp4"] },
    { stimulus: ["media/Stimuli57.mp4"] },
    { stimulus: ["media/Stimuli58.mp4"] },
    { stimulus: ["media/Stimuli59.mp4"] },
    { stimulus: ["media/Stimuli60.mp4"] },
    { stimulus: ["media/Stimuli61.mp4"] },
    { stimulus: ["media/Stimuli62.mp4"] },
    { stimulus: ["media/Stimuli63.mp4"] },
    { stimulus: ["media/Stimuli64.mp4"] },
    { stimulus: ["media/Stimuli65.mp4"] },
    { stimulus: ["media/Stimuli66.mp4"] },
    { stimulus: ["media/Stimuli67.mp4"] },
    { stimulus: ["media/Stimuli68.mp4"] },
    { stimulus: ["media/Stimuli69.mp4"] },
]

var fiction_preload = {
    type: jsPsychPreload,
    video: video_stimuli.map((item) => item.stimulus).flat(),
}

// Assign half stimuli to each label
for (let i = 0; i < video_stimuli.length; i++) {
    video_stimuli[i].label = i < video_stimuli.length / 2 ? "Human-made" : "AI-generated"
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
            prompt: "To what extent do you agree that this clip is enjoyable?",
            name: "enjoyable",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this clip is likable?",
            name: "likeable",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "To what extent do you agree that this clip is pleasing?",
            name: "pleasing",
            labels: ["Strongly disagree", "-", "-", "-", "-", "-", "Strongly agree"],
        },
        {
            prompt: "How expressive would you describe the clip you just watched?",
            name: "expressive",
            labels: ["Not at all", "-", "-", "-", "-", "-", "Extremely"],
        },
        {
            prompt: "How emotional would you describe the clip you just watched?",
            name: "emotional",
            labels: ["Not at all", "-", "-", "-", "-", "-", "Extremely"],
        },
    ],
    data: {
        screen: "ratings_1",
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
        "<h1>Task 2 Instructions</h1>" +
        "<div style='text-align: left'>" +
        "<p>In this part of the experiment, you will be shown each of the clips again.</p>" +
        "<p>After each clip, you will be asked to identify to the best of your ability, how confident you are that the clip was AI-generated, or human-made</p>" +
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
        screen: "ratings_2",
    },
    randomize_question_order: true,
}

var test_procedure_2 = {
    timeline: [video_trial_2, Participant_labelling_task],
    timeline_variables: video_stimuli,
    randomize_order: true,
}
