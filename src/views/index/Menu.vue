<template>
  <div :class="$style.typeMenu">
    <ul :class="$style.list" @click="onSelect">
      <li v-for="(name,index) of list" :class="[$style.item,index===selectedIndex&&$style.selected]" :key="name" :data-index="index">{{name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
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
    onSelect ({target}) {
      let index = target.dataset.index
      if (index) {
        index *= 1
        if (this.selectedIndex !== index) {
          this.select(index)
          this.$emit('select', index)
        }
      }
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
