const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const booth = document.querySelector('.photobooth')
const spread = document.querySelector('.spread')

let canvasPaintLoopID = null
function getVideo(){
  navigator.mediaDevices.getUserMedia(
    {video:true, audio:false}
    ).then( localMediaStream=>{
      console.log('yeppers')
      video.src = window.URL.createObjectURL(localMediaStream)
      video.play()
    }).catch( error =>{
      console.errror('consider giving access?', error)
    })
}

function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  canvasPaintLoopID = setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0,0,width, height);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha=0.25;
    greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0)
  }, 20)
}

function takePhoto(){
  snap.currentTime= 0;
  snap.play();
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src='${data}' alt='snazzy person'/>`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
  for(let i = 0; i<pixels.data.length; i+=4){
    pixels.data[i+0] *= 1.2
    pixels.data[i+1] *= .8
    pixels.data[i+2] *= .8
  }
  return pixels
}

function rgbSplit(pixels){
  for(let i = 0; i<pixels.data.length; i+=4){
    pixels.data[i-500] = pixels.data[i+0]
    pixels.data[i-150] = pixels.data[i+1]
    pixels.data[i+550] = pixels.data[i+2]
  }
  return pixels
}

function inbetweenLevels(colors,levels){
  return (
    colors[0] <= levels.rmax &&
    colors[0] >= levels.rmin &&
    colors[1] <= levels.gmax &&
    colors[1] >= levels.gmin &&
    colors[2] <= levels.bmax &&
    colors[2] >= levels.bmin
    )
}

function greenScreen(pixels){
  const levels ={};
  [...document.querySelectorAll('.rgb input')].forEach(
    (input)=>{
      levels[input.name] = input.value
    })
  for(let i = 0; i<pixels.data.length; i+=4){
    let red =pixels.data[i+0];
    let green =pixels.data[i+1];
    let blue =pixels.data[i+2];
    let alpha =pixels.data[i+3];
    if(inbetweenLevels([red,green,blue], levels)){
      pixels.data[i+3] = 0;
    }
  }
}

function findPos(obj){
  var curLeft = curTop = 0;
  if (obj.offsetParent){
    do {
      curLeft += obj.offsetLeft;
      curTop += obj.offsetTop;
    } while(obj = obj.offsetParent)
  }
  return [curLeft,curTop]
}

function colorGrab(event){
  const width = video.videoWidth;
  const height = video.videoHeight;
  const clickX = event.layerX;
  const clickY = event.layerY;
  const scaleFactor = parseInt(window.getComputedStyle(canvas).width)/width

  const canX = clickX/scaleFactor
  const canY = clickY/scaleFactor

  const pixel = ctx.getImageData(canX, canY,1, 1).data
  const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
  spread.dataset.color = pixel
  document.querySelector('label[for="rgbSpread"]').style.backgroundColor = color;
  updateSliders()
  spread.addEventListener('mousemove', updateSliders)
}

function updateSliders(){
  let sliders = document.querySelectorAll('.rgb input');
  let pixel = spread.dataset.color.split(',').slice(0,4)
  const range = parseInt(
    document.querySelector('.spread').value
    );
  console.log(range);
  // [...sliders].forEach((slider, index)=>{
  for(let index= 0; index < sliders.length; index++){
    let slider = sliders[index]
    const pm = -1 + 2*(index%2)
    const delta = range*pm
    const center = parseInt(pixel[parseInt(index/2)])
    const newColor = center+delta
    slider.value = newColor
  }
}


getVideo()

video.addEventListener('canplay', paintToCanvas)
canvas.addEventListener('click', colorGrab)
