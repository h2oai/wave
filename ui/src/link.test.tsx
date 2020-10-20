import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XLink, Link } from './link'
import { initializeIcons } from '@fluentui/react'

const
  name = 'link',
  linkProps: Link = { name, path: name }

describe('Link.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { jest.clearAllMocks() })

  it('Does not render data-test attr', () => {
    const { container } = render(<XLink model={{}} />)
    expect(container.querySelectorAll('[data-test]')).toHaveLength(0)
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XLink model={linkProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not display link when visible is false', () => {
    const { queryByTestId } = render(<XLink model={{ ...linkProps, visible: false }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId(name)).not.toBeVisible()
  })

  it('Sets default label when not specified', () => {
    const { queryByText } = render(<XLink model={linkProps} />)
    expect(queryByText(name)).toBeInTheDocument()
  })

  it('Calls window open on click', () => {
    const windowOpenMock = jest.fn()
    window.open = windowOpenMock
    const { getByText } = render(<XLink model={{ ...linkProps, button: true }} />)

    fireEvent.click(getByText(name))
    expect(windowOpenMock).toHaveBeenCalled()
    expect(windowOpenMock).toHaveBeenCalledWith(name)
  })

  it('Renders download attribute', () => {
    const { getByTestId } = render(<XLink model={{ ...linkProps, download: true }} />)
    expect(getByTestId(name).getAttribute('download')).toEqual('')
  })

  it('Does not render download attribute', () => {
    const { getByTestId } = render(<XLink model={linkProps} />)
    expect(getByTestId(name).getAttribute('download')).toBeNull()
  })
})