<template>
    <div class="music-control">
        <a ondragstart="return false" href="#" @click="showMusicInterface" class="singer">
            <img :src="currentSongInfo.img || require('../assets/logo.png')" width="40" height="40" alt>
            <i class="iconfont hide" :class="musicInterface ? 'icon-xiatui' : 'icon-shangtui'"></i>
        </a>
        <div class="progress-control">
            <div class="music-info">
                <div class="tone">
                    <a ondragstart="return false" href="#" class="quality" @click="toneQuality = !toneQuality">
                        {{quality}}
                        <i class="iconfont icon-shang-"></i>
                    </a>
                    <div class="info" :class="toneQuality ? 'show' : 'hide' ">
                        <label @click="toggleQuality($event)">
                            <input @click.stop type="radio" checked name="quality">标准
                        </label>
                        <label @click="toggleQuality($event)">
                            <input @click.stop type="radio" name="quality">高品品质
                        </label>
                        <label @click="toggleQuality($event)">
                            <input @click.stop type="radio" name="quality">无损品质
                        </label>
                        <label @click="toneQuality = false" for="checkbox" class="checkbox">
                            <input type="checkbox" checked id="checkbox">优先听选中音质
                        </label>
                    </div>
                    <div class="layer" v-show="toneQuality" @click="toneQuality = false"></div>
                    <span class="song-info">{{currentSongInfo.audio_name || '酷狗音乐 就是歌多'}}</span>
                    <span class="song-time">
                        <span id="startTime">{{comTime(currentTime)}}</span> /
                        <span id="allTime">{{comTime(maxTime || 0)}}</span>
                    </span>
                </div>
            </div>
            <div class="progress">
                <div class="pro" id="pro" style="width: 0%"></div>
                <div class="bg"></div>
                <div class="dot" id="dot" style="left: 0%"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            quality: "标准", // 当前音质
            toneQuality: false, // 音质选择
        }
    },
    methods: {

        showMusicInterface() {
            // 弹出音乐歌词界面
            if (typeof this.currentSongInfo.img !== "undefined") {
                this.$store.state.musicInterface = !this.$store.state.musicInterface;
            }
        },
        toggleQuality(e) {
            this.toneQuality = false;
            // 截取音质字符串前两位赋值
            this.quality = e.target.innerText.substr(0, 2);
        },
        comTime(time) {
            let min, second;

            if (Math.floor(time / 60) < 10) {
                min = "0" + Math.floor(time / 60);
            } else {
                min = Math.floor(time / 60);
            }

            if (time % 60 < 10) {
                second = "0" + Math.floor(time % 60);
            } else {
                second = Math.floor(time % 60);
            }

            return min + ":" + second;
        },
        getElementTop(elem, direction) {
            var elemTop = elem["offset" + direction]; //获得elem元素距相对定位的父元素的top
            elem = elem.offsetParent; //将elem换成起相对定位的父元素
            while (elem != null) {
                //只要还有相对定位的父元素
                //获得父元素 距他父元素的top值,累加到结果中
                elemTop += elem["offset" + direction]; //再次将elem换成他相对定位的父元素上;
                elem = elem.offsetParent;
            }
            return elemTop;
        }
    },
    computed: {
        ...mapState([ 'musicInterface', 'currentTime', 'maxTime','currentSongInfo'])

    },
    mounted() {
        // 音乐进度划动事件
        var progress = document.getElementsByClassName("progress")[0];
        var dot = document.getElementById('dot')
        dot.addEventListener("mousedown", e => {
            var left = this.getElementTop(progress, "Left");
            var num = 0;

            music.oncanplaythrough = null;
            music.ontimeupdate = null;

            document.onmousemove = e => {
                num = e.clientX - left;

                if (num > 399) {
                    num = 400;
                }
                if (num < 1) {
                    num = 0;
                }

                dot.style.left = "calc(" + (num / 400) * 100 + "% - 5px)";
                pro.style.width = (num / 400) * 100 + "%";

                this.$store.state.currentTime = Math.floor(
                    (num / 400) * music.duration
                );
            };
            document.onmouseup = e => {
                music.currentTime = (num / 400) * music.duration;
                music.oncanplaythrough = () => {
                    this.$store.commit("play");
                };

                document.onmousemove = null;
                document.onmouseup = null;
            };
        });
    },
    watch: {
        currentSongInfo(newVal, oldVal) {
            let like = JSON.parse(localStorage.getItem('我喜欢')) || []
            for(let i = 0; i < like.length; i++){
                if(like[i].hash === newVal.hash){
                    this.$store.state.islike = true;
                    break;
                }else{
                    this.$store.state.islike = false;
                }
            }
        }
    }
}
</script>

<style>
.music-control {
    display: inline-block;
    position: relative;
    width: 460px;
    height: 60px;
    vertical-align: middle;
    box-sizing: border-box;
}
.music-control .singer {
    display: inline-block;
    position: relative;
    height: 60px;
    line-height: 60px;
}
.music-control .singer img {
    border-radius: 3px;
    vertical-align: middle;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.music-control .singer i {
    opacity: 0;
    transition: 0.3s;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: auto;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);
    color: #f3f3f3;
}
.music-control .singer:hover i {
    opacity: 1;
}

.progress-control {
    display: inline-block;
    position: absolute;
    width: 400px;
    left: 50px;
    top: 10px;
}
.progress-control .tone {
    display: inline-block;
    width: 100%;
}
.progress-control .tone .quality {
    position: relative;
    color: #fff;
    border-radius: 10px;
    border: 1px solid #fff;
    font-size: 12px;
    padding: 1px 5px 1px 10px;
}
.progress-control .tone .quality i {
    font-size: 12px;
    line-height: 12px;
}
.tone .info {
    position: absolute;
    z-index: 6;
    bottom: 42px;
    left: -52px;
    width: 160px;
    transition: 0.6s;
    padding-top: 10px;
    color: #333;
    background-color: #fff;
    transform-origin: bottom;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    transform: translateZ(0);
}
.tone .info:before {
    content: "";
    width: 0;
    height: 0;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #fff transparent transparent;
    position: absolute;
    bottom: -10px;
    left: 68px;
}
.tone .info.hide {
    transform: scale(0);
}
.tone .info.show {
    transform: scale(1);
}
.tone .info label {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 10px;
    font-size: 12px;
    cursor: pointer;
}
.tone .info label:hover {
    background-color: #f4f4f4;
}
.tone .info label.checkbox {
    border-top: 1px solid #e4e4e4;
}
.tone .info label input {
    margin: 0 10px;
}
.tone .song-info {
    display: inline-block;
    color: #fff;
    width: 230px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;
}
.tone .song-time {
    float: right;
    color: #fff;
    vertical-align: baseline;
}

.progress-control .progress {
    position: relative;
    margin-top: 8px;
}
.progress .bg {
    position: absolute;
    height: 5px;
    width: calc(100% + 5px);
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
}
.progress .pro {
    position: absolute;
    height: 5px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    z-index: 1;
    background-color: #fff;
}
.progress .dot {
    position: absolute;
    bottom: -8px;
    width: 10px;
    height: 10px;
    z-index: 4;
    border-radius: 50%;
    cursor: pointer;
    background-color: #fff;
}
</style>
