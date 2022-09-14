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
import { stylesheet } from 'typestyle'
import { Choice } from './choice_group'
import { fuzzysearch } from './parts/utils'
import { clas, cssVar, pc, px } from './theme'
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
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** Whether to present the choices using a pop-up dialog. Defaults to `auto`, which pops up a dialog only when there are more than 100 choices. */
  popup?: 'auto' | 'always' | 'never'
}

type DropdownItem = {
  name: S
  text: S
  idx: U
  checked: B
}

const
  css = stylesheet({
    dialogCheckedRow: {
      background: cssVar('$neutralLight')
    },
    dialogControls: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 16
    }
  }),
  BaseDropdown = ({ model: m}: { model: Dropdown}) => {
  const
      { name, label, required, disabled, choices, trigger, placeholder } = m,
      isMultivalued = !!m.values,
      [stateValue, setStateValue] = React.useState(m.value ?? null),
      selection = React.useMemo(() => isMultivalued ? new Set<S>(m.values) : null, [isMultivalued, m.values]),
      [selectedOptions, setSelectedOptions] = React.useState(Array.from(selection || [])),
      options = (choices || []).map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label || name, disabled })),
      previousValues = React.useRef<S[] | undefined>(),
      skipUseEffect = React.useRef(false),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const optionKey = option.key as S
          if (isMultivalued && selection !== null) {
            option.selected ? selection.add(optionKey) : selection.delete(optionKey)

            const selectedOpts = Array.from(selection)
            previousValues.current = selectedOpts
            wave.args[name] = selectedOpts
            setSelectedOptions(selectedOpts)
          } else {
            setStateValue(optionKey)
            // HACK: The useEffect is only triggered if the above setter sets a different value and "m.value" changed.
            // The next line does two things: 
            // 1. Skip the useEffect so that it doesn't set wave args to same value if trigger is provided
            // 2. m.value !== optionKey prevents the bug where user selects the same value twice and then the wave app tries to change the "value" prop
            // e.g. choices = ['a', 'b', 'c'], selects 'c', selects 'c', wave app changes "value" to 'b'
            skipUseEffect.current = m.value !== optionKey
            m.value = optionKey
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
        previousValues.current = selectionArr
        wave.args[name] = selectionArr

        if (trigger) wave.push()
      },
      deselectAll = () => {
        if (!selection) return

        selection.clear()
        setSelectedOptions([])
        previousValues.current = []
        wave.args[name] = []

        if (trigger) wave.push()
      }

    React.useEffect(() => {
      if (!isMultivalued && !skipUseEffect.current) {
        setStateValue(m.value ?? null)
        wave.args[name] = m.value ?? null
      }
      skipUseEffect.current = false
    }, [m.value, isMultivalued, name])

    // Since "m.values" is an array, every time it's set from Wave App we create a new array reference and the useEffect bellow is triggered.
    // Because of that we don't have to use the hack where "m.values" is set in "onChange" like we do for "m.value".
    React.useEffect(() => {
      if (isMultivalued ) {
        setSelectedOptions(Array.from(m.values || []))
        const isDifferent = previousValues.current?.toString() !== m.values?.toString()
        if (isDifferent) wave.args[name] = m.values ?? []
        previousValues.current = m.values
      }
    }, [m.values, isMultivalued, name])

    return (
      <>
        <Fluent.Dropdown
          data-test={name}
          styles={{ caretDownWrapper: { lineHeight: px(26) } }} // Remove unwanted overflow.
          label={label}
          placeholder={placeholder}
          options={options}
          required={required}
          disabled={disabled}
          multiSelect={isMultivalued || undefined}
          selectedKey={!isMultivalued ? stateValue : undefined}
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
  ROW_HEIGHT = 44,
  PAGE_SIZE = 40,
  DialogDropdown = ({ model: m}: { model: Dropdown}) => {
    const
      { name, choices = [], disabled, required, trigger, placeholder, label } = m,
      isMultivalued = !!m.values,
      [isDialogHidden, setIsDialogHidden] = React.useState(true),
      [searchValue, setSearchValue] = React.useState(''),
      selectedMap = React.useMemo<Map<S, B>>(() => {
        if (m.values?.length) return new Map(m.values.map(v => [v, true]))
        if (m.value) return new Map([[m.value, true]])
        return new Map()
      }, [m.value, m.values]),
      [items, setItems] = React.useState<DropdownItem[]>(choices.map(({ name, label }, idx) => ({ name, text: label || name, idx, checked: selectedMap.has(name) })) || []),
      [filteredItems, setFilteredItems] = React.useState(items),
      previousValues = React.useRef<S[] | undefined>(),
      [textValue, setTextValue] = React.useState(() => {
        if (!m.values?.length && !m.value) return

        const itemsMap = new Map<S, S>(items.map(({ name, text }) => [name, text]))

        if (m.values?.length) return m.values.map(v => itemsMap.get(v) || '').filter(Boolean).join(', ')
        if (m.value) return itemsMap.get(m.value)
      }),
      toggleDialog = React.useCallback(() => setIsDialogHidden(!isDialogHidden), [isDialogHidden]),
      cancelDialog = React.useCallback(() => {
        toggleDialog()
        setItems(items => items.map(i => ({ ...i, checked: selectedMap.has(i.name) })))
        setSearchValue('')
      }, [selectedMap, toggleDialog]),
      skipUseEffect = React.useRef(false),
      submit = React.useCallback((checkedItem?: DropdownItem) => {
        const result = checkedItem ? [checkedItem] : items.filter(({ checked }) => checked)
        wave.args[name] = result.length === 1 ? isMultivalued ? [result[0].name] : result[0].name : result.map(({ name }) => name)

        if (!isMultivalued) {
          m.value = result[0].name
          skipUseEffect.current = true
        }
        if (trigger) wave.push()
        setTextValue(result.length ? result.map(({ text }) => text).join(', ') : '')
        selectedMap.clear()
        result.forEach(({ name }) => selectedMap.set(name, true))
        cancelDialog()
      }, [cancelDialog, selectedMap, items, name, trigger, m, isMultivalued]),
      selectAll = (checked = true) => () => {
          setItems(items => {
            const newItems = items.map(i => ({
              ...i,
              // In order to select only the filtered values we could use "filteredItems.map(f => f.name).includes(i.name)" but that would be O(n^2)
              checked: fuzzysearch(i.text, searchValue) ? checked : i.checked
            }))
            previousValues.current = newItems.filter(i => i.checked).map(i => i.name)
            return newItems
          })
      },
      onSearchChange = (_e?: React.ChangeEvent<HTMLInputElement>, newVal = '') => setSearchValue(newVal),
      onChecked = React.useCallback((idx: U) => (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked = false) => {
        items[idx].checked = checked

        previousValues.current = items.filter(i => i.checked).map(i => i.name)

        isMultivalued
          ? setItems(items => items.map(i => ({ ...i, checked: items[idx].name === i.name ? checked : i.checked}) ))
          : submit(items[idx])
      }, [isMultivalued, items, submit]),
      onRenderCell = React.useCallback((item?: DropdownItem) => item
        ? <Fluent.Checkbox
          label={item.text}
          styles={{
            root: { minHeight: ROW_HEIGHT, alignItems: 'center' },
            label: { width: pc(100), padding: 12, wordBreak: 'break-word' },
            checkmark: { display: 'flex' }
          }}
          onChange={onChecked(item.idx)}
          className={item.checked ? css.dialogCheckedRow : ''}
          checked={item.checked} />
        : null, [onChecked]),
      getPageSpecification = React.useCallback(() => ({ itemCount: PAGE_SIZE, height: ROW_HEIGHT * PAGE_SIZE, } as Fluent.IPageSpecification), [])

    React.useEffect(() => {
      if (!isMultivalued && !skipUseEffect.current) {
        setTextValue(new Map<S, S>(items.map(({ name, text }) => [name, text])).get(m.value || ''))
        setItems(items => items.map(i => ({ ...i, checked: i.name === m.value })))
        wave.args[name] = m.value ?? null
      }
      skipUseEffect.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, m.value])

    React.useEffect(() => {
      if (!isMultivalued) return

      setItems(items => {
        const newItems = items.map(i => ({ ...i, checked: m.values?.includes(i.name) ?? false }))
        setTextValue(newItems.filter(i => i.checked).map(i => i.text).join(', '))
        return newItems
      })
      const isDifferent = previousValues.current?.toString() !== m.values?.toString()
      if (isDifferent) wave.args[name] = m.values ?? []
      previousValues.current = m.values
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, m.values])

    // sync filtered items
    React.useEffect(() => {
      setFilteredItems(searchValue ? items.filter(({ text }) => fuzzysearch(text, searchValue)) : items)
    }, [items, searchValue])

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
          styles={{ field: { cursor: 'pointer' }, icon: { fontSize: 12, color: cssVar('$neutralSecondary') } }}
          placeholder={placeholder}
          value={textValue || ''} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: label, type: Fluent.DialogType.close }} onDismiss={cancelDialog} minWidth={600} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: '65vh' }, header: { height: 0 } }}>
            <Fluent.Label>Search</Fluent.Label>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} autoFocus />
            {
              isMultivalued && (
                <div className={clas('wave-s14', css.dialogControls)}>
                  <span className='wave-w5'>Selected: {items.filter(({ checked }) => checked).length}</span>
                  <div><Fluent.Link onClick={selectAll()}>Select All</Fluent.Link> | <Fluent.Link onClick={selectAll(false)}>Deselect All</Fluent.Link></div>
                </div>
              )
            }
            <Fluent.ScrollablePane styles={{ root: { marginTop: 100, boxShadow: `0px 3px 7px ${cssVar('$text3')}` } }}>
              <Fluent.List
                items={filteredItems}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell}
              />
            </Fluent.ScrollablePane>
          </Fluent.DialogContent>
          {
            isMultivalued && (
              <Fluent.DialogFooter>
                <Fluent.DefaultButton text='Cancel' onClick={cancelDialog} />
                <Fluent.PrimaryButton text='Select' onClick={() => submit()} />
              </Fluent.DialogFooter>
            )
          }
        </Fluent.Dialog>
      </>
    )
  }

export const XDropdown = ({ model: m }: { model: Dropdown }) => {
  return m.popup === 'always'
    ? <DialogDropdown model={m} />
    : m.popup === 'never'
      ? <BaseDropdown model={m} />
      : (m.choices?.length || 0) > 100
        ? <DialogDropdown model={m} />
        : <BaseDropdown model={m} />
}