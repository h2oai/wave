import { F, S, U } from "h2o-wave"
import { DrawnShape, ImageAnnotatorPoint } from "./image_annotator"
import { ARC_RADIUS } from "./image_annotator_rect"

export class PolygonAnnotator {
  private ctx: CanvasRenderingContext2D | null
  private currPolygonPoints: ImageAnnotatorPoint[] = []

  constructor(private canvas: HTMLCanvasElement) { this.ctx = canvas.getContext('2d') }

  onClick(cursor_x: U, cursor_y: U, color: S, tag: S): DrawnShape | undefined {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.fillStyle = color

    if (this.isIntersectingFirstPoint(cursor_x, cursor_y)) {
      const { x, y } = this.currPolygonPoints[0]
      this.drawLine(x, y)
      const newPolygon = { shape: { polygon: { items: [...this.currPolygonPoints] } }, tag }
      this.currPolygonPoints = []
      return newPolygon
    }
    if (this.currPolygonPoints.length) {
      this.drawLine(cursor_x, cursor_y)
    }
    this.drawCircle(cursor_x, cursor_y)
    this.currPolygonPoints.push({ x: cursor_x, y: cursor_y })
  }

  drawLine = (x2: F, y2: F) => {
    if (!this.ctx) return

    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  drawPolygon = (points: ImageAnnotatorPoint[], color: S, joinLastPoint = true, isFocused = false) => {
    if (!points.length || !this.ctx) return

    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)

    points.forEach(({ x, y }) => {
      if (isFocused) this.drawCircle(x, y)
      this.drawLine(x, y)
    })

    if (joinLastPoint) this.drawLine(points[0].x, points[0].y)
    if (isFocused) {
      this.ctx.fillStyle = color.substring(0, color.length - 2) + '0.2)'
      this.ctx.fill()
    }
  }

  drawPreviewLine = (cursor_x: F, cursor_y: F, color: S) => {
    if (!this.ctx || !this.currPolygonPoints.length) return

    this.drawPolygon(this.currPolygonPoints, color, false)
    const { x, y } = this.currPolygonPoints.at(-1)!

    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(cursor_x, cursor_y)
    this.ctx.stroke()
  }

  drawCircle = (x: F, y: F) => {
    if (!this.ctx) return

    const path = new Path2D()
    path.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI)
    this.ctx.fill(path)
  }


  isIntersectingFirstPoint = (cursor_x: F, cursor_y: F) => {
    if (!this.currPolygonPoints.length) return false
    const { x, y } = this.currPolygonPoints[0]
    const offset = 2 * ARC_RADIUS
    return cursor_x >= x - offset && cursor_x <= x + offset && cursor_y >= y - offset && cursor_y < y + offset
  }
}

// Credit: https://gist.github.com/vlasky/d0d1d97af30af3191fc214beaf379acc?permalink_comment_id=3658988#gistcomment-3658988
const cross = (x: ImageAnnotatorPoint, y: ImageAnnotatorPoint, z: ImageAnnotatorPoint) => (y.x - x.x) * (z.y - x.y) - (z.x - x.x) * (y.y - x.y)
export const isIntersectingPolygon = (p: ImageAnnotatorPoint, points: ImageAnnotatorPoint[]) => {
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
}