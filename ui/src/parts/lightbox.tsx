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
//import styled from "styled-components"


// const Figure = styled.figure`
//   position: relative;
//   display: inline-block;
//   width: auto;
//   min-height: 25vh;
//   background-position: 50% 50%;
//   background-color: #eee;
//   margin: 0;
//   overflow: hidden;
//   cursor: zoom-in;
//   &:before {
//     content: "";
//     background-color: transparent;
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     width: 100%;
//     height: 100%;
//     opacity: 1;
//     transition: opacity 0.2s ease-in-out;
//     z-index: 1;
//   }
//   &:after {
//     content: "";
//     position: absolute;
//     top: calc(50% - 25px);
//     left: calc(50% - 25px);
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     border: 5px solid transparent;
//     border-top-color: #333;
//     border-right-color: #333;
//     border-bottom-color: #333;
//     opacity: 1;
//     transition: opacity 0.2s ease-in-out;
//     z-index: 2;
//   }
//   &.loaded {
//     min-height: auto;
//     &:before {
//       opacity: 0;
//     }
//     &:after {
//       opacity: 0;
//     }
//   }`

export const lightboxB: Box<LightboxProps | null> = box()

const
  IMAGE_CAPTIONS_HEIGHT = 46, // Total height of title and decription.
  NAV_IMAGE_SIZE = 120,
  IMAGE_NAV_HEIGHT = NAV_IMAGE_SIZE + 28, // 28 is the height of the scrollbar.
  ICON_SIZE = 38,
  LIGHTBOX_PAGE_MARGIN = 8

const
  css = stylesheet({
    body: {
      position: 'fixed',
      inset: '0px',
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
      cursor: 'zoom-in'
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

    //new shit
    [zoomed, setZoomed] = React.useState("1"),
    [, setPosition] = React.useState("50% 50%"),
    
    [scale, setScale] = React.useState("scale(1)"),
    //new shit

    handleShowPrevImage = () => setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1),
    handleShowNextImage = () => setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1),
    handleKeyDown = (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') lightboxB(null)
      else if (ev.key === 'ArrowRight') handleShowNextImage()
      else if (ev.key === 'ArrowLeft') handleShowPrevImage()
    },
    handleCloseOnFreeSpaceClick = (ev: React.MouseEvent) => {
      if (ev.target === ev.currentTarget) lightboxB(null)
    },

    //new shit
    zoomInPosition = (e: React.MouseEvent) => {
      // this will handle the calculations of the area where the image needs to zoom in depending on the user interaction
      const zoomer = e.currentTarget.getBoundingClientRect()

      const offsetX = e.clientX - zoomer.x
      const offsetY = e.clientY - zoomer.y
      const x = (offsetX / zoomer.width) * 100
      const y = (offsetY / zoomer.height) * 100
      console.log("new x and y", x, y)
      setPosition(`${x}% ${y}%`)
      //images.length = 5
      //img.style.transform = "scale2"
    },

    handleZoom = (e: React.MouseEvent) => {
      //console.log(e)
      if (zoomed === "0") {
        // zoom out
        //console.log("hi")
        setScale("scale(1)")
        setZoomed("1")
        console.log("zoom out")
      } else {
        //zoom in and set the background position correctly
        setZoomed("0")
        setScale("scale(2)")
        zoomInPosition(e)
        console.log("zoom in")
        //images.length = 1000
      }
      //console.log(zoomed)
    },
    handleMove = (e: React.MouseEvent) => {
      console.log("mouse move")
      if (zoomed == "0") {
        zoomInPosition(e)
      }
    },
    handleLeave = () => {
      setZoomed("1")
      setPosition("50% 50%")
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
      {/* <Figure
        className={css.img}
        style={{
          backgroundImage: "url(" + images[activeImageIdx].path + ")",
          backgroundSize: "200%",
          backgroundPosition: position,
        }}
        onClick={(e) => handleZoom(e)}
      > */}
      <img
        className={css.img}
        style={{
          bottom: FOOTER_HEIGHT,

          maxHeight: `calc(100vh - ${(2 * LIGHTBOX_PAGE_MARGIN) + ICON_SIZE + FOOTER_HEIGHT}px)`,
          // width: "500px",
          // height: "400px",
          // resizeMode: "stretch",
          transform: scale
        }}
        alt={title}
        src={images[activeImageIdx].path}
        onClick = {(e) => handleZoom(e)}
        onMouseMove = {(e) => handleMove(e)}
        onMouseLeave = {(e) => handleLeave(e)}
      />
      {/* </Figure> */}
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
                className={clas(css.navImg, 'lazy', style({ $nest: { '&:hover': imageHighlightStyle } }))}
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
