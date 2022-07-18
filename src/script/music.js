const $musicPlayer = document.querySelector("#music");
const mpCtx = $musicPlayer.getContext("2d");
const $drawCanvas = document.createElement("canvas");
const drwCtx = $drawCanvas.getContext("2d");
const musicImages = [];
const musicList = [];
const musicCanvas = {x: 0, playButton: 0, rangeButton: 0, albumSize: 0, downX: 0, prevX: 0, speed: 0};
let musicFrame = 0;
let lastPlay = 0;

const playMusic = music => {
  if(music.audioCtx == null) {
    music.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
    music.music.play();
    music.audioSource = music.audioCtx.createMediaElementSource(music.music);
    music.analyser = music.audioCtx.createAnalyser();
    music.audioSource.connect(music.analyser);
    music.analyser.connect(music.audioCtx.destination);
  
    music.analyser.fftSize = 128;
    music.bufferLength = music.analyser.frequencyBinCount;
    music.dataArray = new Uint8Array(music.bufferLength);
  }else {
    music.music.play();
  }
}

const musicAnimation = () => {
  const frame = new Date().getTime() - musicFrame;
  musicFrame = musicFrame + frame;

  $musicPlayer.width = page.w;
  $musicPlayer.height = page.h;

  let grd = mpCtx.createLinearGradient(0, 0, 0, page.h);
  grd.addColorStop(0, "#ec8b8a");
  grd.addColorStop(1, "#ffe5b0");

  mpCtx.fillStyle = grd;
  mpCtx.fillRect(0, 0, page.w, page.h);

  const album = page.w / 3 / 4 * 2;

  let max = ((page.w - page.w / 5) / 3 * (musicList.length - 3));

  musicCanvas.x += musicCanvas.speed * frame;

  if(musicCanvas.speed >= 0.01 * frame) {
    musicCanvas.speed -= 0.01 * frame;
  }else if(musicCanvas.speed <= -0.01 * frame) {
    musicCanvas.speed += 0.01 * frame;
  }else {
    musicCanvas.speed = 0;
  }

  musicCanvas.speed = musicCanvas.speed.toFixed(2) * 1;

  if(musicCanvas.x < 0) musicCanvas.x = 0;
  if(musicCanvas.x > max) musicCanvas.x = max;

  const selMusic = musicList[lastPlay];
  const barLists = [[], [], []];
  const barList = [];
  const removeList = [];

  if(!selMusic.music.paused) {
    selMusic.analyser.getByteFrequencyData(selMusic.dataArray);
    let x = Math.random() * (page.w + selMusic.bufferLength * 2) - selMusic.bufferLength;
    let y = page.h + selMusic.bufferLength / 10;
    let avr = 0;
    for (let i = 0; i < selMusic.bufferLength; i++) {
      avr += selMusic.dataArray[i];

      for(let j = 0; j < 3; j++) {
        if(i <= Math.floor(selMusic.dataArray.length / 3) * (j + 1)) {
          barLists[j].push(selMusic.dataArray[i]);
        }
      }
    }
    for (let i = 0; i < selMusic.bufferLength; i++) {
      barList.push(barLists[i % 3].splice(0, 1));
    }
    avr /= selMusic.bufferLength;
    if(avr > 7) {
      let push = Math.round(Math.random() * (256 / avr));
      if(push === 0) particleList.music.bubble.push({size: avr / 8, x: x, y: y, step: Math.random() * 360, alpha: 1});
    }
  }

  console.log(barList);
  
  for(let i = 0; i < particleList.music.bubble.length; i++) {
    const par = particleList.music.bubble[i];
    if(par.size < 0.1) removeList.unshift(i);
    else if(par.alpha < 0) removeList.unshift(i);
    else {
      par.y -= 2;
      par.size -= 0.03;
      par.alpha -= 0.002;
      par.step += 2;
      mpCtx.fillStyle = `rgba(255, 255, 255, ${par.alpha})`;
      mpCtx.arc(par.x + Math.cos(par.step * pi / 180) * par.size, par.y, par.size, 0, pi * 2);
      mpCtx.fill();
      mpCtx.beginPath();
    }
  }

  for(let i = 0; i < removeList.length; i++) {
    particleList.music.bubble.splice(i, 1);
  }
  
  for(let i = 0; i < musics.length; i++) {
    $drawCanvas.width = album;
    $drawCanvas.height = album;

    musicCanvas.albumSize = album;

    drawImage(drwCtx, musicImages[i], $drawCanvas.width / 2, $drawCanvas.height / 2, {width: $drawCanvas.width, height: $drawCanvas.height});

    drwCtx.globalCompositeOperation = "destination-in";
    drwCtx.fillStyle = "#fff";
    drwCtx.arc($drawCanvas.width / 2, $drawCanvas.height / 2, $drawCanvas.width / 2, 0, pi * 2);
    drwCtx.fill();
    drwCtx.globalCompositeOperation = "source-over";

    drawImage(mpCtx, $drawCanvas, (page.w / 10) + ((page.w - page.w / 5) / 3 * (i + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x, page.h / 5 * 2.5);
  }
    
  for(let i = 0; i < musics.length; i++) {
    const music = musicList[i].music;
    $drawCanvas.width = album * 1.3;
    $drawCanvas.height = album * 1.3;
    let time = music.currentTime / music.duration;
    
    drwCtx.strokeStyle = "#fff7";
    drwCtx.lineWidth = (album * 1.02) - page.w / 3 / 4 * 2;
    drwCtx.lineCap = "round";
    drwCtx.arc($drawCanvas.width / 2, $drawCanvas.height / 2, (album * 1.12) / 2, 0, pi * 1.5);
    drwCtx.stroke();
    drwCtx.beginPath();

    drwCtx.arc($drawCanvas.width / 2, $drawCanvas.height / 2, (album * 1.12) / 2, - (pi / 20), - (pi * 0.5 - (pi / 20)), true);
    drwCtx.stroke();
    drwCtx.beginPath();
    
    drwCtx.strokeStyle = "#fff";
    drwCtx.arc($drawCanvas.width / 2, $drawCanvas.height / 2, (album * 1.12) / 2, 0, pi * 1.5 * (time));
    drwCtx.stroke();
    drwCtx.beginPath();

    drwCtx.arc($drawCanvas.width / 2, $drawCanvas.height / 2, (album * 1.12) / 2, - (pi / 20), - (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume, true);
    drwCtx.stroke();
    drwCtx.beginPath();
    
    drwCtx.fillStyle = "#fff";
    drwCtx.globalCompositeOperation = "destination-out";

    drwCtx.arc(($drawCanvas.width / 2) + (Math.cos(pi * 1.5 * (time)) * (album * 1.12) / 2), $drawCanvas.height / 2 + (Math.sin(pi * 1.5 * (time)) * (album * 1.12) / 2), drwCtx.lineWidth * 1.3, 0, pi * 1.5 * 2);
    drwCtx.fill();
    drwCtx.beginPath();
    
    drwCtx.arc(($drawCanvas.width / 2) + (Math.cos(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (album * 1.12) / 2), $drawCanvas.height / 2 + (Math.sin(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (album * 1.12) / 2), drwCtx.lineWidth * 1.3, 0, pi * 1.5 * 2);
    drwCtx.fill();
    drwCtx.beginPath();
    
    drwCtx.globalCompositeOperation = "source-over";
    
    drwCtx.arc(($drawCanvas.width / 2) + (Math.cos(pi * 1.5 * (time)) * (album * 1.12) / 2), $drawCanvas.height / 2 + (Math.sin(pi * 1.5 * (time)) * (album * 1.12) / 2), drwCtx.lineWidth * 1.3, 0, pi * 1.5 * 2);
    drwCtx.stroke();
    drwCtx.beginPath();
    
    drwCtx.arc(($drawCanvas.width / 2) + (Math.cos(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (album * 1.12) / 2), $drawCanvas.height / 2 + (Math.sin(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (album * 1.12) / 2), drwCtx.lineWidth * 1.3, 0, pi * 1.5 * 2);
    drwCtx.stroke();
    drwCtx.beginPath();

    musicCanvas.rangeButton = drwCtx.lineWidth * 2.3;
    
    drawImage(mpCtx, $drawCanvas, (page.w / 10) + ((page.w - page.w / 5) / 3 * (i + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x, page.h / 5 * 2.5);
  }

  for(let i = 0; i < musics.length; i++) {
    const music = musicList[i].music;
    $drawCanvas.width = album;
    $drawCanvas.height = album;

    drwCtx.strokeStyle = "#fff";
    drwCtx.lineWidth = (album * 1.035) - page.w / 3 / 4 * 2;
    drwCtx.lineCap = "round";
    drwCtx.lineJoin = "round";

    drwCtx.moveTo($drawCanvas.width / 2 - ($drawCanvas.width / 20), $drawCanvas.height / 2 - ($drawCanvas.width / 15));
    drwCtx.lineTo($drawCanvas.width / 2 - ($drawCanvas.width / 20), $drawCanvas.height / 2 + ($drawCanvas.width / 15));
    drwCtx.stroke();
    drwCtx.beginPath();

    let buttonX = $drawCanvas.width / 2 - ($drawCanvas.width / 20);

    if(music.paused) {
      musicList[i].button += ((0 - musicList[i].button) * frame / 100).toFixed(5) * 1;
    }else {
      musicList[i].button += ((1 - musicList[i].button) * frame / 100).toFixed(5) * 1;
    }

    musicList[i].button = musicList[i].button.toFixed(5) * 1;

    if(musicList[i].button > 1) musicList[i].button = 1;
    if(musicList[i].button < 0) musicList[i].button = 0;

    drwCtx.moveTo(buttonX + (musicList[i].button * ($drawCanvas.width / 10)), $drawCanvas.height / 2 - ($drawCanvas.width / 15));
    drwCtx.lineTo($drawCanvas.width / 2 + ($drawCanvas.width / 20), $drawCanvas.height / 2);
    drwCtx.lineTo(buttonX + (musicList[i].button * ($drawCanvas.width / 10)), $drawCanvas.height / 2 + ($drawCanvas.width / 15));
    drwCtx.stroke();
    drwCtx.beginPath();

    musicCanvas.playButton = $drawCanvas.width / 9;

    drawImage(mpCtx, $drawCanvas, (page.w / 10) + ((page.w - page.w / 5) / 3 * (i + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x, page.h / 10 * 7.5);
  }
  
  requestAnimationFrame(musicAnimation);
}

const musicPage = () => {
  particleList.music = {button: [], bubble: [], bar: []};
  introFrame = new Date().getTime();

  for(let i = 0; i < musics.length; i++) {
    musicImages.push(new Image());
    musicList.push({music: new Audio(), button: 0});
    const music = musicList[i];

    musicImages[i].src = `src/images/${musics[i]}.jpg`;
    music.music.src = `src/musics/${musics[i]}.mp3`;

    music.music.load();
    music.music.volume = 0.5;
    music.audioCtx = null;

    music.music.addEventListener("ended", e => {
      lastPlay++;
      
      music.music.currentTime = 0;
      if(lastPlay >= musicList.length) lastPlay = 0;

      playMusic(musicList[lastPlay]);
    })
  }

  musicAnimation();
}

document.addEventListener("mousedown", e => {
  if(mainPage.idx == 2) {
    mouse.md = true;

    mouse.dx = e.clientX;
    mouse.dy = e.clientY;
    musicCanvas.downX = musicCanvas.x;
    musicCanvas.prevX = musicCanvas.x;

    for(let i = 0; i < musicList.length; i++) {
      const music = musicList[i].music;
      let dx = (page.w / 10) + ((page.w - page.w / 5) / 3 * (i + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x;
      let dy = page.h / 5 * 2.5;
      let time = music.currentTime / music.duration;
      
      let tx = dx + Math.cos(pi * 1.5 * (time)) * (musicCanvas.albumSize * 1.12) / 2;
      let ty = dy + Math.sin(pi * 1.5 * (time)) * (musicCanvas.albumSize * 1.12) / 2;
      
      let vx = dx + Math.cos(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (musicCanvas.albumSize * 1.12) / 2;
      let vy = dy + Math.sin(- (pi / 20) - (pi * 0.5 - (pi / 10)) * music.volume) * (musicCanvas.albumSize * 1.12) / 2;

      let vr = Math.sqrt((mouse.x - vx) * (mouse.x - vx) + (mouse.y - vy) * (mouse.y - vy));
      let tr = Math.sqrt((mouse.x - tx) * (mouse.x - tx) + (mouse.y - ty) * (mouse.y - ty));

      if(vr < musicCanvas.rangeButton) {
        mouse.md = {idx: i, type: "volume"};
      }else if(tr < musicCanvas.rangeButton) {
        mouse.md = {idx: i, type: "time"};
      }
    }
  }
})

document.addEventListener("mousemove", e => {
  if(mainPage.idx == 2) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if(typeof(mouse.md) == "object") {
      const music = musicList[mouse.md.idx].music;
      let dx = (page.w / 10) + ((page.w - page.w / 5) / 3 * (mouse.md.idx + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x;
      let dy = page.h / 5 * 2;
      let theta = Math.atan2(mouse.y - dy, mouse.x - dx);
      
      if(mouse.md.type == "time") {
        if(theta < 0) theta += pi * 2;
        
        if(theta >= pi * 1.5 && theta < pi * 1.75) {
          music.currentTime = music.duration;
        }else if(theta >= pi * 1.75) {
          music.currentTime = 0;
        }else {
          music.currentTime = theta / (pi * 1.5) * music.duration;
        }
      }else {
        let min = (pi / 20);

        if(theta >= min && theta < pi * 0.75) {
          music.volume = 0;
        }else if(theta >= pi * 0.75 || theta <= - pi / 2 + min) {
          music.volume = 1;
        }else {
          theta = - (theta + min);
          music.volume = theta / (pi / 2 - min * 2) * 1;
        }
      }
    }else if(mouse.md) {
      musicCanvas.x = musicCanvas.downX + mouse.dx - mouse.x;
      let max = ((page.w - page.w / 5) / 3 * (musicList.length - 3));

      if(musicCanvas.x < 0) musicCanvas.x = 0;
      if(musicCanvas.x > max) musicCanvas.x = max;

      musicCanvas.speed = musicCanvas.x - musicCanvas.prevX;
      musicCanvas.prevX = musicCanvas.x;
    }
  }
})

document.addEventListener("mouseup", e => {
  if(mainPage.idx == 2) {
    mouse.md = false;

    if(mouse.dx == mouse.x && mouse.dy == mouse.y) {
      console.log("click");
      for(let i = 0; i < musicList.length; i++) {
        let r = Math.sqrt(Math.pow(mouse.x - ((page.w / 10) + ((page.w - page.w / 5) / 3 * (i + 1)) - ((page.w - page.w / 5) / 3 / 2) - musicCanvas.x), 2) + Math.pow(mouse.y - (page.h / 10 * 7.5), 2));

        if(r < musicCanvas.playButton) {
          if(musicList[i].music.paused) {
            for(let j = 0; j < musicList.length; j++) {
              musicList[j].music.pause();
            }
            playMusic(musicList[i]);
            lastPlay = i;
          }else musicList[i].music.pause();
        }
      }
    }
  }
})

document.addEventListener("keydown", e => {
  if(e.key.toLocaleLowerCase() === " " && !introStep) {
    if(musicList[lastPlay].music.paused) {
      playMusic(musicList[lastPlay]);
    }else musicList[lastPlay].music.pause();
  }
})