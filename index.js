let robot = require("robotjs");
const delay = require("delay");
const { captureImage } = require("./capture");

const screensize = robot.getScreenSize();
const startDelay = 5000;

let fishinstarted;
let finderId;
let repairCounter = 0;

const seizeFishin = async () => {
  if (!fishinstarted && findColor(91, 87, 76, 2, 40, 40, screensize.width / 2, 70)) {
    robot.mouseClick();
    fishinstarted = true;
    pullFish();
  }
};

const pullFish = () => {
  console.log("CALLED");
  let pullCount = 0;
  let pullerId = setInterval(async () => {
    if (pullCount < 14) {
      await pullOnce();
      pullCount++;
    } else {
      clearInterval(pullerId);
      fishinstarted = false;
      pullCount = 0;
    }
  }, 2000);
};

const pullOnce = async () => {
  robot.mouseToggle("down");
  await delay(1000);
  robot.mouseToggle("up");
};

const findColor = (targetR, targetG, targetB, failMargin, width, height, corX, corY, capture) => {
  const img = robot.screen.capture(corX, corY, width, height);
  for (let i = 0; i < width; i++) {
    for (let f = 0; f < height; f++) {
      const color = img.colorAt(i, f);
      const R = parseInt(color.substring(0, 2), 16);
      const G = parseInt(color.substring(2, 4), 16);
      const B = parseInt(color.substring(4, 6), 16);
      if (capture) {
        captureImage(img);
      }
      // target found
      if (
        R > targetR - failMargin &&
        R < targetR + failMargin &&
        G > targetG - failMargin &&
        G < targetG + failMargin &&
        B > targetB - failMargin &&
        B < targetB + failMargin
      ) {
        return true;
      }
    }
  }
};

const repair = async () => {
  await delay(5000);
  robot.keyTap("tab");
  await delay(1000);
  robot.moveMouse(screensize.width / 2 - 350, screensize.height - 50);
  await delay(1000);
  robot.mouseClick();
  await delay(1000);
  robot.moveMouse(screensize.width / 2 + 100, screensize.height / 2 + 120);
  await delay(1000);
  robot.mouseClick();
  await delay(1000);
  robot.keyTap("escape");
  await delay(2000);
  robot.keyTap("f3");
  await delay(2000);
};

const startIfStopped = async () => {
  if (findColor(240, 240, 240, 15, 20, 20, screensize.width / 2 - 10, screensize.height / 2 - 10)) {
    await delay(2900);
    if (findColor(240, 240, 240, 15, 20, 20, screensize.width / 2 - 10, screensize.height / 2 - 10)) {
      console.log("FOUND STOPPED");
      fishinstarted = true;
      repairCounter++;
      if (repairCounter > 200) {
        repairCounter = 0;
        await repair();
      }
      robot.mouseToggle("down");
      await delay(2000);
      robot.mouseToggle("up");
      await delay(900);

      fishinstarted = false;
    }
  }
};

finderId = setInterval(seizeFishin, 400);
setInterval(startIfStopped, 10000);
