import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, S, U, B, qd } from './qd';

/**
 * A single option for picker.
 */
interface PickerOption {
  /** An identifying name for this item. */
  name: S
  /** Text to be displayed. */
  label?: S
}

/**
 * Create a picker.
 * Use this for multi-select scenarios in which a user chooses one or more items from a dynamic dropdown
 * that is updated to match user's typing.
*/
export interface Picker {
  /** An identifying name for this component. */
  name: S
  /** The choices to be presented. */
  items: PickerOption[]
  /** Text to be displayed above the component. */
  label?: S
  /** The names of the selected choices. */
  values?: S[]
  /** Max number of picked suggestions. */
  item_limit?: U
  /** Controls whether the picker should be disabled or not. */
  disabled?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const pickerSuggestionsProps: Fluent.IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggestions',
  noResultsFoundText: 'No results found',
};

export const XPicker = bond(({ model: m }: { model: Picker }) => {
  const
    tags: Fluent.ITag[] = m.items.map(({ name, label }) => ({ key: name, name: label || name })),
    initialSelectedTags = m.values?.map(val => ({ key: val, name: val })),
    filterSuggestedTags = (filterText: string, selectedTags?: Fluent.ITag[]) => {
      if (!filterText) return []
      const isAlreadySelected = (t: Fluent.ITag) => selectedTags && selectedTags.includes(t)
      const isStringMatch = (name: string) => name.toLowerCase().includes(filterText.toLowerCase())
      return tags.filter(t => isStringMatch(t.name) && !isAlreadySelected(t))
    },
    onChange = (items?: Fluent.ITag[]) => qd.args[m.name] = items ? items.map(({ key }) => key) : null,
    init = () => qd.args[m.name] = m.values || null,
    render = () => (
      <>
        {m.label && <Fluent.Text>{m.label}</Fluent.Text>}
        <Fluent.TagPicker
          removeButtonAriaLabel="Remove"
          onResolveSuggestions={filterSuggestedTags}
          onChange={onChange}
          pickerSuggestionsProps={pickerSuggestionsProps}
          itemLimit={m.item_limit}
          selectedItems={initialSelectedTags}
          disabled={m.disabled}
        />
      </>
    )

  return { init, render }
})