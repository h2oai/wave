import Dialog from '@/components/dialog'
import HomePage from '@/pages/HomePage'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import * as IDE from "@/ide";
import { sleep } from '@/setupTests'


let homepage: JSX.Element
describe('Homepage.tsx', () => {
  beforeEach(() => {
    homepage = (
      <BrowserRouter>
        <HomePage />
        <Dialog />
      </BrowserRouter>
    )
  })
  it('should open a dialog when creating a new app', () => {
    const { getByText } = render(homepage)
    fireEvent.click(getByText('Make a new app...'))
    expect(getByText('App Setup')).toBeInTheDocument()
  })

  it('should show dialog button initially disabled', () => {
    const { getByText } = render(homepage)
    fireEvent.click(getByText('Make a new app...'))
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeDisabled()
  })

  it('should show err for invalid input', async () => {
    const { getByText } = render(homepage)
    fireEvent.click(getByText('Make a new app...'))
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('App name').nextElementSibling?.firstChild!, { target: { value: 'my_app**' } })
    // Fluent input uses 200ms debounce for validation by default.
    await waitFor(() => expect(getByText('App name can contain only word characters, numbers and underscore ("_").')).toBeInTheDocument())
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeDisabled()
  })

  it('should show err for invalid input - already existing app', async () => {
    // @ts-ignore
    IDE.list_apps = jest.fn().mockImplementation(() => ['app1', 'app2', 'app3'])
    const { getByText } = render(homepage)
    // Wait till the mocked async data get loaded properly.
    await sleep(1)
    fireEvent.click(getByText('Make a new app...'))
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('App name').nextElementSibling?.firstChild!, { target: { value: 'app1' } })
    // Fluent input uses 200ms debounce for validation by default.
    await waitFor(() => expect(getByText('App with such name already exists.')).toBeInTheDocument())
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeDisabled()
  })

  it('should redirect to an app after clicking recent', async () => {
    // @ts-ignore
    IDE.list_apps = jest.fn().mockImplementation(() => ['app1', 'app2', 'app3'])
    const { getByText } = render(homepage)
    await waitFor(() => fireEvent.click(getByText('app1')))
    expect(window.location.pathname).toEqual('/app/app1')
  })

  it('should redirect to an app after clicking submit', async () => {
    const { getByText } = render(homepage)

    fireEvent.click(getByText('Make a new app...'))
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('App name').nextElementSibling?.firstChild!, { target: { value: 'my_app' } })
    fireEvent.click(getByText('Submit'))

    expect(window.location.pathname).toEqual('/app/my_app')
  })

})