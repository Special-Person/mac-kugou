<template>
    <a ondragstart="return false" href="#" @click.stop="reverseLike" @dblclick.stop="">
        <i class="iconfont" :class="islike ? 'icon-xinh' : 'icon-xin'"></i>
    </a>
</template>

<script>
import store from '../store/store.js'
export default {
    
    props: {
        item: {
            type: Object,
            default: {}
        },
        isLike: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return{
            islike: this.isLike
        }
    },
    watch: {
        isLike:{
            handler(){
                
                this.islike = this.isLike
                
            },
            deep: true
        }
    },
    methods: {
        reverseLike() {
            let l = {
                ...this.item
            }
            this.axios.get('player/yy/index.php?r=play/getdata&hash=' + l.hash)
                .then(res => {
                    l['img'] = res.data.data.img

                })
            // 如果在hash表里找不到则添加进去，找到了则取消
            store.commit('addLike', {
                item: l,
                musicList: '我喜欢'
            })

            setTimeout(() => {
                let localList = JSON.parse(localStorage.getItem('我喜欢')) || []
                let flag = false
                for(let i = 0; i < localList.length; i++){
                    if(localList[i].hash === l.hash){
                        flag = true
                        break;
                    }else{
                        flag = false
                    }
                }

                if(flag){
                    this.islike = true
                }else{
                    this.islike = false;
                }

            },200)
            
                
                
        }
    }
}
</script>

<style scoped>
a{
    margin-right: 5px;
        height: 40px;
    line-height: 40px;
    color: #999
}
a i{
    font-size: 18px;
    color: #999;
    vertical-align: middle;
}
</style>
