// Required Constants
 const drawAt = 20 /*call a draw if this many turns pass without capture*/


// Cache le DOM 
let board = document.getElementById('board')
let helpIcon = document.getElementById('helpicon')
let menubox = document.getElementById('menubox')

// Application variables
let gameState = [[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[-1,0,-1,0,-1,0,-1,0],[0,-1,0,-1,0,-1,0,-1],[-1,0,-1,0,-1,0,-1,0]]
let pieceSelected;
let coordString

helpIcon.addEventListener('click', function() {
    if (menubox.style.display === "") {
        menubox.style.display = 'block';
    } else {
        menubox.style = `display: "none"`
    }
})

render()

board.addEventListener('click', function(square) {
    if (square.target.classList.contains('piece')) {
        console.log("Circle on square ", square.target.parentElement.id)
        pieceSelected = square.target.parentElement.id

        // gameState[Math.floor(pieceSelected/10)][pieceSelected%10]


    } else {
    console.log("Square ", square.target.id)
    }
})

console.log(gameState)


function render() {
    gameState.forEach(function(x, xi){
        x.forEach(function (y, yi){
            // console.log(x[y])
            if (y !== 0) {
                coordString += xi.toString()+ yi.toString()
                console.log("Player value ", y)
                console.log("Player position ", xi, yi)
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece" style="background-color:var(--player${y}color)">`
    
            }

        })
    })
    
}

console.log(gameState)