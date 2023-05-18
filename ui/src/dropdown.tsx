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
  selected: B
  show: B,
  disabled: B
}

const
  css = stylesheet({
    dialogSelectedRow: {
      background: cssVar('$neutralLight')
    },
    dialogControls: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 16
    }
  }),
  choicesToDropdownItems = (choices: Choice[], v?: S | S[]) => choices.map(({ name, label, disabled = false }, idx) =>
    ({ name, text: label || name, idx, selected: Array.isArray(v) ? v.includes(name) : v === name, show: true, disabled })),
  useItems = (choices: Choice[], v?: S | S[]) => {
    const
      [items, setItems] = React.useState<DropdownItem[]>(choicesToDropdownItems(choices, v)),
      onSearchChange = (_e?: React.ChangeEvent<HTMLInputElement>, newVal = '') => setItems(items => items.map(i => ({ ...i, show: fuzzysearch(i.text, newVal) }))),
      onSelect = (name: S, select = false, isMultivalued = true) =>
        setItems(items => items.map(i => ({
          ...i,
          selected: isMultivalued ? name === i.name ? select : i.selected : name === i.name,
          show: isMultivalued ? i.show : true
        }))),
      selectAll = (select = true) => setItems(items =>
        items.map(i => ({ ...i, selected: i.show && !i.disabled ? select : i.selected }))
      )


    return [items, setItems, onSearchChange, onSelect, selectAll] as const
  },
  BaseDropdown = ({ model: m }: { model: Dropdown }) => {
    const
      { name, label, required, disabled, choices = [], trigger, placeholder } = m,
      isMultivalued = !!m.values,
      [items, setItems, , onSelect, selectAll] = useItems(choices, m.values || m.value),
      options = choices.map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label || name, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const optionKey = option.key as S
          onSelect(optionKey, option.selected, isMultivalued)
          if (!isMultivalued) m.value = optionKey
        }
        // HACK: Push clears args so run it after useEffect sets them due to model.value change.
        if (trigger) setTimeout(() => wave.push(), 0)
      },
      onSelectAll = (select = true) => () => {
        selectAll(select)
        onChange()
      },
      getSelectedKeys = () => items.filter(i => i.selected).map(i => i.name)

    React.useEffect(() => setItems(choicesToDropdownItems(choices, isMultivalued ? m.values : m.value)),
      [name, m.values, m.value, isMultivalued, setItems, choices])

    React.useEffect(() => {
      const nextValues = items.filter(i => i.selected).map(i => i.name)
      wave.args[name] = isMultivalued ? nextValues : nextValues[0] ?? (m.value === '' ? '' : null)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items])

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
          selectedKey={!isMultivalued ? getSelectedKeys()[0] ?? '' : undefined}
          selectedKeys={isMultivalued ? getSelectedKeys() : undefined}
          onChange={onChange}
        />
        {
          isMultivalued &&
          <div>
            <Fluent.Text variant='small'>
              <Fluent.Link disabled={disabled} onClick={onSelectAll()}>Select All</Fluent.Link> | <Fluent.Link disabled={disabled} onClick={onSelectAll(false)}>Deselect All</Fluent.Link>
            </Fluent.Text>
          </div>
        }
      </>
    )
  },
  ROW_HEIGHT = 44,
  PAGE_SIZE = 40,
  getPageSpecification = () => ({ itemCount: PAGE_SIZE, height: ROW_HEIGHT * PAGE_SIZE } as Fluent.IPageSpecification),
  onRenderCell = (onSelect: any) => (item?: DropdownItem) => item
    ? <Fluent.Checkbox
      label={item.text}
      styles={{
        root: { minHeight: ROW_HEIGHT, alignItems: 'center' },
        label: { width: pc(100), padding: 12, wordBreak: 'break-word' },
        checkmark: { display: 'flex' }
      }}
      onChange={(_ev, checked) => onSelect(item.name, checked)}
      className={item.selected ? css.dialogSelectedRow : ''}
      disabled={item.disabled}
      checked={item.selected} />
    : null,

  DialogDropdownSingle = ({ model }: { model: Dropdown }) => {
    const
      { name, choices = [], disabled, required, trigger, placeholder, label } = model,
      [isDialogHidden, setIsDialogHidden] = React.useState(true),
      [items, setItems, onSearchChange] = useItems(choices, model.value),
      toggleDialog = () => setIsDialogHidden(v => !v),
      onSelect = (itemName: S, select = false) => {
        setItems(items => items.map(item => (({ ...item, selected: item.name === itemName ? select : false, show: true }))))
        wave.args[name] = itemName
        model.value = itemName
        // HACK: Push clears args so run it after useEffect sets them due to model.value change.
        if (trigger) setTimeout(() => wave.push(), 0)
        toggleDialog()
      }

    React.useEffect(() => {
      if (model.value !== undefined) {
        wave.args[name] = model.value ?? null
        setItems(items => items.map(i => ({ ...i, selected: model.value === i.name })))
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
          value={items.find(i => i.selected)?.text ?? ''} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: label, type: Fluent.DialogType.close }} onDismiss={toggleDialog} minWidth={600} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: '65vh' }, header: { height: 0 } }}>
            <Fluent.Label>Search</Fluent.Label>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} autoFocus />
            <Fluent.ScrollablePane styles={{ root: { marginTop: 100, boxShadow: `0px 3px 7px ${cssVar('$text3')}` } }}>
              <Fluent.List
                items={items.filter(i => i.show)}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell(onSelect)}
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
      [items, setItems, onSearchChange, onSelect, selectAll] = useItems(choices, values),
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
        wave.args[name] = items.filter(i => i.selected).map(i => i.name)
        // HACK: Push clears args so run it after useEffect sets them due to model.values change.
        if (trigger) setTimeout(() => wave.push(), 0)
        closeDialog()
      }

    React.useEffect(() => {
      if (values) {
        wave.args[name] = values
        setItems(items => items.map(i => ({ ...i, selected: values.includes(i.name) })))
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
          value={items.filter(i => i.selected).map(i => i.text).join(', ')} />
        <Fluent.Dialog hidden={isDialogHidden} dialogContentProps={{ title: label, type: Fluent.DialogType.close }} onDismiss={cancelDialog} minWidth={600} maxWidth='90vw'>
          <Fluent.DialogContent styles={{ innerContent: { height: '65vh' }, header: { height: 0 } }}>
            <Fluent.Label>Search</Fluent.Label>
            <Fluent.SearchBox data-test={`${name}-search`} onChange={onSearchChange} autoFocus />
            <div className={clas('wave-s14', css.dialogControls)}>
              <span className='wave-w5'>Selected: {items.filter(i => i.selected).length}</span>
              <div><Fluent.Link onClick={() => selectAll()}>Select All</Fluent.Link> | <Fluent.Link onClick={() => selectAll(false)}>Deselect All</Fluent.Link></div>
            </div>
            <Fluent.ScrollablePane styles={{ root: { marginTop: 100, boxShadow: `0px 3px 7px ${cssVar('$text3')}` } }}>
              <Fluent.List
                items={items.filter(i => i.show)}
                getPageSpecification={getPageSpecification}
                renderedWindowsAhead={3}
                onRenderCell={onRenderCell(onSelect)}
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