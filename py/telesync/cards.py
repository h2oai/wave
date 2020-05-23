from typing import Any, Optional, Union, Dict, List as Repeated
from .core import TupleSet


class Card1:
    def __init__(
            self,
            title: str,
            value: str,
            data: dict,
    ):
        self.title = title
        self.value = value
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('Card1.title is required.')
        if self.value is None:
            raise ValueError('Card1.value is required.')
        if self.data is None:
            raise ValueError('Card1.data is required.')
        return dict(
            title=self.title,
            value=self.value,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card1':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Card1.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('Card1.value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Card1.data is required.')
        title: str = __d_title
        value: str = __d_value
        data: dict = __d_data
        return Card1(
            title,
            value,
            data,
        )


class Card2:
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            data: dict,
            plot_type: str,
            plot_data: TupleSet,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
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
        return dict(
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: dict = __d_data
        plot_type: str = __d_plot_type
        plot_data: TupleSet = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card2(
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
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            caption: str,
            data: dict,
    ):
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.caption = caption
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            caption=self.caption,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card3':
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        caption: str = __d_caption
        data: dict = __d_data
        return Card3(
            title,
            value,
            aux_value,
            caption,
            data,
        )


class Card4:
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: dict,
    ):
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card4':
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: dict = __d_data
        return Card4(
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card5:
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: dict,
    ):
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card5':
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: dict = __d_data
        return Card5(
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card6:
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            data: dict,
            plot_type: str,
            plot_data: TupleSet,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
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
        return dict(
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: dict = __d_data
        plot_type: str = __d_plot_type
        plot_data: TupleSet = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card6(
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
    def __init__(
            self,
            title: str,
            value: str,
            data: dict,
            plot_type: str,
            plot_data: TupleSet,
            plot_color: str,
            plot_category: str,
            plot_value: str,
            plot_zero_value: float,
            plot_curve: str,
    ):
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
        return dict(
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
        title: str = __d_title
        value: str = __d_value
        data: dict = __d_data
        plot_type: str = __d_plot_type
        plot_data: TupleSet = __d_plot_data
        plot_color: str = __d_plot_color
        plot_category: str = __d_plot_category
        plot_value: str = __d_plot_value
        plot_zero_value: float = __d_plot_zero_value
        plot_curve: str = __d_plot_curve
        return Card7(
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
    def __init__(
            self,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: str,
            data: dict,
    ):
        self.title = title
        self.value = value
        self.aux_value = aux_value
        self.progress = progress
        self.plot_color = plot_color
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Card8':
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
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: dict = __d_data
        return Card8(
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
        )


class Card9:
    def __init__(
            self,
            title: str,
            caption: str,
            value: str,
            aux_value: str,
            value_caption: str,
            aux_value_caption: str,
            progress: float,
            plot_color: str,
            data: dict,
    ):
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
        return dict(
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
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        value_caption: str = __d_value_caption
        aux_value_caption: str = __d_aux_value_caption
        progress: float = __d_progress
        plot_color: str = __d_plot_color
        data: dict = __d_data
        return Card9(
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


class Flex:
    def __init__(
            self,
            title: str,
            item_view: str,
            item_props: dict,
            direction: str,
            justify: str,
            align: str,
            wrap: str,
            data: TupleSet,
    ):
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.direction = direction
        self.justify = justify
        self.align = align
        self.wrap = wrap
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
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
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: dict = __d_item_props
        direction: str = __d_direction
        justify: str = __d_justify
        align: str = __d_align
        wrap: str = __d_wrap
        data: TupleSet = __d_data
        return Flex(
            title,
            item_view,
            item_props,
            direction,
            justify,
            align,
            wrap,
            data,
        )


class FormUIButton:
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        self.label = label

    def dump(self) -> Dict:
        if self.name is None:
            raise ValueError('FormUIButton.name is required.')
        if self.label is None:
            raise ValueError('FormUIButton.label is required.')
        return dict(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormUIButton':
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormUIButton.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormUIButton.label is required.')
        name: str = __d_name
        label: str = __d_label
        return FormUIButton(
            name,
            label,
        )


class FormUIComponent:
    def __init__(
            self,
            button: Optional[FormUIButton] = None,
    ):
        self.button = button

    def dump(self) -> Dict:
        return dict(
            button=self.button.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'FormUIComponent':
        __d_button: Any = __d.get('button')
        button: Optional[FormUIButton] = FormUIButton.load(__d_button)
        return FormUIComponent(
            button,
        )


class Form:
    def __init__(
            self,
            url: str,
            method: str,
            args: dict,
            items: Repeated[FormUIComponent],
    ):
        self.url = url
        self.method = method
        self.args = args
        self.items = items

    def dump(self) -> Dict:
        if self.url is None:
            raise ValueError('Form.url is required.')
        if self.method is None:
            raise ValueError('Form.method is required.')
        if self.args is None:
            raise ValueError('Form.args is required.')
        if self.items is None:
            raise ValueError('Form.items is required.')
        return dict(
            url=self.url,
            method=self.method,
            args=self.args,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Form':
        __d_url: Any = __d.get('url')
        if __d_url is None:
            raise ValueError('Form.url is required.')
        __d_method: Any = __d.get('method')
        if __d_method is None:
            raise ValueError('Form.method is required.')
        __d_args: Any = __d.get('args')
        if __d_args is None:
            raise ValueError('Form.args is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('Form.items is required.')
        url: str = __d_url
        method: str = __d_method
        args: dict = __d_args
        items: Repeated[FormUIComponent] = [FormUIComponent.load(__e) for __e in __d_items]
        return Form(
            url,
            method,
            args,
            items,
        )


class List:
    def __init__(
            self,
            title: str,
            item_view: str,
            item_props: dict,
            data: TupleSet,
    ):
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('List.title is required.')
        if self.item_view is None:
            raise ValueError('List.item_view is required.')
        if self.item_props is None:
            raise ValueError('List.item_props is required.')
        if self.data is None:
            raise ValueError('List.data is required.')
        return dict(
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'List':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('List.title is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('List.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('List.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('List.data is required.')
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: dict = __d_item_props
        data: TupleSet = __d_data
        return List(
            title,
            item_view,
            item_props,
            data,
        )


class ListItem1:
    def __init__(
            self,
            title: str,
            caption: str,
            value: str,
            aux_value: str,
            data: dict,
    ):
        self.title = title
        self.caption = caption
        self.value = value
        self.aux_value = aux_value
        self.data = data

    def dump(self) -> Dict:
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
        return dict(
            title=self.title,
            caption=self.caption,
            value=self.value,
            aux_value=self.aux_value,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'ListItem1':
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
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: dict = __d_data
        return ListItem1(
            title,
            caption,
            value,
            aux_value,
            data,
        )


class PixelArt:
    def __init__(
            self,
            title: str,
            data: dict,
    ):
        self.title = title
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('PixelArt.title is required.')
        if self.data is None:
            raise ValueError('PixelArt.data is required.')
        return dict(
            title=self.title,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'PixelArt':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('PixelArt.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('PixelArt.data is required.')
        title: str = __d_title
        data: dict = __d_data
        return PixelArt(
            title,
            data,
        )


class PlotMark:
    def __init__(
            self,
            coord: Optional[str] = None,
            mark: Optional[str] = None,
            x: Optional[Union[str, float, int]] = None,
            x0: Optional[Union[str, float, int]] = None,
            x1: Optional[Union[str, float, int]] = None,
            x2: Optional[Union[str, float, int]] = None,
            x_min: Optional[float] = None,
            x_max: Optional[float] = None,
            x_nice: Optional[bool] = None,
            x_scale: Optional[str] = None,
            x_title: Optional[str] = None,
            y: Optional[Union[str, float, int]] = None,
            y0: Optional[Union[str, float, int]] = None,
            y1: Optional[Union[str, float, int]] = None,
            y2: Optional[Union[str, float, int]] = None,
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
        return dict(
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
        x: Optional[Union[str, float, int]] = __d_x
        x0: Optional[Union[str, float, int]] = __d_x0
        x1: Optional[Union[str, float, int]] = __d_x1
        x2: Optional[Union[str, float, int]] = __d_x2
        x_min: Optional[float] = __d_x_min
        x_max: Optional[float] = __d_x_max
        x_nice: Optional[bool] = __d_x_nice
        x_scale: Optional[str] = __d_x_scale
        x_title: Optional[str] = __d_x_title
        y: Optional[Union[str, float, int]] = __d_y
        y0: Optional[Union[str, float, int]] = __d_y0
        y1: Optional[Union[str, float, int]] = __d_y1
        y2: Optional[Union[str, float, int]] = __d_y2
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
    def __init__(
            self,
            marks: Repeated[PlotMark],
    ):
        self.marks = marks

    def dump(self) -> Dict:
        if self.marks is None:
            raise ValueError('PlotVis.marks is required.')
        return dict(
            marks=[__e.dump() for __e in self.marks],
        )

    @staticmethod
    def load(__d: Dict) -> 'PlotVis':
        __d_marks: Any = __d.get('marks')
        if __d_marks is None:
            raise ValueError('PlotVis.marks is required.')
        marks: Repeated[PlotMark] = [PlotMark.load(__e) for __e in __d_marks]
        return PlotVis(
            marks,
        )


class Plot:
    def __init__(
            self,
            title: str,
            data: dict,
            vis: PlotVis,
    ):
        self.title = title
        self.data = data
        self.vis = vis

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('Plot.title is required.')
        if self.data is None:
            raise ValueError('Plot.data is required.')
        if self.vis is None:
            raise ValueError('Plot.vis is required.')
        return dict(
            title=self.title,
            data=self.data,
            vis=self.vis.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'Plot':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Plot.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Plot.data is required.')
        __d_vis: Any = __d.get('vis')
        if __d_vis is None:
            raise ValueError('Plot.vis is required.')
        title: str = __d_title
        data: dict = __d_data
        vis: PlotVis = PlotVis.load(__d_vis)
        return Plot(
            title,
            data,
            vis,
        )


class Repeat:
    def __init__(
            self,
            title: str,
            item_view: str,
            item_props: dict,
            data: TupleSet,
    ):
        self.title = title
        self.item_view = item_view
        self.item_props = item_props
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('Repeat.title is required.')
        if self.item_view is None:
            raise ValueError('Repeat.item_view is required.')
        if self.item_props is None:
            raise ValueError('Repeat.item_props is required.')
        if self.data is None:
            raise ValueError('Repeat.data is required.')
        return dict(
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Repeat':
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
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: dict = __d_item_props
        data: TupleSet = __d_data
        return Repeat(
            title,
            item_view,
            item_props,
            data,
        )


class Table:
    def __init__(
            self,
            title: str,
            cells: TupleSet,
            data: TupleSet,
    ):
        self.title = title
        self.cells = cells
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('Table.title is required.')
        if self.cells is None:
            raise ValueError('Table.cells is required.')
        if self.data is None:
            raise ValueError('Table.data is required.')
        return dict(
            title=self.title,
            cells=self.cells,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Table':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Table.title is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('Table.cells is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Table.data is required.')
        title: str = __d_title
        cells: TupleSet = __d_cells
        data: TupleSet = __d_data
        return Table(
            title,
            cells,
            data,
        )


class Template:
    def __init__(
            self,
            title: str,
            template: str,
            data: dict,
    ):
        self.title = title
        self.template = template
        self.data = data

    def dump(self) -> Dict:
        if self.title is None:
            raise ValueError('Template.title is required.')
        if self.template is None:
            raise ValueError('Template.template is required.')
        if self.data is None:
            raise ValueError('Template.data is required.')
        return dict(
            title=self.title,
            template=self.template,
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Template':
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('Template.title is required.')
        __d_template: Any = __d.get('template')
        if __d_template is None:
            raise ValueError('Template.template is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('Template.data is required.')
        title: str = __d_title
        template: str = __d_template
        data: dict = __d_data
        return Template(
            title,
            template,
            data,
        )
