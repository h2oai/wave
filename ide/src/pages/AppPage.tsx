import React from 'react';
import * as Fluent from '@fluentui/react'
import { useRouteMatch } from 'react-router-dom';
import { Editor } from '@/components/editor';
import makeLogo from '@static/make-logo.svg'

type FileToolbarProps = {
  isDirty: boolean
}
function FileToolbar({ isDirty }: FileToolbarProps) {
  return (
    <Fluent.Pivot linkSize={Fluent.PivotLinkSize.large}>
      <Fluent.PivotItem headerText={`app.py ${isDirty ? '*' : ''}`} />
    </Fluent.Pivot>
  )
}

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
function AppPageHeader({ appName, changeViewStyle }: AppPageHeaderProps) {
  const onLinkClick = (item?: Fluent.PivotItem) => {
    if (!item?.props.itemKey) throw new Error('PivotItem itemKey must be specified')
    changeViewStyle(item.props.itemKey as ViewType)
  }

  return (
    <Fluent.Stack horizontal horizontalAlign='space-between' verticalAlign='center'>
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
}

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

function AppPage() {
  const
    // TODO: Add proper typing.
    match = useRouteMatch("/app/:name"),
    appName = (match?.params as any).name || 'Untitled',
    [viewStyle, setViewStyle] = React.useState<ViewType>(ViewType.SPLIT),
    [isDirty, setIsDirty] = React.useState(false),
    changeViewStyle = React.useCallback((viewStyle: ViewType) => setViewStyle(viewStyle), []),
    setDirtyCallback = React.useCallback((val: boolean) => setIsDirty(val), [])


  return (
    <>
      <AppPageHeader appName={appName} changeViewStyle={changeViewStyle} />
      <FileToolbar isDirty={isDirty} />
      <Fluent.Stack horizontal styles={{ root: { margin: '5px 0px 20px 0px', width: '100%', height: 700 } }}>
        <div style={{ ...commonStyles, ...viewStyles[viewStyle].editor }}>
          <Editor appName={appName} setIsDirty={setDirtyCallback} />
        </div>
        <div style={{ ...commonStyles, ...viewStyles[viewStyle].app }}>
          <iframe src={`${IFRAME_URL}/${appName}`} width='100%' height='100%' frameBorder="0" />
        </div>
      </Fluent.Stack>
      <Fluent.Text styles={{ root: { textAlign: 'center', fontStyle: 'italic' } }} block>Tip: hit CTRL + S to save the content</Fluent.Text>
    </>
  )
}

export default AppPage