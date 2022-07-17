const mainPageAni = e => {
  const frame = new Date().getTime() - frameTime;
  frameTime = frameTime + frame;

  let step = ((mainPage.idx * 100) - mainPage.step) * frame / 100;

  if(step > 0 && step < 1) step = 1;
  if(step < 0 && step > -1) step = -1;

  mainPage.step += step;

  mainPage.step = Math.round(mainPage.step);

  for(let i = 0; i < mainPage.element.length; i++) {
    const page = mainPage.elements[i];
    const top = - mainPage.step + (i * 100);
    // console.log(page);
    // console.log(top);

    page.style.top = `${top}%`;
    if(i == 1) $imgBackground.style.top = `${top}%`;
  }


  if(mainPage.step !== mainPage.idx * 100) requestAnimationFrame(mainPageAni);
  else {
    if(!imageLoaded && mainPage.idx == 1) {
      imageView(true);
    }
  }
}

const init = e => {
  mainPage.element = document.querySelectorAll(".page");
  mainPage.elements = [];
  
  for(let i = 0; i < mainPage.element.length; i++) {
    mainPage.elements.push(document.getElementById(`page${i + 1}`));
  }

  intro();
  imageList();
  musicPage();
}

document.addEventListener("wheel", e => {
  if(mainPage.canAni && !e.shiftKey && !imagePopAni) {
    if(e.wheelDelta < 0) {
      if(mainPage.idx < mainPage.maxPage - 1) mainPage.idx++;
    }else {
      if(mainPage.idx > 0) mainPage.idx--;
    }

    scrolls.speed = 0;
    frameTime = new Date().getTime();
    mainPageAni();
  }
  if(e.shiftKey) {
    if(imageViewed) {
      imageView();
    }
  }
  $popImages.style.left = `-${$scrollList.scrollLeft}px`;
})

window.addEventListener("resize", e => {
  page.w = window.innerWidth;
  page.h = window.innerHeight;
  page.x = page.w / 2;
  page.y = page.h / 2;
})

window.onload = init();