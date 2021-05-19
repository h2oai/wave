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
import { B, box, Id, S, U } from 'h2o-wave'
import React from 'react'
import { Choice } from './choice_group'
import { displayMixin } from './theme'
import { bond, wave } from './ui'

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
  /** Maximum number of selectable choices. Defaults to no limit. */
  max_choices?: U
  /** Controls whether the picker should be disabled or not. */
  disabled?: B
  /** True if the component should be visible. Defaults to true. */
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

export const XPicker = bond(({ model: m }: { model: Picker }) => {
  const
    tags: Fluent.ITag[] = m.choices.map(({ name, label }) => ({ key: name, name: label || name })),
    selectedTagsB = box<Fluent.ITag[]>(tags.filter(({ key }) => m.values?.includes(key as S))),
    filterSuggestedTags = (filterText: S, selectedTags?: Fluent.ITag[]) => {
      if (!filterText) return []
      const isAlreadySelected = (t: Fluent.ITag) => selectedTags && selectedTags.includes(t)
      const isStringMatch = (name: S) => name.toLowerCase().includes(filterText.toLowerCase())
      return tags.filter(t => isStringMatch(t.name) && !isAlreadySelected(t))
    },
    onChange = (items?: Fluent.ITag[]) => {
      selectedTagsB(items || [])
      wave.args[m.name] = items ? items.map(({ key }) => key) : null
      if (m.trigger) wave.push()
    },
    onEmptyResolveSuggestions = () => tags,
    init = () => wave.args[m.name] = m.values || null,
    render = () => (
      <div style={displayMixin(m.visible)}>
        {m.label && <Fluent.Text>{m.label}</Fluent.Text>}
        <Fluent.TagPicker
          inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          removeButtonAriaLabel="Remove"
          onResolveSuggestions={filterSuggestedTags}
          onChange={onChange}
          pickerSuggestionsProps={pickerSuggestionsProps}
          itemLimit={m.max_choices}
          selectedItems={selectedTagsB()}
          disabled={m.disabled}
          onEmptyResolveSuggestions={onEmptyResolveSuggestions}
        />
      </div>
    )

  return { init, render, selectedTagsB }
})