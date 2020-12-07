// Required Constants
 const drawAt = 20 /*call a draw if this many turns pass without capture*/


// Cache le DOM 
let board = document.getElementById('board')
let helpIcon = document.getElementById('helpicon')
let menubox = document.getElementById('menubox')

// Application variables
let gameState = [[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1],[0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[-1,0,-1,0,-1,0,-1,0],[0,-1,0,-1,0,-1,0,-1],[-1,0,-1,0,-1,0,-1,0]]
let pieceSelected = {x:0, y:0, value:0}
let coordString 
// let legalMoves = []
let playerTurn = -1
let legalLocal = [['','','','',''],['','','','','',],['','','','','',],['','','','','',],['','','','','',]]
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

    if (square.target.classList.contains('piece')) {
        console.log("Circle on square ", squareID)
        if (pieceSelected.value === 0 || (pieceSelected.x*10 + pieceSelected.y) == squareID) {
            setPieceSelected(square)
        }
        // setPieceSelected(square.target.parentElement.id)
        // square.target.parentElement.classList.add('selected')

    // } else {    
    // console.log("Square ", squareID, "Class list ", square.target.classList)

    } else if (pieceSelected.value != 0) {
        // console.log("piece selected x y: ", pieceSelected.x, pieceSelected.y)
        console.log("Delta: ", delta((pieceSelected.x*10+pieceSelected.y), squareID))
        dropPiece(squareID)
        console.log("Piece selected value after dropping: ", pieceSelected.value)
    }
})



function render() {
    console.log(gameState)
    gameState.forEach(function(x, xi){
        x.forEach(function (y, yi){
            // console.log(x[y])
            if (y !== 0) {
                coordString += xi.toString()+ yi.toString()
                // console.log("Player value ", y)
                // console.log("Player position ", xi, yi)
                document.getElementById(xi.toString() + yi.toString()).innerHTML = `<div class="piece" style="background-color:var(--player${y}color)">`
            } else {
                document.getElementById(xi.toString() + yi.toString()).innerHTML = ``
            }

        })
    })
    
}

function setPieceSelected(square) {
    if (pieceSelected.x === Math.floor(square.target.parentElement.id/10) && pieceSelected.y === square.target.parentElement.id%10) {
        dropPiece(square.target.parentElement.id)
    } else {
        pieceSelected.x = Math.floor(square.target.parentElement.id/10)
        pieceSelected.y = square.target.parentElement.id%10
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
        console.log("Destionation square ", destinationSquare)
        gameState[pieceSelected.x][pieceSelected.y] = 0
        // console.log("Piece to drop: ", pieceSelected.x, pieceSelected.y)
        gameState[Math.floor(destinationSquare/10)][destinationSquare%10] = pieceSelected.value
        // console.log(pieceSelected.x.toString(), pieceSelected.y.toString())

        console.log("piece dropped at ", destinationSquare)
        clearSelected()
        // clearLegal()
        render()

    // }

}

function delta(start, end) {
    console.log("Start coord: ", start, "End coord: ", end)
    return [Math.floor(end/10) - Math.floor(start/10), (end %10) - (start %10)]
}

function checkLegal (squareX, squareY) {
    // clearLegal()
    console.log("square X: ", squareX, "square Y: ", squareY)
    if (squareX+playerTurn < 8 && squareX+playerTurn >= 0) { // X boundary
        if (squareY+1 < 8) {// right Y boundary
            // console.log("SquareY <8: ", squareY)
            if (gameState[squareX+playerTurn][squareY+1] === 0) {
                // console.log(squareX, playerTurn, squareY)
                // console.log(gameState[squareX+playerTurn][squareY+1])
                legalLocal[playerTurn+2][3] = 'legal'
                // console.log("legal right move at relative ", playerTurn, +1, "absolute ", (squareX+playerTurn), (squareY+1))
            }
            if (gameState[squareX+playerTurn][squareY+1] === playerTurn*-1 && gameState[squareX+(playerTurn*2)][squareY+2] === 0) {
                legalLocal[(playerTurn*2)+2][4] = 'jump'
                // [squareX+(playerTurn*2)][squareY+2]
            }
        }
        if (squareY-1 >= 0) { // left Y boundary
            if (gameState[squareX+playerTurn][squareY-1] === 0) {
                legalLocal[playerTurn+2][1] = 'legal'
                // console.log("legal left move at relative ", playerTurn, -1)
            }
            if (gameState[squareX+playerTurn][squareY-1] === playerTurn*-1 && gameState[squareX+(playerTurn*2)][squareY-2] === 0) {
                legalLocal[(playerTurn*2)+2][-0] = 'jump'
            }
        }
    }
    // if the value of the square at x:player and y:+/-1 = 0, it's legal
    // if value > 1 or <-1, then if the value of the square at x(player*-1) and y:+-1 is 0, it's legal
    // if the value of the square at xplayer and y:+/-1 = player*-1, if the value of the square at x:player*2 y:(+or-)1 is 0, it's legal (and a jump!) 
}

function clearLegal () {
    legalLocal = [['','','','','',],['','','','','',],['','','','','',],['','','','','',],['','','','','',]]
    renderLegal()
}


function renderLegal (squareX, squareY) {
    console.log(legalLocal)
    legalLocal.forEach(function(x, xi) {
        x.forEach(function (y, yi) {
            if (y !== '') {
                document.getElementById((squareX-2+xi).toString() + (squareY-2+yi).toString()).classList.add('legal')
            } else {
                document.getElementById((squareX-2+xi).toString() + (squareY-2+yi).toString()).classList.remove('legal')
            }
        })
    })
}