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

import * as Fluent from '@fluentui/react'
import { B, F, Id, S, U, xid } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { centerMixin, clas, cssVar, dashed, padding } from './theme'
import { wave } from './ui'

/**
 * Create a file upload component.
 * A file upload component allows a user to browse, select and upload one or more files.
 */
export interface FileUpload {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed in the bottom button. Defaults to "Upload". */
  label?: S
  /** True if the component should allow multiple files to be uploaded. */
  multiple?: B
  /** List of allowed file extensions, e.g. `pdf`, `docx`, etc. */
  file_extensions?: S[]
  /** Maximum allowed size (Mb) per file. No limit by default. */
  max_file_size?: F
  /** Maximum allowed size (Mb) for all files combined. No limit by default. */
  max_size?: F
  /** The height of the file upload, e.g. '400px', '50%', etc. Defaults to 300px. */
  height?: S
  /** The width of the file upload, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be displayed compactly (without drag-and-drop capabilities). Defaults to False. */
  compact?: B
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  css = stylesheet({
    uploadInput: {
      opacity: 0
    },
    upload: {
      ...centerMixin(),
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    uploadDragging: {
      border: dashed(2, cssVar('$themePrimary')),
    },
    uploadLabel: {
      ...centerMixin(),
      padding: padding(7, 10),
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 2,
      background: cssVar('$themePrimary'),
      color: cssVar('$page'),
      minWidth: 80,
      boxSizing: 'border-box',
      height: 32,
      $nest: {
        '&:hover': {
          cursor: 'pointer'
        }
      }
    },
    uploadLabelCompact: {
      position: 'absolute',
      top: 2,
      right: 2,
      height: 28
    },
    uploadMessageBar: {
      margin: '20px 0'
    },
    uploadRemove: {
      fontSize: 20,
      position: 'absolute',
      top: -15,
      right: 0,
      cursor: 'pointer'
    },
    compact: {
      position: 'relative'
    }
  })

const convertMegabytesToBytes = (bytes: F) => bytes * 1024 * 1024
export const
  XFileUpload = ({ model }: { model: FileUpload }) => {
    const
      { name, label, file_extensions, max_file_size, compact, height, max_size, multiple } = model,
      [isDragging, setIsDragging] = React.useState(false),
      [files, setFiles] = React.useState<File[]>([]),
      [fileNames, setFileNames] = React.useState<S>(''),
      [percentComplete, setPercentComplete] = React.useState(0.0),
      [error, setError] = React.useState(''),
      [successMsg, setSuccessMsg] = React.useState(''),
      maxFileSizeBytes = max_file_size ? convertMegabytesToBytes(max_file_size) : 0,
      maxSizeBytes = max_size ? convertMegabytesToBytes(max_size) : 0,
      fileExtensions = file_extensions ? file_extensions.map(e => e.startsWith('.') ? e : `.${e}`) : null,
      upload = async (uploadFiles = files) => {
        const formData = new FormData()
        uploadFiles.forEach((f: File) => formData.append('files', f))

        try {
          const { responseText } = await new Promise<XMLHttpRequest>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", wave.uploadURL)
            xhr.upload.onprogress = e => setPercentComplete(e.loaded / e.total)
            xhr.send(formData)
            xhr.onreadystatechange = () => {
              if (xhr.readyState !== XMLHttpRequest.DONE) return
              xhr.status >= 200 && xhr.status < 300 ? resolve(xhr) : reject(xhr)
            }
          })
          const { files } = JSON.parse(responseText)
          wave.args[name] = files

          if (!compact) wave.push()
          setSuccessMsg(`Successfully uploaded files: ${files.map(({ name }: File) => name).join(',')}.`)
        }
        catch ({ responseText }) { setError(responseText || 'There was an error when uploading file.') }
        finally { setFiles([]) }
      },
      isFileTypeAllowed = (fileName: S) => !fileExtensions || fileExtensions.some(ext => fileName.toLowerCase().endsWith(ext.toLowerCase())),
      validateFiles = (fileArr: File[]) => {
        if (!multiple && fileArr.length > 1) return 'Cannot upload multiple files. Input is not set to multiple mode.'

        const notAllowedFiles = fileArr.filter(({ name }) => !isFileTypeAllowed(name))
        if (notAllowedFiles.length) {
          return `Not allowed extension for files: ${notAllowedFiles.map(({ name }) => name).join(', ')}.
          Allowed file extensions: ${fileExtensions?.join(', ')}.`
        }

        if (maxFileSizeBytes) {
          const maxSizePerFileExceededFiles = fileArr.filter(({ size }) => size > maxFileSizeBytes)
          if (maxSizePerFileExceededFiles.length) {
            return `Max file size exceeded for files: ${maxSizePerFileExceededFiles.map(({ name }) => name).join(', ')}.
            Allowed size per file: ${max_file_size}Mb.`
          }
        }

        if (maxSizeBytes) {
          const totalSize = fileArr.reduce((total, { size }) => total + size, 0)
          if (totalSize > maxSizeBytes) {
            return `Total max file size exceeded. Allowed size: ${max_size}Mb.`
          }
        }
      },
      onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files?.length) return
        const fileArr = Array.from(files)

        const errMsg = validateFiles(fileArr)
        if (errMsg) {
          setError(errMsg)
        }
        else {
          setFiles(fileArr)
          if (compact) {
            await upload(fileArr)
            setPercentComplete(0)
          }
          setFileNames(fileArr.map(({ name }) => name).join(', '))
        }
      },
      onIsDragging = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
      },
      onIsNotDragging = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
      },
      onDrop = (e: React.DragEvent<HTMLFormElement>) => {
        onIsNotDragging(e)
        const files = e.dataTransfer.files
        if (!files.length || error || successMsg) return
        const fileArr = Array.from(files)

        const errMsg = validateFiles(fileArr)
        if (errMsg) {
          setError(errMsg)
          return
        }

        setFiles(fileArr)
      },
      // Workaround - This event prevents onDrop from firing.
      // https://stackoverflow.com/questions/50230048/react-ondrop-is-not-firing/50230145.
      onDragOver = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
      },
      onDismissError = () => setError(''),
      onDismissSuccess = () => {
        setSuccessMsg('')
        setPercentComplete(0)
      },
      removeFile = (index: U) => () => {
        files.splice(index, 1)
        setFiles([...files])
      },
      getUploadBodyComponent = () => {
        if (error) return (
          <>
            <Fluent.Text variant='xLarge'>An error occured</Fluent.Text>
            <Fluent.MessageBar
              className={css.uploadMessageBar}
              messageBarType={Fluent.MessageBarType.error}
              isMultiline
              onDismiss={onDismissError}>
              {error}
            </Fluent.MessageBar>
          </>
        )
        else if (successMsg) return (
          <>
            <Fluent.Text variant='xLarge'>Upload successful</Fluent.Text>
            <Fluent.MessageBar
              className={css.uploadMessageBar}
              messageBarType={Fluent.MessageBarType.success}
              isMultiline
              onDismiss={onDismissSuccess}>
              {successMsg}
            </Fluent.MessageBar>
          </>
        )
        else if (isDragging) return (
          <Fluent.Text styles={{ root: { pointerEvents: 'none' } }}>Drop files anywhere within the box.</Fluent.Text>
        )
        else if (percentComplete) return (
          <Fluent.ProgressIndicator
            styles={{ root: { width: '80%' } }}
            data-test='progress' // TODO: Does not work.
            description={`Uploading: ${(percentComplete * 100).toFixed(2)}%`}
            percentComplete={percentComplete}
          />
        )
        else if (files.length) return (
          <>
            <Fluent.Text variant='xLarge'>{multiple ? 'Chosen Files' : 'Chosen File'}</Fluent.Text>
            <Fluent.Stack
              horizontal
              verticalAlign='center'
              styles={{ root: { maxWidth: '100%', overflowX: 'auto', padding: '30px 0' } }}
              tokens={{ childrenGap: 15 }}>
              {
                files.map(({ name }, i) => (
                  <Fluent.StackItem key={xid()} styles={{ root: { textAlign: 'center', position: 'relative' } }}>
                    <Fluent.Icon className={css.uploadRemove} iconName='RemoveFilter' onClick={removeFile(i)} />
                    <Fluent.Icon iconName='OpenFile' styles={{ root: { fontSize: 35 } }} />
                    <br />
                    <Fluent.Text nowrap styles={{ root: { display: 'block', margin: '15px 0' } }}>{name}</Fluent.Text>
                  </Fluent.StackItem>
                ))
              }
            </Fluent.Stack>
          </>
        )
        else return (
          <>
            <Fluent.Icon iconName='CloudUpload' styles={{ root: { fontSize: 50 } }} />
            <input
              id={name}
              data-test={name}
              className={css.uploadInput}
              onChange={onChange}
              type='file'
              accept={fileExtensions?.join(',')}
              multiple={multiple} />
            <label htmlFor={name} className={css.uploadLabel}>Browse...</label>
            <Fluent.Text styles={{ root: { marginTop: 15 } }}>Or drag and drop {multiple ? 'files' : 'a file'} here.</Fluent.Text>
          </>
        )
      },
      getCompactFileUpload = () => (
        <>
          {label && <Fluent.Label>{label}</Fluent.Label>}
          {
            percentComplete
              ? <Fluent.ProgressIndicator description={`Uploading: ${(percentComplete * 100).toFixed(2)}%`} percentComplete={percentComplete} />
              : (
                <div className={css.compact}>
                  <Fluent.TextField data-test={`textfield-${name}`} readOnly value={fileNames} errorMessage={error} />
                  <input id={name} data-test={name} type='file' hidden onChange={onChange} accept={fileExtensions?.join(',')} multiple={multiple} />
                  <label htmlFor={name} className={clas(css.uploadLabel, css.uploadLabelCompact)}>Browse</label>
                </div>
              )
          }
        </>
      )

    return compact ? getCompactFileUpload() : (
      <>
        <form
          className={isDragging && !error && !successMsg ? clas(css.upload, css.uploadDragging) : css.upload}
          style={{ height: height || 300 }}
          onDragStart={onIsDragging}
          onDragEnter={onIsDragging}
          onDragEnd={onIsNotDragging}
          onDragLeave={onIsNotDragging}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {getUploadBodyComponent()}
        </form>
        <Fluent.PrimaryButton disabled={!!percentComplete || !files.length} text={label || 'Upload'} onClick={() => upload()} />
      </>
    )
  }
