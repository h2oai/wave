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
import { stylesheet, style } from 'typestyle'
import * as Fluent from '@fluentui/react'
import { clas, cssVar } from '../theme'
import { getColorFromString, isDark } from '@fluentui/react'

const
  HEADER_HEIGHT = 40,
  IMAGE_CAPTIONS_HEIGHT = 60,
  IMAGE_NAV_HEIGHT = 142

const
  iconStyles: Fluent.IButtonStyles = {
    flexContainer: { justifyContent: 'center' },
    root: { margin: '4px 4px', width: 38, height: 38, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    rootHovered: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    icon: { color: '#fff', lineHeight: 22, height: 'unset', padding: 4 },
    iconHovered: { color: '#fff' },
    iconPressed: { color: 'rgba(255, 255, 255, 0.7)' },
  },
  css = stylesheet({
    body: {
      position: 'fixed',
      inset: '0px',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    img: {
      maxWidth: '100%',
      objectFit: 'scale-down',
    },
    header: {
      height: HEADER_HEIGHT,
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
    },
    imageNav: {
      height: IMAGE_NAV_HEIGHT,
      overflow: 'auto',
      whiteSpace: 'nowrap'
    },
    navImg: {
      boxSizing: 'border-box',
      objectFit: 'cover',
      height: '120px',
      width: '120px',
      margin: '0px 2px',
      cursor: 'pointer',
      filter: 'brightness(30%)',
      border: '2px solid black'
    },
    arrow: {
      position: "absolute",
      top: "50%",
      width: "auto",
      padding: "16px",
      marginTop: "-50px",
      color: "#fff",
    },
    imgCaptions: { whiteSpace: 'nowrap', padding: '10px 40px', height: '40px' },
    text: { textOverflow: 'ellipsis', overflow: 'hidden' },
    title: { fontWeight: 500 },
    description: { color: '#bbb' },
    navImgContainer: { display: 'inline-block', width: '124px' }
  })

type Image = { title: S, description?: S, type?: S, image?: S, path?: S }

interface LightboxProps {
  visible: B,
  onDismiss: () => void,
  images: Image[],
  defaultImageIdx?: U
}

export const getImageSrc = ({ type, image, path }: Image) => path
  ? path
  : (image && type)
    ? `data:image/${type};base64,${image}`
    : ''

const
  lazyImageObserver = new IntersectionObserver(entries =>
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement
        lazyImage.src = lazyImage.dataset.src!
        lazyImage.classList.remove("lazy")
        lazyImageObserver.unobserve(lazyImage)
      }
    })
  )

export const Lightbox = ({ visible, onDismiss, images, defaultImageIdx }: LightboxProps) => {
  const
    [activeImageIdx, setActiveImageIdx] = React.useState(defaultImageIdx || 0),
    { title, description } = images[activeImageIdx],
    isGallery = images.length > 1,
    FOOTER_HEIGHT = isGallery ? IMAGE_CAPTIONS_HEIGHT + IMAGE_NAV_HEIGHT : IMAGE_CAPTIONS_HEIGHT,
    imageNavRef = React.useRef<HTMLDivElement | null>(null),
    navImgRefs: React.RefObject<HTMLImageElement>[] = images.map(() => React.createRef()),
    activeColor = isDark(getColorFromString(cssVar('$neutralPrimary'))!) ? cssVar('$card') : cssVar('$neutralPrimary'),
    imageHighlightStyle = { filter: 'unset', border: '2px solid', borderColor: activeColor },
    onClose = () => {
      onDismiss()
      setActiveImageIdx(defaultImageIdx || 0)
      if (imageNavRef.current) imageNavRef.current.scrollLeft = 0
    },
    handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === 'Escape') onClose()
      if (key === 'ArrowRight') setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1)
      else if (key === 'ArrowLeft') setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1)
    }

  React.useEffect(() => {
    // Set initial scroll position.
    if (isGallery) navImgRefs[activeImageIdx].current!.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'center' })
    // Add keyboard events listener.
    if (visible) window.addEventListener("keydown", handleKeyDown)
    else window.removeEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  // Handle image navigation scroll.
  React.useEffect(() => {
    if (isGallery) navImgRefs[activeImageIdx].current!.scrollIntoView({
      behavior: (activeImageIdx === 0 || activeImageIdx === images.length - 1) ? 'auto' : 'smooth',
      inline: 'center',
      block: 'center'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageIdx, images.length])

  React.useLayoutEffect(() => {
    // Initialize intersection observer for lazy images.
    const lazyImages = [].slice.call(document.querySelectorAll(".lazy"))
    lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
  }, [])

  return (
    <div className={css.body} style={{ display: visible ? 'block' : 'none' }}>
      <div className={css.header}>
        <Fluent.ActionButton
          styles={iconStyles}
          onClick={onClose}
          iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' } }}
        />
      </div>
      <div className={css.content} style={{ height: `calc(100% - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)` }}>
        <img className={css.img} alt={title} src={getImageSrc(images[activeImageIdx])} />
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
      <div className={css.footer} style={{ height: FOOTER_HEIGHT }}>
        <div className={css.imgCaptions}>
          <div title={title} className={clas(css.text, css.title)}>{title}</div>
          <div title={description} className={clas(css.text, css.description)}>{description || ''}</div>
        </div>
        {isGallery && <div className={css.imageNav} ref={imageNavRef}>
          {images.map((image, idx) =>
            <div key={idx} className={css.navImgContainer}>
              <img
                className={clas(css.img, css.navImg, 'lazy', style({ $nest: { '&:hover': imageHighlightStyle } }))}
                ref={navImgRefs[idx]}
                style={activeImageIdx === idx ? imageHighlightStyle : undefined}
                alt={title}
                data-src={getImageSrc(image)}
                onClick={() => setActiveImageIdx(idx)}
              />
            </div>
          )}</div>}
      </div>
    </div>
  )
}
