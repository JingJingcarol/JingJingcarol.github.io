const path = require('path')
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render;
const _ = require('lodash')

const toastr = require('../lib/toastr')

module.exports = function generate(opt,dist){
    const metalsmith = Metalsmith(process.cwd())
    metalsmith.source(path.join(__dirname, '../template')).metadata(opt).destination(dist)
    // toastr.info(metalsmith.metadata())
    return new Promise((resolve, reject) => {
        metalsmith.use((files, metadata, done) => {
            // toastr.info(Object.keys(files))
            Object.keys(files).forEach(fileName => { //遍历替换模板
                if (!_.startsWith(fileName, 'src/font')) { //判断是否为字体文件，字体文件不用替换
                 const fileContentsString = files[fileName].contents.toString() //Handlebar compile 前需要转换为字符创
                 toastr.info(`正在生成${fileName}文件`)
                 const res = Handlebars.compile(fileContentsString)(metadata.metadata())
                 files[fileName].contents = new Buffer.from(res)
                }
            })
            done()
        }).build(err => { // build
            if (err) {
                toastr.error(`Metalsmith build error: ${err}`)
             return reject(err)
            } else {
             return resolve()
            }
        })
    })

}