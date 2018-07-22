'use babel'
/* @flow */
/** @jsx etch.dom */

import SelectList from 'atom-select-list'
import { basename, dirname } from 'path'

/*::
export type Props = {|
  items: Array<string>,
  onDismiss: () => any,
  onConfirm () => any
|}
*/

/**
 * The dialog inside the modal.
 *
 * @example
 *     v = new AtomProjectSwitcherView({
 *       items, onConfirm, onDismiss
 *     })
 */

export default class AtomProjectSwitcherView {
  /*::
  list: SelectList
  element: Node
  props: Props
  */

  constructor (props /*: Props */) {
    this.props = props

    this.list = new SelectList({
      items: this.props.items,

      elementForItem: item => {
        const el = document.createElement('li')
        const name = basename(item)
        const context = basename(dirname(item))

        el.innerHTML = `
          <span class='project-switcher-list-item'>
            <strong class='name icon icon-file-directory'>
              <span class='context'>${context}</span>
              <span class='basename'>${name}</span>
            </strong>
            <!-- <small class='path'>${item}</small> -->
          </span>
        `
        return el
      },

      didConfirmSelection: item => {
        this.props.onConfirm(item)
      },

      didCancelSelection: () => {
        this.props.onDismiss()
      },

      didConfirmEmptySelection: () => {
        this.props.onDismiss()
      }
    })

    // Root element
    this.element = this.list.element
  }

  serialize () {}

  focus () {
    this.list.focus()
  }

  destroy () {
    this.list.destroy()
  }
}
