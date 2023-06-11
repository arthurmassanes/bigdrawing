
let gui, guiDiv, button;
var socket;
var hoverGui = false;

const WHITE = "FFFFFF";
const GUI_CLASS = '.qs_main';

var strokeWidth = 3;
var strokeWidthMin = 1;
var strokeWidthMax = 100;
var strokeWidthStep = 1;

var strokeColor = [0, 30, 0];

var Erase = false;

function setup() {
    createCanvas(4000, 3000);
    background(WHITE)
    frameRate(30);
    gui = createGui('Settings');
    gui.addGlobals("strokeColor", "strokeWidth", "Erase");
    guiDiv = select(GUI_CLASS);
    button = createButton('Save as a PNG')
    button.parent(guiDiv)
    button.mousePressed(onClickSave)
    noStroke();
    printInstructions();
    socket.on("welcome", setupCanvas)
    socket.on("draw", onReceiveDrawEvent)
}

const printInstructions = () => {
    fill("#FF0040")
    stroke(WHITE);
    strokeWeight(1);
    textSize(20);
    text("Welcome to free-drawer by arthur !\nClick and drag your mouse to start drawing", 50, 250)
}

function onClickSave() {
    saveCanvas('canvas', 'png');
}

const setupCanvas = (data) => { // place the pixels already drawn to canvas
    data.map((p) => onReceiveDrawEvent(p))   
}

const onReceiveDrawEvent = (data) => {
    stroke(data.color);
    strokeWeight(data.strokeWidth);
    line(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY)
}

const onMouseOver = () => {
    hoverGui = true;
}

const onMouseOut = () => {
    hoverGui = false;
}

const checkIsHoveringGui = () => {
    var guiBox = select(GUI_CLASS);

    guiBox.mouseOver(onMouseOver);
    guiBox.mouseOut(onMouseOut);
}

const drawAtMousePos = () => {
    let xOffset = -8; // make the end of cursor match the drawing point on the image
    let yOffset = 19;
    const color = strokeColor;//Erase ? WHITE : strokeColor;
    checkIsHoveringGui();
    if (hoverGui) return;
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
