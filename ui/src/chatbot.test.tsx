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
})
