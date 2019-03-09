<template>
    <div class="rank">
        <div class="l">
            <div class="list">
                <p>热门榜单 <a href="#" @click="showList($event)"><i class="iconfont icon-shang-"></i></a></p>
                <ul>
                    <li v-for="(item, index) in list1" :key="index" :class="{active: index === active}" @click="active = index">
                        <img :src="comImg(item.imgurl)" width="16" alt="">
                        <span>{{item.rankname}}</span>
                    </li>
                </ul>
            </div>
            <div class="list">
                <p>特色音乐榜 <a href="#" @click="showList($event)"><i class="iconfont icon-shang-"></i></a></p>
                <ul>
                    <li v-for="(item, index) in list2" :key="index" :class="{active: (index + list1.length) === active}" @click="active = (index + list1.length)">
                        <img :src="comImg(item.imgurl)" width="16" alt="">
                        <span>{{item.rankname}}</span>
                    </li>
                </ul>
            </div>
            <div class="list">
                <p>全球榜 <a href="#" @click="showList($event)"><i class="iconfont icon-shang-"></i></a></p>
                <ul>
                    <li v-for="(item, index) in list3" :key="index" :class="{active: (index + list1.length + list2.length) === active}" @click="active = (index + list1.length + list2.length)">
                        <img :src="comImg(item.imgurl)" width="16" alt="">
                        <span>{{item.rankname}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content">
            <div class="header">
                <div style="position:relative">
                    {{currentRankName}} 
                    <a href="#" @click="showDetails = !showDetails"><i class="iconfont icon-zhuyi"></i></a>
                    <div class="details" v-show="showDetails">
                        <div class="scroll">
                            <p v-for="(item, index) in new String(rankInfo.intro).split('\n')" :key="index">
                                {{item}}
                            </p>
                        </div>
                    </div>
                </div>
                <p>
                    <label for="allSelector">
                        <input type="checkbox" id="allSelector">
                        全选
                    </label>
                    <a href="#">下载</a>
                </p>
            </div>
            <ul class="song-list">
                <li v-for="(item, index) in songList" :key="index" @dblclick="playMusic(index)">
                    <span class="rank-index" :class="{red: index < 3}">{{index + 1}}</span>
                    <span class="song-name">{{item.filename}}</span>
                    <div class="tag" v-if="item.sqhash || item['320hash'] ">
                        <span v-if="!item.sqhash && item['320hash']" :class="{hq : item['320hash']}">HQ</span><span v-if="item.sqhash" :class="{sq : item.sqhash}">SQ</span>
                    </div>
                    <div class="btns">
                        <a href="#" @click="playMusic(index)" @dblclick.stop=""><i class="iconfont icon-bofang2"></i></a>
                        <a href="#" @dblclick.stop=""><i class="iconfont icon-xiazai" :class="item.price ? 'shoufei' : ''"></i></a>
                        <a href="#" @dblclick.stop=""><i class="iconfont icon-more"></i></a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: [], // 左侧所有的项目
            list1: [], // 热门榜单
            list2: [], //特色音乐榜
            list3: [], // 全球榜
            active: 0, // 左侧当前单机的索引
            page: 1, // 第几页数据
            rankInfo: [], // 单机左侧项目之后的排行榜介绍
            songList: [], // 单机右侧项目之后的排行榜歌曲数据
            currentRankName: '', // 单机左侧项目之后的榜单名
            showDetails: false // 是否弹出当前排行榜介绍
        }
    },
    created(){
        this.axios.get('/musicinfo/rank/list&json=true')
        .then(res => {
            this.list = res.data.rank.list
            this.currentRankName = this.list[0].rankname
            for(let i = 0; i< res.data.rank.list.length; i++){
                if(i < 10){
                    this.list1.push(res.data.rank.list[i])
                }
                if(i >= 10 && i < 17 ){
                    this.list2.push(res.data.rank.list[i])
                }
                if(i >= 17){
                    this.list3.push(res.data.rank.list[i])
                }
            }
        })
        .then(() => {
            this.axios.get('/musicinfo/rank/info/?rankid='+this.list[0].rankid+'&page='+this.page+'?&json=true')
            .then(res => {
                this.rankInfo = res.data.info
                this.songList = res.data.songs.list
            })
        })
    },
    methods: {
        comImg(src){

            return new String(src).replace(/{size}/g, 400)
        },
        playMusic(index){
            // 把搜索音乐列表赋值给播放列表
            this.$store.state.playerList = this.songList;

            // 双击播放音乐下表
            this.$store.state.currentPlayerIndex = index;
            this.$store.commit("searchMusic");
            // 加入历史音乐列表记录
            this.$store.commit("pushHistoryMusic");
        }
    },
    watch: {
        active(newVal){
            this.axios.get('/musicinfo/rank/info/?rankid='+this.list[this.active].rankid+'&page='+this.page+'?&json=true')
            .then(res => {
                this.rankInfo = res.data.info
                this.songList = res.data.songs.list
            })
            this.currentRankName = this.list[newVal].rankname
            document.getElementsByClassName('rank')[0].scrollTop = 0
        }
    }
}
</script>

<style scoped>
.rank{
    padding: 18px 40px 0;
    height: 585px;
    overflow: hidden;
    box-sizing: border-box;
    overflow-y: scroll;
}
.rank::after{
    content: '';
    clear: both;
    display: block;
}
.list{
    width: 150px;
}
.list:not(:first-child){
    border-top: 1px solid #e4e4e4;
}
.list:not(:first-child) p{
    margin: 10px 0;
}
.list p{
   margin-bottom: 10px; 
}
.list p a{
    float: right;
    color: #333;
}
.l{
    float: left;
    width: 160px;
    height: 100%;
}
.l li{
    width: 100%;
    height: 18px;
    margin-bottom: 3px;
    font-size: 13px;
    padding: 5px 0 5px 5px;
    cursor: pointer;
}
.l li::after{
    content: '';
    clear: both;
    display: block;
}
.l li img{
    float: left;
    height: 18px;
    width: auto;
    margin-right: 5px;
}
.l li span{
    float: left;
}
.l li:hover{
    color: #5691eb;
    background-color: #f5f5f5;
}
.l li.active{
    color: #fff;
    background-color: #5691eb;
}


.content{
    float: left;
    width: 557px;
    border-left: 1px solid #e4e4e4;
    padding-left: 10px;
}
.header > div {
    border-left: 2px solid #5691eb;
    padding-left: 10px;
    

}
.header > p{
    margin: 10px 0;
}
.header  a{
    float: right;
    color: #333;
}
.header i{
    color: #999;
}
.header > p a{
    width: 40px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    font-size: 13px;
    color: #333;
}
.header p a:hover{
    color: #5691eb;
    border-color: #5691eb;
}
.header p a:hover i{
    color: #5691eb;
}
.header label{
    font-size: 13px;
}


.details{
    position: absolute;
    right: -30px;
    top: 30px;
    z-index: 6;
    transition: 0.6s;
    color: #333;
    background-color: #fff;
    transform-origin: 146px 0;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
    padding: 10px;
    width: 260px;
    box-sizing: border-box;
}
.details:before {
    content: "";
    position: absolute;
    top: -5px;
    right: 32px;
    width: 0;
    height: 0px;
    border: 5px solid;
    border-color: transparent #fff #fff transparent;
    transform: rotate(225deg);
    box-shadow: 1px 1px 1px #ccc;
}
.details p{
    color: #999;
    font-size: 12px;
}



.song-list li{
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
}
.song-list li:not(:last-child){
    border-bottom: 1px solid #f5f5f5;
}
.song-list li:hover{
    border-color: #5691eb;
}
.song-list li .rank-index{
    display: inline-block;
    width: 30px;
    text-align: center;
    font-size: 14px;
}
.song-list li .rank-index.red{
    font-size: 18px;
    color: #f00;
}
.song-list li .song-name{
    display: inline-block;
    max-width: 215px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
}

.tag{
    display: inline-block;
    height: 40px;
    line-height: 40px;
}
.tag span{
    display: inline-block;
    color: #83b74f;
    border: 1px solid #83b74f;
    padding: 0 4px;
    font-size: 12px;
    height: 14px;
    line-height: 14px;
    border-radius: 2px;
    transform: scale(0.8);
}
.tag span.hq{
    color: #83b74f;
    border: 1px solid #83b74f;
}
.tag span.sq{
    color: #907fc8;
    border: 1px solid #907fc8;
}
.btns{
    position: absolute;
    right: 0;
    top: 0;
}
.btns a{
    color: #999;
    margin: 0 5px;
}
.btns i.shoufei::after{
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
.btns i:hover{
    color: #5aa0f8;
}
</style>
