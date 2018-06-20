<template>
  <div>
    <div :class="$style.left">
      <vMenu ref="vMenu" :list="menuList" @select="onMenuSelect"/>
    </div>
    <div :class="$style.middle">
      <Outline :outlineData="articleOutline" @select="onOutline" ref="vOutline"/>
    </div>
    <div :class="$style.right">
      <vArticle :content="articleContent" ref="vArticle" @select="onArticleSelect"/>
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
      menuList: [],
      articleContent: '',
      articleOutline: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      dataApi.getMenu().then(data => {
        this.menuList = data
        this.$refs.vMenu.select(0)
        return dataApi.getArticle(data[0])
      }).then(({content, outline}) => {
        this.articleContent = content
        this.articleOutline = outline
      })
    },
    onMenuSelect (index) {
      dataApi.getArticle(this.menuList[index]).then(({content, outline}) => {
        this.articleContent = content
        this.articleOutline = outline
      })
    },
    onOutline (index) {
      this.$refs.vArticle.select(index)
    },
    onArticleSelect (index) {
      console.log(index)
      this.$refs.vOutline.select(index)
    }
  }
}
</script>

<style module>
.left {
  position: fixed;
  width: 200px;
  left: 0;
  top: 0;
  bottom: 0;
}
.middle {
  position: fixed;
  width: 200px;
  left: 200px;
  top: 0;
  bottom: 0;
}
.right {
  margin-left: 410px;
}
</style>
