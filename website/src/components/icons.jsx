import * as Icons from '@fluentui/react-icons-mdl2'
import React from 'react'
const
  Iconset = React.memo(({ filteredIcons }) => {
    const
      [copiedIconName, setCopiedIconName] = React.useState(''),
      timeoutRef = React.useRef(),
      handleCopyClick = async (iconName) => {
        try {
          'clipboard' in navigator ? await navigator.clipboard.writeText(iconName) : document.execCommand('copy', true, iconName)
          clearTimeout(timeoutRef.current)
          setCopiedIconName(iconName)
          timeoutRef.current = setTimeout(() => setCopiedIconName(''), 1000)
        } catch (err) {
          console.log('Error copying to clipboard:', err)
        }
      }
    React.useEffect(() => () => clearTimeout(timeoutRef.current), [])
    return filteredIcons.map(([iconName, iconElement]) => (
      <div key={iconName}>
        <div className='icons__box' onClick={() => handleCopyClick(iconName)}>
          {iconElement}
          <div className='icons__description'>
            {copiedIconName !== iconName
              ? <div className='icons__iconName'>{iconName}</div>
              : <div className='icons__copied'>Copied!</div>
            }
          </div>
        </div>
      </div>
    ))
  }),
  debounce = (timeout, f) => {
    let t = null
    return (...args) => {
      if (t) window.clearTimeout(t)
      t = window.setTimeout(() => { f(...args); t = null }, timeout)
    }
  },
  // HACK: Fix broken TextDocumentSettingsIcon size https://github.com/microsoft/fluentui/issues/21645.
  fixSvgSize = () => {
    document.querySelectorAll('.icons__iconSet svg').forEach(svg => {
      svg.setAttribute('width', '36px')
      svg.setAttribute('height', '36px')
    })
  },
  fuzzysearch = (haystack, needle) => {
    haystack = haystack.toLowerCase()
    needle = needle.toLowerCase()
    const
      hLen = haystack.length,
      nLen = needle.length

    outer: for (let i = 0, j = 0; i < nLen; i++) {
      const nch = needle.charCodeAt(i)
      while (j < hLen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer
        }
      }
      return false
    }
    return true
  }

export const IconsPage = () => {
  const
    icons = React.useMemo(() => Object.entries(Icons).reduce((acc, [iconName, iconComponent]) => {
      if ('displayName' in iconComponent) {
        acc.push([iconName.slice(0, -4), React.createElement(iconComponent, { style: { width: 36, height: 36 } })])
      }
      return acc
    }, []), []),
    [filteredIcons, setFilteredIcons] = React.useState(icons),
    debouncedFilter = debounce(500, e => {
      const val = e.target.value
      setFilteredIcons(!val ? icons : icons.filter(([iconName]) => fuzzysearch(iconName, val)))
      fixSvgSize()
    }),
    clear = () => {
      setFilteredIcons(icons)
      setInputValue('')
    },
    onChange = React.useCallback(e => {
      e.persist()
      setInputValue(e.target.value)
      debouncedFilter(e)
    }, []),
    [inputValue, setInputValue] = React.useState('')

  React.useLayoutEffect(() => fixSvgSize(), [])
  return (
    <>
      <div className='icons__searchBox'>
        <Icons.SearchIcon style={{ width: 20, height: 20 }} />
        <input className='icons__searchInput' type='text' value={inputValue} placeholder='Search icons' onChange={onChange} />
        {inputValue && <Icons.CancelIcon style={{ width: 18, height: 18, cursor: 'pointer' }} onClick={clear} />}
      </div>
      <div className='icons__iconSet'>
        <Iconset filteredIcons={filteredIcons} />
      </div>
    </>
  )
}