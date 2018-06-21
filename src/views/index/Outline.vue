
<script>
import scopeElements from '@/modules/corejs/dom/scope-elements.js'
export default {
  render () {
    const { outlineData, foldLevel, selectedIndex } = this
    const rootName = outlineData.name
    function build (children = []) {
      const list = []
      children.forEach(item => {
        let { index, level, children, name } = item
        const childList = build(children)
        list.push(
          <div class={['menu-item', level < foldLevel ? '' : 'fold']} key={rootName + index} data-index={index}>
            <div class={['item', index === selectedIndex && 'selected']}>
              <i class={children.length === 0 ? 'hidden' : ''}></i>
              <span class="txt">{name}</span>
            </div>
            <div class="list">{childList}</div>
          </div >
        )
      })
      return list
    }

    const menuList = build(outlineData.children)

    return (
      <div class="menu">
        <div class="menu-tool">
          <div class="op" onClick={this.onFoldLevel}>
            <a href="javascript:;" class="level">1</a>
            <a href="javascript:;" class="level">2</a>
            <a href="javascript:;" class="level">3</a>
            <a href="javascript:;" class="level">4</a>
          </div>
        </div>
        <div class="menu-list" onClick={this.onFold}>{menuList}</div>
      </div>
    )
  },
  props: {
    outlineData: Object
  },
  data () {
    return {
      key: '',
      foldLevel: 1,
      selectedIndex: -1
    }
  },
  watch: {
    outlineData () {
      this.foldLevel = 1
      this.selectedIndex = -1
    }
  },
  methods: {
    onFold ({ target }) {
      const end = this.$el
      scopeElements(target, elem => {
        if (elem === end) return false
        let { classList } = elem
        if (classList.contains('menu-item')) {
          if (classList.contains('fold')) {
            classList.remove('fold')
          } else {
            classList.add('fold')
          }
          let index = elem.dataset.index * 1
          if (index !== this.selectedIndex) {
            this.select(index)
            this.$emit('select', index)
          }
          return false
        }
      })
    },
    onFoldLevel ({ target }) {
      if (target.tagName === 'A') {
        this.foldLevel = target.innerHTML
      }
    },
    select (index) {
      this.selectedIndex = index
    },
    unfold (index) {
      const end = this.$el
      const items = this.$el.querySelectorAll('.menu-item')
      let item = items[index]
      while ((item = item.parentElement)) {
        if (item === end) break
        let { classList } = item
        classList.remove('fold')
      }
    }
  }
}
</script>

<style scoped>
.menu {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-right: 1px solid #efefef;
  font-size: 14px;
}

.menu .menu-tool {
  border-right: 0;
  color: #333;
  padding: 0 4px 0 18px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  height: 25px;
  line-height: 1.6;
  border-bottom: 1px solid #efefef;
  /*box-shadow: 0px 1px 2px 0px #d6d6d6;*/
}

.menu .menu-tool a {
  float: left;
  width: 20px;
  text-align: center;
  height: 20px;
  font-size: 16px;
  line-height: 1.2;
}

.menu .menu-tool a:hover {
  outline: 1px solid red;
}

.menu .menu-tool .op {
  position: absolute;
  right: 1px;
  top: 3px;
  font: 14px Microsoft Yahei, \5fae\8f6f\96c5\9ed1;
}

.menu .menu-tool .add {
  font-family: sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 0.8;
}

/* .menu .menu-search {
    padding: 0 22px 0 1px;
    position: absolute
}

.menu .menu-search .in {
    border: 1px solid #d8d8d8;
    margin-top: 1px;
    height: 18px;
    background-color: #fff;
    padding: 0 2px
}

.menu .menu-search input {
    border: 0
}

.menu .menu-search .s-btn {
    position: absolute;
    right: 1px;
    top: 1px;
    background-position: 1px -58px;
    background-size: 80px auto
}

.menu .menu-search .s-btn:after {
    font-family: iconfont;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 700;
    content: "\E603"
} */

.menu .menu-list {
  position: absolute;
  top: 26px;
  width: 100%;
  bottom: 0;
  overflow: auto;
}

.menu .item {
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  height: 26px;
  line-height: 2;
}

.menu .item:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 26px;
  background-color: #efefef;
  opacity: 0;
}

.menu .item .txt {
  position: relative;
}

.menu .item .op {
  position: absolute;
  right: 1px;
  margin-top: 3px;
  font: 14px Consolas, Microsoft Yahei;
  display: none;
}

.menu .item:hover:before {
  opacity: 1;
}

.menu .item:hover .op {
  display: block;
}

.menu .item.selected:before {
  opacity: 1;
  background-color: #ffc;
}

.menu .item .op a {
  float: left;
  width: 20px;
  text-align: center;
  height: 20px;
  font-size: 16px;
  line-height: 1.2;
}

.menu .item .op a:hover {
  outline: 1px solid red;
}

.menu .item .op a.edit {
  line-height: 1.1;
  font-weight: 700;
}

.menu .item .op a.edit:after {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\E601";
}

.menu .item .op a.update {
  line-height: 1.3;
  font-weight: 700;
}

.menu .item .op a.update:after {
  font-family: iconfont;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\E61A";
  font-size: 18px;
}

.menu .list {
  padding-left: 16px;
}

.menu .item i {
  float: left;
  width: 19px;
  height: 26px;
  background: transparent;
  position: relative;
}

.menu .item i:after {
  content: "";
  position: absolute;
  border: 0 dashed transparent;
  width: 0;
  height: 0;
  border-width: 4px;
  border-top-width: 8px;
  border-top-style: solid;
  border-top-color: #000;
  left: 5px;
  top: 10px;
}

.menu .item i.hidden {
  visibility: hidden;
}

.menu .menu-item i:after {
  transform: rotate(0deg) translateY(0);
}

.menu .menu-item.fold > .item i:after {
  transform: rotate(-90deg) translate(3px, 3px);
  border-top-color: #0085ff;
}

.menu .menu-item.fold > .list {
  display: none;
}

.menu .item i:hover:after {
  border-top-color: #f0dd00;
}
</style>
