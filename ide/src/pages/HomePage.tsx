import React from 'react';
import * as Fluent from '@fluentui/react'
import { useHistory } from 'react-router-dom';
import makeLogo from '@static/make-logo.svg'
import { list_apps } from "@/ide";


function HomePage() {
  const
    [appName, setAppName] = React.useState(''),
    [appNameErr, setAppNameErr] = React.useState(''),
    [dialogHidden, setDialogHidden] = React.useState(true),
    [recentApps, setRecentApps] = React.useState<string[]>([]),
    history = useHistory(),
    toggleDialog = () => setDialogHidden(!dialogHidden),
    dialogContentProps: Fluent.IDialogContentProps = {
      title: 'App setup',
      onDismiss: toggleDialog
    },
    onAppNameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val = '') => {
      setAppNameErr(/^\w+$/.test(val) ? '' : 'An app name can contain only word characters, numbers and underscore ("-")')
      setAppName(val)
    },
    startApp = (appName: string) => () => history.push(`/app/${appName}`)

  React.useEffect(() => {
    const init = async () => {
      let apps: string[] = []
      try {
        apps = await list_apps()
      } catch (err) {
        /* noop */
      } finally {
        setRecentApps(apps)
      }
    }
    init()
  }, [])

  return (
    <>
      <Fluent.Stack horizontal horizontalAlign='space-between'>
        <Fluent.Stack>
          <Fluent.Text variant='xxLargePlus'>Make</Fluent.Text>
          <Fluent.Link onClick={toggleDialog}>Make a new app...</Fluent.Link>
          <Fluent.Text variant='xxLargePlus'>Help</Fluent.Text>
          <Fluent.Link href='https://h2oai.github.io/wave/'>What is Wave?</Fluent.Link>
          <Fluent.Link href='https://h2oai.github.io/wave/docs/getting-started'>Getting started</Fluent.Link>
          <Fluent.Link>Build your first app</Fluent.Link>
          <Fluent.Text variant='xxLargePlus'>Recent Apps</Fluent.Text>
          {recentApps.map((app, i) => <Fluent.Link key={i} onClick={startApp(app)}>{app}</Fluent.Link>)}
        </Fluent.Stack>
        <Fluent.Image src={makeLogo} />
      </Fluent.Stack>
      <Fluent.Dialog hidden={dialogHidden} dialogContentProps={dialogContentProps} minWidth={600} styles={{}}>
        <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
          <Fluent.TextField label='App name' value={appName} onChange={onAppNameChange} required errorMessage={appNameErr} />
        </Fluent.DialogContent>
        <Fluent.DialogFooter>
          <Fluent.DefaultButton onClick={toggleDialog} text="Cancel" />
          <Fluent.PrimaryButton onClick={startApp(appName)} disabled={!!appNameErr} text="Submit" />
        </Fluent.DialogFooter>
      </Fluent.Dialog>
    </>
  )
}

export default HomePage