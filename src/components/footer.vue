<template>
    <div class="footer" :style="'background: linear-gradient(to bottom, ' + bgColor + ')'">

        <play-group />
        <progress-group />
        <button-group :showMusicList="showMusicList" v-on:reverseMusicList="showMusicList = !showMusicList"/>
        
        <play-list-group :showMusicList="showMusicList" />
        <div class="layer" v-show="showMusicList" @click="showMusicList = false"></div>

        <div class="footer-bg">
            <div style="width: 1000px;height: 100%;position: absolute;z-index: 2;" :style="musicInterface === true ? 'background-color: rgba(0,0,0,.6)':'' "></div>
            <div class="black" :style="musicInterface === true ? 'background-image: url(' + currentSongInfo.img + ')' : 'background: linear-gradient(to bottom, ' + bgColor +');' "></div>
        </div>
    </div>
</template>

<script>
import store from '../store/store.js'

import playGroup from '@/components/playGroup'
import progressGroup from '@/components/progressGroup'
import buttonGroup from '@/components/buttonGroup'


import playListGroup from '@/components/playListGroup'
export default {
    components: {
        playGroup,
        progressGroup,
        buttonGroup,
        playListGroup
    },
    computed: {
        bgColor(){
            return store.state.bgColor
        },
        musicInterface(){
            return store.state.musicInterface
        },
        currentSongInfo(){
            return store.state.currentSongInfo
        }

    },
    data(){
        return {
            showMusicList: false
        }
    }
}
</script>

<style scoped>
.footer {
    position: relative;
    z-index: 10;
    height: 60px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #ccc;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.footer .footer-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 1000px;
    height: 60px;
    overflow: hidden;
    z-index: -1;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.footer .footer-bg .black {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    filter: blur(4px);
    transform: scale(1.2);
    background-size: 1000px 60px;
}
</style>
