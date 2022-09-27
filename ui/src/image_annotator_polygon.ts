import { F, S, U } from "h2o-wave"
import { DrawnShape, ImageAnnotatorPoint } from "./image_annotator"
import { ARC_RADIUS } from "./image_annotator_rect"

export class PolygonAnnotator {
  private ctx: CanvasRenderingContext2D | null
  private currPolygonPoints: ImageAnnotatorPoint[] = []

  constructor(private canvas: HTMLCanvasElement) { this.ctx = canvas.getContext('2d') }

  onClick(cursor_x: U, cursor_y: U, color: S, tag: S): DrawnShape | undefined {
    if (this.isIntersectingFirstPoint(cursor_x, cursor_y)) {
      const { x, y } = this.currPolygonPoints.at(-1)!
      const firstPoint = this.currPolygonPoints[0]
      this.drawLine(x, y, firstPoint.x, firstPoint.y)
      // TODO: Reset points for next polygon.
      const newPolygon = { shape: { polygon: { items: [...this.currPolygonPoints] } }, tag }
      this.currPolygonPoints = []
      return newPolygon
    }
    if (this.currPolygonPoints.length) {
      const { x, y } = this.currPolygonPoints.at(-1)!
      this.drawLine(x, y, cursor_x, cursor_y)
    }
    this.drawCircle(cursor_x, cursor_y, color)
    this.currPolygonPoints.push({ x: cursor_x, y: cursor_y })
  }

  drawLine = (x1: F, y1: F, x2: F, y2: F) => {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  drawPolygon = (points: ImageAnnotatorPoint[], color: S, joinLastPoint = true) => {
    if (!points.length) return

    let prevPoint: ImageAnnotatorPoint | null = null
    points.forEach(({ x, y }) => {
      this.drawCircle(x, y, color)
      if (prevPoint) this.drawLine(prevPoint.x, prevPoint.y, x, y)
      prevPoint = { x, y }
    })
    if (joinLastPoint) this.drawLine(points.at(-1)!.x, points.at(-1)!.y, points[0].x, points[0].y)
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

  drawCircle = (x: F, y: F, fillColor: S) => {
    if (!this.ctx) return

    this.ctx.beginPath()
    this.ctx.fillStyle = fillColor
    const path = new Path2D()
    path.arc(x, y, ARC_RADIUS, 0, 2 * Math.PI)
    this.ctx.fill(path)
    this.ctx.closePath()
  }


  isIntersectingFirstPoint = (cursor_x: F, cursor_y: F) => {
    if (!this.currPolygonPoints.length) return false
    const { x, y } = this.currPolygonPoints[0]
    const offset = 2 * ARC_RADIUS
    return cursor_x >= x - offset && cursor_x <= x + offset && cursor_y >= y - offset && cursor_y < y + offset
  }
}