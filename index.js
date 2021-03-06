const fs = require('fs')
const xml2js = require('xml2js')
const readlineSync = require('readline-sync')

let path = ''

function cropNumber(number){
  number = number.replace(/0+$/, '')
  number = number.replace(/\.+$/, '')
  return number
}

function isPathValid(path){
  try {
    fs.accessSync(path)
    return true
  } catch(e) {
    console.log('Path not valid.')
    return false
  }
}

while (!path || !isPathValid(path)) {
  path = readlineSync.question('Wait for path to folder: ')
}

const parser = new xml2js.Parser()
let parsedData = {}

const files = fs.readdirSync(path)

console.log('Files parsed')

for (const file of files) {
  const data = fs.readFileSync(path + '\\' + file)
  parser.parseString(data, (err, result) => {
    for (const key in result.CMapData.entities[0].Item) {
      const prop = result.CMapData.entities[0].Item[key]
      // console.log(prop.position[0].$)
      const name = prop.archetypeName[0].toLowerCase()
      if (!parsedData[name]) {
        parsedData[name] = []
      }

      parsedData[name].push(prop.position[0].$)
    }
  })
}

let fileContent = ''
for (const prop_name in parsedData) {
  const coords = parsedData[prop_name]
  for (const position of coords) {
    console.log
    const newText = `{'${prop_name}', ${cropNumber(position.x)}, ${cropNumber(position.y)}, ${cropNumber(position.z)}},\n`
    fileContent += newText
  }
}

fs.writeFileSync('exportData.txt', fileContent)

console.log('Done!')