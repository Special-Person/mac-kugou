<template>
    <div class="music-play-interface" :class="$store.state.musicInterface ? 'enterBg' : 'outBg'">
        <div class="box" :class="musicInterface === null ? '' : musicInterface ? 'enter' : 'out'">
            <div class="interface">
                <div class="l-music-info">
                    <div>
                        <div class="img" :style="'background-image: url(' + $store.state.currentSongInfo.img + ')'"></div>
                        <div class="btns">
                            <a ondragstart="return false" href="#" @click="addLike">
                                <i class="iconfont" :class="islike ? 'icon-xinh' : 'icon-xin'"></i>
                            </a>
                            <a ondragstart="return false" href="#">
                                <i class="iconfont icon-xiazai"></i>
                            </a>
                            <a ondragstart="return false" href="#">
                                <i class="iconfont icon-fenxiang"></i>
                            </a>
                            <a ondragstart="return false" href="#">
                                <i class="iconfont icon-xinxi"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="r-music-info">
                    <div class="t">
                        <p>{{$store.state.currentSongInfo.song_name || ''}}</p>
                        <p>
                            <span>歌手: {{$store.state.currentSongInfo.author_name || ''}}</span>
                            <span>专辑:{{$store.state.currentSongInfo.album_name || ''}}</span>
                        </p>
                        <div class="time">
                            <ul id="lyric" style="top: 170px">
                                <li v-for="(item, index) in comLyrics" :key="index" :class="{active: lyricIndex == index}">

                                    <span :class="$store.state.isPlay ? 'play' : 'pause'">{{item}}</span>
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="set-time" v-show="datum">
                            <a ondragstart="return false" href="#" @click.stop="setLyric">
                                <i class="iconfont icon-bofang1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg">
                <img :src="$store.state.currentSongInfo.img" alt>
            </div>
        </div>
        <div class="layer" v-show="$store.state.musicInterface"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            datum: false // 歌词滑动的线条是否显示
        }
    },
    computed: {
        comLyrics() {
            var time = [],
                lyric = [];
            // 如果有当前播放的音乐信息 则把歌词做处理
            if (typeof this.$store.state.currentSongInfo.img !== "undefined") {
                let lyc = this.$store.state.currentSongInfo.lyrics;
                var arr = new String(lyc).split("[");
                arr.shift();
                arr.forEach((ele, index) => {
                    time.push(new String(ele).split("]")[0]);
                    lyric.push(new String(ele).split("]")[1]);
                });
            }
            this.$store.state.lyricTime = time;


            return lyric;
        },
        lyricIndex() {
            return this.$store.state.lyricIndex;
        },

        islike(){
            return this.$store.state.islike
        },
        musicInterface(){
            return this.$store.state.musicInterface
        }
    },
    mounted() {
            var time = null;
            var old = 0;
            // 绑定歌词滑动的事件
            lyric.addEventListener("mousedown", e => {
                this.datum = true;
                clearTimeout(time);
                this.$store.state.slidableLyric = true;


                let num = e.clientY - lyric.offsetTop

                document.onmousemove = e => {
                    var t = e.clientY - num

                    // 歌词滑到了最底部
                    if (t < -lyric.offsetHeight + 214) {
                        t = -lyric.offsetHeight + 215
                    }

                    if (t > 184) {
                        t = 185
                    }



                    lyric.style.top = t + "px";
                };
                document.onmouseup = e => {

                    // 设置歌词位置 开启自动跳转歌词
                    time = setTimeout(() => {
                        this.$store.state.slidableLyric = false;
                        this.datum = false;
                    }, 3000);

                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            })
    },
    methods: {
        setLyric() {
            this.datum = false;
            var state = this.$store.state

            state.lyricIndex = Math.floor((170 - lyric.offsetTop) / 30);
            // 从数组取出当前时间
            var currentTime = state.lyricTime[state.lyricIndex]
            // '01:12.15'
            var arr = new String(currentTime).split(':')
            // ['01','12.15']
            var min = 0

            if (arr[0] > 0) {
                // +'01' * 60
                min = +arr[0] * 60
            }
            // 60 + +'12.15'
            music.currentTime = min + +arr[1]


        },
        comTime(index) {
            let lyricTime = this.$store.state.lyricTime
            
            if (index + 1 >= lyricTime.length) {
                
                return 5
            }

            var arr = new String(lyricTime[index]).split(':')
            var arr1 = new String(lyricTime[index + 1]).split(':')

            // ['01','12.15']
            var min = 0
            var min1 = 0

            if (arr[0] > 0) {
                min = +arr[0] * 60
            }

            if (arr1[0] > 0) {
                min1 = +arr1[0] * 60
            }



            return ((min1 + +arr1[1]) - (min + +arr[1])).toFixed(2)
        },
        addLike(){
            let store = this.$store;
            
            let item = {
                ...store.state.currentSongInfo
            }
            // 如果在hash表里找不到则添加进去，找到了则取消
            store.commit('addLike', {item, musicList: '我喜欢'})
            
        }
    },
    watch: {
        // 改变 当前歌词 一些属性
        lyricIndex(newVal, oldVal) {
            let span = lyric.children[newVal].children[0]

            span.style['max-width'] = 24 * span.innerText.length + 'px'
            span.style.animationDuration = this.comTime(newVal) + 's'
            if (this.$store.state.slidableLyric == false) {
                
                lyric.style.top = 170 - (30 * newVal) + "px";

            }
        }
    },

}
</script>

<style scoped>
.music-play-interface {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}
.interface {
    position: relative;
    z-index: 8;
    width: 1000px;
    height: 633px;
    padding: 70px 100px 70px 170px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.6);
}
.interface > div {
    position: relative;
    display: inline-block;
    width: 35%;
    height: 100%;
}
.interface > div > div {
    position: absolute;
}

.interface > div:last-child {
    width: 400px;
    padding: 0 75px 0 30px;
    box-sizing: border-box;
}

.l-music-info .img {    
    height: 270px;
    width: 270px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    margin: 90px auto 50px;
}
.l-music-info .btns {
    width: 100%;
    height: 80px;
}
.l-music-info .btns a {
    display: inline-block;
    height: 80px;
    width: 19%;
    line-height: 80px;
    text-align: center;
}
.l-music-info .btns a:not(:last-child) {
    margin-right: 12px;
}
.l-music-info .btns a i {
    font-size: 24px;
    color: #fff;
}
.r-music-info{
    margin-left: 50px;
}
.r-music-info > div {
    position: absolute;
}
.r-music-info p:first-child {
    margin-bottom: 10px;
    font-size: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #fff;
}
.r-music-info p:nth-of-type(2) {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 16px;
    color: #bbb;
}
.r-music-info p:nth-of-type(2) span:first-child {
    margin-right: 20px;
}
.t {
    width: 100%;
}
.t .time {
    height: 400px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin-top: 20px;
}
.t .time ul {
    position: absolute;
    left: 0;
    transition: 0.3s;
}
.time li {
    width: 325px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    font-size: 16px;
    transition: 0.3s;
}
.time li span {
    position: absolute;

}
.time li span.pause{
    animation-play-state: paused;
}
.time li span.play{
    animation-play-state: running;
}
.time li span:last-child{
    color: #fff;

}
.time li.active span:first-child {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-color: #5691eb;
    color: red;
    z-index: 1;
}
.time li.active span:first-child {
    animation-name: loop;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.46, 0.3, 0.99, 0.16);
}
@keyframes loop {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}
.time li.active {
    font-size: 16.5px;
    height: 60px;
    line-height: 60px;
    color: #5ba0f7;
    padding-left: 20px;
}

.set-time {
    height: 1px;
    width: 100%;
    position: absolute;
    top: 284px;
    left: -60px;

    background: linear-gradient(
        to right,
        #5ba0f7,
        transparent,
        transparent,
        transparent,
        transparent,
        transparent,
        #5691eb
    );
}
.set-time a {
    display: block;
    position: absolute;
    right: -22px;
    top: -9px;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    line-height: 18px;
    text-align: center;
}
.set-time a:hover i {
    color: #ccc;
}
.set-time a i {
    font-size: 18px;
    color: #fff;
    display: block;
    transition: color 0.3s;
}

.music-play-interface.outBg {
    animation-name: outBg;
}
.music-play-interface.enterBg {
    animation-name: enterBg;
}
@keyframes outBg {
    99% {
        z-index: 8;
    }
    100% {
        z-index: -2;
    }
}
@keyframes enterBg {
    100% {
        z-index: 8;
    }
}

.box {
    position: relative;
    z-index: 8;
    /* transform: translateY(calc(100% + 60px)); */
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}
.box.out {
    animation-name: out;
}
.box.enter {
    animation-name: enter;
}

@keyframes out {
    0% {
        transform: translateY(0%);
    }
    100% {
        transform: translateY(calc(100% + 60px));
    }
}
@keyframes enter {
    0% {
        transform: translateY(calc(100% + 60px));
    }
    100% {
        transform: translateY(0%);
    }
}

.bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 1000px;
    height: 633px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
}
.bg img {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    transform: scaleX(1.1) scaleY(1.2);
}
</style>
