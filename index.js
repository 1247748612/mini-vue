
var data = (function () {
  return {
    test1: 1,
    test2: 2,
    obj: {
      one: 1,
      two: 2
    },
    list: ['aaaaa', 'bbbbb', 'ccccc', 'ddddd'],
    title: 'welcome mini vue',
  }
})()

function isObject(val) {
  return typeof val === 'object'
}

function isPlanObject(val) {
  return toString.call(val) === '[object Object]'
}

function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

function observe(val) {
  const dep = new Dep()
  if (!isObject(val)) {
    return
  }

  console.log(val)

  if (val.__ob__) {
    return val.__ob__
  }

  def(val, '__ob__', { dep, observeArray })

  if (Array.isArray(val)) {
    copyAugment(val, arrayMethods, Object.getOwnPropertyNames(arrayMethods))
    observeArray(val)
  } else {
    walk(val)
  }

  function observeArray(array) {
    for(let i in array) {
      observe(array[i])   
    }
  }

  function walk(d) {
    const keys = Object.keys(d)
    for (let k of keys) {
      defineReactive(d, k)
    }
  }
  return {
    dep
  }
}

function defineReactive(obj, key) {
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (!property || !property.configurable) {
    return
  }


  const getter = property && property.get;
  const setter = property && property.set;

  const dep = new Dep()

  let val = getter && getter.call(obj) || obj[key]

  let childObj = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,

    get: function reactiveGetter() {
      dep.depend()
      if (childObj) {
        childObj.dep.depend()
      }
      const value = getter ? getter.call(obj) : val
      return value
    },
    set: function reactiveGetter(newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (value !== value && newVal !== newVal)) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      childObj = observe(newVal)
      if (childObj) {
        childObj.dep.depend()
      }

      dep.notify()
    }
  })
}


class Render {
  data = {}
  constructor(data) {
    this.data = data || {}
  }

  setTitle() {
    document.title = this.data.title
  }

  getById(id) {
    return document.getElementById(id)
  }

  setHeader() {
    const header = this.getById('header')
    header.innerText = this.data.title
  }

  setContent() {
    const content = this.getById('content')
    content.innerHTML = String(this.data.test1) + '<br />' + String(this.data.test2)
  }

  setObj() {
    const obj = this.getById('obj')
    obj.innerHTML = ''
    Object.values(this.data.obj).forEach((value) => {
      const p = document.createElement('p')
      p.innerHTML = value
      obj.appendChild(p)
    })
  }

  setList() {
    const list = this.getById('list')
    list.innerHTML = ''
    this.data.list.forEach((item) => {
      const li = document.createElement('li')
      li.classList = ['li']
      li.innerHTML = item
      list.appendChild(li)
    })
  }

  update() {
    this.setHeader()
    this.setContent()
    this.setTitle()
    this.setObj()
    this.setList()
  }
}

observe(data)

const r = new Render(data)
const w = new Watcher(r, r.update)
Dep.target = w
r.update()