export const AVATARS = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Senior Software Architect & English Mentor',
    company: 'Infosys / Global Tech',
    accent: 'Indian English (Warm, Simple & Natural)',
    voiceCode: 'en-IN',
    image: '/avatars/priya.jpg',
    bgGradient: 'from-purple-900/60 to-indigo-900/60',
    description: 'Patient Indian Tech Leader & English Coach. Asks clear questions in simple Indian English. Perfect for building daily speaking confidence!'
  },
  {
    id: 'david',
    name: 'David Kumar',
    title: 'Engineering Lead & Agile Coach',
    company: 'DevFlow Systems',
    accent: 'Indian English (Simple Workplace English)',
    voiceCode: 'en-IN',
    image: '/avatars/david.jpg',
    bgGradient: 'from-amber-900/60 to-orange-900/60',
    description: 'Supportive Indian Engineering Lead. Practice daily standups, blockers, and technical updates in natural conversational English.'
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    title: 'Senior HR Tech Recruiter',
    company: 'MetaTech Global',
    accent: 'US English',
    voiceCode: 'en-US',
    image: '/avatars/sarah.jpg',
    bgGradient: 'from-indigo-900/60 to-purple-900/60',
    description: 'Structured and encouraging recruiter. Helps you master behavioral interviews, salary talks, and clear STAR answers.'
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    title: 'Lead Cloud Architect',
    company: 'Apex Systems',
    accent: 'UK English',
    voiceCode: 'en-GB',
    image: '/avatars/alex.jpg',
    bgGradient: 'from-teal-900/60 to-slate-900/60',
    description: 'Detail-oriented architect. Probes system design trade-offs, client updates, and technical problem solving.'
  }
];

export const TOPICS = [
  // Beginner Level Topics (Indian Workplace & Daily English)
  {
    id: 'beginner_intro',
    category: 'Beginner Basics',
    title: 'First Day Team Self-Introduction',
    durationMinutes: 3,
    difficulty: 'Beginner',
    icon: 'UserCheck',
    color: 'emerald',
    defaultAvatarId: 'priya',
    promptContext: 'You are Priya, a warm Indian team lead welcoming a new team member. Ask them simple, clear questions in natural Indian English to introduce themselves.',
    initialGreetings: [
      "Namaste and welcome to our team! We are super excited to have you. Could you please introduce yourself and tell us what technologies you like working with?",
      "Hi there! Welcome aboard! Everyone is looking forward to working with you. Tell us a bit about your background and what you're hoping to focus on here.",
      "Hello! Great to meet you! Let's kick off with a quick intro — what's your main tech stack and how has your first morning been so far?",
      "Hey! Welcome to the squad! To help us get to know you better, could you share a bit about your experience and your hobbies outside work?"
    ],
    suggestedPhases: [
      "Hi Priya! My name is Rahul, and I am joining as a React & Node.js developer...",
      "I have been working with JavaScript and web development for the past 2 years...",
      "I am excited to learn best architecture practices and contribute to this project!"
    ],
    targetVocab: ['Tech stack', 'Collaborate', 'Onboarding', 'Background', 'Excited'],
    keyQuestions: [
      "Which programming language do you enjoy the most?",
      "How can our team support you during your first week?"
    ]
  },
  {
    id: 'asking_help',
    category: 'Beginner Basics',
    title: 'Asking Coworkers for Help & Debugging',
    durationMinutes: 3,
    difficulty: 'Beginner',
    icon: 'HelpCircle',
    color: 'cyan',
    defaultAvatarId: 'priya',
    promptContext: 'You are Priya, a senior colleague. The developer is stuck on a bug or API issue and needs assistance. Guide them to explain their problem clearly in simple English.',
    initialGreetings: [
      "Hey! I noticed you've been working on that login API bug. How is it coming along? Are you facing any issue or block?",
      "Hi! Checking in on your current ticket. Do you need any assistance or a second pair of eyes on your screen?",
      "Hey there! Don't hesitate to reach out if you're stuck. What specific error or issue are you running into right now?",
      "Hello! How are things going with your task? Is there any part where you'd like us to pair program for 5 minutes?"
    ],
    suggestedPhases: [
      "Hi Priya, yes! I am facing an issue with the API authentication token returning 401...",
      "I tried debugging for 30 minutes, but I'm not sure why the token expires so quickly...",
      "Could you please take a look at my screen share for 5 minutes?"
    ],
    targetVocab: ['Assistance', 'Debugging', 'Codebase', 'Screen share', 'Polite request'],
    keyQuestions: [
      "What steps did you try so far to fix it?",
      "Shall we jump on a quick 5-minute call?"
    ]
  },

  // Daily Life & Casual English
  {
    id: 'casual_coffee',
    category: 'Casual & Networking',
    title: 'Casual Small Talk & Coffee Break',
    durationMinutes: 3,
    difficulty: 'Beginner',
    icon: 'Coffee',
    color: 'indigo',
    defaultAvatarId: 'priya',
    promptContext: 'You are Priya, chatting at the office pantry or over virtual coffee. Practice friendly, natural Indian English conversation about weekend plans, food, and daily life.',
    initialGreetings: [
      "Hey! Taking a quick tea break? How is your week going so far? Any fun plans for the upcoming weekend?",
      "Hi there! Good to see you! How was your weekend? Did you do anything interesting or just relax at home?",
      "Hey! Grab a cup of coffee! What are you planning to do after work today?",
      "Hello! How is your day treating you so far? Are you working on anything exciting today?"
    ],
    suggestedPhases: [
      "Hey Priya! Busy week, but I finally fixed a tricky bug in our frontend code...",
      "This weekend I plan to visit a new cafe with friends and catch up on movies...",
      "I usually like to unwind by playing badminton or listening to music after work."
    ],
    targetVocab: ['Weekend plans', 'Catch up', 'Unwind', 'Relax', 'Work-life balance'],
    keyQuestions: [
      "How do you usually relax after a long day?",
      "Have you tried any good food places recently?"
    ]
  },
  {
    id: 'ordering_food',
    category: 'Casual & Networking',
    title: 'Ordering Food & Cafe Conversation',
    durationMinutes: 3,
    difficulty: 'Beginner',
    icon: 'Coffee',
    color: 'amber',
    defaultAvatarId: 'priya',
    promptContext: 'You are playing the role of a friendly cafe barista or waiter. Help the user practice ordering food, asking about menu options, and making polite requests in English.',
    initialGreetings: [
      "Welcome to Metro Cafe! What can I get started for you today?",
      "Good afternoon! Are you ready to order, or would you like a few more minutes with the menu?",
      "Hi there! Welcome! We have a special cold brew coffee and fresh sandwiches today. What would you like?",
      "Hey! Welcome in! What kind of drink or snack are you craving today?"
    ],
    suggestedPhases: [
      "Hi! Could I please get a hot cappuccino with less sugar?",
      "What vegetarian options do you have for lunch today?",
      "Could you please make it to-go? Also, do you accept UPI or card payment?"
    ],
    targetVocab: ['To-go', 'Recommendation', 'Customization', 'Receipt', 'Appetizer'],
    keyQuestions: [
      "Would you like that for dine-in or takeaway?",
      "Can I get you anything else with your order?"
    ]
  },

  // Daily Engineering & Agile Meetings
  {
    id: 'daily_standup',
    category: 'Daily Engineering',
    title: 'Daily Standup Update',
    durationMinutes: 3,
    difficulty: 'Intermediate',
    icon: 'Kanban',
    color: 'emerald',
    defaultAvatarId: 'david',
    promptContext: 'You are David, an Indian Dev Lead conducting a standup. Ask simple, natural Indian English questions about yesterday work, today plans, and blockers.',
    initialGreetings: [
      "Good morning team! Let's start today's standup. Please share what you finished yesterday, what you are planning today, and if you have any blocker.",
      "Morning everyone! Who wants to go first for today's updates? Give us a quick rundown of your progress and any dependencies.",
      "Hey team! Let me know where you're at with your current sprint tickets and if anything is holding up your deployment.",
      "Hi all! Let's do a fast standup sync. What did you get across the finish line yesterday and what's top priority today?"
    ],
    suggestedPhases: [
      "Yesterday I completed the backend API refactoring for user authentication...",
      "Today my main focus is writing unit tests and deploying to staging...",
      "I have one minor blocker with the database migration script failing in staging..."
    ],
    targetVocab: ['Impediment', 'PR review', 'Refactor', 'Staging deployment', 'API endpoint', 'Blocker'],
    keyQuestions: [
      "What main task did you complete yesterday?",
      "Are you facing any blocker from DevOps side?"
    ]
  },
  {
    id: 'pr_review',
    category: 'Daily Engineering',
    title: 'PR & Code Review Discussion',
    durationMinutes: 4,
    difficulty: 'Intermediate',
    icon: 'GitPullRequest',
    color: 'purple',
    defaultAvatarId: 'david',
    promptContext: 'You are David, senior reviewer. Discuss a Pull Request (PR) with the developer, asking about code logic, test coverage, and performance trade-offs.',
    initialGreetings: [
      "Hey! I just started reviewing your Pull Request for the payment gateway. Could you give me a high-level summary of the changes you made?",
      "Hi! I looked at your PR draft. Looks clean! What design approach did you take for error handling here?",
      "Hello! Thanks for submitting the PR. Before I merge, could you explain how you tested this with edge cases?",
      "Hey there! I saw your PR is ready for review. Could you walk me through the key files modified?"
    ],
    suggestedPhases: [
      "In this PR, I decoupled the payment handler and added retry logic for network timeouts...",
      "I wrote unit tests covering both success and failure scenarios with 90% coverage...",
      "I also optimized the SQL query to reduce execution time from 500ms to 50ms..."
    ],
    targetVocab: ['Pull Request', 'Code coverage', 'Decoupled', 'Refactor', 'Edge case'],
    keyQuestions: [
      "Did you add unit tests for the error boundary?",
      "Is there any breaking change for existing API consumers?"
    ]
  },
  {
    id: 'outage_call',
    category: 'Daily Engineering',
    title: 'Emergency Production Outage Call',
    durationMinutes: 4,
    difficulty: 'Advanced',
    icon: 'RotateCcw',
    color: 'rose',
    defaultAvatarId: 'david',
    promptContext: 'You are David, running a critical production incident war-room call. Practice clear, calm emergency communication in IT English.',
    initialGreetings: [
      "Team, we have a P1 alert! Production checkout service is failing with 500 errors. Who is looking at the live logs right now?",
      "Urgent update team! Users are reporting login delays on production. What is the current status of our database connection pool?",
      "War-room sync: The payment gateway is timing out. Can someone confirm if this is an internal bug or third-party service outage?",
      "Attention team! Production CPU usage spiked to 98%. What was the latest deployment in the last 1 hour?"
    ],
    suggestedPhases: [
      "I am checking the Datadog logs right now. It looks like a database connection pool leak...",
      "I recommend rolling back the last deployment to commit v2.4 immediately while we investigate...",
      "I will update the incident channel every 10 minutes until we restore normal service..."
    ],
    targetVocab: ['Incident', 'Rollback', 'P1 alert', 'Root cause', 'Mitigation', 'Latency'],
    keyQuestions: [
      "Should we initiate a rollback right now?",
      "Who is leading the root cause analysis?"
    ]
  },

  // Career, Hiring & Interviews
  {
    id: 'tech_interview',
    category: 'Career & Hiring',
    title: 'Technical System Design & Coding Interview',
    durationMinutes: 5,
    difficulty: 'Advanced',
    icon: 'Code2',
    color: 'indigo',
    defaultAvatarId: 'priya',
    promptContext: 'You are Priya, interviewing a candidate. Ask clear technical questions in simple Indian English about system architecture, databases, and trade-offs.',
    initialGreetings: [
      "Welcome to the technical interview round! To start off, please tell me about a complex architecture or project you designed recently.",
      "Hello and welcome! I'd love to hear about a challenging technical problem you solved. What was the project and how did you approach it?",
      "Hi! Glad to connect with you. Can you walk me through a system you built that had to handle high traffic or concurrency?",
      "Welcome! Today we'll discuss system design and coding practices. Tell me about your role in your most recent project."
    ],
    suggestedPhases: [
      "In my previous project, I designed a microservices backend using Node.js and PostgreSQL...",
      "To handle high traffic, we added Redis caching and Kafka message queues...",
      "When we faced database query delays, we added indexing and optimized execution plans..."
    ],
    targetVocab: ['Scalability', 'Bottleneck', 'Load balancing', 'Asynchronous', 'Trade-off'],
    keyQuestions: [
      "Why did you choose SQL over NoSQL for that data model?",
      "How did you test performance under high traffic load?"
    ]
  },
  {
    id: 'behavioral_interview',
    category: 'Career & Hiring',
    title: 'Behavioral HR Interview (STAR Method)',
    durationMinutes: 4,
    difficulty: 'Intermediate',
    icon: 'UserCheck',
    color: 'purple',
    defaultAvatarId: 'sarah',
    promptContext: 'You are Sarah, an HR Tech recruiter. Ask behavioral questions using the STAR method (Situation, Task, Action, Result). Guide candidate to answer clearly.',
    initialGreetings: [
      "Welcome to the interview! Let's talk about your workplace experience. Can you tell me about a time you faced a difficult deadline and how you handled it?",
      "Hi! Great to meet you. Tell me about a situation where you had a disagreement with a team member or manager and how you resolved it.",
      "Hello! Welcome! Can you share an example of a mistake or failed release you made in the past and what you learned from it?",
      "Hi there! To start our behavioral round, tell me about a project where you demonstrated strong leadership or initiative."
    ],
    suggestedPhases: [
      "The Situation was that our client moved the release deadline up by two weeks...",
      "My Task was to re-prioritize core MVP features while maintaining quality...",
      "My Action was to organize daily sub-task syncs and automate regression tests...",
      "As a Result, we delivered on time with zero critical production bugs!"
    ],
    targetVocab: ['Situation', 'Task', 'Action', 'Result', 'Conflict resolution', 'Initiative'],
    keyQuestions: [
      "What would you do differently if you faced that situation again?",
      "How did you keep the team motivated during that high-pressure sprint?"
    ]
  },
  {
    id: 'salary_negotiation',
    category: 'Career & Hiring',
    title: 'Salary & Job Offer Negotiation',
    durationMinutes: 4,
    difficulty: 'Advanced',
    icon: 'DollarSign',
    color: 'emerald',
    defaultAvatarId: 'sarah',
    promptContext: 'You are Sarah, HR lead extending an offer. Practice confident, professional salary and benefits negotiation in English.',
    initialGreetings: [
      "We are thrilled to extend an offer for the Senior Engineer role! We are offering an initial package of $95,000 / ₹18 LPA. How does that sound to you?",
      "Congratulations! The team loved your interview performance! We are excited to make you an offer. Do you have any questions regarding compensation?",
      "Hi! I'm calling with great news — we want to bring you on board! Let's discuss your compensation expectation and start date.",
      "Hello! We are preparing your official offer letter. What range of compensation were you targeting for this position?"
    ],
    suggestedPhases: [
      "Thank you so much! I am thrilled about this opportunity and working with the team...",
      "Based on my 5 years of specialized experience in cloud architecture, I was targeting a range closer to...",
      "Are you flexible on joining bonus or performance incentives to align with my market expectation?"
    ],
    targetVocab: ['Compensation', 'Base salary', 'Market benchmark', 'Joining bonus', 'Benefits package'],
    keyQuestions: [
      "What is your target compensation based on current market standards?",
      "Is your start date flexible if we finalize the offer today?"
    ]
  },

  // Client & Stakeholder Meetings
  {
    id: 'client_demo',
    category: 'Client & Stakeholders',
    title: 'Client Demo & Feature Presentation',
    durationMinutes: 4,
    difficulty: 'Intermediate',
    icon: 'Presentation',
    color: 'cyan',
    defaultAvatarId: 'alex',
    promptContext: 'You are Alex, representing a corporate client watching a product demo. Practice presenting software features, answering client questions confidently.',
    initialGreetings: [
      "Good afternoon! We are excited to see today's feature demo. Whenever you're ready, please share your screen and walk us through the new updates.",
      "Hello team! Thanks for organizing this demo. What key features will you be showing us in today's release preview?",
      "Hi there! Our client stakeholders are on the call. Please give us a quick overview of how this sprint delivery solves our workflow problem.",
      "Good day! We've been looking forward to this milestone demo. Please present the user dashboard walkthrough."
    ],
    suggestedPhases: [
      "Good afternoon everyone! Today I will demonstrate our new real-time analytics dashboard...",
      "As you can see on screen, users can now filter reports by date range and export to PDF in 1 click...",
      "We also optimized page load speed, reducing render time by 60%..."
    ],
    targetVocab: ['Milestone', 'Demonstrate', 'User experience', 'Feedback', 'Enhancement'],
    keyQuestions: [
      "How soon will this feature be accessible to end users?",
      "Can we customize the export template for our corporate branding?"
    ]
  }
];

// Utility helper to pick a dynamic random greeting for offline mode or initial state
export const getRandomGreeting = (topic) => {
  if (!topic) return "Hello! Ready to practice your English today?";
  if (topic.initialGreetings && topic.initialGreetings.length > 0) {
    const randomIndex = Math.floor(Math.random() * topic.initialGreetings.length);
    return topic.initialGreetings[randomIndex];
  }
  return topic.initialGreeting || `Hello! Ready to practice your ${topic.title}?`;
};
