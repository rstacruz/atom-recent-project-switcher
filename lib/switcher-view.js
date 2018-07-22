'use babel'
/* @flow */
/** @jsx etch.dom */

import SelectList from 'atom-select-list'

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
        el.innerHTML = item
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
