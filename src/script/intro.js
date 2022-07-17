const $introBackground = document.querySelector("#intro-background");
const $intro = document.querySelector("#intro");
const introCt = $intro.getContext("2d");
let introStep = 0;
let introFrame = 0;

const introAnimation = e => {
  const frame = new Date().getTime() - introFrame;
  introFrame = introFrame + frame;

  introCt.fillStyle = "#f65756";
  introCt.fillRect(0, 0, page.w, page.h);
  introCt.beginPath();

  introStep += frame / 1000;
  if(introStep > 1) {
    if(particleList.intro.length === 1) {
      const item = particleList.intro[0];
      if(item.y < 0 && item.step === 0) {
        item.y += frame * 1.3;
      }
      if(item.y >= 0 && item.step === 0) {
        item.y = -item.y;
        item.step = 1;
      }
      if(item.y > -100 && item.step === 1) {
        let discoord = (-100 - item.y) * frame / 100;
        if(discoord > -0.5) discoord = -0.5;
        item.y += discoord;
      }
      if(item.y <= -100 && item.step === 1) {
        item.y = -100;
        item.step = 2;
        item.theta = 0;
        item.size = 100;
      }
      if(item.step === 2) {
        let theta = 0;
        if(item.theta < 0.5) {
          theta = (2 - (1 - item.theta)) * frame / 200;
        }else {
          theta = (2 - item.theta) * frame / 200;
        }
        if(theta < 0.01) theta = 0.01;
        item.theta += theta;
      }
      if(item.step === 2 && item.theta > 2) {
        item.theta = 2;
        item.step = 3;
      }
      if(item.step === 3) {
        let size = - item.size * frame / 150;
        if(size > - 1) size = - 1;
        item.size += size;
      }
      if(item.step === 3 && item.size < 2) {
        item.step = 4;
      }
      if(item.step === 4) {
        let end = Math.sqrt((page.x * page.x) + (page.y * page.y)) + 20;
        let size = ((end - item.size) * frame / 200) + 10;
        // if(size < 20) size = 20;
        if(end > item.size) item.size += size;
        else item.step = 5;
      }
      if(item.step === 5) {
        $intro.classList.add("none");
        introStep = false;
        mainPage.canAni = true;
      }

      item.y = item.y.toFixed(2) * 1;
      introCt.beginPath();
      if(item.step <= 1) {
        arc(introCt, item.x, item.y, item.size, item.color);
      }
      if(item.step === 2) {
        item.theta = item.theta.toFixed(3) * 1;
        arc(introCt, 0, 0, item.size, false, {color: "#fff", width: 20}, 1, - pi / 2, (- pi / 2) + (item.theta * pi));
      }
      if(item.step === 3) {
        item.size = item.size.toFixed(2) * 1;
        arc(introCt, 0, 0, item.size, false, {color: "#fff", width: 20});  
      }
      if(item.step === 4) {
        item.size = item.size.toFixed(2) * 1;
        arc(introCt, 0, 0, item.size - 5, false, {color: "#fff", width: 30});
        introCt.globalCompositeOperation = "destination-out";
        introCt.beginPath();
        arc(introCt, 0, 0, item.size - 10, "#fff");
        introCt.globalCompositeOperation = "source-over";
      }
    }
  }

  if(introStep !== false) requestAnimationFrame(introAnimation);
}

const intro = e => {
  $intro.width = page.w;
  $intro.height = page.h;

  introCt.fillStyle = "#f65756";
  introCt.fillRect(0, 0, page.w, page.h);
  $introBackground.style.display = "none";

  particleList.intro = [];
  
  const result = {};
  result.size = 10;
  result.x = 0;
  result.y = - page.y - result.size;
  result.color = "#fff";
  result.step = 0;
  
  particleList.intro.push(result);

  introFrame = new Date().getTime();

  introAnimation();
} 
