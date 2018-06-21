const fs = require('fs-extra')
const markeParse = require('./mark-parse')
const notePath = 'E:\\github\\my-note'
// const outPath = 'E:\\__admin\\Desktop\\note'
const outPath = 'E:\\github\\my-note-build\\dist\\data'

// 删除并创建输出目录
fs.removeSync(outPath)
fs.ensureDirSync(outPath)

class NoteBuild {
  // 跟目录下的所有文件，包括目录
  rootFileNames () {
    let names = {}
    fs.readdirSync(notePath).forEach(name => {
      if (/^(.git|.editorconfig)$/.test(name) === false) {
        name = name.replace(/\.md$/, '')
        names[name] = 1
      }
    })
    return Object.keys(names)
  }
  indexData (data) {
    return data.replace(/#(#+)/g, '$1')
    // return data
  }
  writeMenuFile (data) {
    const name = 'menu_data'
    data = JSON.stringify(data)
    fs.writeFile(`${outPath}\\${name}.js`, `window['cb_${name}'](${data})`, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  writeArticleFile (data, name) {
    data = this.marked(data)
    data.outline.name = name
    data = JSON.stringify(data)
    fs.writeFile(`${outPath}\\${name}.js`, `window['cb_${name}'](${data})`, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  buildDataFile () {
    const names = this.rootFileNames()

    this.writeMenuFile(names)

    names.forEach(name => {
      const dirPath = notePath + '\\' + name
      const filePath = dirPath + '.md'

      if (fs.existsSync(filePath)) {
        this.readFile(filePath).then(data => {
          data = this.indexData(data)
          if (!fs.existsSync(dirPath)) {
            this.writeArticleFile(data, name)
            return
          }
          this.readFileAll(dirPath).then(Alldata => {
            this.writeArticleFile(data + '\n\n' + Alldata, name)
          })
        })
      } else {
        this.readFileAll(dirPath).then(Alldata => {
          this.writeArticleFile(Alldata, name)
        })
      }
    })
  }
  readFile (filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
  // 读取目录下的所有文件
  readFileAll (dirPath) {
    return new Promise((resolve) => {
      const names = fs.readdirSync(dirPath)
      let data = ''
      let excu = () => {
        let name = names.shift()
        if (!name) {
          resolve(data)
          return
        }
        this.readFile(dirPath + '\\' + name).then(d => {
          data += `\n\n# ${name.replace(/\.md$/, '')}\n\n${d}`
          excu()
        })
      }
      excu()
    })
  }

  marked (content) {
    return markeParse(content)
    // return marked(content)
  }
}

(new NoteBuild()).buildDataFile()

// module.exports = new NoteBuild()
