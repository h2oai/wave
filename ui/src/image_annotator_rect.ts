import { F, S, U } from 'h2o-wave'
import { DrawnShape, ImageAnnotatorRect, Position } from './image_annotator'

const
  MIN_RECT_WIDTH = 5,
  MIN_RECT_HEIGHT = 5
export const ARC_RADIUS = 4

// Needs some canvas-related refactoring love.
export class RectAnnotator {
  private resizedCorner?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  private movedRect?: DrawnShape

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D | null) { }

  drawCircle = (x: U, y: U) => {
    if (!this.ctx) return
    const path = new Path2D()
    path.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI)
    this.ctx.strokeStyle = '#000'
    this.ctx.fillStyle = '#FFF'
    this.ctx.fill(path)
    this.ctx.stroke(path)
  }

  drawRect = ({ x1, x2, y1, y2 }: ImageAnnotatorRect, strokeColor: S, isFocused = false) => {
    if (!this.ctx) return
    this.ctx.strokeStyle = strokeColor
    this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
    if (isFocused) {
      this.ctx.fillStyle = strokeColor.substring(0, strokeColor.length - 2) + '0.2)'
      this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
      this.drawCircle(x1, y1)
      this.drawCircle(x2, y1)
      this.drawCircle(x2, y2)
      this.drawCircle(x1, y2)
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

  resetDragging = () => {
    this.resizedCorner = undefined
    this.movedRect = undefined
  }

  onClick = (cursor_x: U, cursor_y: U, tag: S, start?: Position): DrawnShape | undefined => {
    let newRect
    if (!this.resizedCorner && start?.dragging) {
      const rect = this.createRect(start.x, cursor_x, start.y, cursor_y)
      if (!rect) return
      newRect = { shape: { rect }, tag }
    }

    this.resetDragging()
    return newRect
  }

  onMouseDown(cursor_x: U, cursor_y: U, shape: DrawnShape) {
    if (!shape.shape.rect) return
    this.movedRect = shape
    this.resizedCorner = getCorner(cursor_x, cursor_y, shape.shape.rect, true)
  }

  isMovedOrResized = () => !!this.movedRect || !!this.resizedCorner
  getResizedCorner = () => this.resizedCorner

  move = (dx: U, dy: U, shape?: DrawnShape) => {
    // Prevent moving behind image boundaries.
    const movedRect = (shape || this.movedRect)?.shape.rect
    if (!movedRect) return

    const
      { width, height } = this.canvas,
      { x1, x2, y1, y2 } = movedRect,
      [xMin, xMax] = x1 < x2 ? [x1, x2] : [x2, x1],
      [yMin, yMax] = y1 < y2 ? [y1, y2] : [y2, y1],
      moveX = xMin + dx < 0 ? -xMin : xMax + dx > width ? width - xMax : dx,
      moveY = yMin + dy < 0 ? -yMin : yMax + dy > height ? height - yMax : dy

    if (moveX) {
      movedRect.x1 += moveX
      movedRect.x2 += moveX
    }
    if (moveY) {
      movedRect.y1 += moveY
      movedRect.y2 += moveY
    }
  }

  onMouseMove(cursor_x: U, cursor_y: U, clickStartPosition?: Position) {
    if (!clickStartPosition) return

    const
      x1 = clickStartPosition.x,
      y1 = clickStartPosition.y

    if (this.movedRect?.shape.rect && this.resizedCorner) {
      if (this.resizedCorner === 'topLeft') {
        this.movedRect.shape.rect.x1 += cursor_x - x1
        this.movedRect.shape.rect.y1 += cursor_y - y1
      }
      else if (this.resizedCorner === 'topRight') {
        this.movedRect.shape.rect.x1 += cursor_x - x1
        this.movedRect.shape.rect.y2 += cursor_y - y1
      }
      else if (this.resizedCorner === 'bottomLeft') {
        this.movedRect.shape.rect.x2 += cursor_x - x1
        this.movedRect.shape.rect.y1 += cursor_y - y1
      }
      else if (this.resizedCorner === 'bottomRight') {
        this.movedRect.shape.rect.x2 += cursor_x - x1
        this.movedRect.shape.rect.y2 += cursor_y - y1
      }

      clickStartPosition.x = cursor_x
      clickStartPosition.y = cursor_y
    }
    else if (this.movedRect) {
      this.move(cursor_x - x1, cursor_y - y1)
      clickStartPosition.x = cursor_x
      clickStartPosition.y = cursor_y
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
  getRectCursorByCorner = (corner?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    if (corner === 'topLeft' || corner === 'bottomRight') return 'nwse-resize'
    if (corner === 'bottomLeft' || corner === 'topRight') return 'nesw-resize'
  },
  getRectCornerCursor = (shape: ImageAnnotatorRect, cursor_x: U, cursor_y: U) => {
    return getRectCursorByCorner(getCorner(cursor_x, cursor_y, shape))
  }