<template>
    <div class="item">
        <router-link :to="{
            path: '/allsongsheet',
            query: {
                id: item.specialid
            }
        }" class="img">
            <img :src="comImg(item.imgurl)" alt="">
            <div class="play-count">
                <i class="iconfont icon-erji"></i>
                <span>{{comPlayCount(item.playcount)}}</span>
            </div>
            <div class="player">
                <a href="#" @click.stop="collection"><i class="iconfont icon-xin1" :class="{red : isCol}"></i></a>
                <a href="#" @click.stop="allPlayerMusic"><i class="iconfont icon-bofang3"></i></a>
            </div>
        </router-link>
        <div class="btn">
            <router-link to="javascript:;">
                {{item.specialname}}
            </router-link>
        </div>
        <div class="author" @click="showMusicList = !showMusicList">
            {{item.username}}
            <a href="#"><i class="iconfont icon-yinleliebiao1"></i></a>
            <div @click.stop="" v-show="showMusicList" class="music-list" :class="isRight ? 'r' : 'l'">
                <div class="header">
                    共{{count}}首
                    <a href="#"  @click="showMusicList = false"><i class="iconfont icon-cha"></i></a>
                </div>
                <ul class="list" v-for="(item, index) in list" :key="index" v-show="(index + 1) === page">
                    <li v-for="(l, i) in item" :key="i">
                        <p>{{l.filename}}</p>
                        <div class="tag">
                            <span v-if="!l.sqhash && l['320hash']" :class="{hq : l['320hash']}">HQ</span><span v-if="l.sqhash" :class="{sq : l.sqhash}">SQ</span>
                        </div>
                        <div class="btns">
                            <a href="#" @click="playerMusic(i)"><i class="iconfont icon-bofang2"></i></a>
                            <a href="#"><i class="iconfont icon-xiazai" :class="l.price ? 'shoufei' : ''"></i></a>
                        </div>
                    </li>
                </ul>
                <div class="footer">
                    <p>
                        <a href="#" @click="page > 1 ? page-- : ''" :class="{disable : page === 1}"><i class="iconfont icon-zuo"></i></a>
                        <span>{{page}}</span>/<span>{{Math.ceil(count / 6)}}</span>
                        <a href="#" @click="page < Math.ceil(count / 6) ? page++ : ''" :class="{disable : Math.ceil(count / 6) === page }"><i class="iconfont icon-you"></i></a>
                    </p>
                    <a href="#" @click="allPlayerMusic"><i class="iconfont icon-bofang2"></i>全部播放</a>
                </div>
            </div>
        </div>
        <div class="layer" v-show="showMusicList" @click="showMusicList = false"></div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: {}
        },
        isRight: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            showMusicList: false,
            count: 1,
            page: 1 ,
            playerList: [],
            list: [],
            info: [],
            isCol: false
        }
    },
    methods: {
        comImg(src) {
            return src.replace(/{size}/g, 240)
        },
        comPlayCount(count) {
            return (count / 10000).toFixed(1) + '万'
        },
        playerMusic(index){

            this.$store.state.currentPlayerIndex = index
            this.$store.state.playerList = this.playerList;
            this.$store.commit('searchMusic')

            this.$store.commit('pushHistoryMusic')
        },
        allPlayerMusic(){
            this.$store.state.currentPlayerIndex = 0
            this.$store.state.playerList = this.playerList;
            this.$store.commit('searchMusic')

            this.$store.commit('pushHistoryMusic')
        },
        collection() {
            let collectingSongs = this.$store.state.collectingSongs
            let songsheet = {
                id: +this.item.specialid,
                txt: this.item.specialname,
                icon: 'ziyuan',
                action: '/allsongsheet?' + +this.item.specialid
            }
            let flag = true
            // flag = true ？ 没有收藏 ； 收藏了
            for (let i = 0; i < collectingSongs.length; i++) {

                if (collectingSongs[i].id === songsheet.id) {
                    this.$store.state.collectingSongs.splice(i, 1)
                    flag = false
                    this.isCol = false
                } else {
                    flag = true

                }
            }

            if (flag) {
                this.$store.state.collectingSongs.unshift(songsheet)
                flag = false
                this.isCol = true
            }
        }
    },
    created(){
        this.axios.get('/musicinfo/plist/list/' + this.item.specialid + '?json=truee')
            .then(res => {
                this.count = res.data.pagesize
                let songInfo = res.data.list.list.info
                let arr = [ ]
                let n = 0;
                for(let i = 0; i < songInfo.length; i++){
                    
                    if( i % 6 === 0 ){
                        arr.push([])

                    }
                    if( i !== 0 && i % 6 === 0 ){
                        n ++
                    }
                    arr[n].push(songInfo[i])
                    
                }
                this.list = arr // 每页的数据
                this.playerList = res.data.list.list.info
                this.info = res.data.info
                // console.log(JSON.parse(JSON.stringify(this.item)))
            })
        
    },
    computed: {
        collectingSongs(){
            return this.$store.state.collectingSongs
        }
    },
    watch: {
        // collectingSongs(newVal){
        //     for (let i = 0; i < newVal.length; i++) {
        //     // console.log(newVal[i].id, this.item.specialid)
        //         if (newVal[i].id === this.item.specialid) {
        //             this.isCol = false
        //         } else {
        //             this.isCol = true
        //         }
        //     }
        // },
        // isCol(newVal){
        //     console.log(newVal)
        // }
    }
}
</script>

<style scoped>
.item {
    display: inline-block;
    width: 167px;
    height: 210px;
    margin-bottom: 15px;
}
.img {
    display: block;
    position: relative;
    width: 167px;
    height: 167px;
}
.img img {
    width: 100%;
    height: 100%;
}
.img .play-count {
    position: absolute;
    right: 0;
    top: 0;
    color: #fff;
    font-size: 14px;
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: right;
    background: linear-gradient(
        to right,
        transparent,
        transparent,
        transparent,
        #a5a6a4
    );
}
.img .play-count span {
    margin-right: 5px;
    vertical-align: middle;
}
.img .play-count i {
    vertical-align: middle;
}
.img:hover .player {
    display: block;
}
.img .player {
    display: none;
    position: absolute;
    right: 0;
    bottom: 0;
}
.img .player a {
    border: 2px solid #efefef;
    display: inline-block;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin: 5px;
}
.img .player a:last-child {
    margin-left: 0px;
}
.img .player a i {
    display: block;
    color: #efefef;
}
.img .player a i.red{
    color: red;
}
.img .player a:hover {
    border-color: #fff;
}
.img .player a:hover i:not(.red) {
    color: #fff;
}

.btn {
    height: 23px;
}
.btn a {
    display: inline-block;
    width: 100%;
    font-size: 14px;
    height: 23px;
    line-height: 25px;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.btn a:hover {
    color: #6b9dde;
}
.author {
    position: relative;
    font-size: 12px;
    color: #666;
}
.author > a {
    position: relative;
    float: right;
}
.author > a i {
    display: block;
    font-size: 18px;
    height: 18px;
    color: #999;
}
.author > a i:hover {
    color: #6b9dde;
}

.author .music-list {
    position: absolute;
    z-index: 6;
    width: 300px;
    height: 310px;
    transition: 0.6s;
    color: #333;
    background-color: #fff;
    transform-origin: 146px 0;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
}
.author .music-list.r{
    right: -315px;
    top: -155px;
}
.author .music-list.l{
    right: 30px;
    top: -155px;
}
.author .music-list.r::before {
    content: "";
    position: absolute;
    top: 157px;
    left: -5px;
    width: 0;
    height: 0px;
    border: 5px solid;
    border-color: #fff #fff transparent transparent;
    transform: rotate(225deg);
    box-shadow: 1px -1px 1px #ccc;
}
.author .music-list.l::before {
    content: "";
    position: absolute;
    top: 157px;
    right: -5px;
    width: 0;
    height: 0px;
    border: 5px solid;
    border-color: transparent transparent #fff #fff ;
    transform: rotate(225deg);
    box-shadow: -1px 1px 1px #ccc;
}



.music-list .header{
    height: 30px;
    line-height: 30px;
    margin: 0 10px 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e4e4;

}
.music-list .header a{
    float: right;
}
.music-list .header a i{
    color: #333;
}
.music-list .header a i:hover{
    color: #6b9dde;
}
.music-list .list{
    margin: 0 15px;
}
.music-list .list li{
    position: relative;
    height: 40px;
    line-height: 40px;
}
.footer{
    margin: 0 10px;
    height: 27px;
    line-height: 27px;
}
.footer::after{
    content: '';
    clear: both;
    display: block;
}
.footer i{
    color: #333;
}
.footer p{
    float: left;
}
.footer p i{
    vertical-align: middle;
}
.footer > a{
    float: right;
    width: 75px;
    height: 25px;
    line-height: 25px;
    padding: 0 5px;
    text-align: center;
    color: #999;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    font-size: 14px;
}
.footer > a:hover{
    color: #5aa0f8;
    border-color: #5aa0f8;
}
.footer > a:hover i{
    color: #5aa0f8;
}

.list p{
    float: left;
    max-width: 160px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13.5px;
    margin-right: 5px;
}
.list .tag{
    float: left;
    height: 40px;
    line-height: 40px;
}
.list span{
    display: inline-block;
    color: #83b74f;
    border: 1px solid #83b74f;
    padding: 0 4px;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    border-radius: 2px;
    transform: scale(0.8);
}
.list span.hq{
    color: #83b74f;
    border: 1px solid #83b74f;
}
.list span.sq{
    color: #907fc8;
    border: 1px solid #907fc8;
}
.list .btns{
    position: absolute;
    right: 0;
    top: 0;
}
.list .btns a{
    margin: 0 2px;
}
.list .btns i{
    position: relative;
    color: #999;
}
.list .btns i.shoufei::after{
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
.list .btns i:hover{
    color: #5aa0f8;
}
</style>
