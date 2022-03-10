import * as Fluent from '@fluentui/react'
import { B, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, pc } from './theme'

const css = stylesheet({
  multiContainer: {
    position: 'relative',
    $nest: {
      '&:hover > button': {
        opacity: 1
      }
    }
  },
  compactContainer: {
    position: 'relative',
  },
  btnMultiline: {
    opacity: 0,
    transition: 'opacity .5s'
  },
  btn: {
    minWidth: 'initial',
    position: 'absolute',
    top: 31,
    right: 4,
    width: 24,
    height: 24
  },
  copiedBtn: {
    background: cssVar('$green'),
    $nest: {
      '&:hover': {
        background: cssVar('$green'),
      }
    }
  }
})

/**
 * Create a copyable text component.
 * Use this component when you want to enable your users to quickly copy paste sections of text.
*/
export interface CopyableText {
  /** Text to be displayed inside the component. */
  value: S
  /** The text displayed above the textbox. */
  label: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should allow multi-line text entry. */
  multiline?: B
}

export const XCopyableText = ({ model }: { model: CopyableText }) => {
  const
    { name, multiline, label, value } = model,
    ref = React.useRef<Fluent.ITextField>(null),
    timeoutRef = React.useRef<U>(),
    [copied, setCopied] = React.useState(false),
    onClick = async () => {
      const el = ref.current
      if (!el) return
      try {
        if (document.queryCommandSupported('copy')) {
          el.select()
          document.execCommand('copy')
          window.getSelection()?.removeAllRanges()
        }
      } catch (error) {
        await window.navigator.clipboard.writeText(value)
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    }

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (
    <div data-test={name} className={multiline ? css.multiContainer : css.compactContainer}>
      <Fluent.TextField componentRef={ref} value={value} label={label} multiline={multiline} styles={{ root: { width: pc(100) } }} readOnly />
      <Fluent.PrimaryButton
        title='Copy to clipboard'
        onClick={onClick}
        iconProps={{ iconName: copied ? 'CheckMark' : 'Copy' }}
        className={clas(css.btn, copied ? css.copiedBtn : '', multiline ? css.btnMultiline : '')}
      />
    </div>
  )
}