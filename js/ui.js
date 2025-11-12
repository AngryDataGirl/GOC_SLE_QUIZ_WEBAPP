import { elements } from './config.js';

export function showView(viewToShow) {
    ['loadingState', 'startState', 'quizView', 'scoreView', 'dashboardView'].forEach(view => {
        elements[view].classList.add('hidden');
    });
    if (elements[viewToShow]) {
        elements[viewToShow].classList.remove('hidden');
    }
}

export function displayQuestion(question, currentIndex, total) {

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
    const activeBlank = question.refersTo; // e.g., "BLANK_A"

    if (activeBlank) {
        // This is a fill-in-the-blank question

        // 1. Highlight the blank this question refers to
        const activeRegex = new RegExp(`\\{\\{${activeBlank}\\}\\}`, 'g');
        contextHTML = contextHTML.replace(activeRegex, '<span class="active-blank-space">[BLANK]</span>');

        // 2. Just remove the tags from any *other* blanks in the same text
        contextHTML = contextHTML.replace(/\{\{BLANK.*?\}\}/g, '');

    } else {
        // This is not a fill-in-the-blank question, but might have sample blanks
        // (like in the original CE_1_Q1 text)
        contextHTML = contextHTML.replace(/\{\{BLANK.*?\}\}/g, '<span class="blank-space"></span>');
    }

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

export function showScore(score, total) {
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
    elements.finalScore.textContent = `${percentage}%`;
    elements.scoreSummary.textContent = `You answered ${score} out of ${total} questions correctly.`;
    showView('scoreView');
}

export function displayLoadingError(error) {
    elements.loadingState.innerHTML = `<h1 class="text-2xl font-bold text-red-600 text-center">Error</h1><p class="text-gray-600 text-center mt-2">${error.message}</p><button id="error-back-btn" class="mt-4 text-blue-600 hover:underline">Back to Menu</button>`;
    document.getElementById('error-back-btn').addEventListener('click', () => showView('startState'));
}