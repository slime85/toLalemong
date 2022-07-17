const $scrollList = document.querySelector("#image-list");
const $lines = document.querySelectorAll(".image-line");
const $imgBackground = document.querySelector("#img-background");
const $popImages = document.querySelector("#pop-images");
const scrolls = {start: 0, speed: 0, prev: 0, downPrev: 0, popPrev: 0};
const loadImages = [];
const loadOriginalImages = [];
const popupedImage = {el: undefined, left: 0, top: 0, width: 0, height: 0};
let loadedImages = [];
let imageLoaded = false;
let imageViewed = false;
let imagePopup = false;
let imagePopAni = false;

const imageResize = e => {
  for(let i = 0; i < $lines.length; i++) {
    let width = 0;

    $lines[i].querySelectorAll(".img").forEach(box => {
      const img = box.querySelector("img");
      const popup = loadOriginalImages[box.dataset.idx * 1];
      box.style.width = "";
      box.style.height = "";
      img.style.width = "";
      img.style.height = "";

      resizeTimeOut = setTimeout(e => {
        let top = 30;
        let left = 30;
        
        top += (img.clientHeight + 30) * i;
        left += width;

        width += 30 + img.clientWidth;

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.style.width = `${img.clientWidth}px`;
        popup.style.height = `${img.clientHeight}px`;
      }, 100)
    })
  }
}

const popupOutAni = e => {
  if(!imagePopAni && e.button == 0) {
    $imgBackground.style.opacity = "";
    $imgBackground.style.pointerEvents = "";
    $imgBackground.style.transition = "";
    $popImages.style.pointerEvents = "";
    
    setTimeout(e => {
      popupedImage.el.style.left = popupedImage.left;
      popupedImage.el.style.top = popupedImage.top;
      popupedImage.el.style.width = popupedImage.width;
      popupedImage.el.style.height = popupedImage.height;
  
      imagePopAni = true;
    
      setTimeout(e => {
        $imgBackground.style.display = "";
        $popImages.querySelectorAll("img").forEach(el => el.style.display = "")
  
        imagePopup = false;
        imagePopAni = false;
      }, 700)
    })
  }
}

const imageView = (re = false) => {
  imageLoaded = true;
  
  if(loadedImages.length > 0) {
    const item = loadedImages[0];

    if($scrollList.scrollLeft + page.w - 60 > item.width) {
      item.el.classList.add("step2");
      loadedImages.splice(0, 1);
    
      if(re) {
        setTimeout(e => {
          imageView(true);
        }, 200);
      }
    }else {
      imageViewed = true;
    }
  }
}

const imageLoad = (result = []) => {
  const idx = Math.floor(Math.random() * loadedImages.length);
  const box = loadedImages[idx];
  const image = box.querySelector("img");
  const min = {idx: -1, width: 0};
  const popImg = loadOriginalImages[box.dataset.idx * 1];

  for(let i = 0; i < $lines.length; i++) {
    const line = $lines[i];

    if(min.idx == -1 || min.width > line.scrollWidth) {
      min.idx = i;
      min.width = line.scrollWidth;
    }else if(min.width == line.scrollWidth) {
      if(typeof(min.idx) == "object") min.idx.push(i);
      else min.idx = [min.idx, i];
    }
  }

  if(typeof(min.idx) == "object") min.idx = min.idx[Math.floor(Math.random() * min.idx.length)];

  $lines[min.idx].append(box);
  
  let top = 30;
  let left = 30;
  
  top += (image.clientHeight + 30) * min.idx;

  if(min.width > 30) {
    left = min.width - 70;
  }

  setTimeout(e => {
    if(image.clientWidth == 0) {
      box.remove();
      return setTimeout(e => {imageLoad(result)}, 50);
    }

    loadedImages.splice(idx, 1);
    result.push({el: image, width: min.width});

    box.style.width = `${image.clientWidth}px`;
    box.style.height = `${image.clientHeight}px`;
    image.style.width = `${image.clientWidth}px`;
    image.style.height = `${image.clientHeight}px`;
    popImg.style.width = `${image.clientWidth}px`;
    popImg.style.height = `${image.clientHeight}px`;
    popImg.style.left = `${left}px`;
    popImg.style.top = `${top}px`;
    
    if(loadedImages.length > 0) setTimeout(e => {imageLoad(result)}, 50);
    else {
      loadedImages = result;
    }
  }, 10)
}

const imageList = e => {
  let loaded = 0;

  for(let i = 0; i < images.length; i++) {
    const box = document.createElement("div")
    const image = new Image();
    const originalImage = new Image();

    image.src = `src/images/${images[i % images.length]}`;
    image.classList.add("step1");
    box.append(image);
    box.classList.add("img");
    box.dataset.idx = i;
    
    loadImages.push(box);
    
    originalImage.src = `src/original/${originalImages[i % images.length]}`;
    originalImage.classList.add("img-pop");
    $popImages.append(originalImage)
    loadOriginalImages.push(originalImage);

    originalImage.addEventListener("click", e => popupOutAni(e));
    
    box.addEventListener("click", e => {
      if(scrolls.downPrev == $scrollList.scrollLeft && !imagePopup) {
        $imgBackground.style.display = "block";
        originalImage.style.display = "block";
        originalImage.style.transition = "0.7s";
        imagePopup = true;
        imagePopAni = true;
        popPrev = $scrollList.scrollLeft;

        popupedImage.el = originalImage;
        popupedImage.left = originalImage.style.left;
        popupedImage.top = originalImage.style.top;
        popupedImage.width = originalImage.style.width;
        popupedImage.height = originalImage.style.height;

        setTimeout(e => {
          $imgBackground.style.opacity = "1";

          originalImage.style.left = `${$scrollList.scrollLeft}px`;
          originalImage.style.top = "0px";
          originalImage.style.width = "100%";
          originalImage.style.height = "100%";

          $imgBackground.style.pointerEvents = "unset";
          
          setTimeout(e => {
            $popImages.style.pointerEvents = "unset";
            $imgBackground.style.transition = "0s";

            imagePopAni = false;
          }, 700)
        })
      }
    })

    loaded++;

    if(loaded == images.length) {
      loadedImages = cloneArray(loadImages);
      imageLoad();
    }
  }
}

document.addEventListener("mousedown", e => {
  if(!imagePopup && mainPage.idx == 1) {
    mouse.dx = e.clientX;
    mouse.dy = e.clientY;
    mouse.md = true;
    scrolls.start = scrolls.downPrev = scrolls.prev = $scrollList.scrollLeft;
  }
})

document.addEventListener("mousemove", e => {
  if(!imagePopup && mainPage.idx == 1) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if(mouse.md) {
      $scrollList.scrollLeft = scrolls.start + mouse.dx - mouse.x;
      scrolls.speed = $scrollList.scrollLeft - scrolls.prev;
      scrolls.prev = $scrollList.scrollLeft;
      $popImages.style.left = `-${$scrollList.scrollLeft}px`;
      if(imageViewed) {
        imageView();
      }
    }
  }
})

document.addEventListener("mouseup", e => {
  if(!imagePopup && mainPage.idx == 1) {
    mouse.md = false;
  }
})

setInterval(e => {
  if(!mouse.md && mainPage.idx == 1) {
    if((scrolls.speed > 0 || scrolls.speed < 0) && imageViewed) {
      imageView();
    }
    
    $scrollList.scrollLeft += scrolls.speed * 10;

    if(scrolls.speed >= 0.01) {
      scrolls.speed -= 0.2;
    }else if(scrolls.speed <= -0.01) {
      scrolls.speed += 0.2;
    }

    scrolls.speed = scrolls.speed.toFixed(2) * 1;
    $popImages.style.left = `-${$scrollList.scrollLeft}px`;
  }
}, 10)

$imgBackground.addEventListener("click", e => popupOutAni(e))

window.addEventListener("resize", imageResize())