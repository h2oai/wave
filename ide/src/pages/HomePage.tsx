import { bond, box, store } from '@/dataflow';
import { list_apps } from "@/ide";
import * as Fluent from '@fluentui/react';
import makeLogo from '@static/make-logo.svg';
import React from 'react';
import { Link } from 'react-router-dom';
import { validateFileName } from '@/utils/validation';

export default bond(() => {
  const
    appNameB = box(''),
    recentAppsB = box<string[]>([]),
    hideDialog = () => store.dialogB(null),
    makeNewApp = () => {
      let appName = ''
      const onAppNameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newVal = '') => {
        appName = newVal
        const dialog = store.dialogB()
        if (dialog) store.dialogB({
          ...dialog, footer: (
            <Fluent.PrimaryButton disabled={!!validateFileName(appName)} onClick={hideDialog}>
              <Link to={`/app/${appName}`}>Submit</Link>
            </Fluent.PrimaryButton>
          )
        })
      }

      store.dialogB({
        title: 'App Setup',
        content: (
          <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
            <Fluent.TextField
              label='App name'
              onChange={onAppNameChange}
              required
              onGetErrorMessage={validateFileName}
              validateOnLoad={false} />
          </Fluent.DialogContent>
        ),
        footer: (
          <Fluent.PrimaryButton disabled>
            <Link to={`/app/${appNameB()}`}>Submit</Link>
          </Fluent.PrimaryButton>
        )
      })
    },
    init = async () => {
      let apps: string[] = []
      try {
        apps = await list_apps()
      } catch (err) {
        /* noop */
      } finally {
        recentAppsB(apps)
      }
    },
    render = () => (
      <>
        <Fluent.Stack horizontal horizontalAlign='space-between' styles={{ root: { margin: 10 } }}>
          <Fluent.Stack>
            <Fluent.Text variant='xxLargePlus'>Make</Fluent.Text>
            <Fluent.Link onClick={makeNewApp}>Make a new app...</Fluent.Link>
            <Fluent.Text variant='xxLargePlus'>Help</Fluent.Text>
            <Fluent.Link href='https://h2oai.github.io/wave/'>What is Wave?</Fluent.Link>
            <Fluent.Link href='https://h2oai.github.io/wave/docs/getting-started'>Getting started</Fluent.Link>
            <Fluent.Link>Build your first app</Fluent.Link>
            <Fluent.Text variant='xxLargePlus'>Recent Apps</Fluent.Text>
            {recentAppsB().map((app, i) => <Link key={i} to={`/app/${app}`}><Fluent.Link>{app}</Fluent.Link></Link>)}
          </Fluent.Stack>
          <Fluent.Image src={makeLogo} />
        </Fluent.Stack>
      </>
    )


  return { init, render, recentAppsB }
})