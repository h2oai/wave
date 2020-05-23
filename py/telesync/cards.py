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


class FormText:
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
        if self.size is None:
            raise ValueError('FormText.size is required.')
        if self.text is None:
            raise ValueError('FormText.text is required.')
        if self.tooltip is None:
            raise ValueError('FormText.tooltip is required.')
        return dict(
            size=self.size,
            text=self.text,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormText':
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
        if self.label is None:
            raise ValueError('FormLabel.label is required.')
        if self.required is None:
            raise ValueError('FormLabel.required is required.')
        if self.disabled is None:
            raise ValueError('FormLabel.disabled is required.')
        if self.tooltip is None:
            raise ValueError('FormLabel.tooltip is required.')
        return dict(
            label=self.label,
            required=self.required,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormLabel':
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
    def __init__(
            self,
            label: str,
    ):
        self.label = label

    def dump(self) -> Dict:
        if self.label is None:
            raise ValueError('FormSeparator.label is required.')
        return dict(
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormSeparator':
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('FormSeparator.label is required.')
        label: str = __d_label
        return FormSeparator(
            label,
        )


class FormProgress:
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
        if self.label is None:
            raise ValueError('FormProgress.label is required.')
        if self.caption is None:
            raise ValueError('FormProgress.caption is required.')
        if self.value is None:
            raise ValueError('FormProgress.value is required.')
        if self.tooltip is None:
            raise ValueError('FormProgress.tooltip is required.')
        return dict(
            label=self.label,
            caption=self.caption,
            value=self.value,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormProgress':
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
    def __init__(
            self,
            type: str,
            text: str,
    ):
        self.type = type
        self.text = text

    def dump(self) -> Dict:
        if self.type is None:
            raise ValueError('FormMessageBar.type is required.')
        if self.text is None:
            raise ValueError('FormMessageBar.text is required.')
        return dict(
            type=self.type,
            text=self.text,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormMessageBar':
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
        return dict(
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
        return dict(
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
        return dict(
            name=self.name,
            label=self.label,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormToggle':
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
        if self.name is None:
            raise ValueError('FormChoice.name is required.')
        if self.label is None:
            raise ValueError('FormChoice.label is required.')
        if self.disabled is None:
            raise ValueError('FormChoice.disabled is required.')
        return dict(
            name=self.name,
            label=self.label,
            disabled=self.disabled,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormChoice':
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
    def __init__(
            self,
            name: str,
            label: str,
            value: str,
            choices: Repeated[FormChoice],
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
        return dict(
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
        choices: Repeated[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
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
    def __init__(
            self,
            name: str,
            label: str,
            values: Repeated[str],
            choices: Repeated[FormChoice],
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.values = values
        self.choices = choices
        self.tooltip = tooltip

    def dump(self) -> Dict:
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
        return dict(
            name=self.name,
            label=self.label,
            values=self.values,
            choices=[__e.dump() for __e in self.choices],
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormChecklist':
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
        values: Repeated[str] = __d_values
        choices: Repeated[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
        tooltip: str = __d_tooltip
        return FormChecklist(
            name,
            label,
            values,
            choices,
            tooltip,
        )


class FormDropdown:
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            multiple: bool,
            value: str,
            values: Repeated[str],
            choices: Repeated[FormChoice],
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
        return dict(
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
        values: Repeated[str] = __d_values
        choices: Repeated[FormChoice] = [FormChoice.load(__e) for __e in __d_choices]
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
    def __init__(
            self,
            name: str,
            label: str,
            placeholder: str,
            value: str,
            choices: Repeated[str],
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
        return dict(
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
        choices: Repeated[str] = __d_choices
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
        return dict(
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
        return dict(
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
        return dict(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormDatePicker':
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
    def __init__(
            self,
            name: str,
            label: str,
            value: str,
            choices: Repeated[str],
            tooltip: str,
    ):
        self.name = name
        self.label = label
        self.value = value
        self.choices = choices
        self.tooltip = tooltip

    def dump(self) -> Dict:
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
        return dict(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=self.choices,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormColorPicker':
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
        choices: Repeated[str] = __d_choices
        tooltip: str = __d_tooltip
        return FormColorPicker(
            name,
            label,
            value,
            choices,
            tooltip,
        )


class FormButton:
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
        return dict(
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
    def __init__(
            self,
            buttons: Repeated[FormButton],
    ):
        self.buttons = buttons

    def dump(self) -> Dict:
        if self.buttons is None:
            raise ValueError('FormButtons.buttons is required.')
        return dict(
            buttons=[__e.dump() for __e in self.buttons],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormButtons':
        __d_buttons: Any = __d.get('buttons')
        if __d_buttons is None:
            raise ValueError('FormButtons.buttons is required.')
        buttons: Repeated[FormButton] = [FormButton.load(__e) for __e in __d_buttons]
        return FormButtons(
            buttons,
        )


class FormFileUpload:
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
        if self.name is None:
            raise ValueError('FormFileUpload.name is required.')
        if self.label is None:
            raise ValueError('FormFileUpload.label is required.')
        if self.multiple is None:
            raise ValueError('FormFileUpload.multiple is required.')
        if self.tooltip is None:
            raise ValueError('FormFileUpload.tooltip is required.')
        return dict(
            name=self.name,
            label=self.label,
            multiple=self.multiple,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormFileUpload':
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
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        self.label = label

    def dump(self) -> Dict:
        if self.name is None:
            raise ValueError('FormTableColumn.name is required.')
        if self.label is None:
            raise ValueError('FormTableColumn.label is required.')
        return dict(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTableColumn':
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
    def __init__(
            self,
            name: str,
            cells: Repeated[str],
    ):
        self.name = name
        self.cells = cells

    def dump(self) -> Dict:
        if self.name is None:
            raise ValueError('FormTableRow.name is required.')
        if self.cells is None:
            raise ValueError('FormTableRow.cells is required.')
        return dict(
            name=self.name,
            cells=self.cells,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTableRow':
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FormTableRow.name is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('FormTableRow.cells is required.')
        name: str = __d_name
        cells: Repeated[str] = __d_cells
        return FormTableRow(
            name,
            cells,
        )


class FormTable:
    def __init__(
            self,
            name: str,
            columns: Repeated[FormTableColumn],
            rows: Repeated[FormTableRow],
            multiple: bool,
            tooltip: str,
    ):
        self.name = name
        self.columns = columns
        self.rows = rows
        self.multiple = multiple
        self.tooltip = tooltip

    def dump(self) -> Dict:
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
        return dict(
            name=self.name,
            columns=[__e.dump() for __e in self.columns],
            rows=[__e.dump() for __e in self.rows],
            multiple=self.multiple,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTable':
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
        columns: Repeated[FormTableColumn] = [FormTableColumn.load(__e) for __e in __d_columns]
        rows: Repeated[FormTableRow] = [FormTableRow.load(__e) for __e in __d_rows]
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
        return dict(
            label=self.label,
            path=self.path,
            disabled=self.disabled,
            button=self.button,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormLink':
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
        if self.name is None:
            raise ValueError('FormTab.name is required.')
        if self.label is None:
            raise ValueError('FormTab.label is required.')
        if self.icon is None:
            raise ValueError('FormTab.icon is required.')
        return dict(
            name=self.name,
            label=self.label,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTab':
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
    def __init__(
            self,
            name: str,
            value: str,
            items: Repeated[FormTab],
    ):
        self.name = name
        self.value = value
        self.items = items

    def dump(self) -> Dict:
        if self.name is None:
            raise ValueError('FormTabs.name is required.')
        if self.value is None:
            raise ValueError('FormTabs.value is required.')
        if self.items is None:
            raise ValueError('FormTabs.items is required.')
        return dict(
            name=self.name,
            value=self.value,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormTabs':
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
        items: Repeated[FormTab] = [FormTab.load(__e) for __e in __d_items]
        return FormTabs(
            name,
            value,
            items,
        )


class FormExpander:
    def __init__(
            self,
            name: str,
            label: str,
            expanded: bool,
            items: Repeated['FormComponent'],
    ):
        self.name = name
        self.label = label
        self.expanded = expanded
        self.items = items

    def dump(self) -> Dict:
        if self.name is None:
            raise ValueError('FormExpander.name is required.')
        if self.label is None:
            raise ValueError('FormExpander.label is required.')
        if self.expanded is None:
            raise ValueError('FormExpander.expanded is required.')
        if self.items is None:
            raise ValueError('FormExpander.items is required.')
        return dict(
            name=self.name,
            label=self.label,
            expanded=self.expanded,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormExpander':
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
        items: Repeated['FormComponent'] = [FormComponent.load(__e) for __e in __d_items]
        return FormExpander(
            name,
            label,
            expanded,
            items,
        )


class FormComponent:
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

    def dump(self) -> Dict:
        return dict(
            text=self.text.dump(),
            label=self.label.dump(),
            separator=self.separator.dump(),
            progress=self.progress.dump(),
            message_bar=self.message_bar.dump(),
            textbox=self.textbox.dump(),
            checkbox=self.checkbox.dump(),
            toggle=self.toggle.dump(),
            choice_group=self.choice_group.dump(),
            checklist=self.checklist.dump(),
            dropdown=self.dropdown.dump(),
            combobox=self.combobox.dump(),
            slider=self.slider.dump(),
            spinbox=self.spinbox.dump(),
            date_picker=self.date_picker.dump(),
            color_picker=self.color_picker.dump(),
            buttons=self.buttons.dump(),
            file_upload=self.file_upload.dump(),
            table=self.table.dump(),
            link=self.link.dump(),
            tabs=self.tabs.dump(),
            button=self.button.dump(),
            expander=self.expander.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'FormComponent':
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
        text: Optional[FormText] = FormText.load(__d_text)
        label: Optional[FormLabel] = FormLabel.load(__d_label)
        separator: Optional[FormSeparator] = FormSeparator.load(__d_separator)
        progress: Optional[FormProgress] = FormProgress.load(__d_progress)
        message_bar: Optional[FormMessageBar] = FormMessageBar.load(__d_message_bar)
        textbox: Optional[FormTextbox] = FormTextbox.load(__d_textbox)
        checkbox: Optional[FormCheckbox] = FormCheckbox.load(__d_checkbox)
        toggle: Optional[FormToggle] = FormToggle.load(__d_toggle)
        choice_group: Optional[FormChoiceGroup] = FormChoiceGroup.load(__d_choice_group)
        checklist: Optional[FormChecklist] = FormChecklist.load(__d_checklist)
        dropdown: Optional[FormDropdown] = FormDropdown.load(__d_dropdown)
        combobox: Optional[FormCombobox] = FormCombobox.load(__d_combobox)
        slider: Optional[FormSlider] = FormSlider.load(__d_slider)
        spinbox: Optional[FormSpinbox] = FormSpinbox.load(__d_spinbox)
        date_picker: Optional[FormDatePicker] = FormDatePicker.load(__d_date_picker)
        color_picker: Optional[FormColorPicker] = FormColorPicker.load(__d_color_picker)
        buttons: Optional[FormButtons] = FormButtons.load(__d_buttons)
        file_upload: Optional[FormFileUpload] = FormFileUpload.load(__d_file_upload)
        table: Optional[FormTable] = FormTable.load(__d_table)
        link: Optional[FormLink] = FormLink.load(__d_link)
        tabs: Optional[FormTabs] = FormTabs.load(__d_tabs)
        button: Optional[FormButton] = FormButton.load(__d_button)
        expander: Optional[FormExpander] = FormExpander.load(__d_expander)
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
        )


class Form:
    def __init__(
            self,
            url: str,
            method: str,
            args: dict,
            items: Repeated[FormComponent],
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
        items: Repeated[FormComponent] = [FormComponent.load(__e) for __e in __d_items]
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
