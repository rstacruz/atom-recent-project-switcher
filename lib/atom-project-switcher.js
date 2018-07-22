'use babel'
/* global atom */

import { CompositeDisposable } from 'atom'
import ModalService from './modal_service'

export default {
  subscriptions: null,
  modalService: null,

  /**
   * Activates the plugin.
   */

  activate (state) {
    this.subscriptions = new CompositeDisposable()

    this.modalService = new ModalService()

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
    this.subscriptions.dispose()
    this.modalService.deactivate()
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
    this.modalService.open()
  },

  /**
   * Dismisses the modal selector dialog.
   */

  dismiss () {
    this.modalService.close()
  }
}
