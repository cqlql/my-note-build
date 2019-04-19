const fs = require('fs-extra')
const MarkeParse = require('./mark-parse')
const algoliasearch = require('algoliasearch');
const notePath = 'E:\\github\\my-note'
// const outPath = 'E:\\__admin\\Desktop\\note'
const outPath = 'E:\\github\\my-note-build\\dist\\data'

class NoteBuild {
  constructor () {
    // 删除并创建输出目录
    fs.removeSync(outPath)
    fs.ensureDirSync(outPath)

    this.searchIndexsCount = 0

    this.markeParse = new MarkeParse()
  }
  // 根目录下的所有文件，包括目录
  rootFileNames () {
    let names = {}
    fs.readdirSync(notePath).forEach(name => {
      if (/^(.git|.editorconfig)$/.test(name) === false) {
        let no = name.match(/\d\d_/)
        no = no === null ? '' : no[0]
        name = name.replace(/\.md$|^\d\d_/g, '')
        names[name] = no
      }
    })
    return names
  }
  indexData (data) {
    return data.replace(/#(#+)/g, '$1')
    // return data
  }
  writeMenuFile (data) {
    const name = 'menu_data'
    data = JSON.stringify(data)
    fs.writeFile(`${outPath}/${name}.js`, `window['cb_${name}'](${data})`, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  writeArticleFile (data, name) {
    data = this.marked(data, name)
    data.outline.name = name // 大纲类型名称
    data = JSON.stringify(data)
    fs.writeFile(`${outPath}/${name}.js`, `window['cb_${name}'](${data})`, 'utf8', function (err) {
      if (err) {
        console.error(err)
      }
    })
  }
  async buildDataFile () {
    const names = this.rootFileNames()
    const namesKeys = Object.keys(names)

    this.writeMenuFile(namesKeys)

    for (let i = 0, len = namesKeys.length; i < len; i++) {
      let name = namesKeys[i]
      const no = names[name]
      const dirPath = notePath + '\\' + no + name
      const filePath = dirPath + '.md'

      if (fs.existsSync(filePath)) {
        let data = await this.readFile(filePath)
        data = this.indexData(data)
        if (!fs.existsSync(dirPath)) {
          this.writeArticleFile(data, name)
          continue
        }
        let Alldata = await this.readFileAll(dirPath)
        this.writeArticleFile(data + '\n\n' + Alldata, name)
      } else {
        let Alldata = await this.readFileAll(dirPath)
        this.writeArticleFile(Alldata, name)
      }
    }
    let indexsJSON = this.markeParse.indexs
    fs.writeFile(`${outPath}/search-indexs.json`, JSON.stringify(indexsJSON), 'utf8', function (err) {
      if (err) {
        console.error(err)
        return
      }
      // 上传索引
      const client = algoliasearch('0LB88A3X11', 'e6cbdb5d4cc789a9007808e09db844a2');
      const index = client.initIndex('docs')
      index.clearIndex((err, content) => {
        if (err) throw err
        index.addObjects(indexsJSON, (err, content) => {
          if (err) throw err
        })
      })
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

  marked (content, name) {
    return this.markeParse.parser(content, name)
  }
}

(new NoteBuild()).buildDataFile()

// module.exports = new NoteBuild()
