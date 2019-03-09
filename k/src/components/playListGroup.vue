<template>
    <div class="music-list" :class="[musicInterface ? 'h' :'', showMusicList ? 'show' : 'hide']" @click.stop>
        <div class="tabs">
            <span @click="tabActive = 0" :class="{active: tabActive === 0}">播放列表</span>
            |
            <span @click="tabActive = 1" :class="{active: tabActive === 1}">播放历史</span>
        </div>
        <div v-show="tabActive === 0">
            <p>
                共{{playerList.length}}首歌
                <a ondragstart="return false" href="#" @click="$store.state.playerList = []">
                    <i class="iconfont icon-lajitong"></i>清空
                </a>
            </p>
            <div class="list" :class="musicInterface ? 'h' :''">
                <ul>
                    <li v-for="(item, index) in playerList" :key="index" @click="clickList = index" @dblclick="playMusic(item,index)" :class="{active : $store.state.currentPlayerIndex == index,clickActive : clickList == index}">

                        <pinpu :class="isPlay ? 'bofang' : 'zanting'" />
                        <div class="song-img" v-show="$store.state.currentPlayerIndex == index">
                            <img :src="currentSongInfo.img  || require('../assets/logo.png')" height="53" width="55" alt>
                        </div>
                        <div class="song-info-open" v-show="$store.state.currentPlayerIndex == index">
                            <p>{{item.song_name || item.songname || comSongName(item.filename, 1) }}</p>
                            <p>{{item.author_name || item.singername || comSongName(item.filename, 0)}}</p>
                        </div>
                        <div class="song-info-off" v-show="$store.state.currentPlayerIndex !== index">
                            <p>{{item.filename || item.songname || item.audio_name }}</p>
                        </div>
                        <div class="allTime">{{comTime(item.duration || item.time / 1000 || item.timelength / 1000)}}</div>
                        <div class="btns">
                            <!-- 我喜欢 -->
                            <like :isLike="comLike(item)" :item="item" />
                            <!-- 删除当前音乐 -->
                            <a ondragstart="return false" href="#" @click="clearCurrentMusic('playerList', index)" @dblclick.stop="">
                                <i class="iconfont icon-lajitong"></i>
                            </a>
                            <a ondragstart="return false" href="#">
                                <i class="iconfont icon-more"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="tabActive === 1">
            <p>
                共{{historyPlayerList.length}}首歌
                <a ondragstart="return false" href="#" @click="$store.state.historyPlayerList = []">
                    <i class="iconfont icon-lajitong"></i>清空
                </a>
            </p>

            <div class="list" :class="musicInterface ? 'h' :''">
                <ul>
                    <li v-for="(item, index) in historyPlayerList" :key="index" @click="clickList = index" @dblclick="historyPlayMusic(item,index)" :class="{clickActive : clickList == index}">
                        <pinpu :class="isPlay ? 'bofang' : 'zanting'" />
                        <div class="song-info-off">
                            <p>{{item.songname || item.filename || item.audio_name}}</p>
                        </div>
                        <div class="allTime">{{comTime(item.duration || item.timelength / 1000)}}</div>
                        <div class="btns">
                            <!-- 我喜欢 -->
                            <like :isLike="comLike(item)" :item="item" />
                            <!-- 删除当前音乐 -->
                            <a ondragstart="return false" href="#" @click="clearCurrentMusic('historyPlayerList', index)" @dblclick.stop="">
                                <i class="iconfont icon-lajitong"></i>
                            </a>
                            <a ondragstart="return false" href="#">
                                <i class="iconfont icon-more"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../store/store.js'
import like from '@/components/like'
import pinpu from '@/components/pinpu'
export default {
    components: {
        like,
        pinpu
    },
    props: {
        showMusicList: {
            type: Boolean
        }
    },
    computed: {
        ...mapState(['isPlay','currentSongInfo','musicInterface','playerList','historyPlayerList','currentPlayerIndex']),
        
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
    data(){
        return{
            tabActive: 0, // 播放列表与播放历史切换
            clickList: null, // 点击当前音乐列表添加背景
        }
    },
    methods: {

        comSongName(name, index){
            return new String(name).split(' - ')[index]
        },
        // 播放列表
        playMusic(item, index) {
            // 把搜索音乐列表赋值给播放列表
            store.state.playerList = this.playerList;

            // 双击播放音乐下表
            store.state.currentPlayerIndex = index;

            store.commit("searchMusic");
            // 加入历史音乐列表记录
            store.commit("pushHistoryMusic");
        },
        // 历史播放列表
        historyPlayMusic(item, index) {
            // 深克隆历史音乐列表
            store.state.playerList = JSON.parse(JSON.stringify(this.historyPlayerList));

            // 双击播放音乐下表
            store.state.currentPlayerIndex = index;
            store.commit("searchMusic");
            // 加入历史音乐列表记录
            store.commit("pushHistoryMusic");
        },
        // 播放列表: 点击删除当前要删除的音乐
        clearCurrentMusic(musicList, i) {
            // 如果是当前播放的音乐 则删除切换下一首
            if (musicList === 'playerList' && this.currentSongInfo.hash === this.playerList[i].hash) {
                store.commit('ended')
                store.state.currentPlayerIndex--
            }
            store.state[musicList] = this[musicList].filter((item, index) => index !== i)
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
        }
    }
}
</script>

<style scoped>
.music-list {
    position: absolute;
    z-index: 6;
    right: 0px;
    bottom: 60px;
    width: 355px;
    height: 588px;
    box-sizing: border-box;
    background-color: #fff;
    transform-origin: bottom;
    border-left: 1px solid #e4e4e4;
    cursor: default;
    color: #333;
}
.music-list.hide {
    display: none;
}
.music-list.show {
    display: block;
}
.music-list.h {
    height: calc(588px + 45px);
}
.music-list .tabs {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #999;
    padding: 9px 18px 0;
}
.music-list .tabs .active {
    color: #333;
}
.music-list > div > p {
    padding: 0 18px;
    border-bottom: 1px solid #e4e4e4;
    height: 22px;
    line-height: 16px;
    font-size: 12px;
    color: #999;
    box-sizing: border-box;
}
.music-list > div > p a {
    float: right;
    color: #999;
    font-size: 12px;
}
.music-list > div > p a i.iconfont {
    color: #999;
    font-size: 20px;
    margin-right: 5px;
}
.music-list > div > p a i.iconfont:hover {
    color: #5691eb;
}
.music-list .list {
    height: 517px;
    overflow: auto;
}
.music-list .list.h {
    height: calc(517px + 45px);
}

.music-list .list::-webkit-scrollbar {
    display: none;
}
.music-list .list li {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    position: relative;
}
.music-list .list li.active {
    height: 55px;
    line-height: 55px;
    margin-top: -1px;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
}
.music-list .list li.clickActive {
    background-color: rgba(238, 238, 238, 0.5);
}
.music-list .list li >>> .wrap {
    height: 40px;
}
.music-list .list li >>> .wrap.bofang ul li {
    animation-name: living;
}
.music-list .list li >>> .wrap.zanting ul li {
    animation-name: none;
}
.music-list .list li.active >>> .wrap {
    height: 54px;
}
.music-list .list li.active >>> .wrap ul li {
    background-color: #5691eb;
}

.music-list .list .song-img {
    display: none;
}
.music-list .list li.active .song-img {
    display: block;
    float: left;
    height: 53px;
    margin-right: 10px;
}
.music-list .list li .song-info-open {
    float: left;
}
.music-list .list li .song-info-open p:first-child {
    width: 190px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.music-list .list li .song-info-off p {
    width: 190px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.music-list .list li .song-info-open p {
    height: 27px;
    line-height: 27px;
    color: #5691eb;
}
.music-list .list li .allTime {
    position: absolute;
    right: 10px;
    top: 0;
    height: 40px;
    line-height: 40px;
    color: #999;
}
.music-list .list li.active .allTime {
    height: 25px;
    line-height: 25px;
}

.music-list .list li .btns {
    display: none;
    position: absolute;
    right: 10px;
    bottom: 0;
    height: 40px;
    line-height: 40px;
}
.music-list .list li.active .btns {
    display: block;
}
.music-list .list li:hover {
    background-color: rgba(238, 238, 238, 0.5);
}
.music-list .list li:hover .btns {
    display: block;
}
.music-list .list li:not(.active):hover .allTime {
    display: none;
}
.music-list .list li .btns i {
    font-size: 18px;
    color: #999;
}
.music-list .list li .btns a {
    height: 40px;
    line-height: 40px;
}
.music-list .list li .btns a:not(:last-child) {
    margin-right: 5px;
}
.music-list .list li.active .btns {
    height: 25px;
    line-height: 25px;
}
.music-list .list li.active .btns a {
    height: 25px;
    line-height: 25px;
}

.music-list .list li::after {
    content: "";
    clear: both;
    display: block;
}
</style>
