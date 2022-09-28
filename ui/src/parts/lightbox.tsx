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

import { B, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import * as Fluent from '@fluentui/react'
import { clas } from '../theme'

const
    iconStyles: Fluent.IButtonStyles = {
        icon: { color: '#ffffff', lineHeight: 22, height: 'unset', padding: 4 },
        iconHovered: { color: '#ffffff' }, // TODO:
        iconPressed: { color: 'rgba(255, 255, 255, 0.7)' },
        flexContainer: { justifyContent: 'center' },
        root: { margin: '4px 4px', width: 38, height: 38, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
        rootHovered: { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
    },
    css = stylesheet({
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
            // flexGrow: 1,
            maxWidth: '100%',
            alignSelf: 'center',
            // objectFit: 'scale-down',
            transformOrigin: 'top left',
            transition: 'transform 0.25s ease',
            cursor: 'pointer',
        },
        header: {
            width: '100%',
            height: '40px',
            textAlign: 'right'
        },
        content: {
            display: 'flex',
            position: 'relative',
            maxWidth: '100%',
            overflow: 'auto',
            justifyContent: 'center',
        },
        footer: {
            textAlign: 'center',
            color: '#ffffff', // TODO:
            width: '100%'
        },
        imageNav: {
            height: '180px',
            paddingTop: '20px',
            overflow: 'auto',
            whiteSpace: 'nowrap'
        },
        navImg: {
            height: '160px',
            objectFit: 'cover',
            width: '160px',
            padding: '0px 1px',
            opacity: 0.6,
            $nest: {
                '&:hover': {
                    opacity: 1
                }
            }
        },
        arrow: {
            cursor: "pointer",
            position: "absolute",
            top: "50%",
            width: "auto",
            padding: "16px",
            marginTop: "-50px",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            transition: "0.6s ease",
            borderRadius: "0 3px 3px 0",
            userSelect: "none",
        },
        imgCaptions: {
            whiteSpace: 'nowrap',
            padding: '10px 40px',
            height: '20px'
        },
        text: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },
        title: { fontWeight: 500 },
        description: { opacity: 0.85 }
    })

interface Props {
    visible: B,
    onDismiss: () => void,
    images: {
        title: S,
        description?: S,
        type?: S,
        image?: S,
        path?: S,
    }[],
    defaultImageIdx?: U
}

const
    zoomLevels: { [key: U]: U } = { 0: 1, 1: 1.5, 2: 2, 3: 3, 4: 4 },
    lazyImageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyImage = entry.target as HTMLImageElement
                lazyImage.src = lazyImage.dataset.src!
                lazyImage.classList.remove("lazy")
                lazyImageObserver.unobserve(lazyImage)
            }
        })
    })

export const Lightbox = ({ visible, onDismiss, images, defaultImageIdx }: Props) => {
    const
        [activeImageIdx, setActiveImageIdx] = React.useState(defaultImageIdx || 0),
        [zoomLevel, setZoomLevel] = React.useState(0),
        imageNavRef = React.useRef<HTMLDivElement | undefined>()

    React.useEffect(() => {
        if (imageNavRef.current) imageNavRef.current.scrollLeft = activeImageIdx * 162
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageNavRef.current, activeImageIdx])

    React.useLayoutEffect(() => {
        const lazyImages = [].slice.call(document.querySelectorAll(".lazy"))
        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (images.length === 0 || (activeImageIdx >= images.length)) return <>{'Error'}</> // TODO:
    const
        { type, image, path, title, description } = images[activeImageIdx],
        src = path
            ? path
            : (image && type)
                ? `data:image/${type};base64,${image}`
                : ''

    return (
        <div aria-hidden={true} className={css.body} style={visible ? undefined : { display: 'none' }} >
            <div className={css.header}>
                <Fluent.ActionButton
                    styles={iconStyles}
                    onClick={() => {
                        setZoomLevel(0)
                        onDismiss()
                    }}
                    iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' } }}
                />
            </div>
            <div className={css.content} style={{ height: `calc(100% - ${images.length > 1 ? '300px' : '100px'})` }}>
                <img
                    className={css.img}
                    alt={title}
                    src={src}
                    style={{
                        transform: `scale(${zoomLevels[zoomLevel]})`, // TODO:
                        cursor: zoomLevel < 4 ? 'zoom-in' : 'zoom-out',
                        maxHeight: 'inherit',
                        // objectFit: 'none'
                    }}
                    onClick={(_ev) => {
                        const zoom = zoomLevel === 4 ? 0 : zoomLevel + 1
                        setZoomLevel(zoom)
                    }}
                />
                {images.length > 1 &&
                    <>
                        <div className={css.arrow} style={{ left: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={() => {
                                    setActiveImageIdx((activeImageIdx === 0) ? (images.length - 1) : activeImageIdx - 1)
                                    setZoomLevel(0)
                                }}
                                iconProps={{ iconName: 'ChevronLeft', style: { fontSize: '22px' } }}
                            />
                        </div>
                        <div className={css.arrow} style={{ right: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={() => {
                                    setActiveImageIdx((activeImageIdx === images.length - 1) ? 0 : activeImageIdx + 1)
                                    setZoomLevel(0)
                                }}
                                iconProps={{ iconName: 'ChevronRight', style: { fontSize: '22px' } }}
                            />
                        </div>
                    </>
                }
            </div>
            <div className={css.footer} style={{ height: images.length > 1 ? '260px' : '60px' }}>
                <div className={css.imgCaptions}>
                    <div title={title} className={clas(css.text, css.title)}>{title}</div>
                    <div title={description} className={clas(css.text, css.description)}>{description ? description : ''}</div>
                </div>
                {images.length > 1 && <div className={css.imageNav} ref={imageNavRef}>
                    {images.map(({ type, image, path, title }, idx) => {
                        const src = path
                            ? path
                            : (image && type)
                                ? `data:image/${type};base64,${image}`
                                : ''
                        return <img key={idx} className={clas(css.img, css.navImg, 'lazy')} style={activeImageIdx === idx ? { opacity: 1 } : undefined} alt={title} data-src={src} onClick={() => { setActiveImageIdx(idx) }} />
                    })}
                </div>}
            </div>
        </div>
    )
}
