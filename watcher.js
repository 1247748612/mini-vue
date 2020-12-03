class Watcher {

  vm = null
  cb = () => {}
  newDepIds = new Set()
  newDep = []
  constructor(vm, callback) {
    this.vm = vm
    this.cb = callback
  }

  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDep.push(dep)
      this.newDepIds.add(id)
      dep.addSub(this)
    }
  }

  update() {
    if (!this.cb) {
      console.warn('回调函数不存在')
      return
    }
    this.cb.call(this.vm)
  }
}