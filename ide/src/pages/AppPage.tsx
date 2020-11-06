import Editor from '@/components/editor';
import { bond, box, Box } from '@/dataflow';
import { list_files, read_file, write_file } from '@/ide';
import { newEditor } from '@/model';
import * as Fluent from '@fluentui/react';
import makeLogo from '@static/make-logo.svg';
import React from 'react';
import { matchPath } from 'react-router-dom';

type FileToolbarProps = {
  filesB: Box<string[]>
  activeFileB: Box<string>
  addNewFile: (fileName: string) => Promise<void>
  readFile: (fileName: string) => Promise<void>
}

export const FileToolbar = bond(({ addNewFile, readFile, filesB, activeFileB }: FileToolbarProps) => {
  const
    fileNameB = box(''),
    fileNameErrB = box(''),
    dialogHiddenB = box(true),
    toggleDialog = () => dialogHiddenB(!dialogHiddenB()),
    dialogContentProps: Fluent.IDialogContentProps = {
      title: 'Add a new file',
      onDismiss: toggleDialog
    },
    onFileNameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val = '') => {
      fileNameErrB(/^\w+$/.test(val) ? '' : 'File name can contain only word characters, numbers and underscore ("_")')
      fileNameB(val)
    },
    submitAddDialog = async () => {
      await addNewFile(fileNameB())
      toggleDialog()
    },
    onLinkClick = (item?: Fluent.PivotItem) => {
      if (!item) return
      const selectedFile = item.props.itemKey || 'app.py'
      activeFileB(selectedFile)
      readFile(item.props.itemKey || 'app.py')
    },
    render = () => (
      <>
        <Fluent.Stack horizontal verticalAlign='center'>
          <Fluent.Pivot selectedKey={activeFileB()} linkSize={Fluent.PivotLinkSize.large} onLinkClick={onLinkClick}>
            {filesB().map(f => <Fluent.PivotItem key={f} itemKey={f.replace(/ \*/g, '')} headerText={f} />)}
          </Fluent.Pivot>
          <Fluent.TooltipHost content="Add another file" id='add-file-tooltip'>
            <Fluent.IconButton iconProps={{ iconName: 'Add' }} onClick={toggleDialog} />
          </Fluent.TooltipHost>
        </Fluent.Stack>
        <Fluent.Dialog hidden={dialogHiddenB()} dialogContentProps={dialogContentProps} minWidth={600} styles={{}}>
          <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
            <Fluent.TextField
              label='File name'
              value={fileNameB()}
              onChange={onFileNameChange}
              required
              errorMessage={fileNameErrB()}
              suffix='.py'
            />
          </Fluent.DialogContent>
          <Fluent.DialogFooter>
            <Fluent.DefaultButton onClick={toggleDialog} text="Cancel" />
            <Fluent.PrimaryButton disabled={!!fileNameErrB() || !fileNameB()} text='Submit' onClick={submitAddDialog} />
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      </>
    )

  return { render, dialogHiddenB, fileNameB, fileNameErrB, filesB, activeFileB }
})

enum ViewType {
  SPLIT = 'split',
  CODE = 'code',
  PREVIEW = 'preview',
}

type View = 'editor' | 'app'

type AppPageHeaderProps = {
  appName: string,
  changeViewStyle: (viewStyle: ViewType) => void
}

export const AppPageHeader = bond(({ appName, changeViewStyle }: AppPageHeaderProps) => {
  const
    onLinkClick = (item?: Fluent.PivotItem) => {
      if (!item?.props.itemKey) throw new Error('PivotItem itemKey must be specified')
      changeViewStyle(item.props.itemKey as ViewType)
    },
    render = () => (
      <Fluent.Stack horizontal horizontalAlign='space-between' verticalAlign='center' styles={{ root: { margin: '0px 15px' } }}>
        <Fluent.Stack horizontal verticalAlign='center'>
          <Fluent.Image src={makeLogo} width={40} />
          <Fluent.Text variant='xxLargePlus' styles={{ root: { padding: 15 } }}>{appName}</Fluent.Text>
        </Fluent.Stack>
        <Fluent.Pivot onLinkClick={onLinkClick} linkSize={Fluent.PivotLinkSize.large}>
          <Fluent.PivotItem itemKey={ViewType.SPLIT} itemIcon='DoubleColumnEdit' />
          <Fluent.PivotItem itemKey={ViewType.CODE} itemIcon='Edit' />
          <Fluent.PivotItem itemKey={ViewType.PREVIEW} itemIcon='TVMonitor' />
        </Fluent.Pivot>
      </Fluent.Stack>
    )
  return { render }
})

const
  commonStyles: React.CSSProperties = { height: '100%', transition: 'width .5s, opacity .5s' },
  viewStyles: { [K in ViewType]: { [K in View]: React.CSSProperties } } = {
    split: {
      editor: { width: '50%' },
      app: { width: '50%' }
    },
    code: {
      editor: { width: '100%' },
      app: { width: 0, opacity: 0 }
    },
    preview: {
      editor: { width: 0, opacity: 0 },
      app: { width: '100%' }
    },
  }


export default bond(() => {
  const
    appName = matchPath<{ name: string }>(window.location.pathname, { path: "/app/:name" })?.params.name || 'Untitled',
    viewStyleB = box<ViewType>(ViewType.SPLIT),
    filesB = box<string[]>([]),
    activeFileB = box('app.py'),
    editor = newEditor(appName),
    isLoadingB = box(true),
    addNewFile = async (fileName: string) => {
      fileName = fileName.endsWith('.py') ? fileName : `${fileName}.py`
      const content = ''
      await write_file(appName, fileName, content)
      filesB([...filesB(), fileName])
      activeFileB(fileName)
      editor.contentB(content)
    },
    readFile = async (fileName: string) => {
      const content = await read_file(appName, fileName)
      editor.contentB(content)
      onDirtyChange(false)
    },
    onContentChange = async (newContent: string) => {
      await write_file(appName, activeFileB(), newContent)
    },
    onDirtyChange = (isDirty: boolean) => {
      filesB(filesB().map(f => {
        // TODO: refactor using reasonable CSS
        return isDirty && f.startsWith(activeFileB())
          ? f.endsWith('*') ? f : `${f} *`
          : f.replace(/ \*/g, '')
      }))
    },
    init = async () => {
      await editor.loadApp()
      const files = await list_files(appName)
      filesB(files)
      if (files.length) activeFileB(files[0])

      try {
        await editor.startApp()
      }
      catch (error) {
        /* noop */
      }
      finally {
        isLoadingB(false)
      }
    },
    render = () => (
      <>
        <AppPageHeader appName={appName} changeViewStyle={viewStyleB} />
        {
          isLoadingB()
            ? (
              <Fluent.Stack horizontalAlign='center' verticalAlign='center' styles={{ root: { height: '80vh' } }}>
                <Fluent.Spinner label='Loading editor' size={Fluent.SpinnerSize.large} />
              </Fluent.Stack>
            )
            : (
              <>
                <FileToolbar addNewFile={addNewFile} readFile={readFile} filesB={filesB} activeFileB={activeFileB} />
                <Fluent.Stack horizontal styles={{ root: { marginTop: 5, width: '100%', height: 'calc(100vh - 122px)' } }}>
                  <div style={{ ...commonStyles, ...viewStyles[viewStyleB()].editor }}>
                    <Editor contentB={editor.contentB} onContentChange={onContentChange} onDirtyChange={onDirtyChange} />
                  </div>
                  <div style={{ ...commonStyles, ...viewStyles[viewStyleB()].app }}>
                    <iframe src={`${IFRAME_URL}/${appName}`} width='100%' height='100%' frameBorder="0" />
                  </div>
                </Fluent.Stack>
              </>
            )
        }
      </>
    ),
    dispose = () => editor.stopApp()

  return { init, render, viewStyleB, filesB, isLoadingB, activeFileB, dispose }
})