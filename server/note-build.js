const fs = require('fs-extra')
const notePath = 'E:\\github\\my-note'
// const outPath = 'E:\\__admin\\Desktop\\note'
const outPath = 'E:\\github\\my-note-build\\dist\data'

// 创建输出目录
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
  writeFile (data, name) {
    fs.writeFile(`${outPath}\\${name}`, `cb_${name}(${JSON.stringify({data})})`, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  buildDataFile () {
    const names = this.rootFileNames()

    this.writeFile(JSON.stringify(names), 'menu_data')

    names.forEach(name => {
      // const name = names[5]
      const dirPath = notePath + '\\' + name
      const filePath = dirPath + '.md'

      if (fs.existsSync(filePath)) {
        this.readFile(filePath).then(data => {
          data = this.indexData(data)
          if (!fs.existsSync(dirPath)) return
          this.readFileAll(dirPath).then(Alldata => {
            this.writeFile(data + '\n\n' + Alldata, name)
          })
        })
      } else {
        this.readFileAll(dirPath).then(Alldata => {
          this.writeFile(Alldata, name)
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
}

(new NoteBuild()).buildDataFile()

module.exports = new NoteBuild()
