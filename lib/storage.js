'use babel'
/* global atom */
/* @flow */

/*::
import type { ProjectList } from './types'
*/

const STORE_KEY = 'project-switcher:projects'
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

  activate () {
    this.subscriptions.add(atom.project.onDidChangePaths(() => {
      const paths = atom.project.getDirectories()
      this.push(paths.map(p => p.path))
    }))

    return this
  }

  /**
   * Adds paths to the store.
   */

  push (paths /*: Array<string> */) {
    console.log('[project-switcher]', 'pushing', paths)
    const list = this.get()

    const newList = paths.reduce((list /*: ProjectList */, rawPath /*: string */) => {
      // Normalize the path (eg, '/path/to/.' -> '/path/to')
      const path = require('path').resolve(rawPath)

      const idx = list.indexOf(path)

      if (idx !== -1) {
        // If it's already there, remove it
        return [ { path }, ...list.slice(0, idx), ...list.slice(idx + 1) ]
      } else {
        return [ { path }, ...list ]
      }
    }, list)

    this.set(newList.slice(0, MAX_LENGTH))
  }

  /**
   * Returns the list of paths stored.
   */

  get () /*: ProjectList */ {
    const raw = window.localStorage[STORE_KEY]
    if (!raw) return []
    const data = JSON.parse(raw)

    // Migration from an old version
    if (typeof data[0] === 'string') { return data.map(path => ({ path })) }
    return data
  }

  /**
   * Updates the list of paths stored.
   */

  set (value /*: ProjectList */) {
    console.log('[switch-project]', 'updating project list:', value)
    window.localStorage[STORE_KEY] = JSON.stringify(value)
  }
}
