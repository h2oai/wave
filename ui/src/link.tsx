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
import { B, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Component } from './form'
import { clas, margin } from './theme'

/**
 * Create a hyperlink.
 *
 * Hyperlinks can be internal or external.
 * Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
 * All other kinds of paths are treated as external hyperlinks.
 */
export interface Link {
  /** The text to be displayed. If blank, the `path` is used as the label. */
  label?: S
  /** The path or URL to link to. */
  path?: S
  /** True if the link should be disabled. */
  disabled?: B
  /** True if the link should prompt the user to save the linked URL instead of navigating to it. Works only if `button` is false. */
  download?: B
  /** True if the link should be rendered as a button. */
  button?: B
  /** The width of the link, e.g. '100px'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** Where to display the link. Setting this to an empty string or `'_blank'` opens the link in a new tab or window. */
  target?: S
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}
const
  css = stylesheet({
    linkGroup: {
      margin: margin(-6, 12, 0, 12),
      $nest: {
        a: {
          display: 'block',
          marginTop: 8
        },
        'a:first-of-type': {
          marginTop: 0
        }
      }
    },
    linkGroupLabel: {
      marginBottom: 10
    },
    inline: {
      display: 'flex',
      $nest: {
        a: {
          marginRight: 16
        },
        'a:last-child': {
          marginRight: 0
        },
      }
    }
  })

/** Create a collection of links. */
export interface Links {
  /** The links contained in this group. */
  items: Component[]
  /** The name of the link group. */
  label?: S
  /** Render links horizontally. Defaults to 'false'. */
  inline?: B
  /** The width of the links, e.g. '100px'. */
  width?: S
}

export const
  XLinks = ({ model: { label, items, inline } }: { model: Links }) => (
    <div className={inline ? css.inline : css.linkGroup}>
      {label && <div className={clas('wave-s20 wave-w6', css.linkGroupLabel)}>{label}</div>}
      {items.filter(({ link }) => link).map((link, i) => <XLink key={i} model={link.link!} />)}
    </div>
  ),
  XLink = ({ model: { name, label, disabled, path, download, target, button } }: { model: Link }) => {
    const
      _label = label || path,
      _target = target === '' ? '_blank' : target,
      onBtnClick = React.useCallback(() => window.open(path, _target), [_target, path]),
      onLinkClick = React.useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
        // HACK: Perform download in a new tab because FF drops WS connection - https://bugzilla.mozilla.org/show_bug.cgi?id=858538.
        if (download && path) {
          ev.preventDefault()
          window.open(path, '_blank')
        }
      }, [download, path])

    return button
      ? <Fluent.DefaultButton data-test={name} text={_label} disabled={disabled} onClick={onBtnClick} />
      : <Fluent.Link onClick={onLinkClick} data-test={name} href={path} disabled={disabled} target={_target}>{_label}</Fluent.Link>
  }