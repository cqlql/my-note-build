
/**
 * 遍历所有菜单级别 -> 菜单 data
 *
 * 使用示例
var renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  buildArticleMenu.build(text, level)
  return `<h${level} id="${text}">${text}</h${level}>`
};
console.log(buildArticleMenu.data)

 * */

function BuildOutlint () {
  // let Hxs = eArticle.querySelectorAll('h2,h3,h4,h5');
  // 此参数可配置 文章中支持的最低H级别，需与上面选择器同步
  // 0将支持h1，可多个h1同级
  // 1最低支持h2，
  // ...
  let startLevel = 0

  let rootItem = {
    children: []
  }
  let currItem = rootItem
  let currLevel = startLevel

  let index = 0

  return {
    getData () {
      return rootItem
    },
    build (text, level) {
      let breakLevel = level - currLevel

      // 兼容跳级
      if (breakLevel > 0) {
        // 跳子级

        for (let i = 0, len = breakLevel - 1; i < len; i++) {
          let item = {
            'index': -1,
            'children': []
          }

          currItem.children.push(item)

          currItem = item

          currLevel = level + i
        }
      } else if (breakLevel <= 0) {
        // 跳父级

        currItem = rootItem
        for (let i = startLevel + 1; i < level; i++) {
          currItem = currItem.children[currItem.children.length - 1]
        }
      }

      let item = {
        index,
        level,
        // "name":hx.textContent,
        'name': text,
        'children': []
      }

      currItem.children.push(item)

      currItem = item

      currLevel = level

      index++
    }
  }
}

module.exports = BuildOutlint
