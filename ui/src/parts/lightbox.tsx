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

export const lightboxB: Box<LightboxProps | null> = box()

const
  HEADER_HEIGHT = 40,
  IMAGE_CAPTIONS_HEIGHT = 40, // Total height of title and decription.
  FOOTER_VERTICAL_PADDING = 10,
  IMAGE_NAV_HEIGHT = 148,
  IMAGE_SIZE = 120,
  ICON_SIZE = 38

const
  css = stylesheet({
    body: {
      position: 'fixed',
      inset: '0px',
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    img: {
      position: 'absolute',
      inset: '0px',
      margin: 'auto',
      maxHeight: '100%',
      maxWidth: '100%',
    },
    header: {
      height: HEADER_HEIGHT,
      textAlign: 'right'
    },
    content: {
      position: 'relative',
    },
    footer: {
      boxSizing: 'border-box',
      padding: `${FOOTER_VERTICAL_PADDING}px 0`,
      textAlign: 'center',
      color: '#fff',
    },
    imageNav: {
      marginTop: 10,
      height: IMAGE_NAV_HEIGHT,
      boxSizing: 'border-box',
      overflow: 'auto',
      whiteSpace: 'nowrap'
    },
    navImg: {
      boxSizing: 'border-box',
      objectFit: 'cover',
      height: IMAGE_SIZE,
      width: IMAGE_SIZE,
      margin: '2px',
      cursor: 'pointer',
      filter: 'brightness(30%)',
      border: '2px solid #000'
    },
    text: {
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      width: 'fit-content',
      margin: '0 auto',
      maxWidth: 'calc(100% - 40px)',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      height: IMAGE_CAPTIONS_HEIGHT / 2
    },
    title: {
      fontWeight: 500
    },
    description: {
      color: '#bbb'
    },
    navImgContainer: {
      display: 'inline-block',
      width: IMAGE_SIZE
    },
    iconStylesRootArrow: {
      position: "absolute",
      top: "50%",
      padding: "16px",
      marginTop: -ICON_SIZE / 2
    }
  }),
  styles: { [key: S]: React.CSSProperties } = {
    icon: { fontSize: '22px' }
  },
  iconStyles: Fluent.IButtonStyles = {
    flexContainer: { justifyContent: 'center' },
    root: { margin: 4, width: ICON_SIZE, height: ICON_SIZE, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    rootHovered: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
    icon: { color: '#fff', lineHeight: 22, height: 'unset', padding: 4 },
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
    FOOTER_HEIGHT = FOOTER_VERTICAL_PADDING * 2 + IMAGE_CAPTIONS_HEIGHT + (isGallery ? IMAGE_NAV_HEIGHT : 0),
    rootElementRef = React.useRef<HTMLDivElement | null>(null),
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
    handleShowPrevImage = () => setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1),
    handleShowNextImage = () => setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1),
    handleKeyDown = (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') lightboxB(null)
      else if (ev.key === 'ArrowRight') handleShowNextImage()
      else if (ev.key === 'ArrowLeft') handleShowPrevImage()
    },
    handleCloseOnFreeSpaceClick = (ev: React.MouseEvent) => {
      if ((ev.target as HTMLElement).parentElement === ev.currentTarget) lightboxB(null)
    }

  React.useEffect(() => {
    // Initialize intersection observer for lazy images.
    document.querySelectorAll(".lazy").forEach(lazyImage => lazyImageObserver.observe(lazyImage))

    // Add keyboard events listener.
    rootElementRef?.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle image navigation scroll.
  React.useEffect(() => {
    if (isGallery && imageNavRef.current) {
      const
        navRef = imageNavRef.current,
        scrollLeftMiddle = (navRef.clientWidth / 2) - (IMAGE_SIZE / 2),
        scrollLeftActiveImage = activeImageIdx * IMAGE_SIZE,
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
      <div className={css.header}>
        <Fluent.ActionButton
          styles={iconStyles}
          onClick={() => lightboxB(null)}
          iconProps={{ iconName: 'Cancel', style: styles.icon }}
        />
      </div>
      <div className={css.content} style={{ height: `calc(100% - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)` }}>
        <img className={css.img} alt={title} src={images[activeImageIdx].path} />
        {isGallery &&
          <>
            <Fluent.ActionButton
              styles={iconStyles}
              className={css.iconStylesRootArrow}
              style={{ left: 0 }}
              onClick={handleShowPrevImage}
              iconProps={{ iconName: 'ChevronLeft', style: styles.icon }}
            />
            <Fluent.ActionButton
              styles={iconStyles}
              className={css.iconStylesRootArrow}
              style={{ right: 0 }}
              onClick={handleShowNextImage}
              iconProps={{ iconName: 'ChevronRight', style: styles.icon }}
            />
          </>
        }
      </div>
      <div className={css.footer} style={{ height: FOOTER_HEIGHT }}>
        <div title={title} className={clas(css.text, css.title)}>{title}</div>
        <div title={description} className={clas(css.text, css.description)}>{description || ''}</div>
        {isGallery &&
          <div className={css.imageNav} ref={imageNavRef}>
            {images.map((image, idx) =>
              <div key={idx} className={css.navImgContainer}>
                <img
                  className={clas(css.navImg, 'lazy', style({ $nest: { '&:hover': imageHighlightStyle } }))}
                  style={activeImageIdx === idx ? imageHighlightStyle : undefined}
                  alt={title}
                  data-src={image.path}
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
