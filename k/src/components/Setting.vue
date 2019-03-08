<template>
    <div class="setting">
        <p class="title">设置</p>
        <div class="column">
            <p>常规</p>
            <div class="item">
                <label class="routine" for="routine1">
                    <input type="checkbox" id="routine1" />
                    <span>播放“hello 酷狗”问候语</span>
                </label>
                <label class="routine" for="routine2">
                    <input type="checkbox" id="routine2" />
                    <span>启用系统通知</span>
                </label>
                <label class="routine" for="routine3">
                    <input type="checkbox" checked id="routine3" />
                    <span>在菜单栏显示歌词和歌曲控制</span>
                </label>
                <label class="routine" for="routine4">
                    <input type="checkbox" id="routine4" />
                    <span>播放歌曲时,防止电脑自动进入睡眠</span>
                </label>
            </div>
        </div>
        <div class="column">
            <p>快捷键</p>
            <div class="item">
                <div class="list">
                    <span>功能说明</span>
                    <span>快捷键</span>
                    <span>全局快捷键</span>
                </div>
                <div class="list" v-for="(item, index) in shortcutKeys" :key="index">
                    <span>{{item.explain}}</span>
                    <span><input type="text" :value="item.value1" @input="clearVal($event)"></span>
                    <span><input type="text" :value="item.value2" @input="clearVal($event)"></span>
                </div>
                <div class="openkeys">
                    <label class="shortcut" for="shortcut">
                        <input type="checkbox" @click="toggleHotKey" :checked="$store.state.hotKey" id="shortcut" />
                        <span>启用全局快捷键 <span>(酷狗音乐在后台也能响应)</span></span>
                    </label>
                    <a ondragstart="return false" href="javascript:;" class="btn">恢复默认</a>
                </div>
            </div>
        </div>
        <div class="column">
            <p>下载设置</p>
            <div class="item">
                <div class="download" v-for="(item, index) in ['优先试听音质：', '优先下载音质：']" :key="index">
                    <span>{{item}}</span>
                    <label :for="'download' + (index + 1)">
                        <input type="radio" checked :name="'download' + (index + 1)">
                        标准音质
                    </label>
                    <label :for="'download' + (index + 1)">
                        <input type="radio" :name="'download' + (index + 1)">
                        高品音质
                        <span>HQ</span>
                    </label>
                    <label :for="'download' + (index + 1)">
                        <input type="radio" :name="'download' + (index + 1)">
                        无损音质
                        <span>SQ</span>
                    </label>
                </div>
                <div class="download">
                    <span>缓存大小设置：</span>
                    <label for="download3">
                        <input type="radio" checked name="download3">
                        自动
                    </label>
                    <label for="download3">
                        <input type="radio" name="download3">
                        手动
                    </label>
                </div>
                <div>
                    <a ondragstart="return false" href="#" class="btn">清除缓存</a>
                </div>
            </div>
        </div>
        <div class="column">
            <p>MV</p>
            <div class="item">
                <div class="download">
                    <span>清晰度选择：</span>
                    <label for="MV1" v-for="(item, index) in ['标清','高清','超清','蓝光']" :key="index">
                        <input type="radio" :checked="index=== 0" name="MV1">
                        {{item}}
                    </label>
                </div>
            </div>
        </div>
        <div class="column">
            <p>关于酷狗音乐</p>
            <div class="item">
                <div class="about">
                    <span>当前版本：2.8.0</span>
                    <a ondragstart="return false" href="#" class="btn">检查更新</a>
                    <a ondragstart="return false" href="#" class="btn">意见反馈</a>
                </div>
                <div class="about">
                    <span>下载移动客户端:</span>
                    <a ondragstart="return false" href="#" class="btn">iPhone版</a>
                </div>
                <div class="about">
                    <span>资源版本：99002</span>
                </div>
                <div class="about">
                    <a ondragstart="return false" href="#" class="btn-underline">用户服务协议</a>
                    <a ondragstart="return false" href="#" class="btn-underline">隐私政策</a>
                </div>
                <div class="about">
                    <span>客服邮箱：kefu@kugou.com</span>
                    <span>Mac版官方Q群：552745790</span>
                </div>
                <div class="about">
                    <span>不良信息举报邮箱：jubao_music@kugou.net</span>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            shortcutKeys: [
                { explain: '播放/暂停', value1: '⌘I', value2: '⌥⌃I' },
                { explain: '上一首', value1: '⌘←', value2: '⌥⌃←' },
                { explain: '下一首', value1: '⌘→', value2: '⌥⌃→' },
                { explain: '音量加', value1: '⌘↑', value2: '⌥⌃↑' },
                { explain: '音量减', value1: '⌘↓', value2: '⌥⌃↓' },
                { explain: '喜欢歌曲', value1: '⌘L', value2: '⌥⌃L' },
                { explain: '打开歌词', value1: '⌘R', value2: '⌥⌃R' },
                { explain: 'mini/完整模式', value1: '⌘⌃M', value2: '⌥⌃M' },
            ]
        }
    },
    methods: {
        clearVal(e){
            console.log('暂时不支持自主设置快捷键')

        },
        toggleHotKey() {
            this.$store.state.hotKey = !this.$store.state.hotKey
            if (this.$store.state.hotKey) {
                document.onkeydown = e => {
                    this.$store.commit('RegisterHotKey', e)
                }
            } else {
                document.onkeydown = null
            }
        }
    }
}
</script>

<style scoped>
.setting {
    width: 729px;
    padding: 0 40px;
}
.title {
    font-family: "Hiragino Sans GB";
    font-size: 24px;
    padding: 15px 0;
}
.column {
    border-top: 1px solid #e4e4e4;
    padding-bottom: 20px;
}
.column > p {
    float: left;
    margin: 20px 0;
}
.column .item {
    width: 600px;
    float: right;
}
.column .item .routine {
    display: inline-block;
    width: 45%;
    margin: 20px 5px;
    color: #666;
    font-size: 14px;
    vertical-align: middle;
}
.column .item .routine input {
    vertical-align: middle;
    line-height: 20px;
    height: 20px;
}
.column .item .routine span {
    vertical-align: middle;
}
.column::after {
    content: "";
    clear: both;
    display: block;
}

.item .list {
    margin: 20px 0;
}
.item .list span {
    display: inline-block;
    color: #666;
    font-size: 14px;
}
.item .list span:nth-of-type(1) {
    width: 150px;
}
.item .list span:nth-of-type(2) {
    width: 200px;
}
.item .list span:nth-of-type(3) {
    width: 200px;
}
.item .list span input {
    height: 22px;
    font-size: 14px;
    box-sizing: border-box;
}
.item .list span input:focus {
    color: #888;
}
.openkeys {
    margin-right: 120px;
}
.openkeys .shortcut span {
    font-size: 14px;
    color: #555;
}
.openkeys .shortcut input {
    vertical-align: middle;
    line-height: 22px;
    height: 22px;
}
.openkeys .shortcut span span {
    color: #666;
    font-size: 12px;
}
.openkeys a {
    float: right;
}

.download {
    margin: 20px 0;
    color: #666;
    font-size: 14px;
}
.download > span {
    margin-right: 10px;
}
.download label {
    margin: 0 10px;
}
.download label input {
    margin-right: 10px;
    vertical-align: middle;
    line-height: 22px;
    height: 22px;
}
.download label span {
    display: inline-block;
    font-size: 12px;
    padding: 0 4px;
    color: #fff;
    letter-spacing: 2px;
    border-radius: 2px;
    transform: scale(0.7);
    margin-right: -8px;
}
.download label:nth-of-type(2) span {
    background-color: #428504;
}
.download label:nth-of-type(3) span {
    background-color: #9473f1;
}
.btn {
    border: 1px solid #e4e4e4;
    padding: 5px 20px;
    font-size: 13px;
    color: #333;
}
.btn:active {
    color: #6b9dde;
    border-color: #6b9dde;
}

.about {
    margin: 20px 0;
    color: #666;
    font-size: 14px;
}
.btn-underline {
    text-decoration: underline;
    color: #666;
    font-size: 13px;
}
.about span {
    margin-right: 20px;
}
</style>
