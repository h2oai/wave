import * as Fluent from '@fluentui/react'
import { B, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas, cssVar, pc } from './theme'

const
  BUTTON_HEIGHT = 24,
  BUTTON_WIDTH = 34,
  CORNER_OFFSET = 4

const
  css = stylesheet({
    animate: {
      opacity: 0,
      transition: 'opacity .5s'
    },
    visible: {
      opacity: 1,
    },
    btn: {
      minWidth: 'initial',
      position: 'fixed',
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
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
}

type CopyButton = { value: S, anchorElement: HTMLElement | undefined, showOnHoverOnly?: B }

export const ClipboardCopyButton = ({ value, anchorElement, showOnHoverOnly = false }: CopyButton) => {
  const
    timeoutRef = React.useRef<U>(),
    [copied, setCopied] = React.useState(false),
    [visible, setVisible] = React.useState(!showOnHoverOnly),
    [position, setPosition] = React.useState({ x: 0, y: 0 }),
    onClick = async () => {
      if (!anchorElement) return
      try {
        if (document.queryCommandSupported('copy')) {
          anchorElement.select()
          document.execCommand('copy')
          window.getSelection()?.removeAllRanges()
        }
      } catch (error) {
        await window.navigator.clipboard.writeText(value)
      }

      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
    }

  React.useEffect(() => {
    if (anchorElement) {
      const rect = anchorElement.getBoundingClientRect()
      setPosition({ x: rect.left + rect.width, y: rect.top })
      anchorElement.addEventListener('mouseenter', () => setVisible(true))
      anchorElement.addEventListener('mouseleave', (ev: MouseEvent) => {
        if ((ev.relatedTarget as HTMLElement)?.id === 'copybutton') return
        setVisible(false)
      })
    }
  }, [anchorElement])

  React.useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (<Fluent.PrimaryButton
    id='copybutton'
    title='Copy to clipboard'
    onClick={onClick}
    iconProps={{ iconName: copied ? 'CheckMark' : 'Copy' }}
    style={{ left: position.x - BUTTON_WIDTH - CORNER_OFFSET, top: position.y + CORNER_OFFSET }}
    className={clas(css.btn, copied ? css.copiedBtn : '', showOnHoverOnly ? css.animate : '', visible ? css.visible : '')}
  />)
}

export const XCopyableText = ({ model }: { model: CopyableText }) => {
  const
    { name, multiline, label, value, height } = model,
    heightStyle = multiline && height === '1' ? fullHeightStyle : undefined,
    [inputEl, setInputEl] = React.useState(),
    domRef = React.useCallback(node => {
      const inputEl = node?.children[0]?.children[1]?.children[0]
      if (inputEl) setInputEl(inputEl)
    }, [])

  return (
    <>
      <Fluent.TextField
        data-test={name}
        // Temporary solution which will be replaced with ref once TextField is converted to a function component.
        elementRef={domRef}
        value={value}
        multiline={multiline}
        label={label}
        styles={{
          root: {
            ...heightStyle,
            textFieldRoot: { position: 'relative', width: pc(100) },
          },
          wrapper: heightStyle,
          fieldGroup: heightStyle || { minHeight: height },
          field: { ...heightStyle, height, resize: multiline ? 'vertical' : 'none', },
        }}
        readOnly
      />
      <ClipboardCopyButton
        anchorElement={inputEl}
        showOnHoverOnly={!!multiline}
        value={value}
      />
    </>
  )
}