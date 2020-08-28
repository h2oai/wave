import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XExpander, Expander } from './expander';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'expander';
const expanderProps: Expander = { name }
describe('Expander.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => { T.qd.args[name] = null })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XExpander model={expanderProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - null', () => {
    render(<XExpander model={expanderProps} />)
    expect(T.qd.args[name]).toBeNull()
  })

  it('Sets args on click', () => {
    const { getByRole } = render(<XExpander model={expanderProps} />)
    fireEvent.click(getByRole('button'))

    expect(T.qd.args[name]).toBe(true)
  })
})