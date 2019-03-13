<template>
    <div class="scroll">
        <div class="search-music-info">
            <p class="title">搜索“ <span>{{musicname}}</span> ”的相关{{tabsName}}</p>
            <div class="tabs">
                <div class="tab">
                    <div v-for="(item, index) in tabs" :class="{active: index===tabsActive}" :key="index" @click="toggleTabs($event, index)">{{item}}</div>
                    <div class="linex" ref="linex"></div>
                </div>
            </div>
            <!-- 单曲 -->
            <div v-if="tabsActive === 0">
                <my-table :musicList='musicList' :toBottom="toBottom"></my-table>
            </div>
            <!-- 歌单 -->
            <div v-if="tabsActive === 1">
                <my-gedan :word="gedan" ></my-gedan>
            </div>

        </div>
    </div>
</template>

<script>
import store from '../store/store.js'
import myTable from '@/components/table'
import myGedan from '@/components/gedan'
export default {
  name: 'searchMusicInfo',
    components: {
        myTable,
        myGedan
    },
    data() {
        return {
            tabs: ['单曲', '歌单', '专辑', 'MV', '歌词'],
            tabsName: '歌曲',
            tabsActive: 0,
            num: 200,
            timer: null,
            toBottom: false,
            musicList: [],
            gedan: this.$route.query.musicname,
            issinger: null,
            lastPage: null
        }
    },
    activated(){
        setTimeout(() => {
          document.querySelector('.scroll').scrollTop = store.state.searchScroll
        },200)
    },
    mounted() {
        let self = this;
        self.requestMusic()
        self.issinger = self.$route.query.issinger || ''

        setTimeout(() => {
          document.querySelector('.scroll').scrollTop = store.state.searchScroll
        },200)
        document.querySelector('.scroll').onscroll = function (e) {
            clearTimeout(self.timer)
            store.state.searchScroll = this.scrollTop
            if (this.offsetHeight + this.scrollTop + self.num > this.scrollHeight) {

                if (self.toBottom === false) {
                    self.timer = setTimeout(() => {
                        self.$store.state.page++
                        self.requestMusic()
                    }, 300)

                }


            }
        }

    },
    computed: {
        musicname() {
            return this.$route.query.musicname
        },
        page() {
            return store.state.page
        }
    },
    methods: {
        requestMusic() {
            // 根据关键词搜索 音乐 赋值到table里
            this.axios.get('/search/api/v3/search/song?format=json&keyword=' + this.$route.query.musicname + '&page=' + this.page)

                .then(res => {
                  this.lastPage = this.page
                    if (res.data.data.info.length > 0) {
                        this.musicList = this.musicList.concat(res.data.data.info)

                    } else {
                        this.toBottom = true
                    }

                })
        },
        // 切换 tabs  移动下划线
        toggleTabs(e, i) {
            this.$refs.linex.style.left = i * 60 + 'px';
            if (e.target.innerText == '单曲') {
                this.tabsName = '歌曲'
            } else {
                this.tabsName = e.target.innerText
            }
            this.tabsActive = i
        },
    },
    watch: {
        musicname(newVal) {
            this.gedan = newVal
            if(newVal == undefined){
              return
            }
            if(this.lastPage === this.page){
              return
            }
            this.requestMusic()
        },
    }
}
</script>

<style scoped>
.scroll {
    overflow: scroll;
    height: 590px;
}
.search-music-info {
    padding: 0 40px;
    width: 729px;
}
.search-music-info .title {
    font-size: 22px;
    padding: 20px 0;
}
.search-music-info .title span {
    color: #5aa0f8;
}

.search-music-info .tab {
    position: relative;
    border-bottom: 1px solid #e4e4e4;
}
.search-music-info .tab div:not(.linex) {
    display: inline-block;
    width: 60px;
    padding-bottom: 10px;
    text-align: center;
    color: #333;
}
.search-music-info .tab div:not(div.linex).active {
    color: #5aa0f8;
}
.search-music-info .tab div.linex {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 60px;
    height: 2px;
    transition: cubic-bezier(0.215, 0.61, 0.355, 1) 0.3s;
    background-color: #5aa0f8;
}


</style>
