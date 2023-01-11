import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { getPolygonPointCursor, isIntersectingPolygon, PolygonAnnotator } from './image_annotator_polygon'
import { getRectCornerCursor, isIntersectingRect, RectAnnotator } from './image_annotator_rect'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar, cssVarValue, px } from './theme'
import { wave } from './ui'
import { useBoolean, useId } from '@fluentui/react-hooks'

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

const MAX_IMAGE_SCALE = 2.5
const ZOOM_STEP = 0.15

const
  tableBorderStyle = `0.5px solid ${cssVar('$neutralTertiaryAlt')}`,
  css = stylesheet({
    titleContainer: {
      marginBottom: 8,
      display: 'flex',
    },
    title: {
      alignSelf: 'center',
      color: cssVar('$primary'),
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
      margin: 8,
    },
    table: {
      borderSpacing: 0,
    },
    tableBody: {
      $nest: {
        '& > tr > td': {
          boxSizing: 'border-box',
          borderBottom: tableBorderStyle,
          borderRight: tableBorderStyle,
          padding: '0.4rem',
        },
        '& > tr:first-child >td': {
          borderTop: tableBorderStyle,
        },
        '& > tr > td:first-child': {
          width: 180, // A width of the first table column.
          fontWeight: 600,
          borderLeft: tableBorderStyle,
        },
        '& > tr:nth-child(odd)': {
          backgroundColor: cssVar('$themeSecondary'),
        }
      }
    }
  }),
  helpTableRows = [
    { key: 'a', description: 'Select all shapes' },
    { key: 'c', description: 'Copy selected shapes' },
    { key: 'v', description: 'Paste selected shapes' },
    { key: 'd', description: 'Delete selected shapes' },
    { key: 'Shift + Click', description: 'Select multiple shapes when in the selection mode' },
    { key: 'Arrow keys (↑ ↓ → ←)', description: 'Move selected shapes by 1px (or 10px while holding Shift key)' },
    { key: 'Ctrl + Mouse wheel', description: 'Zoom in/out' },
    { key: 'Enter', description: 'Finish drawing polyshape' },
    { key: 'Backspace', description: 'Delete last polyshape vertex' },
    { key: 'Esc', description: 'Cancel ongoing task' },
    { key: 'l', description: 'Toggle label' },
    { key: 'b', description: 'Toggle drawing function' },
    { key: 'r', description: 'Select rectangle tool' },
    { key: 'p', description: 'Select polygon tool' },
    { key: 's', description: 'Activate selection tool' }
  ],
  eventToCursor = (e: React.MouseEvent, rect: DOMRect, scale: F, position: ImageAnnotatorPoint) =>
    ({ cursor_x: (e.clientX - rect.left - position.x) / scale, cursor_y: (e.clientY - rect.top - position.y) / scale }),
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
    [imgPosition, setImgPosition] = React.useState({ x: 0, y: 0 }), // Image position while dragging or scaling.
    imgStartPositionRef = React.useRef({ x: 0, y: 0 }), // Image position before/after dragging or scaling.
    imgCanvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null),
    imgRef = React.useRef(new Image()),
    buttonId = useId('targetButton'),
    wheelDirectionRef = React.useRef(-1),
    imgCanvasRef = React.useRef<HTMLCanvasElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    rectRef = React.useRef<RectAnnotator | null>(null),
    polygonRef = React.useRef<PolygonAnnotator | null>(null),
    [aspectRatio, setAspectRatio] = React.useState(1),
    clickStartPositionRef = React.useRef<Position | undefined>(undefined),
    canvasCtxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    mousePositionRef = React.useRef({ x: 0, y: 0 }),
    [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false),
    getCurrentTagColor = React.useCallback((tag: S) => colorsMap.get(tag) || cssVarValue('$red'), [colorsMap]),
    redrawExistingShapes = React.useCallback(() => {
      const canvas = canvasRef.current
      const ctx = canvasCtxRef.current
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
    recreatePreviewLine = () => {
      // TODO: Get rid of mousePositionRef if possible.
      const { x, y } = mousePositionRef.current
      redrawExistingShapes()
      onMouseMove({ clientX: x, clientY: y } as React.MouseEvent)
    },
    translateImage = (dx: U, dy: U) => {
      if (!imgCanvasRef.current) return
      setImgPosition(imgPosition => {
        const
          newX = imgPosition.x + dx,
          newY = imgPosition.y + dy,
          imgWidth = imgCanvasRef.current?.width,
          imgHeight = imgCanvasRef.current?.height,
          x = Math.min(0, Math.max(newX, -(imgWidth! * (scale - 1)))),
          y = Math.min(0, Math.max(newY, -(imgHeight! * (scale - 1))))
        return { x, y }
      })
    },
    onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || e.buttons !== 1) return
      // Handle drag end when mouse is out of canvas.
      if (e.ctrlKey && scale > 1 && clickStartPositionRef.current?.dragging) clickStartPositionRef.current = undefined

      setWaveArgs(drawnShapes)

      polygonRef.current?.resetDragging()
      rectRef.current?.resetDragging()
      redrawExistingShapes()
    },
    onMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), scale, imgPosition),
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

      imgStartPositionRef.current = imgPosition
      clickStartPositionRef.current = { x: cursor_x, y: cursor_y, dragging: true }
    },
    onMouseMove = (e: React.MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      const canvas = canvasRef.current
      if (!canvas) return
      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), scale, imgStartPositionRef.current),
        clickStartPosition = clickStartPositionRef.current,
        deselectAllShapes = () => setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: false })))

      if (e.ctrlKey && scale > 1) {
        canvas.style.cursor = clickStartPosition?.dragging ? 'grabbing' : 'grab'
        if (clickStartPosition?.dragging && imgCanvasRef.current) {
          translateImage((cursor_x - clickStartPosition.x) * scale, (cursor_y - clickStartPosition.y) * scale)
          clickStartPositionRef.current = { x: cursor_x, y: cursor_y, dragging: clickStartPosition?.dragging }
        }
      } else {
        const
          focused = drawnShapes.find(({ isFocused }) => isFocused),
          intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)
        canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, focused, intersected, activeShape === 'select')
        switch (activeShape) {
          case 'rect': {
            const currentlyDrawnRect = rectRef.current?.onMouseMove(cursor_x, cursor_y, focused, intersected, clickStartPosition)
            if (currentlyDrawnRect) deselectAllShapes()
            redrawExistingShapes()
            if (currentlyDrawnRect?.rect) rectRef.current?.drawRect(currentlyDrawnRect.rect, getCurrentTagColor(activeTag))
            break
          }
          case 'polygon': {
            redrawExistingShapes()
            polygonRef.current?.drawPreviewLine(cursor_x, cursor_y, getCurrentTagColor(activeTag))
            if (polygonRef.current?.hasAnnotationStarted()) deselectAllShapes()
            if (polygonRef.current?.isIntersectingFirstPoint(cursor_x, cursor_y)) canvas.style.cursor = 'pointer'
            break
          }
          case 'select': {
            // If left mouse btn is not held during moving, ignore.
            if (e.buttons !== 1) break
            const shape = focused?.shape.rect ? rectRef.current : polygonRef.current
            if (shape) {
              shape.onMouseMove(cursor_x, cursor_y, focused, intersected, clickStartPosition)
              // Deselect all other shapes when one starts moving.
              if (drawnShapes.some(ds => ds.isFocused && ds !== intersected)) {
                setDrawnShapes(drawnShapes => drawnShapes.map(ds => ({ ...ds, isFocused: intersected === ds })))
              }
              redrawExistingShapes()
            }
            break
          }
        }
      }
    },
    onMouseUp = (e: React.MouseEvent) => {
      // Reset startPosition here because onClick is not registered while holding Control key.
      if (e.ctrlKey && scale > 1 && clickStartPositionRef.current?.dragging) {
        clickStartPositionRef.current = undefined
        // Save current image position when dragging ends.
        if (imgPosition) imgStartPositionRef.current = imgPosition
      }
    },
    onClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        start = clickStartPositionRef.current,
        rect = canvas.getBoundingClientRect(),
        { cursor_x, cursor_y } = eventToCursor(e, rect, scale, imgPosition),
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
              // Allow multiple shapes to be selected by holding Shift key.
              s.isFocused = e.shiftKey ? s === intersected || s.isFocused : s === intersected
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

      clickStartPositionRef.current = undefined
      const focused = drawnShapes.find(({ isFocused }) => isFocused)
      canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, focused, intersected, activeShape === 'select')
    },
    // TODO: Allow moving when there is 0 - 10 gap.
    moveAllSelectedShapes = (dx: U = 0, dy: U = 0) => {
      const canMoveAllSelectedShapes = drawnShapes.filter(ds => ds.isFocused).every(s => {
        const shape = s.shape.rect ? rectRef.current : polygonRef.current
        return shape?.canMove(s, dx, dy)
      })
      if (canMoveAllSelectedShapes) {
        drawnShapes.filter(ds => ds.isFocused).forEach(s => {
          const shape = s.shape.rect ? rectRef.current : polygonRef.current
          shape?.move(s, dx, dy)
        })
      }
      redrawExistingShapes()
    },
    // Zoom canvas in/out.
    onWheel = (e: React.WheelEvent) => {
      const
        canvas = canvasRef.current,
        wheelDirection = wheelDirectionRef.current
      if (!canvas || !e.ctrlKey) return
      if (wheelDirection < 0 && e.deltaY > 0 || wheelDirection > 0 && e.deltaY < 0) {
        imgStartPositionRef.current = { x: 0, y: 0 }
        wheelDirectionRef.current = -wheelDirection
      }
      setScale(scale => Math.max(1, Math.min(MAX_IMAGE_SCALE, scale + (e.deltaY < 0 ? -ZOOM_STEP : ZOOM_STEP))))

      canvas.style.cursor = scale > 1 ? 'grab' : 'auto'
    },
    onKeyDown = (e: React.KeyboardEvent) => {
      // Move selection.
      const increment = e.shiftKey ? 10 : 1
      const resetDragging = () => {
        // TODO: Prevent onClick when switching from 'select' to 'rect' or 'poly'
        polygonRef.current?.cancelAnnotating()
        redrawExistingShapes()
      }
      if (e.key === 'ArrowLeft') moveAllSelectedShapes(-increment)
      if (e.key === 'ArrowRight') moveAllSelectedShapes(increment)
      if (e.key === 'ArrowUp') moveAllSelectedShapes(undefined, -increment)
      if (e.key === 'ArrowDown') moveAllSelectedShapes(undefined, increment)
      // Cancel polygon annotation.
      if (e.key === 'Escape' && activeShape === 'polygon') {
        polygonRef.current?.cancelAnnotating()
        redrawExistingShapes()
      }
      // Set active shape.
      if (e.key === 'p' && allowedShapes.has('polygon')) {
        setActiveShape('polygon')
        resetDragging()
      }
      if (e.key === 'r' && allowedShapes.has('rect')) {
        setActiveShape('rect')
        resetDragging()
      }
      if (e.key === 's') {
        setActiveShape('select')
        resetDragging()
      }
      // Change active tag.
      if (e.key === 'l') {
        const activeTagIdx = model.tags.findIndex(t => t.name === activeTag)
        const nextTag = model.tags[(activeTagIdx + 1) % model.tags.length].name
        activateTag(nextTag)()
      }
      // Change active shape.
      if (e.key === 'b') {
        const shapes = Array.from(allowedShapes) as (keyof ImageAnnotatorShape | 'select')[]
        const activeShapeIdx = shapes.findIndex(s => s === activeShape)
        setActiveShape(activeShapeIdx === shapes.length - 1 ? 'select' : shapes[(activeShapeIdx + 1) % shapes.length])
        resetDragging()
      }
      // Change cursor to indicate that user can drag image.
      if (e.key === 'Control' && canvasRef.current && scale > 1) {
        canvasRef.current.style.cursor = 'grab'
      }
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
        if (selectedShapes.length) navigator.clipboard.writeText(JSON.stringify(selectedShapes))
      }
      // Paste shapes.
      if (e.key === 'v') {
        navigator.clipboard.readText().then(text => {
          let shapes: DrawnShape[]
          try { shapes = JSON.parse(text) }
          catch (e) { return }
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
        recreatePreviewLine()
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
    onKeyUp = (e: React.KeyboardEvent) => {
      if (e.key === 'Control') {
        // Set correct cursor on key up when Ctrl is unpressed.
        if (canvasRef.current) canvasRef.current.style.cursor = 'auto'
        // Apply new image position after image scaling.
        imgStartPositionRef.current = imgPosition
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
      clickStartPositionRef.current = undefined
      setDrawnShapes(shapes => shapes.map(s => { s.isFocused = false; return s }))
      redrawExistingShapes()
    },
    setWaveArgs = (shapes: DrawnShape[]) => {
      wave.args[model.name] = shapes.map(({ tag, shape }) => {
        if (shape.rect) return {
          tag,
          shape: {
            rect: {
              x1: Math.round(shape.rect.x1 / aspectRatio),
              x2: Math.round(shape.rect.x2 / aspectRatio),
              y1: Math.round(shape.rect.y1 / aspectRatio),
              y2: Math.round(shape.rect.y2 / aspectRatio),
            }
          }
        }
        else if (shape.polygon) return {
          tag,
          shape: {
            polygon: {
              vertices: shape.polygon.vertices
                .filter((i: DrawnPoint) => !i.isAux)
                .map(i => ({ x: Math.round(i.x / aspectRatio), y: Math.round(i.y / aspectRatio) }))
            }
          }
        }
        return { tag, shape }
      }) as unknown as Rec[]
      if (model.trigger) wave.push()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { wave.args[model.name] = model.items as unknown as Rec[] || [] }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => recreatePreviewLine(), [activeTag])

  React.useEffect(() => {
    const img = new Image()
    img.src = model.image
    img.onload = () => {
      const imgCanvas = imgCanvasRef.current
      const canvas = canvasRef.current
      if (!imgCanvas || !canvas) return
      canvasCtxRef.current = canvas.getContext('2d')

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
      if (canvasCtxRef.current) {
        polygonRef.current = new PolygonAnnotator(canvas)
        canvasCtxRef.current.scale(scale, scale)
        canvasCtxRef.current.translate(imgPosition.x / scale, imgPosition.y / scale)
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, imgPosition.x, imgPosition.y, img.width * aspectRatio * scale, img.height * aspectRatio * scale)
      // Prevent page scroll when mouse is on the canvas.
      canvas.onwheel = e => e.preventDefault()

      imgRef.current = img
      imgCanvasCtxRef.current = ctx

      if (!drawnShapes.length) setDrawnShapes(mapShapesToWaveArgs(model.items || [], aspectRatio))
      redrawExistingShapes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.name, model.image, model.image_height, model.items])

  // Translate image to cursor position on scale change.
  React.useEffect(() => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect && scale !== MAX_IMAGE_SCALE) {
      const
        { x, y } = mousePositionRef.current,
        { cursor_x, cursor_y } = eventToCursor({ clientX: x, clientY: y } as React.MouseEvent, rect, scale, imgStartPositionRef.current),
        translateFactor = scale * -wheelDirectionRef.current * ZOOM_STEP
      translateImage(cursor_x * translateFactor, cursor_y * translateFactor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale])

  // Redraw image after image position change.
  React.useEffect(() => {
    if (canvasCtxRef.current && imgCanvasCtxRef.current) {
      canvasCtxRef.current.setTransform(scale, 0, 0, scale, imgPosition.x, imgPosition.y)
    }
    const img = imgRef.current
    if (img && imgCanvasCtxRef.current) imgCanvasCtxRef.current.drawImage(img, 0, 0, img.width, img.height, imgPosition.x, imgPosition.y, img.width * aspectRatio * scale, img.height * aspectRatio * scale)
    redrawExistingShapes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgPosition])

  const farItems = [getFarItem('select', 'Select', chooseShape, activeShape, 'TouchPointer')]
  if (allowedShapes.has('rect')) farItems.push(getFarItem('rect', 'Rectangle', chooseShape, activeShape, 'RectangleShape'))
  if (allowedShapes.has('polygon')) farItems.push(getFarItem('polygon', 'Polygon', chooseShape, activeShape, 'SixPointStar'))

  return (
    <div data-test={model.name}>
      <div className={css.titleContainer}>
        <div className={clas('wave-s16 wave-w6', css.title)}>{model.title}</div>
        <Fluent.IconButton id={buttonId} iconProps={{ iconName: 'Info', styles: { root: { fontSize: 20 } } }} onClick={toggleTeachingBubbleVisible} />
      </div>
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
        <canvas ref={imgCanvasRef} className={css.canvas} />
        <canvas
          tabIndex={0}
          ref={canvasRef}
          className={css.canvas}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          // Do not show context menu on right click.
          onContextMenu={e => e.preventDefault()}
          onClick={onClick}
          onWheel={onWheel}
        />
      </div>
      {teachingBubbleVisible && (
        <Fluent.TeachingBubble
          target={`#${buttonId}`}
          isWide
          hasCloseButton
          closeButtonAriaLabel="Close"
          onDismiss={toggleTeachingBubbleVisible}
          calloutProps={{ directionalHint: Fluent.DirectionalHint.bottomLeftEdge }}
          headline="Keyboard shortcuts"
        >
          <table className={css.table}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody className={css.tableBody}>
              {helpTableRows.map(row =>
                <tr key={row.key}>
                  <td>{row.key}</td>
                  <td>{row.description}</td>
                </tr>
              )}
            </tbody>
          </table>
        </Fluent.TeachingBubble>
      )}
    </div >
  )
}