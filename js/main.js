import { elements } from './config.js';
import * as ui from './ui.js';
import * as quiz from './quiz.js';
import * as scoreManager from './scoreManager.js';

function init() {
    // Event listeners for starting quizzes
    document.querySelectorAll('.quiz-type-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const btn = event.currentTarget;
            const fileName = btn.dataset.quizFile;
            const quizTitleText = btn.querySelector('h4').textContent.trim();
            quiz.startQuiz(fileName, quizTitleText);
        });
    });

    // Event listeners for quiz navigation
    elements.choicesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('choice-btn')) {
            const choiceId = parseInt(event.target.dataset.id);
            quiz.selectAnswer(choiceId, event.target);
        }
    });
    elements.submitBtn.addEventListener('click', quiz.submitAnswer);
    elements.nextQuestionBtn.addEventListener('click', quiz.nextQuestion);

    // Event listeners for menu and dashboard navigation
    function showMainMenu() {
        ui.showView('startState');
        scoreManager.displayScores();
    }
    
    elements.backToMenuBtn.addEventListener('click', showMainMenu);
    elements.backToMenuScoreBtn.addEventListener('click', showMainMenu);
    elements.backToMenuDashboardBtn.addEventListener('click', showMainMenu);
    
    elements.viewDashboardBtn.addEventListener('click', () => {
        scoreManager.calculateAndDisplayDashboard();
        ui.showView('dashboardView');
    });

    // Score management
    elements.clearScoresBtn.addEventListener('click', scoreManager.clearScores);

    // Initial call on page load
    scoreManager.displayScores();
}

// Run the app
init();