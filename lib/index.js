'use babel'
/* global atom */
/* @flow */

import { CompositeDisposable } from 'atom'
import ModalService from './modal-service'
import Storage from './storage'
import * as Session from './session'
import { ProjectItem } from './types'

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
      onConfirm: (path: string) => {
        const item = this.storage.getItem(path) || { path }
        this.switchTo(item)
      }
    }).activate()

    this.storage = new Storage({
      subscriptions: this.subscriptions
    }).activate()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'recent-project-switcher:switch-project': () => this.openSwitcher(),
        'recent-project-switcher:save-session': () => this.saveSession()
      })
    )

    this.subscriptions.add(
      atom.config.observe(
        'recent-project-switcher.closeEditorsOnSwitch',
        value => {
          this.settings.closeEditorsOnSwitch = value
        }
      )
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

  switchTo ({ path, session }: ProjectItem) {
    // Save session
    this.storage.touch()

    // Close other editors, if the setting is on
    if (this.settings.closeEditorsOnSwitch) {
      atom.workspace.getPanes().forEach(pane => pane.destroy())
    }

    console.log('[project-switcher] switchTo():', path)
    atom.project.setPaths([path])

    if (this.settings.closeEditorsOnSwitch) {
      if (session) {
        Session.loadSessionData(session)
      }
    }
  },

  /**
   * Dismisses the modal selector dialog.
   */

  dismiss () {
    this.modalService.close()
  },

  /**
   * Saves the current session.
   */

  saveSession () {
    this.storage.touch()
  }
}
