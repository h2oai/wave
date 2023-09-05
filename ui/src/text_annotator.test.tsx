import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { TextAnnotator, XTextAnnotator } from './text_annotator'
import { wave } from './ui'

const
  name = 'textAnnotator',
  items = [{ text: 'Hello there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }],
  annotatorProps: TextAnnotator = {
    name,
    title: name,
    tags: [{ name: 'tag1', label: 'Tag 1', color: '$red' }, { name: 'tag2', label: 'Tag 2', color: '$blue' }],
    items
  },
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

    fireEvent.mouseUp(container.querySelector('[data-test="remove-icon"]')!)
    expect(wave.args[name]).toMatchObject([{ text: 'Hello there! Pretty good day' }])
  })

  it('Sets correct args on remove all', async () => {
    const { getByRole } = render(<XTextAnnotator model={annotatorProps} />)

    await waitFor(() => fireEvent.click(getByRole('menuitem')))
    expect(wave.args[name]).toMatchObject([{ text: 'Hello there! Pretty good day' }])
  })

  it('Sets correct args on annotate from left to right', () => {
    const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('H'))
    fireEvent.mouseUp(getByText('h'))

    expect(wave.args[name]).toMatchObject([
      { text: 'Hello there', tag: 'tag1' },
      { text: '! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
    ])
  })

  it('Sets correct args on annotate from right to left', () => {
    const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('h'))
    fireEvent.mouseUp(getByText('H'))

    expect(wave.args[name]).toMatchObject([
      { text: 'Hello there', tag: 'tag1' },
      { text: '! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
    ])
  })

  it('Sets correct args on annotate when word is preceeded by special character', () => {
    const customItems = [{ text: 'Hello (there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }]
    const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('h'))
    fireEvent.mouseUp(getByText('h'))

    expect(wave.args[name]).toMatchObject([
      { text: 'Hello (' },
      { text: 'there', tag: 'tag1' },
      { text: '! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
    ])
  })

  it('Sets correct args on annotate when text starts with numbers', () => {
    const customItems = [{ text: '123Hello there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }]
    const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('1'))
    fireEvent.mouseUp(getByText('1'))

    expect(wave.args[name]).toMatchObject([
      { text: '123', tag: 'tag1' },
      { text: 'Hello there! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
    ])
  })

  it('Sets correct args on annotate when text ends with numbers', () => {
    const customItems = [{ text: 'Hello there! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day123' }]
    const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('3'))
    fireEvent.mouseUp(getByText('3'))

    expect(wave.args[name]).toMatchObject([
      { text: 'Hello there! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' },
      { text: '123', tag: 'tag1' },
    ])
  })

  it('Sets correct args on annotate when selection starts and ends with numbers', () => {
    const customItems = [{ text: '123Hello there456! ' }, { text: 'Pretty good', tag: 'tag1' }, { text: ' day' }]
    const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('2'))
    fireEvent.mouseUp(getByText('4'))

    expect(wave.args[name]).toMatchObject([
      { text: '123Hello there456', tag: 'tag1' },
      { text: '! ' },
      { text: 'Pretty good', tag: 'tag1' },
      { text: ' day' }
    ])
  })

  it('Sets correct args on annotate when replacing selection', () => {
    const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 2'))
    fireEvent.mouseDown(getByText('P'))
    fireEvent.mouseUp(getByText('P'))

    expect(wave.args[name]).toMatchObject([
      { text: 'Hello there! ' },
      { text: 'Pretty', tag: 'tag2' },
      { text: ' good', tag: 'tag1' },
      { text: ' day' }])
  })

  it('Removes browser text selection highlight after annotate', () => {
    const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('H'))
    fireEvent.mouseUp(getByText('h'))

    expect(getSelectionMock).toHaveBeenCalled()
  })

  it('Calls sync on remove if trigger specified', () => {
    const { container } = render(<XTextAnnotator model={{ ...annotatorProps, trigger: true }} />)

    fireEvent.mouseUp(container.querySelector('[data-test="remove-icon"]')!)
    expect(pushMock).toHaveBeenCalled()
  })

  it('Calls sync on annotate if trigger specified', () => {
    const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, trigger: true }} />)

    fireEvent.click(getByText('Tag 1'))
    fireEvent.mouseDown(getByText('H'))
    fireEvent.mouseUp(getByText('h'))

    expect(pushMock).toHaveBeenCalled()
  })

  it('Shows remove icon on hover', () => {
    const { container, getByText } = render(<XTextAnnotator model={annotatorProps} />)

    expect(container.querySelector('[data-test="remove-icon"]')!).not.toBeVisible()
    fireEvent.mouseOver(getByText('g'))
    expect(container.querySelector('[data-test="remove-icon"]')!).toBeVisible()
    fireEvent.mouseOut(getByText('g'))
    expect(container.querySelector('[data-test="remove-icon"]')!).not.toBeVisible()
    fireEvent.mouseOver(getByText('P'))
    expect(container.querySelector('[data-test="remove-icon"]')!).toBeVisible()
  })

  describe('readonly', () => {
    it('Does not contain the active tag', () => {
      const { container } = render(<XTextAnnotator model={{ ...annotatorProps, readonly: true }} />)

      expect(container.querySelector('[class*=activeTag]')).not.toBeInTheDocument()
    })
  })

  describe('smart selection off', () => {
    it('Sets correct args on annotate from left to right', () => {
      const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

      fireEvent.click(getByText('Smart selection'))
      fireEvent.click(getByText('Tag 1'))
      fireEvent.mouseDown(getByText('H'))
      fireEvent.mouseUp(getByText('h'))

      expect(wave.args[name]).toMatchObject([
        { text: 'Hello th', tag: 'tag1' },
        { text: 'ere! ' },
        { text: 'Pretty good', tag: 'tag1' },
        { text: ' day' },
      ])
    })

    it('Sets correct args on annotate from right to left', () => {
      const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

      fireEvent.click(getByText('Smart selection'))
      fireEvent.click(getByText('Tag 1'))
      fireEvent.mouseDown(getByText('h'))
      fireEvent.mouseUp(getByText('H'))

      expect(wave.args[name]).toMatchObject([
        { text: 'Hello th', tag: 'tag1' },
        { text: 'ere! ' },
        { text: 'Pretty good', tag: 'tag1' },
        { text: ' day' },
      ])
    })

    it('Sets correct args on annotate when replacing selection', () => {
      const { getByText } = render(<XTextAnnotator model={annotatorProps} />)

      fireEvent.click(getByText('Tag 2'))
      fireEvent.click(getByText('Smart selection'))
      fireEvent.mouseDown(getByText('P'))
      fireEvent.mouseUp(getByText('g'))

      expect(wave.args[name]).toMatchObject([
        { text: 'Hello there! ' },
        { text: 'Pretty g', tag: 'tag2' },
        { text: 'ood', tag: 'tag1' },
        { text: ' day' }])
    })

    it('Sets correct args on annotate when escape characters are included - single line selection', () => {
      const customItems = [{ text: 'I am\nmultiline\ntext.' }]
      const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

      fireEvent.click(getByText('Tag 1'))
      fireEvent.mouseDown(getByText('u'))
      fireEvent.mouseUp(getByText('n'))

      expect(wave.args[name]).toMatchObject([
        { text: 'I am\n' },
        { text: 'multiline', tag: 'tag1' },
        { text: '\ntext.' },
      ])
    })

    it('Sets correct args on annotate when escape characters are included - multiline selection', () => {
      const customItems = [{ text: 'I am\nmultiline\ntext.' }]
      const { getByText } = render(<XTextAnnotator model={{ ...annotatorProps, items: customItems }} />)

      fireEvent.click(getByText('Tag 1'))
      fireEvent.mouseDown(getByText('u'))
      fireEvent.mouseUp(getByText('x'))

      expect(wave.args[name]).toMatchObject([
        { text: 'I am\n' },
        { text: 'multiline\ntext', tag: 'tag1' },
        { text: '.' },
      ])
    })
  })
})