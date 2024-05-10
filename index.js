let robot = require("robotjs");
const delay = require("delay");
const { captureImage } = require("./capture");
const { getAvgColor } = require("./getAvgColor");

// Did this inside the source of robotjs https://github.com/octalmage/robotjs/issues/252 and rebuild robotjs

const screensize = robot.getScreenSize();

const totemColor = {
  R: 243,
  G: 222,
  B: 196,
};
const totemFeather = {
  R: 254,
  G: 67,
  B: 42,
};
const greenBar = {
  R: 65,
  G: 119,
  B: 36,
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

const catchFish = async () => {
  if (isGreenBarOn()) {
    while (isCrossHairOn()) {
      robot.mouseToggle("down");
    }
    robot.mouseToggle("up");
    catchFish();
  } else {
    robot.mouseToggle("up");
    throwHook();
  }
};

const isCrossHairOn = () => {
  return findColor(totemColor.R, totemColor.G, totemColor.B, 20, 60, 10, screensize.width / 2 - 30, screensize.height / 2);
};
const isGreenBarOn = () => {
  return findColor(greenBar.R, greenBar.G, greenBar.B, 25, 50, 20, screensize.width / 2 - 50, screensize.height / 2);
};

let counter = 0;
const throwHook = async () => {
  console.log("THROW");
  let totemAvgColor = null;
  const randomRad = Math.PI + Math.PI * ((45 + Math.random() * 90) / 180);
  await delay(2000);
  counter++;
  if (counter % 12 === 0) {
    robot.keyTap("1");
  }
  if (counter % 120 === 0) {
    robot.moveMouse(screensize.width - 350, screensize.height / 2);
    await delay(100);
    robot.mouseClick("right");
  }

  await delay(2500);
  const rngTime = Math.random();
  const baseDistance = 260 + rngTime * 240;
  const coordinatesOfTotem = {
    x: screensize.width / 2 + Math.cos(randomRad) * baseDistance + Math.cos(randomRad) * 80,
    y: screensize.height / 2 + -Math.sin(randomRad) * baseDistance - Math.sin(randomRad) * 180 - 230,
  };
  robot.moveMouse(screensize.width / 2 + Math.cos(randomRad) * 210, screensize.height / 2 + -Math.sin(randomRad) * 210 - 100);
  await delay(100);
  robot.mouseToggle("down");
  await delay(300 + 400 * rngTime);
  robot.mouseToggle("up");
  await delay(2000);
  totemAvgColor = getAvgColor(80, 80, coordinatesOfTotem.x - 40, coordinatesOfTotem.y - 40, true);
  let newColor = null;
  let failMargin = 6;
  let searchCounter = 0;
  while (
    !newColor ||
    (newColor.G > totemAvgColor.G - failMargin &&
      newColor.G < totemAvgColor.G + failMargin &&
      newColor.B > totemAvgColor.B - failMargin &&
      newColor.B < totemAvgColor.B + failMargin &&
      searchCounter < 1700)
  ) {
    searchCounter++;
    newColor = getAvgColor(80, 80, coordinatesOfTotem.x - 40, coordinatesOfTotem.y - 40);
  }
  if (searchCounter > 1700) {
    return throwHook();
  }
  console.log("searchCounter: ", searchCounter);
  console.log("FOUND FISH: ", counter);
  await delay(500);
  robot.mouseToggle("down");
  await delay(150);
  catchFish();
};

throwHook();
