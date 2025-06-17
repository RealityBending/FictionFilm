
const jsPsych = initJsPsych({
   show_progress_bar: true,
   auto_update_progress_bar: true,
   on_finish: function() {
      jsPsych.data.displayData(); 
    }
  });

  const videoStimuli = [
    'media/stimuli1.mov',
    'media/stimuli2.mov',
    'media/stimuli3.mov',
    'media/stimuli4.mov',
    'media/stimuli5.mp4',
    'media/stimuli6.mov',
    'media/stimuli7.mov',
    'media/stimuli8.mov',
    'media/stimuli9.mov',
    'media/stimuli10.mov',
    'media/stimuli11.mov',
    'media/stimuli12.mov',
    'media/stimuli13.mp4',
    'media/stimuli14.mov',
    'media/stimuli15.mov',
    'media/stimuli16.mp4',
    'media/stimuli17.mov',
    'media/stimuli18.mp4',
    'media/stimuli19.mov',
    'media/stimuli20.mov'
  ];

  // Consent Screen
  const consent = {
    type: 'html-button-response',
    stimulus: '<h2>Consent Form</h2><p>By clicking "Agree," you consent to take part in this study.</p>',
    choices: ['Agree']
  };

  // Pre-questionaires
  const pre_questionnaires = {
    timeline: [
      demographics,
      ai_use,
      ai_frequency_question,
      ai_attitudes,
      media_literacy,
      media_professional,
      media_professional_details,
    ]
  };
  
        // 1. Demographics
    const demographics =  {
        type: 'survey-html-form',
        html: `
          <p>Age: <input name="age" type="number" required></p>
          <p>Gender: 
            <select name="gender" required>
              <option value="" disabled selected>Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </p>
          <p>Highest level of education: 
            <select name="education" required>
              <option value="" disabled selected>Select</option>
              <option value="High school">High school</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </p>
          <p>Country of residence: <input name="country" type="text" required></p>
        `,
        button_label: 'Continue'
      },
  
      // 2. AI Use - Have you ever used AI tools?
     const ai_use = {
        type: 'survey-multi-choice',
        questions: [
          {
            prompt: "Have you ever used AI tools (e.g., ChatGPT, DALL·E)?",
            options: ["Yes", "No"],
            required: true,
            name: 'ai_used'
          }
        ],
        data: { trial_tag: 'ai_use_check' }  // <-- Add this
      }
      
      // 2b. AI Use Frequency — Conditional
const ai_frequency_question = {
  timeline: [
    {
      type: 'survey-multi-choice',
      questions: [
        {
          prompt: "How often do you use AI tools?",
          options: ["Rarely", "Sometimes", "Often", "Daily"],
          required: true,
          name: 'ai_frequency'
        }
      ]
    }
  ],
  conditional_function: function() {
    const ai_response = jsPsych.data.get().filter({trial_tag: 'ai_use_check'}).values().pop();
    return ai_response && ai_response.response['ai_used'] === "Yes";
  }
};

  
      // 3. AI Attitudes
      const ai_attitudes = {
        type: 'survey-likert',
        questions: [
          {
            prompt: "How much do you trust AI-generated content (e.g., writing, images, video)?",
            labels: ["Not at all", "A little", "Somewhat", "Mostly", "Completely"],
            required: true,
            name: 'ai_trust'
          },
          {
            prompt: "To what extent do you believe AI can play a positive role in society?",
            labels: ["Not at all", "A little", "Somewhat", "Quite a bit", "Very much"],
            required: true,
            name: 'ai_positive_role'
          }
        ]
      },
  
      // 4. Media Literacy
      const media_literacy = {
        type: 'survey-likert',
        questions: [
          {
            prompt: "How often do you watch or consume films?",
            labels: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
            required: true,
            name: 'film_frequency'
          },
          {
            prompt: "How much do you enjoy watching films?",
            labels: ["Not at all", "A little", "Somewhat", "A lot", "Passionately"],
            required: true,
            name: 'film_enjoyment'
          },
          {
            prompt: "How confident are you in evaluating the quality of a film?",
            labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
            required: true,
            name: 'film_quality_confidence'
          },
          {
            prompt: "How confident are you in identifying a film’s message or themes?",
            labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
            required: true,
            name: 'film_theme_confidence'
          },
          {
            prompt: "How confident are you in recognizing the emotions a film tries to convey?",
            labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
            required: true,
            name: 'film_emotion_confidence'
          }
        ]
      },
  
      // 5. Are you a media professional?
     const media_professional = {
        type: 'survey-multi-choice',
        questions: [
          {
            prompt: "Do you work in the media industry (e.g., film, TV, journalism, production)?",
            options: ["Yes", "No"],
            required: true,
            name: 'media_professional'
          }
        ]
      },
  
      // 5b. Conditional media work details
      const media_professional_details = {
        timeline: [
          {
            type: 'survey-html-form',
            html: `
              <p>What area of the media do you work in?</p>
              <select name="media_area" required>
                <option value="" disabled selected>Select</option>
                <option value="Editorial">Editorial</option>
                <option value="Production">Production</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Development">Development</option>
                <option value="Executive/Commissioning">Executive/Commissioning</option>
                <option value="Other">Other</option>
              </select>
              <p>What is your seniority level?</p>
              <select name="media_seniority" required>
                <option value="" disabled selected>Select</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
            `,
            button_label: 'Continue'
          }
        ],
        conditional_function: function() {
          const media_response = jsPsych.data.get().filter({trial_type: 'survey-multi-choice'}).values().pop();
          return media_response && media_response.response['media_professional'] === "Yes";
        }
      };
      
  
  const aesthetic_rating = {
    type: 'survey-likert',
    questions: [
      {
        prompt: "How visually pleasing or beautiful was the clip?",
        labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
        required: true,
        name: 'aesthetic'
      }
    ]
  };
  
  const emotional_rating = {
    type: 'survey-likert',
    questions: [
      {
        prompt: "How emotional did you find the clip?",
        labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
        required: true,
        name: 'emotional'
      }
    ]
  };
  
  const familiarity_rating = {
    type: 'survey-likert',
    questions: [
      {
        prompt: "How familiar did the clip feel to you?",
        labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
        required: true,
        name: 'familiarity'
      }
    ]
  };
  
  const baseline_trials = videoStimuli.flatMap((file, index) => {
    return [
      {
        type: 'video-button-response',
        stimulus: [file],
        prompt: `<p>Clip ${index + 1} — Please watch and then rate the clip accordingly.</p>`,
        choices: ['Continue'],
        trial_ends_after_video: true,
        autoplay: true
      },
      aesthetic_rating,
      emotional_rating,
      familiarity_rating
    ];
  });
  

  const disclosure_trials = [];

  const disclosure_labels = videoStimuli.map(() => 
    Math.random() < 0.5 ? 'AI-generated' : 'Human-made'
  );
  for (let i = 0; i < videoStimuli.length; i++) {
    const file = videoStimuli[i];
    const label = disclosure_labels[i];
  
    disclosure_trials.push(
      {
        type: 'video-button-response',
        stimulus: [file],
        prompt: `<p>Clip ${i + 1} — Label: <strong>${label}</strong></p>`,
        choices: ['Continue'],
        trial_ends_after_video: true,
        data: { label_shown: label }
      },
      aesthetic_rating,
      emotional_rating,
      familiarity_rating,
      {
        type: 'survey-multi-choice',
        questions: [
          {
            prompt: "Did you believe the label shown?",
            options: ['Yes', 'No'],
            required: true,
            name: 'belief_check'
          }
        ]
      }
    );
  }
  
  
  // 7. Debrief
  const debrief = {
    timeline: [
  
      // Introductory disclosure and study purpose
      {
        type: 'html-button-response',
        stimulus: `
          <h2>Debrief</h2>
          <p>Thank you for taking part in this study.</p>
          <p>Some of the video labels (e.g., "AI-generated" or "Human-made") were randomly assigned in order to assess how disclosure influences viewer perceptions and emotional responses.</p>
          <p>This study is designed to explore how people engage with visual media depending on what they are told about its origin.</p>
          <p>We are interested in your impressions, emotional reactions, and overall experience.</p>
        `,
        choices: ['Continue']
      },
  
      // Q1: Suspicion of Deception
      {
        type: 'survey-multi-choice',
        questions: [
          {
            prompt: "Did you suspect that the labels (e.g., 'AI-generated', 'Human-made') might have been random?",
            options: ['Yes', 'No'],
            required: true,
            name: 'suspected_deception'
          }
        ]
      },
      {
        type: 'survey-text',
        questions: [
          {
            prompt: "If yes, what gave it away?",
            rows: 3,
            columns: 40,
            name: 'deception_reason'
          }
        ]
      },
  
      // Q3: Changing Perceptions of AI
      {
        type: 'survey-likert',
        questions: [
          {
            prompt: "Did watching these clips change how you feel about AI-generated video content?",
            labels: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
            required: true,
            name: 'ai_opinion_change'
          }
        ]
      },
      {
        type: 'survey-text',
        questions: [
          {
            prompt: "In what ways, if any, did your views on AI in media change during this study?",
            rows: 4,
            columns: 50,
            name: 'ai_opinion_details'
          }
        ]
      }
      ,
  
      // NEW: Emotional impact of disclosure
      {
        type: 'survey-text',
        questions: [
          {
            prompt: "Did seeing the AI/Human labels affect you emotionally in any way? If so, how or why?",
            rows: 4,
            columns: 50,
            name: 'emotional_impact_disclosure'
          }
        ]
      },
  
      // Q4: Overall Experience
      {
        type: 'survey-likert',
        questions: [
          {
            prompt: "How engaging did you find this task overall?",
            labels: ["Not at all", "A little", "Moderately", "Very", "Extremely"],
            required: true,
            name: 'task_engagement'
          }
        ]
      },
      {
        type: 'survey-text',
        questions: [
          {
            prompt: "Is there anything else you would like to share about your experience in this study?",
            rows: 4,
            columns: 50,
            name: 'final_feedback'
          }
        ]
      }
    ]
  };  
  
  // 8. Timeline
  const timeline = [];
  
  timeline.push(consent);
  timeline.push(pre_questionnaires);
  timeline.push(baseline_trials);
  timeline.push(disclosure_trials);
  timeline.push(debrief);
  
  jsPsych.run([
    consent,
    pre_questionnaires,
    {
      timeline: baseline_trials,
      randomize_order: true  // optional
    },
    {
      timeline: disclosure_trials,
      randomize_order: true  // optional
    },
    debrief
  ]);
  