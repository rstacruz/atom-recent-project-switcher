'use babel'
/** @jsx etch.dom */

import SelectList from 'atom-select-list'
import etch from 'etch'

export default class AtomProjectSwitcherView {
  constructor (serializedState) {
    const usersSelectList = new SelectList({
      items: ['Alice', 'Bob', 'Carol'],

      elementForItem: item => {
        console.log('[]', 'elementForItem', item)
        return <li>{JSON.stringify(item)}</li>
      }
    })

    console.log('> usl', usersSelectList)
    console.log('> element', usersSelectList.element)

    // Create root element
    this.element = usersSelectList.element
    // this.element.classList.add('project-switcher')
  }

  serialize () {}

  destroy () {
    this.element.remove()
  }
}
