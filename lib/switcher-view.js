'use babel'
/* @flow */
/** @jsx etch.dom */

import SelectList from 'atom-select-list'
import { basename, dirname } from 'path'
import ms from 'ms'

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

      filterKeyForItem: item => item.path,

      elementForItem: item => {
        const path = item.path
        const el = document.createElement('li')
        const name = basename(path)
        const context = basename(dirname(path))
        const accessTime = timeAgo(item.accessedAt) || ''

        el.innerHTML = `
          <span class='recent-project-switcher-item'>
            <strong class='name icon icon-file-directory'>
              <span class='context'>${context}</span>
              <span class='basename'>${name}</span>
            </strong>
            <small class='path'>${accessTime}</small>
          </span>
        `
        return el
      },

      didConfirmSelection: item => {
        this.props.onConfirm(item.path)
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

/**
 * Returns time ago in words
 */

function timeAgo (timestamp) {
  if (!timestamp) return

  const delta = +new Date() - timestamp

  if (delta < 60000) return 'just now'
  return `${ms(delta)} ago`
}
