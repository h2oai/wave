import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XChoiceGroup, ChoiceGroup } from './choice_group'
import * as T from './qd'
import { initializeIcons } from '@fluentui/react'

const name = 'choiceGroup'
const choiceGroupProps: ChoiceGroup = { name, choices: [{ name: 'Choice1' }, { name: 'Choice2' }, { name: 'Choice3' },] }
describe('ChoiceGroup.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XChoiceGroup model={choiceGroupProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - single selection', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(T.qd.args[name]).toBe('Choice1')
  })

  it('Sets args - multi selection', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    fireEvent.click(getByText('Choice1').parentElement!)
    fireEvent.click(getByText('Choice2').parentElement!)
    fireEvent.click(getByText('Choice3').parentElement!)

    expect(T.qd.args[name]).toBe('Choice3')
  })

  it('Does not call sync - trigger not specified', () => {
    const { getByText } = render(<XChoiceGroup model={choiceGroupProps} />)
    const syncMock = jest.fn()

    T.qd.sync = syncMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(syncMock).toBeCalledTimes(0)
  })

  it('Calls sync - trigger specified', () => {
    const { getByText } = render(<XChoiceGroup model={{ ...choiceGroupProps, trigger: true }} />)
    const syncMock = jest.fn()

    T.qd.sync = syncMock
    fireEvent.click(getByText('Choice1').parentElement!)

    expect(syncMock).toHaveBeenCalled()
  })
})