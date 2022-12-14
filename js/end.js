const saveScoreBtn = document.getElementById("saveScoreBtn");
const username = document.getElementById("username");
const finalScore = document.getElementById("finalScore");

const mostRecentScore = localStorage.getItem("mostRecentScore")
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];


finalScore.innerText = mostRecentScore; 
username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value; 
})

const saveHighScore = () => {
    const score = {
        score: mostRecentScore,
        name: username.value
    }
    highScores.push(score);
    highScores.sort( (a,b) => b.score - a.score)
    highScores.splice(5);  
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("index.html")
}

saveScoreBtn.addEventListener("click", e => {
    e.preventDefault()
    saveHighScore()
})
