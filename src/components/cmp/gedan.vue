
<template>
    <ul>
        <li v-for="(item, index) in list" :key="index" :style=" index !== 0 && (index + 1) % 4 === 0 ? 'margin-right: 0' : 'margin-right: 19px'">
            <router-link :to="{
                path: '/allsongsheet',
                query: {
                    id: item.specialid
                }
            }">
                <img :src="item.img" width="168" alt="">
                <p v-html="item.specialname"></p>
                <p>{{item.nickname}}</p>
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        word: {
            type: String,
            default: ''
        }
    },
    created() {
        this.getList()
    },
    data() {
        return {
            list: []
        }
    },
    watch: {
        word: {
            handler() {
                this.getList()
            },
            deep: true
        }
    },
    methods: {
        getList() {
            let keyword = this.word.replace(/\s/g, '+')
            this.jsonp.get('https://specialsearch.kugou.com/special_search', {
                keyword,
                page: 1,
                pagesize: 30,
                userid: -1,
                clientver: '',
                platform: 'WebFilter',
                tag: 'em',
                filter: 2,
                iscorrection: 1,
                privilege_filter: 0,
                _: 1551625230864
            }, res => {
                this.list = res.data.lists
            })
        }
    }
}
</script>

<style scoped>
ul{
    padding: 20px 0;
}
li{
    display: inline-block;
    width: 168px;
    overflow: hidden;
    margin-bottom: 20px;
}
li p{
    font-size: 14px;
    width: 168px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
li p:nth-of-type(1){
    color: #333;
    margin: 5px 0;
}
li p:nth-of-type(2){
    color: #999;
}
</style>
