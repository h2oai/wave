import * as Fluent from '@fluentui/react'
import { B, F, S, U, xid } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { AudioAnnotatorItem, AudioAnnotatorTag } from '../audio_annotator'
import { isIntersectingRect } from '../image_annotator_rect'
import { clas, cssVar, cssVarValue } from '../theme'
import { eventToCursor } from './annotator_utils'

type RangeAnnotatorProps<T> = {
  activeTag: S
  tags: AudioAnnotatorTag[]
  trackPosition: F
  duration: F
  items?: AudioAnnotatorItem[]
  backgroundData: T[]
  setActiveTag: (tag: S) => void
  onAnnotate: (annotations: DrawnAnnotation[]) => void
  onRenderToolbar?: () => JSX.Element
  onRenderBackground: (data: T[]) => JSX.Element
}
type AnnotatorProps = {
  annotations: DrawnAnnotation[]
  activeTag: S
  trackPosition: F | null
  duration: F
  start?: F
  colorsMap: Map<S, TagColor>
  setActiveTag: (tag: S) => void
  addNewAnnotation: (annotation: DrawnAnnotation, unzoom?: B) => void
  focusAnnotation: (annotation?: DrawnAnnotation) => void
  moveOrResizeAnnotation: (annotation?: DrawnAnnotation) => void
  setZoom?: React.Dispatch<React.SetStateAction<{ from: F, to: F }>>
}
type DraggedAnnotation = {
  from: U
  to: U
  action?: 'resize' | 'move' | 'new'
  resized?: 'from' | 'to'
  intersected?: DrawnAnnotation
  newAnnotationStart?: F
}
type TooltipProps = { title: S, range: S, top: U, left: U }
type TagColor = { transparent: S, color: S, label: S }
export type DrawnAnnotation = AudioAnnotatorItem & {
  // TODO: Think of a better way to move/resize zoomed annotations.
  id: S
  canvasStart: F
  canvasEnd: F
  canvasHeight: U
  canvasY: U
  isFocused?: B
  isZoom?: B
}

const
  WAVEFORM_HEIGHT = 100,
  MIN_ANNOTATION_WIDTH = 5,
  ANNOTATION_HANDLE_OFFSET = 3,
  LEFT_TOOLTIP_OFFSET = 25,
  TOOLTIP_WIDTH = 200,
  TRACK_WIDTH = 5,
  ZOOM_STROKE_WIDTH = 3,
  css = stylesheet({
    annotatorContainer: {
      width: '100%',
      height: WAVEFORM_HEIGHT,
      position: 'relative',
      marginTop: 15
    },
    annotatorCanvas: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: WAVEFORM_HEIGHT,
    },
    tooltip: {
      position: 'absolute',
      display: 'none',
      zIndex: 1,
      padding: 15,
      background: cssVar('$card'),
      width: TOOLTIP_WIDTH,
      borderRadius: 2,
      userSelect: 'none',
      boxShadow: `${cssVar('$text1')} 0px 6.4px 14.4px 0px, ${cssVar('$text2')} 0px 1.2px 3.6px 0px`,
      boxSizing: 'border-box',
    },
    timeComponent: {
      textAlign: 'center',
      $nest: {
        'span': {
          display: 'inline-block',
          width: 18,
        },
        '.wave-time-delimiter': {
          width: 'auto',
        }
      }
    },
    timeComponentBig: {
      $nest: {
        'span': {
          width: 35,
          fontSize: 30,
        },
        '.wave-time-delimiter': {
          width: 10,
          marginLeft: 3
        }
      }
    },
  }),
  getIntersectingEdge = (x: U, intersected?: { canvasStart: F, canvasEnd: F }) => {
    if (!intersected) return
    const { canvasStart, canvasEnd } = intersected
    if (Math.abs(canvasStart - x) <= ANNOTATION_HANDLE_OFFSET) return 'from'
    if (Math.abs(canvasEnd - x) <= ANNOTATION_HANDLE_OFFSET) return 'to'
  },
  getResized = (cursor_x: F, min: F, max: F) => {
    return cursor_x <= min
      ? 'from'
      : cursor_x >= max
        ? 'to'
        : undefined
  },
  getTooltipTopOffset = (cursorY: F) => cursorY - 80,
  getTooltipLeftOffset = (cursorX: F, canvasWidth: F) => {
    return (cursorX + TOOLTIP_WIDTH + LEFT_TOOLTIP_OFFSET) > canvasWidth
      ? cursorX - TOOLTIP_WIDTH - LEFT_TOOLTIP_OFFSET
      : cursorX + LEFT_TOOLTIP_OFFSET
  },
  isAnnotationIntersectingAtStart = (a1?: DrawnAnnotation, a2?: DrawnAnnotation) => {
    return a1 && a2 && a1.canvasEnd >= a2.canvasStart && a2.canvasStart >= a1.canvasStart
  },
  isAnnotationIntersectingAtEnd = (a1?: DrawnAnnotation, a2?: DrawnAnnotation) => {
    return a1 && a2 && a2.canvasStart >= a1.canvasStart && a2.canvasStart <= a1.canvasEnd
  },
  canvasUnitsToSeconds = (canvasUnit: F, canvasWidth: F, duration: F) => +(canvasUnit / canvasWidth * duration).toFixed(2),
  createAnnotation = (from: U, to: U, tag: S, canvasWidth: F, duration: F): DrawnAnnotation => {
    const canvasStart = Math.min(from, to)
    const canvasEnd = Math.max(from, to)
    const start = canvasUnitsToSeconds(from, canvasWidth, duration)
    const end = canvasUnitsToSeconds(to, canvasWidth, duration)
    return { id: xid(), canvasStart, canvasEnd, start, end, tag, canvasHeight: WAVEFORM_HEIGHT, canvasY: 0 }
  },
  getIntersectedAnnotation = (annotations: DrawnAnnotation[], x: U, y: U) => {
    // TODO: Improve perf - binary search.
    return annotations.find(a => isIntersectingRect(x, y, { x1: a.canvasStart, x2: a.canvasEnd, y1: a.canvasY, y2: a.canvasHeight + a.canvasY }))
  },
  getAnnotationsWithinRange = (annotations: DrawnAnnotation[], { from, to }: { from: F, to: F }, canvasWidth: F) => {
    // TODO: Improve perf - binary search.
    const annotationsWithinRange: DrawnAnnotation[] = []
    const rangeSize = Math.abs(to - from)

    for (let i = 0; i < annotations.length; i++) {
      const a = annotations[i]
      if (a.isZoom) continue
      const aStart = a.canvasStart
      const aEnd = a.canvasEnd
      if ((aStart >= from && aStart <= to) || (aEnd >= from && aEnd <= to) || (aStart <= from && aEnd >= to)) {
        const canvasStart = (aStart - from) / rangeSize * canvasWidth
        const canvasEnd = (aEnd - from) / rangeSize * canvasWidth
        annotationsWithinRange.push({ ...a, canvasStart, canvasEnd })
      }
    }

    return annotationsWithinRange
  },
  getCanvasDimensions = (intersections: DrawnAnnotation[], annotation: DrawnAnnotation, maxDepth?: U) => {
    const verticalIntersections = intersections
      .filter(a => a !== annotation && isAnnotationIntersectingAtEnd(a, annotation))
      // TODO: Prev array is already sorted so adding a new element can be made O(N) instead of O(NlogN).
      .sort((a, b) => a.canvasY - b.canvasY)
    let canvasY = 0
    let j = 0
    while (canvasY === verticalIntersections[j]?.canvasY) {
      canvasY += verticalIntersections[j].canvasHeight
      j++
    }
    const canvasHeight = maxDepth
      ? WAVEFORM_HEIGHT / maxDepth
      : Math.abs(canvasY - (verticalIntersections[j]?.canvasY || WAVEFORM_HEIGHT))
    return { canvasY, canvasHeight }
  },
  getMaxDepth = (annotations: DrawnAnnotation[], idx: U, annotation: DrawnAnnotation, currMax: U) => {
    // TODO: Super ugly perf-wise.
    let currmax = annotations.filter(a => annotation.canvasStart >= a.canvasStart && annotation.canvasStart <= a.canvasEnd).length
    for (let j = idx + 1; annotations[j]?.canvasStart >= annotation?.canvasStart && annotations[j]?.canvasStart <= annotation?.canvasEnd; j++) {
      currmax = Math.max(currmax, getMaxDepth(annotations, j, annotations[j], currMax + 1))
    }
    return currmax
  },
  itemsToAnnotations = (items?: AudioAnnotatorItem[]) => {
    return items?.map(i => ({ ...i, id: xid(), canvasHeight: WAVEFORM_HEIGHT, canvasY: 0, canvasStart: i.start, canvasEnd: i.end })) || []
  },
  needsZoom = (duration: F) => duration > 10,
  drawAnnotation = (ctx: CanvasRenderingContext2D, { tag, canvasStart, canvasEnd, canvasHeight, canvasY, isFocused }: DrawnAnnotation, colorsMap: Map<S, TagColor>) => {
    ctx.fillStyle = colorsMap.get(tag)?.transparent || 'red'
    ctx.fillRect(canvasStart, canvasY, canvasEnd - canvasStart, canvasHeight)
    if (isFocused) {
      ctx.strokeStyle = colorsMap.get(tag)?.color || 'red'
      ctx.lineWidth = ZOOM_STROKE_WIDTH
      ctx.strokeRect(canvasStart, canvasY, canvasEnd - canvasStart, canvasHeight)
    }
  },
  Annotator = (props: React.PropsWithChildren<AnnotatorProps>) => {
    const
      { annotations, activeTag, addNewAnnotation, trackPosition, duration, setActiveTag,
        children, colorsMap, moveOrResizeAnnotation, focusAnnotation, setZoom, start = 0 } = props,
      canvasRef = React.useRef<HTMLCanvasElement>(null),
      ctxRef = React.useRef<CanvasRenderingContext2D | null>(null),
      currDrawnAnnotation = React.useRef<DraggedAnnotation | undefined>(undefined),
      isDefaultCanvasWidthFixed = React.useRef(false),
      [tooltipProps, setTooltipProps] = React.useState<TooltipProps | null>(null),
      redrawAnnotations = React.useCallback(() => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!ctx || !canvas) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const action = currDrawnAnnotation.current?.action
        const moveOrResize = action === 'move' || action === 'resize'
        const intersected = currDrawnAnnotation.current?.intersected

        for (let i = 0; i < annotations.length; i++) {
          const { id, canvasStart, canvasEnd, canvasHeight, canvasY, isZoom } = annotations[i]
          if (isZoom && !setZoom) continue
          if (isZoom) {
            ctx.strokeStyle = cssVarValue('$themePrimary')
            ctx.lineWidth = ZOOM_STROKE_WIDTH
            ctx.strokeRect(canvasStart, canvasY, canvasEnd - canvasStart, canvasHeight)
            continue
          }
          if (moveOrResize && intersected?.id === id) continue
          drawAnnotation(ctx, annotations[i], colorsMap)
        }

        if (currDrawnAnnotation.current && action === 'new') {
          const { from, to } = currDrawnAnnotation.current
          ctx.fillStyle = colorsMap.get(activeTag)?.transparent || 'red'
          ctx.fillRect(from, 0, to - from, WAVEFORM_HEIGHT)
        }
        if (moveOrResize && intersected && !intersected.isZoom) drawAnnotation(ctx, intersected, colorsMap)

        // Draw track.
        if (trackPosition !== null) {
          const trackP = trackPosition === 1 ? canvas.width - TRACK_WIDTH : canvas.width * trackPosition
          ctx.fillStyle = cssVarValue('$themeDark')
          ctx.fillRect(trackP - (TRACK_WIDTH / 2), 0, TRACK_WIDTH, WAVEFORM_HEIGHT)
        }
      }, [activeTag, annotations, colorsMap, trackPosition, setZoom]),
      onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.buttons !== 1) return // Accept left-click only.
        const canvas = canvasRef.current
        if (!canvas) return
        const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())

        const intersected = getIntersectedAnnotation(annotations, cursor_x, cursor_y)
        const resized = getIntersectingEdge(cursor_x, intersected)
        const action = (intersected?.isFocused || intersected?.isZoom) ? (resized && 'resize') || 'move' : undefined
        currDrawnAnnotation.current = { from: cursor_x, to: cursor_x, action, intersected, resized }
      },
      onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!ctx || !canvas) return

        const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())

        const intersected = getIntersectedAnnotation(annotations, cursor_x, cursor_y) || currDrawnAnnotation.current?.intersected
        const canvasWidth = canvasRef.current.width

        setTooltipProps(!intersected || intersected.isZoom ? null : {
          title: colorsMap.get(intersected.tag)?.label || '',
          range: `${formatTime(intersected.start)} - ${formatTime(intersected.end)}`,
          top: getTooltipTopOffset(cursor_y),
          left: getTooltipLeftOffset(cursor_x, canvasWidth)
        })

        canvas.style.cursor = (intersected?.isFocused || intersected?.isZoom)
          ? getIntersectingEdge(cursor_x, intersected) ? 'ew-resize' : 'move'
          : 'pointer'

        if (!currDrawnAnnotation.current || e.buttons !== 1) return
        if (!currDrawnAnnotation.current?.action) {
          currDrawnAnnotation.current.action = 'new'
          currDrawnAnnotation.current.newAnnotationStart = currDrawnAnnotation.current.from
        }

        let tooltipFrom = 0
        let tooltipTo = 0
        const { action, intersected: currIntersected } = currDrawnAnnotation.current
        if (action === 'new' && currDrawnAnnotation.current.newAnnotationStart) {
          const newAnnotationStart = currDrawnAnnotation.current.newAnnotationStart
          const from = Math.min(cursor_x, newAnnotationStart)
          const to = Math.max(cursor_x, newAnnotationStart)
          tooltipFrom = from
          tooltipTo = to
          currDrawnAnnotation.current = { from, to, action: 'new', newAnnotationStart }
          canvas.style.cursor = 'ew-resize'
        }
        else if (action === 'move' && currIntersected) {
          const movedOffset = cursor_x - currDrawnAnnotation.current.from
          const newCanvasStart = currIntersected.canvasStart + movedOffset
          const newCanvasEnd = currIntersected.canvasEnd + movedOffset
          if (newCanvasStart >= 0 && newCanvasEnd <= canvasWidth) {
            currIntersected.canvasStart = newCanvasStart
            currIntersected.canvasEnd = newCanvasEnd
            currIntersected.start = canvasUnitsToSeconds(newCanvasStart, canvasWidth, duration)
            currIntersected.end = canvasUnitsToSeconds(newCanvasEnd, canvasWidth, duration)
          }
          tooltipFrom = currIntersected.canvasStart
          tooltipTo = currIntersected.canvasEnd
          currDrawnAnnotation.current.from += movedOffset
          canvas.style.cursor = 'move'
          if (currIntersected.isZoom && setZoom) setZoom({ from: currIntersected.canvasStart, to: currIntersected.canvasEnd })
        }
        else if (action === 'resize' && currIntersected) {
          const { resized } = currDrawnAnnotation.current
          const canvasWidth = canvasRef.current.width
          if (resized === 'from') {
            currIntersected.canvasStart = Math.max(cursor_x, 0)
            currIntersected.start = canvasUnitsToSeconds(currIntersected.canvasStart, canvasWidth, duration)
          }
          else if (resized === 'to') {
            currIntersected.canvasEnd = Math.min(cursor_x, canvasWidth)
            currIntersected.end = canvasUnitsToSeconds(currIntersected.canvasEnd, canvasWidth, duration)
          }

          const min = Math.min(currIntersected.canvasStart, currIntersected.canvasEnd, cursor_x)
          const max = Math.max(currIntersected.canvasStart, currIntersected.canvasEnd, cursor_x)
          currDrawnAnnotation.current.resized = getResized(cursor_x, min, max) || currDrawnAnnotation.current.resized

          tooltipFrom = min
          tooltipTo = max
          canvas.style.cursor = 'ew-resize'
          if (currIntersected.isZoom && setZoom) setZoom({ from: currIntersected.canvasStart, to: currIntersected.canvasEnd })
        }

        redrawAnnotations()
        setTooltipProps(currIntersected?.isZoom ? null : {
          title: colorsMap.get(activeTag)!.label,
          range: `${formatTime(tooltipFrom / canvas.width * duration)} - ${formatTime(tooltipTo / canvas.width * duration)}`,
          top: getTooltipTopOffset(cursor_y),
          left: getTooltipLeftOffset(cursor_x, canvasWidth)
        })
      },
      onMouseLeave = () => {
        currDrawnAnnotation.current = undefined
        redrawAnnotations()
        setTooltipProps(null)
      },
      onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const ctx = ctxRef.current
        if (!canvas || !ctx) return

        const action = currDrawnAnnotation.current?.action
        const { cursor_x, cursor_y } = eventToCursor(e, canvas.getBoundingClientRect())
        const intersected = getIntersectedAnnotation(annotations, cursor_x, cursor_y)

        if ((!action || action === 'new') && !intersected) focusAnnotation(undefined)

        canvas.style.cursor = intersected
          ? getIntersectingEdge(cursor_x, intersected) ? 'ew-resize' : 'move'
          : 'pointer'

        if (!currDrawnAnnotation.current || !action) {
          if (intersected && intersected.tag !== activeTag) setActiveTag(intersected.tag)
          if (intersected) focusAnnotation(intersected)
          return
        }

        if (action === 'new') {
          const { from, to } = currDrawnAnnotation.current
          const annotationWidth = Math.abs(from - to)
          if (annotationWidth < MIN_ANNOTATION_WIDTH) return
          addNewAnnotation(createAnnotation(from, to, activeTag, canvasRef.current.width, duration), !setZoom)
        }
        else if (action === 'resize') {
          const resized = currDrawnAnnotation.current.intersected
          if (resized) {
            const { canvasStart, canvasEnd } = resized
            resized.canvasStart = Math.min(canvasStart, canvasEnd)
            resized.canvasEnd = Math.max(canvasStart, canvasEnd)
            resized.start = canvasUnitsToSeconds(resized.canvasStart, canvasRef.current.width, duration)
            resized.end = canvasUnitsToSeconds(resized.canvasEnd, canvasRef.current.width, duration)
          }
        }

        if (action === 'move' || action === 'resize') {
          moveOrResizeAnnotation(setZoom ? undefined : currDrawnAnnotation.current.intersected)
        }

        currDrawnAnnotation.current = undefined
      },
      init = React.useCallback((): U | undefined => {
        // Set correct canvas coordinate system from default 300:150 since we resize canvas using CSS.
        if (canvasRef.current) {
          canvasRef.current.width = canvasRef.current.getBoundingClientRect().width
          ctxRef.current = canvasRef.current.getContext('2d')
          isDefaultCanvasWidthFixed.current = true
          redrawAnnotations()
        }
        // If canvas is not ready or didn't resize yet, try again later.
        if (!canvasRef.current || !isDefaultCanvasWidthFixed.current) return setTimeout(init, 300) as unknown as U
      }, [redrawAnnotations])

    React.useEffect(() => {
      window.addEventListener('resize', init)
      return () => window.removeEventListener('resize', init)
    }, [init])

    React.useEffect(() => redrawAnnotations(), [annotations, redrawAnnotations])

    React.useEffect(() => {
      const timeout = init()
      return () => window.clearTimeout(timeout)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div>
        <div className={css.annotatorContainer}>
          <div
            data-test={setZoom ? 'wave-range-annotator-tooltip' : undefined}
            className={css.tooltip}
            style={{ display: tooltipProps ? 'block' : 'none', left: tooltipProps?.left, top: tooltipProps?.top }}
          >
            <Fluent.Text variant='mediumPlus' block>{tooltipProps?.title}</Fluent.Text>
            <Fluent.Text variant='small'>{tooltipProps?.range}</Fluent.Text>
          </div>
          {children}
          <canvas
            height={WAVEFORM_HEIGHT}
            className={css.annotatorCanvas}
            ref={canvasRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
          />
        </div>
        <Fluent.Stack horizontal horizontalAlign='space-between' styles={{ root: { marginTop: 8 } }}>
          <TimeComponent secs={start} />
          <TimeComponent secs={duration} />
        </Fluent.Stack>
      </div>
    )
  }

export const
  recalculateAnnotations = (annotations: DrawnAnnotation[]): DrawnAnnotation[] => {
    const visited = new Set()
    const mergedAnnotations: DrawnAnnotation[] = []
    let zoomAnnotation: DrawnAnnotation | null = null

    for (let i = 0; i < annotations.length; i++) {
      const currAnnotation = annotations[i]
      if (currAnnotation.isZoom) {
        zoomAnnotation = currAnnotation
        continue
      }
      if (visited.has(currAnnotation)) continue
      mergedAnnotations.push(currAnnotation)

      for (let j = i + 1; j < annotations.length; j++) {
        const nextAnnotation = annotations[j]
        if (currAnnotation.tag !== nextAnnotation.tag) continue
        if (!isAnnotationIntersectingAtEnd(currAnnotation, nextAnnotation)) break
        currAnnotation.end = Math.max(currAnnotation.end, nextAnnotation.end)
        currAnnotation.canvasEnd = Math.max(currAnnotation.canvasEnd, nextAnnotation.canvasEnd)
        visited.add(nextAnnotation)
      }
    }

    let currMaxDepth = 1
    for (let i = 0; i < mergedAnnotations.length; i++) {
      const annotation = mergedAnnotations[i]
      const nextIntersections = []
      const prevIntersections = []
      // Perf: Think about when to stop to not iterate over all annotations every time.
      for (let j = i - 1; j >= 0; j--) {
        if (isAnnotationIntersectingAtStart(mergedAnnotations[j], annotation)) prevIntersections.push(mergedAnnotations[j])
      }
      for (let j = i + 1; isAnnotationIntersectingAtEnd(annotation, mergedAnnotations[j]); j++) {
        nextIntersections.push(mergedAnnotations[j])
      }

      const intersections = [...prevIntersections, ...nextIntersections]
      const maxDepth = getMaxDepth(mergedAnnotations, i, annotation, 1)
      const shouldFillRemainingSpace = !nextIntersections.length || maxDepth < currMaxDepth
      currMaxDepth = intersections.length ? Math.max(currMaxDepth, maxDepth) : 1

      const { canvasY, canvasHeight } = getCanvasDimensions(intersections, annotation, shouldFillRemainingSpace ? 0 : maxDepth)
      annotation.canvasY = canvasY
      annotation.canvasHeight = canvasHeight
    }

    return zoomAnnotation ? [zoomAnnotation, ...mergedAnnotations] : mergedAnnotations
  },
  formatTime = (secs: F) => {
    const hours = Math.floor(secs / 3600)
    const minutes = Math.floor(secs / 60) % 60
    const seconds = (secs % 60).toFixed(2)

    return [hours, minutes, seconds]
      .map(v => +v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  },
  TimeComponent = ({ secs, isBig = false }: { secs: F, isBig?: B }) => {
    const hours = Math.floor(secs / 3600)
    const minutes = Math.floor(secs / 60) % 60
    const [seconds, miliseconds] = (secs % 60).toFixed(2).split('.').map(v => +v)
    const [h, m, s, ms] = [hours, minutes, seconds, miliseconds].map(v => v < 10 ? '0' + v : String(v))
    return (
      <div className={clas(css.timeComponent, isBig ? css.timeComponentBig : '')}>
        {h !== '00' && <>
          <span>{h}</span>
          <span className='wave-time-delimiter'>:</span>
        </>}
        <span>{m}</span>
        <span className='wave-time-delimiter'>:</span>
        <span>{s}</span>
        <span className='wave-time-delimiter'>.</span>
        <span>{ms}</span>
      </div>
    )
  },
  RangeAnnotator = <T,>(props: RangeAnnotatorProps<T>) => {
    const
      { onAnnotate, activeTag, tags, trackPosition, items, duration, setActiveTag,
        onRenderToolbar, onRenderBackground, backgroundData } = props,
      [removeAllDisabled, setRemoveAllDisabled] = React.useState(!items?.length),
      [removeDisabled, setRemoveDisabled] = React.useState(true),
      [annotations, setAnnotations] = React.useState<DrawnAnnotation[]>(itemsToAnnotations(items)),
      [zoom, setZoom] = React.useState({ from: 0, to: 100 }),
      annotatorContainerRef = React.useRef<HTMLDivElement>(null),
      canvasWidth = annotatorContainerRef.current?.getBoundingClientRect().width || 0,
      theme = Fluent.useTheme(),
      colorsMap = React.useMemo(() => new Map<S, TagColor>(tags.map(tag => {
        const color = Fluent.getColorFromString(cssVarValue(tag.color))
        return [tag.name, {
          transparent: color ? `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)` : cssVarValue(tag.color),
          color: cssVarValue(tag.color),
          label: tag.label
        }]
        // eslint-disable-next-line react-hooks/exhaustive-deps
      })), [tags, theme]),
      recalcAnnotations = React.useCallback((submit = false) => {
        setAnnotations(annotations => {
          const mergedAnnotations = recalculateAnnotations(annotations)
          if (submit) onAnnotate(mergedAnnotations[0]?.isZoom ? mergedAnnotations.slice(1) : mergedAnnotations)
          return mergedAnnotations
        })
      }, [onAnnotate]),
      focusAnnotation = React.useCallback((annotation?: DrawnAnnotation) => {
        setAnnotations(annotations => annotations.map(a => { a.isFocused = a.start === annotation?.start && a.end === annotation.end; return a }))
        setRemoveDisabled(!annotation)
      }, []),
      addNewAnnotation = React.useCallback((annotation: DrawnAnnotation, unzoom = false) => {
        setAnnotations(prev => {
          if (unzoom) {
            const startOffset = zoom.from
            annotation.canvasStart = startOffset + (annotation.canvasStart / canvasWidth * (zoom.to - zoom.from))
            annotation.canvasEnd = startOffset + (annotation.canvasEnd / canvasWidth * (zoom.to - zoom.from))
          }
          // TODO: Prev array is already sorted so adding a new element can be made O(N) instead of O(NlogN).
          return [...prev, annotation].sort((a, b) => a.canvasStart - b.canvasStart)
        })
        recalcAnnotations(true)
        setRemoveAllDisabled(false)
      }, [canvasWidth, recalcAnnotations, zoom.from, zoom.to]),
      moveOrResizeAnnotation = React.useCallback((annotation?: DrawnAnnotation) => {
        if (annotation) {
          const startOffset = zoom.from
          annotation.canvasStart = startOffset + (annotation.canvasStart / canvasWidth * (zoom.to - zoom.from))
          annotation.canvasEnd = startOffset + (annotation.canvasEnd / canvasWidth * (zoom.to - zoom.from))
          setAnnotations(annotations => {
            annotations[annotations.findIndex(a => a.id === annotation.id)] = annotation
            return annotations
          })
        }
        // TODO: Prev array is already sorted so adding a new element can be made O(N) instead of O(NlogN).
        setAnnotations(prev => prev.sort((a, b) => a.canvasStart - b.canvasStart))
        recalcAnnotations(true)
      }, [canvasWidth, recalcAnnotations, zoom.from, zoom.to]),
      reset = () => {
        setAnnotations(annotations => annotations.filter(a => a.isZoom))
        onAnnotate([])
        setRemoveDisabled(true)
        setRemoveAllDisabled(true)
      },
      removeAnnotation = () => {
        setAnnotations(annotations => {
          const newAnnotations = annotations.filter(a => !a.isFocused)
          setRemoveAllDisabled(newAnnotations.length === 0)
          return newAnnotations
        })
        setRemoveDisabled(true)
        recalcAnnotations(true)
      },
      getZoomedTrackPosition = () => {
        const trackPosPx = trackPosition * canvasWidth
        const withinBounds = trackPosPx >= zoom.from && trackPosPx <= zoom.to
        return withinBounds ? (trackPosPx - zoom.from) / (zoom.to - zoom.from) : null
      }

    React.useEffect(() => {
      setAnnotations(annotations => annotations.map(a => {
        if (a.isFocused) {
          const tagChanged = a.tag !== activeTag
          a.tag = activeTag
          if (tagChanged) onAnnotate(annotations)
        }
        return a
      }))
    }, [activeTag, onAnnotate])

    React.useEffect(() => {
      if (needsZoom(duration)) {
        const zoomAnnotation: DrawnAnnotation = {
          id: xid(),
          canvasStart: 0,
          canvasY: ZOOM_STROKE_WIDTH - 1,
          canvasEnd: 100,
          canvasHeight: WAVEFORM_HEIGHT - (2 * (ZOOM_STROKE_WIDTH - 1)),
          start: -1,
          end: -1,
          tag: '',
          isZoom: true
        }
        setAnnotations(annotations => [zoomAnnotation, ...annotations])
      }
    }, [duration])

    return (
      <>
        <Fluent.Stack horizontal horizontalAlign='space-between' verticalAlign='center'>
          <Fluent.CommandBar styles={{ root: { padding: 0, minWidth: 280 } }} items={[
            {
              key: 'remove-all',
              text: 'Remove all',
              onClick: reset,
              disabled: removeAllDisabled,
              iconProps: { iconName: 'DependencyRemove', styles: { root: { fontSize: 20 } } },
            },
            {
              key: 'remove',
              text: 'Remove selected',
              onClick: removeAnnotation,
              disabled: removeDisabled,
              iconProps: { iconName: 'Delete', styles: { root: { fontSize: 20 } } },
            },
          ]}
          />
          {onRenderToolbar && onRenderToolbar()}
        </Fluent.Stack>
        <Annotator
          annotations={annotations}
          activeTag={activeTag}
          trackPosition={trackPosition}
          duration={duration}
          setActiveTag={setActiveTag}
          addNewAnnotation={addNewAnnotation}
          moveOrResizeAnnotation={moveOrResizeAnnotation}
          focusAnnotation={focusAnnotation}
          colorsMap={colorsMap}
          setZoom={setZoom}
        >{onRenderBackground(backgroundData)}</Annotator>
        {needsZoom(duration) && (
          <div ref={annotatorContainerRef}>
            {annotatorContainerRef.current && (
              <Annotator
                annotations={getAnnotationsWithinRange(annotations, zoom, canvasWidth)}
                activeTag={activeTag}
                trackPosition={getZoomedTrackPosition()}
                start={zoom.from / canvasWidth * duration}
                duration={zoom.to / canvasWidth * duration}
                setActiveTag={setActiveTag}
                addNewAnnotation={addNewAnnotation}
                moveOrResizeAnnotation={moveOrResizeAnnotation}
                focusAnnotation={focusAnnotation}
                colorsMap={colorsMap}
              >{onRenderBackground(backgroundData.slice(
                Math.ceil(zoom.from / canvasWidth * backgroundData.length),
                Math.floor(zoom.to / canvasWidth * backgroundData.length)
              ))}</Annotator>
            )}
          </div>
        )}
      </>
    )
  }
