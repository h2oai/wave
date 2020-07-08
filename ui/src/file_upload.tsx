import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { B, bond, box, S, telesync, U, xid } from './telesync';
import { getTheme, centerMixin, dashed, clas } from './theme';

/**
 * Create a file upload component.
 * A file upload component allows a user to browse, select and upload one or more files.
 */
export interface FileUpload {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** True if the component should allow multiple files to be uploaded. */
  multiple?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  { colors } = getTheme(),
  css = stylesheet({
    upload__input: {
      opacity: 0
    },
    upload: {
      height: 300,
      ...centerMixin(),
      flexDirection: 'column',
      boxSizing: 'border-box',
      margin: 5,
    },
    'upload--dragging': {
      border: dashed(2, colors.text),
    },
    upload__label: {
      ...centerMixin(),
      padding: 15,
      background: colors.text,
      color: colors.page,
      minWidth: 80,
      $nest: {
        '&:hover': {
          cursor: 'pointer'
        }
      }
    },
    'upload__message-bar': {
      margin: '20px 0'
    },
    upload__remove: {
      fontSize: 20,
      position: 'absolute',
      top: -15,
      right: 0,
      cursor: 'pointer'
    }
  })

export const
  XFileUpload = bond(({ model }: { model: FileUpload }) => {
    const
      isDraggingB = box(false),
      filesB = box<File[]>([]),
      percentCompleteB = box(0.0),
      errorB = box(''),
      successMsgB = box(''),
      upload = async () => {
        const formData = new FormData()

        filesB().forEach(f => formData.append('files', f))

        try {
          const makeRequest = new Promise<XMLHttpRequest>(function (resolve, reject) {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", "/_f") //TODO: set correct upload url
            xhr.upload.onprogress = e => percentCompleteB(e.loaded / e.total)
            xhr.send(formData)
            xhr.onreadystatechange = function () {
              if (xhr.readyState !== this.DONE) return
              if (xhr.status >= 200 && xhr.status < 300) resolve(xhr)
              else reject({ status: xhr.status, statusText: xhr.statusText })
            }
          })
          const { responseText } = await makeRequest
          const { files } = JSON.parse(responseText)
          telesync.args[model.name] = files
          telesync.sync()
          successMsgB(`Successfully uploaded files: ${filesB().map(({ name }) => name).join(',')}.`)
        } catch (e) {
          errorB('There was an error when uploading file.')
        }
      },
      onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length) filesB(Array.from(files))
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
        const files = e.dataTransfer.files;
        if (!model.multiple && files.length > 1) {
          errorB('Cannot upload multiple files. Input is not set to multiple mode.')
          return
        }
        if (files.length) filesB(Array.from(files))
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
        percentCompleteB(0.0)
      },
      removeFile = (index: U) => () => {
        filesB().splice(index, 1)
        filesB(filesB())
      },
      getUploadBodyComponent = () => {
        if (errorB()) return (
          <>
            <Fluent.Text variant='xLarge'>An error occured</Fluent.Text>
            <Fluent.MessageBar
              className={css["upload__message-bar"]}
              messageBarType={Fluent.MessageBarType.error}
              isMultiline={true}
              onDismiss={onDismissError}>
              {errorB()}
            </Fluent.MessageBar>
          </>
        )
        else if (successMsgB()) return (
          <>
            <Fluent.Text variant='xLarge'>Upload successful</Fluent.Text>
            <Fluent.MessageBar
              className={css["upload__message-bar"]}
              messageBarType={Fluent.MessageBarType.success}
              isMultiline={true}
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
            data-test='progress' // TODO: Does not work.
            description={`Uploading: ${(percentCompleteB() * 100).toFixed(2)}%`}
            percentComplete={percentCompleteB()}
          />
        )
        else if (filesB().length) return (
          <>
            <Fluent.Text variant='xLarge'>{model.multiple ? 'Chosen Files' : 'Chosen File'}</Fluent.Text>
            <Fluent.Stack
              horizontal={true}
              verticalAlign='center'
              styles={{ root: { maxWidth: '100%', overflowX: 'auto', padding: '30px 0' } }}
              tokens={{ childrenGap: 15 }}>
              {
                filesB().map(({ name }, i) => (
                  <Fluent.StackItem key={xid()} styles={{ root: { textAlign: 'center', position: 'relative' } }}>
                    <Fluent.Icon className={css.upload__remove} iconName='RemoveFilter' onClick={removeFile(i)} />
                    <Fluent.Icon iconName='OpenFile' styles={{ root: { fontSize: 35 } }} />
                    <br />
                    <Fluent.Text nowrap={true} styles={{ root: { display: 'block', margin: '15px 0' } }}>{name}</Fluent.Text>
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
              id='file'
              className={css.upload__input}
              onChange={onChange}
              type='file'
              multiple={model.multiple} />
            <label htmlFor="file" className={css.upload__label}>
              <Fluent.Text variant={'large'}>{model.multiple ? 'Choose files' : 'Choose a file'}</Fluent.Text>
            </label>
            <Fluent.Text styles={{ root: { marginTop: 15 } }}>Or Drag&Drop it here.</Fluent.Text>
          </>
        )
      },
      render = () => {
        const
          uploadClasses = isDraggingB() ? clas(css.upload, css["upload--dragging"]) : css.upload,
          files = filesB()
        return (
          <div data-test={model.name}>
            <form
              className={uploadClasses}
              onDragStart={onIsDragging}
              onDragEnter={onIsDragging}
              onDragEnd={onIsNotDragging}
              onDragLeave={onIsNotDragging}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              {getUploadBodyComponent()}
            </form>
            <Fluent.PrimaryButton
              styles={{ root: { float: 'right' } }}
              disabled={!!percentCompleteB() || !files.length}
              text={model.label}
              onClick={upload} />
          </div>
        )
      }

    return { render, percentCompleteB, isDraggingB, filesB, errorB, successMsgB }
  })