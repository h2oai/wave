import { F, S, U } from './core'
import { DrawnPoint, DrawnShape, ImageAnnotatorPoint, ImageAnnotatorRect } from "./image_annotator"
import { ARC_RADIUS } from "./image_annotator_rect"

export class PolygonAnnotator {
  private currPolygonPoints: ImageAnnotatorPoint[] = []
  private boundaryRect: ImageAnnotatorRect | null = null
  private draggedPoint: DrawnPoint | null = null
  private draggedShape: DrawnShape | null = null


  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D | null) { }

  resetDragging() {
    // Update the boundaries of the polygon when point dragging ends.
    const draggedPolygon = this.draggedShape?.shape.polygon
    if (this.draggedShape && this.draggedPoint && draggedPolygon) {
      const { x1, x2, y1, y2 } = getPolygonBoundaries(draggedPolygon.vertices)
      this.draggedShape.boundaryRect!.x1 = x1
      this.draggedShape.boundaryRect!.x2 = x2
      this.draggedShape.boundaryRect!.y1 = y1
      this.draggedShape.boundaryRect!.y2 = y2
    }

    this.draggedPoint = null
    this.draggedShape = null
  }

  cancelAnnotating() {
    this.currPolygonPoints = []
    this.boundaryRect = null
  }

  addCurrPolygonPoint({ x, y }: { x: U, y: U }) {
    this.currPolygonPoints.push({ x, y })
    // Updates the boundaryRect of the polygon.
    if (this.boundaryRect) {
      if (x < this.boundaryRect.x1) this.boundaryRect.x1 = x
      if (x > this.boundaryRect.x2) this.boundaryRect.x2 = x
      if (y < this.boundaryRect.y1) this.boundaryRect.y1 = y
      if (y > this.boundaryRect.y2) this.boundaryRect.y2 = y
    } else this.boundaryRect = { x1: x, x2: x, y1: y, y2: y }
  }

  removeLastPoint() {
    this.currPolygonPoints.pop()
    this.boundaryRect = this.currPolygonPoints.length ? getPolygonBoundaries(this.currPolygonPoints) : null
  }

  finishPolygon(tag: S) {
    if (this.currPolygonPoints.length < 3) return
    const
      { x, y } = this.currPolygonPoints[0],
      newPolygon = {
        shape: { polygon: { vertices: [...this.currPolygonPoints] } },
        boundaryRect: this.boundaryRect,
        tag
      }
    this.drawLine(x, y)
    this.currPolygonPoints = []
    this.boundaryRect = null
    return newPolygon
  }

  onClick(cursor_x: U, cursor_y: U, color: S, tag: S): DrawnShape | undefined {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    if (this.isIntersectingFirstPoint(cursor_x, cursor_y)) return this.finishPolygon(tag)
    if (this.currPolygonPoints.length) this.drawLine(cursor_x, cursor_y)

    this.addCurrPolygonPoint({ x: cursor_x, y: cursor_y })
  }

  move(dx: U, dy: U, movedShape?: DrawnShape) {
    const
      boundaryRect = movedShape?.boundaryRect,
      movedPolygon = movedShape?.shape.polygon
    if (!movedPolygon || !boundaryRect) return

    const
      { width, height } = this.canvas,
      { x1, x2, y1, y2 } = boundaryRect,
      moveX = x1 + dx < 0 ? -x1 : x2 + dx > width ? width - x2 : dx,
      moveY = y1 + dy < 0 ? -y1 : y2 + dy > height ? height - y2 : dy

    if (moveX) {
      boundaryRect.x1 = x1 + moveX
      boundaryRect.x2 = x2 + moveX
    }
    if (moveY) {
      boundaryRect.y1 = y1 + moveY
      boundaryRect.y2 = y2 + moveY
    }

    if (moveX || moveY) movedPolygon.vertices.forEach(p => {
      p.x += moveX
      p.y += moveY
    })
  }

  onMouseDown(cursor_x: U, cursor_y: U, shape: DrawnShape) {
    if (!shape.shape.polygon) return
    this.draggedPoint = shape.shape.polygon.vertices.find(p => isIntersectingPoint(p, cursor_x, cursor_y)) || null
    this.draggedShape = shape
  }

  isMovedOrResized = () => !!this.draggedPoint || !!this.draggedShape

  getDraggedPoint = () => this.draggedPoint

  getPointCursor = () => {
    return this.draggedPoint?.isAux
      ? 'pointer'
      : this.draggedPoint
        ? 'move'
        : ''
  }

  moveDraggedPoint(cursor_x: U, cursor_y: U) {
    if (!this.draggedPoint) return

    this.draggedPoint.x += cursor_x - this.draggedPoint.x
    this.draggedPoint.y += cursor_y - this.draggedPoint.y
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
      const b = points[(idx + 1) % points.length]
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
    // TODO: Divide ARC_RADIUS by "scale" to make the offset lower when the image is zoomed in.
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
  },
  // TODO: Refactor using min/max heap.
  getPolygonBoundaries = (vertices: ImageAnnotatorPoint[]) => {
    const [firstPoint] = vertices
    return vertices.reduce((acc, { x, y }) => {
      if (x < acc.x1) acc.x1 = x
      if (y < acc.y1) acc.y1 = y
      if (x > acc.x2) acc.x2 = x
      if (y > acc.y2) acc.y2 = y
      return acc
    }, { x1: firstPoint.x, y1: firstPoint.y, x2: firstPoint.x, y2: firstPoint.y })
  }