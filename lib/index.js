'use babel'
/* global atom */
/* @flow */

import { CompositeDisposable } from 'atom'
import ModalService from './modal-service'
import Storage from './storage'

export default {
  subscriptions: null,
  modalService: null,

  /**
   * Configuration
   */

  config: {
    closeEditorsOnSwitch: {
      type: 'boolean',
      default: true
    }
  },

  settings: {},

  /**
   * Activates the plugin.
   */

  activate (state) {
    this.subscriptions = new CompositeDisposable()

    this.modalService = new ModalService({
      onConfirm: path => this.switchTo(path)
    }).activate()

    this.storage = new Storage({
      subscriptions: this.subscriptions
    }).activate()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'recent-projects:switch-project': () => this.openSwitcher()
      })
    )

    this.subscriptions.add(
      atom.config.observe('recent-projects.closeEditorsOnSwitch', value => {
        this.settings.closeEditorsOnSwitch = value
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
   * Opens the modal selector dialog.
   * Bound to the main `switch-project` command.
   */

  openSwitcher () {
    const paths = this.storage.get()
    this.modalService.open({ paths })
  },

  /**
   * Switches to a different project.
   */

  switchTo (projectPath: string) {
    // Close other editors, if the setting is on
    if (this.settings.closeEditorsOnSwitch) {
      atom.workspace.getPanes().forEach(pane => pane.destroy())
    }

    atom.project.setPaths([projectPath])
  },

  /**
   * Dismisses the modal selector dialog.
   */

  dismiss () {
    this.modalService.close()
  }
}
