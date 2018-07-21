'use babel'
/* global atom */

import AtomProjectSwitcherView from './atom-project-switcher-view'
import { CompositeDisposable } from 'atom'

export default {
  view: null,
  modalPanel: null,
  subscriptions: null,

  /**
   * Activates the plugin.
   */

  activate (state) {
    this.element = document.createElement('div')

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.element,
      visible: false
    })

    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-project-switcher:switch-project': () => this.openSwitcher()
      })
    )
  },

  /**
   * Lies in a deep and dreamless slumber.
   */

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.view.destroy()
  },

  /**
   * Not used.
   */

  serialize () {
    return {}
  },

  /**
   * Opens the modal selector dialog.
   * Bound to the main `switch-project` command.
   */

  openSwitcher () {
    // Idempotency
    if (this.modalPanel.isVisible()) return

    // Save this, so it can be refocused later.
    this.previouslyFocusedElement = document.activeElement

    this.view = new AtomProjectSwitcherView({
      items: ['lol', 'tnoeu'],
      onConfirm: item => {
        this.dismiss()
        window.alert('choosing ' + item)
      },
      onDismiss: () => {
        this.dismiss()
      }
    })

    this.element.appendChild(this.view.element)
    this.modalPanel.show()
    this.view.focus()
  },

  /**
   * Dismisses the modal selector dialog.
   */

  dismiss () {
    // Idempotency
    if (!this.modalPanel.isVisible()) return

    this.modalPanel.hide()

    if (this.view) {
      this.view.destroy()
      this.view = null
    }

    // Refocus on the editor
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }
}
