let robot = require("robotjs");
const delay = require("delay");
const { captureImage } = require("./capture");

const screensize = robot.getScreenSize();
const startDelay = 5000;

let fishinstarted;
let finderId;
let repairCounter = 0;

const seizeFishin = async () => {
  if (!fishinstarted && findColor(91, 87, 76, 2, 40, 40, screensize.width / 2 - 20, 70)) {
    robot.mouseToggle("down");
    fishinstarted = true;
    pullFish();
  }
};

const pullFish = async () => {
  console.log("CALLED");
  repairCounter++;

  let pullCount = 0;

  let pullerId = setInterval(async () => {
    if (pullCount < 10) {
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
  await delay(1200);
  robot.mouseToggle("up");
};

const findColor = (targetR, targetG, targetB, failMargin, width, height, corX, corY) => {
  const img = robot.screen.capture(corX, corY, width, height);
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
let firstTime = true;

const startIfStopped = async () => {
  if (findColor(240, 240, 240, 15, 20, 20, screensize.width / 2 - 10, screensize.height / 2 - 10)) {
    await delay(2900);
    if (findColor(240, 240, 240, 15, 20, 20, screensize.width / 2 - 10, screensize.height / 2 - 10)) {
      console.log("FOUND STOPPED");
      fishinstarted = true;
      robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y + 150);
      await delay(500);

      if (repairCounter > 10) {
        repairCounter = 0;
        await repair();
      }

      robot.mouseToggle("down");
      await delay(2000);
      robot.mouseToggle("up");
      await delay(2000);

      fishinstarted = false;
    }
  }
};

finderId = setInterval(seizeFishin, 400);
setInterval(startIfStopped, 5000);

// const myTest = async () => {
//   await delay(2000);
//   robot.moveMouse(robot.getMousePos().x, robot.getMousePos().y + 300);
// };
// myTest();

// Did this inside the source of robotjs https://github.com/octalmage/robotjs/issues/252
