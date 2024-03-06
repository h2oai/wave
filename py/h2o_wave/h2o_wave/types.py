#
# THIS FILE IS GENERATED; DO NOT EDIT
#

# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from typing import Any, Optional, Union, Dict, List
from .core import Data

Value = Union[str, float, int]
PackedRecord = Union[dict, str, Data]
PackedRecords = Union[List[dict], str]
PackedData = Union[Data, str]


def _dump(**kwargs): return {k: v for k, v in kwargs.items() if v is not None}


def _guard_scalar(name: str, value: Any, types, non_empty: bool, optional: bool, packed: bool):
    if optional and (value is None):
        return
    if packed and isinstance(value, str):
        return
    if not isinstance(value, types):
        raise ValueError(f'{name}: want one of {types}, got {type(value)}')
    if non_empty and len(value) == 0:
        raise ValueError(f'{name}: must be non-empty')


def _guard_vector(name: str, values: Any, types, non_empty: bool, optional: bool, packed: bool):
    if optional and (values is None):
        return
    if packed and isinstance(values, str):
        return
    if not isinstance(values, list):
        raise ValueError(f'{name}: want list of {types}, got {type(values)}')
    for value in values:
        _guard_scalar(f'{name} element', value, types, False, non_empty, False)


def _guard_enum(name: str, value: str, values: List[str], optional: bool):
    if optional and (value is None):
        return
    if value not in values:
        raise ValueError(f'{name}: want one of {values}, got {value}')


_TextSize = ['xl', 'l', 'm', 's', 'xs']


class TextSize:
    XL = 'xl'
    L = 'l'
    M = 'm'
    S = 's'
    XS = 'xs'


class Text:
    """Create text content.
    """
    def __init__(
            self,
            content: str,
            size: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Text.content', content, (str,), False, False, False)
        _guard_enum('Text.size', size, _TextSize, True)
        _guard_scalar('Text.width', width, (str,), False, True, False)
        _guard_scalar('Text.visible', visible, (bool,), False, True, False)
        _guard_scalar('Text.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Text.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.size = size
        """The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.TextSize."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Text.content', self.content, (str,), False, False, False)
        _guard_enum('Text.size', self.size, _TextSize, True)
        _guard_scalar('Text.width', self.width, (str,), False, True, False)
        _guard_scalar('Text.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Text.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Text.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            size=self.size,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Text':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('Text.content', __d_content, (str,), False, False, False)
        __d_size: Any = __d.get('size')
        _guard_enum('Text.size', __d_size, _TextSize, True)
        __d_width: Any = __d.get('width')
        _guard_scalar('Text.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Text.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Text.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Text.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        size: Optional[str] = __d_size
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return Text(
            content,
            size,
            width,
            visible,
            tooltip,
            name,
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
            value: Optional[str] = None,
            path: Optional[str] = None,
            download: Optional[bool] = None,
    ):
        _guard_scalar('Command.name', name, (str,), True, False, False)
        _guard_scalar('Command.label', label, (str,), False, True, False)
        _guard_scalar('Command.caption', caption, (str,), False, True, False)
        _guard_scalar('Command.icon', icon, (str,), False, True, False)
        _guard_vector('Command.items', items, (Command,), False, True, False)
        _guard_scalar('Command.value', value, (str,), False, True, False)
        _guard_scalar('Command.path', path, (str,), False, True, False)
        _guard_scalar('Command.download', download, (bool,), False, True, False)
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
        self.value = value
        """Data associated with this command, if any."""
        self.path = path
        """The path or URL to link to. The 'items' and 'value' props are ignored when specified."""
        self.download = download
        """True if the link should prompt the user to save the linked URL instead of navigating to it."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Command.name', self.name, (str,), True, False, False)
        _guard_scalar('Command.label', self.label, (str,), False, True, False)
        _guard_scalar('Command.caption', self.caption, (str,), False, True, False)
        _guard_scalar('Command.icon', self.icon, (str,), False, True, False)
        _guard_vector('Command.items', self.items, (Command,), False, True, False)
        _guard_scalar('Command.value', self.value, (str,), False, True, False)
        _guard_scalar('Command.path', self.path, (str,), False, True, False)
        _guard_scalar('Command.download', self.download, (bool,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            icon=self.icon,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            value=self.value,
            path=self.path,
            download=self.download,
        )

    @staticmethod
    def load(__d: Dict) -> 'Command':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Command.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Command.label', __d_label, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('Command.caption', __d_caption, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Command.icon', __d_icon, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('Command.items', __d_items, (dict,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Command.value', __d_value, (str,), False, True, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('Command.path', __d_path, (str,), False, True, False)
        __d_download: Any = __d.get('download')
        _guard_scalar('Command.download', __d_download, (bool,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        caption: Optional[str] = __d_caption
        icon: Optional[str] = __d_icon
        items: Optional[List['Command']] = None if __d_items is None else [Command.load(__e) for __e in __d_items]
        value: Optional[str] = __d_value
        path: Optional[str] = __d_path
        download: Optional[bool] = __d_download
        return Command(
            name,
            label,
            caption,
            icon,
            items,
            value,
            path,
            download,
        )


class TextXl:
    """Create extra-large sized text content.
    """
    def __init__(
            self,
            content: str,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            commands: Optional[List[Command]] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('TextXl.content', content, (str,), False, False, False)
        _guard_scalar('TextXl.width', width, (str,), False, True, False)
        _guard_scalar('TextXl.visible', visible, (bool,), False, True, False)
        _guard_scalar('TextXl.tooltip', tooltip, (str,), False, True, False)
        _guard_vector('TextXl.commands', commands, (Command,), False, True, False)
        _guard_scalar('TextXl.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.commands = commands
        """Contextual menu commands for this component."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextXl.content', self.content, (str,), False, False, False)
        _guard_scalar('TextXl.width', self.width, (str,), False, True, False)
        _guard_scalar('TextXl.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TextXl.tooltip', self.tooltip, (str,), False, True, False)
        _guard_vector('TextXl.commands', self.commands, (Command,), False, True, False)
        _guard_scalar('TextXl.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextXl':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('TextXl.content', __d_content, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TextXl.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TextXl.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('TextXl.tooltip', __d_tooltip, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TextXl.commands', __d_commands, (dict,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TextXl.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        name: Optional[str] = __d_name
        return TextXl(
            content,
            width,
            visible,
            tooltip,
            commands,
            name,
        )


class TextL:
    """Create large sized text content.
    """
    def __init__(
            self,
            content: str,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            commands: Optional[List[Command]] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('TextL.content', content, (str,), False, False, False)
        _guard_scalar('TextL.width', width, (str,), False, True, False)
        _guard_scalar('TextL.visible', visible, (bool,), False, True, False)
        _guard_scalar('TextL.tooltip', tooltip, (str,), False, True, False)
        _guard_vector('TextL.commands', commands, (Command,), False, True, False)
        _guard_scalar('TextL.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.commands = commands
        """Contextual menu commands for this component."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextL.content', self.content, (str,), False, False, False)
        _guard_scalar('TextL.width', self.width, (str,), False, True, False)
        _guard_scalar('TextL.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TextL.tooltip', self.tooltip, (str,), False, True, False)
        _guard_vector('TextL.commands', self.commands, (Command,), False, True, False)
        _guard_scalar('TextL.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextL':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('TextL.content', __d_content, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TextL.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TextL.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('TextL.tooltip', __d_tooltip, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TextL.commands', __d_commands, (dict,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TextL.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        name: Optional[str] = __d_name
        return TextL(
            content,
            width,
            visible,
            tooltip,
            commands,
            name,
        )


class TextM:
    """Create medium sized text content.
    """
    def __init__(
            self,
            content: str,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('TextM.content', content, (str,), False, False, False)
        _guard_scalar('TextM.width', width, (str,), False, True, False)
        _guard_scalar('TextM.visible', visible, (bool,), False, True, False)
        _guard_scalar('TextM.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('TextM.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextM.content', self.content, (str,), False, False, False)
        _guard_scalar('TextM.width', self.width, (str,), False, True, False)
        _guard_scalar('TextM.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TextM.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('TextM.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextM':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('TextM.content', __d_content, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TextM.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TextM.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('TextM.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TextM.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return TextM(
            content,
            width,
            visible,
            tooltip,
            name,
        )


class TextS:
    """Create small sized text content.
    """
    def __init__(
            self,
            content: str,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('TextS.content', content, (str,), False, False, False)
        _guard_scalar('TextS.width', width, (str,), False, True, False)
        _guard_scalar('TextS.visible', visible, (bool,), False, True, False)
        _guard_scalar('TextS.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('TextS.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextS.content', self.content, (str,), False, False, False)
        _guard_scalar('TextS.width', self.width, (str,), False, True, False)
        _guard_scalar('TextS.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TextS.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('TextS.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextS':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('TextS.content', __d_content, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TextS.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TextS.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('TextS.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TextS.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return TextS(
            content,
            width,
            visible,
            tooltip,
            name,
        )


class TextXs:
    """Create extra-small sized text content.
    """
    def __init__(
            self,
            content: str,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('TextXs.content', content, (str,), False, False, False)
        _guard_scalar('TextXs.width', width, (str,), False, True, False)
        _guard_scalar('TextXs.visible', visible, (bool,), False, True, False)
        _guard_scalar('TextXs.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('TextXs.name', name, (str,), False, True, False)
        self.content = content
        """The text content."""
        self.width = width
        """The width of the text , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """Tooltip message."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextXs.content', self.content, (str,), False, False, False)
        _guard_scalar('TextXs.width', self.width, (str,), False, True, False)
        _guard_scalar('TextXs.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TextXs.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('TextXs.name', self.name, (str,), False, True, False)
        return _dump(
            content=self.content,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextXs':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('TextXs.content', __d_content, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TextXs.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TextXs.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('TextXs.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TextXs.name', __d_name, (str,), False, True, False)
        content: str = __d_content
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return TextXs(
            content,
            width,
            visible,
            tooltip,
            name,
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Label.label', label, (str,), False, False, False)
        _guard_scalar('Label.required', required, (bool,), False, True, False)
        _guard_scalar('Label.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Label.width', width, (str,), False, True, False)
        _guard_scalar('Label.visible', visible, (bool,), False, True, False)
        _guard_scalar('Label.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Label.name', name, (str,), False, True, False)
        self.label = label
        """The text displayed on the label."""
        self.required = required
        """True if the field is required."""
        self.disabled = disabled
        """True if the label should be disabled."""
        self.width = width
        """The width of the label , e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Label.label', self.label, (str,), False, False, False)
        _guard_scalar('Label.required', self.required, (bool,), False, True, False)
        _guard_scalar('Label.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Label.width', self.width, (str,), False, True, False)
        _guard_scalar('Label.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Label.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Label.name', self.name, (str,), False, True, False)
        return _dump(
            label=self.label,
            required=self.required,
            disabled=self.disabled,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Label':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Label.label', __d_label, (str,), False, False, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('Label.required', __d_required, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Label.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Label.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Label.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Label.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Label.name', __d_name, (str,), False, True, False)
        label: str = __d_label
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return Label(
            label,
            required,
            disabled,
            width,
            visible,
            tooltip,
            name,
        )


class Separator:
    """Create a separator.

    A separator visually separates content into groups.
    """
    def __init__(
            self,
            label: Optional[str] = None,
            name: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_scalar('Separator.label', label, (str,), False, True, False)
        _guard_scalar('Separator.name', name, (str,), False, True, False)
        _guard_scalar('Separator.width', width, (str,), False, True, False)
        _guard_scalar('Separator.visible', visible, (bool,), False, True, False)
        self.label = label
        """The text displayed on the separator."""
        self.name = name
        """An identifying name for this component."""
        self.width = width
        """The width of the separator , e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Separator.label', self.label, (str,), False, True, False)
        _guard_scalar('Separator.name', self.name, (str,), False, True, False)
        _guard_scalar('Separator.width', self.width, (str,), False, True, False)
        _guard_scalar('Separator.visible', self.visible, (bool,), False, True, False)
        return _dump(
            label=self.label,
            name=self.name,
            width=self.width,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Separator':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Separator.label', __d_label, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Separator.name', __d_name, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Separator.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Separator.visible', __d_visible, (bool,), False, True, False)
        label: Optional[str] = __d_label
        name: Optional[str] = __d_name
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        return Separator(
            label,
            name,
            width,
            visible,
        )


_ProgressType = ['bar', 'spinner']


class ProgressType:
    BAR = 'bar'
    SPINNER = 'spinner'


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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
            type: Optional[str] = None,
    ):
        _guard_scalar('Progress.label', label, (str,), False, False, False)
        _guard_scalar('Progress.caption', caption, (str,), False, True, False)
        _guard_scalar('Progress.value', value, (float, int,), False, True, False)
        _guard_scalar('Progress.width', width, (str,), False, True, False)
        _guard_scalar('Progress.visible', visible, (bool,), False, True, False)
        _guard_scalar('Progress.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Progress.name', name, (str,), False, True, False)
        _guard_enum('Progress.type', type, _ProgressType, True)
        self.label = label
        """The text displayed above the bar or right to the spinner."""
        self.caption = caption
        """The text displayed below the bar or spinner."""
        self.value = value
        """The progress, between 0.0 and 1.0, or -1 (default) if indeterminate."""
        self.width = width
        """The width of the separator, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.name = name
        """An identifying name for this component."""
        self.type = type
        """The type of progress bar to be displayed. One of 'bar', 'spinner'. Defaults to 'bar'. One of 'bar', 'spinner'. See enum h2o_wave.ui.ProgressType."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Progress.label', self.label, (str,), False, False, False)
        _guard_scalar('Progress.caption', self.caption, (str,), False, True, False)
        _guard_scalar('Progress.value', self.value, (float, int,), False, True, False)
        _guard_scalar('Progress.width', self.width, (str,), False, True, False)
        _guard_scalar('Progress.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Progress.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Progress.name', self.name, (str,), False, True, False)
        _guard_enum('Progress.type', self.type, _ProgressType, True)
        return _dump(
            label=self.label,
            caption=self.caption,
            value=self.value,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            name=self.name,
            type=self.type,
        )

    @staticmethod
    def load(__d: Dict) -> 'Progress':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Progress.label', __d_label, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('Progress.caption', __d_caption, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Progress.value', __d_value, (float, int,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Progress.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Progress.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Progress.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Progress.name', __d_name, (str,), False, True, False)
        __d_type: Any = __d.get('type')
        _guard_enum('Progress.type', __d_type, _ProgressType, True)
        label: str = __d_label
        caption: Optional[str] = __d_caption
        value: Optional[float] = __d_value
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        type: Optional[str] = __d_type
        return Progress(
            label,
            caption,
            value,
            width,
            visible,
            tooltip,
            name,
            type,
        )


_MessageBarType = ['info', 'error', 'warning', 'success', 'danger', 'blocked']


class MessageBarType:
    INFO = 'info'
    ERROR = 'error'
    WARNING = 'warning'
    SUCCESS = 'success'
    DANGER = 'danger'
    BLOCKED = 'blocked'


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
            name: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            buttons: Optional[List['Component']] = None,
    ):
        _guard_enum('MessageBar.type', type, _MessageBarType, True)
        _guard_scalar('MessageBar.text', text, (str,), False, True, False)
        _guard_scalar('MessageBar.name', name, (str,), False, True, False)
        _guard_scalar('MessageBar.width', width, (str,), False, True, False)
        _guard_scalar('MessageBar.visible', visible, (bool,), False, True, False)
        _guard_vector('MessageBar.buttons', buttons, (Component,), False, True, False)
        self.type = type
        """The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.MessageBarType."""
        self.text = text
        """The text displayed on the message bar."""
        self.name = name
        """An identifying name for this component."""
        self.width = width
        """The width of the message bar, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.buttons = buttons
        """Specify one or more action buttons."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_enum('MessageBar.type', self.type, _MessageBarType, True)
        _guard_scalar('MessageBar.text', self.text, (str,), False, True, False)
        _guard_scalar('MessageBar.name', self.name, (str,), False, True, False)
        _guard_scalar('MessageBar.width', self.width, (str,), False, True, False)
        _guard_scalar('MessageBar.visible', self.visible, (bool,), False, True, False)
        _guard_vector('MessageBar.buttons', self.buttons, (Component,), False, True, False)
        return _dump(
            type=self.type,
            text=self.text,
            name=self.name,
            width=self.width,
            visible=self.visible,
            buttons=None if self.buttons is None else [__e.dump() for __e in self.buttons],
        )

    @staticmethod
    def load(__d: Dict) -> 'MessageBar':
        """Creates an instance of this class using the contents of a dict."""
        __d_type: Any = __d.get('type')
        _guard_enum('MessageBar.type', __d_type, _MessageBarType, True)
        __d_text: Any = __d.get('text')
        _guard_scalar('MessageBar.text', __d_text, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('MessageBar.name', __d_name, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('MessageBar.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('MessageBar.visible', __d_visible, (bool,), False, True, False)
        __d_buttons: Any = __d.get('buttons')
        _guard_vector('MessageBar.buttons', __d_buttons, (dict,), False, True, False)
        type: Optional[str] = __d_type
        text: Optional[str] = __d_text
        name: Optional[str] = __d_name
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        buttons: Optional[List['Component']] = None if __d_buttons is None else [Component.load(__e) for __e in __d_buttons]
        return MessageBar(
            type,
            text,
            name,
            width,
            visible,
            buttons,
        )


_TextboxType = ['text', 'number', 'tel']


class TextboxType:
    TEXT = 'text'
    NUMBER = 'number'
    TEL = 'tel'


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
            height: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            spellcheck: Optional[bool] = None,
            type: Optional[str] = None,
    ):
        _guard_scalar('Textbox.name', name, (str,), True, False, False)
        _guard_scalar('Textbox.label', label, (str,), False, True, False)
        _guard_scalar('Textbox.placeholder', placeholder, (str,), False, True, False)
        _guard_scalar('Textbox.value', value, (str,), False, True, False)
        _guard_scalar('Textbox.mask', mask, (str,), False, True, False)
        _guard_scalar('Textbox.icon', icon, (str,), False, True, False)
        _guard_scalar('Textbox.prefix', prefix, (str,), False, True, False)
        _guard_scalar('Textbox.suffix', suffix, (str,), False, True, False)
        _guard_scalar('Textbox.error', error, (str,), False, True, False)
        _guard_scalar('Textbox.required', required, (bool,), False, True, False)
        _guard_scalar('Textbox.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Textbox.readonly', readonly, (bool,), False, True, False)
        _guard_scalar('Textbox.multiline', multiline, (bool,), False, True, False)
        _guard_scalar('Textbox.password', password, (bool,), False, True, False)
        _guard_scalar('Textbox.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Textbox.height', height, (str,), False, True, False)
        _guard_scalar('Textbox.width', width, (str,), False, True, False)
        _guard_scalar('Textbox.visible', visible, (bool,), False, True, False)
        _guard_scalar('Textbox.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Textbox.spellcheck', spellcheck, (bool,), False, True, False)
        _guard_enum('Textbox.type', type, _TextboxType, True)
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
        self.height = height
        """The height of the text box, e.g. '100px'. Percentage values not supported. Applicable only if `multiline` is true."""
        self.width = width
        """The width of the text box, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.spellcheck = spellcheck
        """True if the text may be checked for spelling errors. Defaults to True."""
        self.type = type
        """Keyboard to be shown on mobile devices. Defaults to 'text'. One of 'text', 'number', 'tel'. See enum h2o_wave.ui.TextboxType."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Textbox.name', self.name, (str,), True, False, False)
        _guard_scalar('Textbox.label', self.label, (str,), False, True, False)
        _guard_scalar('Textbox.placeholder', self.placeholder, (str,), False, True, False)
        _guard_scalar('Textbox.value', self.value, (str,), False, True, False)
        _guard_scalar('Textbox.mask', self.mask, (str,), False, True, False)
        _guard_scalar('Textbox.icon', self.icon, (str,), False, True, False)
        _guard_scalar('Textbox.prefix', self.prefix, (str,), False, True, False)
        _guard_scalar('Textbox.suffix', self.suffix, (str,), False, True, False)
        _guard_scalar('Textbox.error', self.error, (str,), False, True, False)
        _guard_scalar('Textbox.required', self.required, (bool,), False, True, False)
        _guard_scalar('Textbox.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Textbox.readonly', self.readonly, (bool,), False, True, False)
        _guard_scalar('Textbox.multiline', self.multiline, (bool,), False, True, False)
        _guard_scalar('Textbox.password', self.password, (bool,), False, True, False)
        _guard_scalar('Textbox.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Textbox.height', self.height, (str,), False, True, False)
        _guard_scalar('Textbox.width', self.width, (str,), False, True, False)
        _guard_scalar('Textbox.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Textbox.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Textbox.spellcheck', self.spellcheck, (bool,), False, True, False)
        _guard_enum('Textbox.type', self.type, _TextboxType, True)
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
            height=self.height,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            spellcheck=self.spellcheck,
            type=self.type,
        )

    @staticmethod
    def load(__d: Dict) -> 'Textbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Textbox.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Textbox.label', __d_label, (str,), False, True, False)
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('Textbox.placeholder', __d_placeholder, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Textbox.value', __d_value, (str,), False, True, False)
        __d_mask: Any = __d.get('mask')
        _guard_scalar('Textbox.mask', __d_mask, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Textbox.icon', __d_icon, (str,), False, True, False)
        __d_prefix: Any = __d.get('prefix')
        _guard_scalar('Textbox.prefix', __d_prefix, (str,), False, True, False)
        __d_suffix: Any = __d.get('suffix')
        _guard_scalar('Textbox.suffix', __d_suffix, (str,), False, True, False)
        __d_error: Any = __d.get('error')
        _guard_scalar('Textbox.error', __d_error, (str,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('Textbox.required', __d_required, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Textbox.disabled', __d_disabled, (bool,), False, True, False)
        __d_readonly: Any = __d.get('readonly')
        _guard_scalar('Textbox.readonly', __d_readonly, (bool,), False, True, False)
        __d_multiline: Any = __d.get('multiline')
        _guard_scalar('Textbox.multiline', __d_multiline, (bool,), False, True, False)
        __d_password: Any = __d.get('password')
        _guard_scalar('Textbox.password', __d_password, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Textbox.trigger', __d_trigger, (bool,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Textbox.height', __d_height, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Textbox.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Textbox.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Textbox.tooltip', __d_tooltip, (str,), False, True, False)
        __d_spellcheck: Any = __d.get('spellcheck')
        _guard_scalar('Textbox.spellcheck', __d_spellcheck, (bool,), False, True, False)
        __d_type: Any = __d.get('type')
        _guard_enum('Textbox.type', __d_type, _TextboxType, True)
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
        height: Optional[str] = __d_height
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        spellcheck: Optional[bool] = __d_spellcheck
        type: Optional[str] = __d_type
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
            height,
            width,
            visible,
            tooltip,
            spellcheck,
            type,
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Checkbox.name', name, (str,), True, False, False)
        _guard_scalar('Checkbox.label', label, (str,), False, True, False)
        _guard_scalar('Checkbox.value', value, (bool,), False, True, False)
        _guard_scalar('Checkbox.indeterminate', indeterminate, (bool,), False, True, False)
        _guard_scalar('Checkbox.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Checkbox.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Checkbox.width', width, (str,), False, True, False)
        _guard_scalar('Checkbox.visible', visible, (bool,), False, True, False)
        _guard_scalar('Checkbox.tooltip', tooltip, (str,), False, True, False)
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
        self.width = width
        """The width of the checkbox, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Checkbox.name', self.name, (str,), True, False, False)
        _guard_scalar('Checkbox.label', self.label, (str,), False, True, False)
        _guard_scalar('Checkbox.value', self.value, (bool,), False, True, False)
        _guard_scalar('Checkbox.indeterminate', self.indeterminate, (bool,), False, True, False)
        _guard_scalar('Checkbox.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Checkbox.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Checkbox.width', self.width, (str,), False, True, False)
        _guard_scalar('Checkbox.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Checkbox.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            indeterminate=self.indeterminate,
            disabled=self.disabled,
            trigger=self.trigger,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Checkbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Checkbox.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Checkbox.label', __d_label, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Checkbox.value', __d_value, (bool,), False, True, False)
        __d_indeterminate: Any = __d.get('indeterminate')
        _guard_scalar('Checkbox.indeterminate', __d_indeterminate, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Checkbox.disabled', __d_disabled, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Checkbox.trigger', __d_trigger, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Checkbox.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Checkbox.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Checkbox.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[bool] = __d_value
        indeterminate: Optional[bool] = __d_indeterminate
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        return Checkbox(
            name,
            label,
            value,
            indeterminate,
            disabled,
            trigger,
            width,
            visible,
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Toggle.name', name, (str,), True, False, False)
        _guard_scalar('Toggle.label', label, (str,), False, True, False)
        _guard_scalar('Toggle.value', value, (bool,), False, True, False)
        _guard_scalar('Toggle.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Toggle.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Toggle.width', width, (str,), False, True, False)
        _guard_scalar('Toggle.visible', visible, (bool,), False, True, False)
        _guard_scalar('Toggle.tooltip', tooltip, (str,), False, True, False)
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
        self.width = width
        """The width of the toggle, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Toggle.name', self.name, (str,), True, False, False)
        _guard_scalar('Toggle.label', self.label, (str,), False, True, False)
        _guard_scalar('Toggle.value', self.value, (bool,), False, True, False)
        _guard_scalar('Toggle.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Toggle.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Toggle.width', self.width, (str,), False, True, False)
        _guard_scalar('Toggle.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Toggle.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Toggle':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Toggle.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Toggle.label', __d_label, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Toggle.value', __d_value, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Toggle.disabled', __d_disabled, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Toggle.trigger', __d_trigger, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Toggle.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Toggle.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Toggle.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[bool] = __d_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        return Toggle(
            name,
            label,
            value,
            disabled,
            trigger,
            width,
            visible,
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
        _guard_scalar('Choice.name', name, (str,), True, False, False)
        _guard_scalar('Choice.label', label, (str,), False, True, False)
        _guard_scalar('Choice.disabled', disabled, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.disabled = disabled
        """True if the checkbox is disabled."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Choice.name', self.name, (str,), True, False, False)
        _guard_scalar('Choice.label', self.label, (str,), False, True, False)
        _guard_scalar('Choice.disabled', self.disabled, (bool,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            disabled=self.disabled,
        )

    @staticmethod
    def load(__d: Dict) -> 'Choice':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Choice.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Choice.label', __d_label, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Choice.disabled', __d_disabled, (bool,), False, True, False)
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
            inline: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('ChoiceGroup.name', name, (str,), True, False, False)
        _guard_scalar('ChoiceGroup.label', label, (str,), False, True, False)
        _guard_scalar('ChoiceGroup.value', value, (str,), False, True, False)
        _guard_vector('ChoiceGroup.choices', choices, (Choice,), False, True, False)
        _guard_scalar('ChoiceGroup.required', required, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.inline', inline, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.width', width, (str,), False, True, False)
        _guard_scalar('ChoiceGroup.visible', visible, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.tooltip', tooltip, (str,), False, True, False)
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
        self.inline = inline
        """True if choices should be rendered horizontally. Defaults to False."""
        self.width = width
        """The width of the choice group, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ChoiceGroup.name', self.name, (str,), True, False, False)
        _guard_scalar('ChoiceGroup.label', self.label, (str,), False, True, False)
        _guard_scalar('ChoiceGroup.value', self.value, (str,), False, True, False)
        _guard_vector('ChoiceGroup.choices', self.choices, (Choice,), False, True, False)
        _guard_scalar('ChoiceGroup.required', self.required, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.inline', self.inline, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.width', self.width, (str,), False, True, False)
        _guard_scalar('ChoiceGroup.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('ChoiceGroup.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=None if self.choices is None else [__e.dump() for __e in self.choices],
            required=self.required,
            trigger=self.trigger,
            inline=self.inline,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'ChoiceGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('ChoiceGroup.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('ChoiceGroup.label', __d_label, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('ChoiceGroup.value', __d_value, (str,), False, True, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('ChoiceGroup.choices', __d_choices, (dict,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('ChoiceGroup.required', __d_required, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('ChoiceGroup.trigger', __d_trigger, (bool,), False, True, False)
        __d_inline: Any = __d.get('inline')
        _guard_scalar('ChoiceGroup.inline', __d_inline, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('ChoiceGroup.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('ChoiceGroup.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('ChoiceGroup.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[str] = __d_value
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        required: Optional[bool] = __d_required
        trigger: Optional[bool] = __d_trigger
        inline: Optional[bool] = __d_inline
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        return ChoiceGroup(
            name,
            label,
            value,
            choices,
            required,
            trigger,
            inline,
            width,
            visible,
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
            trigger: Optional[bool] = None,
            inline: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Checklist.name', name, (str,), True, False, False)
        _guard_scalar('Checklist.label', label, (str,), False, True, False)
        _guard_vector('Checklist.values', values, (str,), False, True, False)
        _guard_vector('Checklist.choices', choices, (Choice,), False, True, False)
        _guard_scalar('Checklist.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Checklist.inline', inline, (bool,), False, True, False)
        _guard_scalar('Checklist.width', width, (str,), False, True, False)
        _guard_scalar('Checklist.visible', visible, (bool,), False, True, False)
        _guard_scalar('Checklist.tooltip', tooltip, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed above the component."""
        self.values = values
        """The names of the selected choices."""
        self.choices = choices
        """The choices to be presented."""
        self.trigger = trigger
        """True if the form should be submitted when the checklist value changes."""
        self.inline = inline
        """True if checklist should be rendered horizontally. Defaults to False."""
        self.width = width
        """The width of the checklist, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Checklist.name', self.name, (str,), True, False, False)
        _guard_scalar('Checklist.label', self.label, (str,), False, True, False)
        _guard_vector('Checklist.values', self.values, (str,), False, True, False)
        _guard_vector('Checklist.choices', self.choices, (Choice,), False, True, False)
        _guard_scalar('Checklist.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Checklist.inline', self.inline, (bool,), False, True, False)
        _guard_scalar('Checklist.width', self.width, (str,), False, True, False)
        _guard_scalar('Checklist.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Checklist.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            values=self.values,
            choices=None if self.choices is None else [__e.dump() for __e in self.choices],
            trigger=self.trigger,
            inline=self.inline,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Checklist':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Checklist.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Checklist.label', __d_label, (str,), False, True, False)
        __d_values: Any = __d.get('values')
        _guard_vector('Checklist.values', __d_values, (str,), False, True, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('Checklist.choices', __d_choices, (dict,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Checklist.trigger', __d_trigger, (bool,), False, True, False)
        __d_inline: Any = __d.get('inline')
        _guard_scalar('Checklist.inline', __d_inline, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Checklist.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Checklist.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Checklist.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        values: Optional[List[str]] = __d_values
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        trigger: Optional[bool] = __d_trigger
        inline: Optional[bool] = __d_inline
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        return Checklist(
            name,
            label,
            values,
            choices,
            trigger,
            inline,
            width,
            visible,
            tooltip,
        )


_DropdownPopup = ['auto', 'always', 'never']


class DropdownPopup:
    AUTO = 'auto'
    ALWAYS = 'always'
    NEVER = 'never'


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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            popup: Optional[str] = None,
    ):
        _guard_scalar('Dropdown.name', name, (str,), True, False, False)
        _guard_scalar('Dropdown.label', label, (str,), False, True, False)
        _guard_scalar('Dropdown.placeholder', placeholder, (str,), False, True, False)
        _guard_scalar('Dropdown.value', value, (str,), False, True, False)
        _guard_vector('Dropdown.values', values, (str,), False, True, False)
        _guard_vector('Dropdown.choices', choices, (Choice,), False, True, False)
        _guard_scalar('Dropdown.required', required, (bool,), False, True, False)
        _guard_scalar('Dropdown.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Dropdown.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Dropdown.width', width, (str,), False, True, False)
        _guard_scalar('Dropdown.visible', visible, (bool,), False, True, False)
        _guard_scalar('Dropdown.tooltip', tooltip, (str,), False, True, False)
        _guard_enum('Dropdown.popup', popup, _DropdownPopup, True)
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
        self.width = width
        """The width of the dropdown, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.popup = popup
        """Whether to present the choices using a pop-up dialog. By default pops up a dialog only for more than 100 choices. Defaults to 'auto'. One of 'auto', 'always', 'never'. See enum h2o_wave.ui.DropdownPopup."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Dropdown.name', self.name, (str,), True, False, False)
        _guard_scalar('Dropdown.label', self.label, (str,), False, True, False)
        _guard_scalar('Dropdown.placeholder', self.placeholder, (str,), False, True, False)
        _guard_scalar('Dropdown.value', self.value, (str,), False, True, False)
        _guard_vector('Dropdown.values', self.values, (str,), False, True, False)
        _guard_vector('Dropdown.choices', self.choices, (Choice,), False, True, False)
        _guard_scalar('Dropdown.required', self.required, (bool,), False, True, False)
        _guard_scalar('Dropdown.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Dropdown.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Dropdown.width', self.width, (str,), False, True, False)
        _guard_scalar('Dropdown.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Dropdown.tooltip', self.tooltip, (str,), False, True, False)
        _guard_enum('Dropdown.popup', self.popup, _DropdownPopup, True)
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
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            popup=self.popup,
        )

    @staticmethod
    def load(__d: Dict) -> 'Dropdown':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Dropdown.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Dropdown.label', __d_label, (str,), False, True, False)
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('Dropdown.placeholder', __d_placeholder, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Dropdown.value', __d_value, (str,), False, True, False)
        __d_values: Any = __d.get('values')
        _guard_vector('Dropdown.values', __d_values, (str,), False, True, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('Dropdown.choices', __d_choices, (dict,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('Dropdown.required', __d_required, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Dropdown.disabled', __d_disabled, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Dropdown.trigger', __d_trigger, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Dropdown.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Dropdown.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Dropdown.tooltip', __d_tooltip, (str,), False, True, False)
        __d_popup: Any = __d.get('popup')
        _guard_enum('Dropdown.popup', __d_popup, _DropdownPopup, True)
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        values: Optional[List[str]] = __d_values
        choices: Optional[List[Choice]] = None if __d_choices is None else [Choice.load(__e) for __e in __d_choices]
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        popup: Optional[str] = __d_popup
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
            width,
            visible,
            tooltip,
            popup,
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
            values: Optional[List[str]] = None,
            choices: Optional[List[str]] = None,
            error: Optional[str] = None,
            disabled: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            trigger: Optional[bool] = None,
            required: Optional[bool] = None,
    ):
        _guard_scalar('Combobox.name', name, (str,), True, False, False)
        _guard_scalar('Combobox.label', label, (str,), False, True, False)
        _guard_scalar('Combobox.placeholder', placeholder, (str,), False, True, False)
        _guard_scalar('Combobox.value', value, (str,), False, True, False)
        _guard_vector('Combobox.values', values, (str,), False, True, False)
        _guard_vector('Combobox.choices', choices, (str,), False, True, False)
        _guard_scalar('Combobox.error', error, (str,), False, True, False)
        _guard_scalar('Combobox.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Combobox.width', width, (str,), False, True, False)
        _guard_scalar('Combobox.visible', visible, (bool,), False, True, False)
        _guard_scalar('Combobox.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Combobox.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Combobox.required', required, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field."""
        self.value = value
        """The name of the selected choice."""
        self.values = values
        """The names of the selected choices. If set, multiple selections will be allowed."""
        self.choices = choices
        """The choices to be presented."""
        self.error = error
        """Text to be displayed as an error below the text box."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.width = width
        """The width of the combobox, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.trigger = trigger
        """True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes."""
        self.required = required
        """True if this is a required field. Defaults to False."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Combobox.name', self.name, (str,), True, False, False)
        _guard_scalar('Combobox.label', self.label, (str,), False, True, False)
        _guard_scalar('Combobox.placeholder', self.placeholder, (str,), False, True, False)
        _guard_scalar('Combobox.value', self.value, (str,), False, True, False)
        _guard_vector('Combobox.values', self.values, (str,), False, True, False)
        _guard_vector('Combobox.choices', self.choices, (str,), False, True, False)
        _guard_scalar('Combobox.error', self.error, (str,), False, True, False)
        _guard_scalar('Combobox.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Combobox.width', self.width, (str,), False, True, False)
        _guard_scalar('Combobox.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Combobox.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Combobox.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Combobox.required', self.required, (bool,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            values=self.values,
            choices=self.choices,
            error=self.error,
            disabled=self.disabled,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            trigger=self.trigger,
            required=self.required,
        )

    @staticmethod
    def load(__d: Dict) -> 'Combobox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Combobox.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Combobox.label', __d_label, (str,), False, True, False)
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('Combobox.placeholder', __d_placeholder, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Combobox.value', __d_value, (str,), False, True, False)
        __d_values: Any = __d.get('values')
        _guard_vector('Combobox.values', __d_values, (str,), False, True, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('Combobox.choices', __d_choices, (str,), False, True, False)
        __d_error: Any = __d.get('error')
        _guard_scalar('Combobox.error', __d_error, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Combobox.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Combobox.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Combobox.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Combobox.tooltip', __d_tooltip, (str,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Combobox.trigger', __d_trigger, (bool,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('Combobox.required', __d_required, (bool,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        values: Optional[List[str]] = __d_values
        choices: Optional[List[str]] = __d_choices
        error: Optional[str] = __d_error
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        trigger: Optional[bool] = __d_trigger
        required: Optional[bool] = __d_required
        return Combobox(
            name,
            label,
            placeholder,
            value,
            values,
            choices,
            error,
            disabled,
            width,
            visible,
            tooltip,
            trigger,
            required,
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Slider.name', name, (str,), True, False, False)
        _guard_scalar('Slider.label', label, (str,), False, True, False)
        _guard_scalar('Slider.min', min, (float, int,), False, True, False)
        _guard_scalar('Slider.max', max, (float, int,), False, True, False)
        _guard_scalar('Slider.step', step, (float, int,), False, True, False)
        _guard_scalar('Slider.value', value, (float, int,), False, True, False)
        _guard_scalar('Slider.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Slider.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Slider.width', width, (str,), False, True, False)
        _guard_scalar('Slider.visible', visible, (bool,), False, True, False)
        _guard_scalar('Slider.tooltip', tooltip, (str,), False, True, False)
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
        self.width = width
        """The width of the slider, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Slider.name', self.name, (str,), True, False, False)
        _guard_scalar('Slider.label', self.label, (str,), False, True, False)
        _guard_scalar('Slider.min', self.min, (float, int,), False, True, False)
        _guard_scalar('Slider.max', self.max, (float, int,), False, True, False)
        _guard_scalar('Slider.step', self.step, (float, int,), False, True, False)
        _guard_scalar('Slider.value', self.value, (float, int,), False, True, False)
        _guard_scalar('Slider.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Slider.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Slider.width', self.width, (str,), False, True, False)
        _guard_scalar('Slider.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Slider.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Slider':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Slider.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Slider.label', __d_label, (str,), False, True, False)
        __d_min: Any = __d.get('min')
        _guard_scalar('Slider.min', __d_min, (float, int,), False, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('Slider.max', __d_max, (float, int,), False, True, False)
        __d_step: Any = __d.get('step')
        _guard_scalar('Slider.step', __d_step, (float, int,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Slider.value', __d_value, (float, int,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Slider.disabled', __d_disabled, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Slider.trigger', __d_trigger, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Slider.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Slider.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Slider.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        value: Optional[float] = __d_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
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
            width,
            visible,
            tooltip,
        )


class Spinbox:
    """Create a spinbox.

    A spinbox allows the user to incrementally adjust a value in small steps.
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Spinbox.name', name, (str,), True, False, False)
        _guard_scalar('Spinbox.label', label, (str,), False, True, False)
        _guard_scalar('Spinbox.min', min, (float, int,), False, True, False)
        _guard_scalar('Spinbox.max', max, (float, int,), False, True, False)
        _guard_scalar('Spinbox.step', step, (float, int,), False, True, False)
        _guard_scalar('Spinbox.value', value, (float, int,), False, True, False)
        _guard_scalar('Spinbox.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Spinbox.width', width, (str,), False, True, False)
        _guard_scalar('Spinbox.visible', visible, (bool,), False, True, False)
        _guard_scalar('Spinbox.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Spinbox.tooltip', tooltip, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.min = min
        """The minimum value of the spinbox. Defaults to 0."""
        self.max = max
        """The maximum value of the spinbox. Defaults to 100."""
        self.step = step
        """The difference between two adjacent values of the spinbox. Defaults to 1."""
        self.value = value
        """The current value of the spinbox. Defaults to 0."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.width = width
        """The width of the spinbox, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.trigger = trigger
        """True if the form should be submitted when the spinbox value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Spinbox.name', self.name, (str,), True, False, False)
        _guard_scalar('Spinbox.label', self.label, (str,), False, True, False)
        _guard_scalar('Spinbox.min', self.min, (float, int,), False, True, False)
        _guard_scalar('Spinbox.max', self.max, (float, int,), False, True, False)
        _guard_scalar('Spinbox.step', self.step, (float, int,), False, True, False)
        _guard_scalar('Spinbox.value', self.value, (float, int,), False, True, False)
        _guard_scalar('Spinbox.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Spinbox.width', self.width, (str,), False, True, False)
        _guard_scalar('Spinbox.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Spinbox.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Spinbox.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            value=self.value,
            disabled=self.disabled,
            width=self.width,
            visible=self.visible,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Spinbox':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Spinbox.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Spinbox.label', __d_label, (str,), False, True, False)
        __d_min: Any = __d.get('min')
        _guard_scalar('Spinbox.min', __d_min, (float, int,), False, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('Spinbox.max', __d_max, (float, int,), False, True, False)
        __d_step: Any = __d.get('step')
        _guard_scalar('Spinbox.step', __d_step, (float, int,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Spinbox.value', __d_value, (float, int,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Spinbox.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Spinbox.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Spinbox.visible', __d_visible, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Spinbox.trigger', __d_trigger, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Spinbox.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        value: Optional[float] = __d_value
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Spinbox(
            name,
            label,
            min,
            max,
            step,
            value,
            disabled,
            width,
            visible,
            trigger,
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
            trigger: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            min: Optional[str] = None,
            max: Optional[str] = None,
    ):
        _guard_scalar('DatePicker.name', name, (str,), True, False, False)
        _guard_scalar('DatePicker.label', label, (str,), False, True, False)
        _guard_scalar('DatePicker.placeholder', placeholder, (str,), False, True, False)
        _guard_scalar('DatePicker.value', value, (str,), False, True, False)
        _guard_scalar('DatePicker.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('DatePicker.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('DatePicker.width', width, (str,), False, True, False)
        _guard_scalar('DatePicker.visible', visible, (bool,), False, True, False)
        _guard_scalar('DatePicker.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('DatePicker.min', min, (str,), False, True, False)
        _guard_scalar('DatePicker.max', max, (str,), False, True, False)
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
        self.trigger = trigger
        """True if the form should be submitted when the datepicker value changes."""
        self.width = width
        """The width of the date picker, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.min = min
        """The minimum allowed date value in YYYY-MM-DD format."""
        self.max = max
        """The maximum allowed date value in YYYY-MM-DD format."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('DatePicker.name', self.name, (str,), True, False, False)
        _guard_scalar('DatePicker.label', self.label, (str,), False, True, False)
        _guard_scalar('DatePicker.placeholder', self.placeholder, (str,), False, True, False)
        _guard_scalar('DatePicker.value', self.value, (str,), False, True, False)
        _guard_scalar('DatePicker.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('DatePicker.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('DatePicker.width', self.width, (str,), False, True, False)
        _guard_scalar('DatePicker.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('DatePicker.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('DatePicker.min', self.min, (str,), False, True, False)
        _guard_scalar('DatePicker.max', self.max, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            disabled=self.disabled,
            trigger=self.trigger,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            min=self.min,
            max=self.max,
        )

    @staticmethod
    def load(__d: Dict) -> 'DatePicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('DatePicker.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('DatePicker.label', __d_label, (str,), False, True, False)
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('DatePicker.placeholder', __d_placeholder, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('DatePicker.value', __d_value, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('DatePicker.disabled', __d_disabled, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('DatePicker.trigger', __d_trigger, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('DatePicker.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('DatePicker.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('DatePicker.tooltip', __d_tooltip, (str,), False, True, False)
        __d_min: Any = __d.get('min')
        _guard_scalar('DatePicker.min', __d_min, (str,), False, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('DatePicker.max', __d_max, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        disabled: Optional[bool] = __d_disabled
        trigger: Optional[bool] = __d_trigger
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        min: Optional[str] = __d_min
        max: Optional[str] = __d_max
        return DatePicker(
            name,
            label,
            placeholder,
            value,
            disabled,
            trigger,
            width,
            visible,
            tooltip,
            min,
            max,
        )


class ColorPicker:
    """Create a color picker.

    A color picker allows a user to pick a color value.
    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            value: Optional[str] = None,
            choices: Optional[List[str]] = None,
            width: Optional[str] = None,
            alpha: Optional[bool] = None,
            inline: Optional[bool] = None,
            visible: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('ColorPicker.name', name, (str,), True, False, False)
        _guard_scalar('ColorPicker.label', label, (str,), False, True, False)
        _guard_scalar('ColorPicker.value', value, (str,), False, True, False)
        _guard_vector('ColorPicker.choices', choices, (str,), False, True, False)
        _guard_scalar('ColorPicker.width', width, (str,), False, True, False)
        _guard_scalar('ColorPicker.alpha', alpha, (bool,), False, True, False)
        _guard_scalar('ColorPicker.inline', inline, (bool,), False, True, False)
        _guard_scalar('ColorPicker.visible', visible, (bool,), False, True, False)
        _guard_scalar('ColorPicker.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('ColorPicker.tooltip', tooltip, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.value = value
        """The selected color (CSS-compatible string)."""
        self.choices = choices
        """A list of colors (CSS-compatible strings) to limit color choices to."""
        self.width = width
        """The width of the color picker, e.g. '100px'. Defaults to '300px'."""
        self.alpha = alpha
        """True if user should be allowed to pick color transparency. Defaults to True."""
        self.inline = inline
        """True if color picker should be displayed inline (takes less space). Doesn't work with choices specified. Defaults to False."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.trigger = trigger
        """True if the form should be submitted when the color picker value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ColorPicker.name', self.name, (str,), True, False, False)
        _guard_scalar('ColorPicker.label', self.label, (str,), False, True, False)
        _guard_scalar('ColorPicker.value', self.value, (str,), False, True, False)
        _guard_vector('ColorPicker.choices', self.choices, (str,), False, True, False)
        _guard_scalar('ColorPicker.width', self.width, (str,), False, True, False)
        _guard_scalar('ColorPicker.alpha', self.alpha, (bool,), False, True, False)
        _guard_scalar('ColorPicker.inline', self.inline, (bool,), False, True, False)
        _guard_scalar('ColorPicker.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('ColorPicker.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('ColorPicker.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            value=self.value,
            choices=self.choices,
            width=self.width,
            alpha=self.alpha,
            inline=self.inline,
            visible=self.visible,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'ColorPicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('ColorPicker.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('ColorPicker.label', __d_label, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('ColorPicker.value', __d_value, (str,), False, True, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('ColorPicker.choices', __d_choices, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('ColorPicker.width', __d_width, (str,), False, True, False)
        __d_alpha: Any = __d.get('alpha')
        _guard_scalar('ColorPicker.alpha', __d_alpha, (bool,), False, True, False)
        __d_inline: Any = __d.get('inline')
        _guard_scalar('ColorPicker.inline', __d_inline, (bool,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('ColorPicker.visible', __d_visible, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('ColorPicker.trigger', __d_trigger, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('ColorPicker.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        value: Optional[str] = __d_value
        choices: Optional[List[str]] = __d_choices
        width: Optional[str] = __d_width
        alpha: Optional[bool] = __d_alpha
        inline: Optional[bool] = __d_inline
        visible: Optional[bool] = __d_visible
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return ColorPicker(
            name,
            label,
            value,
            choices,
            width,
            alpha,
            inline,
            visible,
            trigger,
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
            icon: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            path: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('Button.name', name, (str,), True, False, False)
        _guard_scalar('Button.label', label, (str,), False, True, False)
        _guard_scalar('Button.caption', caption, (str,), False, True, False)
        _guard_scalar('Button.value', value, (str,), False, True, False)
        _guard_scalar('Button.primary', primary, (bool,), False, True, False)
        _guard_scalar('Button.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Button.link', link, (bool,), False, True, False)
        _guard_scalar('Button.icon', icon, (str,), False, True, False)
        _guard_scalar('Button.width', width, (str,), False, True, False)
        _guard_scalar('Button.visible', visible, (bool,), False, True, False)
        _guard_scalar('Button.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Button.path', path, (str,), False, True, False)
        _guard_vector('Button.commands', commands, (Command,), False, True, False)
        self.name = name
        """An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked."""
        self.label = label
        """The text displayed on the button."""
        self.caption = caption
        """The caption displayed below the label."""
        self.value = value
        """A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True."""
        self.primary = primary
        """True if the button should be rendered as the primary button in the set."""
        self.disabled = disabled
        """True if the button should be disabled."""
        self.link = link
        """True if the button should be rendered as link text and not a standard button."""
        self.icon = icon
        """An optional icon to display next to the button label (not applicable for links)."""
        self.width = width
        """The width of the button, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.path = path
        """The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab."""
        self.commands = commands
        """When specified, a split button is rendered with extra actions tied to it within a context menu. Mutually exclusive with `link` attribute."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Button.name', self.name, (str,), True, False, False)
        _guard_scalar('Button.label', self.label, (str,), False, True, False)
        _guard_scalar('Button.caption', self.caption, (str,), False, True, False)
        _guard_scalar('Button.value', self.value, (str,), False, True, False)
        _guard_scalar('Button.primary', self.primary, (bool,), False, True, False)
        _guard_scalar('Button.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Button.link', self.link, (bool,), False, True, False)
        _guard_scalar('Button.icon', self.icon, (str,), False, True, False)
        _guard_scalar('Button.width', self.width, (str,), False, True, False)
        _guard_scalar('Button.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Button.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Button.path', self.path, (str,), False, True, False)
        _guard_vector('Button.commands', self.commands, (Command,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            value=self.value,
            primary=self.primary,
            disabled=self.disabled,
            link=self.link,
            icon=self.icon,
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
            path=self.path,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'Button':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Button.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Button.label', __d_label, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('Button.caption', __d_caption, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Button.value', __d_value, (str,), False, True, False)
        __d_primary: Any = __d.get('primary')
        _guard_scalar('Button.primary', __d_primary, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Button.disabled', __d_disabled, (bool,), False, True, False)
        __d_link: Any = __d.get('link')
        _guard_scalar('Button.link', __d_link, (bool,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Button.icon', __d_icon, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Button.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Button.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Button.tooltip', __d_tooltip, (str,), False, True, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('Button.path', __d_path, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('Button.commands', __d_commands, (dict,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        caption: Optional[str] = __d_caption
        value: Optional[str] = __d_value
        primary: Optional[bool] = __d_primary
        disabled: Optional[bool] = __d_disabled
        link: Optional[bool] = __d_link
        icon: Optional[str] = __d_icon
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        path: Optional[str] = __d_path
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return Button(
            name,
            label,
            caption,
            value,
            primary,
            disabled,
            link,
            icon,
            width,
            visible,
            tooltip,
            path,
            commands,
        )


_ButtonsJustify = ['start', 'end', 'center', 'between', 'around']


class ButtonsJustify:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'


class Buttons:
    """Create a set of buttons laid out horizontally.
    """
    def __init__(
            self,
            items: List['Component'],
            justify: Optional[str] = None,
            name: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_vector('Buttons.items', items, (Component,), False, False, False)
        _guard_enum('Buttons.justify', justify, _ButtonsJustify, True)
        _guard_scalar('Buttons.name', name, (str,), False, True, False)
        _guard_scalar('Buttons.width', width, (str,), False, True, False)
        _guard_scalar('Buttons.visible', visible, (bool,), False, True, False)
        self.items = items
        """The buttons in this set."""
        self.justify = justify
        """Specifies how to lay out buttons horizontally. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ButtonsJustify."""
        self.name = name
        """An identifying name for this component."""
        self.width = width
        """The width of the buttons, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Buttons.items', self.items, (Component,), False, False, False)
        _guard_enum('Buttons.justify', self.justify, _ButtonsJustify, True)
        _guard_scalar('Buttons.name', self.name, (str,), False, True, False)
        _guard_scalar('Buttons.width', self.width, (str,), False, True, False)
        _guard_scalar('Buttons.visible', self.visible, (bool,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            justify=self.justify,
            name=self.name,
            width=self.width,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Buttons':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Buttons.items', __d_items, (dict,), False, False, False)
        __d_justify: Any = __d.get('justify')
        _guard_enum('Buttons.justify', __d_justify, _ButtonsJustify, True)
        __d_name: Any = __d.get('name')
        _guard_scalar('Buttons.name', __d_name, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Buttons.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Buttons.visible', __d_visible, (bool,), False, True, False)
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        justify: Optional[str] = __d_justify
        name: Optional[str] = __d_name
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        return Buttons(
            items,
            justify,
            name,
            width,
            visible,
        )


class MiniButton:
    """Create a mini button - same as regular button, but smaller in size.
    """
    def __init__(
            self,
            name: str,
            label: str,
            icon: Optional[str] = None,
    ):
        _guard_scalar('MiniButton.name', name, (str,), True, False, False)
        _guard_scalar('MiniButton.label', label, (str,), False, False, False)
        _guard_scalar('MiniButton.icon', icon, (str,), False, True, False)
        self.name = name
        """An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked."""
        self.label = label
        """The text displayed on the button."""
        self.icon = icon
        """An optional icon to display next to the button label."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('MiniButton.name', self.name, (str,), True, False, False)
        _guard_scalar('MiniButton.label', self.label, (str,), False, False, False)
        _guard_scalar('MiniButton.icon', self.icon, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'MiniButton':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('MiniButton.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('MiniButton.label', __d_label, (str,), False, False, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('MiniButton.icon', __d_icon, (str,), False, True, False)
        name: str = __d_name
        label: str = __d_label
        icon: Optional[str] = __d_icon
        return MiniButton(
            name,
            label,
            icon,
        )


class MiniButtons:
    """Create a set of mini buttons laid out horizontally.
    """
    def __init__(
            self,
            items: List['Component'],
            visible: Optional[bool] = None,
    ):
        _guard_vector('MiniButtons.items', items, (Component,), False, False, False)
        _guard_scalar('MiniButtons.visible', visible, (bool,), False, True, False)
        self.items = items
        """The buttons in this set."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('MiniButtons.items', self.items, (Component,), False, False, False)
        _guard_scalar('MiniButtons.visible', self.visible, (bool,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'MiniButtons':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('MiniButtons.items', __d_items, (dict,), False, False, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('MiniButtons.visible', __d_visible, (bool,), False, True, False)
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        visible: Optional[bool] = __d_visible
        return MiniButtons(
            items,
            visible,
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
            height: Optional[str] = None,
            width: Optional[str] = None,
            compact: Optional[bool] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            required: Optional[bool] = None,
    ):
        _guard_scalar('FileUpload.name', name, (str,), True, False, False)
        _guard_scalar('FileUpload.label', label, (str,), False, True, False)
        _guard_scalar('FileUpload.multiple', multiple, (bool,), False, True, False)
        _guard_vector('FileUpload.file_extensions', file_extensions, (str,), False, True, False)
        _guard_scalar('FileUpload.max_file_size', max_file_size, (float, int,), False, True, False)
        _guard_scalar('FileUpload.max_size', max_size, (float, int,), False, True, False)
        _guard_scalar('FileUpload.height', height, (str,), False, True, False)
        _guard_scalar('FileUpload.width', width, (str,), False, True, False)
        _guard_scalar('FileUpload.compact', compact, (bool,), False, True, False)
        _guard_scalar('FileUpload.visible', visible, (bool,), False, True, False)
        _guard_scalar('FileUpload.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('FileUpload.required', required, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed in the bottom button or as a component title when the component is displayed compactly. Defaults to "Upload"."""
        self.multiple = multiple
        """True if the component should allow multiple files to be uploaded."""
        self.file_extensions = file_extensions
        """List of allowed file extensions, e.g. `pdf`, `docx`, etc."""
        self.max_file_size = max_file_size
        """Maximum allowed size (Mb) per file. No limit by default."""
        self.max_size = max_size
        """Maximum allowed size (Mb) for all files combined. No limit by default."""
        self.height = height
        """The height of the file upload, e.g. '400px', '50%', etc. Defaults to '300px'."""
        self.width = width
        """The width of the file upload, e.g. '100px'. Defaults to '100%'."""
        self.compact = compact
        """True if the component should be displayed compactly (without drag-and-drop capabilities). Defaults to False."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.required = required
        """True if this is a required field. Defaults to False."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('FileUpload.name', self.name, (str,), True, False, False)
        _guard_scalar('FileUpload.label', self.label, (str,), False, True, False)
        _guard_scalar('FileUpload.multiple', self.multiple, (bool,), False, True, False)
        _guard_vector('FileUpload.file_extensions', self.file_extensions, (str,), False, True, False)
        _guard_scalar('FileUpload.max_file_size', self.max_file_size, (float, int,), False, True, False)
        _guard_scalar('FileUpload.max_size', self.max_size, (float, int,), False, True, False)
        _guard_scalar('FileUpload.height', self.height, (str,), False, True, False)
        _guard_scalar('FileUpload.width', self.width, (str,), False, True, False)
        _guard_scalar('FileUpload.compact', self.compact, (bool,), False, True, False)
        _guard_scalar('FileUpload.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('FileUpload.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('FileUpload.required', self.required, (bool,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            multiple=self.multiple,
            file_extensions=self.file_extensions,
            max_file_size=self.max_file_size,
            max_size=self.max_size,
            height=self.height,
            width=self.width,
            compact=self.compact,
            visible=self.visible,
            tooltip=self.tooltip,
            required=self.required,
        )

    @staticmethod
    def load(__d: Dict) -> 'FileUpload':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('FileUpload.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('FileUpload.label', __d_label, (str,), False, True, False)
        __d_multiple: Any = __d.get('multiple')
        _guard_scalar('FileUpload.multiple', __d_multiple, (bool,), False, True, False)
        __d_file_extensions: Any = __d.get('file_extensions')
        _guard_vector('FileUpload.file_extensions', __d_file_extensions, (str,), False, True, False)
        __d_max_file_size: Any = __d.get('max_file_size')
        _guard_scalar('FileUpload.max_file_size', __d_max_file_size, (float, int,), False, True, False)
        __d_max_size: Any = __d.get('max_size')
        _guard_scalar('FileUpload.max_size', __d_max_size, (float, int,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('FileUpload.height', __d_height, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('FileUpload.width', __d_width, (str,), False, True, False)
        __d_compact: Any = __d.get('compact')
        _guard_scalar('FileUpload.compact', __d_compact, (bool,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('FileUpload.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('FileUpload.tooltip', __d_tooltip, (str,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('FileUpload.required', __d_required, (bool,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        multiple: Optional[bool] = __d_multiple
        file_extensions: Optional[List[str]] = __d_file_extensions
        max_file_size: Optional[float] = __d_max_file_size
        max_size: Optional[float] = __d_max_size
        height: Optional[str] = __d_height
        width: Optional[str] = __d_width
        compact: Optional[bool] = __d_compact
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        required: Optional[bool] = __d_required
        return FileUpload(
            name,
            label,
            multiple,
            file_extensions,
            max_file_size,
            max_size,
            height,
            width,
            compact,
            visible,
            tooltip,
            required,
        )


class ProgressTableCellType:
    """Create a cell type that renders a column's cells as progress bars instead of plain text.
    If set on a column, the cell value must be between 0.0 and 1.0.
    """
    def __init__(
            self,
            color: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('ProgressTableCellType.color', color, (str,), False, True, False)
        _guard_scalar('ProgressTableCellType.name', name, (str,), False, True, False)
        self.color = color
        """Color of the progress arc."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ProgressTableCellType.color', self.color, (str,), False, True, False)
        _guard_scalar('ProgressTableCellType.name', self.name, (str,), False, True, False)
        return _dump(
            color=self.color,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'ProgressTableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_color: Any = __d.get('color')
        _guard_scalar('ProgressTableCellType.color', __d_color, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('ProgressTableCellType.name', __d_name, (str,), False, True, False)
        color: Optional[str] = __d_color
        name: Optional[str] = __d_name
        return ProgressTableCellType(
            color,
            name,
        )


class IconTableCellType:
    """Create a cell type that renders a column's cells as icons instead of plain text.
    If set on a column, the cell value is interpreted as the name of the icon to be displayed.
    """
    def __init__(
            self,
            color: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('IconTableCellType.color', color, (str,), False, True, False)
        _guard_scalar('IconTableCellType.name', name, (str,), False, True, False)
        self.color = color
        """Icon color."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('IconTableCellType.color', self.color, (str,), False, True, False)
        _guard_scalar('IconTableCellType.name', self.name, (str,), False, True, False)
        return _dump(
            color=self.color,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'IconTableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_color: Any = __d.get('color')
        _guard_scalar('IconTableCellType.color', __d_color, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('IconTableCellType.name', __d_name, (str,), False, True, False)
        color: Optional[str] = __d_color
        name: Optional[str] = __d_name
        return IconTableCellType(
            color,
            name,
        )


class Tag:
    """Create a tag.
    """
    def __init__(
            self,
            label: str,
            color: str,
            label_color: Optional[str] = None,
    ):
        _guard_scalar('Tag.label', label, (str,), False, False, False)
        _guard_scalar('Tag.color', color, (str,), False, False, False)
        _guard_scalar('Tag.label_color', label_color, (str,), False, True, False)
        self.label = label
        """The text displayed within the tag."""
        self.color = color
        """Tag's background color."""
        self.label_color = label_color
        """Tag's label color. If not specified, black or white will be picked based on correct contrast with background."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Tag.label', self.label, (str,), False, False, False)
        _guard_scalar('Tag.color', self.color, (str,), False, False, False)
        _guard_scalar('Tag.label_color', self.label_color, (str,), False, True, False)
        return _dump(
            label=self.label,
            color=self.color,
            label_color=self.label_color,
        )

    @staticmethod
    def load(__d: Dict) -> 'Tag':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Tag.label', __d_label, (str,), False, False, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('Tag.color', __d_color, (str,), False, False, False)
        __d_label_color: Any = __d.get('label_color')
        _guard_scalar('Tag.label_color', __d_label_color, (str,), False, True, False)
        label: str = __d_label
        color: str = __d_color
        label_color: Optional[str] = __d_label_color
        return Tag(
            label,
            color,
            label_color,
        )


class TagTableCellType:
    """Creates a collection of tags, usually used for rendering state values.
    In case of multiple tags per row, make sure the row values are
    separated by "," within a single cell string.
    E.g. ui.table_row(name="...", cells=["cell1", "TAG1,TAG2"]).
    Each value should correspond to a `ui.tag.label` attr.
    For the example above: [
    ui.tag(label="TAG1", color="red"),
    ui.tag(label="TAG2", color="green"),
    ]
    """
    def __init__(
            self,
            name: str,
            tags: Optional[List[Tag]] = None,
    ):
        _guard_scalar('TagTableCellType.name', name, (str,), False, False, False)
        _guard_vector('TagTableCellType.tags', tags, (Tag,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.tags = tags
        """Tags to be rendered."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TagTableCellType.name', self.name, (str,), False, False, False)
        _guard_vector('TagTableCellType.tags', self.tags, (Tag,), False, True, False)
        return _dump(
            name=self.name,
            tags=None if self.tags is None else [__e.dump() for __e in self.tags],
        )

    @staticmethod
    def load(__d: Dict) -> 'TagTableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TagTableCellType.name', __d_name, (str,), False, False, False)
        __d_tags: Any = __d.get('tags')
        _guard_vector('TagTableCellType.tags', __d_tags, (dict,), False, True, False)
        name: str = __d_name
        tags: Optional[List[Tag]] = None if __d_tags is None else [Tag.load(__e) for __e in __d_tags]
        return TagTableCellType(
            name,
            tags,
        )


class MenuTableCellType:
    """Create a cell type that renders command menu.

    Commands are typically displayed as context menu items. Useful when you need to provide
    multiple actions within a single row.
    """
    def __init__(
            self,
            commands: List[Command],
            name: Optional[str] = None,
    ):
        _guard_vector('MenuTableCellType.commands', commands, (Command,), False, False, False)
        _guard_scalar('MenuTableCellType.name', name, (str,), False, True, False)
        self.commands = commands
        """Items to render."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('MenuTableCellType.commands', self.commands, (Command,), False, False, False)
        _guard_scalar('MenuTableCellType.name', self.name, (str,), False, True, False)
        return _dump(
            commands=[__e.dump() for __e in self.commands],
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'MenuTableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_commands: Any = __d.get('commands')
        _guard_vector('MenuTableCellType.commands', __d_commands, (dict,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('MenuTableCellType.name', __d_name, (str,), False, True, False)
        commands: List[Command] = [Command.load(__e) for __e in __d_commands]
        name: Optional[str] = __d_name
        return MenuTableCellType(
            commands,
            name,
        )


class MarkdownTableCellType:
    """Create a cell type that renders Markdown content.
    """
    def __init__(
            self,
            name: Optional[str] = None,
            target: Optional[str] = None,
    ):
        _guard_scalar('MarkdownTableCellType.name', name, (str,), False, True, False)
        _guard_scalar('MarkdownTableCellType.target', target, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.target = target
        """Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('MarkdownTableCellType.name', self.name, (str,), False, True, False)
        _guard_scalar('MarkdownTableCellType.target', self.target, (str,), False, True, False)
        return _dump(
            name=self.name,
            target=self.target,
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkdownTableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('MarkdownTableCellType.name', __d_name, (str,), False, True, False)
        __d_target: Any = __d.get('target')
        _guard_scalar('MarkdownTableCellType.target', __d_target, (str,), False, True, False)
        name: Optional[str] = __d_name
        target: Optional[str] = __d_target
        return MarkdownTableCellType(
            name,
            target,
        )


class TableCellType:
    """Defines cell content to be rendered instead of a simple text.
    """
    def __init__(
            self,
            progress: Optional[ProgressTableCellType] = None,
            icon: Optional[IconTableCellType] = None,
            tag: Optional[TagTableCellType] = None,
            menu: Optional[MenuTableCellType] = None,
            markdown: Optional[MarkdownTableCellType] = None,
    ):
        _guard_scalar('TableCellType.progress', progress, (ProgressTableCellType,), False, True, False)
        _guard_scalar('TableCellType.icon', icon, (IconTableCellType,), False, True, False)
        _guard_scalar('TableCellType.tag', tag, (TagTableCellType,), False, True, False)
        _guard_scalar('TableCellType.menu', menu, (MenuTableCellType,), False, True, False)
        _guard_scalar('TableCellType.markdown', markdown, (MarkdownTableCellType,), False, True, False)
        self.progress = progress
        """Renders a progress arc with a percentage value in the middle."""
        self.icon = icon
        """Renders an icon."""
        self.tag = tag
        """Renders one or more tags."""
        self.menu = menu
        """Renders a command menu."""
        self.markdown = markdown
        """Renders text using markdown."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TableCellType.progress', self.progress, (ProgressTableCellType,), False, True, False)
        _guard_scalar('TableCellType.icon', self.icon, (IconTableCellType,), False, True, False)
        _guard_scalar('TableCellType.tag', self.tag, (TagTableCellType,), False, True, False)
        _guard_scalar('TableCellType.menu', self.menu, (MenuTableCellType,), False, True, False)
        _guard_scalar('TableCellType.markdown', self.markdown, (MarkdownTableCellType,), False, True, False)
        return _dump(
            progress=None if self.progress is None else self.progress.dump(),
            icon=None if self.icon is None else self.icon.dump(),
            tag=None if self.tag is None else self.tag.dump(),
            menu=None if self.menu is None else self.menu.dump(),
            markdown=None if self.markdown is None else self.markdown.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'TableCellType':
        """Creates an instance of this class using the contents of a dict."""
        __d_progress: Any = __d.get('progress')
        _guard_scalar('TableCellType.progress', __d_progress, (dict,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('TableCellType.icon', __d_icon, (dict,), False, True, False)
        __d_tag: Any = __d.get('tag')
        _guard_scalar('TableCellType.tag', __d_tag, (dict,), False, True, False)
        __d_menu: Any = __d.get('menu')
        _guard_scalar('TableCellType.menu', __d_menu, (dict,), False, True, False)
        __d_markdown: Any = __d.get('markdown')
        _guard_scalar('TableCellType.markdown', __d_markdown, (dict,), False, True, False)
        progress: Optional[ProgressTableCellType] = None if __d_progress is None else ProgressTableCellType.load(__d_progress)
        icon: Optional[IconTableCellType] = None if __d_icon is None else IconTableCellType.load(__d_icon)
        tag: Optional[TagTableCellType] = None if __d_tag is None else TagTableCellType.load(__d_tag)
        menu: Optional[MenuTableCellType] = None if __d_menu is None else MenuTableCellType.load(__d_menu)
        markdown: Optional[MarkdownTableCellType] = None if __d_markdown is None else MarkdownTableCellType.load(__d_markdown)
        return TableCellType(
            progress,
            icon,
            tag,
            menu,
            markdown,
        )


_TableColumnDataType = ['string', 'number', 'time']


class TableColumnDataType:
    STRING = 'string'
    NUMBER = 'number'
    TIME = 'time'


_TableColumnCellOverflow = ['tooltip', 'wrap']


class TableColumnCellOverflow:
    TOOLTIP = 'tooltip'
    WRAP = 'wrap'


_TableColumnAlign = ['left', 'center', 'right']


class TableColumnAlign:
    LEFT = 'left'
    CENTER = 'center'
    RIGHT = 'right'


class TableColumn:
    """Create a table column.
    """
    def __init__(
            self,
            name: str,
            label: str,
            min_width: Optional[str] = None,
            max_width: Optional[str] = None,
            sortable: Optional[bool] = None,
            searchable: Optional[bool] = None,
            filterable: Optional[bool] = None,
            link: Optional[bool] = None,
            data_type: Optional[str] = None,
            cell_type: Optional[TableCellType] = None,
            cell_overflow: Optional[str] = None,
            filters: Optional[List[str]] = None,
            align: Optional[str] = None,
    ):
        _guard_scalar('TableColumn.name', name, (str,), True, False, False)
        _guard_scalar('TableColumn.label', label, (str,), False, False, False)
        _guard_scalar('TableColumn.min_width', min_width, (str,), False, True, False)
        _guard_scalar('TableColumn.max_width', max_width, (str,), False, True, False)
        _guard_scalar('TableColumn.sortable', sortable, (bool,), False, True, False)
        _guard_scalar('TableColumn.searchable', searchable, (bool,), False, True, False)
        _guard_scalar('TableColumn.filterable', filterable, (bool,), False, True, False)
        _guard_scalar('TableColumn.link', link, (bool,), False, True, False)
        _guard_enum('TableColumn.data_type', data_type, _TableColumnDataType, True)
        _guard_scalar('TableColumn.cell_type', cell_type, (TableCellType,), False, True, False)
        _guard_enum('TableColumn.cell_overflow', cell_overflow, _TableColumnCellOverflow, True)
        _guard_vector('TableColumn.filters', filters, (str,), False, True, False)
        _guard_enum('TableColumn.align', align, _TableColumnAlign, True)
        self.name = name
        """An identifying name for this column."""
        self.label = label
        """The text displayed on the column header."""
        self.min_width = min_width
        """The minimum width of this column, e.g. '50px'. Only `px` units are supported at this time."""
        self.max_width = max_width
        """The maximum width of this column, e.g. '100px'. Only `px` units are supported at this time."""
        self.sortable = sortable
        """Indicates whether the column is sortable."""
        self.searchable = searchable
        """Indicates whether the contents of this column can be searched through. Enables a search box for the table if true."""
        self.filterable = filterable
        """Indicates whether the contents of this column are displayed as filters in a dropdown."""
        self.link = link
        """Indicates whether each cell in this column should be displayed as a clickable link. Applies to exactly one text column in the table."""
        self.data_type = data_type
        """Defines the data type of this column. Time column takes either ISO 8601 date string or unix epoch miliseconds. Defaults to `string`. One of 'string', 'number', 'time'. See enum h2o_wave.ui.TableColumnDataType."""
        self.cell_type = cell_type
        """Defines how to render each cell in this column. Renders as plain text by default."""
        self.cell_overflow = cell_overflow
        """Defines what to do with a cell's contents in case it does not fit inside the cell. One of 'tooltip', 'wrap'. See enum h2o_wave.ui.TableColumnCellOverflow."""
        self.filters = filters
        """Explicit list of values to allow filtering by, needed when pagination is set or custom order is needed. Only applicable to filterable columns."""
        self.align = align
        """Defines how to align values in a column. One of 'left', 'center', 'right'. See enum h2o_wave.ui.TableColumnAlign."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TableColumn.name', self.name, (str,), True, False, False)
        _guard_scalar('TableColumn.label', self.label, (str,), False, False, False)
        _guard_scalar('TableColumn.min_width', self.min_width, (str,), False, True, False)
        _guard_scalar('TableColumn.max_width', self.max_width, (str,), False, True, False)
        _guard_scalar('TableColumn.sortable', self.sortable, (bool,), False, True, False)
        _guard_scalar('TableColumn.searchable', self.searchable, (bool,), False, True, False)
        _guard_scalar('TableColumn.filterable', self.filterable, (bool,), False, True, False)
        _guard_scalar('TableColumn.link', self.link, (bool,), False, True, False)
        _guard_enum('TableColumn.data_type', self.data_type, _TableColumnDataType, True)
        _guard_scalar('TableColumn.cell_type', self.cell_type, (TableCellType,), False, True, False)
        _guard_enum('TableColumn.cell_overflow', self.cell_overflow, _TableColumnCellOverflow, True)
        _guard_vector('TableColumn.filters', self.filters, (str,), False, True, False)
        _guard_enum('TableColumn.align', self.align, _TableColumnAlign, True)
        return _dump(
            name=self.name,
            label=self.label,
            min_width=self.min_width,
            max_width=self.max_width,
            sortable=self.sortable,
            searchable=self.searchable,
            filterable=self.filterable,
            link=self.link,
            data_type=self.data_type,
            cell_type=None if self.cell_type is None else self.cell_type.dump(),
            cell_overflow=self.cell_overflow,
            filters=self.filters,
            align=self.align,
        )

    @staticmethod
    def load(__d: Dict) -> 'TableColumn':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TableColumn.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('TableColumn.label', __d_label, (str,), False, False, False)
        __d_min_width: Any = __d.get('min_width')
        _guard_scalar('TableColumn.min_width', __d_min_width, (str,), False, True, False)
        __d_max_width: Any = __d.get('max_width')
        _guard_scalar('TableColumn.max_width', __d_max_width, (str,), False, True, False)
        __d_sortable: Any = __d.get('sortable')
        _guard_scalar('TableColumn.sortable', __d_sortable, (bool,), False, True, False)
        __d_searchable: Any = __d.get('searchable')
        _guard_scalar('TableColumn.searchable', __d_searchable, (bool,), False, True, False)
        __d_filterable: Any = __d.get('filterable')
        _guard_scalar('TableColumn.filterable', __d_filterable, (bool,), False, True, False)
        __d_link: Any = __d.get('link')
        _guard_scalar('TableColumn.link', __d_link, (bool,), False, True, False)
        __d_data_type: Any = __d.get('data_type')
        _guard_enum('TableColumn.data_type', __d_data_type, _TableColumnDataType, True)
        __d_cell_type: Any = __d.get('cell_type')
        _guard_scalar('TableColumn.cell_type', __d_cell_type, (dict,), False, True, False)
        __d_cell_overflow: Any = __d.get('cell_overflow')
        _guard_enum('TableColumn.cell_overflow', __d_cell_overflow, _TableColumnCellOverflow, True)
        __d_filters: Any = __d.get('filters')
        _guard_vector('TableColumn.filters', __d_filters, (str,), False, True, False)
        __d_align: Any = __d.get('align')
        _guard_enum('TableColumn.align', __d_align, _TableColumnAlign, True)
        name: str = __d_name
        label: str = __d_label
        min_width: Optional[str] = __d_min_width
        max_width: Optional[str] = __d_max_width
        sortable: Optional[bool] = __d_sortable
        searchable: Optional[bool] = __d_searchable
        filterable: Optional[bool] = __d_filterable
        link: Optional[bool] = __d_link
        data_type: Optional[str] = __d_data_type
        cell_type: Optional[TableCellType] = None if __d_cell_type is None else TableCellType.load(__d_cell_type)
        cell_overflow: Optional[str] = __d_cell_overflow
        filters: Optional[List[str]] = __d_filters
        align: Optional[str] = __d_align
        return TableColumn(
            name,
            label,
            min_width,
            max_width,
            sortable,
            searchable,
            filterable,
            link,
            data_type,
            cell_type,
            cell_overflow,
            filters,
            align,
        )


class TableRow:
    """Create a table row.
    """
    def __init__(
            self,
            name: str,
            cells: List[str],
    ):
        _guard_scalar('TableRow.name', name, (str,), True, False, False)
        _guard_vector('TableRow.cells', cells, (str,), False, False, False)
        self.name = name
        """An identifying name for this row."""
        self.cells = cells
        """The cells in this row (displayed left to right)."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TableRow.name', self.name, (str,), True, False, False)
        _guard_vector('TableRow.cells', self.cells, (str,), False, False, False)
        return _dump(
            name=self.name,
            cells=self.cells,
        )

    @staticmethod
    def load(__d: Dict) -> 'TableRow':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TableRow.name', __d_name, (str,), True, False, False)
        __d_cells: Any = __d.get('cells')
        _guard_vector('TableRow.cells', __d_cells, (str,), False, False, False)
        name: str = __d_name
        cells: List[str] = __d_cells
        return TableRow(
            name,
            cells,
        )


class TableGroup:
    """Make rows within the table collapsible/expandable.

    This type of table is best used for cases when your data makes sense to be presented in chunks rather than a single flat list.
    """
    def __init__(
            self,
            label: str,
            rows: List[TableRow],
            collapsed: Optional[bool] = None,
    ):
        _guard_scalar('TableGroup.label', label, (str,), False, False, False)
        _guard_vector('TableGroup.rows', rows, (TableRow,), False, False, False)
        _guard_scalar('TableGroup.collapsed', collapsed, (bool,), False, True, False)
        self.label = label
        """The title of the group."""
        self.rows = rows
        """The rows in this group."""
        self.collapsed = collapsed
        """Indicates whether the table group should be collapsed by default. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TableGroup.label', self.label, (str,), False, False, False)
        _guard_vector('TableGroup.rows', self.rows, (TableRow,), False, False, False)
        _guard_scalar('TableGroup.collapsed', self.collapsed, (bool,), False, True, False)
        return _dump(
            label=self.label,
            rows=[__e.dump() for __e in self.rows],
            collapsed=self.collapsed,
        )

    @staticmethod
    def load(__d: Dict) -> 'TableGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('TableGroup.label', __d_label, (str,), False, False, False)
        __d_rows: Any = __d.get('rows')
        _guard_vector('TableGroup.rows', __d_rows, (dict,), False, False, False)
        __d_collapsed: Any = __d.get('collapsed')
        _guard_scalar('TableGroup.collapsed', __d_collapsed, (bool,), False, True, False)
        label: str = __d_label
        rows: List[TableRow] = [TableRow.load(__e) for __e in __d_rows]
        collapsed: Optional[bool] = __d_collapsed
        return TableGroup(
            label,
            rows,
            collapsed,
        )


class TablePagination:
    """Configure table pagination. Use as `pagination` parameter to `ui.table()`
    """
    def __init__(
            self,
            total_rows: int,
            rows_per_page: int,
    ):
        _guard_scalar('TablePagination.total_rows', total_rows, (int,), False, False, False)
        _guard_scalar('TablePagination.rows_per_page', rows_per_page, (int,), False, False, False)
        self.total_rows = total_rows
        """Total count of all the rows in your dataset."""
        self.rows_per_page = rows_per_page
        """The maximum amount of rows to be displayed in a single page."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TablePagination.total_rows', self.total_rows, (int,), False, False, False)
        _guard_scalar('TablePagination.rows_per_page', self.rows_per_page, (int,), False, False, False)
        return _dump(
            total_rows=self.total_rows,
            rows_per_page=self.rows_per_page,
        )

    @staticmethod
    def load(__d: Dict) -> 'TablePagination':
        """Creates an instance of this class using the contents of a dict."""
        __d_total_rows: Any = __d.get('total_rows')
        _guard_scalar('TablePagination.total_rows', __d_total_rows, (int,), False, False, False)
        __d_rows_per_page: Any = __d.get('rows_per_page')
        _guard_scalar('TablePagination.rows_per_page', __d_rows_per_page, (int,), False, False, False)
        total_rows: int = __d_total_rows
        rows_per_page: int = __d_rows_per_page
        return TablePagination(
            total_rows,
            rows_per_page,
        )


_TableCheckboxVisibility = ['always', 'on-hover', 'hidden']


class TableCheckboxVisibility:
    ALWAYS = 'always'
    ON_HOVER = 'on-hover'
    HIDDEN = 'hidden'


class Table:
    """Create an interactive table.

    This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
    display a non-interactive table of information, use a markdown table.

    If `multiple` is set to False (default), each row in the table is clickable. When a cell in the column with `link=True`
    (defaults to first column) is clicked or the row is doubleclicked, the form is
    submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
    the table, and `row_name` is the `name` of the row that was clicked on.

    If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
    Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
    `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
    and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
    set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
    submission.

    If `pagination` is set, you have to handle search/filter/sort/download/page_change/reset events yourself since
    none of these features will work automatically like in non-paginated table.
    """
    def __init__(
            self,
            name: str,
            columns: List[TableColumn],
            rows: Optional[List[TableRow]] = None,
            multiple: Optional[bool] = None,
            groupable: Optional[bool] = None,
            downloadable: Optional[bool] = None,
            resettable: Optional[bool] = None,
            height: Optional[str] = None,
            width: Optional[str] = None,
            values: Optional[List[str]] = None,
            checkbox_visibility: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
            groups: Optional[List[TableGroup]] = None,
            pagination: Optional[TablePagination] = None,
            events: Optional[List[str]] = None,
            single: Optional[bool] = None,
            value: Optional[str] = None,
    ):
        _guard_scalar('Table.name', name, (str,), True, False, False)
        _guard_vector('Table.columns', columns, (TableColumn,), False, False, False)
        _guard_vector('Table.rows', rows, (TableRow,), False, True, False)
        _guard_scalar('Table.multiple', multiple, (bool,), False, True, False)
        _guard_scalar('Table.groupable', groupable, (bool,), False, True, False)
        _guard_scalar('Table.downloadable', downloadable, (bool,), False, True, False)
        _guard_scalar('Table.resettable', resettable, (bool,), False, True, False)
        _guard_scalar('Table.height', height, (str,), False, True, False)
        _guard_scalar('Table.width', width, (str,), False, True, False)
        _guard_vector('Table.values', values, (str,), False, True, False)
        _guard_enum('Table.checkbox_visibility', checkbox_visibility, _TableCheckboxVisibility, True)
        _guard_scalar('Table.visible', visible, (bool,), False, True, False)
        _guard_scalar('Table.tooltip', tooltip, (str,), False, True, False)
        _guard_vector('Table.groups', groups, (TableGroup,), False, True, False)
        _guard_scalar('Table.pagination', pagination, (TablePagination,), False, True, False)
        _guard_vector('Table.events', events, (str,), False, True, False)
        _guard_scalar('Table.single', single, (bool,), False, True, False)
        _guard_scalar('Table.value', value, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.columns = columns
        """The columns in this table."""
        self.rows = rows
        """The rows in this table. Mutually exclusive with `groups` attr."""
        self.multiple = multiple
        """True to allow multiple rows to be selected. Mutually exclusive with `single` attr."""
        self.groupable = groupable
        """True to allow group by feature."""
        self.downloadable = downloadable
        """Indicates whether the table rows can be downloaded as a CSV file. Defaults to False."""
        self.resettable = resettable
        """Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False."""
        self.height = height
        """The height of the table in px (e.g. '200px') or '1' to fill the remaining card space."""
        self.width = width
        """The width of the table, e.g. '100px'. Defaults to '100%'."""
        self.values = values
        """The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`)."""
        self.checkbox_visibility = checkbox_visibility
        """Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'. One of 'always', 'on-hover', 'hidden'. See enum h2o_wave.ui.TableCheckboxVisibility."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.groups = groups
        """Creates collapsible / expandable groups of data rows. Mutually exclusive with `rows` attr."""
        self.pagination = pagination
        """Display a pagination control at the bottom of the table. Set this value using `ui.table_pagination()`."""
        self.events = events
        """The events to capture on this table when pagination is set. One of 'search' | 'sort' | 'filter' | 'download' | 'page_change' | 'reset' | 'select'."""
        self.single = single
        """True to allow only one row to be selected at time. Mutually exclusive with `multiple` attr."""
        self.value = value
        """The name of the selected row. If this parameter is set, single selection will be allowed (`single` is assumed to be `True`)."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Table.name', self.name, (str,), True, False, False)
        _guard_vector('Table.columns', self.columns, (TableColumn,), False, False, False)
        _guard_vector('Table.rows', self.rows, (TableRow,), False, True, False)
        _guard_scalar('Table.multiple', self.multiple, (bool,), False, True, False)
        _guard_scalar('Table.groupable', self.groupable, (bool,), False, True, False)
        _guard_scalar('Table.downloadable', self.downloadable, (bool,), False, True, False)
        _guard_scalar('Table.resettable', self.resettable, (bool,), False, True, False)
        _guard_scalar('Table.height', self.height, (str,), False, True, False)
        _guard_scalar('Table.width', self.width, (str,), False, True, False)
        _guard_vector('Table.values', self.values, (str,), False, True, False)
        _guard_enum('Table.checkbox_visibility', self.checkbox_visibility, _TableCheckboxVisibility, True)
        _guard_scalar('Table.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Table.tooltip', self.tooltip, (str,), False, True, False)
        _guard_vector('Table.groups', self.groups, (TableGroup,), False, True, False)
        _guard_scalar('Table.pagination', self.pagination, (TablePagination,), False, True, False)
        _guard_vector('Table.events', self.events, (str,), False, True, False)
        _guard_scalar('Table.single', self.single, (bool,), False, True, False)
        _guard_scalar('Table.value', self.value, (str,), False, True, False)
        return _dump(
            name=self.name,
            columns=[__e.dump() for __e in self.columns],
            rows=None if self.rows is None else [__e.dump() for __e in self.rows],
            multiple=self.multiple,
            groupable=self.groupable,
            downloadable=self.downloadable,
            resettable=self.resettable,
            height=self.height,
            width=self.width,
            values=self.values,
            checkbox_visibility=self.checkbox_visibility,
            visible=self.visible,
            tooltip=self.tooltip,
            groups=None if self.groups is None else [__e.dump() for __e in self.groups],
            pagination=None if self.pagination is None else self.pagination.dump(),
            events=self.events,
            single=self.single,
            value=self.value,
        )

    @staticmethod
    def load(__d: Dict) -> 'Table':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Table.name', __d_name, (str,), True, False, False)
        __d_columns: Any = __d.get('columns')
        _guard_vector('Table.columns', __d_columns, (dict,), False, False, False)
        __d_rows: Any = __d.get('rows')
        _guard_vector('Table.rows', __d_rows, (dict,), False, True, False)
        __d_multiple: Any = __d.get('multiple')
        _guard_scalar('Table.multiple', __d_multiple, (bool,), False, True, False)
        __d_groupable: Any = __d.get('groupable')
        _guard_scalar('Table.groupable', __d_groupable, (bool,), False, True, False)
        __d_downloadable: Any = __d.get('downloadable')
        _guard_scalar('Table.downloadable', __d_downloadable, (bool,), False, True, False)
        __d_resettable: Any = __d.get('resettable')
        _guard_scalar('Table.resettable', __d_resettable, (bool,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Table.height', __d_height, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Table.width', __d_width, (str,), False, True, False)
        __d_values: Any = __d.get('values')
        _guard_vector('Table.values', __d_values, (str,), False, True, False)
        __d_checkbox_visibility: Any = __d.get('checkbox_visibility')
        _guard_enum('Table.checkbox_visibility', __d_checkbox_visibility, _TableCheckboxVisibility, True)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Table.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Table.tooltip', __d_tooltip, (str,), False, True, False)
        __d_groups: Any = __d.get('groups')
        _guard_vector('Table.groups', __d_groups, (dict,), False, True, False)
        __d_pagination: Any = __d.get('pagination')
        _guard_scalar('Table.pagination', __d_pagination, (dict,), False, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('Table.events', __d_events, (str,), False, True, False)
        __d_single: Any = __d.get('single')
        _guard_scalar('Table.single', __d_single, (bool,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Table.value', __d_value, (str,), False, True, False)
        name: str = __d_name
        columns: List[TableColumn] = [TableColumn.load(__e) for __e in __d_columns]
        rows: Optional[List[TableRow]] = None if __d_rows is None else [TableRow.load(__e) for __e in __d_rows]
        multiple: Optional[bool] = __d_multiple
        groupable: Optional[bool] = __d_groupable
        downloadable: Optional[bool] = __d_downloadable
        resettable: Optional[bool] = __d_resettable
        height: Optional[str] = __d_height
        width: Optional[str] = __d_width
        values: Optional[List[str]] = __d_values
        checkbox_visibility: Optional[str] = __d_checkbox_visibility
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        groups: Optional[List[TableGroup]] = None if __d_groups is None else [TableGroup.load(__e) for __e in __d_groups]
        pagination: Optional[TablePagination] = None if __d_pagination is None else TablePagination.load(__d_pagination)
        events: Optional[List[str]] = __d_events
        single: Optional[bool] = __d_single
        value: Optional[str] = __d_value
        return Table(
            name,
            columns,
            rows,
            multiple,
            groupable,
            downloadable,
            resettable,
            height,
            width,
            values,
            checkbox_visibility,
            visible,
            tooltip,
            groups,
            pagination,
            events,
            single,
            value,
        )


class Link:
    """Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
    All other kinds of paths are treated as external hyperlinks.
    """
    def __init__(
            self,
            label: Optional[str] = None,
            path: Optional[str] = None,
            disabled: Optional[bool] = None,
            download: Optional[bool] = None,
            button: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            target: Optional[str] = None,
            tooltip: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Link.label', label, (str,), False, True, False)
        _guard_scalar('Link.path', path, (str,), False, True, False)
        _guard_scalar('Link.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Link.download', download, (bool,), False, True, False)
        _guard_scalar('Link.button', button, (bool,), False, True, False)
        _guard_scalar('Link.width', width, (str,), False, True, False)
        _guard_scalar('Link.visible', visible, (bool,), False, True, False)
        _guard_scalar('Link.target', target, (str,), False, True, False)
        _guard_scalar('Link.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('Link.name', name, (str,), False, True, False)
        self.label = label
        """The text to be displayed. If blank, the `path` is used as the label."""
        self.path = path
        """The path or URL to link to."""
        self.disabled = disabled
        """True if the link should be disabled."""
        self.download = download
        """True if the link should prompt the user to save the linked URL instead of navigating to it."""
        self.button = button
        """True if the link should be rendered as a button."""
        self.width = width
        """The width of the link, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.target = target
        """Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Link.label', self.label, (str,), False, True, False)
        _guard_scalar('Link.path', self.path, (str,), False, True, False)
        _guard_scalar('Link.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Link.download', self.download, (bool,), False, True, False)
        _guard_scalar('Link.button', self.button, (bool,), False, True, False)
        _guard_scalar('Link.width', self.width, (str,), False, True, False)
        _guard_scalar('Link.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Link.target', self.target, (str,), False, True, False)
        _guard_scalar('Link.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('Link.name', self.name, (str,), False, True, False)
        return _dump(
            label=self.label,
            path=self.path,
            disabled=self.disabled,
            download=self.download,
            button=self.button,
            width=self.width,
            visible=self.visible,
            target=self.target,
            tooltip=self.tooltip,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Link':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Link.label', __d_label, (str,), False, True, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('Link.path', __d_path, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Link.disabled', __d_disabled, (bool,), False, True, False)
        __d_download: Any = __d.get('download')
        _guard_scalar('Link.download', __d_download, (bool,), False, True, False)
        __d_button: Any = __d.get('button')
        _guard_scalar('Link.button', __d_button, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Link.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Link.visible', __d_visible, (bool,), False, True, False)
        __d_target: Any = __d.get('target')
        _guard_scalar('Link.target', __d_target, (str,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Link.tooltip', __d_tooltip, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Link.name', __d_name, (str,), False, True, False)
        label: Optional[str] = __d_label
        path: Optional[str] = __d_path
        disabled: Optional[bool] = __d_disabled
        download: Optional[bool] = __d_download
        button: Optional[bool] = __d_button
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        target: Optional[str] = __d_target
        tooltip: Optional[str] = __d_tooltip
        name: Optional[str] = __d_name
        return Link(
            label,
            path,
            disabled,
            download,
            button,
            width,
            visible,
            target,
            tooltip,
            name,
        )


class Links:
    """Create a collection of links.
    """
    def __init__(
            self,
            items: List['Component'],
            label: Optional[str] = None,
            inline: Optional[bool] = None,
            width: Optional[str] = None,
    ):
        _guard_vector('Links.items', items, (Component,), False, False, False)
        _guard_scalar('Links.label', label, (str,), False, True, False)
        _guard_scalar('Links.inline', inline, (bool,), False, True, False)
        _guard_scalar('Links.width', width, (str,), False, True, False)
        self.items = items
        """The links contained in this group."""
        self.label = label
        """The name of the link group."""
        self.inline = inline
        """Render links horizontally. Defaults to False."""
        self.width = width
        """The width of the links, e.g. '100px'."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Links.items', self.items, (Component,), False, False, False)
        _guard_scalar('Links.label', self.label, (str,), False, True, False)
        _guard_scalar('Links.inline', self.inline, (bool,), False, True, False)
        _guard_scalar('Links.width', self.width, (str,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            label=self.label,
            inline=self.inline,
            width=self.width,
        )

    @staticmethod
    def load(__d: Dict) -> 'Links':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Links.items', __d_items, (dict,), False, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Links.label', __d_label, (str,), False, True, False)
        __d_inline: Any = __d.get('inline')
        _guard_scalar('Links.inline', __d_inline, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Links.width', __d_width, (str,), False, True, False)
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        label: Optional[str] = __d_label
        inline: Optional[bool] = __d_inline
        width: Optional[str] = __d_width
        return Links(
            items,
            label,
            inline,
            width,
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
        _guard_scalar('Tab.name', name, (str,), True, False, False)
        _guard_scalar('Tab.label', label, (str,), False, True, False)
        _guard_scalar('Tab.icon', icon, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed on the tab."""
        self.icon = icon
        """The icon displayed on the tab."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Tab.name', self.name, (str,), True, False, False)
        _guard_scalar('Tab.label', self.label, (str,), False, True, False)
        _guard_scalar('Tab.icon', self.icon, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'Tab':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Tab.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Tab.label', __d_label, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Tab.icon', __d_icon, (str,), False, True, False)
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            link: Optional[bool] = None,
    ):
        _guard_scalar('Tabs.name', name, (str,), True, False, False)
        _guard_scalar('Tabs.value', value, (str,), False, True, False)
        _guard_vector('Tabs.items', items, (Tab,), False, True, False)
        _guard_scalar('Tabs.width', width, (str,), False, True, False)
        _guard_scalar('Tabs.visible', visible, (bool,), False, True, False)
        _guard_scalar('Tabs.link', link, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.value = value
        """The name of the tab to select initially."""
        self.items = items
        """The tabs in this tab bar."""
        self.width = width
        """The width of the tabs, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.link = link
        """True if tabs should be rendered as links instead of buttons."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Tabs.name', self.name, (str,), True, False, False)
        _guard_scalar('Tabs.value', self.value, (str,), False, True, False)
        _guard_vector('Tabs.items', self.items, (Tab,), False, True, False)
        _guard_scalar('Tabs.width', self.width, (str,), False, True, False)
        _guard_scalar('Tabs.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Tabs.link', self.link, (bool,), False, True, False)
        return _dump(
            name=self.name,
            value=self.value,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            width=self.width,
            visible=self.visible,
            link=self.link,
        )

    @staticmethod
    def load(__d: Dict) -> 'Tabs':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Tabs.name', __d_name, (str,), True, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Tabs.value', __d_value, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('Tabs.items', __d_items, (dict,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Tabs.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Tabs.visible', __d_visible, (bool,), False, True, False)
        __d_link: Any = __d.get('link')
        _guard_scalar('Tabs.link', __d_link, (bool,), False, True, False)
        name: str = __d_name
        value: Optional[str] = __d_value
        items: Optional[List[Tab]] = None if __d_items is None else [Tab.load(__e) for __e in __d_items]
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        link: Optional[bool] = __d_link
        return Tabs(
            name,
            value,
            items,
            width,
            visible,
            link,
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_scalar('Expander.name', name, (str,), True, False, False)
        _guard_scalar('Expander.label', label, (str,), False, True, False)
        _guard_scalar('Expander.expanded', expanded, (bool,), False, True, False)
        _guard_vector('Expander.items', items, (Component,), False, True, False)
        _guard_scalar('Expander.width', width, (str,), False, True, False)
        _guard_scalar('Expander.visible', visible, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed on the expander."""
        self.expanded = expanded
        """True if expanded, False if collapsed."""
        self.items = items
        """List of components to be hideable by the expander."""
        self.width = width
        """The width of the expander, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Expander.name', self.name, (str,), True, False, False)
        _guard_scalar('Expander.label', self.label, (str,), False, True, False)
        _guard_scalar('Expander.expanded', self.expanded, (bool,), False, True, False)
        _guard_vector('Expander.items', self.items, (Component,), False, True, False)
        _guard_scalar('Expander.width', self.width, (str,), False, True, False)
        _guard_scalar('Expander.visible', self.visible, (bool,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            expanded=self.expanded,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            width=self.width,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Expander':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Expander.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Expander.label', __d_label, (str,), False, True, False)
        __d_expanded: Any = __d.get('expanded')
        _guard_scalar('Expander.expanded', __d_expanded, (bool,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('Expander.items', __d_items, (dict,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Expander.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Expander.visible', __d_visible, (bool,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        expanded: Optional[bool] = __d_expanded
        items: Optional[List['Component']] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        return Expander(
            name,
            label,
            expanded,
            items,
            width,
            visible,
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
            name: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_scalar('Frame.path', path, (str,), False, True, False)
        _guard_scalar('Frame.content', content, (str,), False, True, False)
        _guard_scalar('Frame.width', width, (str,), False, True, False)
        _guard_scalar('Frame.height', height, (str,), False, True, False)
        _guard_scalar('Frame.name', name, (str,), False, True, False)
        _guard_scalar('Frame.visible', visible, (bool,), False, True, False)
        self.path = path
        """The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`"""
        self.content = content
        """The HTML content of the page. A string containing `<html>...</html>`."""
        self.width = width
        """The width of the frame, e.g. `200px`, `50%`, etc. Defaults to '100%'."""
        self.height = height
        """The height of the frame, e.g. `200px`, `50%`, etc. Defaults to '150px'."""
        self.name = name
        """An identifying name for this component."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Frame.path', self.path, (str,), False, True, False)
        _guard_scalar('Frame.content', self.content, (str,), False, True, False)
        _guard_scalar('Frame.width', self.width, (str,), False, True, False)
        _guard_scalar('Frame.height', self.height, (str,), False, True, False)
        _guard_scalar('Frame.name', self.name, (str,), False, True, False)
        _guard_scalar('Frame.visible', self.visible, (bool,), False, True, False)
        return _dump(
            path=self.path,
            content=self.content,
            width=self.width,
            height=self.height,
            name=self.name,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Frame':
        """Creates an instance of this class using the contents of a dict."""
        __d_path: Any = __d.get('path')
        _guard_scalar('Frame.path', __d_path, (str,), False, True, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('Frame.content', __d_content, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Frame.width', __d_width, (str,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Frame.height', __d_height, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Frame.name', __d_name, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Frame.visible', __d_visible, (bool,), False, True, False)
        path: Optional[str] = __d_path
        content: Optional[str] = __d_content
        width: Optional[str] = __d_width
        height: Optional[str] = __d_height
        name: Optional[str] = __d_name
        visible: Optional[bool] = __d_visible
        return Frame(
            path,
            content,
            width,
            height,
            name,
            visible,
        )


class Markup:
    """Render HTML content.
    """
    def __init__(
            self,
            content: str,
            name: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_scalar('Markup.content', content, (str,), False, False, False)
        _guard_scalar('Markup.name', name, (str,), False, True, False)
        _guard_scalar('Markup.width', width, (str,), False, True, False)
        _guard_scalar('Markup.visible', visible, (bool,), False, True, False)
        self.content = content
        """The HTML content."""
        self.name = name
        """An identifying name for this component."""
        self.width = width
        """The width of the markup, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Markup.content', self.content, (str,), False, False, False)
        _guard_scalar('Markup.name', self.name, (str,), False, True, False)
        _guard_scalar('Markup.width', self.width, (str,), False, True, False)
        _guard_scalar('Markup.visible', self.visible, (bool,), False, True, False)
        return _dump(
            content=self.content,
            name=self.name,
            width=self.width,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Markup':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('Markup.content', __d_content, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Markup.name', __d_name, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Markup.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Markup.visible', __d_visible, (bool,), False, True, False)
        content: str = __d_content
        name: Optional[str] = __d_name
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        return Markup(
            content,
            name,
            width,
            visible,
        )


class Template:
    """Render dynamic content using an HTML template.
    """
    def __init__(
            self,
            content: str,
            data: Optional[PackedRecord] = None,
            name: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
    ):
        _guard_scalar('Template.content', content, (str,), False, False, False)
        _guard_scalar('Template.name', name, (str,), False, True, False)
        _guard_scalar('Template.width', width, (str,), False, True, False)
        _guard_scalar('Template.visible', visible, (bool,), False, True, False)
        self.content = content
        """The Handlebars template. https://handlebarsjs.com/guide/"""
        self.data = data
        """Data for the Handlebars template"""
        self.name = name
        """An identifying name for this component."""
        self.width = width
        """The width of the template, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Template.content', self.content, (str,), False, False, False)
        _guard_scalar('Template.name', self.name, (str,), False, True, False)
        _guard_scalar('Template.width', self.width, (str,), False, True, False)
        _guard_scalar('Template.visible', self.visible, (bool,), False, True, False)
        return _dump(
            content=self.content,
            data=self.data,
            name=self.name,
            width=self.width,
            visible=self.visible,
        )

    @staticmethod
    def load(__d: Dict) -> 'Template':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('Template.content', __d_content, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_name: Any = __d.get('name')
        _guard_scalar('Template.name', __d_name, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Template.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Template.visible', __d_visible, (bool,), False, True, False)
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        name: Optional[str] = __d_name
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        return Template(
            content,
            data,
            name,
            width,
            visible,
        )


class Picker:
    """Create a picker.
    Pickers are used to select one or more choices, such as tags or files, from a list.
    Use a picker to allow the user to quickly search for or manage a few tags or files.
    """
    def __init__(
            self,
            name: str,
            choices: List[Choice],
            label: Optional[str] = None,
            values: Optional[List[str]] = None,
            max_choices: Optional[int] = None,
            required: Optional[bool] = None,
            disabled: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            trigger: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Picker.name', name, (str,), True, False, False)
        _guard_vector('Picker.choices', choices, (Choice,), False, False, False)
        _guard_scalar('Picker.label', label, (str,), False, True, False)
        _guard_vector('Picker.values', values, (str,), False, True, False)
        _guard_scalar('Picker.max_choices', max_choices, (int,), False, True, False)
        _guard_scalar('Picker.required', required, (bool,), False, True, False)
        _guard_scalar('Picker.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('Picker.width', width, (str,), False, True, False)
        _guard_scalar('Picker.visible', visible, (bool,), False, True, False)
        _guard_scalar('Picker.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('Picker.tooltip', tooltip, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.choices = choices
        """The choices to be presented."""
        self.label = label
        """Text to be displayed above the component."""
        self.values = values
        """The names of the selected choices."""
        self.max_choices = max_choices
        """Maximum number of selectable choices."""
        self.required = required
        """True if the picker is a required field."""
        self.disabled = disabled
        """Controls whether the picker should be disabled or not."""
        self.width = width
        """The width of the picker, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.trigger = trigger
        """True if the form should be submitted when the picker value changes."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Picker.name', self.name, (str,), True, False, False)
        _guard_vector('Picker.choices', self.choices, (Choice,), False, False, False)
        _guard_scalar('Picker.label', self.label, (str,), False, True, False)
        _guard_vector('Picker.values', self.values, (str,), False, True, False)
        _guard_scalar('Picker.max_choices', self.max_choices, (int,), False, True, False)
        _guard_scalar('Picker.required', self.required, (bool,), False, True, False)
        _guard_scalar('Picker.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('Picker.width', self.width, (str,), False, True, False)
        _guard_scalar('Picker.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Picker.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('Picker.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            choices=[__e.dump() for __e in self.choices],
            label=self.label,
            values=self.values,
            max_choices=self.max_choices,
            required=self.required,
            disabled=self.disabled,
            width=self.width,
            visible=self.visible,
            trigger=self.trigger,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Picker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Picker.name', __d_name, (str,), True, False, False)
        __d_choices: Any = __d.get('choices')
        _guard_vector('Picker.choices', __d_choices, (dict,), False, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Picker.label', __d_label, (str,), False, True, False)
        __d_values: Any = __d.get('values')
        _guard_vector('Picker.values', __d_values, (str,), False, True, False)
        __d_max_choices: Any = __d.get('max_choices')
        _guard_scalar('Picker.max_choices', __d_max_choices, (int,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('Picker.required', __d_required, (bool,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('Picker.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Picker.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Picker.visible', __d_visible, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('Picker.trigger', __d_trigger, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Picker.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        choices: List[Choice] = [Choice.load(__e) for __e in __d_choices]
        label: Optional[str] = __d_label
        values: Optional[List[str]] = __d_values
        max_choices: Optional[int] = __d_max_choices
        required: Optional[bool] = __d_required
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        trigger: Optional[bool] = __d_trigger
        tooltip: Optional[str] = __d_tooltip
        return Picker(
            name,
            choices,
            label,
            values,
            max_choices,
            required,
            disabled,
            width,
            visible,
            trigger,
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
            width: Optional[str] = None,
            trigger: Optional[bool] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('RangeSlider.name', name, (str,), True, False, False)
        _guard_scalar('RangeSlider.label', label, (str,), False, True, False)
        _guard_scalar('RangeSlider.min', min, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.max', max, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.step', step, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.min_value', min_value, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.max_value', max_value, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('RangeSlider.width', width, (str,), False, True, False)
        _guard_scalar('RangeSlider.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('RangeSlider.visible', visible, (bool,), False, True, False)
        _guard_scalar('RangeSlider.tooltip', tooltip, (str,), False, True, False)
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
        """The upper bound of the selected range. Default value is `max`."""
        self.disabled = disabled
        """True if this field is disabled."""
        self.width = width
        """The width of the range slider, e.g. '100px'. Defaults to '100%'."""
        self.trigger = trigger
        """True if the form should be submitted when the slider value changes."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('RangeSlider.name', self.name, (str,), True, False, False)
        _guard_scalar('RangeSlider.label', self.label, (str,), False, True, False)
        _guard_scalar('RangeSlider.min', self.min, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.max', self.max, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.step', self.step, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.min_value', self.min_value, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.max_value', self.max_value, (float, int,), False, True, False)
        _guard_scalar('RangeSlider.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('RangeSlider.width', self.width, (str,), False, True, False)
        _guard_scalar('RangeSlider.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('RangeSlider.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('RangeSlider.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            min=self.min,
            max=self.max,
            step=self.step,
            min_value=self.min_value,
            max_value=self.max_value,
            disabled=self.disabled,
            width=self.width,
            trigger=self.trigger,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'RangeSlider':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('RangeSlider.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('RangeSlider.label', __d_label, (str,), False, True, False)
        __d_min: Any = __d.get('min')
        _guard_scalar('RangeSlider.min', __d_min, (float, int,), False, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('RangeSlider.max', __d_max, (float, int,), False, True, False)
        __d_step: Any = __d.get('step')
        _guard_scalar('RangeSlider.step', __d_step, (float, int,), False, True, False)
        __d_min_value: Any = __d.get('min_value')
        _guard_scalar('RangeSlider.min_value', __d_min_value, (float, int,), False, True, False)
        __d_max_value: Any = __d.get('max_value')
        _guard_scalar('RangeSlider.max_value', __d_max_value, (float, int,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('RangeSlider.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('RangeSlider.width', __d_width, (str,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('RangeSlider.trigger', __d_trigger, (bool,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('RangeSlider.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('RangeSlider.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        min: Optional[float] = __d_min
        max: Optional[float] = __d_max
        step: Optional[float] = __d_step
        min_value: Optional[float] = __d_min_value
        max_value: Optional[float] = __d_max_value
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        trigger: Optional[bool] = __d_trigger
        visible: Optional[bool] = __d_visible
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
            width,
            trigger,
            visible,
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
        _guard_scalar('Step.label', label, (str,), False, False, False)
        _guard_scalar('Step.icon', icon, (str,), False, True, False)
        _guard_scalar('Step.done', done, (bool,), False, True, False)
        self.label = label
        """Text displayed below icon."""
        self.icon = icon
        """Icon to be displayed."""
        self.done = done
        """Indicates whether this step has already been completed."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Step.label', self.label, (str,), False, False, False)
        _guard_scalar('Step.icon', self.icon, (str,), False, True, False)
        _guard_scalar('Step.done', self.done, (bool,), False, True, False)
        return _dump(
            label=self.label,
            icon=self.icon,
            done=self.done,
        )

    @staticmethod
    def load(__d: Dict) -> 'Step':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Step.label', __d_label, (str,), False, False, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Step.icon', __d_icon, (str,), False, True, False)
        __d_done: Any = __d.get('done')
        _guard_scalar('Step.done', __d_done, (bool,), False, True, False)
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
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            tooltip: Optional[str] = None,
    ):
        _guard_scalar('Stepper.name', name, (str,), True, False, False)
        _guard_vector('Stepper.items', items, (Step,), False, False, False)
        _guard_scalar('Stepper.width', width, (str,), False, True, False)
        _guard_scalar('Stepper.visible', visible, (bool,), False, True, False)
        _guard_scalar('Stepper.tooltip', tooltip, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.items = items
        """The sequence of steps to be displayed."""
        self.width = width
        """The width of the stepper, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user clicks the help icon to the right of the component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Stepper.name', self.name, (str,), True, False, False)
        _guard_vector('Stepper.items', self.items, (Step,), False, False, False)
        _guard_scalar('Stepper.width', self.width, (str,), False, True, False)
        _guard_scalar('Stepper.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Stepper.tooltip', self.tooltip, (str,), False, True, False)
        return _dump(
            name=self.name,
            items=[__e.dump() for __e in self.items],
            width=self.width,
            visible=self.visible,
            tooltip=self.tooltip,
        )

    @staticmethod
    def load(__d: Dict) -> 'Stepper':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Stepper.name', __d_name, (str,), True, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('Stepper.items', __d_items, (dict,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Stepper.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Stepper.visible', __d_visible, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('Stepper.tooltip', __d_tooltip, (str,), False, True, False)
        name: str = __d_name
        items: List[Step] = [Step.load(__e) for __e in __d_items]
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        tooltip: Optional[str] = __d_tooltip
        return Stepper(
            name,
            items,
            width,
            visible,
            tooltip,
        )


_MarkCoord = ['rect', 'cartesian', 'polar', 'theta', 'helix']


class MarkCoord:
    RECT = 'rect'
    CARTESIAN = 'cartesian'
    POLAR = 'polar'
    THETA = 'theta'
    HELIX = 'helix'


_MarkType = ['interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap']


class MarkType:
    INTERVAL = 'interval'
    LINE = 'line'
    PATH = 'path'
    POINT = 'point'
    AREA = 'area'
    POLYGON = 'polygon'
    SCHEMA = 'schema'
    EDGE = 'edge'
    HEATMAP = 'heatmap'


_MarkXScale = ['linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile']


class MarkXScale:
    LINEAR = 'linear'
    CAT = 'cat'
    CATEGORY = 'category'
    IDENTITY = 'identity'
    LOG = 'log'
    POW = 'pow'
    POWER = 'power'
    TIME = 'time'
    TIME_CATEGORY = 'time-category'
    QUANTIZE = 'quantize'
    QUANTILE = 'quantile'


_MarkYScale = ['linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile']


class MarkYScale:
    LINEAR = 'linear'
    CAT = 'cat'
    CATEGORY = 'category'
    IDENTITY = 'identity'
    LOG = 'log'
    POW = 'pow'
    POWER = 'power'
    TIME = 'time'
    TIME_CATEGORY = 'time-category'
    QUANTIZE = 'quantize'
    QUANTILE = 'quantile'


_MarkCurve = ['none', 'smooth', 'step-before', 'step', 'step-after']


class MarkCurve:
    NONE = 'none'
    SMOOTH = 'smooth'
    STEP_BEFORE = 'step-before'
    STEP = 'step'
    STEP_AFTER = 'step-after'


_MarkLabelPosition = ['top', 'bottom', 'middle', 'left', 'right']


class MarkLabelPosition:
    TOP = 'top'
    BOTTOM = 'bottom'
    MIDDLE = 'middle'
    LEFT = 'left'
    RIGHT = 'right'


_MarkLabelOverlap = ['hide', 'overlap', 'constrain']


class MarkLabelOverlap:
    HIDE = 'hide'
    OVERLAP = 'overlap'
    CONSTRAIN = 'constrain'


_MarkLabelAlign = ['left', 'right', 'center', 'start', 'end']


class MarkLabelAlign:
    LEFT = 'left'
    RIGHT = 'right'
    CENTER = 'center'
    START = 'start'
    END = 'end'


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
            x_q1: Optional[Value] = None,
            x_q2: Optional[Value] = None,
            x_q3: Optional[Value] = None,
            x_min: Optional[float] = None,
            x_max: Optional[float] = None,
            x_nice: Optional[bool] = None,
            x_scale: Optional[str] = None,
            x_title: Optional[str] = None,
            y: Optional[Value] = None,
            y0: Optional[Value] = None,
            y1: Optional[Value] = None,
            y2: Optional[Value] = None,
            y_q1: Optional[Value] = None,
            y_q2: Optional[Value] = None,
            y_q3: Optional[Value] = None,
            y_min: Optional[float] = None,
            y_max: Optional[float] = None,
            y_nice: Optional[bool] = None,
            y_scale: Optional[str] = None,
            y_title: Optional[str] = None,
            color: Optional[str] = None,
            color_range: Optional[str] = None,
            color_domain: Optional[List[str]] = None,
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
            interactive: Optional[bool] = None,
    ):
        _guard_enum('Mark.coord', coord, _MarkCoord, True)
        _guard_enum('Mark.type', type, _MarkType, True)
        _guard_scalar('Mark.x_min', x_min, (float, int,), False, True, False)
        _guard_scalar('Mark.x_max', x_max, (float, int,), False, True, False)
        _guard_scalar('Mark.x_nice', x_nice, (bool,), False, True, False)
        _guard_enum('Mark.x_scale', x_scale, _MarkXScale, True)
        _guard_scalar('Mark.x_title', x_title, (str,), False, True, False)
        _guard_scalar('Mark.y_min', y_min, (float, int,), False, True, False)
        _guard_scalar('Mark.y_max', y_max, (float, int,), False, True, False)
        _guard_scalar('Mark.y_nice', y_nice, (bool,), False, True, False)
        _guard_enum('Mark.y_scale', y_scale, _MarkYScale, True)
        _guard_scalar('Mark.y_title', y_title, (str,), False, True, False)
        _guard_scalar('Mark.color', color, (str,), False, True, False)
        _guard_scalar('Mark.color_range', color_range, (str,), False, True, False)
        _guard_vector('Mark.color_domain', color_domain, (str,), False, True, False)
        _guard_scalar('Mark.shape', shape, (str,), False, True, False)
        _guard_scalar('Mark.shape_range', shape_range, (str,), False, True, False)
        _guard_scalar('Mark.size_range', size_range, (str,), False, True, False)
        _guard_scalar('Mark.stack', stack, (str,), False, True, False)
        _guard_scalar('Mark.dodge', dodge, (str,), False, True, False)
        _guard_enum('Mark.curve', curve, _MarkCurve, True)
        _guard_scalar('Mark.fill_color', fill_color, (str,), False, True, False)
        _guard_scalar('Mark.fill_opacity', fill_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_color', stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.stroke_opacity', stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_size', stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_dash', stroke_dash, (str,), False, True, False)
        _guard_scalar('Mark.label', label, (str,), False, True, False)
        _guard_scalar('Mark.label_offset', label_offset, (float, int,), False, True, False)
        _guard_scalar('Mark.label_offset_x', label_offset_x, (float, int,), False, True, False)
        _guard_scalar('Mark.label_offset_y', label_offset_y, (float, int,), False, True, False)
        _guard_scalar('Mark.label_rotation', label_rotation, (str,), False, True, False)
        _guard_enum('Mark.label_position', label_position, _MarkLabelPosition, True)
        _guard_enum('Mark.label_overlap', label_overlap, _MarkLabelOverlap, True)
        _guard_scalar('Mark.label_fill_color', label_fill_color, (str,), False, True, False)
        _guard_scalar('Mark.label_fill_opacity', label_fill_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.label_stroke_color', label_stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.label_stroke_opacity', label_stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.label_stroke_size', label_stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.label_font_size', label_font_size, (float, int,), False, True, False)
        _guard_scalar('Mark.label_font_weight', label_font_weight, (str,), False, True, False)
        _guard_scalar('Mark.label_line_height', label_line_height, (float, int,), False, True, False)
        _guard_enum('Mark.label_align', label_align, _MarkLabelAlign, True)
        _guard_scalar('Mark.ref_stroke_color', ref_stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.ref_stroke_opacity', ref_stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.ref_stroke_size', ref_stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.ref_stroke_dash', ref_stroke_dash, (str,), False, True, False)
        _guard_scalar('Mark.interactive', interactive, (bool,), False, True, False)
        self.coord = coord
        """Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'. See enum h2o_wave.ui.MarkCoord."""
        self.type = type
        """Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'. See enum h2o_wave.ui.MarkType."""
        self.x = x
        """X field or value."""
        self.x0 = x0
        """X base field or value."""
        self.x1 = x1
        """X bin lower bound field or value. For histograms and box plots."""
        self.x2 = x2
        """X bin upper bound field or value. For histograms and box plots."""
        self.x_q1 = x_q1
        """X lower quartile. For box plots."""
        self.x_q2 = x_q2
        """X median. For box plots."""
        self.x_q3 = x_q3
        """X upper quartile. For box plots."""
        self.x_min = x_min
        """X axis scale minimum."""
        self.x_max = x_max
        """X axis scale maximum."""
        self.x_nice = x_nice
        """Whether to nice X axis scale ticks."""
        self.x_scale = x_scale
        """X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkXScale."""
        self.x_title = x_title
        """X axis title."""
        self.y = y
        """Y field or value."""
        self.y0 = y0
        """Y base field or value."""
        self.y1 = y1
        """Y bin lower bound field or value. For histograms and box plots."""
        self.y2 = y2
        """Y bin upper bound field or value. For histograms and box plots."""
        self.y_q1 = y_q1
        """Y lower quartile. For box plots."""
        self.y_q2 = y_q2
        """Y median. For box plots."""
        self.y_q3 = y_q3
        """Y upper quartile. For box plots."""
        self.y_min = y_min
        """Y axis scale minimum."""
        self.y_max = y_max
        """Y axis scale maximum."""
        self.y_nice = y_nice
        """Whether to nice Y axis scale ticks."""
        self.y_scale = y_scale
        """Y axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkYScale."""
        self.y_title = y_title
        """Y axis title."""
        self.color = color
        """Mark color field or value."""
        self.color_range = color_range
        """Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`"""
        self.color_domain = color_domain
        """The unique values in the data (labels or categories or classes) to map colors to, e.g. `['high', 'medium', 'low']`. If this is not provided, the unique values are automatically inferred from the `color` attribute."""
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
        """Curve type for `line` and `area` mark types. One of 'none', 'smooth', 'step-before', 'step', 'step-after'. See enum h2o_wave.ui.MarkCurve."""
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
        """Label position relative to the mark. One of 'top', 'bottom', 'middle', 'left', 'right'. See enum h2o_wave.ui.MarkLabelPosition."""
        self.label_overlap = label_overlap
        """Strategy to use if labels overlap. One of 'hide', 'overlap', 'constrain'. See enum h2o_wave.ui.MarkLabelOverlap."""
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
        """Label text alignment. One of 'left', 'right', 'center', 'start', 'end'. See enum h2o_wave.ui.MarkLabelAlign."""
        self.ref_stroke_color = ref_stroke_color
        """Reference line stroke color."""
        self.ref_stroke_opacity = ref_stroke_opacity
        """Reference line stroke opacity."""
        self.ref_stroke_size = ref_stroke_size
        """Reference line stroke size (line width or pen thickness)."""
        self.ref_stroke_dash = ref_stroke_dash
        """Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]."""
        self.interactive = interactive
        """Defines whether to raise events on interactions with the mark. Defaults to True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_enum('Mark.coord', self.coord, _MarkCoord, True)
        _guard_enum('Mark.type', self.type, _MarkType, True)
        _guard_scalar('Mark.x_min', self.x_min, (float, int,), False, True, False)
        _guard_scalar('Mark.x_max', self.x_max, (float, int,), False, True, False)
        _guard_scalar('Mark.x_nice', self.x_nice, (bool,), False, True, False)
        _guard_enum('Mark.x_scale', self.x_scale, _MarkXScale, True)
        _guard_scalar('Mark.x_title', self.x_title, (str,), False, True, False)
        _guard_scalar('Mark.y_min', self.y_min, (float, int,), False, True, False)
        _guard_scalar('Mark.y_max', self.y_max, (float, int,), False, True, False)
        _guard_scalar('Mark.y_nice', self.y_nice, (bool,), False, True, False)
        _guard_enum('Mark.y_scale', self.y_scale, _MarkYScale, True)
        _guard_scalar('Mark.y_title', self.y_title, (str,), False, True, False)
        _guard_scalar('Mark.color', self.color, (str,), False, True, False)
        _guard_scalar('Mark.color_range', self.color_range, (str,), False, True, False)
        _guard_vector('Mark.color_domain', self.color_domain, (str,), False, True, False)
        _guard_scalar('Mark.shape', self.shape, (str,), False, True, False)
        _guard_scalar('Mark.shape_range', self.shape_range, (str,), False, True, False)
        _guard_scalar('Mark.size_range', self.size_range, (str,), False, True, False)
        _guard_scalar('Mark.stack', self.stack, (str,), False, True, False)
        _guard_scalar('Mark.dodge', self.dodge, (str,), False, True, False)
        _guard_enum('Mark.curve', self.curve, _MarkCurve, True)
        _guard_scalar('Mark.fill_color', self.fill_color, (str,), False, True, False)
        _guard_scalar('Mark.fill_opacity', self.fill_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_color', self.stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.stroke_opacity', self.stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_size', self.stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.stroke_dash', self.stroke_dash, (str,), False, True, False)
        _guard_scalar('Mark.label', self.label, (str,), False, True, False)
        _guard_scalar('Mark.label_offset', self.label_offset, (float, int,), False, True, False)
        _guard_scalar('Mark.label_offset_x', self.label_offset_x, (float, int,), False, True, False)
        _guard_scalar('Mark.label_offset_y', self.label_offset_y, (float, int,), False, True, False)
        _guard_scalar('Mark.label_rotation', self.label_rotation, (str,), False, True, False)
        _guard_enum('Mark.label_position', self.label_position, _MarkLabelPosition, True)
        _guard_enum('Mark.label_overlap', self.label_overlap, _MarkLabelOverlap, True)
        _guard_scalar('Mark.label_fill_color', self.label_fill_color, (str,), False, True, False)
        _guard_scalar('Mark.label_fill_opacity', self.label_fill_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.label_stroke_color', self.label_stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.label_stroke_opacity', self.label_stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.label_stroke_size', self.label_stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.label_font_size', self.label_font_size, (float, int,), False, True, False)
        _guard_scalar('Mark.label_font_weight', self.label_font_weight, (str,), False, True, False)
        _guard_scalar('Mark.label_line_height', self.label_line_height, (float, int,), False, True, False)
        _guard_enum('Mark.label_align', self.label_align, _MarkLabelAlign, True)
        _guard_scalar('Mark.ref_stroke_color', self.ref_stroke_color, (str,), False, True, False)
        _guard_scalar('Mark.ref_stroke_opacity', self.ref_stroke_opacity, (float, int,), False, True, False)
        _guard_scalar('Mark.ref_stroke_size', self.ref_stroke_size, (float, int,), False, True, False)
        _guard_scalar('Mark.ref_stroke_dash', self.ref_stroke_dash, (str,), False, True, False)
        _guard_scalar('Mark.interactive', self.interactive, (bool,), False, True, False)
        return _dump(
            coord=self.coord,
            type=self.type,
            x=self.x,
            x0=self.x0,
            x1=self.x1,
            x2=self.x2,
            x_q1=self.x_q1,
            x_q2=self.x_q2,
            x_q3=self.x_q3,
            x_min=self.x_min,
            x_max=self.x_max,
            x_nice=self.x_nice,
            x_scale=self.x_scale,
            x_title=self.x_title,
            y=self.y,
            y0=self.y0,
            y1=self.y1,
            y2=self.y2,
            y_q1=self.y_q1,
            y_q2=self.y_q2,
            y_q3=self.y_q3,
            y_min=self.y_min,
            y_max=self.y_max,
            y_nice=self.y_nice,
            y_scale=self.y_scale,
            y_title=self.y_title,
            color=self.color,
            color_range=self.color_range,
            color_domain=self.color_domain,
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
            interactive=self.interactive,
        )

    @staticmethod
    def load(__d: Dict) -> 'Mark':
        """Creates an instance of this class using the contents of a dict."""
        __d_coord: Any = __d.get('coord')
        _guard_enum('Mark.coord', __d_coord, _MarkCoord, True)
        __d_type: Any = __d.get('type')
        _guard_enum('Mark.type', __d_type, _MarkType, True)
        __d_x: Any = __d.get('x')
        __d_x0: Any = __d.get('x0')
        __d_x1: Any = __d.get('x1')
        __d_x2: Any = __d.get('x2')
        __d_x_q1: Any = __d.get('x_q1')
        __d_x_q2: Any = __d.get('x_q2')
        __d_x_q3: Any = __d.get('x_q3')
        __d_x_min: Any = __d.get('x_min')
        _guard_scalar('Mark.x_min', __d_x_min, (float, int,), False, True, False)
        __d_x_max: Any = __d.get('x_max')
        _guard_scalar('Mark.x_max', __d_x_max, (float, int,), False, True, False)
        __d_x_nice: Any = __d.get('x_nice')
        _guard_scalar('Mark.x_nice', __d_x_nice, (bool,), False, True, False)
        __d_x_scale: Any = __d.get('x_scale')
        _guard_enum('Mark.x_scale', __d_x_scale, _MarkXScale, True)
        __d_x_title: Any = __d.get('x_title')
        _guard_scalar('Mark.x_title', __d_x_title, (str,), False, True, False)
        __d_y: Any = __d.get('y')
        __d_y0: Any = __d.get('y0')
        __d_y1: Any = __d.get('y1')
        __d_y2: Any = __d.get('y2')
        __d_y_q1: Any = __d.get('y_q1')
        __d_y_q2: Any = __d.get('y_q2')
        __d_y_q3: Any = __d.get('y_q3')
        __d_y_min: Any = __d.get('y_min')
        _guard_scalar('Mark.y_min', __d_y_min, (float, int,), False, True, False)
        __d_y_max: Any = __d.get('y_max')
        _guard_scalar('Mark.y_max', __d_y_max, (float, int,), False, True, False)
        __d_y_nice: Any = __d.get('y_nice')
        _guard_scalar('Mark.y_nice', __d_y_nice, (bool,), False, True, False)
        __d_y_scale: Any = __d.get('y_scale')
        _guard_enum('Mark.y_scale', __d_y_scale, _MarkYScale, True)
        __d_y_title: Any = __d.get('y_title')
        _guard_scalar('Mark.y_title', __d_y_title, (str,), False, True, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('Mark.color', __d_color, (str,), False, True, False)
        __d_color_range: Any = __d.get('color_range')
        _guard_scalar('Mark.color_range', __d_color_range, (str,), False, True, False)
        __d_color_domain: Any = __d.get('color_domain')
        _guard_vector('Mark.color_domain', __d_color_domain, (str,), False, True, False)
        __d_shape: Any = __d.get('shape')
        _guard_scalar('Mark.shape', __d_shape, (str,), False, True, False)
        __d_shape_range: Any = __d.get('shape_range')
        _guard_scalar('Mark.shape_range', __d_shape_range, (str,), False, True, False)
        __d_size: Any = __d.get('size')
        __d_size_range: Any = __d.get('size_range')
        _guard_scalar('Mark.size_range', __d_size_range, (str,), False, True, False)
        __d_stack: Any = __d.get('stack')
        _guard_scalar('Mark.stack', __d_stack, (str,), False, True, False)
        __d_dodge: Any = __d.get('dodge')
        _guard_scalar('Mark.dodge', __d_dodge, (str,), False, True, False)
        __d_curve: Any = __d.get('curve')
        _guard_enum('Mark.curve', __d_curve, _MarkCurve, True)
        __d_fill_color: Any = __d.get('fill_color')
        _guard_scalar('Mark.fill_color', __d_fill_color, (str,), False, True, False)
        __d_fill_opacity: Any = __d.get('fill_opacity')
        _guard_scalar('Mark.fill_opacity', __d_fill_opacity, (float, int,), False, True, False)
        __d_stroke_color: Any = __d.get('stroke_color')
        _guard_scalar('Mark.stroke_color', __d_stroke_color, (str,), False, True, False)
        __d_stroke_opacity: Any = __d.get('stroke_opacity')
        _guard_scalar('Mark.stroke_opacity', __d_stroke_opacity, (float, int,), False, True, False)
        __d_stroke_size: Any = __d.get('stroke_size')
        _guard_scalar('Mark.stroke_size', __d_stroke_size, (float, int,), False, True, False)
        __d_stroke_dash: Any = __d.get('stroke_dash')
        _guard_scalar('Mark.stroke_dash', __d_stroke_dash, (str,), False, True, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Mark.label', __d_label, (str,), False, True, False)
        __d_label_offset: Any = __d.get('label_offset')
        _guard_scalar('Mark.label_offset', __d_label_offset, (float, int,), False, True, False)
        __d_label_offset_x: Any = __d.get('label_offset_x')
        _guard_scalar('Mark.label_offset_x', __d_label_offset_x, (float, int,), False, True, False)
        __d_label_offset_y: Any = __d.get('label_offset_y')
        _guard_scalar('Mark.label_offset_y', __d_label_offset_y, (float, int,), False, True, False)
        __d_label_rotation: Any = __d.get('label_rotation')
        _guard_scalar('Mark.label_rotation', __d_label_rotation, (str,), False, True, False)
        __d_label_position: Any = __d.get('label_position')
        _guard_enum('Mark.label_position', __d_label_position, _MarkLabelPosition, True)
        __d_label_overlap: Any = __d.get('label_overlap')
        _guard_enum('Mark.label_overlap', __d_label_overlap, _MarkLabelOverlap, True)
        __d_label_fill_color: Any = __d.get('label_fill_color')
        _guard_scalar('Mark.label_fill_color', __d_label_fill_color, (str,), False, True, False)
        __d_label_fill_opacity: Any = __d.get('label_fill_opacity')
        _guard_scalar('Mark.label_fill_opacity', __d_label_fill_opacity, (float, int,), False, True, False)
        __d_label_stroke_color: Any = __d.get('label_stroke_color')
        _guard_scalar('Mark.label_stroke_color', __d_label_stroke_color, (str,), False, True, False)
        __d_label_stroke_opacity: Any = __d.get('label_stroke_opacity')
        _guard_scalar('Mark.label_stroke_opacity', __d_label_stroke_opacity, (float, int,), False, True, False)
        __d_label_stroke_size: Any = __d.get('label_stroke_size')
        _guard_scalar('Mark.label_stroke_size', __d_label_stroke_size, (float, int,), False, True, False)
        __d_label_font_size: Any = __d.get('label_font_size')
        _guard_scalar('Mark.label_font_size', __d_label_font_size, (float, int,), False, True, False)
        __d_label_font_weight: Any = __d.get('label_font_weight')
        _guard_scalar('Mark.label_font_weight', __d_label_font_weight, (str,), False, True, False)
        __d_label_line_height: Any = __d.get('label_line_height')
        _guard_scalar('Mark.label_line_height', __d_label_line_height, (float, int,), False, True, False)
        __d_label_align: Any = __d.get('label_align')
        _guard_enum('Mark.label_align', __d_label_align, _MarkLabelAlign, True)
        __d_ref_stroke_color: Any = __d.get('ref_stroke_color')
        _guard_scalar('Mark.ref_stroke_color', __d_ref_stroke_color, (str,), False, True, False)
        __d_ref_stroke_opacity: Any = __d.get('ref_stroke_opacity')
        _guard_scalar('Mark.ref_stroke_opacity', __d_ref_stroke_opacity, (float, int,), False, True, False)
        __d_ref_stroke_size: Any = __d.get('ref_stroke_size')
        _guard_scalar('Mark.ref_stroke_size', __d_ref_stroke_size, (float, int,), False, True, False)
        __d_ref_stroke_dash: Any = __d.get('ref_stroke_dash')
        _guard_scalar('Mark.ref_stroke_dash', __d_ref_stroke_dash, (str,), False, True, False)
        __d_interactive: Any = __d.get('interactive')
        _guard_scalar('Mark.interactive', __d_interactive, (bool,), False, True, False)
        coord: Optional[str] = __d_coord
        type: Optional[str] = __d_type
        x: Optional[Value] = __d_x
        x0: Optional[Value] = __d_x0
        x1: Optional[Value] = __d_x1
        x2: Optional[Value] = __d_x2
        x_q1: Optional[Value] = __d_x_q1
        x_q2: Optional[Value] = __d_x_q2
        x_q3: Optional[Value] = __d_x_q3
        x_min: Optional[float] = __d_x_min
        x_max: Optional[float] = __d_x_max
        x_nice: Optional[bool] = __d_x_nice
        x_scale: Optional[str] = __d_x_scale
        x_title: Optional[str] = __d_x_title
        y: Optional[Value] = __d_y
        y0: Optional[Value] = __d_y0
        y1: Optional[Value] = __d_y1
        y2: Optional[Value] = __d_y2
        y_q1: Optional[Value] = __d_y_q1
        y_q2: Optional[Value] = __d_y_q2
        y_q3: Optional[Value] = __d_y_q3
        y_min: Optional[float] = __d_y_min
        y_max: Optional[float] = __d_y_max
        y_nice: Optional[bool] = __d_y_nice
        y_scale: Optional[str] = __d_y_scale
        y_title: Optional[str] = __d_y_title
        color: Optional[str] = __d_color
        color_range: Optional[str] = __d_color_range
        color_domain: Optional[List[str]] = __d_color_domain
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
        interactive: Optional[bool] = __d_interactive
        return Mark(
            coord,
            type,
            x,
            x0,
            x1,
            x2,
            x_q1,
            x_q2,
            x_q3,
            x_min,
            x_max,
            x_nice,
            x_scale,
            x_title,
            y,
            y0,
            y1,
            y2,
            y_q1,
            y_q2,
            y_q3,
            y_min,
            y_max,
            y_nice,
            y_scale,
            y_title,
            color,
            color_range,
            color_domain,
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
            interactive,
        )


class Plot:
    """Create a plot. A plot is composed of one or more graphical mark layers.
    """
    def __init__(
            self,
            marks: List[Mark],
    ):
        _guard_vector('Plot.marks', marks, (Mark,), False, False, False)
        self.marks = marks
        """The graphical mark layers contained in this plot."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Plot.marks', self.marks, (Mark,), False, False, False)
        return _dump(
            marks=[__e.dump() for __e in self.marks],
        )

    @staticmethod
    def load(__d: Dict) -> 'Plot':
        """Creates an instance of this class using the contents of a dict."""
        __d_marks: Any = __d.get('marks')
        _guard_vector('Plot.marks', __d_marks, (dict,), False, False, False)
        marks: List[Mark] = [Mark.load(__e) for __e in __d_marks]
        return Plot(
            marks,
        )


class Visualization:
    """Create a visualization for display inside a form.
    """
    def __init__(
            self,
            plot: Plot,
            data: PackedRecord,
            width: Optional[str] = None,
            height: Optional[str] = None,
            name: Optional[str] = None,
            visible: Optional[bool] = None,
            events: Optional[List[str]] = None,
            interactions: Optional[List[str]] = None,
            animate: Optional[bool] = None,
    ):
        _guard_scalar('Visualization.plot', plot, (Plot,), False, False, False)
        _guard_scalar('Visualization.width', width, (str,), False, True, False)
        _guard_scalar('Visualization.height', height, (str,), False, True, False)
        _guard_scalar('Visualization.name', name, (str,), False, True, False)
        _guard_scalar('Visualization.visible', visible, (bool,), False, True, False)
        _guard_vector('Visualization.events', events, (str,), False, True, False)
        _guard_vector('Visualization.interactions', interactions, (str,), False, True, False)
        _guard_scalar('Visualization.animate', animate, (bool,), False, True, False)
        self.plot = plot
        """The plot to be rendered in this visualization."""
        self.data = data
        """Data for this visualization."""
        self.width = width
        """The width of the visualization. Defaults to '100%'."""
        self.height = height
        """The hight of the visualization. Defaults to '300px'."""
        self.name = name
        """An identifying name for this component."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.events = events
        """The events to capture on this visualization. One of 'select_marks'."""
        self.interactions = interactions
        """The interactions to be allowed for this plot. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event."""
        self.animate = animate
        """EXPERIMENTAL: True to turn on the chart animations. Defaults to False."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Visualization.plot', self.plot, (Plot,), False, False, False)
        _guard_scalar('Visualization.width', self.width, (str,), False, True, False)
        _guard_scalar('Visualization.height', self.height, (str,), False, True, False)
        _guard_scalar('Visualization.name', self.name, (str,), False, True, False)
        _guard_scalar('Visualization.visible', self.visible, (bool,), False, True, False)
        _guard_vector('Visualization.events', self.events, (str,), False, True, False)
        _guard_vector('Visualization.interactions', self.interactions, (str,), False, True, False)
        _guard_scalar('Visualization.animate', self.animate, (bool,), False, True, False)
        return _dump(
            plot=self.plot.dump(),
            data=self.data,
            width=self.width,
            height=self.height,
            name=self.name,
            visible=self.visible,
            events=self.events,
            interactions=self.interactions,
            animate=self.animate,
        )

    @staticmethod
    def load(__d: Dict) -> 'Visualization':
        """Creates an instance of this class using the contents of a dict."""
        __d_plot: Any = __d.get('plot')
        _guard_scalar('Visualization.plot', __d_plot, (dict,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_width: Any = __d.get('width')
        _guard_scalar('Visualization.width', __d_width, (str,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Visualization.height', __d_height, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Visualization.name', __d_name, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Visualization.visible', __d_visible, (bool,), False, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('Visualization.events', __d_events, (str,), False, True, False)
        __d_interactions: Any = __d.get('interactions')
        _guard_vector('Visualization.interactions', __d_interactions, (str,), False, True, False)
        __d_animate: Any = __d.get('animate')
        _guard_scalar('Visualization.animate', __d_animate, (bool,), False, True, False)
        plot: Plot = Plot.load(__d_plot)
        data: PackedRecord = __d_data
        width: Optional[str] = __d_width
        height: Optional[str] = __d_height
        name: Optional[str] = __d_name
        visible: Optional[bool] = __d_visible
        events: Optional[List[str]] = __d_events
        interactions: Optional[List[str]] = __d_interactions
        animate: Optional[bool] = __d_animate
        return Visualization(
            plot,
            data,
            width,
            height,
            name,
            visible,
            events,
            interactions,
            animate,
        )


_VegaVisualizationGrammar = ['vega-lite', 'vega']


class VegaVisualizationGrammar:
    VEGA_LITE = 'vega-lite'
    VEGA = 'vega'


class VegaVisualization:
    """Create a Vega-lite plot for display inside a form.
    """
    def __init__(
            self,
            specification: str,
            data: Optional[PackedRecord] = None,
            width: Optional[str] = None,
            height: Optional[str] = None,
            name: Optional[str] = None,
            visible: Optional[bool] = None,
            grammar: Optional[str] = None,
    ):
        _guard_scalar('VegaVisualization.specification', specification, (str,), False, False, False)
        _guard_scalar('VegaVisualization.width', width, (str,), False, True, False)
        _guard_scalar('VegaVisualization.height', height, (str,), False, True, False)
        _guard_scalar('VegaVisualization.name', name, (str,), False, True, False)
        _guard_scalar('VegaVisualization.visible', visible, (bool,), False, True, False)
        _guard_enum('VegaVisualization.grammar', grammar, _VegaVisualizationGrammar, True)
        self.specification = specification
        """The Vega-lite specification."""
        self.data = data
        """Data for the plot, if any."""
        self.width = width
        """The width of the visualization. Defaults to '100%'."""
        self.height = height
        """The height of the visualization. Defaults to '300px'."""
        self.name = name
        """An identifying name for this component."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.grammar = grammar
        """Vega grammar to use. Defaults to 'vega-lite'. One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaVisualizationGrammar."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('VegaVisualization.specification', self.specification, (str,), False, False, False)
        _guard_scalar('VegaVisualization.width', self.width, (str,), False, True, False)
        _guard_scalar('VegaVisualization.height', self.height, (str,), False, True, False)
        _guard_scalar('VegaVisualization.name', self.name, (str,), False, True, False)
        _guard_scalar('VegaVisualization.visible', self.visible, (bool,), False, True, False)
        _guard_enum('VegaVisualization.grammar', self.grammar, _VegaVisualizationGrammar, True)
        return _dump(
            specification=self.specification,
            data=self.data,
            width=self.width,
            height=self.height,
            name=self.name,
            visible=self.visible,
            grammar=self.grammar,
        )

    @staticmethod
    def load(__d: Dict) -> 'VegaVisualization':
        """Creates an instance of this class using the contents of a dict."""
        __d_specification: Any = __d.get('specification')
        _guard_scalar('VegaVisualization.specification', __d_specification, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_width: Any = __d.get('width')
        _guard_scalar('VegaVisualization.width', __d_width, (str,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('VegaVisualization.height', __d_height, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('VegaVisualization.name', __d_name, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('VegaVisualization.visible', __d_visible, (bool,), False, True, False)
        __d_grammar: Any = __d.get('grammar')
        _guard_enum('VegaVisualization.grammar', __d_grammar, _VegaVisualizationGrammar, True)
        specification: str = __d_specification
        data: Optional[PackedRecord] = __d_data
        width: Optional[str] = __d_width
        height: Optional[str] = __d_height
        name: Optional[str] = __d_name
        visible: Optional[bool] = __d_visible
        grammar: Optional[str] = __d_grammar
        return VegaVisualization(
            specification,
            data,
            width,
            height,
            name,
            visible,
            grammar,
        )


class Stat:
    """Create a stat (a label-value pair) for displaying a metric.
    """
    def __init__(
            self,
            label: str,
            value: Optional[str] = None,
            caption: Optional[str] = None,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Stat.label', label, (str,), False, False, False)
        _guard_scalar('Stat.value', value, (str,), False, True, False)
        _guard_scalar('Stat.caption', caption, (str,), False, True, False)
        _guard_scalar('Stat.icon', icon, (str,), False, True, False)
        _guard_scalar('Stat.icon_color', icon_color, (str,), False, True, False)
        _guard_scalar('Stat.name', name, (str,), False, True, False)
        self.label = label
        """The label for the metric."""
        self.value = value
        """The value of the metric."""
        self.caption = caption
        """The caption displayed below the primary value."""
        self.icon = icon
        """An optional icon, displayed next to the label."""
        self.icon_color = icon_color
        """The color of the icon."""
        self.name = name
        """An identifying name for this item."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Stat.label', self.label, (str,), False, False, False)
        _guard_scalar('Stat.value', self.value, (str,), False, True, False)
        _guard_scalar('Stat.caption', self.caption, (str,), False, True, False)
        _guard_scalar('Stat.icon', self.icon, (str,), False, True, False)
        _guard_scalar('Stat.icon_color', self.icon_color, (str,), False, True, False)
        _guard_scalar('Stat.name', self.name, (str,), False, True, False)
        return _dump(
            label=self.label,
            value=self.value,
            caption=self.caption,
            icon=self.icon,
            icon_color=self.icon_color,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Stat':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Stat.label', __d_label, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Stat.value', __d_value, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('Stat.caption', __d_caption, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Stat.icon', __d_icon, (str,), False, True, False)
        __d_icon_color: Any = __d.get('icon_color')
        _guard_scalar('Stat.icon_color', __d_icon_color, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Stat.name', __d_name, (str,), False, True, False)
        label: str = __d_label
        value: Optional[str] = __d_value
        caption: Optional[str] = __d_caption
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        name: Optional[str] = __d_name
        return Stat(
            label,
            value,
            caption,
            icon,
            icon_color,
            name,
        )


_StatsJustify = ['start', 'end', 'center', 'between', 'around']


class StatsJustify:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'


class Stats:
    """Create a set of stats laid out horizontally.
    """
    def __init__(
            self,
            items: List[Stat],
            justify: Optional[str] = None,
            inset: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            name: Optional[str] = None,
    ):
        _guard_vector('Stats.items', items, (Stat,), False, False, False)
        _guard_enum('Stats.justify', justify, _StatsJustify, True)
        _guard_scalar('Stats.inset', inset, (bool,), False, True, False)
        _guard_scalar('Stats.width', width, (str,), False, True, False)
        _guard_scalar('Stats.visible', visible, (bool,), False, True, False)
        _guard_scalar('Stats.name', name, (str,), False, True, False)
        self.items = items
        """The individual stats to be displayed."""
        self.justify = justify
        """Specifies how to lay out the individual stats. Defaults to 'start'. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.StatsJustify."""
        self.inset = inset
        """Whether to display the stats with a contrasting background."""
        self.width = width
        """The width of the stats, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Stats.items', self.items, (Stat,), False, False, False)
        _guard_enum('Stats.justify', self.justify, _StatsJustify, True)
        _guard_scalar('Stats.inset', self.inset, (bool,), False, True, False)
        _guard_scalar('Stats.width', self.width, (str,), False, True, False)
        _guard_scalar('Stats.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Stats.name', self.name, (str,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            justify=self.justify,
            inset=self.inset,
            width=self.width,
            visible=self.visible,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Stats':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Stats.items', __d_items, (dict,), False, False, False)
        __d_justify: Any = __d.get('justify')
        _guard_enum('Stats.justify', __d_justify, _StatsJustify, True)
        __d_inset: Any = __d.get('inset')
        _guard_scalar('Stats.inset', __d_inset, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Stats.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Stats.visible', __d_visible, (bool,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Stats.name', __d_name, (str,), False, True, False)
        items: List[Stat] = [Stat.load(__e) for __e in __d_items]
        justify: Optional[str] = __d_justify
        inset: Optional[bool] = __d_inset
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        name: Optional[str] = __d_name
        return Stats(
            items,
            justify,
            inset,
            width,
            visible,
            name,
        )


_InlineJustify = ['start', 'end', 'center', 'between', 'around']


class InlineJustify:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'


_InlineAlign = ['start', 'end', 'center', 'baseline']


class InlineAlign:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BASELINE = 'baseline'


_InlineDirection = ['row', 'column']


class InlineDirection:
    ROW = 'row'
    COLUMN = 'column'


class Inline:
    """Create an inline (horizontal) list of components.
    """
    def __init__(
            self,
            items: List['Component'],
            justify: Optional[str] = None,
            align: Optional[str] = None,
            inset: Optional[bool] = None,
            height: Optional[str] = None,
            direction: Optional[str] = None,
    ):
        _guard_vector('Inline.items', items, (Component,), False, False, False)
        _guard_enum('Inline.justify', justify, _InlineJustify, True)
        _guard_enum('Inline.align', align, _InlineAlign, True)
        _guard_scalar('Inline.inset', inset, (bool,), False, True, False)
        _guard_scalar('Inline.height', height, (str,), False, True, False)
        _guard_enum('Inline.direction', direction, _InlineDirection, True)
        self.items = items
        """The components laid out inline."""
        self.justify = justify
        """Specifies how to lay out the individual components. Defaults to 'start'. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.InlineJustify."""
        self.align = align
        """Specifies how the individual components are aligned on the vertical axis. Defaults to 'center'. One of 'start', 'end', 'center', 'baseline'. See enum h2o_wave.ui.InlineAlign."""
        self.inset = inset
        """Whether to display the components inset from the parent form, with a contrasting background."""
        self.height = height
        """Height of the inline container. Accepts any valid CSS unit e.g. '100vh', '300px'. Use '1' to fill the remaining card space."""
        self.direction = direction
        """Container direction. Defaults to 'row'. One of 'row', 'column'. See enum h2o_wave.ui.InlineDirection."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Inline.items', self.items, (Component,), False, False, False)
        _guard_enum('Inline.justify', self.justify, _InlineJustify, True)
        _guard_enum('Inline.align', self.align, _InlineAlign, True)
        _guard_scalar('Inline.inset', self.inset, (bool,), False, True, False)
        _guard_scalar('Inline.height', self.height, (str,), False, True, False)
        _guard_enum('Inline.direction', self.direction, _InlineDirection, True)
        return _dump(
            items=[__e.dump() for __e in self.items],
            justify=self.justify,
            align=self.align,
            inset=self.inset,
            height=self.height,
            direction=self.direction,
        )

    @staticmethod
    def load(__d: Dict) -> 'Inline':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Inline.items', __d_items, (dict,), False, False, False)
        __d_justify: Any = __d.get('justify')
        _guard_enum('Inline.justify', __d_justify, _InlineJustify, True)
        __d_align: Any = __d.get('align')
        _guard_enum('Inline.align', __d_align, _InlineAlign, True)
        __d_inset: Any = __d.get('inset')
        _guard_scalar('Inline.inset', __d_inset, (bool,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Inline.height', __d_height, (str,), False, True, False)
        __d_direction: Any = __d.get('direction')
        _guard_enum('Inline.direction', __d_direction, _InlineDirection, True)
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        justify: Optional[str] = __d_justify
        align: Optional[str] = __d_align
        inset: Optional[bool] = __d_inset
        height: Optional[str] = __d_height
        direction: Optional[str] = __d_direction
        return Inline(
            items,
            justify,
            align,
            inset,
            height,
            direction,
        )


class Image:
    """Create an image.
    """
    def __init__(
            self,
            title: str,
            type: Optional[str] = None,
            image: Optional[str] = None,
            path: Optional[str] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            path_popup: Optional[str] = None,
    ):
        _guard_scalar('Image.title', title, (str,), False, False, False)
        _guard_scalar('Image.type', type, (str,), False, True, False)
        _guard_scalar('Image.image', image, (str,), False, True, False)
        _guard_scalar('Image.path', path, (str,), False, True, False)
        _guard_scalar('Image.width', width, (str,), False, True, False)
        _guard_scalar('Image.visible', visible, (bool,), False, True, False)
        _guard_scalar('Image.path_popup', path_popup, (str,), False, True, False)
        self.title = title
        """The image title, typically displayed as a tooltip."""
        self.type = type
        """The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. Required only if `image` is set."""
        self.image = image
        """Image data, base64-encoded."""
        self.path = path
        """The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`."""
        self.width = width
        """The width of the image, e.g. '100px'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.path_popup = path_popup
        """The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Image.title', self.title, (str,), False, False, False)
        _guard_scalar('Image.type', self.type, (str,), False, True, False)
        _guard_scalar('Image.image', self.image, (str,), False, True, False)
        _guard_scalar('Image.path', self.path, (str,), False, True, False)
        _guard_scalar('Image.width', self.width, (str,), False, True, False)
        _guard_scalar('Image.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('Image.path_popup', self.path_popup, (str,), False, True, False)
        return _dump(
            title=self.title,
            type=self.type,
            image=self.image,
            path=self.path,
            width=self.width,
            visible=self.visible,
            path_popup=self.path_popup,
        )

    @staticmethod
    def load(__d: Dict) -> 'Image':
        """Creates an instance of this class using the contents of a dict."""
        __d_title: Any = __d.get('title')
        _guard_scalar('Image.title', __d_title, (str,), False, False, False)
        __d_type: Any = __d.get('type')
        _guard_scalar('Image.type', __d_type, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('Image.image', __d_image, (str,), False, True, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('Image.path', __d_path, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Image.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('Image.visible', __d_visible, (bool,), False, True, False)
        __d_path_popup: Any = __d.get('path_popup')
        _guard_scalar('Image.path_popup', __d_path_popup, (str,), False, True, False)
        title: str = __d_title
        type: Optional[str] = __d_type
        image: Optional[str] = __d_image
        path: Optional[str] = __d_path
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        path_popup: Optional[str] = __d_path_popup
        return Image(
            title,
            type,
            image,
            path,
            width,
            visible,
            path_popup,
        )


_PersonaSize = ['xl', 'l', 'm', 's', 'xs']


class PersonaSize:
    XL = 'xl'
    L = 'l'
    M = 'm'
    S = 's'
    XS = 'xs'


class Persona:
    """Create an individual's persona or avatar, a visual representation of a person across products.
    Can be used to display an individual's avatar (or a composition of the person’s initials on a background color), their name or identification, and online status.
    """
    def __init__(
            self,
            title: str,
            subtitle: Optional[str] = None,
            caption: Optional[str] = None,
            size: Optional[str] = None,
            image: Optional[str] = None,
            initials: Optional[str] = None,
            initials_color: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Persona.title', title, (str,), False, False, False)
        _guard_scalar('Persona.subtitle', subtitle, (str,), False, True, False)
        _guard_scalar('Persona.caption', caption, (str,), False, True, False)
        _guard_enum('Persona.size', size, _PersonaSize, True)
        _guard_scalar('Persona.image', image, (str,), False, True, False)
        _guard_scalar('Persona.initials', initials, (str,), False, True, False)
        _guard_scalar('Persona.initials_color', initials_color, (str,), False, True, False)
        _guard_scalar('Persona.name', name, (str,), True, True, False)
        self.title = title
        """Primary text, displayed next to the persona coin."""
        self.subtitle = subtitle
        """Secondary text, displayed under the title."""
        self.caption = caption
        """Tertiary text, displayed under the subtitle. Only visible for sizes >= 'm'."""
        self.size = size
        """The size of the persona coin. Defaults to 'm'. One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.PersonaSize."""
        self.image = image
        """Image, URL or base64-encoded (`data:image/png;base64,???`)."""
        self.initials = initials
        """Initials, if `image` is not specified."""
        self.initials_color = initials_color
        """Initials background color (CSS-compatible string)."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Persona.title', self.title, (str,), False, False, False)
        _guard_scalar('Persona.subtitle', self.subtitle, (str,), False, True, False)
        _guard_scalar('Persona.caption', self.caption, (str,), False, True, False)
        _guard_enum('Persona.size', self.size, _PersonaSize, True)
        _guard_scalar('Persona.image', self.image, (str,), False, True, False)
        _guard_scalar('Persona.initials', self.initials, (str,), False, True, False)
        _guard_scalar('Persona.initials_color', self.initials_color, (str,), False, True, False)
        _guard_scalar('Persona.name', self.name, (str,), True, True, False)
        return _dump(
            title=self.title,
            subtitle=self.subtitle,
            caption=self.caption,
            size=self.size,
            image=self.image,
            initials=self.initials,
            initials_color=self.initials_color,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Persona':
        """Creates an instance of this class using the contents of a dict."""
        __d_title: Any = __d.get('title')
        _guard_scalar('Persona.title', __d_title, (str,), False, False, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('Persona.subtitle', __d_subtitle, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('Persona.caption', __d_caption, (str,), False, True, False)
        __d_size: Any = __d.get('size')
        _guard_enum('Persona.size', __d_size, _PersonaSize, True)
        __d_image: Any = __d.get('image')
        _guard_scalar('Persona.image', __d_image, (str,), False, True, False)
        __d_initials: Any = __d.get('initials')
        _guard_scalar('Persona.initials', __d_initials, (str,), False, True, False)
        __d_initials_color: Any = __d.get('initials_color')
        _guard_scalar('Persona.initials_color', __d_initials_color, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Persona.name', __d_name, (str,), True, True, False)
        title: str = __d_title
        subtitle: Optional[str] = __d_subtitle
        caption: Optional[str] = __d_caption
        size: Optional[str] = __d_size
        image: Optional[str] = __d_image
        initials: Optional[str] = __d_initials
        initials_color: Optional[str] = __d_initials_color
        name: Optional[str] = __d_name
        return Persona(
            title,
            subtitle,
            caption,
            size,
            image,
            initials,
            initials_color,
            name,
        )


class TextAnnotatorTag:
    """Create a tag.
    """
    def __init__(
            self,
            name: str,
            label: str,
            color: str,
    ):
        _guard_scalar('TextAnnotatorTag.name', name, (str,), True, False, False)
        _guard_scalar('TextAnnotatorTag.label', label, (str,), False, False, False)
        _guard_scalar('TextAnnotatorTag.color', color, (str,), False, False, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed for this tag."""
        self.color = color
        """HEX or RGB color string used as background for highlighted phrases."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextAnnotatorTag.name', self.name, (str,), True, False, False)
        _guard_scalar('TextAnnotatorTag.label', self.label, (str,), False, False, False)
        _guard_scalar('TextAnnotatorTag.color', self.color, (str,), False, False, False)
        return _dump(
            name=self.name,
            label=self.label,
            color=self.color,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextAnnotatorTag':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TextAnnotatorTag.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('TextAnnotatorTag.label', __d_label, (str,), False, False, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('TextAnnotatorTag.color', __d_color, (str,), False, False, False)
        name: str = __d_name
        label: str = __d_label
        color: str = __d_color
        return TextAnnotatorTag(
            name,
            label,
            color,
        )


class TextAnnotatorItem:
    """Create an annotator item with initial selected tags or no tag for plaintext.
    """
    def __init__(
            self,
            text: str,
            tag: Optional[str] = None,
    ):
        _guard_scalar('TextAnnotatorItem.text', text, (str,), False, False, False)
        _guard_scalar('TextAnnotatorItem.tag', tag, (str,), False, True, False)
        self.text = text
        """Text to be highlighted."""
        self.tag = tag
        """The `name` of the text annotator tag to refer to for the `label` and `color` of this item."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextAnnotatorItem.text', self.text, (str,), False, False, False)
        _guard_scalar('TextAnnotatorItem.tag', self.tag, (str,), False, True, False)
        return _dump(
            text=self.text,
            tag=self.tag,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextAnnotatorItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_text: Any = __d.get('text')
        _guard_scalar('TextAnnotatorItem.text', __d_text, (str,), False, False, False)
        __d_tag: Any = __d.get('tag')
        _guard_scalar('TextAnnotatorItem.tag', __d_tag, (str,), False, True, False)
        text: str = __d_text
        tag: Optional[str] = __d_tag
        return TextAnnotatorItem(
            text,
            tag,
        )


class TextAnnotator:
    """Create a text annotator component.

    The text annotator component enables user to manually annotate parts of text. Useful for NLP data prep.
    """
    def __init__(
            self,
            name: str,
            title: str,
            tags: List[TextAnnotatorTag],
            items: List[TextAnnotatorItem],
            trigger: Optional[bool] = None,
            readonly: Optional[bool] = None,
    ):
        _guard_scalar('TextAnnotator.name', name, (str,), True, False, False)
        _guard_scalar('TextAnnotator.title', title, (str,), False, False, False)
        _guard_vector('TextAnnotator.tags', tags, (TextAnnotatorTag,), False, False, False)
        _guard_vector('TextAnnotator.items', items, (TextAnnotatorItem,), False, False, False)
        _guard_scalar('TextAnnotator.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('TextAnnotator.readonly', readonly, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.title = title
        """The text annotator's title."""
        self.tags = tags
        """List of tags the user can annotate with."""
        self.items = items
        """Pretagged parts of text content."""
        self.trigger = trigger
        """True if the form should be submitted when the annotator value changes."""
        self.readonly = readonly
        """True to prevent user interaction with the annotator component. Defaults to False."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TextAnnotator.name', self.name, (str,), True, False, False)
        _guard_scalar('TextAnnotator.title', self.title, (str,), False, False, False)
        _guard_vector('TextAnnotator.tags', self.tags, (TextAnnotatorTag,), False, False, False)
        _guard_vector('TextAnnotator.items', self.items, (TextAnnotatorItem,), False, False, False)
        _guard_scalar('TextAnnotator.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('TextAnnotator.readonly', self.readonly, (bool,), False, True, False)
        return _dump(
            name=self.name,
            title=self.title,
            tags=[__e.dump() for __e in self.tags],
            items=[__e.dump() for __e in self.items],
            trigger=self.trigger,
            readonly=self.readonly,
        )

    @staticmethod
    def load(__d: Dict) -> 'TextAnnotator':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TextAnnotator.name', __d_name, (str,), True, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TextAnnotator.title', __d_title, (str,), False, False, False)
        __d_tags: Any = __d.get('tags')
        _guard_vector('TextAnnotator.tags', __d_tags, (dict,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('TextAnnotator.items', __d_items, (dict,), False, False, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('TextAnnotator.trigger', __d_trigger, (bool,), False, True, False)
        __d_readonly: Any = __d.get('readonly')
        _guard_scalar('TextAnnotator.readonly', __d_readonly, (bool,), False, True, False)
        name: str = __d_name
        title: str = __d_title
        tags: List[TextAnnotatorTag] = [TextAnnotatorTag.load(__e) for __e in __d_tags]
        items: List[TextAnnotatorItem] = [TextAnnotatorItem.load(__e) for __e in __d_items]
        trigger: Optional[bool] = __d_trigger
        readonly: Optional[bool] = __d_readonly
        return TextAnnotator(
            name,
            title,
            tags,
            items,
            trigger,
            readonly,
        )


class ImageAnnotatorTag:
    """Create a unique tag type for use in an image annotator.
    """
    def __init__(
            self,
            name: str,
            label: str,
            color: str,
    ):
        _guard_scalar('ImageAnnotatorTag.name', name, (str,), True, False, False)
        _guard_scalar('ImageAnnotatorTag.label', label, (str,), False, False, False)
        _guard_scalar('ImageAnnotatorTag.color', color, (str,), False, False, False)
        self.name = name
        """An identifying name for this tag."""
        self.label = label
        """Text to be displayed for the annotation."""
        self.color = color
        """Hex or RGB color string to be used as the background color."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotatorTag.name', self.name, (str,), True, False, False)
        _guard_scalar('ImageAnnotatorTag.label', self.label, (str,), False, False, False)
        _guard_scalar('ImageAnnotatorTag.color', self.color, (str,), False, False, False)
        return _dump(
            name=self.name,
            label=self.label,
            color=self.color,
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorTag':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('ImageAnnotatorTag.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('ImageAnnotatorTag.label', __d_label, (str,), False, False, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('ImageAnnotatorTag.color', __d_color, (str,), False, False, False)
        name: str = __d_name
        label: str = __d_label
        color: str = __d_color
        return ImageAnnotatorTag(
            name,
            label,
            color,
        )


class ImageAnnotatorRect:
    """Create a rectangular annotation shape.
    """
    def __init__(
            self,
            x1: float,
            y1: float,
            x2: float,
            y2: float,
    ):
        _guard_scalar('ImageAnnotatorRect.x1', x1, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.y1', y1, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.x2', x2, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.y2', y2, (float, int,), False, False, False)
        self.x1 = x1
        """`x` coordinate of the rectangle's corner."""
        self.y1 = y1
        """`y` coordinate of the rectangle's corner."""
        self.x2 = x2
        """`x` coordinate of the diagonally opposite corner."""
        self.y2 = y2
        """`y` coordinate of the diagonally opposite corner."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotatorRect.x1', self.x1, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.y1', self.y1, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.x2', self.x2, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorRect.y2', self.y2, (float, int,), False, False, False)
        return _dump(
            x1=self.x1,
            y1=self.y1,
            x2=self.x2,
            y2=self.y2,
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorRect':
        """Creates an instance of this class using the contents of a dict."""
        __d_x1: Any = __d.get('x1')
        _guard_scalar('ImageAnnotatorRect.x1', __d_x1, (float, int,), False, False, False)
        __d_y1: Any = __d.get('y1')
        _guard_scalar('ImageAnnotatorRect.y1', __d_y1, (float, int,), False, False, False)
        __d_x2: Any = __d.get('x2')
        _guard_scalar('ImageAnnotatorRect.x2', __d_x2, (float, int,), False, False, False)
        __d_y2: Any = __d.get('y2')
        _guard_scalar('ImageAnnotatorRect.y2', __d_y2, (float, int,), False, False, False)
        x1: float = __d_x1
        y1: float = __d_y1
        x2: float = __d_x2
        y2: float = __d_y2
        return ImageAnnotatorRect(
            x1,
            y1,
            x2,
            y2,
        )


class ImageAnnotatorPoint:
    """Create a polygon annotation point with x and y coordinates..
    """
    def __init__(
            self,
            x: float,
            y: float,
    ):
        _guard_scalar('ImageAnnotatorPoint.x', x, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorPoint.y', y, (float, int,), False, False, False)
        self.x = x
        """`x` coordinate of the point."""
        self.y = y
        """`y` coordinate of the point."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotatorPoint.x', self.x, (float, int,), False, False, False)
        _guard_scalar('ImageAnnotatorPoint.y', self.y, (float, int,), False, False, False)
        return _dump(
            x=self.x,
            y=self.y,
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorPoint':
        """Creates an instance of this class using the contents of a dict."""
        __d_x: Any = __d.get('x')
        _guard_scalar('ImageAnnotatorPoint.x', __d_x, (float, int,), False, False, False)
        __d_y: Any = __d.get('y')
        _guard_scalar('ImageAnnotatorPoint.y', __d_y, (float, int,), False, False, False)
        x: float = __d_x
        y: float = __d_y
        return ImageAnnotatorPoint(
            x,
            y,
        )


class ImageAnnotatorPolygon:
    """Create a polygon annotation shape.
    """
    def __init__(
            self,
            vertices: List[ImageAnnotatorPoint],
    ):
        _guard_vector('ImageAnnotatorPolygon.vertices', vertices, (ImageAnnotatorPoint,), False, False, False)
        self.vertices = vertices
        """List of polygon points."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('ImageAnnotatorPolygon.vertices', self.vertices, (ImageAnnotatorPoint,), False, False, False)
        return _dump(
            vertices=[__e.dump() for __e in self.vertices],
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorPolygon':
        """Creates an instance of this class using the contents of a dict."""
        __d_vertices: Any = __d.get('vertices')
        _guard_vector('ImageAnnotatorPolygon.vertices', __d_vertices, (dict,), False, False, False)
        vertices: List[ImageAnnotatorPoint] = [ImageAnnotatorPoint.load(__e) for __e in __d_vertices]
        return ImageAnnotatorPolygon(
            vertices,
        )


class ImageAnnotatorShape:
    """Create a shape to be rendered as an annotation on an image annotator.
    """
    def __init__(
            self,
            rect: Optional[ImageAnnotatorRect] = None,
            polygon: Optional[ImageAnnotatorPolygon] = None,
    ):
        _guard_scalar('ImageAnnotatorShape.rect', rect, (ImageAnnotatorRect,), False, True, False)
        _guard_scalar('ImageAnnotatorShape.polygon', polygon, (ImageAnnotatorPolygon,), False, True, False)
        self.rect = rect
        """No documentation available."""
        self.polygon = polygon
        """No documentation available."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotatorShape.rect', self.rect, (ImageAnnotatorRect,), False, True, False)
        _guard_scalar('ImageAnnotatorShape.polygon', self.polygon, (ImageAnnotatorPolygon,), False, True, False)
        return _dump(
            rect=None if self.rect is None else self.rect.dump(),
            polygon=None if self.polygon is None else self.polygon.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorShape':
        """Creates an instance of this class using the contents of a dict."""
        __d_rect: Any = __d.get('rect')
        _guard_scalar('ImageAnnotatorShape.rect', __d_rect, (dict,), False, True, False)
        __d_polygon: Any = __d.get('polygon')
        _guard_scalar('ImageAnnotatorShape.polygon', __d_polygon, (dict,), False, True, False)
        rect: Optional[ImageAnnotatorRect] = None if __d_rect is None else ImageAnnotatorRect.load(__d_rect)
        polygon: Optional[ImageAnnotatorPolygon] = None if __d_polygon is None else ImageAnnotatorPolygon.load(__d_polygon)
        return ImageAnnotatorShape(
            rect,
            polygon,
        )


class ImageAnnotatorItem:
    """Create an annotator item with initial selected tags or no tag for plaintext.
    """
    def __init__(
            self,
            shape: ImageAnnotatorShape,
            tag: str,
    ):
        _guard_scalar('ImageAnnotatorItem.shape', shape, (ImageAnnotatorShape,), False, False, False)
        _guard_scalar('ImageAnnotatorItem.tag', tag, (str,), False, False, False)
        self.shape = shape
        """The annotation shape."""
        self.tag = tag
        """The `name` of the image annotator tag to refer to for the `label` and `color` of this item."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotatorItem.shape', self.shape, (ImageAnnotatorShape,), False, False, False)
        _guard_scalar('ImageAnnotatorItem.tag', self.tag, (str,), False, False, False)
        return _dump(
            shape=self.shape.dump(),
            tag=self.tag,
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotatorItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_shape: Any = __d.get('shape')
        _guard_scalar('ImageAnnotatorItem.shape', __d_shape, (dict,), False, False, False)
        __d_tag: Any = __d.get('tag')
        _guard_scalar('ImageAnnotatorItem.tag', __d_tag, (str,), False, False, False)
        shape: ImageAnnotatorShape = ImageAnnotatorShape.load(__d_shape)
        tag: str = __d_tag
        return ImageAnnotatorItem(
            shape,
            tag,
        )


class ImageAnnotator:
    """Create an image annotator component.

    This component allows annotating and labeling parts of an image by drawing shapes with a pointing device.
    """
    def __init__(
            self,
            name: str,
            image: str,
            title: str,
            tags: List[ImageAnnotatorTag],
            items: Optional[List[ImageAnnotatorItem]] = None,
            trigger: Optional[bool] = None,
            image_height: Optional[str] = None,
            allowed_shapes: Optional[List[str]] = None,
            events: Optional[List[str]] = None,
    ):
        _guard_scalar('ImageAnnotator.name', name, (str,), True, False, False)
        _guard_scalar('ImageAnnotator.image', image, (str,), False, False, False)
        _guard_scalar('ImageAnnotator.title', title, (str,), False, False, False)
        _guard_vector('ImageAnnotator.tags', tags, (ImageAnnotatorTag,), False, False, False)
        _guard_vector('ImageAnnotator.items', items, (ImageAnnotatorItem,), False, True, False)
        _guard_scalar('ImageAnnotator.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('ImageAnnotator.image_height', image_height, (str,), False, True, False)
        _guard_vector('ImageAnnotator.allowed_shapes', allowed_shapes, (str,), False, True, False)
        _guard_vector('ImageAnnotator.events', events, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.image = image
        """The path or URL of the image to be presented for annotation."""
        self.title = title
        """The image annotator's title."""
        self.tags = tags
        """The master list of tags that can be used for annotations."""
        self.items = items
        """Annotations to display on the image, if any."""
        self.trigger = trigger
        """True if the form should be submitted as soon as an annotation is drawn."""
        self.image_height = image_height
        """The card’s image height. The actual image size is used by default."""
        self.allowed_shapes = allowed_shapes
        """List of allowed shapes. Available values are 'rect' and 'polygon'. If not set, all shapes are available by default."""
        self.events = events
        """The events to capture on this image annotator. One of `click` | `tool_change`."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageAnnotator.name', self.name, (str,), True, False, False)
        _guard_scalar('ImageAnnotator.image', self.image, (str,), False, False, False)
        _guard_scalar('ImageAnnotator.title', self.title, (str,), False, False, False)
        _guard_vector('ImageAnnotator.tags', self.tags, (ImageAnnotatorTag,), False, False, False)
        _guard_vector('ImageAnnotator.items', self.items, (ImageAnnotatorItem,), False, True, False)
        _guard_scalar('ImageAnnotator.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('ImageAnnotator.image_height', self.image_height, (str,), False, True, False)
        _guard_vector('ImageAnnotator.allowed_shapes', self.allowed_shapes, (str,), False, True, False)
        _guard_vector('ImageAnnotator.events', self.events, (str,), False, True, False)
        return _dump(
            name=self.name,
            image=self.image,
            title=self.title,
            tags=[__e.dump() for __e in self.tags],
            items=None if self.items is None else [__e.dump() for __e in self.items],
            trigger=self.trigger,
            image_height=self.image_height,
            allowed_shapes=self.allowed_shapes,
            events=self.events,
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageAnnotator':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('ImageAnnotator.name', __d_name, (str,), True, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('ImageAnnotator.image', __d_image, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ImageAnnotator.title', __d_title, (str,), False, False, False)
        __d_tags: Any = __d.get('tags')
        _guard_vector('ImageAnnotator.tags', __d_tags, (dict,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('ImageAnnotator.items', __d_items, (dict,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('ImageAnnotator.trigger', __d_trigger, (bool,), False, True, False)
        __d_image_height: Any = __d.get('image_height')
        _guard_scalar('ImageAnnotator.image_height', __d_image_height, (str,), False, True, False)
        __d_allowed_shapes: Any = __d.get('allowed_shapes')
        _guard_vector('ImageAnnotator.allowed_shapes', __d_allowed_shapes, (str,), False, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('ImageAnnotator.events', __d_events, (str,), False, True, False)
        name: str = __d_name
        image: str = __d_image
        title: str = __d_title
        tags: List[ImageAnnotatorTag] = [ImageAnnotatorTag.load(__e) for __e in __d_tags]
        items: Optional[List[ImageAnnotatorItem]] = None if __d_items is None else [ImageAnnotatorItem.load(__e) for __e in __d_items]
        trigger: Optional[bool] = __d_trigger
        image_height: Optional[str] = __d_image_height
        allowed_shapes: Optional[List[str]] = __d_allowed_shapes
        events: Optional[List[str]] = __d_events
        return ImageAnnotator(
            name,
            image,
            title,
            tags,
            items,
            trigger,
            image_height,
            allowed_shapes,
            events,
        )


class AudioAnnotatorTag:
    """Create a unique tag type for use in an audio annotator.
    """
    def __init__(
            self,
            name: str,
            label: str,
            color: str,
    ):
        _guard_scalar('AudioAnnotatorTag.name', name, (str,), True, False, False)
        _guard_scalar('AudioAnnotatorTag.label', label, (str,), False, False, False)
        _guard_scalar('AudioAnnotatorTag.color', color, (str,), False, False, False)
        self.name = name
        """An identifying name for this tag."""
        self.label = label
        """Text to be displayed for the annotation."""
        self.color = color
        """Hex or RGB color string to be used as the background color."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('AudioAnnotatorTag.name', self.name, (str,), True, False, False)
        _guard_scalar('AudioAnnotatorTag.label', self.label, (str,), False, False, False)
        _guard_scalar('AudioAnnotatorTag.color', self.color, (str,), False, False, False)
        return _dump(
            name=self.name,
            label=self.label,
            color=self.color,
        )

    @staticmethod
    def load(__d: Dict) -> 'AudioAnnotatorTag':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('AudioAnnotatorTag.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('AudioAnnotatorTag.label', __d_label, (str,), False, False, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('AudioAnnotatorTag.color', __d_color, (str,), False, False, False)
        name: str = __d_name
        label: str = __d_label
        color: str = __d_color
        return AudioAnnotatorTag(
            name,
            label,
            color,
        )


class AudioAnnotatorItem:
    """Create an annotator item with initial selected tags or no tags.
    """
    def __init__(
            self,
            start: float,
            end: float,
            tag: str,
    ):
        _guard_scalar('AudioAnnotatorItem.start', start, (float, int,), False, False, False)
        _guard_scalar('AudioAnnotatorItem.end', end, (float, int,), False, False, False)
        _guard_scalar('AudioAnnotatorItem.tag', tag, (str,), False, False, False)
        self.start = start
        """The start of the audio annotation in seconds."""
        self.end = end
        """The end of the audio annotation in seconds."""
        self.tag = tag
        """The `name` of the audio annotator tag to refer to for the `label` and `color` of this item."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('AudioAnnotatorItem.start', self.start, (float, int,), False, False, False)
        _guard_scalar('AudioAnnotatorItem.end', self.end, (float, int,), False, False, False)
        _guard_scalar('AudioAnnotatorItem.tag', self.tag, (str,), False, False, False)
        return _dump(
            start=self.start,
            end=self.end,
            tag=self.tag,
        )

    @staticmethod
    def load(__d: Dict) -> 'AudioAnnotatorItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_start: Any = __d.get('start')
        _guard_scalar('AudioAnnotatorItem.start', __d_start, (float, int,), False, False, False)
        __d_end: Any = __d.get('end')
        _guard_scalar('AudioAnnotatorItem.end', __d_end, (float, int,), False, False, False)
        __d_tag: Any = __d.get('tag')
        _guard_scalar('AudioAnnotatorItem.tag', __d_tag, (str,), False, False, False)
        start: float = __d_start
        end: float = __d_end
        tag: str = __d_tag
        return AudioAnnotatorItem(
            start,
            end,
            tag,
        )


class AudioAnnotator:
    """Create an audio annotator component.

    This component allows annotating and labeling parts of audio file.
    """
    def __init__(
            self,
            name: str,
            title: str,
            path: str,
            tags: List[AudioAnnotatorTag],
            items: Optional[List[AudioAnnotatorItem]] = None,
            trigger: Optional[bool] = None,
    ):
        _guard_scalar('AudioAnnotator.name', name, (str,), True, False, False)
        _guard_scalar('AudioAnnotator.title', title, (str,), False, False, False)
        _guard_scalar('AudioAnnotator.path', path, (str,), False, False, False)
        _guard_vector('AudioAnnotator.tags', tags, (AudioAnnotatorTag,), False, False, False)
        _guard_vector('AudioAnnotator.items', items, (AudioAnnotatorItem,), False, True, False)
        _guard_scalar('AudioAnnotator.trigger', trigger, (bool,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.title = title
        """The audio annotator's title."""
        self.path = path
        """The path to the audio file. Use mp3 or wav formats to achieve the best cross-browser support. See https://caniuse.com/?search=audio%20format for other formats."""
        self.tags = tags
        """The master list of tags that can be used for annotations."""
        self.items = items
        """Annotations to display on the image, if any."""
        self.trigger = trigger
        """True if the form should be submitted as soon as an annotation is made."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('AudioAnnotator.name', self.name, (str,), True, False, False)
        _guard_scalar('AudioAnnotator.title', self.title, (str,), False, False, False)
        _guard_scalar('AudioAnnotator.path', self.path, (str,), False, False, False)
        _guard_vector('AudioAnnotator.tags', self.tags, (AudioAnnotatorTag,), False, False, False)
        _guard_vector('AudioAnnotator.items', self.items, (AudioAnnotatorItem,), False, True, False)
        _guard_scalar('AudioAnnotator.trigger', self.trigger, (bool,), False, True, False)
        return _dump(
            name=self.name,
            title=self.title,
            path=self.path,
            tags=[__e.dump() for __e in self.tags],
            items=None if self.items is None else [__e.dump() for __e in self.items],
            trigger=self.trigger,
        )

    @staticmethod
    def load(__d: Dict) -> 'AudioAnnotator':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('AudioAnnotator.name', __d_name, (str,), True, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('AudioAnnotator.title', __d_title, (str,), False, False, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('AudioAnnotator.path', __d_path, (str,), False, False, False)
        __d_tags: Any = __d.get('tags')
        _guard_vector('AudioAnnotator.tags', __d_tags, (dict,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('AudioAnnotator.items', __d_items, (dict,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('AudioAnnotator.trigger', __d_trigger, (bool,), False, True, False)
        name: str = __d_name
        title: str = __d_title
        path: str = __d_path
        tags: List[AudioAnnotatorTag] = [AudioAnnotatorTag.load(__e) for __e in __d_tags]
        items: Optional[List[AudioAnnotatorItem]] = None if __d_items is None else [AudioAnnotatorItem.load(__e) for __e in __d_items]
        trigger: Optional[bool] = __d_trigger
        return AudioAnnotator(
            name,
            title,
            path,
            tags,
            items,
            trigger,
        )


class Facepile:
    """A face pile displays a list of personas. Each circle represents a person and contains their image or initials.
    Often this control is used when sharing who has access to a specific view or file.
    """
    def __init__(
            self,
            items: List['Component'],
            name: Optional[str] = None,
            max: Optional[int] = None,
            value: Optional[str] = None,
    ):
        _guard_vector('Facepile.items', items, (Component,), False, False, False)
        _guard_scalar('Facepile.name', name, (str,), True, True, False)
        _guard_scalar('Facepile.max', max, (int,), False, True, False)
        _guard_scalar('Facepile.value', value, (str,), False, True, False)
        self.items = items
        """List of personas to be displayed."""
        self.name = name
        """An identifying name for this component. If specified `Add button` will be rendered."""
        self.max = max
        """Maximum number of personas to be displayed."""
        self.value = value
        """A value for the facepile. If a value is set, it is used for the button's submitted instead of a boolean True."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Facepile.items', self.items, (Component,), False, False, False)
        _guard_scalar('Facepile.name', self.name, (str,), True, True, False)
        _guard_scalar('Facepile.max', self.max, (int,), False, True, False)
        _guard_scalar('Facepile.value', self.value, (str,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            name=self.name,
            max=self.max,
            value=self.value,
        )

    @staticmethod
    def load(__d: Dict) -> 'Facepile':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Facepile.items', __d_items, (dict,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Facepile.name', __d_name, (str,), True, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('Facepile.max', __d_max, (int,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Facepile.value', __d_value, (str,), False, True, False)
        items: List['Component'] = [Component.load(__e) for __e in __d_items]
        name: Optional[str] = __d_name
        max: Optional[int] = __d_max
        value: Optional[str] = __d_value
        return Facepile(
            items,
            name,
            max,
            value,
        )


class CopyableText:
    """Create a copyable text component.
    Use this component when you want to enable your users to quickly copy paste sections of text.
    """
    def __init__(
            self,
            value: str,
            label: str,
            name: Optional[str] = None,
            multiline: Optional[bool] = None,
            height: Optional[str] = None,
            width: Optional[str] = None,
    ):
        _guard_scalar('CopyableText.value', value, (str,), False, False, False)
        _guard_scalar('CopyableText.label', label, (str,), False, False, False)
        _guard_scalar('CopyableText.name', name, (str,), False, True, False)
        _guard_scalar('CopyableText.multiline', multiline, (bool,), False, True, False)
        _guard_scalar('CopyableText.height', height, (str,), False, True, False)
        _guard_scalar('CopyableText.width', width, (str,), False, True, False)
        self.value = value
        """Text to be displayed inside the component."""
        self.label = label
        """The text displayed above the textbox."""
        self.name = name
        """An identifying name for this component."""
        self.multiline = multiline
        """True if the component should allow multi-line text entry."""
        self.height = height
        """Custom height in px (e.g. '200px') or '1' to fill the remaining card space. Requires `multiline` to be set."""
        self.width = width
        """The width of the copyable text , e.g. '100px'."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('CopyableText.value', self.value, (str,), False, False, False)
        _guard_scalar('CopyableText.label', self.label, (str,), False, False, False)
        _guard_scalar('CopyableText.name', self.name, (str,), False, True, False)
        _guard_scalar('CopyableText.multiline', self.multiline, (bool,), False, True, False)
        _guard_scalar('CopyableText.height', self.height, (str,), False, True, False)
        _guard_scalar('CopyableText.width', self.width, (str,), False, True, False)
        return _dump(
            value=self.value,
            label=self.label,
            name=self.name,
            multiline=self.multiline,
            height=self.height,
            width=self.width,
        )

    @staticmethod
    def load(__d: Dict) -> 'CopyableText':
        """Creates an instance of this class using the contents of a dict."""
        __d_value: Any = __d.get('value')
        _guard_scalar('CopyableText.value', __d_value, (str,), False, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('CopyableText.label', __d_label, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('CopyableText.name', __d_name, (str,), False, True, False)
        __d_multiline: Any = __d.get('multiline')
        _guard_scalar('CopyableText.multiline', __d_multiline, (bool,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('CopyableText.height', __d_height, (str,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('CopyableText.width', __d_width, (str,), False, True, False)
        value: str = __d_value
        label: str = __d_label
        name: Optional[str] = __d_name
        multiline: Optional[bool] = __d_multiline
        height: Optional[str] = __d_height
        width: Optional[str] = __d_width
        return CopyableText(
            value,
            label,
            name,
            multiline,
            height,
            width,
        )


class Menu:
    """Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.
    """
    def __init__(
            self,
            items: List[Command],
            icon: Optional[str] = None,
            image: Optional[str] = None,
            name: Optional[str] = None,
            label: Optional[str] = None,
    ):
        _guard_vector('Menu.items', items, (Command,), False, False, False)
        _guard_scalar('Menu.icon', icon, (str,), False, True, False)
        _guard_scalar('Menu.image', image, (str,), False, True, False)
        _guard_scalar('Menu.name', name, (str,), True, True, False)
        _guard_scalar('Menu.label', label, (str,), False, True, False)
        self.items = items
        """Commands to render."""
        self.icon = icon
        """The card's icon."""
        self.image = image
        """The card’s image, preferably user avatar."""
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed next to the chevron."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Menu.items', self.items, (Command,), False, False, False)
        _guard_scalar('Menu.icon', self.icon, (str,), False, True, False)
        _guard_scalar('Menu.image', self.image, (str,), False, True, False)
        _guard_scalar('Menu.name', self.name, (str,), True, True, False)
        _guard_scalar('Menu.label', self.label, (str,), False, True, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
            icon=self.icon,
            image=self.image,
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'Menu':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Menu.items', __d_items, (dict,), False, False, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('Menu.icon', __d_icon, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('Menu.image', __d_image, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Menu.name', __d_name, (str,), True, True, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Menu.label', __d_label, (str,), False, True, False)
        items: List[Command] = [Command.load(__e) for __e in __d_items]
        icon: Optional[str] = __d_icon
        image: Optional[str] = __d_image
        name: Optional[str] = __d_name
        label: Optional[str] = __d_label
        return Menu(
            items,
            icon,
            image,
            name,
            label,
        )


class Tags:
    """Create a set of tags laid out horizontally.
    """
    def __init__(
            self,
            items: List[Tag],
    ):
        _guard_vector('Tags.items', items, (Tag,), False, False, False)
        self.items = items
        """Tags in this set."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_vector('Tags.items', self.items, (Tag,), False, False, False)
        return _dump(
            items=[__e.dump() for __e in self.items],
        )

    @staticmethod
    def load(__d: Dict) -> 'Tags':
        """Creates an instance of this class using the contents of a dict."""
        __d_items: Any = __d.get('items')
        _guard_vector('Tags.items', __d_items, (dict,), False, False, False)
        items: List[Tag] = [Tag.load(__e) for __e in __d_items]
        return Tags(
            items,
        )


class TimePicker:
    """Create a time picker.

    A time picker allows a user to pick a time value.
    """
    def __init__(
            self,
            name: str,
            label: Optional[str] = None,
            placeholder: Optional[str] = None,
            value: Optional[str] = None,
            disabled: Optional[bool] = None,
            width: Optional[str] = None,
            visible: Optional[bool] = None,
            trigger: Optional[bool] = None,
            required: Optional[bool] = None,
            hour_format: Optional[str] = None,
            min: Optional[str] = None,
            max: Optional[str] = None,
            minutes_step: Optional[int] = None,
    ):
        _guard_scalar('TimePicker.name', name, (str,), True, False, False)
        _guard_scalar('TimePicker.label', label, (str,), False, True, False)
        _guard_scalar('TimePicker.placeholder', placeholder, (str,), False, True, False)
        _guard_scalar('TimePicker.value', value, (str,), False, True, False)
        _guard_scalar('TimePicker.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('TimePicker.width', width, (str,), False, True, False)
        _guard_scalar('TimePicker.visible', visible, (bool,), False, True, False)
        _guard_scalar('TimePicker.trigger', trigger, (bool,), False, True, False)
        _guard_scalar('TimePicker.required', required, (bool,), False, True, False)
        _guard_scalar('TimePicker.hour_format', hour_format, (str,), False, True, False)
        _guard_scalar('TimePicker.min', min, (str,), False, True, False)
        _guard_scalar('TimePicker.max', max, (str,), False, True, False)
        _guard_scalar('TimePicker.minutes_step', minutes_step, (int,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """Text to be displayed alongside the component."""
        self.placeholder = placeholder
        """A string that provides a brief hint to the user as to what kind of information is expected in the field."""
        self.value = value
        """The time value in hh:mm format. E.g. '10:30', '14:25', '23:59', '00:00'"""
        self.disabled = disabled
        """True if this field is disabled."""
        self.width = width
        """The width of the time picker, e.g. '100px'. Defaults to '100%'."""
        self.visible = visible
        """True if the component should be visible. Defaults to True."""
        self.trigger = trigger
        """True if the form should be submitted when the time is selected."""
        self.required = required
        """True if this is a required field. Defaults to False."""
        self.hour_format = hour_format
        """Specifies 12-hour or 24-hour time format. One of `12` or `24`. Defaults to `12`."""
        self.min = min
        """The minimum allowed time value in hh:mm format. E.g.: '08:00', '13:30'"""
        self.max = max
        """The maximum allowed time value in hh:mm format. E.g.: '15:30', '00:00'"""
        self.minutes_step = minutes_step
        """Limits the available minutes to select from. One of `1`, `5`, `10`, `15`, `20`, `30` or `60`. Defaults to `1`."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TimePicker.name', self.name, (str,), True, False, False)
        _guard_scalar('TimePicker.label', self.label, (str,), False, True, False)
        _guard_scalar('TimePicker.placeholder', self.placeholder, (str,), False, True, False)
        _guard_scalar('TimePicker.value', self.value, (str,), False, True, False)
        _guard_scalar('TimePicker.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('TimePicker.width', self.width, (str,), False, True, False)
        _guard_scalar('TimePicker.visible', self.visible, (bool,), False, True, False)
        _guard_scalar('TimePicker.trigger', self.trigger, (bool,), False, True, False)
        _guard_scalar('TimePicker.required', self.required, (bool,), False, True, False)
        _guard_scalar('TimePicker.hour_format', self.hour_format, (str,), False, True, False)
        _guard_scalar('TimePicker.min', self.min, (str,), False, True, False)
        _guard_scalar('TimePicker.max', self.max, (str,), False, True, False)
        _guard_scalar('TimePicker.minutes_step', self.minutes_step, (int,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            placeholder=self.placeholder,
            value=self.value,
            disabled=self.disabled,
            width=self.width,
            visible=self.visible,
            trigger=self.trigger,
            required=self.required,
            hour_format=self.hour_format,
            min=self.min,
            max=self.max,
            minutes_step=self.minutes_step,
        )

    @staticmethod
    def load(__d: Dict) -> 'TimePicker':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('TimePicker.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('TimePicker.label', __d_label, (str,), False, True, False)
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('TimePicker.placeholder', __d_placeholder, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('TimePicker.value', __d_value, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('TimePicker.disabled', __d_disabled, (bool,), False, True, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('TimePicker.width', __d_width, (str,), False, True, False)
        __d_visible: Any = __d.get('visible')
        _guard_scalar('TimePicker.visible', __d_visible, (bool,), False, True, False)
        __d_trigger: Any = __d.get('trigger')
        _guard_scalar('TimePicker.trigger', __d_trigger, (bool,), False, True, False)
        __d_required: Any = __d.get('required')
        _guard_scalar('TimePicker.required', __d_required, (bool,), False, True, False)
        __d_hour_format: Any = __d.get('hour_format')
        _guard_scalar('TimePicker.hour_format', __d_hour_format, (str,), False, True, False)
        __d_min: Any = __d.get('min')
        _guard_scalar('TimePicker.min', __d_min, (str,), False, True, False)
        __d_max: Any = __d.get('max')
        _guard_scalar('TimePicker.max', __d_max, (str,), False, True, False)
        __d_minutes_step: Any = __d.get('minutes_step')
        _guard_scalar('TimePicker.minutes_step', __d_minutes_step, (int,), False, True, False)
        name: str = __d_name
        label: Optional[str] = __d_label
        placeholder: Optional[str] = __d_placeholder
        value: Optional[str] = __d_value
        disabled: Optional[bool] = __d_disabled
        width: Optional[str] = __d_width
        visible: Optional[bool] = __d_visible
        trigger: Optional[bool] = __d_trigger
        required: Optional[bool] = __d_required
        hour_format: Optional[str] = __d_hour_format
        min: Optional[str] = __d_min
        max: Optional[str] = __d_max
        minutes_step: Optional[int] = __d_minutes_step
        return TimePicker(
            name,
            label,
            placeholder,
            value,
            disabled,
            width,
            visible,
            trigger,
            required,
            hour_format,
            min,
            max,
            minutes_step,
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
            mini_button: Optional[MiniButton] = None,
            mini_buttons: Optional[MiniButtons] = None,
            file_upload: Optional[FileUpload] = None,
            table: Optional[Table] = None,
            link: Optional[Link] = None,
            links: Optional[Links] = None,
            tabs: Optional[Tabs] = None,
            expander: Optional[Expander] = None,
            frame: Optional[Frame] = None,
            markup: Optional[Markup] = None,
            template: Optional[Template] = None,
            picker: Optional[Picker] = None,
            range_slider: Optional[RangeSlider] = None,
            stepper: Optional[Stepper] = None,
            visualization: Optional[Visualization] = None,
            vega_visualization: Optional[VegaVisualization] = None,
            stats: Optional[Stats] = None,
            inline: Optional[Inline] = None,
            image: Optional[Image] = None,
            persona: Optional[Persona] = None,
            text_annotator: Optional[TextAnnotator] = None,
            image_annotator: Optional[ImageAnnotator] = None,
            audio_annotator: Optional[AudioAnnotator] = None,
            facepile: Optional[Facepile] = None,
            copyable_text: Optional[CopyableText] = None,
            menu: Optional[Menu] = None,
            tags: Optional[Tags] = None,
            time_picker: Optional[TimePicker] = None,
    ):
        _guard_scalar('Component.text', text, (Text,), False, True, False)
        _guard_scalar('Component.text_xl', text_xl, (TextXl,), False, True, False)
        _guard_scalar('Component.text_l', text_l, (TextL,), False, True, False)
        _guard_scalar('Component.text_m', text_m, (TextM,), False, True, False)
        _guard_scalar('Component.text_s', text_s, (TextS,), False, True, False)
        _guard_scalar('Component.text_xs', text_xs, (TextXs,), False, True, False)
        _guard_scalar('Component.label', label, (Label,), False, True, False)
        _guard_scalar('Component.separator', separator, (Separator,), False, True, False)
        _guard_scalar('Component.progress', progress, (Progress,), False, True, False)
        _guard_scalar('Component.message_bar', message_bar, (MessageBar,), False, True, False)
        _guard_scalar('Component.textbox', textbox, (Textbox,), False, True, False)
        _guard_scalar('Component.checkbox', checkbox, (Checkbox,), False, True, False)
        _guard_scalar('Component.toggle', toggle, (Toggle,), False, True, False)
        _guard_scalar('Component.choice_group', choice_group, (ChoiceGroup,), False, True, False)
        _guard_scalar('Component.checklist', checklist, (Checklist,), False, True, False)
        _guard_scalar('Component.dropdown', dropdown, (Dropdown,), False, True, False)
        _guard_scalar('Component.combobox', combobox, (Combobox,), False, True, False)
        _guard_scalar('Component.slider', slider, (Slider,), False, True, False)
        _guard_scalar('Component.spinbox', spinbox, (Spinbox,), False, True, False)
        _guard_scalar('Component.date_picker', date_picker, (DatePicker,), False, True, False)
        _guard_scalar('Component.color_picker', color_picker, (ColorPicker,), False, True, False)
        _guard_scalar('Component.button', button, (Button,), False, True, False)
        _guard_scalar('Component.buttons', buttons, (Buttons,), False, True, False)
        _guard_scalar('Component.mini_button', mini_button, (MiniButton,), False, True, False)
        _guard_scalar('Component.mini_buttons', mini_buttons, (MiniButtons,), False, True, False)
        _guard_scalar('Component.file_upload', file_upload, (FileUpload,), False, True, False)
        _guard_scalar('Component.table', table, (Table,), False, True, False)
        _guard_scalar('Component.link', link, (Link,), False, True, False)
        _guard_scalar('Component.links', links, (Links,), False, True, False)
        _guard_scalar('Component.tabs', tabs, (Tabs,), False, True, False)
        _guard_scalar('Component.expander', expander, (Expander,), False, True, False)
        _guard_scalar('Component.frame', frame, (Frame,), False, True, False)
        _guard_scalar('Component.markup', markup, (Markup,), False, True, False)
        _guard_scalar('Component.template', template, (Template,), False, True, False)
        _guard_scalar('Component.picker', picker, (Picker,), False, True, False)
        _guard_scalar('Component.range_slider', range_slider, (RangeSlider,), False, True, False)
        _guard_scalar('Component.stepper', stepper, (Stepper,), False, True, False)
        _guard_scalar('Component.visualization', visualization, (Visualization,), False, True, False)
        _guard_scalar('Component.vega_visualization', vega_visualization, (VegaVisualization,), False, True, False)
        _guard_scalar('Component.stats', stats, (Stats,), False, True, False)
        _guard_scalar('Component.inline', inline, (Inline,), False, True, False)
        _guard_scalar('Component.image', image, (Image,), False, True, False)
        _guard_scalar('Component.persona', persona, (Persona,), False, True, False)
        _guard_scalar('Component.text_annotator', text_annotator, (TextAnnotator,), False, True, False)
        _guard_scalar('Component.image_annotator', image_annotator, (ImageAnnotator,), False, True, False)
        _guard_scalar('Component.audio_annotator', audio_annotator, (AudioAnnotator,), False, True, False)
        _guard_scalar('Component.facepile', facepile, (Facepile,), False, True, False)
        _guard_scalar('Component.copyable_text', copyable_text, (CopyableText,), False, True, False)
        _guard_scalar('Component.menu', menu, (Menu,), False, True, False)
        _guard_scalar('Component.tags', tags, (Tags,), False, True, False)
        _guard_scalar('Component.time_picker', time_picker, (TimePicker,), False, True, False)
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
        self.mini_button = mini_button
        """Mini button."""
        self.mini_buttons = mini_buttons
        """Mini button set."""
        self.file_upload = file_upload
        """File upload."""
        self.table = table
        """Table."""
        self.link = link
        """Link."""
        self.links = links
        """Link set."""
        self.tabs = tabs
        """Tabs."""
        self.expander = expander
        """Expander."""
        self.frame = frame
        """Frame."""
        self.markup = markup
        """Markup"""
        self.template = template
        """Template."""
        self.picker = picker
        """Picker."""
        self.range_slider = range_slider
        """Range Slider."""
        self.stepper = stepper
        """Stepper."""
        self.visualization = visualization
        """Visualization."""
        self.vega_visualization = vega_visualization
        """Vega-lite Visualization."""
        self.stats = stats
        """Stats."""
        self.inline = inline
        """Inline components."""
        self.image = image
        """Image"""
        self.persona = persona
        """Persona."""
        self.text_annotator = text_annotator
        """Text annotator."""
        self.image_annotator = image_annotator
        """Image annotator."""
        self.audio_annotator = audio_annotator
        """Audio annotator."""
        self.facepile = facepile
        """Facepile."""
        self.copyable_text = copyable_text
        """Copyable text."""
        self.menu = menu
        """Menu."""
        self.tags = tags
        """Tags."""
        self.time_picker = time_picker
        """Time picker."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Component.text', self.text, (Text,), False, True, False)
        _guard_scalar('Component.text_xl', self.text_xl, (TextXl,), False, True, False)
        _guard_scalar('Component.text_l', self.text_l, (TextL,), False, True, False)
        _guard_scalar('Component.text_m', self.text_m, (TextM,), False, True, False)
        _guard_scalar('Component.text_s', self.text_s, (TextS,), False, True, False)
        _guard_scalar('Component.text_xs', self.text_xs, (TextXs,), False, True, False)
        _guard_scalar('Component.label', self.label, (Label,), False, True, False)
        _guard_scalar('Component.separator', self.separator, (Separator,), False, True, False)
        _guard_scalar('Component.progress', self.progress, (Progress,), False, True, False)
        _guard_scalar('Component.message_bar', self.message_bar, (MessageBar,), False, True, False)
        _guard_scalar('Component.textbox', self.textbox, (Textbox,), False, True, False)
        _guard_scalar('Component.checkbox', self.checkbox, (Checkbox,), False, True, False)
        _guard_scalar('Component.toggle', self.toggle, (Toggle,), False, True, False)
        _guard_scalar('Component.choice_group', self.choice_group, (ChoiceGroup,), False, True, False)
        _guard_scalar('Component.checklist', self.checklist, (Checklist,), False, True, False)
        _guard_scalar('Component.dropdown', self.dropdown, (Dropdown,), False, True, False)
        _guard_scalar('Component.combobox', self.combobox, (Combobox,), False, True, False)
        _guard_scalar('Component.slider', self.slider, (Slider,), False, True, False)
        _guard_scalar('Component.spinbox', self.spinbox, (Spinbox,), False, True, False)
        _guard_scalar('Component.date_picker', self.date_picker, (DatePicker,), False, True, False)
        _guard_scalar('Component.color_picker', self.color_picker, (ColorPicker,), False, True, False)
        _guard_scalar('Component.button', self.button, (Button,), False, True, False)
        _guard_scalar('Component.buttons', self.buttons, (Buttons,), False, True, False)
        _guard_scalar('Component.mini_button', self.mini_button, (MiniButton,), False, True, False)
        _guard_scalar('Component.mini_buttons', self.mini_buttons, (MiniButtons,), False, True, False)
        _guard_scalar('Component.file_upload', self.file_upload, (FileUpload,), False, True, False)
        _guard_scalar('Component.table', self.table, (Table,), False, True, False)
        _guard_scalar('Component.link', self.link, (Link,), False, True, False)
        _guard_scalar('Component.links', self.links, (Links,), False, True, False)
        _guard_scalar('Component.tabs', self.tabs, (Tabs,), False, True, False)
        _guard_scalar('Component.expander', self.expander, (Expander,), False, True, False)
        _guard_scalar('Component.frame', self.frame, (Frame,), False, True, False)
        _guard_scalar('Component.markup', self.markup, (Markup,), False, True, False)
        _guard_scalar('Component.template', self.template, (Template,), False, True, False)
        _guard_scalar('Component.picker', self.picker, (Picker,), False, True, False)
        _guard_scalar('Component.range_slider', self.range_slider, (RangeSlider,), False, True, False)
        _guard_scalar('Component.stepper', self.stepper, (Stepper,), False, True, False)
        _guard_scalar('Component.visualization', self.visualization, (Visualization,), False, True, False)
        _guard_scalar('Component.vega_visualization', self.vega_visualization, (VegaVisualization,), False, True, False)
        _guard_scalar('Component.stats', self.stats, (Stats,), False, True, False)
        _guard_scalar('Component.inline', self.inline, (Inline,), False, True, False)
        _guard_scalar('Component.image', self.image, (Image,), False, True, False)
        _guard_scalar('Component.persona', self.persona, (Persona,), False, True, False)
        _guard_scalar('Component.text_annotator', self.text_annotator, (TextAnnotator,), False, True, False)
        _guard_scalar('Component.image_annotator', self.image_annotator, (ImageAnnotator,), False, True, False)
        _guard_scalar('Component.audio_annotator', self.audio_annotator, (AudioAnnotator,), False, True, False)
        _guard_scalar('Component.facepile', self.facepile, (Facepile,), False, True, False)
        _guard_scalar('Component.copyable_text', self.copyable_text, (CopyableText,), False, True, False)
        _guard_scalar('Component.menu', self.menu, (Menu,), False, True, False)
        _guard_scalar('Component.tags', self.tags, (Tags,), False, True, False)
        _guard_scalar('Component.time_picker', self.time_picker, (TimePicker,), False, True, False)
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
            mini_button=None if self.mini_button is None else self.mini_button.dump(),
            mini_buttons=None if self.mini_buttons is None else self.mini_buttons.dump(),
            file_upload=None if self.file_upload is None else self.file_upload.dump(),
            table=None if self.table is None else self.table.dump(),
            link=None if self.link is None else self.link.dump(),
            links=None if self.links is None else self.links.dump(),
            tabs=None if self.tabs is None else self.tabs.dump(),
            expander=None if self.expander is None else self.expander.dump(),
            frame=None if self.frame is None else self.frame.dump(),
            markup=None if self.markup is None else self.markup.dump(),
            template=None if self.template is None else self.template.dump(),
            picker=None if self.picker is None else self.picker.dump(),
            range_slider=None if self.range_slider is None else self.range_slider.dump(),
            stepper=None if self.stepper is None else self.stepper.dump(),
            visualization=None if self.visualization is None else self.visualization.dump(),
            vega_visualization=None if self.vega_visualization is None else self.vega_visualization.dump(),
            stats=None if self.stats is None else self.stats.dump(),
            inline=None if self.inline is None else self.inline.dump(),
            image=None if self.image is None else self.image.dump(),
            persona=None if self.persona is None else self.persona.dump(),
            text_annotator=None if self.text_annotator is None else self.text_annotator.dump(),
            image_annotator=None if self.image_annotator is None else self.image_annotator.dump(),
            audio_annotator=None if self.audio_annotator is None else self.audio_annotator.dump(),
            facepile=None if self.facepile is None else self.facepile.dump(),
            copyable_text=None if self.copyable_text is None else self.copyable_text.dump(),
            menu=None if self.menu is None else self.menu.dump(),
            tags=None if self.tags is None else self.tags.dump(),
            time_picker=None if self.time_picker is None else self.time_picker.dump(),
        )

    @staticmethod
    def load(__d: Dict) -> 'Component':
        """Creates an instance of this class using the contents of a dict."""
        __d_text: Any = __d.get('text')
        _guard_scalar('Component.text', __d_text, (dict,), False, True, False)
        __d_text_xl: Any = __d.get('text_xl')
        _guard_scalar('Component.text_xl', __d_text_xl, (dict,), False, True, False)
        __d_text_l: Any = __d.get('text_l')
        _guard_scalar('Component.text_l', __d_text_l, (dict,), False, True, False)
        __d_text_m: Any = __d.get('text_m')
        _guard_scalar('Component.text_m', __d_text_m, (dict,), False, True, False)
        __d_text_s: Any = __d.get('text_s')
        _guard_scalar('Component.text_s', __d_text_s, (dict,), False, True, False)
        __d_text_xs: Any = __d.get('text_xs')
        _guard_scalar('Component.text_xs', __d_text_xs, (dict,), False, True, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Component.label', __d_label, (dict,), False, True, False)
        __d_separator: Any = __d.get('separator')
        _guard_scalar('Component.separator', __d_separator, (dict,), False, True, False)
        __d_progress: Any = __d.get('progress')
        _guard_scalar('Component.progress', __d_progress, (dict,), False, True, False)
        __d_message_bar: Any = __d.get('message_bar')
        _guard_scalar('Component.message_bar', __d_message_bar, (dict,), False, True, False)
        __d_textbox: Any = __d.get('textbox')
        _guard_scalar('Component.textbox', __d_textbox, (dict,), False, True, False)
        __d_checkbox: Any = __d.get('checkbox')
        _guard_scalar('Component.checkbox', __d_checkbox, (dict,), False, True, False)
        __d_toggle: Any = __d.get('toggle')
        _guard_scalar('Component.toggle', __d_toggle, (dict,), False, True, False)
        __d_choice_group: Any = __d.get('choice_group')
        _guard_scalar('Component.choice_group', __d_choice_group, (dict,), False, True, False)
        __d_checklist: Any = __d.get('checklist')
        _guard_scalar('Component.checklist', __d_checklist, (dict,), False, True, False)
        __d_dropdown: Any = __d.get('dropdown')
        _guard_scalar('Component.dropdown', __d_dropdown, (dict,), False, True, False)
        __d_combobox: Any = __d.get('combobox')
        _guard_scalar('Component.combobox', __d_combobox, (dict,), False, True, False)
        __d_slider: Any = __d.get('slider')
        _guard_scalar('Component.slider', __d_slider, (dict,), False, True, False)
        __d_spinbox: Any = __d.get('spinbox')
        _guard_scalar('Component.spinbox', __d_spinbox, (dict,), False, True, False)
        __d_date_picker: Any = __d.get('date_picker')
        _guard_scalar('Component.date_picker', __d_date_picker, (dict,), False, True, False)
        __d_color_picker: Any = __d.get('color_picker')
        _guard_scalar('Component.color_picker', __d_color_picker, (dict,), False, True, False)
        __d_button: Any = __d.get('button')
        _guard_scalar('Component.button', __d_button, (dict,), False, True, False)
        __d_buttons: Any = __d.get('buttons')
        _guard_scalar('Component.buttons', __d_buttons, (dict,), False, True, False)
        __d_mini_button: Any = __d.get('mini_button')
        _guard_scalar('Component.mini_button', __d_mini_button, (dict,), False, True, False)
        __d_mini_buttons: Any = __d.get('mini_buttons')
        _guard_scalar('Component.mini_buttons', __d_mini_buttons, (dict,), False, True, False)
        __d_file_upload: Any = __d.get('file_upload')
        _guard_scalar('Component.file_upload', __d_file_upload, (dict,), False, True, False)
        __d_table: Any = __d.get('table')
        _guard_scalar('Component.table', __d_table, (dict,), False, True, False)
        __d_link: Any = __d.get('link')
        _guard_scalar('Component.link', __d_link, (dict,), False, True, False)
        __d_links: Any = __d.get('links')
        _guard_scalar('Component.links', __d_links, (dict,), False, True, False)
        __d_tabs: Any = __d.get('tabs')
        _guard_scalar('Component.tabs', __d_tabs, (dict,), False, True, False)
        __d_expander: Any = __d.get('expander')
        _guard_scalar('Component.expander', __d_expander, (dict,), False, True, False)
        __d_frame: Any = __d.get('frame')
        _guard_scalar('Component.frame', __d_frame, (dict,), False, True, False)
        __d_markup: Any = __d.get('markup')
        _guard_scalar('Component.markup', __d_markup, (dict,), False, True, False)
        __d_template: Any = __d.get('template')
        _guard_scalar('Component.template', __d_template, (dict,), False, True, False)
        __d_picker: Any = __d.get('picker')
        _guard_scalar('Component.picker', __d_picker, (dict,), False, True, False)
        __d_range_slider: Any = __d.get('range_slider')
        _guard_scalar('Component.range_slider', __d_range_slider, (dict,), False, True, False)
        __d_stepper: Any = __d.get('stepper')
        _guard_scalar('Component.stepper', __d_stepper, (dict,), False, True, False)
        __d_visualization: Any = __d.get('visualization')
        _guard_scalar('Component.visualization', __d_visualization, (dict,), False, True, False)
        __d_vega_visualization: Any = __d.get('vega_visualization')
        _guard_scalar('Component.vega_visualization', __d_vega_visualization, (dict,), False, True, False)
        __d_stats: Any = __d.get('stats')
        _guard_scalar('Component.stats', __d_stats, (dict,), False, True, False)
        __d_inline: Any = __d.get('inline')
        _guard_scalar('Component.inline', __d_inline, (dict,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('Component.image', __d_image, (dict,), False, True, False)
        __d_persona: Any = __d.get('persona')
        _guard_scalar('Component.persona', __d_persona, (dict,), False, True, False)
        __d_text_annotator: Any = __d.get('text_annotator')
        _guard_scalar('Component.text_annotator', __d_text_annotator, (dict,), False, True, False)
        __d_image_annotator: Any = __d.get('image_annotator')
        _guard_scalar('Component.image_annotator', __d_image_annotator, (dict,), False, True, False)
        __d_audio_annotator: Any = __d.get('audio_annotator')
        _guard_scalar('Component.audio_annotator', __d_audio_annotator, (dict,), False, True, False)
        __d_facepile: Any = __d.get('facepile')
        _guard_scalar('Component.facepile', __d_facepile, (dict,), False, True, False)
        __d_copyable_text: Any = __d.get('copyable_text')
        _guard_scalar('Component.copyable_text', __d_copyable_text, (dict,), False, True, False)
        __d_menu: Any = __d.get('menu')
        _guard_scalar('Component.menu', __d_menu, (dict,), False, True, False)
        __d_tags: Any = __d.get('tags')
        _guard_scalar('Component.tags', __d_tags, (dict,), False, True, False)
        __d_time_picker: Any = __d.get('time_picker')
        _guard_scalar('Component.time_picker', __d_time_picker, (dict,), False, True, False)
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
        mini_button: Optional[MiniButton] = None if __d_mini_button is None else MiniButton.load(__d_mini_button)
        mini_buttons: Optional[MiniButtons] = None if __d_mini_buttons is None else MiniButtons.load(__d_mini_buttons)
        file_upload: Optional[FileUpload] = None if __d_file_upload is None else FileUpload.load(__d_file_upload)
        table: Optional[Table] = None if __d_table is None else Table.load(__d_table)
        link: Optional[Link] = None if __d_link is None else Link.load(__d_link)
        links: Optional[Links] = None if __d_links is None else Links.load(__d_links)
        tabs: Optional[Tabs] = None if __d_tabs is None else Tabs.load(__d_tabs)
        expander: Optional[Expander] = None if __d_expander is None else Expander.load(__d_expander)
        frame: Optional[Frame] = None if __d_frame is None else Frame.load(__d_frame)
        markup: Optional[Markup] = None if __d_markup is None else Markup.load(__d_markup)
        template: Optional[Template] = None if __d_template is None else Template.load(__d_template)
        picker: Optional[Picker] = None if __d_picker is None else Picker.load(__d_picker)
        range_slider: Optional[RangeSlider] = None if __d_range_slider is None else RangeSlider.load(__d_range_slider)
        stepper: Optional[Stepper] = None if __d_stepper is None else Stepper.load(__d_stepper)
        visualization: Optional[Visualization] = None if __d_visualization is None else Visualization.load(__d_visualization)
        vega_visualization: Optional[VegaVisualization] = None if __d_vega_visualization is None else VegaVisualization.load(__d_vega_visualization)
        stats: Optional[Stats] = None if __d_stats is None else Stats.load(__d_stats)
        inline: Optional[Inline] = None if __d_inline is None else Inline.load(__d_inline)
        image: Optional[Image] = None if __d_image is None else Image.load(__d_image)
        persona: Optional[Persona] = None if __d_persona is None else Persona.load(__d_persona)
        text_annotator: Optional[TextAnnotator] = None if __d_text_annotator is None else TextAnnotator.load(__d_text_annotator)
        image_annotator: Optional[ImageAnnotator] = None if __d_image_annotator is None else ImageAnnotator.load(__d_image_annotator)
        audio_annotator: Optional[AudioAnnotator] = None if __d_audio_annotator is None else AudioAnnotator.load(__d_audio_annotator)
        facepile: Optional[Facepile] = None if __d_facepile is None else Facepile.load(__d_facepile)
        copyable_text: Optional[CopyableText] = None if __d_copyable_text is None else CopyableText.load(__d_copyable_text)
        menu: Optional[Menu] = None if __d_menu is None else Menu.load(__d_menu)
        tags: Optional[Tags] = None if __d_tags is None else Tags.load(__d_tags)
        time_picker: Optional[TimePicker] = None if __d_time_picker is None else TimePicker.load(__d_time_picker)
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
            mini_button,
            mini_buttons,
            file_upload,
            table,
            link,
            links,
            tabs,
            expander,
            frame,
            markup,
            template,
            picker,
            range_slider,
            stepper,
            visualization,
            vega_visualization,
            stats,
            inline,
            image,
            persona,
            text_annotator,
            image_annotator,
            audio_annotator,
            facepile,
            copyable_text,
            menu,
            tags,
            time_picker,
        )


class ArticleCard:
    """Create an article card for longer texts.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: Optional[str] = None,
            items: Optional[List[Component]] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('ArticleCard.box', box, (str,), False, False, False)
        _guard_scalar('ArticleCard.title', title, (str,), False, False, False)
        _guard_scalar('ArticleCard.content', content, (str,), False, True, False)
        _guard_vector('ArticleCard.items', items, (Component,), False, True, False)
        _guard_vector('ArticleCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card’s title, displayed at the top."""
        self.content = content
        """Markdown text."""
        self.items = items
        """Collection of small buttons rendered under the title."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ArticleCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ArticleCard.title', self.title, (str,), False, False, False)
        _guard_scalar('ArticleCard.content', self.content, (str,), False, True, False)
        _guard_vector('ArticleCard.items', self.items, (Component,), False, True, False)
        _guard_vector('ArticleCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='article',
            box=self.box,
            title=self.title,
            content=self.content,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ArticleCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('ArticleCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ArticleCard.title', __d_title, (str,), False, False, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('ArticleCard.content', __d_content, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('ArticleCard.items', __d_items, (dict,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ArticleCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        content: Optional[str] = __d_content
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ArticleCard(
            box,
            title,
            content,
            items,
            commands,
        )


class Breadcrumb:
    """Create a breadcrumb for a `h2o_wave.types.BreadcrumbsCard()`.
    """
    def __init__(
            self,
            name: str,
            label: str,
    ):
        _guard_scalar('Breadcrumb.name', name, (str,), True, False, False)
        _guard_scalar('Breadcrumb.label', label, (str,), False, False, False)
        self.name = name
        """The name of this item. Prefix the name with a '#' to trigger hash-change navigation."""
        self.label = label
        """The label to display."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Breadcrumb.name', self.name, (str,), True, False, False)
        _guard_scalar('Breadcrumb.label', self.label, (str,), False, False, False)
        return _dump(
            name=self.name,
            label=self.label,
        )

    @staticmethod
    def load(__d: Dict) -> 'Breadcrumb':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Breadcrumb.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('Breadcrumb.label', __d_label, (str,), False, False, False)
        name: str = __d_name
        label: str = __d_label
        return Breadcrumb(
            name,
            label,
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
        _guard_scalar('BreadcrumbsCard.box', box, (str,), False, False, False)
        _guard_vector('BreadcrumbsCard.items', items, (Breadcrumb,), False, False, False)
        _guard_vector('BreadcrumbsCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """A list of `h2o_wave.types.Breadcrumb` instances to display. See `h2o_wave.ui.breadcrumb()`"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('BreadcrumbsCard.box', self.box, (str,), False, False, False)
        _guard_vector('BreadcrumbsCard.items', self.items, (Breadcrumb,), False, False, False)
        _guard_vector('BreadcrumbsCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('BreadcrumbsCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('BreadcrumbsCard.items', __d_items, (dict,), False, False, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('BreadcrumbsCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        items: List[Breadcrumb] = [Breadcrumb.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return BreadcrumbsCard(
            box,
            items,
            commands,
        )


class CanvasCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that displays a drawing canvas (whiteboard).
    """
    def __init__(
            self,
            box: str,
            title: str,
            width: int,
            height: int,
            data: PackedRecord,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('CanvasCard.box', box, (str,), False, False, False)
        _guard_scalar('CanvasCard.title', title, (str,), False, False, False)
        _guard_scalar('CanvasCard.width', width, (int,), False, False, False)
        _guard_scalar('CanvasCard.height', height, (int,), False, False, False)
        _guard_vector('CanvasCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.width = width
        """Canvas width, in pixels."""
        self.height = height
        """Canvas height, in pixels."""
        self.data = data
        """The data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('CanvasCard.box', self.box, (str,), False, False, False)
        _guard_scalar('CanvasCard.title', self.title, (str,), False, False, False)
        _guard_scalar('CanvasCard.width', self.width, (int,), False, False, False)
        _guard_scalar('CanvasCard.height', self.height, (int,), False, False, False)
        _guard_vector('CanvasCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='canvas',
            box=self.box,
            title=self.title,
            width=self.width,
            height=self.height,
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'CanvasCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('CanvasCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('CanvasCard.title', __d_title, (str,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('CanvasCard.width', __d_width, (int,), False, False, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('CanvasCard.height', __d_height, (int,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('CanvasCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        width: int = __d_width
        height: int = __d_height
        data: PackedRecord = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return CanvasCard(
            box,
            title,
            width,
            height,
            data,
            commands,
        )


class ChatCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that displays a chat room.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            capacity: Optional[int] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('ChatCard.box', box, (str,), False, False, False)
        _guard_scalar('ChatCard.title', title, (str,), False, False, False)
        _guard_scalar('ChatCard.capacity', capacity, (int,), False, True, False)
        _guard_vector('ChatCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.data = data
        """The data for this card."""
        self.capacity = capacity
        """The maximum number of messages contained in this card. Defaults to 50."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ChatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ChatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('ChatCard.capacity', self.capacity, (int,), False, True, False)
        _guard_vector('ChatCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='chat',
            box=self.box,
            title=self.title,
            data=self.data,
            capacity=self.capacity,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ChatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('ChatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ChatCard.title', __d_title, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_capacity: Any = __d.get('capacity')
        _guard_scalar('ChatCard.capacity', __d_capacity, (int,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ChatCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        capacity: Optional[int] = __d_capacity
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ChatCard(
            box,
            title,
            data,
            capacity,
            commands,
        )


class ChatSuggestion:
    """Create a chat prompt suggestion displayed as button below the last response in the chatbot component.
    """
    def __init__(
            self,
            name: str,
            label: str,
            caption: Optional[str] = None,
            icon: Optional[str] = None,
    ):
        _guard_scalar('ChatSuggestion.name', name, (str,), True, False, False)
        _guard_scalar('ChatSuggestion.label', label, (str,), False, False, False)
        _guard_scalar('ChatSuggestion.caption', caption, (str,), False, True, False)
        _guard_scalar('ChatSuggestion.icon', icon, (str,), False, True, False)
        self.name = name
        """An identifying name for this component."""
        self.label = label
        """The text displayed for this suggestion."""
        self.caption = caption
        """The caption displayed below the label."""
        self.icon = icon
        """The icon to be displayed for this suggestion."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ChatSuggestion.name', self.name, (str,), True, False, False)
        _guard_scalar('ChatSuggestion.label', self.label, (str,), False, False, False)
        _guard_scalar('ChatSuggestion.caption', self.caption, (str,), False, True, False)
        _guard_scalar('ChatSuggestion.icon', self.icon, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            caption=self.caption,
            icon=self.icon,
        )

    @staticmethod
    def load(__d: Dict) -> 'ChatSuggestion':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('ChatSuggestion.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('ChatSuggestion.label', __d_label, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('ChatSuggestion.caption', __d_caption, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('ChatSuggestion.icon', __d_icon, (str,), False, True, False)
        name: str = __d_name
        label: str = __d_label
        caption: Optional[str] = __d_caption
        icon: Optional[str] = __d_icon
        return ChatSuggestion(
            name,
            label,
            caption,
            icon,
        )


class ChatbotCard:
    """Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers.
    """
    def __init__(
            self,
            box: str,
            name: str,
            data: PackedRecord,
            placeholder: Optional[str] = None,
            events: Optional[List[str]] = None,
            generating: Optional[bool] = None,
            suggestions: Optional[List[ChatSuggestion]] = None,
            disabled: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('ChatbotCard.box', box, (str,), False, False, False)
        _guard_scalar('ChatbotCard.name', name, (str,), True, False, False)
        _guard_scalar('ChatbotCard.placeholder', placeholder, (str,), False, True, False)
        _guard_vector('ChatbotCard.events', events, (str,), False, True, False)
        _guard_scalar('ChatbotCard.generating', generating, (bool,), False, True, False)
        _guard_vector('ChatbotCard.suggestions', suggestions, (ChatSuggestion,), False, True, False)
        _guard_scalar('ChatbotCard.disabled', disabled, (bool,), False, True, False)
        _guard_vector('ChatbotCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.name = name
        """An identifying name for this component."""
        self.data = data
        """Chat messages data. Requires cyclic buffer."""
        self.placeholder = placeholder
        """Chat input box placeholder. Use for prompt examples."""
        self.events = events
        """The events to capture on this chatbot. One of 'stop' | 'scroll_up' | 'feedback' | 'suggestion'."""
        self.generating = generating
        """True to show a button to stop the text generation. Defaults to False."""
        self.suggestions = suggestions
        """Clickable prompt suggestions shown below the last response."""
        self.disabled = disabled
        """True if the user input should be disabled."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ChatbotCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ChatbotCard.name', self.name, (str,), True, False, False)
        _guard_scalar('ChatbotCard.placeholder', self.placeholder, (str,), False, True, False)
        _guard_vector('ChatbotCard.events', self.events, (str,), False, True, False)
        _guard_scalar('ChatbotCard.generating', self.generating, (bool,), False, True, False)
        _guard_vector('ChatbotCard.suggestions', self.suggestions, (ChatSuggestion,), False, True, False)
        _guard_scalar('ChatbotCard.disabled', self.disabled, (bool,), False, True, False)
        _guard_vector('ChatbotCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='chatbot',
            box=self.box,
            name=self.name,
            data=self.data,
            placeholder=self.placeholder,
            events=self.events,
            generating=self.generating,
            suggestions=None if self.suggestions is None else [__e.dump() for __e in self.suggestions],
            disabled=self.disabled,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ChatbotCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('ChatbotCard.box', __d_box, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('ChatbotCard.name', __d_name, (str,), True, False, False)
        __d_data: Any = __d.get('data')
        __d_placeholder: Any = __d.get('placeholder')
        _guard_scalar('ChatbotCard.placeholder', __d_placeholder, (str,), False, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('ChatbotCard.events', __d_events, (str,), False, True, False)
        __d_generating: Any = __d.get('generating')
        _guard_scalar('ChatbotCard.generating', __d_generating, (bool,), False, True, False)
        __d_suggestions: Any = __d.get('suggestions')
        _guard_vector('ChatbotCard.suggestions', __d_suggestions, (dict,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('ChatbotCard.disabled', __d_disabled, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ChatbotCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        name: str = __d_name
        data: PackedRecord = __d_data
        placeholder: Optional[str] = __d_placeholder
        events: Optional[List[str]] = __d_events
        generating: Optional[bool] = __d_generating
        suggestions: Optional[List[ChatSuggestion]] = None if __d_suggestions is None else [ChatSuggestion.load(__e) for __e in __d_suggestions]
        disabled: Optional[bool] = __d_disabled
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ChatbotCard(
            box,
            name,
            data,
            placeholder,
            events,
            generating,
            suggestions,
            disabled,
            commands,
        )


_EditorCardMode = ['public', 'private']


class EditorCardMode:
    PUBLIC = 'public'
    PRIVATE = 'private'


class EditorCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that enables WYSIWYG editing on a page.
    Adding this card to a page makes the page editable by end-users.
    """
    def __init__(
            self,
            box: str,
            mode: str,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('EditorCard.box', box, (str,), False, False, False)
        _guard_enum('EditorCard.mode', mode, _EditorCardMode, False)
        _guard_vector('EditorCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.mode = mode
        """The editing mode. Defaults to `public`. One of 'public', 'private'. See enum h2o_wave.ui.EditorCardMode."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('EditorCard.box', self.box, (str,), False, False, False)
        _guard_enum('EditorCard.mode', self.mode, _EditorCardMode, False)
        _guard_vector('EditorCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='editor',
            box=self.box,
            mode=self.mode,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'EditorCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('EditorCard.box', __d_box, (str,), False, False, False)
        __d_mode: Any = __d.get('mode')
        _guard_enum('EditorCard.mode', __d_mode, _EditorCardMode, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('EditorCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        mode: str = __d_mode
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return EditorCard(
            box,
            mode,
            commands,
        )


_FlexCardDirection = ['horizontal', 'vertical']


class FlexCardDirection:
    HORIZONTAL = 'horizontal'
    VERTICAL = 'vertical'


_FlexCardJustify = ['start', 'end', 'center', 'between', 'around']


class FlexCardJustify:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'


_FlexCardAlign = ['start', 'end', 'center', 'baseline', 'stretch']


class FlexCardAlign:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BASELINE = 'baseline'
    STRETCH = 'stretch'


_FlexCardWrap = ['start', 'end', 'center', 'between', 'around', 'stretch']


class FlexCardWrap:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'
    STRETCH = 'stretch'


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
        _guard_scalar('FlexCard.box', box, (str,), False, False, False)
        _guard_scalar('FlexCard.item_view', item_view, (str,), False, False, False)
        _guard_enum('FlexCard.direction', direction, _FlexCardDirection, True)
        _guard_enum('FlexCard.justify', justify, _FlexCardJustify, True)
        _guard_enum('FlexCard.align', align, _FlexCardAlign, True)
        _guard_enum('FlexCard.wrap', wrap, _FlexCardWrap, True)
        _guard_vector('FlexCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.item_view = item_view
        """The child card type."""
        self.item_props = item_props
        """The child card properties."""
        self.data = data
        """Data for this card."""
        self.direction = direction
        """Layout direction. One of 'horizontal', 'vertical'. See enum h2o_wave.ui.FlexCardDirection."""
        self.justify = justify
        """Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.FlexCardJustify."""
        self.align = align
        """Layout strategy for cross axis. One of 'start', 'end', 'center', 'baseline', 'stretch'. See enum h2o_wave.ui.FlexCardAlign."""
        self.wrap = wrap
        """Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.FlexCardWrap."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('FlexCard.box', self.box, (str,), False, False, False)
        _guard_scalar('FlexCard.item_view', self.item_view, (str,), False, False, False)
        _guard_enum('FlexCard.direction', self.direction, _FlexCardDirection, True)
        _guard_enum('FlexCard.justify', self.justify, _FlexCardJustify, True)
        _guard_enum('FlexCard.align', self.align, _FlexCardAlign, True)
        _guard_enum('FlexCard.wrap', self.wrap, _FlexCardWrap, True)
        _guard_vector('FlexCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('FlexCard.box', __d_box, (str,), False, False, False)
        __d_item_view: Any = __d.get('item_view')
        _guard_scalar('FlexCard.item_view', __d_item_view, (str,), False, False, False)
        __d_item_props: Any = __d.get('item_props')
        __d_data: Any = __d.get('data')
        __d_direction: Any = __d.get('direction')
        _guard_enum('FlexCard.direction', __d_direction, _FlexCardDirection, True)
        __d_justify: Any = __d.get('justify')
        _guard_enum('FlexCard.justify', __d_justify, _FlexCardJustify, True)
        __d_align: Any = __d.get('align')
        _guard_enum('FlexCard.align', __d_align, _FlexCardAlign, True)
        __d_wrap: Any = __d.get('wrap')
        _guard_enum('FlexCard.wrap', __d_wrap, _FlexCardWrap, True)
        __d_commands: Any = __d.get('commands')
        _guard_vector('FlexCard.commands', __d_commands, (dict,), False, True, False)
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


class FooterCard:
    """Render a page footer displaying a caption.
    Footer cards are typically displayed at the bottom of a page.
    """
    def __init__(
            self,
            box: str,
            caption: str,
            items: Optional[List[Component]] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('FooterCard.box', box, (str,), False, False, False)
        _guard_scalar('FooterCard.caption', caption, (str,), False, False, False)
        _guard_vector('FooterCard.items', items, (Component,), False, True, False)
        _guard_vector('FooterCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.caption = caption
        """The caption. Supports markdown. *"""
        self.items = items
        """The components displayed to the right of the caption."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('FooterCard.box', self.box, (str,), False, False, False)
        _guard_scalar('FooterCard.caption', self.caption, (str,), False, False, False)
        _guard_vector('FooterCard.items', self.items, (Component,), False, True, False)
        _guard_vector('FooterCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='footer',
            box=self.box,
            caption=self.caption,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FooterCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('FooterCard.box', __d_box, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('FooterCard.caption', __d_caption, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('FooterCard.items', __d_items, (dict,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('FooterCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        caption: str = __d_caption
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FooterCard(
            box,
            caption,
            items,
            commands,
        )


class FormCard:
    """Create a form.
    """
    def __init__(
            self,
            box: str,
            items: Union[List[Component], str],
            title: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('FormCard.box', box, (str,), False, False, False)
        _guard_vector('FormCard.items', items, (Component,), False, False, True)
        _guard_scalar('FormCard.title', title, (str,), False, True, False)
        _guard_vector('FormCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The components in this form."""
        self.title = title
        """The title for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('FormCard.box', self.box, (str,), False, False, False)
        _guard_vector('FormCard.items', self.items, (Component,), False, False, True)
        _guard_scalar('FormCard.title', self.title, (str,), False, True, False)
        _guard_vector('FormCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='form',
            box=self.box,
            items=self.items if isinstance(self.items, str) else [__e.dump() for __e in self.items],
            title=self.title,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FormCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('FormCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('FormCard.items', __d_items, (dict,), False, False, True)
        __d_title: Any = __d.get('title')
        _guard_scalar('FormCard.title', __d_title, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('FormCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        items: Union[List[Component], str] = __d_items if isinstance(__d_items, str) else [Component.load(__e) for __e in __d_items]
        title: Optional[str] = __d_title
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FormCard(
            box,
            items,
            title,
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
            compact: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('FrameCard.box', box, (str,), False, False, False)
        _guard_scalar('FrameCard.title', title, (str,), False, False, False)
        _guard_scalar('FrameCard.path', path, (str,), False, True, False)
        _guard_scalar('FrameCard.content', content, (str,), False, True, False)
        _guard_scalar('FrameCard.compact', compact, (bool,), False, True, False)
        _guard_vector('FrameCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.path = path
        """The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`."""
        self.content = content
        """The HTML content of the page. A string containing `<html>...</html>`."""
        self.compact = compact
        """True if title and padding should be removed. Defaults to False."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('FrameCard.box', self.box, (str,), False, False, False)
        _guard_scalar('FrameCard.title', self.title, (str,), False, False, False)
        _guard_scalar('FrameCard.path', self.path, (str,), False, True, False)
        _guard_scalar('FrameCard.content', self.content, (str,), False, True, False)
        _guard_scalar('FrameCard.compact', self.compact, (bool,), False, True, False)
        _guard_vector('FrameCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='frame',
            box=self.box,
            title=self.title,
            path=self.path,
            content=self.content,
            compact=self.compact,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'FrameCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('FrameCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('FrameCard.title', __d_title, (str,), False, False, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('FrameCard.path', __d_path, (str,), False, True, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('FrameCard.content', __d_content, (str,), False, True, False)
        __d_compact: Any = __d.get('compact')
        _guard_scalar('FrameCard.compact', __d_compact, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('FrameCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        path: Optional[str] = __d_path
        content: Optional[str] = __d_content
        compact: Optional[bool] = __d_compact
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return FrameCard(
            box,
            title,
            path,
            content,
            compact,
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
        _guard_scalar('GraphicsCard.box', box, (str,), False, False, False)
        _guard_scalar('GraphicsCard.view_box', view_box, (str,), False, False, False)
        _guard_scalar('GraphicsCard.width', width, (str,), False, True, False)
        _guard_scalar('GraphicsCard.height', height, (str,), False, True, False)
        _guard_vector('GraphicsCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('GraphicsCard.box', self.box, (str,), False, False, False)
        _guard_scalar('GraphicsCard.view_box', self.view_box, (str,), False, False, False)
        _guard_scalar('GraphicsCard.width', self.width, (str,), False, True, False)
        _guard_scalar('GraphicsCard.height', self.height, (str,), False, True, False)
        _guard_vector('GraphicsCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('GraphicsCard.box', __d_box, (str,), False, False, False)
        __d_view_box: Any = __d.get('view_box')
        _guard_scalar('GraphicsCard.view_box', __d_view_box, (str,), False, False, False)
        __d_stage: Any = __d.get('stage')
        __d_scene: Any = __d.get('scene')
        __d_width: Any = __d.get('width')
        _guard_scalar('GraphicsCard.width', __d_width, (str,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('GraphicsCard.height', __d_height, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('GraphicsCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('GridCard.box', box, (str,), False, False, False)
        _guard_scalar('GridCard.title', title, (str,), False, False, False)
        _guard_vector('GridCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('GridCard.box', self.box, (str,), False, False, False)
        _guard_scalar('GridCard.title', self.title, (str,), False, False, False)
        _guard_vector('GridCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('GridCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('GridCard.title', __d_title, (str,), False, False, False)
        __d_cells: Any = __d.get('cells')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('GridCard.commands', __d_commands, (dict,), False, True, False)
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


class NavItem:
    """Create a navigation item.
    """
    def __init__(
            self,
            name: str,
            label: str,
            icon: Optional[str] = None,
            disabled: Optional[bool] = None,
            tooltip: Optional[str] = None,
            path: Optional[str] = None,
    ):
        _guard_scalar('NavItem.name', name, (str,), True, False, False)
        _guard_scalar('NavItem.label', label, (str,), False, False, False)
        _guard_scalar('NavItem.icon', icon, (str,), False, True, False)
        _guard_scalar('NavItem.disabled', disabled, (bool,), False, True, False)
        _guard_scalar('NavItem.tooltip', tooltip, (str,), False, True, False)
        _guard_scalar('NavItem.path', path, (str,), False, True, False)
        self.name = name
        """The name of this item. Prefix the name with a '#' to trigger hash-change navigation."""
        self.label = label
        """The label to display."""
        self.icon = icon
        """An optional icon to display next to the label."""
        self.disabled = disabled
        """True if this item should be disabled."""
        self.tooltip = tooltip
        """An optional tooltip message displayed when a user hovers over this item."""
        self.path = path
        """The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab. E.g. `/foo.html` or `http://example.com/foo.html`"""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('NavItem.name', self.name, (str,), True, False, False)
        _guard_scalar('NavItem.label', self.label, (str,), False, False, False)
        _guard_scalar('NavItem.icon', self.icon, (str,), False, True, False)
        _guard_scalar('NavItem.disabled', self.disabled, (bool,), False, True, False)
        _guard_scalar('NavItem.tooltip', self.tooltip, (str,), False, True, False)
        _guard_scalar('NavItem.path', self.path, (str,), False, True, False)
        return _dump(
            name=self.name,
            label=self.label,
            icon=self.icon,
            disabled=self.disabled,
            tooltip=self.tooltip,
            path=self.path,
        )

    @staticmethod
    def load(__d: Dict) -> 'NavItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('NavItem.name', __d_name, (str,), True, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('NavItem.label', __d_label, (str,), False, False, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('NavItem.icon', __d_icon, (str,), False, True, False)
        __d_disabled: Any = __d.get('disabled')
        _guard_scalar('NavItem.disabled', __d_disabled, (bool,), False, True, False)
        __d_tooltip: Any = __d.get('tooltip')
        _guard_scalar('NavItem.tooltip', __d_tooltip, (str,), False, True, False)
        __d_path: Any = __d.get('path')
        _guard_scalar('NavItem.path', __d_path, (str,), False, True, False)
        name: str = __d_name
        label: str = __d_label
        icon: Optional[str] = __d_icon
        disabled: Optional[bool] = __d_disabled
        tooltip: Optional[str] = __d_tooltip
        path: Optional[str] = __d_path
        return NavItem(
            name,
            label,
            icon,
            disabled,
            tooltip,
            path,
        )


class NavGroup:
    """Create a group of navigation items.
    """
    def __init__(
            self,
            label: str,
            items: List[NavItem],
            collapsed: Optional[bool] = None,
    ):
        _guard_scalar('NavGroup.label', label, (str,), False, False, False)
        _guard_vector('NavGroup.items', items, (NavItem,), False, False, False)
        _guard_scalar('NavGroup.collapsed', collapsed, (bool,), False, True, False)
        self.label = label
        """The label to display for this group."""
        self.items = items
        """The navigation items contained in this group."""
        self.collapsed = collapsed
        """Indicates whether nav groups should be rendered as collapsed initially"""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('NavGroup.label', self.label, (str,), False, False, False)
        _guard_vector('NavGroup.items', self.items, (NavItem,), False, False, False)
        _guard_scalar('NavGroup.collapsed', self.collapsed, (bool,), False, True, False)
        return _dump(
            label=self.label,
            items=[__e.dump() for __e in self.items],
            collapsed=self.collapsed,
        )

    @staticmethod
    def load(__d: Dict) -> 'NavGroup':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('NavGroup.label', __d_label, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('NavGroup.items', __d_items, (dict,), False, False, False)
        __d_collapsed: Any = __d.get('collapsed')
        _guard_scalar('NavGroup.collapsed', __d_collapsed, (bool,), False, True, False)
        label: str = __d_label
        items: List[NavItem] = [NavItem.load(__e) for __e in __d_items]
        collapsed: Optional[bool] = __d_collapsed
        return NavGroup(
            label,
            items,
            collapsed,
        )


_HeaderCardColor = ['card', 'transparent', 'primary']


class HeaderCardColor:
    CARD = 'card'
    TRANSPARENT = 'transparent'
    PRIMARY = 'primary'


class HeaderCard:
    """Render a page header displaying a title, subtitle and an optional navigation menu.
    Header cards are typically used for top-level navigation.
    """
    def __init__(
            self,
            box: str,
            title: str,
            subtitle: str,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
            image: Optional[str] = None,
            nav: Optional[List[NavGroup]] = None,
            items: Optional[List[Component]] = None,
            secondary_items: Optional[List[Component]] = None,
            color: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('HeaderCard.box', box, (str,), False, False, False)
        _guard_scalar('HeaderCard.title', title, (str,), False, False, False)
        _guard_scalar('HeaderCard.subtitle', subtitle, (str,), False, False, False)
        _guard_scalar('HeaderCard.icon', icon, (str,), False, True, False)
        _guard_scalar('HeaderCard.icon_color', icon_color, (str,), False, True, False)
        _guard_scalar('HeaderCard.image', image, (str,), False, True, False)
        _guard_vector('HeaderCard.nav', nav, (NavGroup,), False, True, False)
        _guard_vector('HeaderCard.items', items, (Component,), False, True, False)
        _guard_vector('HeaderCard.secondary_items', secondary_items, (Component,), False, True, False)
        _guard_enum('HeaderCard.color', color, _HeaderCardColor, True)
        _guard_vector('HeaderCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title. *"""
        self.subtitle = subtitle
        """The subtitle, displayed below the title. *"""
        self.icon = icon
        """The icon, displayed to the left. *"""
        self.icon_color = icon_color
        """The icon's color. *"""
        self.image = image
        """The URL of an image (usually logo) displayed to the left. Mutually exclusive with icon. *"""
        self.nav = nav
        """The navigation menu to display when the header's icon is clicked. Recommended for mobile screens only. *"""
        self.items = items
        """Items that should be displayed on the right side of the header."""
        self.secondary_items = secondary_items
        """Items that should be displayed in the center of the header."""
        self.color = color
        """Header background color. Defaults to 'primary'. One of 'card', 'transparent', 'primary'. See enum h2o_wave.ui.HeaderCardColor."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('HeaderCard.box', self.box, (str,), False, False, False)
        _guard_scalar('HeaderCard.title', self.title, (str,), False, False, False)
        _guard_scalar('HeaderCard.subtitle', self.subtitle, (str,), False, False, False)
        _guard_scalar('HeaderCard.icon', self.icon, (str,), False, True, False)
        _guard_scalar('HeaderCard.icon_color', self.icon_color, (str,), False, True, False)
        _guard_scalar('HeaderCard.image', self.image, (str,), False, True, False)
        _guard_vector('HeaderCard.nav', self.nav, (NavGroup,), False, True, False)
        _guard_vector('HeaderCard.items', self.items, (Component,), False, True, False)
        _guard_vector('HeaderCard.secondary_items', self.secondary_items, (Component,), False, True, False)
        _guard_enum('HeaderCard.color', self.color, _HeaderCardColor, True)
        _guard_vector('HeaderCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='header',
            box=self.box,
            title=self.title,
            subtitle=self.subtitle,
            icon=self.icon,
            icon_color=self.icon_color,
            image=self.image,
            nav=None if self.nav is None else [__e.dump() for __e in self.nav],
            items=None if self.items is None else [__e.dump() for __e in self.items],
            secondary_items=None if self.secondary_items is None else [__e.dump() for __e in self.secondary_items],
            color=self.color,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'HeaderCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('HeaderCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('HeaderCard.title', __d_title, (str,), False, False, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('HeaderCard.subtitle', __d_subtitle, (str,), False, False, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('HeaderCard.icon', __d_icon, (str,), False, True, False)
        __d_icon_color: Any = __d.get('icon_color')
        _guard_scalar('HeaderCard.icon_color', __d_icon_color, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('HeaderCard.image', __d_image, (str,), False, True, False)
        __d_nav: Any = __d.get('nav')
        _guard_vector('HeaderCard.nav', __d_nav, (dict,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('HeaderCard.items', __d_items, (dict,), False, True, False)
        __d_secondary_items: Any = __d.get('secondary_items')
        _guard_vector('HeaderCard.secondary_items', __d_secondary_items, (dict,), False, True, False)
        __d_color: Any = __d.get('color')
        _guard_enum('HeaderCard.color', __d_color, _HeaderCardColor, True)
        __d_commands: Any = __d.get('commands')
        _guard_vector('HeaderCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        subtitle: str = __d_subtitle
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        image: Optional[str] = __d_image
        nav: Optional[List[NavGroup]] = None if __d_nav is None else [NavGroup.load(__e) for __e in __d_nav]
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        secondary_items: Optional[List[Component]] = None if __d_secondary_items is None else [Component.load(__e) for __e in __d_secondary_items]
        color: Optional[str] = __d_color
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return HeaderCard(
            box,
            title,
            subtitle,
            icon,
            icon_color,
            image,
            nav,
            items,
            secondary_items,
            color,
            commands,
        )


class ImageCard:
    """Create a card that displays a base64-encoded image.
    """
    def __init__(
            self,
            box: str,
            title: str,
            type: Optional[str] = None,
            image: Optional[str] = None,
            data: Optional[PackedRecord] = None,
            path: Optional[str] = None,
            path_popup: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('ImageCard.box', box, (str,), False, False, False)
        _guard_scalar('ImageCard.title', title, (str,), False, False, False)
        _guard_scalar('ImageCard.type', type, (str,), False, True, False)
        _guard_scalar('ImageCard.image', image, (str,), False, True, False)
        _guard_scalar('ImageCard.path', path, (str,), False, True, False)
        _guard_scalar('ImageCard.path_popup', path_popup, (str,), False, True, False)
        _guard_vector('ImageCard.commands', commands, (Command,), False, True, False)
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
        self.path = path
        """The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`."""
        self.path_popup = path_popup
        """The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ImageCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ImageCard.title', self.title, (str,), False, False, False)
        _guard_scalar('ImageCard.type', self.type, (str,), False, True, False)
        _guard_scalar('ImageCard.image', self.image, (str,), False, True, False)
        _guard_scalar('ImageCard.path', self.path, (str,), False, True, False)
        _guard_scalar('ImageCard.path_popup', self.path_popup, (str,), False, True, False)
        _guard_vector('ImageCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='image',
            box=self.box,
            title=self.title,
            type=self.type,
            image=self.image,
            data=self.data,
            path=self.path,
            path_popup=self.path_popup,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ImageCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('ImageCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ImageCard.title', __d_title, (str,), False, False, False)
        __d_type: Any = __d.get('type')
        _guard_scalar('ImageCard.type', __d_type, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('ImageCard.image', __d_image, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_path: Any = __d.get('path')
        _guard_scalar('ImageCard.path', __d_path, (str,), False, True, False)
        __d_path_popup: Any = __d.get('path_popup')
        _guard_scalar('ImageCard.path_popup', __d_path_popup, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ImageCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        type: Optional[str] = __d_type
        image: Optional[str] = __d_image
        data: Optional[PackedRecord] = __d_data
        path: Optional[str] = __d_path
        path_popup: Optional[str] = __d_path_popup
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ImageCard(
            box,
            title,
            type,
            image,
            data,
            path,
            path_popup,
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
        _guard_scalar('LargeBarStatCard.box', box, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.title', title, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.caption', caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.value', value, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.value_caption', value_caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.aux_value_caption', aux_value_caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.progress', progress, (float, int,), False, False, False)
        _guard_scalar('LargeBarStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('LargeBarStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('LargeBarStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.caption', self.caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.value_caption', self.value_caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.aux_value_caption', self.aux_value_caption, (str,), False, False, False)
        _guard_scalar('LargeBarStatCard.progress', self.progress, (float, int,), False, False, False)
        _guard_scalar('LargeBarStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('LargeBarStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('LargeBarStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('LargeBarStatCard.title', __d_title, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('LargeBarStatCard.caption', __d_caption, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('LargeBarStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('LargeBarStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_value_caption: Any = __d.get('value_caption')
        _guard_scalar('LargeBarStatCard.value_caption', __d_value_caption, (str,), False, False, False)
        __d_aux_value_caption: Any = __d.get('aux_value_caption')
        _guard_scalar('LargeBarStatCard.aux_value_caption', __d_aux_value_caption, (str,), False, False, False)
        __d_progress: Any = __d.get('progress')
        _guard_scalar('LargeBarStatCard.progress', __d_progress, (float, int,), False, False, False)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('LargeBarStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('LargeBarStatCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('LargeStatCard.box', box, (str,), False, False, False)
        _guard_scalar('LargeStatCard.title', title, (str,), False, False, False)
        _guard_scalar('LargeStatCard.value', value, (str,), False, False, False)
        _guard_scalar('LargeStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('LargeStatCard.caption', caption, (str,), False, False, False)
        _guard_vector('LargeStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('LargeStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('LargeStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('LargeStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('LargeStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('LargeStatCard.caption', self.caption, (str,), False, False, False)
        _guard_vector('LargeStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('LargeStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('LargeStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('LargeStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('LargeStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('LargeStatCard.caption', __d_caption, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('LargeStatCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('ListCard.box', box, (str,), False, False, False)
        _guard_scalar('ListCard.title', title, (str,), False, False, False)
        _guard_scalar('ListCard.item_view', item_view, (str,), False, False, False)
        _guard_vector('ListCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('ListCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ListCard.title', self.title, (str,), False, False, False)
        _guard_scalar('ListCard.item_view', self.item_view, (str,), False, False, False)
        _guard_vector('ListCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('ListCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ListCard.title', __d_title, (str,), False, False, False)
        __d_item_view: Any = __d.get('item_view')
        _guard_scalar('ListCard.item_view', __d_item_view, (str,), False, False, False)
        __d_item_props: Any = __d.get('item_props')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('ListCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('ListItem1Card.box', box, (str,), False, False, False)
        _guard_scalar('ListItem1Card.title', title, (str,), False, False, False)
        _guard_scalar('ListItem1Card.caption', caption, (str,), False, False, False)
        _guard_scalar('ListItem1Card.value', value, (str,), False, False, False)
        _guard_scalar('ListItem1Card.aux_value', aux_value, (str,), False, False, False)
        _guard_vector('ListItem1Card.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('ListItem1Card.box', self.box, (str,), False, False, False)
        _guard_scalar('ListItem1Card.title', self.title, (str,), False, False, False)
        _guard_scalar('ListItem1Card.caption', self.caption, (str,), False, False, False)
        _guard_scalar('ListItem1Card.value', self.value, (str,), False, False, False)
        _guard_scalar('ListItem1Card.aux_value', self.aux_value, (str,), False, False, False)
        _guard_vector('ListItem1Card.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('ListItem1Card.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('ListItem1Card.title', __d_title, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('ListItem1Card.caption', __d_caption, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('ListItem1Card.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('ListItem1Card.aux_value', __d_aux_value, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('ListItem1Card.commands', __d_commands, (dict,), False, True, False)
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
            compact: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('MarkdownCard.box', box, (str,), False, False, False)
        _guard_scalar('MarkdownCard.title', title, (str,), False, False, False)
        _guard_scalar('MarkdownCard.content', content, (str,), False, False, False)
        _guard_scalar('MarkdownCard.compact', compact, (bool,), False, True, False)
        _guard_vector('MarkdownCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/"""
        self.data = data
        """Additional data for the card."""
        self.compact = compact
        """Make spacing tighter. Defaults to True."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('MarkdownCard.box', self.box, (str,), False, False, False)
        _guard_scalar('MarkdownCard.title', self.title, (str,), False, False, False)
        _guard_scalar('MarkdownCard.content', self.content, (str,), False, False, False)
        _guard_scalar('MarkdownCard.compact', self.compact, (bool,), False, True, False)
        _guard_vector('MarkdownCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='markdown',
            box=self.box,
            title=self.title,
            content=self.content,
            data=self.data,
            compact=self.compact,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkdownCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('MarkdownCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('MarkdownCard.title', __d_title, (str,), False, False, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('MarkdownCard.content', __d_content, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_compact: Any = __d.get('compact')
        _guard_scalar('MarkdownCard.compact', __d_compact, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('MarkdownCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        data: Optional[PackedRecord] = __d_data
        compact: Optional[bool] = __d_compact
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MarkdownCard(
            box,
            title,
            content,
            data,
            compact,
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
            compact: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('MarkupCard.box', box, (str,), False, False, False)
        _guard_scalar('MarkupCard.title', title, (str,), False, False, False)
        _guard_scalar('MarkupCard.content', content, (str,), False, False, False)
        _guard_scalar('MarkupCard.compact', compact, (bool,), False, True, False)
        _guard_vector('MarkupCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The HTML content."""
        self.compact = compact
        """True if outer spacing should be removed. Defaults to False."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('MarkupCard.box', self.box, (str,), False, False, False)
        _guard_scalar('MarkupCard.title', self.title, (str,), False, False, False)
        _guard_scalar('MarkupCard.content', self.content, (str,), False, False, False)
        _guard_scalar('MarkupCard.compact', self.compact, (bool,), False, True, False)
        _guard_vector('MarkupCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='markup',
            box=self.box,
            title=self.title,
            content=self.content,
            compact=self.compact,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MarkupCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('MarkupCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('MarkupCard.title', __d_title, (str,), False, False, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('MarkupCard.content', __d_content, (str,), False, False, False)
        __d_compact: Any = __d.get('compact')
        _guard_scalar('MarkupCard.compact', __d_compact, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('MarkupCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        content: str = __d_content
        compact: Optional[bool] = __d_compact
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MarkupCard(
            box,
            title,
            content,
            compact,
            commands,
        )


_NotificationBarType = ['info', 'error', 'warning', 'success', 'danger', 'blocked']


class NotificationBarType:
    INFO = 'info'
    ERROR = 'error'
    WARNING = 'warning'
    SUCCESS = 'success'
    DANGER = 'danger'
    BLOCKED = 'blocked'


_NotificationBarPosition = ['top-right', 'bottom-right', 'bottom-center', 'bottom-left', 'top-left', 'top-center']


class NotificationBarPosition:
    TOP_RIGHT = 'top-right'
    BOTTOM_RIGHT = 'bottom-right'
    BOTTOM_CENTER = 'bottom-center'
    BOTTOM_LEFT = 'bottom-left'
    TOP_LEFT = 'top-left'
    TOP_CENTER = 'top-center'


class NotificationBar:
    """Create a notification bar.

    A notification bar is an area at the edge of a primary view that displays relevant status information.
    You can use a notification bar to tell the user about a result of an action, e.g. "Data has been successfully saved".
    """
    def __init__(
            self,
            text: str,
            type: Optional[str] = None,
            timeout: Optional[int] = None,
            buttons: Optional[List[Component]] = None,
            position: Optional[str] = None,
            events: Optional[List[str]] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('NotificationBar.text', text, (str,), False, False, False)
        _guard_enum('NotificationBar.type', type, _NotificationBarType, True)
        _guard_scalar('NotificationBar.timeout', timeout, (int,), False, True, False)
        _guard_vector('NotificationBar.buttons', buttons, (Component,), False, True, False)
        _guard_enum('NotificationBar.position', position, _NotificationBarPosition, True)
        _guard_vector('NotificationBar.events', events, (str,), False, True, False)
        _guard_scalar('NotificationBar.name', name, (str,), True, True, False)
        self.text = text
        """The text displayed on the notification bar."""
        self.type = type
        """The icon and color of the notification bar. Defaults to 'info'. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.NotificationBarType."""
        self.timeout = timeout
        """How long the notification stays visible, in seconds. If set to -1, the notification has to be closed manually. Defaults to 5."""
        self.buttons = buttons
        """Specify one or more action buttons."""
        self.position = position
        """Specify the location of notification. Defaults to 'top-right'. One of 'top-right', 'bottom-right', 'bottom-center', 'bottom-left', 'top-left', 'top-center'. See enum h2o_wave.ui.NotificationBarPosition."""
        self.events = events
        """The events to capture on this notification bar. One of 'dismissed'."""
        self.name = name
        """An identifying name for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('NotificationBar.text', self.text, (str,), False, False, False)
        _guard_enum('NotificationBar.type', self.type, _NotificationBarType, True)
        _guard_scalar('NotificationBar.timeout', self.timeout, (int,), False, True, False)
        _guard_vector('NotificationBar.buttons', self.buttons, (Component,), False, True, False)
        _guard_enum('NotificationBar.position', self.position, _NotificationBarPosition, True)
        _guard_vector('NotificationBar.events', self.events, (str,), False, True, False)
        _guard_scalar('NotificationBar.name', self.name, (str,), True, True, False)
        return _dump(
            text=self.text,
            type=self.type,
            timeout=self.timeout,
            buttons=None if self.buttons is None else [__e.dump() for __e in self.buttons],
            position=self.position,
            events=self.events,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'NotificationBar':
        """Creates an instance of this class using the contents of a dict."""
        __d_text: Any = __d.get('text')
        _guard_scalar('NotificationBar.text', __d_text, (str,), False, False, False)
        __d_type: Any = __d.get('type')
        _guard_enum('NotificationBar.type', __d_type, _NotificationBarType, True)
        __d_timeout: Any = __d.get('timeout')
        _guard_scalar('NotificationBar.timeout', __d_timeout, (int,), False, True, False)
        __d_buttons: Any = __d.get('buttons')
        _guard_vector('NotificationBar.buttons', __d_buttons, (dict,), False, True, False)
        __d_position: Any = __d.get('position')
        _guard_enum('NotificationBar.position', __d_position, _NotificationBarPosition, True)
        __d_events: Any = __d.get('events')
        _guard_vector('NotificationBar.events', __d_events, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('NotificationBar.name', __d_name, (str,), True, True, False)
        text: str = __d_text
        type: Optional[str] = __d_type
        timeout: Optional[int] = __d_timeout
        buttons: Optional[List[Component]] = None if __d_buttons is None else [Component.load(__e) for __e in __d_buttons]
        position: Optional[str] = __d_position
        events: Optional[List[str]] = __d_events
        name: Optional[str] = __d_name
        return NotificationBar(
            text,
            type,
            timeout,
            buttons,
            position,
            events,
            name,
        )


_ZoneDirection = ['row', 'column']


class ZoneDirection:
    ROW = 'row'
    COLUMN = 'column'


_ZoneJustify = ['start', 'end', 'center', 'between', 'around']


class ZoneJustify:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'


_ZoneAlign = ['start', 'end', 'center', 'stretch']


class ZoneAlign:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    STRETCH = 'stretch'


_ZoneWrap = ['start', 'end', 'center', 'between', 'around', 'stretch']


class ZoneWrap:
    START = 'start'
    END = 'end'
    CENTER = 'center'
    BETWEEN = 'between'
    AROUND = 'around'
    STRETCH = 'stretch'


class Zone:
    """Represents an zone within a page layout.
    """
    def __init__(
            self,
            name: str,
            size: Optional[str] = None,
            direction: Optional[str] = None,
            justify: Optional[str] = None,
            align: Optional[str] = None,
            wrap: Optional[str] = None,
            zones: Optional[List['Zone']] = None,
    ):
        _guard_scalar('Zone.name', name, (str,), True, False, False)
        _guard_scalar('Zone.size', size, (str,), False, True, False)
        _guard_enum('Zone.direction', direction, _ZoneDirection, True)
        _guard_enum('Zone.justify', justify, _ZoneJustify, True)
        _guard_enum('Zone.align', align, _ZoneAlign, True)
        _guard_enum('Zone.wrap', wrap, _ZoneWrap, True)
        _guard_vector('Zone.zones', zones, (Zone,), False, True, False)
        self.name = name
        """An identifying name for this zone."""
        self.size = size
        """The size of this zone."""
        self.direction = direction
        """Layout direction. One of 'row', 'column'. See enum h2o_wave.ui.ZoneDirection."""
        self.justify = justify
        """Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ZoneJustify."""
        self.align = align
        """Layout strategy for cross axis. One of 'start', 'end', 'center', 'stretch'. See enum h2o_wave.ui.ZoneAlign."""
        self.wrap = wrap
        """Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.ZoneWrap."""
        self.zones = zones
        """The sub-zones contained inside this zone."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Zone.name', self.name, (str,), True, False, False)
        _guard_scalar('Zone.size', self.size, (str,), False, True, False)
        _guard_enum('Zone.direction', self.direction, _ZoneDirection, True)
        _guard_enum('Zone.justify', self.justify, _ZoneJustify, True)
        _guard_enum('Zone.align', self.align, _ZoneAlign, True)
        _guard_enum('Zone.wrap', self.wrap, _ZoneWrap, True)
        _guard_vector('Zone.zones', self.zones, (Zone,), False, True, False)
        return _dump(
            name=self.name,
            size=self.size,
            direction=self.direction,
            justify=self.justify,
            align=self.align,
            wrap=self.wrap,
            zones=None if self.zones is None else [__e.dump() for __e in self.zones],
        )

    @staticmethod
    def load(__d: Dict) -> 'Zone':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Zone.name', __d_name, (str,), True, False, False)
        __d_size: Any = __d.get('size')
        _guard_scalar('Zone.size', __d_size, (str,), False, True, False)
        __d_direction: Any = __d.get('direction')
        _guard_enum('Zone.direction', __d_direction, _ZoneDirection, True)
        __d_justify: Any = __d.get('justify')
        _guard_enum('Zone.justify', __d_justify, _ZoneJustify, True)
        __d_align: Any = __d.get('align')
        _guard_enum('Zone.align', __d_align, _ZoneAlign, True)
        __d_wrap: Any = __d.get('wrap')
        _guard_enum('Zone.wrap', __d_wrap, _ZoneWrap, True)
        __d_zones: Any = __d.get('zones')
        _guard_vector('Zone.zones', __d_zones, (dict,), False, True, False)
        name: str = __d_name
        size: Optional[str] = __d_size
        direction: Optional[str] = __d_direction
        justify: Optional[str] = __d_justify
        align: Optional[str] = __d_align
        wrap: Optional[str] = __d_wrap
        zones: Optional[List['Zone']] = None if __d_zones is None else [Zone.load(__e) for __e in __d_zones]
        return Zone(
            name,
            size,
            direction,
            justify,
            align,
            wrap,
            zones,
        )


class Layout:
    """Represents the layout structure for a page.
    """
    def __init__(
            self,
            breakpoint: str,
            zones: List[Zone],
            width: Optional[str] = None,
            min_width: Optional[str] = None,
            max_width: Optional[str] = None,
            height: Optional[str] = None,
            min_height: Optional[str] = None,
            max_height: Optional[str] = None,
            name: Optional[str] = None,
    ):
        _guard_scalar('Layout.breakpoint', breakpoint, (str,), False, False, False)
        _guard_vector('Layout.zones', zones, (Zone,), False, False, False)
        _guard_scalar('Layout.width', width, (str,), False, True, False)
        _guard_scalar('Layout.min_width', min_width, (str,), False, True, False)
        _guard_scalar('Layout.max_width', max_width, (str,), False, True, False)
        _guard_scalar('Layout.height', height, (str,), False, True, False)
        _guard_scalar('Layout.min_height', min_height, (str,), False, True, False)
        _guard_scalar('Layout.max_height', max_height, (str,), False, True, False)
        _guard_scalar('Layout.name', name, (str,), True, True, False)
        self.breakpoint = breakpoint
        """The minimum viewport width at which to use this layout. Values must be pixel widths (e.g. '0px', '576px', '768px') or a named preset. The named presets are: 'xs': '0px' for extra small devices (portrait phones), 's': '576px' for small devices (landscape phones), 'm': '768px' for medium devices (tablets), 'l': '992px' for large devices (desktops), 'xl': '1200px' for extra large devices (large desktops).  A breakpoint value of 'xs' (or '0') matches all viewport widths, unless other breakpoints are set."""
        self.zones = zones
        """The zones in this layout. Each zones can in turn contain sub-zones."""
        self.width = width
        """The width of the layout. Defaults to `100%`."""
        self.min_width = min_width
        """The minimum width of the layout."""
        self.max_width = max_width
        """The maximum width of the layout."""
        self.height = height
        """The height of the layout. Defaults to `auto`."""
        self.min_height = min_height
        """The minimum height of the layout."""
        self.max_height = max_height
        """The maximum height of the layout."""
        self.name = name
        """An identifying name for this zone."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Layout.breakpoint', self.breakpoint, (str,), False, False, False)
        _guard_vector('Layout.zones', self.zones, (Zone,), False, False, False)
        _guard_scalar('Layout.width', self.width, (str,), False, True, False)
        _guard_scalar('Layout.min_width', self.min_width, (str,), False, True, False)
        _guard_scalar('Layout.max_width', self.max_width, (str,), False, True, False)
        _guard_scalar('Layout.height', self.height, (str,), False, True, False)
        _guard_scalar('Layout.min_height', self.min_height, (str,), False, True, False)
        _guard_scalar('Layout.max_height', self.max_height, (str,), False, True, False)
        _guard_scalar('Layout.name', self.name, (str,), True, True, False)
        return _dump(
            breakpoint=self.breakpoint,
            zones=[__e.dump() for __e in self.zones],
            width=self.width,
            min_width=self.min_width,
            max_width=self.max_width,
            height=self.height,
            min_height=self.min_height,
            max_height=self.max_height,
            name=self.name,
        )

    @staticmethod
    def load(__d: Dict) -> 'Layout':
        """Creates an instance of this class using the contents of a dict."""
        __d_breakpoint: Any = __d.get('breakpoint')
        _guard_scalar('Layout.breakpoint', __d_breakpoint, (str,), False, False, False)
        __d_zones: Any = __d.get('zones')
        _guard_vector('Layout.zones', __d_zones, (dict,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Layout.width', __d_width, (str,), False, True, False)
        __d_min_width: Any = __d.get('min_width')
        _guard_scalar('Layout.min_width', __d_min_width, (str,), False, True, False)
        __d_max_width: Any = __d.get('max_width')
        _guard_scalar('Layout.max_width', __d_max_width, (str,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('Layout.height', __d_height, (str,), False, True, False)
        __d_min_height: Any = __d.get('min_height')
        _guard_scalar('Layout.min_height', __d_min_height, (str,), False, True, False)
        __d_max_height: Any = __d.get('max_height')
        _guard_scalar('Layout.max_height', __d_max_height, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Layout.name', __d_name, (str,), True, True, False)
        breakpoint: str = __d_breakpoint
        zones: List[Zone] = [Zone.load(__e) for __e in __d_zones]
        width: Optional[str] = __d_width
        min_width: Optional[str] = __d_min_width
        max_width: Optional[str] = __d_max_width
        height: Optional[str] = __d_height
        min_height: Optional[str] = __d_min_height
        max_height: Optional[str] = __d_max_height
        name: Optional[str] = __d_name
        return Layout(
            breakpoint,
            zones,
            width,
            min_width,
            max_width,
            height,
            min_height,
            max_height,
            name,
        )


class Dialog:
    """A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
    and requires people to interact with it. It’s primarily used for confirming actions,
    such as deleting a file, or asking people to make a choice.
    """
    def __init__(
            self,
            title: str,
            items: List[Component],
            width: Optional[str] = None,
            closable: Optional[bool] = None,
            blocking: Optional[bool] = None,
            primary: Optional[bool] = None,
            name: Optional[str] = None,
            events: Optional[List[str]] = None,
    ):
        _guard_scalar('Dialog.title', title, (str,), False, False, False)
        _guard_vector('Dialog.items', items, (Component,), False, False, False)
        _guard_scalar('Dialog.width', width, (str,), False, True, False)
        _guard_scalar('Dialog.closable', closable, (bool,), False, True, False)
        _guard_scalar('Dialog.blocking', blocking, (bool,), False, True, False)
        _guard_scalar('Dialog.primary', primary, (bool,), False, True, False)
        _guard_scalar('Dialog.name', name, (str,), True, True, False)
        _guard_vector('Dialog.events', events, (str,), False, True, False)
        self.title = title
        """The dialog's title."""
        self.items = items
        """The components displayed in this dialog."""
        self.width = width
        """The width of the dialog, e.g. '400px'. Defaults to '600px'."""
        self.closable = closable
        """True if the dialog should have a closing 'X' button at the top right corner."""
        self.blocking = blocking
        """True to prevent closing when clicking or tapping outside the dialog. Prevents interacting with the page behind the dialog. Defaults to False."""
        self.primary = primary
        """Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to False."""
        self.name = name
        """An identifying name for this component."""
        self.events = events
        """The events to capture on this dialog. One of 'dismissed'."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Dialog.title', self.title, (str,), False, False, False)
        _guard_vector('Dialog.items', self.items, (Component,), False, False, False)
        _guard_scalar('Dialog.width', self.width, (str,), False, True, False)
        _guard_scalar('Dialog.closable', self.closable, (bool,), False, True, False)
        _guard_scalar('Dialog.blocking', self.blocking, (bool,), False, True, False)
        _guard_scalar('Dialog.primary', self.primary, (bool,), False, True, False)
        _guard_scalar('Dialog.name', self.name, (str,), True, True, False)
        _guard_vector('Dialog.events', self.events, (str,), False, True, False)
        return _dump(
            title=self.title,
            items=[__e.dump() for __e in self.items],
            width=self.width,
            closable=self.closable,
            blocking=self.blocking,
            primary=self.primary,
            name=self.name,
            events=self.events,
        )

    @staticmethod
    def load(__d: Dict) -> 'Dialog':
        """Creates an instance of this class using the contents of a dict."""
        __d_title: Any = __d.get('title')
        _guard_scalar('Dialog.title', __d_title, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('Dialog.items', __d_items, (dict,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('Dialog.width', __d_width, (str,), False, True, False)
        __d_closable: Any = __d.get('closable')
        _guard_scalar('Dialog.closable', __d_closable, (bool,), False, True, False)
        __d_blocking: Any = __d.get('blocking')
        _guard_scalar('Dialog.blocking', __d_blocking, (bool,), False, True, False)
        __d_primary: Any = __d.get('primary')
        _guard_scalar('Dialog.primary', __d_primary, (bool,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('Dialog.name', __d_name, (str,), True, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('Dialog.events', __d_events, (str,), False, True, False)
        title: str = __d_title
        items: List[Component] = [Component.load(__e) for __e in __d_items]
        width: Optional[str] = __d_width
        closable: Optional[bool] = __d_closable
        blocking: Optional[bool] = __d_blocking
        primary: Optional[bool] = __d_primary
        name: Optional[str] = __d_name
        events: Optional[List[str]] = __d_events
        return Dialog(
            title,
            items,
            width,
            closable,
            blocking,
            primary,
            name,
            events,
        )


class SidePanel:
    """A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
    and requires people to interact with it. It’s primarily used for confirming actions,
    such as deleting a file, or asking people to make a choice.
    """
    def __init__(
            self,
            title: str,
            items: List[Component],
            width: Optional[str] = None,
            name: Optional[str] = None,
            events: Optional[List[str]] = None,
            blocking: Optional[bool] = None,
            closable: Optional[bool] = None,
    ):
        _guard_scalar('SidePanel.title', title, (str,), False, False, False)
        _guard_vector('SidePanel.items', items, (Component,), False, False, False)
        _guard_scalar('SidePanel.width', width, (str,), False, True, False)
        _guard_scalar('SidePanel.name', name, (str,), True, True, False)
        _guard_vector('SidePanel.events', events, (str,), False, True, False)
        _guard_scalar('SidePanel.blocking', blocking, (bool,), False, True, False)
        _guard_scalar('SidePanel.closable', closable, (bool,), False, True, False)
        self.title = title
        """The side panel's title."""
        self.items = items
        """The components displayed in this side panel."""
        self.width = width
        """The width of the dialog, e.g. '400px'. Defaults to '600px'."""
        self.name = name
        """An identifying name for this component."""
        self.events = events
        """The events to capture on this side panel. One of 'dismissed'."""
        self.blocking = blocking
        """True to prevent closing when clicking or tapping outside the side panel. Prevents interacting with the page behind the side panel. Defaults to False."""
        self.closable = closable
        """True if the side panel should have a closing 'X' button at the top right corner."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('SidePanel.title', self.title, (str,), False, False, False)
        _guard_vector('SidePanel.items', self.items, (Component,), False, False, False)
        _guard_scalar('SidePanel.width', self.width, (str,), False, True, False)
        _guard_scalar('SidePanel.name', self.name, (str,), True, True, False)
        _guard_vector('SidePanel.events', self.events, (str,), False, True, False)
        _guard_scalar('SidePanel.blocking', self.blocking, (bool,), False, True, False)
        _guard_scalar('SidePanel.closable', self.closable, (bool,), False, True, False)
        return _dump(
            title=self.title,
            items=[__e.dump() for __e in self.items],
            width=self.width,
            name=self.name,
            events=self.events,
            blocking=self.blocking,
            closable=self.closable,
        )

    @staticmethod
    def load(__d: Dict) -> 'SidePanel':
        """Creates an instance of this class using the contents of a dict."""
        __d_title: Any = __d.get('title')
        _guard_scalar('SidePanel.title', __d_title, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('SidePanel.items', __d_items, (dict,), False, False, False)
        __d_width: Any = __d.get('width')
        _guard_scalar('SidePanel.width', __d_width, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('SidePanel.name', __d_name, (str,), True, True, False)
        __d_events: Any = __d.get('events')
        _guard_vector('SidePanel.events', __d_events, (str,), False, True, False)
        __d_blocking: Any = __d.get('blocking')
        _guard_scalar('SidePanel.blocking', __d_blocking, (bool,), False, True, False)
        __d_closable: Any = __d.get('closable')
        _guard_scalar('SidePanel.closable', __d_closable, (bool,), False, True, False)
        title: str = __d_title
        items: List[Component] = [Component.load(__e) for __e in __d_items]
        width: Optional[str] = __d_width
        name: Optional[str] = __d_name
        events: Optional[List[str]] = __d_events
        blocking: Optional[bool] = __d_blocking
        closable: Optional[bool] = __d_closable
        return SidePanel(
            title,
            items,
            width,
            name,
            events,
            blocking,
            closable,
        )


class Theme:
    """Theme (color scheme) to apply colors to the app.
    """
    def __init__(
            self,
            name: str,
            text: str,
            card: str,
            page: str,
            primary: str,
    ):
        _guard_scalar('Theme.name', name, (str,), True, False, False)
        _guard_scalar('Theme.text', text, (str,), False, False, False)
        _guard_scalar('Theme.card', card, (str,), False, False, False)
        _guard_scalar('Theme.page', page, (str,), False, False, False)
        _guard_scalar('Theme.primary', primary, (str,), False, False, False)
        self.name = name
        """An identifying name for this theme."""
        self.text = text
        """Base color of the textual components."""
        self.card = card
        """Card background color."""
        self.page = page
        """Page background color."""
        self.primary = primary
        """Primary color used to accent components."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Theme.name', self.name, (str,), True, False, False)
        _guard_scalar('Theme.text', self.text, (str,), False, False, False)
        _guard_scalar('Theme.card', self.card, (str,), False, False, False)
        _guard_scalar('Theme.page', self.page, (str,), False, False, False)
        _guard_scalar('Theme.primary', self.primary, (str,), False, False, False)
        return _dump(
            name=self.name,
            text=self.text,
            card=self.card,
            page=self.page,
            primary=self.primary,
        )

    @staticmethod
    def load(__d: Dict) -> 'Theme':
        """Creates an instance of this class using the contents of a dict."""
        __d_name: Any = __d.get('name')
        _guard_scalar('Theme.name', __d_name, (str,), True, False, False)
        __d_text: Any = __d.get('text')
        _guard_scalar('Theme.text', __d_text, (str,), False, False, False)
        __d_card: Any = __d.get('card')
        _guard_scalar('Theme.card', __d_card, (str,), False, False, False)
        __d_page: Any = __d.get('page')
        _guard_scalar('Theme.page', __d_page, (str,), False, False, False)
        __d_primary: Any = __d.get('primary')
        _guard_scalar('Theme.primary', __d_primary, (str,), False, False, False)
        name: str = __d_name
        text: str = __d_text
        card: str = __d_card
        page: str = __d_page
        primary: str = __d_primary
        return Theme(
            name,
            text,
            card,
            page,
            primary,
        )


_TrackerType = ['ga', 'gtag']


class TrackerType:
    GA = 'ga'
    GTAG = 'gtag'


class Tracker:
    """Configure user interaction tracking (analytics) for a page.
    """
    def __init__(
            self,
            type: str,
            id: str,
    ):
        _guard_enum('Tracker.type', type, _TrackerType, False)
        _guard_scalar('Tracker.id', id, (str,), False, False, False)
        self.type = type
        """The tracking provider. Supported providers are `ga` (Google Analytics) and `gtag` (Google Global Site Tags or gtag.js) One of 'ga', 'gtag'. See enum h2o_wave.ui.TrackerType."""
        self.id = id
        """The tracking ID or measurement ID."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_enum('Tracker.type', self.type, _TrackerType, False)
        _guard_scalar('Tracker.id', self.id, (str,), False, False, False)
        return _dump(
            type=self.type,
            id=self.id,
        )

    @staticmethod
    def load(__d: Dict) -> 'Tracker':
        """Creates an instance of this class using the contents of a dict."""
        __d_type: Any = __d.get('type')
        _guard_enum('Tracker.type', __d_type, _TrackerType, False)
        __d_id: Any = __d.get('id')
        _guard_scalar('Tracker.id', __d_id, (str,), False, False, False)
        type: str = __d_type
        id: str = __d_id
        return Tracker(
            type,
            id,
        )


class Script:
    """Create a reference to an external Javascript file to be included on a page.
    """
    def __init__(
            self,
            path: str,
            asynchronous: Optional[bool] = None,
            cross_origin: Optional[str] = None,
            referrer_policy: Optional[str] = None,
            integrity: Optional[str] = None,
    ):
        _guard_scalar('Script.path', path, (str,), False, False, False)
        _guard_scalar('Script.asynchronous', asynchronous, (bool,), False, True, False)
        _guard_scalar('Script.cross_origin', cross_origin, (str,), False, True, False)
        _guard_scalar('Script.referrer_policy', referrer_policy, (str,), False, True, False)
        _guard_scalar('Script.integrity', integrity, (str,), False, True, False)
        self.path = path
        """The URI of an external script."""
        self.asynchronous = asynchronous
        """Whether to fetch and load this script in parallel to parsing and evaluated as soon as it is available."""
        self.cross_origin = cross_origin
        """The CORS setting for this script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin"""
        self.referrer_policy = referrer_policy
        """Indicates which referrer to send when fetching the script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script"""
        self.integrity = integrity
        """The cryptographic hash to verify the script's integrity. See https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity"""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Script.path', self.path, (str,), False, False, False)
        _guard_scalar('Script.asynchronous', self.asynchronous, (bool,), False, True, False)
        _guard_scalar('Script.cross_origin', self.cross_origin, (str,), False, True, False)
        _guard_scalar('Script.referrer_policy', self.referrer_policy, (str,), False, True, False)
        _guard_scalar('Script.integrity', self.integrity, (str,), False, True, False)
        return _dump(
            path=self.path,
            asynchronous=self.asynchronous,
            cross_origin=self.cross_origin,
            referrer_policy=self.referrer_policy,
            integrity=self.integrity,
        )

    @staticmethod
    def load(__d: Dict) -> 'Script':
        """Creates an instance of this class using the contents of a dict."""
        __d_path: Any = __d.get('path')
        _guard_scalar('Script.path', __d_path, (str,), False, False, False)
        __d_asynchronous: Any = __d.get('asynchronous')
        _guard_scalar('Script.asynchronous', __d_asynchronous, (bool,), False, True, False)
        __d_cross_origin: Any = __d.get('cross_origin')
        _guard_scalar('Script.cross_origin', __d_cross_origin, (str,), False, True, False)
        __d_referrer_policy: Any = __d.get('referrer_policy')
        _guard_scalar('Script.referrer_policy', __d_referrer_policy, (str,), False, True, False)
        __d_integrity: Any = __d.get('integrity')
        _guard_scalar('Script.integrity', __d_integrity, (str,), False, True, False)
        path: str = __d_path
        asynchronous: Optional[bool] = __d_asynchronous
        cross_origin: Optional[str] = __d_cross_origin
        referrer_policy: Optional[str] = __d_referrer_policy
        integrity: Optional[str] = __d_integrity
        return Script(
            path,
            asynchronous,
            cross_origin,
            referrer_policy,
            integrity,
        )


class InlineScript:
    """Create a block of inline Javascript to be executed immediately on a page.
    """
    def __init__(
            self,
            content: str,
            requires: Optional[List[str]] = None,
            targets: Optional[List[str]] = None,
    ):
        _guard_scalar('InlineScript.content', content, (str,), False, False, False)
        _guard_vector('InlineScript.requires', requires, (str,), False, True, False)
        _guard_vector('InlineScript.targets', targets, (str,), False, True, False)
        self.content = content
        """The Javascript source code to be executed."""
        self.requires = requires
        """The names of modules required on the page's `window` global before running this script."""
        self.targets = targets
        """The HTML elements required to be present on the page before running this script. Each 'target' can either be the ID of the element (`foo`) or a CSS selector (`#foo`, `.foo`, `table > td.foo`, etc.)."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('InlineScript.content', self.content, (str,), False, False, False)
        _guard_vector('InlineScript.requires', self.requires, (str,), False, True, False)
        _guard_vector('InlineScript.targets', self.targets, (str,), False, True, False)
        return _dump(
            content=self.content,
            requires=self.requires,
            targets=self.targets,
        )

    @staticmethod
    def load(__d: Dict) -> 'InlineScript':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('InlineScript.content', __d_content, (str,), False, False, False)
        __d_requires: Any = __d.get('requires')
        _guard_vector('InlineScript.requires', __d_requires, (str,), False, True, False)
        __d_targets: Any = __d.get('targets')
        _guard_vector('InlineScript.targets', __d_targets, (str,), False, True, False)
        content: str = __d_content
        requires: Optional[List[str]] = __d_requires
        targets: Optional[List[str]] = __d_targets
        return InlineScript(
            content,
            requires,
            targets,
        )


class InlineStylesheet:
    """Create an inline CSS to be injected into a page.
    """
    def __init__(
            self,
            content: str,
            media: Optional[str] = None,
    ):
        _guard_scalar('InlineStylesheet.content', content, (str,), False, False, False)
        _guard_scalar('InlineStylesheet.media', media, (str,), False, True, False)
        self.content = content
        """The CSS to be applied to this page."""
        self.media = media
        """A valid media query to set conditions for when the style should be applied. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style#attr-media."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('InlineStylesheet.content', self.content, (str,), False, False, False)
        _guard_scalar('InlineStylesheet.media', self.media, (str,), False, True, False)
        return _dump(
            content=self.content,
            media=self.media,
        )

    @staticmethod
    def load(__d: Dict) -> 'InlineStylesheet':
        """Creates an instance of this class using the contents of a dict."""
        __d_content: Any = __d.get('content')
        _guard_scalar('InlineStylesheet.content', __d_content, (str,), False, False, False)
        __d_media: Any = __d.get('media')
        _guard_scalar('InlineStylesheet.media', __d_media, (str,), False, True, False)
        content: str = __d_content
        media: Optional[str] = __d_media
        return InlineStylesheet(
            content,
            media,
        )


class Stylesheet:
    """Create a reference to an external CSS file to be included on a page.
    """
    def __init__(
            self,
            path: str,
            media: Optional[str] = None,
            cross_origin: Optional[str] = None,
    ):
        _guard_scalar('Stylesheet.path', path, (str,), False, False, False)
        _guard_scalar('Stylesheet.media', media, (str,), False, True, False)
        _guard_scalar('Stylesheet.cross_origin', cross_origin, (str,), False, True, False)
        self.path = path
        """The URI of an external stylesheet."""
        self.media = media
        """A valid media query to set conditions for when the stylesheet should be loaded. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-media."""
        self.cross_origin = cross_origin
        """The CORS setting. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-crossorigin"""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Stylesheet.path', self.path, (str,), False, False, False)
        _guard_scalar('Stylesheet.media', self.media, (str,), False, True, False)
        _guard_scalar('Stylesheet.cross_origin', self.cross_origin, (str,), False, True, False)
        return _dump(
            path=self.path,
            media=self.media,
            cross_origin=self.cross_origin,
        )

    @staticmethod
    def load(__d: Dict) -> 'Stylesheet':
        """Creates an instance of this class using the contents of a dict."""
        __d_path: Any = __d.get('path')
        _guard_scalar('Stylesheet.path', __d_path, (str,), False, False, False)
        __d_media: Any = __d.get('media')
        _guard_scalar('Stylesheet.media', __d_media, (str,), False, True, False)
        __d_cross_origin: Any = __d.get('cross_origin')
        _guard_scalar('Stylesheet.cross_origin', __d_cross_origin, (str,), False, True, False)
        path: str = __d_path
        media: Optional[str] = __d_media
        cross_origin: Optional[str] = __d_cross_origin
        return Stylesheet(
            path,
            media,
            cross_origin,
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
            notification_bar: Optional[NotificationBar] = None,
            redirect: Optional[str] = None,
            icon: Optional[str] = None,
            layouts: Optional[List[Layout]] = None,
            dialog: Optional[Dialog] = None,
            side_panel: Optional[SidePanel] = None,
            theme: Optional[str] = None,
            themes: Optional[List[Theme]] = None,
            tracker: Optional[Tracker] = None,
            scripts: Optional[List[Script]] = None,
            script: Optional[InlineScript] = None,
            stylesheet: Optional[InlineStylesheet] = None,
            stylesheets: Optional[List[Stylesheet]] = None,
            animate: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('MetaCard.box', box, (str,), False, False, False)
        _guard_scalar('MetaCard.title', title, (str,), False, True, False)
        _guard_scalar('MetaCard.refresh', refresh, (int,), False, True, False)
        _guard_scalar('MetaCard.notification', notification, (str,), False, True, False)
        _guard_scalar('MetaCard.notification_bar', notification_bar, (NotificationBar,), False, True, False)
        _guard_scalar('MetaCard.redirect', redirect, (str,), False, True, False)
        _guard_scalar('MetaCard.icon', icon, (str,), False, True, False)
        _guard_vector('MetaCard.layouts', layouts, (Layout,), False, True, False)
        _guard_scalar('MetaCard.dialog', dialog, (Dialog,), False, True, False)
        _guard_scalar('MetaCard.side_panel', side_panel, (SidePanel,), False, True, False)
        _guard_scalar('MetaCard.theme', theme, (str,), False, True, False)
        _guard_vector('MetaCard.themes', themes, (Theme,), False, True, False)
        _guard_scalar('MetaCard.tracker', tracker, (Tracker,), False, True, False)
        _guard_vector('MetaCard.scripts', scripts, (Script,), False, True, False)
        _guard_scalar('MetaCard.script', script, (InlineScript,), False, True, False)
        _guard_scalar('MetaCard.stylesheet', stylesheet, (InlineStylesheet,), False, True, False)
        _guard_vector('MetaCard.stylesheets', stylesheets, (Stylesheet,), False, True, False)
        _guard_scalar('MetaCard.animate', animate, (bool,), False, True, False)
        _guard_vector('MetaCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title of the page."""
        self.refresh = refresh
        """Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use)."""
        self.notification = notification
        """Display a desktop notification."""
        self.notification_bar = notification_bar
        """Display an in-app notification bar."""
        self.redirect = redirect
        """Redirect the page to a new URL."""
        self.icon = icon
        """Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers). Not supported in Safari."""
        self.layouts = layouts
        """The layouts supported by this page."""
        self.dialog = dialog
        """Display a dialog on the page."""
        self.side_panel = side_panel
        """Display a side panel on the page."""
        self.theme = theme
        """Specify the name of the theme (color scheme) to use on this page. One of 'light', 'neon' or 'h2o-dark'."""
        self.themes = themes
        """* Themes (color schemes) that define color used in the app."""
        self.tracker = tracker
        """Configure a tracker for the page (for web analytics)."""
        self.scripts = scripts
        """External Javascript files to load into the page."""
        self.script = script
        """Javascript code to execute on this page."""
        self.stylesheet = stylesheet
        """CSS stylesheet to be applied to this page."""
        self.stylesheets = stylesheets
        """External CSS files to load into the page."""
        self.animate = animate
        """EXPERIMENTAL: True to turn on the card animations. Defaults to False."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('MetaCard.box', self.box, (str,), False, False, False)
        _guard_scalar('MetaCard.title', self.title, (str,), False, True, False)
        _guard_scalar('MetaCard.refresh', self.refresh, (int,), False, True, False)
        _guard_scalar('MetaCard.notification', self.notification, (str,), False, True, False)
        _guard_scalar('MetaCard.notification_bar', self.notification_bar, (NotificationBar,), False, True, False)
        _guard_scalar('MetaCard.redirect', self.redirect, (str,), False, True, False)
        _guard_scalar('MetaCard.icon', self.icon, (str,), False, True, False)
        _guard_vector('MetaCard.layouts', self.layouts, (Layout,), False, True, False)
        _guard_scalar('MetaCard.dialog', self.dialog, (Dialog,), False, True, False)
        _guard_scalar('MetaCard.side_panel', self.side_panel, (SidePanel,), False, True, False)
        _guard_scalar('MetaCard.theme', self.theme, (str,), False, True, False)
        _guard_vector('MetaCard.themes', self.themes, (Theme,), False, True, False)
        _guard_scalar('MetaCard.tracker', self.tracker, (Tracker,), False, True, False)
        _guard_vector('MetaCard.scripts', self.scripts, (Script,), False, True, False)
        _guard_scalar('MetaCard.script', self.script, (InlineScript,), False, True, False)
        _guard_scalar('MetaCard.stylesheet', self.stylesheet, (InlineStylesheet,), False, True, False)
        _guard_vector('MetaCard.stylesheets', self.stylesheets, (Stylesheet,), False, True, False)
        _guard_scalar('MetaCard.animate', self.animate, (bool,), False, True, False)
        _guard_vector('MetaCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='meta',
            box=self.box,
            title=self.title,
            refresh=self.refresh,
            notification=self.notification,
            notification_bar=None if self.notification_bar is None else self.notification_bar.dump(),
            redirect=self.redirect,
            icon=self.icon,
            layouts=None if self.layouts is None else [__e.dump() for __e in self.layouts],
            dialog=None if self.dialog is None else self.dialog.dump(),
            side_panel=None if self.side_panel is None else self.side_panel.dump(),
            theme=self.theme,
            themes=None if self.themes is None else [__e.dump() for __e in self.themes],
            tracker=None if self.tracker is None else self.tracker.dump(),
            scripts=None if self.scripts is None else [__e.dump() for __e in self.scripts],
            script=None if self.script is None else self.script.dump(),
            stylesheet=None if self.stylesheet is None else self.stylesheet.dump(),
            stylesheets=None if self.stylesheets is None else [__e.dump() for __e in self.stylesheets],
            animate=self.animate,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'MetaCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('MetaCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('MetaCard.title', __d_title, (str,), False, True, False)
        __d_refresh: Any = __d.get('refresh')
        _guard_scalar('MetaCard.refresh', __d_refresh, (int,), False, True, False)
        __d_notification: Any = __d.get('notification')
        _guard_scalar('MetaCard.notification', __d_notification, (str,), False, True, False)
        __d_notification_bar: Any = __d.get('notification_bar')
        _guard_scalar('MetaCard.notification_bar', __d_notification_bar, (dict,), False, True, False)
        __d_redirect: Any = __d.get('redirect')
        _guard_scalar('MetaCard.redirect', __d_redirect, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('MetaCard.icon', __d_icon, (str,), False, True, False)
        __d_layouts: Any = __d.get('layouts')
        _guard_vector('MetaCard.layouts', __d_layouts, (dict,), False, True, False)
        __d_dialog: Any = __d.get('dialog')
        _guard_scalar('MetaCard.dialog', __d_dialog, (dict,), False, True, False)
        __d_side_panel: Any = __d.get('side_panel')
        _guard_scalar('MetaCard.side_panel', __d_side_panel, (dict,), False, True, False)
        __d_theme: Any = __d.get('theme')
        _guard_scalar('MetaCard.theme', __d_theme, (str,), False, True, False)
        __d_themes: Any = __d.get('themes')
        _guard_vector('MetaCard.themes', __d_themes, (dict,), False, True, False)
        __d_tracker: Any = __d.get('tracker')
        _guard_scalar('MetaCard.tracker', __d_tracker, (dict,), False, True, False)
        __d_scripts: Any = __d.get('scripts')
        _guard_vector('MetaCard.scripts', __d_scripts, (dict,), False, True, False)
        __d_script: Any = __d.get('script')
        _guard_scalar('MetaCard.script', __d_script, (dict,), False, True, False)
        __d_stylesheet: Any = __d.get('stylesheet')
        _guard_scalar('MetaCard.stylesheet', __d_stylesheet, (dict,), False, True, False)
        __d_stylesheets: Any = __d.get('stylesheets')
        _guard_vector('MetaCard.stylesheets', __d_stylesheets, (dict,), False, True, False)
        __d_animate: Any = __d.get('animate')
        _guard_scalar('MetaCard.animate', __d_animate, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('MetaCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: Optional[str] = __d_title
        refresh: Optional[int] = __d_refresh
        notification: Optional[str] = __d_notification
        notification_bar: Optional[NotificationBar] = None if __d_notification_bar is None else NotificationBar.load(__d_notification_bar)
        redirect: Optional[str] = __d_redirect
        icon: Optional[str] = __d_icon
        layouts: Optional[List[Layout]] = None if __d_layouts is None else [Layout.load(__e) for __e in __d_layouts]
        dialog: Optional[Dialog] = None if __d_dialog is None else Dialog.load(__d_dialog)
        side_panel: Optional[SidePanel] = None if __d_side_panel is None else SidePanel.load(__d_side_panel)
        theme: Optional[str] = __d_theme
        themes: Optional[List[Theme]] = None if __d_themes is None else [Theme.load(__e) for __e in __d_themes]
        tracker: Optional[Tracker] = None if __d_tracker is None else Tracker.load(__d_tracker)
        scripts: Optional[List[Script]] = None if __d_scripts is None else [Script.load(__e) for __e in __d_scripts]
        script: Optional[InlineScript] = None if __d_script is None else InlineScript.load(__d_script)
        stylesheet: Optional[InlineStylesheet] = None if __d_stylesheet is None else InlineStylesheet.load(__d_stylesheet)
        stylesheets: Optional[List[Stylesheet]] = None if __d_stylesheets is None else [Stylesheet.load(__e) for __e in __d_stylesheets]
        animate: Optional[bool] = __d_animate
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return MetaCard(
            box,
            title,
            refresh,
            notification,
            notification_bar,
            redirect,
            icon,
            layouts,
            dialog,
            side_panel,
            theme,
            themes,
            tracker,
            scripts,
            script,
            stylesheet,
            stylesheets,
            animate,
            commands,
        )


_NavCardColor = ['card', 'primary']


class NavCardColor:
    CARD = 'card'
    PRIMARY = 'primary'


class NavCard:
    """Create a card containing a navigation pane.
    """
    def __init__(
            self,
            box: str,
            items: List[NavGroup],
            value: Optional[str] = None,
            title: Optional[str] = None,
            subtitle: Optional[str] = None,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
            image: Optional[str] = None,
            persona: Optional[Component] = None,
            secondary_items: Optional[List[Component]] = None,
            color: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('NavCard.box', box, (str,), False, False, False)
        _guard_vector('NavCard.items', items, (NavGroup,), False, False, False)
        _guard_scalar('NavCard.value', value, (str,), False, True, False)
        _guard_scalar('NavCard.title', title, (str,), False, True, False)
        _guard_scalar('NavCard.subtitle', subtitle, (str,), False, True, False)
        _guard_scalar('NavCard.icon', icon, (str,), False, True, False)
        _guard_scalar('NavCard.icon_color', icon_color, (str,), False, True, False)
        _guard_scalar('NavCard.image', image, (str,), False, True, False)
        _guard_scalar('NavCard.persona', persona, (Component,), False, True, False)
        _guard_vector('NavCard.secondary_items', secondary_items, (Component,), False, True, False)
        _guard_enum('NavCard.color', color, _NavCardColor, True)
        _guard_vector('NavCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The navigation groups contained in this pane."""
        self.value = value
        """The name of the active (highlighted) navigation item."""
        self.title = title
        """The card's title."""
        self.subtitle = subtitle
        """The card's subtitle."""
        self.icon = icon
        """The icon, displayed to the left. *"""
        self.icon_color = icon_color
        """The icon's color. *"""
        self.image = image
        """The URL of an image (usually logo) displayed at the top. *"""
        self.persona = persona
        """The user avatar displayed at the top. Mutually exclusive with image, title and subtitle. *"""
        self.secondary_items = secondary_items
        """Items that should be displayed at the bottom of the card if items are not empty, otherwise displayed under subtitle."""
        self.color = color
        """Card background color. Defaults to 'card'. One of 'card', 'primary'. See enum h2o_wave.ui.NavCardColor."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('NavCard.box', self.box, (str,), False, False, False)
        _guard_vector('NavCard.items', self.items, (NavGroup,), False, False, False)
        _guard_scalar('NavCard.value', self.value, (str,), False, True, False)
        _guard_scalar('NavCard.title', self.title, (str,), False, True, False)
        _guard_scalar('NavCard.subtitle', self.subtitle, (str,), False, True, False)
        _guard_scalar('NavCard.icon', self.icon, (str,), False, True, False)
        _guard_scalar('NavCard.icon_color', self.icon_color, (str,), False, True, False)
        _guard_scalar('NavCard.image', self.image, (str,), False, True, False)
        _guard_scalar('NavCard.persona', self.persona, (Component,), False, True, False)
        _guard_vector('NavCard.secondary_items', self.secondary_items, (Component,), False, True, False)
        _guard_enum('NavCard.color', self.color, _NavCardColor, True)
        _guard_vector('NavCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='nav',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            value=self.value,
            title=self.title,
            subtitle=self.subtitle,
            icon=self.icon,
            icon_color=self.icon_color,
            image=self.image,
            persona=None if self.persona is None else self.persona.dump(),
            secondary_items=None if self.secondary_items is None else [__e.dump() for __e in self.secondary_items],
            color=self.color,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'NavCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('NavCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('NavCard.items', __d_items, (dict,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('NavCard.value', __d_value, (str,), False, True, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('NavCard.title', __d_title, (str,), False, True, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('NavCard.subtitle', __d_subtitle, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('NavCard.icon', __d_icon, (str,), False, True, False)
        __d_icon_color: Any = __d.get('icon_color')
        _guard_scalar('NavCard.icon_color', __d_icon_color, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('NavCard.image', __d_image, (str,), False, True, False)
        __d_persona: Any = __d.get('persona')
        _guard_scalar('NavCard.persona', __d_persona, (dict,), False, True, False)
        __d_secondary_items: Any = __d.get('secondary_items')
        _guard_vector('NavCard.secondary_items', __d_secondary_items, (dict,), False, True, False)
        __d_color: Any = __d.get('color')
        _guard_enum('NavCard.color', __d_color, _NavCardColor, True)
        __d_commands: Any = __d.get('commands')
        _guard_vector('NavCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        items: List[NavGroup] = [NavGroup.load(__e) for __e in __d_items]
        value: Optional[str] = __d_value
        title: Optional[str] = __d_title
        subtitle: Optional[str] = __d_subtitle
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        image: Optional[str] = __d_image
        persona: Optional[Component] = None if __d_persona is None else Component.load(__d_persona)
        secondary_items: Optional[List[Component]] = None if __d_secondary_items is None else [Component.load(__e) for __e in __d_secondary_items]
        color: Optional[str] = __d_color
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return NavCard(
            box,
            items,
            value,
            title,
            subtitle,
            icon,
            icon_color,
            image,
            persona,
            secondary_items,
            color,
            commands,
        )


class PixelArtCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card displaying a collaborative Pixel art tool.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('PixelArtCard.box', box, (str,), False, False, False)
        _guard_scalar('PixelArtCard.title', title, (str,), False, False, False)
        _guard_vector('PixelArtCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('PixelArtCard.box', self.box, (str,), False, False, False)
        _guard_scalar('PixelArtCard.title', self.title, (str,), False, False, False)
        _guard_vector('PixelArtCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('PixelArtCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('PixelArtCard.title', __d_title, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('PixelArtCard.commands', __d_commands, (dict,), False, True, False)
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


class PlotCard:
    """Create a card displaying a plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            data: PackedRecord,
            plot: Plot,
            events: Optional[List[str]] = None,
            interactions: Optional[List[str]] = None,
            animate: Optional[bool] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('PlotCard.box', box, (str,), False, False, False)
        _guard_scalar('PlotCard.title', title, (str,), False, False, False)
        _guard_scalar('PlotCard.plot', plot, (Plot,), False, False, False)
        _guard_vector('PlotCard.events', events, (str,), False, True, False)
        _guard_vector('PlotCard.interactions', interactions, (str,), False, True, False)
        _guard_scalar('PlotCard.animate', animate, (bool,), False, True, False)
        _guard_vector('PlotCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.data = data
        """Data for this card."""
        self.plot = plot
        """The plot to be displayed in this card."""
        self.events = events
        """The events to capture on this card. One of 'select_marks'."""
        self.interactions = interactions
        """The interactions to be allowed for this card. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event."""
        self.animate = animate
        """EXPERIMENTAL: True to turn on the chart animations. Defaults to False."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('PlotCard.box', self.box, (str,), False, False, False)
        _guard_scalar('PlotCard.title', self.title, (str,), False, False, False)
        _guard_scalar('PlotCard.plot', self.plot, (Plot,), False, False, False)
        _guard_vector('PlotCard.events', self.events, (str,), False, True, False)
        _guard_vector('PlotCard.interactions', self.interactions, (str,), False, True, False)
        _guard_scalar('PlotCard.animate', self.animate, (bool,), False, True, False)
        _guard_vector('PlotCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='plot',
            box=self.box,
            title=self.title,
            data=self.data,
            plot=self.plot.dump(),
            events=self.events,
            interactions=self.interactions,
            animate=self.animate,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'PlotCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('PlotCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('PlotCard.title', __d_title, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_plot: Any = __d.get('plot')
        _guard_scalar('PlotCard.plot', __d_plot, (dict,), False, False, False)
        __d_events: Any = __d.get('events')
        _guard_vector('PlotCard.events', __d_events, (str,), False, True, False)
        __d_interactions: Any = __d.get('interactions')
        _guard_vector('PlotCard.interactions', __d_interactions, (str,), False, True, False)
        __d_animate: Any = __d.get('animate')
        _guard_scalar('PlotCard.animate', __d_animate, (bool,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('PlotCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        data: PackedRecord = __d_data
        plot: Plot = Plot.load(__d_plot)
        events: Optional[List[str]] = __d_events
        interactions: Optional[List[str]] = __d_interactions
        animate: Optional[bool] = __d_animate
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return PlotCard(
            box,
            title,
            data,
            plot,
            events,
            interactions,
            animate,
            commands,
        )


class PostCard:
    """Create a postcard displaying a persona, image, caption and optional buttons.
    """
    def __init__(
            self,
            box: str,
            persona: Component,
            image: str,
            aux_value: Optional[str] = None,
            caption: Optional[str] = None,
            items: Optional[List[Component]] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('PostCard.box', box, (str,), False, False, False)
        _guard_scalar('PostCard.persona', persona, (Component,), False, False, False)
        _guard_scalar('PostCard.image', image, (str,), False, False, False)
        _guard_scalar('PostCard.aux_value', aux_value, (str,), False, True, False)
        _guard_scalar('PostCard.caption', caption, (str,), False, True, False)
        _guard_vector('PostCard.items', items, (Component,), False, True, False)
        _guard_vector('PostCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.persona = persona
        """The card's user avatar, 'size' prop is restricted to 'xs'."""
        self.image = image
        """The card’s image."""
        self.aux_value = aux_value
        """The card's aux_value, displayed on the right hand side of the image."""
        self.caption = caption
        """The card's caption, displayed below the image."""
        self.items = items
        """The card's buttons, displayed at the bottom."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('PostCard.box', self.box, (str,), False, False, False)
        _guard_scalar('PostCard.persona', self.persona, (Component,), False, False, False)
        _guard_scalar('PostCard.image', self.image, (str,), False, False, False)
        _guard_scalar('PostCard.aux_value', self.aux_value, (str,), False, True, False)
        _guard_scalar('PostCard.caption', self.caption, (str,), False, True, False)
        _guard_vector('PostCard.items', self.items, (Component,), False, True, False)
        _guard_vector('PostCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='post',
            box=self.box,
            persona=self.persona.dump(),
            image=self.image,
            aux_value=self.aux_value,
            caption=self.caption,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'PostCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('PostCard.box', __d_box, (str,), False, False, False)
        __d_persona: Any = __d.get('persona')
        _guard_scalar('PostCard.persona', __d_persona, (dict,), False, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('PostCard.image', __d_image, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('PostCard.aux_value', __d_aux_value, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('PostCard.caption', __d_caption, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('PostCard.items', __d_items, (dict,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('PostCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        persona: Component = Component.load(__d_persona)
        image: str = __d_image
        aux_value: Optional[str] = __d_aux_value
        caption: Optional[str] = __d_caption
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return PostCard(
            box,
            persona,
            image,
            aux_value,
            caption,
            items,
            commands,
        )


class PreviewCard:
    """Create a preview card displaying an image with shadow overlay, title, social icons, caption, and button.
    """
    def __init__(
            self,
            box: str,
            name: str,
            image: str,
            title: Optional[str] = None,
            items: Optional[List[Component]] = None,
            caption: Optional[str] = None,
            label: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('PreviewCard.box', box, (str,), False, False, False)
        _guard_scalar('PreviewCard.name', name, (str,), False, False, False)
        _guard_scalar('PreviewCard.image', image, (str,), False, False, False)
        _guard_scalar('PreviewCard.title', title, (str,), False, True, False)
        _guard_vector('PreviewCard.items', items, (Component,), False, True, False)
        _guard_scalar('PreviewCard.caption', caption, (str,), False, True, False)
        _guard_scalar('PreviewCard.label', label, (str,), False, True, False)
        _guard_vector('PreviewCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.name = name
        """An identifying name for this card. Makes the card clickable if label is not provided, similar to a button."""
        self.image = image
        """The card’s image."""
        self.title = title
        """The card's title"""
        self.items = items
        """Mini buttons displayed at the top-right corner"""
        self.caption = caption
        """The card's caption, displayed below the title."""
        self.label = label
        """Label of a button rendered at the bottom of the card. If specified, the whole card is not clickable anymore."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('PreviewCard.box', self.box, (str,), False, False, False)
        _guard_scalar('PreviewCard.name', self.name, (str,), False, False, False)
        _guard_scalar('PreviewCard.image', self.image, (str,), False, False, False)
        _guard_scalar('PreviewCard.title', self.title, (str,), False, True, False)
        _guard_vector('PreviewCard.items', self.items, (Component,), False, True, False)
        _guard_scalar('PreviewCard.caption', self.caption, (str,), False, True, False)
        _guard_scalar('PreviewCard.label', self.label, (str,), False, True, False)
        _guard_vector('PreviewCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='preview',
            box=self.box,
            name=self.name,
            image=self.image,
            title=self.title,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            caption=self.caption,
            label=self.label,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'PreviewCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('PreviewCard.box', __d_box, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('PreviewCard.name', __d_name, (str,), False, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('PreviewCard.image', __d_image, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('PreviewCard.title', __d_title, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('PreviewCard.items', __d_items, (dict,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('PreviewCard.caption', __d_caption, (str,), False, True, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('PreviewCard.label', __d_label, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('PreviewCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        name: str = __d_name
        image: str = __d_image
        title: Optional[str] = __d_title
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        caption: Optional[str] = __d_caption
        label: Optional[str] = __d_label
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return PreviewCard(
            box,
            name,
            image,
            title,
            items,
            caption,
            label,
            commands,
        )


class ProfileCard:
    """Create a profile card to display information about a user.
    """
    def __init__(
            self,
            box: str,
            persona: Component,
            image: str,
            items: Optional[List[Component]] = None,
            height: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('ProfileCard.box', box, (str,), False, False, False)
        _guard_scalar('ProfileCard.persona', persona, (Component,), False, False, False)
        _guard_scalar('ProfileCard.image', image, (str,), False, False, False)
        _guard_vector('ProfileCard.items', items, (Component,), False, True, False)
        _guard_scalar('ProfileCard.height', height, (str,), False, True, False)
        _guard_vector('ProfileCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.persona = persona
        """The persona represented by this card."""
        self.image = image
        """The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`) or a path to an image hosted on the Wave daemon (starting with `/`). ."""
        self.items = items
        """Components in this card displayed below the image."""
        self.height = height
        """The height of the bottom content (items), e.g. '400px'. Use sparingly, e.g. in grid views."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('ProfileCard.box', self.box, (str,), False, False, False)
        _guard_scalar('ProfileCard.persona', self.persona, (Component,), False, False, False)
        _guard_scalar('ProfileCard.image', self.image, (str,), False, False, False)
        _guard_vector('ProfileCard.items', self.items, (Component,), False, True, False)
        _guard_scalar('ProfileCard.height', self.height, (str,), False, True, False)
        _guard_vector('ProfileCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='profile',
            box=self.box,
            persona=self.persona.dump(),
            image=self.image,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            height=self.height,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'ProfileCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('ProfileCard.box', __d_box, (str,), False, False, False)
        __d_persona: Any = __d.get('persona')
        _guard_scalar('ProfileCard.persona', __d_persona, (dict,), False, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('ProfileCard.image', __d_image, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('ProfileCard.items', __d_items, (dict,), False, True, False)
        __d_height: Any = __d.get('height')
        _guard_scalar('ProfileCard.height', __d_height, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ProfileCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        persona: Component = Component.load(__d_persona)
        image: str = __d_image
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        height: Optional[str] = __d_height
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return ProfileCard(
            box,
            persona,
            image,
            items,
            height,
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
        _guard_scalar('RepeatCard.box', box, (str,), False, False, False)
        _guard_scalar('RepeatCard.item_view', item_view, (str,), False, False, False)
        _guard_vector('RepeatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('RepeatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('RepeatCard.item_view', self.item_view, (str,), False, False, False)
        _guard_vector('RepeatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('RepeatCard.box', __d_box, (str,), False, False, False)
        __d_item_view: Any = __d.get('item_view')
        _guard_scalar('RepeatCard.item_view', __d_item_view, (str,), False, False, False)
        __d_item_props: Any = __d.get('item_props')
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('RepeatCard.commands', __d_commands, (dict,), False, True, False)
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


class SectionCard:
    """Render a card displaying a title, a subtitle, and optional components.
    Section cards are typically used to demarcate different sections on a page.
    """
    def __init__(
            self,
            box: str,
            title: str,
            subtitle: str,
            items: Optional[Union[List[Component], str]] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('SectionCard.box', box, (str,), False, False, False)
        _guard_scalar('SectionCard.title', title, (str,), False, False, False)
        _guard_scalar('SectionCard.subtitle', subtitle, (str,), False, False, False)
        _guard_vector('SectionCard.items', items, (Component,), False, True, True)
        _guard_vector('SectionCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title."""
        self.subtitle = subtitle
        """The subtitle, displayed below the title. Supports Markdown."""
        self.items = items
        """The components to display in this card"""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('SectionCard.box', self.box, (str,), False, False, False)
        _guard_scalar('SectionCard.title', self.title, (str,), False, False, False)
        _guard_scalar('SectionCard.subtitle', self.subtitle, (str,), False, False, False)
        _guard_vector('SectionCard.items', self.items, (Component,), False, True, True)
        _guard_vector('SectionCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='section',
            box=self.box,
            title=self.title,
            subtitle=self.subtitle,
            items=None if self.items is None else self.items if isinstance(self.items, str) else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'SectionCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('SectionCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('SectionCard.title', __d_title, (str,), False, False, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('SectionCard.subtitle', __d_subtitle, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('SectionCard.items', __d_items, (dict,), False, True, True)
        __d_commands: Any = __d.get('commands')
        _guard_vector('SectionCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        subtitle: str = __d_subtitle
        items: Optional[Union[List[Component], str]] = __d_items if isinstance(__d_items, str) else None if __d_items is None else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return SectionCard(
            box,
            title,
            subtitle,
            items,
            commands,
        )


_SmallSeriesStatCardPlotType = ['area', 'interval']


class SmallSeriesStatCardPlotType:
    AREA = 'area'
    INTERVAL = 'interval'


_SmallSeriesStatCardPlotCurve = ['linear', 'smooth', 'step', 'step-after', 'step-before']


class SmallSeriesStatCardPlotCurve:
    LINEAR = 'linear'
    SMOOTH = 'smooth'
    STEP = 'step'
    STEP_AFTER = 'step-after'
    STEP_BEFORE = 'step-before'


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
        _guard_scalar('SmallSeriesStatCard.box', box, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.title', title, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.value', value, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.plot_value', plot_value, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.plot_zero_value', plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('SmallSeriesStatCard.plot_category', plot_category, (str,), False, True, False)
        _guard_enum('SmallSeriesStatCard.plot_type', plot_type, _SmallSeriesStatCardPlotType, True)
        _guard_enum('SmallSeriesStatCard.plot_curve', plot_curve, _SmallSeriesStatCardPlotCurve, True)
        _guard_scalar('SmallSeriesStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('SmallSeriesStatCard.commands', commands, (Command,), False, True, False)
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
        """The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.SmallSeriesStatCardPlotType."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.SmallSeriesStatCardPlotCurve."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('SmallSeriesStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.plot_value', self.plot_value, (str,), False, False, False)
        _guard_scalar('SmallSeriesStatCard.plot_zero_value', self.plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('SmallSeriesStatCard.plot_category', self.plot_category, (str,), False, True, False)
        _guard_enum('SmallSeriesStatCard.plot_type', self.plot_type, _SmallSeriesStatCardPlotType, True)
        _guard_enum('SmallSeriesStatCard.plot_curve', self.plot_curve, _SmallSeriesStatCardPlotCurve, True)
        _guard_scalar('SmallSeriesStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('SmallSeriesStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('SmallSeriesStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('SmallSeriesStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('SmallSeriesStatCard.value', __d_value, (str,), False, False, False)
        __d_plot_data: Any = __d.get('plot_data')
        __d_plot_value: Any = __d.get('plot_value')
        _guard_scalar('SmallSeriesStatCard.plot_value', __d_plot_value, (str,), False, False, False)
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        _guard_scalar('SmallSeriesStatCard.plot_zero_value', __d_plot_zero_value, (float, int,), False, True, False)
        __d_plot_category: Any = __d.get('plot_category')
        _guard_scalar('SmallSeriesStatCard.plot_category', __d_plot_category, (str,), False, True, False)
        __d_plot_type: Any = __d.get('plot_type')
        _guard_enum('SmallSeriesStatCard.plot_type', __d_plot_type, _SmallSeriesStatCardPlotType, True)
        __d_plot_curve: Any = __d.get('plot_curve')
        _guard_enum('SmallSeriesStatCard.plot_curve', __d_plot_curve, _SmallSeriesStatCardPlotCurve, True)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('SmallSeriesStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('SmallSeriesStatCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('SmallStatCard.box', box, (str,), False, False, False)
        _guard_scalar('SmallStatCard.title', title, (str,), False, False, False)
        _guard_scalar('SmallStatCard.value', value, (str,), False, False, False)
        _guard_vector('SmallStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('SmallStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('SmallStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('SmallStatCard.value', self.value, (str,), False, False, False)
        _guard_vector('SmallStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('SmallStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('SmallStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('SmallStatCard.value', __d_value, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('SmallStatCard.commands', __d_commands, (dict,), False, True, False)
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


class StatListItem:
    """Create a stat item (a label-value pair) for stat_list_card.
    """
    def __init__(
            self,
            label: str,
            name: Optional[str] = None,
            caption: Optional[str] = None,
            value: Optional[str] = None,
            value_color: Optional[str] = None,
            aux_value: Optional[str] = None,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
    ):
        _guard_scalar('StatListItem.label', label, (str,), False, False, False)
        _guard_scalar('StatListItem.name', name, (str,), False, True, False)
        _guard_scalar('StatListItem.caption', caption, (str,), False, True, False)
        _guard_scalar('StatListItem.value', value, (str,), False, True, False)
        _guard_scalar('StatListItem.value_color', value_color, (str,), False, True, False)
        _guard_scalar('StatListItem.aux_value', aux_value, (str,), False, True, False)
        _guard_scalar('StatListItem.icon', icon, (str,), False, True, False)
        _guard_scalar('StatListItem.icon_color', icon_color, (str,), False, True, False)
        self.label = label
        """The label for the metric."""
        self.name = name
        """An optional name for this item (required only if this item is clickable)."""
        self.caption = caption
        """The caption for the metric, displayed below the label."""
        self.value = value
        """The primary value of the metric."""
        self.value_color = value_color
        """The font color of the primary value."""
        self.aux_value = aux_value
        """The auxiliary value, displayed below the primary value."""
        self.icon = icon
        """An optional icon, displayed next to the label."""
        self.icon_color = icon_color
        """The color of the icon."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('StatListItem.label', self.label, (str,), False, False, False)
        _guard_scalar('StatListItem.name', self.name, (str,), False, True, False)
        _guard_scalar('StatListItem.caption', self.caption, (str,), False, True, False)
        _guard_scalar('StatListItem.value', self.value, (str,), False, True, False)
        _guard_scalar('StatListItem.value_color', self.value_color, (str,), False, True, False)
        _guard_scalar('StatListItem.aux_value', self.aux_value, (str,), False, True, False)
        _guard_scalar('StatListItem.icon', self.icon, (str,), False, True, False)
        _guard_scalar('StatListItem.icon_color', self.icon_color, (str,), False, True, False)
        return _dump(
            label=self.label,
            name=self.name,
            caption=self.caption,
            value=self.value,
            value_color=self.value_color,
            aux_value=self.aux_value,
            icon=self.icon,
            icon_color=self.icon_color,
        )

    @staticmethod
    def load(__d: Dict) -> 'StatListItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('StatListItem.label', __d_label, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('StatListItem.name', __d_name, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('StatListItem.caption', __d_caption, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('StatListItem.value', __d_value, (str,), False, True, False)
        __d_value_color: Any = __d.get('value_color')
        _guard_scalar('StatListItem.value_color', __d_value_color, (str,), False, True, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('StatListItem.aux_value', __d_aux_value, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('StatListItem.icon', __d_icon, (str,), False, True, False)
        __d_icon_color: Any = __d.get('icon_color')
        _guard_scalar('StatListItem.icon_color', __d_icon_color, (str,), False, True, False)
        label: str = __d_label
        name: Optional[str] = __d_name
        caption: Optional[str] = __d_caption
        value: Optional[str] = __d_value
        value_color: Optional[str] = __d_value_color
        aux_value: Optional[str] = __d_aux_value
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        return StatListItem(
            label,
            name,
            caption,
            value,
            value_color,
            aux_value,
            icon,
            icon_color,
        )


class StatListCard:
    """Render a card displaying a list of stats.
    """
    def __init__(
            self,
            box: str,
            title: str,
            items: List[StatListItem],
            name: Optional[str] = None,
            subtitle: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('StatListCard.box', box, (str,), False, False, False)
        _guard_scalar('StatListCard.title', title, (str,), False, False, False)
        _guard_vector('StatListCard.items', items, (StatListItem,), False, False, False)
        _guard_scalar('StatListCard.name', name, (str,), False, True, False)
        _guard_scalar('StatListCard.subtitle', subtitle, (str,), False, True, False)
        _guard_vector('StatListCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title."""
        self.items = items
        """The individual stats to be displayed."""
        self.name = name
        """An optional name for this item."""
        self.subtitle = subtitle
        """The subtitle, displayed below the title."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('StatListCard.box', self.box, (str,), False, False, False)
        _guard_scalar('StatListCard.title', self.title, (str,), False, False, False)
        _guard_vector('StatListCard.items', self.items, (StatListItem,), False, False, False)
        _guard_scalar('StatListCard.name', self.name, (str,), False, True, False)
        _guard_scalar('StatListCard.subtitle', self.subtitle, (str,), False, True, False)
        _guard_vector('StatListCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='stat_list',
            box=self.box,
            title=self.title,
            items=[__e.dump() for __e in self.items],
            name=self.name,
            subtitle=self.subtitle,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'StatListCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('StatListCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('StatListCard.title', __d_title, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('StatListCard.items', __d_items, (dict,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('StatListCard.name', __d_name, (str,), False, True, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('StatListCard.subtitle', __d_subtitle, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('StatListCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        items: List[StatListItem] = [StatListItem.load(__e) for __e in __d_items]
        name: Optional[str] = __d_name
        subtitle: Optional[str] = __d_subtitle
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return StatListCard(
            box,
            title,
            items,
            name,
            subtitle,
            commands,
        )


class StatTableItem:
    """Create a stat item (a label and a set of values) for stat_table_card.
    """
    def __init__(
            self,
            label: str,
            values: List[str],
            name: Optional[str] = None,
            caption: Optional[str] = None,
            icon: Optional[str] = None,
            icon_color: Optional[str] = None,
            colors: Optional[List[str]] = None,
    ):
        _guard_scalar('StatTableItem.label', label, (str,), False, False, False)
        _guard_vector('StatTableItem.values', values, (str,), False, False, False)
        _guard_scalar('StatTableItem.name', name, (str,), False, True, False)
        _guard_scalar('StatTableItem.caption', caption, (str,), False, True, False)
        _guard_scalar('StatTableItem.icon', icon, (str,), False, True, False)
        _guard_scalar('StatTableItem.icon_color', icon_color, (str,), False, True, False)
        _guard_vector('StatTableItem.colors', colors, (str,), False, True, False)
        self.label = label
        """The label for the row."""
        self.values = values
        """The values displayed in the row."""
        self.name = name
        """An optional name for this row (required only if this row is clickable)."""
        self.caption = caption
        """The caption for the metric, displayed below the label."""
        self.icon = icon
        """An optional icon, displayed next to the label."""
        self.icon_color = icon_color
        """The color of the icon."""
        self.colors = colors
        """List of colors used for each value in values ordered respectively."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('StatTableItem.label', self.label, (str,), False, False, False)
        _guard_vector('StatTableItem.values', self.values, (str,), False, False, False)
        _guard_scalar('StatTableItem.name', self.name, (str,), False, True, False)
        _guard_scalar('StatTableItem.caption', self.caption, (str,), False, True, False)
        _guard_scalar('StatTableItem.icon', self.icon, (str,), False, True, False)
        _guard_scalar('StatTableItem.icon_color', self.icon_color, (str,), False, True, False)
        _guard_vector('StatTableItem.colors', self.colors, (str,), False, True, False)
        return _dump(
            label=self.label,
            values=self.values,
            name=self.name,
            caption=self.caption,
            icon=self.icon,
            icon_color=self.icon_color,
            colors=self.colors,
        )

    @staticmethod
    def load(__d: Dict) -> 'StatTableItem':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('StatTableItem.label', __d_label, (str,), False, False, False)
        __d_values: Any = __d.get('values')
        _guard_vector('StatTableItem.values', __d_values, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('StatTableItem.name', __d_name, (str,), False, True, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('StatTableItem.caption', __d_caption, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('StatTableItem.icon', __d_icon, (str,), False, True, False)
        __d_icon_color: Any = __d.get('icon_color')
        _guard_scalar('StatTableItem.icon_color', __d_icon_color, (str,), False, True, False)
        __d_colors: Any = __d.get('colors')
        _guard_vector('StatTableItem.colors', __d_colors, (str,), False, True, False)
        label: str = __d_label
        values: List[str] = __d_values
        name: Optional[str] = __d_name
        caption: Optional[str] = __d_caption
        icon: Optional[str] = __d_icon
        icon_color: Optional[str] = __d_icon_color
        colors: Optional[List[str]] = __d_colors
        return StatTableItem(
            label,
            values,
            name,
            caption,
            icon,
            icon_color,
            colors,
        )


class StatTableCard:
    """Render a card displaying a table of stats.
    """
    def __init__(
            self,
            box: str,
            title: str,
            columns: List[str],
            items: List[StatTableItem],
            name: Optional[str] = None,
            subtitle: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('StatTableCard.box', box, (str,), False, False, False)
        _guard_scalar('StatTableCard.title', title, (str,), False, False, False)
        _guard_vector('StatTableCard.columns', columns, (str,), False, False, False)
        _guard_vector('StatTableCard.items', items, (StatTableItem,), False, False, False)
        _guard_scalar('StatTableCard.name', name, (str,), False, True, False)
        _guard_scalar('StatTableCard.subtitle', subtitle, (str,), False, True, False)
        _guard_vector('StatTableCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title."""
        self.columns = columns
        """The names of this table's columns."""
        self.items = items
        """The rows displayed in this table."""
        self.name = name
        """An optional name for this item."""
        self.subtitle = subtitle
        """The subtitle, displayed below the title."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('StatTableCard.box', self.box, (str,), False, False, False)
        _guard_scalar('StatTableCard.title', self.title, (str,), False, False, False)
        _guard_vector('StatTableCard.columns', self.columns, (str,), False, False, False)
        _guard_vector('StatTableCard.items', self.items, (StatTableItem,), False, False, False)
        _guard_scalar('StatTableCard.name', self.name, (str,), False, True, False)
        _guard_scalar('StatTableCard.subtitle', self.subtitle, (str,), False, True, False)
        _guard_vector('StatTableCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='stat_table',
            box=self.box,
            title=self.title,
            columns=self.columns,
            items=[__e.dump() for __e in self.items],
            name=self.name,
            subtitle=self.subtitle,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'StatTableCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('StatTableCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('StatTableCard.title', __d_title, (str,), False, False, False)
        __d_columns: Any = __d.get('columns')
        _guard_vector('StatTableCard.columns', __d_columns, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('StatTableCard.items', __d_items, (dict,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('StatTableCard.name', __d_name, (str,), False, True, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('StatTableCard.subtitle', __d_subtitle, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('StatTableCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        columns: List[str] = __d_columns
        items: List[StatTableItem] = [StatTableItem.load(__e) for __e in __d_items]
        name: Optional[str] = __d_name
        subtitle: Optional[str] = __d_subtitle
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return StatTableCard(
            box,
            title,
            columns,
            items,
            name,
            subtitle,
            commands,
        )


class TabCard:
    """Create a card containing tabs for navigation.
    """
    def __init__(
            self,
            box: str,
            items: List[Tab],
            value: Optional[str] = None,
            link: Optional[bool] = None,
            name: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('TabCard.box', box, (str,), False, False, False)
        _guard_vector('TabCard.items', items, (Tab,), False, False, False)
        _guard_scalar('TabCard.value', value, (str,), False, True, False)
        _guard_scalar('TabCard.link', link, (bool,), False, True, False)
        _guard_scalar('TabCard.name', name, (str,), False, True, False)
        _guard_vector('TabCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The tabs to display in this card"""
        self.value = value
        """The name of the tab to select."""
        self.link = link
        """True if tabs should be rendered as links instead of buttons."""
        self.name = name
        """An optional name for the card. If provided, the selected tab can be accessed using the name of the card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TabCard.box', self.box, (str,), False, False, False)
        _guard_vector('TabCard.items', self.items, (Tab,), False, False, False)
        _guard_scalar('TabCard.value', self.value, (str,), False, True, False)
        _guard_scalar('TabCard.link', self.link, (bool,), False, True, False)
        _guard_scalar('TabCard.name', self.name, (str,), False, True, False)
        _guard_vector('TabCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='tab',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            value=self.value,
            link=self.link,
            name=self.name,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TabCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('TabCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('TabCard.items', __d_items, (dict,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('TabCard.value', __d_value, (str,), False, True, False)
        __d_link: Any = __d.get('link')
        _guard_scalar('TabCard.link', __d_link, (bool,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TabCard.name', __d_name, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TabCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        items: List[Tab] = [Tab.load(__e) for __e in __d_items]
        value: Optional[str] = __d_value
        link: Optional[bool] = __d_link
        name: Optional[str] = __d_name
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TabCard(
            box,
            items,
            value,
            link,
            name,
            commands,
        )


class TallArticlePreviewCard:
    """Create a tall article preview card.
    """
    def __init__(
            self,
            box: str,
            title: str,
            image: str,
            subtitle: Optional[str] = None,
            value: Optional[str] = None,
            content: Optional[str] = None,
            name: Optional[str] = None,
            items: Optional[List[Component]] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('TallArticlePreviewCard.box', box, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.title', title, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.image', image, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.subtitle', subtitle, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.value', value, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.content', content, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.name', name, (str,), False, True, False)
        _guard_vector('TallArticlePreviewCard.items', items, (Component,), False, True, False)
        _guard_vector('TallArticlePreviewCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.image = image
        """The card’s background image URL, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`) or a path to an image hosted on the Wave daemon (starting with `/`)"""
        self.subtitle = subtitle
        """The card's subtitle, displayed below the title."""
        self.value = value
        """The value displayed to the right of the title/subtitle."""
        self.content = content
        """Markdown text."""
        self.name = name
        """An identifying name for this card. Makes the card clickable, similar to a button."""
        self.items = items
        """Components displayed in the body of the card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TallArticlePreviewCard.box', self.box, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.title', self.title, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.image', self.image, (str,), False, False, False)
        _guard_scalar('TallArticlePreviewCard.subtitle', self.subtitle, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.value', self.value, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.content', self.content, (str,), False, True, False)
        _guard_scalar('TallArticlePreviewCard.name', self.name, (str,), False, True, False)
        _guard_vector('TallArticlePreviewCard.items', self.items, (Component,), False, True, False)
        _guard_vector('TallArticlePreviewCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='tall_article_preview',
            box=self.box,
            title=self.title,
            image=self.image,
            subtitle=self.subtitle,
            value=self.value,
            content=self.content,
            name=self.name,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TallArticlePreviewCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('TallArticlePreviewCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TallArticlePreviewCard.title', __d_title, (str,), False, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('TallArticlePreviewCard.image', __d_image, (str,), False, False, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('TallArticlePreviewCard.subtitle', __d_subtitle, (str,), False, True, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('TallArticlePreviewCard.value', __d_value, (str,), False, True, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('TallArticlePreviewCard.content', __d_content, (str,), False, True, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TallArticlePreviewCard.name', __d_name, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('TallArticlePreviewCard.items', __d_items, (dict,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TallArticlePreviewCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        image: str = __d_image
        subtitle: Optional[str] = __d_subtitle
        value: Optional[str] = __d_value
        content: Optional[str] = __d_content
        name: Optional[str] = __d_name
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TallArticlePreviewCard(
            box,
            title,
            image,
            subtitle,
            value,
            content,
            name,
            items,
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
        _guard_scalar('TallGaugeStatCard.box', box, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.title', title, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.value', value, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.progress', progress, (float, int,), False, False, False)
        _guard_scalar('TallGaugeStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('TallGaugeStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('TallGaugeStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('TallGaugeStatCard.progress', self.progress, (float, int,), False, False, False)
        _guard_scalar('TallGaugeStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('TallGaugeStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('TallGaugeStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TallGaugeStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('TallGaugeStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('TallGaugeStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_progress: Any = __d.get('progress')
        _guard_scalar('TallGaugeStatCard.progress', __d_progress, (float, int,), False, False, False)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('TallGaugeStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('TallGaugeStatCard.commands', __d_commands, (dict,), False, True, False)
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


class TallInfoCard:
    """Create a tall information card displaying a title, caption and either an icon or image.
    """
    def __init__(
            self,
            box: str,
            name: str,
            title: str,
            caption: str,
            label: Optional[str] = None,
            icon: Optional[str] = None,
            image: Optional[str] = None,
            image_height: Optional[str] = None,
            category: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('TallInfoCard.box', box, (str,), False, False, False)
        _guard_scalar('TallInfoCard.name', name, (str,), False, False, False)
        _guard_scalar('TallInfoCard.title', title, (str,), False, False, False)
        _guard_scalar('TallInfoCard.caption', caption, (str,), False, False, False)
        _guard_scalar('TallInfoCard.label', label, (str,), False, True, False)
        _guard_scalar('TallInfoCard.icon', icon, (str,), False, True, False)
        _guard_scalar('TallInfoCard.image', image, (str,), False, True, False)
        _guard_scalar('TallInfoCard.image_height', image_height, (str,), False, True, False)
        _guard_scalar('TallInfoCard.category', category, (str,), False, True, False)
        _guard_vector('TallInfoCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.name = name
        """An identifying name for this card. Makes the card clickable only if name is not empty and label is empty"""
        self.title = title
        """The card's title."""
        self.caption = caption
        """The card's caption, displayed below the title. Supports markdown."""
        self.label = label
        """Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore."""
        self.icon = icon
        """The card's icon."""
        self.image = image
        """The card’s image."""
        self.image_height = image_height
        """The card’s image height in px. Defaults to '150px'."""
        self.category = category
        """The card's category, displayed below the title."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TallInfoCard.box', self.box, (str,), False, False, False)
        _guard_scalar('TallInfoCard.name', self.name, (str,), False, False, False)
        _guard_scalar('TallInfoCard.title', self.title, (str,), False, False, False)
        _guard_scalar('TallInfoCard.caption', self.caption, (str,), False, False, False)
        _guard_scalar('TallInfoCard.label', self.label, (str,), False, True, False)
        _guard_scalar('TallInfoCard.icon', self.icon, (str,), False, True, False)
        _guard_scalar('TallInfoCard.image', self.image, (str,), False, True, False)
        _guard_scalar('TallInfoCard.image_height', self.image_height, (str,), False, True, False)
        _guard_scalar('TallInfoCard.category', self.category, (str,), False, True, False)
        _guard_vector('TallInfoCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='tall_info',
            box=self.box,
            name=self.name,
            title=self.title,
            caption=self.caption,
            label=self.label,
            icon=self.icon,
            image=self.image,
            image_height=self.image_height,
            category=self.category,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TallInfoCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('TallInfoCard.box', __d_box, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TallInfoCard.name', __d_name, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TallInfoCard.title', __d_title, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('TallInfoCard.caption', __d_caption, (str,), False, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('TallInfoCard.label', __d_label, (str,), False, True, False)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('TallInfoCard.icon', __d_icon, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('TallInfoCard.image', __d_image, (str,), False, True, False)
        __d_image_height: Any = __d.get('image_height')
        _guard_scalar('TallInfoCard.image_height', __d_image_height, (str,), False, True, False)
        __d_category: Any = __d.get('category')
        _guard_scalar('TallInfoCard.category', __d_category, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TallInfoCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        name: str = __d_name
        title: str = __d_title
        caption: str = __d_caption
        label: Optional[str] = __d_label
        icon: Optional[str] = __d_icon
        image: Optional[str] = __d_image
        image_height: Optional[str] = __d_image_height
        category: Optional[str] = __d_category
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TallInfoCard(
            box,
            name,
            title,
            caption,
            label,
            icon,
            image,
            image_height,
            category,
            commands,
        )


_TallSeriesStatCardPlotType = ['area', 'interval']


class TallSeriesStatCardPlotType:
    AREA = 'area'
    INTERVAL = 'interval'


_TallSeriesStatCardPlotCurve = ['linear', 'smooth', 'step', 'step-after', 'step-before']


class TallSeriesStatCardPlotCurve:
    LINEAR = 'linear'
    SMOOTH = 'smooth'
    STEP = 'step'
    STEP_AFTER = 'step-after'
    STEP_BEFORE = 'step-before'


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
        _guard_scalar('TallSeriesStatCard.box', box, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.title', title, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.value', value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.plot_value', plot_value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.plot_zero_value', plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('TallSeriesStatCard.plot_category', plot_category, (str,), False, True, False)
        _guard_enum('TallSeriesStatCard.plot_type', plot_type, _TallSeriesStatCardPlotType, True)
        _guard_enum('TallSeriesStatCard.plot_curve', plot_curve, _TallSeriesStatCardPlotCurve, True)
        _guard_scalar('TallSeriesStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('TallSeriesStatCard.commands', commands, (Command,), False, True, False)
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
        """The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.TallSeriesStatCardPlotType."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.TallSeriesStatCardPlotCurve."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TallSeriesStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.plot_value', self.plot_value, (str,), False, False, False)
        _guard_scalar('TallSeriesStatCard.plot_zero_value', self.plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('TallSeriesStatCard.plot_category', self.plot_category, (str,), False, True, False)
        _guard_enum('TallSeriesStatCard.plot_type', self.plot_type, _TallSeriesStatCardPlotType, True)
        _guard_enum('TallSeriesStatCard.plot_curve', self.plot_curve, _TallSeriesStatCardPlotCurve, True)
        _guard_scalar('TallSeriesStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('TallSeriesStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('TallSeriesStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TallSeriesStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('TallSeriesStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('TallSeriesStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_plot_data: Any = __d.get('plot_data')
        __d_plot_value: Any = __d.get('plot_value')
        _guard_scalar('TallSeriesStatCard.plot_value', __d_plot_value, (str,), False, False, False)
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        _guard_scalar('TallSeriesStatCard.plot_zero_value', __d_plot_zero_value, (float, int,), False, True, False)
        __d_plot_category: Any = __d.get('plot_category')
        _guard_scalar('TallSeriesStatCard.plot_category', __d_plot_category, (str,), False, True, False)
        __d_plot_type: Any = __d.get('plot_type')
        _guard_enum('TallSeriesStatCard.plot_type', __d_plot_type, _TallSeriesStatCardPlotType, True)
        __d_plot_curve: Any = __d.get('plot_curve')
        _guard_enum('TallSeriesStatCard.plot_curve', __d_plot_curve, _TallSeriesStatCardPlotCurve, True)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('TallSeriesStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('TallSeriesStatCard.commands', __d_commands, (dict,), False, True, False)
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


class TallStatsCard:
    """Create a vertical label-value pairs collection. Icon in `ui.stat` is not yet supported in this card.
    """
    def __init__(
            self,
            box: str,
            items: List[Stat],
            name: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('TallStatsCard.box', box, (str,), False, False, False)
        _guard_vector('TallStatsCard.items', items, (Stat,), False, False, False)
        _guard_scalar('TallStatsCard.name', name, (str,), False, True, False)
        _guard_vector('TallStatsCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.items = items
        """The individual stats to be displayed."""
        self.name = name
        """An identifying name for this component."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TallStatsCard.box', self.box, (str,), False, False, False)
        _guard_vector('TallStatsCard.items', self.items, (Stat,), False, False, False)
        _guard_scalar('TallStatsCard.name', self.name, (str,), False, True, False)
        _guard_vector('TallStatsCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='tall_stats',
            box=self.box,
            items=[__e.dump() for __e in self.items],
            name=self.name,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'TallStatsCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('TallStatsCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('TallStatsCard.items', __d_items, (dict,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('TallStatsCard.name', __d_name, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('TallStatsCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        items: List[Stat] = [Stat.load(__e) for __e in __d_items]
        name: Optional[str] = __d_name
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return TallStatsCard(
            box,
            items,
            name,
            commands,
        )


class TemplateCard:
    """Render dynamic content using an HTML template.
    """
    def __init__(
            self,
            box: str,
            title: str,
            content: str,
            data: Optional[PackedRecord] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('TemplateCard.box', box, (str,), False, False, False)
        _guard_scalar('TemplateCard.title', title, (str,), False, False, False)
        _guard_scalar('TemplateCard.content', content, (str,), False, False, False)
        _guard_vector('TemplateCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title for this card."""
        self.content = content
        """The Handlebars template. https://handlebarsjs.com/guide/"""
        self.data = data
        """Data for the Handlebars template."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('TemplateCard.box', self.box, (str,), False, False, False)
        _guard_scalar('TemplateCard.title', self.title, (str,), False, False, False)
        _guard_scalar('TemplateCard.content', self.content, (str,), False, False, False)
        _guard_vector('TemplateCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('TemplateCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('TemplateCard.title', __d_title, (str,), False, False, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('TemplateCard.content', __d_content, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('TemplateCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('ToolbarCard.box', box, (str,), False, False, False)
        _guard_vector('ToolbarCard.items', items, (Command,), False, False, False)
        _guard_vector('ToolbarCard.secondary_items', secondary_items, (Command,), False, True, False)
        _guard_vector('ToolbarCard.overflow_items', overflow_items, (Command,), False, True, False)
        _guard_vector('ToolbarCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('ToolbarCard.box', self.box, (str,), False, False, False)
        _guard_vector('ToolbarCard.items', self.items, (Command,), False, False, False)
        _guard_vector('ToolbarCard.secondary_items', self.secondary_items, (Command,), False, True, False)
        _guard_vector('ToolbarCard.overflow_items', self.overflow_items, (Command,), False, True, False)
        _guard_vector('ToolbarCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('ToolbarCard.box', __d_box, (str,), False, False, False)
        __d_items: Any = __d.get('items')
        _guard_vector('ToolbarCard.items', __d_items, (dict,), False, False, False)
        __d_secondary_items: Any = __d.get('secondary_items')
        _guard_vector('ToolbarCard.secondary_items', __d_secondary_items, (dict,), False, True, False)
        __d_overflow_items: Any = __d.get('overflow_items')
        _guard_vector('ToolbarCard.overflow_items', __d_overflow_items, (dict,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('ToolbarCard.commands', __d_commands, (dict,), False, True, False)
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


_VegaCardGrammar = ['vega-lite', 'vega']


class VegaCardGrammar:
    VEGA_LITE = 'vega-lite'
    VEGA = 'vega'


class VegaCard:
    """Create a card containing a Vega-lite plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            specification: str,
            data: Optional[PackedRecord] = None,
            grammar: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('VegaCard.box', box, (str,), False, False, False)
        _guard_scalar('VegaCard.title', title, (str,), False, False, False)
        _guard_scalar('VegaCard.specification', specification, (str,), False, False, False)
        _guard_enum('VegaCard.grammar', grammar, _VegaCardGrammar, True)
        _guard_vector('VegaCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The title of this card."""
        self.specification = specification
        """The Vega-lite specification."""
        self.data = data
        """Data for the plot, if any."""
        self.grammar = grammar
        """Vega grammar to use. Defaults to 'vega-lite'. One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaCardGrammar."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('VegaCard.box', self.box, (str,), False, False, False)
        _guard_scalar('VegaCard.title', self.title, (str,), False, False, False)
        _guard_scalar('VegaCard.specification', self.specification, (str,), False, False, False)
        _guard_enum('VegaCard.grammar', self.grammar, _VegaCardGrammar, True)
        _guard_vector('VegaCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='vega',
            box=self.box,
            title=self.title,
            specification=self.specification,
            data=self.data,
            grammar=self.grammar,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'VegaCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('VegaCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('VegaCard.title', __d_title, (str,), False, False, False)
        __d_specification: Any = __d.get('specification')
        _guard_scalar('VegaCard.specification', __d_specification, (str,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_grammar: Any = __d.get('grammar')
        _guard_enum('VegaCard.grammar', __d_grammar, _VegaCardGrammar, True)
        __d_commands: Any = __d.get('commands')
        _guard_vector('VegaCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        specification: str = __d_specification
        data: Optional[PackedRecord] = __d_data
        grammar: Optional[str] = __d_grammar
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return VegaCard(
            box,
            title,
            specification,
            data,
            grammar,
            commands,
        )


class WideArticlePreviewCard:
    """Create a wide article preview card displaying a persona, image, title, caption, and optional buttons.
    """
    def __init__(
            self,
            box: str,
            persona: Component,
            image: str,
            title: str,
            name: Optional[str] = None,
            aux_value: Optional[str] = None,
            items: Optional[List[Component]] = None,
            content: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('WideArticlePreviewCard.box', box, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.persona', persona, (Component,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.image', image, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.title', title, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.name', name, (str,), False, True, False)
        _guard_scalar('WideArticlePreviewCard.aux_value', aux_value, (str,), False, True, False)
        _guard_vector('WideArticlePreviewCard.items', items, (Component,), False, True, False)
        _guard_scalar('WideArticlePreviewCard.content', content, (str,), False, True, False)
        _guard_vector('WideArticlePreviewCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.persona = persona
        """The card's user avatar, 'size' prop is restricted to 'xs'."""
        self.image = image
        """The card’s image displayed on the left-hand side."""
        self.title = title
        """The card's title on the right-hand side"""
        self.name = name
        """An identifying name for this card. Makes the card clickable, similar to a button."""
        self.aux_value = aux_value
        """The card's auxiliary text, displayed on the right-hand side of the header."""
        self.items = items
        """The card's buttons, displayed under the caption."""
        self.content = content
        """The card's markdown content, displayed below the title on the right-hand side."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('WideArticlePreviewCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.persona', self.persona, (Component,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.image', self.image, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WideArticlePreviewCard.name', self.name, (str,), False, True, False)
        _guard_scalar('WideArticlePreviewCard.aux_value', self.aux_value, (str,), False, True, False)
        _guard_vector('WideArticlePreviewCard.items', self.items, (Component,), False, True, False)
        _guard_scalar('WideArticlePreviewCard.content', self.content, (str,), False, True, False)
        _guard_vector('WideArticlePreviewCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='wide_article_preview',
            box=self.box,
            persona=self.persona.dump(),
            image=self.image,
            title=self.title,
            name=self.name,
            aux_value=self.aux_value,
            items=None if self.items is None else [__e.dump() for __e in self.items],
            content=self.content,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WideArticlePreviewCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('WideArticlePreviewCard.box', __d_box, (str,), False, False, False)
        __d_persona: Any = __d.get('persona')
        _guard_scalar('WideArticlePreviewCard.persona', __d_persona, (dict,), False, False, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('WideArticlePreviewCard.image', __d_image, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WideArticlePreviewCard.title', __d_title, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('WideArticlePreviewCard.name', __d_name, (str,), False, True, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('WideArticlePreviewCard.aux_value', __d_aux_value, (str,), False, True, False)
        __d_items: Any = __d.get('items')
        _guard_vector('WideArticlePreviewCard.items', __d_items, (dict,), False, True, False)
        __d_content: Any = __d.get('content')
        _guard_scalar('WideArticlePreviewCard.content', __d_content, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('WideArticlePreviewCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        persona: Component = Component.load(__d_persona)
        image: str = __d_image
        title: str = __d_title
        name: Optional[str] = __d_name
        aux_value: Optional[str] = __d_aux_value
        items: Optional[List[Component]] = None if __d_items is None else [Component.load(__e) for __e in __d_items]
        content: Optional[str] = __d_content
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WideArticlePreviewCard(
            box,
            persona,
            image,
            title,
            name,
            aux_value,
            items,
            content,
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
        _guard_scalar('WideBarStatCard.box', box, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.title', title, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.value', value, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.progress', progress, (float, int,), False, False, False)
        _guard_scalar('WideBarStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('WideBarStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('WideBarStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('WideBarStatCard.progress', self.progress, (float, int,), False, False, False)
        _guard_scalar('WideBarStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('WideBarStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('WideBarStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WideBarStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('WideBarStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('WideBarStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_progress: Any = __d.get('progress')
        _guard_scalar('WideBarStatCard.progress', __d_progress, (float, int,), False, False, False)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('WideBarStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('WideBarStatCard.commands', __d_commands, (dict,), False, True, False)
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
        _guard_scalar('WideGaugeStatCard.box', box, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.title', title, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.value', value, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.progress', progress, (float, int,), False, False, False)
        _guard_scalar('WideGaugeStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('WideGaugeStatCard.commands', commands, (Command,), False, True, False)
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
        _guard_scalar('WideGaugeStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('WideGaugeStatCard.progress', self.progress, (float, int,), False, False, False)
        _guard_scalar('WideGaugeStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('WideGaugeStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('WideGaugeStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WideGaugeStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('WideGaugeStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('WideGaugeStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_progress: Any = __d.get('progress')
        _guard_scalar('WideGaugeStatCard.progress', __d_progress, (float, int,), False, False, False)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('WideGaugeStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('WideGaugeStatCard.commands', __d_commands, (dict,), False, True, False)
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


_WideInfoCardAlign = ['left', 'right']


class WideInfoCardAlign:
    LEFT = 'left'
    RIGHT = 'right'


class WideInfoCard:
    """Create a wide information card displaying a title, caption, and either an icon or image.
    """
    def __init__(
            self,
            box: str,
            name: str,
            title: str,
            caption: str,
            label: Optional[str] = None,
            subtitle: Optional[str] = None,
            align: Optional[str] = None,
            icon: Optional[str] = None,
            image: Optional[str] = None,
            category: Optional[str] = None,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('WideInfoCard.box', box, (str,), False, False, False)
        _guard_scalar('WideInfoCard.name', name, (str,), False, False, False)
        _guard_scalar('WideInfoCard.title', title, (str,), False, False, False)
        _guard_scalar('WideInfoCard.caption', caption, (str,), False, False, False)
        _guard_scalar('WideInfoCard.label', label, (str,), False, True, False)
        _guard_scalar('WideInfoCard.subtitle', subtitle, (str,), False, True, False)
        _guard_enum('WideInfoCard.align', align, _WideInfoCardAlign, True)
        _guard_scalar('WideInfoCard.icon', icon, (str,), False, True, False)
        _guard_scalar('WideInfoCard.image', image, (str,), False, True, False)
        _guard_scalar('WideInfoCard.category', category, (str,), False, True, False)
        _guard_vector('WideInfoCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.name = name
        """An identifying name for this card. Makes the card clickable, similar to a button."""
        self.title = title
        """The card's title."""
        self.caption = caption
        """The card's caption, displayed below the subtitle. Supports markdown."""
        self.label = label
        """Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore.."""
        self.subtitle = subtitle
        """The card's subtitle, displayed below the title."""
        self.align = align
        """The card's alignment, determines the position of an image / icon. Defaults to 'left'. One of 'left', 'right'. See enum h2o_wave.ui.WideInfoCardAlign."""
        self.icon = icon
        """The card's icon."""
        self.image = image
        """The card’s image."""
        self.category = category
        """The card's category, displayed above the title."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('WideInfoCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WideInfoCard.name', self.name, (str,), False, False, False)
        _guard_scalar('WideInfoCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WideInfoCard.caption', self.caption, (str,), False, False, False)
        _guard_scalar('WideInfoCard.label', self.label, (str,), False, True, False)
        _guard_scalar('WideInfoCard.subtitle', self.subtitle, (str,), False, True, False)
        _guard_enum('WideInfoCard.align', self.align, _WideInfoCardAlign, True)
        _guard_scalar('WideInfoCard.icon', self.icon, (str,), False, True, False)
        _guard_scalar('WideInfoCard.image', self.image, (str,), False, True, False)
        _guard_scalar('WideInfoCard.category', self.category, (str,), False, True, False)
        _guard_vector('WideInfoCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='wide_info',
            box=self.box,
            name=self.name,
            title=self.title,
            caption=self.caption,
            label=self.label,
            subtitle=self.subtitle,
            align=self.align,
            icon=self.icon,
            image=self.image,
            category=self.category,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WideInfoCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('WideInfoCard.box', __d_box, (str,), False, False, False)
        __d_name: Any = __d.get('name')
        _guard_scalar('WideInfoCard.name', __d_name, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WideInfoCard.title', __d_title, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('WideInfoCard.caption', __d_caption, (str,), False, False, False)
        __d_label: Any = __d.get('label')
        _guard_scalar('WideInfoCard.label', __d_label, (str,), False, True, False)
        __d_subtitle: Any = __d.get('subtitle')
        _guard_scalar('WideInfoCard.subtitle', __d_subtitle, (str,), False, True, False)
        __d_align: Any = __d.get('align')
        _guard_enum('WideInfoCard.align', __d_align, _WideInfoCardAlign, True)
        __d_icon: Any = __d.get('icon')
        _guard_scalar('WideInfoCard.icon', __d_icon, (str,), False, True, False)
        __d_image: Any = __d.get('image')
        _guard_scalar('WideInfoCard.image', __d_image, (str,), False, True, False)
        __d_category: Any = __d.get('category')
        _guard_scalar('WideInfoCard.category', __d_category, (str,), False, True, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('WideInfoCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        name: str = __d_name
        title: str = __d_title
        caption: str = __d_caption
        label: Optional[str] = __d_label
        subtitle: Optional[str] = __d_subtitle
        align: Optional[str] = __d_align
        icon: Optional[str] = __d_icon
        image: Optional[str] = __d_image
        category: Optional[str] = __d_category
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WideInfoCard(
            box,
            name,
            title,
            caption,
            label,
            subtitle,
            align,
            icon,
            image,
            category,
            commands,
        )


class Pie:
    """Card's pie chart data to be displayed.
    """
    def __init__(
            self,
            label: str,
            value: str,
            fraction: float,
            color: str,
            aux_value: Optional[str] = None,
    ):
        _guard_scalar('Pie.label', label, (str,), False, False, False)
        _guard_scalar('Pie.value', value, (str,), False, False, False)
        _guard_scalar('Pie.fraction', fraction, (float, int,), False, False, False)
        _guard_scalar('Pie.color', color, (str,), False, False, False)
        _guard_scalar('Pie.aux_value', aux_value, (str,), False, True, False)
        self.label = label
        """The description for the pie, displayed in the legend."""
        self.value = value
        """The formatted value displayed on the pie."""
        self.fraction = fraction
        """A value between 0 and 1 indicating the size of the pie."""
        self.color = color
        """The color of the pie."""
        self.aux_value = aux_value
        """The auxiliary value, displayed below the label."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('Pie.label', self.label, (str,), False, False, False)
        _guard_scalar('Pie.value', self.value, (str,), False, False, False)
        _guard_scalar('Pie.fraction', self.fraction, (float, int,), False, False, False)
        _guard_scalar('Pie.color', self.color, (str,), False, False, False)
        _guard_scalar('Pie.aux_value', self.aux_value, (str,), False, True, False)
        return _dump(
            label=self.label,
            value=self.value,
            fraction=self.fraction,
            color=self.color,
            aux_value=self.aux_value,
        )

    @staticmethod
    def load(__d: Dict) -> 'Pie':
        """Creates an instance of this class using the contents of a dict."""
        __d_label: Any = __d.get('label')
        _guard_scalar('Pie.label', __d_label, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('Pie.value', __d_value, (str,), False, False, False)
        __d_fraction: Any = __d.get('fraction')
        _guard_scalar('Pie.fraction', __d_fraction, (float, int,), False, False, False)
        __d_color: Any = __d.get('color')
        _guard_scalar('Pie.color', __d_color, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('Pie.aux_value', __d_aux_value, (str,), False, True, False)
        label: str = __d_label
        value: str = __d_value
        fraction: float = __d_fraction
        color: str = __d_color
        aux_value: Optional[str] = __d_aux_value
        return Pie(
            label,
            value,
            fraction,
            color,
            aux_value,
        )


class WidePieStatCard:
    """Create a wide pie stat card displaying a title and pie chart with legend.
    """
    def __init__(
            self,
            box: str,
            title: str,
            pies: List[Pie],
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('WidePieStatCard.box', box, (str,), False, False, False)
        _guard_scalar('WidePieStatCard.title', title, (str,), False, False, False)
        _guard_vector('WidePieStatCard.pies', pies, (Pie,), False, False, False)
        _guard_vector('WidePieStatCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.pies = pies
        """The pies to be included in the pie chart."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('WidePieStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WidePieStatCard.title', self.title, (str,), False, False, False)
        _guard_vector('WidePieStatCard.pies', self.pies, (Pie,), False, False, False)
        _guard_vector('WidePieStatCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='wide_pie_stat',
            box=self.box,
            title=self.title,
            pies=[__e.dump() for __e in self.pies],
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WidePieStatCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('WidePieStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WidePieStatCard.title', __d_title, (str,), False, False, False)
        __d_pies: Any = __d.get('pies')
        _guard_vector('WidePieStatCard.pies', __d_pies, (dict,), False, False, False)
        __d_commands: Any = __d.get('commands')
        _guard_vector('WidePieStatCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        pies: List[Pie] = [Pie.load(__e) for __e in __d_pies]
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WidePieStatCard(
            box,
            title,
            pies,
            commands,
        )


class WidePlotCard:
    """Create a wide plot card displaying a title, caption and a plot.
    """
    def __init__(
            self,
            box: str,
            title: str,
            caption: str,
            plot: Plot,
            data: PackedRecord,
            commands: Optional[List[Command]] = None,
    ):
        _guard_scalar('WidePlotCard.box', box, (str,), False, False, False)
        _guard_scalar('WidePlotCard.title', title, (str,), False, False, False)
        _guard_scalar('WidePlotCard.caption', caption, (str,), False, False, False)
        _guard_scalar('WidePlotCard.plot', plot, (Plot,), False, False, False)
        _guard_vector('WidePlotCard.commands', commands, (Command,), False, True, False)
        self.box = box
        """A string indicating how to place this component on the page."""
        self.title = title
        """The card's title."""
        self.caption = caption
        """The card's caption, displayed below the title."""
        self.plot = plot
        """The card's plot."""
        self.data = data
        """The card's plot data."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('WidePlotCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WidePlotCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WidePlotCard.caption', self.caption, (str,), False, False, False)
        _guard_scalar('WidePlotCard.plot', self.plot, (Plot,), False, False, False)
        _guard_vector('WidePlotCard.commands', self.commands, (Command,), False, True, False)
        return _dump(
            view='wide_plot',
            box=self.box,
            title=self.title,
            caption=self.caption,
            plot=self.plot.dump(),
            data=self.data,
            commands=None if self.commands is None else [__e.dump() for __e in self.commands],
        )

    @staticmethod
    def load(__d: Dict) -> 'WidePlotCard':
        """Creates an instance of this class using the contents of a dict."""
        __d_box: Any = __d.get('box')
        _guard_scalar('WidePlotCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WidePlotCard.title', __d_title, (str,), False, False, False)
        __d_caption: Any = __d.get('caption')
        _guard_scalar('WidePlotCard.caption', __d_caption, (str,), False, False, False)
        __d_plot: Any = __d.get('plot')
        _guard_scalar('WidePlotCard.plot', __d_plot, (dict,), False, False, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('WidePlotCard.commands', __d_commands, (dict,), False, True, False)
        box: str = __d_box
        title: str = __d_title
        caption: str = __d_caption
        plot: Plot = Plot.load(__d_plot)
        data: PackedRecord = __d_data
        commands: Optional[List[Command]] = None if __d_commands is None else [Command.load(__e) for __e in __d_commands]
        return WidePlotCard(
            box,
            title,
            caption,
            plot,
            data,
            commands,
        )


_WideSeriesStatCardPlotType = ['area', 'interval']


class WideSeriesStatCardPlotType:
    AREA = 'area'
    INTERVAL = 'interval'


_WideSeriesStatCardPlotCurve = ['linear', 'smooth', 'step', 'step-after', 'step-before']


class WideSeriesStatCardPlotCurve:
    LINEAR = 'linear'
    SMOOTH = 'smooth'
    STEP = 'step'
    STEP_AFTER = 'step-after'
    STEP_BEFORE = 'step-before'


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
        _guard_scalar('WideSeriesStatCard.box', box, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.title', title, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.value', value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.aux_value', aux_value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.plot_value', plot_value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.plot_zero_value', plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('WideSeriesStatCard.plot_category', plot_category, (str,), False, True, False)
        _guard_enum('WideSeriesStatCard.plot_type', plot_type, _WideSeriesStatCardPlotType, True)
        _guard_enum('WideSeriesStatCard.plot_curve', plot_curve, _WideSeriesStatCardPlotCurve, True)
        _guard_scalar('WideSeriesStatCard.plot_color', plot_color, (str,), False, True, False)
        _guard_vector('WideSeriesStatCard.commands', commands, (Command,), False, True, False)
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
        """The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.WideSeriesStatCardPlotType."""
        self.plot_curve = plot_curve
        """The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.WideSeriesStatCardPlotCurve."""
        self.plot_color = plot_color
        """The plot's color."""
        self.data = data
        """Data for this card."""
        self.commands = commands
        """Contextual menu commands for this component."""

    def dump(self) -> Dict:
        """Returns the contents of this object as a dict."""
        _guard_scalar('WideSeriesStatCard.box', self.box, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.title', self.title, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.value', self.value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.aux_value', self.aux_value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.plot_value', self.plot_value, (str,), False, False, False)
        _guard_scalar('WideSeriesStatCard.plot_zero_value', self.plot_zero_value, (float, int,), False, True, False)
        _guard_scalar('WideSeriesStatCard.plot_category', self.plot_category, (str,), False, True, False)
        _guard_enum('WideSeriesStatCard.plot_type', self.plot_type, _WideSeriesStatCardPlotType, True)
        _guard_enum('WideSeriesStatCard.plot_curve', self.plot_curve, _WideSeriesStatCardPlotCurve, True)
        _guard_scalar('WideSeriesStatCard.plot_color', self.plot_color, (str,), False, True, False)
        _guard_vector('WideSeriesStatCard.commands', self.commands, (Command,), False, True, False)
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
        _guard_scalar('WideSeriesStatCard.box', __d_box, (str,), False, False, False)
        __d_title: Any = __d.get('title')
        _guard_scalar('WideSeriesStatCard.title', __d_title, (str,), False, False, False)
        __d_value: Any = __d.get('value')
        _guard_scalar('WideSeriesStatCard.value', __d_value, (str,), False, False, False)
        __d_aux_value: Any = __d.get('aux_value')
        _guard_scalar('WideSeriesStatCard.aux_value', __d_aux_value, (str,), False, False, False)
        __d_plot_data: Any = __d.get('plot_data')
        __d_plot_value: Any = __d.get('plot_value')
        _guard_scalar('WideSeriesStatCard.plot_value', __d_plot_value, (str,), False, False, False)
        __d_plot_zero_value: Any = __d.get('plot_zero_value')
        _guard_scalar('WideSeriesStatCard.plot_zero_value', __d_plot_zero_value, (float, int,), False, True, False)
        __d_plot_category: Any = __d.get('plot_category')
        _guard_scalar('WideSeriesStatCard.plot_category', __d_plot_category, (str,), False, True, False)
        __d_plot_type: Any = __d.get('plot_type')
        _guard_enum('WideSeriesStatCard.plot_type', __d_plot_type, _WideSeriesStatCardPlotType, True)
        __d_plot_curve: Any = __d.get('plot_curve')
        _guard_enum('WideSeriesStatCard.plot_curve', __d_plot_curve, _WideSeriesStatCardPlotCurve, True)
        __d_plot_color: Any = __d.get('plot_color')
        _guard_scalar('WideSeriesStatCard.plot_color', __d_plot_color, (str,), False, True, False)
        __d_data: Any = __d.get('data')
        __d_commands: Any = __d.get('commands')
        _guard_vector('WideSeriesStatCard.commands', __d_commands, (dict,), False, True, False)
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
