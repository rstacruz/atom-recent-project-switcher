'use babel'
/* global atom */
/* @flow */

import type {
  SessionData,
  SessionPane,
  SessionFile,
  SessionItem
} from './types'

export type BufferFile = {
  symlink: boolean,
  path: string
}

export type Buffer = {
  file: ?BufferFile
}

export type Item = {
  buffer: ?Buffer
}

export type Pane = {
  items: Array<Item>,
  activeItem: ?Item
}

export type Thunk = () => Promise

/**
 * Returns session data
 */

export const getSessionData = (): SessionData => {
  const panes = atom.workspace
    .getPanes()
    .map(
      (pane: Pane): SessionPane => {
        const items = pane.items
          .map(
            (item: Item): SessionFile => {
              const path = getFilePath(item)
              if (!path) return
              const isActive = pane.activeItem === item
              return { type: 'FILE', path, isActive }
            }
          )
          .filter(Boolean)

        if (!items.length) return
        return { type: 'PANE', items }
      }
    )
    .filter(Boolean)

  return { type: 'SESSION', panes }
}

/**
 * Loads session data
 */

export const loadSessionData = (data: SessionData) => {
  console.log('[recent-project-switcher] loading session data', data)
  const thunks = data.panes.reduce(
    (result: Array<Thunk>, pane: SessionPane, idx0: number) => {
      return [
        ...result,
        ...pane.items.map((item: SessionItem, idx1: number) => () => {
          let options
          if (idx1 === 0 && idx0 !== 0) options = { split: 'right' }
          return atom.workspace.open(item.path, options)
        })
      ]
    },
    []
  )

  return thunks.reduce((last: Promise, thunk: Thunk) => {
    return last.then(thunk)
  }, Promise.resolve())
}

/**
 * Returns the file path for the current item
 * @private
 */

function getFilePath (item: Item) {
  return item && item.buffer && item.buffer.file && item.buffer.file.path
}
