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
import { DialogType, IDropdownOption } from '@fluentui/react'
import { B, Box, box, Card, Dict, Model, Page, parseU, S, U, WaveEventType, xid } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cardDefs } from './defs'
import { defaultLayoutDef, editorActionB, EditorActionT, LayoutDef, layoutDefs, noAction, pickCard } from './editing'
import { cards } from './layout'
import { FlexBox, Layout, layoutsB, Zone } from './meta'
import { border, cssVar } from './theme'
import { bond, contentB, wave } from './ui'

/**
 * WARNING: Experimental and subject to change.
 * Do not use in production sites!
 *
 * Create a card that enables WYSIWYG editing on a page.
 * Adding this card to a page makes the page editable by end-users.
 */
interface State {
  /** The editing mode. Defaults to `public`.*/
  mode: 'public' | 'private'
}

const
  css = stylesheet({
    fab: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      width: 56,
      height: 56,
      color: cssVar('$card'),
      background: cssVar('$text'),
      borderRadius: '50%',
      fontSize: 20,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0px 3px 5px ${cssVar('$text0')}`,
      $nest: {
        '&:hover': {
          boxShadow: `0px 12px 20px ${cssVar('$text2')}`,
        }
      },
    },
    panelActions: {
      marginTop: 10,
    },
    cards: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      margin: 3,
      padding: 3,
      border: border(1, cssVar('$text3')),
      $nest: {
        '&:hover': {
          backgroundColor: cssVar('$text0'),
        }
      }
    },
    cardIcon: {
      width: 50,
      height: 50,
      fontSize: 22,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: cssVar('$text7'),
    },
    cardCaption: {
      marginTop: 5,
      fontSize: 11,
      width: 82,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center',
    }
  }),
  labelize = (s: S) => s.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
  toDict = <T extends unknown>(xs: T[], k: (x: T) => S): Dict<T> => {
    const d: Dict<T> = {}
    for (const x of xs) d[k(x)] = x
    return d
  },
  cardDefLookup = toDict(cardDefs, d => d.view),
  parsePx = (s: S) => parseU(s.replace(/px$/, '')),
  collectZones = (zoneNames: S[], zones: Zone[]) => {
    for (const zone of zones) {
      if (zone.zones) {
        collectZones(zoneNames, zone.zones)
      } else {
        zoneNames.push(zone.name)
      }
    }
  },
  getActiveLayout = (): Layout => {
    const layouts = layoutsB()
    return layouts && layouts.length ? layouts[0] : defaultLayoutDef.layout
  },
  identifyLayoutDef = (layout: Layout): LayoutDef => {
    return layoutDefs.find(ld => ld.layout.name === layout.name) ?? defaultLayoutDef
  },
  separatorStyle: Partial<Fluent.ISeparatorStyles> = {
    root: {
      marginTop: 15,
    },
  },
  Divider = ({ children }: { children: React.ReactNode }) => <Fluent.Separator styles={separatorStyle}>{children}</Fluent.Separator>,
  spinBoxStyle: Partial<Fluent.ISpinButtonStyles> = {
    root: {
      marginTop: 5,
      marginBottom: 5,
    },
    labelWrapper: {
      width: 90,
    },
  },
  SpinBox = bond(({ label, defaultValue, min, max, step, onChange }: { label: S, defaultValue: U, min: U, max: U, step: U, onChange: (v: U) => void }) => {
    const
      parseValue = (s: string): U => {
        const u = parseU(s)
        return isNaN(u) ? 0 : u
      },
      onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onChange(parseValue(e.target.value))
      },
      onIncrement = (s: S) => {
        const v = Math.min(max, parseValue(s) + step)
        onChange(v)
        return String(v)
      },
      onDecrement = (s: S) => {
        const v = Math.max(min, parseValue(s) - step)
        onChange(v)
        return String(v)
      },
      render = () => {
        return (
          <Fluent.SpinButton
            label={label}
            min={min}
            max={max}
            step={step}
            defaultValue={'' + defaultValue}
            onBlur={onBlur}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            styles={spinBoxStyle}
          />
        )
      }
    return { render }
  }),
  AttrPanelView = bond(({ view, card }: { view: S, card?: Card }) => {
    const
      { attrs } = cardDefLookup[view],
      isNew = card ? false : true,
      original: Dict<any> = {},
      changes: Dict<any> = {},
      zones: S[] = [],
      layout = getActiveLayout()

    collectZones(zones, layout.zones)

    for (const { name, value } of attrs) original[name] = changes[name] = value

    if (card) {
      const { state } = card
      for (const k in state) {
        original[k] = changes[k] = state[k]
      }
    }

    let cardName = card ? card.name : `${view}${(new Date()).toISOString()}`

    const
      onDismiss = () => { editorActionB(noAction) },
      save = () => {
        const page = wave.fork()
        if (isNew) {
          const card: Dict<any> = { ...{ view }, ...original, ...changes }
          page.put(cardName, card)
        } else {
          for (const k in changes) {
            const v = changes[k]
            if (v !== original[k]) page.set(`${cardName} ${k}`, v)
          }
        }
        page.push()
        editorActionB(noAction)
      },
      goBack = () => { editorActionB(pickCard) },
      abort = () => { editorActionB(noAction) },
      onChangeCardName = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
        cardName = v || (target as HTMLInputElement).value
      },
      renderFooter = () => (
        <Fluent.Stack horizontal tokens={{ childrenGap: 10 }}>
          <Fluent.PrimaryButton onClick={save}>{isNew ? 'Add card' : 'Save changes'}</Fluent.PrimaryButton>
          <Fluent.DefaultButton onClick={isNew ? goBack : abort}>Back</Fluent.DefaultButton>
        </Fluent.Stack>
      ),
      render = () => {
        const
          fields = attrs.map(attr => {
            const { name } = attr
            switch (attr.t) {
              case 'textbox':
                {
                  const onChange = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
                    changes[name] = v || (target as HTMLInputElement).value
                  }
                  return (
                    <Fluent.TextField
                      key={name}
                      label={labelize(name)}
                      defaultValue={changes[name]}
                      onChange={onChange} />
                  )
                }
              case 'textarea':
                {
                  const onChange = ({ target }: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
                    changes[name] = v || (target as HTMLInputElement).value
                  }
                  return (
                    <Fluent.TextField
                      key={name}
                      label={labelize(name)}
                      defaultValue={changes[name]}
                      multiline={true}
                      onChange={onChange}
                      styles={{ field: { minHeight: 300 } }} />
                  )
                }
              case 'spinbox':
                {
                  const
                    { min, max, step, value } = attr,
                    defaultValue = (value < min) ? min : ((value > max) ? max : value),
                    onChange = (v: U) => {
                      changes[name] = v
                    }

                  changes[name] = defaultValue

                  return (
                    <SpinBox
                      key={name}
                      label={labelize(name) + ':'}
                      min={min} max={max} step={step}
                      defaultValue={changes[name]}
                      onChange={onChange}
                    />
                  )
                }
              case 'record':
                // TODO
                return (
                  <div key={name} />
                )
              case 'box':
                {
                  const
                    zoneOptions: IDropdownOption[] = zones.map(key => ({ key, text: key })),
                    changeBox = (f: (b: Dict<any>) => void) => {
                      const b = JSON.parse(changes[name])
                      f(b)
                      changes[name] = JSON.stringify(b)
                    },
                    setBox = (k: keyof FlexBox, v: S | U) => changeBox(b => b[k] = v),
                    unsetBox = (k: keyof FlexBox) => changeBox(b => { delete b[k] }),
                    onZoneChange = (_e?: React.FormEvent<HTMLElement>, option?: Fluent.IDropdownOption) => {
                      if (option) setBox('zone', option.key)
                    },
                    onOrderChange = (v: U) => {
                      if (v) { setBox('order', v) } else { unsetBox('order') }
                    },
                    onSizeChange = (v: U) => {
                      if (v) { setBox('size', `${v}`) } else { unsetBox('size') }
                    },
                    onWidthChange = (v: U) => {
                      if (v) { setBox('width', `${v}px`) } else { unsetBox('width') }
                    },
                    onHeightChange = (v: U) => {
                      if (v) { setBox('height', `${v}px`) } else { unsetBox('height') }
                    },
                    { zone: zone0, order: order0, size: size0, width: width0, height: height0 } = JSON.parse(changes[name]) as FlexBox
                  return (
                    <div key={name}>
                      <Divider>Box</Divider>
                      <Fluent.Dropdown label='Zone' options={zoneOptions} defaultSelectedKey={zone0} onChange={onZoneChange} />
                      <SpinBox
                        defaultValue={order0 ?? 0}
                        label='Order:'
                        min={0} max={25} step={1}
                        onChange={onOrderChange}
                      />
                      <SpinBox
                        defaultValue={size0 ? parseU(size0) : 0}
                        label='Size:'
                        min={0} max={25} step={1}
                        onChange={onSizeChange}
                      />
                      <SpinBox
                        defaultValue={width0 ? parsePx(width0) : 0}
                        label='Width (px):'
                        min={0} max={10000} step={10}
                        onChange={onWidthChange}
                      />
                      <SpinBox
                        defaultValue={height0 ? parsePx(height0) : 0}
                        label='Height (px):'
                        min={0} max={10000} step={10}
                        onChange={onHeightChange}
                      />
                      <Divider>Properties</Divider>
                    </div>
                  )
                }
            }
          })
        return (
          <Fluent.Panel
            headerText={isNew ? 'Add card' : 'Edit card'}
            isOpen={true}
            isLightDismiss={true}
            onDismiss={onDismiss}
            onRenderFooterContent={renderFooter}
            isFooterAtBottom={true}
          >
            <Divider>{labelize(view)} Card</Divider>
            {isNew ? <Fluent.TextField label='Card Name' defaultValue={cardName} onChange={onChangeCardName} /> : null}
            <div>{fields}</div>
          </Fluent.Panel>
        )
      }
    return { render }
  }),
  ConfirmDialog = bond(({ title, text, acceptCaption, cancelCaption, onAccept }: { title: S, text: S, acceptCaption: S, cancelCaption: S, onAccept: () => void }) => {
    const
      hiddenB = box(false),
      cancel = () => { hiddenB(true) },
      accept = () => {
        onAccept()
        hiddenB(true)
      },
      render = () => (
        <Fluent.Dialog
          hidden={hiddenB()}
          onDismiss={cancel}
          dialogContentProps={{ type: DialogType.normal, title, subText: text }}
          modalProps={{ styles: { main: { maxWidth: 450 } } }}
        >
          <Fluent.DialogFooter>
            <Fluent.DefaultButton onClick={cancel} text={cancelCaption} />
            <Fluent.PrimaryButton onClick={accept} text={acceptCaption} />
          </Fluent.DialogFooter>
        </Fluent.Dialog>
      )
    return { render, hiddenB }
  }),
  PageSetupView = bond(({ pageSetupB }: { pageSetupB: Box<PageSetup> }) => {
    const
      pageSetup = pageSetupB(),
      layoutOptions: Fluent.IDropdownOption[] = layoutDefs.map(({ name: key }) => ({ key, text: key })),
      onLayoutChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: Fluent.IDropdownOption) => {
        if (!option) return
        const def = layoutDefs.find(d => d.name === option.key)
        if (def) {
          pageSetup.layoutDef = def
          pageSetupB({ ...pageSetup })
        }
      },
      onWidthChange = (width: U) => {
        pageSetup.width = width
        pageSetupB({ ...pageSetup })
      },
      render = () => (
        <>
          <Fluent.Dropdown
            label='Page Layout'
            options={layoutOptions}
            defaultSelectedKey={pageSetup.layoutDef.name}
            onChange={onLayoutChange} />
          <SpinBox
            defaultValue={pageSetup.width}
            label='Page Width:'
            min={0} max={4000} step={50}
            onChange={onWidthChange}
          />
        </>
      )

    return { render }
  })

type PageSetup = {
  layoutDef: LayoutDef
  width: U
}

export const
  LayoutPicker = bond(({ visibleB }: { visibleB: Box<B> }) => {
    const
      pageSetupB = box<PageSetup>({
        layoutDef: defaultLayoutDef,
        width: 0,
      }),
      accept = () => {
        const
          { layoutDef, width } = pageSetupB(),
          layout: Layout = { ...layoutDef.layout },
          page = wave.fork()

        if (width) layout.width = `${width}px`

        page.put('__editor__', { view: 'editor', box: '', mode: 'public' })
        page.put('__meta__', { view: 'meta', box: '', layouts: [layout] })
        page.push()
      },
      cancel = () => { visibleB(false) },
      render = () => {
        return (
          <Fluent.Dialog
            hidden={!visibleB()}
            onDismiss={cancel}
            dialogContentProps={{
              type: Fluent.DialogType.largeHeader,
              title: 'Edit this page?',
              subText: "Don't worry, you can always change these settings later.",
            }}
            modalProps={{ isBlocking: false, styles: { main: { maxWidth: 450 } } }}
          >
            <PageSetupView pageSetupB={pageSetupB} />
            <Fluent.DialogFooter>
              <Fluent.DefaultButton onClick={cancel} text="Back to safety" />
              <Fluent.PrimaryButton onClick={accept} text="Start Editing" />
            </Fluent.DialogFooter>
          </Fluent.Dialog >
        )
      }
    return { render, visibleB }
  }),
  getActivePage = (): Page | null => {
    const e = contentB()
    if (e && e.t === WaveEventType.Page) return e.page
    return null
  },
  View = bond(({ name, changed }: Model<State>) => {
    const
      addCard = () => { editorActionB(pickCard) },
      onDismiss = () => { editorActionB(noAction) },
      render = () => {
        let content: JSX.Element | null = null
        const
          action = editorActionB()

        switch (action.t) {
          case EditorActionT.Add:
            {
              content = <AttrPanelView view={action.view} />
            }
            break
          case EditorActionT.Edit:
            {
              const page = getActivePage()
              if (page) {
                const
                  { name } = action,
                  card = page.get(name)
                if (card) content = <AttrPanelView view={card.state.view} card={card} />
              }
            }
            break
          case EditorActionT.Delete:
            {
              const
                { name } = action,
                onAccept = () => {
                  const page = wave.fork()
                  page.del(name)
                  page.push()
                }
              content = <ConfirmDialog
                key={xid()}
                title='Delete Card?'
                text='This card will be permanently deleted.'
                acceptCaption='Delete Card'
                cancelCaption="Don't delete"
                onAccept={onAccept}
              />
            }
            break
          case EditorActionT.Pick:
            {
              const
                layout = getActiveLayout(),
                pageSetupB = box<PageSetup>({
                  layoutDef: identifyLayoutDef(layout),
                  width: layout.width ? parsePx(layout.width) : 0,
                }),
                choices = cardDefs.map(({ view, icon }) => {
                  const onClick = () => { editorActionB({ t: EditorActionT.Add, view }) }
                  return (
                    <div key={view} className={css.card} onClick={onClick}>
                      <div className={css.cardIcon} >
                        <Fluent.FontIcon iconName={icon} />
                      </div>
                      <div className={css.cardCaption}>{labelize(view)}</div>
                    </div>
                  )
                }),
                save = () => {
                  const
                    page = wave.fork(),
                    { layoutDef, width } = pageSetupB(),
                    layout = { ...layoutDef.layout }
                  if (width) layout.width = `${width}px`
                  page.set('__meta__ layouts', [layout])
                  page.push()
                },
                renderFooter = () => (
                  <Fluent.Stack horizontal tokens={{ childrenGap: 10 }}>
                    <Fluent.PrimaryButton onClick={save}>Apply changes</Fluent.PrimaryButton>
                  </Fluent.Stack>
                )
              content = (
                <Fluent.Panel
                  headerText='Edit this page'
                  isLightDismiss={true}
                  onDismiss={onDismiss}
                  isOpen={true}
                  onRenderFooterContent={renderFooter}
                  isFooterAtBottom={true}
                >
                  <Divider>Add Content</Divider>
                  <div className={css.cards}>{choices}</div>
                  <Divider>Page Setup</Divider>
                  <PageSetupView key={xid()} pageSetupB={pageSetupB} />
                </Fluent.Panel>
              )
            }
            break
        }
        return (
          <>
            <div data-test={name} className={css.fab} onClick={addCard} >
              <Fluent.FontIcon iconName='WindowEdit' />
            </div>
            {content}
          </>
        )
      }
    return { render, changed, editorActionB }
  })

cards.register('editor', View)
