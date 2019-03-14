<template>
    <div class="item">
        <router-link :to="{
            path: '/singermusicsheet',
            query: {
                singername: item.singername,
                id: item.singerid,
                img: item.imgurl
            }
        }">
            <img :src="comImg(item.imgurl)" alt="">
            <span>{{ i + 1 }}</span>
            <a href="#" @click.stop="playerMusic"><i class="iconfont icon-bofang1"></i></a>
        </router-link>
        <p>
            <router-link :to="{
                path: '/singermusicsheet',
                query: {
                    singername: item.singername,
                    id: item.singerid,
                    img: item.imgurl
                }
            }">
                {{item.singername}}
            </router-link>
        </p>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: {}
        },
        i: {
            type: Number,
            default: null
        }
    },
    methods: {
        comImg(src){
            return new String(src).replace(/{size}/g, 200)
        },
        playerMusic(){
            // 根据关键词搜索 音乐 赋值到table里
            this.axios.get('/search/api/v3/search/song?format=json&keyword=' + this.item.singername + '&page=0')
                .then(res => {
                    this.$store.state.currentPlayerIndex = 0
                    this.$store.state.playerList = res.data.data.info
                    this.$store.commit('searchMusic')

                    this.$store.commit('pushHistoryMusic')
                })
        }
    }
}
</script>

<style scoped>
.item{
    position: relative;
    width: 130px;
}
.item > a{
    position: relative;
    display: block;
}
img{
    display: block;
    width: 130px;
    height: 130px;
}
span{
    position: absolute;
    top: 0;
    left: 0;
    height: 130px;
    width: 130px;
    line-height: 230px;
    padding-left: 10px;
    box-sizing: border-box;
    color: #fff;
    background: linear-gradient( to bottom, transparent, transparent, transparent, rgba(72, 72, 72, 0.5) );
}
a a{
    display: none;
    position: absolute;
    right: 5px;
    bottom: 5px;

}
a a i{
    color: #d6d6d6;
    font-size: 24px;
}
.item > a:hover a{
    display: block;
}
a a:hover i{
    color: #fff;
}
.item > a:hover span{
    display: none;
}
p{
    margin: 5px 0 10px;
}
p a{
    color: #333;
}
p a:hover{
    color: #5691eb;
}
</style>
