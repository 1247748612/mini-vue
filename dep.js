let uid = 0

class Dep {
  static target = null
  subs = []
  id = 0

  constructor() {
    this.id = uid ++ 
  }


  addSub(w) {
    this.subs.push(w)
  }


  remove(w) {
    const index = this.subs.findIndex((value) => {
      return value === w
    })
    this.subs.splice(index, 1)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(
        this
      )
    }
  }

  notify() {
    this.subs.forEach((w) => {
      w.update()
    })
  }
}