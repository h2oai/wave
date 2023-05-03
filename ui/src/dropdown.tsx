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
  /** Whether to present the choices using a pop-up dialog. By default pops up a dialog only for more than 100 choices. Defaults to 'auto'. */
  popup?: 'auto' | 'always' | 'never'
}

type DropdownItem = {
  name: S
  text: S
  idx: U
  checked: B
  show: B,
  disabled: B
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
  BaseDropdown = ({ model: m }: { model: Dropdown }) => {
    const
      { name, label, required, disabled, values, choices, trigger, placeholder } = m,
      isMultivalued = !!values,
      selection = React.useMemo(() => isMultivalued ? new Set<S>(values) : null, [isMultivalued, values]),
      [singleValue, setSingleValue] = React.useState(m.value),
      [multiValues, setMultiValues] = React.useState(values),
      options = (choices || []).map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label || name, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const optionKey = option.key as S
          if (isMultivalued && selection !== null) {
            option.selected ? selection.add(optionKey) : selection.delete(optionKey)

            const selectedOpts = Array.from(selection)
            wave.args[name] = selectedOpts
            setMultiValues(selectedOpts)
          } else {
            setSingleValue(optionKey)
            wave.args[name] = optionKey
            m.value = optionKey
          }
        }

        // HACK: Push clears args so run it after useEffect sets them due to model.value change.
        if (trigger) setTimeout(() => wave.push(), 0)
      },
      selectAll = () => {
        if (!selection) return

        selection.clear()
        options.forEach(o => { if (!o.disabled) selection.add(o.key as S) })

        const selectionArr = Array.from(selection)
        setMultiValues(selectionArr)
        wave.args[name] = selectionArr

        onChange()
      },
      deselectAll = () => {
        if (!selection) return

        selection.clear()
        setMultiValues([])
        wave.args[name] = []

        onChange()
      }

    React.useEffect(() => {
      if (!isMultivalued) return
      setMultiValues(values || [])
      wave.args[name] = values ?? null
    }, [name, values, isMultivalued])

    React.useEffect(() => {
      if (isMultivalued) return
      setSingleValue(m.value || '')
      wave.args[name] = m.value ?? null
    }, [name, m.value, isMultivalued])

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
          selectedKey={!isMultivalued ? singleValue : undefined}
          selectedKeys={isMultivalued ? multiValues : undefined}
          onChange={onChange}
        />
        {
          isMultivalued &&
          <div>
            <Fluent.Text variant='small'>
              <Fluent.Link disabled={disabled} onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link disabled={disabled} onClick={deselectAll}>Deselect All</Fluent.Link>
            </Fluent.Text>
          </div>
        }
      </>
    )
  },
  ROW_HEIGHT = 44,
  PAGE_SIZE = 40,
  getPageSpecification = () => ({ itemCount: PAGE_SIZE, height: ROW_HEIGHT * PAGE_SIZE } as Fluent.IPageSpecification),
  useItems = (choices: Choice[], v?: S | S[]) => {
    const
      [items, setItems] = React.useState<DropdownItem[]>(choices.map(({ name, label, disabled = false }, idx) =>
        ({ name, text: label || name, idx, checked: Array.isArray(v) ? v.includes(name) : v === name, show: true, disabled }))),
      onSearchChange = (_e?: React.ChangeEvent<HTMLInputElement>, newVal = '') => setItems(items => items.map(i => ({ ...i, show: fuzzysearch(i.text, newVal) })))

    return [items, setItems, onSearchChange] as const
  },
  onRenderCell = (onChecked: any) => (item?: DropdownItem) => item
    ? <Fluent.Checkbox
      label={item.text}
      styles={{
        root: { minHeight: ROW_HEIGHT, alignItems: 'center' },
        label: { width: pc(100), padding: 12, wordBreak: 'break-word' },
        checkmark: { display: 'flex' }
      }}
      onChange={onChecked(item.name)}
      className={item.checked ? css.dialogCheckedRow : ''}
      disabled={item.disabled}
      checked={item.checked} />
    : null,

  DialogDropdownSingle = ({ model }: { model: Dropdown }) => {
    const
      { name, choices = [], disabled, required, trigger, placeholder, label } = model,
      [isDialogHidden, setIsDialogHidden] = React.useState(true),
      [items, setItems, onSearchChange] = useItems(choices, model.value),
      toggleDialog = () => setIsDialogHidden(v => !v),
      onChecked = (itemName: S) => (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked = false) => {
        setItems(items => items.map(item => (({ ...item, checked: item.name === itemName ? checked : false, show: true }))))
        wave.args[name] = itemName
        model.value = itemName
        // HACK: Push clears args so run it after useEffect sets them due to model.value change.
        if (trigger) setTimeout(() => wave.push(), 0)
        toggleDialog()
      }

    React.useEffect(() => {
      if (model.value !== undefined) {
        wave.args[name] = model.value ?? null
        setItems(items => items.map(i => ({ ...i, checked: model.value === i.name })))
      }
    }, [name, model.value, setItems])

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
          value={items.find(i => i.checked)?.text ?? ''} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: label, type: Fluent.DialogType.close }} onDismiss={toggleDialog} minWidth={600} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: '65vh' }, header: { height: 0 } }}>
            <Fluent.Label>Search</Fluent.Label>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} autoFocus />
            <Fluent.ScrollablePane styles={{ root: { marginTop: 100, boxShadow: `0px 3px 7px ${cssVar('$text3')}` } }}>
              <Fluent.List
                items={items.filter(i => i.show)}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell(onChecked)}
              />
            </Fluent.ScrollablePane>
          </Fluent.DialogContent>
        </Fluent.Dialog>
      </>
    )
  },
  DialogDropdownMulti = ({ model }: { model: Dropdown }) => {
    const
      { name, choices = [], values = [], disabled, required, trigger, placeholder, label } = model,
      [isDialogHidden, setIsDialogHidden] = React.useState(true),
      [items, setItems, onSearchChange] = useItems(choices, values),
      itemsOnDialogOpen = React.useRef(items),
      openDialog = () => {
        setIsDialogHidden(false)
        itemsOnDialogOpen.current = items
      },
      closeDialog = () => {
        setItems(items => items.map(i => ({ ...i, show: true })))
        setIsDialogHidden(true)
      },
      cancelDialog = () => {
        setItems(itemsOnDialogOpen.current)
        closeDialog()
      },
      submit = (items: DropdownItem[]) => {
        wave.args[name] = items.filter(i => i.checked).map(i => i.name)
        // HACK: Push clears args so run it after useEffect sets them due to model.values change.
        if (trigger) setTimeout(() => wave.push(), 0)
        closeDialog()
      },
      onChecked = (name: S) => (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked = false) => {
        setItems(items => items.map(i => ({ ...i, checked: name === i.name ? checked : i.checked })))
      },
      selectAll = (checked = true) => () => {
        setItems(items => items.map(i => ({ ...i, checked: i.show ? checked : i.checked })))
      }

    React.useEffect(() => {
      if (values) {
        wave.args[name] = values
        setItems(items => items.map(i => ({ ...i, checked: values.includes(i.name) })))
      }
    }, [name, values, setItems])

    return (
      <>
        <Fluent.TextField
          data-test={name}
          iconProps={{ iconName: 'ChevronDown' }}
          readOnly
          onClick={openDialog}
          label={label}
          disabled={disabled}
          required={required}
          styles={{ field: { cursor: 'pointer' }, icon: { fontSize: 12, color: cssVar('$neutralSecondary') } }}
          placeholder={placeholder}
          value={items.filter(i => i.checked).map(i => i.text).join(', ')} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: label, type: Fluent.DialogType.close }} onDismiss={cancelDialog} minWidth={600} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: '65vh' }, header: { height: 0 } }}>
            <Fluent.Label>Search</Fluent.Label>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} autoFocus />
            <div className={clas('wave-s14', css.dialogControls)}>
              <span className='wave-w5'>Selected: {items.filter(i => i.checked).length}</span>
              <div><Fluent.Link onClick={selectAll()}>Select All</Fluent.Link> | <Fluent.Link onClick={selectAll(false)}>Deselect All</Fluent.Link></div>
            </div>
            <Fluent.ScrollablePane styles={{ root: { marginTop: 100, boxShadow: `0px 3px 7px ${cssVar('$text3')}` } }}>
              <Fluent.List
                items={items.filter(i => i.show)}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell(onChecked)}
              />
            </Fluent.ScrollablePane>
          </Fluent.DialogContent>
          <Fluent.DialogFooter>
            <Fluent.DefaultButton text='Cancel' onClick={cancelDialog} />
            <Fluent.PrimaryButton text='Select' onClick={() => submit(items)} />
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      </>
    )
  },
  DialogDropdown = ({ model }: { model: Dropdown }) => model.values ? <DialogDropdownMulti model={model} /> : <DialogDropdownSingle model={model} />

export const XDropdown = ({ model: m }: { model: Dropdown }) =>
  m.popup === 'always'
    ? <DialogDropdown model={m} />
    : m.popup === 'never'
      ? <BaseDropdown model={m} />
      : (m.choices?.length || 0) > 100
        ? <DialogDropdown model={m} />
        : <BaseDropdown model={m} />