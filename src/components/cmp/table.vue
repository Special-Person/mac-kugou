<template>
    <div>
        <table border="0" cellspacing="0" cellpadding="0">
            <tr class="table-header" :style="'background-color: ' + bgColor">
                <td>歌曲名</td>
                <td>歌手</td>
                <td>专辑</td>
                <td>时长</td>
            </tr>
            <tr class="music-info" @mousedown="ShowMenu($event, item, index)" v-for="(item, index) in musicList" :class="{active: index === musicListActive}" @click="musicListActive = index" @dblclick="playerMusic($event, index, item)" :key="index">
                <td>
                    <div class="info">
                        <p :class="{h: !item.topic}">
                            <span v-html="keyWord(item.songname || item.song_name || item.audio_name)"></span>
                            <span v-if="item.mvhash" class="label">MV</span>
                        </p>
                        <p v-if="item.topic">{{item.topic}}</p>
                    </div>
                    <div class="btns" :class="{topic : item.topic}">
                        <a ondragstart="return false" href="#" @click="playerMusic($event, index, item)" @dblclick.stop="" class="player">
                            <i class="iconfont icon-bofang2"></i>
                        </a>
                        <!-- 我喜欢 -->
                        <like @dblclick.stop="" :isLike="comLike(item)" :item="item" />
                        <a ondragstart="return false" href="#" class="download" @dblclick.stop="">
                            <i class="iconfont icon-xiazai" :class="item.price || item.play_url === '' ? 'shoufei' : ''"></i>
                        </a>
                    </div>
                </td>
                <td><span v-html="keyWord(item.singername || item.author_name || '')"></span></td>
                <td><span>{{item.album_name}}</span></td>
                <td>{{comTime(item.duration || item.timelength / 1000)}}</td>
            </tr>
            <tr v-show="toBottom" class="musicFooter">没有更多歌曲</tr>
        </table>
        <div class="layer mouseMenu" v-show="showMenu" @click="showMenu = false">
            <div class="menu mouseM">
                <a ondragstart="return false" href="#" @click="playMusic">播放</a>
                <a ondragstart="return false" href="#" @click="playLater">稍后播放</a>
                <div class="line"></div>
                <a ondragstart="return false" href="#">
                    收藏到
                    <div>
                        <a ondragstart="return false" href="#">新建歌单</a>
                        <a ondragstart="return false" href="#" v-for="(item, index) in $store.state.songList" :key="index.a" @click='addLikeMusic(item.txt)'>
                            {{item.txt}}
                        </a>
                        <a ondragstart="return false" href="#" v-for="(item, index) in $store.state.myLikeMusic" :key="index.a"  @click='addLikeMusic(item.txt)'>
                            {{item.txt}}
                        </a>
                    </div>
                </a>
                <a ondragstart="return false" href="#">下载</a>
                <a ondragstart="return false" href="#">分享</a>
                <a ondragstart="return false" href="#" @click="deleteMusic" v-show="$route.path === '/mylike'">从歌单删除</a>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../../store/store.js'
import like from '@/components/cmp/like'
export default {
    components: {
        like
    },
    props: {
        // 音乐列表
        musicList: {
            type: Array,
            default: []
        },
        // 是否到达最底部
        toBottom: {
            type: Boolean,
            default: false
        },
        bgColor: {
            type: String,
            default: '#fbfbfb'
        }
    },
    computed: {
        comLike() {
            return (item) => {
                let like = JSON.parse(localStorage.getItem('我喜欢')) || []
                for(let i = 0; i < like.length; i++){
                    if(like[i].hash === item.hash){
                        return true;
                    }
                }

                return false
            }
        }
    },
    data() {
        return {
            // 当前单击的音乐
            musicListActive: null,
            // 右键弹出的更多菜单
            showMenu: false,
            // 双击后播放获取当前的下表(再执行是否播放以及收藏操作)
            musicIndex: null
        }
    },
    methods: {
        addLikeMusic(txt){
            store.commit('addLike',{
                item: this.musicList[this.musicIndex],
                musicList: txt
            })

            setTimeout(() => {
                this.$router.push({
                    path: '/kong',
                    query: this.$router.query,
                    replace: true
                })
            },200)



        },
        keyWord(info) {
            if(this.$route.path === '/SearchMusicInfo'){
                let key = this.$route.query.musicname
                let reg = new RegExp(key, 'gi')
                let str = new String(info).replace(reg, '<span>'+ key +'</span>')
                return str
            }
            return info
            // 关键字高
        },
        ShowMenu(e, item, index) {
            // 判断是否是右键按下
            if (e.button === 2) {
                this.showMenu = true

                var menu = document.getElementsByClassName('mouseM')[0]
                var limit = document.getElementsByClassName('limit')[0]

                this.musicIndex = index
                menu.style.left = e.clientX - this.getElementTop(limit, 'Left') + 'px'
                menu.style.top = e.clientY - this.getElementTop(limit, 'Top') + 'px'

            }
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
        // 播放并加入历史记录
        playerMusic(e, index, musicItem) {


            store.state.currentPlayerIndex = index
            store.state.playerList = this.musicList;
            store.commit('searchMusic')

            store.commit('pushHistoryMusic')


            // tr背景处理
            setTimeout(() => {
                this.musicListActive = null
                if (e.target.parentNode.className.match(/active/g)) {
                    this.musicListActive = null
                }
            }, 800)

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
        playMusic() {
            store.state.playerList = this.musicList

            store.state.currentPlayerIndex = this.musicIndex
            store.commit('searchMusic')
            store.commit('pushHistoryMusic')
        },
        playLater(index) {
            store.commit('playLater', this.musicList[this.musicIndex])
        },
        deleteMusic(){
            if(this.$route.path !== "/mylike"){
                return;
            }
            store.commit('toggleLike',{
                item: this.musicList[this.musicIndex],
                musicList: this.$route.query.list
            })
            setTimeout(() => {
                this.$router.push({
                    path: '/kong',
                    query: this.$router.query,
                    replace: true
                })
            },200)
        }
    }
}
</script>

<style scoped>
table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
}
table tr.table-header td {
    color: #999;
}
table td {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 10px;
    color: #333;
}
table tr td:nth-of-type(1) {
    width: 390px;
    padding-left: 10px;
}
table tr td:nth-of-type(2) {
    width: 100px;
}
table tr td:nth-of-type(3) {
    width: 165px;
}
table tr td:nth-of-type(4) {
    width: 60px;
}
table tr td:nth-of-type(1) p {
    width: 290px;
}
table tr td p {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
}
table tr td p.h {
    height: 41px;
    line-height: 41px;
}
table tr td p.h span >>> span{
    color: #5aa0f8;
}
table td p span.label {
    border: 1px solid #5aa0f8;
    color: #5aa0f8;
    padding: 0 4px;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    display: inline-block;
    border-radius: 2px;
    transform: scale(0.8);
}
.music-info:not(:last-child) {
    border-bottom: 1px solid #e4e4e4;
}
.music-info:active {
    background-color: #f7f7f7;
}
.music-info.active {
    background-color: #f7f7f7;
}
.music-info:hover {
    border-color: #5aa0f8;
}
.music-info .info {
    float: left;
}
.musicFooter {
    display: inline-block;
    text-align: center;
    height: 50px;
    line-height: 50px;
    width: 700px;
    color: #999;
}

.music-info:hover .btns {
    display: inline-block;
}
.music-info .btns {
    display: none;
    float: right;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}
.music-info .btns.topic {
    height: 60px;
    line-height: 60px;
}
.music-info .btns i{
    position: relative;
}
.music-info .btns i.shoufei::after{
    content: '¥';
    background-color: #f3b342;
    border-radius: 50%;
    color: #fff;
    position: absolute;
    right: -3px;
    bottom: -3px;
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    text-align: center;
    font-size: 12px;
    transform: scale(.7);
}
.music-info .btns a {
    color: #777;
}
.music-info .btns a:hover {
    color: #5aa0f8;
}
.music-info .btns a:not(:first-child) {
    margin-left: 5px;
}

.mouseMenu {
    position: absolute;
    top: 0;
    left: 0;
    height: 690px;
    width: 1000px;
    z-index: 11;
}
.mouseMenu .menu {
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    width: 95px;
    color: #333;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    box-sizing: border-box;
    padding: 5px 0;
}
.mouseMenu .menu > div {
    height: 1px;
    width: 100%;
    background-color: #e4e4e4;
}
.mouseMenu .menu a {
    display: block;
    position: relative;
    padding: 0 15px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    color: #666;
    white-space: nowrap;
}
.mouseMenu .menu a:hover {
    background-color: #f3f3f3;
}
.mouseMenu .menu a:hover div {
    display: block;
}
.mouseMenu .menu a div {
    display: none;
    position: absolute;
    left: 93px;
    top: 0;
    width: 95px;
    color: #333;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
}
</style>
