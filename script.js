const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.img-area img'),
musicName = wrapper.querySelector('.song-details .name'),
musicArtist = wrapper.querySelector('.song-details .artist'),
musicAudio = wrapper.querySelector('#play-audio'),
playPauseBtn = wrapper.querySelector('.play-pause'),
prevBtn = wrapper.querySelector('#prev'),
nexteBtn = wrapper.querySelector('#next'),
progressBar = wrapper.querySelector('.progress-bar'),
progressArea = wrapper.querySelector('.progress-area'),
repeatBtn = wrapper.querySelector('#repeat-plist'),
randomBtn = wrapper.querySelector('#music-random'),
musicList = document.querySelector('.music-list'),
showMoreBtn = musicList.querySelector('#more-music'),
hideListBtn = musicList.querySelector('#close'),
musicListUl = musicList.querySelector('ul'),
musicListSpan = musicList.querySelector('#header-music-list')

let musicIndex = Math.floor(Math.random() * allMusic.length)

window.addEventListener('load', () => {
  loadMusic(musicIndex)
  playingNow()
})

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb].name
  musicArtist.innerText = allMusic[indexNumb].artist
  musicImg.src = `./img/${allMusic[indexNumb].img}.jpg`
  musicAudio.src = `./music/${allMusic[indexNumb].src}.mp3`
}

function playMusic() {
  wrapper.classList.add('paused')
  playPauseBtn.querySelector('span').innerText = 'pause_circle'
  musicAudio.play()
}

function pauseMusic() {
  wrapper.classList.remove('paused')
  playPauseBtn.querySelector('span').innerText = 'play_circle'
  musicAudio.pause()
}

function nextMusic() {
  musicIndex++
  musicIndex > (allMusic.length - 1) ? musicIndex = 0 : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}

function prevMusic() {
  musicIndex--
  musicIndex < 0 ? musicIndex = allMusic.length - 1 : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}

playPauseBtn.addEventListener('click',() => {
  const isMusicPause =  wrapper.classList.contains('paused')
  isMusicPause ? pauseMusic() : playMusic()
  playingNow()
})

nexteBtn.addEventListener('click',() => {
  nextMusic()
})

prevBtn.addEventListener('click',() => {
  prevMusic()
})

musicAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime
  const duration = e.target.duration
  //% thanh tiến độ
  let progressWidth = ((currentTime / duration) * 100).toFixed(1)
  progressBar.style.width = `${progressWidth}%`

  let musicCurrentTime = wrapper.querySelector('.current'),
  musicDuration = wrapper.querySelector('.duration')
  
  musicAudio.addEventListener('loadeddata', () => {
    let audioDuration = musicAudio.duration,
    audioDurationMin = Math.floor(audioDuration / 60),
    audioDurationSec = Math.floor(audioDuration % 60)

    if(audioDurationSec < 10) {
      musicDuration.innerText = `${audioDurationMin}:0${audioDurationSec}`
    }
    else {
      musicDuration.innerText = `${audioDurationMin}:${audioDurationSec}`
    }
  })
  
  //currentTime
  let currentTimeMin = Math.floor(currentTime / 60),
  currentTimeSec = Math.floor(currentTime % 60)
  if(currentTimeSec < 10) {
    musicCurrentTime.innerText = `${currentTimeMin}:0${currentTimeSec}`
  }
  else {
    musicCurrentTime.innerText = `${currentTimeMin}:${currentTimeSec}`
  }
})

progressArea.addEventListener('click', (e) => {
  // console.log(progressArea.clientWidth, e)
  let progressWidthval = progressArea.clientWidth, //tổng độ dài
  clickedOffSetX = e.offsetX, //vị trí khi click
  songDuration = musicAudio.duration //tổng thời lượng

  //vị trí click/tổng dài * tổng thời lượng sẽ ra thời gian sẽ chạy khi click
  //vào vị trí nào đó
  musicAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration
  playMusic()
})

//lặp lại
repeatBtn.addEventListener('click', () => {
  let textRepeat = repeatBtn.innerText
  if(textRepeat === 'repeat') {
    repeatBtn.style = `background: linear-gradient(to right bottom, #fd357b 0%, #9b3ea3);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;`
    repeatBtn.setAttribute('title', 'Tắt lặp lại')
    repeatBtn.innerText = 'repeat_one'
  } else if (textRepeat === 'repeat_one') {
    repeatBtn.style = 'none'
    repeatBtn.setAttribute('title', 'Lặp lại')
    repeatBtn.innerText = 'repeat'
  }
})

//radom music
let isRandom = false;
randomBtn.addEventListener('click', () => {
  isRandom = !isRandom
  if(isRandom) {
    randomBtn.style = `background: linear-gradient(to right bottom, #fd357b 0%, #9b3ea3);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;`
    randomBtn.setAttribute('title', 'Tắt phát ngẫu nhiên')
  } else {
    randomBtn.setAttribute('title', 'Phát ngẫu nhiên')
    randomBtn.style = 'none'
  }
})

let arrayRandom = [],
numberRandom
musicAudio.addEventListener('ended', () => { //khi kết thúc bài
  let textRepeat = repeatBtn.innerText

  arrayRandom.push(`${numberRandom}`)

  if(arrayRandom.length > allMusic.length) {
    arrayRandom = []
  }
  else {
    if(textRepeat === 'repeat') {

      //random không lặp lại những bài đã qua
      if(isRandom) {
        do {
          numberRandom = Math.floor(Math.random() * allMusic.length)
        } while(numberRandom == musicIndex)
        arrayRandom.forEach(function(index) {
          while(index == numberRandom) {
            do {
              numberRandom = Math.floor(Math.random() * allMusic.length)
            } while(numberRandom == musicIndex)
          }
          arrayRandom.forEach(function(index2) {
            while(index2 == numberRandom) {
              do {
                numberRandom = Math.floor(Math.random() * allMusic.length)
              } while(numberRandom == musicIndex)
            }
          })
        })
        musicIndex = numberRandom
        loadMusic(musicIndex)
        playMusic()
      }
      else
        nextMusic()
    } else {
      musicAudio.currentTime = 0 //quay lại thời gian phát bài
      playMusic()
    }
    playingNow()
  }
})

showMoreBtn.addEventListener('click', () => {
  musicListUl.classList.add('show')
  hideListBtn.classList.add('show')
  musicListSpan.classList.add('show')
  musicList.classList.add('hide')
})

hideListBtn.addEventListener('click', () => {
  hideListBtn.classList.remove('show')
  musicListUl.classList.remove('show')
  musicListSpan.classList.remove('show')
  musicList.classList.remove('hide')
})

for(let i = 0; i < allMusic.length; i++) {
  let srcTmp = `${allMusic[i].src}`
  let newSrc = srcTmp.replaceAll(" ", "")
  let liTag = `<li li-index="${i}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${newSrc}" src="./music/${allMusic[i].src}.mp3"></audio>
                <span id="${newSrc}" class="audio-duration">3:34</span>
              </li>`
  musicListUl.insertAdjacentHTML('beforeend', liTag)

  let liAudioDuration = musicListUl.querySelector(`#${newSrc}`)
  let liAudioTag = musicListUl.querySelector(`.${newSrc}`)

  liAudioTag.addEventListener('loadeddata', () => {
    let liAudioTagDuration = liAudioTag.duration,
    liAudioTagDurationMin = Math.floor(liAudioTagDuration / 60),
    liAudioTagDurationSec = Math.floor(liAudioTagDuration % 60),
    totalMinSec
    if(liAudioTagDurationSec < 10) {
      totalMinSec = `${liAudioTagDurationMin}:0${liAudioTagDurationSec}`
      liAudioDuration.innerText = totalMinSec
    }
    else {
      totalMinSec = `${liAudioTagDurationMin}:${liAudioTagDurationSec}`
      liAudioDuration.innerText = totalMinSec
    }
    liAudioDuration.setAttribute('duration-tmp', `${totalMinSec}`)
  })
}

const LiTags = musicListUl.querySelectorAll('li')

function playingNow() {
  for (let i = 0; i < LiTags.length; i++) {
    let audioTag = LiTags[i].querySelector('.audio-duration')

    if (LiTags[i].classList.contains('playing')) {
      LiTags[i].classList.remove('playing')
      let audio_Duration = audioTag.getAttribute('duration-tmp')
      audioTag.innerText = audio_Duration
    }
    if (LiTags[i].getAttribute('li-index') == musicIndex) {
      LiTags[i].classList.add('playing')
      audioTag.innerText = 'Playing'
    }
    LiTags[i].setAttribute('onclick', 'clicked(this)')
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute('li-index')
  musicIndex = getLiIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}