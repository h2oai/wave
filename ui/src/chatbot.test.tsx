import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { XChatbot } from './chatbot'
import { wave } from './ui'

const name = 'chatbot'
const model: any = { name, data: [] }
const pushMock = jest.fn()
const emitMock = jest.fn()
const data: any = [
  { content: 'Hi there!', from_user: true },
  { content: 'Hello!', from_user: false },
]
const suggestions = [
  { name: 'sug1', label: 'Suggestion 1' },
  { name: 'sug2', label: 'Suggestion 2' }
]

describe('XChatbot', () => {
  beforeAll(() => {
    wave.push = pushMock
    wave.emit = emitMock
  })
  beforeEach(() => {
    pushMock.mockClear()
    emitMock.mockClear()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XChatbot {...model} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Displays chat messages', () => {
    const { getByText } = render(<XChatbot name={name} data={data} />)
    expect(getByText('Hello!')).toBeInTheDocument()
    expect(getByText('Hi there!')).toBeInTheDocument()
  })

  it('Displays user input', () => {
    const { getByRole, getByText } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    expect(input).toHaveValue('Woohoo')
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(getByText('Woohoo')).toBeInTheDocument()
  })

  it('Clears user input on Enter key press', () => {
    const { getByRole } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(input).toHaveValue('')
  })

  it('Clears user input on Send button click', () => {
    const { getByRole, getByTestId } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    fireEvent.click(getByTestId(`${name}-submit`))
    expect(input).toHaveValue('')
  })

  it('Submits user input on Enter key press', () => {
    const { getByRole } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello!' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe('Hello!')
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Renders submitted user input', () => {
    const { getByRole, getByText } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello!' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(getByText('Hello!')).toBeInTheDocument()
  })

  it('Submits user input on Send button click', () => {
    const { getByRole, getByTestId } = render(<XChatbot {...model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: 'Hello!' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe('Hello!')
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Renders submitted user input', () => {
    const { getByRole, getByText, getByTestId } = render(<XChatbot {...model} />)
    fireEvent.change(getByRole('textbox'), { target: { value: 'Hello!' } })
    fireEvent.click(getByTestId(`${name}-submit`))
    expect(getByText('Hello!')).toBeInTheDocument()
  })

  it('Does not submit empty user input', () => {
    const { getByRole, getByTestId } = render(<XChatbot {...model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: '' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe(null)
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit empty user input - enter', () => {
    const { getByRole } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe(null)
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit user input with only whitespace', () => {
    const { getByRole, getByTestId } = render(<XChatbot {...model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: ' ' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe(' ')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit user input with only whitespace - enter', () => {
    const { getByRole } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: ' ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe(' ')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Renders disabled user input', () => {
    const { getByRole } = render(<XChatbot {...{ ...model, disabled: true }} />)

    const input = getByRole('textbox') as HTMLInputElement
    expect(input.disabled).toEqual(true)
  })

  it('Renders disabled send button when input is empty', () => {
    const { getByTestId } = render(<XChatbot {...model} />)
    expect(getByTestId(`${name}-submit`)).toBeDisabled()
  })

  it('Renders disabled send button when input is only whitespace', () => {
    const { getByRole, getByTestId } = render(<XChatbot {...model} />)
    fireEvent.change(getByRole('textbox'), { target: { value: ' ' } })
    expect(getByTestId(`${name}-submit`)).toBeDisabled()
  })

  it('Renders stop button when generating prop is specified', () => {
    const { getByText } = render(<XChatbot {...{ ...model, generating: true }} />)
    expect(getByText('Stop generating')).toBeVisible()
  })

  it('Fires a stop event when stop button is clicked', () => {
    const { getByText } = render(<XChatbot {...{ ...model, generating: true, events: ['stop'] }} />)
    fireEvent.click(getByText('Stop generating'))
    expect(emitMock).toHaveBeenCalled()
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'stop', true)
  })

  it('Fires a scroll_up event when scrolled to top', () => {
    const { container } = render(<XChatbot {...{ ...model, events: ['scroll_up'] }} />)
    fireEvent.scroll(container.querySelector('[class*=msgContainer]')!, { target: { scrollY: 0 } })
    expect(emitMock).toHaveBeenCalled()
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'scroll_up', true)
  })

  it('Renders thumbs up/down buttons', () => {
    const { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement
    const dislikeButton = container.querySelector("i[data-icon-name='Dislike']") as HTMLLIElement
    expect(likeButton).toBeInTheDocument()
    expect(dislikeButton).toBeInTheDocument()
  })

  it('Fires a like feedback event when clicked on the thumbs up button', () => {
    const { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement

    fireEvent.click(likeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: true })

    const likeSolidButton = container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement
    expect(likeSolidButton).toBeInTheDocument()
  })

  it('Fires a dislike feedback event when clicked on the thumbs down button', () => {
    const { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const dislikeButton = container.querySelector("i[data-icon-name='Dislike']") as HTMLLIElement

    fireEvent.click(dislikeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: false })

    const dislikeSolidButton = container.querySelector("i[data-icon-name='DislikeSolid']") as HTMLLIElement
    expect(dislikeSolidButton).toBeInTheDocument()
  })

  it('Fires a dislike feedback event when changing from thumbs up to thumbs down', () => {
    const
      { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />),
      likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement,
      dislikeButton = container.querySelector("i[data-icon-name='Dislike']") as HTMLLIElement

    fireEvent.click(likeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: true })

    const likeSolidButton = container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement
    expect(likeSolidButton).toBeInTheDocument()

    fireEvent.click(dislikeButton)
    expect(emitMock).toHaveBeenCalledTimes(2)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: false })
    expect(container.querySelector("i[data-icon-name='DislikeSolid']") as HTMLLIElement).toBeInTheDocument()
    expect(container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement).not.toBeInTheDocument()
  })

  it('Fires a like feedback event when changing from thumbs down to thumbs up', () => {
    const
      { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />),
      dislikeButton = container.querySelector("i[data-icon-name='Dislike']") as HTMLLIElement,
      likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement

    fireEvent.click(dislikeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: false })

    const dislikeSolidButton = container.querySelector("i[data-icon-name='DislikeSolid']") as HTMLLIElement
    expect(dislikeSolidButton).toBeInTheDocument()

    fireEvent.click(likeButton)
    expect(emitMock).toHaveBeenCalledTimes(2)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: true })
    expect(container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement).toBeInTheDocument()
    expect(container.querySelector("i[data-icon-name='DislikeSolid']") as HTMLLIElement).not.toBeInTheDocument()
  })

  it('Does not fire event when clicked on the thumbs up button twice', () => {
    const { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement

    fireEvent.click(likeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: true })

    fireEvent.click(likeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
  })

  it('Does not fire event when clicked on the thumbs down button twice', () => {
    const { container } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const dislikeButton = container.querySelector("i[data-icon-name='Dislike']") as HTMLLIElement

    fireEvent.click(dislikeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'feedback', { message: data[1].content, positive: false })

    fireEvent.click(dislikeButton)
    expect(emitMock).toHaveBeenCalledTimes(1)
  })

  it('Preserve feedback on data change', () => {
    const { container, getByRole, getByTestId, rerender } = render(<XChatbot {...{ ...model, data, events: ['feedback'] }} />)
    const likeButton = container.querySelector("i[data-icon-name='Like']") as HTMLLIElement
    expect(likeButton).toBeInTheDocument()

    fireEvent.click(likeButton)
    const likeSolidButton = container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement
    expect(likeSolidButton).toBeInTheDocument()

    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    fireEvent.click(getByTestId(`${name}-submit`))

    // TODO: "rerender" does not append new message
    rerender(<XChatbot {...{
      ...model, data: [...data,
      { content: 'I like it!', from_user: false }
      ], events: ['feedback']
    }} />)

    expect(container.querySelector("i[data-icon-name='LikeSolid']") as HTMLLIElement).toBeInTheDocument()
  })

  it('Renders suggestions when specified', () => {
    const { getByText } = render(<XChatbot {...{ ...model, suggestions }} />)

    expect(getByText('Suggestion 1')).toBeInTheDocument()
    expect(getByText('Suggestion 2')).toBeInTheDocument()
  })

  it('Fires event when suggestion is clicked', () => {
    const { getByText } = render(<XChatbot {...{ ...model, events: ['suggestion'], suggestions }} />)

    fireEvent.click(getByText('Suggestion 1'))
    expect(emitMock).toHaveBeenCalled()
    expect(emitMock).toHaveBeenCalledTimes(1)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'suggestion', suggestions[0].name)

    fireEvent.click(getByText('Suggestion 2'))
    expect(emitMock).toHaveBeenCalledTimes(2)
    expect(emitMock).toHaveBeenCalledWith(model.name, 'suggestion', suggestions[1].name)
  })

  it('Has input with default value', () => {
    const { getByRole } = render(<XChatbot {...{ ...model, value: 'Initial input' }} />)
    const input = getByRole('textbox')

    expect(input).toHaveValue('Initial input')
    expect(wave.args[name]).toBe('Initial input')
  })

  it('Change user input dynamically', () => {
    const { getByRole, rerender } = render(<XChatbot {...model} />)
    const input = getByRole('textbox')

    expect(wave.args[name]).toBe(null)
    expect(input).toHaveValue('')

    rerender(<XChatbot {...{ ...model, value: 'Hello!' }} />)

    expect(input).toHaveValue('Hello!')
    expect(wave.args[name]).toBe('Hello!')
  })
})
