<template>
  <div :class="$style.typeMenu">
    <VSearch @select="searchSelect"/>
    <ul :class="$style.list" @click="onSelect">
      <li v-for="(name,index) of list" :class="[$style.item,index===selectedIndex&&$style.selected]" :key="name" :id="name" :data-index="index">{{name}}</li>
    </ul>
  </div>
</template>

<script>
import VSearch from '@/views/index/VSearch.vue'
import dataApi from './data-api.js'
export default {
  components: {
    VSearch
  },
  props: {
    list: Array
  },
  data () {
    return {
      selectedIndex: 0
    }
  },
  methods: {
    select (index) {
      this.selectedIndex = index
    },
    onSelect ({target}, id) {
      let index = target.dataset.index
      if (index) {
        if (dataApi.ctrlKeyDown) {
          window.open(`${location.origin + location.pathname}#/${index}/-1`)
          return false
        }
        index *= 1
        if (this.selectedIndex !== index || id) {
          this.select(index)
          this.$emit('select', {index, id})
        }
      }
    },
    scrollTo (index) {
      this.select(index)
      setTimeout(() => {
        let {$el} = this
        $el.scrollTop = index * 32 - $el.clientHeight / 2 + 16
      }, 1)
    },
    updateTitle () {
      document.title = '笔记-' + this.list[this.selectedIndex]
    },
    searchSelect ({name, path}) {
      this.onSelect({ target: document.getElementById(name) }, path)
    }
  },
  watch: {
    list () {
      this.updateTitle()
    },
    selectedIndex () {
      this.updateTitle()
    }
  }
}
</script>

<style module>
.typeMenu {
  height: 100%;
  background-color: #f7f7f7;
  border-right: 1px solid #efefef;
  box-sizing: border-box;
  overflow: auto;
}
.list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.item {
  padding: 8px 10px;
  font-size: 14px;
  white-space: nowrap;
  color: #555;
  cursor: pointer;
}
.item:hover {
  background-color: #e4e4e4;
}
.item.selected {
  background-color: #3998d6;
  color: #fff;
}
</style>
