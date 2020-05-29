from builtins import list
from typing import List, Union
import telesync.cards as g


def text_xl(content: str, tooltip: str = '') -> g.Component:
    """
    Create extra large sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='xl', tooltip=tooltip)


def text_l(content: str, tooltip: str = '') -> g.Component:
    """
    Create large sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='l', tooltip=tooltip)


def text_m(content: str, tooltip: str = '') -> g.Component:
    """
    Create medium sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='m', tooltip=tooltip)


def text_s(content: str, tooltip: str = '') -> g.Component:
    """
    Create small sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='s', tooltip=tooltip)


def text_xs(content: str, tooltip: str = '') -> g.Component:
    """
    Create extra small sized text content.

    :param content: The text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A text instance.
    """
    return text(content=content, size='xs', tooltip=tooltip)


def fragment(section: g.NotebookSection) -> g.Component:
    """
    Create a notebook fragment.

    Fragments are sections of notebooks displayed inline in the UI.
    They are useful for presenting partial or intermediate results that can be saved or copied to other notebooks
    by the user.

    :param section: The notebook section to display in the fragment.
    :return: A fragment instance.
    """
    return g.Component(section=section)


# def button(name: str, label='') -> dict:
#     return dict(button=dict(name=name, label=label))
#

def form(box: str, url: str, items: Union[List[g.Component], str]) -> g.Form:
    return g.Form(
        box=box,
        url=url,
        args={},  # TODO needs special handling
        items=items,
    )
