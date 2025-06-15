// Game state management
let currentStep = 0;
let choiceHistory = [];
let storyData = {};

// Story structure and data
const storyFlow = {
    step1: {
        title: "Choose Your Route",
        text: `Alex stands at his front door, checking the time on his phone. He's 10 minutes behind schedule! He looks down the street and considers his options for getting to school.

The usual route takes 15 minutes but it's safe and familiar. The park shortcut could save 5 minutes, but Alex has never taken it before. The back streets are quiet but sometimes sketchy.

What should Alex do?`,
        choices: [
            { text: "Take the usual safe route - better to be a bit late than sorry", next: "step2a", key: "safe_route" },
            { text: "Take the shortcut through the park - time is running out!", next: "step2b", key: "park_shortcut" },
            { text: "Take the back streets - avoid the crowds and maybe make up time", next: "step2c", key: "back_streets" }
        ]
    },
    
    step2a: {
        title: "The Familiar Path",
        text: `Alex decides to stick with what he knows. As he walks along his usual route, he sees Mrs. Henderson from next door struggling with heavy grocery bags that have just split open, spilling apples and cans onto the sidewalk.

She looks frustrated and tired. Alex checks his phone - helping her would definitely make him late for school, but she clearly needs assistance.

What should Alex do?`,
        choices: [
            { text: "Stop and help Mrs. Henderson pick up her groceries", next: "step3a", key: "help_neighbor" },
            { text: "Call out 'Sorry, I'm late for school!' and keep walking quickly", next: "step3b", key: "ignore_neighbor" }
        ]
    },
    
    step2b: {
        title: "Into the Unknown",
        text: `Alex decides to risk the park shortcut. As he enters the park, he notices the path splits in three directions. There's no clear signage, and Alex realizes he should have paid more attention when his friends mentioned this route.

To the left, the path seems to go toward the playground area. Straight ahead looks like it goes through some woods. To the right, he can see it curves around what looks like a pond.

Alex hears some kids laughing from the playground direction - they might be able to give him directions, but it would mean going off his intended path.`,
        choices: [
            { text: "Go left toward the playground and ask the kids for directions", next: "step3c", key: "ask_directions" },
            { text: "Go straight through the woods - it looks like the most direct route", next: "step3d", key: "woods_path" },
            { text: "Take the right path around the pond - water usually means civilization", next: "step3e", key: "pond_path" }
        ]
    },
    
    step2c: {
        title: "The Quiet Streets",
        text: `Alex chooses the back streets, hoping to make up time. The narrow streets are indeed quieter, but as he walks, he notices some dark clouds gathering overhead. His weather app this morning had mentioned a chance of rain, but he didn't bring an umbrella.

As he turns a corner, he sees two older kids from his school picking on a younger student, taking his backpack and pushing him around. The younger kid looks scared and upset.

Alex could intervene, but those older kids are much bigger than him. He could also try to find a teacher or adult, but that would take time he doesn't have.`,
        choices: [
            { text: "Stand up to the bullies and tell them to stop", next: "step3f", key: "confront_bullies" },
            { text: "Quickly walk past and pretend not to see what's happening", next: "step3g", key: "ignore_bullying" },
            { text: "Find another route to school to avoid the situation entirely", next: "step3h", key: "avoid_situation" }
        ]
    },
    
    step3a: {
        title: "A Helping Hand",
        text: `Alex immediately drops his backpack and starts helping Mrs. Henderson collect her scattered groceries. She's so grateful and tells him about how kind his parents raised him to be.

"You know," she says, "my daughter is a teacher at your school. I'm going to tell her what a wonderful young man you are!" 

As Alex helps her carry the bags to her door, she insists on giving him a fresh apple for his lunch. Alex feels good about helping, even though he's now definitely going to be late.

When he finally arrives at school, he rushes to his classroom, expecting to get in trouble...`,
        isOutcome: true,
        outcomeId: 3,
        key: "helped_elder"
    },
    
    step3b: {
        title: "Rushed Past",
        text: `Alex shouts a quick apology to Mrs. Henderson and hurries past. He can hear her sighing behind him, and he feels a knot in his stomach. Part of him wants to turn back, but he's already committed to getting to school on time.

As he walks, he keeps thinking about how tired and frustrated she looked. He remembers how his parents always taught him to help others when they're in need.

When Alex reaches school right on time, he doesn't feel as good about it as he thought he would. Throughout the day, he can't shake the feeling that he made the wrong choice...`,
        isOutcome: true,
        outcomeId: 7,
        key: "ignored_need"
    },
    
    step3c: {
        title: "Friendly Directions",
        text: `Alex heads toward the playground where he sees three kids around his age playing on the swings. He approaches them politely and asks for directions to the school.

"Oh, you're going to Lincoln Elementary!" says a girl with curly hair. "I'm Sarah, and I go there too! You took the right path - if you follow us, we're heading there now."

It turns out Sarah just moved to the neighborhood and was exploring the park before school. Alex not only gets directions but makes a new friend who shares his interest in science fiction books.

They walk together, chatting about their favorite stories, and arrive at school with perfect timing.`,
        isOutcome: true,
        outcomeId: 2,
        key: "made_friend"
    },
    
    step3d: {
        title: "Lost in the Woods",
        text: `Alex heads straight into the wooded area, confident it's the most direct route. However, the path quickly becomes confusing with multiple small trails branching off in different directions.

After 10 minutes of walking, Alex realizes he has no idea where he is. The trees are thick, and he can't see any familiar landmarks. His phone shows he's going in circles, and he's now 20 minutes late for school.

Panic starts to set in as Alex realizes he might be truly lost. He finally finds his way out, but when he arrives at school, he's very late and very embarrassed...`,
        isOutcome: true,
        outcomeId: 6,
        key: "got_lost"
    },
    
    step3e: {
        title: "The Pond Discovery",
        text: `Alex chooses the path around the pond, and it turns out to be a beautiful route. As he walks, he notices something unusual - there's a small dam that seems to be blocked with debris, causing water to back up and flood part of the path.

Alex realizes this could cause problems for other people trying to use the park. He notices a park maintenance phone number on a nearby sign. He could call to report it, but that would make him late. Or he could try to clear some of the debris himself.

Looking closer, Alex sees it's mostly just branches and leaves - nothing too heavy for him to move.`,
        choices: [
            { text: "Take a few minutes to clear the debris and help fix the problem", outcomeId: 4, key: "solved_problem" },
            { text: "Call the park maintenance number to report it and keep walking", outcomeId: 2, key: "reported_issue" }
        ]
    },
    
    step3f: {
        title: "Standing Up",
        text: `Alex takes a deep breath and walks up to the bullies. "Hey, leave him alone!" he says, trying to keep his voice steady. "Give him back his backpack."

The older kids turn to look at Alex, surprised. One of them laughs. "What are you going to do about it, little guy?"

But Alex stands his ground. "It's not right to pick on someone smaller than you. How would you feel if someone did that to your little brother or sister?"

Other students start to gather, and the bullies realize they have an audience. Embarrassed, they drop the backpack and walk away muttering.

The younger student thanks Alex with tears in his eyes. Word spreads quickly about Alex's bravery...`,
        isOutcome: true,
        outcomeId: 5,
        key: "stood_up"
    },
    
    step3g: {
        title: "Walking Away",
        text: `Alex decides it's not his problem and walks quickly past the bullying situation. He tries to convince himself that getting to school on time is more important, but he can't shake the image of the scared younger kid.

Throughout the day, Alex keeps thinking about what he saw. He wonders if the kid is okay, if the bullying continued, and what he could have done differently.

Later, Alex learns that the situation escalated after he left, and the younger student had to go to the nurse's office. Alex feels terrible about his choice...`,
        isOutcome: true,
        outcomeId: 9,
        key: "avoided_conflict"
    },
    
    step3h: {
        title: "The Detour",
        text: `Alex decides to avoid the confrontation entirely and takes a different route. However, this detour leads him down an unfamiliar street just as the dark clouds he noticed earlier start to release their rain.

What starts as a light drizzle quickly becomes a heavy downpour. Alex realizes he forgot to check the weather properly this morning and has no umbrella or rain jacket.

By the time he reaches school, Alex is completely soaked, cold, and miserable. His homework in his backpack is wet, and he has to spend the first part of the day in the nurse's office getting dry clothes...`,
        isOutcome: true,
        outcomeId: 8,
        key: "got_soaked"
    }
};

// Outcome definitions
const outcomes = {
    1: {
        id: 1,
        title: "Hero's Welcome",
        type: "positive",
        description: `Alex arrives at school to discover some wonderful news! Not only does his teacher praise him for the kindness he showed, but he also finds out he got an A+ on his math test from yesterday.

The teacher announces to the class how proud she is of students who show compassion and helpfulness in their community. Alex's act of kindness has set a positive example for everyone.

"Sometimes being a few minutes late is worth it when you're doing the right thing," his teacher says with a smile.`
    },
    2: {
        id: 2,
        title: "Perfect Timing",
        type: "positive",
        description: `Alex's thoughtful choices led him to arrive at school at exactly the right time. Better yet, he made a new friend along the way who shares his interests!

Sarah introduces Alex to her other friends, and he finds himself part of a group that loves science fiction and solving puzzles just like he does. Sometimes taking a chance on something new leads to the best outcomes.

Alex learns that being open to new experiences and treating others kindly often brings unexpected rewards.`
    },
    3: {
        id: 3,
        title: "Acts of Kindness",
        type: "positive",
        description: `When Alex arrives at school, Mrs. Henderson's daughter - who turns out to be the school counselor - is waiting for him with a big smile.

"My mother called to tell me about the wonderful young man who helped her this morning," she says. "She wanted to make sure your teacher knew what a kind and helpful person you are."

Alex receives recognition at the morning assembly for showing community spirit and helping those in need. His simple act of kindness rippled outward in ways he never expected.`
    },
    4: {
        id: 4,
        title: "Problem Solver",
        type: "positive",
        description: `Alex's decision to fix the blocked dam catches the attention of a park ranger who happened to be nearby. The ranger is impressed by Alex's initiative and problem-solving skills.

"You know," the ranger says, "we have a youth environmental program that could use someone with your kind of thinking."

At school, Alex shares his morning adventure, and his teacher is so impressed that she asks him to present to the class about environmental stewardship. Alex's creative problem-solving has opened up new opportunities!`
    },
    5: {
        id: 5,
        title: "Team Player",
        type: "positive",
        description: `Alex's brave stand against the bullies spreads throughout the school. Other students come up to him throughout the day to thank him for his courage.

The younger student he helped introduces Alex to his friends, and even some of the older kids nod approvingly when they see him in the hallways.

Alex learns that sometimes doing the right thing, even when it's scary, earns you the respect of others and helps create a better environment for everyone. His teacher commends him for showing true leadership.`
    },
    6: {
        id: 6,
        title: "Late and Lost",
        type: "negative",
        description: `Alex arrives at school 25 minutes late, looking flustered and embarrassed. He has to go to the office to get a late slip, and his teacher asks him to stay after class to discuss his tardiness.

"I understand you wanted to try a new route," his teacher says kindly, "but sometimes it's better to stick with what you know when you're already running late. Planning ahead and making safe choices is important."

Alex realizes that his impulsive decision to take an unfamiliar shortcut caused more problems than it solved. Next time, he'll either leave earlier or stick to the route he knows.`
    },
    7: {
        id: 7,
        title: "Missed Opportunity",
        type: "negative",
        description: `Throughout the school day, Alex can't stop thinking about Mrs. Henderson struggling with her groceries. During lunch, he sees her daughter, the school counselor, and learns that Mrs. Henderson had to call a neighbor for help.

"She mentioned a young man from the neighborhood hurried past," the counselor says sadly. "She was hoping someone might stop to help."

Alex feels a heavy weight in his stomach. He realizes that sometimes being a good person is more important than being on time, and he missed a chance to make someone's day better.`
    },
    8: {
        id: 8,
        title: "Wet and Miserable",
        type: "negative",
        description: `Alex spends the first hour of school in uncomfortable, damp clothes waiting for his parents to bring dry ones. His homework is soggy and barely readable, and he has to ask his teacher for extensions on two assignments.

"This is why we always check the weather forecast," the nurse says kindly as she gives him a towel. "And why we keep backup plans for getting to school."

Alex learns that sometimes avoiding one problem (the bullying situation) can lead to an even bigger problem (getting caught in the rain unprepared). Better planning and weather awareness would have helped.`
    },
    9: {
        id: 9,
        title: "Confrontation Consequences",
        type: "negative",
        description: `Alex's choice to walk away from the bullying situation weighs heavily on him all day. When he learns that the younger student was hurt and had to visit the nurse, Alex feels terrible about not helping.

During lunch, several classmates talk about what happened, and Alex realizes that his inaction made him part of the problem. The younger student looks sad and alone, and Alex wishes he had made a different choice.

"Sometimes doing nothing is the same as doing the wrong thing," Alex thinks to himself. He promises to be braver next time someone needs help.`
    },
    10: {
        id: 10,
        title: "Forgotten and Frustrated",
        type: "negative",
        description: `Just as Alex sits down in his first class, he realizes with horror that he forgot his science project at home! It was due today and worth 20% of his grade.

His teacher is understanding but explains that late projects receive reduced grades. Alex has to call his parents to bring the project, causing disruption and embarrassment.

"This is what happens when we rush around in the morning," his teacher says gently. "Organization and preparation the night before can prevent these stressful situations." Alex learns the importance of being prepared and managing his time better.`
    }
};

// Initialize the game
function initializeGame() {
    storyData = {
        currentStep: 'step1',
        choices: [],
        pathTaken: []
    };
    currentStep = 1;
    choiceHistory = [];
}

// Start the adventure
function startAdventure() {
    initializeGame();
    showScreen('story-screen');
    displayStory('step1');
    updateProgressDots(1);
}

// Display story content
function displayStory(stepKey) {
    const step = storyFlow[stepKey];
    if (!step) return;

    const storyText = document.getElementById('story-text');
    const choiceButtons = document.getElementById('choice-buttons');

    storyText.innerHTML = `
        <h2>${step.title}</h2>
        <p>${step.text.replace(/\n\n/g, '</p><p>')}</p>
    `;

    choiceButtons.innerHTML = '';

    // Check if this is an outcome step
    if (step.isOutcome) {
        // Add a continue button for outcome steps
        const button = document.createElement('button');
        button.className = 'btn btn--primary btn--lg';
        button.textContent = 'See Your Outcome';
        button.onclick = () => showOutcome(step.outcomeId);
        choiceButtons.appendChild(button);
        return;
    }

    // Regular choice buttons
    step.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.text;
        
        if (choice.outcomeId) {
            // Direct to outcome
            button.onclick = () => makeOutcomeChoice(choice);
        } else {
            // Continue story
            button.onclick = () => makeChoice(choice, stepKey);
        }
        
        choiceButtons.appendChild(button);
    });
}

// Handle regular choice selection
function makeChoice(choice, currentStepKey) {
    // Add visual feedback
    event.target.classList.add('selected');
    
    // Record the choice
    choiceHistory.push({
        step: currentStepKey,
        choice: choice.text,
        key: choice.key
    });

    setTimeout(() => {
        currentStep++;
        updateProgressDots(currentStep);
        displayStory(choice.next);
    }, 500);
}

// Handle outcome choice selection
function makeOutcomeChoice(choice) {
    // Add visual feedback
    event.target.classList.add('selected');
    
    // Record the choice
    choiceHistory.push({
        step: 'final_choice',
        choice: choice.text,
        key: choice.key
    });

    setTimeout(() => {
        showOutcome(choice.outcomeId);
    }, 500);
}

// Show final outcome
function showOutcome(outcomeId) {
    const outcome = outcomes[outcomeId];
    if (!outcome) {
        console.error('Outcome not found:', outcomeId);
        return;
    }

    showScreen('outcome-screen');
    updateProgressDots(4);
    
    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeType = document.getElementById('outcome-type');
    const outcomeBadge = document.getElementById('outcome-badge');
    const outcomeText = document.getElementById('outcome-text');
    const pathSteps = document.getElementById('path-steps');

    outcomeTitle.textContent = outcome.title;
    outcomeType.textContent = outcome.type === 'positive' ? 'Great Outcome!' : 'Learning Experience';
    outcomeBadge.className = `outcome-badge ${outcome.type}`;
    
    outcomeText.innerHTML = `<p>${outcome.description}</p>`;

    // Display path summary
    pathSteps.innerHTML = '';
    choiceHistory.forEach((choice, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'path-step';
        stepDiv.innerHTML = `
            <span class="step-number">${index + 1}</span>
            <span class="step-text">${choice.choice}</span>
        `;
        pathSteps.appendChild(stepDiv);
    });
}

// Update progress dots
function updateProgressDots(step) {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            dot.classList.toggle('active', i <= step);
        }
    }
}

// Show specific screen
function showScreen(screenId) {
    document.querySelectorAll('.story-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Restart the adventure
function restartAdventure() {
    showScreen('welcome-screen');
    initializeGame();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});