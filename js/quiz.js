import { QUIZ_LENGTH, elements } from './config.js';
import * as ui from './ui.js';
import { saveScore } from './scoreManager.js';

let state = {
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedAnswerId: null,
};

function parseJsonData(data) {
    const parsedQuestions = [];
    let examsArray = data.exams;
    if (examsArray && examsArray.length > 0 && examsArray[0].exams) {
        examsArray = examsArray.flatMap(e => e.exams);
    }
    if (examsArray) {
        examsArray.forEach(exam => {
            if (exam.questionSets) {
                exam.questionSets.forEach(set => {
                    if (set.questions) {
                        set.questions.forEach(q => {
                            parsedQuestions.push({
                                context: set.context ? set.context.text : null,
                                prompt: q.prompt,
                                choices: q.choices,
                                answerKey: q.answerKey
                            });
                        });
                    }
                });
            }
        });
    }
    return parsedQuestions;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}

export async function startQuiz(fileName, quizTitleText) {
    ui.showView('loadingState');
    try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`Could not load ${fileName}.`);
        const data = await response.json();
        const questionsFromFile = parseJsonData(data);
        if (questionsFromFile.length < 1) throw new Error(`No questions found in ${fileName}.`);
        
        state.score = 0;
        state.currentIndex = 0;
        state.selectedAnswerId = null;

        // --- MODIFICATION START ---
        // Replace the old sort method with the new shuffle function
        const shuffled = shuffle([...questionsFromFile]);
        // --- MODIFICATION END ---

        state.questions = shuffled.slice(0, Math.min(QUIZ_LENGTH, shuffled.length));
        
        elements.quizTitle.textContent = quizTitleText;
        ui.showView('quizView');
        ui.displayQuestion(state.questions[state.currentIndex], state.currentIndex, state.questions.length);
    } catch (error) {
        ui.displayLoadingError(error);
    }
}

export function selectAnswer(choiceId, buttonElement) {
    state.selectedAnswerId = choiceId;
    Array.from(elements.choicesContainer.children).forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');
    elements.submitBtn.disabled = false;
}

export function submitAnswer() {
    if (state.selectedAnswerId === null) return;
    const question = state.questions[state.currentIndex];
    const correctChoiceId = question.answerKey.correctChoiceId;
    const isCorrect = state.selectedAnswerId === correctChoiceId;
    if (isCorrect) state.score++;
    
    ui.showFeedback(isCorrect, question);
    ui.updateChoiceButtons(state.selectedAnswerId, correctChoiceId);
}

export function nextQuestion() {
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) {
        state.selectedAnswerId = null;
        ui.displayQuestion(state.questions[state.currentIndex], state.currentIndex, state.questions.length);
    } else {
        const totalQuestions = state.questions.length;
        ui.showScore(state.score, totalQuestions);
        saveScore(elements.quizTitle.textContent.trim(), state.score, state.score, totalQuestions);
    }
}