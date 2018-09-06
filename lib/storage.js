'use babel'
/* global atom */
/* @flow */

import * as Session from './session'

import type { ProjectList, ProjectItem, SessionData } from './types'

const STORE_KEY = 'recent-project-switcher:projects'
const MAX_LENGTH = 32

/**
 * Manages the storage of projects
 */

export default class Storage {
  constructor ({ subscriptions }) {
    this.subscriptions = subscriptions
  }

  /**
   * Called when the plugin is activate.
   */

  activate (): Storage {
    this.subscriptions.add(
      atom.project.onDidChangePaths(() => {
        this.push(this.getDirectories())
      })
    )

    return this
  }

  /**
   * Saves the current session
   */

  touch () {
    const paths = this.getDirectories()
    const session = Session.getSessionData()
    this.push(paths, { session })
  }

  /**
   * Returns currently open directories.
   */

  getDirectories (): Array<string> {
    return atom.project.getDirectories().map(p => p.path)
  }

  /**
   * Adds paths to the store. This is called two ways:
   *
   * - When a project is opened in Atom (no session passed)
   * - Right before switching projects (session is passed)
   */

  push (paths: Array<string>, itemData: ?{ session: ?SessionData }) {
    const list = this.get()
    const newList = paths.reduce((list: ProjectList, rawPath: string) => {
      // Normalize the path (eg, '/path/to/.' -> '/path/to')
      const path = require('path').resolve(rawPath)
      const item: ProjectItem = {
        path,
        accessedAt: +new Date(),
        ...itemData
      }

      const idx = list.findIndex(item => item.path === path)

      if (idx !== -1) {
        // If it's already there, remove it
        return [item, ...list.slice(0, idx), ...list.slice(idx + 1)]
      } else {
        return [item, ...list]
      }
    }, list)

    this.set(newList.slice(0, MAX_LENGTH))
  }

  /**
   * Returns the list of paths stored.
   */

  get (): ProjectList {
    const raw = window.localStorage[STORE_KEY]
    if (!raw) return []
    const data = JSON.parse(raw)

    // Migration from an old version
    if (typeof data[0] === 'string') {
      return data.map(path => ({ path }))
    }
    return data
  }

  /**
   * Returns the `ProjectItem` for a given path.
   *
   * @example
   *     getItem('/home/rsc/myproject')
   *     // => { path, accessedAt, session }
   */

  getItem (path: string): ProjectItem {
    const list = this.get() || []
    const item = list.find((item: ProjectItem) => item.path === path)
    return item
  }

  /**
   * Updates the list of paths stored.
   */

  set (value: ProjectList) {
    window.localStorage[STORE_KEY] = JSON.stringify(value)
  }
}
