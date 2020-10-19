import * as Fluent from '@fluentui/react'
import React from 'react'
import { bond, S, B, U } from './qd'
import { stylesheet } from 'typestyle'
import { getTheme, rem, mobileBreakpoint } from './theme'

/**
 * Create a step for a stepper.
 */
interface Step {
  /** Text displayed below icon. */
  label: S
  /** Icon to be displayed. */
  icon?: S
  /** Indicates whether this step has already been completed. */
  done?: B
}

/**
  Create a component that displays a sequence of steps in a process.
  The steps keep users informed about where they are in the process and how much is left to complete.
*/
export interface Stepper {
  /** An identifying name for this component. */
  name: S
  /** The sequence of steps to be displayed. */
  items: Step[]
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  { colors } = getTheme(),
  css = stylesheet({
    container: {
      $nest: {
        ...mobileBreakpoint({
          justifyContent: 'center',
          $nest: {
            // Hide separators on mobile.
            '>div:nth-child(even)': {
              display: 'none'
            }
          }
        })
      }
    },
    stepNumber: {
      background: colors.text,
      color: colors.card,
      alignItems: 'center',
      borderRadius: '50%',
      display: 'inline-flex',
      justifyContent: 'center',
      fontSize: rem(0.8),
      height: 24,
      minWidth: 24,
      width: 24,
    },
    disabled: {
      opacity: 0.5,
      $nest: {
        ...mobileBreakpoint({
          display: 'none'
        })
      }
    },
    done: {
      $nest: {
        ...mobileBreakpoint({
          display: 'none'
        })
      }
    }
  }),
  iconStyles: Fluent.IIconStyles = { root: { fontSize: 24 } }

export const
  XStepper = bond(({ model: m }: { model: Stepper }) => {
    const
      steps = m.items,
      disabledStyles = (stepIdx: U) => stepIdx > 0 && !steps[stepIdx - 1].done ? css.disabled : '',
      createStep = (step: Step, i: U) => (
        <React.Fragment key={i}>
          <Fluent.Stack
            className={step.done ? css.done : disabledStyles(i)}
            horizontalAlign='center'
            styles={{ root: { paddingRight: 10, paddingLeft: 10 } }}
          >
            {
              step.done
                ? <Fluent.Icon styles={iconStyles} iconName='CompletedSolid' />
                : step.icon
                  ? <Fluent.Icon styles={iconStyles} iconName={step.icon} />
                  : <span className={css.stepNumber}>{i + 1}</span>
            }
            <Fluent.Text block nowrap styles={{ root: { padding: 10 } }}>{step.label}</Fluent.Text>
          </Fluent.Stack>
          {(steps.length - 1) !== i && <Fluent.Separator styles={{ root: { width: '100%' } }} />}
        </React.Fragment>
      ),
      render = () => (
        <Fluent.Stack
          data-test={m.name}
          className={css.container}
          horizontal
          horizontalAlign='space-between'
          verticalAlign='center'
        >
          {steps.map(createStep)}
        </Fluent.Stack>
      )

    return { render }
  })