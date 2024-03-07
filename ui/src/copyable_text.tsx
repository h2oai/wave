import * as Fluent from '@fluentui/react'
import { B, S, U } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, pc } from './theme'

const
  css = stylesheet({
    btn: {
      position: 'absolute',
      minWidth: 'initial',
      width: 24,
      height: 24,
      right: 0,
      transform: 'translate(-4px, 4px)',
      outlineWidth: 1,
      outlineStyle: 'solid',
      outlineColor: cssVar('$text'),
      zIndex: 1,
    },
    copiedBtn: {
      background: cssVar('$green'),
      $nest: {
        '&:hover': {
          background: cssVar('$green'),
        }
      }
    },
    labelContainer: {
      position: 'relative'
    }
  }),
  fullHeightStyle = {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  }

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
  /** Custom height in px (e.g. '200px') or '1' to fill the remaining card space. Requires `multiline` to be set. */
  height?: S
  /** The width of the copyable text , e.g. '100px'. */
  width?: S
}

export const ClipboardCopyButton = ({ value }: { value: S }) => {
  const
    timeoutRef = React.useRef<U>(),
    [copied, setCopied] = React.useState(false),
    onClick = React.useCallback(async () => {
      try {
        if (document.queryCommandSupported('copy')) {
          const el = document.createElement('textarea')
          el.value = value
          document.body.appendChild(el)
          el.select()
          document.execCommand('copy')
          document.body.removeChild(el)
        }
      } catch (error) {
        await window.navigator.clipboard.writeText(value)
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    }, [value])

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (
    <Fluent.PrimaryButton
      title='Copy to clipboard'
      onClick={onClick}
      iconProps={{
        iconName: copied ? 'CheckMark' : 'Copy',
        styles: { root: { marginTop: -1.35 } } // Nudge up the icon a bit to account for incorrect Fluent crop.
      }}
      className={clas(css.btn, copied ? css.copiedBtn : '')}
    />
  )
}

export const XCopyableText = ({ model }: { model: CopyableText }) => {
  const
    { name, multiline, label, value, height } = model,
    heightStyle = multiline && height === '1' ? fullHeightStyle : undefined

  return (
    <Fluent.TextField
      data-test={name}
      value={value}
      multiline={multiline}
      onRenderLabel={() =>
        <div className={css.labelContainer}>
          <Fluent.Label>{label}</Fluent.Label>
          <ClipboardCopyButton value={value} />
        </div>
      }
      styles={{
        root: {
          ...heightStyle,
          textFieldRoot: { position: 'relative', width: pc(100) },
          textFieldMultiline: multiline ? { '& button': { visibility: 'hidden' }, '&:hover button': { visibility: 'visible' } } : undefined
        },
        wrapper: heightStyle,
        fieldGroup: heightStyle || { minHeight: height },
        field: { ...heightStyle, height, resize: multiline ? 'vertical' : 'none', },
      }}
      readOnly
    />
  )
}