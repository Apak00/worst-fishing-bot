let robot = require("robotjs");
const delay = require("delay");
const { captureImage } = require("./capture");

const screensize = robot.getScreenSize();
const startDelay = 5000;

let fishinstarted;
let finderId;
let repairCounter = 0;

const seizeFishin = async () => {
  if (!fishinstarted && isThereMouseIcon()) {
    robot.mouseToggle("down");
    fishinstarted = true;
    await pullFish();
  }

  setTimeout(seizeFishin, 500);
};

const pullFish = async () => {
  console.log("PULL");
  repairCounter++;

  let pullCount = 0;
  while (pullCount < 8) {
    pullCount++;
    robot.mouseToggle("down");
    await delay(2000);
    robot.mouseToggle("up");
    await delay(1300);
  }
  pullCount = 0;
  fishinstarted = false;
};

const findColor = (targetR, targetG, targetB, failMargin, width, height, corX, corY, capture) => {
  const img = robot.screen.capture(corX, corY, width, height);
  if (capture) {
    captureImage(img);
  }
  for (let i = 0; i < width; i++) {
    for (let f = 0; f < height; f++) {
      const color = img.colorAt(i, f);
      const R = parseInt(color.substring(0, 2), 16);
      const G = parseInt(color.substring(2, 4), 16);
      const B = parseInt(color.substring(4, 6), 16);
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
  return false;
};

const repair = async () => {
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
  if (isCrossHairOn() && !fishinstarted) {
    console.log("FOUND STOPPED", repairCounter);
    fishinstarted = true;
     robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y + 150);

    if (repairCounter > 20) {
      await delay(2000);
      repairCounter = 0;
      await repair();
    }

    robot.mouseToggle("down");
    await delay(2000);
    robot.mouseToggle("up");
    await delay(1000);

    fishinstarted = false;
    setTimeout(startIfStopped, 5000);
  }
};

const isCrossHairOn = () => {
  return findColor(248, 248, 248, 8, 20, 20, screensize.width / 2 - 10, screensize.height / 2 - 10);
};

const isThereMouseIcon = () => {
  return findColor(91, 87, 76, 1, 40, 20, screensize.width / 2, 60);
};

// Recursive setTimeout for that async operations in function body, instead of setInterval
seizeFishin();
setInterval(startIfStopped, 5000);

// Did this inside the source of robotjs https://github.com/octalmage/robotjs/issues/252 and rebuild robotjs
