<template>
  <div>
    <div :class="$style.header">
      <h1>前端记录</h1>
      <div :class="$style.des">
        技术笔记，速查手册，效果汇总
        <span :class="$style.sp">|</span>
        <a href="http://cqlql.github.io/about/">关于</a>
      </div>
    </div>
    <div :class="$style.left" :style="{top:top+'px'}">
      <vMenu ref="vMenu" :list="menuList" @select="onMenuSelect" />
    </div>
    <div :class="$style.middle" :style="{top:top+'px'}">
      <Outline :outlineData="articleOutline" />
    </div>
    <div :class="$style.right">
      <vArticle :content="articleContent" />
    </div>
  </div>
</template>

<script>
import dataApi from './data-api.js'
import vMenu from './Menu'
import Outline from './Outline'
import vArticle from './Article'
export default {
  components: {
    vMenu,
    Outline,
    vArticle
  },
  data () {
    return {
      top: 70,
      menuList: [],
      articleContent: '',
      articleOutline: {}
    }
  },
  mounted () {
    this.init()
    window.onscroll = () => {
      let y = 70 - window.pageYOffset
      y = y < 0 ? 0 : y
      this.top = y
    }
  },
  methods: {
    init () {
      dataApi.getMenu().then(data => {
        this.menuList = data
        this.$refs.vMenu.select(0)
        return dataApi.getArticle(data[0])
      }).then(({ content, outline }) => {
        this.articleContent = content
        this.articleOutline = outline
      })
    },
    onMenuSelect (index) {
      dataApi.getArticle(this.menuList[index]).then(({ content, outline }) => {
        this.articleContent = content
        this.articleOutline = outline
      })
    }
  }
}
</script>

<style module>
.left {
  position: fixed;
  width: 200px;
  left: 0;
  top: 70px;
  bottom: 0;
}
.middle {
  position: fixed;
  width: 200px;
  left: 200px;
  top: 70px;
  bottom: 0;
}
.right {
  margin-left: 410px;
}

.header {
  height: 70px;
  background-color: #24292e;

  h1 {
    color: #fff;
    margin: 0;
    padding: 10px 0 6px 20px;
  }
  .des {
    padding: 0 0 0 20px;
    color: rgba(255, 255, 255, 0.75);
  }
  a {
    color: #fff;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
