import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


let state = {
    bgColor: '#50a5ff , #5ba0f7', // 渐变背景
    isPlay: false, // 是否处于播放状态
    currentTime: 0, // 当前音乐播放的时间
    maxTime: 0, // 音乐总时长
    islike: false, // 底部爱心 / 是否喜欢当前歌曲
    playBackActive: 0, // 播放模式 0 = 循环列表 1 = 单曲循环 2 = 随机播放
    currentSongInfo: {}, // 当前播放歌曲的信息
    currentPlayIndex: null, // 当前播放的歌曲处于播放列表的下标
    hotKey: true, // 是否开启快捷键 (具体快捷键在设置界面查看)
    
    // 音乐歌词界面一些变量
    musicInterface: false, // 是否弹出音乐歌词界面
    lyricTimes: [], // 歌词时间存放的数组
    lyricIndex: 0, // 当前播放到的歌词下标
    slidableLyric: false, // 是否处于滑动歌词操作

    // table 
    page: 0, // 当前搜索的歌曲的页数

    // 我喜欢界面
    songList: [
        { txt: '我喜欢', icon: 'xin', active: false, action: '/mylike', query: { list: '我喜欢' } },
        { txt: '默认收藏', icon: 'ziyuan', active: false, action: '/mylike', query: {list: '默认收藏'} }
    ],
    playerList: JSON.parse(localStorage.getItem('playerList')) || [], // 当前播放列表
    historyPlayerList: JSON.parse(localStorage.getItem('historyPlayerList')) || [], // 历史播放列表
    collectingSongs: JSON.parse(localStorage.getItem('collectingSongs')) || [], //收藏的歌单

    myLikeMusic: JSON.parse(localStorage.getItem('myLikeMusic')) || [], // 自建的歌单名称

}


let mutations = {
    play(state) {
        // 暂停纯粹为了有个切换效果
        music.pause()
        // 播放时间更新 播放进度条更新 歌词进度更新
        music.ontimeupdate = () => {
            // 音乐秒数取整
            state.currentTime = parseInt(music.currentTime)
            state.maxTime = parseInt(music.duration)
            // 音乐进度条每次向右增加
            dot.style.left = "calc(" + parseInt(music.currentTime) / music.duration * 100 + '% - 5px)'
            // 音乐进度条小点
            pro.style.width = parseInt(music.currentTime) / music.duration * 100 + '%'

            // 音乐界面歌词进度
            this.commit('timeCompare')
            

        }
        // 开始播放
        music.play()
        //设置正在播放状态
        state.isPlay = true
    },
    // 切换/结束
    ended(state) {
        // 歌词界面的歌词切换到第一行
        state.lyricIndex = 0
        // playBackActive == 2 是随机播放 
        if (state.playBackActive == 2) {
            // 最大随机范围 不超过歌曲最后一首的下标
            var max = state.playerList.length - 1
            // 下一首播放歌曲的下标随机
            state.currentPlayerIndex = parseInt(Math.random() * (max + 1), 10);
            // 搜索歌曲信息并把当前歌曲src替换
            this.commit('searchMusic')

        } else {
            // 正常切换下一首
            // 播放兼容
            if (state.currentPlayerIndex >= state.playerList.length - 1) {
                state.currentPlayerIndex = 0
            } else {
                state.currentPlayerIndex++
            }
            // 搜索下一首歌曲信息并播放
            this.commit('searchMusic')

        }
        // 把歌曲加入历史播放记录
        this.commit('pushHistoryMusic')

    },
    // 暂停
    pause(state) {
        // 暂停/播放切换
        if (state.isPlay) {
            state.isPlay = false;
            music.pause()
        } else {
            this.commit('play')
        }
    },
    // 搜索歌曲信息并且赋值src令其播放
    searchMusic(state) {

        let item = state.playerList[state.currentPlayerIndex]
        Vue.prototype.axios.get('player/yy/index.php?r=play/getdata&hash=' + item.hash)
            .then(res => {
                if(res.data.data.play_url === ''){
                    confirm('应版权方要求，该音乐需付费试听，您可通过手机端酷狗音乐完成购买')
                }else{

                    // 歌曲src 赋值成功直接会播放
                    music.src = res.data.data.play_url
                    // 更新歌曲信息
                    state.currentSongInfo = res.data.data

                }

            })
        
    },

    timeCompare(state) {
        // 歌词播放界面 歌词自动滚动
        state.lyricTime.forEach((item, i) => {
            if (this.getters.comTime() > item) {
                if (state.slidableLyric == false) {
                    state.lyricIndex = i
                }
            }
        })


    },
    // 往历史播放添加记录
    pushHistoryMusic(state) {
        var arr = []
        var flag = true

        state.historyPlayerList.forEach((item, index) => {
            // 如果已经有了记录 就删除当前位置在最前面添加进去
            if (item.hash === state.playerList[state.currentPlayerIndex].hash) {
                
                arr = state.historyPlayerList[index]
                state.historyPlayerList.splice(index, 1)
                state.historyPlayerList.unshift(arr)
                
                flag = false
            }
        })
        // 如果为真 就往历史记录列表在前面添加
        if (flag) {
            state.historyPlayerList.unshift(state.playerList[state.currentPlayerIndex])
            flag = false
        }

    },
    // 全局热键
    registerHotKey(state, e) {
        e.preventDefault();

        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;


        // 音乐下一首
        if (ctrlKey && keyCode == 39) {
            if (state.currentPlayerIndex == null) {
                state.currentPlayerIndex = 0;
                this.commit('searchMusic')
            } else {
                this.commit('ended')
            }

        }

        // 音乐上一首
        if (ctrlKey && keyCode == 37) {
            if (state.playBackActive === 2) {
                commit("ended");
            } else {
                if (state.currentPlayerIndex - 1 < 0) {
                    state.currentPlayerIndex = state.playerList.length - 1
                }else{
                    state.currentPlayerIndex -= 1;
                }
                this.commit("searchMusic");
            }
        }

        // 音乐音量 加
        if (ctrlKey && keyCode == 38) {
            if (music.volume < 1) {
                music.volume += 0.1
            }
            if (music.volume > 0.9) {
                music.volume = 1
            }
            voiceDot.style.bottom = (music.volume * 100) - 5 + 'px'
            voicePro.style.height = (music.volume * 100) + 'px'
        }

        // 音乐音量 减
        if (ctrlKey && keyCode == 40) {
            if (music.volume < 0.1) {
                music.volume = 0
            } else {
                music.volume -= 0.1
            }
            voiceDot.style.bottom = (music.volume * 100) - 5 + 'px'
            voicePro.style.height = (music.volume * 100) + 'px'
        }

        // 音乐 播放/暂停
        if (ctrlKey && keyCode == 73) {
            if (state.isPlay) {
                this.commit('pause')
            } else {
                this.commit('play')
            }
        }
    },
    // 全局热键
    RegisterHotKey(state, e) {
        e.preventDefault();

        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;


        // 音乐下一首
        if (ctrlKey && keyCode == 39) {
            if (state.currentPlayerIndex == null) {
                state.currentPlayerIndex = 0;
                this.commit('searchMusic')
            } else {
                this.commit('ended')
            }

        }

        // 音乐上一首
        if (ctrlKey && keyCode == 37) {
            state.currentPlayerIndex -= 1
            this.commit('searchMusic')
        }

        // 音乐音量 加
        if (ctrlKey && keyCode == 38) {
            if (music.volume < 1) {
                music.volume += 0.1
            }
            if (music.volume > 0.9) {
                music.volume = 1
            }
            voiceDot.style.bottom = (music.volume * 100) - 5 + 'px'
            voicePro.style.height = (music.volume * 100) + 'px'
        }

        // 音乐音量 减
        if (ctrlKey && keyCode == 40) {
            if (music.volume < 0.1) {
                music.volume = 0
            } else {
                music.volume -= 0.1
            }
            voiceDot.style.bottom = (music.volume * 100) - 5 + 'px'
            voicePro.style.height = (music.volume * 100) + 'px'
        }

        // 音乐 播放/暂停
        if (ctrlKey && keyCode == 73) {
            if (state.isPlay) {
                this.commit('pause')
            } else {
                this.commit('play')
            }
        }
    },
    // 添加/删除 当前的歌曲
    toggleLike(state, obj) {
        let list = {};
        let flag = true;
        let item = obj.item
        let musicList = obj.musicList
        let localList = JSON.parse(localStorage.getItem(musicList)) || []



        for(let i = 0; i < localList.length; i++){
            if(localList[i].hash === item.hash){
                // 删除 重复的
                localList = localList.filter(list => list.hash !== item.hash)

                // 同步底部爱心
                if (musicList === '我喜欢' && state.currentSongInfo.hash === item.hash) {
                    state.islike = false
                }
                // 更新localstorage
                localStorage.setItem(musicList, JSON.stringify(localList))
                flag = false
                break;
            }else{
                flag = true
            }
        }


        // 如果flag 为真 就是没找到
        if(flag){
            Vue.prototype.axios.get('player/yy/index.php?r=play/getdata&hash=' + item.hash)
                .then(res => {
                    // 歌曲信息
                    list = res.data.data

                    localList.unshift(list)
                    localStorage.setItem(musicList, JSON.stringify(localList))
                })
            // 同步底部爱心
            if (musicList === '我喜欢' && state.currentSongInfo.hash === item.hash) {
                state.islike = true
            }
            flag = false
        }


        
    },
    addLike(state, obj) {
        let list = {};
        let flag = true;
        let item = obj.item
        let musicList = obj.musicList
        let localList = JSON.parse(localStorage.getItem(musicList)) || []

        for(let i = 0; i < localList.length; i++){
            if(localList[i].hash !== item.hash){
                flag = true
            }else{
                return;
            }
        }
        
        // 如果flag 为真 就是没找到
        if(flag){
            Vue.prototype.axios.get('player/yy/index.php?r=play/getdata&hash=' + item.hash)
                .then(res => {
                    // 歌曲信息
                    list = res.data.data

                    localList.unshift(list)
                    localStorage.setItem(musicList, JSON.stringify(localList))
                })
            // 同步底部爱心
            if (musicList === '我喜欢' && state.currentSongInfo.hash === item.hash) {
                state.islike = true
            }
            flag = false
        }

    },




    // 修改当前播放列表
    setPlayerList(state, data){
        state.playerList = data
    },
}
let getters = {
    // 用于计算当前音乐时间 转换成'00:00.00'跟歌词时间数组进行比较
    comTime: state => time => {
        var t, time = music.currentTime

        if (time < 60) {
            if (time < 10) {
                t = '00:0' + time;
            } else {
                t = '00:' + time;
            }
        } else {
            var second = time % 60;
            var min = Math.floor(time / 60);
            if (min < 10) {
                min = '0' + min;
            }
            if (second < 10) {
                second = '0' + second;
            }
            t = min + ':' + second;

        }
        return t;
    }
}
export default new Vuex.Store({
    state,
    mutations,
    getters
})