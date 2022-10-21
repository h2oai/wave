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

import { box, Box, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet, style } from 'typestyle'
import * as Fluent from '@fluentui/react'
import { clas, cssVar } from '../theme'
import { getColorFromString, isDark } from '@fluentui/react'

export const lightboxB: Box<LightboxProps | null> = box(null)

const
  HEADER_HEIGHT = 40,
  IMAGE_CAPTIONS_HEIGHT = 60,
  IMAGE_NAV_HEIGHT = 142

const
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
      border: '2px solid #000'
    },
    imgCaptions: {
      whiteSpace: 'nowrap',
      padding: '10px 40px',
      height: IMAGE_CAPTIONS_HEIGHT - 20
    },
    text: {
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    title: {
      fontWeight: 500
    },
    description: {
      color: '#bbb'
    },
    navImgContainer: {
      display: 'inline-block',
      width: '124px'
    },
    iconStylesRootArrow: {
      position: "absolute",
      top: "50%",
      padding: "16px",
      marginTop: "-50px"
    }
  }),
  iconStyles: Fluent.IButtonStyles = {
    flexContainer: { justifyContent: 'center' },
    root: { margin: '4px 4px', width: 38, height: 38, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    rootHovered: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    icon: { color: '#fff', lineHeight: 22, height: 'unset', padding: 4 },
    iconHovered: { color: '#fff' },
    iconPressed: { color: 'rgba(255, 255, 255, 0.7)' },
  }

type Image = { title: S, description?: S, type?: S, image?: S, path?: S }

interface LightboxProps {
  images: Image[],
  defaultImageIdx?: U
}

export const getImageSrc = ({ type, image, path }: Image) => path
  ? path
  : (image && type)
    ? `data:image/${type};base64,${image}`
    : ''

export const Lightbox = ({ images, defaultImageIdx }: LightboxProps) => {
  const
    [activeImageIdx, setActiveImageIdx] = React.useState(defaultImageIdx || 0),
    { title, description } = images[activeImageIdx],
    isGallery = images.length > 1,
    FOOTER_HEIGHT = isGallery ? IMAGE_CAPTIONS_HEIGHT + IMAGE_NAV_HEIGHT : IMAGE_CAPTIONS_HEIGHT,
    imageNavRef = React.useRef<HTMLDivElement | null>(null),
    defaultScrollSetRef = React.useRef(false),
    activeColor = isDark(getColorFromString(cssVar('$neutralPrimary'))!) ? cssVar('$card') : cssVar('$neutralPrimary'),
    imageHighlightStyle = { filter: 'unset', border: '2px solid', borderColor: activeColor },
    lazyImageObserver = new window.IntersectionObserver(entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement
          lazyImage.src = lazyImage.dataset.src!
          lazyImage.classList.remove("lazy")
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    ),
    handleKeyDown = (ev: KeyboardEvent) => {
      if (['Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) >= 0) ev.preventDefault()
      if (ev.key === 'Escape') lightboxB(null)
      if (ev.key === 'ArrowRight') setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1)
      else if (ev.key === 'ArrowLeft') setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1)
    }

  React.useEffect(() => {
    // Initialize intersection observer for lazy images.
    const lazyImages = [].slice.call(document.querySelectorAll(".lazy"))
    lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))

    // Add keyboard events listener.
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle image navigation scroll.
  React.useEffect(() => {
    if (isGallery && imageNavRef.current) {
      const
        navRef = imageNavRef.current,
        scrollLeftMiddle = (navRef.clientWidth / 2) - 62,
        scrollLeftActiveImage = activeImageIdx * 124,
        scrollBehavior = defaultScrollSetRef.current ? 'smooth' : 'auto'
      if (activeImageIdx === 0) navRef.scrollLeft = 0
      else if (activeImageIdx === images.length - 1) navRef.scrollLeft = navRef.scrollWidth - navRef?.clientWidth
      else if (scrollLeftActiveImage > scrollLeftMiddle) navRef.scrollTo({ left: scrollLeftActiveImage - scrollLeftMiddle, behavior: scrollBehavior })
      else navRef.scrollTo({ left: 0, behavior: scrollBehavior })

      if (!defaultScrollSetRef.current) defaultScrollSetRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImageIdx])

  return (
    <div className={css.body}>
      <div className={css.header}>
        <Fluent.ActionButton
          styles={iconStyles}
          onClick={() => lightboxB(null)}
          iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' } }}
        />
      </div>
      <div className={css.content} style={{ height: `calc(100% - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)` }}>
        <img className={css.img} alt={title} src={getImageSrc(images[activeImageIdx])} />
        {isGallery &&
          <>
            <Fluent.ActionButton
              styles={iconStyles}
              className={css.iconStylesRootArrow}
              style={{ left: 0 }}
              onClick={() => setActiveImageIdx(activeImageIdx === 0 ? images.length - 1 : activeImageIdx - 1)}
              iconProps={{ iconName: 'ChevronLeft', style: { fontSize: '22px' } }}
            />
            <Fluent.ActionButton
              styles={iconStyles}
              className={css.iconStylesRootArrow}
              style={{ right: 0 }}
              onClick={() => setActiveImageIdx(activeImageIdx === images.length - 1 ? 0 : activeImageIdx + 1)}
              iconProps={{ iconName: 'ChevronRight', style: { fontSize: '22px' } }}
            />
          </>
        }
      </div>
      <div className={css.footer} style={{ height: FOOTER_HEIGHT }}>
        <div className={css.imgCaptions}>
          <div title={title} className={clas(css.text, css.title)}>{title}</div>
          <div title={description} className={clas(css.text, css.description)}>{description || ''}</div>
        </div>
        {isGallery &&
          <div className={css.imageNav} ref={imageNavRef}>
            {images.map((image, idx) =>
              <div key={idx} className={css.navImgContainer}>
                <img
                  className={clas(css.img, css.navImg, 'lazy', style({ $nest: { '&:hover': imageHighlightStyle } }))}
                  style={activeImageIdx === idx ? imageHighlightStyle : undefined}
                  alt={title}
                  data-src={getImageSrc(image)}
                  onClick={() => setActiveImageIdx(idx)}
                />
              </div>
            )}
          </div>
        }
      </div>
    </div>
  )
}
