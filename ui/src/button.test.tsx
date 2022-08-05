// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Buttons, MiniButtons, XButtons, XMiniButtons } from './button'
import { wave } from './ui'

const
  name = 'test-btn',
  hashName = `#${name}`,
  btnProps: Buttons = { items: [{ button: { name, label: name } }] },
  btnPropsNameHash: Buttons = { items: [{ button: { name: hashName, label: name } }] },
  pushMock = jest.fn()

wave.push = pushMock
describe('Button.tsx', () => {
  beforeEach(() => {
    window.location.hash = ''
    wave.args[name] = null
    pushMock.mockClear()
  })

  describe('Regular button', () => {
    it('Renders data-test attr for Buttons', () => {
      const { queryByTestId } = render(<XButtons model={{ items: [], name }} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Renders data-test attr for Button', () => {
      const { queryByTestId } = render(<XButtons model={btnProps} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Sets correct state after click', () => {
      const { getByText } = render(<XButtons model={btnProps} />)

      fireEvent.click(getByText(name))

      expect(pushMock).toHaveBeenCalled()
      expect(wave.args[name]).toBe(true)
      expect(window.location.hash).toBe('')
    })

    it('Sets args after click - specified value', () => {
      const { getByText } = render(<XButtons model={{ items: [{ button: { name, label: name, value: 'val' } }] }} />)
      fireEvent.click(getByText(name))

      expect(wave.args[name]).toBe('val')
    })

    it('Sets correct state when name starts with #', () => {
      const { getByText } = render(<XButtons model={btnPropsNameHash} />)
      fireEvent.click(getByText(name))

      expect(window.location.hash).toBe(hashName)
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args[name]).toBe(null)
    })

    it('Renders a link when specified', () => {
      const btnLinkProps: Buttons = { items: [{ button: { name, label: name, link: true } }] }
      const { getByTestId } = render(<XButtons model={btnLinkProps} />)

      expect(getByTestId(name)).toHaveClass('ms-Link')
    })

    it('Does not render a link when not specified', () => {
      const { queryByTestId } = render(<XButtons model={btnProps} />)

      expect(queryByTestId(name)).not.toHaveClass('ms-Link')
    })

    describe('Link', () => {
      it('Opens in new tab when path are specified', () => {
        const
          path = 'https://h2o.ai/',
          { getByTestId } = render(<XButtons model={{ items: [{ button: { name, label: name, link: true, path } }] }} />)
  
        expect(getByTestId(name)).toHaveAttribute('href', path)
        expect(getByTestId(name)).toHaveAttribute('target', '_blank')
      })
  
      it('Updates location hash when name has hash and path is not specified', () => {
        const
          nameWithHash = '#mylink',
          { getByTestId } = render(<XButtons model={{ items: [{ button: { name: nameWithHash, label: name, link: true } }] }} />)
  
        fireEvent.click(getByTestId(nameWithHash))
        expect(window.location.hash).toBe(nameWithHash)
      })
  
      it('Does not update location hash when name has hash and path is specified', () => {
        const
          nameWithHash = '#mylink',
          { getByTestId } = render(<XButtons model={{ items: [{ button: { name: nameWithHash, label: name, link: true, path: 'https://h2o.ai/' } }] }} />)
  
        fireEvent.click(getByTestId(nameWithHash))
        expect(window.location.hash).toBe('')
      })
    })
  })

  describe('Mini button', () => {
    const
      miniBtns: MiniButtons = { items: [{ mini_button: { name, label: name } }] },
      miniBtnsNameHash: MiniButtons = { items: [{ mini_button: { name: `#${name}`, label: name } }] }

    it('Renders data-test attr for MiniButton', () => {
      const { queryByTestId } = render(<XMiniButtons model={miniBtns} />)
      expect(queryByTestId(name)).toBeInTheDocument()
    })

    it('Calls sync() after click', () => {
      const { getByText } = render(<XMiniButtons model={miniBtns} />)

      fireEvent.click(getByText(name))

      expect(pushMock).toHaveBeenCalled()
      expect(wave.args[name]).toBe(true)
      expect(window.location.hash).toBe('')
    })

    it('Sets window.location hash when name starts with #', () => {
      const { getByText } = render(<XMiniButtons model={miniBtnsNameHash} />)
      fireEvent.click(getByText(name))

      expect(window.location.hash).toBe(hashName)
      expect(pushMock).toHaveBeenCalledTimes(0)
      expect(wave.args[name]).toBe(null)
    })
  })
})