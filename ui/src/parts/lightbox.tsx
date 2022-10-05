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
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // TODO:
            touchAction: 'pinch-zoom' // TODO:
        },
        img: {
            // flexGrow: 1,
            maxWidth: '100%', // TODO: 3000x2000 vertical scrollbar
            // alignSelf: 'center',
            objectFit: 'scale-down',
            // transformOrigin: 'top left',
            // transition: 'transform 0.25s ease',
            // cursor: 'pointer',
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
            height: '142px',
            paddingTop: '20px',
            overflow: 'auto',
            whiteSpace: 'nowrap'
        },
        navImg: {
            boxSizing: 'border-box',
            height: '120px',
            objectFit: 'cover',
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
        description: { color: '#bbbbbb' }, // TODO: theme colors
        navImgPlaceholder: { display: 'inline-block', width: '124px' }
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

const lazyImageObserver = new IntersectionObserver(entries => {
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
        imageNavRef = React.useRef<HTMLDivElement | undefined>(),
        handleClickLeft = () => {
            const nextImgIdx = (activeImageIdx === 0) ? (images.length - 1) : activeImageIdx - 1
            setActiveImageIdx(nextImgIdx)
            if (imageNavRef.current) {
                const isLeft = activeImageIdx <= Math.floor(imageNavRef.current.scrollLeft / 124)
                if (nextImgIdx === images.length - 1) imageNavRef.current.scrollLeft = imageNavRef.current.scrollWidth - imageNavRef.current?.clientWidth
                else if (isLeft) imageNavRef.current.scrollBy({ left: (activeImageIdx * 124) - 124 - imageNavRef.current.scrollLeft, top: 0, behavior: 'smooth' })
            }
        },
        handleClickRight = () => {
            const nextImgIdx = (activeImageIdx === images.length - 1) ? 0 : activeImageIdx + 1
            setActiveImageIdx(nextImgIdx)
            if (imageNavRef.current) {
                const pageImageCount = Math.floor(imageNavRef.current?.clientWidth / 124)
                const isRight = activeImageIdx >= Math.floor(imageNavRef.current.scrollLeft / 124) + (pageImageCount - 1)
                if (nextImgIdx === 0) imageNavRef.current.scrollLeft = 0
                else if (isRight) imageNavRef.current.scrollBy({ left: ((activeImageIdx + 1 - pageImageCount) * 124) + 124 - imageNavRef.current.scrollLeft, top: 0, behavior: 'smooth' })
            }
        },
        onClose = () => {
            onDismiss()
            setActiveImageIdx(defaultImageIdx || 0)
            if (imageNavRef.current) imageNavRef.current.scrollLeft = 0
        }

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
                    onClick={onClose}
                    iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' }, }}
                />
            </div>
            <div className={css.content} style={{ height: `calc(100% - ${images.length > 1 ? '262px' : '100px'})` }}>
                <img
                    className={css.img}
                    alt={title}
                    src={src}
                    style={{
                        // maxHeight: 'inherit',
                        // objectFit: 'none'
                    }}
                />
                {images.length > 1 &&
                    <>
                        <div className={css.arrow} style={{ left: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={handleClickLeft}
                                iconProps={{ iconName: 'ChevronLeft', style: { fontSize: '22px' } }}
                            />
                        </div>
                        <div className={css.arrow} style={{ right: 0 }}>
                            <Fluent.ActionButton
                                styles={iconStyles}
                                onClick={handleClickRight}
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
                        return <div key={idx} className={css.navImgPlaceholder}>
                            <img
                                key={'img' + idx}
                                className={clas(css.img, css.navImg, 'lazy')}
                                style={activeImageIdx === idx ? { filter: 'unset', border: '2px solid red' } : undefined}
                                alt={title}
                                data-src={src}
                                onClick={() => { setActiveImageIdx(idx) }}
                            />
                        </div>
                    })}
                </div>}
            </div>
        </div>
    )
}
