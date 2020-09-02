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


class Breadcrumb:
    """Create a breadcrumb for a `h2o_q.types.BreadcrumbsCard()`.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        """The name of this item. Prefix the name with a '#' to trigger hash-change navigation."""
        self.label = label
        """The label to display."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Breadcrumb.name is required.')
        if self.label is None:
            raise ValueError('Breadcrumb.label is required.')
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'Breadcrumb':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Breadcrumb.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('Breadcrumb.label is required.')
        name: str = __d_name
        label: str = __d_label
        return Breadcrumb(
            name,
            label,
        )


class Command:
    """Create a command.

    Commands are typically displayed as context menu items or toolbar button.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            caption: Optional[str] = None,
            icon: Optional[str] = None,
            items: Optional[List['Command']] = None,
            data: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed."""
        self.label = label
        """The text displayed for this command."""
        self.caption = caption
        """The caption for this command (typically a tooltip)."""
        self.icon = icon
        """The icon to be displayed for this command."""
        self.items = items
        """Sub-commands, if any"""
        self.data = data
        """Data associated with this command, if any."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Command.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            icon=self.icon,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            data=self.data,
        )

    @staticmethod
    def load(__d: Dict) -> 'Command':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Command.name is required.')
        __d_label: Any = __d.get('label')
        __d_caption: Any = __d.get('caption')
        __d_icon: Any = __d.get('icon')
        __d_items: Any = __d.get('items')
        __d_data: Any = __d.get('data')
        name: str = __d_name
        label: Optional[str] = __d_label
        caption: Optional[str] = __d_caption
        icon: Optional[str] = __d_icon
        items: Optional[List['Command']] = None if __d_items is None else [Command.load(__e) for __e in __d_items]
        data: Optional[str] = __d_data
        return Command(
            name,
            label,
            caption,
            icon,
            items,
            data,
        )


class BreadcrumbsCard:
    """Create a card containing breadcrumbs.
    Breadcrumbs should be used as a navigational aid in your app or site.
    They indicate the current page’s location within a hierarchy and help
    the user understand where they are in relation to the rest of that hierarchy.
    They also afford one-click access to higher levels of that hierarchy.
    Breadcrumbs are typically placed, in horizontal form, under the masthead
    or navigation of an experience, above the primary content area.
    """
    def __init__(
            self,
            box: str,
            items: List[Breadcrumb],
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """A list of `h2o_q.types.Breadcrumb` instances to display. See `h2o_q.ui.breadcrumb()`"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('BreadcrumbsCard.box is required.')
        if self.items is None:
            raise ValueError('BreadcrumbsCard.items is required.')
        return _dump(
            view='breadcrumbs',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'BreadcrumbsCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('BreadcrumbsCard.box is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('BreadcrumbsCard.items is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        items: List[Breadcrumb] = [Breadcrumb.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return BreadcrumbsCard(
            box,
            items,
            commands,
        )


class FlexCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards laid out using a one-dimensional model with flexible alignemnt and wrapping capabilities.
    """
    def __init__(
            self,
            box: str,
            item_view: str,
            item_props: PackedRecord,
            data: PackedData,
            direction: Optional[str] = None,
            justify: Optional[str] = None,
            align: Optional[str] = None,
            wrap: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.item_view = item_view
        """The child card type."""
        self.item_props = item_props
        """The child card properties."""
        self.data = data
        """Data for this card."""
        self.direction = direction
        """Layout direction. One of 'horizontal', 'vertical'."""
        self.justify = justify
        """Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'."""
        self.align = align
        """Layout strategy for cross axis. One of 'start', 'end', 'center', 'baseline', 'stretch'."""
        self.wrap = wrap
        """Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('FlexCard.box is required.')
        if self.item_view is None:
            raise ValueError('FlexCard.item_view is required.')
        if self.item_props is None:
            raise ValueError('FlexCard.item_props is required.')
        if self.data is None:
            raise ValueError('FlexCard.data is required.')
        return _dump(
            view='flex',
            box=self.box,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
            direction=self.direction,
            justify=self.justify,
            align=self.align,
            wrap=self.wrap,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FlexCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('FlexCard.box is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('FlexCard.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('FlexCard.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('FlexCard.data is required.')
        __d_direction: Any = __d.get('direction')
        __d_justify: Any = __d.get('justify')
        __d_align: Any = __d.get('align')
        __d_wrap: Any = __d.get('wrap')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        data: PackedData = __d_data
        direction: Optional[str] = __d_direction
        justify: Optional[str] = __d_justify
        align: Optional[str] = __d_align
        wrap: Optional[str] = __d_wrap
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FlexCard(
            box,
            item_view,
            item_props,
            data,
            direction,
            justify,
            align,
            wrap,
            commands,
        )


class Text:
    """Create text content.
    """
    def __init__(
            self,
            content: str,
            size: Optional[str] = None,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.size = size
        """The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('Text.content is required.')
        return _dump(
            content=self.content,
            size=self.size,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Text':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('Text.content is required.')
        __d_size: Any = __d.get('size')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        size: Optional[str] = __d_size
        tooltip: Optional[str] = __d_tooltip
        return Text(
            content,
            size,
            tooltip,
        )


class TextXl:
    """Create extra-large sized text content.
    """
    def __init__(
            self,
            content: str,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('TextXl.content is required.')
        return _dump(
            content=self.content,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextXl':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TextXl.content is required.')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        tooltip: Optional[str] = __d_tooltip
        return TextXl(
            content,
            tooltip,
        )


class TextL:
    """Create large sized text content.
    """
    def __init__(
            self,
            content: str,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('TextL.content is required.')
        return _dump(
            content=self.content,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextL':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TextL.content is required.')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        tooltip: Optional[str] = __d_tooltip
        return TextL(
            content,
            tooltip,
        )


class TextM:
    """Create medium sized text content.
    """
    def __init__(
            self,
            content: str,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('TextM.content is required.')
        return _dump(
            content=self.content,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextM':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TextM.content is required.')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        tooltip: Optional[str] = __d_tooltip
        return TextM(
            content,
            tooltip,
        )


class TextS:
    """Create small sized text content.
    """
    def __init__(
            self,
            content: str,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('TextS.content is required.')
        return _dump(
            content=self.content,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextS':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TextS.content is required.')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        tooltip: Optional[str] = __d_tooltip
        return TextS(
            content,
            tooltip,
        )


class TextXs:
    """Create extra-small sized text content.
    """
    def __init__(
            self,
            content: str,
            tooltip: Optional[str] = None,
    ):
        self.content = content
        """The text content."""
        self.tooltip = tooltip
        """Tooltip message."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.content is None:
            raise ValueError('TextXs.content is required.')
        return _dump(
            content=self.content,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextXs':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TextXs.content is required.')
        __d_tooltip: Any = __d.get('tooltip')
        content: str = __d_content
        tooltip: Optional[str] = __d_tooltip
        return TextXs(
            content,
            tooltip,
        )


class Label:
    """Create a label.

    Labels give a name or title to a component or group of components.
    Labels should be in close proximity to the component or group they are paired with.
    Some components, such as textboxes, dropdowns, or toggles, already have labels
    incorporated, but other components may optionally add a Label if it helps inform
    the user of the component’s purpose.
    """
    def __init__(
            self,
            label: str,
            required: Optional[bool] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.label = label
        """The text displayed on the label."""
        self.required = required
        """True if the field is required."""
        self.disabled = disabled
        """True if the label should be disabled."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('Label.label is required.')
        return _dump(
            label=self.label,
            required=self.required,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Label':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('Label.label is required.')
        __d_required: Any = __d.get('required')
        __d_disabled: Any = __d.get('disabled')
        __d_tooltip: Any = __d.get('tooltip')
        label: str = __d_label
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        return Label(
            label,
            required,
            disabled,
            tooltip,
        )


class Separator:
    """Create a separator.

    A separator visually separates content into groups.
    """
    def __init__(
            self,
            label: Optional[str] = None,
    ):
        self.label = label
        """The text displayed on the separator."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'Separator':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        label: Optional[str] = __d_label
        return Separator(
            label,
        )


class Progress:
    """Create a progress bar.

    Progress bars are used to show the completion status of an operation lasting more than 2 seconds.
    If the state of progress cannot be determined, do not set a value.
    Progress bars feature a bar showing total units to completion, and total units finished.
    The label appears above the bar, and the caption appears below.
    The label should tell someone exactly what the operation is doing.

    Examples of formatting include:
    [Object] is being [operation name], or
    [Object] is being [operation name] to [destination name] or
    [Object] is being [operation name] from [source name] to [destination name]

    Status text is generally in units elapsed and total units.
    Real-world examples include copying files to a storage location, saving edits to a file, and more.
    Use units that are informative and relevant to give the best idea to users of how long the operation will take to complete.
    Avoid time units as they are rarely accurate enough to be trustworthy.
    Also, combine steps of a complex operation into one total bar to avoid “rewinding” the bar.
    Instead change the label to reflect the change if necessary. Bars moving backwards reduce confidence in the service.
    """
    def __init__(
            self,
            label: str,
            caption: Optional[str] = None,
            value: Optional[float] = None,
            tooltip: Optional[str] = None,
    ):
        self.label = label
        """The text displayed above the bar."""
        self.caption = caption
        """The text displayed below the bar."""
        self.value = value
        """The progress, between 0.0 and 1.0, or -1 (default) if indeterminate."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('Progress.label is required.')
        return _dump(
            label=self.label,
            caption=self.caption,
            value=self.value,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Progress':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('Progress.label is required.')
        __d_caption: Any = __d.get('caption')
        __d_value: Any = __d.get('value')
        __d_tooltip: Any = __d.get('tooltip')
        label: str = __d_label
        caption: Optional[str] = __d_caption
        value: Optional[float] = __d_value
        tooltip: Optional[str] = __d_tooltip
        return Progress(
            label,
            caption,
            value,
            tooltip,
        )


class MessageBar:
    """Create a message bar.

    A message bar is an area at the top of a primary view that displays relevant status information.
    You can use a message bar to tell the user about a situation that does not require their immediate attention and
    therefore does not need to block other activities.
    """
    def __init__(
            self,
            type: Optional[str] = None,
            text: Optional[str] = None,
    ):
        self.type = type
        """The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'."""
        self.text = text
        """The text displayed on the message bar."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            type=self.type,
            text=self.text,
        )

    @staticmethod
    def load(__d: Dict) -> 'MessageBar':
        """Creates an instance of this class using the contents of a dict."""
        __d_type: Any = __d.get('type')
        __d_text: Any = __d.get('text')
        type: Optional[str] = __d_type
        text: Optional[str] = __d_text
        return MessageBar(
            type,
            text,
        )


class Textbox:
    """Create a text box.

    The text box component enables a user to type text into an app.
    It's typically used to capture a single line of text, but can be configured to capture multiple lines of text.
    The text displays on the screen in a simple, uniform format.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            placeholder: Optional[str] = None,
            value: Optional[str] = None,
            mask: Optional[str] = None,
            icon: Optional[str] = None,
            prefix: Optional[str] = None,
            suffix: Optional[str] = None,
            error: Optional[str] = None,
            required: Optional[bool] = None,
            disabled: Optional[bool] = None,
            readonly: Optional[bool] = None,
            multiline: Optional[bool] = None,
            password: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed above the field."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that demonstrates the expected type of data, rather than an explanatory message."""
        self.value = value
        """Text to be displayed inside the text box."""
        self.mask = mask
        """The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9]."""
        self.icon = icon
        """Icon displayed in the far right end of the text field."""
        self.prefix = prefix
        """Text to be displayed before the text box contents."""
        self.suffix = suffix
        """Text to be displayed after the text box contents."""
        self.error = error
        """Text to be displayed as an error below the text box."""
        self.required = required
        """True if the text box is a required field."""
        self.disabled = disabled
        """True if the text box is disabled."""
        self.readonly = readonly
        """True if the text box is a read-only field."""
        self.multiline = multiline
        """True if the text box should allow multi-line text entry."""
        self.password = password
        """True if the text box should hide text content."""
        self.trigger = trigger
        """True if the form should be submitted when the text value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Textbox.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            mask=self.mask,
            icon=self.icon,
            prefix=self.prefix,
            suffix=self.suffix,
            error=self.error,
            required=self.required,
            disabled=self.disabled,
            readonly=self.readonly,
            multiline=self.multiline,
            password=self.password,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Textbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Textbox.name is required.')
        __d_label: Any = __d.get('label')
        __d_placeholder: Any = __d.get('placeholder')
        __d_value: Any = __d.get('value')
        __d_mask: Any = __d.get('mask')
        __d_icon: Any = __d.get('icon')
        __d_prefix: Any = __d.get('prefix')
        __d_suffix: Any = __d.get('suffix')
        __d_error: Any = __d.get('error')
        __d_required: Any = __d.get('required')
        __d_disabled: Any = __d.get('disabled')
        __d_readonly: Any = __d.get('readonly')
        __d_multiline: Any = __d.get('multiline')
        __d_password: Any = __d.get('password')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        mask: Optional[str] = __d_mask
        icon: Optional[str] = __d_icon
        prefix: Optional[str] = __d_prefix
        suffix: Optional[str] = __d_suffix
        error: Optional[str] = __d_error
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        readonly: Optional[bool] = __d_readonly
        multiline: Optional[bool] = __d_multiline
        password: Optional[bool] = __d_password
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Textbox(
            name,
            label,
            placeholder,
            value,
            mask,
            icon,
            prefix,
            suffix,
            error,
            required,
            disabled,
            readonly,
            multiline,
            password,
            trigger,
            tooltip,
        )


class Checkbox:
    """Create a checkbox.

    A checkbox allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through
    a single click or tap. It can also be used to indicate a subordinate setting or preference when paired with another
    component.

    A checkbox is used to select or deselect action items. It can be used for a single item or for a list of multiple
    items that a user can choose from. The component has two selection states: unselected and selected.

    For a binary choice, the main difference between a checkbox and a toggle switch is that the checkbox is for status
    and the toggle switch is for action.

    Use multiple checkboxes for multi-select scenarios in which a user chooses one or more items from a group of
    choices that are not mutually exclusive.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            value: Optional[bool] = None,
            indeterminate: Optional[bool] = None,
            disabled: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the checkbox."""
        self.value = value
        """True if selected, False if unselected."""
        self.indeterminate = indeterminate
        """True if the selection is indeterminate (neither selected nor unselected)."""
        self.disabled = disabled
        """True if the checkbox is disabled."""
        self.trigger = trigger
        """True if the form should be submitted when the checkbox value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Checkbox.name is required.')
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
    def load(__d: Dict) -> 'Checkbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Checkbox.name is required.')
        __d_label: Any = __d.get('label')
        __d_value: Any = __d.get('value')
        __d_indeterminate: Any = __d.get('indeterminate')
        __d_disabled: Any = __d.get('disabled')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[bool] = __d_value
        indeterminate: Optional[bool] = __d_indeterminate
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Checkbox(
            name,
            label,
            value,
            indeterminate,
            disabled,
            trigger,
            tooltip,
        )


class Toggle:
    """Create a toggle.
    Toggles represent a physical switch that allows users to turn things on or off.
    Use toggles to present users with two mutually exclusive options (like on/off), where choosing an option results
    in an immediate action.

    Use a toggle for binary operations that take effect right after the user flips the Toggle.
    For example, use a Toggle to turn services or hardware components on or off.
    In other words, if a physical switch would work for the action, a Toggle is probably the best component to use.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            value: Optional[bool] = None,
            disabled: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.value = value
        """True if selected, False if unselected."""
        self.disabled = disabled
        """True if the checkbox is disabled."""
        self.trigger = trigger
        """True if the form should be submitted when the toggle value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Toggle.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Toggle':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Toggle.name is required.')
        __d_label: Any = __d.get('label')
        __d_value: Any = __d.get('value')
        __d_disabled: Any = __d.get('disabled')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[bool] = __d_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Toggle(
            name,
            label,
            value,
            disabled,
            trigger,
            tooltip,
        )


class Choice:
    """Create a choice for a checklist, choice group or dropdown.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            disabled: Optional[bool] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.disabled = disabled
        """True if the checkbox is disabled."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Choice.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            disabled=self.disabled,
        )

    @staticmethod
    def load(__d: Dict) -> 'Choice':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Choice.name is required.')
        __d_label: Any = __d.get('label')
        __d_disabled: Any = __d.get('disabled')
        name: str = __d_name
        label: Optional[str] = __d_label
        disabled: Optional[bool] = __d_disabled
        return Choice(
            name,
            label,
            disabled,
        )


class ChoiceGroup:
    """Create a choice group.
    The choice group component, also known as radio buttons, let users select one option from two or more choices.
    Each option is represented by one choice group button; a user can select only one choice group in a button group.

    Choice groups emphasize all options equally, and that may draw more attention to the options than necessary.
    Consider using other components, unless the options deserve extra attention from the user.
    For example, if the default option is recommended for most users in most situations, use a dropdown instead.

    If there are only two mutually exclusive options, combine them into a single Checkbox or Toggle switch.
    For example, use a checkbox for "I agree" instead of choice group buttons for "I agree" and "I don't agree."
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            value: Optional[str] = None,
            choices: Optional[List[Choice]] = None,
            required: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.value = value
        """The name of the selected choice."""
        self.choices = choices
        """The choices to be presented."""
        self.required = required
        """True if this field is required."""
        self.trigger = trigger
        """True if the form should be submitted when the selection changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('ChoiceGroup.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=None if self.choices is None else [__e.dump() for __e in self.choices],
            required=self.required,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'ChoiceGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('ChoiceGroup.name is required.')
        __d_label: Any = __d.get('label')
        __d_value: Any = __d.get('value')
        __d_choices: Any = __d.get('choices')
        __d_required: Any = __d.get('required')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[str] = __d_value
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        required: Optional[bool] = __d_required
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return ChoiceGroup(
            name,
            label,
            value,
            choices,
            required,
            trigger,
            tooltip,
        )


class Checklist:
    """Create a set of checkboxes.
    Use this for multi-select scenarios in which a user chooses one or more items from a group of
    choices that are not mutually exclusive.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            values: Optional[List[str]] = None,
            choices: Optional[List[Choice]] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed above the component."""
        self.values = values
        """The names of the selected choices."""
        self.choices = choices
        """The choices to be presented."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Checklist.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            values=self.values,
            choices=None if self.choices is None else [__e.dump() for __e in self.choices],
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Checklist':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Checklist.name is required.')
        __d_label: Any = __d.get('label')
        __d_values: Any = __d.get('values')
        __d_choices: Any = __d.get('choices')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        values: Optional[List[str]] = __d_values
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        tooltip: Optional[str] = __d_tooltip
        return Checklist(
            name,
            label,
            values,
            choices,
            tooltip,
        )


class Dropdown:
    """Create a dropdown.

    A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
    a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
    selected item is visible. When users click the drop-down button, all the options become visible.

    To change the value, users open the list and click another value or use the arrow keys (up and down) to
    select a new value.

    Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
    multi-select dropdown.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            placeholder: Optional[str] = None,
            value: Optional[str] = None,
            values: Optional[List[str]] = None,
            choices: Optional[List[Choice]] = None,
            required: Optional[bool] = None,
            disabled: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field."""
        self.value = value
        """The name of the selected choice."""
        self.values = values
        """The names of the selected choices. If this parameter is set, multiple selections will be allowed."""
        self.choices = choices
        """The choices to be presented."""
        self.required = required
        """True if this is a required field."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.trigger = trigger
        """True if the form should be submitted when the dropdown value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Dropdown.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            values=self.values,
            choices=None if self.choices is None else [__e.dump() for __e in self.choices],
            required=self.required,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Dropdown':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Dropdown.name is required.')
        __d_label: Any = __d.get('label')
        __d_placeholder: Any = __d.get('placeholder')
        __d_value: Any = __d.get('value')
        __d_values: Any = __d.get('values')
        __d_choices: Any = __d.get('choices')
        __d_required: Any = __d.get('required')
        __d_disabled: Any = __d.get('disabled')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        values: Optional[List[str]] = __d_values
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Dropdown(
            name,
            label,
            placeholder,
            value,
            values,
            choices,
            required,
            disabled,
            trigger,
            tooltip,
        )


class Combobox:
    """Create a combobox.

    A combobox is a list in which the selected item is always visible, and the others are visible on demand by
    clicking a drop-down button or by typing in the input.
    They are used to simplify the design and make a choice within the UI.

    When closed, only the selected item is visible.
    When users click the drop-down button, all the options become visible.
    To change the value, users open the list and click another value or use the arrow keys (up and down)
    to select a new value.
    When collapsed the user can select a new value by typing.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            placeholder: Optional[str] = None,
            value: Optional[str] = None,
            choices: Optional[List[str]] = None,
            error: Optional[str] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field."""
        self.value = value
        """The name of the selected choice."""
        self.choices = choices
        """The choices to be presented."""
        self.error = error
        """Text to be displayed as an error below the text box."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Combobox.name is required.')
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
    def load(__d: Dict) -> 'Combobox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Combobox.name is required.')
        __d_label: Any = __d.get('label')
        __d_placeholder: Any = __d.get('placeholder')
        __d_value: Any = __d.get('value')
        __d_choices: Any = __d.get('choices')
        __d_error: Any = __d.get('error')
        __d_disabled: Any = __d.get('disabled')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        choices: Optional[List[str]] = __d_choices
        error: Optional[str] = __d_error
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        return Combobox(
            name,
            label,
            placeholder,
            value,
            choices,
            error,
            disabled,
            tooltip,
        )


class Slider:
    """Create a slider.

    A slider is an element used to set a value. It provides a visual indication of adjustable content, as well as the
    current setting in the total range of content. It is displayed as a horizontal track with options on either side.
    A knob or lever is dragged to one end or the other to make the choice, indicating the current value.
    Marks on the slider bar can show values and users can choose where they want to drag the knob or lever to
    set the value.

    A slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.
    For example, users think about setting their audio volume to low or medium — not about setting the
    value to two or five.

    The default value of the slider will be zero or be constrained to the min and max values. The min will be returned
    if the value is set under the min and the max will be returned if set higher than the max value.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            min: Optional[float] = None,
            max: Optional[float] = None,
            step: Optional[float] = None,
            value: Optional[float] = None,
            disabled: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.min = min
        """The minimum value of the slider."""
        self.max = max
        """The maximum value of the slider."""
        self.step = step
        """The difference between two adjacent values of the slider."""
        self.value = value
        """The current value of the slider."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.trigger = trigger
        """True if the form should be submitted when the slider value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Slider.name is required.')
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
    def load(__d: Dict) -> 'Slider':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Slider.name is required.')
        __d_label: Any = __d.get('label')
        __d_min: Any = __d.get('min')
        __d_max: Any = __d.get('max')
        __d_step: Any = __d.get('step')
        __d_value: Any = __d.get('value')
        __d_disabled: Any = __d.get('disabled')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        value: Optional[float] = __d_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Slider(
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


class Spinbox:
    """Create a spinbox.

    A spinbox allows the user to incrementally adjust a value in small steps.
    It is mainly used for numeric values, but other values are supported too.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            min: Optional[float] = None,
            max: Optional[float] = None,
            step: Optional[float] = None,
            value: Optional[float] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.min = min
        """The minimum value of the spinbox."""
        self.max = max
        """The maximum value of the spinbox."""
        self.step = step
        """The difference between two adjacent values of the spinbox."""
        self.value = value
        """The current value of the spinbox."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Spinbox.name is required.')
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
    def load(__d: Dict) -> 'Spinbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Spinbox.name is required.')
        __d_label: Any = __d.get('label')
        __d_min: Any = __d.get('min')
        __d_max: Any = __d.get('max')
        __d_step: Any = __d.get('step')
        __d_value: Any = __d.get('value')
        __d_disabled: Any = __d.get('disabled')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        value: Optional[float] = __d_value
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        return Spinbox(
            name,
            label,
            min,
            max,
            step,
            value,
            disabled,
            tooltip,
        )


class DatePicker:
    """Create a date picker.

    A date picker allows a user to pick a date value.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            placeholder: Optional[str] = None,
            value: Optional[str] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field."""
        self.value = value
        """The date value in YYYY-MM-DD format."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('DatePicker.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'DatePicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('DatePicker.name is required.')
        __d_label: Any = __d.get('label')
        __d_placeholder: Any = __d.get('placeholder')
        __d_value: Any = __d.get('value')
        __d_disabled: Any = __d.get('disabled')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        return DatePicker(
            name,
            label,
            placeholder,
            value,
            disabled,
            tooltip,
        )


class ColorPicker:
    """Create a color picker.

    A date picker allows a user to pick a color value.
    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            value: Optional[str] = None,
            choices: Optional[List[str]] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.value = value
        """The selected color (CSS-compatible string)"""
        self.choices = choices
        """A list of colors (CSS-compatible strings) to limit color choices to."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('ColorPicker.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=self.choices,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'ColorPicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('ColorPicker.name is required.')
        __d_label: Any = __d.get('label')
        __d_value: Any = __d.get('value')
        __d_choices: Any = __d.get('choices')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[str] = __d_value
        choices: Optional[List[str]] = __d_choices
        tooltip: Optional[str] = __d_tooltip
        return ColorPicker(
            name,
            label,
            value,
            choices,
            tooltip,
        )


class Button:
    """Create a button.

    Buttons are best used to enable a user to commit a change or complete steps in a task.
    They are typically found inside forms, dialogs, panels or pages.
    An example of their usage is confirming the deletion of a file in a confirmation dialog.

    When considering their place in a layout, contemplate the order in which a user will flow through the UI.
    As an example, in a form, the individual will need to read and interact with the form fields before submitting
    the form. Therefore, as a general rule, the button should be placed at the bottom of the UI container
    which holds the related UI elements.

    Buttons may be placed within a "buttons" component which will lay out the buttons horizontally, or used
    individually and they will be stacked vertically.

    While buttons can technically be used to navigate a user to another part of the experience, this is not
    recommended unless that navigation is part of an action or their flow.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            caption: Optional[str] = None,
            value: Optional[str] = None,
            primary: Optional[bool] = None,
            disabled: Optional[bool] = None,
            link: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked."""
        self.label = label
        """The text displayed on the button."""
        self.caption = caption
        """The caption displayed below the label. Setting a caption renders a compound button."""
        self.value = value
        """A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True."""
        self.primary = primary
        """True if the button should be rendered as the primary button in the set."""
        self.disabled = disabled
        """True if the button should be disabled."""
        self.link = link
        """True if the button should be rendered as link text and not a standard button."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Button.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            value=self.value,
            primary=self.primary,
            disabled=self.disabled,
            link=self.link,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Button':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Button.name is required.')
        __d_label: Any = __d.get('label')
        __d_caption: Any = __d.get('caption')
        __d_value: Any = __d.get('value')
        __d_primary: Any = __d.get('primary')
        __d_disabled: Any = __d.get('disabled')
        __d_link: Any = __d.get('link')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        caption: Optional[str] = __d_caption
        value: Optional[str] = __d_value
        primary: Optional[bool] = __d_primary
        disabled: Optional[bool] = __d_disabled
        link: Optional[bool] = __d_link
        tooltip: Optional[str] = __d_tooltip
        return Button(
            name,
            label,
            caption,
            value,
            primary,
            disabled,
            link,
            tooltip,
        )


class Buttons:
    """Create a set of buttons to be layed out horizontally.
    """
    def __init__(
            self,
            items: List['Component'],
    ):
        self.items = items
        """The button in this set."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.items is None:
            raise ValueError('Buttons.items is required.')
        return _dump(
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Buttons':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('Buttons.items is required.')
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        return Buttons(
            items,
        )


class FileUpload:
    """Create a file upload component.
    A file upload component allows a user to browse, select and upload one or more files.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            multiple: Optional[bool] = None,
            file_extensions: Optional[List[str]] = None,
            max_file_size: Optional[float] = None,
            max_size: Optional[float] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.multiple = multiple
        """True if the component should allow multiple files to be uploaded."""
        self.file_extensions = file_extensions
        """List of allowed file extensions, e.g. `pdf`, `docx`, etc."""
        self.max_file_size = max_file_size
        """Maximum allowed size (Mb) per file. Defaults to no limit."""
        self.max_size = max_size
        """Maximum allowed size (Mb) for all files combined. Defaults to no limit."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('FileUpload.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            multiple=self.multiple,
            file_extensions=self.file_extensions,
            max_file_size=self.max_file_size,
            max_size=self.max_size,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'FileUpload':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('FileUpload.name is required.')
        __d_label: Any = __d.get('label')
        __d_multiple: Any = __d.get('multiple')
        __d_file_extensions: Any = __d.get('file_extensions')
        __d_max_file_size: Any = __d.get('max_file_size')
        __d_max_size: Any = __d.get('max_size')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        multiple: Optional[bool] = __d_multiple
        file_extensions: Optional[List[str]] = __d_file_extensions
        max_file_size: Optional[float] = __d_max_file_size
        max_size: Optional[float] = __d_max_size
        tooltip: Optional[str] = __d_tooltip
        return FileUpload(
            name,
            label,
            multiple,
            file_extensions,
            max_file_size,
            max_size,
            tooltip,
        )


class TableColumn:
    """Create a table column.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        """An identifying name for this column."""
        self.label = label
        """The text displayed on the column header."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('TableColumn.name is required.')
        if self.label is None:
            raise ValueError('TableColumn.label is required.')
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'TableColumn':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('TableColumn.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('TableColumn.label is required.')
        name: str = __d_name
        label: str = __d_label
        return TableColumn(
            name,
            label,
        )


class TableRow:
    """Create a table row.
    """
    def __init__(
            self,
            name: str,
            cells: List[str],
    ):
        self.name = name
        """An identifying name for this row."""
        self.cells = cells
        """The cells in this row (displayed left to right)."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('TableRow.name is required.')
        if self.cells is None:
            raise ValueError('TableRow.cells is required.')
        return _dump(
            name=self.name,
            cells=self.cells,
        )

    @staticmethod
    def load(__d: Dict) -> 'TableRow':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('TableRow.name is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('TableRow.cells is required.')
        name: str = __d_name
        cells: List[str] = __d_cells
        return TableRow(
            name,
            cells,
        )


class Table:
    """Create an interactive table.

    This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
    display a non-interactive table of information, use a markdown table.

    If `multiple` is set to False (default), each row in the table is clickable. When a row is clicked, the form is
    submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
    the table, and `row_name` is the `name` of the row that was clicked on.

    If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
    Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
    `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
    and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
    set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
    submission.
    """
    def __init__(
            self,
            name: str,
            columns: List[TableColumn],
            rows: List[TableRow],
            multiple: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.columns = columns
        """The columns in this table."""
        self.rows = rows
        """The rows in this table."""
        self.multiple = multiple
        """True to allow multiple rows to be selected."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Table.name is required.')
        if self.columns is None:
            raise ValueError('Table.columns is required.')
        if self.rows is None:
            raise ValueError('Table.rows is required.')
        return _dump(
            name=self.name,
            columns=[__e.dump() for __e in self.columns],
            rows=[__e.dump() for __e in self.rows],
            multiple=self.multiple,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Table':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Table.name is required.')
        __d_columns: Any = __d.get('columns')
        if __d_columns is None:
            raise ValueError('Table.columns is required.')
        __d_rows: Any = __d.get('rows')
        if __d_rows is None:
            raise ValueError('Table.rows is required.')
        __d_multiple: Any = __d.get('multiple')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        columns: List[TableColumn] = [TableColumn.load(__e) for __e in __d_columns]
        rows: List[TableRow] = [TableRow.load(__e) for __e in __d_rows]
        multiple: Optional[bool] = __d_multiple
        tooltip: Optional[str] = __d_tooltip
        return Table(
            name,
            columns,
            rows,
            multiple,
            tooltip,
        )


class Link:
    """Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a `/` and point to URLs within the Q UI.
    All other kinds of paths are treated as external hyperlinks.
    """
    def __init__(
            self,
            label: Optional[str] = None,
            path: Optional[str] = None,
            disabled: Optional[bool] = None,
            download: Optional[bool] = None,
            button: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.label = label
        """The text to be displayed. If blank, the `path` is used as the label."""
        self.path = path
        """The path or URL to link to."""
        self.disabled = disabled
        """True if the link should be disabled."""
        self.download = download
        """True if the link should be used for file download."""
        self.button = button
        """True if the link should be rendered as a button."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            label=self.label,
            path=self.path,
            disabled=self.disabled,
            download=self.download,
            button=self.button,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Link':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        __d_path: Any = __d.get('path')
        __d_disabled: Any = __d.get('disabled')
        __d_download: Any = __d.get('download')
        __d_button: Any = __d.get('button')
        __d_tooltip: Any = __d.get('tooltip')
        label: Optional[str] = __d_label
        path: Optional[str] = __d_path
        disabled: Optional[bool] = __d_disabled
        download: Optional[bool] = __d_download
        button: Optional[bool] = __d_button
        tooltip: Optional[str] = __d_tooltip
        return Link(
            label,
            path,
            disabled,
            download,
            button,
            tooltip,
        )


class Tab:
    """Create a tab.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            icon: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed on the tab."""
        self.icon = icon
        """The icon displayed on the tab."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Tab.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'Tab':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Tab.name is required.')
        __d_label: Any = __d.get('label')
        __d_icon: Any = __d.get('icon')
        name: str = __d_name
        label: Optional[str] = __d_label
        icon: Optional[str] = __d_icon
        return Tab(
            name,
            label,
            icon,
        )


class Tabs:
    """Create a tab bar.
    """
    def __init__(
            self,
            name: str,
            value: Optional[str] = None,
            items: Optional[List[Tab]] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.value = value
        """The name of the tab to select."""
        self.items = items
        """The tabs in this tab bar."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Tabs.name is required.')
        return _dump(
            name=self.name,
            value=self.value,
            items=None if self.items is None else [__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Tabs':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Tabs.name is required.')
        __d_value: Any = __d.get('value')
        __d_items: Any = __d.get('items')
        name: str = __d_name
        value: Optional[str] = __d_value
        items: Optional[List[Tab]] = None if __d_items is None else [Tab.load(__e) for __e in __d_items]
        return Tabs(
            name,
            value,
            items,
        )


class Expander:
    """Creates a new expander.

    Expanders can be used to show or hide a group of related components.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            expanded: Optional[bool] = None,
            items: Optional[List['Component']] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed on the expander."""
        self.expanded = expanded
        """True if expanded, False if collapsed."""
        self.items = items
        """List of components to be hideable by the expander."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Expander.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            expanded=self.expanded,
            items=None if self.items is None else [__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Expander':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Expander.name is required.')
        __d_label: Any = __d.get('label')
        __d_expanded: Any = __d.get('expanded')
        __d_items: Any = __d.get('items')
        name: str = __d_name
        label: Optional[str] = __d_label
        expanded: Optional[bool] = __d_expanded
        items: Optional[List['Component']] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        return Expander(
            name,
            label,
            expanded,
            items,
        )


class Frame:
    """Create a new inline frame (an `iframe`).
    """
    def __init__(
            self,
            path: Optional[str] = None,
            content: Optional[str] = None,
            width: Optional[str] = None,
            height: Optional[str] = None,
    ):
        self.path = path
        """The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`"""
        self.content = content
        """The HTML content of the page. A string containing `<html>...</html>`."""
        self.width = width
        """The width of the frame, e.g. `200px`, `50%`, etc. Defaults to `100%`."""
        self.height = height
        """The height of the frame, e.g. `200px`, `50%`, etc. Defaults to `150px`."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            path=self.path,
            content=self.content,
            width=self.width,
            height=self.height,
        )

    @staticmethod
    def load(__d: Dict) -> 'Frame':
        """Creates an instance of this class using the contents of a dict."""
        __d_path: Any = __d.get('path')
        __d_content: Any = __d.get('content')
        __d_width: Any = __d.get('width')
        __d_height: Any = __d.get('height')
        path: Optional[str] = __d_path
        content: Optional[str] = __d_content
        width: Optional[str] = __d_width
        height: Optional[str] = __d_height
        return Frame(
            path,
            content,
            width,
            height,
        )


class Picker:
    """Create a picker.
    Pickers are used to select one or more choices, such as tags or files, from a list.
    Use a picker to allow the user to quickly search for or manage a few tags or files.
    """
    def __init__(
            self,
            name: str,
            choices: List[Choice],
            label: Optional[str] = None,
            values: Optional[List[str]] = None,
            max_choices: Optional[int] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.choices = choices
        """The choices to be presented."""
        self.label = label
        """Text to be displayed above the component."""
        self.values = values
        """The names of the selected choices."""
        self.max_choices = max_choices
        """Maximum number of selectable choices. Defaults to no limit."""
        self.disabled = disabled
        """Controls whether the picker should be disabled or not."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Picker.name is required.')
        if self.choices is None:
            raise ValueError('Picker.choices is required.')
        return _dump(
            name=self.name,
            choices=[__e.dump() for __e in self.choices],
            label=self.label,
            values=self.values,
            max_choices=self.max_choices,
            disabled=self.disabled,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Picker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Picker.name is required.')
        __d_choices: Any = __d.get('choices')
        if __d_choices is None:
            raise ValueError('Picker.choices is required.')
        __d_label: Any = __d.get('label')
        __d_values: Any = __d.get('values')
        __d_max_choices: Any = __d.get('max_choices')
        __d_disabled: Any = __d.get('disabled')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        choices: List[Choice] = [Choice.load(__e) for __e in __d_choices]
        label: Optional[str] = __d_label
        values: Optional[List[str]] = __d_values
        max_choices: Optional[int] = __d_max_choices
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        return Picker(
            name,
            choices,
            label,
            values,
            max_choices,
            disabled,
            tooltip,
        )


class RangeSlider:
    """Create a range slider.

    A range slider is an element used to select a value range. It provides a visual indication of adjustable content, as well as the
    current setting in the total range of content. It is displayed as a horizontal track with options on either side.
    Knobs or levers are dragged to one end or the other to make the choice, indicating the current max and min value.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            min: Optional[float] = None,
            max: Optional[float] = None,
            step: Optional[float] = None,
            min_value: Optional[float] = None,
            max_value: Optional[float] = None,
            disabled: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.min = min
        """The minimum value of the slider. Defaults to 0."""
        self.max = max
        """The maximum value of the slider. Defaults to 100."""
        self.step = step
        """The difference between two adjacent values of the slider."""
        self.min_value = min_value
        """The lower bound of the selected range."""
        self.max_value = max_value
        """The upper bound of the selected range."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.trigger = trigger
        """True if the form should be submitted when the slider value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('RangeSlider.name is required.')
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            min_value=self.min_value,
            max_value=self.max_value,
            disabled=self.disabled,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'RangeSlider':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('RangeSlider.name is required.')
        __d_label: Any = __d.get('label')
        __d_min: Any = __d.get('min')
        __d_max: Any = __d.get('max')
        __d_step: Any = __d.get('step')
        __d_min_value: Any = __d.get('min_value')
        __d_max_value: Any = __d.get('max_value')
        __d_disabled: Any = __d.get('disabled')
        __d_trigger: Any = __d.get('trigger')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        min_value: Optional[float] = __d_min_value
        max_value: Optional[float] = __d_max_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return RangeSlider(
            name,
            label,
            min,
            max,
            step,
            min_value,
            max_value,
            disabled,
            trigger,
            tooltip,
        )


class Step:
    """Create a step for a stepper.
    """
    def __init__(
            self,
            label: str,
            icon: Optional[str] = None,
            done: Optional[bool] = None,
    ):
        self.label = label
        """Text displayed below icon."""
        self.icon = icon
        """Icon to be displayed."""
        self.done = done
        """Indicates whether this step has already been completed."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('Step.label is required.')
        return _dump(
            label=self.label,
            icon=self.icon,
            done=self.done,
        )

    @staticmethod
    def load(__d: Dict) -> 'Step':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('Step.label is required.')
        __d_icon: Any = __d.get('icon')
        __d_done: Any = __d.get('done')
        label: str = __d_label
        icon: Optional[str] = __d_icon
        done: Optional[bool] = __d_done
        return Step(
            label,
            icon,
            done,
        )


class Stepper:
    """Create a component that displays a sequence of steps in a process.
    The steps keep users informed about where they are in the process and how much is left to complete.
    """
    def __init__(
            self,
            name: str,
            items: List[Step],
            tooltip: Optional[str] = None,
    ):
        self.name = name
        """An identifying name for this component."""
        self.items = items
        """The sequence of steps to be displayed."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('Stepper.name is required.')
        if self.items is None:
            raise ValueError('Stepper.items is required.')
        return _dump(
            name=self.name,
            items=[__e.dump() for __e in self.items],
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Stepper':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('Stepper.name is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('Stepper.items is required.')
        __d_tooltip: Any = __d.get('tooltip')
        name: str = __d_name
        items: List[Step] = [Step.load(__e) for __e in __d_items]
        tooltip: Optional[str] = __d_tooltip
        return Stepper(
            name,
            items,
            tooltip,
        )


class Component:
    """Create a component.
    """
    def __init__(
            self,
            text: Optional[Text] = None,
            text_xl: Optional[TextXl] = None,
            text_l: Optional[TextL] = None,
            text_m: Optional[TextM] = None,
            text_s: Optional[TextS] = None,
            text_xs: Optional[TextXs] = None,
            label: Optional[Label] = None,
            separator: Optional[Separator] = None,
            progress: Optional[Progress] = None,
            message_bar: Optional[MessageBar] = None,
            textbox: Optional[Textbox] = None,
            checkbox: Optional[Checkbox] = None,
            toggle: Optional[Toggle] = None,
            choice_group: Optional[ChoiceGroup] = None,
            checklist: Optional[Checklist] = None,
            dropdown: Optional[Dropdown] = None,
            combobox: Optional[Combobox] = None,
            slider: Optional[Slider] = None,
            spinbox: Optional[Spinbox] = None,
            date_picker: Optional[DatePicker] = None,
            color_picker: Optional[ColorPicker] = None,
            button: Optional[Button] = None,
            buttons: Optional[Buttons] = None,
            file_upload: Optional[FileUpload] = None,
            table: Optional[Table] = None,
            link: Optional[Link] = None,
            tabs: Optional[Tabs] = None,
            expander: Optional[Expander] = None,
            frame: Optional[Frame] = None,
            picker: Optional[Picker] = None,
            range_slider: Optional[RangeSlider] = None,
            stepper: Optional[Stepper] = None,
    ):
        self.text = text
        """Text block."""
        self.text_xl = text_xl
        """Extra-large sized text block."""
        self.text_l = text_l
        """Large sized text block."""
        self.text_m = text_m
        """Medium sized text block."""
        self.text_s = text_s
        """Small sized text block."""
        self.text_xs = text_xs
        """Extra-small sized text block."""
        self.label = label
        """Label."""
        self.separator = separator
        """Separator."""
        self.progress = progress
        """Progress bar."""
        self.message_bar = message_bar
        """Message bar."""
        self.textbox = textbox
        """Textbox."""
        self.checkbox = checkbox
        """Checkbox."""
        self.toggle = toggle
        """Toggle."""
        self.choice_group = choice_group
        """Choice group."""
        self.checklist = checklist
        """Checklist."""
        self.dropdown = dropdown
        """Dropdown."""
        self.combobox = combobox
        """Combobox."""
        self.slider = slider
        """Slider."""
        self.spinbox = spinbox
        """Spinbox."""
        self.date_picker = date_picker
        """Date picker."""
        self.color_picker = color_picker
        """Color picker."""
        self.button = button
        """Button."""
        self.buttons = buttons
        """Button set."""
        self.file_upload = file_upload
        """File upload."""
        self.table = table
        """Table."""
        self.link = link
        """Link."""
        self.tabs = tabs
        """Tabs."""
        self.expander = expander
        """Expander."""
        self.frame = frame
        """Frame"""
        self.picker = picker
        """Picker"""
        self.range_slider = range_slider
        """RangeSlider"""
        self.stepper = stepper
        """Stepper"""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            text=None if self.text is None else self.text.dump(),
            text_xl=None if self.text_xl is None else self.text_xl.dump(),
            text_l=None if self.text_l is None else self.text_l.dump(),
            text_m=None if self.text_m is None else self.text_m.dump(),
            text_s=None if self.text_s is None else self.text_s.dump(),
            text_xs=None if self.text_xs is None else self.text_xs.dump(),
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
            button=None if self.button is None else self.button.dump(),
            buttons=None if self.buttons is None else self.buttons.dump(),
            file_upload=None if self.file_upload is None else self.file_upload.dump(),
            table=None if self.table is None else self.table.dump(),
            link=None if self.link is None else self.link.dump(),
            tabs=None if self.tabs is None else self.tabs.dump(),
            expander=None if self.expander is None else self.expander.dump(),
            frame=None if self.frame is None else self.frame.dump(),
            picker=None if self.picker is None else self.picker.dump(),
            range_slider=None if self.range_slider is None else self.range_slider.dump(),
            stepper=None if self.stepper is None else self.stepper.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'Component':
        """Creates an instance of this class using the contents of a dict."""
        __d_text: Any = __d.get('text')
        __d_text_xl: Any = __d.get('text_xl')
        __d_text_l: Any = __d.get('text_l')
        __d_text_m: Any = __d.get('text_m')
        __d_text_s: Any = __d.get('text_s')
        __d_text_xs: Any = __d.get('text_xs')
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
        __d_button: Any = __d.get('button')
        __d_buttons: Any = __d.get('buttons')
        __d_file_upload: Any = __d.get('file_upload')
        __d_table: Any = __d.get('table')
        __d_link: Any = __d.get('link')
        __d_tabs: Any = __d.get('tabs')
        __d_expander: Any = __d.get('expander')
        __d_frame: Any = __d.get('frame')
        __d_picker: Any = __d.get('picker')
        __d_range_slider: Any = __d.get('range_slider')
        __d_stepper: Any = __d.get('stepper')
        text: Optional[Text] = None if __d_text is None else Text.load(__d_text)
        text_xl: Optional[TextXl] = None if __d_text_xl is None else TextXl.load(__d_text_xl)
        text_l: Optional[TextL] = None if __d_text_l is None else TextL.load(__d_text_l)
        text_m: Optional[TextM] = None if __d_text_m is None else TextM.load(__d_text_m)
        text_s: Optional[TextS] = None if __d_text_s is None else TextS.load(__d_text_s)
        text_xs: Optional[TextXs] = None if __d_text_xs is None else TextXs.load(__d_text_xs)
        label: Optional[Label] = None if __d_label is None else Label.load(__d_label)
        separator: Optional[Separator] = None if __d_separator is None else Separator.load(__d_separator)
        progress: Optional[Progress] = None if __d_progress is None else Progress.load(__d_progress)
        message_bar: Optional[MessageBar] = None if __d_message_bar is None else MessageBar.load(__d_message_bar)
        textbox: Optional[Textbox] = None if __d_textbox is None else Textbox.load(__d_textbox)
        checkbox: Optional[Checkbox] = None if __d_checkbox is None else Checkbox.load(__d_checkbox)
        toggle: Optional[Toggle] = None if __d_toggle is None else Toggle.load(__d_toggle)
        choice_group: Optional[ChoiceGroup] = None if __d_choice_group is None else ChoiceGroup.load(__d_choice_group)
        checklist: Optional[Checklist] = None if __d_checklist is None else Checklist.load(__d_checklist)
        dropdown: Optional[Dropdown] = None if __d_dropdown is None else Dropdown.load(__d_dropdown)
        combobox: Optional[Combobox] = None if __d_combobox is None else Combobox.load(__d_combobox)
        slider: Optional[Slider] = None if __d_slider is None else Slider.load(__d_slider)
        spinbox: Optional[Spinbox] = None if __d_spinbox is None else Spinbox.load(__d_spinbox)
        date_picker: Optional[DatePicker] = None if __d_date_picker is None else DatePicker.load(__d_date_picker)
        color_picker: Optional[ColorPicker] = None if __d_color_picker is None else ColorPicker.load(__d_color_picker)
        button: Optional[Button] = None if __d_button is None else Button.load(__d_button)
        buttons: Optional[Buttons] = None if __d_buttons is None else Buttons.load(__d_buttons)
        file_upload: Optional[FileUpload] = None if __d_file_upload is None else FileUpload.load(__d_file_upload)
        table: Optional[Table] = None if __d_table is None else Table.load(__d_table)
        link: Optional[Link] = None if __d_link is None else Link.load(__d_link)
        tabs: Optional[Tabs] = None if __d_tabs is None else Tabs.load(__d_tabs)
        expander: Optional[Expander] = None if __d_expander is None else Expander.load(__d_expander)
        frame: Optional[Frame] = None if __d_frame is None else Frame.load(__d_frame)
        picker: Optional[Picker] = None if __d_picker is None else Picker.load(__d_picker)
        range_slider: Optional[RangeSlider] = None if __d_range_slider is None else RangeSlider.load(__d_range_slider)
        stepper: Optional[Stepper] = None if __d_stepper is None else Stepper.load(__d_stepper)
        return Component(
            text,
            text_xl,
            text_l,
            text_m,
            text_s,
            text_xs,
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
            button,
            buttons,
            file_upload,
            table,
            link,
            tabs,
            expander,
            frame,
            picker,
            range_slider,
            stepper,
        )


class FormCard:
    """Create a form.
    """
    def __init__(
            self,
            box: str,
            items: Union[List[Component], str],
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The components in this form."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('FormCard.box is required.')
        if self.items is None:
            raise ValueError('FormCard.items is required.')
        return _dump(
            view='form',
            box=self.box,
            items=self.items if isinstance(self.items, str) else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('FormCard.box is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('FormCard.items is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        items: Union[List[Component], str] = __d_items if isinstance(__d_items, str) else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FormCard(
            box,
            items,
            commands,
        )


class FrameCard:
    """Render a card containing a HTML page inside an inline frame (an `iframe`).

    Either a path or content can be provided as arguments.
    """
    def __init__(
            self,
            box: str,
            title: str,
            path: Optional[str] = None,
            content: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.path = path
        """The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`"""
        self.content = content
        """The HTML content of the page. A string containing `<html>...</html>`"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('FrameCard.box is required.')
        if self.title is None:
            raise ValueError('FrameCard.title is required.')
        return _dump(
            view='frame',
            box=self.box,
            title=self.title,
            path=self.path,
            content=self.content,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FrameCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('FrameCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('FrameCard.title is required.')
        __d_path: Any = __d.get('path')
        __d_content: Any = __d.get('content')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        path: Optional[str] = __d_path
        content: Optional[str] = __d_content
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FrameCard(
            box,
            title,
            path,
            content,
            commands,
        )


class GraphicsCard:
    """Create a card for displaying vector graphics.
    """
    def __init__(
            self,
            box: str,
            view_box: str,
            stage: Optional[PackedRecords] = None,
            scene: Optional[PackedData] = None,
            width: Optional[str] = None,
            height: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.view_box = view_box
        """The position and dimension of the SVG viewport, in user space. A space-separated list of four numbers: min-x, min-y, width and height. For example, '0 0 400 300'. See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox"""
        self.stage = stage
        """Background layer for rendering static SVG elements. Must be packed to conserve memory."""
        self.scene = scene
        """Foreground layer for rendering dynamic SVG elements."""
        self.width = width
        """The displayed width of the rectangular viewport. (Not the width of its coordinate system.)"""
        self.height = height
        """The displayed height of the rectangular viewport. (Not the height of its coordinate system.)"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('GraphicsCard.box is required.')
        if self.view_box is None:
            raise ValueError('GraphicsCard.view_box is required.')
        return _dump(
            view='graphics',
            box=self.box,
            view_box=self.view_box,
            stage=self.stage,
            scene=self.scene,
            width=self.width,
            height=self.height,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'GraphicsCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('GraphicsCard.box is required.')
        __d_view_box: Any = __d.get('view_box')
        if __d_view_box is None:
            raise ValueError('GraphicsCard.view_box is required.')
        __d_stage: Any = __d.get('stage')
        __d_scene: Any = __d.get('scene')
        __d_width: Any = __d.get('width')
        __d_height: Any = __d.get('height')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        view_box: str = __d_view_box
        stage: Optional[PackedRecords] = __d_stage
        scene: Optional[PackedData] = __d_scene
        width: Optional[str] = __d_width
        height: Optional[str] = __d_height
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return GraphicsCard(
            box,
            view_box,
            stage,
            scene,
            width,
            height,
            commands,
        )


class GridCard:
    """EXPERIMENTAL. DO NOT USE.
    """
    def __init__(
            self,
            box: str,
            title: str,
            cells: PackedData,
            data: PackedData,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """EXPERIMENTAL. DO NOT USE."""
        self.cells = cells
        """EXPERIMENTAL. DO NOT USE."""
        self.data = data
        """EXPERIMENTAL. DO NOT USE."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('GridCard.box is required.')
        if self.title is None:
            raise ValueError('GridCard.title is required.')
        if self.cells is None:
            raise ValueError('GridCard.cells is required.')
        if self.data is None:
            raise ValueError('GridCard.data is required.')
        return _dump(
            view='grid',
            box=self.box,
            title=self.title,
            cells=self.cells,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'GridCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('GridCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('GridCard.title is required.')
        __d_cells: Any = __d.get('cells')
        if __d_cells is None:
            raise ValueError('GridCard.cells is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('GridCard.data is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        cells: PackedData = __d_cells
        data: PackedData = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return GridCard(
            box,
            title,
            cells,
            data,
            commands,
        )


class HeaderCard:
    """Render a card containing a HTML page inside an inline frame (iframe).

    Either a path or content can be provided as arguments.
    """
    def __init__(
            self,
            box: str,
            title: str,
            subtitle: str,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title."""
        self.subtitle = subtitle
        """The subtitle, displayed below the title."""
        self.icon = icon
        """The icon type, displayed to the left."""
        self.icon_color = icon_color
        """The icon's color."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('HeaderCard.box is required.')
        if self.title is None:
            raise ValueError('HeaderCard.title is required.')
        if self.subtitle is None:
            raise ValueError('HeaderCard.subtitle is required.')
        return _dump(
            view='header',
            box=self.box,
            title=self.title,
            subtitle=self.subtitle,
            icon=self.icon,
            icon_color=self.icon_color,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'HeaderCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('HeaderCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('HeaderCard.title is required.')
        __d_subtitle: Any = __d.get('subtitle')
        if __d_subtitle is None:
            raise ValueError('HeaderCard.subtitle is required.')
        __d_icon: Any = __d.get('icon')
        __d_icon_color: Any = __d.get('icon_color')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        subtitle: str = __d_subtitle
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return HeaderCard(
            box,
            title,
            subtitle,
            icon,
            icon_color,
            commands,
        )


class ImageCard:
    """Create a card that displays a base64-encoded image.
    """
    def __init__(
            self,
            box: str,
            title: str,
            type: str,
            image: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.type = type
        """The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`."""
        self.image = image
        """Image data, base64-encoded."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('ImageCard.box is required.')
        if self.title is None:
            raise ValueError('ImageCard.title is required.')
        if self.type is None:
            raise ValueError('ImageCard.type is required.')
        if self.image is None:
            raise ValueError('ImageCard.image is required.')
        return _dump(
            view='image',
            box=self.box,
            title=self.title,
            type=self.type,
            image=self.image,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('ImageCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('ImageCard.title is required.')
        __d_type: Any = __d.get('type')
        if __d_type is None:
            raise ValueError('ImageCard.type is required.')
        __d_image: Any = __d.get('image')
        if __d_image is None:
            raise ValueError('ImageCard.image is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        type: str = __d_type
        image: str = __d_image
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ImageCard(
            box,
            title,
            type,
            image,
            data,
            commands,
        )


class LargeBarStatCard:
    """Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value.
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
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.caption = caption
        """The card's caption."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value, typically a target value."""
        self.value_caption = value_caption
        """The caption displayed below the primary value."""
        self.aux_value_caption = aux_value_caption
        """The caption displayed below the auxiliary value."""
        self.progress = progress
        """The value of the progress bar, between 0 and 1."""
        self.plot_color = plot_color
        """The color of the progress bar."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('LargeBarStatCard.box is required.')
        if self.title is None:
            raise ValueError('LargeBarStatCard.title is required.')
        if self.caption is None:
            raise ValueError('LargeBarStatCard.caption is required.')
        if self.value is None:
            raise ValueError('LargeBarStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('LargeBarStatCard.aux_value is required.')
        if self.value_caption is None:
            raise ValueError('LargeBarStatCard.value_caption is required.')
        if self.aux_value_caption is None:
            raise ValueError('LargeBarStatCard.aux_value_caption is required.')
        if self.progress is None:
            raise ValueError('LargeBarStatCard.progress is required.')
        return _dump(
            view='large_bar_stat',
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
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'LargeBarStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('LargeBarStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('LargeBarStatCard.title is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('LargeBarStatCard.caption is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('LargeBarStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('LargeBarStatCard.aux_value is required.')
        __d_value_caption: Any = __d.get('value_caption')
        if __d_value_caption is None:
            raise ValueError('LargeBarStatCard.value_caption is required.')
        __d_aux_value_caption: Any = __d.get('aux_value_caption')
        if __d_aux_value_caption is None:
            raise ValueError('LargeBarStatCard.aux_value_caption is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('LargeBarStatCard.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        value_caption: str = __d_value_caption
        aux_value_caption: str = __d_aux_value_caption
        progress: float = __d_progress
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return LargeBarStatCard(
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
            commands,
        )


class LargeStatCard:
    """Create a stat card displaying a primary value, an auxiliary value and a caption.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            caption: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed next to the primary value."""
        self.caption = caption
        """The caption displayed below the primary value."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('LargeStatCard.box is required.')
        if self.title is None:
            raise ValueError('LargeStatCard.title is required.')
        if self.value is None:
            raise ValueError('LargeStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('LargeStatCard.aux_value is required.')
        if self.caption is None:
            raise ValueError('LargeStatCard.caption is required.')
        return _dump(
            view='large_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            caption=self.caption,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'LargeStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('LargeStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('LargeStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('LargeStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('LargeStatCard.aux_value is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('LargeStatCard.caption is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        caption: str = __d_caption
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return LargeStatCard(
            box,
            title,
            value,
            aux_value,
            caption,
            data,
            commands,
        )


class ListCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards laid out in the form of a list (vertically, top-to-bottom).
    """
    def __init__(
            self,
            box: str,
            title: str,
            item_view: str,
            item_props: PackedRecord,
            data: PackedData,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.item_view = item_view
        """The child card type."""
        self.item_props = item_props
        """The child card properties."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('ListCard.box is required.')
        if self.title is None:
            raise ValueError('ListCard.title is required.')
        if self.item_view is None:
            raise ValueError('ListCard.item_view is required.')
        if self.item_props is None:
            raise ValueError('ListCard.item_props is required.')
        if self.data is None:
            raise ValueError('ListCard.data is required.')
        return _dump(
            view='list',
            box=self.box,
            title=self.title,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ListCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('ListCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('ListCard.title is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('ListCard.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('ListCard.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('ListCard.data is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        data: PackedData = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ListCard(
            box,
            title,
            item_view,
            item_props,
            data,
            commands,
        )


class ListItem1Card:
    """EXPERIMENTAL. DO NOT USE.
    """
    def __init__(
            self,
            box: str,
            title: str,
            caption: str,
            value: str,
            aux_value: str,
            data: PackedRecord,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """EXPERIMENTAL. DO NOT USE."""
        self.caption = caption
        """EXPERIMENTAL. DO NOT USE."""
        self.value = value
        """EXPERIMENTAL. DO NOT USE."""
        self.aux_value = aux_value
        """EXPERIMENTAL. DO NOT USE."""
        self.data = data
        """EXPERIMENTAL. DO NOT USE."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('ListItem1Card.box is required.')
        if self.title is None:
            raise ValueError('ListItem1Card.title is required.')
        if self.caption is None:
            raise ValueError('ListItem1Card.caption is required.')
        if self.value is None:
            raise ValueError('ListItem1Card.value is required.')
        if self.aux_value is None:
            raise ValueError('ListItem1Card.aux_value is required.')
        if self.data is None:
            raise ValueError('ListItem1Card.data is required.')
        return _dump(
            view='list_item1',
            box=self.box,
            title=self.title,
            caption=self.caption,
            value=self.value,
            aux_value=self.aux_value,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ListItem1Card':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('ListItem1Card.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('ListItem1Card.title is required.')
        __d_caption: Any = __d.get('caption')
        if __d_caption is None:
            raise ValueError('ListItem1Card.caption is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('ListItem1Card.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('ListItem1Card.aux_value is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('ListItem1Card.data is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        caption: str = __d_caption
        value: str = __d_value
        aux_value: str = __d_aux_value
        data: PackedRecord = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ListItem1Card(
            box,
            title,
            caption,
            value,
            aux_value,
            data,
            commands,
        )


class MarkdownCard:
    """Create a card that renders Markdown content.

    Github-flavored markdown is supported.
    HTML markup is allowed in markdown content.
    URLs, if found, are displayed as hyperlinks.
    Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/"""
        self.data = data
        """Additional data for the card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('MarkdownCard.box is required.')
        if self.title is None:
            raise ValueError('MarkdownCard.title is required.')
        if self.content is None:
            raise ValueError('MarkdownCard.content is required.')
        return _dump(
            view='markdown',
            box=self.box,
            title=self.title,
            content=self.content,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkdownCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('MarkdownCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('MarkdownCard.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('MarkdownCard.content is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MarkdownCard(
            box,
            title,
            content,
            data,
            commands,
        )


class MarkupCard:
    """Render HTML content.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The HTML content."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('MarkupCard.box is required.')
        if self.title is None:
            raise ValueError('MarkupCard.title is required.')
        if self.content is None:
            raise ValueError('MarkupCard.content is required.')
        return _dump(
            view='markup',
            box=self.box,
            title=self.title,
            content=self.content,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkupCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('MarkupCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('MarkupCard.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('MarkupCard.content is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MarkupCard(
            box,
            title,
            content,
            commands,
        )


class MetaCard:
    """Represents page-global state.

    This card is invisible.
    It is used to control attributes of the active page.
    """
    def __init__(
            self,
            box: str,
            title: Optional[str] = None,
            refresh: Optional[int] = None,
            notification: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title of the page."""
        self.refresh = refresh
        """Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use)."""
        self.notification = notification
        """Display a desktop notification to the user."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('MetaCard.box is required.')
        return _dump(
            view='meta',
            box=self.box,
            title=self.title,
            refresh=self.refresh,
            notification=self.notification,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MetaCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('MetaCard.box is required.')
        __d_title: Any = __d.get('title')
        __d_refresh: Any = __d.get('refresh')
        __d_notification: Any = __d.get('notification')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: Optional[str] = __d_title
        refresh: Optional[int] = __d_refresh
        notification: Optional[str] = __d_notification
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MetaCard(
            box,
            title,
            refresh,
            notification,
            commands,
        )


class NavItem:
    """Create a navigation item.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        self.name = name
        """The name of this item. Prefix the name with a '#' to trigger hash-change navigation."""
        self.label = label
        """The label to display."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.name is None:
            raise ValueError('NavItem.name is required.')
        if self.label is None:
            raise ValueError('NavItem.label is required.')
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'NavItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        if __d_name is None:
            raise ValueError('NavItem.name is required.')
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('NavItem.label is required.')
        name: str = __d_name
        label: str = __d_label
        return NavItem(
            name,
            label,
        )


class NavGroup:
    """Create a group of navigation items.
    """
    def __init__(
            self,
            label: str,
            items: List[NavItem],
    ):
        self.label = label
        """The label to display for this group."""
        self.items = items
        """The navigation items contained in this group."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.label is None:
            raise ValueError('NavGroup.label is required.')
        if self.items is None:
            raise ValueError('NavGroup.items is required.')
        return _dump(
            label=self.label,
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'NavGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        if __d_label is None:
            raise ValueError('NavGroup.label is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('NavGroup.items is required.')
        label: str = __d_label
        items: List[NavItem] = [NavItem.load(__e) for __e in __d_items]
        return NavGroup(
            label,
            items,
        )


class NavCard:
    """Create a card containing a navigation pane.
    """
    def __init__(
            self,
            box: str,
            items: List[NavGroup],
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The navigation groups contained in this pane."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('NavCard.box is required.')
        if self.items is None:
            raise ValueError('NavCard.items is required.')
        return _dump(
            view='nav',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'NavCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('NavCard.box is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('NavCard.items is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        items: List[NavGroup] = [NavGroup.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return NavCard(
            box,
            items,
            commands,
        )


class PixelArtCard:
    """Create a card displaying a collaborative Pixel art tool, just for kicks.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.data = data
        """The data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('PixelArtCard.box is required.')
        if self.title is None:
            raise ValueError('PixelArtCard.title is required.')
        if self.data is None:
            raise ValueError('PixelArtCard.data is required.')
        return _dump(
            view='pixel_art',
            box=self.box,
            title=self.title,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'PixelArtCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('PixelArtCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('PixelArtCard.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('PixelArtCard.data is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return PixelArtCard(
            box,
            title,
            data,
            commands,
        )


class Mark:
    """Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
    A plot can contain multiple such layers of marks.
    """
    def __init__(
            self,
            coord: Optional[str] = None,
            type: Optional[str] = None,
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
            size: Optional[Value] = None,
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
        """Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'."""
        self.type = type
        """Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'."""
        self.x = x
        """X field or value."""
        self.x0 = x0
        """X base field or value."""
        self.x1 = x1
        """X bin lower bound field or value. For histograms."""
        self.x2 = x2
        """X bin upper bound field or value. For histograms."""
        self.x_min = x_min
        """X axis scale minimum."""
        self.x_max = x_max
        """X axis scale maximum."""
        self.x_nice = x_nice
        """Whether to nice X axis scale ticks."""
        self.x_scale = x_scale
        """X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'."""
        self.x_title = x_title
        """X axis title."""
        self.y = y
        """Y field or value."""
        self.y0 = y0
        """Y base field or value."""
        self.y1 = y1
        """Y bin lower bound field or value. For histograms."""
        self.y2 = y2
        """Y bin upper bound field or value. For histograms."""
        self.y_min = y_min
        """Y axis scale minimum."""
        self.y_max = y_max
        """Y axis scale maximum."""
        self.y_nice = y_nice
        """Whether to nice Y axis scale ticks."""
        self.y_scale = y_scale
        """Y axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'."""
        self.y_title = y_title
        """Y axis title."""
        self.color = color
        """Mark color field or value."""
        self.color_range = color_range
        """Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`"""
        self.shape = shape
        """Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'."""
        self.shape_range = shape_range
        """Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`"""
        self.size = size
        """Mark size field or value."""
        self.size_range = size_range
        """Mark size range. A string containing space-separated integers, e.g. `'4 30'`"""
        self.stack = stack
        """Field to stack marks by, or 'auto' to infer."""
        self.dodge = dodge
        """Field to dodge marks by, or 'auto' to infer."""
        self.curve = curve
        """Curve type for `line` and `area` mark types. One of 'none', 'smooth', 'step-before', 'step', 'step-after'."""
        self.fill_color = fill_color
        """Mark fill color."""
        self.fill_opacity = fill_opacity
        """Mark fill opacity."""
        self.stroke_color = stroke_color
        """Mark stroke color."""
        self.stroke_opacity = stroke_opacity
        """Mark stroke opacity."""
        self.stroke_size = stroke_size
        """Mark stroke size."""
        self.stroke_dash = stroke_dash
        """Mark stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]."""
        self.label = label
        """Label field or value."""
        self.label_offset = label_offset
        """Distance between label and mark."""
        self.label_offset_x = label_offset_x
        """Horizontal distance between label and mark."""
        self.label_offset_y = label_offset_y
        """Vertical distance between label and mark."""
        self.label_rotation = label_rotation
        """Label rotation angle, in degrees, or 'none' to disable automatic rotation. The default behavior is 'auto' for automatic rotation."""
        self.label_position = label_position
        """Label position relative to the mark. One of 'top', 'bottom', 'middle', 'left', 'right'."""
        self.label_overlap = label_overlap
        """Strategy to use if labels overlap. One of 'hide', 'overlap', 'constrain'."""
        self.label_fill_color = label_fill_color
        """Label fill color."""
        self.label_fill_opacity = label_fill_opacity
        """Label fill opacity."""
        self.label_stroke_color = label_stroke_color
        """Label stroke color."""
        self.label_stroke_opacity = label_stroke_opacity
        """Label stroke opacity."""
        self.label_stroke_size = label_stroke_size
        """Label stroke size (line width or pen thickness)."""
        self.label_font_size = label_font_size
        """Label font size."""
        self.label_font_weight = label_font_weight
        """Label font weight."""
        self.label_line_height = label_line_height
        """Label line height."""
        self.label_align = label_align
        """Label text alignment. One of 'left', 'right', 'center', 'start', 'end'."""
        self.ref_stroke_color = ref_stroke_color
        """Reference line stroke color."""
        self.ref_stroke_opacity = ref_stroke_opacity
        """Reference line stroke opacity."""
        self.ref_stroke_size = ref_stroke_size
        """Reference line stroke size (line width or pen thickness)."""
        self.ref_stroke_dash = ref_stroke_dash
        """Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        return _dump(
            coord=self.coord,
            type=self.type,
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
    def load(__d: Dict) -> 'Mark':
        """Creates an instance of this class using the contents of a dict."""
        __d_coord: Any = __d.get('coord')
        __d_type: Any = __d.get('type')
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
        type: Optional[str] = __d_type
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
        size: Optional[Value] = __d_size
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
        return Mark(
            coord,
            type,
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


class Plot:
    """Create a plot. A plot is composed of one or more graphical mark layers.
    """
    def __init__(
            self,
            marks: List[Mark],
    ):
        self.marks = marks
        """The graphical mark layers contained in this plot."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.marks is None:
            raise ValueError('Plot.marks is required.')
        return _dump(
            marks=[__e.dump() for __e in self.marks],
        )

    @staticmethod
    def load(__d: Dict) -> 'Plot':
        """Creates an instance of this class using the contents of a dict."""
        __d_marks: Any = __d.get('marks')
        if __d_marks is None:
            raise ValueError('Plot.marks is required.')
        marks: List[Mark] = [Mark.load(__e) for __e in __d_marks]
        return Plot(
            marks,
        )


class PlotCard:
    """Create a card displaying a plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            plot: Plot,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.data = data
        """Data for this card."""
        self.plot = plot
        """The plot to be displayed in this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('PlotCard.box is required.')
        if self.title is None:
            raise ValueError('PlotCard.title is required.')
        if self.data is None:
            raise ValueError('PlotCard.data is required.')
        if self.plot is None:
            raise ValueError('PlotCard.plot is required.')
        return _dump(
            view='plot',
            box=self.box,
            title=self.title,
            data=self.data,
            plot=self.plot.dump(),
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'PlotCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('PlotCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('PlotCard.title is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('PlotCard.data is required.')
        __d_plot: Any = __d.get('plot')
        if __d_plot is None:
            raise ValueError('PlotCard.plot is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        plot: Plot = Plot.load(__d_plot)
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return PlotCard(
            box,
            title,
            data,
            plot,
            commands,
        )


class RepeatCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards.
    """
    def __init__(
            self,
            box: str,
            item_view: str,
            item_props: PackedRecord,
            data: PackedData,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.item_view = item_view
        """EXPERIMENTAL. DO NOT USE."""
        self.item_props = item_props
        """The child card properties."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('RepeatCard.box is required.')
        if self.item_view is None:
            raise ValueError('RepeatCard.item_view is required.')
        if self.item_props is None:
            raise ValueError('RepeatCard.item_props is required.')
        if self.data is None:
            raise ValueError('RepeatCard.data is required.')
        return _dump(
            view='repeat',
            box=self.box,
            item_view=self.item_view,
            item_props=self.item_props,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'RepeatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('RepeatCard.box is required.')
        __d_item_view: Any = __d.get('item_view')
        if __d_item_view is None:
            raise ValueError('RepeatCard.item_view is required.')
        __d_item_props: Any = __d.get('item_props')
        if __d_item_props is None:
            raise ValueError('RepeatCard.item_props is required.')
        __d_data: Any = __d.get('data')
        if __d_data is None:
            raise ValueError('RepeatCard.data is required.')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        item_view: str = __d_item_view
        item_props: PackedRecord = __d_item_props
        data: PackedData = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return RepeatCard(
            box,
            item_view,
            item_props,
            data,
            commands,
        )


class SmallSeriesStatCard:
    """Create a small stat card displaying a primary value and a series plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            plot_data: PackedData,
            plot_value: str,
            plot_zero_value: Optional[float] = None,
            plot_category: Optional[str] = None,
            plot_type: Optional[str] = None,
            plot_curve: Optional[str] = None,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.plot_data = plot_data
        """The plot's data."""
        self.plot_value = plot_value
        """The data field to use for y-axis values."""
        self.plot_zero_value = plot_zero_value
        """The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used."""
        self.plot_category = plot_category
        """The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'."""
        self.plot_type = plot_type
        """The type of plot. Defaults to `area`. One of 'area', 'interval'."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('SmallSeriesStatCard.box is required.')
        if self.title is None:
            raise ValueError('SmallSeriesStatCard.title is required.')
        if self.value is None:
            raise ValueError('SmallSeriesStatCard.value is required.')
        if self.plot_data is None:
            raise ValueError('SmallSeriesStatCard.plot_data is required.')
        if self.plot_value is None:
            raise ValueError('SmallSeriesStatCard.plot_value is required.')
        return _dump(
            view='small_series_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            plot_data=self.plot_data,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_category=self.plot_category,
            plot_type=self.plot_type,
            plot_curve=self.plot_curve,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'SmallSeriesStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('SmallSeriesStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('SmallSeriesStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('SmallSeriesStatCard.value is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('SmallSeriesStatCard.plot_data is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('SmallSeriesStatCard.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        __d_plot_category: Any = __d.get('plot_category')
        __d_plot_type: Any = __d.get('plot_type')
        __d_plot_curve: Any = __d.get('plot_curve')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        plot_data: PackedData = __d_plot_data
        plot_value: str = __d_plot_value
        plot_zero_value: Optional[float] = __d_plot_zero_value
        plot_category: Optional[str] = __d_plot_category
        plot_type: Optional[str] = __d_plot_type
        plot_curve: Optional[str] = __d_plot_curve
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return SmallSeriesStatCard(
            box,
            title,
            value,
            plot_data,
            plot_value,
            plot_zero_value,
            plot_category,
            plot_type,
            plot_curve,
            plot_color,
            data,
            commands,
        )


class SmallStatCard:
    """Create a stat card displaying a single value.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('SmallStatCard.box is required.')
        if self.title is None:
            raise ValueError('SmallStatCard.title is required.')
        if self.value is None:
            raise ValueError('SmallStatCard.value is required.')
        return _dump(
            view='small_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'SmallStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('SmallStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('SmallStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('SmallStatCard.value is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return SmallStatCard(
            box,
            title,
            value,
            data,
            commands,
        )


class TabCard:
    """Create a card containing tabs for navigation.
    """
    def __init__(
            self,
            box: str,
            items: List[Tab],
            link: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """Items to render."""
        self.link = link
        """True if tabs should be rendered as links and not a standard tab."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('TabCard.box is required.')
        if self.items is None:
            raise ValueError('TabCard.items is required.')
        return _dump(
            view='tab',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            link=self.link,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TabCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('TabCard.box is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('TabCard.items is required.')
        __d_link: Any = __d.get('link')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        items: List[Tab] = [Tab.load(__e) for __e in __d_items]
        link: Optional[bool] = __d_link
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TabCard(
            box,
            items,
            link,
            commands,
        )


class TallGaugeStatCard:
    """Create a tall stat card displaying a primary value, an auxiliary value and a progress gauge.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed next to the primary value."""
        self.progress = progress
        """The value of the progress gauge, between 0 and 1."""
        self.plot_color = plot_color
        """The color of the progress gauge."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('TallGaugeStatCard.box is required.')
        if self.title is None:
            raise ValueError('TallGaugeStatCard.title is required.')
        if self.value is None:
            raise ValueError('TallGaugeStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('TallGaugeStatCard.aux_value is required.')
        if self.progress is None:
            raise ValueError('TallGaugeStatCard.progress is required.')
        return _dump(
            view='tall_gauge_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TallGaugeStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('TallGaugeStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('TallGaugeStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('TallGaugeStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('TallGaugeStatCard.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('TallGaugeStatCard.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TallGaugeStatCard(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
            commands,
        )


class TallSeriesStatCard:
    """Create a tall stat card displaying a primary value, an auxiliary value and a series plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            plot_data: PackedData,
            plot_value: str,
            plot_zero_value: Optional[float] = None,
            plot_category: Optional[str] = None,
            plot_type: Optional[str] = None,
            plot_curve: Optional[str] = None,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed below the primary value."""
        self.plot_data = plot_data
        """The plot's data."""
        self.plot_value = plot_value
        """The data field to use for y-axis values."""
        self.plot_zero_value = plot_zero_value
        """The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used."""
        self.plot_category = plot_category
        """The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'."""
        self.plot_type = plot_type
        """The type of plot. Defaults to `area`. One of 'area', 'interval'."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('TallSeriesStatCard.box is required.')
        if self.title is None:
            raise ValueError('TallSeriesStatCard.title is required.')
        if self.value is None:
            raise ValueError('TallSeriesStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('TallSeriesStatCard.aux_value is required.')
        if self.plot_data is None:
            raise ValueError('TallSeriesStatCard.plot_data is required.')
        if self.plot_value is None:
            raise ValueError('TallSeriesStatCard.plot_value is required.')
        return _dump(
            view='tall_series_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            plot_data=self.plot_data,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_category=self.plot_category,
            plot_type=self.plot_type,
            plot_curve=self.plot_curve,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TallSeriesStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('TallSeriesStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('TallSeriesStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('TallSeriesStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('TallSeriesStatCard.aux_value is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('TallSeriesStatCard.plot_data is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('TallSeriesStatCard.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        __d_plot_category: Any = __d.get('plot_category')
        __d_plot_type: Any = __d.get('plot_type')
        __d_plot_curve: Any = __d.get('plot_curve')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        plot_data: PackedData = __d_plot_data
        plot_value: str = __d_plot_value
        plot_zero_value: Optional[float] = __d_plot_zero_value
        plot_category: Optional[str] = __d_plot_category
        plot_type: Optional[str] = __d_plot_type
        plot_curve: Optional[str] = __d_plot_curve
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TallSeriesStatCard(
            box,
            title,
            value,
            aux_value,
            plot_data,
            plot_value,
            plot_zero_value,
            plot_category,
            plot_type,
            plot_curve,
            plot_color,
            data,
            commands,
        )


class TemplateCard:
    """Render dynamic content using a HTML template.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The Handlebars template. https://handlebarsjs.com/guide/"""
        self.data = data
        """Data for the Handlebars template"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('TemplateCard.box is required.')
        if self.title is None:
            raise ValueError('TemplateCard.title is required.')
        if self.content is None:
            raise ValueError('TemplateCard.content is required.')
        return _dump(
            view='template',
            box=self.box,
            title=self.title,
            content=self.content,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TemplateCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('TemplateCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('TemplateCard.title is required.')
        __d_content: Any = __d.get('content')
        if __d_content is None:
            raise ValueError('TemplateCard.content is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TemplateCard(
            box,
            title,
            content,
            data,
            commands,
        )


class ToolbarCard:
    """Create a card containing a toolbar.
    """
    def __init__(
            self,
            box: str,
            items: List[Command],
            secondary_items: Optional[List[Command]] = None,
            overflow_items: Optional[List[Command]] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """Items to render."""
        self.secondary_items = secondary_items
        """Items to render on the right side (or left, in RTL)."""
        self.overflow_items = overflow_items
        """Items to render in an overflow menu."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('ToolbarCard.box is required.')
        if self.items is None:
            raise ValueError('ToolbarCard.items is required.')
        return _dump(
            view='toolbar',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            secondary_items=None if self.secondary_items is None else [__e.dump() for __e in self.secondary_items],
            overflow_items=None if self.overflow_items is None else [__e.dump() for __e in self.overflow_items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ToolbarCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('ToolbarCard.box is required.')
        __d_items: Any = __d.get('items')
        if __d_items is None:
            raise ValueError('ToolbarCard.items is required.')
        __d_secondary_items: Any = __d.get('secondary_items')
        __d_overflow_items: Any = __d.get('overflow_items')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        items: List[Command] = [Command.load(__e) for __e in __d_items]
        secondary_items: Optional[List[Command]] = None if __d_secondary_items is None else [Command.load(__e) for __e in __d_secondary_items]
        overflow_items: Optional[List[Command]] = None if __d_overflow_items is None else [Command.load(__e) for __e in __d_overflow_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ToolbarCard(
            box,
            items,
            secondary_items,
            overflow_items,
            commands,
        )


class VegaCard:
    """Create a card containing a Vega-lite plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            specification: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title of this card."""
        self.specification = specification
        """The Vega-lite specification."""
        self.data = data
        """Data for the plot, if any."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('VegaCard.box is required.')
        if self.title is None:
            raise ValueError('VegaCard.title is required.')
        if self.specification is None:
            raise ValueError('VegaCard.specification is required.')
        return _dump(
            view='vega',
            box=self.box,
            title=self.title,
            specification=self.specification,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'VegaCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('VegaCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('VegaCard.title is required.')
        __d_specification: Any = __d.get('specification')
        if __d_specification is None:
            raise ValueError('VegaCard.specification is required.')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        specification: str = __d_specification
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return VegaCard(
            box,
            title,
            specification,
            data,
            commands,
        )


class WideBarStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a progress bar.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed next to the primary value."""
        self.progress = progress
        """The value of the progress bar, between 0 and 1."""
        self.plot_color = plot_color
        """The color of the progress bar."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('WideBarStatCard.box is required.')
        if self.title is None:
            raise ValueError('WideBarStatCard.title is required.')
        if self.value is None:
            raise ValueError('WideBarStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('WideBarStatCard.aux_value is required.')
        if self.progress is None:
            raise ValueError('WideBarStatCard.progress is required.')
        return _dump(
            view='wide_bar_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WideBarStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('WideBarStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('WideBarStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('WideBarStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('WideBarStatCard.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('WideBarStatCard.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WideBarStatCard(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
            commands,
        )


class WideGaugeStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a progress gauge.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            progress: float,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed next to the primary value."""
        self.progress = progress
        """The value of the progress gauge, between 0 and 1."""
        self.plot_color = plot_color
        """The color of the progress gauge."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('WideGaugeStatCard.box is required.')
        if self.title is None:
            raise ValueError('WideGaugeStatCard.title is required.')
        if self.value is None:
            raise ValueError('WideGaugeStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('WideGaugeStatCard.aux_value is required.')
        if self.progress is None:
            raise ValueError('WideGaugeStatCard.progress is required.')
        return _dump(
            view='wide_gauge_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            progress=self.progress,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WideGaugeStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('WideGaugeStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('WideGaugeStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('WideGaugeStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('WideGaugeStatCard.aux_value is required.')
        __d_progress: Any = __d.get('progress')
        if __d_progress is None:
            raise ValueError('WideGaugeStatCard.progress is required.')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        progress: float = __d_progress
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WideGaugeStatCard(
            box,
            title,
            value,
            aux_value,
            progress,
            plot_color,
            data,
            commands,
        )


class WideSeriesStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a series plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            value: str,
            aux_value: str,
            plot_data: PackedData,
            plot_value: str,
            plot_zero_value: Optional[float] = None,
            plot_category: Optional[str] = None,
            plot_type: Optional[str] = None,
            plot_curve: Optional[str] = None,
            plot_color: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.value = value
        """The primary value displayed."""
        self.aux_value = aux_value
        """The auxiliary value displayed below the primary value."""
        self.plot_data = plot_data
        """The plot's data."""
        self.plot_value = plot_value
        """The data field to use for y-axis values."""
        self.plot_zero_value = plot_zero_value
        """The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used."""
        self.plot_category = plot_category
        """The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'."""
        self.plot_type = plot_type
        """The type of plot. Defaults to `area`. One of 'area', 'interval'."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        if self.box is None:
            raise ValueError('WideSeriesStatCard.box is required.')
        if self.title is None:
            raise ValueError('WideSeriesStatCard.title is required.')
        if self.value is None:
            raise ValueError('WideSeriesStatCard.value is required.')
        if self.aux_value is None:
            raise ValueError('WideSeriesStatCard.aux_value is required.')
        if self.plot_data is None:
            raise ValueError('WideSeriesStatCard.plot_data is required.')
        if self.plot_value is None:
            raise ValueError('WideSeriesStatCard.plot_value is required.')
        return _dump(
            view='wide_series_stat',
            box=self.box,
            title=self.title,
            value=self.value,
            aux_value=self.aux_value,
            plot_data=self.plot_data,
            plot_value=self.plot_value,
            plot_zero_value=self.plot_zero_value,
            plot_category=self.plot_category,
            plot_type=self.plot_type,
            plot_curve=self.plot_curve,
            plot_color=self.plot_color,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WideSeriesStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        if __d_box is None:
            raise ValueError('WideSeriesStatCard.box is required.')
        __d_title: Any = __d.get('title')
        if __d_title is None:
            raise ValueError('WideSeriesStatCard.title is required.')
        __d_value: Any = __d.get('value')
        if __d_value is None:
            raise ValueError('WideSeriesStatCard.value is required.')
        __d_aux_value: Any = __d.get('aux_value')
        if __d_aux_value is None:
            raise ValueError('WideSeriesStatCard.aux_value is required.')
        __d_plot_data: Any = __d.get('plot_data')
        if __d_plot_data is None:
            raise ValueError('WideSeriesStatCard.plot_data is required.')
        __d_plot_value: Any = __d.get('plot_value')
        if __d_plot_value is None:
            raise ValueError('WideSeriesStatCard.plot_value is required.')
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        __d_plot_category: Any = __d.get('plot_category')
        __d_plot_type: Any = __d.get('plot_type')
        __d_plot_curve: Any = __d.get('plot_curve')
        __d_plot_color: Any = __d.get('plot_color')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        box: str = __d_box
        title: str = __d_title
        value: str = __d_value
        aux_value: str = __d_aux_value
        plot_data: PackedData = __d_plot_data
        plot_value: str = __d_plot_value
        plot_zero_value: Optional[float] = __d_plot_zero_value
        plot_category: Optional[str] = __d_plot_category
        plot_type: Optional[str] = __d_plot_type
        plot_curve: Optional[str] = __d_plot_curve
        plot_color: Optional[str] = __d_plot_color
        data: Optional[PackedRecord] = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WideSeriesStatCard(
            box,
            title,
            value,
            aux_value,
            plot_data,
            plot_value,
            plot_zero_value,
            plot_category,
            plot_type,
            plot_curve,
            plot_color,
            data,
            commands,
        )
