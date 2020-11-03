import React from 'react';
import * as Fluent from '@fluentui/react'
import { useRouteMatch } from 'react-router-dom';
import { Editor } from '../components/editor';

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
        <Fluent.Image src='/static/make-logo.svg' />
        <Fluent.Text variant='xxLargePlus' styles={{ root: { padding: 15 } }}>{appName}</Fluent.Text>
      </Fluent.Stack>
      <Fluent.Stack horizontal>
        <Fluent.Pivot onLinkClick={onLinkClick} linkSize={Fluent.PivotLinkSize.large}>
          <Fluent.PivotItem itemKey={ViewType.SPLIT} headerText='Split screen' itemIcon='Split' />
          <Fluent.PivotItem itemKey={ViewType.CODE} headerText='Code only' itemIcon='CodeEdit' />
          <Fluent.PivotItem itemKey={ViewType.PREVIEW} headerText='Preview only' itemIcon='TVMonitor' />
        </Fluent.Pivot>
      </Fluent.Stack>
    </Fluent.Stack>
  )
}

const viewStyles: { [K in ViewType]: { [K in View]: React.CSSProperties } } = {
  split: {
    editor: { width: '50%' },
    app: { width: '50%' }
  },
  code: {
    editor: { width: '100%' },
    app: { width: 0, visibility: 'hidden' }
  },
  preview: {
    editor: { width: 0, visibility: 'hidden' },
    app: { width: '100%' }
  },
}

function AppPage() {
  const
    // TODO: Add proper typing.
    match = useRouteMatch("/app/:name"),
    [viewStyle, setViewStyle] = React.useState<ViewType>(ViewType.SPLIT),
    changeViewStyle = React.useCallback((viewStyle: ViewType) => setViewStyle(viewStyle), [])

  return (
    <>
      <AppPageHeader appName={(match?.params as any).name || 'Untitled'} changeViewStyle={changeViewStyle} />
      <Fluent.Stack horizontal styles={{ root: { margin: '20px 0', width: '100%', height: 700 } }}>
        <div style={{ height: '100%', ...viewStyles[viewStyle].editor }}>
          <Editor />
        </div>
        <div style={{ height: '100%', ...viewStyles[viewStyle].app }}>
          <iframe width='100%' height='100%' />
        </div>
      </Fluent.Stack>
      <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Tip: hit CTRL + S to save the content</p>
    </>
  )
}

export default AppPage