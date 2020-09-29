import * as Fluent from '@fluentui/react'
import React from 'react'
import { bond, S, U, B, qd, box } from './qd'
import { Choice } from './choice_group'

/**
 * Create a picker.
 * Pickers are used to select one or more choices, such as tags or files, from a list.
 * Use a picker to allow the user to quickly search for or manage a few tags or files.
*/
export interface Picker {
  /** An identifying name for this component. */
  name: S;
  /** The choices to be presented. */
  choices: Choice[];
  /** Text to be displayed above the component. */
  label?: S;
  /** The names of the selected choices. */
  values?: S[];
  /** Maximum number of selectable choices. Defaults to no limit. */
  max_choices?: U;
  /** Controls whether the picker should be disabled or not. */
  disabled?: B;
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S;
}

const pickerSuggestionsProps: Fluent.IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggestions',
  noResultsFoundText: 'No results found',
}

export const XPicker = bond(({ model: m }: { model: Picker }) => {
  const
    tags: Fluent.ITag[] = m.choices.map(({ name, label }) => ({ key: name, name: label || name })),
    selectedTagsB = box<Fluent.ITag[]>(
      m.choices
        .filter(({ name }) => m.values?.includes(name))
        .map(({ name, label }) => ({ key: name, name: label || name }))
    ),
    filterSuggestedTags = (filterText: string, selectedTags?: Fluent.ITag[]) => {
      if (!filterText) return []
      const isAlreadySelected = (t: Fluent.ITag) => selectedTags && selectedTags.includes(t)
      const isStringMatch = (name: string) => name.toLowerCase().includes(filterText.toLowerCase())
      return tags.filter(t => isStringMatch(t.name) && !isAlreadySelected(t))
    },
    onChange = (items?: Fluent.ITag[]) => {
      selectedTagsB(items || [])
      qd.args[m.name] = items ? items.map(({ key }) => key) : null
    },
    init = () => qd.args[m.name] = m.values || null,
    render = () => (
      <div>
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
        />
      </div>
    )

  return { init, render, selectedTagsB }
})