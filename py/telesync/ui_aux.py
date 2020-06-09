from .types import Component
from .ui_base import text


def text_xl(content: str, tooltip: str = '') -> Component:
    """
    Create extra large sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='xl', tooltip=tooltip)


def text_l(content: str, tooltip: str = '') -> Component:
    """
    Create large sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='l', tooltip=tooltip)


def text_m(content: str, tooltip: str = '') -> Component:
    """
    Create medium sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='m', tooltip=tooltip)


def text_s(content: str, tooltip: str = '') -> Component:
    """
    Create small sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='s', tooltip=tooltip)


def text_xs(content: str, tooltip: str = '') -> Component:
    """
    Create extra small sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='xs', tooltip=tooltip)
