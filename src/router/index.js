import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'recommend',
      component: resolve => require( ['@/components/recommend'], resolve)
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: resolve => require( ['@/components/setting/Setting'], resolve )
    },
    {
      path: '/SearchMusicInfo',
      name: 'SearchMusicInfo',
      component: resolve => require( ['@/components/search/SearchMusicInfo'], resolve )
    },
    {
      path: '/mylike',
      name: 'mylike',
      component: resolve => require( ['@/components/mylike/mylike'], resolve )
    },
    {
      path: '/songsheet',
      name: 'songsheet',
      component: resolve => require( ['@/components/songsheet/songsheet'], resolve )
    },
    {
      path: '/allsongsheet',
      name: 'allsongsheet',
      component: resolve => require( ['@/components/songsheet/allsongsheet'], resolve )
    },
    {
      path: '/rankingList',
      name: 'rankingList',
      component: resolve => require( ['@/components/rankinglist/rankingList'], resolve )
    },
    {
      path: '/radiostation',
      name: 'radiostation',
      component: resolve => require( ['@/components/radiostation'], resolve )
    },
    {
      path: '/singer',
      name: 'singer',
      component: resolve => require( ['@/components/singer/singer'], resolve )
    },
    {
      path: '/singermusicsheet',
      name: 'singermusicsheet',
      component: resolve => require( ['@/components/singer/singermusicsheet'], resolve )
    },
    {
      path: '/download',
      name: 'download',
      component: resolve => require( ['@/components/download'], resolve )
    },
    {
      path: '/iTunes',
      name: 'iTunes',
      component: resolve => require( ['@/components/iTunes'], resolve )
    },
    {
      path: '/kong',
      name: 'kong',
      component: resolve => require( ['@/components/cmp/kong'], resolve )
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
