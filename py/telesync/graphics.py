import json
from typing import List, Union
from .core import data as _data, Data, Ref


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
