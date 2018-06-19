<!-- created on 2018/1/12 -->

# 队列


## 示例

```js
this.queue.excu(next => {
  let x = this.x
  let y = this.y

  if (this.preX === x && this.preY === y) {
    next()
  } else {
    classList.add('transition-active')
    transitionendOnce($el, function () {
      classList.remove('transition-active')
      next()
    })
    $el.style[transform] = `translate(${x}px,${y}px)`
  }
})
```

## next() 失败将返回 false
