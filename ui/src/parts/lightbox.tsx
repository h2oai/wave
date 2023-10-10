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
import { box, Box, S, U } from '../core'
import React from 'react'
import { stylesheet } from 'typestyle'
import { clas } from '../theme'

export const lightboxB: Box<LightboxProps | null> = box()

const
  IMAGE_CAPTIONS_HEIGHT = 46, // Total height of title and decription.
  NAV_IMAGE_SIZE = 120,
  IMAGE_NAV_HEIGHT = NAV_IMAGE_SIZE + 28, // 28 is the height of the scrollbar.
  ICON_SIZE = 38,
  LIGHTBOX_PAGE_MARGIN = 8

const
  imageHighlightStyle = { filter: 'unset', border: '2px solid', borderColor: '#FFF' },
  css = stylesheet({
    body: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      cursor: 'pointer'
    },
    img: {
      position: 'absolute',
      margin: 'auto',
      left: 0,
      right: 0,
      top: ICON_SIZE + LIGHTBOX_PAGE_MARGIN * 2,
      maxWidth: '100vw',
      cursor: 'auto'
    },
    closeButton: {
      position: 'absolute',
      right: LIGHTBOX_PAGE_MARGIN,
      top: LIGHTBOX_PAGE_MARGIN
    },
    imageNav: {
      position: 'absolute',
      left: '50%',
      bottom: LIGHTBOX_PAGE_MARGIN,
      height: IMAGE_NAV_HEIGHT,
      whiteSpace: 'nowrap',
      overflowX: 'auto',
      maxWidth: '100vw',
      transform: 'translateX(-50%)',
      cursor: 'auto'
    },
    navImg: {
      height: NAV_IMAGE_SIZE,
      width: NAV_IMAGE_SIZE,
      boxSizing: 'border-box',
      objectFit: 'cover',
      margin: '2px',
      cursor: 'pointer',
      filter: 'brightness(30%)',
      border: '2px solid #000'
    },
    text: {
      position: 'absolute',
      left: '50%',
      maxWidth: `calc(100vw - ${2 * LIGHTBOX_PAGE_MARGIN}px)`,
      boxSizing: 'border-box',
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      transform: 'translateX(-50%)',
      cursor: 'auto'
    },
    title: {
      fontWeight: 500
    },
    description: {
      color: '#bbb'
    },
    iconStylesRootArrow: {
      position: "absolute",
      top: "50%",
      border: '1px solid #000',
      transform: 'translateY(-50%)'
    },
    imgHighlight: {
      $nest: {
        '&:hover': imageHighlightStyle,
      }
    }
  }),
  iconStyles: Fluent.IButtonStyles = {
    flexContainer: { justifyContent: 'center' },
    root: { margin: 4, width: ICON_SIZE, height: ICON_SIZE, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    rootHovered: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    icon: { color: '#fff', lineHeight: 22, height: 'unset', padding: 4, fontSize: '22px' },
    iconHovered: { color: '#fff' },
    iconPressed: { color: 'rgba(255, 255, 255, 0.7)' },
  }

type Image = { title: S, description?: S, type?: S, image?: S, path?: S }

export interface LightboxProps {
  images: Image[],
  defaultImageIdx?: U
}

export const Lightbox = ({ images, defaultImageIdx }: LightboxProps) => {
  const
    [activeImageIdx, setActiveImageIdx] = React.useState(defaultImageIdx || 0),
    { title, description } = images[activeImageIdx],
    isGallery = images.length > 1,
    FOOTER_HEIGHT = IMAGE_CAPTIONS_HEIGHT + LIGHTBOX_PAGE_MARGIN + (isGallery ? IMAGE_NAV_HEIGHT : 0),
    rootElementRef = React.useRef<HTMLDivElement | null>(null),
    imageNavRef = React.useRef<HTMLDivElement | null>(null),
    defaultScrollSetRef = React.useRef(false),
    lazyImageObserverRef = React.useRef(new IntersectionObserver((entries, observer) =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement
          lazyImage.src = lazyImage.dataset.src!
          lazyImage.classList.remove("lazy")
          observer.unobserve(lazyImage)
        }
      })
    )),
    handleShowPrevImage = () => setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1),
    handleShowNextImage = () => setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1),
    handleKeyDown = (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') lightboxB(null)
      else if (ev.key === 'ArrowRight') handleShowNextImage()
      else if (ev.key === 'ArrowLeft') handleShowPrevImage()
    },
    handleCloseOnFreeSpaceClick = (ev: React.MouseEvent) => {
      if (ev.target === ev.currentTarget) lightboxB(null)
    }

  React.useEffect(() => {
    // Initialize intersection observer for lazy images.
    rootElementRef.current?.querySelectorAll(".lazy").forEach(lazyImage => lazyImageObserverRef.current.observe(lazyImage))

    // Add keyboard events listener.
    rootElementRef?.current?.focus()

    const observer = lazyImageObserverRef.current
    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle image navigation scroll.
  React.useEffect(() => {
    if (isGallery && imageNavRef.current) {
      const
        navRef = imageNavRef.current,
        scrollLeftMiddle = (navRef.clientWidth / 2) - (NAV_IMAGE_SIZE / 2),
        scrollLeftActiveImage = activeImageIdx * NAV_IMAGE_SIZE,
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
    <div
      className={css.body}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={rootElementRef}
      onClick={handleCloseOnFreeSpaceClick}
    >
      <Fluent.ActionButton
        styles={iconStyles}
        className={css.closeButton}
        onClick={() => lightboxB(null)}
        iconProps={{ iconName: 'Cancel' }}
      />
      <img
        className={css.img}
        style={{
          bottom: FOOTER_HEIGHT,
          maxHeight: `calc(100vh - ${(2 * LIGHTBOX_PAGE_MARGIN) + ICON_SIZE + FOOTER_HEIGHT}px)`
        }}
        alt={title}
        src={images[activeImageIdx].path}
      />
      <span
        title={title}
        className={clas(css.text, css.title)}
        style={{ bottom: FOOTER_HEIGHT - (IMAGE_CAPTIONS_HEIGHT * 0.4) }}>
        {title}
      </span>
      <span
        title={description}
        className={clas(css.text, css.description)}
        style={{ bottom: FOOTER_HEIGHT - (IMAGE_CAPTIONS_HEIGHT * 0.8) }}>
        {description || ''}
      </span>
      {isGallery &&
        <>
          <Fluent.ActionButton
            styles={iconStyles}
            className={css.iconStylesRootArrow}
            style={{ left: LIGHTBOX_PAGE_MARGIN }}
            onClick={handleShowPrevImage}
            iconProps={{ iconName: 'ChevronLeft' }}
          />
          <Fluent.ActionButton
            styles={iconStyles}
            className={css.iconStylesRootArrow}
            style={{ right: LIGHTBOX_PAGE_MARGIN }}
            onClick={handleShowNextImage}
            iconProps={{ iconName: 'ChevronRight' }}
          />
          <div className={css.imageNav} ref={imageNavRef}>
            {images.map((image, idx) =>
              <img
                key={idx}
                className={clas(css.navImg, 'lazy', css.imgHighlight)}
                style={activeImageIdx === idx ? imageHighlightStyle : undefined}
                alt={title}
                data-src={image.path}
                onClick={() => setActiveImageIdx(idx)}
              />
            )}
          </div>
        </>
      }
    </div>
  )
}
