// Experiment Instructions Task 1 ========================================================================================================================
var Experiment_Instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
    "<h1>Task 1 Instructions</h1>" +
    "<div style='text-align: left'>" +
    "<p>In this part of the experiment, short clips will be shown on the screen with different labels.</p>" +
    "<p>After each clip, you will be asked a series of questions related to your aesthetic experience.</p>" +
    "<p>The first set of questions relates to how the clip makes you feel – the level of satisfaction from watching the clip and whether you liked how it looked:</p>" +
    "<ul>" +
      "<li>To what extent do you agree that this visual representation is enjoyable to watch?</li>" +
      "<li>To what extent do you agree that this visual representation is likeable?</li>" +
      "<li>To what extent do you agree that this visual representation is pleasing to watch?</li>" +
    "</ul>" +
    "<p>The final questions relate to what you think the clip is trying to convey:</p>" +
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
    { stimulus: ["media/stimuli5.mp4"] },
    { stimulus: ["media/stimuli6.mp4"] },
    { stimulus: ["media/stimuli7.mp4"] },
    { stimulus: ["media/stimuli8.mp4"] },
    { stimulus: ["media/stimuli9.mp4"] },
    { stimulus: ["media/stimuli10.mp4"] },
    { stimulus: ["media/stimuli11.mp4"] },
    { stimulus: ["media/stimuli12.mp4"] },
    { stimulus: ["media/stimuli13.mp4"] },
    { stimulus: ["media/stimuli14.mp4"] },
    { stimulus: ["media/stimuli15.mp4"] },
    { stimulus: ["media/stimuli16.mp4"] },
    { stimulus: ["media/stimuli17.mp4"] },
    { stimulus: ["media/stimuli18.mp4"] },
    { stimulus: ["media/stimuli19.mp4"] },
    { stimulus: ["media/stimuli20.mp4"] },
    { stimulus: ["media/stimuli21.mp4"] },
    { stimulus: ["media/stimuli22.mp4"] },
    { stimulus: ["media/stimuli23.mp4"] },
    { stimulus: ["media/stimuli24.mp4"] },
    { stimulus: ["media/stimuli25.mp4"] },
    { stimulus: ["media/stimuli26.mp4"] },
    { stimulus: ["media/stimuli27.mp4"] },
    { stimulus: ["media/stimuli28.mp4"] },
    { stimulus: ["media/stimuli29.mp4"] },
    { stimulus: ["media/stimuli30.mp4"] },
    { stimulus: ["media/stimuli31.mp4"] },
    { stimulus: ["media/stimuli32.mp4"] },
    { stimulus: ["media/stimuli33.mp4"] },
    { stimulus: ["media/stimuli34.mp4"] },
    { stimulus: ["media/stimuli35.mp4"] },
    { stimulus: ["media/stimuli36.mp4"] },
    { stimulus: ["media/stimuli37.mp4"] },
    { stimulus: ["media/stimuli38.mp4"] },
    { stimulus: ["media/stimuli39.mp4"] },
    { stimulus: ["media/stimuli40.mp4"] },
    { stimulus: ["media/stimuli41.mp4"] },
    { stimulus: ["media/stimuli42.mp4"] },
    { stimulus: ["media/stimuli43.mp4"] },
    { stimulus: ["media/stimuli44.mp4"] },
    { stimulus: ["media/stimuli45.mp4"] },
    { stimulus: ["media/stimuli46.mp4"] },
    { stimulus: ["media/stimuli47.mp4"] },
    { stimulus: ["media/stimuli48.mp4"] },
    { stimulus: ["media/stimuli49.mp4"] },
    { stimulus: ["media/stimuli50.mp4"] },
    { stimulus: ["media/stimuli51.mp4"] },
    { stimulus: ["media/stimuli52.mp4"] },
    { stimulus: ["media/stimuli53.mp4"] },
    { stimulus: ["media/stimuli54.mp4"] },
    { stimulus: ["media/stimuli55.mp4"] },
    { stimulus: ["media/stimuli56.mp4"] },
    { stimulus: ["media/stimuli57.mp4"] },
    { stimulus: ["media/stimuli58.mp4"] },
    { stimulus: ["media/stimuli59.mp4"] },
    { stimulus: ["media/stimuli60.mp4"] },
    { stimulus: ["media/stimuli61.mp4"] },
    { stimulus: ["media/stimuli62.mp4"] },
    { stimulus: ["media/stimuli63.mp4"] },
    { stimulus: ["media/stimuli64.mp4"] },
    { stimulus: ["media/stimuli65.mp4"] },
    { stimulus: ["media/stimuli66.mp4"] },
    { stimulus: ["media/stimuli67.mp4"] },
    { stimulus: ["media/stimuli68.mp4"] },
    { stimulus: ["media/stimuli69.mp4"] },
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
        { prompt: "How expressive would you describe the clip you just watched?", 
            name: "expressive", 
            labels: ["Not at all", "-", "-", "-", "-", "-", "Extremely"],
        },
        { prompt: "How emotional would you describe the clip you just watched?", 
            name: "emotional", 
            labels: ["Not at all", "-", "-", "-", "-", "-", "Extremely"],
        },
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
        "<p>After each clip, you will be asked to identify to the best of your ability, how confident you are that the clip was AI generated, or human made</p>" +
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
