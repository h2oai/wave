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

import warnings
from .types import *
from .ui_ext import *


def text(
        content: str,
        size: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create text content.

    Args:
        content: The text content.
        size: The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.TextSize.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Text` instance.
    """
    return Component(text=Text(
        content,
        size,
        width,
        visible,
        tooltip,
        name,
    ))


def command(
        name: str,
        label: Optional[str] = None,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        items: Optional[List[Command]] = None,
        value: Optional[str] = None,
        path: Optional[str] = None,
        download: Optional[bool] = None,
) -> Command:
    """Create a command.

    Commands are typically displayed as context menu items or toolbar button.

    Args:
        name: An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed.
        label: The text displayed for this command.
        caption: The caption for this command (typically a tooltip).
        icon: The icon to be displayed for this command.
        items: Sub-commands, if any
        value: Data associated with this command, if any.
        path: The path or URL to link to. The 'items' and 'value' props are ignored when specified.
        download: True if the link should prompt the user to save the linked URL instead of navigating to it.
    Returns:
        A `h2o_wave.types.Command` instance.
    """
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


def text_xl(
        content: str,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        commands: Optional[List[Command]] = None,
        name: Optional[str] = None,
) -> Component:
    """Create extra-large sized text content.

    Args:
        content: The text content.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        commands: Contextual menu commands for this component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextXl` instance.
    """
    return Component(text_xl=TextXl(
        content,
        width,
        visible,
        tooltip,
        commands,
        name,
    ))


def text_l(
        content: str,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        commands: Optional[List[Command]] = None,
        name: Optional[str] = None,
) -> Component:
    """Create large sized text content.

    Args:
        content: The text content.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        commands: Contextual menu commands for this component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextL` instance.
    """
    return Component(text_l=TextL(
        content,
        width,
        visible,
        tooltip,
        commands,
        name,
    ))


def text_m(
        content: str,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create medium sized text content.

    Args:
        content: The text content.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextM` instance.
    """
    return Component(text_m=TextM(
        content,
        width,
        visible,
        tooltip,
        name,
    ))


def text_s(
        content: str,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create small sized text content.

    Args:
        content: The text content.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextS` instance.
    """
    return Component(text_s=TextS(
        content,
        width,
        visible,
        tooltip,
        name,
    ))


def text_xs(
        content: str,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create extra-small sized text content.

    Args:
        content: The text content.
        width: The width of the text , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextXs` instance.
    """
    return Component(text_xs=TextXs(
        content,
        width,
        visible,
        tooltip,
        name,
    ))


def label(
        label: str,
        required: Optional[bool] = None,
        disabled: Optional[bool] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create a label.

    Labels give a name or title to a component or group of components.
    Labels should be in close proximity to the component or group they are paired with.
    Some components, such as textboxes, dropdowns, or toggles, already have labels
    incorporated, but other components may optionally add a Label if it helps inform
    the user of the component’s purpose.

    Args:
        label: The text displayed on the label.
        required: True if the field is required.
        disabled: True if the label should be disabled.
        width: The width of the label , e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Label` instance.
    """
    return Component(label=Label(
        label,
        required,
        disabled,
        width,
        visible,
        tooltip,
        name,
    ))


def separator(
        label: Optional[str] = None,
        name: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a separator.

    A separator visually separates content into groups.

    Args:
        label: The text displayed on the separator.
        name: An identifying name for this component.
        width: The width of the separator , e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Separator` instance.
    """
    return Component(separator=Separator(
        label,
        name,
        width,
        visible,
    ))


def progress(
        label: str,
        caption: Optional[str] = None,
        value: Optional[float] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
        type: Optional[str] = None,
) -> Component:
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

    Args:
        label: The text displayed above the bar or right to the spinner.
        caption: The text displayed below the bar or spinner.
        value: The progress, between 0.0 and 1.0, or -1 (default) if indeterminate.
        width: The width of the separator, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        name: An identifying name for this component.
        type: The type of progress bar to be displayed. One of 'bar', 'spinner'. Defaults to 'bar'. One of 'bar', 'spinner'. See enum h2o_wave.ui.ProgressType.
    Returns:
        A `h2o_wave.types.Progress` instance.
    """
    return Component(progress=Progress(
        label,
        caption,
        value,
        width,
        visible,
        tooltip,
        name,
        type,
    ))


def message_bar(
        type: Optional[str] = None,
        text: Optional[str] = None,
        name: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        buttons: Optional[List[Component]] = None,
) -> Component:
    """Create a message bar.

    A message bar is an area at the top of a primary view that displays relevant status information.
    You can use a message bar to tell the user about a situation that does not require their immediate attention and
    therefore does not need to block other activities.

    Args:
        type: The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.MessageBarType.
        text: The text displayed on the message bar.
        name: An identifying name for this component.
        width: The width of the message bar, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        buttons: Specify one or more action buttons.
    Returns:
        A `h2o_wave.types.MessageBar` instance.
    """
    return Component(message_bar=MessageBar(
        type,
        text,
        name,
        width,
        visible,
        buttons,
    ))


def textbox(
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
) -> Component:
    """Create a text box.

    The text box component enables a user to type text into an app.
    It's typically used to capture a single line of text, but can be configured to capture multiple lines of text.
    The text displays on the screen in a simple, uniform format.

    Args:
        name: An identifying name for this component.
        label: The text displayed above the field.
        placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that demonstrates the expected type of data, rather than an explanatory message.
        value: Text to be displayed inside the text box.
        mask: The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9].
        icon: Icon displayed in the far right end of the text field.
        prefix: Text to be displayed before the text box contents.
        suffix: Text to be displayed after the text box contents.
        error: Text to be displayed as an error below the text box.
        required: True if the text box is a required field.
        disabled: True if the text box is disabled.
        readonly: True if the text box is a read-only field.
        multiline: True if the text box should allow multi-line text entry.
        password: True if the text box should hide text content.
        trigger: True if the form should be submitted when the text value changes.
        height: The height of the text box, e.g. '100px'. Percentage values not supported. Applicable only if `multiline` is true.
        width: The width of the text box, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        spellcheck: True if the text may be checked for spelling errors. Defaults to True.
        type: Keyboard to be shown on mobile devices. Defaults to 'text'. One of 'text', 'number', 'tel'. See enum h2o_wave.ui.TextboxType.
    Returns:
        A `h2o_wave.types.Textbox` instance.
    """
    return Component(textbox=Textbox(
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
    ))


def checkbox(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        indeterminate: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
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

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the checkbox.
        value: True if selected, False if unselected.
        indeterminate: True if the selection is indeterminate (neither selected nor unselected).
        disabled: True if the checkbox is disabled.
        trigger: True if the form should be submitted when the checkbox value changes.
        width: The width of the checkbox, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Checkbox` instance.
    """
    return Component(checkbox=Checkbox(
        name,
        label,
        value,
        indeterminate,
        disabled,
        trigger,
        width,
        visible,
        tooltip,
    ))


def toggle(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a toggle.
    Toggles represent a physical switch that allows users to turn things on or off.
    Use toggles to present users with two mutually exclusive options (like on/off), where choosing an option results
    in an immediate action.

    Use a toggle for binary operations that take effect right after the user flips the Toggle.
    For example, use a Toggle to turn services or hardware components on or off.
    In other words, if a physical switch would work for the action, a Toggle is probably the best component to use.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        value: True if selected, False if unselected.
        disabled: True if the checkbox is disabled.
        trigger: True if the form should be submitted when the toggle value changes.
        width: The width of the toggle, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Toggle` instance.
    """
    return Component(toggle=Toggle(
        name,
        label,
        value,
        disabled,
        trigger,
        width,
        visible,
        tooltip,
    ))


def choice(
        name: str,
        label: Optional[str] = None,
        disabled: Optional[bool] = None,
) -> Choice:
    """Create a choice for a checklist, choice group or dropdown.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        disabled: True if the checkbox is disabled.
    Returns:
        A `h2o_wave.types.Choice` instance.
    """
    return Choice(
        name,
        label,
        disabled,
    )


def choice_group(
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
) -> Component:
    """Create a choice group.
    The choice group component, also known as radio buttons, let users select one option from two or more choices.
    Each option is represented by one choice group button; a user can select only one choice group in a button group.

    Choice groups emphasize all options equally, and that may draw more attention to the options than necessary.
    Consider using other components, unless the options deserve extra attention from the user.
    For example, if the default option is recommended for most users in most situations, use a dropdown instead.

    If there are only two mutually exclusive options, combine them into a single Checkbox or Toggle switch.
    For example, use a checkbox for "I agree" instead of choice group buttons for "I agree" and "I don't agree."

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        value: The name of the selected choice.
        choices: The choices to be presented.
        required: True if this field is required.
        trigger: True if the form should be submitted when the selection changes.
        inline: True if choices should be rendered horizontally. Defaults to False.
        width: The width of the choice group, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.ChoiceGroup` instance.
    """
    return Component(choice_group=ChoiceGroup(
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
    ))


def checklist(
        name: str,
        label: Optional[str] = None,
        values: Optional[List[str]] = None,
        choices: Optional[List[Choice]] = None,
        trigger: Optional[bool] = None,
        inline: Optional[bool] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a set of checkboxes.
    Use this for multi-select scenarios in which a user chooses one or more items from a group of
    choices that are not mutually exclusive.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed above the component.
        values: The names of the selected choices.
        choices: The choices to be presented.
        trigger: True if the form should be submitted when the checklist value changes.
        inline: True if checklist should be rendered horizontally. Defaults to False.
        width: The width of the checklist, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Checklist` instance.
    """
    return Component(checklist=Checklist(
        name,
        label,
        values,
        choices,
        trigger,
        inline,
        width,
        visible,
        tooltip,
    ))


def dropdown(
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
) -> Component:
    """Create a dropdown.

    A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
    a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
    selected item is visible. When users click the drop-down button, all the options become visible.

    To change the value, users open the list and click another value or use the arrow keys (up and down) to
    select a new value.

    Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
    multi-select dropdown.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
        value: The name of the selected choice.
        values: The names of the selected choices. If this parameter is set, multiple selections will be allowed.
        choices: The choices to be presented.
        required: True if this is a required field.
        disabled: True if this field is disabled.
        trigger: True if the form should be submitted when the dropdown value changes.
        width: The width of the dropdown, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        popup: Whether to present the choices using a pop-up dialog. By default pops up a dialog only for more than 100 choices. Defaults to 'auto'. One of 'auto', 'always', 'never'. See enum h2o_wave.ui.DropdownPopup.
    Returns:
        A `h2o_wave.types.Dropdown` instance.
    """
    return Component(dropdown=Dropdown(
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
    ))


def combobox(
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
) -> Component:
    """Create a combobox.

    A combobox is a list in which the selected item is always visible, and the others are visible on demand by
    clicking a drop-down button or by typing in the input.
    They are used to simplify the design and make a choice within the UI.

    When closed, only the selected item is visible.
    When users click the drop-down button, all the options become visible.
    To change the value, users open the list and click another value or use the arrow keys (up and down)
    to select a new value.
    When collapsed the user can select a new value by typing.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
        value: The name of the selected choice.
        values: The names of the selected choices. If set, multiple selections will be allowed.
        choices: The choices to be presented.
        error: Text to be displayed as an error below the text box.
        disabled: True if this field is disabled.
        width: The width of the combobox, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        trigger: True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes.
        required: True if this is a required field. Defaults to False.
    Returns:
        A `h2o_wave.types.Combobox` instance.
    """
    return Component(combobox=Combobox(
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
    ))


def slider(
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
) -> Component:
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

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        min: The minimum value of the slider.
        max: The maximum value of the slider.
        step: The difference between two adjacent values of the slider.
        value: The current value of the slider.
        disabled: True if this field is disabled.
        trigger: True if the form should be submitted when the slider value changes.
        width: The width of the slider, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Slider` instance.
    """
    return Component(slider=Slider(
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
    ))


def spinbox(
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
) -> Component:
    """Create a spinbox.

    A spinbox allows the user to incrementally adjust a value in small steps.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        min: The minimum value of the spinbox. Defaults to 0.
        max: The maximum value of the spinbox. Defaults to 100.
        step: The difference between two adjacent values of the spinbox. Defaults to 1.
        value: The current value of the spinbox. Defaults to 0.
        disabled: True if this field is disabled.
        width: The width of the spinbox, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        trigger: True if the form should be submitted when the spinbox value changes.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Spinbox` instance.
    """
    return Component(spinbox=Spinbox(
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
    ))


def date_picker(
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
) -> Component:
    """Create a date picker.

    A date picker allows a user to pick a date value.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
        value: The date value in YYYY-MM-DD format.
        disabled: True if this field is disabled.
        trigger: True if the form should be submitted when the datepicker value changes.
        width: The width of the date picker, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        min: The minimum allowed date value in YYYY-MM-DD format.
        max: The maximum allowed date value in YYYY-MM-DD format.
    Returns:
        A `h2o_wave.types.DatePicker` instance.
    """
    return Component(date_picker=DatePicker(
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
    ))


def color_picker(
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
) -> Component:
    """Create a color picker.

    A color picker allows a user to pick a color value.
    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        value: The selected color (CSS-compatible string).
        choices: A list of colors (CSS-compatible strings) to limit color choices to.
        width: The width of the color picker, e.g. '100px'. Defaults to '300px'.
        alpha: True if user should be allowed to pick color transparency. Defaults to True.
        inline: True if color picker should be displayed inline (takes less space). Doesn't work with choices specified. Defaults to False.
        visible: True if the component should be visible. Defaults to True.
        trigger: True if the form should be submitted when the color picker value changes.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.ColorPicker` instance.
    """
    return Component(color_picker=ColorPicker(
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
    ))


def button(
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
) -> Component:
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

    Args:
        name: An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked.
        label: The text displayed on the button.
        caption: The caption displayed below the label.
        value: A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True.
        primary: True if the button should be rendered as the primary button in the set.
        disabled: True if the button should be disabled.
        link: True if the button should be rendered as link text and not a standard button.
        icon: An optional icon to display next to the button label (not applicable for links).
        width: The width of the button, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        path: The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab.
        commands: When specified, a split button is rendered with extra actions tied to it within a context menu. Mutually exclusive with `link` attribute.
    Returns:
        A `h2o_wave.types.Button` instance.
    """
    return Component(button=Button(
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
    ))


def buttons(
        items: List[Component],
        justify: Optional[str] = None,
        name: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a set of buttons laid out horizontally.

    Args:
        items: The buttons in this set.
        justify: Specifies how to lay out buttons horizontally. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ButtonsJustify.
        name: An identifying name for this component.
        width: The width of the buttons, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Buttons` instance.
    """
    return Component(buttons=Buttons(
        items,
        justify,
        name,
        width,
        visible,
    ))


def mini_button(
        name: str,
        label: str,
        icon: Optional[str] = None,
) -> Component:
    """Create a mini button - same as regular button, but smaller in size.

    Args:
        name: An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked.
        label: The text displayed on the button.
        icon: An optional icon to display next to the button label.
    Returns:
        A `h2o_wave.types.MiniButton` instance.
    """
    return Component(mini_button=MiniButton(
        name,
        label,
        icon,
    ))


def mini_buttons(
        items: List[Component],
        visible: Optional[bool] = None,
) -> Component:
    """Create a set of mini buttons laid out horizontally.

    Args:
        items: The buttons in this set.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.MiniButtons` instance.
    """
    return Component(mini_buttons=MiniButtons(
        items,
        visible,
    ))


def file_upload(
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
) -> Component:
    """Create a file upload component.
    A file upload component allows a user to browse, select and upload one or more files.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed in the bottom button or as a component title when the component is displayed compactly. Defaults to "Upload".
        multiple: True if the component should allow multiple files to be uploaded.
        file_extensions: List of allowed file extensions, e.g. `pdf`, `docx`, etc.
        max_file_size: Maximum allowed size (Mb) per file. No limit by default.
        max_size: Maximum allowed size (Mb) for all files combined. No limit by default.
        height: The height of the file upload, e.g. '400px', '50%', etc. Defaults to '300px'.
        width: The width of the file upload, e.g. '100px'. Defaults to '100%'.
        compact: True if the component should be displayed compactly (without drag-and-drop capabilities). Defaults to False.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        required: True if this is a required field. Defaults to False.
    Returns:
        A `h2o_wave.types.FileUpload` instance.
    """
    return Component(file_upload=FileUpload(
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
    ))


def progress_table_cell_type(
        color: Optional[str] = None,
        name: Optional[str] = None,
) -> TableCellType:
    """Create a cell type that renders a column's cells as progress bars instead of plain text.
    If set on a column, the cell value must be between 0.0 and 1.0.

    Args:
        color: Color of the progress arc.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.ProgressTableCellType` instance.
    """
    return TableCellType(progress=ProgressTableCellType(
        color,
        name,
    ))


def icon_table_cell_type(
        color: Optional[str] = None,
        name: Optional[str] = None,
) -> TableCellType:
    """Create a cell type that renders a column's cells as icons instead of plain text.
    If set on a column, the cell value is interpreted as the name of the icon to be displayed.

    Args:
        color: Icon color.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.IconTableCellType` instance.
    """
    return TableCellType(icon=IconTableCellType(
        color,
        name,
    ))


def tag(
        label: str,
        color: str,
        label_color: Optional[str] = None,
) -> Tag:
    """Create a tag.

    Args:
        label: The text displayed within the tag.
        color: Tag's background color.
        label_color: Tag's label color. If not specified, black or white will be picked based on correct contrast with background.
    Returns:
        A `h2o_wave.types.Tag` instance.
    """
    return Tag(
        label,
        color,
        label_color,
    )


def tag_table_cell_type(
        name: str,
        tags: Optional[List[Tag]] = None,
) -> TableCellType:
    """Creates a collection of tags, usually used for rendering state values.
    In case of multiple tags per row, make sure the row values are
    separated by "," within a single cell string.
    E.g. ui.table_row(name="...", cells=["cell1", "TAG1,TAG2"]).
    Each value should correspond to a `ui.tag.label` attr.
    For the example above: [
    ui.tag(label="TAG1", color="red"),
    ui.tag(label="TAG2", color="green"),
    ]

    Args:
        name: An identifying name for this component.
        tags: Tags to be rendered.
    Returns:
        A `h2o_wave.types.TagTableCellType` instance.
    """
    return TableCellType(tag=TagTableCellType(
        name,
        tags,
    ))


def menu_table_cell_type(
        commands: List[Command],
        name: Optional[str] = None,
) -> TableCellType:
    """Create a cell type that renders command menu.

    Commands are typically displayed as context menu items. Useful when you need to provide
    multiple actions within a single row.

    Args:
        commands: Items to render.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.MenuTableCellType` instance.
    """
    return TableCellType(menu=MenuTableCellType(
        commands,
        name,
    ))


def markdown_table_cell_type(
        name: Optional[str] = None,
        target: Optional[str] = None,
) -> TableCellType:
    """Create a cell type that renders Markdown content.

    Args:
        name: An identifying name for this component.
        target: Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab.
    Returns:
        A `h2o_wave.types.MarkdownTableCellType` instance.
    """
    return TableCellType(markdown=MarkdownTableCellType(
        name,
        target,
    ))


def table_column(
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
) -> TableColumn:
    """Create a table column.

    Args:
        name: An identifying name for this column.
        label: The text displayed on the column header.
        min_width: The minimum width of this column, e.g. '50px'. Only `px` units are supported at this time.
        max_width: The maximum width of this column, e.g. '100px'. Only `px` units are supported at this time.
        sortable: Indicates whether the column is sortable.
        searchable: Indicates whether the contents of this column can be searched through. Enables a search box for the table if true.
        filterable: Indicates whether the contents of this column are displayed as filters in a dropdown.
        link: Indicates whether each cell in this column should be displayed as a clickable link. Applies to exactly one text column in the table.
        data_type: Defines the data type of this column. Time column takes either ISO 8601 date string or unix epoch miliseconds. Defaults to `string`. One of 'string', 'number', 'time'. See enum h2o_wave.ui.TableColumnDataType.
        cell_type: Defines how to render each cell in this column. Renders as plain text by default.
        cell_overflow: Defines what to do with a cell's contents in case it does not fit inside the cell. One of 'tooltip', 'wrap'. See enum h2o_wave.ui.TableColumnCellOverflow.
        filters: Explicit list of values to allow filtering by, needed when pagination is set or custom order is needed. Only applicable to filterable columns.
        align: Defines how to align values in a column. One of 'left', 'center', 'right'. See enum h2o_wave.ui.TableColumnAlign.
    Returns:
        A `h2o_wave.types.TableColumn` instance.
    """
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


def table_row(
        name: str,
        cells: List[str],
) -> TableRow:
    """Create a table row.

    Args:
        name: An identifying name for this row.
        cells: The cells in this row (displayed left to right).
    Returns:
        A `h2o_wave.types.TableRow` instance.
    """
    return TableRow(
        name,
        cells,
    )


def table_group(
        label: str,
        rows: List[TableRow],
        collapsed: Optional[bool] = None,
) -> TableGroup:
    """Make rows within the table collapsible/expandable.

    This type of table is best used for cases when your data makes sense to be presented in chunks rather than a single flat list.

    Args:
        label: The title of the group.
        rows: The rows in this group.
        collapsed: Indicates whether the table group should be collapsed by default. Defaults to True.
    Returns:
        A `h2o_wave.types.TableGroup` instance.
    """
    return TableGroup(
        label,
        rows,
        collapsed,
    )


def table_pagination(
        total_rows: int,
        rows_per_page: int,
) -> TablePagination:
    """Configure table pagination. Use as `pagination` parameter to `ui.table()`

    Args:
        total_rows: Total count of all the rows in your dataset.
        rows_per_page: The maximum amount of rows to be displayed in a single page.
    Returns:
        A `h2o_wave.types.TablePagination` instance.
    """
    return TablePagination(
        total_rows,
        rows_per_page,
    )


def table(
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
) -> Component:
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

    Args:
        name: An identifying name for this component.
        columns: The columns in this table.
        rows: The rows in this table. Mutually exclusive with `groups` attr.
        multiple: True to allow multiple rows to be selected. Mutually exclusive with `single` attr.
        groupable: True to allow group by feature.
        downloadable: Indicates whether the table rows can be downloaded as a CSV file. Defaults to False.
        resettable: Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False.
        height: The height of the table in px (e.g. '200px') or '1' to fill the remaining card space.
        width: The width of the table, e.g. '100px'. Defaults to '100%'.
        values: The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`).
        checkbox_visibility: Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'. One of 'always', 'on-hover', 'hidden'. See enum h2o_wave.ui.TableCheckboxVisibility.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        groups: Creates collapsible / expandable groups of data rows. Mutually exclusive with `rows` attr.
        pagination: Display a pagination control at the bottom of the table. Set this value using `ui.table_pagination()`.
        events: The events to capture on this table when pagination is set. One of 'search' | 'sort' | 'filter' | 'download' | 'page_change' | 'reset' | 'select'.
        single: True to allow only one row to be selected at time. Mutually exclusive with `multiple` attr.
        value: The name of the selected row. If this parameter is set, single selection will be allowed (`single` is assumed to be `True`).
    Returns:
        A `h2o_wave.types.Table` instance.
    """
    return Component(table=Table(
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
    ))


def link(
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
) -> Component:
    """Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
    All other kinds of paths are treated as external hyperlinks.

    Args:
        label: The text to be displayed. If blank, the `path` is used as the label.
        path: The path or URL to link to.
        disabled: True if the link should be disabled.
        download: True if the link should prompt the user to save the linked URL instead of navigating to it.
        button: True if the link should be rendered as a button.
        width: The width of the link, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        target: Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Link` instance.
    """
    return Component(link=Link(
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
    ))


def links(
        items: List[Component],
        label: Optional[str] = None,
        inline: Optional[bool] = None,
        width: Optional[str] = None,
) -> Component:
    """Create a collection of links.

    Args:
        items: The links contained in this group.
        label: The name of the link group.
        inline: Render links horizontally. Defaults to False.
        width: The width of the links, e.g. '100px'.
    Returns:
        A `h2o_wave.types.Links` instance.
    """
    return Component(links=Links(
        items,
        label,
        inline,
        width,
    ))


def tab(
        name: str,
        label: Optional[str] = None,
        icon: Optional[str] = None,
) -> Tab:
    """Create a tab.

    Args:
        name: An identifying name for this component.
        label: The text displayed on the tab.
        icon: The icon displayed on the tab.
    Returns:
        A `h2o_wave.types.Tab` instance.
    """
    return Tab(
        name,
        label,
        icon,
    )


def tabs(
        name: str,
        value: Optional[str] = None,
        items: Optional[List[Tab]] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        link: Optional[bool] = None,
) -> Component:
    """Create a tab bar.

    Args:
        name: An identifying name for this component.
        value: The name of the tab to select initially.
        items: The tabs in this tab bar.
        width: The width of the tabs, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        link: True if tabs should be rendered as links instead of buttons.
    Returns:
        A `h2o_wave.types.Tabs` instance.
    """
    return Component(tabs=Tabs(
        name,
        value,
        items,
        width,
        visible,
        link,
    ))


def expander(
        name: str,
        label: Optional[str] = None,
        expanded: Optional[bool] = None,
        items: Optional[List[Component]] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Creates a new expander.

    Expanders can be used to show or hide a group of related components.

    Args:
        name: An identifying name for this component.
        label: The text displayed on the expander.
        expanded: True if expanded, False if collapsed.
        items: List of components to be hideable by the expander.
        width: The width of the expander, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Expander` instance.
    """
    return Component(expander=Expander(
        name,
        label,
        expanded,
        items,
        width,
        visible,
    ))


def frame(
        path: Optional[str] = None,
        content: Optional[str] = None,
        width: Optional[str] = None,
        height: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a new inline frame (an `iframe`).

    Args:
        path: The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
        content: The HTML content of the page. A string containing `<html>...</html>`.
        width: The width of the frame, e.g. `200px`, `50%`, etc. Defaults to '100%'.
        height: The height of the frame, e.g. `200px`, `50%`, etc. Defaults to '150px'.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Frame` instance.
    """
    return Component(frame=Frame(
        path,
        content,
        width,
        height,
        name,
        visible,
    ))


def markup(
        content: str,
        name: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Render HTML content.

    Args:
        content: The HTML content.
        name: An identifying name for this component.
        width: The width of the markup, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Markup` instance.
    """
    return Component(markup=Markup(
        content,
        name,
        width,
        visible,
    ))


def template(
        content: str,
        data: Optional[PackedRecord] = None,
        name: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Render dynamic content using an HTML template.

    Args:
        content: The Handlebars template. https://handlebarsjs.com/guide/
        data: Data for the Handlebars template
        name: An identifying name for this component.
        width: The width of the template, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
    Returns:
        A `h2o_wave.types.Template` instance.
    """
    return Component(template=Template(
        content,
        data,
        name,
        width,
        visible,
    ))


def picker(
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
) -> Component:
    """Create a picker.
    Pickers are used to select one or more choices, such as tags or files, from a list.
    Use a picker to allow the user to quickly search for or manage a few tags or files.

    Args:
        name: An identifying name for this component.
        choices: The choices to be presented.
        label: Text to be displayed above the component.
        values: The names of the selected choices.
        max_choices: Maximum number of selectable choices.
        required: True if the picker is a required field.
        disabled: Controls whether the picker should be disabled or not.
        width: The width of the picker, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        trigger: True if the form should be submitted when the picker value changes.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Picker` instance.
    """
    return Component(picker=Picker(
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
    ))


def range_slider(
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
) -> Component:
    """Create a range slider.

    A range slider is an element used to select a value range. It provides a visual indication of adjustable content, as well as the
    current setting in the total range of content. It is displayed as a horizontal track with options on either side.
    Knobs or levers are dragged to one end or the other to make the choice, indicating the current max and min value.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        min: The minimum value of the slider. Defaults to 0.
        max: The maximum value of the slider. Defaults to 100.
        step: The difference between two adjacent values of the slider.
        min_value: The lower bound of the selected range.
        max_value: The upper bound of the selected range. Default value is `max`.
        disabled: True if this field is disabled.
        width: The width of the range slider, e.g. '100px'. Defaults to '100%'.
        trigger: True if the form should be submitted when the slider value changes.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.RangeSlider` instance.
    """
    return Component(range_slider=RangeSlider(
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
    ))


def step(
        label: str,
        icon: Optional[str] = None,
        done: Optional[bool] = None,
) -> Step:
    """Create a step for a stepper.

    Args:
        label: Text displayed below icon.
        icon: Icon to be displayed.
        done: Indicates whether this step has already been completed.
    Returns:
        A `h2o_wave.types.Step` instance.
    """
    return Step(
        label,
        icon,
        done,
    )


def stepper(
        name: str,
        items: List[Step],
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a component that displays a sequence of steps in a process.
    The steps keep users informed about where they are in the process and how much is left to complete.

    Args:
        name: An identifying name for this component.
        items: The sequence of steps to be displayed.
        width: The width of the stepper, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Stepper` instance.
    """
    return Component(stepper=Stepper(
        name,
        items,
        width,
        visible,
        tooltip,
    ))


def mark(
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
) -> Mark:
    """Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
    A plot can contain multiple such layers of marks.

    Args:
        coord: Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'. See enum h2o_wave.ui.MarkCoord.
        type: Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'. See enum h2o_wave.ui.MarkType.
        x: X field or value.
        x0: X base field or value.
        x1: X bin lower bound field or value. For histograms and box plots.
        x2: X bin upper bound field or value. For histograms and box plots.
        x_q1: X lower quartile. For box plots.
        x_q2: X median. For box plots.
        x_q3: X upper quartile. For box plots.
        x_min: X axis scale minimum.
        x_max: X axis scale maximum.
        x_nice: Whether to nice X axis scale ticks.
        x_scale: X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkXScale.
        x_title: X axis title.
        y: Y field or value.
        y0: Y base field or value.
        y1: Y bin lower bound field or value. For histograms and box plots.
        y2: Y bin upper bound field or value. For histograms and box plots.
        y_q1: Y lower quartile. For box plots.
        y_q2: Y median. For box plots.
        y_q3: Y upper quartile. For box plots.
        y_min: Y axis scale minimum.
        y_max: Y axis scale maximum.
        y_nice: Whether to nice Y axis scale ticks.
        y_scale: Y axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkYScale.
        y_title: Y axis title.
        color: Mark color field or value.
        color_range: Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`
        color_domain: The unique values in the data (labels or categories or classes) to map colors to, e.g. `['high', 'medium', 'low']`. If this is not provided, the unique values are automatically inferred from the `color` attribute.
        shape: Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'.
        shape_range: Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`
        size: Mark size field or value.
        size_range: Mark size range. A string containing space-separated integers, e.g. `'4 30'`
        stack: Field to stack marks by, or 'auto' to infer.
        dodge: Field to dodge marks by, or 'auto' to infer.
        curve: Curve type for `line` and `area` mark types. One of 'none', 'smooth', 'step-before', 'step', 'step-after'. See enum h2o_wave.ui.MarkCurve.
        fill_color: Mark fill color.
        fill_opacity: Mark fill opacity.
        stroke_color: Mark stroke color.
        stroke_opacity: Mark stroke opacity.
        stroke_size: Mark stroke size.
        stroke_dash: Mark stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
        label: Label field or value.
        label_offset: Distance between label and mark.
        label_offset_x: Horizontal distance between label and mark.
        label_offset_y: Vertical distance between label and mark.
        label_rotation: Label rotation angle, in degrees, or 'none' to disable automatic rotation. The default behavior is 'auto' for automatic rotation.
        label_position: Label position relative to the mark. One of 'top', 'bottom', 'middle', 'left', 'right'. See enum h2o_wave.ui.MarkLabelPosition.
        label_overlap: Strategy to use if labels overlap. One of 'hide', 'overlap', 'constrain'. See enum h2o_wave.ui.MarkLabelOverlap.
        label_fill_color: Label fill color.
        label_fill_opacity: Label fill opacity.
        label_stroke_color: Label stroke color.
        label_stroke_opacity: Label stroke opacity.
        label_stroke_size: Label stroke size (line width or pen thickness).
        label_font_size: Label font size.
        label_font_weight: Label font weight.
        label_line_height: Label line height.
        label_align: Label text alignment. One of 'left', 'right', 'center', 'start', 'end'. See enum h2o_wave.ui.MarkLabelAlign.
        ref_stroke_color: Reference line stroke color.
        ref_stroke_opacity: Reference line stroke opacity.
        ref_stroke_size: Reference line stroke size (line width or pen thickness).
        ref_stroke_dash: Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
        interactive: Defines whether to raise events on interactions with the mark. Defaults to True.
    Returns:
        A `h2o_wave.types.Mark` instance.
    """
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


def plot(
        marks: List[Mark],
) -> Plot:
    """Create a plot. A plot is composed of one or more graphical mark layers.

    Args:
        marks: The graphical mark layers contained in this plot.
    Returns:
        A `h2o_wave.types.Plot` instance.
    """
    return Plot(
        marks,
    )


def visualization(
        plot: Plot,
        data: PackedRecord,
        width: Optional[str] = None,
        height: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
        events: Optional[List[str]] = None,
        interactions: Optional[List[str]] = None,
        animate: Optional[bool] = None,
) -> Component:
    """Create a visualization for display inside a form.

    Args:
        plot: The plot to be rendered in this visualization.
        data: Data for this visualization.
        width: The width of the visualization. Defaults to '100%'.
        height: The hight of the visualization. Defaults to '300px'.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to True.
        events: The events to capture on this visualization. One of 'select_marks'.
        interactions: The interactions to be allowed for this plot. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event.
        animate: EXPERIMENTAL: True to turn on the chart animations. Defaults to False.
    Returns:
        A `h2o_wave.types.Visualization` instance.
    """
    return Component(visualization=Visualization(
        plot,
        data,
        width,
        height,
        name,
        visible,
        events,
        interactions,
        animate,
    ))


def vega_visualization(
        specification: str,
        data: Optional[PackedRecord] = None,
        width: Optional[str] = None,
        height: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
        grammar: Optional[str] = None,
) -> Component:
    """Create a Vega-lite plot for display inside a form.

    Args:
        specification: The Vega-lite specification.
        data: Data for the plot, if any.
        width: The width of the visualization. Defaults to '100%'.
        height: The height of the visualization. Defaults to '300px'.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to True.
        grammar: Vega grammar to use. Defaults to 'vega-lite'. One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaVisualizationGrammar.
    Returns:
        A `h2o_wave.types.VegaVisualization` instance.
    """
    return Component(vega_visualization=VegaVisualization(
        specification,
        data,
        width,
        height,
        name,
        visible,
        grammar,
    ))


def stat(
        label: str,
        value: Optional[str] = None,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        icon_color: Optional[str] = None,
        name: Optional[str] = None,
) -> Stat:
    """Create a stat (a label-value pair) for displaying a metric.

    Args:
        label: The label for the metric.
        value: The value of the metric.
        caption: The caption displayed below the primary value.
        icon: An optional icon, displayed next to the label.
        icon_color: The color of the icon.
        name: An identifying name for this item.
    Returns:
        A `h2o_wave.types.Stat` instance.
    """
    return Stat(
        label,
        value,
        caption,
        icon,
        icon_color,
        name,
    )


def stats(
        items: List[Stat],
        justify: Optional[str] = None,
        inset: Optional[bool] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        name: Optional[str] = None,
) -> Component:
    """Create a set of stats laid out horizontally.

    Args:
        items: The individual stats to be displayed.
        justify: Specifies how to lay out the individual stats. Defaults to 'start'. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.StatsJustify.
        inset: Whether to display the stats with a contrasting background.
        width: The width of the stats, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Stats` instance.
    """
    return Component(stats=Stats(
        items,
        justify,
        inset,
        width,
        visible,
        name,
    ))


def inline(
        items: List[Component],
        justify: Optional[str] = None,
        align: Optional[str] = None,
        inset: Optional[bool] = None,
        height: Optional[str] = None,
        direction: Optional[str] = None,
) -> Component:
    """Create an inline (horizontal) list of components.

    Args:
        items: The components laid out inline.
        justify: Specifies how to lay out the individual components. Defaults to 'start'. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.InlineJustify.
        align: Specifies how the individual components are aligned on the vertical axis. Defaults to 'center'. One of 'start', 'end', 'center', 'baseline'. See enum h2o_wave.ui.InlineAlign.
        inset: Whether to display the components inset from the parent form, with a contrasting background.
        height: Height of the inline container. Accepts any valid CSS unit e.g. '100vh', '300px'. Use '1' to fill the remaining card space.
        direction: Container direction. Defaults to 'row'. One of 'row', 'column'. See enum h2o_wave.ui.InlineDirection.
    Returns:
        A `h2o_wave.types.Inline` instance.
    """
    return Component(inline=Inline(
        items,
        justify,
        align,
        inset,
        height,
        direction,
    ))


def image(
        title: str,
        type: Optional[str] = None,
        image: Optional[str] = None,
        path: Optional[str] = None,
        width: Optional[str] = None,
        visible: Optional[bool] = None,
        path_popup: Optional[str] = None,
) -> Component:
    """Create an image.

    Args:
        title: The image title, typically displayed as a tooltip.
        type: The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. Required only if `image` is set.
        image: Image data, base64-encoded.
        path: The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`.
        width: The width of the image, e.g. '100px'.
        visible: True if the component should be visible. Defaults to True.
        path_popup: The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property.
    Returns:
        A `h2o_wave.types.Image` instance.
    """
    return Component(image=Image(
        title,
        type,
        image,
        path,
        width,
        visible,
        path_popup,
    ))


def persona(
        title: str,
        subtitle: Optional[str] = None,
        caption: Optional[str] = None,
        size: Optional[str] = None,
        image: Optional[str] = None,
        initials: Optional[str] = None,
        initials_color: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create an individual's persona or avatar, a visual representation of a person across products.
    Can be used to display an individual's avatar (or a composition of the person’s initials on a background color), their name or identification, and online status.

    Args:
        title: Primary text, displayed next to the persona coin.
        subtitle: Secondary text, displayed under the title.
        caption: Tertiary text, displayed under the subtitle. Only visible for sizes >= 'm'.
        size: The size of the persona coin. Defaults to 'm'. One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.PersonaSize.
        image: Image, URL or base64-encoded (`data:image/png;base64,???`).
        initials: Initials, if `image` is not specified.
        initials_color: Initials background color (CSS-compatible string).
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Persona` instance.
    """
    return Component(persona=Persona(
        title,
        subtitle,
        caption,
        size,
        image,
        initials,
        initials_color,
        name,
    ))


def text_annotator_tag(
        name: str,
        label: str,
        color: str,
) -> TextAnnotatorTag:
    """Create a tag.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed for this tag.
        color: HEX or RGB color string used as background for highlighted phrases.
    Returns:
        A `h2o_wave.types.TextAnnotatorTag` instance.
    """
    return TextAnnotatorTag(
        name,
        label,
        color,
    )


def text_annotator_item(
        text: str,
        tag: Optional[str] = None,
) -> TextAnnotatorItem:
    """Create an annotator item with initial selected tags or no tag for plaintext.

    Args:
        text: Text to be highlighted.
        tag: The `name` of the text annotator tag to refer to for the `label` and `color` of this item.
    Returns:
        A `h2o_wave.types.TextAnnotatorItem` instance.
    """
    return TextAnnotatorItem(
        text,
        tag,
    )


def text_annotator(
        name: str,
        title: str,
        tags: List[TextAnnotatorTag],
        items: List[TextAnnotatorItem],
        trigger: Optional[bool] = None,
        readonly: Optional[bool] = None,
) -> Component:
    """Create a text annotator component.

    The text annotator component enables user to manually annotate parts of text. Useful for NLP data prep.

    Args:
        name: An identifying name for this component.
        title: The text annotator's title.
        tags: List of tags the user can annotate with.
        items: Pretagged parts of text content.
        trigger: True if the form should be submitted when the annotator value changes.
        readonly: True to prevent user interaction with the annotator component. Defaults to False.
    Returns:
        A `h2o_wave.types.TextAnnotator` instance.
    """
    return Component(text_annotator=TextAnnotator(
        name,
        title,
        tags,
        items,
        trigger,
        readonly,
    ))


def image_annotator_tag(
        name: str,
        label: str,
        color: str,
) -> ImageAnnotatorTag:
    """Create a unique tag type for use in an image annotator.

    Args:
        name: An identifying name for this tag.
        label: Text to be displayed for the annotation.
        color: Hex or RGB color string to be used as the background color.
    Returns:
        A `h2o_wave.types.ImageAnnotatorTag` instance.
    """
    return ImageAnnotatorTag(
        name,
        label,
        color,
    )


def image_annotator_rect(
        x1: float,
        y1: float,
        x2: float,
        y2: float,
) -> ImageAnnotatorShape:
    """Create a rectangular annotation shape.

    Args:
        x1: `x` coordinate of the rectangle's corner.
        y1: `y` coordinate of the rectangle's corner.
        x2: `x` coordinate of the diagonally opposite corner.
        y2: `y` coordinate of the diagonally opposite corner.
    Returns:
        A `h2o_wave.types.ImageAnnotatorRect` instance.
    """
    return ImageAnnotatorShape(rect=ImageAnnotatorRect(
        x1,
        y1,
        x2,
        y2,
    ))


def image_annotator_point(
        x: float,
        y: float,
) -> ImageAnnotatorPoint:
    """Create a polygon annotation point with x and y coordinates..

    Args:
        x: `x` coordinate of the point.
        y: `y` coordinate of the point.
    Returns:
        A `h2o_wave.types.ImageAnnotatorPoint` instance.
    """
    return ImageAnnotatorPoint(
        x,
        y,
    )


def image_annotator_polygon(
        vertices: List[ImageAnnotatorPoint],
) -> ImageAnnotatorShape:
    """Create a polygon annotation shape.

    Args:
        vertices: List of polygon points.
    Returns:
        A `h2o_wave.types.ImageAnnotatorPolygon` instance.
    """
    return ImageAnnotatorShape(polygon=ImageAnnotatorPolygon(
        vertices,
    ))


def image_annotator_item(
        shape: ImageAnnotatorShape,
        tag: str,
) -> ImageAnnotatorItem:
    """Create an annotator item with initial selected tags or no tag for plaintext.

    Args:
        shape: The annotation shape.
        tag: The `name` of the image annotator tag to refer to for the `label` and `color` of this item.
    Returns:
        A `h2o_wave.types.ImageAnnotatorItem` instance.
    """
    return ImageAnnotatorItem(
        shape,
        tag,
    )


def image_annotator(
        name: str,
        image: str,
        title: str,
        tags: List[ImageAnnotatorTag],
        items: Optional[List[ImageAnnotatorItem]] = None,
        trigger: Optional[bool] = None,
        image_height: Optional[str] = None,
        allowed_shapes: Optional[List[str]] = None,
        events: Optional[List[str]] = None,
) -> Component:
    """Create an image annotator component.

    This component allows annotating and labeling parts of an image by drawing shapes with a pointing device.

    Args:
        name: An identifying name for this component.
        image: The path or URL of the image to be presented for annotation.
        title: The image annotator's title.
        tags: The master list of tags that can be used for annotations.
        items: Annotations to display on the image, if any.
        trigger: True if the form should be submitted as soon as an annotation is drawn.
        image_height: The card’s image height. The actual image size is used by default.
        allowed_shapes: List of allowed shapes. Available values are 'rect' and 'polygon'. If not set, all shapes are available by default.
        events: The events to capture on this image annotator. One of `click` | `tool_change`.
    Returns:
        A `h2o_wave.types.ImageAnnotator` instance.
    """
    return Component(image_annotator=ImageAnnotator(
        name,
        image,
        title,
        tags,
        items,
        trigger,
        image_height,
        allowed_shapes,
        events,
    ))


def audio_annotator_tag(
        name: str,
        label: str,
        color: str,
) -> AudioAnnotatorTag:
    """Create a unique tag type for use in an audio annotator.

    Args:
        name: An identifying name for this tag.
        label: Text to be displayed for the annotation.
        color: Hex or RGB color string to be used as the background color.
    Returns:
        A `h2o_wave.types.AudioAnnotatorTag` instance.
    """
    return AudioAnnotatorTag(
        name,
        label,
        color,
    )


def audio_annotator_item(
        start: float,
        end: float,
        tag: str,
) -> AudioAnnotatorItem:
    """Create an annotator item with initial selected tags or no tags.

    Args:
        start: The start of the audio annotation in seconds.
        end: The end of the audio annotation in seconds.
        tag: The `name` of the audio annotator tag to refer to for the `label` and `color` of this item.
    Returns:
        A `h2o_wave.types.AudioAnnotatorItem` instance.
    """
    return AudioAnnotatorItem(
        start,
        end,
        tag,
    )


def audio_annotator(
        name: str,
        title: str,
        path: str,
        tags: List[AudioAnnotatorTag],
        items: Optional[List[AudioAnnotatorItem]] = None,
        trigger: Optional[bool] = None,
) -> Component:
    """Create an audio annotator component.

    This component allows annotating and labeling parts of audio file.

    Args:
        name: An identifying name for this component.
        title: The audio annotator's title.
        path: The path to the audio file. Use mp3 or wav formats to achieve the best cross-browser support. See https://caniuse.com/?search=audio%20format for other formats.
        tags: The master list of tags that can be used for annotations.
        items: Annotations to display on the image, if any.
        trigger: True if the form should be submitted as soon as an annotation is made.
    Returns:
        A `h2o_wave.types.AudioAnnotator` instance.
    """
    return Component(audio_annotator=AudioAnnotator(
        name,
        title,
        path,
        tags,
        items,
        trigger,
    ))


def facepile(
        items: List[Component],
        name: Optional[str] = None,
        max: Optional[int] = None,
        value: Optional[str] = None,
) -> Component:
    """A face pile displays a list of personas. Each circle represents a person and contains their image or initials.
    Often this control is used when sharing who has access to a specific view or file.

    Args:
        items: List of personas to be displayed.
        name: An identifying name for this component. If specified `Add button` will be rendered.
        max: Maximum number of personas to be displayed.
        value: A value for the facepile. If a value is set, it is used for the button's submitted instead of a boolean True.
    Returns:
        A `h2o_wave.types.Facepile` instance.
    """
    return Component(facepile=Facepile(
        items,
        name,
        max,
        value,
    ))


def copyable_text(
        value: str,
        label: str,
        name: Optional[str] = None,
        multiline: Optional[bool] = None,
        height: Optional[str] = None,
        width: Optional[str] = None,
) -> Component:
    """Create a copyable text component.
    Use this component when you want to enable your users to quickly copy paste sections of text.

    Args:
        value: Text to be displayed inside the component.
        label: The text displayed above the textbox.
        name: An identifying name for this component.
        multiline: True if the component should allow multi-line text entry.
        height: Custom height in px (e.g. '200px') or '1' to fill the remaining card space. Requires `multiline` to be set.
        width: The width of the copyable text , e.g. '100px'.
    Returns:
        A `h2o_wave.types.CopyableText` instance.
    """
    return Component(copyable_text=CopyableText(
        value,
        label,
        name,
        multiline,
        height,
        width,
    ))


def menu(
        items: List[Command],
        icon: Optional[str] = None,
        image: Optional[str] = None,
        name: Optional[str] = None,
        label: Optional[str] = None,
) -> Component:
    """Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.

    Args:
        items: Commands to render.
        icon: The card's icon.
        image: The card’s image, preferably user avatar.
        name: An identifying name for this component.
        label: The text displayed next to the chevron.
    Returns:
        A `h2o_wave.types.Menu` instance.
    """
    return Component(menu=Menu(
        items,
        icon,
        image,
        name,
        label,
    ))


def tags(
        items: List[Tag],
) -> Component:
    """Create a set of tags laid out horizontally.

    Args:
        items: Tags in this set.
    Returns:
        A `h2o_wave.types.Tags` instance.
    """
    return Component(tags=Tags(
        items,
    ))


def time_picker(
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
) -> Component:
    """Create a time picker.

    A time picker allows a user to pick a time value.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
        value: The time value in hh:mm format. E.g. '10:30', '14:25', '23:59', '00:00'
        disabled: True if this field is disabled.
        width: The width of the time picker, e.g. '100px'. Defaults to '100%'.
        visible: True if the component should be visible. Defaults to True.
        trigger: True if the form should be submitted when the time is selected.
        required: True if this is a required field. Defaults to False.
        hour_format: Specifies 12-hour or 24-hour time format. One of `12` or `24`. Defaults to `12`.
        min: The minimum allowed time value in hh:mm format. E.g.: '08:00', '13:30'
        max: The maximum allowed time value in hh:mm format. E.g.: '15:30', '00:00'
        minutes_step: Limits the available minutes to select from. One of `1`, `5`, `10`, `15`, `20`, `30` or `60`. Defaults to `1`.
    Returns:
        A `h2o_wave.types.TimePicker` instance.
    """
    return Component(time_picker=TimePicker(
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
    ))


def article_card(
        box: str,
        title: str,
        content: Optional[str] = None,
        items: Optional[List[Component]] = None,
        commands: Optional[List[Command]] = None,
) -> ArticleCard:
    """Create an article card for longer texts.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card’s title, displayed at the top.
        content: Markdown text.
        items: Collection of small buttons rendered under the title.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ArticleCard` instance.
    """
    return ArticleCard(
        box,
        title,
        content,
        items,
        commands,
    )


def breadcrumb(
        name: str,
        label: str,
) -> Breadcrumb:
    """Create a breadcrumb for a `h2o_wave.types.BreadcrumbsCard()`.

    Args:
        name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
        label: The label to display.
    Returns:
        A `h2o_wave.types.Breadcrumb` instance.
    """
    return Breadcrumb(
        name,
        label,
    )


def breadcrumbs_card(
        box: str,
        items: List[Breadcrumb],
        commands: Optional[List[Command]] = None,
) -> BreadcrumbsCard:
    """Create a card containing breadcrumbs.
    Breadcrumbs should be used as a navigational aid in your app or site.
    They indicate the current page’s location within a hierarchy and help
    the user understand where they are in relation to the rest of that hierarchy.
    They also afford one-click access to higher levels of that hierarchy.
    Breadcrumbs are typically placed, in horizontal form, under the masthead
    or navigation of an experience, above the primary content area.

    Args:
        box: A string indicating how to place this component on the page.
        items: A list of `h2o_wave.types.Breadcrumb` instances to display. See `h2o_wave.ui.breadcrumb()`
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.BreadcrumbsCard` instance.
    """
    return BreadcrumbsCard(
        box,
        items,
        commands,
    )


def canvas_card(
        box: str,
        title: str,
        width: int,
        height: int,
        data: PackedRecord,
        commands: Optional[List[Command]] = None,
) -> CanvasCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that displays a drawing canvas (whiteboard).

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        width: Canvas width, in pixels.
        height: Canvas height, in pixels.
        data: The data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.CanvasCard` instance.
    """
    return CanvasCard(
        box,
        title,
        width,
        height,
        data,
        commands,
    )


def chat_card(
        box: str,
        title: str,
        data: PackedRecord,
        capacity: Optional[int] = None,
        commands: Optional[List[Command]] = None,
) -> ChatCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that displays a chat room.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        data: The data for this card.
        capacity: The maximum number of messages contained in this card. Defaults to 50.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ChatCard` instance.
    """
    return ChatCard(
        box,
        title,
        data,
        capacity,
        commands,
    )


def chat_suggestion(
        name: str,
        label: str,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
) -> ChatSuggestion:
    """Create a chat prompt suggestion displayed as button below the last response in the chatbot component.

    Args:
        name: An identifying name for this component.
        label: The text displayed for this suggestion.
        caption: The caption displayed below the label.
        icon: The icon to be displayed for this suggestion.
    Returns:
        A `h2o_wave.types.ChatSuggestion` instance.
    """
    return ChatSuggestion(
        name,
        label,
        caption,
        icon,
    )


def chatbot_card(
        box: str,
        name: str,
        data: PackedRecord,
        placeholder: Optional[str] = None,
        events: Optional[List[str]] = None,
        generating: Optional[bool] = None,
        suggestions: Optional[List[ChatSuggestion]] = None,
        disabled: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> ChatbotCard:
    """Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers.

    Args:
        box: A string indicating how to place this component on the page.
        name: An identifying name for this component.
        data: Chat messages data. Requires cyclic buffer.
        placeholder: Chat input box placeholder. Use for prompt examples.
        events: The events to capture on this chatbot. One of 'stop' | 'scroll_up' | 'feedback' | 'suggestion'.
        generating: True to show a button to stop the text generation. Defaults to False.
        suggestions: Clickable prompt suggestions shown below the last response.
        disabled: True if the user input should be disabled.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ChatbotCard` instance.
    """
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


def editor_card(
        box: str,
        mode: str,
        commands: Optional[List[Command]] = None,
) -> EditorCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card that enables WYSIWYG editing on a page.
    Adding this card to a page makes the page editable by end-users.

    Args:
        box: A string indicating how to place this component on the page.
        mode: The editing mode. Defaults to `public`. One of 'public', 'private'. See enum h2o_wave.ui.EditorCardMode.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.EditorCard` instance.
    """
    return EditorCard(
        box,
        mode,
        commands,
    )


def flex_card(
        box: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
        direction: Optional[str] = None,
        justify: Optional[str] = None,
        align: Optional[str] = None,
        wrap: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> FlexCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards laid out using a one-dimensional model with flexible alignemnt and wrapping capabilities.

    Args:
        box: A string indicating how to place this component on the page.
        item_view: The child card type.
        item_props: The child card properties.
        data: Data for this card.
        direction: Layout direction. One of 'horizontal', 'vertical'. See enum h2o_wave.ui.FlexCardDirection.
        justify: Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.FlexCardJustify.
        align: Layout strategy for cross axis. One of 'start', 'end', 'center', 'baseline', 'stretch'. See enum h2o_wave.ui.FlexCardAlign.
        wrap: Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.FlexCardWrap.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FlexCard` instance.
    """
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


def footer_card(
        box: str,
        caption: str,
        items: Optional[List[Component]] = None,
        commands: Optional[List[Command]] = None,
) -> FooterCard:
    """Render a page footer displaying a caption.
    Footer cards are typically displayed at the bottom of a page.

    Args:
        box: A string indicating how to place this component on the page.
        caption: The caption. Supports markdown. *
        items: The components displayed to the right of the caption.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FooterCard` instance.
    """
    return FooterCard(
        box,
        caption,
        items,
        commands,
    )


def form_card(
        box: str,
        items: Union[List[Component], str],
        title: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> FormCard:
    """Create a form.

    Args:
        box: A string indicating how to place this component on the page.
        items: The components in this form.
        title: The title for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FormCard` instance.
    """
    return FormCard(
        box,
        items,
        title,
        commands,
    )


def frame_card(
        box: str,
        title: str,
        path: Optional[str] = None,
        content: Optional[str] = None,
        compact: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> FrameCard:
    """Render a card containing a HTML page inside an inline frame (an `iframe`).

    Either a path or content can be provided as arguments.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        path: The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`.
        content: The HTML content of the page. A string containing `<html>...</html>`.
        compact: True if title and padding should be removed. Defaults to False.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FrameCard` instance.
    """
    return FrameCard(
        box,
        title,
        path,
        content,
        compact,
        commands,
    )


def graphics_card(
        box: str,
        view_box: str,
        stage: Optional[PackedRecords] = None,
        scene: Optional[PackedData] = None,
        width: Optional[str] = None,
        height: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> GraphicsCard:
    """Create a card for displaying vector graphics.

    Args:
        box: A string indicating how to place this component on the page.
        view_box: The position and dimension of the SVG viewport, in user space. A space-separated list of four numbers: min-x, min-y, width and height. For example, '0 0 400 300'. See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
        stage: Background layer for rendering static SVG elements. Must be packed to conserve memory.
        scene: Foreground layer for rendering dynamic SVG elements.
        width: The displayed width of the rectangular viewport. (Not the width of its coordinate system.)
        height: The displayed height of the rectangular viewport. (Not the height of its coordinate system.)
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.GraphicsCard` instance.
    """
    return GraphicsCard(
        box,
        view_box,
        stage,
        scene,
        width,
        height,
        commands,
    )


def grid_card(
        box: str,
        title: str,
        cells: PackedData,
        data: PackedData,
        commands: Optional[List[Command]] = None,
) -> GridCard:
    """EXPERIMENTAL. DO NOT USE.

    Args:
        box: A string indicating how to place this component on the page.
        title: EXPERIMENTAL. DO NOT USE.
        cells: EXPERIMENTAL. DO NOT USE.
        data: EXPERIMENTAL. DO NOT USE.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.GridCard` instance.
    """
    return GridCard(
        box,
        title,
        cells,
        data,
        commands,
    )


def nav_item(
        name: str,
        label: str,
        icon: Optional[str] = None,
        disabled: Optional[bool] = None,
        tooltip: Optional[str] = None,
        path: Optional[str] = None,
) -> NavItem:
    """Create a navigation item.

    Args:
        name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
        label: The label to display.
        icon: An optional icon to display next to the label.
        disabled: True if this item should be disabled.
        tooltip: An optional tooltip message displayed when a user hovers over this item.
        path: The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab. E.g. `/foo.html` or `http://example.com/foo.html`
    Returns:
        A `h2o_wave.types.NavItem` instance.
    """
    return NavItem(
        name,
        label,
        icon,
        disabled,
        tooltip,
        path,
    )


def nav_group(
        label: str,
        items: List[NavItem],
        collapsed: Optional[bool] = None,
) -> NavGroup:
    """Create a group of navigation items.

    Args:
        label: The label to display for this group.
        items: The navigation items contained in this group.
        collapsed: Indicates whether nav groups should be rendered as collapsed initially
    Returns:
        A `h2o_wave.types.NavGroup` instance.
    """
    return NavGroup(
        label,
        items,
        collapsed,
    )


def header_card(
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
) -> HeaderCard:
    """Render a page header displaying a title, subtitle and an optional navigation menu.
    Header cards are typically used for top-level navigation.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title. *
        subtitle: The subtitle, displayed below the title. *
        icon: The icon, displayed to the left. *
        icon_color: The icon's color. *
        image: The URL of an image (usually logo) displayed to the left. Mutually exclusive with icon. *
        nav: The navigation menu to display when the header's icon is clicked. Recommended for mobile screens only. *
        items: Items that should be displayed on the right side of the header.
        secondary_items: Items that should be displayed in the center of the header.
        color: Header background color. Defaults to 'primary'. One of 'card', 'transparent', 'primary'. See enum h2o_wave.ui.HeaderCardColor.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.HeaderCard` instance.
    """
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


def image_card(
        box: str,
        title: str,
        type: Optional[str] = None,
        image: Optional[str] = None,
        data: Optional[PackedRecord] = None,
        path: Optional[str] = None,
        path_popup: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> ImageCard:
    """Create a card that displays a base64-encoded image.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        type: The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`.
        image: Image data, base64-encoded.
        data: Data for this card.
        path: The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`.
        path_popup: The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ImageCard` instance.
    """
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


def large_bar_stat_card(
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
) -> LargeBarStatCard:
    """Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        caption: The card's caption.
        value: The primary value displayed.
        aux_value: The auxiliary value, typically a target value.
        value_caption: The caption displayed below the primary value.
        aux_value_caption: The caption displayed below the auxiliary value.
        progress: The value of the progress bar, between 0 and 1.
        plot_color: The color of the progress bar.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.LargeBarStatCard` instance.
    """
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


def large_stat_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        caption: str,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> LargeStatCard:
    """Create a stat card displaying a primary value, an auxiliary value and a caption.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed next to the primary value.
        caption: The caption displayed below the primary value.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.LargeStatCard` instance.
    """
    return LargeStatCard(
        box,
        title,
        value,
        aux_value,
        caption,
        data,
        commands,
    )


def list_card(
        box: str,
        title: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
        commands: Optional[List[Command]] = None,
) -> ListCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards laid out in the form of a list (vertically, top-to-bottom).

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        item_view: The child card type.
        item_props: The child card properties.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ListCard` instance.
    """
    return ListCard(
        box,
        title,
        item_view,
        item_props,
        data,
        commands,
    )


def list_item1_card(
        box: str,
        title: str,
        caption: str,
        value: str,
        aux_value: str,
        data: PackedRecord,
        commands: Optional[List[Command]] = None,
) -> ListItem1Card:
    """EXPERIMENTAL. DO NOT USE.

    Args:
        box: A string indicating how to place this component on the page.
        title: EXPERIMENTAL. DO NOT USE.
        caption: EXPERIMENTAL. DO NOT USE.
        value: EXPERIMENTAL. DO NOT USE.
        aux_value: EXPERIMENTAL. DO NOT USE.
        data: EXPERIMENTAL. DO NOT USE.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ListItem1Card` instance.
    """
    return ListItem1Card(
        box,
        title,
        caption,
        value,
        aux_value,
        data,
        commands,
    )


def markdown_card(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
        compact: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> MarkdownCard:
    """Create a card that renders Markdown content.

    Github-flavored markdown is supported.
    HTML markup is allowed in markdown content.
    URLs, if found, are displayed as hyperlinks.
    Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        content: The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
        data: Additional data for the card.
        compact: Make spacing tighter. Defaults to True.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MarkdownCard` instance.
    """
    return MarkdownCard(
        box,
        title,
        content,
        data,
        compact,
        commands,
    )


def markup_card(
        box: str,
        title: str,
        content: str,
        compact: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> MarkupCard:
    """Render HTML content.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        content: The HTML content.
        compact: True if outer spacing should be removed. Defaults to False.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MarkupCard` instance.
    """
    return MarkupCard(
        box,
        title,
        content,
        compact,
        commands,
    )


def notification_bar(
        text: str,
        type: Optional[str] = None,
        timeout: Optional[int] = None,
        buttons: Optional[List[Component]] = None,
        position: Optional[str] = None,
        events: Optional[List[str]] = None,
        name: Optional[str] = None,
) -> NotificationBar:
    """Create a notification bar.

    A notification bar is an area at the edge of a primary view that displays relevant status information.
    You can use a notification bar to tell the user about a result of an action, e.g. "Data has been successfully saved".

    Args:
        text: The text displayed on the notification bar.
        type: The icon and color of the notification bar. Defaults to 'info'. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.NotificationBarType.
        timeout: How long the notification stays visible, in seconds. If set to -1, the notification has to be closed manually. Defaults to 5.
        buttons: Specify one or more action buttons.
        position: Specify the location of notification. Defaults to 'top-right'. One of 'top-right', 'bottom-right', 'bottom-center', 'bottom-left', 'top-left', 'top-center'. See enum h2o_wave.ui.NotificationBarPosition.
        events: The events to capture on this notification bar. One of 'dismissed'.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.NotificationBar` instance.
    """
    return NotificationBar(
        text,
        type,
        timeout,
        buttons,
        position,
        events,
        name,
    )


def zone(
        name: str,
        size: Optional[str] = None,
        direction: Optional[str] = None,
        justify: Optional[str] = None,
        align: Optional[str] = None,
        wrap: Optional[str] = None,
        zones: Optional[List[Zone]] = None,
) -> Zone:
    """Represents an zone within a page layout.

    Args:
        name: An identifying name for this zone.
        size: The size of this zone.
        direction: Layout direction. One of 'row', 'column'. See enum h2o_wave.ui.ZoneDirection.
        justify: Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ZoneJustify.
        align: Layout strategy for cross axis. One of 'start', 'end', 'center', 'stretch'. See enum h2o_wave.ui.ZoneAlign.
        wrap: Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.ZoneWrap.
        zones: The sub-zones contained inside this zone.
    Returns:
        A `h2o_wave.types.Zone` instance.
    """
    return Zone(
        name,
        size,
        direction,
        justify,
        align,
        wrap,
        zones,
    )


def layout(
        breakpoint: str,
        zones: List[Zone],
        width: Optional[str] = None,
        min_width: Optional[str] = None,
        max_width: Optional[str] = None,
        height: Optional[str] = None,
        min_height: Optional[str] = None,
        max_height: Optional[str] = None,
        name: Optional[str] = None,
) -> Layout:
    """Represents the layout structure for a page.

    Args:
        breakpoint: The minimum viewport width at which to use this layout. Values must be pixel widths (e.g. '0px', '576px', '768px') or a named preset. The named presets are: 'xs': '0px' for extra small devices (portrait phones), 's': '576px' for small devices (landscape phones), 'm': '768px' for medium devices (tablets), 'l': '992px' for large devices (desktops), 'xl': '1200px' for extra large devices (large desktops).  A breakpoint value of 'xs' (or '0') matches all viewport widths, unless other breakpoints are set.
        zones: The zones in this layout. Each zones can in turn contain sub-zones.
        width: The width of the layout. Defaults to `100%`.
        min_width: The minimum width of the layout.
        max_width: The maximum width of the layout.
        height: The height of the layout. Defaults to `auto`.
        min_height: The minimum height of the layout.
        max_height: The maximum height of the layout.
        name: An identifying name for this zone.
    Returns:
        A `h2o_wave.types.Layout` instance.
    """
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


def dialog(
        title: str,
        items: List[Component],
        width: Optional[str] = None,
        closable: Optional[bool] = None,
        blocking: Optional[bool] = None,
        primary: Optional[bool] = None,
        name: Optional[str] = None,
        events: Optional[List[str]] = None,
) -> Dialog:
    """A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
    and requires people to interact with it. It’s primarily used for confirming actions,
    such as deleting a file, or asking people to make a choice.

    Args:
        title: The dialog's title.
        items: The components displayed in this dialog.
        width: The width of the dialog, e.g. '400px'. Defaults to '600px'.
        closable: True if the dialog should have a closing 'X' button at the top right corner.
        blocking: True to prevent closing when clicking or tapping outside the dialog. Prevents interacting with the page behind the dialog. Defaults to False.
        primary: Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to False.
        name: An identifying name for this component.
        events: The events to capture on this dialog. One of 'dismissed'.
    Returns:
        A `h2o_wave.types.Dialog` instance.
    """
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


def side_panel(
        title: str,
        items: List[Component],
        width: Optional[str] = None,
        name: Optional[str] = None,
        events: Optional[List[str]] = None,
        blocking: Optional[bool] = None,
        closable: Optional[bool] = None,
) -> SidePanel:
    """A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
    and requires people to interact with it. It’s primarily used for confirming actions,
    such as deleting a file, or asking people to make a choice.

    Args:
        title: The side panel's title.
        items: The components displayed in this side panel.
        width: The width of the dialog, e.g. '400px'. Defaults to '600px'.
        name: An identifying name for this component.
        events: The events to capture on this side panel. One of 'dismissed'.
        blocking: True to prevent closing when clicking or tapping outside the side panel. Prevents interacting with the page behind the side panel. Defaults to False.
        closable: True if the side panel should have a closing 'X' button at the top right corner.
    Returns:
        A `h2o_wave.types.SidePanel` instance.
    """
    return SidePanel(
        title,
        items,
        width,
        name,
        events,
        blocking,
        closable,
    )


def theme(
        name: str,
        text: str,
        card: str,
        page: str,
        primary: str,
) -> Theme:
    """Theme (color scheme) to apply colors to the app.

    Args:
        name: An identifying name for this theme.
        text: Base color of the textual components.
        card: Card background color.
        page: Page background color.
        primary: Primary color used to accent components.
    Returns:
        A `h2o_wave.types.Theme` instance.
    """
    return Theme(
        name,
        text,
        card,
        page,
        primary,
    )


def tracker(
        type: str,
        id: str,
) -> Tracker:
    """Configure user interaction tracking (analytics) for a page.

    Args:
        type: The tracking provider. Supported providers are `ga` (Google Analytics) and `gtag` (Google Global Site Tags or gtag.js) One of 'ga', 'gtag'. See enum h2o_wave.ui.TrackerType.
        id: The tracking ID or measurement ID.
    Returns:
        A `h2o_wave.types.Tracker` instance.
    """
    return Tracker(
        type,
        id,
    )


def script(
        path: str,
        asynchronous: Optional[bool] = None,
        cross_origin: Optional[str] = None,
        referrer_policy: Optional[str] = None,
        integrity: Optional[str] = None,
) -> Script:
    """Create a reference to an external Javascript file to be included on a page.

    Args:
        path: The URI of an external script.
        asynchronous: Whether to fetch and load this script in parallel to parsing and evaluated as soon as it is available.
        cross_origin: The CORS setting for this script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
        referrer_policy: Indicates which referrer to send when fetching the script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
        integrity: The cryptographic hash to verify the script's integrity. See https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
    Returns:
        A `h2o_wave.types.Script` instance.
    """
    return Script(
        path,
        asynchronous,
        cross_origin,
        referrer_policy,
        integrity,
    )


def inline_script(
        content: str,
        requires: Optional[List[str]] = None,
        targets: Optional[List[str]] = None,
) -> InlineScript:
    """Create a block of inline Javascript to be executed immediately on a page.

    Args:
        content: The Javascript source code to be executed.
        requires: The names of modules required on the page's `window` global before running this script.
        targets: The HTML elements required to be present on the page before running this script. Each 'target' can either be the ID of the element (`foo`) or a CSS selector (`#foo`, `.foo`, `table > td.foo`, etc.).
    Returns:
        A `h2o_wave.types.InlineScript` instance.
    """
    return InlineScript(
        content,
        requires,
        targets,
    )


def inline_stylesheet(
        content: str,
        media: Optional[str] = None,
) -> InlineStylesheet:
    """Create an inline CSS to be injected into a page.

    Args:
        content: The CSS to be applied to this page.
        media: A valid media query to set conditions for when the style should be applied. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style#attr-media.
    Returns:
        A `h2o_wave.types.InlineStylesheet` instance.
    """
    return InlineStylesheet(
        content,
        media,
    )


def stylesheet(
        path: str,
        media: Optional[str] = None,
        cross_origin: Optional[str] = None,
) -> Stylesheet:
    """Create a reference to an external CSS file to be included on a page.

    Args:
        path: The URI of an external stylesheet.
        media: A valid media query to set conditions for when the stylesheet should be loaded. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-media.
        cross_origin: The CORS setting. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-crossorigin
    Returns:
        A `h2o_wave.types.Stylesheet` instance.
    """
    return Stylesheet(
        path,
        media,
        cross_origin,
    )


def meta_card(
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
) -> MetaCard:
    """Represents page-global state.

    This card is invisible.
    It is used to control attributes of the active page.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title of the page.
        refresh: Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use).
        notification: Display a desktop notification.
        notification_bar: Display an in-app notification bar.
        redirect: Redirect the page to a new URL.
        icon: Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers). Not supported in Safari.
        layouts: The layouts supported by this page.
        dialog: Display a dialog on the page.
        side_panel: Display a side panel on the page.
        theme: Specify the name of the theme (color scheme) to use on this page. One of 'light', 'neon' or 'h2o-dark'.
        themes: * Themes (color schemes) that define color used in the app.
        tracker: Configure a tracker for the page (for web analytics).
        scripts: External Javascript files to load into the page.
        script: Javascript code to execute on this page.
        stylesheet: CSS stylesheet to be applied to this page.
        stylesheets: External CSS files to load into the page.
        animate: EXPERIMENTAL: True to turn on the card animations. Defaults to False.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MetaCard` instance.
    """
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


def nav_card(
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
) -> NavCard:
    """Create a card containing a navigation pane.

    Args:
        box: A string indicating how to place this component on the page.
        items: The navigation groups contained in this pane.
        value: The name of the active (highlighted) navigation item.
        title: The card's title.
        subtitle: The card's subtitle.
        icon: The icon, displayed to the left. *
        icon_color: The icon's color. *
        image: The URL of an image (usually logo) displayed at the top. *
        persona: The user avatar displayed at the top. Mutually exclusive with image, title and subtitle. *
        secondary_items: Items that should be displayed at the bottom of the card if items are not empty, otherwise displayed under subtitle.
        color: Card background color. Defaults to 'card'. One of 'card', 'primary'. See enum h2o_wave.ui.NavCardColor.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.NavCard` instance.
    """
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


def pixel_art_card(
        box: str,
        title: str,
        data: PackedRecord,
        commands: Optional[List[Command]] = None,
) -> PixelArtCard:
    """WARNING: Experimental and subject to change.
    Do not use in production sites!

    Create a card displaying a collaborative Pixel art tool.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        data: The data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.PixelArtCard` instance.
    """
    return PixelArtCard(
        box,
        title,
        data,
        commands,
    )


def plot_card(
        box: str,
        title: str,
        data: PackedRecord,
        plot: Plot,
        events: Optional[List[str]] = None,
        interactions: Optional[List[str]] = None,
        animate: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> PlotCard:
    """Create a card displaying a plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        data: Data for this card.
        plot: The plot to be displayed in this card.
        events: The events to capture on this card. One of 'select_marks'.
        interactions: The interactions to be allowed for this card. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event.
        animate: EXPERIMENTAL: True to turn on the chart animations. Defaults to False.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.PlotCard` instance.
    """
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


def post_card(
        box: str,
        persona: Component,
        image: str,
        aux_value: Optional[str] = None,
        caption: Optional[str] = None,
        items: Optional[List[Component]] = None,
        commands: Optional[List[Command]] = None,
) -> PostCard:
    """Create a postcard displaying a persona, image, caption and optional buttons.

    Args:
        box: A string indicating how to place this component on the page.
        persona: The card's user avatar, 'size' prop is restricted to 'xs'.
        image: The card’s image.
        aux_value: The card's aux_value, displayed on the right hand side of the image.
        caption: The card's caption, displayed below the image.
        items: The card's buttons, displayed at the bottom.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.PostCard` instance.
    """
    return PostCard(
        box,
        persona,
        image,
        aux_value,
        caption,
        items,
        commands,
    )


def preview_card(
        box: str,
        name: str,
        image: str,
        title: Optional[str] = None,
        items: Optional[List[Component]] = None,
        caption: Optional[str] = None,
        label: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> PreviewCard:
    """Create a preview card displaying an image with shadow overlay, title, social icons, caption, and button.

    Args:
        box: A string indicating how to place this component on the page.
        name: An identifying name for this card. Makes the card clickable if label is not provided, similar to a button.
        image: The card’s image.
        title: The card's title
        items: Mini buttons displayed at the top-right corner
        caption: The card's caption, displayed below the title.
        label: Label of a button rendered at the bottom of the card. If specified, the whole card is not clickable anymore.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.PreviewCard` instance.
    """
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


def profile_card(
        box: str,
        persona: Component,
        image: str,
        items: Optional[List[Component]] = None,
        height: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> ProfileCard:
    """Create a profile card to display information about a user.

    Args:
        box: A string indicating how to place this component on the page.
        persona: The persona represented by this card.
        image: The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`) or a path to an image hosted on the Wave daemon (starting with `/`). .
        items: Components in this card displayed below the image.
        height: The height of the bottom content (items), e.g. '400px'. Use sparingly, e.g. in grid views.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ProfileCard` instance.
    """
    return ProfileCard(
        box,
        persona,
        image,
        items,
        height,
        commands,
    )


def repeat_card(
        box: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
        commands: Optional[List[Command]] = None,
) -> RepeatCard:
    """EXPERIMENTAL. DO NOT USE.
    Create a card containing other cards.

    Args:
        box: A string indicating how to place this component on the page.
        item_view: EXPERIMENTAL. DO NOT USE.
        item_props: The child card properties.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.RepeatCard` instance.
    """
    return RepeatCard(
        box,
        item_view,
        item_props,
        data,
        commands,
    )


def section_card(
        box: str,
        title: str,
        subtitle: str,
        items: Optional[Union[List[Component], str]] = None,
        commands: Optional[List[Command]] = None,
) -> SectionCard:
    """Render a card displaying a title, a subtitle, and optional components.
    Section cards are typically used to demarcate different sections on a page.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title.
        subtitle: The subtitle, displayed below the title. Supports Markdown.
        items: The components to display in this card
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.SectionCard` instance.
    """
    return SectionCard(
        box,
        title,
        subtitle,
        items,
        commands,
    )


def small_series_stat_card(
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
) -> SmallSeriesStatCard:
    """Create a small stat card displaying a primary value and a series plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        plot_data: The plot's data.
        plot_value: The data field to use for y-axis values.
        plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
        plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.SmallSeriesStatCardPlotType.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.SmallSeriesStatCardPlotCurve.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.SmallSeriesStatCard` instance.
    """
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


def small_stat_card(
        box: str,
        title: str,
        value: str,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> SmallStatCard:
    """Create a stat card displaying a single value.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.SmallStatCard` instance.
    """
    return SmallStatCard(
        box,
        title,
        value,
        data,
        commands,
    )


def stat_list_item(
        label: str,
        name: Optional[str] = None,
        caption: Optional[str] = None,
        value: Optional[str] = None,
        value_color: Optional[str] = None,
        aux_value: Optional[str] = None,
        icon: Optional[str] = None,
        icon_color: Optional[str] = None,
) -> StatListItem:
    """Create a stat item (a label-value pair) for stat_list_card.

    Args:
        label: The label for the metric.
        name: An optional name for this item (required only if this item is clickable).
        caption: The caption for the metric, displayed below the label.
        value: The primary value of the metric.
        value_color: The font color of the primary value.
        aux_value: The auxiliary value, displayed below the primary value.
        icon: An optional icon, displayed next to the label.
        icon_color: The color of the icon.
    Returns:
        A `h2o_wave.types.StatListItem` instance.
    """
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


def stat_list_card(
        box: str,
        title: str,
        items: List[StatListItem],
        name: Optional[str] = None,
        subtitle: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> StatListCard:
    """Render a card displaying a list of stats.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title.
        items: The individual stats to be displayed.
        name: An optional name for this item.
        subtitle: The subtitle, displayed below the title.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.StatListCard` instance.
    """
    return StatListCard(
        box,
        title,
        items,
        name,
        subtitle,
        commands,
    )


def stat_table_item(
        label: str,
        values: List[str],
        name: Optional[str] = None,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        icon_color: Optional[str] = None,
        colors: Optional[List[str]] = None,
) -> StatTableItem:
    """Create a stat item (a label and a set of values) for stat_table_card.

    Args:
        label: The label for the row.
        values: The values displayed in the row.
        name: An optional name for this row (required only if this row is clickable).
        caption: The caption for the metric, displayed below the label.
        icon: An optional icon, displayed next to the label.
        icon_color: The color of the icon.
        colors: List of colors used for each value in values ordered respectively.
    Returns:
        A `h2o_wave.types.StatTableItem` instance.
    """
    return StatTableItem(
        label,
        values,
        name,
        caption,
        icon,
        icon_color,
        colors,
    )


def stat_table_card(
        box: str,
        title: str,
        columns: List[str],
        items: List[StatTableItem],
        name: Optional[str] = None,
        subtitle: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> StatTableCard:
    """Render a card displaying a table of stats.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title.
        columns: The names of this table's columns.
        items: The rows displayed in this table.
        name: An optional name for this item.
        subtitle: The subtitle, displayed below the title.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.StatTableCard` instance.
    """
    return StatTableCard(
        box,
        title,
        columns,
        items,
        name,
        subtitle,
        commands,
    )


def tab_card(
        box: str,
        items: List[Tab],
        value: Optional[str] = None,
        link: Optional[bool] = None,
        name: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> TabCard:
    """Create a card containing tabs for navigation.

    Args:
        box: A string indicating how to place this component on the page.
        items: The tabs to display in this card
        value: The name of the tab to select.
        link: True if tabs should be rendered as links instead of buttons.
        name: An optional name for the card. If provided, the selected tab can be accessed using the name of the card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TabCard` instance.
    """
    return TabCard(
        box,
        items,
        value,
        link,
        name,
        commands,
    )


def tall_article_preview_card(
        box: str,
        title: str,
        image: str,
        subtitle: Optional[str] = None,
        value: Optional[str] = None,
        content: Optional[str] = None,
        name: Optional[str] = None,
        items: Optional[List[Component]] = None,
        commands: Optional[List[Command]] = None,
) -> TallArticlePreviewCard:
    """Create a tall article preview card.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        image: The card’s background image URL, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`) or a path to an image hosted on the Wave daemon (starting with `/`)
        subtitle: The card's subtitle, displayed below the title.
        value: The value displayed to the right of the title/subtitle.
        content: Markdown text.
        name: An identifying name for this card. Makes the card clickable, similar to a button.
        items: Components displayed in the body of the card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TallArticlePreviewCard` instance.
    """
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


def tall_gauge_stat_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: Optional[str] = None,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> TallGaugeStatCard:
    """Create a tall stat card displaying a primary value, an auxiliary value and a progress gauge.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed next to the primary value.
        progress: The value of the progress gauge, between 0 and 1.
        plot_color: The color of the progress gauge.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TallGaugeStatCard` instance.
    """
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


def tall_info_card(
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
) -> TallInfoCard:
    """Create a tall information card displaying a title, caption and either an icon or image.

    Args:
        box: A string indicating how to place this component on the page.
        name: An identifying name for this card. Makes the card clickable only if name is not empty and label is empty
        title: The card's title.
        caption: The card's caption, displayed below the title. Supports markdown.
        label: Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore.
        icon: The card's icon.
        image: The card’s image.
        image_height: The card’s image height in px. Defaults to '150px'.
        category: The card's category, displayed below the title.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TallInfoCard` instance.
    """
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


def tall_series_stat_card(
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
) -> TallSeriesStatCard:
    """Create a tall stat card displaying a primary value, an auxiliary value and a series plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed below the primary value.
        plot_data: The plot's data.
        plot_value: The data field to use for y-axis values.
        plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
        plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.TallSeriesStatCardPlotType.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.TallSeriesStatCardPlotCurve.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TallSeriesStatCard` instance.
    """
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


def tall_stats_card(
        box: str,
        items: List[Stat],
        name: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> TallStatsCard:
    """Create a vertical label-value pairs collection. Icon in `ui.stat` is not yet supported in this card.

    Args:
        box: A string indicating how to place this component on the page.
        items: The individual stats to be displayed.
        name: An identifying name for this component.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TallStatsCard` instance.
    """
    return TallStatsCard(
        box,
        items,
        name,
        commands,
    )


def template_card(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> TemplateCard:
    """Render dynamic content using an HTML template.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        content: The Handlebars template. https://handlebarsjs.com/guide/
        data: Data for the Handlebars template.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.TemplateCard` instance.
    """
    return TemplateCard(
        box,
        title,
        content,
        data,
        commands,
    )


def toolbar_card(
        box: str,
        items: List[Command],
        secondary_items: Optional[List[Command]] = None,
        overflow_items: Optional[List[Command]] = None,
        commands: Optional[List[Command]] = None,
) -> ToolbarCard:
    """Create a card containing a toolbar.

    Args:
        box: A string indicating how to place this component on the page.
        items: Items to render.
        secondary_items: Items to render on the right side (or left, in RTL).
        overflow_items: Items to render in an overflow menu.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.ToolbarCard` instance.
    """
    return ToolbarCard(
        box,
        items,
        secondary_items,
        overflow_items,
        commands,
    )


def vega_card(
        box: str,
        title: str,
        specification: str,
        data: Optional[PackedRecord] = None,
        grammar: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> VegaCard:
    """Create a card containing a Vega-lite plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title of this card.
        specification: The Vega-lite specification.
        data: Data for the plot, if any.
        grammar: Vega grammar to use. Defaults to 'vega-lite'. One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaCardGrammar.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.VegaCard` instance.
    """
    return VegaCard(
        box,
        title,
        specification,
        data,
        grammar,
        commands,
    )


def wide_article_preview_card(
        box: str,
        persona: Component,
        image: str,
        title: str,
        name: Optional[str] = None,
        aux_value: Optional[str] = None,
        items: Optional[List[Component]] = None,
        content: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> WideArticlePreviewCard:
    """Create a wide article preview card displaying a persona, image, title, caption, and optional buttons.

    Args:
        box: A string indicating how to place this component on the page.
        persona: The card's user avatar, 'size' prop is restricted to 'xs'.
        image: The card’s image displayed on the left-hand side.
        title: The card's title on the right-hand side
        name: An identifying name for this card. Makes the card clickable, similar to a button.
        aux_value: The card's auxiliary text, displayed on the right-hand side of the header.
        items: The card's buttons, displayed under the caption.
        content: The card's markdown content, displayed below the title on the right-hand side.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WideArticlePreviewCard` instance.
    """
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


def wide_bar_stat_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: Optional[str] = None,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> WideBarStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a progress bar.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed next to the primary value.
        progress: The value of the progress bar, between 0 and 1.
        plot_color: The color of the progress bar.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WideBarStatCard` instance.
    """
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


def wide_gauge_stat_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: Optional[str] = None,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> WideGaugeStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a progress gauge.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed next to the primary value.
        progress: The value of the progress gauge, between 0 and 1.
        plot_color: The color of the progress gauge.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WideGaugeStatCard` instance.
    """
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


def wide_info_card(
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
) -> WideInfoCard:
    """Create a wide information card displaying a title, caption, and either an icon or image.

    Args:
        box: A string indicating how to place this component on the page.
        name: An identifying name for this card. Makes the card clickable, similar to a button.
        title: The card's title.
        caption: The card's caption, displayed below the subtitle. Supports markdown.
        label: Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore..
        subtitle: The card's subtitle, displayed below the title.
        align: The card's alignment, determines the position of an image / icon. Defaults to 'left'. One of 'left', 'right'. See enum h2o_wave.ui.WideInfoCardAlign.
        icon: The card's icon.
        image: The card’s image.
        category: The card's category, displayed above the title.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WideInfoCard` instance.
    """
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


def pie(
        label: str,
        value: str,
        fraction: float,
        color: str,
        aux_value: Optional[str] = None,
) -> Pie:
    """Card's pie chart data to be displayed.

    Args:
        label: The description for the pie, displayed in the legend.
        value: The formatted value displayed on the pie.
        fraction: A value between 0 and 1 indicating the size of the pie.
        color: The color of the pie.
        aux_value: The auxiliary value, displayed below the label.
    Returns:
        A `h2o_wave.types.Pie` instance.
    """
    return Pie(
        label,
        value,
        fraction,
        color,
        aux_value,
    )


def wide_pie_stat_card(
        box: str,
        title: str,
        pies: List[Pie],
        commands: Optional[List[Command]] = None,
) -> WidePieStatCard:
    """Create a wide pie stat card displaying a title and pie chart with legend.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        pies: The pies to be included in the pie chart.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WidePieStatCard` instance.
    """
    return WidePieStatCard(
        box,
        title,
        pies,
        commands,
    )


def wide_plot_card(
        box: str,
        title: str,
        caption: str,
        plot: Plot,
        data: PackedRecord,
        commands: Optional[List[Command]] = None,
) -> WidePlotCard:
    """Create a wide plot card displaying a title, caption and a plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        caption: The card's caption, displayed below the title.
        plot: The card's plot.
        data: The card's plot data.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WidePlotCard` instance.
    """
    return WidePlotCard(
        box,
        title,
        caption,
        plot,
        data,
        commands,
    )


def wide_series_stat_card(
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
) -> WideSeriesStatCard:
    """Create a wide stat card displaying a primary value, an auxiliary value and a series plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        value: The primary value displayed.
        aux_value: The auxiliary value displayed below the primary value.
        plot_data: The plot's data.
        plot_value: The data field to use for y-axis values.
        plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
        plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'. See enum h2o_wave.ui.WideSeriesStatCardPlotType.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.WideSeriesStatCardPlotCurve.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.WideSeriesStatCard` instance.
    """
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
