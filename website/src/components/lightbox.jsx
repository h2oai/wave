import React from 'react'
import clsx from 'clsx'
import styles from '../css/lightbox_styles.module.css'
import { CancelIcon, ChevronLeftIcon, ChevronRightIcon } from '@fluentui/react-icons-mdl2'

const
  IMAGE_CAPTIONS_HEIGHT = 46, // Total height of title and decription.
  NAV_IMAGE_SIZE = 120,
  IMAGE_NAV_HEIGHT = NAV_IMAGE_SIZE + 28, // 28 is the height of the scrollbar.
  ICON_SIZE = 38,
  LIGHTBOX_PAGE_MARGIN = 8

export const Lightbox = ({ images, defaultImageIdx, onDismiss }) => {
  const
    [activeImageIdx, setActiveImageIdx] = React.useState(defaultImageIdx || 0),
    { title, description } = images[activeImageIdx],
    isGallery = images.length > 1,
    FOOTER_HEIGHT = IMAGE_CAPTIONS_HEIGHT + LIGHTBOX_PAGE_MARGIN + (isGallery ? IMAGE_NAV_HEIGHT : 0),
    rootElementRef = React.useRef(null),
    imageNavRef = React.useRef(null),
    defaultScrollSetRef = React.useRef(false),
    lazyImageObserver = new window.IntersectionObserver(entries =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target
          lazyImage.src = lazyImage.dataset.src
          lazyImage.classList.remove("lazy")
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    ),
    handleShowPrevImage = () => setActiveImageIdx(prevIdx => prevIdx === 0 ? images.length - 1 : prevIdx - 1),
    handleShowNextImage = () => setActiveImageIdx(prevIdx => prevIdx === images.length - 1 ? 0 : prevIdx + 1),
    handleKeyDown = (ev) => {
      if (ev.key === 'Escape') onDismiss()
      else if (ev.key === 'ArrowRight') handleShowNextImage()
      else if (ev.key === 'ArrowLeft') handleShowPrevImage()
    },
    handleCloseOnFreeSpaceClick = (ev) => {
      if (ev.target === ev.currentTarget) onDismiss()
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
      className={styles.body}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={rootElementRef}
      onClick={handleCloseOnFreeSpaceClick}
    >
      <CancelIcon
        onClick={() => onDismiss()}
        className={clsx(styles.closeButton, styles.button)}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          right: LIGHTBOX_PAGE_MARGIN,
          top: LIGHTBOX_PAGE_MARGIN
        }}
      />
      <img
        className={styles.img}
        src={images[activeImageIdx].path}
        alt={title}
        style={{
          bottom: FOOTER_HEIGHT,
          maxHeight: `calc(100vh - ${(2 * LIGHTBOX_PAGE_MARGIN) + ICON_SIZE + FOOTER_HEIGHT}px)`,
          top: ICON_SIZE + LIGHTBOX_PAGE_MARGIN * 2
        }}
      />
      <span
        title={title}
        className={clsx(styles.text, styles.title)}
        style={{
          bottom: FOOTER_HEIGHT - (IMAGE_CAPTIONS_HEIGHT * 0.4),
          maxWidth: `calc(100vw - ${2 * LIGHTBOX_PAGE_MARGIN}px)`,
        }}>
        {title}
      </span>
      <span
        title={description}
        className={clsx(styles.text, styles.description)}
        style={{
          bottom: FOOTER_HEIGHT - (IMAGE_CAPTIONS_HEIGHT * 0.8),
          maxWidth: `calc(100vw - ${2 * LIGHTBOX_PAGE_MARGIN}px)`,
        }}>
        {description || ''}
      </span>
      {isGallery &&
        <>
          <ChevronLeftIcon
            onClick={handleShowPrevImage}
            className={clsx(styles.iconStylesRootArrow, styles.button)}
            style={{ left: LIGHTBOX_PAGE_MARGIN, width: ICON_SIZE, height: ICON_SIZE }}
          />
          <ChevronRightIcon
            onClick={handleShowNextImage}
            className={clsx(styles.iconStylesRootArrow, styles.button)}
            style={{ right: LIGHTBOX_PAGE_MARGIN, width: ICON_SIZE, height: ICON_SIZE }}
          />
          <div
            ref={imageNavRef}
            className={styles.imageNav}
            style={{
              bottom: LIGHTBOX_PAGE_MARGIN,
              height: IMAGE_NAV_HEIGHT,
            }}
          >
            {images.map((image, idx) =>
              <img
                key={idx}
                className={clsx(styles.navImg, 'lazy', activeImageIdx === idx ? styles.navImgActive : undefined)}
                style={{ height: NAV_IMAGE_SIZE, width: NAV_IMAGE_SIZE }}
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
