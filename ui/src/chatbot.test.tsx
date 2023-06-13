import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { XChatbot } from './chatbot'
import { wave } from './ui'

const name = 'chatbot'
const model = { name, data: [] }
const pushMock = jest.fn()
const data = [
  { msg: 'Hi there!', fromUser: true },
  { msg: 'Hello!', fromUser: false },
]

describe('XChatbot', () => {
  beforeAll(() => wave.push = pushMock)
  beforeEach(() => {
    pushMock.mockClear()
    wave.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XChatbot model={model} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Displays chat messages', () => {
    const { getByText } = render(<XChatbot model={{ name, data }} />)
    expect(getByText('Hello!')).toBeInTheDocument()
    expect(getByText('Hi there!')).toBeInTheDocument()
  })

  it('Displays user input', () => {
    const { getByRole, getByText } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    expect(input).toHaveValue('Woohoo')
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(getByText('Woohoo')).toBeInTheDocument()
  })

  it('Clears user input on Enter key press', () => {
    const { getByRole } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(input).toHaveValue('')
  })

  it('Clears user input on Send button click', () => {
    const { getByRole, getByTestId } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Woohoo' } })
    fireEvent.click(getByTestId(`${name}-submit`))
    expect(input).toHaveValue('')
  })

  it('Submits user input on Enter key press', () => {
    const { getByRole } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello!' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe('Hello!')
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Renders submitted user input', () => {
    const { getByRole, getByText } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Hello!' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(getByText('Hello!')).toBeInTheDocument()
  })

  it('Submits user input on Send button click', () => {
    const { getByRole, getByTestId } = render(<XChatbot model={model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: 'Hello!' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe('Hello!')
    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('Renders submitted user input', () => {
    const { getByRole, getByText, getByTestId } = render(<XChatbot model={model} />)
    fireEvent.change(getByRole('textbox'), { target: { value: 'Hello!' } })
    fireEvent.click(getByTestId(`${name}-submit`))
    expect(getByText('Hello!')).toBeInTheDocument()
  })

  it('Does not submit empty user input', () => {
    const { getByRole, getByTestId } = render(<XChatbot model={model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: '' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe(null)
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit empty user input - enter', () => {
    const { getByRole } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe(null)
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit user input with only whitespace', () => {
    const { getByRole, getByTestId } = render(<XChatbot model={model} />)
    const sendButton = getByTestId(`${name}-submit`)
    fireEvent.change(getByRole('textbox'), { target: { value: ' ' } })
    fireEvent.click(sendButton)
    expect(wave.args[name]).toBe(' ')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Does not submit user input with only whitespace - enter', () => {
    const { getByRole } = render(<XChatbot model={model} />)
    const input = getByRole('textbox')
    fireEvent.change(input, { target: { value: ' ' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(wave.args[name]).toBe(' ')
    expect(pushMock).toHaveBeenCalledTimes(0)
  })

  it('Renders disabled send button when input is empty', () => {
    const { getByTestId } = render(<XChatbot model={model} />)
    expect(getByTestId(`${name}-submit`)).toBeDisabled()
  })

  it('Renders disabled send button when input is only whitespace', () => {
    const { getByRole, getByTestId } = render(<XChatbot model={model} />)
    fireEvent.change(getByRole('textbox'), { target: { value: ' ' } })
    expect(getByTestId(`${name}-submit`)).toBeDisabled()
  })
})
