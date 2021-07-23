let robot = require("robotjs");
let Jimp = require("jimp");

const screensize = robot.getScreenSize();
const startDelay = 5000;
const width = 80;
const height = 40;
const corX = screensize.width / 2 - width / 2;
const corY = 50;
const targetR = 91;
const targetG = 87;
const targetB = 76;
const failMargin = 2;
let pullerId;
let finderId;
let pulling;

const fileName = "asd.png";

const main = () => {
  function screenCaptureToFile(robotScreenPic) {
    return new Promise((resolve, reject) => {
      try {
        const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
        let pos = 0;
        image.scan(
          0,
          0,
          image.bitmap.width,
          image.bitmap.height,
          (x, y, idx) => {
            /* eslint-disable no-plusplus */
            image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
            image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
            image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
            image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
            /* eslint-enable no-plusplus */
          }
        );
        resolve(image);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  const img = robot.screen.capture(corX, corY, width, height);

  screenCaptureToFile(img).then((res) => {
    res.write("asd.png");
  });
};

const findTarget = () => {
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
        if (!pulling) {
          console.log("TARGET FOUND");
          clearInterval(finderId);
          robot.mouseClick();
          pulling = true;
          pullerId = setInterval(pullFish, 1000);
        }
      }
    }
  }
};

const pullFish = () => {
  const img = robot.screen.capture(
    screensize.width / 2 - 250,
    0,
    500,
    screensize.height
  );

  let stopIndicator = 0;

  for (let i = 0; i < width; i++) {
    for (let f = 0; f < height; f++) {
      const color = img.colorAt(i, f);
      const R = parseInt(color.substring(0, 2), 16);
      const G = parseInt(color.substring(2, 4), 16);
      const B = parseInt(color.substring(4, 6), 16);
      const tarR = 33;
      const tarG = 238;
      const tarB = 179;
      console.log(`${R}-${G}-${B}`);
      // target found
      if (
        R > targetR - failMargin &&
        R < targetR + failMargin &&
        G > targetG - failMargin &&
        G < targetG + failMargin &&
        B > targetB - failMargin &&
        B < targetB + failMargin
      ) {
        console.log("FISH IS GREEN");
        stopIndicator--;

        if (!pulling) {
          robot.mouseToggle("down");
          pulling = true;
          setTimeout(function () {
            robot.mouseToggle("up");
            pulling = false;
          }, 2000);
        }
      }
    }
  }

  stopIndicator++;

  if (stopIndicator > 10 && !pulling) {
    clearInterval(pullerId);
    finderId = setInterval(findTarget, 300);
  }
};

setTimeout(main, startDelay);
finderId = setInterval(findTarget, 300);
