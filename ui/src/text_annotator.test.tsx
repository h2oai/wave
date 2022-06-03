import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { TextAnnotator, XTextAnnotator } from './text_annotator'
import { wave } from './ui'

const
  name = 'textAnnotator',
  items = [{ text: 'Hello there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }],
  annotatorProps: TextAnnotator = { name, title: name, tags: [{ name: 'tag1', label: 'Tag 1', color: '$red' }], items },
  getSelectionMock = jest.fn(),
  pushMock = jest.fn()

describe('TextAnnotator.tsx', () => {
  beforeAll(() => {
    window.getSelection = getSelectionMock
    wave.push = pushMock
  })
  beforeEach(() => {
    jest.clearAllMocks()
    wave.args[name] = null
  })
  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTextAnnotator model={annotatorProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
    expect(queryByTestId('tag1')).toBeInTheDocument()
  })

  it('Sets initial q.args', () => {
    render(<XTextAnnotator model={annotatorProps} />)
    expect(wave.args[name]).toMatchObject(items)
  })

  it('Sets correct args on remove', () => {
    const { container } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.mouseUp(container.querySelector('i')!)
    expect(wave.args[name]).toMatchObject([{ text: 'Hello there! Pretty good day' }])
  })

  it('Removes browser text selection highlight after annotate', () => {
    const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('Hello'))
    fireEvent.mouseUp(getByText('there'))

    expect(getSelectionMock).toHaveBeenCalled()
  })

  it('Calls sync on remove if trigger specified', () => {
    const { container } = render(<XTextAnnotator model={{ ...annotatorProps, trigger: true }} />)

    fireEvent.mouseUp(container.querySelector('i')!)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Shows remove icon on hover', () => {
    const { container, getByText } = render(<XTextAnnotator model={annotatorProps} />)

    expect(container.querySelector('i')).not.toBeVisible()
    fireEvent.mouseOver(getByText('good'))
    expect(container.querySelector('i')).toBeVisible()
    fireEvent.mouseOut(getByText('good'))
    expect(container.querySelector('i')).not.toBeVisible()
    fireEvent.mouseOver(getByText('Pretty'))
    expect(container.querySelector('i')).toBeVisible()
  })

  describe('readonly', () => {
    it('Does not contain the active tag', () => {
      const { container } = render(<XTextAnnotator model={{ ...annotatorProps, readonly: true }} />)

      expect(container.querySelector('[class*=activeTag]')).not.toBeInTheDocument()
    })
  })
})