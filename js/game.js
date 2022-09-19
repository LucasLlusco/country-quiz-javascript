const question = document.getElementById("question");
const questionImg = document.getElementById("question-img")
const choices = document.querySelectorAll(".choice")
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const imgAdventure = document.getElementById("img-adventure");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");


let score = 0 
let questionCounter = 0; 
let questionBase = [];
let availableQuestions = []; 
let currentQuestion = {}; 
let formattedQuestion = {};
let arr = []; 
let acceptingAnswers = false

const fetchData = async () => {
    try {
        const res = await fetch("https://restcountries.com/v2/all")
        const data = await res.json() 
        startGame(data)
    } catch (error) {
        console.log(error) 
    }
}

fetchData()
const CorrectBonus = 10;
const MaxQuestions = 250;

const random = () => {
    arr = [];
    while (arr.length < 3) { 
        const random = Math.floor(Math.random() * 249); 
        if (arr.indexOf(random) === -1) {             
            arr.push(random);                        
        }
    }
}
const startGame = (data) => {
    questionCounter = 0;
    score = 0;
    questionBase = data
    availableQuestions = [...questionBase];
    getNewQuestion()
    game.classList.remove("hidden");
    imgAdventure.classList.remove("hidden");
    loader.classList.add("hidden");
}

const getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MaxQuestions) {
        localStorage.setItem("mostRecentScore", score); 
        return window.location.assign("end.html");
    }
    questionCounter++;
    progressText.innerText = `${questionCounter} of ${MaxQuestions}`;
    random()
    

    let incorrectAnswersBase = []
    incorrectAnswersBase = [...questionBase]
    const questionIndex  = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex]

    const index = incorrectAnswersBase.indexOf(currentQuestion);
    if (index > -1) { 
        incorrectAnswersBase.splice(index, 1); 
    }

    const typeQuestion = Math.floor(Math.random() * 2)
    if(typeQuestion == 1) {
        questionImg.innerHTML = `<img src="${currentQuestion.flags.png}" alt="">`
        question.innerText = `Which country does this flag belong to?`
    } else if (currentQuestion.capital) {
        questionImg.innerHTML = ""
        question.innerText = `${currentQuestion.capital} is the capital of`
    } else { 
        questionImg.innerHTML = `<img src="${currentQuestion.flags.png}" alt="">`
        question.innerText = `Which country does this flag belong to?`
    }

    formattedQuestion = {};
    const incorrectAnswers = [ 
        incorrectAnswersBase[arr[0]].name, 
        incorrectAnswersBase[arr[1]].name,
        incorrectAnswersBase[arr[2]].name  
    ]
    const answerChoices = [...incorrectAnswers]
    formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
    answerChoices.splice(formattedQuestion.answer -1, 0, currentQuestion.name)
    answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index+1)] = choice; 
    })

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = formattedQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1) 
    acceptingAnswers = true
}  
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return; 
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"]; 
        const classToApply = selectedAnswer == formattedQuestion.answer ? 'correct' : 'incorrect'
    
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => { 
            selectedChoice.parentElement.classList.remove(classToApply);
            if (classToApply === "correct") {
                incrementScore(CorrectBonus)                
            } else {
                localStorage.setItem("mostRecentScore", score);
                return window.location.assign("end.html");
            }
            getNewQuestion()
        }, 1000);        
    })
})

const incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
