import Dialog from '@/components/dialog';
import * as IDE from "@/ide";
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import AppPage from './AppPage';

let appPage: JSX.Element
describe('Apppage.tsx', () => {
  beforeAll(() => {
    // TODO: Refactor this into mocked module inside __mocks__.
    // @ts-ignore
    IDE.list_apps = jest.fn().mockImplementation(() => ['app1', 'app2', 'app3'])
    // @ts-ignore
    IDE.list_files = jest.fn().mockImplementation(() => ['app.py'])
    // @ts-ignore
    IDE.create_app = jest.fn().mockImplementation(() => { })
    // @ts-ignore
    IDE.start_app = jest.fn().mockImplementation(() => { })
    // @ts-ignore
    IDE.stop_app = jest.fn().mockImplementation(() => { })
    // @ts-ignore
    IDE.read_file = jest.fn().mockImplementation(() => '<code>')
    // @ts-ignore
    IDE.write_file = jest.fn().mockImplementation(() => { })
  })

  beforeEach(() => {
    appPage = (
      <>
        <AppPage />
        <Dialog />
      </>
    )
  })

  it('should open a dialog when adding new file', async () => {
    const { getByTestId, getByText } = render(appPage)
    const addFileIcon = await waitFor(() => getByTestId('add-file'))
    fireEvent.click(addFileIcon)
    expect(getByText('Add new file')).toBeInTheDocument()
  })

  it('should open a dialog when deleting file', async () => {
    const { getAllByRole, getByText } = render(appPage)
    const deleteFileIcon = await waitFor(() => getAllByRole('menuitem')[0])
    fireEvent.click(deleteFileIcon)
    expect(getByText('Delete File')).toBeInTheDocument()
  })

  it('should open a dialog when renaming file', async () => {
    const { getAllByRole, getByText } = render(appPage)
    const renameFileIcon = await waitFor(() => getAllByRole('menuitem')[1])
    fireEvent.click(renameFileIcon)
    expect(getByText('Rename File')).toBeInTheDocument()
  })

  it('should show err message for invalid input - new file', async () => {
    const { getByText, getByTestId } = render(appPage)
    const addFileIcon = await waitFor(() => getByTestId('add-file'))
    fireEvent.click(addFileIcon)
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('File name').nextElementSibling?.firstChild!, { target: { value: 'my_app**' } })
    // Fluent input uses 200ms debounce for validation by default.
    await waitFor(() => expect(getByText('File name can contain only word characters, numbers and underscore ("_")')).toBeInTheDocument())
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeDisabled()
  })

  it('should not show err message for valid input - new file', async () => {
    const { getByText, getByTestId } = render(appPage)
    const addFileIcon = await waitFor(() => getByTestId('add-file'))
    fireEvent.click(addFileIcon)
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('File name').nextElementSibling?.firstChild!, { target: { value: 'my_app' } })
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeEnabled()
  })

  it('should show err message for invalid input - rename file', async () => {
    const { getByText, getAllByRole } = render(appPage)
    const renameFileIcon = await waitFor(() => getAllByRole('menuitem')[1])
    fireEvent.click(renameFileIcon)
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('File name').nextElementSibling?.firstChild!, { target: { value: 'my_app**' } })
    // Fluent input uses 200ms debounce for validation by default.
    await waitFor(() => expect(getByText('File name can contain only word characters, numbers and underscore ("_")')).toBeInTheDocument())
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeDisabled()
  })

  it('should not show err message for valid input - rename file', async () => {
    const { getByText, getAllByRole } = render(appPage)
    const renameFileIcon = await waitFor(() => getAllByRole('menuitem')[1])
    fireEvent.click(renameFileIcon)
    // Cannot target input element normally for some reason.
    fireEvent.change(getByText('File name').nextElementSibling?.firstChild!, { target: { value: 'my_app' } })
    expect(getByText('Submit').parentElement?.parentElement?.parentElement).toBeEnabled()
  })

  it('should show split screen by default', async () => {
    const { getByTestId } = render(appPage)

    await waitFor(() => expect(getByTestId('editor-window').style.width).toBe('50%'))
    await waitFor(() => expect(getByTestId('app-window').style.width).toBe('50%'))
  })

  it('should show editor view', async () => {
    const { getByTestId, getAllByRole } = render(appPage)

    fireEvent.click(getAllByRole('tab')[1])
    await waitFor(() => expect(getByTestId('editor-window').style.width).toBe('100%'))
    await waitFor(() => expect(getByTestId('app-window').style.width).toBe('0px'))
  })

  it('should show app view', async () => {
    const { getByTestId, getAllByRole } = render(appPage)

    fireEvent.click(getAllByRole('tab')[2])
    await waitFor(() => expect(getByTestId('editor-window').style.width).toBe('0px'))
    await waitFor(() => expect(getByTestId('app-window').style.width).toBe('100%'))
  })

})