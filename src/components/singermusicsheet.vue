<template>
    <div class="scroll">
        <div class="header">
            <div class="l">
                <img :src="comImg($route.query.img)" alt="">
            </div>
            <div class="r">
                <p>
                    {{$route.query.singername}}
                </p>
                <div class="time">
                    {{new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()  }}
                    <span class="line"></span>
                    暂无歌手信息api...
                    <span v-for="(item, index) in info.tags" :key="index">{{item.tagname}}</span>
                </div>
                <div class="introduce">
                    <p>介绍：暂无歌手信息api...</p>
                    <span v-show="new String(info.intro).length > 30" @click="showDetails = !showDetails">详情</span>
                    <div class="details" v-show="showDetails">
                        <div class="scroll">
                            <p>{{info.specialname}}</p>
                            <p v-for="(item, index) in new String(info.intro).split('\n')" :key="index">
                                {{item}}
                            </p>
                            <p class="author">{{info.nickname}}</p>
                            <p>{{new String(info.publishtime).substring(0, 10)}}</p>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <a ondragstart="return false" href="#" class="play" @click="allPlayMusic" :class="playerList.length === 0 ? 'disable' : ''"><i class="iconfont icon-bofang2"></i>播放全部</a>
                    <a ondragstart="return false" href="#" :class="playerList.length === 0 ? 'disable' : ''"><i class="iconfont icon-xiazai"></i>全部下载</a>
                    <a ondragstart="return false" href="#"><i class="iconfont icon-xin"></i>收藏</a>
                    <a ondragstart="return false" href="#"><i class="iconfont icon-fenxiang"></i>分享</a>
                </div>

            </div>
        </div>
        <div style="padding: 0 40px;">
            <my-table :musicList="playerList" :bgColor="'#fff'"></my-table>
        </div>
        <div class="layer" v-show="loading === false"></div>
    </div>
</template>

<script>
import myTable from '@/components/table'
export default {
    components: {
        myTable
    },
    data(){
        return{
            loading: false,
            info: {},
            playerList: [],
            showDetails: false
        }
    },
    created(){
        let arr = []
            // 歌单
            this.axios.get('/search/api/v3/search/song?format=json&keyword=' + this.$route.query.singername + '&page=' + this.page)
            .then(res => {
                var musicList = res.data.data.info
                musicList.forEach(item => {
                    this.axios.get('player/yy/index.php?r=play/getdata&hash=' + item.hash)
                    .then(res => {
                        arr.push(res.data.data)
                    })

                });
                this.playerList = arr

                this.loading = true
            })
            // 歌手信息 只在手机模拟端获取的到接口，故放弃做歌手信息
            // this.axios.get('/musicinfo/singer/info/' + this.$route.query.id + '?json=true').then(res => {})


    },
    methods: {

        comImg(src) {
            let reg = new RegExp('{size}','g')
            let str = new String(src);
            return str.replace(reg, 240)
        },
        playMusic(){
            this.$store.state.currentPlayerIndex = this.musicIndex
            this.playM()
        },
        allPlayMusic(){
            this.$store.state.currentPlayerIndex = 0
            this.playM()
        },
        playM(){
            this.$store.state.playerList = this.playerList;
            this.$store.commit('searchMusic')

            this.$store.commit('pushHistoryMusic')
        }
    }
}
</script>

<style scoped>
.header{
    box-sizing: border-box;
    width: 100%;
    padding: 20px 40px;
    background-color: #f9f9f9;

}
.header > div{
    float: left;
    height: 160px;
    
}
.header .l{
    position: relative;
    width: 160px;
    margin-right: 20px;
}

.header .l img{
   width: 100% 
}

.header .r{
    position: relative;
    width: 75%;
}
.r > p{
    font-size: 24px;
    color: #000;
    margin-bottom: 20px;
}

.r .time{
    height: 22px;
    line-height: 22px;
    margin-bottom: 10px;
}
.r .time span.line{
    background-color: #e4e4e4;
    display: inline-block;
    width: 2px;
    height: 80%;
    line-height: 22px;
    margin: 0 10px;
    vertical-align: middle;
}
.r .introduce{
    position: relative;
    font-size: 13px;
    margin-bottom: 14px;
    height: 30px;
    line-height: 30px;
}
.r .introduce::after{
    content: '';
    clear: both;
    display: block;
}
.r .introduce > p{
    float: left;
    color: #666;
    width: 500px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.r .introduce span{
    float: right;
    width: 40px;
    height: 20px;
    line-height: 20px;
    margin-top: 5px;
    text-align: center;
    color: #666;
    border: 1px solid #e4e4e4;
    border-radius: 10px;
    cursor: pointer;
}
.r .introduce .details{
    position: absolute;
    right: -30px;
    top: 40px;
    z-index: 6;
    transition: 0.6s;
    color: #333;
    background-color: #fff;
    transform-origin: 146px 0;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    padding: 10px 0;
}
.r .introduce .details .scroll{
    width: 290px;
    height: 375px;
    padding: 0 25px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
}
.r .introduce .details:before {
    content: "";
    position: absolute;
    top: -7px;
    right: 42px;
    width: 0;
    height: 0px;
    border: 7px solid;
    border-color: transparent #fff #fff transparent;
    transform: rotate(225deg);
    box-shadow: 1px 1px 1px #ccc;

}
.r .introduce .details p:first-child{
    padding-bottom: 10px;
    font-size: 22px;
    color: #333;
    border-bottom: 1px solid #e4e4e4;
}
.r .introduce .details p{
    color: #999;
}
.r .introduce .details .author{
    margin-top: 50px;
    text-align: right;
}
.r .introduce .details p:last-child{
    text-align: right;
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
</style>
