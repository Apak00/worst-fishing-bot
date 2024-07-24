let robot = require("robotjs");
const delay = require("delay");
let counter = 0;

async function sellAlbionItems() {
  var mouse = robot.getMousePos();
  if (mouse.x > 1130) {
    stop();
  }
  robot.moveMouse(1300, 430);
  await delay(88);
  var mouse = robot.getMousePos();
  if (mouse.x > 1300) {
    stop();
  }
  robot.mouseClick();
  await delay(88);
  var mouse = robot.getMousePos();
  if (mouse.x > 1300) {
    stop();
  }
  robot.moveMouse(830, 640);
  await delay(88);
  var mouse = robot.getMousePos();
  if (mouse.x > 830) {
    stop();
  }
  robot.mouseClick();
  await delay(88);
  var mouse = robot.getMousePos();
  if (mouse.x > 830) {
    stop();
  }
  robot.moveMouse(1130, 740);
  await delay(88);
  var mouse = robot.getMousePos();
  if (mouse.x > 1130) {
    stop();
  }
  robot.mouseClick();

  counter++;
  if (counter < 48) {
    setTimeout(sellAlbionItems, 88);
  }
}

async function start() {
  await delay(2000);
  sellAlbionItems();
}

async function stop() {
  counter = 999999;
}

start();
