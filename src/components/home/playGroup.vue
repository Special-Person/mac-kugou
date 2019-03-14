<template>
    <div class="song-control">
        <a ondragstart="return false" href="#" @click="prevMusic">
            <i class="iconfont clrcle icon-shangyishou"></i>
        </a>
        <a ondragstart="return false" href="#" @click="togglePlayer">
            <i class="iconfont" :class="isPlay ? 'icon-zanting' : 'icon-bofang1'" style="font-size:42px;"></i>
        </a>
        <a ondragstart="return false" href="#" @click="nextMusic">
            <i class="iconfont clrcle icon-xiayishou"></i>
        </a>
    </div>
</template>

<script>
import store from '../../store/store.js'
export default {
    computed: {
        isPlay(){
            return store.state.isPlay
        }
    },
    methods: {
        prevMusic() {

            if (this.$store.state.playBackActive === 2) {
                this.$store.commit("ended");
            } else {
                if (this.$store.state.currentPlayerIndex - 1 < 0) {
                    this.$store.state.currentPlayerIndex = this.$store.state.playerList.length - 1
                }else{
                    this.$store.state.currentPlayerIndex -= 1;
                }
                this.$store.commit("searchMusic");
            }
        },
        togglePlayer() {
            if (store.state.currentPlayerIndex === null) {
                store.state.currentPlayerIndex = 0;
                store.commit("searchMusic");
                return;
            }

            store.commit("pause");
        },
        nextMusic() {
            this.$store.commit("ended");
        },
    }
}
</script>

<style>
.song-control {
    margin-right: 25px;
    height: 60px;
    line-height: 60px;
    display: inline-block;
}
.song-control a:not(:last-child) {
    margin-right: 10px;
}
.song-control a i {
    color: #fff;
    transition: 0.3s;
    font-size: 28px;
    vertical-align: middle;
}
.song-control a i:hover {
    color: #e4e4e4;
}

i.clrcle {
    border: 2px solid #fff;
    border-radius: 50%;
}
i.clrcle:hover {
    border-color: #e4e4e4;
}
</style>
