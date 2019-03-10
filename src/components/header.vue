<template>
    <div class="header" :style="'background: linear-gradient(to bottom, ' + bgColor + ')'">
        <div class="closeSystem"></div>
        <div class="btns">
            <a ondragstart="return false" href="#" @click="$router.go(-1)">
                <i class="iconfont icon-zuo"></i>
            </a>
            <a ondragstart="return false" href="#" @click="$router.go(1)">
                <i class="iconfont icon-you"></i>
            </a>
            <a ondragstart="return false" href="#" @click="$router.go(0)">
                <i class="iconfont icon-shuaxin"></i>
            </a>
        </div>
        <div class="search">
            <input type="text" class="user-search" @focus="clearHotKey($event)" @blur="addHotKey" @input="searchMusic($event)" @keyup.13="jump($event)" @click="showMusicList($event)" ref="search" placeholder="搜索">
            <div class="search-info" v-show="searchInfo">
                <div class="column" v-for="(item, index) in musicList" :key="index" v-show="item.RecordCount !== 0">
                    <p v-if="item.LableName">{{item.LableName}}</p>
                    <ul>
                        <li v-for="(list, i) in item.RecordDatas" :key="i">
                            <router-link ondragstart="return false" @click.native="toMusicInfo(list)" :to="{ path: '/SearchMusicInfo',query: {musicname: list.HintInfo}}">
                                <span>{{list.HintInfo}}</span><span v-if="list.MatchCount">{{list.MatchCount}}条</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="layer" v-show="searchInfo" @click="searchInfo = false" style="top: 0; z-index:5"></div>
        </div>
        <div class="userOperation">
            <a ondragstart="return false" href="#" class="user" @click="userInfo = !userInfo">
                <img src="../assets/image/user-avatar.jpg" alt="">
                <span>本</span>
                <i class="iconfont icon-Group-"></i>
            </a>
            <div class="info" :class="userInfo ? 'show' : 'hide' ">
                <div class="avatar text-center">
                    <img src="../assets/image/user-avatar.jpg" alt="">
                    <p>本 <a ondragstart="return false" href="#"><i class="iconfont icon-bianji"></i></a></p>
                    <span>VIP</span><span>音乐包</span>
                </div>
                <div class="account">
                    <ul>
                        <li><i class="iconfont icon-K"></i>酷币 ：0 <a ondragstart="return false" href="#">充值<i class="iconfont icon-you"></i></a></li>
                        <li>
                            <p><i class="iconfont icon-huangguan-copy"></i>开通 &nbsp;<span>豪华VIP</span> </p>
                            <p>享受VIP+音乐包双重特权<a ondragstart="return false" href="#">充值<i class="iconfont icon-you"></i></a></p>
                        </li>
                    </ul>
                </div>
                <div class="closeUser">退出账号</div>
            </div>
            <div class="layer" @click="userInfo = false" v-show="userInfo"></div>
        </div>
        <div class="btns fr">
            <a ondragstart="return false" href="#">
                <i class="iconfont icon-skin"></i>
            </a>
            <router-link ondragstart="return false" to="/Setting">
                <i class="iconfont icon-kejian"></i>
            </router-link>
            <a ondragstart="return false" href="#">
                <i class="iconfont icon-zuixiaohua"></i>
            </a>
        </div>
    </div>
</template>

<script>
import store from '../store/store.js'
export default {
    data() {
        return {
            searchInfo: false, // 搜索框有内容则弹出列表
            showSinger: true,
            showMv: true,
            showSinger: true,
            showAlbum: true,

            musicList: [], // 搜索出来的信息
            userInfo: false // 是否弹出个人账户
        }
    },
    computed: {
        bgColor(){
            return store.state.bgColor
        }
    },
    methods: {
        clearHotKey(e) {
            // 输入框获取焦点 取消全局快捷键
            document.onkeydown = null
        },
        addHotKey() {
            // 输入框失去焦点 判断是否开启全局热键
            if (store.state.hotKey) {
                document.onkeydown = e => {
                    store.commit('RegisterHotKey', e)
                }
            } else {
                document.onkeydown = null
            }
        },
        searchMusic(e) {
            // 搜索框列表弹出
            this.searchInfo = true
            // jsonp请求
            this.jsonp.get('http://searchtip.kugou.com/getSearchTip', {
                MusicTipCount: 5,
                MVTipCount: 2,
                albumcount: 2,
                keyword: e.target.value
            }, res => {
                // 赋值
                this.musicList = res.data
            })



            if (e.target.value == '') {
                // 搜索框内容为空 搜索歌词遮罩隐藏
                this.searchInfo = false
            }
        },
        jump(e){
            // 输入框失去焦点
            e.target.blur()
            // 去除开头空格和末尾空格
            let value = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
            // 如果内容为空，则不进行跳转
            if (value == '') {
                return;
            }
            // 搜索歌词遮罩层隐藏
            this.searchInfo = false
            // 跳转
            this.$router.push({
                path: '/SearchMusicInfo',
                query: {
                    musicname: value
                }
            })
        },
        showMusicList(e) {
            // 输入框内容不为空 ? 显示 : 隐藏 
            e.target.value ? this.searchInfo = true : this.searchInfo = false
        },
        toMusicInfo(list){
            this.searchInfo = false ;
            this.$refs.search.value = list.HintInfo;
            store.state.page = 0
            if(document.getElementsByClassName('scroll')[0]){
                document.getElementsByClassName('scroll')[0].scrollTop = 0
            }
        }
    }
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 45px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    box-sizing: border-box;
}
/* 单独部分 */
.header > div {
    display: inline-block;
}
.fr {
    float: right;
}

/* 第一部分 */
.header .closeSystem {
    width: 190px;
}

/* 第二部分 */
.header .btns {
    display: inline-block;
    padding: 0 10px;
    height: 45px;
    line-height: 45px;
}
.header .btns a {
    color: #fff;
    margin: 0 5px;
}
.header .btns a i {
    opacity: 1;
    transition: 0.3s;
    font-size: 20px;
}
.header .btns a i:hover {
    opacity: 0.6;
}

/* 第三部分 */
.search {
    position: absolute;
    height: 45px;
}
.search input {
    border: none;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: 210px;
    height: 28px;
    line-height: 28px;
    margin-left: 10px;
    padding: 0 10px 0 30px;
    background: url("../assets/image/sousuo.png") left center no-repeat;
    background-position-x: 10px;
    background-color: #fff;
    color: #333;
    border-radius: 20px;
    font-size: 14px;
    transition: 0.4s;
    box-sizing: border-box;
}
/* 搜索出来的列表 */
.search-info {
    position: absolute;
    z-index: 8;
    color: #000;
    background-color: #fff;
    top: 45px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    width: 230px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #ccc;
}
.search-info .column:not(:first-child) {
    border-top: 1px solid #e4e4e4;
}
.search-info .column p {
    font-size: 14px;
    padding-left: 20px;
    height: 25px;
    line-height: 35px;
}
.search-info ul {
    padding: 5px 0;
}
.search-info li {
    padding: 0 15px;
    box-sizing: border-box;
}
.search-info a:hover {
    background-color: #f2f2f2;
}
.search-info a {
    display: block;
    color: #777;
    font-size: 12px;
    padding: 0 5px;
    height: 35px;
    line-height: 35px;
}
.search-info a span:first-child {
    display: inline-block;
    width: 140px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    float: none !important;
}
.search-info a span:last-child {
    float: right;
}

/* 第四部分 */
.userOperation {
    position: relative;
    float: right;
}

.userOperation .user {
    position: absolute;
    top: 0;
    right: 120px;
    padding-right: 10px;
    width: 90px;
    height: 45px;
    line-height: 45px;
}
.userOperation .user img {
    vertical-align: middle;
    width: 24px;
    height: 24px;
    border-radius: 50%;
}
.userOperation .user span {
    color: #fff;
    font-size: 14px;
    margin: 0 5px;
}
.userOperation .user i {
    vertical-align: middle;
    color: #fff;
    font-size: 20px;
}

/* 弹出的个人账户 */
.userOperation .info {
    position: absolute;
    z-index: 6;
    top: 45px;
    right: 19px;
    width: 280px;
    transition: 0.6s;
    color: #333;
    background-color: #fff;
    transform-origin: 146px 0;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
}
.userOperation .info.hide {
    transform: scale(0);
}
.userOperation .info.show {
    transform: scale(1);
}
.userOperation .info:before {
    content: "";
    width: 0;
    height: 0;
    border-width: 0px 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    position: absolute;
    top: -10px;
    right: 122px;
}
.userOperation .info .avatar {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #e4e4e4;
}
.userOperation .info .avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.userOperation .info .avatar p {
    font-size: 14px;
}
.userOperation .info p a {
    color: #888;
}
.userOperation .info p i {
    font-size: 14px;
}
.userOperation .info .avatar span {
    display: inline-block;
    background-color: #ccc;
    font-size: 12px;
    padding: 0 4px;
    color: #fff;
    letter-spacing: 2px;
    border-radius: 2px;
    transform: scale(0.7);
    margin-right: -8px;
}

.userOperation .info .account {
    padding: 10px 0;
    border-bottom: 1px solid #e4e4e4;
}
.userOperation .info .account li {
    padding: 10px 0px 10px 20px;
    font-size: 14px;
    color: #999;
}
.userOperation .info .account li i {
    margin-right: 10px;
    color: #61a3f8;
    vertical-align: middle;
}
.userOperation .info .account li a {
    float: right;
    color: #61a3f8;
}
.userOperation .info .account li a i {
    color: #ccc;
}
.userOperation .info .account li p {
    line-height: 20px;
}
.userOperation .info .account li p span {
    color: #000;
}
.userOperation .info .closeUser {
    color: #bbb;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    background-color: rgba(255,255,255,1)

}
.userOperation .info .closeUser:active{
    background-color: rgba(158,158,158,.1)
}




</style>

