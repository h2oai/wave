#
# THIS FILE IS GENERATED; DO NOT EDIT
#

from typing import Any, Optional, Union, Dict, List
from .core import Data

Value = Union[str, float, int]
PackedRecord = Union[dict, str]
PackedRecords = Union[List[dict], str]
PackedData = Union[Data, str]


def _dump(**kwargs): return {k: v for k, v in kwargs.items() if v is not None}


class BasicList:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            item_view: str,
            item_props: PackedRecord,
            data: PackedData,
    ):
        self.box = box
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('BasicList.box is required.')
        if self.title is None:
            raise ValueError('BasicList.title is required.')
        if self.item_view is None:
            raise ValueError('BasicList.item_view is required.')
        if self.item_props is None:
            raise ValueError('BasicList.item_props is required.')
        if self.data is None:
            raise ValueError('BasicList.data is required.')
        return _dump(
            view='basic_list',
            box=self.box,
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'BasicList':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('BasicList.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('BasicList.title is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('BasicList.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('BasicList.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('BasicList.data is required.')
        box: str = __d_box
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        data: PackedData = __d_data
        return BasicList(
            box,
            title,
            item_view,
            item_props,
            data,
        )


class Card1:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            data: Optional[PackedRecord] = None,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card1.box is required.')
        if self.title is None:
            raise ValueError('Card1.title is required.')
        if self.value is None:
            raise ValueError('Card1.value is required.')
        return _dump(
            view='card1',
            box=self.box,
            title=self.title,
            value=self.value,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card1':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card1.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card1.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card1.value is required.')
        __d_data: Any = __d.get('data')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        data: Optional[PackedRecord] = __d_data
        return Card1(
            box,
            title,
            value,
            data,
        )


class Card2:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param data: No documentation available.
    :param plot_type: No documentation available. One of 'area', 'interval'.
    :param plot_data: No documentation available.
    :param plot_color: No documentation available.
    :param plot_category: No documentation available.
    :param plot_value: No documentation available.
    :param plot_zero_value: No documentation available.
    :param plot_curve: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            data: PackedRecord,
            plot_type: str,
            plot_data: PackedData,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.data = data
        self.plot_type = plot_type
        self.plot_data = plot_data
        self.plot_color = plot_color
        self.plot_category = plot_category
        self.plot_value = plot_value
        self.plot_zero_value = plot_zero_value
        self.plot_curve = plot_curve

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card2.box is required.')
        if self.title is None:
            raise ValueError('Card2.title is required.')
        if self.value is None:
            raise ValueError('Card2.value is required.')
        if self.aux_value is None:
            raise ValueError('Card2.aux_value is required.')
        if self.data is None:
            raise ValueError('Card2.data is required.')
        if self.plot_type is None:
            raise ValueError('Card2.plot_type is required.')
        if self.plot_type not in ('area', 'interval'):
            raise ValueError(f'Invalid value "{self.plot_type}" for Card2.plot_type.')
        if self.plot_data is None:
            raise ValueError('Card2.plot_data is required.')
        if self.plot_color is None:
            raise ValueError('Card2.plot_color is required.')
        if self.plot_category is None:
            raise ValueError('Card2.plot_category is required.')
        if self.plot_value is None:
            raise ValueError('Card2.plot_value is required.')
        if self.plot_zero_value is None:
            raise ValueError('Card2.plot_zero_value is required.')
        if self.plot_curve is None:
            raise ValueError('Card2.plot_curve is required.')
        return _dump(
            view='card2',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            data=self.data,
            plot_type=self.plot_type,
            plot_data=self.plot_data,
            plot_color=self.plot_color,
            plot_category=self.plot_category,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_curve=self.plot_curve,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card2':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card2.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card2.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card2.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card2.aux_value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card2.data is required.')
        __d_plot_type: Any = __d.get('plot_type')
        if __d_plot_type is None:
            raise ValueError('Card2.plot_type is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('Card2.plot_data is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card2.plot_color is required.')
        __d_plot_category: Any = __d.get('plot_category')
        if __d_plot_category is None:
            raise ValueError('Card2.plot_category is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('Card2.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        if __d_plot_zero_value is None:
            raise ValueError('Card2.plot_zero_value is required.')
        __d_plot_curve: Any = __d.get('plot_curve')
        if __d_plot_curve is None:
            raise ValueError('Card2.plot_curve is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: PackedRecord = __d_data
        plot_type: str = __d_plot_type
        plot_data: PackedData = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card2(
            box,
            title,
            value,
            aux_value,
            data,
            plot_type,
            plot_data,
            plot_color,
            plot_category,
            plot_value,
            plot_zero_value,
            plot_curve,
        )


class Card3:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param caption: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            caption: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.caption = caption
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card3.box is required.')
        if self.title is None:
            raise ValueError('Card3.title is required.')
        if self.value is None:
            raise ValueError('Card3.value is required.')
        if self.aux_value is None:
            raise ValueError('Card3.aux_value is required.')
        if self.caption is None:
            raise ValueError('Card3.caption is required.')
        if self.data is None:
            raise ValueError('Card3.data is required.')
        return _dump(
            view='card3',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            caption=self.caption,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card3':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card3.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card3.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card3.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card3.aux_value is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('Card3.caption is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card3.data is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        caption: str = __d_caption
        data: PackedRecord = __d_data
        return Card3(
            box,
            title,
            value,
            aux_value,
            caption,
            data,
        )


class Card4:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card4.box is required.')
        if self.title is None:
            raise ValueError('Card4.title is required.')
        if self.value is None:
            raise ValueError('Card4.value is required.')
        if self.aux_value is None:
            raise ValueError('Card4.aux_value is required.')
        if self.progress is None:
            raise ValueError('Card4.progress is required.')
        if self.plot_color is None:
            raise ValueError('Card4.plot_color is required.')
        if self.data is None:
            raise ValueError('Card4.data is required.')
        return _dump(
            view='card4',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card4':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card4.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card4.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card4.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card4.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('Card4.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card4.plot_color is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card4.data is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: PackedRecord = __d_data
        return Card4(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card5:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card5.box is required.')
        if self.title is None:
            raise ValueError('Card5.title is required.')
        if self.value is None:
            raise ValueError('Card5.value is required.')
        if self.aux_value is None:
            raise ValueError('Card5.aux_value is required.')
        if self.progress is None:
            raise ValueError('Card5.progress is required.')
        if self.plot_color is None:
            raise ValueError('Card5.plot_color is required.')
        if self.data is None:
            raise ValueError('Card5.data is required.')
        return _dump(
            view='card5',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card5':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card5.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card5.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card5.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card5.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('Card5.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card5.plot_color is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card5.data is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: PackedRecord = __d_data
        return Card5(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card6:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param data: No documentation available.
    :param plot_type: No documentation available. One of 'area', 'interval'.
    :param plot_data: No documentation available.
    :param plot_color: No documentation available.
    :param plot_category: No documentation available.
    :param plot_value: No documentation available.
    :param plot_zero_value: No documentation available.
    :param plot_curve: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            data: PackedRecord,
            plot_type: str,
            plot_data: PackedData,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.data = data
        self.plot_type = plot_type
        self.plot_data = plot_data
        self.plot_color = plot_color
        self.plot_category = plot_category
        self.plot_value = plot_value
        self.plot_zero_value = plot_zero_value
        self.plot_curve = plot_curve

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card6.box is required.')
        if self.title is None:
            raise ValueError('Card6.title is required.')
        if self.value is None:
            raise ValueError('Card6.value is required.')
        if self.aux_value is None:
            raise ValueError('Card6.aux_value is required.')
        if self.data is None:
            raise ValueError('Card6.data is required.')
        if self.plot_type is None:
            raise ValueError('Card6.plot_type is required.')
        if self.plot_type not in ('area', 'interval'):
            raise ValueError(f'Invalid value "{self.plot_type}" for Card6.plot_type.')
        if self.plot_data is None:
            raise ValueError('Card6.plot_data is required.')
        if self.plot_color is None:
            raise ValueError('Card6.plot_color is required.')
        if self.plot_category is None:
            raise ValueError('Card6.plot_category is required.')
        if self.plot_value is None:
            raise ValueError('Card6.plot_value is required.')
        if self.plot_zero_value is None:
            raise ValueError('Card6.plot_zero_value is required.')
        if self.plot_curve is None:
            raise ValueError('Card6.plot_curve is required.')
        return _dump(
            view='card6',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            data=self.data,
            plot_type=self.plot_type,
            plot_data=self.plot_data,
            plot_color=self.plot_color,
            plot_category=self.plot_category,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_curve=self.plot_curve,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card6':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card6.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card6.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card6.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card6.aux_value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card6.data is required.')
        __d_plot_type: Any = __d.get('plot_type')
        if __d_plot_type is None:
            raise ValueError('Card6.plot_type is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('Card6.plot_data is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card6.plot_color is required.')
        __d_plot_category: Any = __d.get('plot_category')
        if __d_plot_category is None:
            raise ValueError('Card6.plot_category is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('Card6.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        if __d_plot_zero_value is None:
            raise ValueError('Card6.plot_zero_value is required.')
        __d_plot_curve: Any = __d.get('plot_curve')
        if __d_plot_curve is None:
            raise ValueError('Card6.plot_curve is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: PackedRecord = __d_data
        plot_type: str = __d_plot_type
        plot_data: PackedData = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card6(
            box,
            title,
            value,
            aux_value,
            data,
            plot_type,
            plot_data,
            plot_color,
            plot_category,
            plot_value,
            plot_zero_value,
            plot_curve,
        )


class Card7:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param data: No documentation available.
    :param plot_type: No documentation available. One of 'area', 'interval'.
    :param plot_data: No documentation available.
    :param plot_color: No documentation available.
    :param plot_category: No documentation available.
    :param plot_value: No documentation available.
    :param plot_zero_value: No documentation available.
    :param plot_curve: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            data: PackedRecord,
            plot_type: str,
            plot_data: PackedData,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.data = data
        self.plot_type = plot_type
        self.plot_data = plot_data
        self.plot_color = plot_color
        self.plot_category = plot_category
        self.plot_value = plot_value
        self.plot_zero_value = plot_zero_value
        self.plot_curve = plot_curve

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card7.box is required.')
        if self.title is None:
            raise ValueError('Card7.title is required.')
        if self.value is None:
            raise ValueError('Card7.value is required.')
        if self.data is None:
            raise ValueError('Card7.data is required.')
        if self.plot_type is None:
            raise ValueError('Card7.plot_type is required.')
        if self.plot_type not in ('area', 'interval'):
            raise ValueError(f'Invalid value "{self.plot_type}" for Card7.plot_type.')
        if self.plot_data is None:
            raise ValueError('Card7.plot_data is required.')
        if self.plot_color is None:
            raise ValueError('Card7.plot_color is required.')
        if self.plot_category is None:
            raise ValueError('Card7.plot_category is required.')
        if self.plot_value is None:
            raise ValueError('Card7.plot_value is required.')
        if self.plot_zero_value is None:
            raise ValueError('Card7.plot_zero_value is required.')
        if self.plot_curve is None:
            raise ValueError('Card7.plot_curve is required.')
        return _dump(
            view='card7',
            box=self.box,
            title=self.title,
            value=self.value,
            data=self.data,
            plot_type=self.plot_type,
            plot_data=self.plot_data,
            plot_color=self.plot_color,
            plot_category=self.plot_category,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_curve=self.plot_curve,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card7':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card7.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card7.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card7.value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card7.data is required.')
        __d_plot_type: Any = __d.get('plot_type')
        if __d_plot_type is None:
            raise ValueError('Card7.plot_type is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('Card7.plot_data is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card7.plot_color is required.')
        __d_plot_category: Any = __d.get('plot_category')
        if __d_plot_category is None:
            raise ValueError('Card7.plot_category is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('Card7.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        if __d_plot_zero_value is None:
            raise ValueError('Card7.plot_zero_value is required.')
        __d_plot_curve: Any = __d.get('plot_curve')
        if __d_plot_curve is None:
            raise ValueError('Card7.plot_curve is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        data: PackedRecord = __d_data
        plot_type: str = __d_plot_type
        plot_data: PackedData = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card7(
            box,
            title,
            value,
            data,
            plot_type,
            plot_data,
            plot_color,
            plot_category,
            plot_value,
            plot_zero_value,
            plot_curve,
        )


class Card8:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card8.box is required.')
        if self.title is None:
            raise ValueError('Card8.title is required.')
        if self.value is None:
            raise ValueError('Card8.value is required.')
        if self.aux_value is None:
            raise ValueError('Card8.aux_value is required.')
        if self.progress is None:
            raise ValueError('Card8.progress is required.')
        if self.plot_color is None:
            raise ValueError('Card8.plot_color is required.')
        if self.data is None:
            raise ValueError('Card8.data is required.')
        return _dump(
            view='card8',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card8':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card8.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card8.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card8.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card8.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('Card8.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card8.plot_color is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card8.data is required.')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: PackedRecord = __d_data
        return Card8(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card9:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param value_caption: No documentation available.
    :param aux_value_caption: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            caption: str,
            value: str,
            aux_value: str,
            value_caption: str,
            aux_value_caption: str,
            progress: float,
            plot_color: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.caption = caption
        self.value = value
        self.aux_value = aux_value
        self.value_caption = value_caption
        self.aux_value_caption = aux_value_caption
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Card9.box is required.')
        if self.title is None:
            raise ValueError('Card9.title is required.')
        if self.caption is None:
            raise ValueError('Card9.caption is required.')
        if self.value is None:
            raise ValueError('Card9.value is required.')
        if self.aux_value is None:
            raise ValueError('Card9.aux_value is required.')
        if self.value_caption is None:
            raise ValueError('Card9.value_caption is required.')
        if self.aux_value_caption is None:
            raise ValueError('Card9.aux_value_caption is required.')
        if self.progress is None:
            raise ValueError('Card9.progress is required.')
        if self.plot_color is None:
            raise ValueError('Card9.plot_color is required.')
        if self.data is None:
            raise ValueError('Card9.data is required.')
        return _dump(
            view='card9',
            box=self.box,
            title=self.title,
            caption=self.caption,
            value=self.value,
            aux_value=self.aux_value,
            value_caption=self.value_caption,
            aux_value_caption=self.aux_value_caption,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card9':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Card9.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card9.title is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('Card9.caption is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card9.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('Card9.aux_value is required.')
        __d_value_caption: Any = __d.get('value_caption')
        if __d_value_caption is None:
            raise ValueError('Card9.value_caption is required.')
        __d_aux_value_caption: Any = __d.get('aux_value_caption')
        if __d_aux_value_caption is None:
            raise ValueError('Card9.aux_value_caption is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('Card9.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        if __d_plot_color is None:
            raise ValueError('Card9.plot_color is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card9.data is required.')
        box: str = __d_box
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        value_caption: str = __d_value_caption
        aux_value_caption: str = __d_aux_value_caption
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: PackedRecord = __d_data
        return Card9(
            box,
            title,
            caption,
            value,
            aux_value,
            value_caption,
            aux_value_caption,
            progress,
            plot_color,
            data,
        )


class HeadingCell:
    """No documentation available.

    :param level: No documentation available.
    :param content: No documentation available.
    """
    def __init__(
            self,
            level: int,
            content: str,
    ):
        self.level = level
        self.content = content

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.level is None:
            raise ValueError('HeadingCell.level is required.')
        if self.content is None:
            raise ValueError('HeadingCell.content is required.')
        return _dump(
            level=self.level,
            content=self.content,
        )

    @staticmethod
    def load(__d: Dict) -> 'HeadingCell':
        """Creates an instance of this class using the contents of a dict."""
        __d_level: Any = __d.get('level')
        if __d_level is None:
            raise ValueError('HeadingCell.level is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('HeadingCell.content is required.')
        level: int = __d_level
        content: str = __d_content
        return HeadingCell(
            level,
            content,
        )


class MarkdownCell:
    """No documentation available.

    :param content: No documentation available.
    """
    def __init__(
            self,
            content: str,
    ):
        self.content = content

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('MarkdownCell.content is required.')
        return _dump(
            content=self.content,
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkdownCell':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('MarkdownCell.content is required.')
        content: str = __d_content
        return MarkdownCell(
            content,
        )


class FrameCell:
    """No documentation available.

    :param source: No documentation available.
    :param width: No documentation available.
    :param height: No documentation available.
    """
    def __init__(
            self,
            source: str,
            width: str,
            height: str,
    ):
        self.source = source
        self.width = width
        self.height = height

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.source is None:
            raise ValueError('FrameCell.source is required.')
        if self.width is None:
            raise ValueError('FrameCell.width is required.')
        if self.height is None:
            raise ValueError('FrameCell.height is required.')
        return _dump(
            source=self.source,
            width=self.width,
            height=self.height,
        )

    @staticmethod
    def load(__d: Dict) -> 'FrameCell':
        """Creates an instance of this class using the contents of a dict."""
        __d_source: Any = __d.get('source')
        if __d_source is None:
            raise ValueError('FrameCell.source is required.')
        __d_width: Any = __d.get('width')
        if __d_width is None:
            raise ValueError('FrameCell.width is required.')
        __d_height: Any = __d.get('height')
        if __d_height is None:
            raise ValueError('FrameCell.height is required.')
        source: str = __d_source
        width: str = __d_width
        height: str = __d_height
        return FrameCell(
            source,
            width,
            height,
        )


class DataCell:
    """No documentation available.

    :param content: No documentation available.
    """
    def __init__(
            self,
            content: str,
    ):
        self.content = content

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('DataCell.content is required.')
        return _dump(
            content=self.content,
        )

    @staticmethod
    def load(__d: Dict) -> 'DataCell':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('DataCell.content is required.')
        content: str = __d_content
        return DataCell(
            content,
        )


class DataSource:
    """No documentation available.

    :param t: No documentation available. One of 'Table', 'View'.
    :param id: No documentation available.
    """
    def __init__(
            self,
            t: str,
            id: int,
    ):
        self.t = t
        self.id = id

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.t is None:
            raise ValueError('DataSource.t is required.')
        if self.t not in ('Table', 'View'):
            raise ValueError(f'Invalid value "{self.t}" for DataSource.t.')
        if self.id is None:
            raise ValueError('DataSource.id is required.')
        return _dump(
            t=self.t,
            id=self.id,
        )

    @staticmethod
    def load(__d: Dict) -> 'DataSource':
        """Creates an instance of this class using the contents of a dict."""
        __d_t: Any = __d.get('t')
        if __d_t is None:
            raise ValueError('DataSource.t is required.')
        __d_id: Any = __d.get('id')
        if __d_id is None:
            raise ValueError('DataSource.id is required.')
        t: str = __d_t
        id: int = __d_id
        return DataSource(
            t,
            id,
        )


class Query:
    """No documentation available.

    :param sql: No documentation available.
    :param sources: No documentation available.
    """
    def __init__(
            self,
            sql: str,
            sources: List[DataSource],
    ):
        self.sql = sql
        self.sources = sources

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.sql is None:
            raise ValueError('Query.sql is required.')
        if self.sources is None:
            raise ValueError('Query.sources is required.')
        return _dump(
            sql=self.sql,
            sources=[__e.dump() for __e in self.sources],
        )

    @staticmethod
    def load(__d: Dict) -> 'Query':
        """Creates an instance of this class using the contents of a dict."""
        __d_sql: Any = __d.get('sql')
        if __d_sql is None:
            raise ValueError('Query.sql is required.')
        __d_sources: Any = __d.get('sources')
        if __d_sources is None:
            raise ValueError('Query.sources is required.')
        sql: str = __d_sql
        sources: List[DataSource] = [DataSource.load(__e) for __e in __d_sources]
        return Query(
            sql,
            sources,
        )


class VegaCell:
    """No documentation available.

    :param specification: No documentation available.
    :param query: No documentation available.
    """
    def __init__(
            self,
            specification: str,
            query: Query,
    ):
        self.specification = specification
        self.query = query

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.specification is None:
            raise ValueError('VegaCell.specification is required.')
        if self.query is None:
            raise ValueError('VegaCell.query is required.')
        return _dump(
            specification=self.specification,
            query=self.query.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'VegaCell':
        """Creates an instance of this class using the contents of a dict."""
        __d_specification: Any = __d.get('specification')
        if __d_specification is None:
            raise ValueError('VegaCell.specification is required.')
        __d_query: Any = __d.get('query')
        if __d_query is None:
            raise ValueError('VegaCell.query is required.')
        specification: str = __d_specification
        query: Query = Query.load(__d_query)
        return VegaCell(
            specification,
            query,
        )


class Cell:
    """No documentation available.

    :param heading: No documentation available.
    :param markdown: No documentation available.
    :param frame: No documentation available.
    :param data: No documentation available.
    :param vega: No documentation available.
    """
    def __init__(
            self,
            heading: Optional[HeadingCell] = None,
            markdown: Optional[MarkdownCell] = None,
            frame: Optional[FrameCell] = None,
            data: Optional[DataCell] = None,
            vega: Optional[VegaCell] = None,
    ):
        self.heading = heading
        self.markdown = markdown
        self.frame = frame
        self.data = data
        self.vega = vega

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            heading=None if self.heading is None else self.heading.dump(),
            markdown=None if self.markdown is None else self.markdown.dump(),
            frame=None if self.frame is None else self.frame.dump(),
            data=None if self.data is None else self.data.dump(),
            vega=None if self.vega is None else self.vega.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'Cell':
        """Creates an instance of this class using the contents of a dict."""
        __d_heading: Any = __d.get('heading')
        __d_markdown: Any = __d.get('markdown')
        __d_frame: Any = __d.get('frame')
        __d_data: Any = __d.get('data')
        __d_vega: Any = __d.get('vega')
        heading: Optional[HeadingCell] = None if __d_heading is None else HeadingCell.load(__d_heading)
        markdown: Optional[MarkdownCell] = None if __d_markdown is None else MarkdownCell.load(__d_markdown)
        frame: Optional[FrameCell] = None if __d_frame is None else FrameCell.load(__d_frame)
        data: Optional[DataCell] = None if __d_data is None else DataCell.load(__d_data)
        vega: Optional[VegaCell] = None if __d_vega is None else VegaCell.load(__d_vega)
        return Cell(
            heading,
            markdown,
            frame,
            data,
            vega,
        )


class Command:
    """No documentation available.

    :param action: No documentation available.
    :param icon: No documentation available.
    :param label: No documentation available.
    :param caption: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            action: str,
            icon: str,
            label: str,
            caption: str,
            data: str,
    ):
        self.action = action
        self.icon = icon
        self.label = label
        self.caption = caption
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.action is None:
            raise ValueError('Command.action is required.')
        if self.icon is None:
            raise ValueError('Command.icon is required.')
        if self.label is None:
            raise ValueError('Command.label is required.')
        if self.caption is None:
            raise ValueError('Command.caption is required.')
        if self.data is None:
            raise ValueError('Command.data is required.')
        return _dump(
            action=self.action,
            icon=self.icon,
            label=self.label,
            caption=self.caption,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Command':
        """Creates an instance of this class using the contents of a dict."""
        __d_action: Any = __d.get('action')
        if __d_action is None:
            raise ValueError('Command.action is required.')
        __d_icon: Any = __d.get('icon')
        if __d_icon is None:
            raise ValueError('Command.icon is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('Command.label is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('Command.caption is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Command.data is required.')
        action: str = __d_action
        icon: str = __d_icon
        label: str = __d_label
        caption: str = __d_caption
        data: str = __d_data
        return Command(
            action,
            icon,
            label,
            caption,
            data,
        )


class DashboardPanel:
    """No documentation available.

    :param cells: No documentation available.
    :param size: No documentation available.
    :param commands: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            cells: List[Cell],
            size: str,
            commands: List[Command],
            data: str,
    ):
        self.cells = cells
        self.size = size
        self.commands = commands
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.cells is None:
            raise ValueError('DashboardPanel.cells is required.')
        if self.size is None:
            raise ValueError('DashboardPanel.size is required.')
        if self.commands is None:
            raise ValueError('DashboardPanel.commands is required.')
        if self.data is None:
            raise ValueError('DashboardPanel.data is required.')
        return _dump(
            cells=[__e.dump() for __e in self.cells],
            size=self.size,
            commands=[__e.dump() for __e in self.commands],
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'DashboardPanel':
        """Creates an instance of this class using the contents of a dict."""
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('DashboardPanel.cells is required.')
        __d_size: Any = __d.get('size')
        if __d_size is None:
            raise ValueError('DashboardPanel.size is required.')
        __d_commands: Any = __d.get('commands')
        if __d_commands is None:
            raise ValueError('DashboardPanel.commands is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('DashboardPanel.data is required.')
        cells: List[Cell] = [Cell.load(__e) for __e in __d_cells]
        size: str = __d_size
        commands: List[Command] = [Command.load(__e) for __e in __d_commands]
        data: str = __d_data
        return DashboardPanel(
            cells,
            size,
            commands,
            data,
        )


class DashboardRow:
    """No documentation available.

    :param panels: No documentation available.
    :param size: No documentation available.
    """
    def __init__(
            self,
            panels: List[DashboardPanel],
            size: str,
    ):
        self.panels = panels
        self.size = size

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.panels is None:
            raise ValueError('DashboardRow.panels is required.')
        if self.size is None:
            raise ValueError('DashboardRow.size is required.')
        return _dump(
            panels=[__e.dump() for __e in self.panels],
            size=self.size,
        )

    @staticmethod
    def load(__d: Dict) -> 'DashboardRow':
        """Creates an instance of this class using the contents of a dict."""
        __d_panels: Any = __d.get('panels')
        if __d_panels is None:
            raise ValueError('DashboardRow.panels is required.')
        __d_size: Any = __d.get('size')
        if __d_size is None:
            raise ValueError('DashboardRow.size is required.')
        panels: List[DashboardPanel] = [DashboardPanel.load(__e) for __e in __d_panels]
        size: str = __d_size
        return DashboardRow(
            panels,
            size,
        )


class DashboardPage:
    """No documentation available.

    :param title: No documentation available.
    :param rows: No documentation available.
    """
    def __init__(
            self,
            title: str,
            rows: List[DashboardRow],
    ):
        self.title = title
        self.rows = rows

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.title is None:
            raise ValueError('DashboardPage.title is required.')
        if self.rows is None:
            raise ValueError('DashboardPage.rows is required.')
        return _dump(
            title=self.title,
            rows=[__e.dump() for __e in self.rows],
        )

    @staticmethod
    def load(__d: Dict) -> 'DashboardPage':
        """Creates an instance of this class using the contents of a dict."""
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('DashboardPage.title is required.')
        __d_rows: Any = __d.get('rows')
        if __d_rows is None:
            raise ValueError('DashboardPage.rows is required.')
        title: str = __d_title
        rows: List[DashboardRow] = [DashboardRow.load(__e) for __e in __d_rows]
        return DashboardPage(
            title,
            rows,
        )


class Dashboard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param pages: No documentation available.
    """
    def __init__(
            self,
            box: str,
            pages: List[DashboardPage],
    ):
        self.box = box
        self.pages = pages

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Dashboard.box is required.')
        if self.pages is None:
            raise ValueError('Dashboard.pages is required.')
        return _dump(
            view='dashboard',
            box=self.box,
            pages=[__e.dump() for __e in self.pages],
        )

    @staticmethod
    def load(__d: Dict) -> 'Dashboard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Dashboard.box is required.')
        __d_pages: Any = __d.get('pages')
        if __d_pages is None:
            raise ValueError('Dashboard.pages is required.')
        box: str = __d_box
        pages: List[DashboardPage] = [DashboardPage.load(__e) for __e in __d_pages]
        return Dashboard(
            box,
            pages,
        )


class Flex:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param direction: No documentation available. One of 'horizontal', 'vertical'.
    :param justify: No documentation available. One of 'start', 'end', 'center', 'between', 'around'.
    :param align: No documentation available. One of 'start', 'end', 'center', 'baseline', 'stretch'.
    :param wrap: No documentation available. One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            item_view: str,
            item_props: PackedRecord,
            direction: str,
            justify: str,
            align: str,
            wrap: str,
            data: PackedData,
    ):
        self.box = box
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.direction = direction
        self.justify = justify
        self.align = align
        self.wrap = wrap
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Flex.box is required.')
        if self.title is None:
            raise ValueError('Flex.title is required.')
        if self.item_view is None:
            raise ValueError('Flex.item_view is required.')
        if self.item_props is None:
            raise ValueError('Flex.item_props is required.')
        if self.direction is None:
            raise ValueError('Flex.direction is required.')
        if self.direction not in ('horizontal', 'vertical'):
            raise ValueError(f'Invalid value "{self.direction}" for Flex.direction.')
        if self.justify is None:
            raise ValueError('Flex.justify is required.')
        if self.justify not in ('start', 'end', 'center', 'between', 'around'):
            raise ValueError(f'Invalid value "{self.justify}" for Flex.justify.')
        if self.align is None:
            raise ValueError('Flex.align is required.')
        if self.align not in ('start', 'end', 'center', 'baseline', 'stretch'):
            raise ValueError(f'Invalid value "{self.align}" for Flex.align.')
        if self.wrap is None:
            raise ValueError('Flex.wrap is required.')
        if self.wrap not in ('start', 'end', 'center', 'between', 'around', 'stretch'):
            raise ValueError(f'Invalid value "{self.wrap}" for Flex.wrap.')
        if self.data is None:
            raise ValueError('Flex.data is required.')
        return _dump(
            view='flex',
            box=self.box,
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            direction=self.direction,
            justify=self.justify,
            align=self.align,
            wrap=self.wrap,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Flex':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Flex.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Flex.title is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('Flex.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('Flex.item_props is required.')
        __d_direction: Any = __d.get('direction')
        if __d_direction is None:
            raise ValueError('Flex.direction is required.')
        __d_justify: Any = __d.get('justify')
        if __d_justify is None:
            raise ValueError('Flex.justify is required.')
        __d_align: Any = __d.get('align')
        if __d_align is None:
            raise ValueError('Flex.align is required.')
        __d_wrap: Any = __d.get('wrap')
        if __d_wrap is None:
            raise ValueError('Flex.wrap is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Flex.data is required.')
        box: str = __d_box
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        direction: str = __d_direction
        justify: str = __d_justify
        align: str = __d_align
        wrap: str = __d_wrap
        data: PackedData = __d_data
        return Flex(
            box,
            title,
            item_view,
            item_props,
            direction,
            justify,
            align,
            wrap,
            data,
        )


class FormText:
    """No documentation available.

    :param size: No documentation available.
    :param text: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            size: str,
            text: str,
            tooltip: str,
    ):
        self.size = size
        self.text = text
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.size is None:
            raise ValueError('FormText.size is required.')
        if self.text is None:
            raise ValueError('FormText.text is required.')
        if self.tooltip is None:
            raise ValueError('FormText.tooltip is required.')
        return _dump(
            size=self.size,
            text=self.text,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormText':
        """Creates an instance of this class using the contents of a dict."""
        __d_size: Any = __d.get('size')
        if __d_size is None:
            raise ValueError('FormText.size is required.')
        __d_text: Any = __d.get('text')
        if __d_text is None:
            raise ValueError('FormText.text is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormText.tooltip is required.')
        size: str = __d_size
        text: str = __d_text
        tooltip: str = __d_tooltip
        return FormText(
            size,
            text,
            tooltip,
        )


class FormLabel:
    """No documentation available.

    :param label: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            label: str,
            required: bool,
            disabled: bool,
            tooltip: str,
    ):
        self.label = label
        self.required = required
        self.disabled = disabled
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('FormLabel.label is required.')
        if self.required is None:
            raise ValueError('FormLabel.required is required.')
        if self.disabled is None:
            raise ValueError('FormLabel.disabled is required.')
        if self.tooltip is None:
            raise ValueError('FormLabel.tooltip is required.')
        return _dump(
            label=self.label,
            required=self.required,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormLabel':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormLabel.label is required.')
        __d_required: Any = __d.get('required')
        if __d_required is None:
            raise ValueError('FormLabel.required is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormLabel.disabled is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormLabel.tooltip is required.')
        label: str = __d_label
        required: bool = __d_required
        disabled: bool = __d_disabled
        tooltip: str = __d_tooltip
        return FormLabel(
            label,
            required,
            disabled,
            tooltip,
        )


class FormSeparator:
    """No documentation available.

    :param label: No documentation available.
    """
    def __init__(
            self,
            label: str,
    ):
        self.label = label

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('FormSeparator.label is required.')
        return _dump(
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormSeparator':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormSeparator.label is required.')
        label: str = __d_label
        return FormSeparator(
            label,
        )


class FormProgress:
    """No documentation available.

    :param label: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            label: str,
            caption: str,
            value: float,
            tooltip: str,
    ):
        self.label = label
        self.caption = caption
        self.value = value
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('FormProgress.label is required.')
        if self.caption is None:
            raise ValueError('FormProgress.caption is required.')
        if self.value is None:
            raise ValueError('FormProgress.value is required.')
        if self.tooltip is None:
            raise ValueError('FormProgress.tooltip is required.')
        return _dump(
            label=self.label,
            caption=self.caption,
            value=self.value,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormProgress':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormProgress.label is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('FormProgress.caption is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormProgress.value is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormProgress.tooltip is required.')
        label: str = __d_label
        caption: str = __d_caption
        value: float = __d_value
        tooltip: str = __d_tooltip
        return FormProgress(
            label,
            caption,
            value,
            tooltip,
        )


class FormMessageBar:
    """No documentation available.

    :param type: No documentation available.
    :param text: No documentation available.
    """
    def __init__(
            self,
            type: str,
            text: str,
    ):
        self.type = type
        self.text = text

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.type is None:
            raise ValueError('FormMessageBar.type is required.')
        if self.text is None:
            raise ValueError('FormMessageBar.text is required.')
        return _dump(
            type=self.type,
            text=self.text,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormMessageBar':
        """Creates an instance of this class using the contents of a dict."""
        __d_type: Any = __d.get('type')
        if __d_type is None:
            raise ValueError('FormMessageBar.type is required.')
        __d_text: Any = __d.get('text')
        if __d_text is None:
            raise ValueError('FormMessageBar.text is required.')
        type: str = __d_type
        text: str = __d_text
        return FormMessageBar(
            type,
            text,
        )


class FormTextbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param mask: No documentation available.
    :param icon: No documentation available.
    :param prefix: No documentation available.
    :param suffix: No documentation available.
    :param value: No documentation available.
    :param error: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param readonly: No documentation available.
    :param multiline: No documentation available.
    :param password: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            mask: str,
            icon: str,
            prefix: str,
            suffix: str,
            value: str,
            error: str,
            required: bool,
            disabled: bool,
            readonly: bool,
            multiline: bool,
            password: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.placeholder = placeholder
        self.mask = mask
        self.icon = icon
        self.prefix = prefix
        self.suffix = suffix
        self.value = value
        self.error = error
        self.required = required
        self.disabled = disabled
        self.readonly = readonly
        self.multiline = multiline
        self.password = password
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTextbox.name is required.')
        if self.label is None:
            raise ValueError('FormTextbox.label is required.')
        if self.placeholder is None:
            raise ValueError('FormTextbox.placeholder is required.')
        if self.mask is None:
            raise ValueError('FormTextbox.mask is required.')
        if self.icon is None:
            raise ValueError('FormTextbox.icon is required.')
        if self.prefix is None:
            raise ValueError('FormTextbox.prefix is required.')
        if self.suffix is None:
            raise ValueError('FormTextbox.suffix is required.')
        if self.value is None:
            raise ValueError('FormTextbox.value is required.')
        if self.error is None:
            raise ValueError('FormTextbox.error is required.')
        if self.required is None:
            raise ValueError('FormTextbox.required is required.')
        if self.disabled is None:
            raise ValueError('FormTextbox.disabled is required.')
        if self.readonly is None:
            raise ValueError('FormTextbox.readonly is required.')
        if self.multiline is None:
            raise ValueError('FormTextbox.multiline is required.')
        if self.password is None:
            raise ValueError('FormTextbox.password is required.')
        if self.tooltip is None:
            raise ValueError('FormTextbox.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            mask=self.mask,
            icon=self.icon,
            prefix=self.prefix,
            suffix=self.suffix,
            value=self.value,
            error=self.error,
            required=self.required,
            disabled=self.disabled,
            readonly=self.readonly,
            multiline=self.multiline,
            password=self.password,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTextbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTextbox.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormTextbox.label is required.')
        __d_placeholder: Any = __d.get('placeholder')
        if __d_placeholder is None:
            raise ValueError('FormTextbox.placeholder is required.')
        __d_mask: Any = __d.get('mask')
        if __d_mask is None:
            raise ValueError('FormTextbox.mask is required.')
        __d_icon: Any = __d.get('icon')
        if __d_icon is None:
            raise ValueError('FormTextbox.icon is required.')
        __d_prefix: Any = __d.get('prefix')
        if __d_prefix is None:
            raise ValueError('FormTextbox.prefix is required.')
        __d_suffix: Any = __d.get('suffix')
        if __d_suffix is None:
            raise ValueError('FormTextbox.suffix is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormTextbox.value is required.')
        __d_error: Any = __d.get('error')
        if __d_error is None:
            raise ValueError('FormTextbox.error is required.')
        __d_required: Any = __d.get('required')
        if __d_required is None:
            raise ValueError('FormTextbox.required is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormTextbox.disabled is required.')
        __d_readonly: Any = __d.get('readonly')
        if __d_readonly is None:
            raise ValueError('FormTextbox.readonly is required.')
        __d_multiline: Any = __d.get('multiline')
        if __d_multiline is None:
            raise ValueError('FormTextbox.multiline is required.')
        __d_password: Any = __d.get('password')
        if __d_password is None:
            raise ValueError('FormTextbox.password is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormTextbox.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        placeholder: str = __d_placeholder
        mask: str = __d_mask
        icon: str = __d_icon
        prefix: str = __d_prefix
        suffix: str = __d_suffix
        value: str = __d_value
        error: str = __d_error
        required: bool = __d_required
        disabled: bool = __d_disabled
        readonly: bool = __d_readonly
        multiline: bool = __d_multiline
        password: bool = __d_password
        tooltip: str = __d_tooltip
        return FormTextbox(
            name,
            label,
            placeholder,
            mask,
            icon,
            prefix,
            suffix,
            value,
            error,
            required,
            disabled,
            readonly,
            multiline,
            password,
            tooltip,
        )


class FormCheckbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param indeterminate: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            value: bool,
            indeterminate: bool,
            disabled: bool,
            trigger: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.value = value
        self.indeterminate = indeterminate
        self.disabled = disabled
        self.trigger = trigger
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormCheckbox.name is required.')
        if self.label is None:
            raise ValueError('FormCheckbox.label is required.')
        if self.value is None:
            raise ValueError('FormCheckbox.value is required.')
        if self.indeterminate is None:
            raise ValueError('FormCheckbox.indeterminate is required.')
        if self.disabled is None:
            raise ValueError('FormCheckbox.disabled is required.')
        if self.trigger is None:
            raise ValueError('FormCheckbox.trigger is required.')
        if self.tooltip is None:
            raise ValueError('FormCheckbox.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            indeterminate=self.indeterminate,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormCheckbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormCheckbox.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormCheckbox.label is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormCheckbox.value is required.')
        __d_indeterminate: Any = __d.get('indeterminate')
        if __d_indeterminate is None:
            raise ValueError('FormCheckbox.indeterminate is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormCheckbox.disabled is required.')
        __d_trigger: Any = __d.get('trigger')
        if __d_trigger is None:
            raise ValueError('FormCheckbox.trigger is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormCheckbox.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        value: bool = __d_value
        indeterminate: bool = __d_indeterminate
        disabled: bool = __d_disabled
        trigger: bool = __d_trigger
        tooltip: str = __d_tooltip
        return FormCheckbox(
            name,
            label,
            value,
            indeterminate,
            disabled,
            trigger,
            tooltip,
        )


class FormToggle:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            value: bool,
            disabled: bool,
            trigger: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.value = value
        self.disabled = disabled
        self.trigger = trigger
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormToggle.name is required.')
        if self.label is None:
            raise ValueError('FormToggle.label is required.')
        if self.value is None:
            raise ValueError('FormToggle.value is required.')
        if self.disabled is None:
            raise ValueError('FormToggle.disabled is required.')
        if self.trigger is None:
            raise ValueError('FormToggle.trigger is required.')
        if self.tooltip is None:
            raise ValueError('FormToggle.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormToggle':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormToggle.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormToggle.label is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormToggle.value is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormToggle.disabled is required.')
        __d_trigger: Any = __d.get('trigger')
        if __d_trigger is None:
            raise ValueError('FormToggle.trigger is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormToggle.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        value: bool = __d_value
        disabled: bool = __d_disabled
        trigger: bool = __d_trigger
        tooltip: str = __d_tooltip
        return FormToggle(
            name,
            label,
            value,
            disabled,
            trigger,
            tooltip,
        )


class FormChoice:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param disabled: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            disabled: bool,
    ):
        self.name = name
        self.label = label
        self.disabled = disabled

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormChoice.name is required.')
        if self.label is None:
            raise ValueError('FormChoice.label is required.')
        if self.disabled is None:
            raise ValueError('FormChoice.disabled is required.')
        return _dump(
            name=self.name,
            label=self.label,
            disabled=self.disabled,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormChoice':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormChoice.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormChoice.label is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormChoice.disabled is required.')
        name: str = __d_name
        label: str = __d_label
        disabled: bool = __d_disabled
        return FormChoice(
            name,
            label,
            disabled,
        )


class FormChoiceGroup:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param required: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            value: str,
            choices: List[FormChoice],
            required: bool,
            trigger: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.value = value
        self.choices = choices
        self.required = required
        self.trigger = trigger
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormChoiceGroup.name is required.')
        if self.label is None:
            raise ValueError('FormChoiceGroup.label is required.')
        if self.value is None:
            raise ValueError('FormChoiceGroup.value is required.')
        if self.choices is None:
            raise ValueError('FormChoiceGroup.choices is required.')
        if self.required is None:
            raise ValueError('FormChoiceGroup.required is required.')
        if self.trigger is None:
            raise ValueError('FormChoiceGroup.trigger is required.')
        if self.tooltip is None:
            raise ValueError('FormChoiceGroup.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=[__e.dump() for __e in self.choices],
            required=self.required,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormChoiceGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormChoiceGroup.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormChoiceGroup.label is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormChoiceGroup.value is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('FormChoiceGroup.choices is required.')
        __d_required: Any = __d.get('required')
        if __d_required is None:
            raise ValueError('FormChoiceGroup.required is required.')
        __d_trigger: Any = __d.get('trigger')
        if __d_trigger is None:
            raise ValueError('FormChoiceGroup.trigger is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormChoiceGroup.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        value: str = __d_value
        choices: List[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
        required: bool = __d_required
        trigger: bool = __d_trigger
        tooltip: str = __d_tooltip
        return FormChoiceGroup(
            name,
            label,
            value,
            choices,
            required,
            trigger,
            tooltip,
        )


class FormChecklist:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param values: No documentation available.
    :param choices: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            values: List[str],
            choices: List[FormChoice],
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.values = values
        self.choices = choices
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormChecklist.name is required.')
        if self.label is None:
            raise ValueError('FormChecklist.label is required.')
        if self.values is None:
            raise ValueError('FormChecklist.values is required.')
        if self.choices is None:
            raise ValueError('FormChecklist.choices is required.')
        if self.tooltip is None:
            raise ValueError('FormChecklist.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            values=self.values,
            choices=[__e.dump() for __e in self.choices],
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormChecklist':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormChecklist.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormChecklist.label is required.')
        __d_values: Any = __d.get('values')
        if __d_values is None:
            raise ValueError('FormChecklist.values is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('FormChecklist.choices is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormChecklist.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        values: List[str] = __d_values
        choices: List[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
        tooltip: str = __d_tooltip
        return FormChecklist(
            name,
            label,
            values,
            choices,
            tooltip,
        )


class FormDropdown:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param multiple: No documentation available.
    :param value: No documentation available.
    :param values: No documentation available.
    :param choices: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            multiple: bool,
            value: str,
            values: List[str],
            choices: List[FormChoice],
            required: bool,
            disabled: bool,
            trigger: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.placeholder = placeholder
        self.multiple = multiple
        self.value = value
        self.values = values
        self.choices = choices
        self.required = required
        self.disabled = disabled
        self.trigger = trigger
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormDropdown.name is required.')
        if self.label is None:
            raise ValueError('FormDropdown.label is required.')
        if self.placeholder is None:
            raise ValueError('FormDropdown.placeholder is required.')
        if self.multiple is None:
            raise ValueError('FormDropdown.multiple is required.')
        if self.value is None:
            raise ValueError('FormDropdown.value is required.')
        if self.values is None:
            raise ValueError('FormDropdown.values is required.')
        if self.choices is None:
            raise ValueError('FormDropdown.choices is required.')
        if self.required is None:
            raise ValueError('FormDropdown.required is required.')
        if self.disabled is None:
            raise ValueError('FormDropdown.disabled is required.')
        if self.trigger is None:
            raise ValueError('FormDropdown.trigger is required.')
        if self.tooltip is None:
            raise ValueError('FormDropdown.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            multiple=self.multiple,
            value=self.value,
            values=self.values,
            choices=[__e.dump() for __e in self.choices],
            required=self.required,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormDropdown':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormDropdown.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormDropdown.label is required.')
        __d_placeholder: Any = __d.get('placeholder')
        if __d_placeholder is None:
            raise ValueError('FormDropdown.placeholder is required.')
        __d_multiple: Any = __d.get('multiple')
        if __d_multiple is None:
            raise ValueError('FormDropdown.multiple is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormDropdown.value is required.')
        __d_values: Any = __d.get('values')
        if __d_values is None:
            raise ValueError('FormDropdown.values is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('FormDropdown.choices is required.')
        __d_required: Any = __d.get('required')
        if __d_required is None:
            raise ValueError('FormDropdown.required is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormDropdown.disabled is required.')
        __d_trigger: Any = __d.get('trigger')
        if __d_trigger is None:
            raise ValueError('FormDropdown.trigger is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormDropdown.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        placeholder: str = __d_placeholder
        multiple: bool = __d_multiple
        value: str = __d_value
        values: List[str] = __d_values
        choices: List[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
        required: bool = __d_required
        disabled: bool = __d_disabled
        trigger: bool = __d_trigger
        tooltip: str = __d_tooltip
        return FormDropdown(
            name,
            label,
            placeholder,
            multiple,
            value,
            values,
            choices,
            required,
            disabled,
            trigger,
            tooltip,
        )


class FormCombobox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param error: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            value: str,
            choices: List[str],
            error: str,
            disabled: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.placeholder = placeholder
        self.value = value
        self.choices = choices
        self.error = error
        self.disabled = disabled
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormCombobox.name is required.')
        if self.label is None:
            raise ValueError('FormCombobox.label is required.')
        if self.placeholder is None:
            raise ValueError('FormCombobox.placeholder is required.')
        if self.value is None:
            raise ValueError('FormCombobox.value is required.')
        if self.choices is None:
            raise ValueError('FormCombobox.choices is required.')
        if self.error is None:
            raise ValueError('FormCombobox.error is required.')
        if self.disabled is None:
            raise ValueError('FormCombobox.disabled is required.')
        if self.tooltip is None:
            raise ValueError('FormCombobox.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            choices=self.choices,
            error=self.error,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormCombobox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormCombobox.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormCombobox.label is required.')
        __d_placeholder: Any = __d.get('placeholder')
        if __d_placeholder is None:
            raise ValueError('FormCombobox.placeholder is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormCombobox.value is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('FormCombobox.choices is required.')
        __d_error: Any = __d.get('error')
        if __d_error is None:
            raise ValueError('FormCombobox.error is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormCombobox.disabled is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormCombobox.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        placeholder: str = __d_placeholder
        value: str = __d_value
        choices: List[str] = __d_choices
        error: str = __d_error
        disabled: bool = __d_disabled
        tooltip: str = __d_tooltip
        return FormCombobox(
            name,
            label,
            placeholder,
            value,
            choices,
            error,
            disabled,
            tooltip,
        )


class FormSlider:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param min: No documentation available.
    :param max: No documentation available.
    :param step: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            min: float,
            max: float,
            step: float,
            value: float,
            disabled: bool,
            trigger: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.min = min
        self.max = max
        self.step = step
        self.value = value
        self.disabled = disabled
        self.trigger = trigger
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormSlider.name is required.')
        if self.label is None:
            raise ValueError('FormSlider.label is required.')
        if self.min is None:
            raise ValueError('FormSlider.min is required.')
        if self.max is None:
            raise ValueError('FormSlider.max is required.')
        if self.step is None:
            raise ValueError('FormSlider.step is required.')
        if self.value is None:
            raise ValueError('FormSlider.value is required.')
        if self.disabled is None:
            raise ValueError('FormSlider.disabled is required.')
        if self.trigger is None:
            raise ValueError('FormSlider.trigger is required.')
        if self.tooltip is None:
            raise ValueError('FormSlider.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormSlider':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormSlider.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormSlider.label is required.')
        __d_min: Any = __d.get('min')
        if __d_min is None:
            raise ValueError('FormSlider.min is required.')
        __d_max: Any = __d.get('max')
        if __d_max is None:
            raise ValueError('FormSlider.max is required.')
        __d_step: Any = __d.get('step')
        if __d_step is None:
            raise ValueError('FormSlider.step is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormSlider.value is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormSlider.disabled is required.')
        __d_trigger: Any = __d.get('trigger')
        if __d_trigger is None:
            raise ValueError('FormSlider.trigger is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormSlider.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        min: float = __d_min
        max: float = __d_max
        step: float = __d_step
        value: float = __d_value
        disabled: bool = __d_disabled
        trigger: bool = __d_trigger
        tooltip: str = __d_tooltip
        return FormSlider(
            name,
            label,
            min,
            max,
            step,
            value,
            disabled,
            trigger,
            tooltip,
        )


class FormSpinbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param min: No documentation available.
    :param max: No documentation available.
    :param step: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            min: float,
            max: float,
            step: float,
            value: float,
            disabled: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.min = min
        self.max = max
        self.step = step
        self.value = value
        self.disabled = disabled
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormSpinbox.name is required.')
        if self.label is None:
            raise ValueError('FormSpinbox.label is required.')
        if self.min is None:
            raise ValueError('FormSpinbox.min is required.')
        if self.max is None:
            raise ValueError('FormSpinbox.max is required.')
        if self.step is None:
            raise ValueError('FormSpinbox.step is required.')
        if self.value is None:
            raise ValueError('FormSpinbox.value is required.')
        if self.disabled is None:
            raise ValueError('FormSpinbox.disabled is required.')
        if self.tooltip is None:
            raise ValueError('FormSpinbox.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            value=self.value,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormSpinbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormSpinbox.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormSpinbox.label is required.')
        __d_min: Any = __d.get('min')
        if __d_min is None:
            raise ValueError('FormSpinbox.min is required.')
        __d_max: Any = __d.get('max')
        if __d_max is None:
            raise ValueError('FormSpinbox.max is required.')
        __d_step: Any = __d.get('step')
        if __d_step is None:
            raise ValueError('FormSpinbox.step is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormSpinbox.value is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormSpinbox.disabled is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormSpinbox.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        min: float = __d_min
        max: float = __d_max
        step: float = __d_step
        value: float = __d_value
        disabled: bool = __d_disabled
        tooltip: str = __d_tooltip
        return FormSpinbox(
            name,
            label,
            min,
            max,
            step,
            value,
            disabled,
            tooltip,
        )


class FormDatePicker:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            value: str,
            disabled: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.placeholder = placeholder
        self.value = value
        self.disabled = disabled
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormDatePicker.name is required.')
        if self.label is None:
            raise ValueError('FormDatePicker.label is required.')
        if self.placeholder is None:
            raise ValueError('FormDatePicker.placeholder is required.')
        if self.value is None:
            raise ValueError('FormDatePicker.value is required.')
        if self.disabled is None:
            raise ValueError('FormDatePicker.disabled is required.')
        if self.tooltip is None:
            raise ValueError('FormDatePicker.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormDatePicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormDatePicker.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormDatePicker.label is required.')
        __d_placeholder: Any = __d.get('placeholder')
        if __d_placeholder is None:
            raise ValueError('FormDatePicker.placeholder is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormDatePicker.value is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormDatePicker.disabled is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormDatePicker.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        placeholder: str = __d_placeholder
        value: str = __d_value
        disabled: bool = __d_disabled
        tooltip: str = __d_tooltip
        return FormDatePicker(
            name,
            label,
            placeholder,
            value,
            disabled,
            tooltip,
        )


class FormColorPicker:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            value: str,
            choices: List[str],
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.value = value
        self.choices = choices
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormColorPicker.name is required.')
        if self.label is None:
            raise ValueError('FormColorPicker.label is required.')
        if self.value is None:
            raise ValueError('FormColorPicker.value is required.')
        if self.choices is None:
            raise ValueError('FormColorPicker.choices is required.')
        if self.tooltip is None:
            raise ValueError('FormColorPicker.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=self.choices,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormColorPicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormColorPicker.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormColorPicker.label is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormColorPicker.value is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('FormColorPicker.choices is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormColorPicker.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        value: str = __d_value
        choices: List[str] = __d_choices
        tooltip: str = __d_tooltip
        return FormColorPicker(
            name,
            label,
            value,
            choices,
            tooltip,
        )


class FormButton:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param caption: No documentation available.
    :param primary: No documentation available.
    :param disabled: No documentation available.
    :param link: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            caption: str,
            primary: bool,
            disabled: bool,
            link: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.caption = caption
        self.primary = primary
        self.disabled = disabled
        self.link = link
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormButton.name is required.')
        if self.label is None:
            raise ValueError('FormButton.label is required.')
        if self.caption is None:
            raise ValueError('FormButton.caption is required.')
        if self.primary is None:
            raise ValueError('FormButton.primary is required.')
        if self.disabled is None:
            raise ValueError('FormButton.disabled is required.')
        if self.link is None:
            raise ValueError('FormButton.link is required.')
        if self.tooltip is None:
            raise ValueError('FormButton.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            primary=self.primary,
            disabled=self.disabled,
            link=self.link,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormButton':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormButton.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormButton.label is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('FormButton.caption is required.')
        __d_primary: Any = __d.get('primary')
        if __d_primary is None:
            raise ValueError('FormButton.primary is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormButton.disabled is required.')
        __d_link: Any = __d.get('link')
        if __d_link is None:
            raise ValueError('FormButton.link is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormButton.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        caption: str = __d_caption
        primary: bool = __d_primary
        disabled: bool = __d_disabled
        link: bool = __d_link
        tooltip: str = __d_tooltip
        return FormButton(
            name,
            label,
            caption,
            primary,
            disabled,
            link,
            tooltip,
        )


class FormButtons:
    """No documentation available.

    :param buttons: No documentation available.
    """
    def __init__(
            self,
            buttons: List[FormButton],
    ):
        self.buttons = buttons

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.buttons is None:
            raise ValueError('FormButtons.buttons is required.')
        return _dump(
            buttons=[__e.dump() for __e in self.buttons],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormButtons':
        """Creates an instance of this class using the contents of a dict."""
        __d_buttons: Any = __d.get('buttons')
        if __d_buttons is None:
            raise ValueError('FormButtons.buttons is required.')
        buttons: List[FormButton] = [FormButton.load(__e) for __e in __d_buttons]
        return FormButtons(
            buttons,
        )


class FormFileUpload:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param multiple: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            multiple: bool,
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.multiple = multiple
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormFileUpload.name is required.')
        if self.label is None:
            raise ValueError('FormFileUpload.label is required.')
        if self.multiple is None:
            raise ValueError('FormFileUpload.multiple is required.')
        if self.tooltip is None:
            raise ValueError('FormFileUpload.tooltip is required.')
        return _dump(
            name=self.name,
            label=self.label,
            multiple=self.multiple,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormFileUpload':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormFileUpload.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormFileUpload.label is required.')
        __d_multiple: Any = __d.get('multiple')
        if __d_multiple is None:
            raise ValueError('FormFileUpload.multiple is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormFileUpload.tooltip is required.')
        name: str = __d_name
        label: str = __d_label
        multiple: bool = __d_multiple
        tooltip: str = __d_tooltip
        return FormFileUpload(
            name,
            label,
            multiple,
            tooltip,
        )


class FormTableColumn:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        self.label = label

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTableColumn.name is required.')
        if self.label is None:
            raise ValueError('FormTableColumn.label is required.')
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTableColumn':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTableColumn.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormTableColumn.label is required.')
        name: str = __d_name
        label: str = __d_label
        return FormTableColumn(
            name,
            label,
        )


class FormTableRow:
    """No documentation available.

    :param name: No documentation available.
    :param cells: No documentation available.
    """
    def __init__(
            self,
            name: str,
            cells: List[str],
    ):
        self.name = name
        self.cells = cells

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTableRow.name is required.')
        if self.cells is None:
            raise ValueError('FormTableRow.cells is required.')
        return _dump(
            name=self.name,
            cells=self.cells,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTableRow':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTableRow.name is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('FormTableRow.cells is required.')
        name: str = __d_name
        cells: List[str] = __d_cells
        return FormTableRow(
            name,
            cells,
        )


class FormTable:
    """No documentation available.

    :param name: No documentation available.
    :param columns: No documentation available.
    :param rows: No documentation available.
    :param multiple: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            name: str,
            columns: List[FormTableColumn],
            rows: List[FormTableRow],
            multiple: bool,
            tooltip: str,
    ):
        self.name = name
        self.columns = columns
        self.rows = rows
        self.multiple = multiple
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTable.name is required.')
        if self.columns is None:
            raise ValueError('FormTable.columns is required.')
        if self.rows is None:
            raise ValueError('FormTable.rows is required.')
        if self.multiple is None:
            raise ValueError('FormTable.multiple is required.')
        if self.tooltip is None:
            raise ValueError('FormTable.tooltip is required.')
        return _dump(
            name=self.name,
            columns=[__e.dump() for __e in self.columns],
            rows=[__e.dump() for __e in self.rows],
            multiple=self.multiple,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTable':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTable.name is required.')
        __d_columns: Any = __d.get('columns')
        if __d_columns is None:
            raise ValueError('FormTable.columns is required.')
        __d_rows: Any = __d.get('rows')
        if __d_rows is None:
            raise ValueError('FormTable.rows is required.')
        __d_multiple: Any = __d.get('multiple')
        if __d_multiple is None:
            raise ValueError('FormTable.multiple is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormTable.tooltip is required.')
        name: str = __d_name
        columns: List[FormTableColumn] = [FormTableColumn.load(__e) for __e in __d_columns]
        rows: List[FormTableRow] = [FormTableRow.load(__e) for __e in __d_rows]
        multiple: bool = __d_multiple
        tooltip: str = __d_tooltip
        return FormTable(
            name,
            columns,
            rows,
            multiple,
            tooltip,
        )


class FormLink:
    """No documentation available.

    :param label: No documentation available.
    :param path: No documentation available.
    :param disabled: No documentation available.
    :param button: No documentation available.
    :param tooltip: No documentation available.
    """
    def __init__(
            self,
            label: str,
            path: str,
            disabled: bool,
            button: bool,
            tooltip: str,
    ):
        self.label = label
        self.path = path
        self.disabled = disabled
        self.button = button
        self.tooltip = tooltip

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('FormLink.label is required.')
        if self.path is None:
            raise ValueError('FormLink.path is required.')
        if self.disabled is None:
            raise ValueError('FormLink.disabled is required.')
        if self.button is None:
            raise ValueError('FormLink.button is required.')
        if self.tooltip is None:
            raise ValueError('FormLink.tooltip is required.')
        return _dump(
            label=self.label,
            path=self.path,
            disabled=self.disabled,
            button=self.button,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormLink':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormLink.label is required.')
        __d_path: Any = __d.get('path')
        if __d_path is None:
            raise ValueError('FormLink.path is required.')
        __d_disabled: Any = __d.get('disabled')
        if __d_disabled is None:
            raise ValueError('FormLink.disabled is required.')
        __d_button: Any = __d.get('button')
        if __d_button is None:
            raise ValueError('FormLink.button is required.')
        __d_tooltip: Any = __d.get('tooltip')
        if __d_tooltip is None:
            raise ValueError('FormLink.tooltip is required.')
        label: str = __d_label
        path: str = __d_path
        disabled: bool = __d_disabled
        button: bool = __d_button
        tooltip: str = __d_tooltip
        return FormLink(
            label,
            path,
            disabled,
            button,
            tooltip,
        )


class FormTab:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param icon: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            icon: str,
    ):
        self.name = name
        self.label = label
        self.icon = icon

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTab.name is required.')
        if self.label is None:
            raise ValueError('FormTab.label is required.')
        if self.icon is None:
            raise ValueError('FormTab.icon is required.')
        return _dump(
            name=self.name,
            label=self.label,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTab':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTab.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormTab.label is required.')
        __d_icon: Any = __d.get('icon')
        if __d_icon is None:
            raise ValueError('FormTab.icon is required.')
        name: str = __d_name
        label: str = __d_label
        icon: str = __d_icon
        return FormTab(
            name,
            label,
            icon,
        )


class FormTabs:
    """No documentation available.

    :param name: No documentation available.
    :param value: No documentation available.
    :param items: No documentation available.
    """
    def __init__(
            self,
            name: str,
            value: str,
            items: List[FormTab],
    ):
        self.name = name
        self.value = value
        self.items = items

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormTabs.name is required.')
        if self.value is None:
            raise ValueError('FormTabs.value is required.')
        if self.items is None:
            raise ValueError('FormTabs.items is required.')
        return _dump(
            name=self.name,
            value=self.value,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTabs':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTabs.name is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('FormTabs.value is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('FormTabs.items is required.')
        name: str = __d_name
        value: str = __d_value
        items: List[FormTab] = [FormTab.load(__e) for __e in __d_items]
        return FormTabs(
            name,
            value,
            items,
        )


class FormExpander:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param expanded: No documentation available.
    :param items: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
            expanded: bool,
            items: List['FormComponent'],
    ):
        self.name = name
        self.label = label
        self.expanded = expanded
        self.items = items

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormExpander.name is required.')
        if self.label is None:
            raise ValueError('FormExpander.label is required.')
        if self.expanded is None:
            raise ValueError('FormExpander.expanded is required.')
        if self.items is None:
            raise ValueError('FormExpander.items is required.')
        return _dump(
            name=self.name,
            label=self.label,
            expanded=self.expanded,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormExpander':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormExpander.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormExpander.label is required.')
        __d_expanded: Any = __d.get('expanded')
        if __d_expanded is None:
            raise ValueError('FormExpander.expanded is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('FormExpander.items is required.')
        name: str = __d_name
        label: str = __d_label
        expanded: bool = __d_expanded
        items: List['FormComponent'] = [FormComponent.load(__e) for __e in __d_items]
        return FormExpander(
            name,
            label,
            expanded,
            items,
        )


class FormNavItem:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        self.label = label

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormNavItem.name is required.')
        if self.label is None:
            raise ValueError('FormNavItem.label is required.')
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormNavItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormNavItem.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormNavItem.label is required.')
        name: str = __d_name
        label: str = __d_label
        return FormNavItem(
            name,
            label,
        )


class FormNavGroup:
    """No documentation available.

    :param label: No documentation available.
    :param items: No documentation available.
    """
    def __init__(
            self,
            label: str,
            items: List[FormNavItem],
    ):
        self.label = label
        self.items = items

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('FormNavGroup.label is required.')
        if self.items is None:
            raise ValueError('FormNavGroup.items is required.')
        return _dump(
            label=self.label,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormNavGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormNavGroup.label is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('FormNavGroup.items is required.')
        label: str = __d_label
        items: List[FormNavItem] = [FormNavItem.load(__e) for __e in __d_items]
        return FormNavGroup(
            label,
            items,
        )


class FormNav:
    """No documentation available.

    :param name: No documentation available.
    :param items: No documentation available.
    """
    def __init__(
            self,
            name: str,
            items: List[FormNavGroup],
    ):
        self.name = name
        self.items = items

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FormNav.name is required.')
        if self.items is None:
            raise ValueError('FormNav.items is required.')
        return _dump(
            name=self.name,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormNav':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormNav.name is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('FormNav.items is required.')
        name: str = __d_name
        items: List[FormNavGroup] = [FormNavGroup.load(__e) for __e in __d_items]
        return FormNav(
            name,
            items,
        )


class FormComponent:
    """No documentation available.

    :param text: No documentation available.
    :param label: No documentation available.
    :param separator: No documentation available.
    :param progress: No documentation available.
    :param message_bar: No documentation available.
    :param textbox: No documentation available.
    :param checkbox: No documentation available.
    :param toggle: No documentation available.
    :param choice_group: No documentation available.
    :param checklist: No documentation available.
    :param dropdown: No documentation available.
    :param combobox: No documentation available.
    :param slider: No documentation available.
    :param spinbox: No documentation available.
    :param date_picker: No documentation available.
    :param color_picker: No documentation available.
    :param buttons: No documentation available.
    :param file_upload: No documentation available.
    :param table: No documentation available.
    :param link: No documentation available.
    :param tabs: No documentation available.
    :param button: No documentation available.
    :param expander: No documentation available.
    :param nav: No documentation available.
    """
    def __init__(
            self,
            text: Optional[FormText] = None,
            label: Optional[FormLabel] = None,
            separator: Optional[FormSeparator] = None,
            progress: Optional[FormProgress] = None,
            message_bar: Optional[FormMessageBar] = None,
            textbox: Optional[FormTextbox] = None,
            checkbox: Optional[FormCheckbox] = None,
            toggle: Optional[FormToggle] = None,
            choice_group: Optional[FormChoiceGroup] = None,
            checklist: Optional[FormChecklist] = None,
            dropdown: Optional[FormDropdown] = None,
            combobox: Optional[FormCombobox] = None,
            slider: Optional[FormSlider] = None,
            spinbox: Optional[FormSpinbox] = None,
            date_picker: Optional[FormDatePicker] = None,
            color_picker: Optional[FormColorPicker] = None,
            buttons: Optional[FormButtons] = None,
            file_upload: Optional[FormFileUpload] = None,
            table: Optional[FormTable] = None,
            link: Optional[FormLink] = None,
            tabs: Optional[FormTabs] = None,
            button: Optional[FormButton] = None,
            expander: Optional[FormExpander] = None,
            nav: Optional[FormNav] = None,
    ):
        self.text = text
        self.label = label
        self.separator = separator
        self.progress = progress
        self.message_bar = message_bar
        self.textbox = textbox
        self.checkbox = checkbox
        self.toggle = toggle
        self.choice_group = choice_group
        self.checklist = checklist
        self.dropdown = dropdown
        self.combobox = combobox
        self.slider = slider
        self.spinbox = spinbox
        self.date_picker = date_picker
        self.color_picker = color_picker
        self.buttons = buttons
        self.file_upload = file_upload
        self.table = table
        self.link = link
        self.tabs = tabs
        self.button = button
        self.expander = expander
        self.nav = nav

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            text=None if self.text is None else self.text.dump(),
            label=None if self.label is None else self.label.dump(),
            separator=None if self.separator is None else self.separator.dump(),
            progress=None if self.progress is None else self.progress.dump(),
            message_bar=None if self.message_bar is None else self.message_bar.dump(),
            textbox=None if self.textbox is None else self.textbox.dump(),
            checkbox=None if self.checkbox is None else self.checkbox.dump(),
            toggle=None if self.toggle is None else self.toggle.dump(),
            choice_group=None if self.choice_group is None else self.choice_group.dump(),
            checklist=None if self.checklist is None else self.checklist.dump(),
            dropdown=None if self.dropdown is None else self.dropdown.dump(),
            combobox=None if self.combobox is None else self.combobox.dump(),
            slider=None if self.slider is None else self.slider.dump(),
            spinbox=None if self.spinbox is None else self.spinbox.dump(),
            date_picker=None if self.date_picker is None else self.date_picker.dump(),
            color_picker=None if self.color_picker is None else self.color_picker.dump(),
            buttons=None if self.buttons is None else self.buttons.dump(),
            file_upload=None if self.file_upload is None else self.file_upload.dump(),
            table=None if self.table is None else self.table.dump(),
            link=None if self.link is None else self.link.dump(),
            tabs=None if self.tabs is None else self.tabs.dump(),
            button=None if self.button is None else self.button.dump(),
            expander=None if self.expander is None else self.expander.dump(),
            nav=None if self.nav is None else self.nav.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'FormComponent':
        """Creates an instance of this class using the contents of a dict."""
        __d_text: Any = __d.get('text')
        __d_label: Any = __d.get('label')
        __d_separator: Any = __d.get('separator')
        __d_progress: Any = __d.get('progress')
        __d_message_bar: Any = __d.get('message_bar')
        __d_textbox: Any = __d.get('textbox')
        __d_checkbox: Any = __d.get('checkbox')
        __d_toggle: Any = __d.get('toggle')
        __d_choice_group: Any = __d.get('choice_group')
        __d_checklist: Any = __d.get('checklist')
        __d_dropdown: Any = __d.get('dropdown')
        __d_combobox: Any = __d.get('combobox')
        __d_slider: Any = __d.get('slider')
        __d_spinbox: Any = __d.get('spinbox')
        __d_date_picker: Any = __d.get('date_picker')
        __d_color_picker: Any = __d.get('color_picker')
        __d_buttons: Any = __d.get('buttons')
        __d_file_upload: Any = __d.get('file_upload')
        __d_table: Any = __d.get('table')
        __d_link: Any = __d.get('link')
        __d_tabs: Any = __d.get('tabs')
        __d_button: Any = __d.get('button')
        __d_expander: Any = __d.get('expander')
        __d_nav: Any = __d.get('nav')
        text: Optional[FormText] = None if __d_text is None else FormText.load(__d_text)
        label: Optional[FormLabel] = None if __d_label is None else FormLabel.load(__d_label)
        separator: Optional[FormSeparator] = None if __d_separator is None else FormSeparator.load(__d_separator)
        progress: Optional[FormProgress] = None if __d_progress is None else FormProgress.load(__d_progress)
        message_bar: Optional[FormMessageBar] = None if __d_message_bar is None else FormMessageBar.load(__d_message_bar)
        textbox: Optional[FormTextbox] = None if __d_textbox is None else FormTextbox.load(__d_textbox)
        checkbox: Optional[FormCheckbox] = None if __d_checkbox is None else FormCheckbox.load(__d_checkbox)
        toggle: Optional[FormToggle] = None if __d_toggle is None else FormToggle.load(__d_toggle)
        choice_group: Optional[FormChoiceGroup] = None if __d_choice_group is None else FormChoiceGroup.load(__d_choice_group)
        checklist: Optional[FormChecklist] = None if __d_checklist is None else FormChecklist.load(__d_checklist)
        dropdown: Optional[FormDropdown] = None if __d_dropdown is None else FormDropdown.load(__d_dropdown)
        combobox: Optional[FormCombobox] = None if __d_combobox is None else FormCombobox.load(__d_combobox)
        slider: Optional[FormSlider] = None if __d_slider is None else FormSlider.load(__d_slider)
        spinbox: Optional[FormSpinbox] = None if __d_spinbox is None else FormSpinbox.load(__d_spinbox)
        date_picker: Optional[FormDatePicker] = None if __d_date_picker is None else FormDatePicker.load(__d_date_picker)
        color_picker: Optional[FormColorPicker] = None if __d_color_picker is None else FormColorPicker.load(__d_color_picker)
        buttons: Optional[FormButtons] = None if __d_buttons is None else FormButtons.load(__d_buttons)
        file_upload: Optional[FormFileUpload] = None if __d_file_upload is None else FormFileUpload.load(__d_file_upload)
        table: Optional[FormTable] = None if __d_table is None else FormTable.load(__d_table)
        link: Optional[FormLink] = None if __d_link is None else FormLink.load(__d_link)
        tabs: Optional[FormTabs] = None if __d_tabs is None else FormTabs.load(__d_tabs)
        button: Optional[FormButton] = None if __d_button is None else FormButton.load(__d_button)
        expander: Optional[FormExpander] = None if __d_expander is None else FormExpander.load(__d_expander)
        nav: Optional[FormNav] = None if __d_nav is None else FormNav.load(__d_nav)
        return FormComponent(
            text,
            label,
            separator,
            progress,
            message_bar,
            textbox,
            checkbox,
            toggle,
            choice_group,
            checklist,
            dropdown,
            combobox,
            slider,
            spinbox,
            date_picker,
            color_picker,
            buttons,
            file_upload,
            table,
            link,
            tabs,
            button,
            expander,
            nav,
        )


class Form:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param url: No documentation available.
    :param args: No documentation available.
    :param items: No documentation available.
    """
    def __init__(
            self,
            box: str,
            url: str,
            args: PackedRecord,
            items: Union[List[FormComponent], str],
    ):
        self.box = box
        self.url = url
        self.args = args
        self.items = items

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Form.box is required.')
        if self.url is None:
            raise ValueError('Form.url is required.')
        if self.args is None:
            raise ValueError('Form.args is required.')
        if self.items is None:
            raise ValueError('Form.items is required.')
        return _dump(
            view='form',
            box=self.box,
            url=self.url,
            args=self.args,
            items=self.items if isinstance(self.items, str) else [__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Form':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Form.box is required.')
        __d_url: Any = __d.get('url')
        if __d_url is None:
            raise ValueError('Form.url is required.')
        __d_args: Any = __d.get('args')
        if __d_args is None:
            raise ValueError('Form.args is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('Form.items is required.')
        box: str = __d_box
        url: str = __d_url
        args: PackedRecord = __d_args
        items: Union[List[FormComponent], str] = __d_items if isinstance(__d_items, str) else [FormComponent.load(__e) for __e in __d_items]
        return Form(
            box,
            url,
            args,
            items,
        )


class ListItem1:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            caption: str,
            value: str,
            aux_value: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.caption = caption
        self.value = value
        self.aux_value = aux_value
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('ListItem1.box is required.')
        if self.title is None:
            raise ValueError('ListItem1.title is required.')
        if self.caption is None:
            raise ValueError('ListItem1.caption is required.')
        if self.value is None:
            raise ValueError('ListItem1.value is required.')
        if self.aux_value is None:
            raise ValueError('ListItem1.aux_value is required.')
        if self.data is None:
            raise ValueError('ListItem1.data is required.')
        return _dump(
            view='list_item1',
            box=self.box,
            title=self.title,
            caption=self.caption,
            value=self.value,
            aux_value=self.aux_value,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'ListItem1':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('ListItem1.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('ListItem1.title is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('ListItem1.caption is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('ListItem1.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('ListItem1.aux_value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('ListItem1.data is required.')
        box: str = __d_box
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: PackedRecord = __d_data
        return ListItem1(
            box,
            title,
            caption,
            value,
            aux_value,
            data,
        )


class Markdown:
    """Render Markdown content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
    :param data: Additional data for the card.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            data: Optional[PackedRecord] = None,
    ):
        self.box = box
        self.title = title
        self.content = content
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Markdown.box is required.')
        if self.title is None:
            raise ValueError('Markdown.title is required.')
        if self.content is None:
            raise ValueError('Markdown.content is required.')
        return _dump(
            view='markdown',
            box=self.box,
            title=self.title,
            content=self.content,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Markdown':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Markdown.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Markdown.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('Markdown.content is required.')
        __d_data: Any = __d.get('data')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        return Markdown(
            box,
            title,
            content,
            data,
        )


class Markup:
    """Render HTML content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The HTML content.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
    ):
        self.box = box
        self.title = title
        self.content = content

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Markup.box is required.')
        if self.title is None:
            raise ValueError('Markup.title is required.')
        if self.content is None:
            raise ValueError('Markup.content is required.')
        return _dump(
            view='markup',
            box=self.box,
            title=self.title,
            content=self.content,
        )

    @staticmethod
    def load(__d: Dict) -> 'Markup':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Markup.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Markup.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('Markup.content is required.')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        return Markup(
            box,
            title,
            content,
        )


class NotebookSection:
    """No documentation available.

    :param cells: No documentation available.
    :param commands: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            cells: List[Cell],
            commands: List[Command],
            data: str,
    ):
        self.cells = cells
        self.commands = commands
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.cells is None:
            raise ValueError('NotebookSection.cells is required.')
        if self.commands is None:
            raise ValueError('NotebookSection.commands is required.')
        if self.data is None:
            raise ValueError('NotebookSection.data is required.')
        return _dump(
            cells=[__e.dump() for __e in self.cells],
            commands=[__e.dump() for __e in self.commands],
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'NotebookSection':
        """Creates an instance of this class using the contents of a dict."""
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('NotebookSection.cells is required.')
        __d_commands: Any = __d.get('commands')
        if __d_commands is None:
            raise ValueError('NotebookSection.commands is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('NotebookSection.data is required.')
        cells: List[Cell] = [Cell.load(__e) for __e in __d_cells]
        commands: List[Command] = [Command.load(__e) for __e in __d_commands]
        data: str = __d_data
        return NotebookSection(
            cells,
            commands,
            data,
        )


class Notebook:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param sections: No documentation available.
    """
    def __init__(
            self,
            box: str,
            sections: List[NotebookSection],
    ):
        self.box = box
        self.sections = sections

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Notebook.box is required.')
        if self.sections is None:
            raise ValueError('Notebook.sections is required.')
        return _dump(
            view='notebook',
            box=self.box,
            sections=[__e.dump() for __e in self.sections],
        )

    @staticmethod
    def load(__d: Dict) -> 'Notebook':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Notebook.box is required.')
        __d_sections: Any = __d.get('sections')
        if __d_sections is None:
            raise ValueError('Notebook.sections is required.')
        box: str = __d_box
        sections: List[NotebookSection] = [NotebookSection.load(__e) for __e in __d_sections]
        return Notebook(
            box,
            sections,
        )


class PixelArt:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
    ):
        self.box = box
        self.title = title
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('PixelArt.box is required.')
        if self.title is None:
            raise ValueError('PixelArt.title is required.')
        if self.data is None:
            raise ValueError('PixelArt.data is required.')
        return _dump(
            view='pixel_art',
            box=self.box,
            title=self.title,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'PixelArt':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('PixelArt.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('PixelArt.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('PixelArt.data is required.')
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        return PixelArt(
            box,
            title,
            data,
        )


class PlotMark:
    """No documentation available.

    :param coord: No documentation available.
    :param mark: No documentation available.
    :param x: No documentation available.
    :param x0: No documentation available.
    :param x1: No documentation available.
    :param x2: No documentation available.
    :param x_min: No documentation available.
    :param x_max: No documentation available.
    :param x_nice: No documentation available.
    :param x_scale: No documentation available.
    :param x_title: No documentation available.
    :param y: No documentation available.
    :param y0: No documentation available.
    :param y1: No documentation available.
    :param y2: No documentation available.
    :param y_min: No documentation available.
    :param y_max: No documentation available.
    :param y_nice: No documentation available.
    :param y_scale: No documentation available.
    :param y_title: No documentation available.
    :param color: No documentation available.
    :param color_range: No documentation available.
    :param shape: No documentation available.
    :param shape_range: No documentation available.
    :param size: No documentation available.
    :param size_range: No documentation available.
    :param stack: No documentation available.
    :param dodge: No documentation available.
    :param curve: No documentation available. One of 'none', 'smooth', 'step-before', 'step', 'step-after'.
    :param fill_color: No documentation available.
    :param fill_opacity: No documentation available.
    :param stroke_color: No documentation available.
    :param stroke_opacity: No documentation available.
    :param stroke_size: No documentation available.
    :param stroke_dash: No documentation available.
    :param label: No documentation available.
    :param label_offset: No documentation available.
    :param label_offset_x: No documentation available.
    :param label_offset_y: No documentation available.
    :param label_rotation: No documentation available.
    :param label_position: No documentation available.
    :param label_overlap: No documentation available.
    :param label_fill_color: No documentation available.
    :param label_fill_opacity: No documentation available.
    :param label_stroke_color: No documentation available.
    :param label_stroke_opacity: No documentation available.
    :param label_stroke_size: No documentation available.
    :param label_font_size: No documentation available.
    :param label_font_weight: No documentation available.
    :param label_line_height: No documentation available.
    :param label_align: No documentation available.
    :param ref_stroke_color: No documentation available.
    :param ref_stroke_opacity: No documentation available.
    :param ref_stroke_size: No documentation available.
    :param ref_stroke_dash: No documentation available.
    """
    def __init__(
            self,
            coord: Optional[str] = None,
            mark: Optional[str] = None,
            x: Optional[Value] = None,
            x0: Optional[Value] = None,
            x1: Optional[Value] = None,
            x2: Optional[Value] = None,
            x_min: Optional[float] = None,
            x_max: Optional[float] = None,
            x_nice: Optional[bool] = None,
            x_scale: Optional[str] = None,
            x_title: Optional[str] = None,
            y: Optional[Value] = None,
            y0: Optional[Value] = None,
            y1: Optional[Value] = None,
            y2: Optional[Value] = None,
            y_min: Optional[float] = None,
            y_max: Optional[float] = None,
            y_nice: Optional[bool] = None,
            y_scale: Optional[str] = None,
            y_title: Optional[str] = None,
            color: Optional[str] = None,
            color_range: Optional[str] = None,
            shape: Optional[str] = None,
            shape_range: Optional[str] = None,
            size: Optional[float] = None,
            size_range: Optional[str] = None,
            stack: Optional[str] = None,
            dodge: Optional[str] = None,
            curve: Optional[str] = None,
            fill_color: Optional[str] = None,
            fill_opacity: Optional[float] = None,
            stroke_color: Optional[str] = None,
            stroke_opacity: Optional[float] = None,
            stroke_size: Optional[float] = None,
            stroke_dash: Optional[str] = None,
            label: Optional[str] = None,
            label_offset: Optional[float] = None,
            label_offset_x: Optional[float] = None,
            label_offset_y: Optional[float] = None,
            label_rotation: Optional[str] = None,
            label_position: Optional[str] = None,
            label_overlap: Optional[str] = None,
            label_fill_color: Optional[str] = None,
            label_fill_opacity: Optional[float] = None,
            label_stroke_color: Optional[str] = None,
            label_stroke_opacity: Optional[float] = None,
            label_stroke_size: Optional[float] = None,
            label_font_size: Optional[float] = None,
            label_font_weight: Optional[str] = None,
            label_line_height: Optional[float] = None,
            label_align: Optional[str] = None,
            ref_stroke_color: Optional[str] = None,
            ref_stroke_opacity: Optional[float] = None,
            ref_stroke_size: Optional[float] = None,
            ref_stroke_dash: Optional[str] = None,
    ):
        self.coord = coord
        self.mark = mark
        self.x = x
        self.x0 = x0
        self.x1 = x1
        self.x2 = x2
        self.x_min = x_min
        self.x_max = x_max
        self.x_nice = x_nice
        self.x_scale = x_scale
        self.x_title = x_title
        self.y = y
        self.y0 = y0
        self.y1 = y1
        self.y2 = y2
        self.y_min = y_min
        self.y_max = y_max
        self.y_nice = y_nice
        self.y_scale = y_scale
        self.y_title = y_title
        self.color = color
        self.color_range = color_range
        self.shape = shape
        self.shape_range = shape_range
        self.size = size
        self.size_range = size_range
        self.stack = stack
        self.dodge = dodge
        self.curve = curve
        self.fill_color = fill_color
        self.fill_opacity = fill_opacity
        self.stroke_color = stroke_color
        self.stroke_opacity = stroke_opacity
        self.stroke_size = stroke_size
        self.stroke_dash = stroke_dash
        self.label = label
        self.label_offset = label_offset
        self.label_offset_x = label_offset_x
        self.label_offset_y = label_offset_y
        self.label_rotation = label_rotation
        self.label_position = label_position
        self.label_overlap = label_overlap
        self.label_fill_color = label_fill_color
        self.label_fill_opacity = label_fill_opacity
        self.label_stroke_color = label_stroke_color
        self.label_stroke_opacity = label_stroke_opacity
        self.label_stroke_size = label_stroke_size
        self.label_font_size = label_font_size
        self.label_font_weight = label_font_weight
        self.label_line_height = label_line_height
        self.label_align = label_align
        self.ref_stroke_color = ref_stroke_color
        self.ref_stroke_opacity = ref_stroke_opacity
        self.ref_stroke_size = ref_stroke_size
        self.ref_stroke_dash = ref_stroke_dash

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            coord=self.coord,
            mark=self.mark,
            x=self.x,
            x0=self.x0,
            x1=self.x1,
            x2=self.x2,
            x_min=self.x_min,
            x_max=self.x_max,
            x_nice=self.x_nice,
            x_scale=self.x_scale,
            x_title=self.x_title,
            y=self.y,
            y0=self.y0,
            y1=self.y1,
            y2=self.y2,
            y_min=self.y_min,
            y_max=self.y_max,
            y_nice=self.y_nice,
            y_scale=self.y_scale,
            y_title=self.y_title,
            color=self.color,
            color_range=self.color_range,
            shape=self.shape,
            shape_range=self.shape_range,
            size=self.size,
            size_range=self.size_range,
            stack=self.stack,
            dodge=self.dodge,
            curve=self.curve,
            fill_color=self.fill_color,
            fill_opacity=self.fill_opacity,
            stroke_color=self.stroke_color,
            stroke_opacity=self.stroke_opacity,
            stroke_size=self.stroke_size,
            stroke_dash=self.stroke_dash,
            label=self.label,
            label_offset=self.label_offset,
            label_offset_x=self.label_offset_x,
            label_offset_y=self.label_offset_y,
            label_rotation=self.label_rotation,
            label_position=self.label_position,
            label_overlap=self.label_overlap,
            label_fill_color=self.label_fill_color,
            label_fill_opacity=self.label_fill_opacity,
            label_stroke_color=self.label_stroke_color,
            label_stroke_opacity=self.label_stroke_opacity,
            label_stroke_size=self.label_stroke_size,
            label_font_size=self.label_font_size,
            label_font_weight=self.label_font_weight,
            label_line_height=self.label_line_height,
            label_align=self.label_align,
            ref_stroke_color=self.ref_stroke_color,
            ref_stroke_opacity=self.ref_stroke_opacity,
            ref_stroke_size=self.ref_stroke_size,
            ref_stroke_dash=self.ref_stroke_dash,
        )

    @staticmethod
    def load(__d: Dict) -> 'PlotMark':
        """Creates an instance of this class using the contents of a dict."""
        __d_coord: Any = __d.get('coord')
        __d_mark: Any = __d.get('mark')
        __d_x: Any = __d.get('x')
        __d_x0: Any = __d.get('x0')
        __d_x1: Any = __d.get('x1')
        __d_x2: Any = __d.get('x2')
        __d_x_min: Any = __d.get('x_min')
        __d_x_max: Any = __d.get('x_max')
        __d_x_nice: Any = __d.get('x_nice')
        __d_x_scale: Any = __d.get('x_scale')
        __d_x_title: Any = __d.get('x_title')
        __d_y: Any = __d.get('y')
        __d_y0: Any = __d.get('y0')
        __d_y1: Any = __d.get('y1')
        __d_y2: Any = __d.get('y2')
        __d_y_min: Any = __d.get('y_min')
        __d_y_max: Any = __d.get('y_max')
        __d_y_nice: Any = __d.get('y_nice')
        __d_y_scale: Any = __d.get('y_scale')
        __d_y_title: Any = __d.get('y_title')
        __d_color: Any = __d.get('color')
        __d_color_range: Any = __d.get('color_range')
        __d_shape: Any = __d.get('shape')
        __d_shape_range: Any = __d.get('shape_range')
        __d_size: Any = __d.get('size')
        __d_size_range: Any = __d.get('size_range')
        __d_stack: Any = __d.get('stack')
        __d_dodge: Any = __d.get('dodge')
        __d_curve: Any = __d.get('curve')
        __d_fill_color: Any = __d.get('fill_color')
        __d_fill_opacity: Any = __d.get('fill_opacity')
        __d_stroke_color: Any = __d.get('stroke_color')
        __d_stroke_opacity: Any = __d.get('stroke_opacity')
        __d_stroke_size: Any = __d.get('stroke_size')
        __d_stroke_dash: Any = __d.get('stroke_dash')
        __d_label: Any = __d.get('label')
        __d_label_offset: Any = __d.get('label_offset')
        __d_label_offset_x: Any = __d.get('label_offset_x')
        __d_label_offset_y: Any = __d.get('label_offset_y')
        __d_label_rotation: Any = __d.get('label_rotation')
        __d_label_position: Any = __d.get('label_position')
        __d_label_overlap: Any = __d.get('label_overlap')
        __d_label_fill_color: Any = __d.get('label_fill_color')
        __d_label_fill_opacity: Any = __d.get('label_fill_opacity')
        __d_label_stroke_color: Any = __d.get('label_stroke_color')
        __d_label_stroke_opacity: Any = __d.get('label_stroke_opacity')
        __d_label_stroke_size: Any = __d.get('label_stroke_size')
        __d_label_font_size: Any = __d.get('label_font_size')
        __d_label_font_weight: Any = __d.get('label_font_weight')
        __d_label_line_height: Any = __d.get('label_line_height')
        __d_label_align: Any = __d.get('label_align')
        __d_ref_stroke_color: Any = __d.get('ref_stroke_color')
        __d_ref_stroke_opacity: Any = __d.get('ref_stroke_opacity')
        __d_ref_stroke_size: Any = __d.get('ref_stroke_size')
        __d_ref_stroke_dash: Any = __d.get('ref_stroke_dash')
        coord: Optional[str] = __d_coord
        mark: Optional[str] = __d_mark
        x: Optional[Value] = __d_x
        x0: Optional[Value] = __d_x0
        x1: Optional[Value] = __d_x1
        x2: Optional[Value] = __d_x2
        x_min: Optional[float] = __d_x_min
        x_max: Optional[float] = __d_x_max
        x_nice: Optional[bool] = __d_x_nice
        x_scale: Optional[str] = __d_x_scale
        x_title: Optional[str] = __d_x_title
        y: Optional[Value] = __d_y
        y0: Optional[Value] = __d_y0
        y1: Optional[Value] = __d_y1
        y2: Optional[Value] = __d_y2
        y_min: Optional[float] = __d_y_min
        y_max: Optional[float] = __d_y_max
        y_nice: Optional[bool] = __d_y_nice
        y_scale: Optional[str] = __d_y_scale
        y_title: Optional[str] = __d_y_title
        color: Optional[str] = __d_color
        color_range: Optional[str] = __d_color_range
        shape: Optional[str] = __d_shape
        shape_range: Optional[str] = __d_shape_range
        size: Optional[float] = __d_size
        size_range: Optional[str] = __d_size_range
        stack: Optional[str] = __d_stack
        dodge: Optional[str] = __d_dodge
        curve: Optional[str] = __d_curve
        fill_color: Optional[str] = __d_fill_color
        fill_opacity: Optional[float] = __d_fill_opacity
        stroke_color: Optional[str] = __d_stroke_color
        stroke_opacity: Optional[float] = __d_stroke_opacity
        stroke_size: Optional[float] = __d_stroke_size
        stroke_dash: Optional[str] = __d_stroke_dash
        label: Optional[str] = __d_label
        label_offset: Optional[float] = __d_label_offset
        label_offset_x: Optional[float] = __d_label_offset_x
        label_offset_y: Optional[float] = __d_label_offset_y
        label_rotation: Optional[str] = __d_label_rotation
        label_position: Optional[str] = __d_label_position
        label_overlap: Optional[str] = __d_label_overlap
        label_fill_color: Optional[str] = __d_label_fill_color
        label_fill_opacity: Optional[float] = __d_label_fill_opacity
        label_stroke_color: Optional[str] = __d_label_stroke_color
        label_stroke_opacity: Optional[float] = __d_label_stroke_opacity
        label_stroke_size: Optional[float] = __d_label_stroke_size
        label_font_size: Optional[float] = __d_label_font_size
        label_font_weight: Optional[str] = __d_label_font_weight
        label_line_height: Optional[float] = __d_label_line_height
        label_align: Optional[str] = __d_label_align
        ref_stroke_color: Optional[str] = __d_ref_stroke_color
        ref_stroke_opacity: Optional[float] = __d_ref_stroke_opacity
        ref_stroke_size: Optional[float] = __d_ref_stroke_size
        ref_stroke_dash: Optional[str] = __d_ref_stroke_dash
        return PlotMark(
            coord,
            mark,
            x,
            x0,
            x1,
            x2,
            x_min,
            x_max,
            x_nice,
            x_scale,
            x_title,
            y,
            y0,
            y1,
            y2,
            y_min,
            y_max,
            y_nice,
            y_scale,
            y_title,
            color,
            color_range,
            shape,
            shape_range,
            size,
            size_range,
            stack,
            dodge,
            curve,
            fill_color,
            fill_opacity,
            stroke_color,
            stroke_opacity,
            stroke_size,
            stroke_dash,
            label,
            label_offset,
            label_offset_x,
            label_offset_y,
            label_rotation,
            label_position,
            label_overlap,
            label_fill_color,
            label_fill_opacity,
            label_stroke_color,
            label_stroke_opacity,
            label_stroke_size,
            label_font_size,
            label_font_weight,
            label_line_height,
            label_align,
            ref_stroke_color,
            ref_stroke_opacity,
            ref_stroke_size,
            ref_stroke_dash,
        )


class PlotVis:
    """No documentation available.

    :param marks: No documentation available.
    """
    def __init__(
            self,
            marks: List[PlotMark],
    ):
        self.marks = marks

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.marks is None:
            raise ValueError('PlotVis.marks is required.')
        return _dump(
            marks=[__e.dump() for __e in self.marks],
        )

    @staticmethod
    def load(__d: Dict) -> 'PlotVis':
        """Creates an instance of this class using the contents of a dict."""
        __d_marks: Any = __d.get('marks')
        if __d_marks is None:
            raise ValueError('PlotVis.marks is required.')
        marks: List[PlotMark] = [PlotMark.load(__e) for __e in __d_marks]
        return PlotVis(
            marks,
        )


class Plot:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    :param vis: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            vis: PlotVis,
    ):
        self.box = box
        self.title = title
        self.data = data
        self.vis = vis

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Plot.box is required.')
        if self.title is None:
            raise ValueError('Plot.title is required.')
        if self.data is None:
            raise ValueError('Plot.data is required.')
        if self.vis is None:
            raise ValueError('Plot.vis is required.')
        return _dump(
            view='plot',
            box=self.box,
            title=self.title,
            data=self.data,
            vis=self.vis.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'Plot':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Plot.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Plot.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Plot.data is required.')
        __d_vis: Any = __d.get('vis')
        if __d_vis is None:
            raise ValueError('Plot.vis is required.')
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        vis: PlotVis = PlotVis.load(__d_vis)
        return Plot(
            box,
            title,
            data,
            vis,
        )


class Repeat:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            item_view: str,
            item_props: PackedRecord,
            data: PackedData,
    ):
        self.box = box
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Repeat.box is required.')
        if self.title is None:
            raise ValueError('Repeat.title is required.')
        if self.item_view is None:
            raise ValueError('Repeat.item_view is required.')
        if self.item_props is None:
            raise ValueError('Repeat.item_props is required.')
        if self.data is None:
            raise ValueError('Repeat.data is required.')
        return _dump(
            view='repeat',
            box=self.box,
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Repeat':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Repeat.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Repeat.title is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('Repeat.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('Repeat.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Repeat.data is required.')
        box: str = __d_box
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        data: PackedData = __d_data
        return Repeat(
            box,
            title,
            item_view,
            item_props,
            data,
        )


class Table:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param cells: No documentation available.
    :param data: No documentation available.
    """
    def __init__(
            self,
            box: str,
            title: str,
            cells: PackedData,
            data: PackedData,
    ):
        self.box = box
        self.title = title
        self.cells = cells
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Table.box is required.')
        if self.title is None:
            raise ValueError('Table.title is required.')
        if self.cells is None:
            raise ValueError('Table.cells is required.')
        if self.data is None:
            raise ValueError('Table.data is required.')
        return _dump(
            view='table',
            box=self.box,
            title=self.title,
            cells=self.cells,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Table':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Table.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Table.title is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('Table.cells is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Table.data is required.')
        box: str = __d_box
        title: str = __d_title
        cells: PackedData = __d_cells
        data: PackedData = __d_data
        return Table(
            box,
            title,
            cells,
            data,
        )


class Template:
    """Render dynamic content using a HTML template.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The Handlebars template. https://handlebarsjs.com/guide/
    :param data: Data for the Handlebars template
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            data: Optional[PackedRecord] = None,
    ):
        self.box = box
        self.title = title
        self.content = content
        self.data = data

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('Template.box is required.')
        if self.title is None:
            raise ValueError('Template.title is required.')
        if self.content is None:
            raise ValueError('Template.content is required.')
        return _dump(
            view='template',
            box=self.box,
            title=self.title,
            content=self.content,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Template':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('Template.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Template.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('Template.content is required.')
        __d_data: Any = __d.get('data')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        return Template(
            box,
            title,
            content,
            data,
        )
