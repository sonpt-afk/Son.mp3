//1.render song --OK
//2.scroll top --OK
//3.play/pause/seek --OK
//4.CD rotate--OK
//5.Next/previous--ok

//6.Random--OK
//7.Next/ Repeat when end--ok
//8.Active song--ok
//9.scroll active into view--ok
//10.Play song when click
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8-PLAYER'
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn =$('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist') 
const app={
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    song: [
    { 
        name:'Dù cho mai về sau',
        singer:'buitruonglinh',
        path:'./song1.mp3',
        img:'./img1.jpg'
    },
    { 
        name:'Bước qua nhau',
        singer:'Vũ',
        path:'./song2.mp3',
        img:'./img2.jpg'
    },
    { 
        name:'Blinding light',
        singer:'Theweeknd',
        path:'./song3.mp3',
        img:'./img3.jpg'
    },

    {
        name:'1 phút',
        singer:'Andiez',
        path:'./song4.mp3',
        img:'./img4.jpg'
    },
    {
        name:'Old town road',
        singer:'Lil Nas x',
        path:'./song5.mp3',
        img:'./img5.jpg'
    },
    
],
    
    render: function(){
        const htmls = this.song.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name} </h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.song[this.currentIndex]
            }
        })
      
    },
    scrollToActiveSong:function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },200)
    },
    loadCurrentSong:function(){
     
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.song.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex 
        do{
            newIndex= Math.floor(Math.random()*this.song.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length -1
        }
        this.loadCurrentSong()
    },
    handleEvent:function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        //xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //xu ly phong to/thu nho CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
             //check if cdwidth < 0 then set = 0 
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xu ly khi click play
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            }else{
            audio.play()
        }
    }
    //khi song duoc play 
    audio.onplay = function(){
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
    }
    //khi song bi pause
    audio.onpause = function(){
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()

    }
    //Khi tien do bai hat thay doi
    audio.ontimeupdate = function(){
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        }
    }
    //Xu ly khi tua song
    progress.onchange = function(e){
       const seekTime = audio.duration*e.target.value/100
       audio.currentTime = seekTime
    }
    //khi next song
    nextBtn.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong()
        }else{
            _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
    }
     //khi prev song
     prevBtn.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong()
        }else{
            _this.prevSong()
        }
        audio.play()
        _this.render()

    }
    //khi random song
    randomBtn.onclick = function(){
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active',_this.isRandom)
    
    }
    //khi repeat song
    repeatBtn.onclick = function(){
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active',_this.isRepeat)
    //xu ly next song khi audio end
    audio.onended = function(){
        if(_this.isRepeat){
            audio.play()
        }else{
            nextBtn.click()
        }
    }
    //nghe hanh vi click vao playlist
    playlist.onclick = function (e) {
        const songNode = e.target.closest(".song:not(.active)");
  
        if (songNode || e.target.closest(".option")) {
          // Xử lý khi click vào song
          // Handle when clicking on the song
          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
  
          // Xử lý khi click vào song option
          // Handle when clicking on the song option
          if (e.target.closest(".option")) {
          }
        }
      };
    
        
            
        
    //khi replay song
    audio.onreplay = function(){
        _this.loadCurrentSong()
        audio.play()
    }
   

    }
},
   
    start:function(){
        //dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        //lang nghe / xu ly cac event(DOM events)
        this.handleEvent()
        //Tai thong tin bai hat dau tien vao UI khi chay app
        this.loadCurrentSong()
        //Render playlist
        this.render()
       
    }

}
app.start()