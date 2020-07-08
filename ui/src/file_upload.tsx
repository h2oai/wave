import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { B, bond, box, S, telesync } from './telesync';

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
  css = stylesheet({
    fileInput: {
      marginBottom: '10px',
    },
  })

export const
  XFileUpload = bond(({ model: m }: { model: FileUpload }) => {
    const
      ref = React.createRef<HTMLInputElement>(),
      formSubmittedB = box(false),
      filePickedB = box(false),
      percentCompleteB = box(0.0),
      upload = async () => {
        const fileInput = ref.current
        if (!fileInput) return
        const formData = new FormData(), files = fileInput.files
        if (!files) return // XXX validate
        formSubmittedB(true)
        for (let i = 0; i < files.length; i++) formData.append('files', files[i])
        try {
          const makeRequest = new Promise<XMLHttpRequest>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("POST", "/_f")
            xhr.upload.onprogress = (e) => {
              percentCompleteB(e.loaded / e.total)
            }
            xhr.send(formData)
            xhr.onreadystatechange = () => {
              if (xhr.readyState !== XMLHttpRequest.DONE) return
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr)
              } else {
                reject(xhr)
              }
            }
          })

          const
            res = await makeRequest,
            text = res.responseText,
            reply = JSON.parse(text)

          telesync.args[m.name] = reply.files
          telesync.sync()

        } catch (e) {
          console.error(e) // XXX handle properly
        }
      },
      onChange = (e: React.ChangeEvent<HTMLInputElement>) => filePickedB(e.target.value.length > 0),
      render = () => {
        const buttonText = formSubmittedB()
          ? "Uploading..."
          : m.label
        const uploadDescription = formSubmittedB() ? "Uploading: " + (percentCompleteB() * 100).toFixed(2) + "%" : null
        return (
          <div data-test={m.name}>
            <div>
              <input disabled={formSubmittedB()} ref={ref} className={css.fileInput} onChange={onChange} type='file' multiple={m.multiple} />
            </div>
            <div>
              <Fluent.ProgressIndicator
                data-test='progress' // TODO: Does not work.
                description={uploadDescription}
                percentComplete={percentCompleteB()}
                progressHidden={!formSubmittedB()}
              />
            </div>
            <div>
              <Fluent.PrimaryButton disabled={formSubmittedB() || !filePickedB()} text={buttonText} onClick={upload} />
            </div>
          </div>
        )
      }

    return { render, formSubmittedB, percentCompleteB, filePickedB }
  })