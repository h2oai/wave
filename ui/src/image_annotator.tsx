import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { PolygonAnnotator } from './image_annotator_polygon'
import { RectAnnotator, getCorner, isIntersectingRect } from './image_annotator_rect'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar, cssVarValue, px } from './theme'
import { wave } from './ui'

export interface ImageAnnotatorPoint {
  /** `x` coordinate of the point. */
  x: F
  /** `y` coordinate of the point. */
  y: F
}

/** Create a polygon annotation shape. */
export interface ImageAnnotatorPolygon {
  /** List of points of the polygon. */
  items: ImageAnnotatorPoint[]
}

/** Create a rectangular annotation shape. */
export interface ImageAnnotatorRect {
  /** `x` coordinate of the rectangle's corner. */
  x1: F
  /** `y` coordinate of the rectangle's corner. */
  y1: F
  /** `x` coordinate of the diagonally opposite corner. */
  x2: F
  /** `y` coordinate of the diagonally opposite corner. */
  y2: F
}

/** Create a shape to be rendered as an annotation on an image annotator. */
interface ImageAnnotatorShape {
  rect?: ImageAnnotatorRect
  polygon?: ImageAnnotatorPolygon
}

/** Create a unique tag type for use in an image annotator. */
interface ImageAnnotatorTag {
  /** An identifying name for this tag. */
  name: Id
  /** Text to be displayed for the annotation. */
  label: S
  /** Hex or RGB color string to be used as the background color. */
  color: S
}

/** Create an annotator item with initial selected tags or no tag for plaintext. */
interface ImageAnnotatorItem {
  /** The annotation shape. */
  shape: ImageAnnotatorShape
  /** The `name` of the image annotator tag to refer to for the `label` and `color` of this item. */
  tag: S
}

/**
 * Create an image annotator component.
 * 
 * This component allows annotating and labeling parts of an image by drawing shapes with a pointing device.
 */
export interface ImageAnnotator {
  /** An identifying name for this component. */
  name: Id
  /** The path or URL of the image to be presented for annotation. */
  image: S
  /** The image annotator's title. */
  title: S
  /** The master list of tags that can be used for annotations. */
  tags: ImageAnnotatorTag[]
  /** Annotations to display on the image, if any. */
  items?: ImageAnnotatorItem[]
  /** True if the form should be submitted as soon as an annotation is drawn. */
  trigger?: B
  /** The card’s image height. The actual image size is used by default. */
  image_height?: S
}

export type Position = {
  x: U
  y: U
  dragging?: B
}

export type DrawnShape = ImageAnnotatorItem & {
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
  eventToCursor = (event: React.MouseEvent, rect: DOMRect) => ({ cursor_x: event.clientX - rect.left, cursor_y: event.clientY - rect.top }),
  getCornerCursor = (shape: ImageAnnotatorRect, cursor_x: U, cursor_y: U) => {
    const corner = getCorner(cursor_x, cursor_y, shape)
    if (corner === 'topLeft' || corner === 'bottomRight') return 'nwse-resize'
    if (corner === 'bottomLeft' || corner === 'topRight') return 'nesw-resize'
  },
  getCorrectCursor = (drawnShapes: DrawnShape[], cursor_x: U, cursor_y: U, focused?: DrawnShape) => {
    const intersected = drawnShapes.find(shape => isIntersectingRect(cursor_x, cursor_y, shape.shape.rect))
    if (intersected?.isFocused && intersected.shape.rect) return getCornerCursor(intersected.shape.rect, cursor_x, cursor_y) || 'move'
    else if (focused?.shape.rect) return getCornerCursor(focused.shape.rect, cursor_x, cursor_y) || 'crosshair'
    else if (intersected) return 'pointer'
    return 'crosshair'
  }

export const XImageAnnotator = ({ model }: { model: ImageAnnotator }) => {
  const
    colorsMap = React.useMemo(() => new Map<S, S>(model.tags.map(tag => [tag.name, cssVarValue(tag.color)])), [model.tags]),
    [activeTag, setActiveTag] = React.useState<S>(model.tags[0]?.name || ''),
    [activeShape, setActiveShape] = React.useState<keyof ImageAnnotatorShape>('rect'),
    [drawnShapes, setDrawnShapes] = React.useState<DrawnShape[]>([]),
    imgRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    rectRef = React.useRef<RectAnnotator | null>(null),
    polygonRef = React.useRef<PolygonAnnotator | null>(null),
    [aspectRatio, setAspectRatio] = React.useState(1),
    startPosition = React.useRef<Position | undefined>(undefined),
    ctxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    activateTag = React.useCallback((tagName: S) => () => setActiveTag(tagName), [setActiveTag]),
    getCurrentTagColor = React.useCallback(() => colorsMap.get(activeTag) || cssVarValue('$red'), [activeTag, colorsMap]),
    redrawExistingShapes = React.useCallback(() => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setDrawnShapes(shapes => {
        shapes.forEach(({ shape, isFocused }) => {
          if (shape.rect) rectRef.current?.drawRect(shape.rect, getCurrentTagColor(), isFocused)
          else if (shape.polygon) polygonRef.current?.drawPolygon(shape.polygon.items, getCurrentTagColor())
        })
        return shapes
      })
    }, [getCurrentTagColor]),
    onMouseDown = (e: React.MouseEvent) => {
      console.log('mousedown')
      if (e.button !== 0) return // Ignore right-click.
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect()),
        focused = drawnShapes.find(({ isFocused }) => isFocused)

      if (focused?.shape.rect) rectRef.current?.onMouseDown(cursor_x, cursor_y, focused.shape.rect)
      startPosition.current = { x: cursor_x, y: cursor_y }
    },
    onMouseMove = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect()),
        focused = drawnShapes.find(({ isFocused }) => isFocused),
        clickStartPosition = startPosition.current

      if (clickStartPosition) {
        const intersected = drawnShapes.find(shape => isIntersectingRect(cursor_x, cursor_y, shape.shape.rect))
        let newShape = null
        clickStartPosition.dragging = true

        switch (activeShape) {
          case 'rect': {
            newShape = rectRef.current?.onMouseMove(clickStartPosition, cursor_x, cursor_y, focused, intersected)
            if (newShape) setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: false })))
            redrawExistingShapes()
            if (newShape?.rect) rectRef.current?.drawRect(newShape.rect, getCurrentTagColor())
            break
          }
          case 'polygon': {
            redrawExistingShapes()
            polygonRef.current?.drawPreviewLine(cursor_x, cursor_y, getCurrentTagColor())
            if (polygonRef.current?.isIntersectingFirstPoint(cursor_x, cursor_y)) canvas.style.cursor = 'pointer'
            else canvas.style.cursor = 'crosshair'
            break
          }
        }
      }
      else {
        canvas.style.cursor = getCorrectCursor(drawnShapes, cursor_x, cursor_y, focused)
      }
    },
    onClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        start = startPosition.current,
        rect = canvas.getBoundingClientRect(),
        { cursor_x, cursor_y } = eventToCursor(e, rect)

      switch (activeShape) {
        case 'rect': {
          // TODO: Fix rect selection.
          rectRef.current?.onClick(e, cursor_x, cursor_y, setDrawnShapes, activeTag, start)
          break
        }
        case 'polygon': {
          const newPolygon = polygonRef.current?.onClick(cursor_x, cursor_y, getCurrentTagColor(), activeTag)
          if (newPolygon) setDrawnShapes([newPolygon, ...drawnShapes])
          break
        }
      }

      redrawExistingShapes()
      if (activeShape !== 'polygon') startPosition.current = undefined
      canvas.style.cursor = getCorrectCursor(drawnShapes, cursor_x, cursor_y, drawnShapes.find(({ isFocused }) => isFocused))
    },
    remove = (_e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
      if (!item) return
      setDrawnShapes(shapes => item.key === 'remove-selected' ? shapes.filter(s => !s.isFocused) : [])
      redrawExistingShapes()
    },
    chooseShape = (_e?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, i?: Fluent.IContextualMenuItem) => {
      setActiveShape(i?.key as keyof ImageAnnotatorShape)
      startPosition.current = undefined
      setDrawnShapes(shapes => shapes.map(s => { s.isFocused = false; return s }))
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
      setAspectRatio(aspectRatio)
      imgCanvas.height = height
      imgCanvas.width = img.naturalWidth * aspectRatio
      canvas.height = height
      canvas.width = img.naturalWidth * aspectRatio
      canvas.style.zIndex = '1'
      canvas.parentElement!.style.height = px(height)

      rectRef.current = new RectAnnotator(canvas)
      polygonRef.current = new PolygonAnnotator(canvas)

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * aspectRatio, img.height * aspectRatio)
      setDrawnShapes((model.items || []).map(({ tag, shape }) => {
        if (shape.rect) return {
          tag,
          shape: {
            rect: {
              x1: shape.rect.x1 * aspectRatio,
              x2: shape.rect.x2 * aspectRatio,
              y1: shape.rect.y1 * aspectRatio,
              y2: shape.rect.y2 * aspectRatio,
            }
          }
        }
        return { tag, shape }
      }))
      redrawExistingShapes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.name, model.image, model.image_height, redrawExistingShapes, model.items])

  React.useEffect(() => {
    wave.args[model.name] = drawnShapes.map(({ tag, shape }) => {
      if (shape.rect) return {
        tag,
        shape: {
          rect: {
            x1: shape.rect.x1 / aspectRatio,
            x2: shape.rect.x2 / aspectRatio,
            y1: shape.rect.y1 / aspectRatio,
            y2: shape.rect.y2 / aspectRatio,
          }
        }
      }
      return { tag, shape }
    }) as unknown as Rec[]
  }, [aspectRatio, drawnShapes, model.name])

  return (
    <div data-test={model.name}>
      <div className={clas('wave-s16 wave-w6', css.title)}>{model.title}</div>
      <AnnotatorTags tags={model.tags} activateTag={activateTag} activeTag={activeTag} />
      <Fluent.CommandBar
        styles={{ root: { padding: 0 } }}
        items={[
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
        ]}
        farItems={[
          {
            key: 'rect',
            text: 'Rectangle',
            onClick: chooseShape,
            canCheck: true,
            checked: activeShape === 'rect',
            iconProps: { iconName: 'RectangleShape', styles: { root: { fontSize: 20 } } },
          },
          {
            key: 'polygon',
            text: 'Polygon',
            onClick: chooseShape,
            canCheck: true,
            checked: activeShape === 'polygon',
            iconProps: { iconName: 'SixPointStar', styles: { root: { fontSize: 20 } } },
          },
        ]} />
      <div className={css.canvasContainer}>
        <canvas ref={imgRef} className={css.canvas} />
        <canvas ref={canvasRef} className={css.canvas} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseLeave={onClick} onClick={onClick} />
      </div>
    </div >
  )
}