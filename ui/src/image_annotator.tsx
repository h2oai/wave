import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar, px } from './theme'

/** Create a tag. */
interface ImageAnnotatorTag {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed for this tag. */
  label: S
  /** HEX or RGB color string used as background for highlighted phrases. */
  color: S
}

/** Create an annotator item with initial selected tags or no tag for plaintext. */
interface ImageAnnotatorItem {
  /** Minimum X dimension. */
  x_min: U
  /** Maximum X dimension. */
  x_max: U
  /** Minimum Y dimension. */
  y_min: U
  /** Maximum Y dimension. */
  y_max: U
  /** Tag connected to the highlighted section. */
  tag: S
}

/**
 * Create an image annotator component.
 * 
 * The image annotator component enables user to manually annotate parts of an image.
 */
export interface ImageAnnotator {
  /** An identifying name for this component. */
  name: Id
  /** The image to annotate. */
  image: S
  /** The text annotator's title. */
  title: S
  /** List of tags the user can annotate with. */
  tags: ImageAnnotatorTag[]
  /** Existing annotations if any. */
  items?: ImageAnnotatorItem[]
  /** True if the form should be submitted when the annotator value changes. */
  trigger?: B
  /** The card’s image height. Intrinsic image size is used by default. */
  image_height?: S
}

const css = stylesheet({
  title: {
    color: cssVar('$primary'),
    marginBottom: 8
  },
  canvas: {
    display: 'block',
    margin: '0 auto',
    cursor: 'crosshair',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  canvasContainer: {
    position: 'relative',
    margin: 8
  }
})

export const XImageAnnotator = ({ model }: { model: ImageAnnotator }) => {
  const
    [activeTag, setActiveTag] = React.useState<S | undefined>(model.tags[0]?.name),
    imgRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    aspectRatioRef = React.useRef(1),
    activateTag = React.useCallback((tagName: S) => () => setActiveTag(tagName), [setActiveTag]),
    onDrag = (event: React.DragEvent) => {
      // Draw a rectangle on the canvas based on the mouse position.
      const canvas = imgRef.current
      if (canvas) {
        const
          rect = canvas.getBoundingClientRect(),
          x = event.clientX - rect.left,
          y = event.clientY - rect.top,
          ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.beginPath()
          ctx.fillStyle = "#FF0000"
          ctx.fillRect(x, y, 10, 10)
          ctx.stroke()
        }
      }
    }

  React.useEffect(() => {
    const img = new Image()
    img.src = model.image
    img.onload = () => {
      const imgCanvas = imgRef.current
      const canvas = canvasRef.current
      if (!imgCanvas || !canvas) return

      const ctx = imgCanvas.getContext('2d')
      if (!ctx) return

      const height = model.image_height ? +model.image_height.replace('px', '') : img.naturalHeight
      const aspectRatio = height / img.naturalHeight
      aspectRatioRef.current = aspectRatio
      imgCanvas.height = height
      imgCanvas.width = img.naturalWidth * aspectRatio
      canvas.height = height
      canvas.width = img.naturalWidth * aspectRatio
      canvas.style.zIndex = '1'
      canvas.parentElement!.style.height = px(height)

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * aspectRatio, img.height * aspectRatio)
    }
  }, [model.image, model.image_height])

  return (
    <div data-test={model.name}>
      <div className={clas('wave-s16 wave-w6', css.title)}>{model.title}</div>
      <AnnotatorTags tags={model.tags} activateTag={activateTag} activeTag={activeTag} />
      <div className={css.canvasContainer}>
        <canvas ref={imgRef} className={css.canvas} />
        <canvas draggable ref={canvasRef} className={css.canvas} onDrag={onDrag} />
      </div>
    </div >
  )
}