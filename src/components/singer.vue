<template>
    <div class="singer">
        <div class="l">
            <div class="list">
                <ul>
                    <li :class="{active: active === 0}" @click="active = 0">
                        <span>热门歌手</span>
                    </li>
                </ul>
            </div>
            <div class="list">
                <p>华语</p>
                <ul>
                    <li v-for="(item, index) in list1" :key="index" :class="{active: (index + 1) === active}" @click="active = (index + 1)">
                        <span>{{item.classname}}</span>
                    </li>
                </ul>
            </div>
            <div class="list">
                <p>日韩</p>
                <ul>
                    <li v-for="(item, index) in list2" :key="index" :class="{active: (index + list1.length + 1) === active}" @click="active = (index + list1.length + 1)">
                        <span>{{item.classname}}</span>
                    </li>
                </ul>
            </div>
            <div class="list">
                <p>欧美</p>
                <ul>
                    <li v-for="(item, index) in list3" :key="index" :class="{active: (index + list1.length + list2.length + 1) === active}" @click="active = (index + list1.length + list2.length + 1)">
                        <span>{{item.classname}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content">
            <div class="header">
                <ul>
                    <li v-for="(item, index) in singerInfo" :key="index" :style=" index !== 0 && (index + 1) % 4 === 0 ? 'margin-right: 0' : 'margin-right: 10px'">
                        <singer-item :item="item" :i="index"></singer-item>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import singerItem from '@/components/singerItem'
export default {
    components: {
        singerItem
    },
    data(){
        return{
            active: 0,
            list: [],
            list1: [],
            list2: [],
            list3: [],
            singerInfo: []
        }
    },
    created(){
        this.axios.get('/musicinfo/singer/class&json=true')
        .then(res => {
            this.list = res.data.list
            for(let i = 0; i< res.data.list.length; i++) {
                if(i > 0 && i < 4){
                    this.list1.push(res.data.list[i])
                }
                if(i >= 4 && i < 7){
                    this.list2.push(res.data.list[i])
                }
                if(i >= 7){
                    this.list3.push(res.data.list[i])
                }
            }
            // console.log(this.list1, this.list2, this.list3)
        }).then(() => {

            this.axios.get('/musicinfo/singer/list/' + this.list[0].classid + '?json=true&')
            .then(res => {
                this.singerInfo = res.data.singers.list.info
            })

        })
    },
    watch: {
        active(newVal){
            this.axios.get('/musicinfo/singer/list/' + this.list[newVal].classid + '?json=true&')
            .then(res => {
                this.singerInfo = res.data.singers.list.info
            })
        }
    }
}
</script>

<style scoped>
.singer{
    padding: 18px 40px 0;
    height: 585px;
    overflow: hidden;
    box-sizing: border-box;
    overflow-y: scroll;
}
.list{
    width: 150px;
    text-align: center;
}
.list:not(:first-child){
    border-top: 1px solid #e4e4e4;
}
.list:not(:first-child) p{
    margin: 10px 0;
}
.list p{
   margin-bottom: 10px; 
}
.l{
    float: left;
    width: 160px;
    height: 100%;
}
.l li{
    width: 100%;
    height: 18px;
    margin-bottom: 3px;
    font-size: 13px;
    padding: 5px 0 5px 5px;
    cursor: pointer;
}
.l li:hover{
    color: #5691eb;
    background-color: #f5f5f5;
}
.l li.active{
    color: #fff;
    background-color: #5691eb;
}
.content{
    float: left;
    width: 557px;
    border-left: 1px solid #e4e4e4;
    padding-left: 10px;
}
.header li{
    display: inline-block;
}
</style>
