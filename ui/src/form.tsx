import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { cards } from './grid';
import { Markdown, MarkdownInline } from './markdown';
import { B, F, Packed, bond, box, Box, Card, Dict, on, Rec, S, socket, U, unpack } from './telesync';
import { border, getTheme, padding, pc, px } from './theme';

interface Text {
  size: S
  text: S
  tooltip: S
}

interface Separator {
  label: S
}

interface Label {
  label: S
  required: B
  disabled: B
  tooltip: S
}

interface Progress {
  label: S
  caption: S
  value: F
  tooltip: S
}

interface MessageBar {
  type: S
  text: S
}

interface Textbox {
  name: S
  label: S
  placeholder: S
  mask: S
  icon: S
  prefix: S
  suffix: S
  value: S
  error: S
  required: B
  disabled: B
  readonly: B
  multiline: B
  password: B
  tooltip: S
}

interface Checkbox {
  name: S
  label: S
  value: B
  indeterminate: B
  disabled: B
  trigger: B
  tooltip: S
}

interface Toggle {
  name: S
  label: S
  value: B
  disabled: B
  trigger: B
  tooltip: S
}

interface Choice {
  name: S
  label: S
  disabled: B
}

interface ChoiceGroup {
  name: S
  label: S
  value: S
  choices: Choice[]
  required: B
  trigger: B
  tooltip: S
}

interface Checklist {
  name: S
  label: S
  values: S[]
  choices: Choice[]
  tooltip: S
}

interface Dropdown {
  name: S
  label: S
  placeholder: S
  multiple: B
  value: S
  values: S[]
  choices: Choice[]
  required: B
  disabled: B
  trigger: B
  tooltip: S
}

interface Combobox {
  name: S
  label: S
  placeholder: S
  value: S
  choices: S[]
  error: S
  disabled: B
  tooltip: S
}

interface Slider {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  trigger: B
  tooltip: S
}

interface Spinbox {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  tooltip: S
}

interface DatePicker {
  name: S
  label: S
  placeholder: S
  value: S
  disabled: B
  tooltip: S
}

interface ColorPicker {
  name: S
  label: S
  value: S
  choices: S[]
  tooltip: S
}

interface Button {
  name: S
  label: S
  caption: S
  primary: B
  disabled: B
  link: B
  tooltip: S
}

interface Buttons {
  buttons: Button[]
}

interface FileUpload {
  name: S
  label: S
  multiple: B
  tooltip: S
}

interface TableColumn {
  name: S
  label: S
}

interface TableRow {
  name: S
  cells: S[]
}

interface Table {
  name: S
  columns: TableColumn[]
  rows: TableRow[]
  multiple: B
  tooltip: S
}

interface Link {
  label: S
  path: S
  disabled: B
  button: B
  tooltip: S
}

interface Tab {
  name: S
  label: S
  icon: S
}

interface Tabs {
  name: S
  value: S
  items: Tab[]
}

interface Expander {
  name: S
  label: S
  expanded: B
  items: Component[]
}

interface Component {
  text?: Text
  label?: Label
  separator?: Separator
  progress?: Progress
  message_bar?: MessageBar
  textbox?: Textbox
  checkbox?: Checkbox
  toggle?: Toggle
  choice_group?: ChoiceGroup
  checklist?: Checklist
  dropdown?: Dropdown
  combobox?: Combobox
  slider?: Slider
  spinbox?: Spinbox
  date_picker?: DatePicker
  color_picker?: ColorPicker
  buttons?: Buttons
  file_upload?: FileUpload
  table?: Table
  link?: Link
  tabs?: Tabs
  button?: Button
  expander?: Expander
}

interface State {
  url: S
  args: Rec
  items: Packed<Component[]>
}


const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    separator: {
      boxSizing: 'border-box',
      paddingTop: px(20),
    },
    buttons: {
      boxSizing: 'border-box',
      paddingTop: px(20),
    },
    limitedWidth: {
      maxWidth: px(600),
    },
    markdown: {
      $nest: {
        table: {
          width: pc(100),
          borderCollapse: 'collapse',
        },
        tr: {
          borderBottom: border(1, theme.colors.text5),
        },
        th: {
          padding: padding(11, 6),
          textAlign: 'left',
        },
        td: {
          padding: padding(11, 6),
        }
      }
    },
    sectionControls: {
      display: 'none',
      position: 'absolute',
      width: 64,
      height: 32,
      right: 0,
      top: 0,
    },
    section: {
      position: 'relative',
      $nest: {
        '&:hover>div:last-child': { // sectionControls
          display: 'block',
        }
      }
    },
    fileInput: {
      marginBottom: '10px',
    },
    expanderOpen: {
      $nest: {
        '>div:last-child': {
          display: 'block',
        },
      },
    },
    expanderClosed: {
      $nest: {
        '>div:last-child': {
          display: 'none',
        },
      },
    },
    tooltipContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    },
    tooltippedElement: {
      flexGrow: 1
    },
    tooltipIcon: {
      color: '#323130',
      fontWeight: 400,
      fontSize: '14px',
      userSelect: 'none',
      textAlign: 'left',
      marginLeft: '0.5em',
      cursor: 'pointer'
    }
  })

const defaults: Partial<State> = {
  url: '',
  args: {},
  items: []
}

// const
//   XButton = bond(({ args, button: m, submit }: { args: Rec, button: Button, submit: () => void }) => {
//     args[m.name] = false
//     const
//       render = () => {
//         const onClick = () => {
//           args[m.name] = true
//           submit()
//         }
//         return <button data-test={m.name} onClick={onClick} >{m.label}</button>
//       }
//     return { render }
//   }),
//   XField = ({ component: c, args, submit }: { component: Component, args: Rec, submit: () => void }) => {
//     if (c.button) return <XButton key={xid()} args={args} button={c.button} submit={submit} />
//     return <div />
//   }

const
  iff = (x: S) => x && x.length ? x : undefined,
  textVariants: Dict<keyof Fluent.IFontStyles> = {
    xl: 'xLarge',
    l: 'large',
    m: 'medium',
    s: 'small',
    xs: 'xSmall',
  },
  toTextVariant = (s: S) => { const v = textVariants[s]; return v ? v : 'mediumPlus' },
  XText = ({ model: m }: { model: Text }) => {
    const
      name = 'text' + (m.size ? `-${m.size}` : ''),
      md = m.text.indexOf('\n') >= 0
        ? <div className={css.markdown}><Markdown source={m.text} /></div>
        : <MarkdownInline source={m.text} />
    return <Fluent.Text data-test={name} variant={toTextVariant(m.size)} block>{md}</Fluent.Text>
  },
  XLabel = ({ model: m }: { model: Label }) => (
    <Fluent.Label
      data-test='label'
      required={m.required}
      disabled={m.disabled}
    >{m.label}</Fluent.Label>
  ),
  XLink = bond(({ model: m }: { model: Link }) => {
    const
      label = m.label.length ? m.label : m.path,
      onClick = m.button ? () => { window.open(m.path) } : null,
      render = () => {
        // TODO target="_blank"
        return onClick
          ? <div><Fluent.DefaultButton text={label} disabled={m.disabled} onClick={onClick} /></div>
          : <div><Fluent.Link data-test='link' href={m.path} disabled={m.disabled}>{label}</Fluent.Link></div>
      }
    return { render }
  }),
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div className={css.separator}>
      <Fluent.Separator data-test='separator'>{m.label}</Fluent.Separator>
    </div>
  ),
  XProgress = ({ model: m }: { model: Progress }) => (
    <Fluent.ProgressIndicator
      data-test='progress' // TODO: Does not work.
      label={m.label}
      description={m.caption}
      percentComplete={m.value < 0 ? undefined : m.value}
    />
  ),
  toMessageBarType = (t: S): Fluent.MessageBarType => {
    switch (t) {
      case 'error': return Fluent.MessageBarType.error
      case 'warning': return Fluent.MessageBarType.warning
      case 'success': return Fluent.MessageBarType.success
      case 'danger': return Fluent.MessageBarType.severeWarning
      case 'blocked': return Fluent.MessageBarType.blocked
      default: return Fluent.MessageBarType.info
    }
  },
  XMessageBar = ({ model: m }: { model: MessageBar }) => (
    m.text && m.text.length
      ? <Fluent.MessageBar data-test='message-bar' messageBarType={toMessageBarType(m.type)} >{m.text}</Fluent.MessageBar>
      : <div />
  ),
  XTextbox = bond(({ args, model: m }: { args: Rec, model: Textbox }) => {
    args[m.name] = m.value
    const
      icon: Fluent.IIconProps | undefined = m.icon && m.icon.length ? { iconName: m.icon } : undefined,
      onChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
        args[m.name] = (v !== undefined && v !== null) ? v : m.value
      },
      mask = iff(m.mask),
      password = m.password ? 'password' : undefined,
      render = () => mask
        ? (
          <Fluent.MaskedTextField
            data-test={m.name}
            label={m.label}
            defaultValue={m.value}
            mask={mask}
            errorMessage={iff(m.error)}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            onChange={onChange}
          />
        )
        : (
          <Fluent.TextField
            data-test={m.name}
            label={m.label}
            placeholder={iff(m.placeholder)}
            iconProps={icon}
            prefix={iff(m.prefix)}
            suffix={iff(m.suffix)}
            defaultValue={m.value}
            errorMessage={iff(m.error)}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            multiline={m.multiline}
            type={password}
            onChange={onChange}
          />
        )

    return { render }
  }),
  checkboxStyles = () => ({
    root: {
      marginBottom: px(10),
    }
  }),
  XCheckbox = bond(({ args, model: m, submit }: { args: Rec, model: Checkbox, submit: () => void }) => {
    args[m.name] = m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        args[m.name] = checked === true
          ? true
          : checked === false
            ? false
            : null
        if (m.trigger) submit();
      },
      render = () =>
        m.indeterminate
          ? (
            <Fluent.Checkbox
              data-test={m.name}
              inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
              label={m.label}
              defaultIndeterminate={true}
              onChange={onChange}
              disabled={m.disabled}
              styles={checkboxStyles}
            />
          )
          : (
            <Fluent.Checkbox
              data-test={m.name}
              inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
              label={m.label}
              defaultChecked={m.value}
              onChange={onChange}
              disabled={m.disabled}
              styles={checkboxStyles}
            />
          )

    return { render }
  }),
  XToggle = bond(({ args, model: m, submit }: { args: Rec, model: Toggle, submit: () => void }) => {
    args[m.name] = m.value
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        args[m.name] = checked ? true : false
        if (m.trigger) submit();
      },
      render = () => (
        <Fluent.Toggle
          data-test={m.name}
          label={m.label}
          defaultChecked={m.value}
          onChange={onChange}
          disabled={m.disabled}
          onText="On"
          offText="Off"
          inlineLabel
        />
      )

    return { render }
  }),
  XChoiceGroup = bond(({ args, model: m, submit }: { args: Rec, model: ChoiceGroup, submit: () => void }) => {
    args[m.name] = m.value
    const
      options = m.choices.map(({ name, label, disabled }): Fluent.IChoiceGroupOption => ({ key: name, text: label, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IChoiceGroupOption) => {
        if (option) args[m.name] = option.key
        if (m.trigger) submit();
      },
      render = () => (
        <Fluent.ChoiceGroup
          data-test={m.name}
          label={m.label}
          required={m.required}
          defaultSelectedKey={m.value}
          options={options}
          onChange={onChange}
        />
      )

    return { render }
  }),
  XDropdown = bond(({ args, model: m, submit }: { args: Rec, model: Dropdown, submit: () => void }) => {
    args[m.name] = m.multiple ? m.values : m.value
    const
      selection = m.multiple ? new Set<S>(m.values) : null,
      options = m.choices.map(({ name, label, disabled }): Fluent.IDropdownOption => ({ key: name, text: label, disabled })),
      onChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
        if (option) {
          const name = option.key as S
          if (m.multiple && selection !== null) {
            if (option.selected) {
              selection.add(name)
            } else {
              selection.delete(name)
            }
            args[m.name] = Array.from(selection)
          } else {
            args[m.name] = name
          }
        }
        if (m.trigger) submit();
      },
      render = () =>
        m.multiple
          ? (
            <div className={css.limitedWidth}>
              <Fluent.Dropdown
                data-test={m.name}
                label={m.label}
                placeholder={iff(m.placeholder)}
                options={options}
                required={m.required}
                disabled={m.disabled}
                multiSelect
                defaultSelectedKeys={m.values}
                onChange={onChange}
              />
            </div>
          )
          : (
            <div className={css.limitedWidth}>
              <Fluent.Dropdown
                data-test={m.name}
                label={m.label}
                placeholder={iff(m.placeholder)}
                options={options}
                required={m.required}
                disabled={m.disabled}
                defaultSelectedKey={m.value}
                onChange={onChange}
              />
            </div>
          )

    return { render }
  }),
  checklistItemStyles = () => ({
    root: {
      marginBottom: px(4),
    }
  }),
  XChecklistItem = bond(({ name, label, disabled, selectedB }: { name: S, label: S, disabled: B, selectedB: Box<B> }) => {
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => selectedB(checked === true),
      render = () => {
        return (
          <Fluent.Checkbox
            data-test={name}
            label={label}
            checked={selectedB()}
            onChange={onChange}
            disabled={disabled}
            styles={checklistItemStyles}
          />
        )
      }
    return { render, selectedB }
  }),
  XChecklist = bond(({ args, model: m }: { args: Rec, model: Checklist }) => {
    args[m.name] = m.values
    let _pause = false
    const
      defaultSelection = new Set<S>(m.values),
      choices = m.choices.map(c => ({
        choice: c,
        selectedB: box(defaultSelection.has(c.name))
      })),
      capture = () => {
        if (_pause) return
        const vs: S[] = []
        for (const c of choices) if (c.selectedB()) vs.push(c.choice.name)
        args[m.name] = vs
      },
      select = (value: B) => {
        _pause = true
        for (const c of choices) if (!c.choice.disabled) c.selectedB(value)
        _pause = false
        capture()
      },
      selectAll = () => select(true),
      deselectAll = () => select(false),
      render = () => {
        const
          items = choices.map(({ choice, selectedB }, i) => (
            <XChecklistItem name={`checkbox-${i + 1}`} key={i} label={choice.label} disabled={choice.disabled} selectedB={selectedB} />
          ))
        return (
          <div data-test={m.name}>
            <Fluent.Label>{m.label}</Fluent.Label>
            <div>
              <Fluent.Link onClick={selectAll}>Select All</Fluent.Link> | <Fluent.Link onClick={deselectAll}>Deselect All</Fluent.Link>
            </div>
            <div>{items}</div>
          </div>
        )
      }
    choices.forEach(c => on(c.selectedB, capture))
    return { render }
  }),
  XCombobox = bond(({ args, model: m }: { args: Rec, model: Combobox }) => {
    args[m.name] = m.value
    const
      textB = box(m.value),
      options = m.choices.map((text, i): Fluent.IComboBoxOption => ({ key: `${i}`, text })),
      onChange = (_e: React.FormEvent<Fluent.IComboBox>, option?: Fluent.IComboBoxOption, _index?: number, value?: string) => {
        const v = option ? option.text : value ? value : ''
        args[m.name] = v
        textB(v)
      },
      render = () => (
        <div className={css.limitedWidth}>
          <Fluent.ComboBox
            data-test={m.name}
            label={m.label}
            placeholder={iff(m.placeholder)}
            options={options}
            disabled={m.disabled}
            autoComplete="on"
            allowFreeform
            errorMessage={iff(m.error)}
            text={textB()}
            onChange={onChange}
          />
        </div>
      )
    return { render, textB }
  }),
  XSlider = bond(({ args, model: m, submit }: { args: Rec, model: Slider, submit: () => void }) => {
    const default_value = (m.value < m.min) ? m.min : ((m.value > m.max) ? m.max : m.value)
    args[m.name] = default_value
    const
      onChange = (v: number) => args[m.name] = v,
      onChanged = (_event: MouseEvent | KeyboardEvent | TouchEvent, _value: number) => {
        if (m.trigger) submit();
      },
      render = () => (
        <div className={css.limitedWidth}>
          <Fluent.Slider
            data-test={m.name}
            buttonProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
            label={m.label}
            min={m.min}
            max={m.max}
            step={m.step}
            defaultValue={default_value}
            showValue={true}
            originFromZero={m.min < 0 && m.max >= 0}
            onChange={onChange}
            onChanged={onChanged}
            disabled={m.disabled}
          />
        </div>
      )

    return { render }
  }),
  XSpinbox = bond(({ args, model: m }: { args: Rec, model: Spinbox }) => {
    args[m.name] = m.value
    const
      parseValue = (v: string) => {
        const x = parseFloat(v)
        return (!isNaN(x) && isFinite(x)) ? x : m.value
      },
      onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        args[m.name] = parseValue(e.target.value)
      },
      onIncrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value + m.step > m.max) ? m.max : value + m.step
        args[m.name] = newValue
        return String(newValue)
      },
      onDecrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value - m.step < m.min) ? m.min : value - m.step
        args[m.name] = newValue
        return String(newValue)
      },
      render = () => (
        <div className={css.limitedWidth}>
          <Fluent.SpinButton
            data-test={m.name}
            inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
            label={m.label}
            min={m.min}
            max={m.max}
            step={m.step}
            defaultValue={`${m.value}`}
            onBlur={onBlur}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            disabled={m.disabled}
          />
        </div>
      )
    return { render }
  }),
  pad2 = (n: U) => { const s = `${n}`; return s.length === 1 ? `0${s}` : s },
  formatDate = (d: Date): S => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
  parseDate = (s: S): Date | undefined => {
    if (s && s.length) {
      const ss = s.split('-')
      if (ss.length !== 3) return undefined
      const ymd = ss.map(s => parseInt(s, 10)).filter(n => !isNaN(n))
      if (ymd.length !== 3) return undefined
      return new Date(ymd[0], ymd[1] - 1, ymd[2])
    }
    return undefined
  },
  XDatePicker = bond(({ args, model: m }: { args: Rec, model: DatePicker }) => {
    args[m.name] = m.value
    const
      onSelectDate = (d: Date | null | undefined) => {
        args[m.name] = (d === null || d === undefined) ? m.value : formatDate(d)
      },
      render = () => (
        <div className={css.limitedWidth}>
          <Fluent.DatePicker
            data-test={m.name}
            label={m.label}
            value={parseDate(m.value)}
            placeholder={m.placeholder}
            disabled={m.disabled}
            onSelectDate={onSelectDate}
          />
        </div>
      )

    return { render }
  }),
  toColorCells = (cs: S[]) => cs.map((c): Fluent.IColorCellProps => ({ id: c, label: c, color: c })),
  XColorPicker = bond(({ args, model: m }: { args: Rec, model: ColorPicker }) => {
    args[m.name] = m.value
    const
      onColorChanged = (_id?: string, color?: string) => args[m.name] = color ? color : m.value,
      onChange = (_e: React.SyntheticEvent<HTMLElement>, color: Fluent.IColor) => args[m.name] = color ? color.str : m.value,
      render = () => m.choices && m.choices.length
        ? (
          <div>
            <Fluent.Label>{m.label}</Fluent.Label>
            <Fluent.SwatchColorPicker
              data-test={m.name}
              columnCount={10}
              selectedId={m.value}
              colorCells={toColorCells(m.choices)}
              onColorChanged={onColorChanged}
            />
          </div>
        )
        : (
          <div>
            <Fluent.Label>{m.label}</Fluent.Label>
            <Fluent.ColorPicker
              data-test={m.name}
              color={m.value}
              onChange={onChange}
            />
          </div>
        )

    return { render }
  }),
  XFileUpload = bond(({ args, model: m, submit }: { args: Rec, model: FileUpload, submit: () => void }) => {
    const
      ref = React.createRef<HTMLInputElement>(),
      formSubmittedB = box(false),
      filePicked = box(false),
      percentComplete = box(0.0),
      upload = async () => {
        const fileInput = ref.current
        if (!fileInput) return
        const formData = new FormData(), files = fileInput.files
        if (!files) return // XXX validate
        formSubmittedB(true)
        for (let i = 0; i < files.length; i++) formData.append('files', files[i])
        try {
          const makeRequest = new Promise<XMLHttpRequest>(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/f/in");
            xhr.upload.onprogress = function (e) {
              percentComplete(e.loaded / e.total)
            }
            xhr.send(formData);
            xhr.onreadystatechange = function () {
              if (xhr.readyState !== this.DONE) return;
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr);
              } else {
                reject({
                  status: xhr.status,
                  statusText: xhr.statusText
                });
              }
            };
          });

          const res = await makeRequest
          const text = res.responseText
          const reply = JSON.parse(text)
          args[m.name] = reply.files
          submit()
        } catch (e) {
          console.error(e) // XXX handle properly
        }
      },
      onChange = (e: React.ChangeEvent<HTMLInputElement>) => filePicked(e.target.value.length > 0),
      render = () => {
        const buttonText = formSubmittedB()
          ? "Uploading..."
          : m.label
        const uploadDescription = formSubmittedB() ? "Uploading: " + (percentComplete() * 100).toFixed(2) + "%" : null
        return (<div data-test={m.name}>
          <div>
            <input disabled={formSubmittedB()} ref={ref} className={css.fileInput} onChange={onChange} type='file' multiple={m.multiple} />
          </div>
          <div>
            <Fluent.ProgressIndicator
              data-test='progress' // TODO: Does not work.
              description={uploadDescription}
              percentComplete={percentComplete()}
              progressHidden={!formSubmittedB()}
            />
          </div>
          <div>
            <Fluent.PrimaryButton disabled={formSubmittedB() || !filePicked()} text={buttonText} onClick={upload} />
          </div>
        </div>)
      }

    return { render, formSubmittedB, percentComplete, filePicked }
  }),
  XTable = bond(({ args, model: m, submit }: { args: Rec, model: Table, submit: () => void }) => {
    args[m.name] = []
    const
      items = m.rows.map(r => {
        const item: any = { __key__: r.name }
        for (let i = 0, n = r.cells.length; i < n; i++) {
          const col = m.columns[i]
          item[col.name] = r.cells[i]
        }
        return item
      }),
      columns = m.columns.map((c): Fluent.IColumn => ({
        key: c.name,
        name: c.label,
        fieldName: c.name,
        isResizable: true,
        minWidth: 50,
      })),
      primaryColumnKey = columns[0].key,
      selection = new Fluent.Selection({
        onSelectionChanged: () => {
          args[m.name] = selection.getSelection().map(item => (item as any).__key__)
        }
      }),
      onItemInvoked = (item: any) => {
        args[m.name] = [item.__key__]
        submit()
      },
      onRenderItemColumn = (item?: any, _index?: number, column?: Fluent.IColumn) => {
        if (!item) return <span />
        if (!column) return <span />
        const v = item[column.fieldName as any]
        if (column.key === primaryColumnKey) {
          const onClick = () => {
            args[m.name] = [item.__key__]
            submit()
          }
          return <Fluent.Link onClick={onClick}>{v}</Fluent.Link>
        } else {
          return <span>{v}</span>
        }
      },
      render = () => (
        m.multiple ? (
          <Fluent.MarqueeSelection selection={selection}>
            <Fluent.DetailsList
              data-test={m.name}
              items={items}
              columns={columns}
              layoutMode={Fluent.DetailsListLayoutMode.justified}
              selection={selection}
              selectionMode={Fluent.SelectionMode.multiple}
              selectionPreservedOnEmptyClick={true}
            />
          </Fluent.MarqueeSelection>
        ) : (
            <Fluent.DetailsList
              data-test={m.name}
              items={items}
              columns={columns}
              layoutMode={Fluent.DetailsListLayoutMode.justified}
              selection={selection}
              selectionMode={Fluent.SelectionMode.none}
              selectionPreservedOnEmptyClick={true}
              onItemInvoked={onItemInvoked}
              onRenderItemColumn={onRenderItemColumn}
            />
          )
      )
    return { render }
  }),
  XButton = bond(({ args, button: m, submit }: { args: Rec, button: Button, submit: () => void }) => {
    args[m.name] = false
    const
      render = () => {
        const onClick = () => {
          args[m.name] = true
          submit()
        }
        if (m.link) {
          return (<Fluent.Link data-test='link' disabled={m.disabled} onClick={onClick}>{m.label}</Fluent.Link>)
        }
        return m.caption.length
          ? m.primary
            ? <Fluent.CompoundButton data-test={m.name} primary text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
            : <Fluent.CompoundButton data-test={m.name} text={m.label} secondaryText={m.caption} disabled={m.disabled} onClick={onClick} />
          : m.primary
            ? <Fluent.PrimaryButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
            : <Fluent.DefaultButton data-test={m.name} text={m.label} disabled={m.disabled} onClick={onClick} />
      }
    return { render }
  }),
  XButtons = bond(({ args, model: m, submit }: { args: Rec, model: Buttons, submit: () => void }) => {
    const
      render = () => {
        const bs = m.buttons.map(b => {
          return (<XToolTip key={b.label} content={b.tooltip} showIcon={false} expand={false}><XButton button={b} args={args} submit={submit}>{b.label}</XButton></XToolTip>)
        })
        return <div className={css.buttons}><Fluent.Stack horizontal tokens={{ childrenGap: 10 }}>{bs}</Fluent.Stack></div>
      }
    return { render }
  }),
  XTabs = bond(({ args, model: m, submit }: { args: Rec, model: Tabs, submit: () => void }) => {
    const
      render = () => {
        const onLinkClick = (item?: Fluent.PivotItem) => {
          if (!item) return
          if (item.props.itemKey !== args[m.name]) {
            args[m.name] = item.props.itemKey || null
            submit()
          }
        }
        const selectedKey = (m.value !== undefined && m.value !== null) ? m.value : null
        const ts = m.items.map(t => {
          return (<Fluent.PivotItem key={t.name} itemIcon={iff(t.icon)} itemKey={t.name} headerText={t.label}></Fluent.PivotItem>)
        })
        return (<Fluent.Pivot selectedKey={selectedKey} onLinkClick={onLinkClick}>{ts}</Fluent.Pivot>)
      }
    return { render }
  }),
  XStandAloneButton = ({ args, model: m, submit }: { args: Rec, model: Button, submit: () => void }) => (<div><XButton key={m.label} button={m} args={args} submit={submit}>{m.label}</XButton></div>),
  XExpander = bond(({ args, model: m, submit }: { args: Rec, model: Expander, submit: () => void }) => {
    const
      isOpenB = box(args[m.name]),
      onClick = () => {
        args[m.name] = m.expanded = !m.expanded
        isOpenB(m.expanded)
      },
      render = () => {
        const
          isOpen = isOpenB(),
          actionTitle = isOpen ? 'Shrink' : 'Expand',
          expanderIcon = { iconName: isOpen ? 'ChevronDownMed' : 'ChevronRightMed' },
          className = isOpenB() ? css.expanderOpen : css.expanderClosed

        return (
          <div data-test='expander' className={className}>
            <Fluent.Separator alignContent="start"><Fluent.ActionButton title={actionTitle} iconProps={expanderIcon} onClick={onClick}>{m.label}</Fluent.ActionButton></Fluent.Separator>
            <div>
              <Fields items={m.items} args={args} submit={submit} />
            </div>
          </div>
        )
      }
    return { isOpenB, render }
  }),
  XToolTip = ({ children, content, showIcon, expand }: { children: React.ReactChild, content: string, showIcon?: boolean, expand?: boolean }) => {
    showIcon = showIcon === undefined ? true : showIcon
    expand = expand === undefined ? true : expand
    if (content && content.length > 0) {
      const tooltipProps: Fluent.ITooltipProps = {
        onRenderContent: () => (
          <div className={css.markdown}><Markdown source={content} /></div>
        )
      };
      if (showIcon) {
        return (
          <div className={css.tooltipContainer}>
            <div className={expand ? css.tooltippedElement : ''}>{children}</div>
            <Fluent.TooltipHost tooltipProps={tooltipProps}>
              <Fluent.FontIcon className={css.tooltipIcon} iconName='Info' />
            </Fluent.TooltipHost>
          </div>
        )
      } else {
        return (
          <div className={css.tooltipContainer}>
            <Fluent.TooltipHost tooltipProps={tooltipProps}>
              {children}
            </Fluent.TooltipHost>
          </div>
        )
      }
    } else {
      return <div>{children}</div>
    }
  },
  Field = ({ component: c, args, submit }: { component: Component, args: Rec, submit: () => void }) => {
    if (c.text) return <XToolTip content={c.text.tooltip} expand={false}><XText model={c.text} /></XToolTip>
    if (c.label) return <XToolTip content={c.label.tooltip} expand={false}><XLabel model={c.label} /></XToolTip>
    if (c.link) return <XToolTip content={c.link.tooltip} expand={false}><XLink model={c.link} /></XToolTip>
    if (c.separator) return <XSeparator model={c.separator} />
    if (c.progress) return <XToolTip content={c.progress.tooltip}><XProgress model={c.progress} /></XToolTip>
    if (c.message_bar) return <XMessageBar model={c.message_bar} />
    if (c.textbox) return <XToolTip content={c.textbox.tooltip}><XTextbox args={args} model={c.textbox} /></XToolTip>
    if (c.checkbox) return <XToolTip content={c.checkbox.tooltip} expand={false}><XCheckbox args={args} model={c.checkbox} submit={submit} /></XToolTip>
    if (c.toggle) return <XToolTip content={c.toggle.tooltip} expand={false}><XToggle args={args} model={c.toggle} submit={submit} /></XToolTip>
    if (c.choice_group) return <XToolTip content={c.choice_group.tooltip}><XChoiceGroup args={args} model={c.choice_group} submit={submit} /></XToolTip>
    if (c.dropdown) return <XToolTip content={c.dropdown.tooltip}><XDropdown args={args} model={c.dropdown} submit={submit} /></XToolTip>
    if (c.checklist) return <XToolTip content={c.checklist.tooltip}><XChecklist args={args} model={c.checklist} /></XToolTip>
    if (c.combobox) return <XToolTip content={c.combobox.tooltip}><XCombobox args={args} model={c.combobox} /></XToolTip>
    if (c.slider) return <XToolTip content={c.slider.tooltip}><XSlider args={args} model={c.slider} submit={submit} /></XToolTip>
    if (c.spinbox) return <XToolTip content={c.spinbox.tooltip} expand={false}><XSpinbox args={args} model={c.spinbox} /></XToolTip>
    if (c.date_picker) return <XToolTip content={c.date_picker.tooltip}><XDatePicker args={args} model={c.date_picker} /></XToolTip>
    if (c.color_picker) return <XToolTip content={c.color_picker.tooltip}><XColorPicker args={args} model={c.color_picker} /></XToolTip>
    if (c.file_upload) return <XToolTip content={c.file_upload.tooltip}><XFileUpload args={args} model={c.file_upload} submit={submit} /></XToolTip>
    if (c.table) return <XToolTip content={c.table.tooltip}><XTable args={args} model={c.table} submit={submit} /></XToolTip>
    if (c.buttons) return <XButtons args={args} model={c.buttons} submit={submit} />
    if (c.tabs) return <XTabs args={args} model={c.tabs} submit={submit} />
    if (c.button) return <XToolTip content={c.button.tooltip} showIcon={false} expand={false}><XStandAloneButton args={args} model={c.button} submit={submit} /></XToolTip>
    if (c.expander) return <XExpander args={args} model={c.expander} submit={submit} />
    return <Fluent.MessageBar messageBarType={Fluent.MessageBarType.severeWarning}>This component could not be rendered.</Fluent.MessageBar>
  },
  Fields = ({ args, items, submit }: { args: Rec, items: Component[], submit: () => void }) => {
    const fields = items.map((f, i) => <Field key={i} component={f} args={args} submit={submit} />)
    // TODO gap 10px between fields
    return <>{fields}</>
  },
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
          items = unpack<Component[]>(s.items), // XXX ugly
          args = unpack(s.args),
          submit = () => {
            const sock = socket.current
            if (!sock) return
            sock.send(`@ ${s.url} ${JSON.stringify(args)}`)
          }

        return (
          <div className={css.card}>
            <Fields items={items} args={args} submit={submit} />
          </div>)
      }
    return { render, changed }
  })

cards.register('form', View)

