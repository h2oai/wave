import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { getPolygonPointCursor, isIntersectingPolygon, PolygonAnnotator } from './image_annotator_polygon'
import { getRectCornerCursor, isIntersectingRect, RectAnnotator } from './image_annotator_rect'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar, cssVarValue, px } from './theme'
import { wave } from './ui'

/** Create a polygon annotation point with x and y coordinates.. */
export interface ImageAnnotatorPoint {
  /** `x` coordinate of the point. */
  x: F
  /** `y` coordinate of the point. */
  y: F
}

/** Create a polygon annotation shape. */
export interface ImageAnnotatorPolygon {
  /** List of polygon points. */
  vertices: ImageAnnotatorPoint[]
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
  /** List of allowed shapes. Available values are 'rect' and 'polygon'. If not set, all shapes are available by default. */
  allowed_shapes?: S[]
}

export type Position = {
  x: U
  y: U
  dragging?: B
}

export type DrawnShape = ImageAnnotatorItem & { isFocused?: B }
export type DrawnPoint = ImageAnnotatorPoint & { isAux?: B }

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
  eventToCursor = (e: React.MouseEvent, rect: DOMRect, scale: F) => ({ cursor_x: (e.clientX - rect.left) / scale, cursor_y: (e.clientY - rect.top) / scale }),
  getIntersectedShape = (shapes: DrawnShape[], cursor_x: F, cursor_y: F) => shapes.find(({ shape, isFocused }) => {
    if (shape.rect) return isIntersectingRect(cursor_x, cursor_y, shape.rect, isFocused)
    if (shape.polygon) return isIntersectingPolygon({ x: cursor_x, y: cursor_y }, shape.polygon.vertices, isFocused)
  }),
  getCorrectCursor = (cursor_x: U, cursor_y: U, focused?: DrawnShape, intersected?: DrawnShape, isSelect = false) => {
    let cursor = intersected
      ? 'pointer'
      : isSelect
        ? 'auto'
        : 'crosshair'
    if (intersected?.isFocused && intersected.shape.rect) cursor = getRectCornerCursor(intersected.shape.rect, cursor_x, cursor_y) || 'move'
    else if (focused?.shape.rect) cursor = getRectCornerCursor(focused.shape.rect, cursor_x, cursor_y) || cursor
    else if (intersected?.isFocused && intersected.shape.polygon) cursor = getPolygonPointCursor(intersected.shape.polygon.vertices, cursor_x, cursor_y) || 'move'
    else if (focused?.shape.polygon) cursor = getPolygonPointCursor(focused.shape.polygon.vertices, cursor_x, cursor_y) || cursor

    return cursor
  },
  mapShapesToWaveArgs = (shapes: DrawnShape[], aspectRatio: F) => shapes.map(({ shape, tag }) => {
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
    else if (shape.polygon) return { tag, shape: { polygon: { vertices: shape.polygon.vertices.map(i => ({ x: i.x * aspectRatio, y: i.y * aspectRatio })) } } }
    return { tag, shape }
  }),
  getFarItem = (key: S, text: S, onClick: () => void, activeShape: keyof ImageAnnotatorShape | 'select', iconName: S) => ({
    key,
    text,
    onClick,
    canCheck: true,
    checked: activeShape === key,
    iconProps: { iconName, styles: { root: { fontSize: 20 } } },
  })


export const XImageAnnotator = ({ model }: { model: ImageAnnotator }) => {
  const
    { allowed_shapes = ['rect', 'polygon'] } = model,
    theme = Fluent.useTheme(),
    colorsMap = React.useMemo(() => new Map<S, S>(model.tags.map(tag => {
      const color = Fluent.getColorFromString(cssVarValue(tag.color))
      return [tag.name, `rgba(${color?.r || 0}, ${color?.g || 0}, ${color?.b || 0}, 1)`]
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })), [model.tags, theme]),
    allowedShapes = React.useMemo(() => allowed_shapes.reduce((acc, curr) => acc.add(curr), new Set()), [allowed_shapes]),
    [activeTag, setActiveTag] = React.useState<S>(model.tags[0]?.name || ''),
    [activeShape, setActiveShape] = React.useState<keyof ImageAnnotatorShape | 'select'>('select'),
    // TODO: Think about making this a ref instead of state.
    [drawnShapes, setDrawnShapes] = React.useState<DrawnShape[]>([]),
    [scale, setScale] = React.useState(1),
    imgRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    rectRef = React.useRef<RectAnnotator | null>(null),
    polygonRef = React.useRef<PolygonAnnotator | null>(null),
    [aspectRatio, setAspectRatio] = React.useState(1),
    startPosition = React.useRef<Position | undefined>(undefined),
    ctxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    mousePositionRef = React.useRef({ x: 0, y: 0 }),
    getCurrentTagColor = React.useCallback((tag: S) => colorsMap.get(tag) || cssVarValue('$red'), [colorsMap]),
    redrawExistingShapes = React.useCallback(() => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setDrawnShapes(shapes => {
        shapes.forEach(({ shape, isFocused, tag }) => {
          if (shape.rect) rectRef.current?.drawRect(shape.rect, getCurrentTagColor(tag), isFocused)
          else if (shape.polygon) polygonRef.current?.drawPolygon(shape.polygon.vertices, getCurrentTagColor(tag), true, isFocused)
        })
        return shapes
      })
    }, [getCurrentTagColor]),
    activateTag = React.useCallback((tagName: S) => () => {
      setActiveTag(tagName)
      setDrawnShapes(shapes => {
        const newShapes = shapes.map(s => {
          if (s.isFocused) s.tag = tagName
          return s
        })
        setWaveArgs(newShapes)
        return newShapes
      })
      redrawExistingShapes()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redrawExistingShapes]),

    onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || e.buttons !== 1) return

      setWaveArgs(drawnShapes)

      polygonRef.current?.resetDragging()
      rectRef.current?.resetDragging()
      redrawExistingShapes()
    },
    onMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), scale),
        intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)

      if (e.buttons !== 1 && !intersected?.shape.polygon) return // Ignore right-click.

      if (intersected?.isFocused && intersected?.shape.rect) rectRef.current?.onMouseDown(cursor_x, cursor_y, intersected.shape.rect)
      if (intersected?.shape.polygon && polygonRef.current) {
        const vertices = intersected.shape.polygon.vertices

        const auxAdded = polygonRef.current.tryToAddAuxPoint(cursor_x, cursor_y, vertices)
        polygonRef.current.resetDragging()
        // Remove polygon vertex on right click.
        if (e.buttons === 2) {
          intersected.shape.polygon.vertices = polygonRef.current.tryToRemovePoint(cursor_x, cursor_y, vertices)
        }
        setDrawnShapes(drawnShapes => {
          const newShapes = drawnShapes.map(s => {
            if (s === intersected && s.shape.polygon && polygonRef.current) {
              s.shape.polygon.vertices = polygonRef.current.getPolygonPointsWithAux(s.shape.polygon.vertices)
            }
            return s
          })
          if (e.buttons === 2 || auxAdded) setWaveArgs(newShapes)
          return newShapes
        })
        redrawExistingShapes()
      }

      startPosition.current = { x: cursor_x, y: cursor_y, dragging: true }
    },
    onMouseMove = (e: React.MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), scale),
        focused = drawnShapes.find(({ isFocused }) => isFocused),
        clickStartPosition = startPosition.current,
        intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)

      canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, focused, intersected, activeShape === 'select')
      switch (activeShape) {
        case 'rect': {
          const currentlyDrawnRect = rectRef.current?.onMouseMove(cursor_x, cursor_y, focused, intersected, clickStartPosition)
          if (currentlyDrawnRect) setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: false })))
          redrawExistingShapes()
          if (currentlyDrawnRect?.rect) rectRef.current?.drawRect(currentlyDrawnRect.rect, getCurrentTagColor(activeTag))
          break
        }
        case 'polygon': {
          redrawExistingShapes()
          polygonRef.current?.drawPreviewLine(cursor_x, cursor_y, getCurrentTagColor(activeTag))
          if (polygonRef.current?.isIntersectingFirstPoint(cursor_x, cursor_y)) canvas.style.cursor = 'pointer'
          break
        }
        case 'select': {
          // If left mouse btn is not held during moving, ignore.
          if (e.buttons !== 1) break
          if (focused?.shape.rect) {
            rectRef.current?.onMouseMove(cursor_x, cursor_y, focused, intersected, clickStartPosition)
            redrawExistingShapes()
          }
          else if (focused?.shape.polygon) {
            polygonRef.current?.onMouseMove(cursor_x, cursor_y, focused, intersected, clickStartPosition)
            redrawExistingShapes()
          }
          break
        }
      }
    },
    onClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        start = startPosition.current,
        rect = canvas.getBoundingClientRect(),
        { cursor_x, cursor_y } = eventToCursor(e, rect, scale),
        intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)

      switch (activeShape) {
        case 'rect': {
          const newRect = rectRef.current?.onClick(cursor_x, cursor_y, activeTag, start)
          if (newRect) {
            setDrawnShapes(prevShapes => {
              const newShapes = [newRect, ...prevShapes]
              setWaveArgs(newShapes)
              return newShapes
            })
          }
          redrawExistingShapes()
          break
        }
        case 'polygon': {
          const newPolygon = polygonRef.current?.onClick(cursor_x, cursor_y, getCurrentTagColor(activeTag), activeTag)
          if (newPolygon) {
            setDrawnShapes(prevShapes => {
              const newShapes = [newPolygon, ...prevShapes]
              setWaveArgs(newShapes)
              return newShapes
            })
          }
          break
        }
        case 'select': {
          if (intersected) setActiveTag(intersected.tag)

          setDrawnShapes(drawnShapes => {
            const newShapes = drawnShapes.map(s => {
              s.isFocused = s === intersected
              if (s.isFocused && s.shape.polygon && polygonRef.current) {
                s.shape.polygon.vertices = polygonRef.current.getPolygonPointsWithAux(s.shape.polygon.vertices)
              }
              return s
            })
            if (start?.dragging) setWaveArgs(newShapes)
            return newShapes
          })

          polygonRef.current?.resetDragging()
          rectRef.current?.resetDragging()
          redrawExistingShapes()
          break
        }
      }

      startPosition.current = undefined
      const focused = drawnShapes.find(({ isFocused }) => isFocused)
      canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, focused, intersected, activeShape === 'select')
    },
    moveShape = (e: React.KeyboardEvent, direction: 'left' | 'right' | 'up' | 'down') => {
      setDrawnShapes(drawnShapes => drawnShapes.map(ds => {
        const { isFocused, shape } = ds
        if (isFocused) {
          const
            { polygon, rect } = shape,
            isAxisHorizontal = direction === 'right' || direction === 'left',
            isPositiveDirection = direction === 'right' || direction === 'down',
            increment = (isPositiveDirection ? 1 : -1) * (e.shiftKey ? 10 : 1),
            border = (isPositiveDirection ? canvasRef.current![direction === 'right' ? 'width' : 'height'] : 0) - increment,
            isInBoundaries = (c1: U, c2: U = border) => (isPositiveDirection && c1 <= border && c2 <= border) || (!isPositiveDirection && c1 >= border && c2 >= border),
            canMoveRect = rect && isInBoundaries(rect[isAxisHorizontal ? 'x1' : 'y1'], rect[isAxisHorizontal ? 'x2' : 'y2']),
            // Do not move when at least one vertice is out of boundaries.
            canMovePoly = polygon && !polygon.vertices.find(v => !isInBoundaries(v[isAxisHorizontal ? 'x' : 'y']))
          // TODO: Move multiple selected shapes as a group.
          if (canMoveRect) {
            rect[isAxisHorizontal ? 'x1' : 'y1'] += increment
            rect[isAxisHorizontal ? 'x2' : 'y2'] += increment
          }
          if (canMovePoly) polygon.vertices.forEach(v => v[isAxisHorizontal ? 'x' : 'y'] += increment)
        }
        return ds
      }))
      redrawExistingShapes()
    },
    // Zoom canvas in/out.
    onWheel = (e: React.WheelEvent) => {
      const
        canvas = canvasRef.current,
        rect = canvas?.getBoundingClientRect()
      if (!canvas || !rect || !e.ctrlKey) return
      // TODO: Set max zoom according image size.
      setScale(scale =>
        e.deltaY < 0
          ? scale > 1 ? scale - 0.1 : scale
          : scale <= 2 ? scale + 0.1 : scale
      )


      // TODO: Fix reappearing of shapes when zooming in.

      // TODO: Translate image to cursor position.
      // TODO: Add panning on drag.
      // const
      //   { x: x1, y: y1 } = intersected?.shape.rect ? getRectCenter(intersected.shape.rect) : getPolygonCenter(focused.shape.polygon),
      //   { x: x2, y: y2 } = getCanvasCenter(canvas),
      //   dx = x2 - x1,
      //   dy = y2 - y1
      // moveCanvas(dx, dy)
    },
    onKeyDown = (e: React.KeyboardEvent) => {
      // Cancel polygon annotation.
      if (e.key === 'Escape' && activeShape === 'polygon') {
        polygonRef.current?.cancelAnnotating()
        redrawExistingShapes()
      }
      // Shortcuts available on image focus.
      // Move selection.
      // TODO: Think, whether we can reuse the logic from onMouseMove.
      if (e.key === 'ArrowUp') moveShape(e, 'up')
      if (e.key === 'ArrowDown') moveShape(e, 'down')
      if (e.key === 'ArrowRight') moveShape(e, 'right')
      if (e.key === 'ArrowLeft') moveShape(e, 'left')
      // Always available shortcuts.
      // Select all shapes.
      if (e.key === 'a') {
        setDrawnShapes(shapes => {
          shapes.forEach(s => s.isFocused = true)
          return shapes
        })
        redrawExistingShapes()
      }
      // Copy selected shapes.
      if (e.key === 'c') {
        const selectedShapes = drawnShapes.filter(s => s.isFocused)
        if (selectedShapes.length) {
          navigator.clipboard.writeText(JSON.stringify(selectedShapes))
        }
      }
      // Paste shapes.
      // TODO: Move selected shapes by mouse at once.
      if (e.key === 'v') {
        navigator.clipboard.readText().then(text => {
          const shapes = JSON.parse(text)
          setDrawnShapes(prevShapes => {
            const newShapes = [...shapes, ...prevShapes]
            setWaveArgs(newShapes)
            return newShapes
          })
          redrawExistingShapes()
        })
      }
      // Delete selected shapes.
      if (e.key === 'Delete') {
        setDrawnShapes(shapes => {
          const newShapes = shapes.filter(s => !s.isFocused)
          setWaveArgs(newShapes)
          return newShapes
        })
        redrawExistingShapes()
      }
      // Remove last vertice.
      if (e.key === 'Backspace' && activeShape === 'polygon') {
        polygonRef.current?.removeLastPoint()
        const { x, y } = mousePositionRef.current
        // Re-create the preview line.
        onMouseMove({ clientX: x, clientY: y } as React.MouseEvent)
      }
      // Finish polygon annotation.
      if (e.key === 'Enter' && activeShape === 'polygon') {
        const newPolygon = polygonRef.current?.finishPolygon(activeTag)
        if (newPolygon) {
          setDrawnShapes(prevShapes => {
            const newShapes = [newPolygon, ...prevShapes]
            setWaveArgs(newShapes)
            return newShapes
          })
        }
        redrawExistingShapes()
      }
    },
    remove = (_e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: Fluent.IContextualMenuItem) => {
      if (!item) return
      setDrawnShapes(shapes => {
        const newShapes = item.key === 'remove-selected' ? shapes.filter(s => !s.isFocused) : []
        setWaveArgs(newShapes)
        return newShapes
      })
      redrawExistingShapes()
    },
    chooseShape = (_e?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>, i?: Fluent.IContextualMenuItem) => {
      polygonRef.current?.cancelAnnotating()
      setActiveShape(i?.key as keyof ImageAnnotatorShape)
      startPosition.current = undefined
      setDrawnShapes(shapes => shapes.map(s => { s.isFocused = false; return s }))
      redrawExistingShapes()
    },
    setWaveArgs = (shapes: DrawnShape[]) => {
      wave.args[model.name] = shapes.map(({ tag, shape }) => {
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
        else if (shape.polygon) return {
          tag,
          shape: {
            polygon: {
              vertices: shape.polygon.vertices
                .filter((i: DrawnPoint) => !i.isAux)
                .map(i => ({ x: i.x / aspectRatio, y: i.y / aspectRatio }))
            }
          }
        }
        return { tag, shape }
      }) as unknown as Rec[]
      if (model.trigger) wave.push()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { wave.args[model.name] = model.items as unknown as Rec[] || [] }, [])

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
      if (ctxRef.current) {
        polygonRef.current = new PolygonAnnotator(ctxRef.current)
        ctxRef.current.scale(scale, scale)
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * aspectRatio * scale, img.height * aspectRatio * scale)
      if (!drawnShapes.length) {
        setDrawnShapes(mapShapesToWaveArgs(model.items || [], aspectRatio))
      }
      redrawExistingShapes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.name, model.image, model.image_height, model.items, scale])

  const farItems = [getFarItem('select', 'Select', chooseShape, activeShape, 'TouchPointer')]
  if (allowedShapes.has('rect')) farItems.push(getFarItem('rect', 'Rectangle', chooseShape, activeShape, 'RectangleShape'))
  if (allowedShapes.has('polygon')) farItems.push(getFarItem('polygon', 'Polygon', chooseShape, activeShape, 'SixPointStar'))

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
        farItems={farItems}
      />
      <div className={css.canvasContainer}>
        <canvas ref={imgRef} className={css.canvas} />
        <canvas
          tabIndex={0}
          ref={canvasRef}
          className={css.canvas}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
          // Do not show context menu on right click.
          onContextMenu={e => e.preventDefault()}
          onClick={onClick}
          onWheel={onWheel}
        />
      </div>
    </div >
  )
}