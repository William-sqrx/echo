export const rinaProfile = {
  name: "Rina",
  initials: "R",
  role: "Product Manager",
  nativeLanguage: "Bahasa Indonesia",
  targetLanguage: "Workplace English",
  targetContext: "Singapore workplace English",
  coachingStyle: "Direct, concise, supportive",
  status: "Calibrating",
  activeGoalsLabel: "3 active goals",
  modelUpdateLabel: "Rina's coaching model updated today"
};

export const projects = [
  {
    id: "presentation-confidence",
    name: "Presentation Confidence",
    displayName: "Improve Presentation Skills",
    goal: "Present clearly and handle Q&A confidently",
    scenario: "Monthly business review",
    milestone: "Monthly business review in 3 days",
    score: 76,
    previousScore: 61,
    delta: "+15",
    pattern: "Context before main point",
    nextPractice: "Q&A answer-first drill",
    resource: "Q3 roadmap rehearsal.mp4",
    resourceType: "Video",
    currentFocus: "Transitions + Q&A",
    color: "text-teal",
    bg: "bg-teal/10",
    border: "hover:border-teal",
    icon: "Presentation",
    resourcesCount: "1 deck, 2 videos, 1 audio"
  },
  {
    id: "meeting-clarity",
    name: "Product Meeting Clarity",
    displayName: "Product Meeting Clarity",
    goal: "Sound decisive in sprint prioritization",
    scenario: "Product sync",
    milestone: "Next sprint planning",
    score: 84,
    previousScore: 62,
    delta: "+22",
    pattern: "Softened recommendations",
    nextPractice: "Recommendation-first roleplay",
    resource: "Payment incident sync.wav",
    resourceType: "Audio",
    currentFocus: "Recommendation-first structure",
    color: "text-rust",
    bg: "bg-rust/10",
    border: "hover:border-rust",
    icon: "Mic",
    resourcesCount: "3 recordings"
  },
  {
    id: "client-qa-confidence",
    name: "Client Q&A Confidence",
    displayName: "Client Q&A Confidence",
    goal: "Answer objections with structure and calm",
    scenario: "Client update",
    milestone: "Draft",
    score: 68,
    previousScore: 63,
    delta: "+5",
    pattern: "Vague risk framing",
    nextPractice: "Tradeoff answer practice",
    resource: "Client follow-up transcript",
    resourceType: "Transcript",
    currentFocus: "Risk and timeline language",
    color: "text-amber",
    bg: "bg-amber/10",
    border: "hover:border-amber",
    icon: "FileText",
    resourcesCount: "1 transcript"
  }
];

export const recentResources = [
  {
    id: "q3-roadmap-rehearsal",
    title: "Q3 roadmap rehearsal.mp4",
    type: "Presentation video",
    project: "Presentation Confidence",
    status: "Analyzed",
    insight: "Opening spends 42 seconds before the recommendation",
    icon: "Video",
    badge: "bg-teal/10 text-teal"
  },
  {
    id: "mbr-deck",
    title: "MBR deck.pdf",
    type: "Slide deck",
    project: "Presentation Confidence",
    status: "Used",
    insight: "Detected 5 presentation sections",
    icon: "FileText",
    badge: "bg-rust/10 text-rust"
  },
  {
    id: "payment-incident-sync",
    title: "Payment incident sync.wav",
    type: "Meeting audio",
    project: "Product Meeting Clarity",
    status: "Analyzed",
    insight: "Recommendation became clear after practice",
    icon: "Mic",
    badge: "bg-moss/10 text-moss"
  }
];

export const presentationProject = projects[0];

export const skillBreakdown = [
  { id: "opening", label: "Opening clarity", value: 78, delta: "+13" },
  { id: "structure", label: "Structure", value: 72, delta: "+9" },
  { id: "transitions", label: "Transitions", value: 61, delta: "+13" },
  { id: "fillers", label: "Filler control", value: 66, delta: "+14" },
  { id: "qa", label: "Q&A confidence", value: 70, delta: "+15" },
  { id: "tone", label: "Professional tone", value: 82, delta: "+6" }
];

export const projectResources = [
  {
    title: "MBR deck.pdf",
    type: "Slides",
    status: "Used",
    insight: "Detected 5 sections"
  },
  {
    title: "Practice run 1.mp4",
    type: "Video",
    status: "Analyzed",
    insight: "Fillers increased after slide 4"
  },
  {
    title: "Q&A rehearsal.m4a",
    type: "Audio",
    status: "Analyzed",
    insight: "Answers were accurate but too long"
  },
  {
    title: "Speaker notes.docx",
    type: "Notes",
    status: "Uploaded",
    insight: "Key claims extracted"
  }
];

export const videoMarkers = [
  { time: "0:12", label: "Opening" },
  { time: "1:05", label: "Transition unclear" },
  { time: "2:18", label: "Filler cluster" },
  { time: "3:40", label: "Strong explanation" },
  { time: "4:10", label: "Q&A answer too long" }
];

export const transcript = [
  {
    speaker: "Rina",
    text: "So basically today I want to talk about the user impact and after that maybe we can discuss the recommendation."
  },
  {
    speaker: "Rina",
    text: "The payment issue is quite urgent because yesterday many users complained and checkout was blocked."
  },
  {
    speaker: "Manager",
    text: "Should we fix payments first, or improve onboarding first?"
  },
  {
    speaker: "Rina",
    text: "I think payment is important because if cannot pay then maybe users cannot use properly, so we should check with backend."
  }
];

export const loadingSteps = [
  "Reading project goal: Presentation Confidence",
  "Reviewing uploaded presentation video",
  "Mapping speech to opening, sections, transitions, and Q&A",
  "Checking clarity, delivery, filler control, and Q&A structure",
  "Comparing with Rina's past presentation patterns",
  "Creating personalized drills from exact moments",
  "Updating project memory"
];

export const reportInsights = [
  {
    id: "transition",
    title: "Transition needs clearer signposting",
    original: "So basically, after this, I want to talk about the result...",
    better: "Now that we've covered the problem, I'll walk through the business impact.",
    why: "This helps the audience follow your structure and makes you sound more prepared.",
    note: "Echo noticed transition fillers in 2 of your 3 presentation rehearsals.",
    rule: "Pause -> signpost -> continue"
  },
  {
    id: "fillers",
    title: "Fillers cluster after slide changes",
    original: "um... actually... so basically...",
    better: "Pause for one second, then start the next section with a prepared transition.",
    why: "Your prepared content is strong; the pause makes the transition sound intentional.",
    note: "This pattern appears mainly when you move from metrics into recommendation.",
    rule: "Silent pause beats filler"
  },
  {
    id: "qa",
    title: "Q&A answers are accurate but too long",
    original: "Answer takes 58 seconds before reaching the recommendation.",
    better: "Direct answer -> one reason -> next step.",
    why: "Leadership questions need the conclusion early so they can evaluate the tradeoff quickly.",
    note: "Your Q&A score improves when you use answer -> reason -> next step.",
    rule: "Answer first, then explain"
  }
];

export const videoFeedback = [
  { label: "Eye contact", value: "Mostly steady during prepared sections" },
  { label: "Pace", value: "Slightly fast during Q&A" },
  { label: "Pauses", value: "Needs more space after section transitions" },
  { label: "Slide interaction", value: "Turns away after slide changes" },
  { label: "Confidence moment", value: "Strongest during metrics explanation" }
];

export const drillQueue = [
  {
    id: "qa-answer-first",
    title: "Q&A answer-first",
    reason: "Your answers are accurate, but in the last video you took almost a minute to reach the recommendation.",
    prompt: "Your manager asks: Should we fix payments first, or improve onboarding first?",
    structure: "Direct answer -> reason -> next step",
    targetTime: "30 seconds"
  },
  {
    id: "transition-signposting",
    title: "Transition signposting",
    reason: "Fillers cluster right after slide changes.",
    prompt: "Move from problem slide to impact slide without using 'so basically'.",
    structure: "Pause -> signpost -> continue",
    targetTime: "10 seconds"
  },
  {
    id: "opening-hook",
    title: "Opening hook",
    reason: "Your opening is clear, but the recommendation arrives late.",
    prompt: "Open the presentation with the key decision leaders need to make.",
    structure: "Decision -> impact -> agenda",
    targetTime: "20 seconds"
  }
];

export const liveConversation = {
  title: "Live stakeholder roleplay",
  setup:
    "Echo plays a senior stakeholder and keeps the practice moving like a live conversation. Your microphone records the full session for replay.",
  firstModelPrompt:
    "Let's practice the Q&A moment. Why should we prioritize payment fixes before onboarding improvements?",
  turns: [
    {
      userTranscript:
        "I recommend prioritizing payment fixes first because they directly block checkout. Onboarding improvements matter, but payment failures stop revenue immediately.",
      modelResponse:
        "Good. Now make it sharper for leadership: give me the direct answer, one business reason, and one next step."
    },
    {
      userTranscript:
        "The direct answer is payment fixes first. The business reason is that failed checkout blocks conversion today. My next step is to confirm backend capacity and share the revised timeline by 3 PM.",
      modelResponse:
        "That is much clearer. Final challenge: answer with more confidence and remove softeners like maybe or I think."
    },
    {
      userTranscript:
        "We should prioritize payment fixes first because failed checkout blocks revenue now. I will confirm backend capacity today and send the revised plan by 3 PM.",
      modelResponse:
        "Strong. Echo would save this pattern: answer first, business reason second, next step third."
    }
  ]
};

export const rescore = {
  before: 62,
  after: 84,
  title: "Better. Your answer is now more concise and confident.",
  improved: [
    "You answered the question directly.",
    "You gave one clear reason.",
    "You avoided 'maybe' and 'I think'.",
    "Your answer stayed under 30 seconds."
  ],
  stillImprove: [
    "Add one specific next step.",
    "Pause before answering instead of using a filler."
  ],
  suggested:
    "We should fix payments first because users cannot complete checkout. I'll check with the team today and share the next step this afternoon.",
  memoryUpdate:
    "Added to Presentation Confidence memory: Rina performs better in Q&A when she uses direct answer -> reason -> next step."
};

export const memory = {
  modelPercent: 42,
  global: [
    "Native language: Bahasa Indonesia",
    "Target language: Workplace English",
    "Role: Product Manager",
    "Feedback style: Direct but encouraging",
    "Strongest area: Explaining context",
    "Growth area: Concise, confident answers"
  ],
  project: [
    "Rina explains metrics clearly when prepared.",
    "Rina uses fillers during transitions.",
    "Rina's Q&A answers improve when limited to 30 seconds.",
    "Best structure: answer -> reason -> next step.",
    "Current focus: transition signposting."
  ],
  items: [
    "Rina often has the right recommendation but softens it before stating it.",
    "In presentations, she gives useful context before the executive takeaway.",
    "Her best drill format is short roleplay followed by a stronger reusable phrase."
  ],
  updates: [
    "Added after Practice Video 2: fillers increase during slide transitions.",
    "Updated after Q&A drill: answer-first structure improved clarity.",
    "Saved phrase: Now that we've covered the problem..."
  ],
  phraseBank: ["I recommend...", "The tradeoff is...", "My proposal is...", "The risk is..."]
};

export const progress = {
  readiness: { first: 61, now: 74 },
  trends: skillBreakdown.map((skill, index) => ({
    ...skill,
    first: [65, 63, 48, 52, 55, 76][index],
    status: skill.value >= 78 ? "Strong" : skill.value >= 66 ? "Improving" : "Needs focus"
  })),
  patterns: [
    ["Filler words during transitions", "3 videos", "Improving slowly", "Practice pause + signpost"],
    ["Long Q&A answers", "2 videos", "Improving", "Use 30-second answer drill"],
    ["Weak closing summary", "1 video", "New", "Practice 1-sentence close"]
  ],
  timeline: [
    "Jun 1: Uploaded MBR deck",
    "Jun 2: Practice video analyzed",
    "Jun 3: Q&A audio rehearsal",
    "Jun 5: Presentation video retry"
  ]
};

export const phraseBank = [
  ["Opening", "Today, I'll walk through the user impact, the business risk, and my recommendation."],
  ["Transition", "Now that we've covered the problem, let's look at the data."],
  ["Recommendation", "I recommend we prioritize this because..."],
  ["Q&A", "The short answer is yes, because..."],
  ["Closing", "To summarize, the key decision is..."]
];

export const upgradedPhrases = [
  ["So basically after this...", "Next, I'll walk through..."],
  ["Maybe we can try...", "I recommend we prioritize..."],
  ["I think this one quite urgent", "This is time-sensitive because..."]
];

export const scores = {
  communicationModel: 42,
  projectReadiness: projects.map((project) => ({
    id: project.id,
    label: project.displayName,
    value: project.score,
    delta: project.delta
  }))
};

export const drills = {
  nextBest: {
    title: "Next best drill",
    context: "Presentation opening",
    description:
      "Start with the answer in one sentence, then add one simple reason and a next step.",
    cta: "Start Practice"
  }
};

export const demoData = {
  rinaProfile,
  projects,
  presentationProject,
  recentResources,
  projectResources,
  skillBreakdown,
  videoMarkers,
  transcript,
  loadingSteps,
  reportInsights,
  videoFeedback,
  drillQueue,
  liveConversation,
  rescore,
  memory,
  progress,
  phraseBank,
  upgradedPhrases,
  scores,
  drills
};
