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

import * as Fluent from '@fluentui/react'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers' // TODO: lazyload
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns' // TODO: lazyload
import { B, Id, S } from 'h2o-wave'
import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { cssVar, cssVarValue } from './theme'
import { wave } from './ui'
import { TextFieldProps } from '@mui/material'

/**
 * Create a timepicker.
 *
 * TODO: description
 */

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
    /** True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes. */
    trigger?: B
    /** True if this is a required field. Defaults to False. */
    required?: B
    /** If true, use 12-hour time format. Otherwise, use 24-hour format.*/
    useHour12?: B // S:, enum
    /** The minimum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '13:45', '01:45pm' */
    min?: S
    /** The maximum allowed time value in hh:mm or hh:mm(a|p)m format. E.g.: '18:45', '06:45pm' */
    max?: S
}

const
    parseTimeToDate = (time: S) => {
        const date = new Date(`2000-01-01T${time.slice(0, 5)}:00`)
        if (time?.endsWith('pm')) date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
        return date
    },
    formatDateToTimeString = (d: Date, useHour12: B = false) => {
        const
            hours = d.getHours(),
            minutes = d.getMinutes()
        // TODO: add pad2 to numbers
        return `${useHour12 && hours >= 12 ? hours - 12 : hours}:${minutes}${useHour12 ? (hours >= 12 ? 'pm' : 'am') : null}`
    }

export const
    XTimePicker = ({ model: m }: { model: TimePicker }) => {
        const
            defaultVal = m.value ? parseTimeToDate(m.value) : null,
            [value, setValue] = React.useState(defaultVal),
            [isDialogOpen, setIsDialogOpen] = React.useState(false),
            textInputRef = React.useRef<HTMLDivElement>(null),
            // TODO: test component with all wave themes
            [theme] = React.useState(
                // Not all of MUI's components support cssVar - cssVarValue used instead.
                createTheme({
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
                })),
            onSelectTime = (time: Date | null) => {
                // TODO: rename 'time' to better represent it is in a Date format
                wave.args[m.name] = time ? formatDateToTimeString(time, m.useHour12) : null
                setValue(time)
                if (m.trigger) wave.push()
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        React.useEffect(() => { wave.args[m.name] = defaultVal ? formatDateToTimeString(defaultVal, m.useHour12) : null }, []) // TODO: 

        return (
            <>
                <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            value={value}
                            open={isDialogOpen}
                            onClose={() => setIsDialogOpen(false)}
                            // ampm={m.useHour12}
                            onChange={(newValue) => onSelectTime(newValue)}
                            showToolbar={true}
                            PopperProps={{
                                anchorEl: textInputRef.current,
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
                            }}
                            ToolbarComponent={(params) => {
                                const
                                    { parsedValue } = params,
                                    time = parsedValue
                                        // https://github.com/moment/luxon/issues/726
                                        ? parsedValue.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hourCycle: params.ampm ? 'h12' : 'h23' })
                                        : '--:--'

                                return (
                                    <div style={{ paddingTop: 16, paddingLeft: 16 }}>
                                        {m.label && <Fluent.Label>{m.label}</Fluent.Label>}
                                        <Fluent.Text>
                                            <Fluent.Text style={{ fontSize: 26, cursor: 'pointer' }} onClick={() => params.setOpenView('hours')}>{`${time.substring(0, 2)}`}</Fluent.Text>
                                            <Fluent.Text style={{ fontSize: 26 }}>{':'}</Fluent.Text>
                                            <Fluent.Text style={{ fontSize: 26, cursor: 'pointer' }} onClick={() => params.setOpenView('minutes')}>{`${time.substring(3, 5)}`}</Fluent.Text>
                                            <Fluent.Text style={{ fontSize: 26 }}>{' '}</Fluent.Text>
                                            <Fluent.Text style={{ fontSize: 26, cursor: 'pointer' }} onClick={() => {
                                                setValue((prevValue) => {
                                                    const date = new Date(prevValue!)
                                                    date.setTime(date.getTime() + 12 * 60 * 60 * 1000)
                                                    return date
                                                })
                                            }}>{`${time.substring(6, 8) || ''}`}</Fluent.Text>
                                        </Fluent.Text>
                                    </div>
                                )
                            }}
                            renderInput={({ inputProps, error }: TextFieldProps) => {
                                return <div ref={textInputRef}>
                                    <Fluent.TextField
                                        iconProps={{ iconName: 'Clock', }}
                                        onClick={() => setIsDialogOpen(true)}
                                        styles={{
                                            field: { cursor: 'pointer' },
                                            icon: { bottom: 7 }
                                        }}
                                        onChange={inputProps?.onChange}
                                        placeholder={inputProps?.placeholder}
                                        disabled={m.disabled}
                                        errorMessage={
                                            // TODO: handle wrong min-max range
                                            error
                                                ? `Wrong input. Please enter time in hh:mm (a|p)m format. Example: ${m.useHour12 ? "11:35 am" : "14:32"}`
                                                : undefined
                                        }
                                        readOnly={inputProps?.readOnly} // TODO: remove?
                                        value={inputProps?.value}
                                        label={m.label}
                                        required={m.required}
                                    /></div>
                            }}
                            minTime={m.min ? parseTimeToDate(m.min) : undefined}
                            maxTime={m.max ? parseTimeToDate(m.max) : undefined}
                            // mask // TODO: discuss
                            // inputFormat // TODO: change placeholder and value to support both 24 and 12 hour format
                            // onAccept // TODO: wave trigger here?
                            // minutesStep // TODO: discuss
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
            </>
        )
    }