const createElement = (type, properties={}, children=[]) => {
  const el = document.createElement(type)
  Object.keys(properties).forEach(key =>
    el.setAttribute(key, properties[key])
  )
  children.forEach(child =>
    el.appendChild(child instanceof Node ? child : child.render())
  )
  return el
}
const insertChildAtIndex = (el, child, index=0) => {
  if(index < 0) index = el.children.length+index // when negative index offset from end

  if(index >= el.children.length) return el.appendChild(child)
  else el.insertBefore(child, el.children[index])
}

const createPoll = () => {

}

const array_insert = (arr, pos, el) => [
  ...arr.slice(0, pos),
  el,
  ...arr.slice(pos)
]

class El {

  mounted = false
  el = null
  listeners = {}

  constructor(el) {
    this.el = el
  }

  update(state) {
    console.error("overload update method", state)
  }

  listen() {
    const listeners = {}

    const rtn = {
      on: (event, listener) => {
        listeners[event] = listener
        return rtn
      },
      off: (event) => {
        if(!event) listeners = {}
        else delete listeners[event]

        return rtn
      },
      finalize: () => {
        this.listeners = listeners
        Object.keys(this.listeners).forEach(key =>
          this.el.addEventListener(key, this.listeners[key].bind(this, this))  
        )
        return this
      }
    }

    return rtn

  }

  render() {
    return this.el
  }
}

export {
  createElement, insertChildAtIndex, createPoll, array_insert, El
}