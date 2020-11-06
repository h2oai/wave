import Editor from '@/components/editor';
import { bond, box, Box } from '@/dataflow';
import * as Fluent from '@fluentui/react';
import makeLogo from '@static/make-logo.svg';
import React from 'react';
import { matchPath } from 'react-router-dom';

type FileToolbarProps = {
  isDirtyB: Box<boolean>
}
export const FileToolbar = bond(({ isDirtyB }: FileToolbarProps) => {
  const
    render = () => (
      <Fluent.Pivot linkSize={Fluent.PivotLinkSize.large}>
        <Fluent.PivotItem headerText={`app.py ${isDirtyB() ? '*' : ''}`} />
      </Fluent.Pivot>
    )
  return { render, isDirtyB }
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
    isDirtyB = box(false),
    render = () => (
      <>
        <AppPageHeader appName={appName} changeViewStyle={viewStyleB} />
        <FileToolbar isDirtyB={isDirtyB} />
        <Fluent.Stack horizontal styles={{ root: { marginTop: 5, width: '100%', height: 'calc(100vh - 122px)' } }}>
          <div style={{ ...commonStyles, ...viewStyles[viewStyleB()].editor }}>
            <Editor appName={appName} setIsDirty={isDirtyB} />
          </div>
          <div style={{ ...commonStyles, ...viewStyles[viewStyleB()].app }}>
            <iframe src={`${IFRAME_URL}/${appName}`} width='100%' height='100%' frameBorder="0" />
          </div>
        </Fluent.Stack>
      </>
    )
  return { render, viewStyleB, isDirtyB }
})