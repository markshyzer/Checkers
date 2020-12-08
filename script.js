// Required Constants
 const drawAt = 20 /*call a draw if this many turns pass without capture*/


// Cache le DOM 
let board = document.getElementById('board')
let helpIcon = document.getElementById('helpicon')
let menubox = document.getElementById('menubox')

// Application variables
let gameState = [[0,0,0,0,0,0,0,0],[-1,0,0,0,0,0,0,0],[0,1,0,1,0,1,0,1],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[-1,0,-1,0,-1,0,-1,0],[0,0,0,0,0,0,0,0],[-1,0,-1,0,-1,0,-1,0]]
let pieceSelected = {x:0, y:0, value:0}
let coordString 
let gameStateX
let gameStateY
// let legalMoves = []
let playerTurn = -1
let legalLocal = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']]
let squareID;


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
        squareID = square.target.parentElement.id
    } else {
        squareID = square.target.id
    }
    gameStateX = Math.floor(squareID/10)
    gameStateY = squareID%10
    // squareInGameState = gameState[Math.floor(squareID/10)][squareID%10]
    console.log("There's a ", gameState[gameStateX][gameStateY], "piece here")
    // if (pieceSelected.x*10 + pieceSelected.y == squareID) {
    //     dropPiece(squareID)
    // }

    if (square.target.classList.contains('piece')) {
        console.log("Circle on square ", squareID)
        if ((pieceSelected.value === 0 && (playerTurn*gameState[Math.floor(squareID/10)][squareID%10]) >0 ) || pieceSelected.x*10 + pieceSelected.y == squareID ) {
            setPieceSelected(square)
        }
        // setPieceSelected(square.target.parentElement.id)
        // square.target.parentElement.classList.add('selected')

    // } else {    
    // console.log("Square ", squareID, "Class list ", square.target.classList)

    } else if (pieceSelected.value != 0) {
        // console.log("piece selected x y: ", pieceSelected.x, pieceSelected.y)
        // console.log("Delta: ", delta((pieceSelected.x*10+pieceSelected.y), squareID))
        if (legalLocal[gameStateX][gameStateY] === 'legal'){
            dropPiece(squareID)
        console.log("Piece selected value after dropping: ", pieceSelected.value)
        } else if (legalLocal[gameStateX][gameStateY] === 'jump') {
            console.log("Jump!")
            dropPiece(squareID)
        } else {
            console.log("Illegal move!")
        }
    }
})



function render() {
    console.log(gameState)
    gameState.forEach(function(x, xi){
        x.forEach(function (y, yi){
            // console.log(x[y])
            if (y == 1 || y == -1) {
                coordString += xi.toString()+ yi.toString()
                // console.log("Player value ", y)
                // console.log("Player position ", xi, yi)
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece" style="background-color:var(--player${y}color)"></div>`
            } else if (y == 2 || y == -2) {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece" class="king" style="background-color:var(--player${y*.5}color)">K</div>`
            } else {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = ``
            }

        })
    })
    
}

function setPieceSelected(square) {
    console.log("Set Square: ", square.target.parentElement.id)
    if (pieceSelected.x === Math.floor(square.target.parentElement.id/10) && pieceSelected.y === square.target.parentElement.id%10) {
        playerTurn *= -1
        dropPiece(square.target.parentElement.id)
    } else {
    console.log("Set Square: ", square.target.parentElement.id[0])
    pieceSelected.x = parseInt(square.target.parentElement.id[0])
    pieceSelected.y = parseInt(square.target.parentElement.id[1])
    pieceSelected.value = gameState[pieceSelected.x][pieceSelected.y]
    console.log ("pieceSelected: ", pieceSelected)
    if (pieceSelected.value*playerTurn > 0) {
        square.target.parentElement.classList.add('selected')
        checkLegal(pieceSelected.x, pieceSelected.y)
        renderLegal(pieceSelected.x, pieceSelected.y)
        // board.style.border = "thin solid white"
    }
    }
    
}

function clearSelected() {
    document.getElementById(`${pieceSelected.x.toString()}${pieceSelected.y.toString()}`).classList.remove('selected')
    pieceSelected.x =''
    pieceSelected.y =''
    pieceSelected.value = 0

}

function dropPiece(destinationSquare) {
    // if destinationSquare = pieceSelected
    // drop the piece and thats it 
    // clearSelected()
    // console.log("Destionation square :", destinationSquare, " Piece Selected: ", ((pieceSelected.x*10)+pieceSelected.y))
    // if (destinationSquare === ((pieceSelected.x*10)+pieceSelected.y) ) {
        clearSelected
    // } else {
        console.log("Destination square ", destinationSquare)
        gameState[pieceSelected.x][pieceSelected.y] = 0
        // console.log("Piece to drop: ", pieceSelected.x, pieceSelected.y)
        if ((destinationSquare > 67 && pieceSelected.value === 1) || (destinationSquare < 10 && pieceSelected.value === -1)) {
            pieceSelected.value *= 2
        } 
        gameState[Math.floor(destinationSquare/10)][destinationSquare%10] = pieceSelected.value
        // console.log(pieceSelected.x.toString(), pieceSelected.y.toString())
        
        console.log("piece dropped at ", destinationSquare)
        clearSelected()
        clearLegal()
        render()
        playerTurn *= -1

    // }

}

function delta(start, end) {
    console.log("Start coord: ", start, "End coord: ", end)
    return [Math.floor(end/10) - Math.floor(start/10), (end %10) - (start %10)]
}

function checkLegal (squareX, squareY) {
    // clearLegal()
    // console.log("square X: ", squareX, "square Y: ", squareY)
    if (squareX+playerTurn < 8 && squareX+playerTurn >= 0) { // X boundary
        if (squareY+1 < 8) {// right Y boundary

            if (gameState[squareX+playerTurn][squareY+1] === 0) {

                legalLocal[squareX+playerTurn][squareY+1] = 'legal'
            }
            if ((squareX+playerTurn*2 >=0 && squareX+playerTurn*2 <8 ) && gameState[squareX+playerTurn][squareY+1] === playerTurn*-1 && gameState[squareX+(playerTurn*2)][squareY+2] === 0) {
                legalLocal[squareX+(playerTurn*2)][squareY+2] = 'jump'
            }
        }
        if (squareY-1 >= 0) { // left Y boundary
            if (gameState[squareX+playerTurn][squareY-1] === 0) {
                legalLocal[squareX+playerTurn][squareY-1] = 'legal'
            }
            
            if ((squareX+playerTurn*2 >=0 && squareX+playerTurn*2 <8 ) && gameState[squareX+playerTurn][squareY-1] === playerTurn*-1 && gameState[squareX+(playerTurn*2)][squareY-2] === 0) {
                legalLocal[squareX+(playerTurn*2)][squareY-2] = 'jump'
            }
        }
    }
    // if the value of the square at x:player and y:+/-1 = 0, it's legal
    // if value > 1 or <-1, then if the value of the square at x(player*-1) and y:+-1 is 0, it's legal
    // if the value of the square at xplayer and y:+/-1 = player*-1, if the value of the square at x:player*2 y:(+or-)1 is 0, it's legal (and a jump!) 
}

function clearLegal () {
    legalLocal = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']]
    renderLegal()
}


function renderLegal (squareX, squareY) {
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