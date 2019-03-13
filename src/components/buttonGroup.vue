<template>
    <div class="btns">
        <a ondragstart="return false" href="#" class="like" @click="reverseLike">
            <i class="iconfont" :class="islike ? 'icon-xinh' : 'icon-xin'"></i>
        </a>
        <a ondragstart="return false" href="#" class="download">
            <i class="iconfont icon-xiazai"></i>
        </a>
        <a ondragstart="return false" href="#" class="menu" @click="moreMenu = !moreMenu">
            <i class="iconfont icon-more"></i>
            <div class="moreMenu" :class="moreMenu ? 'show' : 'hide'">
                <a ondragstart="return false" href="#">
                    <i class="iconfont icon-tianjiawendang"></i>收藏到
                    <div>
                        <a ondragstart="return false" href="#">
                            <i class="iconfont icon-jia1"></i>新建歌单
                        </a>
                        <a ondragstart="return false" href="#" v-for="(item, index) in $store.state.songList" :key="index.a" @click='addLikeMusic(item.txt)'>
                            {{item.txt}}
                        </a>
                        <a ondragstart="return false" href="#" v-for="(item, index) in $store.state.myLikeMusic" :key="index.a" @click='addLikeMusic(item.txt)'>
                            {{item.txt}}
                        </a>
                    </div>
                </a>
                <a ondragstart="return false" href="#">
                    <i class="iconfont icon-xinxi"></i>评论
                </a>
                <a ondragstart="return false" href="#">
                    <i class="iconfont icon-fenxiang"></i>分享
                </a>
                <a ondragstart="return false" href="#">
                    <i class="iconfont icon-ttpodicon"></i>歌手
                    <div>
                        <a ondragstart="return false" href="#">{{currentSongInfo.author_name}}</a>
                    </div>
                </a>
                <a ondragstart="return false" href="#">
                    <i class="iconfont icon-zhuanji"></i>专辑
                </a>
            </div>
            <div class="layer" v-show="moreMenu" @click="moreMenu = true"></div>
        </a>
        <a ondragstart="return false" href="#" class="sound-effects" @click="soundEffects = !soundEffects">
            <i class="iconfont icon-dian" :class="isSound ? 'open' : 'off'"></i>
            <span>{{isSound ? sound : '音效'}}</span>
            <div class="sound-list" @click.stop :class="soundEffects ? 'show' : 'hide' ">
                <div class="title">蝰蛇音效
                    <a ondragstart="return false" href="#" @click="isSound = !isSound">
                        <i class="iconfont" :class="isSound ? 'icon-kaiguankai' : 'icon-kaiguanguan'"></i>
                    </a>
                </div>
                <p>官方推荐</p>
                <ul>
                    <li v-for="(item, index) in allSound" :key="index" @click="soundActive = index; sound = item.sound">
                        <i class="iconfont icon-dui" :class="soundActive == index ? 'show' : 'hide'"></i>
                        {{item.title}}
                        <span v-if="item.type === 1">耳机更佳</span>
                    </li>
                </ul>
            </div>
            <div class="layer" v-show="soundEffects" @click="soundEffects = true"></div>
        </a>
        <a ondragstart="return false" href="#" class="word">
            <i class="iconfont icon-lrc"></i>
        </a>
        <a ondragstart="return false" href="#" class="loop" @click="isPlayBack = !isPlayBack">
            <i class="iconfont" :class="playBackIcon"></i>
            <div class="playback" @click.stop :class="isPlayBack ? 'show' : 'hide' ">
                <a ondragstart="return false" href="#" v-for="(item, index) in playBackIcons" :key="index" @click="comPlayBack(index)" :class="{active: $store.state.playBackActive === index}">
                    <i :class="'iconfont ' + item.icon"></i>
                    {{item.title}}
                </a>
            </div>
            <div class="layer" v-show="isPlayBack" @click="isPlayBack = true"></div>
        </a>
        <a ondragstart="return false" href="#" class="voice" @click="currentMusicVolume = !currentMusicVolume">
            <i class="iconfont" :class="currentMusicVolume ? 'icon-shengyin' : 'icon-jingyin'"></i>
            <div class="voice-control" @click.stop="">
                <div class="vc">
                    <div class="pro" @click="jumpVolume($event)" ref="volume" id="voicePro" style="height: 100px"></div>
                    <div class="bg" @click="jumpVolume($event)"></div>
                    <div class="dot" ref="voice" id="voiceDot" style="bottom: 95px;"></div>
                </div>
            </div>
        </a>
        <a ondragstart="return false" href="#" class="list" @click="$emit('reverseMusicList')">
            <i class="iconfont icon-yinleliebiao"></i>
            {{playerList.length}}
        </a>
    </div>
</template>

<script>
import store from '../store/store.js'


export default {
    props: {
        showMusicList: {
            type: Boolean
        }
    },
    data() {
        return {
            moreMenu: false, // 是否弹出更多菜单
            sound: "丽音", // 当前音效
            soundEffects: false, // 音效选择
            isSound: true, // 是否开启音效
            allSound: [
                { title: "3D丽音", sound: "丽音", type: 1 },
                { title: "HiFi现场", sound: "现场", type: 0 },
                { title: "超低重音", sound: "低音", type: 0 },
                { title: "纯净人声", sound: "人声", type: 0 },
                { title: "3D旋转", sound: "旋转", type: 1 }
            ],
            soundActive: 0, //当前选择的音效下标
            isPlayBack: false, // 是否弹出音乐循环
            playBackIcon: "icon-xunhuanbofang", // 音乐循环的icon
            playBackIcons: [
                { icon: "icon-xunhuanbofang", title: "循环播放" },
                { icon: "icon-ziyuan1", title: "单曲播放" },
                { icon: "icon-suijibofang", title: "随机播放" }
            ],
            currentMusicVolume: true,
            currentMusicVolumeNum: 1
        }
    },
    computed: {
        islike() {
            return store.state.islike
        },
        playerList() {
            return store.state.playerList
        },
        currentSongInfo() {
            return store.state.currentSongInfo
        }

    },
    mounted() {
        var voice = this.$refs.voice; // dot
        var volume = this.$refs.volume; // pro
        // 音量划动事件
        var voiceControl = document.getElementsByClassName("voice-control")[0];
        voice.addEventListener("mousedown", e => {
            var vcTop = this.getElementTop(voiceControl, "Top");
            var num = vcTop - e.clientY + 105;
            document.onmousemove = e => {
                num = vcTop - e.clientY + 105;

                if (num > 99) {
                    num = 100;
                }
                if (num < 1) {
                    num = 0;
                }
                voice.style.bottom = num - 5 + "px";
                volume.style.height = num + "px";

                music.volume = num / 100;
                if (music.volume) {
                    this.currentMusicVolume = true;
                } else {
                    this.currentMusicVolume = false;
                }
                this.currentMusicVolumeNum = num / 100;
            };

            document.onmouseup = e => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        });
    },
    methods: {
        reverseLike() {
            if (JSON.stringify(this.currentSongInfo) == "{}") {
                return
            }
            let item = {
                ...this.currentSongInfo,
                song_name: this.currentSongInfo.song_name,
                author_name: this.currentSongInfo.author_name,
                album_name: this.currentSongInfo.album_name,
                timelength: this.currentSongInfo.timelength,
                img: this.currentSongInfo.img,
                hash: this.currentSongInfo.hash

            }

            store.commit('toggleLike', {
                item,
                musicList: '我喜欢'
            })

            setTimeout(() => {
                this.$router.push({
                    path: '/kong',
                    query: this.$router.query,
                    replace: true
                })
            }, 200)

        },
        addLikeMusic(txt) {
            store.commit('addLike', {
                item: this.currentSongInfo,
                musicList: txt
            })
            setTimeout(() => {
                this.$router.push({
                    path: '/kong',
                    query: this.$router.query,
                    replace: true
                })
            }, 200)


        },
        jumpVolume(e) {
            let dom = document.getElementsByClassName('bg')[1]
            var voice = this.$refs.voice; // dot
            var volume = this.$refs.volume; // pro
            music.volume = (100 - (e.clientY - this.getElementTop(dom, "Top"))) / 100
            voice.style.bottom = 95 - (e.clientY - this.getElementTop(dom, "Top")) + 'px'
            volume.style.height = 100 - (e.clientY - this.getElementTop(dom, "Top")) + 'px'
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
        },
        comPlayBack(index) {
            store.state.playBackActive = index;
            this.isPlayBack = false;
            if (index == 0) {
                music.loop = "";
            }
            if (index == 1) {
                music.loop = "loop";
            }
            if (index == 2) {
                music.loop = "";
            }
            this.playBackIcon = this.playBackIcons[index].icon;
        },
    },
    watch: {

        // 静音切换
        currentMusicVolume() {
            var voice = this.$refs.voice; // dot
            var volume = this.$refs.volume; // pro

            if (this.currentMusicVolume) {
                music.volume = this.currentMusicVolumeNum;
                voice.style.bottom =
                    this.currentMusicVolumeNum * 100 - 5 + "px";
                volume.style.height = this.currentMusicVolumeNum * 100 + "px";
            } else {
                music.volume = 0;
                voice.style.bottom = "-5px";
                volume.style.height = "0px";
            }
        },
    }
}
</script>

<style scoped>
.btns {
    display: inline-block;
}
.btns > a {
    color: #fff;
    line-height: 55px;
}
.btns > a:not(:last-child) {
    margin-right: 8px;
}
.btns i {
    color: #fff;
    font-size: 20px;
    vertical-align: middle;
}
.btns i:hover {
    color: #e4e4e4;
    border-color: #e4e4e4 !important;
}
.btns a i.icon-xinh {
    color: #f00;
}

.btns a.menu {
    position: relative;
}
.btns a.menu > i {
    border: 1px solid #fff;
    font-size: 12px;
    padding: 0 1px;
    border-radius: 50%;
}
.btns a.menu .moreMenu {
    position: absolute;
    z-index: 6;
    bottom: 40px;
    right: -55px;
    width: 135px;
    transition: 0.6s;
    transform-origin: bottom;
    box-shadow: 0 0 10px #ccc;
    border-radius: 4px;
}

.btns a.menu .moreMenu > a:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.btns a.menu .moreMenu > a:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.btns a.menu .moreMenu:before {
    content: "";
    width: 0;
    height: 0;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #fff transparent transparent;
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
}
.btns a.menu .moreMenu a {
    color: #333;
    background-color: #fff;
}
.btns a.menu .moreMenu.hide {
    transform: scale(0);
}
.btns a.menu .moreMenu.show {
    transform: scale(1);
}
.btns a.menu .moreMenu a:not(:first-child) {
    border-top: 1px solid #e4e4e4;
}
.btns a.menu .moreMenu a {
    display: block;
    position: relative;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #666;
    box-sizing: border-box;
}
.btns a.menu .moreMenu a:hover {
    background-color: #e4e4e4;
}
.btns a.menu .moreMenu a:hover div {
    display: block;
}
.btns a.menu .moreMenu a i {
    color: #333;
    margin-right: 10px;
    font-size: 12px;
    padding: 0 1px;
    border-radius: 50%;
}
.btns a.menu .moreMenu a div {
    display: none;
    position: absolute;
    left: 135px;
    top: 0;
    width: 135px;
    color: #333;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
}
.btns a.menu .moreMenu a div a:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.btns a.menu .moreMenu a div a:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.btns a.word i {
    font-size: 25px;
}
.btns a.loop {
    display: inline-block;
    position: relative;
    width: 25px;
}
.btns a.loop .playback {
    position: absolute;
    right: -55px;
    bottom: 55px;
    width: 135px;
    transition: 0.6s;
    z-index: 6;
    box-sizing: border-box;
    background-color: #fff;
    transform-origin: bottom;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    transform: scale(0);
}
.btns a.loop .playback:before {
    content: "";
    width: 0;
    height: 0;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #fff transparent transparent;
    position: absolute;
    bottom: -10px;
    right: 55px;
}
.btns a.loop .playback.hide {
    transform: scale(0);
}
.btns a.loop .playback.show {
    transform: scale(1);
}
.btns a.loop .playback a {
    display: block;
    height: 40px;
    line-height: 40px;
    color: #555;
    font-size: 14px;
}
.btns a.loop .playback a:hover {
    background-color: #f8f8f8;
}
.btns a.loop .playback a i {
    font-size: 20px;
    color: #555;
    width: 55px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}

.btns a.voice {
    position: relative;
    display: inline-block;
    cursor: pointer;
}
.btns a.voice .voice-control {
    position: absolute;
    left: -8px;
    bottom: 55px;
    width: 40px;
    height: 120px;
    transition: 0.6s;
    padding: 9px 18px;
    box-sizing: border-box;
    background-color: #fff;
    transform-origin: bottom;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    transform: scale(0);
    cursor: default;
}
.btns a.voice .voice-control:before {
    content: "";
    width: 0;
    height: 0;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: #fff transparent transparent;
    position: absolute;
    bottom: -10px;
    right: 8px;
}
.btns a.voice:hover .voice-control {
    transform: scale(1);
}
.voice-control .vc {
    position: relative;
    width: 100%;
    height: 100%;
}
.btns a.voice .bg {
    position: absolute;
    bottom: 0px;
    height: 100px;
    width: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    cursor: pointer;
}
.btns a.voice .pro {
    position: absolute;
    bottom: 0px;
    width: 4px;
    border-radius: 2px;
    z-index: 1;
    background-color: #5691eb;
    cursor: pointer;
}
.btns a.voice .dot {
    position: absolute;
    bottom: -5px;
    left: -3px;
    height: 10px;
    width: 10px;
    z-index: 4;
    border-radius: 50%;
    cursor: pointer;
    background-color: #5691eb;
}

.btns a.list {
    position: relative;
    font-size: 14px;
    display: inline-block;
    white-space: nowrap;
    width: 50px;
    height: 20px;
    line-height: 20px;
}
.btns a.list i {
    font-size: 28px;
}

.sound-effects {
    position: relative;
    font-size: 13px;
    padding: 2px 0;
    padding-right: 5px;
    border: 1px solid #fff;
    border-radius: 20px;
}
.sound-effects > i:hover,
.sound-effects > span:hover {
    border-color: #e4e4e4;
    color: #e4e4e4;
}
.sound-effects > i {
    line-height: 14px;
    vertical-align: sub;
}
.sound-effects > i.open {
    color: #72f359;
}
.sound-effects > i.off {
    color: #e4e4e4;
}
.sound-effects .sound-list {
    position: absolute;
    z-index: 6;
    bottom: 40px;
    left: -100px;
    width: 280px;
    transition: 0.6s;
    color: #333;
    background-color: #fff;
    transform-origin: 135px 327px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    cursor: default;
}
.sound-effects .sound-list.hide {
    transform: scale(0);
}
.sound-effects .sound-list.show {
    transform: scale(1);
}
.sound-effects .sound-list i.icon-kaiguanguan {
    color: #e4e4e4;
}
.sound-effects .sound-list i.icon-kaiguankai {
    color: #72f359;
}

.sound-list .title {
    font-size: 34px;
    padding: 10px 20px;
    font-family: kai;
    width: 100%;
    box-sizing: border-box;
}
.sound-list .title a {
    float: right;
}
.sound-list .title a i {
    font-size: 42px;
}
.sound-list p {
    box-sizing: border-box;
    padding-left: 30px;
    font-size: 12px;
    background-color: #f5f5f5;
    height: 25px;
    line-height: 25px;
}
.sound-list li {
    box-sizing: border-box;
    padding-left: 30px;
    height: 45px;
    line-height: 45px;
    cursor: pointer;
}
.sound-list li:hover {
    background-color: #f7f7f7;
}
.sound-list li i {
    margin-right: 5px;
}
.sound-list li i.show {
    color: #5691eb;
}
.sound-list li i.hide {
    color: transparent;
}
.sound-list li span {
    border-radius: 20px;
    border: 1px solid #e4e4e4;
    font-size: 12px;
    padding: 3px 5px;
    line-height: 10px;
    height: 10px;
    transform: scale(0.9);
    margin-left: 10px;
    vertical-align: baseline;
    display: inline-block;
    color: #999;
}
</style>
