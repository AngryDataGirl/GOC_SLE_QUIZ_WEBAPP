// A central place for configuration
export const QUIZ_LENGTH = 10;

// A central place for all DOM element references
export const elements = {
    loadingState: document.getElementById('loading-state'),
    startState: document.getElementById('start-state'),
    quizView: document.getElementById('quiz-view'),
    scoreView: document.getElementById('score-view'),
    dashboardView: document.getElementById('dashboard-view'),
    quizTitle: document.getElementById('quiz-title'),
    questionCounter: document.getElementById('question-counter'),
    questionIdDisplay: document.getElementById('question-id'), // ✨ ADDED
    contextArea: document.getElementById('context-area'),
    contextText: document.getElementById('context-text'),
    questionPrompt: document.getElementById('question-prompt'),
    choicesContainer: document.getElementById('choices-container'),
    submitBtn: document.getElementById('submit-btn'),
    nextQuestionBtn: document.getElementById('next-question-btn'),
    feedbackArea: document.getElementById('feedback-area'),
    feedbackText: document.getElementById('feedback-text'),
    correctAnswerText: document.getElementById('correct-answer-text'),
    explanationText: document.getElementById('explanation-text'),
    finalScore: document.getElementById('final-score'),
    scoreSummary: document.getElementById('score-summary'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    backToMenuScoreBtn: document.getElementById('back-to-menu-score-btn'),
    backToMenuDashboardBtn: document.getElementById('back-to-menu-dashboard-btn'),
    scoresContainer: document.getElementById('scores-container'),
    clearScoresBtn: document.getElementById('clear-scores-btn'),
    viewDashboardBtn: document.getElementById('view-dashboard-btn'),
    stats: {
        totalQuizzes: document.getElementById('stats-total-quizzes'),
        overallAccuracy: document.getElementById('stats-overall-accuracy'),
        totalQuestions: document.getElementById('stats-total-questions'),
        byTopic: document.getElementById('stats-by-topic'),
    }
};