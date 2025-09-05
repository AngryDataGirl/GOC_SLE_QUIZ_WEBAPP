import { elements } from './config.js';

function getScores() {
    return JSON.parse(localStorage.getItem('quizScores')) || [];
}

export function saveScore(quizName, score, correct, total) {
    const newScore = {
        name: quizName,
        score: Math.round((correct / total) * 100),
        correct,
        total,
        date: new Date().toISOString()
    };
    const scores = getScores();
    scores.unshift(newScore);
    if (scores.length > 10) {
        scores.pop();
    }
    localStorage.setItem('quizScores', JSON.stringify(scores));
}

export function displayScores() {
    const scores = getScores();
    elements.scoresContainer.innerHTML = '';
    if (scores.length === 0) {
        elements.scoresContainer.innerHTML = '<p class="text-gray-500 text-center">No scores recorded yet.</p>';
        elements.clearScoresBtn.classList.add('hidden');
        return;
    }
    elements.clearScoresBtn.classList.remove('hidden');
    scores.forEach(score => {
        const scoreElement = document.createElement('div');
        const formattedDate = new Date(score.date).toLocaleDateString('en-CA');
        scoreElement.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg border';
        scoreElement.innerHTML = `
            <div>
                <span class="font-semibold text-gray-800">${score.name}</span>
                <span class="text-sm text-gray-500 ml-2">${formattedDate}</span>
            </div>
            <span class="font-bold text-lg ${score.score >= 70 ? 'text-green-600' : 'text-amber-600'}">${score.score}%</span>
        `;
        elements.scoresContainer.appendChild(scoreElement);
    });
}

export function clearScores() {
    if (confirm('Are you sure you want to clear all scores?')) {
        localStorage.removeItem('quizScores');
        displayScores();
    }
}

export function calculateAndDisplayDashboard() {
    const scores = getScores();
    const totalQuizzes = scores.length;
    const totalCorrect = scores.reduce((sum, s) => sum + s.correct, 0);
    const totalQuestions = scores.reduce((sum, s) => sum + s.total, 0);
    const overallAccuracy = totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100);

    elements.stats.totalQuizzes.textContent = totalQuizzes;
    elements.stats.overallAccuracy.textContent = `${overallAccuracy}%`;
    elements.stats.totalQuestions.textContent = totalQuestions;

    const topicStats = {};
    scores.forEach(score => {
        if (!topicStats[score.name]) {
            topicStats[score.name] = { correct: 0, total: 0, count: 0 };
        }
        topicStats[score.name].correct += score.correct;
        topicStats[score.name].total += score.total;
        topicStats[score.name].count += 1;
    });

    elements.stats.byTopic.innerHTML = '';
    if (Object.keys(topicStats).length === 0) {
        elements.stats.byTopic.innerHTML = '<p class="text-gray-500 text-center">Take some quizzes to see your topic performance.</p>';
    } else {
        for (const topicName in topicStats) {
            const stats = topicStats[topicName];
            const accuracy = Math.round((stats.correct / stats.total) * 100);
            const topicElement = document.createElement('div');
            topicElement.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg border';
            topicElement.innerHTML = `
                <div>
                    <span class="font-semibold text-gray-800">${topicName}</span>
                    <span class="text-sm text-gray-500 ml-2">(${stats.count} attempts)</span>
                </div>
                <span class="font-bold text-lg ${accuracy >= 70 ? 'text-green-600' : 'text-amber-600'}">${accuracy}%</span>
            `;
            elements.stats.byTopic.appendChild(topicElement);
        }
    }
}