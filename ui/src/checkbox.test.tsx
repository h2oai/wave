import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XCheckbox, Checkbox } from './checkbox'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'checkbox'
const checkboxProps: Checkbox = { name }

describe('Checkbox.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XCheckbox model={checkboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Does not call sync when trigger is off', () => {
    const syncMock = jest.fn()
    const { getByTestId } = render(<XCheckbox model={checkboxProps} />)

    T.qd.sync = syncMock
    fireEvent.click(getByTestId(name))

    expect(syncMock).toHaveBeenCalledTimes(0)
  })

  it('Calls sync when trigger is on', () => {
    const syncMock = jest.fn()
    const { getByTestId } = render(<XCheckbox model={{ ...checkboxProps, trigger: true }} />)

    T.qd.sync = syncMock
    fireEvent.click(getByTestId(name))

    expect(syncMock).toHaveBeenCalled()
  })

  it('Sets args on click', () => {
    const { getByTestId } = render(<XCheckbox model={checkboxProps} />)
    fireEvent.click(getByTestId(name))

    expect(T.qd.args[name]).toBe(true)
  })

})