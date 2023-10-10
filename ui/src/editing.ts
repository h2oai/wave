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

import { B, box, S, U } from './core'
import { Layout } from "./meta"

export type CardAttr = {
  name: S
  optional: B
} & ({
  t: 'box'
  value: S // JSON-stringified FlexBox
} | {
  t: 'textbox'
  value: S
} | {
  t: 'textarea'
  value: S
} | {
  t: 'spinbox'
  value: U
  min: U
  max: U
  step: U
} | {
  t: 'record'
  value: any
})

export type CardDef = {
  icon: S
  view: S
  attrs: CardAttr[]
}

export enum EditorActionT { None, Pick, Add, Edit, Delete }
export type NoAction = { t: EditorActionT.None }
export type PickCard = { t: EditorActionT.Pick }
export type AddCard = { t: EditorActionT.Add, view: S }
export type EditCard = { t: EditorActionT.Edit, name: S }
export type DeleteCard = { t: EditorActionT.Delete, name: S }
export type EditorAction = NoAction | PickCard | AddCard | EditCard | DeleteCard
export const
  noAction: EditorAction = { t: EditorActionT.None },
  pickCard: EditorAction = { t: EditorActionT.Pick },
  editorActionB = box<EditorAction>(noAction),
  editCard = (name: S) => {
    editorActionB({ t: EditorActionT.Edit, name })
  },
  deleteCard = (name: S) => {
    editorActionB({ t: EditorActionT.Delete, name })
  }

export type LayoutDef = {
  name: S
  layout: Layout
}

export const
  layoutDefs: LayoutDef[] = [
    {
      name: 'Sidebar on Left',
      layout: {
        name: 'hsbf',
        breakpoint: 'xs',
        min_height: '512px',
        zones: [
          { name: 'Header', },
          {
            name: 'Main',
            direction: 'row',
            zones: [
              { name: 'Sidebar', size: '256px' },
              { name: 'Body' },
            ],
          },
          { name: 'Footer' },
        ]
      }
    },
    {
      name: 'Sidebar on Right',
      layout: {
        name: 'hbsf',
        breakpoint: 'xs',
        min_height: '512px',
        zones: [
          { name: 'Header', },
          {
            name: 'Main',
            direction: 'row',
            zones: [
              { name: 'Body' },
              { name: 'Sidebar', size: '256px' },
            ],
          },
          { name: 'Footer' },
        ]
      }
    },
    {
      name: 'No Sidebar',
      layout: {
        name: 'hbf',
        breakpoint: 'xs',
        min_height: '512px',
        zones: [
          { name: 'Header', },
          { name: 'Body' },
          { name: 'Footer' },
        ],
      }
    },
    {
      name: 'Body Only',
      layout: {
        name: 'b',
        breakpoint: 'xs',
        zones: [
          { name: 'Body' },
        ],
      }
    },
  ],
  defaultLayoutDef = layoutDefs[0]
