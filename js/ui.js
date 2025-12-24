import { elements } from './config.js';

// --- NEW FUNCTION ---
/**
 * Updates the timer display in the UI.
 * @param {string} timeString Formatted time (e.g., "01:30")
 */
export function updateTimerDisplay(timeString) {
    if (elements.quizTimer) {
        elements.quizTimer.textContent = timeString;
    }
}
// --- END NEW FUNCTION ---

export function showView(viewToShow) {
    ['loadingState', 'startState', 'quizView', 'scoreView', 'dashboardView'].forEach(view => {
        elements[view].classList.add('hidden');
    });
    if (elements[viewToShow]) {
        elements[viewToShow].classList.remove('hidden');
    }
}

export function displayQuestion(question, currentIndex, total) {
// --- NEW PROGRESS BAR LOGIC ---
    // (currentIndex + 1) because it's 0-based
    const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
    if (elements.progressBarInner) {
        elements.progressBarInner.style.width = `${progressPercent}%`;
    }
    // --- END NEW LOGIC ---
    
    console.log(question);

    elements.choicesContainer.innerHTML = '';
    elements.feedbackArea.classList.add('hidden');
    elements.submitBtn.classList.remove('hidden');
    elements.nextQuestionBtn.classList.add('hidden');
    elements.submitBtn.disabled = true;

    if (elements.questionIdDisplay) {
        elements.questionIdDisplay.textContent = `Question ID: ${question.questionId}`;
    }

    elements.questionCounter.textContent = `Question ${currentIndex + 1}/${total}`;
    elements.questionPrompt.textContent = question.prompt;
        
    if (question.context) {
            let contextHTML = question.context;
            const activeBlank = question.refersTo; 

            // Match all instances of {{BLANK_A}}, {{BLANK_B}}, etc.
            const blankRegex = /\{\{(BLANK_([A-Z]))\}\}/g;

            contextHTML = contextHTML.replace(blankRegex, (match, fullTag, letter) => {
                // Check if this specific blank matches the one in the question metadata
                const isActive = (fullTag === activeBlank);
                const className = isActive ? 'blank-space active' : 'blank-space';
                
                // Return a span that keeps the letter visible [A], [B], or [C]
                return `<span class="${className}">[${letter}]</span>`;
            });

            elements.contextText.innerHTML = contextHTML;
            elements.contextArea.classList.remove('hidden');
        } else {
            elements.contextArea.classList.add('hidden');
        }

    question.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerHTML = choice.text;
        button.dataset.id = choice.id;
        button.className = 'choice-btn p-4 rounded-lg text-left transition-all';
        elements.choicesContainer.appendChild(button);
    });
}

export function showFeedback(isCorrect, question) {
    const correctChoice = question.choices.find(c => c.id === question.answerKey.correctChoiceId);
    
    elements.feedbackArea.classList.remove('hidden');
    elements.feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
    elements.feedbackArea.className = `mt-6 p-4 rounded-lg ${isCorrect ? 'correct' : 'incorrect'}`;
    elements.correctAnswerText.textContent = isCorrect ? '' : `The correct answer is: ${correctChoice.text}`;
    
    if (question.answerKey.explanation) {
        elements.explanationText.innerHTML = `<strong>Explanation:</strong> ${question.answerKey.explanation}`;
        elements.explanationText.classList.remove('hidden');
    } else {
        elements.explanationText.classList.add('hidden');
    }
    
    elements.submitBtn.classList.add('hidden');
    elements.nextQuestionBtn.classList.remove('hidden');
}

export function updateChoiceButtons(selectedId, correctId) {
    Array.from(elements.choicesContainer.children).forEach(btn => {
        const btnId = parseInt(btn.dataset.id);
        btn.disabled = true;
        if (btnId === correctId) btn.classList.add('correct');
        else if (btnId === selectedId) btn.classList.add('incorrect');
        btn.classList.remove('selected');
    });
}

// export function showScore(score, total) {
//     const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
//     elements.finalScore.textContent = `${percentage}%`;
//     elements.scoreSummary.textContent = `You answered ${score} out of ${total} questions correctly.`;
//     showView('scoreView');
// }
export function showScore(score, total, finalTime, results = []) {
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
    
    // 1. Level & Basic Stats
    const sleLevel = getSleLevel(score, total);
    elements.finalScore.textContent = `${percentage}%`;
    
    // Use innerHTML here so we can append the breakdown below it later
    elements.scoreSummary.innerHTML = `<div>You answered ${score} out of ${total} questions correctly.</div>`;
    
    if (elements.sleLevelEstimate) {
         elements.sleLevelEstimate.textContent = `Estimated Level: ${sleLevel}`;
    }

    // 2. Time Display
    if (elements.finalTime && finalTime) {
        elements.finalTime.textContent = `Total Time: ${finalTime}`;
    } else if (elements.finalTime) {
        elements.finalTime.textContent = ''; 
    }

    // 3. Progress Bar Reset
    if (elements.progressBarInner) {
        elements.progressBarInner.style.width = '0%';
    }

    // 4. Grammar Breakdown Logic
    if (results && results.length > 0) {
        const breakdown = results.reduce((acc, curr) => {
            const key = curr.grammarType || 'Other';
            if (!acc[key]) acc[key] = { correct: 0, total: 0 };
            acc[key].total++;
            if (curr.isCorrect) acc[key].correct++;
            return acc;
        }, {});

        let breakdownHTML = `<div class="mt-6 border-t border-gray-700 pt-4 text-left">
                                <h4 class="font-bold mb-2 text-blue-400">Category Breakdown:</h4>`;
        
        for (const [type, stats] of Object.entries(breakdown)) {
            const isPerfect = stats.correct === stats.total;
            const colorClass = isPerfect ? 'text-green-400' : 'text-amber-400';
            
            breakdownHTML += `
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-300">${type}</span>
                    <span class="font-mono ${colorClass}">${stats.correct}/${stats.total}</span>
                </div>`;
        }
        breakdownHTML += `</div>`;
        
        elements.scoreSummary.innerHTML += breakdownHTML;
    }
    
    showView('scoreView');
}

export function displayLoadingError(error) {
    elements.loadingState.innerHTML = `<h1 class="text-2xl font-bold text-red-600 text-center">Error</h1><p class="text-gray-600 text-center mt-2">${error.message}</p><button id="error-back-btn" class="mt-4 text-blue-600 hover:underline">Back to Menu</button>`;
    document.getElementById('error-back-btn').addEventListener('click', () => showView('startState'));
}

// --- ADD THIS NEW FUNCTION AT THE BOTTOM ---
function getSleLevel(score, total) {
    if (total === 0) return 'N/A'; // Prevent division by zero

    // 1. Normalize the score to a 40-point scale
    // (score / total) gives the percentage, then multiply by 40
    const normalizedScore = Math.round((score / total) * 40);

    // 2. Apply your rubric logic
    if (normalizedScore <= 9) return "X (below A)";
    if (normalizedScore <= 15) return "Between X and A";
    if (normalizedScore <= 19) return "Level A";
    if (normalizedScore <= 25) return "Between A and B";
    if (normalizedScore <= 29) return "Level B";
    if (normalizedScore <= 35) return "Between B and C";
    return "Level C"; // 36-40
}

