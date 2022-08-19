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
import { cssVar, cssVarValue } from './theme'
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
    /** Specifies 12-hour or 24-hour time format. One of `h12` or `h24`. Defaults to `h24`. */
    time_format?: 'h12' | 'h24'
    /** The minimum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '13:45', '01:45pm' */
    min?: S
    /** The maximum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '18:45', '06:45pm' */
    max?: S
    /** Limits the available minutes to select from. One of `1`, `5`, `10`, `15`, `20`, `30` or `60`. Defaults to `1`. */
    minutes_step?: U
}

const
    css = stylesheet({
        toolbarTime: {
            fontSize: 26,
            cursor: 'pointer',
            $nest: {
                '&:hover': {
                    backgroundColor: cssVar('$neutralLighter'),
                    color: cssVar('$neutralDark')
                }
            }
        }
    }),
    popoverProps: Partial<PopperProps> | undefined = {
        placement: 'bottom-start',
        sx: {
            '& .MuiPaper-root': {
                borderRadius: '2px',
                boxShadow: 'rgb(0 0 0 / 13%) 0px 6.4px 14.4px 0px, rgb(0 0 0 / 11%) 0px 1.2px 3.6px 0px'
            },
            '& .MuiTypography-root': {
                fontFamily: 'Inter',
            }
        }
    }

const
    ThemeProvider = React.lazy(() => import('@mui/material/styles').then(({ ThemeProvider }) => ({ default: ThemeProvider }))),
    LocalizationProvider = React.lazy(() => import('@mui/x-date-pickers').then(({ LocalizationProvider }) => ({ default: LocalizationProvider }))),
    TimePicker = React.lazy(() => import('@mui/x-date-pickers').then(({ TimePicker }) => ({ default: TimePicker }))),
    parseTimeToDate = (time: S) => {
        const date = new Date(`2000-01-01T${time.slice(0, 5)}:00`)
        if (time?.endsWith('pm')) date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
        return date
    },
    formatDateToTimeString = (d: Date, time_format: 'h12' | 'h24' = 'h24') => {
        const
            hours = d.getHours(),
            minutes = d.getMinutes(),
            hoursAmPm = time_format === 'h12' ? (hours >= 13 ? hours - 12 : (hours < 1 ? (hours + 12) : hours)) : hours,
            hoursStr = hoursAmPm.toString().padStart(2, '0'),
            minutesStr = minutes.toString().padStart(2, '0')
        return `${hoursStr}:${minutesStr}${time_format === 'h12' ? (hours >= 12 ? ' pm' : ' am') : ''}`
    },
    LazyLoadPlaceholder = () =>
        <div style={{ height: 59 }}>
            <Fluent.Spinner styles={{ root: { height: '100%' } }} size={Fluent.SpinnerSize.small} />
        </div>,
    // Type 'any' instead of 'Date' because of warning when TimePicker is lazy loaded.
    Toolbar = ({ params, label, switchAmPm }: { params: BaseToolbarProps<any, any | null>, label: S | undefined, switchAmPm: () => void }) => {
        const
            { parsedValue, setOpenView, ampm } = params,
            time = parsedValue
                // https://github.com/moment/luxon/issues/726
                ? parsedValue.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: ampm ? 'h12' : 'h23' })
                : '--:--'

        return (
            <div style={{ paddingTop: 16, paddingLeft: 16 }}>
                {label && <Fluent.Label style={{ maxWidth: '70%' }}>{label}</Fluent.Label>}
                <Fluent.Text style={{ fontSize: 26 }}>
                    <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('hours')}>{`${time.substring(0, 2)}`}</Fluent.Text>
                    {':'}
                    <Fluent.Text className={css.toolbarTime} onClick={() => setOpenView('minutes')}>{`${time.substring(3, 5)}`}</Fluent.Text>
                    {' '}
                    <Fluent.Text className={css.toolbarTime} onClick={switchAmPm}>{`${time.substring(6, 8) || ''}`}</Fluent.Text>
                </Fluent.Text>
            </div>
        )
    }


export const
    XTimePicker = ({ model: m }: { model: TimePicker }) => {
        const
            defaultVal = m.value ? parseTimeToDate(m.value) : null,
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
                wave.args[m.name] = time ? formatDateToTimeString(time, m.time_format) : null
                if (m.trigger) wave.push()
            },
            // TODO: test component with all wave themes
            [AdapterDateFns, setAdapterDateFns] = React.useState<typeof DateFnsUtils>(),
            [theme, setTheme] = React.useState<Theme>(),
            getAdapterDateFns = async () => await import('@mui/x-date-pickers/AdapterDateFns').then(({ AdapterDateFns }) => AdapterDateFns),
            getTheme = async () => await import('@mui/material/styles').then(({ createTheme }) =>
                createTheme({
                    palette: {
                        background: {
                            paper: cssVar('$card')
                        },
                        primary: {
                            // Not all of MUI's components support css variables yet - cssVarValue used instead.
                            main: cssVarValue('$themePrimary')
                        },
                        text: {
                            primary: cssVar('$neutralPrimary'),
                            secondary: cssVar('$themeLight'),
                            disabled: cssVar('$neutralTertiaryAlt'),
                        },
                        action: {
                            active: cssVarValue('$themePrimary'),
                            disabled: cssVar('$neutralLight'),
                            hover: cssVar('$neutralLight'),
                            hoverOpacity: 0.04
                        }
                    },
                })
            )


        React.useEffect(() => {
            wave.args[m.name] = defaultVal ? formatDateToTimeString(defaultVal, m.time_format) : null
            getTheme().then(theme => setTheme(theme))
            getAdapterDateFns().then(adapter => setAdapterDateFns(() => adapter))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <>
                <React.Suspense fallback={<LazyLoadPlaceholder />}>
                    {theme && AdapterDateFns ? <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                value={value}
                                label={m.label}
                                open={isDialogOpen}
                                onChange={(value, _keyboardInputValue) => setValue(value as Date)}
                                onAccept={(value) => onSelectTime(value as Date)}
                                onClose={() => setIsDialogOpen(false)}
                                ampm={m.time_format === 'h12'}
                                showToolbar={true}
                                ToolbarComponent={params => <Toolbar params={params} label={m.label} switchAmPm={switchAmPm} />}
                                renderInput={({ inputProps, error, disabled }: TextFieldProps) =>
                                    <div ref={textInputRef}>
                                        <Fluent.TextField
                                            iconProps={{ iconName: 'Clock', }}
                                            onClick={() => setIsDialogOpen(true)}
                                            styles={{
                                                field: { cursor: 'pointer' },
                                                icon: { bottom: 7 }
                                            }}
                                            onChange={inputProps?.onChange}
                                            placeholder={m.placeholder || 'Select a time'}
                                            disabled={disabled}
                                            errorMessage={
                                                error
                                                    ? `Wrong input. Please enter the time in range from ${m.min || (inputProps?.ampm ? '12:00am' : '00:00')} to ${m.max || (inputProps?.ampm ? '12:00am' : '00:00')}.`
                                                    : undefined
                                            }
                                            readOnly={true}
                                            value={value ? formatDateToTimeString(value, m.time_format) : ''}
                                            label={m.label}
                                            required={m.required}
                                        />
                                    </div>
                                }
                                PopperProps={{ anchorEl: () => textInputRef.current as VirtualElement, ...popoverProps }}
                                minTime={m.min ? parseTimeToDate(m.min) : undefined}
                                maxTime={m.max ? parseTimeToDate(m.max) : undefined}
                                minutesStep={[1, 5, 10, 15, 20, 30, 60].includes(m.minutes_step || 1) ? m.minutes_step : 1}
                                disabled={m.disabled}
                                onOpen={() => {
                                    // HACK: https://stackoverflow.com/questions/70106353/material-ui-date-time-picker-safari-browser-issue
                                    setTimeout(() => {
                                        const el = document.activeElement
                                        if (el) (el as HTMLElement).blur()
                                    })
                                }}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                        : <LazyLoadPlaceholder />
                    }
                </React.Suspense>
            </>
        )
    }