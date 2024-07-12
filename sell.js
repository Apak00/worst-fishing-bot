let robot = require("robotjs");
const delay = require("delay");
let counter = 0;

async function sellAlbionItems() {
  robot.moveMouse(1300, 430);
  await delay(88);
  robot.mouseClick();
  await delay(88);
  robot.moveMouse(830, 640);
  await delay(88);
  robot.mouseClick();
  await delay(88);
  robot.moveMouse(1130, 740);
  await delay(88);
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

start();
