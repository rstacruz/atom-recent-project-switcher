'use babel'
/* global atom */

import AtomProjectSwitcherView from './atom-project-switcher-view'
import { CompositeDisposable } from 'atom'

export default {
  view: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.element = document.createElement('div')

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.element,
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-project-switcher:switch-project': () => this.spawn()
      })
    )
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.view.destroy()
  },

  serialize () {
    return {}
  },

  spawn () {
    this.view = new AtomProjectSwitcherView({
      items: ['lol', 'tnoeu'],
      onConfirm: (item) => {
        this.modalPanel.hide()
        this.view.destroy()
      },
      onDismiss: () => {
        this.modalPanel.hide()
        this.view.destroy()
      }
    })

    this.element.appendChild(this.view.element)
    this.modalPanel.show()
    this.view.focus()
  }
}
