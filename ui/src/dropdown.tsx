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
import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { Choice } from './choice_group'
import { fuzzysearch } from './parts/utils'
import { wave } from './ui'

/**
 * Create a dropdown.
 *
 * A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
 * a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
 * selected item is visible. When users click the drop-down button, all the options become visible.
 *
 * To change the value, users open the list and click another value or use the arrow keys (up and down) to
 * select a new value.
 *
 * Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
 * multi-select dropdown.
 */
export interface Dropdown {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The name of the selected choice. */
  value?: S
  /** The names of the selected choices. If this parameter is set, multiple selections will be allowed. */
  values?: S[]
  /** The choices to be presented. */
  choices?: Choice[]
  /** True if this is a required field. */
  required?: B
  /** True if this field is disabled. */
  disabled?: B
  /** True if the form should be submitted when the dropdown value changes. */
  trigger?: B
  /** The width of the dropdown, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  BaseDropdown = ({ name, label, required, disabled, value, values, choices, trigger, placeholder }: Dropdown) => {
    const
      isMultivalued = !!values,
      selection = React.useMemo(() => isMultivalued ? new Set<S>(values) : null, [isMultivalued, values]),
      [selectedOptions, setSelectedOptions] = React.useState(Array.from(selection || [])),
      options = (choices || []).map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label || name, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const optionKey = option.key as S
          if (isMultivalued && selection !== null) {
            option.selected ? selection.add(optionKey) : selection.delete(optionKey)

            const selectedOpts = Array.from(selection)
            wave.args[name] = selectedOpts
            setSelectedOptions(selectedOpts)
          } else {
            wave.args[name] = optionKey
          }
        }
        if (trigger) wave.push()
      },
      selectAll = () => {
        if (!selection) return

        selection.clear()
        options.forEach(o => { if (!o.disabled) selection.add(o.key as S) })

        const selectionArr = Array.from(selection)
        setSelectedOptions(selectionArr)
        wave.args[name] = selectionArr

        onChange()
      },
      deselectAll = () => {
        if (!selection) return

        selection.clear()
        setSelectedOptions([])
        wave.args[name] = []

        onChange()
      }

    return (
      <>
        <Fluent.Dropdown
          data-test={name}
          label={label}
          placeholder={placeholder}
          options={options}
          required={required}
          disabled={disabled}
          multiSelect={isMultivalued || undefined}
          defaultSelectedKey={!isMultivalued ? value : undefined}
          selectedKeys={isMultivalued ? selectedOptions : undefined}
          onChange={onChange}
        />
        {
          isMultivalued &&
          <div>
            <Fluent.Text variant='small'>
              <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
            </Fluent.Text>
          </div>
        }
      </>
    )
  },
  ROW_HEIGHT = 30,
  PAGE_SIZE = 40,
  // See https://github.com/microsoft/fluentui/issues/20209 for selection disappearing on filter.
  DialogDropdown = ({ name, choices, values, value, disabled, required, trigger, placeholder, label }: Dropdown) => {
    const
      [isDialogHidden, setIsDialogHidden] = React.useState(true),
      initialSelectedMap = React.useMemo(() => {
        if (values?.length) return new Map(values.map(v => [v, true]))
        if (value) return new Map([[value, true]])
        return new Map()
      }, [value, values]),
      items = React.useMemo(() => choices?.map(({ name, label }, idx) => ({ name, text: label || name, idx, checked: initialSelectedMap.has(name) })) || [], [initialSelectedMap, choices]),
      width = React.useMemo(() => Math.max(items.reduce((width, { text }) => Math.max(width, (text.length * 6) + 180), 0), 500), [items]),
      [filteredItems, setFilteredItems] = React.useState(items),
      [textValue, setTextValue] = React.useState(() => {
        if (!values?.length && !value) return

        const itemsMap = new Map<S, S>(items.map(({ name, text }) => [name, text]))

        if (values?.length) return values.map(v => itemsMap.get(v) || '').filter(Boolean).join(', ')
        if (value) return itemsMap.get(value)
      }),
      toggleDialog = () => setIsDialogHidden(!isDialogHidden),
      cancelDialog = () => {
        toggleDialog()
        setFilteredItems(filteredItems.map(i => { i.checked = initialSelectedMap.has(i.name); return i }))
      },
      submit = () => {
        const result = filteredItems.filter(({ checked }) => checked)
        wave.args[name] = result.length === 1 ? result[0].name : result.map(({ name }) => name)

        if (trigger) wave.push()
        setTextValue(result.length ? result.map(({ text }) => text).join(', ') : 'Select ...')
        initialSelectedMap.clear()
        result.forEach(({ name }) => initialSelectedMap.set(name, true))
        toggleDialog()
      },
      selectAll = (checked = true) => () => setFilteredItems(filteredItems.map(i => { i.checked = checked; return i })),
      onSearchChange = (_e?: React.ChangeEvent<HTMLInputElement>, newVal = '') => setFilteredItems(newVal ? items.filter(({ text }) => fuzzysearch(text, newVal)) : items),
      onChecked = React.useCallback((idx: U) => (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked = false) => {
        const items = values ? [...filteredItems] : filteredItems.map(i => { i.checked = false; return i })
        items[idx].checked = checked
        setFilteredItems(items)
      }, [filteredItems, values]),
      onRenderCell = React.useCallback((item?: { name: S, text: S, idx: U, checked: B }) =>
        item ? <Fluent.Checkbox label={item?.text} styles={{ root: { minHeight: ROW_HEIGHT } }} onChange={onChecked(item?.idx)} checked={item.checked} /> : null, [onChecked]),
      getPageSpecification = React.useCallback(() => ({ itemCount: PAGE_SIZE, height: ROW_HEIGHT * PAGE_SIZE, } as Fluent.IPageSpecification), [])

    return (
      <>
        <Fluent.TextField
          data-test={name}
          iconProps={{ iconName: 'ChevronDown' }}
          readOnly
          onClick={toggleDialog}
          label={label}
          disabled={disabled}
          required={required}
          styles={{ field: { cursor: 'pointer' }, icon: { fontSize: 12, color: Fluent.getTheme().palette.neutralSecondary } }}
          value={textValue || ''} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: textValue }} styles={{ main: { width: `${width}px !important` } }} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: 600 }, header: { height: 0 } }}>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} placeholder={placeholder} />
            <div style={{ marginTop: 16 }}>
              <span className='wave-s12 wave-w5'>Selected: {filteredItems.filter(({ checked }) => checked).length}</span>
              <Fluent.Text variant='small' styles={{ root: { float: 'right' } }} block>
                <Fluent.Link onClick={selectAll()}>Select All</Fluent.Link> | <Fluent.Link onClick={selectAll(false)}>Deselect All</Fluent.Link>
              </Fluent.Text>
            </div>
            <Fluent.ScrollablePane styles={{ root: { marginTop: 80 } }}>
              <Fluent.List
                items={filteredItems}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell}
              />
            </Fluent.ScrollablePane>
          </Fluent.DialogContent>
          <Fluent.DialogFooter>
            <Fluent.DefaultButton text='Cancel' onClick={cancelDialog} />
            <Fluent.PrimaryButton text='Select' onClick={submit} />
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      </>
    )
  }

export const XDropdown = ({ model: m }: { model: Dropdown }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { wave.args[m.name] = m.values ? (m.values || []) : (m.value || null) }, [])

  return (m.choices?.length || 0) > 100 ? <DialogDropdown {...m} /> : <BaseDropdown {...m} />
}