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
import { B, Id, S, U } from './core'
import React from 'react'
import { Choice } from './choice_group'
import { wave } from './ui'

/**
 * Create a picker.
 * Pickers are used to select one or more choices, such as tags or files, from a list.
 * Use a picker to allow the user to quickly search for or manage a few tags or files.
*/
export interface Picker {
  /** An identifying name for this component. */
  name: Id
  /** The choices to be presented. */
  choices: Choice[]
  /** Text to be displayed above the component. */
  label?: S
  /** The names of the selected choices. */
  values?: S[]
  /** Maximum number of selectable choices. */
  max_choices?: U
  /** True if the picker is a required field. */
  required?: B
  /** Controls whether the picker should be disabled or not. */
  disabled?: B
  /** The width of the picker, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** True if the form should be submitted when the picker value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const pickerSuggestionsProps: Fluent.IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggestions',
  noResultsFoundText: 'No results found',
}

export const XPicker = ({ model: m }: { model: Picker }) => {
  const
    tags: Fluent.ITag[] = React.useMemo(() => m.choices.map(({ name, label }) => ({ key: name, name: label || name })), [m.choices]),
    [selectedTags, setSelectedTags] = React.useState<Fluent.ITag[]>(tags.filter(({ key }) => m.values?.includes(key as S))),
    filterSuggestedTags = (filterText: S, selectedTags?: Fluent.ITag[]) => {
      if (!filterText) return []
      const isStringMatch = (name: S) => name.toLowerCase().includes(filterText.toLowerCase())
      return tags.filter(t => isStringMatch(t.name) && !selectedTags?.includes(t))
    },
    onChange = (items?: Fluent.ITag[]) => {
      setSelectedTags(items || [])
      wave.args[m.name] = items ? items.map(({ key }) => key) : null
      if (m.trigger) wave.push()
    },
    onEmptyResolveSuggestions = () => tags.filter(tag => !selectedTags.includes(tag))

  React.useEffect(() => {
    wave.args[m.name] = m.values || null
    setSelectedTags(tags.filter(({ key }) => m.values?.includes(key as S)))
  }, [m.name, m.values, tags])

  return (
    <>
      {m.label && <Fluent.Label required={m.required}>{m.label}</Fluent.Label>}
      <Fluent.TagPicker
        inputProps={{ 'data-test': m.name } as Fluent.IInputProps}
        removeButtonIconProps={{ iconName: 'Cancel', 'data-test' : 'remove_' + m.name } as Fluent.IIconProps}
        removeButtonAriaLabel="Remove"
        onResolveSuggestions={filterSuggestedTags}
        onChange={onChange}
        pickerSuggestionsProps={pickerSuggestionsProps}
        itemLimit={m.max_choices}
        selectedItems={selectedTags}
        disabled={m.disabled}
        onEmptyResolveSuggestions={onEmptyResolveSuggestions}
      />
    </>
  )
}