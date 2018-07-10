export const recursionObj = (objs) => {
  'use strict'
  // 拍平对象
  let obj = {}
  function recursion (objs, name) {
    // 保存当前层次的key
    let presentName = name
    Object.keys(objs).forEach((v) => {
      if (!isObject(objs[v])) {
        let presentNameKey = presentName ? `${presentName}.${v}` : v
        obj[presentNameKey] = objs[v]
        return
      }
      // 是对象的话叠加key
      let key = name ? `${name}.${v}` : v
      let len = Object.keys(objs[v]).length
      if (!len) {
        // 如果对象是空 直接赋值空对象
        obj[`${presentName}.${v}`] = objs[v]
        return
      }
      return recursion(objs[v], key)
    })
  }
  recursion(objs, '')
  return obj
}

export const isObject = (val) => {
  return toString.call(val) === '[object Object]'
}

export const isArray = (val) => {
  return toString.call(val) === '[object Array]'
}

export const isDate = (val) => {
  return toString.call(val) === '[object Date]'
}

export const isBoolean = (val) => {
  return toString.call(val) === '[object Boolean]'
}

export const isFunction = (val) => {
  return toString.call(val) === '[object Function]'
}

export const isNumber = (val) => {
  return toString.call(val) === '[object Number]'
}

export const isUndefined = (val) => {
  return toString.call(val) === '[object Undefined]'
}

export const isString = (val) => {
  return toString.call(val) === '[object String]'
}

export const sliceStr = (len, str) => {
  // 按两位切割数字成数组，最后拼接成时间
  let data = []
  let j = 0
  for (let i = 0; i < len + 1; i++) {
    if (i !== 0 && i % 2 === 0) {
      data.push(str.slice(j, i))
      j = i
    }
  }
  return data
}

export const rmSpaceAndChinese = (data, name) => {
  // 去空格和中文
  data[name] = data[name].replace(/\s+/g, '')
  data[name] = data[name].replace(/[\u4e00-\u9fa5]/ig, '')
}

export const filtrationString = (data, name) => {
  // 过滤非数字
  data[name] = data[name].replace(/[\D]/g, '')
}

export const getYear = () => {
  // 获取当前年份
  let date = new Date()
  let y = 1900 + date.getYear()
  return y
}

export const isNull = (data) => {
  if (data === '' || data === null || data === undefined) {
    return true
  } else {
    return false
  }
}

export const getArrayValueType = (value) => {
  // 判断数组的具体类型
  let type = 'array'
  if (value.length > 0) {
    var name = value[0].constructor.name
    if (name === 'Array') {
      type = 'array[array]'
    } else if (name === 'Object') {
      type = 'array[object]'
    } else if (name === 'String') {
      type = 'array[string]'
    } else if (name === 'Number') {
      type = 'array[number]'
    } else if (name === 'Boolean') {
      type = 'array[boolean]'
    }
  }
  return type
}

export const compileJson = (json) => {
  // 转换json 拍平
  if (isNull(json) || json.length === 0 || typeof json !== 'object') {
    return []
  }
  let returnedArr = []
  const com = (data, arr) => {
    // 将json的数组list 换成对象
    if (data.constructor.name === 'Array') {
      let fullObj = {}
      data.forEach((d) => {
        // 递归出口(只递归引用类型)
        if (d.constructor.name === 'Object') {
          for (let key in d) {
            fullObj[key] = d[key]
          }
        } else if (d.constructor.name === 'Array') {
          // 提出arr所有数据
          com(d, arr)
        }
      })
      com(fullObj, arr)
    } else if (data.constructor.name === 'Object') {
      for (let key in data) {
        let v = data[key]
        // 创建了一个对象，保存各项数据
        let t = { children: [] }
        if (v !== undefined && v !== null) {
          if (v.constructor.name === 'Object') {
            t.type = 'object'
            com(v, t.children)
          } else if (v.constructor.name === 'Array') {
            // 递归list数据
            // 判断数组的具体类型
            t.type = getArrayValueType(v)
            if (t.type === 'array[object]') {
              com(v, t.children)
            } else if (t.type === 'array[array]') {
              com(v[0], t.children)
            }
          } else {
            t.type = typeof v
          }
        } else {
          t.type = 'string'
        }
        t.name = trim(key)
        t.require = 1
        t.description = ''
        if (t.type.indexOf('object') !== -1 || t.type.indexOf('array') !== -1) {
          t.defaultValue = JSON.stringify(v)
        } else {
          t.defaultValue = v
        }
        arr.push(t)
      }
    }
  }
  com(json, returnedArr)
  return returnedArr || []
}

export const formattingJson = (json) => {
  // 格式化json
  var returnJson = ''
  if (json) {
    for (var i = 0, j = 0, k = 0, ii, ele; i < json.length; i++) { // k:缩进，j:""个数
      ele = json.charAt(i)
      if (j % 2 === 0 && ele === '}') {
        k--
        for (ii = 0; ii < k; ii++) ele = '    ' + ele
        ele = '\n' + ele
      } else if (j % 2 === 0 && ele === '{') {
        ele += '\n'
        k++
        for (ii = 0; ii < k; ii++) ele += '    '
      } else if (j % 2 === 0 && ele === ',') {
        ele += '\n'
        for (ii = 0; ii < k; ii++) ele += '    '
      } else if (ele === '\'') j++
      returnJson += ele
    }
  }
  return returnJson
}

export const formattingXml = (text) => {
  // 格式化xml
  // 去掉多余的空格
  if (isNull(text) || text === '{}' || text.length === 0) {
    return
  }
  text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
    return name + ' ' + props.replace(/\s+(\w+=)/g, ' $1')
  }).replace(/>\s*?</g, '>\n<')

  // 把注释编码
  text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
    var ret = '<!--' + escape(text) + '-->'
    // alert(ret)
    return ret
  }).replace(/\r/g, '\n')

  // 调整格式
  var rgx = /\n(<(([^?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg
  var nodeStack = []
  var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
    var isClosed = (isCloseFull1 === '/') || (isCloseFull2 === '/') || (isFull1 === '/') || (isFull2 === '/')
    // alert([all,isClosed].join('='))
    var prefix = ''
    if (isBegin === '!') {
      prefix = getPrefix(nodeStack.length)
    } else {
      if (isBegin !== '/') {
        prefix = getPrefix(nodeStack.length)
        if (!isClosed) {
          nodeStack.push(name)
        }
      } else {
        nodeStack.pop()
        prefix = getPrefix(nodeStack.length)
      }
    }
    var ret = '\n' + prefix + all
    return ret
  })

  var outputText = output.substring(1)
  // alert(outputText)
  // 把注释还原并解码，调格式
  outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
    // alert(['[',prefix,']=',prefix.length].join(''))
    if (prefix.charAt(0) === '\r') {
      prefix = prefix.substring(1)
    }
    text = unescape(text).replace(/\r/g, '\n')
    var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->'
    // alert(ret)
    return ret
  })

  return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n')
}

export const JsonBecomeString = (data) => {
  // 将所有json默认值转换成字符串
  if (isNull(data)) {
    return
  }
  let arr = data
  const com = (arr) => {
    arr.forEach((val) => {
      if (val.defaultValue !== '' && val.defaultValue !== null) {
        if (val.type.indexOf('object') !== -1 || val.type.indexOf('array') !== -1) {
          val.defaultValue = JSON.stringify(val.defaultValue)
        }
        if (val.type === 'boolean') {
          val.defaultValue = val.defaultValue + ''
        }
      }
      if (val.children && val.children.length) {
        com(val.children)
      }
    })
  }
  com(arr)
  return arr
}


export const transformJSON = (data) => {
  // 转换默认值类型为对应type
  if (isNull(data)) {
    return
  }
  let obj = JSON.parse(JSON.stringify(data))
  const com = (obj) => {
    obj.forEach((val) => {
      if (val.defaultValue !== '' && val.defaultValue !== null) {
        if (val.type === 'number') {
          val.defaultValue = +val.defaultValue
        }
        if (val.type === 'string') {
          val.defaultValue = String(val.defaultValue) || ''
        }
        if (val.type === 'boolean') {
          if (val.defaultValue === 'false' || val.defaultValue === '0') {
            val.defaultValue = false
          } else {
            val.defaultValue = !!val.defaultValue
          }
        }
        if (val.type.indexOf('array') !== -1 || val.type === 'object') {
          try {
            val.defaultValue = JSON.parse(val.defaultValue)
          } catch (e) {
            // 非正常引用类型不转换
            val.defaultValue = val.defaultValue
            // Message.error('jons格式错误')
          }
        }
      }
      if (val.children && val.children.length) {
        com(val.children)
      }
    })
  }
  com(obj)
  return obj
}