import { elements } from './config.js';

function getScores() {
    return JSON.parse(localStorage.getItem('quizScores')) || [];
}

export function saveScore(quizName, score, correct, total, finalTime) {
    const newScore = {
        name: quizName,
        score: Math.round((correct / total) * 100),
        correct,
        total,
        date: new Date().toISOString(),
        duration: finalTime || null, // 2. ADD DURATION TO THE OBJECT
        breakdown: results // <--- This saves the grammar/question types permanently
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
        // 3. CREATE DURATION STRING (if it exists)
        const durationString = score.duration ? `<span class="text-sm text-gray-500 ml-2">(${score.duration})</span>` : '';

        // 4. UPDATE INNERHTML TO INCLUDE durationString
        scoreElement.innerHTML = `
            <div>
                <span class="font-semibold text-gray-800">${score.name}</span>
                <span class="text-sm text-gray-500 ml-2">${formattedDate}</span>
                ${durationString}
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
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    // This will store aggregated stats like: { "Subjonctif": { correct: 5, total: 10 }, ... }
    const grammarMastery = {};

    scores.forEach(score => {
        totalCorrect += score.correct;
        totalQuestions += score.total;

        // Process the breakdown data saved in each score object
        if (score.breakdown) {
            score.breakdown.forEach(item => {
                const type = item.grammarType || 'General';
                if (!grammarMastery[type]) {
                    grammarMastery[type] = { correct: 0, total: 0 };
                }
                grammarMastery[type].total++;
                if (item.isCorrect) grammarMastery[type].correct++;
            });
        }
    });

    // Update Top Stats
    elements.stats.totalQuizzes.textContent = totalQuizzes;
    elements.stats.overallAccuracy.textContent = totalQuestions > 0 
        ? `${Math.round((totalCorrect / totalQuestions) * 100)}%` 
        : '0%';
    elements.stats.totalQuestions.textContent = totalQuestions;

    // Display Grammar Mastery Breakdown
    elements.stats.byTopic.innerHTML = '';
    
    if (Object.keys(grammarMastery).length === 0) {
        elements.stats.byTopic.innerHTML = '<p class="text-gray-500 text-center italic">No category data available yet.</p>';
    } else {
        // Sort by accuracy (lowest first) to show what needs work
        const sortedTypes = Object.entries(grammarMastery).sort((a, b) => {
            return (a[1].correct / a[1].total) - (b[1].correct / b[1].total);
        });

        sortedTypes.forEach(([type, stats]) => {
            const accuracy = Math.round((stats.correct / stats.total) * 100);
            const topicElement = document.createElement('div');
            topicElement.className = 'flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-800 mb-2';
            
            const colorClass = accuracy > 80 ? 'text-green-400' : accuracy > 50 ? 'text-amber-400' : 'text-red-400';

            topicElement.innerHTML = `
                <div>
                    <span class="font-semibold text-gray-200">${type}</span>
                    <span class="text-xs text-gray-500 ml-2">(${stats.total} questions)</span>
                </div>
                <span class="font-bold text-lg ${colorClass}">${accuracy}%</span>
            `;
            elements.stats.byTopic.appendChild(topicElement);
        });
    }
}