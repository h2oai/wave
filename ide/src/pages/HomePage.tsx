import { bond, box } from '@/dataflow';
import { list_apps } from "@/ide";
import * as Fluent from '@fluentui/react';
import makeLogo from '@static/make-logo.svg';
import React from 'react';
import { Link } from 'react-router-dom';

export default bond(() => {
  const
    appNameB = box(''),
    appNameErrB = box(''),
    dialogHiddenB = box(true),
    recentAppsB = box<string[]>([]),
    toggleDialog = () => dialogHiddenB(!dialogHiddenB()),
    dialogContentProps: Fluent.IDialogContentProps = {
      title: 'App setup',
      onDismiss: toggleDialog
    },
    onAppNameChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val = '') => {
      appNameErrB(/^\w+$/.test(val) ? '' : 'An app name can contain only word characters, numbers and underscore ("_")')
      appNameB(val)
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
            <Fluent.Link onClick={toggleDialog}>Make a new app...</Fluent.Link>
            <Fluent.Text variant='xxLargePlus'>Help</Fluent.Text>
            <Fluent.Link href='https://h2oai.github.io/wave/'>What is Wave?</Fluent.Link>
            <Fluent.Link href='https://h2oai.github.io/wave/docs/getting-started'>Getting started</Fluent.Link>
            <Fluent.Link>Build your first app</Fluent.Link>
            <Fluent.Text variant='xxLargePlus'>Recent Apps</Fluent.Text>
            {recentAppsB().map((app, i) => <Link key={i} to={`/app/${app}`}><Fluent.Link>{app}</Fluent.Link></Link>)}
          </Fluent.Stack>
          <Fluent.Image src={makeLogo} />
        </Fluent.Stack>
        <Fluent.Dialog hidden={dialogHiddenB()} dialogContentProps={dialogContentProps} minWidth={600} styles={{}}>
          <Fluent.DialogContent styles={{ header: { display: 'none' }, inner: { minHeight: 85 } }}>
            <Fluent.TextField label='App name' value={appNameB()} onChange={onAppNameChange} required errorMessage={appNameErrB()} />
          </Fluent.DialogContent>
          <Fluent.DialogFooter>
            <Fluent.DefaultButton onClick={toggleDialog} text="Cancel" />
            <Fluent.PrimaryButton disabled={!!appNameErrB() || !appNameB()}>
              <Link to={`/app/${appNameB()}`}>Submit</Link>
            </Fluent.PrimaryButton>
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      </>
    )


  return { init, render, appNameB, appNameErrB, dialogHiddenB, recentAppsB }
})