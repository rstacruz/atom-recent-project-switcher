'use babel'
/* global atom */

import AtomProjectSwitcherView from './atom-project-switcher-view'
import { CompositeDisposable } from 'atom'

export default {
  atomProjectSwitcherView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.atomProjectSwitcherView = new AtomProjectSwitcherView()

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomProjectSwitcherView.element,
      visible: false
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-project-switcher:activate': () => this.toggle()
      })
    )
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.atomProjectSwitcherView.destroy()
  },

  serialize () {
    return {}
  },

  toggle () {
    return this.modalPanel.isVisible()
      ? this.modalPanel.hide()
      : this.modalPanel.show()
  }
}
