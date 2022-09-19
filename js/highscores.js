const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; 

highScores.map (function (score) { 
    highScoresList.innerHTML += `
    <li>${score.name} - ${score.score}</li>`;
})