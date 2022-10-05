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
        icon: { color: '#fff', lineHeight: 22, height: 'unset', padding: 4 },
        iconHovered: { color: '#fff' },
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
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
        img: {
            maxWidth: '100%',
            objectFit: 'scale-down',
        },
        header: {
            width: '100%',
            height: '40px',
            textAlign: 'right'
        },
        content: {
            display: 'flex',
            position: 'relative',
            overflow: 'auto',
            justifyContent: 'center',
        },
        footer: {
            textAlign: 'center',
            color: '#fff',
            width: '100%'
        },
        imageNav: {
            height: '142px',
            paddingTop: '20px',
            overflow: 'auto',
            whiteSpace: 'nowrap'
        },
        navImg: {
            boxSizing: 'border-box',
            objectFit: 'cover',
            height: '120px',
            width: '120px',
            margin: '0px 2px',
            filter: 'brightness(30%)',
            border: '2px solid black',
            $nest: {
                '&:hover': {
                    filter: 'unset',
                    border: '2px solid red'
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
            color: "#fff",
            userSelect: "none",
        },
        imgCaptions: {
            whiteSpace: 'nowrap',
            padding: '10px 40px',
            height: '20px'
        },
        text: { textOverflow: 'ellipsis', overflow: 'hidden' },
        title: { fontWeight: 500 },
        description: { color: '#bbb' },
        navImgPlaceholder: { display: 'inline-block', width: '124px' }
    })

interface Props {
    visible: B,
    onDismiss: () => void,
    images: { title: S, description?: S, type?: S, image?: S, path?: S, }[],
    defaultImageIdx?: U
}

const
    keys = { esc: 27, left: 37, right: 39 } as const,
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
        [activeImageIdx, _setActiveImageIdx] = React.useState(defaultImageIdx || 0),
        activeImageRef = React.useRef(defaultImageIdx || 0),
        setActiveImageIdx = (idx: U) => {
            activeImageRef.current = idx
            _setActiveImageIdx(idx)
        },
        imageNavRef = React.useRef<HTMLDivElement | undefined>()

    // handle image navigation scroll
    React.useEffect(() => {
        const navRef = imageNavRef.current
        if (navRef) {
            const
                viewportImageCount = Math.floor(navRef?.clientWidth / 124),
                isActiveImageRight = activeImageIdx >= Math.floor(navRef.scrollLeft / 124) + (viewportImageCount - 1),
                isActiveImageLeft = activeImageIdx <= Math.floor(navRef.scrollLeft / 124)

            if (activeImageIdx === 0) navRef.scrollLeft = 0
            else if (activeImageIdx === images.length - 1) navRef.scrollLeft = navRef.scrollWidth - navRef?.clientWidth
            else if (isActiveImageLeft) navRef.scrollBy({ left: (activeImageIdx - 1) * 124 - navRef.scrollLeft, behavior: 'smooth' })
            else if (isActiveImageRight) navRef.scrollBy({ left: (activeImageIdx + 2 - viewportImageCount) * 124 - navRef.scrollLeft, behavior: 'smooth' })
        }
    }, [activeImageIdx, images.length])

    // initialize intersection observer for lazy images
    React.useLayoutEffect(() => {
        const lazyImages = [].slice.call(document.querySelectorAll(".lazy"))
        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // set initial scroll position when defaultImageIdx is specified
    React.useEffect(() => {
        if (defaultImageIdx && imageNavRef.current) {
            imageNavRef.current.scrollLeft = (activeImageIdx * 124) - 124 - imageNavRef.current.scrollLeft
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible])

    // Add keyboard events listener
    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (images.length === 0) throw new Error('No images passed to image lightbox component.')
    if (activeImageIdx >= images.length) throw new Error(`Image with defaultImageIdx:${activeImageIdx} does not exist.`)

    const
        { type, image, path, title, description } = images[activeImageIdx],
        src = path
            ? path
            : (image && type)
                ? `data:image/${type};base64,${image}`
                : '',
        isGallery = images.length > 1,
        onClose = () => {
            onDismiss()
            setActiveImageIdx(defaultImageIdx || 0)
            if (imageNavRef.current) imageNavRef.current.scrollLeft = 0
        },
        handleKeyDown = React.useCallback((ev: KeyboardEvent) => {
            switch (ev.keyCode) {
                case keys.right:
                    setActiveImageIdx(activeImageRef.current === images.length - 1 ? 0 : activeImageRef.current + 1)
                    break
                case keys.left:
                    setActiveImageIdx(activeImageRef.current === 0 ? images.length - 1 : activeImageRef.current - 1)
                    break
                case keys.esc:
                    onClose()
                    break
                default:
                    break
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [activeImageIdx, images.length])

    return (
        <div aria-hidden={true} className={css.body} style={visible ? undefined : { display: 'none' }}>
            <div className={css.header}>
                <Fluent.ActionButton
                    styles={iconStyles}
                    onClick={onClose}
                    iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' }, }}
                />
            </div>
            <div className={css.content} style={{ height: `calc(100% - ${isGallery ? '262px' : '100px'})` }}>
                <img className={css.img} alt={title} src={src} />
                {isGallery &&
                    <>
                        <div className={css.arrow} style={{ left: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={() => setActiveImageIdx(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1)}
                                iconProps={{ iconName: 'ChevronLeft', style: { fontSize: '22px' } }}
                            />
                        </div>
                        <div className={css.arrow} style={{ right: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={() => setActiveImageIdx(activeImageIdx === images.length - 1 ? 0 : activeImageIdx + 1)}
                                iconProps={{ iconName: 'ChevronRight', style: { fontSize: '22px' } }}
                            />
                        </div>
                    </>
                }
            </div>
            <div className={css.footer} style={{ height: isGallery ? '260px' : '60px' }}>
                <div className={css.imgCaptions}>
                    <div title={title} className={clas(css.text, css.title)}>{title}</div>
                    <div title={description} className={clas(css.text, css.description)}>{description || ''}</div>
                </div>
                {isGallery && <div className={css.imageNav} ref={imageNavRef}>
                    {images.map(({ type, image, path, title }, idx) => {
                        const src = path
                            ? path
                            : (image && type)
                                ? `data:image/${type};base64,${image}`
                                : ''
                        return <div key={idx} className={css.navImgPlaceholder}>
                            <img
                                className={clas(css.img, css.navImg, 'lazy')}
                                style={activeImageIdx === idx ? { filter: 'unset', border: '2px solid red' } : undefined}
                                alt={title}
                                data-src={src}
                                onClick={() => setActiveImageIdx(idx)}
                            />
                        </div>
                    })}
                </div>}
            </div>
        </div>
    )
}
