// Runs DOM
document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const startButton = document.getElementById('start-btn');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const scoreContainer = document.getElementById('score-container');
    const highScoresScreen = document.getElementById('high-scores-screen');
    const backToQuizButton = document.getElementById('back-to-quiz-btn');
    const initialsForm = document.getElementById('initials-form');

    // Initialize variables
    let currentQuestionIndex = 0;  // Index of the current question in the array
    let score = 0;  // User's score
    let timeLeft = 75;  // Initial time for the quiz
    let timer;  // Timer interval ID

    // Hide the initials form initially
    initialsForm.style.display = 'none';

    // Attach a click event listener to the "Start" button
    startButton.addEventListener('click', startQuiz);

    // Event listener for the "High Scores" button
    document.getElementById('high-scores-btn').addEventListener('click', function () {
        // Hide quiz-related elements
        startButton.style.display = 'none';
        questionContainer.innerHTML = '';
        resultContainer.innerHTML = '';
        scoreContainer.style.display = 'none';

        // Show the high scores and "Back to Quiz" button
        displayHighScores();
        backToQuizButton.style.display = 'block';
    });

    // Event listener for the "Back to Quiz" button
    backToQuizButton.addEventListener('click', function () {
        // Reset quiz-related elements
        startButton.style.display = 'block';
        scoreContainer.style.display = 'block';
        document.getElementById('timer-display').textContent = 'Time Left: 75s';
        document.getElementById('current-score').textContent = '0';
    
        // Hide high scores and "Back to Quiz" button
        highScoresScreen.style.display = 'none';
        this.style.display = 'none';
    
        // Hide initials form
        initialsForm.style.display = 'none';
    
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 75;
    });

    // Attach a submit event listener to the initials form
    initialsForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        saveScore(); // Save the score when the form is submitted

        // Clear the initials form
        document.getElementById('initials').value = '';

        // After saving the score, you might want to update the high scores display
        displayHighScores();
    });

    // Function to start the quiz
    function startQuiz() {
        startButton.style.display = 'none';  // Hide the start button
        displayQuestion();  // Display the first question
        startTimer();  // Start the timer
    }

    // Function to start the timer
    function startTimer() {
        timer = setInterval(function () {
            timeLeft--;  // Decrement the time left
            // Update the timer display
            document.getElementById('timer-display').textContent = `Time Left: ${timeLeft}s`;

            // Check if time has run out
            if (timeLeft <= 0) {
                clearInterval(timer);  // Stop the timer
                endQuiz();  // End the quiz
            }
        }, 1000);  // Update every second
    }

    // Array of quiz questions
    var questions = [
        {
            question: 'Commonly used data types DO NOT include?',
            options: ['strings', 'booleans', 'alerts', 'numbers'],
            correctAnswer: 'alerts'
        },
        {
            question: 'The condition in an if/else statement is enclosed within _____.',
            options: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
            correctAnswer: 'parentheses'
        },
        {
            question: 'Arrays in JavaScript can be used to store _____.',
            options: ['numbers and strings', 'other arrays', 'booleans', 'all of the above'],
            correctAnswer: 'all of the above'
        },
        {
            question: 'String values must be enclosed within _____ when being assigned to variables.',
            options: ['commas', 'curly brackets', 'quotes', 'parentheses'],
            correctAnswer: 'quotes'
        },
        {
            question: 'A very useful tool used during development and debugging for printing content to the debugger is:',
            options: ['JavaScript', 'terminal/bash', 'for loops', 'console.log'],
            correctAnswer: 'console.log'
        }
    ];
    

    // Function to display the current question
    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerHTML = `<p>${currentQuestion.question}</p>`;

        // Create buttons for each option
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', function () {
                checkAnswer(option);
            });
            questionContainer.appendChild(button);
        });
    }

    function checkAnswer(answer) {
        const currentQuestion = questions[currentQuestionIndex];
        //check to see if the question is correctly answered
        if (answer.includes(currentQuestion.correctAnswer)) {
            score++;
            resultContainer.innerHTML = "That's correct!";
        } else {
            resultContainer.innerHTML = "That's incorrect!";
            // penalize time
            const penalty = 15;
            // timeLeft = timeLeft - penalty
            timeLeft = timeLeft - penalty;
            // update the timer display
            document.getElementById('timer-display').textContent = `Time Left: ${timeLeft}s`;
        }
        resultContainer.innerHTML = '';

        currentQuestionIndex++;

        // Check if there are more questions or end the quiz
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }

    // Function to display high scores
    function displayHighScores() {
        // Clear existing high scores
        highScoresScreen.innerHTML = '';

        // Get high scores from local storage
        const scores = JSON.parse(localStorage.getItem('scores')) || [];

        // Sort scores in descending order (highest to lowest)
        scores.sort((a, b) => b.score - a.score);

        // Display each high score
        scores.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${score.initials}: ${score.score}`;
            highScoresScreen.appendChild(listItem);
        });

        // Show the high scores screen and the initials form
        highScoresScreen.style.display = 'block';
        initialsForm.style.display = 'block';
    }

    // Function to end the quiz
    function endQuiz() {
        clearInterval(timer);
        questionContainer.innerHTML = '';
        resultContainer.innerHTML = `Quiz completed! Your score: ${score}`;
        // Display high scores and initials form
        displayHighScores();
    }

    function saveScore() {
        // Get the initials from the input
        const initials = document.getElementById('initials').value;
        // Create an object with the initials and score
        const userScore = {
            initials: initials,
            score: score // Use the global score variable
        };
        // Get the existing scores from local storage
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
        // Add the new score to the array
        scores.push(userScore);
        // Save the scores to local storage
        localStorage.setItem('scores', JSON.stringify(scores));
    
        // Reset quiz-related elements
        startButton.style.display = 'block';
        scoreContainer.style.display = 'block';
        document.getElementById('timer-display').textContent = 'Time Left: 75s';
        document.getElementById('current-score').textContent = '0';
    
        // Hide high scores and "Back to Quiz" button
        highScoresScreen.style.display = 'none';
        backToQuizButton.style.display = 'none';
    
        // Hide initials form
        initialsForm.style.display = 'none';
    
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 75;
    }
    
});
