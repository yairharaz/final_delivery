'use strict';
const MINE = '💣';
const WINNER = '😎';
const LOOSER = '😮';
const NORMAL = '😃';
const FLAG = '🚩';
const LIFE = '💔';

var gBoard;
var gLevel;
var gGame;
var gIsFirstClick;
var gStartTime;
var gStopwatchIntervalId;
var gCount;
var gLastClick;
var gCountMinesHit;
var gLifeRemained;
var gElLifes;
var gLifePass;




function init(diff, mines) {
    gGame = {
        isOn: false,
        showCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gLastClick = true;
    gIsFirstClick = true;
    gCount = 0;
    gCountMinesHit = 0;
    gLifeRemained = 2;
    gLifePass = 1;
    gElLifes = document.querySelectorAll('.life');
    for (var i = 0; i < gElLifes.length; i++) {
        gElLifes[i].innerHTML = LIFE;
        gElLifes[i].style.display = '';
    }
    updateLevel(diff, mines);
    gBoard = buildBoard(diff);
    renderBoard(gBoard);
    document.querySelector('.imoge').innerHTML = NORMAL;
    clearInterval(gStopwatchIntervalId);


}

function updateLevel(size, mines) {
    gLevel = {
        size: size,
        mines: mines
    }
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell ${cell.isMine} cell-${cell.isShown}`;
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id ="${tdId}" class="${className}" onmousedown="cellclicked(this,event,${i},${j})"></td>`
        }
        strHTML += '</tr>';
    }
    var elTbody = document.querySelector('tbody');
    elTbody.innerHTML = strHTML;
    var elMineCells = document.querySelectorAll('.true');
    for (var i = 0; i < elMineCells.length; i++) {
        elMineCells[i].innerHTML = `<span>${MINE}</span>`;
        var elSpan = document.querySelector('span');
        elSpan.style.display = '';
    }
}

function getNegsNum(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            var neighborsMinesSum = setMinesNegsCount(i, j, board);
            var neighborsMinesSumHTML = neighborsMinesSum;
            if (neighborsMinesSum === 0) neighborsMinesSumHTML = '';
            gBoard[i][j].minesAroundCount = neighborsMinesSum;
            var elCell = document.getElementById(`cell-${i}-${j}`);
            elCell.innerText = neighborsMinesSumHTML;
        }
    }
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var neighborsMinesSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsMinesSum++;
        }
    }
    return neighborsMinesSum
}

function cellclicked(elCell, event, i, j) {


    if (gCount === gLevel.size ** 2) return;
    if (!gLastClick) return;
    switch (event.which) {
        case 1:
            console.log(gIsFirstClick);
            if (gBoard[i][j].isMarked) return;
            getNegsNum(gBoard);
            if (gIsFirstClick) {
                gIsFirstClick = false;
                console.log(gIsFirstClick);
                gBoard[i][j].isShown = true;
                expandShown(gBoard, i, j);
                elCell.style.backgroundColor = 'white';
                gStartTime = Date.now();
                gStopwatchIntervalId = setInterval(getGameTime, 100);
            } else if (!gBoard[i][j].isMine) {
                if (!gBoard[i][j].isShown) {
                    gCount++
                    gBoard[i][j].isShown = true;
                }
                if (gBoard[i][j].minesAroundCount === '') {
                    revealNegs(i, j);
                }
                elCell.style.backgroundColor = 'white';
            } else if (gLifeRemained !== 0) {
                var elLife = document.querySelector(`.life-${gLifePass}`);
                elLife.style.display = 'none';
                gLifePass++
                var elSpans = document.querySelectorAll('span');
                for (var j = 0; j < elSpans.length; j++) {
                    elSpans[j].style.display = 'block';
                }
                setTimeout(function () {
                    for (var idx = 0; idx < elSpans.length; idx++) {
                        elSpans[idx].style.display = 'none';
                    }
                    elMines = document.querySelectorAll('.true');
                    for (var i = 0; i < elMines.length; i++) {
                        elMines[i].style.backgroundColor = 'gray';
                    }
                }, 500);


                gLifeRemained--

            } else {
                var elLife = document.querySelector(`.life-${gLifePass}`);
                elLife.style.display = ('none');
                var elMines = document.querySelectorAll('.true');
                for (var i = 0; i < elMines.length; i++) {
                    elMines[i].style.backgroundColor = 'red';
                }
                var elSpans = document.querySelectorAll('span');
                for (var j = 0; j < elSpans.length; j++) {
                    elSpans[j].style.display = 'block';
                }
                document.querySelector('.imoge').innerHTML = LOOSER;
                clearInterval(gStopwatchIntervalId);
                gLastClick = false;
            }
            if (gCount === gLevel.size ** 2) {
                document.querySelector('.imoge').innerHTML = WINNER;
                clearInterval(gStopwatchIntervalId);
            }
            break;
        case 3:
            elCell.addEventListener('contextmenu', event => event.preventDefault())
            if (!gBoard[i][j].isMarked) {
                gBoard[i][j].isMarked = true;
                elCell.innerHTML += FLAG;
                gCount++
            } else {
                gBoard[i][j].isMarked = false;
                elCell.innerHTML = '';
                gCount--
            }
            if (gCount === gLevel.size ** 2) {
                document.querySelector('.imoge').innerHTML = WINNER;
                clearInterval(gStopwatchIntervalId);
            } break;
    }
    console.log(gCount);
}

function getRandomMinesLocation(cellI, cellJ) {
    for (var i = 0; i < gLevel.mines; i++) {
        var coordI = getRandomIntInclusive(0, gLevel.size - 1)
        var coordJ = getRandomIntInclusive(0, gLevel.size - 1)
        if (coordI === cellI && coordJ === cellJ) continue;
        if (gBoard[coordI][coordJ].isShown) continue;
        gBoard[coordI][coordJ].isMine = true;
    }
}

function revealNegs(cellI, cellJ) {
    var elCells = []   //
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) continue;
            if (gBoard[i][j].isShown) continue;
            gBoard[i][j].isShown = true;
            elCells.push(document.getElementById(`cell-${i}-${j}`));//
            gCount++
        }
    }
    for (var i = 0; i < elCells.length; i++) {
        var elCell = elCells[i]
        elCell.style.backgroundColor = 'white';
    }
}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            gBoard[i][j].isMine = false;
            gBoard[i][j].isShown = true;
            var elNegCell = document.getElementById(`cell-${i}-${j}`);
            elNegCell.style.backgroundColor = 'white';
            gCount++
        }
    }
    getRandomMinesLocation(cellI, cellJ);
    renderBoard(gBoard);
}


// (cell.isMine) ? span = `<span class="mine-${board[i]}-${board[j]}"></span>` : span = `<span class="noMine-${board[i]}-${board[j]}"></span>`


