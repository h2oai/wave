import * as Fluent from '@fluentui/react'
import React from 'react'
import { cards } from './grid_layout'
import { bond, Card, S } from './qd'
import { margin, padding, pc } from './theme'

/** Specify a button that leads a user to his first step in your app. */
interface CallToActionButton {
  /** Label displayed on a button. */
  label: S,
  /** Route link to go to after clicking. Has to start with #. */
  name: S
}

/** Creates a feature section you can use to provide a reasons for using your app */
interface Feature {
  /** Feature icon. */
  icon: S
  /** Feature title. */
  title: S
  /** Feature description. */
  description: S
}

/** Create a landing page card. */
export interface State {
  /** Landing page header. */
  header: S
  /** Landing page subheader. */
  subheader: S
  /** App image name located in www folder. */
  image: S
  /** Call to action button to guide user to the next step in using your app. */
  call_to_action_button: CallToActionButton
  /** The navigation groups contained in this pane. */
  features?: Feature[]
}

type CTAButtonProps = {
  ctaButton: CallToActionButton
}

const CTAButton = ({ ctaButton }: CTAButtonProps) => {
  const onClick = () => {
    if (ctaButton.name.startsWith('#')) {
      window.location.hash = ctaButton.name.substr(1)
    }
  }
  return <Fluent.PrimaryButton data-test='call-to-action' styles={{ root: { height: 60, width: 240, fontSize: 20 } }} text={ctaButton.label} onClick={onClick} />
}

export const View = bond(({ state, changed }: Card<State>) => {
  const
    getFeatures = () => state.features?.length ? state.features.map(({ icon, title, description }, i) => (
      <Fluent.StackItem key={i} styles={{ root: { maxWidth: 300, padding: 30, textAlign: 'center' } }}>
        <Fluent.Icon iconName={icon} styles={{ root: { fontSize: 48 } }} />
        <Fluent.Text block variant='xLarge' styles={{ root: { padding: padding(15, 0) } }}>{title}</Fluent.Text>
        <Fluent.Text block variant='medium' styles={{ root: { lineHeight: 25 } }}>{description}</Fluent.Text>
      </Fluent.StackItem>
    )) : null,
    render = () => (
      <>
        <Fluent.Stack horizontal wrap horizontalAlign='space-between' verticalAlign='center'>
          <Fluent.StackItem styles={{ root: { padding: 30, maxWidth: 700, margin: '0 auto' } }}>
            <Fluent.Text block variant='xxLargePlus' styles={{ root: { padding: padding(15, 0) } }}>{state.header}</Fluent.Text>
            <Fluent.Text variant='mediumPlus' styles={{ root: { padding: padding(15, 0), lineHeight: 30 } }} block>{state.subheader}</Fluent.Text>
            <div style={{ padding: padding(15, 0) }}>
              {!state.features?.length && <CTAButton ctaButton={state.call_to_action_button} />}
            </div>
          </Fluent.StackItem>
          <Fluent.StackItem styles={{ root: { margin: '0 auto' } }}>
            <Fluent.Image src={state.image} styles={{ image: { width: pc(100), maxWidth: 650, height: 'auto' } }} />
          </Fluent.StackItem>
        </Fluent.Stack>
        <Fluent.Stack horizontal wrap horizontalAlign='center' styles={{ root: { margin: margin(30, 0) } }}>
          {getFeatures()}
        </Fluent.Stack>
        <Fluent.Stack horizontalAlign='center'>
          {!!state.features?.length && (
            <div style={{ padding: padding(15, 0) }}>
              <CTAButton ctaButton={state.call_to_action_button} />
            </div>
          )}
        </Fluent.Stack>
      </>
    )
  return { render, changed }
})

cards.register('landing_page', View)