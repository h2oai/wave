import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { getPolygonBoundaries, getPolygonPointCursor, isIntersectingPolygon, PolygonAnnotator } from './image_annotator_polygon'
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

export type DrawnShape = ImageAnnotatorItem & { isFocused?: B, boundaryRect?: ImageAnnotatorRect | null }
export type DrawnPoint = ImageAnnotatorPoint & { isAux?: B }

const
  ZOOM_STEP = 0.15,
  tableBorderStyle = `0.5px solid ${cssVar('$neutralTertiaryAlt')}`,
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
      bottom: 0,
      zIndex: 1,
      outline: 'none',
    },
    canvasContainer: {
      position: 'relative',
      margin: 8,
    },
    tableTitle: {
      padding: 8,
    },
    table: {
      borderSpacing: 0,
      padding: 8
    },
    img: {
      maxHeight: '100%',
      maxWidth: '100%',
      transformOrigin: '0px 0px',
      display: 'block',
      margin: '0 auto',
    },
    imageContainer: {
      overflow: 'hidden',
      position: 'relative',
      margin: '0 auto'
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
          backgroundColor: cssVar('$neutralLighter'),
        }
      }
    }
  }),
  helpTableRows = [
    ['s', 'Activate selection tool'],
    ['r', 'Select rectangle tool'],
    ['p', 'Select polygon tool'],
    ['b', 'Toggle drawing function'],
    ['l', 'Toggle label'],
    ['Shift + Click', 'Select/deselect multiple shapes when in the selection mode'],
    ['a', 'Select all shapes'],
    ['Ctrl + Mouse wheel', 'Zoom in/out'],
    ['Arrow keys (←↑↓→)', 'Move selected shapes by 1px (or 10px while holding Shift key)'],
    ['c', 'Copy selected shapes'],
    ['v', 'Paste selected shapes'],
    ['Delete', 'Delete selected shapes'],
    ['Backspace', 'Delete last polygon vertex'],
    ['Backspace', 'Delete selected shapes (if not drawing a polygon)'],
    ['Esc', 'Cancel ongoing task'],
    ['Enter', 'Finish drawing polyshape'],
  ],
  tooltipProps: Fluent.ITooltipProps = {
    onRenderContent: () => (
      <>
        <h2 className={css.tableTitle}>Keyboard shortcuts</h2>
        <table className={css.table}>
          <thead>
            <tr>
              <th scope="col">Key</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {helpTableRows.map(([key, desc], idx) =>
              <tr key={idx}>
                <td><kbd>{key}</kbd></td>
                <td>{desc}</td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    ),
  },
  eventToCursor = (e: React.MouseEvent, rect: DOMRect, zoom: F, position: ImageAnnotatorPoint) =>
    ({ cursor_x: (e.clientX - rect.left - position.x) / zoom, cursor_y: (e.clientY - rect.top - position.y) / zoom }),
  getIntersectedShape = (shapes: DrawnShape[], cursor_x: F, cursor_y: F) => shapes.find(({ shape, isFocused }) => {
    if (shape.rect) return isIntersectingRect(cursor_x, cursor_y, shape.rect, isFocused)
    if (shape.polygon) return isIntersectingPolygon({ x: cursor_x, y: cursor_y }, shape.polygon.vertices, isFocused)
  }),
  getCorrectCursor = (cursor_x: U, cursor_y: U, intersected?: DrawnShape, isSelect = false) => {
    if (!isSelect) return 'crosshair'
    let cursor = intersected ? 'pointer' : 'auto'
    if (intersected?.isFocused && intersected.shape.rect) cursor = getRectCornerCursor(intersected.shape.rect, cursor_x, cursor_y) || 'move'
    else if (intersected?.isFocused && intersected.shape.polygon) cursor = getPolygonPointCursor(intersected.shape.polygon.vertices, cursor_x, cursor_y) || 'move'

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
    else if (shape.polygon) {
      const vertices = shape.polygon.vertices.map(i => ({ x: i.x * aspectRatio, y: i.y * aspectRatio }))
      return { tag, shape: { polygon: { vertices } }, boundaryRect: getPolygonBoundaries(vertices) }
    }
    return { tag, shape }
  }),
  getFarItem = (key: S, title: S, onClick: () => void, activeShape: keyof ImageAnnotatorShape | 'select', iconName: S) => ({
    key,
    title,
    onClick,
    canCheck: true,
    checked: activeShape === key,
    iconProps: { iconName, styles: { root: { fontSize: 20 } } }
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
    [zoom, setZoom] = React.useState(1),
    imgPositionRef = React.useRef({ x: 0, y: 0 }),
    clipboardRef = React.useRef<DrawnShape[]>([]),
    imgRef = React.useRef<HTMLImageElement>(null),
    canvasRef = React.useRef<HTMLCanvasElement>(null),
    rectRef = React.useRef<RectAnnotator | null>(null),
    polygonRef = React.useRef<PolygonAnnotator | null>(null),
    aspectRatioRef = React.useRef(1),
    clickStartPositionRef = React.useRef<Position | undefined>(undefined),
    canvasCtxRef = React.useRef<CanvasRenderingContext2D | undefined | null>(undefined),
    mousePositionRef = React.useRef({ x: 0, y: 0 }),
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
    changeActiveShape = (shape: keyof ImageAnnotatorShape | 'select') => {
      const
        { x, y } = mousePositionRef.current,
        canvas = canvasRef.current
      if (canvas) canvas.style.cursor = getCorrectCursor(x, y, undefined, shape === 'select')
      setActiveShape(shape)
    },
    recreatePreviewLine = () => {
      const { x, y } = mousePositionRef.current
      redrawExistingShapes()
      onMouseMove({ clientX: x, clientY: y } as React.MouseEvent)
    },
    deselectAllShapes = () => setDrawnShapes(shapes => shapes.map(shape => ({ ...shape, isFocused: false }))),
    applyZoom = (dx: U, dy: U, zoom: F) => {
      const canvasCtx = canvasCtxRef.current
      if (!canvasCtx || !imgRef.current) return

      const
        newX = imgPositionRef.current.x + dx,
        newY = imgPositionRef.current.y + dy,
        imgWidth = imgRef.current?.width,
        imgHeight = imgRef.current?.height,
        x = Math.min(0, Math.max(newX, -(imgWidth! * (zoom - 1)))),
        y = Math.min(0, Math.max(newY, -(imgHeight! * (zoom - 1))))

      imgPositionRef.current = { x, y }
      canvasCtx.setTransform(zoom, 0, 0, zoom, imgPositionRef.current.x, imgPositionRef.current.y)
      imgRef.current.style.transform = `translate(${imgPositionRef.current.x}px, ${imgPositionRef.current.y}px) scale(${zoom})`
      redrawExistingShapes()
    },
    cancelOngoingAction = () => {
      deselectAllShapes()
      polygonRef.current?.cancelAnnotating()
      polygonRef.current?.resetDragging()
      rectRef.current?.resetDragging()
      // Prevent creating shapes when active shape is changed with shortcuts during dragging.
      if (clickStartPositionRef.current) clickStartPositionRef.current = undefined
      // Set correct wave args when drag moving is interrupted by changing active shape.
      setWaveArgs(drawnShapes)
      redrawExistingShapes()
    },
    onMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas || e.buttons !== 1) return
      // Handle drag end when mouse is out of canvas.
      if (e.ctrlKey && zoom > 1 && clickStartPositionRef.current?.dragging) clickStartPositionRef.current = undefined

      setWaveArgs(drawnShapes)

      polygonRef.current?.resetDragging()
      rectRef.current?.resetDragging()
      redrawExistingShapes()
    },
    onMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), zoom, imgPositionRef.current),
        intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)

      if (e.buttons !== 1 && !intersected?.shape.polygon) return // Ignore right-click.

      if (intersected?.isFocused && intersected?.shape.rect) rectRef.current?.onMouseDown(cursor_x, cursor_y, intersected)
      if (intersected?.shape.polygon && polygonRef.current) {
        const vertices = intersected.shape.polygon.vertices
        const auxAdded = polygonRef.current.tryToAddAuxPoint(cursor_x, cursor_y, vertices)
        polygonRef.current.resetDragging()
        polygonRef.current?.onMouseDown(cursor_x, cursor_y, intersected)

        // Remove polygon vertex on right click.
        if (e.buttons === 2) intersected.shape.polygon.vertices = polygonRef.current.tryToRemovePoint(cursor_x, cursor_y, vertices)

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

      // Deselect all shapes when polygon/rect drawing starts.
      if (activeShape === 'rect' || activeShape === 'polygon') deselectAllShapes()

      clickStartPositionRef.current = { x: cursor_x, y: cursor_y }
    },
    onMouseMove = (e: React.MouseEvent) => {
      if (clickStartPositionRef.current) clickStartPositionRef.current.dragging = true
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      const canvas = canvasRef.current
      if (!canvas) return
      const
        { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect(), zoom, imgPositionRef.current),
        clickStartPosition = clickStartPositionRef.current

      if (e.ctrlKey && zoom > 1) {
        canvas.style.cursor = clickStartPosition?.dragging ? 'grabbing' : 'grab'
        if (clickStartPosition?.dragging) {
          applyZoom((cursor_x - clickStartPosition.x) * zoom, (cursor_y - clickStartPosition.y) * zoom, zoom)
        }
      } else {
        // TODO: Save in onMouseDown.
        const intersected = getIntersectedShape(drawnShapes, cursor_x, cursor_y)
        canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, intersected, activeShape === 'select')
        switch (activeShape) {
          case 'rect': {
            const currentlyDrawnRect = rectRef.current?.onMouseMove(cursor_x, cursor_y, clickStartPosition)
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
            if (e.buttons !== 1 || !drawnShapes.some(s => s.isFocused)) break
            // TODO: Move all selected shapes at once.
            if (rectRef.current) rectRef.current.onMouseMove(cursor_x, cursor_y, clickStartPosition)
            if (polygonRef.current) polygonRef.current.onMouseMove(cursor_x, cursor_y, clickStartPosition)
            redrawExistingShapes()
            break
          }
        }
      }
    },
    onMouseUp = (e: React.MouseEvent) => {
      // Reset startPosition here because onClick is not registered while holding Control key.
      if (e.ctrlKey && zoom > 1 && clickStartPositionRef.current?.dragging) {
        clickStartPositionRef.current = undefined
      }
    },
    onClick = (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const
        start = clickStartPositionRef.current,
        rect = canvas.getBoundingClientRect(),
        { cursor_x, cursor_y } = eventToCursor(e, rect, zoom, imgPositionRef.current),
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
          // Prevent drawing new polygon when switched from 'select' mode during shape dragging.
          if (!start) break
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
              // Selection should not be changed if moving/resizing.
              if (!start?.dragging) {
                if (e.shiftKey && s === intersected) {
                  s.isFocused = !s.isFocused
                } else if (!e.shiftKey) {
                  s.isFocused = s === intersected
                }
              }
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
      canvas.style.cursor = getCorrectCursor(cursor_x, cursor_y, intersected, activeShape === 'select')
    },
    moveAllSelectedShapes = (dx: U, dy: U) => {
      drawnShapes.forEach(s => {
        if (!s.isFocused) return
        if (s.shape.rect) rectRef.current?.move(dx, dy, s)
        else if (s.shape.polygon) polygonRef.current?.move(dx, dy, s)
      })
      setWaveArgs(drawnShapes)
      redrawExistingShapes()
    },
    onWheel = (e: React.WheelEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRef.current || !e.ctrlKey || !rect) return

      setZoom(zoom => {
        const newZoom = Math.max(1, zoom + (e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP))
        if (zoom !== newZoom) {
          const
            { cursor_x, cursor_y } = eventToCursor(e, rect, zoom, imgPositionRef.current),
            translateFactor = (e.deltaY > 0 ? 1 : -1) * Math.abs(newZoom - zoom)
          applyZoom(cursor_x * translateFactor, cursor_y * translateFactor, newZoom)
        }
        return newZoom
      })
      canvasRef.current.style.cursor = zoom > 1 ? 'grab' : 'auto'

    },
    onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      const increment = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft') moveAllSelectedShapes(-increment, 0)
      else if (e.key === 'ArrowRight') moveAllSelectedShapes(increment, 0)
      else if (e.key === 'ArrowUp') moveAllSelectedShapes(0, -increment)
      else if (e.key === 'ArrowDown') moveAllSelectedShapes(0, increment)
      // Cancel polygon annotation.
      else if (e.key === 'Escape' && activeShape !== 'select') cancelOngoingAction()
      // Change active shape.
      else if (e.key === 'b') {
        const shapes = ['select', ...allowed_shapes] as (keyof ImageAnnotatorShape | 'select')[]
        const activeShapeIdx = shapes.findIndex(s => s === activeShape)
        changeActiveShape(shapes[(activeShapeIdx + 1) % shapes.length])
        cancelOngoingAction()
      }
      else if (e.key === 's' && activeShape !== 'select') {
        changeActiveShape('select')
        cancelOngoingAction()
      }
      else if (e.key === 'r' && allowedShapes.has('rect') && activeShape !== 'rect') {
        changeActiveShape('rect')
        cancelOngoingAction()
      }
      else if (e.key === 'p' && allowedShapes.has('polygon') && activeShape !== 'polygon') {
        changeActiveShape('polygon')
        cancelOngoingAction()
      }
      // Change active tag.
      else if (e.key === 'l') {
        const activeTagIdx = model.tags.findIndex(t => t.name === activeTag)
        const nextTag = model.tags[(activeTagIdx + 1) % model.tags.length].name
        activateTag(nextTag)()
      }
      // Change cursor to indicate that user can drag image.
      else if (e.key === 'Control' && canvasRef.current && zoom > 1) {
        canvasRef.current.style.cursor = 'grab'
      }
      else if (e.key === 'a') {
        setDrawnShapes(shapes => shapes.map(s => ({ ...s, isFocused: true })))
        redrawExistingShapes()
      }
      else if (e.key === 'c') {
        clipboardRef.current = drawnShapes.filter(s => s.isFocused)
      }
      else if (e.key === 'v' && clipboardRef.current.length) {
        setDrawnShapes(prevShapes => {
          // Deep copy.
          const newShapes = clipboardRef.current.map<DrawnShape>(({ tag, shape, boundaryRect }) => (
            {
              tag,
              isFocused: true,
              boundaryRect: boundaryRect ? { x1: boundaryRect.x1, x2: boundaryRect.x2, y1: boundaryRect.y1, y2: boundaryRect.y2 } : null,
              shape: {
                rect: shape.rect ? { x1: shape.rect.x1, x2: shape.rect.x2, y1: shape.rect.y1, y2: shape.rect.y2 } : undefined,
                polygon: shape.polygon ? { vertices: shape.polygon.vertices.map(({ x, y }) => ({ x, y })) } : undefined,
              }
            }
          ))
          // May be made more performant by using static Array and idxs instead of dynamic push.
          prevShapes.forEach(s => {
            s.isFocused = false
            newShapes.push(s)
          })
          setWaveArgs(newShapes)
          return newShapes
        })
        redrawExistingShapes()
      }
      // Remove last polygon vertex.
      else if (e.key === 'Backspace' && activeShape === 'polygon') {
        polygonRef.current?.removeLastPoint()
        recreatePreviewLine()
      }
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        const newShapes = drawnShapes.filter(s => !s.isFocused)
        if (newShapes.length !== drawnShapes.length) {
          setDrawnShapes(newShapes)
          setWaveArgs(newShapes)
          redrawExistingShapes()
        }
      }
      // Finish polygon annotation.
      else if (e.key === 'Enter' && activeShape === 'polygon') {
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
    onKeyUp = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      // Set correct cursor on key up when Ctrl is unpressed.
      if (e.key === 'Control' && canvasRef.current) canvasRef.current.style.cursor = activeShape === 'select' ? 'auto' : 'crosshair'
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
      changeActiveShape(i?.key as keyof ImageAnnotatorShape)
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
              x1: Math.round(shape.rect.x1 / aspectRatioRef.current),
              x2: Math.round(shape.rect.x2 / aspectRatioRef.current),
              y1: Math.round(shape.rect.y1 / aspectRatioRef.current),
              y2: Math.round(shape.rect.y2 / aspectRatioRef.current),
            }
          }
        }
        else if (shape.polygon) return {
          tag,
          shape: {
            polygon: {
              vertices: shape.polygon.vertices
                .filter((i: DrawnPoint) => !i.isAux)
                .map(i => ({ x: Math.round(i.x / aspectRatioRef.current), y: Math.round(i.y / aspectRatioRef.current) }))
            }
          }
        }
        return { tag, shape }
      }) as unknown as Rec[]
      if (model.trigger) wave.push()
    },
    onImgLoad = () => {
      const canvas = canvasRef.current
      const img = imgRef.current
      if (!img || !canvas) return

      const height = model.image_height ? +model.image_height.replace('px', '') : img.naturalHeight
      aspectRatioRef.current = height / img.naturalHeight
      const imgParent = img.parentElement as HTMLDivElement
      imgParent.style.height = px(height)
      imgParent.style.width = px(img.naturalWidth * aspectRatioRef.current)
      canvas.height = height
      canvas.width = img.naturalWidth * aspectRatioRef.current

      canvas.parentElement!.style.height = px(height)

      canvasCtxRef.current = canvas.getContext('2d')
      if (canvasCtxRef.current) {
        canvasCtxRef.current.lineWidth = 2
        rectRef.current = new RectAnnotator(canvas, canvasCtxRef.current)
        polygonRef.current = new PolygonAnnotator(canvas, canvasCtxRef.current)
      }

      // Prevent page scroll when mouse is on the canvas.
      // It's not possible to preventDefault in the React onWheel handler because React registers JSX listeners as passive - https://github.com/facebook/react/pull/19654.
      canvas.onwheel = e => e.preventDefault()

      imgPositionRef.current = { x: 0, y: 0 }
      setZoom(1)
      setDrawnShapes(mapShapesToWaveArgs(model.items || [], aspectRatioRef.current))
      redrawExistingShapes()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { wave.args[model.name] = model.items as unknown as Rec[] || [] }, [model.name, model.items])

  React.useEffect(() => {
    setDrawnShapes(mapShapesToWaveArgs(model.items || [], aspectRatioRef.current))
    redrawExistingShapes()
  }, [model.items, redrawExistingShapes])

  // Handle case when changing active tag by "l" shortcut while annotating polygon.
  // TODO: Re-implement this in a more elegant way.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => recreatePreviewLine(), [activeTag])

  const farItems: Fluent.ICommandBarItemProps[] | undefined = [getFarItem('select', 'Select', chooseShape, activeShape, 'TouchPointer')]
  if (allowedShapes.has('rect')) farItems.push(getFarItem('rect', 'Rectangle', chooseShape, activeShape, 'RectangleShape'))
  if (allowedShapes.has('polygon')) farItems.push(getFarItem('polygon', 'Polygon', chooseShape, activeShape, 'SixPointStar'))
  farItems.push({
    key: 'info',
    onRender: () =>
      <Fluent.TooltipHost
        tooltipProps={tooltipProps}
        id={`wave-image-annotator-${model.name}`}
        delay={Fluent.TooltipDelay.zero}
        directionalHint={Fluent.DirectionalHint.bottomRightEdge}
        styles={{ root: { display: 'flex', alignItems: 'center' } }}
      >
        <Fluent.IconButton
          styles={{ root: { height: '100%' } }}
          iconProps={{ iconName: 'Info', style: { fontSize: 18 } }}
        />
      </Fluent.TooltipHost>
  })

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
        <div className={css.imageContainer}>
          <img
            ref={imgRef}
            className={css.img}
            src={model.image}
            onLoad={onImgLoad}
            alt="Image to annotate / with annotations." />
        </div>
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
    </div >
  )
}