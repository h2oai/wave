import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { Annotator, XAnnotator } from './annotator'
import * as T from './qd'

const
  name = 'annotator',
  items = [{ text: 'Hello there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }],
  annotatorProps: Annotator = { name, tags: [{ name: 'tag1', label: 'Tag 1', color: '$red' }], items },
  getSelectionMock = jest.fn(),
  syncMock = jest.fn()

describe('Annotator.tsx', () => {
  beforeAll(() => {
    window.getSelection = getSelectionMock
    T.qd.sync = syncMock
  })
  beforeEach(() => {
    jest.clearAllMocks()
    T.qd.args[name] = null
  })
  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XAnnotator model={annotatorProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets initial q.args', () => {
    render(<XAnnotator model={annotatorProps} />)
    expect(T.qd.args[name]).toMatchObject(items)
  })

  it('Sets correct args on remove', () => {
    const { container } = render(<XAnnotator model={annotatorProps} />)

    fireEvent.mouseUp(container.querySelector('i')!)
    expect(T.qd.args[name]).toMatchObject([{ text: 'Hello there! Pretty good day' }])
  })

  it('Sets correct args on annotate', () => {
    const { getByText } = render(<XAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('Hello'))
    fireEvent.mouseUp(getByText('there'))

    expect(T.qd.args[name]).toMatchObject([
      { text: 'Hello there', tag: 'tag1' },
      { text: '! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
    ])
  })

  it('Removes browser text selection highlight after annotate', () => {
    const { getByText } = render(<XAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('Hello'))
    fireEvent.mouseUp(getByText('there'))

    expect(getSelectionMock).toHaveBeenCalled()
  })

  it('Calls sync on remove if trigger specified', () => {
    const { container } = render(<XAnnotator model={{ ...annotatorProps, trigger: true }} />)

    fireEvent.mouseUp(container.querySelector('i')!)
    expect(syncMock).toHaveBeenCalled()
  })

  it('Calls sync on annotate if trigger specified', () => {
    const { getByText } = render(<XAnnotator model={{ ...annotatorProps, trigger: true }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('Hello'))
    fireEvent.mouseUp(getByText('there'))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Shows remove icon on hover', () => {
    const { container, getByText } = render(<XAnnotator model={annotatorProps} />)

    const removeIcon = container.querySelector('i')
    expect(removeIcon).not.toBeVisible()
    const mark1 = getByText('good')
    fireEvent.mouseOver(mark1)
    expect(removeIcon).toBeVisible()
    fireEvent.mouseOut(mark1)
    expect(removeIcon).not.toBeVisible()
    const mark2 = getByText('Pretty')
    fireEvent.mouseOver(mark2)
    expect(removeIcon).toBeVisible()
  })
})