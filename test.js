let robot = require("robotjs");
const delay = require("delay");

const startIfStopped = async () => {
  console.log("ahoyclicked");
  robot.mouseToggle("down");
  await delay(10000);
  robot.mouseToggle("up");
  await delay(50);
};
startIfStopped();
