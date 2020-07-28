import React from 'react';
import { render, fireEvent, createEvent, wait } from '@testing-library/react';
import { XFileUpload, FileUpload } from './file_upload';
import * as T from './qd';
import { initializeIcons } from '@fluentui/react';

const name = 'fileUpload'
const fileUploadProps: FileUpload = { name }

describe('FileUpload.tsx', () => {
  beforeAll(() => initializeIcons())
  beforeEach(() => {
    jest.clearAllMocks()
    T.qd.args[name] = null
  })

  const createChangeEvent = (files: {}[]) => ({ target: { files } })
  const mockXhrRequest = (data: any, status = 200) => {
    const xhrMockObj = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status,
      upload: jest.fn(),
      responseText: JSON.stringify(data),
    };
    // @ts-ignore
    window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMockObj);
    // @ts-ignore
    setTimeout(() => { xhrMockObj['onreadystatechange'](); }, 0);
  }

  it('Shows dragging screen on dragging', () => {
    const { getByTestId, queryByText } = render(<XFileUpload model={fileUploadProps} />)
    fireEvent.dragEnter(getByTestId(name))

    expect(queryByText('Drop files anywhere within the box.')).toBeInTheDocument()
  })

  it('Shows normal screen on drag end', async () => {
    const { getByTestId, queryByText, getByText } = render(<XFileUpload model={fileUploadProps} />)

    fireEvent.dragEnter(getByTestId(name))
    expect(queryByText('Drop files anywhere within the box.')).toBeInTheDocument()

    fireEvent.dragLeave(getByText('Drop files anywhere within the box.'))
    expect(queryByText('Browse...')).toBeInTheDocument()
  })

  it('Calls sync and sets args after upload', async () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    mockXhrRequest({ files: [{ name: 'file.txt' }] });

    const { getByTestId, getByText } = render(<XFileUpload model={{ ...fileUploadProps, label: 'upload' }} />)
    fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }]))
    fireEvent.click(getByText('upload'))

    await wait(() => expect(T.qd.args[name]).toMatchObject([{ name: 'file.txt' }]), { timeout: 1000 })
    await wait(() => expect(syncMock).toHaveBeenCalled(), { timeout: 1000 })
  })

  it('Shows success screen on success upload', async () => {
    mockXhrRequest({ files: [{ name: 'file.txt' }] });

    const { getByTestId, getByText } = render(<XFileUpload model={{ ...fileUploadProps, label: 'upload' }} />)
    fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }]))
    fireEvent.click(getByText('upload'))

    await wait(() => expect(getByText('Successfully uploaded files: file.txt.')).toBeInTheDocument(), { timeout: 1000 })
  })

  it('Shows error screen on error upload', async () => {
    mockXhrRequest(null, 500);

    const { getByTestId, getByText } = render(<XFileUpload model={{ ...fileUploadProps, label: 'upload' }} />)
    fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }]))
    fireEvent.click(getByText('upload'))

    await wait(() => expect(getByText('There was an error when uploading file.')).toBeInTheDocument(), { timeout: 1000 })
  })

  describe('OS file browser', () => {
    it('Shows Chosen File after upload - single file', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={fileUploadProps} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }]))

      expect(queryByText('Chosen File')).toBeInTheDocument()
      expect(queryByText('file.txt')).toBeInTheDocument()
    })

    it('Shows Chosen Files after upload - multiple files', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, multiple: true }} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }, { name: 'file.pdf' }]))

      expect(queryByText('Chosen Files')).toBeInTheDocument()
      expect(queryByText('file.txt')).toBeInTheDocument()
      expect(queryByText('file.pdf')).toBeInTheDocument()
    })

    it('Shows an error when uploading multiple - multiple false', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={fileUploadProps} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.txt' }, { name: 'file.pdf' }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading forbidden file extension', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, file_extensions: ['txt'] }} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.pdf' }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading larger file than maxFileSize', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, max_file_size: 1 }} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.pdf', size: 2 * 1024 * 1024 }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading larger file than maxSize', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, max_size: 1 }} />)
      fireEvent.change(getByTestId(name), createChangeEvent([{ name: 'file.pdf', size: 2 * 1024 * 1024 }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })
  })
  // TODO: JsDOM doesn't support datatransfer yet - https://github.com/jsdom/jsdom/issues/1568.
  // Used a nasty hack instead.
  describe('Drag & Drop', () => {

    const createDropEvent = (targetElement: HTMLElement, files: {}[]) => {
      const fileDropEvent = createEvent.drop(targetElement)
      Object.defineProperty(fileDropEvent, 'dataTransfer', { value: { files } })
      return fileDropEvent
    }
    it('Shows Chosen File after upload - single file', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={fileUploadProps} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.txt' }]))

      expect(queryByText('Chosen File')).toBeInTheDocument()
      expect(queryByText('file.txt')).toBeInTheDocument()
    })

    it('Shows Chosen Files after upload - multiple files', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, multiple: true }} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.txt' }, { name: 'file.pdf' }]))

      expect(queryByText('Chosen Files')).toBeInTheDocument()
      expect(queryByText('file.txt')).toBeInTheDocument()
      expect(queryByText('file.pdf')).toBeInTheDocument()
    })

    it('Shows an error when uploading multiple - multiple false', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={fileUploadProps} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.txt' }, { name: 'file.pdf' }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading forbidden file extension', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, file_extensions: ['txt'] }} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.pdf' }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading larger file than maxFileSize', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, max_file_size: 1 }} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.pdf', size: 2 * 1024 * 1024 }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })

    it('Shows an error when uploading larger file than maxSize', () => {
      const { getByTestId, queryByText } = render(<XFileUpload model={{ ...fileUploadProps, max_size: 1 }} />)
      fireEvent(getByTestId(name), createDropEvent(getByTestId(name), [{ name: 'file.pdf', size: 2 * 1024 * 1024 }]))

      expect(queryByText('An error occured')).toBeInTheDocument()
    })
  })
})