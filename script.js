// Required Constants
 const drawAt = 40 /*call a draw if this many turns pass without capture*/


// Cache le DOM 
let board = document.getElementById('board')
let helpIcon = document.getElementById('helpicon')
let menubox = document.getElementById('menubox')
let status = document.getElementById('status')
let player1status = document.getElementById('P1status')
let player0status = document.getElementById('P0status')



// Application variables
let gameState = [
    [0,1,0,0,0,0,0,0],
    [0,0,-1,0,0,0,-1,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,-1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]]

    // [0,1,0,1,0,1,0,1],
    // [1,0,1,0,1,0,1,0],
    // [0,1,0,1,0,1,0,1],
    // [0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0],
    // [-1,0,-1,0,-1,0,-1,0],
    // [0,-1,0,-1,0,-1,0,-1],
    // [-1,0,-1,0,-1,0,-1,0]]
let pieceSelected = {x:0, y:0, value:0}
let gameStateX
let gameStateY
let playerTurn = -1
let legalLocal = [
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','','']]
let squareID;
let player1 = {score: 0, capturedEnemies: 0}
let player0 = {score: 0, capturedEnemies: 0}
let secondJump = false
let destinationX;
let destionationY;
let moveCount = 0;
let winner = 0
let draw = false;

render()
init()

helpIcon.addEventListener('click', function() {
    if (menubox.style.display === "") {
        menubox.style.display = 'block';
    } else {
        menubox.style = `display: "none"`
    }
})




board.addEventListener('click', function(square) {
// set the ID of the chosen square as a single number and as separate X and Y
    if (square.target.classList.contains('piece')) {
        squareID = square.target.parentElement.id
    } else {
        squareID = square.target.id
    }
    gameStateX = Math.floor(squareID/10)
    gameStateY = squareID%10
// if the square contains a piece, set it as selected. This might not be neccessary because of the way setPieceSelected functions
    if (square.target.classList.contains('piece')) {
        // console.log("Circle on square ", squareID)
        if ((pieceSelected.value === 0 && (playerTurn*gameState[Math.floor(squareID/10)][squareID%10]) >0 ) || pieceSelected.x*10 + pieceSelected.y == squareID ) {
            setPieceSelected(square)
            if (pieceSelected.x + pieceSelected.y !== 0) {
            checkLegal(pieceSelected.x, pieceSelected.y)
            renderLegal(pieceSelected.x, pieceSelected.y)
            }
        }
// if a piece is already selected
    } else if (pieceSelected.value != 0) {
// if the selected square is a legal move, make it
        if (legalLocal[gameStateX][gameStateY] === 'legal'){
            dropPiece(squareID, 'legal')
            clearLegal()
            renderLegal()
            render()
// if the selected square is a jump
        } else if (legalLocal[gameStateX][gameStateY] === 'jump') {
//  capture the piece
            capture( (pieceSelected.x*10) + pieceSelected.y,  parseInt(squareID))
// check for moves in the new position
            checkLegal(gameStateX, gameStateY)
            dropPiece(squareID)
            render()
// if there are jumps available, renderLegal, clearSelected and setPieceSelected to new square
            if (legalLocal.some(x => x.includes('jump'))) {
                // playerTurn *= -1
                playerTurn *=-1
                jumpsOnly() 
                renderLegal()
                setPieceSelected(squareID)

                // secondJump = true 
                render()
            } 
        } else {
            console.log("Illegal move!")
        }
    } 
})

function render() {
    console.log("Starting render! Player turn is ", playerTurn)
    gameState.forEach(function(x, xi){
        x.forEach(function (y, yi){
            if (y == 1 || y == -1) {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece" style="background-color:var(--player${y}color)"></div>`
            } else if (y == 2 || y == -2) {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece king" style="background-color:var(--player${y*.5}color)"></div>`
            } else {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = ``
            }
        })
    })
    // WINNER
    checkWinner()
    if (winner) {
        status.style.display = 'flex';
        console.log("Player ", winner, "wins!")
        status.innerHTML = `<div class="winnerbox"><div class="piece" style="background-color:var(--player${winner}color)"></div>
        </div>
        WINNER
        <div class="winnerbox">
            <div class="piece" style="background-color:var(--player${winner}color)"></div>
        </div>`
        status.addEventListener('click', function(event){
            // event.target.removeEventListener()
            init()
            console.log("restart")
            status.style.display = "none"
        })
    }

    if (draw) {
        status.style.display = 'flex';
        status.innerHTML = `<div class="winnerbox"><div class="piece" style="background-color:var(--player1color)"></div>
        </div>
        DRAW
        <div class="winnerbox">
            <div class="piece" style="background-color:var(--player-1color)"></div>
        </div>`
        status.addEventListener('click', function(event){
            // event.target.removeEventListener()
            init()
            console.log("restart")
            status.style.display = "none"

        })
    }

    if (player1.capturedEnemies > 0) {
        player1status.innerHTML = `<div class="piece" style="background-color:var(--player-1color)">${player1.capturedEnemies}</div>`
    } 
    if (player0.capturedEnemies > 0) {
        player0status.innerHTML = `<div class="piece" style="background-color:var(--player1color)">${player0.capturedEnemies}</div>`

    }

    board.style.border = `10px solid var(--player${playerTurn}color)`
    // status.innerHTML = `Player 1 captured enemies: ${player1.capturedEnemies} <br> Player 0 captured enemies: ${player0.capturedEnemies} <br> P1score: ${player1.score} P0score: ${player0.score} <br>moves since capture: ${moveCount}`

}

function setPieceSelected(square) {
    if (pieceSelected.x === gameStateX && pieceSelected.y === gameStateY) { // Cancel move
        clearSelected()
        clearLegal()
    } else {
        pieceSelected.x = gameStateX
        pieceSelected.y = gameStateY
        pieceSelected.value = gameState[pieceSelected.x][pieceSelected.y]
    }
    if (pieceSelected.value*playerTurn > 0) { //If the piece selected is the current players', set it as selected
        document.getElementById(`${pieceSelected.x.toString()}${pieceSelected.y.toString()}`).classList.add('selected')
    }
}

function clearSelected() {
    document.getElementById(`${pieceSelected.x.toString()}${pieceSelected.y.toString()}`).classList.remove('selected')
    pieceSelected.x = 0
    pieceSelected.y = 0
    pieceSelected.value = 0

}

function dropPiece(destinationSquare, moveType, square) {
    destinationX = Math.floor(destinationSquare/10)
    destinationY = destinationSquare%10
    // King me
    if ((destinationX > 6 && pieceSelected.value === 1) || (destinationX < 1 && pieceSelected.value === -1)) {
        gameState[destinationX][destinationY] = (2*playerTurn)
    } else {
        gameState[destinationX][destinationY] = pieceSelected.value
    }
    gameState[pieceSelected.x][pieceSelected.y] = 0
    clearSelected()
    // render()
    moveCount++
    playerTurn *= -1
}

function delta(start, end) {
    return [Math.floor(end/10) - Math.floor(start/10), (end %10) - (start %10)]
}

function checkLegal (squareX, squareY) {
    clearLegal()
    // Forward moves
    // console.log("Game state at begining of checkLegal: ", gameState)
    // console.log("Turn at begining of checkLegal: ", playerTurn)
    if (squareX+playerTurn < 8 && squareX+playerTurn >= 0) { // X boundary
        if (squareY+1 < 8) {// checking moves to the right
            if (gameState[squareX+playerTurn][squareY+1] === 0) {
                legalLocal[squareX+playerTurn][squareY+1] = 'legal'
            }
            // checking jumps
            if (squareX+playerTurn*2 >= 0 && squareX+playerTurn*2 <8) {
                if (((gameState[squareX+playerTurn][squareY+1] === playerTurn*-1) || (gameState[squareX+playerTurn][squareY+1] === playerTurn*-2)) && gameState[squareX+(playerTurn*2)][squareY+2] === 0) {
                    legalLocal[squareX+(playerTurn*2)][squareY+2] = 'jump'
                }
            }
        }
        if (squareY-1 >= 0) { // checking moves to the left
            if (gameState[squareX+playerTurn][squareY-1] === 0) {
                legalLocal[squareX+playerTurn][squareY-1] = 'legal'
            }
            if (squareX+playerTurn*2 >= 0 && squareX+playerTurn*2 <8 ) {
                if (((gameState[squareX+playerTurn][squareY-1] === playerTurn*-1) || (gameState[squareX+playerTurn][squareY-1] === playerTurn*-2)) && gameState[squareX+(playerTurn*2)][squareY-2] === 0) {
                    legalLocal[squareX+(playerTurn*2)][squareY-2] = 'jump'
                }
            }
        }
    }
    // Reverse Moves
    if (pieceSelected.value === 2 || pieceSelected.value === -2) {
        if (squareX-playerTurn < 8 && squareX-playerTurn >= 0) { // X boundary
            if (squareY+1 < 8) {// checking moves to the right

                if (gameState[squareX-playerTurn][squareY+1] === 0) {
                    legalLocal[squareX-playerTurn][squareY+1] = 'legal'
                }
                if (squareX+(playerTurn*-2) >=0 && squareX+(playerTurn*-2) <8 ) {
                    if (((gameState[squareX-playerTurn][squareY+1] === playerTurn*-1) || (gameState[squareX-playerTurn][squareY+1] === playerTurn*-2)) && (gameState[squareX-(playerTurn*2)][squareY+2] === 0)) {
                        legalLocal[squareX-(playerTurn*2)][squareY+2] = 'jump'
                    }
                }
            } 
            if (squareY-1 >= 0) { // checking moves to the left
                if (gameState[squareX-playerTurn][squareY-1] === 0) {
                    legalLocal[squareX-playerTurn][squareY-1] = 'legal'
                }
                if (squareX+(playerTurn*-2) >=0 && squareX+(playerTurn*-2) <8 ) {
                    if (((gameState[squareX-playerTurn][squareY-1] === playerTurn*-1) || (gameState[squareX-playerTurn][squareY-1] === playerTurn*-2)) && (gameState[squareX-(playerTurn*2)][squareY-2] === 0)) {
                        legalLocal[squareX-(playerTurn*2)][squareY-2] = 'jump'
                    }
            }
        }
        }
    }
}

function clearLegal () {
    legalLocal = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']]
    renderLegal()
}

function renderLegal () {
    // console.log(legalLocal)
    legalLocal.forEach(function(x, xi) {
        x.forEach(function (y, yi) {
            if (y !== '') {
                document.getElementById(xi.toString() + yi.toString()).classList.add('legal')
            } else {
                document.getElementById(xi.toString() + yi.toString()).classList.remove('legal')
            }
        })
    })
}

function capture (startSquare, endSquare) {
    let direction = delta(startSquare, endSquare)
    moveCount = -1
    if (playerTurn === -1) {
        player0.score += gameState[Math.floor(endSquare/10) - direction[0]/2][(endSquare%10) - direction[1]/2]
        player0.capturedEnemies++
    } else if (playerTurn === 1) {
        player1.score += (gameState[Math.floor(endSquare/10) - direction[0]/2][(endSquare%10) - direction[1]/2])*-1
        player1.capturedEnemies++
    }
    console.log(player0, player1)

    gameState[Math.floor(endSquare/10) - direction[0]/2][(endSquare%10) - direction[1]/2] = 0
    // add the piece to the captured tally and score

    

}

function jumpsOnly() {
    legalLocal.forEach(function(x) {
        x.forEach(function (y, yi) {
            if (y === 'legal') {
                x[yi] = ''
            }
        })
    })
}

function checkWinner(){
    if (player0.capturedEnemies === 12) {
        console.log ("player 0 WINS")
        winner = -1
    } else if (player1.capturedEnemies === 12) {
        console.log("player 1 WINS!")
        winner = 1
    }
    // if (checkAllLegal() === 0) {
    //     console.log("Player ", playerTurn*-1, "wins by lack of moves")
    //     winner = playerTurn*-1
    // }

    if (moveCount > drawAt) {
        console.log("Draw!")
        draw = true

    }

}

function checkAllLegal() {
    let moves = 0
    console.log("Checking moves for player ", playerTurn)
    gameState.forEach(function (x, xi) {
        x.forEach(function (y, yi) {
            if (y === playerTurn || y == playerTurn*2) {
                checkLegal(xi, yi)
                console.log("Checking moves on space ", xi, yi)
                if ( legalLocal.some(space => space.includes('jump')) || legalLocal.some(space => space.includes('legal')) ) {
                    console.log(playerTurn, "has moves available")
                    moves++ 
                }
            } 
        })
    })
    clearLegal()
    return moves
}

function init() {
    gameState = [
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [-1,0,-1,0,-1,0,-1,0],
    [0,-1,0,-1,0,-1,0,-1],
    [-1,0,-1,0,-1,0,-1,0]]

    clearSelected()
    clearLegal()
    playerTurn = -1
    player1 = {score: 0, capturedEnemies: 0}
    player0 = {score: 0, capturedEnemies: 0}
    moveCount = 0;
    winner = 0
    draw = false;
    render()

    player1status.innerHTML = ``
    player0status.innerHTML = ``
    
}