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
import { PopperProps, TextFieldProps } from '@mui/material'
import { BaseToolbarProps } from '@mui/x-date-pickers/internals'
import { VirtualElement } from '@popperjs/core/lib'

/**
 * Create a timepicker.
 *
 * TODO: description
 */
// TODO: check API descriptions

export interface TimePicker {
    /** An identifying name for this component. */
    name: Id
    /** Text to be displayed alongside the component. */
    label?: S
    /** Default time selected in hh:mm or hh:mm(a|p)m format. E.g. '14:30', '2:30pm' */
    value?: S
    /** True if this field is disabled. */
    disabled?: B
    /** The width of the combobox, e.g. '100px'. Defaults to '100%'. */
    width?: S
    /** True if the component should be visible. Defaults to True. */
    visible?: B
    /** True if the choice should be submitted when the time is selected. */
    trigger?: B
    /** True if this is a required field. Defaults to False. */
    required?: B
    /** If true, use 12-hour time format. Otherwise, use 24-hour format. */
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
    Toolbar = ({ params, label, switchAmPm }: { params: BaseToolbarProps<Date, Date | null>, label: S | undefined, switchAmPm: () => void }) => {
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
            ThemeProvider = React.lazy(() => import('@mui/material/styles').then(({ ThemeProvider }) => ({ default: ThemeProvider }))),
            LocalizationProvider = React.lazy(() => import('@mui/x-date-pickers').then((module) => ({ default: module.LocalizationProvider }))),
            TimePicker = React.lazy(() => import('@mui/x-date-pickers').then((module) => ({ default: module.TimePicker }))),
            // AdapterDateFns = React.lazy(() => import('@mui/x-date-pickers/AdapterDateFns').then((module) => ({ default: module.AdapterDateFns }))),
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
            [AdapterDateFns, setAdapterDateFns] = React.useState<any>(null), // TODO: type
            [theme, setTheme] = React.useState<any>(null), // TODO: type
            getTheme = async () => {
                return await import('@mui/material/styles').then(({ createTheme }) => {
                    // Not all of MUI's components support css variables yet - cssVarValue used instead.
                    return createTheme({
                        palette: {
                            background: {
                                paper: cssVar('$card')
                            },
                            primary: {
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
                })
            },
            getAdapterDateFns = async () => {
                return await import('@mui/x-date-pickers/AdapterDateFns')
            }

        React.useEffect(() => {
            wave.args[m.name] = defaultVal ? formatDateToTimeString(defaultVal, m.time_format) : null // TODO: 
            getTheme().then(t => setTheme(t))
            getAdapterDateFns().then(a => setAdapterDateFns(a))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        // TODO: dialog keeps opening after selection
        return (
            <>
                {/* TODO: loading div styling*/}
                <React.Suspense fallback={<div>Loading...</div>}>
                    {theme && AdapterDateFns ? <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns.AdapterDateFns}>
                            <TimePicker
                                value={value}
                                label={m.label}
                                open={isDialogOpen}
                                onChange={setValue}
                                onAccept={onSelectTime}
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
                                            placeholder='Select a time'
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
                        : <>{/* TODO: use the same loading div as for react suspense*/}</>
                    }
                </React.Suspense>
            </>
        )
    }