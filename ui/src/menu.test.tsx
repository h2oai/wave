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

import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { Menu, XMenu } from './menu'
import { KeyCodes } from '@fluentui/react'

const name = 'menu'

describe('Menu.tsx', () => {

    describe('Menu', () => {
        const menuProps: Menu = {
            name,
            label: 'Menu',
            items: [
                { name: 'item1', label: 'Item 1' },
                { name: 'item2', label: 'Item 2' }
            ]
        }

        it('Renders data-test attr', () => {
            const { queryByTestId } = render(<XMenu model={menuProps} />)
            expect(queryByTestId(name)).toBeInTheDocument()
        })

        it('Does not render data-test attr - name not specified', () => {
            const { queryByTestId } = render(<XMenu model={{ items: [] }} />)
            expect(queryByTestId(name)).not.toBeInTheDocument()
        })

        it('Opens menu when clicked on the button', () => {
            const { queryByRole } = render(<XMenu model={menuProps} />)
            expect(queryByRole('menu')).not.toBeInTheDocument()

            fireEvent.click(document.querySelector('button')!)
            expect(queryByRole('menu')).toBeInTheDocument()
        })

        it('Closes open menu when clicked on the button', () => {
            const { queryByRole } = render(<XMenu model={menuProps} />)
            expect(queryByRole('menu')).not.toBeInTheDocument()

            fireEvent.click(document.querySelector('button')!)
            expect(queryByRole('menu')).toBeInTheDocument()

            fireEvent.click(document.querySelector('button')!)
            expect(queryByRole('menu')).not.toBeInTheDocument()
        })

        it('Closes menu on Esc key', () => {
            const { queryByRole } = render(<XMenu model={menuProps} />)
            expect(queryByRole('menu')).not.toBeInTheDocument()

            fireEvent.click(document.querySelector('button')!)
            expect(queryByRole('menu')).toBeInTheDocument()

            // FluentUI uses a deprecated 'which' property instead of the 'key' prop.
            fireEvent.keyDown(window, { which: KeyCodes.escape })
            expect(queryByRole('menu')).not.toBeInTheDocument()
        })

        it('Does not open menu on Esc key', () => {
            const { queryByRole } = render(<XMenu model={menuProps} />)
            expect(queryByRole('menu')).not.toBeInTheDocument()

            // FluentUI uses a deprecated 'which' property instead of the 'key' prop.
            fireEvent.keyDown(window, { which: KeyCodes.escape })
            expect(queryByRole('menu')).not.toBeInTheDocument()
        })
    })
})