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

import * as Fluent from '@fluentui/react'
import React from 'react'
import { Choice } from './choice_group'
import { B, bond, box, qd, S } from './qd'
import { displayMixin } from './theme'

/**
 * Create an ordered select.
 * Ordered select is used for cases when you need to make a selection that depends on order as opposed to a regular select.
*/
export interface OrderedSelect {
  /** An identifying name for this component. */
  name: S
  /** The choices to be presented. */
  choices: Choice[]
  /** Text to be displayed above the component. */
  label?: S
  /** The names of the selected choices. */
  values?: S[]
  /** True to allow multiple rows to be selected. */
  multiple?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** The height of the ordered select, e.g. '400px'. Defaults to 200px. */
  height?: S
  /** True if the form should be submitted when the picker value changes. */
  trigger?: B
}


export const XOrderedSelect = bond(({ model }: { model: OrderedSelect }) => {
  const
    activeMoveIconB = box<'ChevronRight' | 'ChevronLeft'>('ChevronRight'),
    isMultiple = model.values?.length || model.multiple,
    onMoveClick = () => {
      if (activeMoveIconB() === 'ChevronRight') {
        selectedB([...selectedB(), ...selectableSelection.getSelection() as Choice[]])
        selectableB(selectableB().filter(opt => !selectedB().find(chosenOpt => chosenOpt.name === opt.name)))
        qd.args[model.name] = selectedSelection.getSelection().map(({ key }: Fluent.IObjectWithKey) => key as S)
        if (model.trigger) qd.sync()
      } else {
        selectableB([...selectableB(), ...selectedSelection.getSelection() as Choice[]])
        selectedB(selectedB().filter(selected => !selectableB().find(selectable => selectable.name === selected.name)))
      }
    },
    onRenderItemColumn = (item?: Choice) => !item ? null : <span>{item.label || item.name}</span>,
    onRenderDetailsHeader = () => null,
    selectableB = box<Choice[]>(model.choices),
    selectedB = box<Choice[]>([]),
    selectableSelection = new Fluent.Selection({
      onSelectionChanged: () => {
        if (selectableSelection.getSelectedCount()) {
          selectedSelection.setAllSelected(false)
          activeMoveIconB('ChevronRight')
        }
      }
    }),
    selectedSelection = new Fluent.Selection({
      onSelectionChanged: () => {
        if (selectedSelection.getSelectedCount()) {
          selectableSelection.setAllSelected(false)
          activeMoveIconB('ChevronLeft')
        }
      }
    }),
    commonListProps: Partial<Fluent.IDetailsListProps> = {
      selectionMode: isMultiple ? Fluent.SelectionMode.multiple : Fluent.SelectionMode.single,
      selectionPreservedOnEmptyClick: true,
      onRenderItemColumn,
      onRenderDetailsHeader,
      styles: { root: { height: model.height || 200 } },
      dragDropEvents: {
        canDrag: () => true,
        canDrop: () => true,
        // onDrop: (item: any) => {
        // },
        // onDragStart: (item?: any, itemIndex?: number, selectedItems?: any[]) => {
        // }
      }
    },
    SelectedItems = () => {
      const items = selectedB()
      return !items.length
        ? <Fluent.Text styles={{ root: { alignSelf: 'center' } }} block>Start by clicking or drag and dropping the left list.</Fluent.Text>
        : (
          <Fluent.StackItem>
            <Fluent.Text block variant='smallPlus'>Selected</Fluent.Text>
            <Fluent.DetailsList {...{ ...commonListProps, items, selection: selectedSelection }} />
          </Fluent.StackItem>
        )
    },
    init = () => {
      if (isMultiple && model.values) {
        model.values.forEach(v => selectedSelection.setKeySelected(v, true, false))
        qd.args[model.name] = model.values
      }
    },
    render = () => (
      <Fluent.Stack data-test={model.name} style={displayMixin(model.visible)}>
        {model.label && <Fluent.Label>{model.label}</Fluent.Label>}
        <Fluent.Stack horizontal horizontalAlign='space-between'>
          <Fluent.StackItem>
            <Fluent.Text block variant='smallPlus'>Selectable</Fluent.Text>
            <Fluent.DetailsList {...{ ...commonListProps, items: selectableB(), selection: selectableSelection }} />
          </Fluent.StackItem>
          <Fluent.IconButton iconProps={{ iconName: activeMoveIconB() }} onClick={onMoveClick} styles={{ root: { alignSelf: 'center' } }} />
          <SelectedItems />
        </Fluent.Stack>
      </Fluent.Stack>
    )

  return { init, render, activeMoveIconB, selectableB, selectedB }
})