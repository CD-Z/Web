let crx = document.getElementById("playfield");
let nextBlock = document.getElementById("nextBlock");
let scoreBox = document.getElementById("scoreBox");
let body = document.getElementById("body");
let containmentDiv = document.getElementById("containmentDiv")
let ctx;
let place;
let placedComponents = [];
let moveForward = [false, false];
let moveForwardX = [false, false];
let shape = ["4", "1,3", "1,3r", "2,2", "2,2r", "2q", "3,1"]
let time = {x: 0, y: 0, z: 0};
let goFaster = 30;
let usedPiece;
let move;
let moveXLet;
let Stop;
let form;
let getBack1X;
let getBack2X;
let getBack3X;
let getBack1Y;
let getBack2Y;
let getBack3Y;
let spawnOrder = [];
let spawnThisRound;
let spawnNextRound;
let score = 0;
let nextBlockToShow = [];


function resize() {
    place = Math.round((window.innerHeight / 2) / 10);
    crx.width = place * 10 - 2;
    crx.height = place * 16 - 2;
    crx.style["marginTop"] = (window.innerHeight - crx.height) / 2 - 10 + "px";
    crx.style["marginLeft"] = "auto";
    nextBlock.width = place * 4 + 20;
    nextBlock.height = place * 2 + 20;
    nextBlock.style["marginTop"] = (window.innerHeight - crx.height) / 2 - 10 + "px";
    nextBlock.style["marginLeft"] = 5 + "px";
    scoreBox.width = nextBlock.width;
    scoreBox.height = nextBlock.height;
    scoreBox.textContent = "Score: " + score;
    scoreBox.style["textAlign"] = "left";
    scoreBox.style["marginLeft"] = 8 + "px";
    containmentDiv.style["marginRight"] = "auto";
}

let myGamePiece = [];

function startGame() {
    resize();
    myGameArea.start();
    randomOrder();
    spawnBlocks();
    window.addEventListener('keydown', function (e) {
        e.preventDefault();
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = (e.type === "keydown");
    })
    window.addEventListener('keyup', function (e) {
        myGameArea.keys[e.keyCode] = (e.type === "keydown");
    })
}

let myGameArea = {

    start: function () {
        this.context = crx.getContext("2d");
        document.body.insertBefore(crx, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1000 / 30);
    },
    clear: function () {
        this.context.clearRect(0, 0, crx.width, crx.height);
    },
    keys: []
}

function Block(color, x, y, status, mainBlock, show) {
    console.log(show)
    this.width = place;
    this.height = place;
    this.x = x;
    this.y = y;
    this.status = status;
    this.color = color;
    this.mainBlock = mainBlock;
    this.show = show;
    this.place = 0;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width - 2, this.height - 2);
    }
    this.moveY = function () {
        if (myGameArea.keys && myGameArea.keys[40]) {
            goFaster = 2
        }
        if (time["y"] >= goFaster) {
            moveY();
            time["y"] = 0;
            goFaster = 30;
        }
    }
    this.moveX = function () {
        if (myGameArea.keys && myGameArea.keys[37]) {
            if (time["x"] >= 4) {
                moveX(-1);
                time["x"] = 0;
            }
        }

        if (myGameArea.keys && myGameArea.keys[39]) {
            if (time["x"] >= 4) {
                moveX(1);
                time["x"] = 0;
            }
        }
        if (myGameArea.keys && myGameArea.keys[38]) {
            if (time["z"] >= 6) {
                rotateMyGamePiece();
                time["z"] = 0;
            }
        }

    }
}

function randomOrder() {
    let numbers = [0, 1, 2, 3, 4, 5, 6];
    for (let i = 0; i < 7; i++) {
        let randomNumber = Math.floor(Math.random() * numbers.length);
        spawnOrder.push(numbers[randomNumber]);
        numbers.splice(randomNumber, 1);
    }
    if (spawnNextRound === undefined) {
        spawnNextRound = spawnOrder.pop();
    }
}

function giveForm() {
    spawnThisRound = spawnNextRound;
    spawnNextRound = spawnOrder.pop();
    if (spawnOrder.length === 0) {
        randomOrder();
    }
    showNextBlock();
    return shape[spawnThisRound];
}

function spawnBlocks() {
    form = giveForm();//shape[Math.floor(Math.random() * 7)];

    switch (form) {
        case "4":
            myGamePiece = [
                new Block("blue", place * 6, -place, 1, true),
                new Block("blue", place * 3, -place, 1, false),
                new Block("blue", place * 4, -place, 1, false),
                new Block("blue", place * 5, -place, 1, false)
            ]
            break;
        case "1,3":
            myGamePiece = [
                new Block("green", place * 4, -place*2, 1, false),
                new Block("green", place * 4, -place, 1, false),
                new Block("green", place * 6, -place, 1, false),
                new Block("green", place * 5, -place, 1, true)
            ]
            break;
        case "1,3r":
            myGamePiece = [
                new Block("orange", place * 6, -place*2, 1, false),
                new Block("orange", place * 6, -place, 1, false),
                new Block("orange", place * 4, -place, 1, false),
                new Block("orange", place * 5, -place, 1, true)
            ]
            break;
        case "2,2":
            myGamePiece = [
                new Block("yellow", place * 5, -place, 1, true),
                new Block("yellow", place * 5, -place*2, 1, false),
                new Block("yellow", place * 6, -place, 1, false),
                new Block("yellow", place * 4, -place*2, 1, false)
            ]
            break;
        case "2,2r":
            myGamePiece = [
                new Block("magenta", place * 5, -place*2, 1, false),
                new Block("magenta", place * 5, -place, 1, true),
                new Block("magenta", place * 6, -place*2, 1, false),
                new Block("magenta", place * 4, -place, 1, false)
            ]
            break;
        case "2q":
            myGamePiece = [
                new Block("purple", place * 5, -place, 1, true),
                new Block("purple", place * 6, -place, 1, false),
                new Block("purple", place * 5, -place*2, 1, false),
                new Block("purple", place * 6, -place*2, 1, false)
            ];
            break;
        case "3,1":
            myGamePiece = [
                new Block("purple", place * 5, -place, 1, true),
                new Block("purple", place * 6, -place, 1, false),
                new Block("purple", place * 4, -place, 1, false),
                new Block("purple", place * 5, -place*2, 1, false)
            ];
            break;
    }

}

function rotateMyGamePiece() {
    myGamePiece.sort(function (a, b) {
        return a.x - b.x
    });
    myGamePiece.sort(function (a, b) {
        return a.y - b.y
    });
    switch (form) {
        case "1":

            break;
        case "4":
            switch (myGamePiece[0].status) {
                case 1:
                    changeThePositionOfBlocks(0, 1, 3,
                        myGamePiece[2].x, myGamePiece[2].x, myGamePiece[2].x,
                        myGamePiece[0].y - place * 2, myGamePiece[1].y - place, myGamePiece[3].y + place,
                        2);
                    break;
                case 2:
                    changeThePositionOfBlocks(0, 1, 3,
                        myGamePiece[0].x + place * 2, myGamePiece[1].x + place, myGamePiece[3].x - place,
                        myGamePiece[2].y, myGamePiece[2].y, myGamePiece[2].y,
                        3);
                    break;
                case 3:
                    changeThePositionOfBlocks(0, 2, 3,
                        myGamePiece[1].x, myGamePiece[1].x, myGamePiece[1].x,
                        myGamePiece[0].y - place, +myGamePiece[2].y + place, myGamePiece[3].y + place * 2,
                        4);
                    break;
                case 4:
                    changeThePositionOfBlocks(0, 1, 3,
                        myGamePiece[0].x + place, myGamePiece[1].x - place, myGamePiece[3].x - place * 2,
                        myGamePiece[2].y, myGamePiece[2].y, myGamePiece[2].y,
                        1);
                    break;
            }
            break;
        case "1,3":
            rotateSimple()
            break;
        case "1,3r":
            rotateSimple()
            break;
        case "2,2":
            rotateSimple()
            break;
        case "2,2r":
            rotateSimple()
            break;
        case "2q":
            break;
        case "3,1":
            rotateSimple()
            break;
    }
}

function changeThePositionOfBlocks(Part1, Part2, Part3, xChange1, xChange2, xChange3, yChange1, yChange2, yChange3, newStatus) {
    setGetBack(myGamePiece[Part1], myGamePiece[Part2], myGamePiece[Part3]);
    myGamePiece[Part1].x = xChange1;
    myGamePiece[Part2].x = xChange2;
    myGamePiece[Part3].x = xChange3;

    myGamePiece[Part1].y = yChange1;
    myGamePiece[Part2].y = yChange2;
    myGamePiece[Part3].y = yChange3;

    checkIfRotateIsPossible(Part1, Part2, Part3, newStatus);
}

function rotateSimple() {
    let changeOfPosition = [
        new PositionObject(place * 2, 0), new PositionObject(place, place),
        new PositionObject(0, place * 2), new PositionObject(place, -place),
        new PositionObject(0, 0), new PositionObject(-place, place),
        new PositionObject(0, -place * 2), new PositionObject(-place, -place),
        new PositionObject(-place * 2, 0),
    ]
    let mainBlock;
    let backPiece = [0, 0, 0, 0];
    let number = 0;
    myGamePiece.forEach(function (value, index, array) {
        if (value.mainBlock) {
            mainBlock = value;
            backPiece[3] = index;
        } else {
            backPiece[number] = index;
            number++;
        }
    })
    setGetBack(myGamePiece[backPiece[0]], myGamePiece[backPiece[1]], myGamePiece[backPiece[2]]);

    myGamePiece.forEach(function (value) {
        if (value.y < mainBlock.y) {
            value.place = checkPositionOnXAxis(value, mainBlock);
        } else if (value.y === mainBlock.y) {
            value.place = checkPositionOnXAxis(value, mainBlock) + 3;
        } else if (value.y > mainBlock.y) {
            value.place = checkPositionOnXAxis(value, mainBlock) + 6;
        }
        value.x += changeOfPosition[value.place].x;
        value.y += changeOfPosition[value.place].y;
    })
    checkIfRotateIsPossible(backPiece[0], backPiece[1], backPiece[2], 0);
}

function checkPositionOnXAxis(value, mainBlock) {
    if (value.x < mainBlock.x) {
        return 0;
    }
    if (value.x === mainBlock.x) {
        return 1;
    }
    if (value.x > mainBlock.x) {
        return 2;
    }
}

function PositionObject(x, y) {
    this.x = x;
    this.y = y;
}

function setGetBack(Part1, Part2, Part3) {
    getBack1Y = Part1.y;
    getBack2Y = Part2.y;
    getBack3Y = Part3.y;

    getBack1X = Part1.x;
    getBack2X = Part2.x;
    getBack3X = Part3.x;
}

function GetBack(Part1, Part2, Part3) {
    Part1.y = getBack1Y
    Part2.y = getBack2Y;
    Part3.y = getBack3Y;

    Part1.x = getBack1X;
    Part2.x = getBack2X;
    Part3.x = getBack3X;
}

function checkIfRotateIsPossible(Part1, Part2, Part3, newStatus) {
    if (checkPlacedY(myGamePiece[Part1].x, myGamePiece[Part1].y) === undefined || checkPlacedY(myGamePiece[Part2].x, myGamePiece[Part2].y) === undefined || checkPlacedY(myGamePiece[Part3].x, myGamePiece[Part3].y) === undefined ||
        myGamePiece[Part1].x === crx.width + 2 || myGamePiece[Part2].x === crx.width + 2 || myGamePiece[Part3].x === crx.width + 2 ||
        myGamePiece[Part1].x === -place || myGamePiece[Part2].x === -place || myGamePiece[Part3].x === -place) {
        GetBack(myGamePiece[Part1], myGamePiece[Part2], myGamePiece[Part3]);

    } else {
        myGamePiece.forEach(function (value) {
            value.status = newStatus;
        });
    }
}

function moveY() {
    placedComponents.sort(function (a, b) {
        return a.y - b.y
    });

    for (let i = 0; i < myGamePiece.length && !Stop; i++) {
        let value = myGamePiece[i];
        moveForward[1] = true;
        moveForward[0] = true;
        if (value.y + place === crx.height + 2) {
            moveForward[1] = false;
            Stop = true;
        }
        if (placedComponents.length > 0) {
            if (checkPlacedY(value.x, value.y) === undefined) {
                moveForward[0] = false;
            }
        }
    }

    if (moveForward[0] === true && moveForward[1] === true) {
        move = true;
    } else {
        placedComponents = myGamePiece.concat(placedComponents);
        checkFullRow();

        spawnBlocks();
        ctx = myGameArea.context;
        ctx.fillStyle = myGamePiece.color;
        ctx.fillRect(myGamePiece.x, myGamePiece.y, myGamePiece.width, myGamePiece.height);
        endGame();
    }
}

function endGame() {
    if (placedComponents.length > 0 && 0 >= placedComponents[0].y) {
        clearInterval(myGameArea.interval);
        myGamePiece[0].update();
        alert("You died");
        myGamePiece = null;
    }
}

function checkPlacedY(valuePieceX, valuePieceY) {
    placedComponents.forEach(function (value) {
        if (!Stop) {
            if (valuePieceX === value.x) {
                if (valuePieceY + place === value.y || valuePieceY === value.y) {
                    Stop = true;
                    return true
                }
            }
        }
    })
    if (!Stop) {
        return false
    }

}

function checkFullRow() {
    placedComponents.sort(function (a, b) {
        return a.y - b.y
    });
    let toBeSpliced = [];
    for (let i = 9; i < placedComponents.length; i++) {
        if (placedComponents[i].y === placedComponents[i - 9].y) {
            toBeSpliced.push(i);
            i += 9;
        }
    }
    for (let i = 0; i < toBeSpliced.length; i++) {

        placedComponents.forEach(function (valueI) {
            if (valueI.y < placedComponents[toBeSpliced[i]].y) {
                valueI.y += place;
            }
        })
    }
    for (let i = toBeSpliced.length - 1; i > -1; i--) {
        placedComponents.splice(toBeSpliced[i] - 9, 10);
        score += 20;
    }

}

function moveX(direct) {
    let StopX = false;
    moveForwardX[1] = true;
    moveForwardX[0] = true;
    myGamePiece.sort(function (a, b) {
        return a.x - b.x
    });
    if (direct > 0) {
        for (let i = 0; i < myGamePiece.length && !StopX; i++) {
            if (myGamePiece[i].x + place === crx.width + 2) {
                moveForwardX[1] = false;
                StopX = true;
            }
            if (placedComponents.length > 0) {
                placedComponents.forEach(function (value1) {
                    if (myGamePiece[i].y === value1.y) {
                        if (myGamePiece[i].x + place === value1.x) {
                            moveForwardX[0] = false;
                            StopX = true;
                        }
                    }
                });
            } else {
                moveForwardX[0] = true;
            }
        }
        if (moveForwardX[0] === true && moveForwardX[1] === true) {
            moveXLet = 1;
        }
    } else {
        for (let i = 0; i < myGamePiece.length && !StopX; i++) {
            if (myGamePiece[i].x === 0) {
                moveForwardX[1] = false;
                StopX = true;
            }
            if (placedComponents.length > 0) {
                placedComponents.forEach(function (value1) {
                    if (myGamePiece[i].y === value1.y) {
                        if (myGamePiece[i].x - place === value1.x) {
                            moveForwardX[0] = false;
                            StopX = true;
                        }
                    }
                });
            } else {
                moveForwardX[0] = true;
            }
        }
        if (moveForwardX[0] === true && moveForwardX[1] === true) {
            moveXLet = -1;
        }
    }
}


function placePlaced() {
    ctx = myGameArea.context;

    for (let i = 0; i + 1 <= placedComponents.length; i++) {
        ctx.fillStyle = placedComponents[i].color;
        ctx.fillRect(placedComponents[i].x, placedComponents[i].y,
            placedComponents[i].width - 2, placedComponents[i].height - 2);
    }
}

function showNextBlock() {
    form = shape[spawnNextRound];

    switch (form) {
        case "4":
            nextBlockToShow = [
                new Block("blue", 10 + place * 1, 10 + place / 2, 1, true, true),
                new Block("blue", 10 + place * 2, 10 + place / 2, 1, false, true),
                new Block("blue", 10 + place * 3, 10 + place / 2, 1, false, true),
                new Block("blue", 10, 10 + place / 2, 1, false, true)
            ]
            break;
        case "1,3":
            nextBlockToShow = [
                new Block("green", 10 + place / 2, place + 10, 1, false, true),
                new Block("green", 10 + place / 2, 10, 1, false, true),
                new Block("green", 10 + place / 2 + place * 2, 10, 1, false, true),
                new Block("green", 10 + place / 2 + place, 10, 1, true, true)
            ]
            break;
        case "1,3r":
            nextBlockToShow = [
                new Block("orange", 10 + place / 2 + place * 2, place + 10, 1, false, true),
                new Block("orange", 10 + place / 2 + place * 2, 10, 1, false, true),
                new Block("orange", 10 + place / 2, 10, 1, false, true),
                new Block("orange", 10 + place / 2 + place, 10, 1, true, true)
            ]
            break;
        case "2,2":
            nextBlockToShow = [
                new Block("yellow", 10 + place / 2 + place, 10, 1, true, true),
                new Block("yellow", 10 + place / 2 + place, place + 10, 1, false, true),
                new Block("yellow", 10 + place / 2 + place * 2, 10, 1, false, true),
                new Block("yellow", 10 + place / 2, place + 10, 1, false, true)
            ]
            break;
        case "2,2r":
            nextBlockToShow = [
                new Block("magenta", 10 + place / 2 + place, place + 10, 1, false, true),
                new Block("magenta", 10 + place / 2 + place, 10, 1, true, true),
                new Block("magenta", 10 + place / 2 + place * 2, place + 10, 1, false, true),
                new Block("magenta", 10 + place / 2, 10, 1, false, true)
            ]
            break;
        case "2q":
            nextBlockToShow = [
                new Block("purple", 10 + place , 10, 1, true, true),
                new Block("purple", 10 + place * 2, 10, 1, false, true),
                new Block("purple", 10 + place , place + 10, 1, false, true),
                new Block("purple", 10 + place * 2, place + 10, 1, false, true)
            ]
            break;
        case "3,1":
            nextBlockToShow = [
                new Block("purple", 10 + place / 2 + place, 10, 1, true, true),
                new Block("purple", 10 + place / 2 + place * 2, 10, 1, false, true),
                new Block("purple", 10 + place / 2, 10, 1, false, true),
                new Block("purple", 10 + place / 2 + place, place + 10, 1, false, true)
            ]
            break;
    }
    let dtw = nextBlock.getContext("2d");
    dtw.clearRect(0, 0, nextBlock.width, nextBlock.height);
    for (let i = 0; i < 4; i++) {
        dtw.fillStyle = nextBlockToShow[i].color;
        dtw.fillRect(nextBlockToShow[i].x, nextBlockToShow[i].y, place - 2, place - 2)
    }
}

function updateGameArea() {
    myGameArea.clear();
    placePlaced();
    move = false;
    Stop = false;

    for (i = 0; i < myGamePiece.length; i++) {
        usedPiece = myGamePiece[i];
        myGamePiece[i].update();
    }
    myGamePiece[0].moveX();
    myGamePiece[0].moveY();

    switch (moveXLet) {
        case 1:
            myGamePiece.forEach(function (value) {
                value.x += place;
            })
            break;
        case -1:
            myGamePiece.forEach(function (value) {
                value.x -= place;
            })
            break;
    }
    moveXLet = 0;
    if (move && !Stop) {
        myGamePiece.forEach(function (value) {
            value.y += place;
        })
    }
    time["y"]++;
    time["x"]++;
    time["z"]++;
    scoreBox.textContent = "Score: " + score;
}