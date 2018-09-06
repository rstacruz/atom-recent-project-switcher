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
    // This is now deprecated.
    // closeEditorsOnSwitch: {
    //   type: 'boolean',
    //   default: true
    // },

    // This supercedes closeEditorsOnSwitch
    actionOnSwitch: {
      enum: ['none', 'load-previous-session'],
      type: 'string',
      title: 'Upon switching, do:',
      description:
        'Load previously-open editors when switching to a project. (Experimental)',
      default: 'none'
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

    this.migrateSettings()

    this.subscriptions.add(
      atom.config.observe('recent-project-switcher.actionOnSwitch', value => {
        this.settings.actionOnSwitch = value
      })
    )
  },

  /**
   * Get rid of old settings.
   */

  migrateSettings () {
    if (atom.config.get('recent-project-switcher.closeEditorsOnSwitch')) {
      atom.config.set('recent-project-switcher.closeEditorsOnSwitch', undefined)
    }
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

    // Close other editors
    atom.workspace.getPanes().forEach(pane => pane.destroy())

    // Switch to project
    atom.project.setPaths([path])

    // Load session, if available
    if (this.settings.actionOnSwitch === 'load-previous-session' && session) {
      Session.loadSessionData(session)
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
