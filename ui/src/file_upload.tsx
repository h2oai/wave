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
import { B, box, F, Id, S, U, wave } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { centerMixin, clas, cssVar, dashed, displayMixin, padding } from './theme'
import { bond } from './ui'

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
  /** Maximum allowed size (Mb) per file. Defaults to no limit. */
  max_file_size?: F
  /** Maximum allowed size (Mb) for all files combined. Defaults to no limit. */
  max_size?: F
  /** The height of the file upload, e.g. '400px', '50%', etc. */
  height?: S
  /** True if the component should be displayed compactly (without drag-and-drop capabilities). Defaults to false. */
  compact?: B
  /** True if the component should be visible. Defaults to true. */
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
  XFileUpload = bond(({ model }: { model: FileUpload }) => {
    const
      isDraggingB = box(false),
      filesB = box<File[]>([]),
      fileNamesB = box<S>(''),
      percentCompleteB = box(0.0),
      errorB = box(''),
      successMsgB = box(''),
      { compact, max_file_size, max_size, file_extensions, name, multiple, label, visible, height = 300 } = model,
      maxFileSizeBytes = max_file_size ? convertMegabytesToBytes(max_file_size) : 0,
      maxSizeBytes = max_size ? convertMegabytesToBytes(max_size) : 0,
      fileExtensions = file_extensions ? file_extensions.map(e => e.startsWith('.') ? e : `.${e}`) : null,
      upload = async () => {
        const formData = new FormData()
        filesB().forEach(f => formData.append('files', f))

        try {
          const makeRequest = new Promise<XMLHttpRequest>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", "/_f")
            xhr.upload.onprogress = e => percentCompleteB(e.loaded / e.total)
            xhr.send(formData)
            xhr.onreadystatechange = () => {
              if (xhr.readyState !== XMLHttpRequest.DONE) return
              if (xhr.status >= 200 && xhr.status < 300) resolve(xhr)
              else reject(xhr)
            }
          })
          const { responseText } = await makeRequest
          const { files } = JSON.parse(responseText)
          wave.args[model.name] = files
          if (!compact) wave.sync()
          successMsgB(`Successfully uploaded files: ${filesB().map(({ name }) => name).join(',')}.`)
        }
        catch ({ responseText }) { errorB(responseText || 'There was an error when uploading file.') }
        finally { filesB([]) }
      },
      isFileTypeAllowed = (fileName: string) => {
        return !fileExtensions || fileExtensions.some(ext => fileName.toLowerCase().endsWith(ext.toLowerCase()))
      },
      validateFiles = (fileArr: File[]) => {
        if (!multiple && fileArr.length > 1) {
          return 'Cannot upload multiple files. Input is not set to multiple mode.'
        }

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
          errorB(errMsg)
        }
        else {
          if (compact) {
            filesB(fileArr)
            await upload()
            percentCompleteB(0)
          }
          filesB(fileArr)
          fileNamesB(fileArr.map(({ name }) => name).join(', '))
        }
      },
      onIsDragging = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        isDraggingB(true)
      },
      onIsNotDragging = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        isDraggingB(false)
      },
      onDrop = (e: React.DragEvent<HTMLFormElement>) => {
        onIsNotDragging(e)
        const files = e.dataTransfer.files
        if (!files.length || errorB() || successMsgB()) return
        const fileArr = Array.from(files)

        const errMsg = validateFiles(fileArr)
        if (errMsg) {
          errorB(errMsg)
          return
        }
        filesB(fileArr)
      },
      // Workaround - This event prevents onDrop from firing.
      // https://stackoverflow.com/questions/50230048/react-ondrop-is-not-firing/50230145.
      onDragOver = (e: React.DragEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
      },
      onDismissError = () => errorB(''),
      onDismissSuccess = () => {
        successMsgB('')
        percentCompleteB(0)
      },
      removeFile = (index: U) => () => {
        filesB().splice(index, 1)
        filesB([...filesB()])
      },
      getUploadBodyComponent = () => {
        if (errorB()) return (
          <>
            <Fluent.Text variant='xLarge'>An error occured</Fluent.Text>
            <Fluent.MessageBar
              className={css.uploadMessageBar}
              messageBarType={Fluent.MessageBarType.error}
              isMultiline
              onDismiss={onDismissError}>
              {errorB()}
            </Fluent.MessageBar>
          </>
        )
        else if (successMsgB()) return (
          <>
            <Fluent.Text variant='xLarge'>Upload successful</Fluent.Text>
            <Fluent.MessageBar
              className={css.uploadMessageBar}
              messageBarType={Fluent.MessageBarType.success}
              isMultiline
              onDismiss={onDismissSuccess}>
              {successMsgB()}
            </Fluent.MessageBar>
          </>
        )
        else if (isDraggingB()) return (
          <Fluent.Text styles={{ root: { pointerEvents: 'none' } }}>Drop files anywhere within the box.</Fluent.Text>
        )
        else if (percentCompleteB()) return (
          <Fluent.ProgressIndicator
            styles={{ root: { width: '80%' } }}
            description={`Uploading: ${(percentCompleteB() * 100).toFixed(2)}%`}
            percentComplete={percentCompleteB()}
          />
        )
        else if (filesB().length) return (
          <>
            <Fluent.Text variant='xLarge'>{multiple ? 'Chosen Files' : 'Chosen File'}</Fluent.Text>
            <Fluent.Stack
              horizontal
              verticalAlign='center'
              styles={{ root: { maxWidth: '100%', overflowX: 'auto', padding: '30px 0' } }}
              tokens={{ childrenGap: 15 }}>
              {
                filesB().map(({ name }, i) => (
                  <Fluent.StackItem key={i} styles={{ root: { textAlign: 'center', position: 'relative' } }}>
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
            percentCompleteB()
              ? <Fluent.ProgressIndicator description={`Uploading: ${(percentCompleteB() * 100).toFixed(2)}%`} percentComplete={percentCompleteB()} />
              : (
                <div className={css.compact}>
                  <Fluent.TextField data-test={`textfield-${name}`} readOnly value={fileNamesB()} errorMessage={errorB()} />
                  <input id={name} data-test={name} type='file' hidden onChange={onChange} accept={fileExtensions?.join(',')} multiple={multiple} />
                  <label htmlFor={name} className={clas(css.uploadLabel, css.uploadLabelCompact)}>Browse</label>
                </div>
              )
          }
        </>
      ),
      render = () => (
        <div style={displayMixin(visible)}>
          {
            compact ? getCompactFileUpload()
              : (
                <>
                  <form
                    className={isDraggingB() && !errorB() && !successMsgB() ? clas(css.upload, css.uploadDragging) : css.upload}
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
                  <Fluent.PrimaryButton disabled={!!percentCompleteB() || !filesB().length} text={label || 'Upload'} onClick={upload} />
                </>
              )
          }
        </div>
      )

    return { render, percentCompleteB, isDraggingB, filesB, fileNamesB, errorB, successMsgB }
  })
