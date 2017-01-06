const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
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
    // ctx.globalAlpha=0.5;
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
  // at 27:20
  const levels ={};
  // console.log([...document.querySelectorAll('.rgb input')])
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


getVideo()

video.addEventListener('canplay', paintToCanvas)
