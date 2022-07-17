const images = ["2020-06-24-01.jpg", "2020-09-07-01.jpg", "2020-09-12-01.jpg", "2021-01-25-01.jpg", "2021-02-01-01.jpg", "2021-05-17-01.jpg", "2021-08-04-01.jpg", "2021-08-27-01.png", "2021-09-22-01.jpg", "2021-10-17-01.jpg", "2021-12-23-01.jpg", "2021-12-24-01.jpg", "2021-11-05-01.jpg", "2022-06-30-01.png"];
const originalImages = ["2020-06-24-01.jpg", "2020-09-07-01.jpg", "2020-09-12-01.png", "2021-01-25-01.png", "2021-02-01-01.png", "2021-05-17-01.png", "2021-08-04-01.png", "2021-08-27-01.png", "2021-09-22-01.png", "2021-10-17-01.png", "2021-12-23-01.png", "2021-12-24-01.png", "2021-11-05-01.jpg", "2022-06-30-01.png"];
const musics = ["TrackMaker", "듣고자요", "봄이좋냐", "복숭아"];
const pi = Math.PI;
const page = {w: window.innerWidth, h: window.innerHeight, x: window.innerWidth / 2, y: window.innerHeight / 2};
const mouse = {x: 0, y: 0, dx: 0, dy: 0, md: false};
const mainPage = {idx: 0, canAni: false, maxPage: 3, step: 0};
const particleList = {};

const cloneArray = data => {
  const result = [];

  for(let i = 0; i < data.length; i++) {
    result.push(data[i]);
  }

  return result;
}

const drawImage = (ctx, image, x, y, cover = false) => {
  if(cover) {
    let im = image.width / image.height;
    let cv = cover.width / cover.height;

    let w, h = 0;

    if(im < cv) {
      w = cover.width;
      h = image.height / image.width * cover.width;
    }else {
      h = cover.height;
      w = image.width / image.height * cover.height;
    }

    ctx.drawImage(image, x - (w / 2), y - (h / 2), w, h);
  }
  else ctx.drawImage(image, x - (image.width / 2), y - (image.height / 2));
}