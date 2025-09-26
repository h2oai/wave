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
import { B, D, Id, S, U } from './core'
import { cssVar } from './theme'
import { wave } from './ui'
import { stylesheet } from 'typestyle'
import { PopperProps, Theme, ThemeOptions } from '@mui/material'
import DateFnsUtils from '@date-io/date-fns'
import { VirtualElement } from '@popperjs/core/lib'
import { CalendarOrClockPickerView } from '@mui/x-date-pickers/internals/models'
import { format } from 'date-fns'
import { Z_INDEX } from './parts/styleConstants'

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
  /** The time value in hh:mm:ss format. E.g. '10:30:45', '14:25:30', '23:59:59', '00:00:00' */
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
  /** Specifies 12-hour or 24-hour time format. One of `12` or `24`. Defaults to `12`. */
  hour_format?: S
  /** The minimum allowed time value in hh:mm:ss format. E.g.: '08:00:00', '13:30:00' */
  min?: S
  /** The maximum allowed time value in hh:mm:ss format. E.g.: '15:30:00', '00:00:00' */
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
    toolbarAmPm: {
      fontSize: 16,
    },
    toolbarText: { fontSize: 26 },
    toolbarLabel: { maxWidth: '70%' }
  }),
  popoverProps: Partial<PopperProps> | undefined = {
    placement: 'bottom-start',
    sx: {
      zIndex: Z_INDEX.TIME_PICKER,
      '& .MuiPaper-root': {
        borderRadius: '2px',
        boxShadow: `${cssVar('$text1')} 0px 6.4px 14.4px 0px, ${cssVar('$text2')} 0px 1.2px 3.6px 0px`
      },
      '& .MuiTypography-root, [role=listbox]>span': {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      }
    }
  }

type ToolbarProps = { time: S | null, setOpenView: (view: CalendarOrClockPickerView) => void, label?: S }

const
  // TODO: Import 'ThemeProvider' directly from '@mui/material/styles/ThemeProvider', config Jest to transpile the module to prevent err.
  ThemeProvider = React.lazy(() => import('@mui/material/styles').then(({ ThemeProvider }) => ({ default: ThemeProvider }))),
  LocalizationProvider = React.lazy(() => import('@mui/x-date-pickers/LocalizationProvider').then(({ LocalizationProvider }) => ({ default: LocalizationProvider }))),
  TimePicker = React.lazy(() => import('@mui/x-date-pickers/TimePicker').then(({ TimePicker }) => ({ default: TimePicker }))),
  allowedMinutesSteps: { [key: U]: U } = { 1: 1, 5: 5, 10: 10, 15: 15, 20: 20, 30: 30, 60: 60 },
  normalize = (time: S) => `2000-01-01T${time.slice(0, 8)}`,
  isBelowMin = (time: Date, minTime: Date) => time < minTime,
  isOverMax = (time: Date, maxTime: Date) => time > maxTime,
  isOutOfBounds = (time: Date, minTime: Date, maxTime: Date) => isBelowMin(time, minTime) || isOverMax(time, maxTime),
  parseTimeStringToDate = (time: S) => new Date(normalize(time)),
  useTime = (themeObj: ThemeOptions) => {
    const
      [theme, setTheme] = React.useState<Theme>(),
      [AdapterDateFns, setAdapterDateFns] = React.useState<typeof DateFnsUtils | null>(),
      [formatF, setFormatF] = React.useState<typeof format>()

    React.useEffect(() => {
      import('@mui/x-date-pickers/AdapterDateFns').then(({ AdapterDateFns }) => setAdapterDateFns(() => AdapterDateFns))
      // TODO: Import 'createTheme' directly from '@mui/material/styles/createTheme', config Jest to transpile the module to prevent err.
      import('@mui/material/styles').then(({ createTheme }) => setTheme(createTheme(themeObj)))
      // TODO: Import 'format' directly from 'date-fns/esm/format', config Jest to transpile the module to prevent err.
      import('date-fns/format').then(({ default: format }) => setFormatF(() => format))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { theme, AdapterDateFns, format: formatF }
  },
  LazyLoadPlaceholder = () =>
    <div data-test='lazyload' style={{ height: 59 }}>
      <Fluent.Spinner styles={{ root: { height: '100%' } }} size={Fluent.SpinnerSize.small} />
    </div>,
  Toolbar = ({ setOpenView, time, label }: ToolbarProps) =>
    <div className={css.toolbar}>
      {label && <Fluent.Label className={css.toolbarLabel}>{label}</Fluent.Label>}
      <Fluent.Text className={css.toolbarText}>
        <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('hours')}>{time?.substring(0, 2) || '--'}</Fluent.Text>:
        <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('minutes')}>{time?.substring(3, 5) || '--'}</Fluent.Text>:
        <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('seconds')}>{time?.substring(6, 8) || '--'}</Fluent.Text>{' '}
        <Fluent.Text className={css.toolbarAmPm}>{time?.substring(9, 11) || ''}</Fluent.Text>
      </Fluent.Text>
    </div>


export const
  XTimePicker = ({ model: m }: { model: TimePicker }) => {
    const
      { hour_format = '12', label, disabled, min, max, placeholder, required, minutes_step = 1 } = m,
      [value, setValue] = React.useState(m.value ? parseTimeStringToDate(m.value) : null),
      [isDialogOpen, setIsDialogOpen] = React.useState(false),
      textInputRef = React.useRef<HTMLDivElement | null>(null),
      popperRef = React.useRef<HTMLDivElement | null>(null),
      minTime = React.useMemo(() => parseTimeStringToDate(min || '00:00:00'), [min]),
      maxTime = React.useMemo(() => parseTimeStringToDate(max || '24:00:00'), [max]),
      onChangeTime = (time: unknown) => {
        if (!(time instanceof Date)) return
        const newValue = formatDateToTimeString(time, '24')
        const date = new Date(normalize(newValue))
        if (isOutOfBounds(date, minTime, maxTime)) return
        m.value = newValue
        wave.args[m.name] = newValue
        setValue(time)
      },
      onSelectTime = () => { if (m.trigger) wave.push() },
      // HACK: https://stackoverflow.com/questions/70106353/material-ui-date-time-picker-safari-browser-issue
      onOpen = () => setTimeout(() => (document.activeElement as HTMLElement)?.blur()),
      onBlur = (ev: React.FocusEvent) => {
        // Close the popover if the side panel or dialog opens.
        // TODO: Investigate why MUI dismiss on outer click handling doesn't work in this case.
        if (!ev.relatedTarget || !Fluent.elementContains(popperRef.current, ev.relatedTarget as HTMLElement)) setIsDialogOpen(false)
      },
      { palette: fluentPalette } = Fluent.useTheme(),
      themeObj = {
        palette: {
          background: {
            paper: cssVar('$card'),
          },
          primary: {
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
      },
      { format, AdapterDateFns, theme } = useTime(themeObj),
      formatDateToTimeString = React.useCallback((date: D, hour_format: S) => format ? format(date, hour_format === '12' ? 'hh:mm:ss aa' : 'HH:mm:ss') : '', [format])

    React.useEffect(() => {
      const time = m.value ? parseTimeStringToDate(m.value) : null
      const newTime = time && isBelowMin(time, minTime) ? minTime : time && isOverMax(time, maxTime) ? maxTime : time
      if (format) wave.args[m.name] = newTime ? formatDateToTimeString(newTime, '24') : null
      setValue(newTime)
    }, [format, formatDateToTimeString, m.name, m.value, maxTime, minTime])

    // TODO: Remove once CSS vars are fully supported - https://github.com/mui/material-ui/issues/27651
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
        {theme && AdapterDateFns && format
          ? <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={value}
                label={label}
                open={isDialogOpen}
                onChange={onChangeTime}
                onAccept={onSelectTime}
                onClose={() => setIsDialogOpen(false)}
                ampm={hour_format === '12'}
                showToolbar
                ToolbarComponent={({ parsedValue, setOpenView, ampm }) =>
                  // Traps focus inside the popover.
                  // TODO: Check why focus gets back to the textfield after opening the popover from dialog.
                  <Fluent.FocusTrapZone isClickableOutsideFocusTrap>
                    <Toolbar
                      setOpenView={setOpenView}
                      time={
                        parsedValue
                          ? formatDateToTimeString(value && isOutOfBounds(parsedValue as D, minTime, maxTime) ? value : parsedValue as D, ampm ? '12' : '24')
                          : null
                      }
                      label={label}
                    />
                  </Fluent.FocusTrapZone>
                }
                PopperProps={{ ref: popperRef, anchorEl: () => textInputRef.current as VirtualElement, onBlur, ...popoverProps }}
                minTime={min ? minTime : undefined}
                maxTime={max ? maxTime : undefined}
                minutesStep={allowedMinutesSteps[minutes_step]}
                disabled={disabled}
                onOpen={onOpen}
                renderInput={() =>
                  <div ref={textInputRef} data-test={m.name}>
                    <Fluent.TextField
                      iconProps={{ iconName: 'Clock' }}
                      onClick={() => setIsDialogOpen(true)}
                      placeholder={placeholder}
                      disabled={disabled}
                      readOnly
                      value={value ? formatDateToTimeString(value, hour_format) : ''}
                      label={label}
                      required={required}
                      styles={{ field: { cursor: 'pointer', height: 32 }, icon: { bottom: 7 } }}
                    />
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