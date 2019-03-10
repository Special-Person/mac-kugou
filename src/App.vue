<template>
    <div id="app">
        <div class="limit">
            <my-header></my-header>
            <div class="content">
                <my-left></my-left>
                <div class="my-right">
                    <router-view></router-view>
                </div>
            </div>
            <my-footer></my-footer>
        </div>
        <!-- 音乐播放界面 -->
        <music-interface />
        <audio id="music"></audio>
    </div>
</template>

<script>
import myHeader from '@/components/header'
import myLeft from '@/components/left'
import myFooter from '@/components/footer'
import musicInterface from '@/components/musicInterface'

import store from './store/store.js'
export default {
    name: 'App',
    components: {
        myHeader,
        myLeft,
        myFooter,
        musicInterface
    },
    mounted(){
        //歌曲准备完毕直接播放
        music.oncanplaythrough = () => {
            store.commit('play')
        }
        // 歌曲结束执行下一首/切换
        music.onended = () => {
            store.commit('ended')
        }
        // 判断是否开启快捷键
        if(store.state.hotKey){
            document.onkeydown = e => {
                store.commit('registerHotKey', e)
            }
        }else{
            document.onkeydown = null
        }
        
    },
    // 读取store数据
    computed: {
        // 当前播放列表
        playerList() {
            return store.state.playerList
        },
        // 历史播放列表
        historyPlayerList() {
            return store.state.historyPlayerList
        },
        // 收藏的歌单
        collectingSongs(){
            return store.state.collectingSongs
        },
        // 自建的歌单名称
        myLikeMusic(){
            return store.state.myLikeMusic
        }
    },
    // 一有变化就加入缓存
    watch: {
        playerList(newVal) {
            localStorage.setItem('playerList', JSON.stringify(newVal))
        },
        historyPlayerList(newVal) {
            localStorage.setItem('historyPlayerList', JSON.stringify(newVal))
        },
        collectingSongs(newVal){
            localStorage.setItem('collectingSongs', JSON.stringify(newVal))

        },
        myLikeMusic(newVal){
            localStorage.setItem('myLikeMusic', JSON.stringify(newVal))
        }
    }
}
</script>

<style>
@import "//at.alicdn.com/t/font_1047810_2redi1rck4z.css";

input:focus {
    outline: none;
}
* {
    padding: 0;
    margin: 0;
    list-style: none;
    text-decoration: none;
}
*:not(input) {
    user-select: none;
}
html,
body {
    position: relative;
    width: 100%;
    height: 100%;
}
#app {
    width: 1000px;
    height: 690px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #ccc;
    border-radius: 11px;
    box-shadow: 0px 0px 20px #ccc;
    font-weight: 300;
}
.limit {
    position: relative;
    width: 1000px;
    height: 695px;
    border-radius: 10px;
    overflow: hidden;
}
.my-right {
    float: left;
    height: 590px;
    width: 810px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
}
::-webkit-scrollbar {
    display: none;
}
.content::after {
    content: "";
    clear: both;
    display: block;
}

.layer {
    position: fixed;
    background-color: transparent;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 5;
    cursor: default;
}
.icon-xinh {
    color: red !important;
}
</style>
