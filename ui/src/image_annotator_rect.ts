import { F, S, U } from 'h2o-wave'
import { DrawnShape, ImageAnnotatorRect, Position } from './image_annotator'

const
  MIN_RECT_WIDTH = 5,
  MIN_RECT_HEIGHT = 5
export const ARC_RADIUS = 4

export class RectAnnotator {
  private resizedCorner?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  private movedRect?: DrawnShape
  private ctx: CanvasRenderingContext2D | null

  constructor(private canvas: HTMLCanvasElement) { this.ctx = canvas.getContext('2d') }

  drawCircle = (x: U, y: U, fillColor: S) => {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.ctx.fillStyle = fillColor
    const path = new Path2D()
    path.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI)
    this.ctx.fill(path)
    this.ctx.closePath()
  }

  drawRect = ({ x1, x2, y1, y2 }: ImageAnnotatorRect, strokeColor: S, isFocused = false) => {
    if (!this.ctx) return
    this.ctx.beginPath()
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = strokeColor
    this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    this.ctx.closePath()
    if (isFocused) {
      this.ctx.beginPath()
      this.ctx.fillStyle = strokeColor.substring(0, strokeColor.length - 2) + '0.2)'
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
      this.ctx.closePath()
      this.drawCircle(x1, y1, strokeColor)
      this.drawCircle(x2, y1, strokeColor)
      this.drawCircle(x2, y2, strokeColor)
      this.drawCircle(x1, y2, strokeColor)
    }
  }

  createRect = (x1: F, x2: F, y1: F, y2: F) => {
    const { width, height } = this.canvas
    return Math.abs(x2 - x1) <= MIN_RECT_WIDTH || Math.abs(y2 - y1) <= MIN_RECT_HEIGHT ? undefined : {
      x1: x1 > width ? width : x1 < 0 ? 0 : x1,
      x2: x2 > width ? width : x2 < 0 ? 0 : x2,
      y1: y1 > height ? height : y1 < 0 ? 0 : y1,
      y2: y2 > height ? height : y2 < 0 ? 0 : y2,
    }
  }

  onClick = (e: React.MouseEvent, cursor_x: U, cursor_y: U, setDrawnShapes: (value: React.SetStateAction<DrawnShape[]>) => void, tag: S, start?: Position) => {
    if (start && !this.resizedCorner) {
      const rect = this.createRect(start.x, cursor_x, start.y, cursor_y)
      if (rect) setDrawnShapes(drawnShapes => [{ shape: { rect }, tag }, ...drawnShapes])
    }

    if (!this.resizedCorner && !start?.dragging && e.type !== 'mouseleave') {
      setDrawnShapes(drawnShapes => drawnShapes.map(s => {
        s.isFocused = isIntersectingRect(cursor_x, cursor_y, s.shape.rect)
        return s
      }))
    }

    this.resizedCorner = undefined
    this.movedRect = undefined
  }

  onMouseDown(cursor_x: U, cursor_y: U, rect: ImageAnnotatorRect) {
    this.resizedCorner = getCorner(cursor_x, cursor_y, rect, true)
  }

  onMouseMove(cursor_x: U, cursor_y: U, focused?: DrawnShape, intersected?: DrawnShape, clickStartPosition?: Position) {
    if (!clickStartPosition) return

    const
      x1 = clickStartPosition.x,
      y1 = clickStartPosition.y

    if (focused?.shape.rect && this.resizedCorner) {
      if (this.resizedCorner === 'topLeft') {
        focused.shape.rect.x1 += cursor_x - x1
        focused.shape.rect.y1 += cursor_y - y1
      }
      else if (this.resizedCorner === 'topRight') {
        focused.shape.rect.x1 += cursor_x - x1
        focused.shape.rect.y2 += cursor_y - y1
      }
      else if (this.resizedCorner === 'bottomLeft') {
        focused.shape.rect.x2 += cursor_x - x1
        focused.shape.rect.y1 += cursor_y - y1
      }
      else if (this.resizedCorner === 'bottomRight') {
        focused.shape.rect.x2 += cursor_x - x1
        focused.shape.rect.y2 += cursor_y - y1
      }

      clickStartPosition.x = cursor_x
      clickStartPosition.y = cursor_y
    }
    else if (this.movedRect || intersected?.isFocused) {
      this.movedRect = this.movedRect || intersected
      this.canvas.style.cursor = 'move'
      if (!this.movedRect?.shape.rect) return

      const
        rect = this.movedRect.shape.rect,
        xIncrement = cursor_x - x1,
        yIncrement = cursor_y - y1,
        newX1 = rect.x1 + xIncrement,
        newX2 = rect.x2 + xIncrement,
        newY1 = rect.y1 + yIncrement,
        newY2 = rect.y2 + yIncrement,
        { width, height } = this.canvas

      // Prevent moving behind image boundaries.
      // FIXME: Hitting boundary repeatedly causes rect to increase in size.
      if (newX1 < rect.x1 && newX1 < 0) rect.x1 = Math.max(0, newX1)
      else if (newX2 < rect.x2 && newX2 < 0) rect.x2 = Math.max(0, newX2)
      else if (newY1 < rect.y1 && newY1 < 0) rect.y1 = Math.max(0, newY1)
      else if (newY2 < rect.y2 && newY2 < 0) rect.y2 = Math.max(0, newY2)
      else if (newX1 > rect.x1 && newX1 > width) rect.x1 = Math.min(newX1, width)
      else if (newX2 > rect.x2 && newX2 > width) rect.x2 = Math.min(newX2, width)
      else if (newY1 > rect.y1 && newY1 > height) rect.y1 = Math.min(newY1, height)
      else if (newY2 > rect.y2 && newY2 > height) rect.y2 = Math.min(newY2, height)
      else {
        rect.x1 = newX1
        rect.x2 = newX2
        rect.y1 = newY1
        rect.y2 = newY2
      }

      clickStartPosition.x = cursor_x
      clickStartPosition.y = cursor_y
    }
    else {
      return { rect: this.createRect(x1, cursor_x, y1, cursor_y) }
    }
  }
}

export const
  isIntersectingRect = (cursor_x: U, cursor_y: U, rect?: ImageAnnotatorRect, isFocused = false) => {
    if (!rect) return false
    if (isFocused && getCorner(cursor_x, cursor_y, rect)) return true
    const
      { x2, x1, y2, y1 } = rect,
      x_min = Math.min(x1, x2),
      x_max = Math.max(x1, x2),
      y_min = Math.min(y1, y2),
      y_max = Math.max(y1, y2)

    return cursor_x > x_min && cursor_x < x_max && cursor_y > y_min && cursor_y < y_max
  },
  getCorner = (x: U, y: U, { x1, y1, x2, y2 }: ImageAnnotatorRect, ignoreMaxMin = false) => {
    const
      x_min = ignoreMaxMin ? x1 : Math.min(x1, x2),
      x_max = ignoreMaxMin ? x2 : Math.max(x1, x2),
      y_min = ignoreMaxMin ? y1 : Math.min(y1, y2),
      y_max = ignoreMaxMin ? y2 : Math.max(y1, y2)
    if (x > x_min - ARC_RADIUS && x < x_min + ARC_RADIUS && y > y_min - ARC_RADIUS && y < y_min + ARC_RADIUS) return 'topLeft'
    else if (x > x_min - ARC_RADIUS && x < x_min + ARC_RADIUS && y > y_max - ARC_RADIUS && y < y_max + ARC_RADIUS) return 'topRight'
    else if (x > x_max - ARC_RADIUS && x < x_max + ARC_RADIUS && y > y_min - ARC_RADIUS && y < y_min + ARC_RADIUS) return 'bottomLeft'
    else if (x > x_max - ARC_RADIUS && x < x_max + ARC_RADIUS && y > y_max - ARC_RADIUS && y < y_max + ARC_RADIUS) return 'bottomRight'
  },
  getRectCornerCursor = (shape: ImageAnnotatorRect, cursor_x: U, cursor_y: U) => {
    const corner = getCorner(cursor_x, cursor_y, shape)
    if (corner === 'topLeft' || corner === 'bottomRight') return 'nwse-resize'
    if (corner === 'bottomLeft' || corner === 'topRight') return 'nesw-resize'
  }