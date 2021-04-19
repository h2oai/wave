import * as Fluent from '@fluentui/react'
import React from 'react'
import { bond, S, B, U, box } from './qd'

/**
 * Create a copy to clipboard component.
 * Use this component when you want to enable your users to quickly copy paste sections of text.
*/
export interface Clipboard {
  /** Text to be displayed inside the clipboard. */
  value: S
  /** The text displayed above the clipboard. */
  label: S
  /** An identifying name for this component. */
  name?: S
  /** True if the clipboard should allow multi-line text entry. */
  multiline?: B
}

export const XClipboard = bond(({ model }: { model: Clipboard }) => {
  let copyTimeoutRef: U
  const
    ref = React.createRef<Fluent.ITextField>(),
    copiedB = box(false),
    onClick = () => {
      const el = ref.current
      if (!el) return

      el.select()
      document.execCommand('copy')
      window.getSelection()?.removeAllRanges()
      copiedB(true)

      copyTimeoutRef = window.setTimeout(() => copiedB(false), 5000)
    },
    dispose = () => window.clearTimeout(copyTimeoutRef),
    render = () => (
      <div data-test={model.name}>
        <Fluent.TextField
          componentRef={ref}
          multiline={model.multiline}
          label={model.label}
          defaultValue={model.value}
          readOnly
          styles={{ root: { paddingBottom: 10 } }}
        />
        {
          copiedB()
            ? <Fluent.PrimaryButton text='Copied' iconProps={{ iconName: 'CheckMark' }} />
            : <Fluent.PrimaryButton onClick={onClick} text='Copy to clipboard' iconProps={{ iconName: 'Copy' }} />
        }
      </div>
    )

  return { render, copiedB, dispose }
})