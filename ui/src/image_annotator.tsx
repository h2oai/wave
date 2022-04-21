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
    [activeTag, setActiveTag] = React.useState<S>(model.tags[0]?.name || ''),
    imgRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    aspectRatioRef = React.useRef(1),
    startPosition = React.useRef<{ x: U, y: U } | undefined>(undefined),
    ctxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    drawnShapes = React.useRef<ImageAnnotatorItem[]>(model.items || []),
    activateTag = React.useCallback((tagName: S) => () => setActiveTag(tagName), [setActiveTag]),
    drawShape = (ctx: CanvasRenderingContext2D, item: ImageAnnotatorItem) => {
      ctx.beginPath()
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 5
      ctx.rect(item.x_min, item.y_min, item.x_max, item.y_max)
      ctx.stroke()
      ctx.closePath()
    },
    redrawExistingShapes = () => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawnShapes.current.forEach(item => drawShape(ctx, item))
    },
    onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      redrawExistingShapes()
      startPosition.current = { x: e.clientX, y: e.clientY }
    },
    onMouseUp = ({ clientX, clientY }: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        start = startPosition.current
      if (!start || !canvas) return

      const
        { x, y } = start,
        rect = canvas.getBoundingClientRect()

      drawnShapes.current.push({ x_min: x - rect.left, x_max: clientX - x, y_min: y - rect.top, y_max: clientY - y, tag: activeTag })
      startPosition.current = undefined
    },
    onMouseMove = (event: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        ctx = ctxRef.current,
        start = startPosition.current

      if (canvas && ctx && start) {
        redrawExistingShapes()
        const
          rect = canvas.getBoundingClientRect(),
          { x, y } = start,
          x_max = event.clientX - x,
          y_max = event.clientY - y

        drawShape(ctx, { x_min: x - rect.left, y_min: y - rect.top, x_max: x_max, y_max: y_max, tag: activeTag })
      }
    }

  React.useEffect(() => {
    const img = new Image()
    img.src = model.image
    img.onload = () => {
      const imgCanvas = imgRef.current
      const canvas = canvasRef.current
      if (!imgCanvas || !canvas) return
      ctxRef.current = canvas.getContext('2d')

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
        <canvas ref={canvasRef} className={css.canvas} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
      </div>
    </div >
  )
}