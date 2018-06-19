<template>
  <div class="c1">
    <div class="logo"></div>
    <div :class="$style.mTest">hello word, {{helloState.d}}</div>
    <button @click="onChangeOtherState">改变额外的状态</button>
  </div>
</template>

<script>
// 如果 使用 vue css 拆分，那么会与 style 的 css 拆分到一起
// import './index.css'
// 异步 css，其实就是异步 js，如果拆分 css，会多出一个空 js 异步包
// import('./index.css')

import helloState from './hello-state'

export default {
  created () {
    this.helloState = helloState
  },
  methods: {
    onChangeOtherState () {
      helloState.d = helloState.d === 'bar' ? 'foo' : 'bar'
    }
  }
}
</script>

<style module>
.mTest {
  color: rgb(46, 146, 0);
}
</style>

<style scoped>
.logo {
  /* background: url('@/assets-comm/logo.png') */
}
.c1 {
  color: blue;
}

</style>
