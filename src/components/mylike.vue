<template>
    <div class="mylike">
        <div class="header">
            <div class="l">
                <img :src="likePlayerList.length === 0 ? require('../assets/like.png') : likePlayerList[0].img" alt="">
            </div>
            <div class="r">
                <p>
                    {{$route.query.list}}
                    <a ondragstart="return false" href="#">
                        <i class="iconfont icon-bianji"></i>
                        编辑菜单
                    </a>
                </p>
                <div class="time">2019-02-17 <span></span> 本</div>
                <div class="introduce">
                    介绍：好歌单岂能少了个性的介绍，快去补充一下吧!
                </div>
                <div class="btns">
                    <a ondragstart="return false" href="#" class="play" @click="playMusic" :class="likePlayerList.length === 0 ? 'disable' : ''"><i class="iconfont icon-bofang2"></i>播放全部</a>
                    <a ondragstart="return false" href="#" :class="likePlayerList.length === 0 ? 'disable' : ''"><i class="iconfont icon-xiazai"></i>全部下载</a>
                    <a ondragstart="return false" href="#"><i class="iconfont icon-fenxiang"></i>分享</a>
                </div>
            </div>

        </div>
        <div style="padding: 0 40px;"  v-show="likePlayerList.length !== 0">
            <my-table :musicList="likePlayerList" :bgColor="'#fff'"></my-table>
        </div>

        <div v-show="likePlayerList.length === 0" class="no-music">
            <i class="iconfont icon-yinyue"></i>
            <p>还没有收藏歌曲</p>
            <p>快去 <router-link to="/">在线音乐</router-link> 发现音乐吧</p>

        </div>
    </div>
</template>

<script>
import myTable from '@/components/table'
export default {
    components: {
        myTable
    },
    computed: {
        likePlayerList(){
            return JSON.parse(localStorage.getItem(this.$route.query.list)) || []
        }
    },
    data(){
        return{
            musicIndex: null
        }
    },
    mounted(){
        let self = this;

        setTimeout(() => {
          document.querySelector('.mylike').scrollTop = self.$store.state.mylikeScroll
        },200)

        document.querySelector('.mylike').onscroll = function () {
            self.$store.state.mylikeScroll = this.scrollTop
        }

    },
    methods: {
        playMusic(){

            this.$store.state.playerList = this.likePlayerList


            this.$store.state.currentPlayerIndex = this.musicIndex || 0


            this.$store.commit('searchMusic')

            this.$store.commit('pushHistoryMusic')



        }
    }
}
</script>

<style scoped>
.mylike{
    overflow: scroll;
    height: 590px;
}

.header{
    width: 100%;
    padding: 20px 40px;
    background-color: #f9f9f9;
    box-sizing: border-box;
}
.header > div{
    float: left;
    height: 160px;

}
.header .l{
    width: 160px;
    margin-right: 20px;
}

.header .l img{
   width: 100%
}

.header .r{
    width: 75%;
}
.r p{
    font-size: 24px;
    color: #000;
    margin-bottom: 20px;
}
.r p a{
    float: right;
    width: 90px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-radius: 20px;
    border: 1px solid #e4e4e4;
    padding: 0 10px;
    background-color: #fff;
}
.r p a i{
    font-size: 14px;
    color: #999;
}
.r p a:hover{
    color: #5aa0f8;
    border-color: #5aa0f8;
}
.r p a:hover i{
    color: #5aa0f8
}
.r .time{
    height: 22px;
    line-height: 22px;
    margin-bottom: 10px;
}
.r .time span{
    background-color: #e4e4e4;
    display: inline-block;
    width: 2px;
    height: 80%;
    line-height: 22px;
    margin: 0 10px;
    vertical-align: middle;
}
.r .introduce{
    font-size: 14px;
    color: #666;
    margin-bottom: 22px;
}

.r .btns a{
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    color: #666;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
}
.r .btns a i{
    font-size: 14px;
    margin-right: 5px;
}
.r .btns a.play{
    color: #fff;
    background-color: #5aa0f8;
    border-color: #5aa0f8;
}
.r .btns a.disable{
    opacity: 0.5;
}
.r .btns a:not(.play):not(.disable):hover{
    color: #5aa0f8;
    border-color: #5aa0f8;
}
.r .btns a.play:not(.disable):hover{
    background-color: #3f8fdb;
    border-color: #3f8fdb;
}


.header:after{
    content: '';
    clear: both;
    display: block;
}



.no-music{
    padding: 60px 20px;
    text-align: center;
    font-size: 16px;
    color: #999
}
.no-music i{
    font-size: 99px;
}
.no-music a{
    color: #5aa0f8;
}
</style>
