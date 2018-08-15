<template>
  <div>
    <div :class="$style.header">
      <h1>前端记录</h1>
      <div :class="$style.des">
        技术笔记，速查手册，效果汇总
        <span :class="$style.sp">|</span>
        <a href="http://cqlql.github.io">关于</a>
      </div>
    </div>
    <DragView :class="$style.left" :initialWidth="200" :maxWidth="400" @resize="onResize" :style="{top:top+'px'}">
      <vMenu ref="vMenu" :list="menuList" @select="onMenuSelect" />
    </DragView>
    <DragView :class="$style.middle" :initialWidth="200" :maxWidth="400" @resize="onResizeMiddle" :style="{top:top+'px',left:middleX+'px'}">
      <Outline :outlineData="articleOutline" @select="onOutlineSelect" ref="vOutline" />
    </DragView>
    <!-- <div :class="$style.middle" :style="{top:top+'px',left:middleX+'px'}">
      <Outline :outlineData="articleOutline" @select="onOutlineSelect" ref="vOutline" />
    </div> -->
    <div :class="$style.right" :style="{'margin-left':rightX+'px'}">
      <vArticle :content="articleContent" ref="vArticle" @select="onArticleSelect" />
    </div>
  </div>
</template>

<script>
import DragView from '@/components/drag-view'
import dataApi from './data-api.js'
import vMenu from './Menu'
import Outline from './Outline'
import vArticle from './Article'

const windowScroll = {
  bind (cb) {
    this.scroll = function () {
      let y = 70 - window.pageYOffset
      y = y < 0 ? 0 : y
      cb(y)
    }
    window.addEventListener('scroll', this.scroll)
  },
  unbind () {
    window.removeEventListener('scroll', this.scroll)
  }
}

export default {
  components: {
    DragView,
    vMenu,
    Outline,
    vArticle
  },
  data () {
    return {
      top: 70,
      menuList: [],
      articleContent: '',
      articleOutline: {},

      // 窗口大小
      middleX: 200,
      middleW: 200,
      rightX: 410,

      ctrlKeyDown: false
    }
  },
  mounted () {
    this.init()
    windowScroll.bind(top => {
      this.top = top
    })
    dataApi.ctrlKeyBind()
  },
  destroyed () {
    windowScroll.unbind()
    dataApi.ctrlKeyUnbind()
  },
  methods: {
    init () {
      let { type, index } = this.$route.params
      type *= 1
      index *= 1
      if (type < 0) type = 0
      dataApi.getMenu().then(data => {
        this.menuList = data
        this.$refs.vMenu.scrollTo(type)
        return dataApi.getArticle(data[type])
      }).then(({ content, outline }) => {
        this.articleContent = content
        this.articleOutline = outline
        // 初始定位文章
        if (index > -1) {
          this.$nextTick(() => {
            this.$refs.vOutline.scrollTo(index)
            this.$refs.vArticle.select(index)
          })
        }
      })
    },
    onMenuSelect (index) {
      this.updateRouter(index, -1)
      window.scrollTo(0, 0)
      dataApi.getArticle(this.menuList[index]).then(({ content, outline }) => {
        this.articleContent = content
        this.articleOutline = outline
      })
    },
    onOutlineSelect (index) {
      this.$refs.vArticle.select(index)
      this.updateRouter(null, index)
    },
    onArticleSelect (index) {
      this.$refs.vOutline.scrollTo(index)
      this.updateRouter(null, index)
    },
    updateRouter (type, index) {
      const { params } = this.$route
      type = type === null ? params.type : type
      index = index === null ? params.index : index

      this.$router.push({
        name: 'Index',
        params: {
          type,
          index
        }
      })
    },
    onResize (x) {
      this.middleX = x
      this.rightX = x + this.middleW + 10
    },
    onResizeMiddle (x) {
      this.middleW = x
      this.rightX = this.middleX + x + 10
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
  z-index: 2;
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
  margin-right: 10px;
}

.header {
  height: 70px;
  background-color: #24292e;
  h1 {
    color: #fff;
    margin: 0;
    padding: 10px 0 6px 20px;
    font-size: 24px;
    font-weight: bold;
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
