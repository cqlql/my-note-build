<template>
<div>
  <h2>time</h2>
  <p>yyyy-MM-dd：{{date1}}</p>
  <p>yyyy-M-d：{{date2}}</p>
  <p>yyyy.MM.dd：{{date3}}</p>
  <p>yyyy/M/d：{{date4}}</p>
  <p>Date 对象：{{date5}}</p>
</div>
</template>

<script>
  import formatDate from './format-date'
  export default {
    data () {
      return {
        date1: '',
        date2: '',
        date3: '',
        date4: '',
        date5: ''
      }
    },
    mounted () {
      this.date1 = formatDate('2017,1,2')
      this.date2 = formatDate('2017/1/3', 'yyyy-M-d')
      this.date3 = formatDate('2017/1/4 14:1', 'yyyy年MM月dd日 hh小时mm分钟')
      this.date4 = formatDate('2017/1/5', 'yyyy/MM/dd')
      this.date5 = formatDate(new Date())
    }
  }
</script>
