// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as T from './core'
import { dialogB } from './dialog'
import { preload } from "./meta"
import * as N from './notification'

const
  name = 'meta',
  metaProps: T.Model<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Meta.tsx', () => {
  beforeEach(() => jest.clearAllMocks())

  it('Sets title - init', () => {
    preload({ ...metaProps, state: { title: name } })
    expect(window.document.title).toBe(name)
  })

  it('Shows notification - init', () => {
    const showNotificationMock = jest.fn()
    // @ts-ignore
    N.showNotification = showNotificationMock

    preload({ ...metaProps, state: { notification: name } })
    expect(showNotificationMock).toHaveBeenCalled()
    expect(showNotificationMock).toHaveBeenCalledWith(name)
  })

  it('Sets dialog - init', () => {
    const dialog = {
      name: 'dialog',
      title: 'Dialog Title',
      items: [],
    }
    expect(dialogB()).toBe(null)
    preload({ ...metaProps, state: { dialog } })
    expect(dialogB()).toMatchObject(dialog)
  })

})