let robot = require("robotjs");
const { captureImage } = require("./capture");

const getAvgColor = (width, height, corX, corY, capture) => {
  const img = robot.screen.capture(corX, corY, width, height);
  if (capture) {
    captureImage(img, capture);
  }
  const total = {
    R: 0,
    G: 0,
    B: 0,
  };
  const numOfPixels = width * height;
  for (let i = 0; i < width; i++) {
    for (let f = 0; f < height; f++) {
      const color = img.colorAt(i, f);
      const R = parseInt(color.substring(0, 2), 16);
      const G = parseInt(color.substring(2, 4), 16);
      const B = parseInt(color.substring(4, 6), 16);
      total.R += R;
      total.G += G;
      total.B += B;
    }
  }
  total.R = Math.floor(total.R / numOfPixels);
  total.G = Math.floor(total.G / numOfPixels);
  total.B = Math.floor(total.B / numOfPixels);
  return total;
};

module.exports = { getAvgColor };
