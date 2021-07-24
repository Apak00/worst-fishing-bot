let Jimp = require("jimp");

const captureImage = (img) => {
  function screenCaptureToFile(robotScreenPic) {
    return new Promise((resolve, reject) => {
      try {
        const image = new Jimp(robotScreenPic.width, robotScreenPic.height);
        let pos = 0;
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
          /* eslint-disable no-plusplus */
          image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++);
          image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++);
          image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++);
          image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++);
          /* eslint-enable no-plusplus */
        });
        resolve(image);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  screenCaptureToFile(img).then((res) => {
    res.write("asd.png");
  });
};
module.exports = { captureImage };
