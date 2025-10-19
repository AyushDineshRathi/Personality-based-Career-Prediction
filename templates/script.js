document.addEventListener('DOMContentLoaded', () => {
    const questions = {
        'Technical Interests': [
            { id: 'interest_programming', text: 'How interested are you in Programming & Algorithmic Logic?', type: 'slider', min: 1, max: 5 },
            { id: 'interest_data_analysis', text: 'How interested are you in Data Analysis & Statistics?', type: 'slider', min: 1, max: 5 },
            { id: 'interest_system_architecture', text: 'How interested are you in System Architecture & Design?', type: 'slider', min: 1, max: 5 },
            { id: 'interest_hardware', text: 'How interested are you in Hardware & Physical Systems (circuits, robotics, engines)?', type: 'slider', min: 1, max: 5 },
            { id: 'interest_visual_design', text: 'How interested are you in Visual Design & User Experience?', type: 'slider', min: 1, max: 5 }
        ],
        'Work Style': [
            { id: 'workstyle_focus', text: 'Do you prefer focusing on deep, specific tasks or big-picture strategy?', type: 'radio', options: { 1: 'Deep Tasks', 3: 'A Mix', 5: 'Big Picture' } },
            { id: 'workstyle_collaboration', text: 'Do you work best alone or in a team?', type: 'radio', options: { 1: 'Alone', 3: 'A Mix', 5: 'In a Team' } },
            { id: 'workstyle_pace', text: 'What work pace do you prefer?', type: 'radio', options: { 1: 'Stable & Predictable', 3: 'A Mix', 5: 'Fast-Paced & Dynamic' } },
            { id: 'workstyle_problem_type', text: 'What kind of problems do you prefer to solve?', type: 'radio', options: { 1: 'Abstract & Theoretical', 3: 'A Mix', 5: 'Concrete & Tangible' } }
        ],
        'Self-Assessed Skills': [
            { id: 'skill_abstract_problem_solving', text: 'Rate your confidence in Abstract Problem Solving (puzzles, logic).', type: 'slider', min: 1, max: 5 },
            { id: 'skill_math_quantitative', text: 'Rate your confidence in Mathematical & Quantitative Reasoning.', type: 'slider', min: 1, max: 5 },
            { id: 'skill_communication_storytelling', text: 'Rate your confidence in Communication & Storytelling (presenting, writing).', type: 'slider', min: 1, max: 5 },
            { id: 'skill_visual_design', text: 'Rate your confidence in your sense for Visual Design & Aesthetics.', type: 'slider', min: 1, max: 5 },
            { id: 'skill_leadership', text: 'Rate your confidence in Leadership & People Management.', type: 'slider', min: 1, max: 5 }
        ],
        'Motivators & Preferences': [
            { id: 'motivator_primary_driver', text: 'What is your single biggest motivator at work?', type: 'select', options: { 1: 'Solving technical challenges', 2: 'Creating products people love', 3: 'Leading teams & business goals', 4: 'High financial rewards', 5: 'Creative freedom' } },
            { id: 'motivator_risk_tolerance', text: 'What\'s your risk tolerance?', type: 'radio', options: { 1: 'Very Risk-Averse', 3: 'Cautiously Optimistic', 5: 'High Risk-Taker' } },
            { id: 'pref_learning_style', text: 'How do you prefer to learn a new, complex technology?', type: 'select', options: { 1: 'Reading Docs/Theory', 2: 'Watching Tutorials', 3: 'Experimenting' } },
            { id: 'pref_project_type', text: 'Do you prefer building new things or optimizing existing ones?', type: 'radio', options: { 1: 'Build From Scratch', 3: 'A Mix', 5: 'Optimize Existing Systems' } },
            { id: 'pref_core_focus', text: 'Are you more driven by the \'Why\' (Theory) or the \'How\' (Application)?', type: 'radio', options: { 1: 'The "Why" (Theory)', 3: 'A Balance', 5: 'The "How" (Application)' } },
            { id: 'pref_user_proximity', text: 'How important is direct user interaction for you?', type: 'radio', options: { 1: 'Not Important', 3: 'It\'s Nice to Have', 5: 'Extremely Important' } },
            { id: 'pref_patience_for_impact', text: 'Do you prefer long-term projects or seeing results quickly?', type: 'radio', options: { 1: 'Long-Term Impact', 3: 'A Mix', 5: 'Quick Results' } }
        ]
    };

    // Flatten the question groups into a single array for easier navigation
    const questionGroups = Object.keys(questions).map(groupName => {
        return questions[groupName].map(q => ({ ...q, group: groupName }));
    }).flat();

    let currentQuestionIndex = 0;
    const userAnswers = {};

    // Get all DOM elements
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const sectionTitle = document.getElementById('section-title');
    const questionContainer = document.getElementById('question-container');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const resultsContainer = document.getElementById('results-container');
    const restartButton = document.getElementById('restart-btn');

    function showQuestion(index) {
        const question = questionGroups[index];
        questionContainer.innerHTML = ''; // Clear previous question
        questionContainer.classList.remove('fade-in'); // Remove for re-animation
        
        // Use a slight delay to allow the fade-out/clear to register
        setTimeout(() => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question';

            let optionsHTML = '';
            if (question.type === 'slider') {
                optionsHTML = `<div class="slider-container"><input type="range" id="${question.id}" min="${question.min}" max="${question.max}" value="3" class="slider"><span class="slider-value">3</span></div>`;
            } else if (question.type === 'radio') {
                optionsHTML = '<div class="radio-options">';
                for (const [value, text] of Object.entries(question.options)) {
                    optionsHTML += `<button class="option-btn" data-value="${value}">${text}</button>`;
                }
                optionsHTML += '</div>';
            } else if (question.type === 'select') {
                 optionsHTML = `<div class="select-container"><select id="${question.id}">`;
                 // Add a default, non-selectable option
                 optionsHTML += `<option value="3" selected disabled>-- Select an option --</option>`;
                for (const [value, text] of Object.entries(question.options)) {
                    optionsHTML += `<option value="${value}">${text}</option>`;
                }
                optionsHTML += `</select></div>`;
            }

            questionElement.innerHTML = `
                <h2>${question.text}</h2>
                ${optionsHTML}
            `;
            questionContainer.appendChild(questionElement);
            questionContainer.classList.add('fade-in'); // Add animation class
            
            updateProgress(index);
            addEventListeners(question);
        }, 100); // 100ms delay
    }

    function addEventListeners(question) {
        if (question.type === 'slider') {
            const slider = document.getElementById(question.id);
            const sliderValue = slider.nextElementSibling;
            slider.addEventListener('input', () => sliderValue.textContent = slider.value);
            // Auto-advance on slider 'change' (when user releases mouse)
            slider.addEventListener('change', () => handleAnswer(question.id, slider.value));
        } else if (question.type === 'radio') {
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Visually select the button
                    buttons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                    // Handle the answer
                    handleAnswer(question.id, button.dataset.value, button.textContent);
                });
            });
        } else if (question.type === 'select') {
            const select = document.getElementById(question.id);
            select.addEventListener('change', () => handleAnswer(question.id, select.value, select.options[select.selectedIndex].text));
        }
    }

    function handleAnswer(id, value) {
        // Store the answer (as an integer)
        userAnswers[id] = parseInt(value);

        // Add a small delay for user to see their selection
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questionGroups.length) {
                showQuestion(currentQuestionIndex);
            } else {
                fetchResults();
            }
        }, 400); // 400ms delay for feedback
    }

    function updateProgress(index) {
        const progressPercentage = ((index + 1) / questionGroups.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${index + 1} of ${questionGroups.length}`;
        sectionTitle.textContent = questionGroups[index].group;
    }

    async function fetchResults() {
        // 1. Show loading state
        quizScreen.classList.add('fade-out');
        setTimeout(async () => {
            quizScreen.style.display = 'none';
            resultsScreen.style.display = 'flex';
            resultsContainer.innerHTML = '<h2>Analyzing your profile...</h2>'; // Loading text
            resultsScreen.classList.add('fade-in');
            
            try {
                // 2. Send data to backend
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers: userAnswers }) // Send the answers
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }
                
                // 3. Parse the successful JSON response
                const recommendations = await response.json();
                
                // 4. Display the results
                showResults(recommendations);

            } catch (error) {
                // 5. Show an error if anything failed
                console.error('Prediction failed:', error);
                showError(error);
            }
        }, 500); // Wait for fade-out animation
    }

    function showResults(recommendations) {
        // Check if the received data is an array
        if (!Array.isArray(recommendations)) {
            showError(new Error("The server returned data in an unexpected format."));
            return;
        }

        resultsContainer.innerHTML = '<h2>Your Top 5 Career Recommendations:</h2>';
        const resultList = document.createElement('div');
        resultList.className = 'result-list';

        recommendations.forEach((rec, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="rec-number">${index + 1}</span>
                    <span class="rec-career">${rec.career}</span>
                </div>
                <div class="confidence-display">
                    <div class="confidence-bar-container">
                        <div class="confidence-bar" style="width: ${rec.confidence.toFixed(2)}%;"></div>
                    </div>
                    <span class="confidence-text">${rec.confidence.toFixed(2)}% Match</span>
                </div>
            `;
            resultList.appendChild(resultItem);
        });
        resultsContainer.appendChild(resultList);
    }

    function showError(error) {
        resultsContainer.innerHTML = `
            <h2>Prediction Failed</h2>
            <p>Could not get a result. Please try again.</p>
            <p style="font-size: 0.8em; color: #777;">Error: ${error.message}</p>
        `;
    }

    restartButton.addEventListener('click', () => {
        // Reset state
        currentQuestionIndex = 0;
        Object.keys(userAnswers).forEach(key => delete userAnswers[key]);
        
        // Transition screens
        resultsScreen.classList.remove('fade-in');
        resultsScreen.style.display = 'none';
        quizScreen.classList.remove('fade-out');
        quizScreen.style.display = 'block';
        
        // Start the quiz over
        showQuestion(0);
    });

    // Start the quiz on page load
    showQuestion(0);
});