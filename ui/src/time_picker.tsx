// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import * as Fluent from '@fluentui/react'
import { B, Id, S, U } from 'h2o-wave'
import { cssVar } from './theme'
import { wave } from './ui'
import { stylesheet } from 'typestyle'
import { PopperProps, TextFieldProps, Theme } from '@mui/material'
import DateFnsUtils from '@date-io/date-fns'
import { BaseToolbarProps } from '@mui/x-date-pickers/internals'
import { VirtualElement } from '@popperjs/core/lib'

/**
 * Create a time picker.
 *
 * A time picker allows a user to pick a time value.
 */

export interface TimePicker {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The time value in hh:mm or hh:mm(a|p)m format. E.g. '14:30', '2:30pm' */
  value?: S
  /** True if this field is disabled. */
  disabled?: B
  /** The width of the time picker, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** True if the form should be submitted when the time is selected. */
  trigger?: B
  /** True if this is a required field. Defaults to False. */
  required?: B
  /** True if time picker should use a 12-hour time format. Defaults to False. */
  time_format_12h?: B
  /** The minimum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '13:45', '01:45pm' */
  min?: S
  /** The maximum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '18:45', '06:45pm' */
  max?: S
  /** Limits the available minutes to select from. One of `1`, `5`, `10`, `15`, `20`, `30` or `60`. Defaults to `1`. */
  minutes_step?: U
}

const
  css = stylesheet({
    toolbar: {
      paddingTop: 16,
      paddingLeft: 16
    },
    toolbarTime: {
      fontSize: 26,
      cursor: 'pointer',
      $nest: {
        '&:hover': {
          backgroundColor: cssVar('$neutralLighter'),
          color: cssVar('$neutralDark')
        }
      }
    },
    toolbarText: { fontSize: 26 },
    toolbarLabel: { maxWidth: '70%' }
  }),
  popoverProps: Partial<PopperProps> | undefined = {
    placement: 'bottom-start',
    sx: {
      '& .MuiPaper-root': {
        borderRadius: '2px',
        boxShadow: `${cssVar('$text1')} 0px 6.4px 14.4px 0px, ${cssVar('$text2')} 0px 1.2px 3.6px 0px`
      },
      '& .MuiTypography-root': {
        fontFamily: 'Inter',
      }
    }
  }

// Type 'any' instead of 'Date' because of warning when TimePicker is lazy loaded.
type ToolbarProps = { params: BaseToolbarProps<any, any | null>, label: S | undefined, switchAmPm: () => void }
type TextInputProps = {
  props: {
    onClick?: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onChange?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    value?: Date | null,
    placeholder?: S,
    label?: S,
    required?: B,
    time_format_12h?: B,
    errorMsg?: S,
    error?: B,
    disabled?: B
  }
}

const
  ThemeProvider = React.lazy(() => import('@mui/material/styles').then(({ ThemeProvider }) => ({ default: ThemeProvider }))),
  LocalizationProvider = React.lazy(() => import('@mui/x-date-pickers').then(({ LocalizationProvider }) => ({ default: LocalizationProvider }))),
  TimePicker = React.lazy(() => import('@mui/x-date-pickers').then(({ TimePicker }) => ({ default: TimePicker }))),
  parseTimeStringToDate = (time: S) => {
    const date = new Date(`2000-01-01T${time.slice(0, 5)}:00`)
    const hours = date.getHours()
    if (time.endsWith('pm') && hours < 12) date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
    if (time.endsWith('am') && hours === 12) date.setTime(date.getTime() - 12 * 60 * 60 * 1000)
    return date
  },
  formatDateToTimeString = (date: Date, time_format_12h: B | undefined) => {
    const
      hours = date.getHours(),
      minutes = date.getMinutes(),
      hoursAmPm = time_format_12h && (hours < 1 || hours >= 13)
        ? hours >= 13 ? hours - 12 : hours + 12
        : hours,
      hoursStr = hoursAmPm.toString().padStart(2, '0'),
      minutesStr = minutes.toString().padStart(2, '0')
    return `${hoursStr}:${minutesStr}${time_format_12h ? (hours >= 12 ? ' pm' : ' am') : ''}`
  },
  LazyLoadPlaceholder = () =>
    <div data-test='lazyload' style={{ height: 59 }}>
      <Fluent.Spinner styles={{ root: { height: '100%' } }} size={Fluent.SpinnerSize.small} />
    </div>,
  Toolbar = ({ params: { parsedValue, setOpenView, ampm }, label, switchAmPm }: ToolbarProps) => {
    const time = parsedValue?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: ampm ? 'h12' : 'h23' })
    return <div className={css.toolbar}>
      {label && <Fluent.Label className={css.toolbarLabel}>{label}</Fluent.Label>}
      <Fluent.Text className={css.toolbarText}>
        <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('hours')}>{`${time?.substring(0, 2) || '--'}`}</Fluent.Text>{':'}
        <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('minutes')}>{`${time?.substring(3, 5) || '--'}`}</Fluent.Text>{' '}
        <Fluent.Text className={css.toolbarTime} onClick={switchAmPm}>{`${time?.substring(6, 8) || ''}`}</Fluent.Text>
      </Fluent.Text>
    </div>

  },
  TextInput = ({ props: { onClick, onChange, placeholder, value, label, required, time_format_12h, errorMsg, error, disabled } }: TextInputProps) =>
    <Fluent.TextField
      iconProps={{ iconName: 'Clock', }}
      onClick={onClick}
      onChange={onChange}
      placeholder={placeholder || 'Select a time'}
      disabled={disabled}
      readOnly={true}
      value={value ? formatDateToTimeString(value, time_format_12h) : ''}
      label={label}
      required={required}
      styles={{
        field: { cursor: 'pointer' },
        icon: { bottom: 7 }
      }}
      errorMessage={error ? errorMsg : undefined}
    />


export const
  XTimePicker = ({ model: m }: { model: TimePicker }) => {
    const
      defaultVal = m.value ? parseTimeStringToDate(m.value) : null,
      [value, setValue] = React.useState(defaultVal),
      [isDialogOpen, setIsDialogOpen] = React.useState(false),
      textInputRef = React.useRef<HTMLDivElement | null>(null),
      switchAmPm = () => {
        setValue((prevValue) => {
          const date = new Date(prevValue!)
          date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
          return date
        })
      },
      onSelectTime = (time: Date | null) => {
        wave.args[m.name] = time ? formatDateToTimeString(time, m.time_format_12h) : null
        if (m.trigger) wave.push()
      },
      onOpen = () => {
        // HACK: https://stackoverflow.com/questions/70106353/material-ui-date-time-picker-safari-browser-issue
        setTimeout(() => {
          const el = document.activeElement as HTMLElement
          if (el) el.blur()
        })
      },
      { palette: fluentPalette } = Fluent.useTheme(),
      [theme, setTheme] = React.useState<Theme | null>(),
      getTheme = () => import('@mui/material/styles').then(({ createTheme }) => {
        setTheme(createTheme(
          {
            palette: {
              background: {
                paper: cssVar('$card'),
              },
              primary: {
                // HACK: cssVar unsupported by some of the MUI theme properties yet https://github.com/mui/material-ui/issues/27651
                main: fluentPalette.themePrimary,
                contrastText: cssVar('$neutralLight')
              },
              text: {
                primary: fluentPalette.neutralPrimary,
                secondary: cssVar('$neutralSecondary'),
                disabled: cssVar('$neutralTertiaryAlt'),
              },
              action: {
                active: fluentPalette.themePrimary,
                disabled: cssVar('$neutralLight'),
                hover: cssVar('$neutralLight'),
                hoverOpacity: 0.04
              }
            },
          }
        ))
      }),
      [AdapterDateFns, setAdapterDateFns] = React.useState<typeof DateFnsUtils | null>(),
      getAdapterDateFns = () => import('@mui/x-date-pickers/AdapterDateFns').then(({ AdapterDateFns }) => { setAdapterDateFns(() => AdapterDateFns) }),
      textInputProps = {
        onClick: () => setIsDialogOpen(true),
        placeholder: m.placeholder,
        value,
        label: m.label,
        required: m.required,
        time_format_12h: m.time_format_12h,
        disabled: m.disabled,
        errorMsg: `Wrong input. Please enter the time in range from ${m.min || (m.time_format_12h ? '12:00am' : '00:00')} to ${m.max || (m.time_format_12h ? '12:00am' : '00:00')}.`
      }

    React.useEffect(() => {
      wave.args[m.name] = defaultVal ? formatDateToTimeString(defaultVal, m.time_format_12h) : null
      getTheme()
      getAdapterDateFns()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
      if (theme) {
        theme.palette.primary.main = fluentPalette.themePrimary
        theme.palette.text.primary = fluentPalette.neutralPrimary
        theme.palette.action.active = fluentPalette.themePrimary
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fluentPalette.themePrimary, theme])

    return <>
      <React.Suspense fallback={<LazyLoadPlaceholder />}>
        {theme && AdapterDateFns
          ? <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={value}
                label={m.label}
                open={isDialogOpen}
                onChange={(value, _keyboardInputValue) => setValue(value as Date)}
                onAccept={(value) => onSelectTime(value as Date)}
                onClose={() => setIsDialogOpen(false)}
                ampm={m.time_format_12h}
                showToolbar={true}
                ToolbarComponent={params => <Toolbar params={params} label={m.label} switchAmPm={switchAmPm} />}
                PopperProps={{ anchorEl: () => textInputRef.current as VirtualElement, ...popoverProps }}
                minTime={m.min ? parseTimeStringToDate(m.min) : undefined}
                maxTime={m.max ? parseTimeStringToDate(m.max) : undefined}
                minutesStep={[1, 5, 10, 15, 20, 30, 60].includes(m.minutes_step || 1) ? m.minutes_step : 1}
                disabled={m.disabled}
                onOpen={onOpen}
                renderInput={({ inputProps, error }: TextFieldProps) =>
                  <div ref={textInputRef} data-test={m.name}>
                    <TextInput props={{ onChange: inputProps?.onChange, error, ...textInputProps }} />
                  </div>
                }
              />
            </LocalizationProvider>
          </ThemeProvider>
          : <LazyLoadPlaceholder />
        }
      </React.Suspense>
    </>

  }