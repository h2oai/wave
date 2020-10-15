import json
import math
from typing import Union, Optional, List
from .core import pack, data as _data, Data, Ref, Expando, expando_to_dict


# TODO add formal parameters for shape functions, including presentation attributes:
# https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation

def stage(**kwargs) -> str:
    """
    Create a stage. A stage holds static graphics elements that are rendered as part of the background (behind the scene).
    The return value must be assigned to the `stage` property of a `h2o_wave.types.GraphicsCard`.

    Args:
        kwargs: Graphical elements to render as part of the stage.
    Returns:
        Packed data.
    """
    return pack([expando_to_dict(v) for v in kwargs.values()])


def scene(**kwargs) -> Data:
    """
    Create a scene. A scene holds graphic elements whose attributes need to be changed dynamically (causing a re-render).
    The return value must be assigned to the `scene` property of a `h2o_wave.types.GraphicsCard`.

    Args:
        kwargs: Graphical elements to render as part of the scene.
    Returns:
        A `h2o_wave.core.Data` instance.
    """
    return _data(fields='d o', rows={k: [json.dumps(expando_to_dict(v)), ''] for k, v in kwargs.items()})


def draw(element: Ref, **kwargs) -> Ref:
    """
    Schedule a redraw of the specified graphical element using the provided attributes.

    Args:
        element: A reference to a graphical element.
        kwargs: Attributes to use while performing a redraw.
    Returns:
        The element reference, without change.
    """
    element['o'] = json.dumps(kwargs)
    return element


def reset(element: Ref) -> Ref:
    """
    Schedule a redraw of the specified graphical element using its original attributes.
    Calling this function clears any changes performed using the `h2o_wave.graphics.draw` function.

    Args:
        element: A reference to a graphical element.
    Returns:
        The element reference, without change.
    """
    element['o'] = ''
    return element


def _el(t: str, d: dict) -> Expando:
    d['_t'] = t
    return Expando(d)


_element_types = dict(
    a='arc',
    c='circle',
    e='ellipse',
    i='image',
    l='line',
    p='path',
    pg='polygon',
    pl='polyline',
    s='spline',
    r='rect',
    t='text',
)


def type_of(element: Expando) -> Optional[str]:
    """
    Get the type of the graphical element.

    Args:
        element: A graphical element.
    Returns:
        A string indicating the type of the element, e.g. 'circle', 'line', etc.
    """
    return _element_types.get(element['_t'], None)


def arc(r1: float, r2: float, a1: float, a2: float, **kwargs) -> Expando:
    """
    Draw circular or annular sector, as in a pie or donut chart, centered at (0, 0).

    Args:
        r1: inner radius.
        r2: outer radius.
        a1: start angle, in degrees.
        a2: end angle, in degrees.
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('a', dict(r1=r1, r2=r2, a1=a1, a2=a2, **kwargs))


def circle(**kwargs) -> Expando:
    """
    Draw a circle.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('c', kwargs)


def ellipse(**kwargs) -> Expando:
    """
    Draw an ellipse.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('e', kwargs)


def image(**kwargs) -> Expando:
    """
    Draw an image.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('i', kwargs)


def line(**kwargs) -> Expando:
    """
    Draw a line.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('l', kwargs)


def path(**kwargs) -> Expando:
    """
    Draw a path.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('p', kwargs)


def polygon(**kwargs) -> Expando:
    """
    Draw a polygon.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('pg', kwargs)


def polyline(**kwargs) -> Expando:
    """
    Draw a polyline.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('pl', kwargs)


Floats = Optional[List[Optional[float]]]


def _str(fs: Floats) -> Optional[str]:
    if fs is None:
        return None
    return ' '.join(['' if f is None else str(round(f, 2)) for f in fs])


def spline(x: Floats = None, y: Floats = None,
           x0: Floats = None, y0: Floats = None,
           curve: Optional[str] = None, radial: Optional[bool] = None, **kwargs) -> Expando:
    """
    Draw a spline.

    If x, y are specified, draws a regular spline.

    If x, y, y0 are specified, draws a horizontal area spline. Sets baseline to zero if y0 is an empty list.

    If x, x0, y are specified, draws a vertical area spline. Sets baseline to zero if x0 is an empty list

    Missing information is rendered as gaps in the spline.

    Args:
        x: x-coordinates.
        y: y-coordinates.
        x0: base x-coordinates.
        y0: base y-coordinates.
        curve: Interpolation. One of basis, basis-closed, basis-open, cardinal, cardinal-closed, cardinal-open, smooth, smooth-closed, smooth-open, linear, linear-closed, monotone-x, monotone-y, natural, step, step-after, step-before. Defaults to linear.
        radial: Whether (x, y) should be treated as (angle,radius) or (x0, x, y0, y) should be treated as (start-angle, end-angle, inner-radius, outer-radius).
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    attrs = dict(x=_str(x), y=_str(y), x0=_str(x0), y0=_str(y0), curve=curve, radial=radial)
    return _el('s', dict(**{k: v for k, v in attrs.items() if v is not None}, **kwargs))


def rect(**kwargs) -> Expando:
    """
    Draw a rectangle.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect

    Args:
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('r', kwargs)


def text(text: str, **kwargs) -> Expando:
    """
    Draw text.
    See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text

    Args:
        text: The text content.
        kwargs: Attributes to use for the initial render. SVG attributes, snake-cased.
    Returns:
        Data for the graphical element.
    """
    return _el('t', dict(text=text, **kwargs))


class Path:
    """
    A convenience class for drawing SVG paths.
    """

    def __init__(self):
        self.__d = []

    def _d(self, command: str, *args) -> 'Path':
        self.__d.append(command)
        for arg in args:
            self.__d.append(str(round(arg, 2) if isinstance(arg, float) else arg))
        return self

    def d(self) -> str:
        """
        Serialize this path's commands into SVG path data.

        Returns:
            The ``d`` attribute for a SVG path.
        """
        return ' '.join(self.__d)

    def path(self, **kwargs) -> Expando:
        """
        A SVG path element representing the commands in this ``Path`` instance.
        Same as calling ``h2o_wave.graphics.path(d=path.d())``

        Args:
            kwargs: Additional attributes for the SVG path element.
        Returns:
            A SVG path element.
        """
        return path(d=self.d(), **kwargs)

    def M(self, x: float, y: float) -> 'Path':
        """
        Start a new sub-path at the given (x,y) coordinates.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('M', x, y)

    def m(self, x: float, y: float) -> 'Path':
        """
        Start a new sub-path at the given (x,y) coordinates.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('m', x, y)

    def Z(self) -> 'Path':
        """
        Close the current subpath by connecting it back to the current subpath's initial point.

        See https://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand

        Returns:
            The current ``Path`` instance.
        """
        return self._d('Z')

    def z(self) -> 'Path':
        """
        Close the current subpath by connecting it back to the current subpath's initial point.

        See https://www.w3.org/TR/SVG/paths.html#PathDataClosePathCommand

        Returns:
            The current ``Path`` instance.
        """
        return self._d('z')

    def L(self, x: float, y: float) -> 'Path':
        """
        Draw a line from the current point to the given (x,y) coordinate which becomes the new current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('L', x, y)

    def l(self, x: float, y: float) -> 'Path':
        """
        Draw a line from the current point to the given (x,y) coordinate which becomes the new current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('l', x, y)

    def H(self, x: float) -> 'Path':
        """
        Draws a horizontal line from the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            x: x-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('H', x)

    def h(self, x: float) -> 'Path':
        """
        Draws a horizontal line from the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            x: x-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('h', x)

    def V(self, y: float) -> 'Path':
        """
        Draws a vertical line from the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('V', y)

    def v(self, y: float) -> 'Path':
        """
        Draws a vertical line from the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataLinetoCommands

        Args:
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('v', y)

    def C(self, x1: float, y1: float, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y) using (x1,y1) as the control point at the beginning
        of the curve and (x2,y2) as the control point at the end of the curve.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        Args:
            x1: x-coordinate of first control point
            y1: y-coordinate of first control point
            x2: x-coordinate of second control point
            y2: y-coordinate of second control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('C', x1, y1, x2, y2, x, y)

    def c(self, x1: float, y1: float, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y) using (x1,y1) as the control point at the beginning
        of the curve and (x2,y2) as the control point at the end of the curve.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        Args:
            x1: x-coordinate of first control point
            y1: y-coordinate of first control point
            x2: x-coordinate of second control point
            y2: y-coordinate of second control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('c', x1, y1, x2, y2, x, y)

    def S(self, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y). The first control point is assumed to be the
        reflection of the second control point on the previous command relative to the current point.
        (x2,y2) is the second control point (i.e., the control point at the end of the curve).
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        Args:
            x2: x-coordinate of second control point
            y2: y-coordinate of second control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('S', x2, y2, x, y)

    def s(self, x2: float, y2: float, x: float, y: float) -> 'Path':
        """
        Draws a cubic Bézier curve from the current point to (x,y). The first control point is assumed to be the
        reflection of the second control point on the previous command relative to the current point.
        (x2,y2) is the second control point (i.e., the control point at the end of the curve).
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands

        Args:
            x2: x-coordinate of second control point
            y2: y-coordinate of second control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('s', x2, y2, x, y)

    def Q(self, x1: float, y1: float, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1) as the control point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        Args:
            x1: x-coordinate of first control point
            y1: y-coordinate of first control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('Q', x1, y1, x, y)

    def q(self, x1: float, y1: float, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y) using (x1,y1) as the control point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        Args:
            x1: x-coordinate of first control point
            y1: y-coordinate of first control point
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('q', x1, y1, x, y)

    def T(self, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y). The control point is assumed to be the
        reflection of the control point on the previous command relative to the current point.
        In absolute coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('T', x, y)

    def t(self, x: float, y: float) -> 'Path':
        """
        Draws a quadratic Bézier curve from the current point to (x,y). The control point is assumed to be the
        reflection of the control point on the previous command relative to the current point.
        In relative coordinates.

        See https://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
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

        Args:
            rx: x-radius
            ry: y-radius
            x_axis_rotation: Rotation in degrees.
            large_arc: Determines if the arc should be greater than or less than 180 degrees.
            sweep: Determines if the arc should begin moving at positive angles or negative ones.
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
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

        Args:
            rx: x-radius
            ry: y-radius
            x_axis_rotation: Rotation in degrees.
            large_arc: Determines if the arc should be greater than or less than 180 degrees.
            sweep: Determines if the arc should begin moving at positive angles or negative ones.
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current ``Path`` instance.
        """
        return self._d('a', rx, ry, x_axis_rotation, 1 if large_arc else 0, 1 if sweep else 0, x, y)


def p() -> Path:
    """
    Create a new `h2o_wave.graphics.Path`.

    Returns:
        A new `h2o_wave.graphics.Path`.
    """
    return Path()


class _Vec(object):
    __slots__ = ('x', 'y')

    def __init__(self, x: Union[int, float], y: Union[int, float]):
        self.x = float(x)
        self.y = float(y)

    def __neg__(self) -> '_Vec': return _Vec(-self.x, -self.y)

    def __add__(self, v: '_Vec') -> '_Vec': return _Vec(self.x + v.x, self.y + v.y)

    def __sub__(self, v: '_Vec') -> '_Vec': return _Vec(self.x - v.x, self.y - v.y)

    def __mul__(self, v: Union['_Vec', int, float]) -> Union['_Vec', float]:
        if isinstance(v, _Vec):
            return self.x * v.x + self.y * v.y  # dot product
        return _Vec(self.x * v, self.y * v)

    def __rmul__(self, v: Union['_Vec', int, float]) -> Union['_Vec', float]: return self.__mul__(v)

    def __div__(self, d: Union[int, float]): return _Vec(self.x / d, self.y / d)

    def __abs__(self) -> float: return (self.x ** 2 + self.y ** 2) ** 0.5

    def rotate(self, a: Union[int, float]):
        p = _Vec(-self.y, self.x)  # perpendicular
        c = math.cos(a)
        s = math.sin(a)
        return _Vec(self.x * c + p.x * s, self.y * c + p.y * s)


class Turtle:
    """
    A Logo-like Turtle implementation for generating SVG paths.
    This is not a complete Turtle implementation. Contains a useful subset relevant to generating paths without
    using trigonometry or mental gymnastics.
    """

    def __init__(self, x=0.0, y=0.0, degrees=0.0):
        """
        Create a Turtle.

        Args:
            x: initial position x
            y: initial position y
            degrees: initial angle in degrees
        """
        self._p = _Vec(x, y)  # position vector
        a = math.radians(degrees)
        self._a = _Vec(math.cos(a), math.sin(a))  # orientation vector
        self._pd = False  # pen down?
        self._path = Path()

    def _draw(self) -> 'Turtle':
        if self._pd:
            self._path.L(self._p.x, self._p.y)
        else:
            self._path.M(self._p.x, self._p.y)
        return self

    def _move(self, d: float) -> 'Turtle':
        self._p = self._p + self._a * d
        return self._draw()

    def _rotate(self, a: float) -> 'Turtle':
        self._a = self._a.rotate(math.radians(a))
        return self

    def f(self, distance: float) -> 'Turtle':
        """
        Move forward.

        Args:
            distance: Distance to move by.
        Returns:
            The current turtle instance.
        """
        return self._move(distance)

    def b(self, distance: float) -> 'Turtle':
        """
        Move backward.

        Args:
            distance: Distance to move by.
        Returns:
            The current turtle instance.
        """
        return self._move(-distance)

    def l(self, degrees: float) -> 'Turtle':
        """
        Turn left.

        Args:
            degrees: Angle in degrees.
        Returns:
            The current turtle instance.
        """
        return self._rotate(-degrees)

    def r(self, degrees: float) -> 'Turtle':
        """
        Turn right.

        Args:
            degrees: Angle in degrees.
        Returns:
            The current turtle instance.
        """
        return self._rotate(degrees)

    def pu(self, close: bool) -> 'Turtle':
        """
        Pen up.

        Args:
            close: Whether to close the current subpath.
        Returns:
            The current turtle instance.
        """
        if close:
            self._path.Z()

        self._pd = False
        return self

    def pd(self) -> 'Turtle':
        """
        Pen down.

        Returns:
            The current turtle instance.
        """
        self._pd = True
        return self

    def p(self, x: float = 0.0, y: float = 0.0) -> 'Turtle':
        """
        Set the turtle's position.

        Args:
            x: x-coordinate
            y: y-coordinate
        Returns:
            The current turtle instance.
        """
        self._p = _Vec(x, y)
        return self._draw()

    def a(self, degrees: float = 0) -> 'Turtle':
        """
        Set the turtle's orientation.

        Args:
            degrees: angle in degrees
        Returns:
            The current turtle instance.
        """
        a = math.radians(degrees)
        self._a = _Vec(math.cos(a), math.sin(a))
        return self

    def d(self) -> str:
        """
        Serialize this turtle's movements into SVG path data.

        Returns:
            The ``d`` attribute for a SVG path.
        """
        return self._path.d()

    def path(self, **kwargs) -> Expando:
        """
        Create a SVG path element that represents this turtle's movements.

        Args:
            kwargs: Additional attributes for the SVG path element.
        Returns:
            A SVG path element.
        """
        return self._path.path(**kwargs)


def turtle(x=0.0, y=0.0, degrees=0.0) -> Turtle:
    """
    Create a new `h2o_wave.graphics.Turtle`.

    Args:
        x: initial position x
        y: initial position y
        degrees: initial angle in degrees
    Returns:
        A new `h2o_wave.graphics.Turtle`.
    """
    return Turtle(x, y, degrees)
