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

import { B, S } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import * as Fluent from '@fluentui/react'

const css = stylesheet({
    body: {
        position: 'fixed',
        inset: '0px',
        width: '100%',
        height: '100%',
        zIndex: 1,
        backgroundColor: '#000000', // TODO:
        touchAction: 'pinch-zoom' // TODO:
    },
    img: {
        flexGrow: 1,
        objectFit: 'contain',
        cursor: 'pointer'
    },
    header: {
        width: '100%',
        height: '40px',
        textAlign: 'right'
    },
    content: {
        display: 'flex',
        maxHeight: 'calc(100% - 100px)',
        maxWidth: '100%',
    },
    footer: {
        height: '60px',
        textAlign: 'center',
        color: '#ffffff', // TODO:
        width: '100%'
    }
})

interface Props {
    visible: B,
    onDismiss: () => void,
    title: S,
    description?: S,
    type?: S,
    image?: S,
    path?: S,
}

export const Lightbox = ({ visible, onDismiss, type, image, path, title, description }: Props) => {
    const
        src = path
            ? path
            : (image && type)
                ? `data:image/${type};base64,${image}`
                : ''
    return (
        <div aria-hidden={true} className={css.body} style={visible ? undefined : { display: 'none' }} >
            <div className={css.header}>
                <Fluent.ActionButton
                    styles={{
                        icon: { color: '#ffffff' }, // TODO:
                        root: { padding: '10px 10px' }
                    }}
                    onClick={onDismiss}
                    iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' } }}
                />
            </div>
            <div className={css.content}><img className={css.img} alt={title} src={src} /></div>
            <div className={css.footer}>{title}{description ? ` - ${description}` : ''}</div>
        </div>
    )
}
