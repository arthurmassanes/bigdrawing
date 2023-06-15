
let gui, guiDiv, button;
var socket;
var isHoveringGui = false;

const WHITE = "FFFFFF";
const GUI_CLASS = '.qs_main';

var strokeWidth = 3;
var strokeWidthMin = 1;
var strokeWidthMax = 100;
var strokeWidthStep = 1;

const xOffset = -9; // make the end of cursor match the drawing point on the image
const yOffset = 25;


var strokeColor = [0, 30, 0];

var Erase = false;

function setup() {
    createCanvas(4000, 3000);
    background(WHITE)
    frameRate(100);
    setupGui();
    socket.on("welcome", setupCanvas)
    socket.on("draw", onReceiveDrawEvent)
}

const setupGui = () => {
    gui = createGui('Settings');
    gui.addGlobals("strokeColor", "strokeWidth", "Erase");
    guiDiv = select(GUI_CLASS);
    button = createButton('Save as a PNG')
    button.parent(guiDiv)
    button.mousePressed(onClickSave)
    noStroke();
    printInstructions();
}

const printInstructions = () => {
    fill("#FF0040")
    stroke(WHITE);
    strokeWeight(1);
    textSize(20);
    text("Welcome to the bigdrawing!\nClick and drag your mouse to start drawing\n\nby arthur", 50, 250)
}

function onClickSave() {
    saveCanvas('canvas', 'png');
}

const setupCanvas = (data) => { // place the pixels already drawn to canvas
    data.map((p) => onReceiveDrawEvent(p))   
}

const onReceiveDrawEvent = (data) => {
    const {
        color,
        strokeWidth,
        mouseX,
        mouseY,
        pmouseX,
        pmouseY
    } = data;

    stroke(color);
    strokeWeight(strokeWidth);
    line(mouseX, mouseY, pmouseX, pmouseY)
}

const onMouseOver = () => {
    isHoveringGui = true;
}

const onMouseOut = () => {
    isHoveringGui = false;
}

const checkIsHoveringGui = () => {
    var guiBox = select(GUI_CLASS);

    guiBox.mouseOver(onMouseOver);
    guiBox.mouseOut(onMouseOut);
}

const drawAtMousePos = () => {
    const color = Erase ? WHITE : strokeColor;
    checkIsHoveringGui();
    if (isHoveringGui) return;
    stroke(color)
    strokeWeight(strokeWidth);
    line(mouseX + xOffset, mouseY + yOffset, pmouseX + xOffset, pmouseY + yOffset);
    socket.emit("draw", {
        color,
        strokeWidth,
        mouseX: mouseX + xOffset,
        mouseY: mouseY + yOffset,
        pmouseX: pmouseX + xOffset,
        pmouseY: pmouseY + yOffset
    })
}

function draw() {
    if (mouseIsPressed) drawAtMousePos();
    Erase ? cursor("assets/eraser.png") : cursor("assets/pencil.png", 0, 0)
}
