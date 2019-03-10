<template>
    <div>
        <div class="header">
            <p>下载管理</p>
            <div class="tabs">
                <a href="#" :class="{active: active === 0}" @click="active = 0">已下载歌曲(0)</a>
                <a href="#" :class="{active: active === 1}" @click="active = 1">正在下载(0)</a>
                <a href="#" :class="{active: active === 2}" @click="active = 2">下载历史漫游(0)</a>
                <input type="text" v-show="active === 0" :class="{active : clickInput}" @click="clickInput = true" placeholder="搜索">
            </div>
        </div>
        <div class="content">
            <div class="nothing">
                <img src="../assets/download-icon.png" width="178" height="178" alt="">
                <p>没有{{active === 0 ? '已下载' : active === 1 ? '正在下载' : '历史漫游'}}的音乐</p>
                <p>快去 <router-link to="/">在线音乐</router-link> 发现音乐吧</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            active: 0,
            clickInput: false
        }
    }
}
</script>

<style scoped>
.header{
    height: 103px;
    box-sizing: border-box;
    padding: 25px 40px 0;
    border-bottom: 1px solid #e4e4e4;
}
.header p{
    font-weight: 400;
    font-size: 22px;
    margin-bottom: 15px;
}
.header .tabs a{
    display: inline-block;
    padding: 0 4px 8px;
    color: #999;
}
.header .tabs a.active{
    color: #5691eb;
    border-bottom: 2px solid #5691eb;
}
.header .tabs a:not(:last-child){
    margin-right: 35px;
}
.header .tabs input{
    border: none;
    float: right;
    width: 40px;
    height: 25px;
    line-height: 25px;
    padding-left: 25px;
    background: url('../assets/image/sousuo.png') no-repeat left;
    background-size: auto 15px;
    background-position-x: 5px;
    border: 1px solid transparent;
    transition: .3s;
    transform: translateZ(0)
}
.header .tabs input:not(.active):hover{
    width: 130px;
    border: 1px solid #e4e4e4;
}
.header .tabs input.active{
    width: 130px;
    border: 1px solid #e4e4e4;
}
.nothing{
    padding-top: 100px;
    text-align: center;
}
.nothing p{
    margin-top: 5px;
    color: #999;
}
.nothing p a{
    color: #5aa0f8;
}
</style>
