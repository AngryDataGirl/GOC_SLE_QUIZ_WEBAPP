"# GOC_SLE_QUIZ_WEBAPP" 

# Launch the github page
https://angrydatagirl.github.io/GOC_SLE_QUIZ_WEBAPP/

# Main JS files
- `main.js` is the entry point. It runs first, sets up all the event listeners (like what happens when a button is clicked), and acts as the "conductor" that tells the other modules what to do.
- `quiz.js` is the brain of the quiz. When you click a quiz button, main.js tells quiz.js to start. It handles fetching questions, tracking the current question, and calculating the score.
- `ui.js` controls what you see. When quiz.js needs to display a new question or show feedback, it calls functions in ui.js. This file is solely responsible for manipulating the HTML to show and hide different elements.
- `scoreManager.js` handles data. It saves, retrieves, and clears your quiz scores using the browser's localStorage.
- `config.js` is a helper file. It stores constants and references to all HTML elements so you don't have to write document.getElementById everywhere.
- `style.css` is the style sheet, and probably needs some refactoring
