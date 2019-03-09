<template>
    <div>
        <div class="header">
            <p>iTunes音乐<span>(0首)</span></p>
        </div>
        <div class="content">

            <div class="nothing">
                <img src="../assets/download-icon.png" width="178" height="178" alt="">
                <p>iTunes音乐没有歌曲</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.header{
    height: 77px;
    padding: 25px 40px 0;
    border-bottom: 1px solid transparent;
}
.header p{
    font-weight: 400;
    font-size: 22px;
}
.header p span{
    font-size: 14px;
    color: #999;
    margin-left: 10px;
    font-weight: 300;
}
.nothing{
    padding-top: 100px;
    text-align: center;
}
.nothing p{
    margin-top: 5px;
    color: #999;
}
</style>
