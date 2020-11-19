import Editor from '@/components/editor';
import { bond, box, Box, store } from '@/dataflow';
import { delete_file, list_files, read_file, rename_file, write_file } from '@/ide';
import { newEditor } from '@/model';
import { validateFileName } from '@/utils/validation';
import * as Fluent from '@fluentui/react';
import makeLogo from '@static/make-logo.svg';
import { Position } from "monaco-editor";
import React from 'react';
import { matchPath } from 'react-router-dom';

type FileActionsProps = {
  deleteFile: () => Promise<void>
  renameFile: (fileName: string) => Promise<void>
  fileNameValidation: (val: string) => string
  activeFileB: Box<string>
}

const FileActions = bond(({ deleteFile, renameFile, activeFileB, fileNameValidation }: FileActionsProps) => {
  const
    onDeleteFile = () => {
      store.dialogB({
        title: 'Delete File',
        content: (
          <Fluent.DialogContent styles={{ header: { display: 'none' } }}>
            <Fluent.Text block>Are you sure you want to proceed?</Fluent.Text>
          </Fluent.DialogContent>
        ),
        footer: <Fluent.PrimaryButton text='Submit' onClick={deleteFile} />
      })
    },
    onRenameFile = () => {
      const
        onRenameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newName = '') => {
          const dialog = store.dialogB()
          if (dialog) {
            const
              isDisabled = !!fileNameValidation(newName),
              submit = () => renameFile(newName)
            store.dialogB({ ...dialog, footer: <Fluent.PrimaryButton text='Submit' onClick={submit} disabled={isDisabled} /> })
          }
        }

      store.dialogB({
        title: 'Rename File',
        content: (
          <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
            <Fluent.TextField
              label='File name'
              suffix='.py'
              defaultValue={activeFileB().substring(0, activeFileB().length - 3)}
              required
              onGetErrorMessage={fileNameValidation}
              validateOnLoad={false}
              onChange={onRenameChange}
            />
          </Fluent.DialogContent>
        ),
        footer: <Fluent.PrimaryButton text='Submit' disabled />
      })
    },
    commands: Fluent.ICommandBarItemProps[] = [
      {
        key: 'delete',
        iconOnly: true,
        iconProps: { iconName: 'Delete' },
        onClick: onDeleteFile,
        tooltipHostProps: { content: 'Delete File' },
        buttonStyles: { root: { background: 'transparent' } },
      },
      {
        key: 'rename',
        iconOnly: true,
        iconProps: { iconName: 'Edit' },
        tooltipHostProps: { content: 'Rename File' },
        onClick: onRenameFile,
        buttonStyles: { root: { background: 'transparent' } }
      }
    ],
    render = () => (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Fluent.CommandBar items={commands} styles={{ root: { background: 'transparent' } }} />
      </div>
    )
  return { render, activeFileB }
})

type FileToolbarProps = {
  filesB: Box<File[]>
  activeFileB: Box<string>
  fileNameValidation: (val: string) => string
  addNewFile: (fileName: string) => Promise<void>
  readFile: (fileName: string) => Promise<void>
}

const FileToolbar = bond(({ addNewFile, readFile, filesB, activeFileB, fileNameValidation }: FileToolbarProps) => {
  const
    onAddFile = () => {
      const
        onNameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, fileName = '') => {
          const dialog = store.dialogB()
          if (dialog) {
            const
              isDisabled = !!fileNameValidation(fileName),
              submit = () => addNewFile(fileName)
            store.dialogB({ ...dialog, footer: <Fluent.PrimaryButton text='Submit' onClick={submit} disabled={isDisabled} /> })
          }
        }

      store.dialogB({
        title: 'Add new file',
        content: (
          <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
            <Fluent.TextField
              label='File name'
              suffix='.py'
              required
              onGetErrorMessage={fileNameValidation}
              validateOnLoad={false}
              onChange={onNameChange}
            />
          </Fluent.DialogContent>
        ),
        footer: <Fluent.PrimaryButton text='Submit' disabled />
      })
    },
    onLinkClick = (item?: Fluent.PivotItem) => {
      if (!item) return
      const selectedFile = item.props.itemKey || 'app.py'
      activeFileB(selectedFile)
      readFile(item.props.itemKey || 'app.py')
    },
    onRenderItemLink = (isDirty: boolean) => (props?: Fluent.IPivotItemProps, defaultRenderer?: (link?: Fluent.IPivotItemProps) => JSX.Element | null) =>
      !props || !defaultRenderer ? null : (
        <span style={{ position: 'relative' }}>
          {defaultRenderer(props)}
          {isDirty && <span style={{ position: 'absolute', top: -5, right: -10 }}>*</span>}
        </span>
      )
    ,
    render = () => (
      <>
        <Fluent.Stack horizontal verticalAlign='center'>
          <Fluent.Pivot selectedKey={activeFileB()} linkSize={Fluent.PivotLinkSize.large} onLinkClick={onLinkClick}>
            {filesB().map(({ name, isDirty }) => <Fluent.PivotItem key={name} itemKey={name} headerText={name} onRenderItemLink={onRenderItemLink(isDirty)} />)}
          </Fluent.Pivot>
          <Fluent.TooltipHost content="Add another file" id='add-file-tooltip'>
            <Fluent.IconButton data-test='add-file' iconProps={{ iconName: 'Add' }} onClick={onAddFile} />
          </Fluent.TooltipHost>
        </Fluent.Stack>
      </>
    )

  return { render, filesB, activeFileB }
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

const AppPageHeader = bond(({ appName, changeViewStyle }: AppPageHeaderProps) => {
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

type File = {
  name: string,
  isDirty: boolean
}

export default bond(() => {
  const
    appName = matchPath<{ name: string }>(window.location.pathname, { path: `${BASENAME ? `/${BASENAME}` : ''}/app/:name` })?.params.name || 'Untitled',
    viewStyleB = box<ViewType>(ViewType.SPLIT),
    filesB = box<File[]>([]),
    activeFileB = box('app.py'),
    editor = newEditor(appName),
    isLoadingB = box(true),
    dirtyFileContentMap = new Map<string, string>(),
    fileCursorPositionMap = new Map<string, Position | null>(),
    loadFiles = async (nextActiveFile?: string) => {
      const files = await list_files(appName)
      filesB(files.map(name => ({ name, isDirty: false })))
      if (files.length) {
        const activeFile = nextActiveFile || files[0];
        activeFileB(activeFile)
        await readFile(activeFile)
      }
    },
    addNewFile = async (fileName: string) => {
      fileName = `${fileName}.py`
      const content = ''
      await write_file(appName, fileName, content)
      await loadFiles(fileName)
      store.dialogB(null)
    },
    fileNameValidation = (val: string) => validateFileName(val, filesB().map(f => f.name)),
    readFile = async (fileName: string) => {
      const content = dirtyFileContentMap.get(fileName) || await read_file(appName, fileName)
      editor.contentB(content)
      editor.cursorPositionB(fileCursorPositionMap.get(fileName) || null)
    },
    deleteFile = async () => {
      fileCursorPositionMap.delete(activeFileB())
      await delete_file(appName, activeFileB())
      await loadFiles()
      store.dialogB(null)
    },
    renameFile = async (newName: string) => {
      newName = `${newName}.py`

      fileCursorPositionMap.set(newName, fileCursorPositionMap.get(activeFileB()) || null)
      fileCursorPositionMap.delete(activeFileB())

      await rename_file(appName, activeFileB(), newName)
      await loadFiles(newName)

      store.dialogB(null)
      editor.cursorPositionB(fileCursorPositionMap.get(newName) || null)
    },
    onContentSave = async (newContent: string) => {
      await write_file(appName, activeFileB(), newContent)
      dirtyFileContentMap.delete(activeFileB())
      onDirtyChange()
    },
    onContentChange = (newContent: string) => {
      dirtyFileContentMap.set(activeFileB(), newContent)
      onDirtyChange()
    },
    onCursorChange = (position: Position | null) => fileCursorPositionMap.set(activeFileB(), position),
    onDirtyChange = () => filesB(filesB().map(({ name }) => ({ name, isDirty: dirtyFileContentMap.has(name) }))),
    init = async () => {
      await editor.createAppIfNotExists()
      await loadFiles()

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
                <FileToolbar addNewFile={addNewFile} readFile={readFile} filesB={filesB} activeFileB={activeFileB} fileNameValidation={fileNameValidation} />
                <Fluent.Stack horizontal styles={{ root: { marginTop: 5, width: '100%', height: 'calc(100vh - 122px)' } }}>
                  <div data-test='editor-window' style={{ position: 'relative', ...commonStyles, ...viewStyles[viewStyleB()].editor }}>
                    <Editor
                      contentB={editor.contentB}
                      cursorPositionB={editor.cursorPositionB}
                      onContentSave={onContentSave}
                      onContentChange={onContentChange}
                      onCursorChange={onCursorChange}
                    />
                    <FileActions
                      activeFileB={activeFileB}
                      deleteFile={deleteFile}
                      fileNameValidation={fileNameValidation}
                      renameFile={renameFile}
                    />
                  </div>
                  <div data-test='app-window' style={{ ...commonStyles, ...viewStyles[viewStyleB()].app }}>
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