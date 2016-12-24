// getting elements
const player = document.querySelector('.player')
const video = player.querySelector('.viewer')
const progress = player.querySelector('.progress')
const progressBar = player.querySelector('.progress__filled')
const toggle = player.querySelector('.toggle')
const skipButtons = player.querySelectorAll('[data-skip]')
const ranges = player.querySelectorAll('.player__slider')

//helper functions
function togglePlay(){
  // if(video.paused){
  //   video.play()
  // }else{
  //   video.pause()
  // }

  // (video.paused ? video.play : video.pause)
  //   .bind(video)()

  video[
    video.paused ? 'play': 'pause'
    ]()
}

function updatePlayButton(event){
  toggle.textContent = video.paused ? '►':'❚ ❚';
}

function skip(event){
  video.currentTime += parseFloat(this.dataset['skip'])
}

function handleRangeUpdate(event){
  console.log(this.value)
  video[this.name] = parseFloat(this.value)
}

function handleProgress(){
  const percent = 100 * video.currentTime / video.duration
  progressBar.style.flexBasis = `${percent}%`
}

function scrub(event){
  console.log(video.duration , event.offsetX , progress.offsetWidth)
  const scrubTime = video.duration * event.offsetX / progress.offsetWidth;
  console.log(scrubTime)
  video.currentTime = scrubTime;
}

// listener hook ups
video.addEventListener('click', togglePlay)
video.addEventListener('play', updatePlayButton)
video.addEventListener('pause', updatePlayButton)
video.addEventListener('timeupdate', handleProgress)

skipButtons.forEach((button)=> button.addEventListener('click', skip))

toggle.addEventListener('click', togglePlay)

ranges.forEach((range)=>{range.addEventListener('change', handleRangeUpdate)})

progress.addEventListener('click', scrub)
