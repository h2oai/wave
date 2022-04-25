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
  x1: U
  /** Maximum X dimension. */
  x2: U
  /** Minimum Y dimension. */
  y1: U
  /** Maximum Y dimension. */
  y2: U
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
  isIntersecting = (cursor_x: U, cursor_y: U) => ({ x2, x1, y2, y1 }: ImageAnnotatorItem) => cursor_x > x1 && cursor_x < x2 && cursor_y > y1 && cursor_y < y2,
  eventToCursor = (event: React.MouseEvent, rect: DOMRect) => ({ cursor_x: event.clientX - rect.left, cursor_y: event.clientY - rect.top }),
  drawCircle = (ctx: CanvasRenderingContext2D, x: U, y: U, fillColor: S) => {
    ctx.beginPath()
    ctx.fillStyle = fillColor
    const path = new Path2D()
    path.arc(x, y, 8, 0, 2 * Math.PI)
    path.closePath()
    ctx.fill(path)
  },
  drawRect = (ctx: CanvasRenderingContext2D, { x1, x2, y1, y2, isFocused }: DrawnShape, strokeColor: S) => {
    ctx.beginPath()
    ctx.lineWidth = 6
    ctx.strokeStyle = strokeColor
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    ctx.closePath()
    if (isFocused) {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
      ctx.closePath()
      drawCircle(ctx, x1, y1, strokeColor)
      drawCircle(ctx, x2, y1, strokeColor)
      drawCircle(ctx, x2, y2, strokeColor)
      drawCircle(ctx, x1, y2, strokeColor)
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

      const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())
      startPosition.current = { x: cursor_x, y: cursor_y }
    },
    onMouseUp = (e: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        start = startPosition.current
      if (!start || !canvas) return

      const
        focused = drawnShapes.find(item => item.isFocused),
        rect = canvas.getBoundingClientRect(),
        { cursor_x, cursor_y } = eventToCursor(e, rect)

      if (!focused || !isIntersecting(cursor_x, cursor_y)(focused)) {
        const { x1, x2, y1, y2 } = { x1: start.x, x2: cursor_x, y1: start.y, y2: cursor_y }
        if (x2 !== x1 && y2 !== y1) setDrawnShapes(shapes => [{ x1, x2, y1, y2, tag: activeTag }, ...shapes])
      }

      startPosition.current = undefined
    },
    onMouseMove = (e: React.MouseEvent) => {
      const
        canvas = canvasRef.current,
        ctx = ctxRef.current,
        start = startPosition.current

      if (!canvas || !ctx) return

      const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())
      if (start) {
        const focused = drawnShapes.find(shape => shape.isFocused)
        if (focused && isIntersecting(cursor_x, cursor_y)(focused)) {
          canvas.style.cursor = 'move'
          focused.x1 += cursor_x - start.x
          focused.x2 += cursor_x - start.x
          focused.y1 += cursor_y - start.y
          focused.y2 += cursor_y - start.y
          // TODO: A bit ugly, try to find a better way.
          startPosition.current = { x: cursor_x, y: cursor_y }
          setDrawnShapes(shapes => shapes.map(shape => shape.isFocused ? focused : shape))
          redrawExistingShapes()
        } else {
          setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: false })))
          redrawExistingShapes()
          drawRect(ctx, { x1: start.x, x2: cursor_x, y1: start.y, y2: cursor_y, tag: activeTag }, colorsMap.get(activeTag) || cssVarValue('$red'))
        }
      } else {
        canvas.style.cursor = drawnShapes.some(isIntersecting(cursor_x, cursor_y)) ? 'pointer' : 'crosshair'
      }
    },
    onClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())
      setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: isIntersecting(cursor_x, cursor_y)(shape) })))
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