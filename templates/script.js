// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const quizView = document.getElementById('quiz-view');
    const resultsView = document.getElementById('results-view');
    const quizContent = document.getElementById('quiz-content');
    const sectionTitle = document.getElementById('section-title');
    const questionCounter = document.getElementById('question-counter');
    const progressBar = document.getElementById('progress-bar-foreground');
    const careerResult = document.getElementById('career-result');
    const confidenceResult = document.getElementById('confidence-result');
    const restartBtn = document.getElementById('restart-btn');

    // --- Quiz Data and State ---
    const userAnswers = {};
    let currentQuestionIndex = 0;

    // The entire questionnaire, structured for the gamified UI
    const quizData = [
        // Section 1: Technical Interests
        {
            section: "Technical Interests",
            id: 'interest_programming',
            type: 'slider',
            text: 'How interested are you in Programming & Algorithmic Logic?'
        },
        {
            section: "Technical Interests",
            id: 'interest_data_analysis',
            type: 'slider',
            text: 'How interested are you in Data Analysis & Statistics?'
        },
        {
            section: "Technical Interests",
            id: 'interest_system_architecture',
            type: 'slider',
            text: 'How interested are you in System Architecture & Design?'
        },
        {
            section: "Technical Interests",
            id: 'interest_hardware',
            type: 'slider',
            text: 'How interested are you in Hardware & Physical Systems?'
        },
        {
            section: "Technical Interests",
            id: 'interest_visual_design',
            type: 'slider',
            text: 'How interested are you in Visual Design & User Experience?'
        },
        // Section 2: Work Style
        {
            section: "Work Style",
            id: 'workstyle_focus',
            type: 'radio',
            text: 'Do you prefer focusing on deep, specific tasks or big-picture strategy?',
            options: [
                { text: 'Mostly deep, specific tasks', value: 1 },
                { text: 'A healthy mix of both', value: 3 },
                { text: 'Mostly big-picture strategy', value: 5 }
            ]
        },
        {
            section: "Work Style",
            id: 'workstyle_collaboration',
            type: 'radio',
            text: 'Do you work best alone or in a team?',
            options: [
                { text: 'I work best completely alone', value: 1 },
                { text: 'I like a mix of solo and team work', value: 3 },
                { text: 'I thrive in constant team collaboration', value: 5 }
            ]
        },
        {
            section: "Work Style",
            id: 'workstyle_pace',
            type: 'radio',
            text: 'What work pace do you prefer?',
            options: [
                { text: 'A stable, predictable environment', value: 1 },
                { text: 'A mix of stability and new challenges', value: 3 },
                { text: 'A fast-paced, dynamic environment', value: 5 }
            ]
        },
        {
            section: "Work Style",
            id: 'workstyle_problem_type',
            type: 'radio',
            text: 'What kind of problems do you prefer to solve?',
            options: [
                { text: 'Abstract, theoretical problems', value: 1 },
                { text: 'A mix of both', value: 3 },
                { text: 'Concrete, tangible products', value: 5 }
            ]
        },
        // Section 3: Self-Assessed Skills
        {
            section: "Self-Assessed Skills",
            id: 'skill_abstract_problem_solving',
            type: 'slider',
            text: 'Rate your confidence in Abstract Problem Solving (puzzles, logic).'
        },
        {
            section: "Self-Assessed Skills",
            id: 'skill_math_quantitative',
            type: 'slider',
            text: 'Rate your confidence in Mathematical & Quantitative Reasoning.'
        },
        {
            section: "Self-Assessed Skills",
            id: 'skill_communication_storytelling',
            type: 'slider',
            text: 'Rate your confidence in Communication & Storytelling.'
        },
        {
            section: "Self-Assessed Skills",
            id: 'skill_visual_design',
            type: 'slider',
            text: 'Rate your confidence in your sense for Visual Design & Aesthetics.'
        },
        {
            section: "Self-Assessed Skills",
            id: 'skill_leadership',
            type: 'slider',
            text: 'Rate your confidence in Leadership & People Management.'
        },
        // Section 4: Motivators & Preferences
        {
            section: "Motivators & Preferences",
            id: 'motivator_primary_driver',
            type: 'radio',
            text: 'What is your single biggest motivator at work?',
            options: [
                { text: 'Solving complex technical challenges', value: 1 },
                { text: 'Creating products that people love', value: 2 },
                { text: 'Leading teams and achieving business goals', value: 3 },
                { text: 'Achieving high financial rewards', value: 4 },
                { text: 'Having creative freedom', value: 5 },
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'motivator_risk_tolerance',
            type: 'radio',
            text: 'What\'s your risk tolerance?',
            options: [
                { text: 'Very risk-averse, prefer security', value: 1 },
                { text: 'Cautiously optimistic', value: 3 },
                { text: 'High risk-taker, enjoy uncertainty', value: 5 }
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'pref_learning_style',
            type: 'radio',
            text: 'How do you prefer to learn a new, complex technology?',
            options: [
                { text: 'By reading official documentation and theory', value: 1 },
                { text: 'By watching tutorials and guided projects', value: 2 },
                { text: 'By immediately experimenting and breaking things', value: 3 },
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'pref_project_type',
            type: 'radio',
            text: 'Do you prefer building new things or optimizing existing ones?',
            options: [
                { text: 'Build brand new things from scratch', value: 1 },
                { text: 'A mix of both', value: 3 },
                { text: 'Improve and optimize existing systems', value: 5 }
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'pref_core_focus',
            type: 'radio',
            text: 'Are you more driven by the \'Why\' (Theory) or the \'How\' (Application)?',
            options: [
                { text: 'Theory (Understanding why it works)', value: 1 },
                { text: 'A balance of both', value: 3 },
                { text: 'Application (Just making it work)', value: 5 }
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'pref_user_proximity',
            type: 'radio',
            text: 'How important is direct user interaction for you?',
            options: [
                { text: 'Not important, I prefer to focus on the tech', value: 1 },
                { text: 'It\'s nice to have', value: 3 },
                { text: 'Extremely important, I want to understand user needs', value: 5 }
            ]
        },
        {
            section: "Motivators & Preferences",
            id: 'pref_patience_for_impact',
            type: 'radio',
            text: 'Do you prefer long-term projects or seeing results quickly?',
            options: [
                { text: 'Long-term projects with delayed impact', value: 1 },
                { text: 'A mix of short and long-term goals', value: 3 },
                { text: 'Short-term projects with quick results', value: 5 }
            ]
        },
    ];

    const totalQuestions = quizData.length;

    // --- Core Functions ---

    function displayQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            showResults();
            return;
        }

        const question = quizData[currentQuestionIndex];
        let optionsHTML = '';

        if (question.type === 'slider') {
            optionsHTML = `
                <div class="slider-container">
                    <input type="range" id="${question.id}" min="1" max="5" value="3" class="option-slider">
                    <div class="slider-value">3</div>
                </div>
            `;
        } else if (question.type === 'radio') {
            optionsHTML = '<div class="options-container">';
            question.options.forEach(option => {
                optionsHTML += `<button class="option-btn" data-value="${option.value}">${option.text}</button>`;
            });
            optionsHTML += '</div>';
        }

        quizContent.innerHTML = `
            <div class="question-card" id="current-question-card">
                <p class="question-text">${question.text}</p>
                ${optionsHTML}
            </div>
        `;

        updateProgress();
        addEventListenersToOptions();
    }

    function addEventListenersToOptions() {
        const question = quizData[currentQuestionIndex];
        if (question.type === 'slider') {
            const slider = document.querySelector('.option-slider');
            const sliderValue = document.querySelector('.slider-value');
            slider.addEventListener('input', () => {
                sliderValue.textContent = slider.value;
            });
            // Sliders need a 'next' button or auto-advance on release
            slider.addEventListener('change', () => {
                 handleAnswer(parseInt(slider.value));
            });
        } else if (question.type === 'radio') {
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Visually select the button
                    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    // Handle the answer
                    handleAnswer(parseInt(e.currentTarget.dataset.value));
                });
            });
        }
    }

    function handleAnswer(value) {
        const questionId = quizData[currentQuestionIndex].id;
        userAnswers[questionId] = value;
        
        // Animate out the current question then show the next one
        const card = document.getElementById('current-question-card');
        card.classList.add('fade-out');
        
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 300); // Match animation duration in CSS
    }

    function updateProgress() {
        const question = quizData[currentQuestionIndex];
        const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;
        
        sectionTitle.textContent = question.section;
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        progressBar.style.width = `${progressPercent}%`;

        // Change background color based on section
        const sectionColors = {
            "Technical Interests": "#e3f2fd",
            "Work Style": "#e8eaf6",
            "Self-Assessed Skills": "#e0f2f1",
            "Motivators & Preferences": "#f3e5f5"
        };
        document.body.style.backgroundColor = sectionColors[question.section] || '#f0f2f5';
    }

    async function showResults() {
        sectionTitle.textContent = "Analysis Complete!";
        questionCounter.textContent = "";
        progressBar.style.width = '100%';

        // Animate view transition
        quizView.classList.remove('active');
        resultsView.classList.add('active');

        careerResult.textContent = 'Analyzing your profile...';
        confidenceResult.textContent = '';
        
        try {
            // --- Send data to the Flask API ---
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userAnswers)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            
            careerResult.textContent = result.career;
            confidenceResult.textContent = `Confidence: ${result.confidence.toFixed(2)}%`;

        } catch (error) {
            console.error("Error fetching prediction:", error);
            careerResult.textContent = 'Prediction Failed';
            confidenceResult.textContent = 'Could not get a result. Please try again.';
        }
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        Object.keys(userAnswers).forEach(key => delete userAnswers[key]);
        
        resultsView.classList.remove('active');
        quizView.classList.add('active');
        
        // Delay to allow view transition before showing first question
        setTimeout(displayQuestion, 500);
    }

    // --- Event Listeners ---
    restartBtn.addEventListener('click', restartQuiz);

    // --- Initial Load ---
    displayQuestion();
});
