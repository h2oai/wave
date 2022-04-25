import * as Fluent from '@fluentui/react'
import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar, cssVarValue, px } from './theme'

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

type Position = {
  x: U
  y: U
}

type DrawnShape = ImageAnnotatorItem & {
  isFocused?: B
}

const
  css = stylesheet({
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
  }),
  mouseEventToRect = ({ clientX, clientY }: React.MouseEvent, { x, y }: Position, rect: DOMRect) => ({ x_min: x, x_max: clientX - rect.left, y_min: y, y_max: clientY - rect.top }),
  isIntersecting = (cursor_x: U, cursor_y: U) => ({ x_max, x_min, y_max, y_min }: ImageAnnotatorItem) => cursor_x > x_min && cursor_x < x_max && cursor_y > y_min && cursor_y < y_max,
  drawCircle = (ctx: CanvasRenderingContext2D, x: U, y: U, fillColor: S) => {
    ctx.beginPath()
    ctx.fillStyle = fillColor
    const path = new Path2D()
    path.arc(x, y, 8, 0, 2 * Math.PI)
    path.closePath()
    ctx.fill(path)
  },
  drawRect = (ctx: CanvasRenderingContext2D, { x_min, x_max, y_min, y_max, isFocused }: DrawnShape, strokeColor: S) => {
    ctx.beginPath()
    ctx.lineWidth = 6
    ctx.strokeStyle = strokeColor
    ctx.strokeRect(x_min, y_min, x_max - x_min, y_max - y_min)
    ctx.closePath()
    if (isFocused) {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(x_min, y_min, x_max - x_min, y_max - y_min)
      ctx.closePath()
      drawCircle(ctx, x_min, y_min, strokeColor)
      drawCircle(ctx, x_max, y_min, strokeColor)
      drawCircle(ctx, x_max, y_max, strokeColor)
      drawCircle(ctx, x_min, y_max, strokeColor)
    }
  }



export const XImageAnnotator = ({ model }: { model: ImageAnnotator }) => {
  const
    colorsMap = new Map<S, S>(model.tags.map(tag => [tag.name, cssVarValue(tag.color)])),
    [activeTag, setActiveTag] = React.useState<S>(model.tags[0]?.name || ''),
    [drawnShapes, setDrawnShapes] = React.useState<DrawnShape[]>(model.items || []),
    imgRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    aspectRatioRef = React.useRef(1),
    startPosition = React.useRef<Position | undefined>(undefined),
    ctxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    activateTag = React.useCallback((tagName: S) => () => setActiveTag(tagName), [setActiveTag]),
    redrawExistingShapes = () => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setDrawnShapes(shapes => {
        shapes.forEach(item => drawRect(ctx, item, colorsMap.get(item.tag) || cssVarValue('$red')))
        return shapes
      })
    },
    onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      startPosition.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    },
    onMouseUp = (e: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        start = startPosition.current
      if (!start || !canvas) return

      const shape = mouseEventToRect(e, start, canvas.getBoundingClientRect())
      if (shape.x_max !== shape.x_min && shape.y_max !== shape.y_min) setDrawnShapes(shapes => [{ ...shape, tag: activeTag }, ...shapes])
      startPosition.current = undefined
    },
    onMouseMove = (e: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        ctx = ctxRef.current,
        start = startPosition.current

      if (canvas && ctx) {
        const rect = canvas.getBoundingClientRect()
        if (start) {
          redrawExistingShapes()
          drawRect(ctx, { ...mouseEventToRect(e, start, rect), tag: activeTag }, colorsMap.get(activeTag) || cssVarValue('$red'))
        }
        else {
          canvas.style.cursor = drawnShapes.some(isIntersecting(e.clientX - rect.left, e.clientY - rect.top)) ? 'pointer' : 'crosshair'
        }
      }

    },
    onClick = (e: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        ctx = ctxRef.current
      if (!ctx || !canvas) return

      const rect = canvas.getBoundingClientRect()
      setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: isIntersecting(e.clientX - rect.left, e.clientY - rect.top)(shape) })))
      redrawExistingShapes()
    },
    remove = (_e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
      if (!item) return
      setDrawnShapes(shapes => item.key === 'remove-selected' ? shapes.filter(s => !s.isFocused) : [])
      redrawExistingShapes()
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
      <Fluent.CommandBar styles={{ root: { padding: 0 } }} items={[
        {
          key: 'remove-selected',
          text: 'Remove selection',
          onClick: remove,
          disabled: drawnShapes.every(s => !s.isFocused),
          iconProps: { iconName: 'RemoveContent', styles: { root: { fontSize: 20 } } },
        },
        {
          key: 'remove-all',
          text: 'Remove all',
          onClick: remove,
          disabled: drawnShapes.length === 0,
          iconProps: { iconName: 'DependencyRemove', styles: { root: { fontSize: 20 } } },
        },
      ]} />
      <div className={css.canvasContainer}>
        <canvas ref={imgRef} className={css.canvas} />
        <canvas
          ref={canvasRef}
          className={css.canvas}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={onClick}
        />
      </div>
    </div >
  )
}