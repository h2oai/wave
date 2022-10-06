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
      cursor: 'pointer',
      filter: 'brightness(30%)',
      border: '2px solid black',
      $nest: { '&:hover': { filter: 'unset', border: '2px solid red' } }
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
    imgCaptions: { whiteSpace: 'nowrap', padding: '10px 40px', height: '20px' },
    text: { textOverflow: 'ellipsis', overflow: 'hidden' },
    title: { fontWeight: 500 },
    description: { color: '#bbb' },
    navImgPlaceholder: { display: 'inline-block', width: '124px' }
  })

type Image = { title: S, description?: S, type?: S, image?: S, path?: S }
type ArrowControlProps = { activeImageIdx: U, setActiveImageIdx: (idx: U) => void, images: Image[] }

interface LightboxProps {
  visible: B,
  onDismiss: () => void,
  images: Image[],
  defaultImageIdx?: U
}

const
  keys = { esc: 27, left: 37, right: 39 },
  lazyImageObserver = new IntersectionObserver(entries =>
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target as HTMLImageElement
        lazyImage.src = lazyImage.dataset.src!
        lazyImage.classList.remove("lazy")
        lazyImageObserver.unobserve(lazyImage)
      }
    })
  ),
  getImageSrc = ({ type, image, path }: Image) => path
    ? path
    : (image && type)
      ? `data:image/${type};base64,${image}`
      : '',
  ArrowControls = ({ activeImageIdx, setActiveImageIdx, images }: ArrowControlProps) =>
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
    </>,
  CloseButton = ({ onClose }: { onClose: () => void }) =>
    <Fluent.ActionButton
      styles={iconStyles}
      onClick={onClose}
      iconProps={{ iconName: 'Cancel', style: { fontSize: '22px' } }}
    />

export const Lightbox = ({ visible, onDismiss, images, defaultImageIdx }: LightboxProps) => {
  const
    [activeImageIdx, _setActiveImageIdx] = React.useState(defaultImageIdx || 0),
    { title, description } = images[activeImageIdx],
    isGallery = images.length > 1,
    src = getImageSrc(images[activeImageIdx]),
    imageNavRef = React.useRef<HTMLDivElement | null>(null),
    navImgRefs: React.RefObject<HTMLImageElement>[] = images.map(() => React.createRef()),
    activeImageIdxRef = React.useRef(activeImageIdx),
    setActiveImageIdx = (idx: U) => {
      // Store activeImageIdx inside ref to make it accessible from window key event closure.
      _setActiveImageIdx(idx)
      activeImageIdxRef.current = idx
    },
    onClose = () => {
      onDismiss()
      setActiveImageIdx(defaultImageIdx || 0)
      if (imageNavRef.current) imageNavRef.current.scrollLeft = 0
    },
    handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.keyCode === keys.esc) onClose()
      const imgIdx = activeImageIdxRef.current
      if (ev.keyCode === keys.right) setActiveImageIdx(imgIdx === images.length - 1 ? 0 : imgIdx + 1)
      else if (ev.keyCode === keys.left) setActiveImageIdx(imgIdx === 0 ? images.length - 1 : imgIdx - 1)
    },
    imageNav = isGallery ? images.map((image, idx) =>
      <div key={idx} className={css.navImgPlaceholder}>
        <img
          className={clas(css.img, css.navImg, 'lazy')}
          ref={navImgRefs[idx]}
          style={activeImageIdx === idx ? { filter: 'unset', border: '2px solid red' } : undefined}
          alt={title}
          data-src={getImageSrc(image)}
          onClick={() => setActiveImageIdx(idx)}
        />
      </div>
    ) : undefined

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
  }, [activeImageIdx, images.length, navImgRefs])

  React.useLayoutEffect(() => {
    // Initialize intersection observer for lazy images.
    const lazyImages = [].slice.call(document.querySelectorAll(".lazy"))
    lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
  }, [])

  if (images.length === 0) throw new Error('No images passed to image lightbox component.')
  if (activeImageIdx >= images.length) throw new Error(`Image with defaultImageIdx:${activeImageIdx} does not exist.`)

  return (
    <div className={css.body} style={visible ? undefined : { display: 'none' }}>
      <div className={css.header}>
        <CloseButton onClose={onClose} />
      </div>
      <div className={css.content} style={{ height: `calc(100% - ${isGallery ? '262px' : '100px'})` }}>
        <img className={css.img} alt={title} src={src} />
        {isGallery && <ArrowControls activeImageIdx={activeImageIdx} setActiveImageIdx={setActiveImageIdx} images={images} />}
      </div>
      <div className={css.footer} style={{ height: isGallery ? '260px' : '60px' }}>
        <div className={css.imgCaptions}>
          <div title={title} className={clas(css.text, css.title)}>{title}</div>
          <div title={description} className={clas(css.text, css.description)}>{description || ''}</div>
        </div>
        {isGallery && <div className={css.imageNav} ref={imageNavRef}>{imageNav}</div>}
      </div>
    </div>
  )
}
