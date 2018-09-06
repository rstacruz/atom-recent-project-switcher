/* @flow */

export type SessionFile = {
  type: 'FILE',
  path: string
}

export type SessionPane = {
  type: 'PANE',
  items: Array<SessionFile>
}

export type SessionData = {
  type: 'SESSION',
  panes: Array<SessionPane>
}

export type ProjectItem = {
  path: string,
  accessedAt?: ?number,
  session?: ?SessionData
}

export type ProjectList = Array<ProjectItem>
