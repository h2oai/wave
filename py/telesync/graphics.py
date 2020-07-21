import json
from typing import List, Union
from .core import data as _data, Data, Ref


# TODO add formal parameters for shape functions, including presentation attributes:
# https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation

def data(**kwargs) -> Union[str, Data]:
    """
    Create a data placeholder for a graphics card.
    The return value must be assigned to the `data` property of a :class:`telesync.types.GraphicsCard`.

    :param kwargs: Graphical elements to initialize this placeholder with.
    :return: A :class:`telesync.core.Data` instance.
    """
    return _data(fields='d o', rows=kwargs)


def draw(element: Ref, **kwargs) -> Ref:
    """
    Schedule a redraw of the specified graphical element using the provided attributes.

    :param element: A reference to a graphical element.
    :param kwargs: Attributes to use while performing a redraw.
    :return: The element reference, without change.
    """
    element['o'] = json.dumps(kwargs)
    return element


def reset(element: Ref) -> Ref:
    """
    Schedule a redraw of the specified graphical element using its original attributes.
    Calling this function clears any changes performed using the :func:`telesync.graphics.draw` function.

    :param element: A reference to a graphical element.
    :return: The element reference, without change.
    """
    element['o'] = ''
    return element


def _el(t: str, d: dict) -> List[str]:
    d['_t'] = t
    return [json.dumps(d), '']


def circle(**kwargs):
    """
    Draw a circle.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('c', kwargs)


def ellipse(**kwargs):
    """
    Draw an ellipse.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('e', kwargs)


def image(**kwargs):
    """
    Draw an image.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('i', kwargs)


def line(**kwargs):
    """
    Draw a line.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('l', kwargs)


def path(**kwargs):
    """
    Draw a path.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('p', kwargs)


def polygon(**kwargs):
    """
    Draw a polygon.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('pg', kwargs)


def polyline(**kwargs):
    """
    Draw a polyline.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('pl', kwargs)


def rect(**kwargs):
    """
    Draw a rectangle.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('r', kwargs)


def text(**kwargs):
    """
    Draw text.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text

    :param kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    :return: Data for the graphical element.
    """
    return _el('t', kwargs)


class Path:
    """
    A convenience class for drawing SVG paths.
    """

    def __init__(self):
        self.__d = []

    def _d(self, command: str, *args) -> 'Path':
        self.__d.append(command)
        for arg in args:
            self.__d.append(str(arg))
        return self

    def d(self) -> str:
        """
        Serialize this path's commands into SVG path data.

        :return: The ``d`` attribute for a SVG path.
        """
        return ' '.join(self.__d)

    def path(self, **kwargs):
        """
        A SVG path element representing the commands in this ``Path`` instance.
        Same as calling ``telesync.graphics.path(d=path.d())``

        :param kwargs: Additional attributes for the SVG path element.
        :return: A SVG path element.
        """
        return path(d=self.d(), **kwargs)

    def M(self, x: float, y: float) -> 'Path':
        """
        Start a new sub-path at the given (x,y) coordinates.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('M', x, y)

    def m(self, x: float, y: float) -> 'Path':
        """
        Start a new sub-path at the given (x,y) coordinates.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('m', x, y)

    def Z(self) -> 'Path':
        """
        Close the current subpath by connecting it back to the current subpath's initial point.

        See https://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand

        :return: The current ``Path`` instance.
        """
        return self._d('Z')

    def z(self) -> 'Path':
        """
        Close the current subpath by connecting it back to the current subpath's initial point.

        See https://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand

        :return: The current ``Path`` instance.
        """
        return self._d('z')

    def L(self, x: float, y: float) -> 'Path':
        """
        Draw a line from the current point to the given (x,y) coordinate which becomes the new current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('L', x, y)

    def l(self, x: float, y: float) -> 'Path':
        """
        Draw a line from the current point to the given (x,y) coordinate which becomes the new current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('l', x, y)

    def H(self, x: float) -> 'Path':
        """
        Draws a horizontal line from the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param x: x-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('H', x)

    def h(self, x: float) -> 'Path':
        """
        Draws a horizontal line from the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param x: x-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('h', x)

    def V(self, y: float) -> 'Path':
        """
        Draws a vertical line from the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('V', y)

    def v(self, y: float) -> 'Path':
        """
        Draws a vertical line from the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('v', y)

    def C(self, x1: float, y1: float, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y) using (x1,y1) as the control point at the beginning
        of the curve and (x2,y2) as the control point at the end of the curve.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        :param x1: x-coordinate of first control point
        :param y1: x-coordinate of first control point
        :param x2: y-coordinate of second control point
        :param y2: y-coordinate of second control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('C', x1, y1, x2, y2, x, y)

    def c(self, x1: float, y1: float, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y) using (x1,y1) as the control point at the beginning
        of the curve and (x2,y2) as the control point at the end of the curve.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        :param x1: x-coordinate of first control point
        :param y1: x-coordinate of first control point
        :param x2: y-coordinate of second control point
        :param y2: y-coordinate of second control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('c', x1, y1, x2, y2, x, y)

    def S(self, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y). The first control point is assumed to be the
        reflection of the second control point on the previous command relative to the current point.
        (x2,y2) is the second control point (i.e., the control point at the end of the curve).
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        :param x2: y-coordinate of second control point
        :param y2: y-coordinate of second control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('S', x2, y2, x, y)

    def s(self, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y). The first control point is assumed to be the
        reflection of the second control point on the previous command relative to the current point.
        (x2,y2) is the second control point (i.e., the control point at the end of the curve).
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        :param x2: y-coordinate of second control point
        :param y2: y-coordinate of second control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('s', x2, y2, x, y)

    def Q(self, x1: float, y1: float, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1) as the control point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        :param x1: x-coordinate of first control point
        :param y1: x-coordinate of first control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('Q', x1, y1, x, y)

    def q(self, x1: float, y1: float, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1) as the control point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        :param x1: x-coordinate of first control point
        :param y1: x-coordinate of first control point
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('q', x1, y1, x, y)

    def T(self, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y). The control point is assumed to be the
        reflection of the control point on the previous command relative to the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('T', x, y)

    def t(self, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y). The control point is assumed to be the
        reflection of the control point on the previous command relative to the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('t', x, y)

    def A(self, rx: float, ry: float, x_axis_rotation: float, large_arc: bool, sweep: bool, x: float,
          y: float) -> 'Path':
        """
        Draws an elliptical arc from the current point to (x, y). The size and orientation of the ellipse are defined
        by two radii (rx, ry) and an ``x_axis_rotation``, which indicates how the ellipse as a whole is rotated,
        in degrees, relative to the current coordinate system. The center (cx, cy) of the ellipse is calculated
        automatically to satisfy the constraints imposed by the other parameters. ``large_arc`` and ``sweep_flag``
        contribute to the automatic calculations and help determine how the arc is drawn.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands

        :param rx: x-radius
        :param ry: y-radius
        :param x_axis_rotation: Rotation in degrees.
        :param large_arc: Determines if the arc should be greater than or less than 180 degrees.
        :param sweep: Determines if the arc should begin moving at positive angles or negative ones.
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('A', rx, ry, x_axis_rotation, 1 if large_arc else 0, 1 if sweep else 0, x, y)

    def a(self, rx: float, ry: float, x_axis_rotation: float, large_arc: bool, sweep: bool, x: float,
          y: float) -> 'Path':
        """
        Draws an elliptical arc from the current point to (x, y). The size and orientation of the ellipse are defined
        by two radii (rx, ry) and an ``x_axis_rotation``, which indicates how the ellipse as a whole is rotated,
        in degrees, relative to the current coordinate system. The center (cx, cy) of the ellipse is calculated
        automatically to satisfy the constraints imposed by the other parameters. ``large_arc`` and ``sweep_flag``
        contribute to the automatic calculations and help determine how the arc is drawn.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands

        :param rx: x-radius
        :param ry: y-radius
        :param x_axis_rotation: Rotation in degrees.
        :param large_arc: Determines if the arc should be greater than or less than 180 degrees.
        :param sweep: Determines if the arc should begin moving at positive angles or negative ones.
        :param x: x-coordinate
        :param y: y-coordinate
        :return: The current ``Path`` instance.
        """
        return self._d('a', rx, ry, x_axis_rotation, 1 if large_arc else 0, 1 if sweep else 0, x, y)


def p() -> Path():
    return Path()
