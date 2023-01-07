import { F, S, U } from "h2o-wave"
import { DrawnPoint, DrawnShape, ImageAnnotatorPoint, Position } from "./image_annotator"
import { ARC_RADIUS } from "./image_annotator_rect"

export class PolygonAnnotator {
  private currPolygonPoints: ImageAnnotatorPoint[] = []
  private draggedPoint: ImageAnnotatorPoint | null = null
  private draggedShape: DrawnShape | null = null
  private ctx: CanvasRenderingContext2D | null

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')
    if (this.ctx) this.ctx.lineWidth = 2
  }

  resetDragging() {
    this.draggedPoint = null
    this.draggedShape = null
  }

  cancelAnnotating() {
    this.currPolygonPoints = []
  }

  finishPolygon(tag: S) {
    const
      { x, y } = this.currPolygonPoints[0],
      newPolygon = { shape: { polygon: { vertices: [...this.currPolygonPoints] } }, tag },
      isPolygon = this.currPolygonPoints.length > 2
    this.drawLine(x, y)
    this.currPolygonPoints = []
    if (isPolygon) return newPolygon
  }

  onClick(cursor_x: U, cursor_y: U, color: S, tag: S): DrawnShape | undefined {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    if (this.isIntersectingFirstPoint(cursor_x, cursor_y)) return this.finishPolygon(tag)
    if (this.currPolygonPoints.length) this.drawLine(cursor_x, cursor_y)

    this.currPolygonPoints.push({ x: cursor_x, y: cursor_y })
  }

  canMove = (focused: DrawnShape, dx: U, dy: U) => {
    if (focused.shape.polygon) {
      const { width, height } = this.canvas
      return focused.shape.polygon.vertices.every(v =>
        v.x + dx >= 0 && v.x + dx <= width &&
        v.y + dy >= 0 && v.y + dy <= height
      )
    }
  }

  onMouseMove(cursor_x: U, cursor_y: U, focused?: DrawnShape, intersected?: DrawnShape, clickStartPosition?: Position) {
    // TODO: Prevent moving shapes outside of canvas when scale > 1.
    if (!clickStartPosition?.dragging || !focused?.shape.polygon) {
      this.draggedPoint = null
      this.draggedShape = null
      return
    }

    const canMovePolygon = this.canMove(focused, cursor_x - clickStartPosition!.x, cursor_y - clickStartPosition!.y)
    const clickedPolygonPoint = focused.shape.polygon.vertices.find(p => isIntersectingPoint(p, cursor_x, cursor_y))
    this.draggedPoint = this.draggedPoint || clickedPolygonPoint || null
    if (this.draggedPoint) {
      this.draggedPoint.x += cursor_x - this.draggedPoint.x
      this.draggedPoint.y += cursor_y - this.draggedPoint.y
    }
    else if ((intersected == focused || this.draggedShape) && canMovePolygon) {
      this.draggedShape = intersected?.shape.polygon && intersected.isFocused ? intersected : this.draggedShape
      this.draggedShape?.shape.polygon?.vertices.forEach(p => {
        p.x += cursor_x - clickStartPosition!.x
        p.y += cursor_y - clickStartPosition!.y
      })
      clickStartPosition.x = cursor_x
      clickStartPosition.y = cursor_y
    }
  }

  tryToAddAuxPoint = (cursor_x: F, cursor_y: F, items: DrawnPoint[]) => {
    const clickedPoint = items.find(p => isIntersectingPoint(p, cursor_x, cursor_y))
    if (clickedPoint?.isAux) {
      clickedPoint.isAux = false
      return true
    }
  }

  tryToRemovePoint = (cursor_x: F, cursor_y: F, items: DrawnPoint[]) => {
    return items.filter(p => !isIntersectingPoint(p, cursor_x, cursor_y))
  }

  getPolygonPointsWithAux = (points: DrawnPoint[]) => {
    const items = points
      .filter(p => !p.isAux)
      .reduce((prev, curr, idx, arr) => {
        prev.push(curr)

        if (idx !== arr.length - 1) {
          prev.push({
            x: (curr.x + arr[idx + 1].x) / 2,
            y: (curr.y + arr[idx + 1].y) / 2,
            isAux: true
          })
        }

        return prev
      }, [] as DrawnPoint[])

    // Insert aux also between last and first point.
    const pointsLength = points.length
    const lastPoint = points[pointsLength - 1]?.isAux ? points[pointsLength - 2] : points[pointsLength - 1]
    if (lastPoint) {
      items.push({
        x: (points[0].x + lastPoint.x) / 2,
        y: (points[0].y + lastPoint.y) / 2,
        isAux: true
      })
    }

    return items
  }

  drawLine = (x2: F, y2: F) => {
    if (!this.ctx) return

    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  drawPolygon = (points: DrawnPoint[], color: S, joinLastPoint = true, isFocused = false) => {
    if (!points.length || !this.ctx) return

    this.ctx.fillStyle = color
    this.ctx.strokeStyle = color
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)

    const _points = this.draggedPoint ? points.filter(p => !p.isAux) : points

    _points.forEach(({ x, y }) => this.drawLine(x, y))
    if (joinLastPoint) this.drawLine(points[0].x, points[0].y)
    if (isFocused) {
      this.ctx.fillStyle = color.substring(0, color.length - 2) + '0.2)'
      this.ctx.fill()
      _points.forEach(({ x, y, isAux }) => this.drawPoint(x, y, isAux))
    }
  }

  drawPreviewLine = (cursor_x: F, cursor_y: F, color: S) => {
    if (!this.ctx || !this.currPolygonPoints.length) return

    this.drawPolygon(this.currPolygonPoints, color, false)
    const { x, y } = this.currPolygonPoints[this.currPolygonPoints.length - 1]

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(cursor_x, cursor_y)
    this.ctx.stroke()
  }

  drawPoint = (x: F, y: F, isAux = false) => {
    if (!this.ctx) return

    const path = new Path2D()
    path.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI)
    this.ctx.strokeStyle = isAux ? '#5e5c5c' : '#000'
    this.ctx.fillStyle = isAux ? '#b8b8b8' : '#FFF'
    this.ctx.fill(path)
    this.ctx.stroke(path)
  }

  removeLastPoint = () => {
    this.currPolygonPoints.pop()
  }

  isIntersectingFirstPoint = (cursor_x: F, cursor_y: F) => {
    if (!this.currPolygonPoints.length) return false
    return isIntersectingPoint(this.currPolygonPoints[0], cursor_x, cursor_y)
  }
}

// Credit: https://gist.github.com/vlasky/d0d1d97af30af3191fc214beaf379acc?permalink_comment_id=3658988#gistcomment-3658988
const cross = (x: ImageAnnotatorPoint, y: ImageAnnotatorPoint, z: ImageAnnotatorPoint) => (y.x - x.x) * (z.y - x.y) - (z.x - x.x) * (y.y - x.y)
export
  const isIntersectingPolygon = (p: ImageAnnotatorPoint, points: ImageAnnotatorPoint[], isFocused = false) => {
    if (isFocused && points.some(point => isIntersectingPoint(point, p.x, p.y))) return true
    let windingNumber = 0

    points.forEach((point, idx) => {
      const { x, y } = points[(idx + 1) % points.length]
      const b = { x: x, y: y }
      if (point.y <= p.y) {
        if (b.y > p.y && cross(point, b, p) > 0) {
          windingNumber += 1
        }
      } else if (b.y <= p.y && cross(point, b, p) < 0) {
        windingNumber -= 1
      }
    })

    return windingNumber !== 0
  },
  isIntersectingPoint = ({ x, y }: ImageAnnotatorPoint, cursor_x: F, cursor_y: F) => {
    // TODO: Make offset lower when the image is zoomed in.
    const offset = 2 * ARC_RADIUS
    return cursor_x >= x - offset && cursor_x <= x + offset && cursor_y >= y - offset && cursor_y < y + offset
  },
  getPolygonPointCursor = (items: DrawnPoint[], cursor_x: F, cursor_y: F) => {
    const intersectedPoint = items.find(p => isIntersectingPoint(p, cursor_x, cursor_y))
    return intersectedPoint?.isAux
      ? 'pointer'
      : intersectedPoint
        ? 'move'
        : ''
  }