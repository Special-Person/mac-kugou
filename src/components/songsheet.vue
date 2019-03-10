<template>
    <div class="songsheet">
        <div class="header">
            <div class="classification" @click="showSongLists = !showSongLists">
                <span :class="{bottomColor : showSongLists}">全部分类<i class="iconfont" :class="showSongLists ? 'icon-shang-' : 'icon-Group-'"></i></span>
                <div @click.stop="" v-show="showSongLists" class="lists">
                    <div v-for="(item, index) in songLists" :key="index">
                        <p>{{item.title}}</p>
                        <ul>
                            <li v-for="(list, i) in item.item" :key="i">
                                <a href="#">{{list}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="layer" v-show="showSongLists"></div>
            </div>
            <div class="btns">
                <a href="#" v-for="(item, index) in ['推荐', '最热', '最新', '热藏', '飙升']" :class="{active : index == btnsActive}" :key="index" @click="btnsActive = index">
                    {{item}}
                </a>
            </div>
        </div>
        <div class="tags">
            热门标签
            <a href="#" v-for="(item, index) in ['DJ热碟', '网络', '00后', '90后', '英语', '伤感']" :key="index">
                {{item}}
            </a>
        </div>
        <div class="songsheet-item">
            <songsheet-item :isRight="index % 4 === 0" :style=" index !== 0 && (index + 1) % 4 === 0 ? 'margin-right: 0' : 'margin-right: 20px'" v-for="(item, index) in plist" :key="index" :item="item" />
        </div>
    </div>
</template>

<script>
import songsheetItem from '@/components/songsheetItem'
export default {
    components: {
        songsheetItem
    },
    data() {
        return {
            songLists: [
                { title: '默认', item: ['全部'] },
                { title: '主题', item: ['经典', '网络', 'DJ热碟','情歌对唱','游戏', '舞曲', 'KTV', '轻音乐', '影视', '励志', '草原风', '广场舞', '胎教', '翻唱', '佛教', '儿歌', 'ACG', '小清新', '减压', '现场', '器乐演奏', '失恋', '粤剧'] },
                { title: '语种', item: ['英语', '国语', '粤语', '日语', '韩语', '间南语','小语种', '法语'] },
                { title: '风格', item: ['古风', '流行', '电子', '民谣', '摇滚', '嘻哈', '中国风', '民歌', 'R&B', '古典', '乡村', '爵士', '民乐', '新世纪', '布鲁斯', '拉丁', '戏曲'] }
            ],
            showSongLists: false,
            btnsActive: 0,
            plist: [],
            show: false,
            page: 1,
            timer: null,
            num: 200
        }
    },
    created() {
        this.requestMusic()
            // http://m.kugou.com/plist/index&json=true&page=2

        let self = this;
        this.$nextTick(() => {
            document.querySelector('.songsheet').onscroll = function (e) {
                clearTimeout(self.timer)
                if (this.offsetHeight + this.scrollTop + self.num > this.scrollHeight) {
                    
                    self.timer = setTimeout(() => {
                        self.page++
                        self.requestMusic()
                    }, 300)

                }
            }
        })
    },
    methods: {
        requestMusic(){

            this.axios.get('/musicinfo/plist/index&json=true&page=' + this.page)
            .then(res => {
                if(res.data.plist.list.info.length > 0){
                    this.plist = this.plist.concat(res.data.plist.list.info)
                }else{
                    document.querySelector('.songsheet').onscroll = null
                }
                
            })
        }
    }
}
</script>

<style scoped>
.songsheet{
    height: 590px;
    overflow-y: scroll;
}
.header{
    padding: 20px 0 10px;
    margin: 0 40px;
    border-bottom: 1px solid #e4e4e4;
}
.header .classification {
    position: relative;
    display: inline-block;
}
.header .classification span {
    position: relative;
    z-index: 7;
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
    cursor: pointer;
}
.header .classification span.bottomColor{
    color: #5aa0f8;
    border-bottom-color: #fff;
}
.header .classification span:not(.bottomColor):hover {
    color: #5aa0f8;
    border-color: #5aa0f8;
}
.header .classification .lists{
    position: absolute;
    z-index: 6;
    left: 0;
    top: 30px;
    width: 730px;
    height: 360px;
    color: #333;
    background-color: #fff;
    transform-origin: 146px 0;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    border-top-left-radius: 0px;
}
.header .classification .lists > div::after{
    content: '';
    clear: both;
    display: block;
}
.header .classification .lists p{
    float: left;
    height: 22px;
    line-height: 22px;
    margin-right: 40px;
    color: #999;
    font-size: 14px;
}
.header .classification .lists ul{
    float: left;
    width: 570px;
    margin-bottom: 20px;
}
.header .classification .lists li{
    display: inline-block;
    width: 80px;
    margin-bottom: 5px;
    height: 22px;
    line-height: 22px;
}
.header .classification .lists li a{
    font-size: 14px;
    color: #666;
}
.header .classification .lists li a:hover {
    color: #5aa0f8;
}
.header .btns{
    float: right;
    height: 32px;
    line-height: 32px;
}
.header .btns a:not(:last-child)::after{
    content: '|';
    color: #999;
    padding-left: 5px;
}
.header .btns a{
    color: #333;
}
.header .btns a:not(:first-child){
    margin-left: 5px;
}
.header .btns a:hover {
    color: #5aa0f8;
}
.header .btns a.active{
    color: #5aa0f8;
}

.tags {
    padding: 10px 0 15px;
    margin: 0 40px;
    font-size: 14px;
    color: #999;
}
.tags a{
    display: inline-block;
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #999;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    font-size: 14px;
    margin-left: 15px;
}
.tags a:hover{
    color: #5aa0f8;
    border-color: #5aa0f8;
}
.songsheet-item{
    margin: 0 40px;
}
.songsheet-item >>> .item{

}
</style>
