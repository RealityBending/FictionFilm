// Consent Form =================================================================
// The consent form is dynamically generated based on the URL variables.

const ConsentForm = {
    type: jsPsychSurvey,
    survey_json: function () {
        // Get URL variables
        let urlvars = jsPsych.data.urlVariables()

        // Logo and title
        let text =
            "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
            "<h1>Informed Consent</h1>"

        // this part is about specific messages for participants based on the recruitment platform
        if (urlvars["exp"] == "surveyswap") {
            text +=
                "<p style='color:green;' align='left'><b>Note: You will receive a <i style='color:purple;'>SurveySwap.iocompletion code</i>  at the end of the experiment.</b></p>"
        }

        if (jsPsych.data.urlVariables()["exp"] == "prolific") {
            text +=
                "<p style='color:green;' align='left'><b>Note: You will receive information regarding your <i style='color:purple;'>Prolific</i> participation at the end of the experiment.</b></p>"
        }

        if (jsPsych.data.urlVariables()["exp"] == "sona") {
            text +=
                "<p style='color:green;' align='left'><b>Note: You will receive a <i style='color:purple;'>Sona completion code</i> at the end of the experiment.</b></p>"
        }
        // Main Text
        text +=
            // Overview
            "<p align='left'><b>Invitation to Take Part</b><br>" +
            "Thank you for considering to take part in this study conducted by Dr Dominique Makowski from the University of Sussex and his team (see contact information below).</p>" +
            // Description
            "<p align='left'><b>Why have I been invited and what will I do?</b><br>" +
            "The aim of this study is to validate a new questionnaire measuring Interoception. Interoception refers to the sensing, interpretation and processing of internal bodily signals (e.g., feeling changes in the way one's heart beats). " +
            "The whole experiment will take you <b style='color:#FF5722;'>~30 min</b> to complete. Please make you sure that you are <b>attentive and in a quiet environment</b>, and that you have time to complete it in one go.</p>" +
            // Results and personal information
            "<p align='left'><b>What will happen to the results and my personal information?</b><br>" +
            "The results of this research may be written into a scientific publication. Your anonymity will be ensured in the way described in the consent information below. <b>Please read this information carefully</b> and then, if you wish to take part, please acknowledge that you have fully understood this sheet, and that you consent to take part in the study as it is described here.</p>" +
            "<p align='left'><b>Consent</b><br></p>" +
            // Bullet points
            "<li align='left'>I understand that by signing below I am agreeing to take part in the University of Sussex research described here, and that I have read and understood this information sheet</li>" +
            "<li align='left'>I understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study, and that I can withdraw at any stage without having to give a reason and without being penalized in any way (e.g., if I am a student, my decision whether or not to take part will not affect my grades).</li>" +
            "<li align='left'>I understand that since the study is anonymous, it will be impossible to withdraw my data once I have completed it.</li>" +
            "<li align='left'>I understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation. I understand that the University's Privacy Notice provides further information on how the University uses personal data in its research.</li>" +
            "<li align='left'>I understand that my collected data will be stored in a de-identified way. De-identified data may be made publicly available through secured scientific online data repositories.</li>"

        // Incentive
        if (["surveyswap", "prolific", "sona"].includes(urlvars["exp"])) {
            text +=
                "<li align='left'>Please note that <b style='color:#FF5722;'>various checks will be performed to ensure the validity of the data</b>. We reserve the right to withhold credit awards or reimbursement should we detect non-valid responses (e.g., random patterns of answers, instructions not read, ...).</li>"
        }

        // End
        text +=
            "<li align='left'>By participating, you agree to follow the instructions and provide honest answers. If you do not wish to participate or if you don't have the time, simply close your browser.</li></p>" +
            "<p align='left'><br><sub><sup>For further information about this research, or if you have any concerns, please contact Dr Dominique Makowski (<i style='color:DodgerBlue;'>D.Makowski@sussex.ac.uk</i>) and/or Ana Neves (<i style='color:DodgerBlue;'>A.Neves@sussex.ac.uk</i>). This research has been approved (ER/EB672/2) by the Sciences & Technology Cross-Schools Research Ethics Committee (C-REC) (<i style='color:DodgerBlue;'>crecscitec@sussex.ac.uk</i>). The University of Sussex has insurance in place to cover its legal liabilities in respect of this study.</sup></sub></p>"

        // Return Survey
        return {
            showQuestionNumbers: false,
            completeText: "I read, understood, and I consent",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "ConsentForm",
                            html: text,
                        },
                    ],
                },
            ],
        }
    },
}

var demographics_browser_info = {
    type: jsPsychBrowserCheck,
    data: {
        screen: "browser_info",
        date: new Date().toLocaleDateString("en-GB"),
        time: new Date().toLocaleTimeString("en-GB"),
    },
    on_finish: function (data) {
        data["participantID"] = participantID
        //data["condition"] = intero_condition

        // Rename
        dat = jsPsych.data.get().filter({ screen: "browser_info" }).values()[0]
        data["screen_height"] = dat["height"]
        data["screen_width"] = dat["width"]

        // Add URL variables - ?sona_id=x&exp=1
        let urlvars = jsPsych.data.urlVariables()
        data["researcher"] = urlvars["exp"]
        data["sona_id"] = urlvars["sona_id"]
        data["prolific_id"] = urlvars["PROLIFIC_PID"] // Prolific
        data["study_id"] = urlvars["STUDY_ID"] // Prolific
        data["session_id"] = urlvars["SESSION_ID"] // Prolific
    },
}

// Demographic questions

var demographic_questions = {
    type: jsPsychSurvey,
    survey_json: {
        title: "About yourself",
        completeText: "Continue",
        pageNextText: "Next",
        pagePrevText: "Previous",
        goNextPageAutomatic: false,
        showQuestionNumbers: false,
        showProgressBar: "aboveHeader",
        pages: [
            {
                elements: [
                    {
                        title: "What is your gender?",
                        name: "Gender",
                        type: "radiogroup",
                        choices: ["Male", "Female", "Other"],
                        isRequired: true,
                        colCount: 0,
                    },
                    {
                        type: "text",
                        title: "Please enter your age (in years)",
                        name: "Age",
                        isRequired: true,
                        inputType: "number",
                        min: 0,
                        max: 100,
                        placeholder: "e.g., 21",
                    },
                ],
            },

            {
                elements: [
                    {
                        title: "What is your highest completed education level?",
                        name: "Education",
                        type: "radiogroup",
                        choices: [
                            {
                                value: "Doctorate",
                                text: "University (doctorate)",
                            },
                            {
                                value: "Master",
                                text: "University (master)", // "<sub><sup>or equivalent</sup></sub>",
                            },
                            {
                                value: "Bachelor",
                                text: "University (bachelor)", // "<sub><sup>or equivalent</sup></sub>",
                            },
                            {
                                value: "High school",
                                text: "High school / Secondary school (or 6th form college)",
                            },
                            {
                                value: "Elementary school",
                                text: "Elementary school / Primary school",
                            },
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 1,
                    },
                    {
                        visibleIf: "{Education} == 'Doctorate' || {Education} == 'Master' || {Education} == 'Bachelor'",
                        title: "What is your discipline?",
                        name: "Discipline",
                        type: "radiogroup",
                        choices: [
                            "Arts and Humanities",
                            "Media, Communication",
                            "Literature, Languages",
                            "History, Archaeology",
                            "Sociology, Anthropology",
                            "Political Science, Law",
                            "Business, Economics",
                            "Psychology, Neuroscience",
                            "Medicine",
                            "Biology, Chemistry, Physics",
                            "Mathematics, Physics",
                            "Engineering, Computer Science",
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                    },
                    {
                        visibleIf: "{Education} == 'High school' || {Education} == 'Master' || {Education} == 'Bachelor'",
                        title: "Are you currently a student?",
                        name: "Student",
                        type: "boolean",
                        swapOrder: true,
                        isRequired: true,
                    },
                ],
            },
            // {
            //     elements: [
            //         {
            //             title: "How would you describe your ethnicity?",
            //             name: "Ethnicity",
            //             type: "radiogroup",
            //             choices: [
            //                 "White",
            //                 "Black",
            //                 "Hispanic/Latino",
            //                 "Middle Eastern/North African",
            //                 "South Asian",
            //                 "East Asian",
            //                 "Southeast Asian",
            //                 "Mixed",
            //                 "Prefer not to say",
            //             ],
            //             showOtherItem: true,
            //             otherText: "Other",
            //             otherPlaceholder: "Please specify",
            //             isRequired: false,
            //             colCount: 1,
            //         },
            //         {
            //             title: "In which country are you currently living?",
            //             name: "Country",
            //             type: "dropdown",
            //             choicesByUrl: {
            //                 url: "https://surveyjs.io/api/CountriesExample",
            //             },
            //             placeholder: "e.g., France",
            //             isRequired: false,
            //         },
            //     ],
            // },
        ],
    },
    data: {
        screen: "demographic_questions",
    },
}

//  // Media Literacy Assesment
// var instructionsfilm = {
// type: jsPsychHtmlButtonResponse,
// stimulus:
// "<h1>Pre Task Questions 1/2</h1>" +
// "<p> Due to the nature of this study, we are interested in your overall consumption, knowledge and expertise on media (TV, Film etc.)</p>" +
// "<p>Please read the statements carefully and indicate the extent to which you agree with each statement.</p>",
// choices: ["Continue"],
// data: { screen: "instructionsfilm" },
// }
// timeline.push(instructionsfilm)

// // Media Literacy
// var likert_scale = [
// "Not at all",
// "A Little",
// "Somewhat",
// "Very",
// "Extremely"
// ];

// var media_literacy = {
// type: jsPsychSurveyLikert,
// questions: [
// {prompt: "How much would you say watching films is part of your routine?", name: 'film_routine', labels: likert_scale},
// {prompt: "How much do you enjoy watching films?", name: 'film_enjoyment', labels: likert_scale},
// {prompt: "How confident are you in evaluating the quality of a film?", name: 'film_quality', labels: likert_scale},
// {prompt: "How confident are you in identifying film messages or themes?", name: 'film_identification', labels: likert_scale},
// {prompt: "How confident are you in recognising the emotions a film tries to convey?", name: 'film_empathy', labels: likert_scale},
// ],
// data: {
// screen: "Pre-screening"
// },
// randomize_question_order: true
// };

// timeline.push(media_literacy);

// // Media professional?
// var media_professional = {
// type: jsPsychSurveyMultiChoice,
// questions: [
// {
// prompt: "Do you, or have you ever worked in the media industry (e.g., film, TV, journalism, animation, production)?",
// options: ["Yes", "No"],
// required: true,
// name: 'media_professional'
// },
// ],
// data: {
// screen: "Pre-screening"
// }
// };

// var media_professional_details = {
// type:jsPsychSurveyMultiChoice,
// questions: [
// {
// prompt: "What area of the media do you work in?",
// options:[
// "Editorial",
// "Production",
// "Other"
// ],
// name: 'media_area',
// required: true
// },
// {
// prompt: "What is your seniority level?",
// options: [
// "Entry",
// "Junior",
// "Mid-level",
// "Senior"
// ],
// name: 'seniority',
// required: true
// },
// ],
// data: {
// screen: "Pre-screening"
// }
// };

// timeline.push(media_professional);

// // timeline.push({
// // timeline: [media_professional_details],
// // conditional_function: function () {
// // var last_response = jsPsych.data.get().filter({}).values().pop();
// // if (last_response && last_response.response && last_response.response['media_professional'] === "Yes") {
// // return true;
// // } else {
// // return false;
// // }
// // }
// // });

// Feedback, Debrief, Thank you Screen
var experiment_feedback = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Feedback",
        description: "It is the end of the experiment! Don't hesitate to leave us a feedback.",
        completeText: "Complete the experiment",
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Feedback_Alert",
                        html: "<p><b style='color:red;'>Answers to these questions will not affect your reward but will help us to contextualize your answers</b></p>",
                    },
                    {
                        type: "rating",
                        name: "Feedback_Enjoyment",
                        title: "Did you enjoy doing this experiment?",
                        isRequired: false,
                        rateMin: 0,
                        rateMax: 4,
                        rateType: "stars",
                    },
                    {
                        type: "rating",
                        name: "Feedback_Quality",
                        title: "To what extent did you do the experiment carefully and thoroughly?",
                        description: "Please be honest!",
                        isRequired: false,
                        rateMin: 0,
                        rateMax: 4,
                    },
                    {
                        type: "comment",
                        name: "Feedback_Text",
                        title: "Anything else you would like to share with us?",
                        description:
                            "Please note that these comments might be shared publicly as part of the results of this study - avoid sharing personal information.",
                        isRequired: false,
                    },
                ],
            },
        ],
    },
    data: {
        screen: "experiment_feedback",
    },
}

var demographics_debriefing = {
    type: jsPsychSurvey,
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Debrief",
                        html:
                            "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
                            "<h2>Debriefing</h2>" +
                            "<p align='left'>The purpose of this study was to create and validate a new questionnaire measuring interoception. " +
                            "Interoception involves being aware of changes happening inside our bodies, both physiological (e.g., our heart rate) and emotional, and it plays a crucial role in how we perceive and experience the world around us. It has been related to emotion regulation, self-awareness and overall mental well-being. " +
                            "<p align='left'><b>Thank you again!</b> Your participation in this study will be kept completely confidential. If you have any questions or concerns about the project, please contact D.Makowski@sussex.ac.uk. and/or A.Neves@Sussex.ac.uk </p>" +
                            "<p>To complete your participation in this study, click on 'Continue' and <b>wait until your responses have been successfully saved</b> before closing the tab.</p> ",
                    },
                ],
            },
        ],
    },
    data: {
        screen: "demographics_debrief",
    },
    on_finish: function (data) {
        let score = check_attentionchecks()
        if (score >= 0.75) {
            //  TODO: Change later
            data["Reward"] = "Automatic"
            data["AttentionScore"] = score
        } else {
            data["Reward"] = "Return"
            data["AttentionScore"] = score
        }
    },
}

var demographics_endscreen = {
    type: jsPsychSurvey,
    survey_json: function () {
        text = "<h2 style='color:green;'>Data saved successfully!</h2>" + "<p>Thank you for participating, it means a lot to us.</p>"

        // Snowball (uncomment if the study is really fun)
        // text +=
        //     "<p>Don't hesitate to share the study by sending this link <i>(but please don't reveal the details of the experiment)</i>:</p>" +
        //     "<p><a href='" +
        //     "https://realitybending.github.io/InteroceptionScale/study1/experiment/index.html" +
        //     "'>" +
        //     "https://realitybending.github.io/InteroceptionScale/study1/experiment/index.html" +
        //     "<a/></p>"

        // TEST:
        // data.reimbursment = "Automatic"

        // Deal with Prolific/SurveyCircle/SurveySwap/SONA
        if (jsPsych.data.urlVariables()["exp"] == "prolific") {
            d = jsPsych.data.get().filter({ screen: "demographics_debrief" })["trials"][0]
            if (d["Reward"] == "Automatic") {
                text +=
                    "<p><b style='color:red;'>After clicking 'End', you will be redirected to the Prolific reimbursement page</b> (You can alternatively click " +
                    "<a href='https://app.prolific.com/submissions/complete?cc=C8I1NGST'>here<a/>" +
                    " to directly access the link).</p>"
            } else {
                text +=
                    "<p><b style='color:red;'>Unfortunately, your participation data did not pass our quality check algorithm (this is typically caused by random patterns of answers and failed attention check questions)." +
                    " In order to avoid any penalties, we suggest that you return your participation by clicking " +
                    "<a href='https://app.prolific.com/submissions/complete?cc=C1BHVQIZ'>here<a/>" +
                    ". We apologize for this outcome. Please don't hesitate to contact us on Prolific if you believe that there was a mistake.</p>"
            }
        }
        if (jsPsych.data.urlVariables()["exp"] == "surveyswap") {
            text +=
                "<p style='color:red;'><b>Click " +
                "<a href='https://surveyswap.io/sr/E9XP-DWMS-BHA3'>here<a/>" +
                " to redeem your SurveySwap participation</b><br>(in case the link doesn't work, the code is: E9XP-DWMS-BHA3)</p>"
        }
        text += "<p><b>You can safely close the tab now.</b></p>"

        // Return survey
        return {
            showQuestionNumbers: false,
            completeText: "End",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "Endscreen",
                            html: text,
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "demographics_endscreen",
    },
}
