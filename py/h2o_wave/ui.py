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


def command(
        name: str,
        label: Optional[str] = None,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        items: Optional[List[Command]] = None,
        value: Optional[str] = None,
        data: Optional[str] = None,
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
        data: DEPRECATED. Use `value` instead. Data associated with this command, if any.
    Returns:
        A `h2o_wave.types.Command` instance.
    """
    if data is not None:
        warnings.warn('The data argument is deprecated.')
    return Command(
        name,
        label,
        caption,
        icon,
        items,
        value,
        data,
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
        commands: Optional[List[Command]] = None,
) -> FooterCard:
    """Render a page footer displaying a caption.
    Footer cards are typically displayed at the bottom of a page.

    Args:
        box: A string indicating how to place this component on the page.
        caption: The caption. Supports markdown.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FooterCard` instance.
    """
    return FooterCard(
        box,
        caption,
        commands,
    )


def text(
        content: str,
        size: Optional[str] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create text content.

    Args:
        content: The text content.
        size: The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.TextSize.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Text` instance.
    """
    return Component(text=Text(
        content,
        size,
        visible,
        tooltip,
        name,
    ))


def text_xl(
        content: str,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        commands: Optional[List[Command]] = None,
        name: Optional[str] = None,
) -> Component:
    """Create extra-large sized text content.

    Args:
        content: The text content.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        commands: Contextual menu commands for this component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextXl` instance.
    """
    return Component(text_xl=TextXl(
        content,
        visible,
        tooltip,
        commands,
        name,
    ))


def text_l(
        content: str,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        commands: Optional[List[Command]] = None,
        name: Optional[str] = None,
) -> Component:
    """Create large sized text content.

    Args:
        content: The text content.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        commands: Contextual menu commands for this component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextL` instance.
    """
    return Component(text_l=TextL(
        content,
        visible,
        tooltip,
        commands,
        name,
    ))


def text_m(
        content: str,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create medium sized text content.

    Args:
        content: The text content.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextM` instance.
    """
    return Component(text_m=TextM(
        content,
        visible,
        tooltip,
        name,
    ))


def text_s(
        content: str,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create small sized text content.

    Args:
        content: The text content.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextS` instance.
    """
    return Component(text_s=TextS(
        content,
        visible,
        tooltip,
        name,
    ))


def text_xs(
        content: str,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
) -> Component:
    """Create extra-small sized text content.

    Args:
        content: The text content.
        visible: True if the component should be visible. Defaults to true.
        tooltip: Tooltip message.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.TextXs` instance.
    """
    return Component(text_xs=TextXs(
        content,
        visible,
        tooltip,
        name,
    ))


def label(
        label: str,
        required: Optional[bool] = None,
        disabled: Optional[bool] = None,
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
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Label` instance.
    """
    return Component(label=Label(
        label,
        required,
        disabled,
        visible,
        tooltip,
        name,
    ))


def separator(
        label: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a separator.

    A separator visually separates content into groups.

    Args:
        label: The text displayed on the separator.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.Separator` instance.
    """
    return Component(separator=Separator(
        label,
        name,
        visible,
    ))


def progress(
        label: str,
        caption: Optional[str] = None,
        value: Optional[float] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
        name: Optional[str] = None,
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
        label: The text displayed above the bar.
        caption: The text displayed below the bar.
        value: The progress, between 0.0 and 1.0, or -1 (default) if indeterminate.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
        name: An identifying name for this component.
    Returns:
        A `h2o_wave.types.Progress` instance.
    """
    return Component(progress=Progress(
        label,
        caption,
        value,
        visible,
        tooltip,
        name,
    ))


def message_bar(
        type: Optional[str] = None,
        text: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a message bar.

    A message bar is an area at the top of a primary view that displays relevant status information.
    You can use a message bar to tell the user about a situation that does not require their immediate attention and
    therefore does not need to block other activities.

    Args:
        type: The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.MessageBarType.
        text: The text displayed on the message bar.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.MessageBar` instance.
    """
    return Component(message_bar=MessageBar(
        type,
        text,
        name,
        visible,
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        height: The height of the text box, e.g. '100px'. Applicable only if `multiline` is true.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        visible,
        tooltip,
    ))


def checkbox(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        indeterminate: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
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
        visible: True if the component should be visible. Defaults to true.
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
        visible,
        tooltip,
    ))


def toggle(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
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
        visible: True if the component should be visible. Defaults to true.
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
        visible: True if the component should be visible. Defaults to true.
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
        visible,
        tooltip,
    ))


def checklist(
        name: str,
        label: Optional[str] = None,
        values: Optional[List[str]] = None,
        choices: Optional[List[Choice]] = None,
        trigger: Optional[bool] = None,
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
        visible: True if the component should be visible. Defaults to true.
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        visible,
        tooltip,
    ))


def combobox(
        name: str,
        label: Optional[str] = None,
        placeholder: Optional[str] = None,
        value: Optional[str] = None,
        choices: Optional[List[str]] = None,
        error: Optional[str] = None,
        disabled: Optional[bool] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        choices: The choices to be presented.
        error: Text to be displayed as an error below the text box.
        disabled: True if this field is disabled.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Combobox` instance.
    """
    return Component(combobox=Combobox(
        name,
        label,
        placeholder,
        value,
        choices,
        error,
        disabled,
        visible,
        tooltip,
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
        visible: True if the component should be visible. Defaults to true.
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a spinbox.

    A spinbox allows the user to incrementally adjust a value in small steps.
    It is mainly used for numeric values, but other values are supported too.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        min: The minimum value of the spinbox.
        max: The maximum value of the spinbox.
        step: The difference between two adjacent values of the spinbox.
        value: The current value of the spinbox.
        disabled: True if this field is disabled.
        visible: True if the component should be visible. Defaults to true.
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
        visible,
        tooltip,
    ))


def date_picker(
        name: str,
        label: Optional[str] = None,
        placeholder: Optional[str] = None,
        value: Optional[str] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        visible,
        tooltip,
    ))


def color_picker(
        name: str,
        label: Optional[str] = None,
        value: Optional[str] = None,
        choices: Optional[List[str]] = None,
        visible: Optional[bool] = None,
        trigger: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a color picker.

    A date picker allows a user to pick a color value.
    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        value: The selected color (CSS-compatible string).
        choices: A list of colors (CSS-compatible strings) to limit color choices to.
        visible: True if the component should be visible. Defaults to true.
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        caption: The caption displayed below the label. Setting a caption renders a compound button.
        value: A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True.
        primary: True if the button should be rendered as the primary button in the set.
        disabled: True if the button should be disabled.
        link: True if the button should be rendered as link text and not a standard button.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        visible,
        tooltip,
    ))


def buttons(
        items: List[Component],
        justify: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a set of buttons laid out horizontally.

    Args:
        items: The button in this set.
        justify: Specifies how to lay out buttons horizontally. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ButtonsJustify.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.Buttons` instance.
    """
    return Component(buttons=Buttons(
        items,
        justify,
        name,
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a file upload component.
    A file upload component allows a user to browse, select and upload one or more files.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        multiple: True if the component should allow multiple files to be uploaded.
        file_extensions: List of allowed file extensions, e.g. `pdf`, `docx`, etc.
        max_file_size: Maximum allowed size (Mb) per file. Defaults to no limit.
        max_size: Maximum allowed size (Mb) for all files combined. Defaults to no limit.
        height: The height of the file upload, e.g. '400px', '50%', etc.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        visible,
        tooltip,
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
        link: Indicates whether each cell in this column should be displayed as a clickable link.
        data_type: Defines the data type of this column. Defaults to `string`. One of 'string', 'number', 'time'. See enum h2o_wave.ui.TableColumnDataType.
        cell_type: Defines how to render each cell in this column. Defaults to plain text.
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


def table(
        name: str,
        columns: List[TableColumn],
        rows: List[TableRow],
        multiple: Optional[bool] = None,
        groupable: Optional[bool] = None,
        downloadable: Optional[bool] = None,
        resettable: Optional[bool] = None,
        height: Optional[str] = None,
        values: Optional[List[str]] = None,
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
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

    Args:
        name: An identifying name for this component.
        columns: The columns in this table.
        rows: The rows in this table.
        multiple: True to allow multiple rows to be selected.
        groupable: True to allow group by feature.
        downloadable: Indicates whether the contents of this table can be downloaded and saved as a CSV file. Defaults to False.
        resettable: Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False.
        height: The height of the table, e.g. '400px', '50%', etc.
        values: The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`).
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
        values,
        visible,
        tooltip,
    ))


def link(
        label: Optional[str] = None,
        path: Optional[str] = None,
        disabled: Optional[bool] = None,
        download: Optional[bool] = None,
        button: Optional[bool] = None,
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
        download: True if the link should be used for file download.
        button: True if the link should be rendered as a button.
        visible: True if the component should be visible. Defaults to true.
        target: Where to display the link. Setting this to an empty string or `'_blank'` opens the link in a new tab or window.
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
        visible,
        target,
        tooltip,
        name,
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
        visible: Optional[bool] = None,
        link: Optional[bool] = None,
) -> Component:
    """Create a tab bar.

    Args:
        name: An identifying name for this component.
        value: The name of the tab to select.
        items: The tabs in this tab bar.
        visible: True if the component should be visible. Defaults to true.
        link: True if tabs should be rendered as links instead of buttons.
    Returns:
        A `h2o_wave.types.Tabs` instance.
    """
    return Component(tabs=Tabs(
        name,
        value,
        items,
        visible,
        link,
    ))


def expander(
        name: str,
        label: Optional[str] = None,
        expanded: Optional[bool] = None,
        items: Optional[List[Component]] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Creates a new expander.

    Expanders can be used to show or hide a group of related components.

    Args:
        name: An identifying name for this component.
        label: The text displayed on the expander.
        expanded: True if expanded, False if collapsed.
        items: List of components to be hideable by the expander.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.Expander` instance.
    """
    return Component(expander=Expander(
        name,
        label,
        expanded,
        items,
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
        width: The width of the frame, e.g. `200px`, `50%`, etc. Defaults to `100%`.
        height: The height of the frame, e.g. `200px`, `50%`, etc. Defaults to `150px`.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
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
        visible: Optional[bool] = None,
) -> Component:
    """Render HTML content.

    Args:
        content: The HTML content.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.Markup` instance.
    """
    return Component(markup=Markup(
        content,
        name,
        visible,
    ))


def template(
        content: str,
        data: Optional[PackedRecord] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Render dynamic content using an HTML template.

    Args:
        content: The Handlebars template. https://handlebarsjs.com/guide/
        data: Data for the Handlebars template
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
    Returns:
        A `h2o_wave.types.Template` instance.
    """
    return Component(template=Template(
        content,
        data,
        name,
        visible,
    ))


def picker(
        name: str,
        choices: List[Choice],
        label: Optional[str] = None,
        values: Optional[List[str]] = None,
        max_choices: Optional[int] = None,
        disabled: Optional[bool] = None,
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
        max_choices: Maximum number of selectable choices. Defaults to no limit.
        disabled: Controls whether the picker should be disabled or not.
        visible: True if the component should be visible. Defaults to true.
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
        disabled,
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
        max_value: The upper bound of the selected range.
        disabled: True if this field is disabled.
        trigger: True if the form should be submitted when the slider value changes.
        visible: True if the component should be visible. Defaults to true.
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
        visible: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a component that displays a sequence of steps in a process.
    The steps keep users informed about where they are in the process and how much is left to complete.

    Args:
        name: An identifying name for this component.
        items: The sequence of steps to be displayed.
        visible: True if the component should be visible. Defaults to true.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_wave.types.Stepper` instance.
    """
    return Component(stepper=Stepper(
        name,
        items,
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
) -> Mark:
    """Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
    A plot can contain multiple such layers of marks.

    Args:
        coord: Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'. See enum h2o_wave.ui.MarkCoord.
        type: Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'. See enum h2o_wave.ui.MarkType.
        x: X field or value.
        x0: X base field or value.
        x1: X bin lower bound field or value. For histograms.
        x2: X bin upper bound field or value. For histograms.
        x_min: X axis scale minimum.
        x_max: X axis scale maximum.
        x_nice: Whether to nice X axis scale ticks.
        x_scale: X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkXScale.
        x_title: X axis title.
        y: Y field or value.
        y0: Y base field or value.
        y1: Y bin lower bound field or value. For histograms.
        y2: Y bin upper bound field or value. For histograms.
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
) -> Component:
    """Create a visualization for display inside a form.

    Args:
        plot: The plot to be rendered in this visualization.
        data: Data for this visualization.
        width: The width of the visualization. Defaults to 100%.
        height: The hight of the visualization. Defaults to 300px.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
        events: The events to capture on this visualization.
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
    ))


def vega_visualization(
        specification: str,
        data: Optional[PackedRecord] = None,
        width: Optional[str] = None,
        height: Optional[str] = None,
        name: Optional[str] = None,
        visible: Optional[bool] = None,
) -> Component:
    """Create a Vega-lite plot for display inside a form.

    Args:
        specification: The Vega-lite specification.
        data: Data for the plot, if any.
        width: The width of the visualization. Defaults to 100%.
        height: The height of the visualization. Defaults to 300px.
        name: An identifying name for this component.
        visible: True if the component should be visible. Defaults to true.
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
    ))


def stat(
        label: str,
        value: Optional[str] = None,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        icon_color: Optional[str] = None,
) -> Stat:
    """Create a stat (a label-value pair) for displaying a metric.

    Args:
        label: The label for the metric.
        value: The value of the metric.
        caption: The caption displayed below the primary value.
        icon: An optional icon, displayed next to the label.
        icon_color: The color of the icon.
    Returns:
        A `h2o_wave.types.Stat` instance.
    """
    return Stat(
        label,
        value,
        caption,
        icon,
        icon_color,
    )


def stats(
        items: List[Stat],
        justify: Optional[str] = None,
        inset: Optional[bool] = None,
) -> Component:
    """Create a set of stats laid out horizontally.

    Args:
        items: The individual stats to be displayed.
        justify: Specifies how to lay out the individual stats. Defaults to 'start'. One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.StatsJustify.
        inset: Whether to display the stats with a contrasting background.
    Returns:
        A `h2o_wave.types.Stats` instance.
    """
    return Component(stats=Stats(
        items,
        justify,
        inset,
    ))


def inline(
        items: List[Component],
        justify: Optional[str] = None,
        inset: Optional[bool] = None,
) -> Component:
    """Create an inline (horizontal) list of components.

    Args:
        items: The components laid out inline.
        justify: Specifies how to lay out the individual components. Defaults to 'start'. One of 'start', 'end'. See enum h2o_wave.ui.InlineJustify.
        inset: Whether to display the components inset from the parent form, with a contrasting background.
    Returns:
        A `h2o_wave.types.Inline` instance.
    """
    return Component(inline=Inline(
        items,
        justify,
        inset,
    ))


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
        commands: Optional[List[Command]] = None,
) -> FrameCard:
    """Render a card containing a HTML page inside an inline frame (an `iframe`).

    Either a path or content can be provided as arguments.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        path: The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
        content: The HTML content of the page. A string containing `<html>...</html>`
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.FrameCard` instance.
    """
    return FrameCard(
        box,
        title,
        path,
        content,
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
) -> NavItem:
    """Create a navigation item.

    Args:
        name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
        label: The label to display.
        icon: An optional icon to display next to the label.
        disabled: True if this item should be disabled.
    Returns:
        A `h2o_wave.types.NavItem` instance.
    """
    return NavItem(
        name,
        label,
        icon,
        disabled,
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
        nav: Optional[List[NavGroup]] = None,
        commands: Optional[List[Command]] = None,
) -> HeaderCard:
    """Render a page header displaying a title, subtitle and an optional navigation menu.
    Header cards are typically used for top-level navigation.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title.
        subtitle: The subtitle, displayed below the title.
        icon: The icon type, displayed to the left.
        icon_color: The icon's color.
        nav: The navigation menu to display when the header's icon is clicked.
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
        nav,
        commands,
    )


def image_card(
        box: str,
        title: str,
        type: str,
        image: str,
        data: Optional[PackedRecord] = None,
        commands: Optional[List[Command]] = None,
) -> ImageCard:
    """Create a card that displays a base64-encoded image.

    Args:
        box: A string indicating how to place this component on the page.
        title: The card's title.
        type: The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`.
        image: Image data, base64-encoded.
        data: Data for this card.
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
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MarkdownCard` instance.
    """
    return MarkdownCard(
        box,
        title,
        content,
        data,
        commands,
    )


def markup_card(
        box: str,
        title: str,
        content: str,
        commands: Optional[List[Command]] = None,
) -> MarkupCard:
    """Render HTML content.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        content: The HTML content.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MarkupCard` instance.
    """
    return MarkupCard(
        box,
        title,
        content,
        commands,
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
    )


def dialog(
        title: str,
        items: List[Component],
        width: Optional[str] = None,
        closable: Optional[bool] = None,
        blocking: Optional[bool] = None,
        primary: Optional[bool] = None,
) -> Dialog:
    """A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
    and requires people to interact with it. It’s primarily used for confirming actions,
    such as deleting a file, or asking people to make a choice.

    Args:
        title: The dialog's title.
        items: The components displayed in this dialog.
        width: The width of the dialog, e.g. '400px', defaults to '600px'.
        closable: True if the dialog should have a closing 'X' button at the top right corner.
        blocking: True to disable all actions and commands behind the dialog. Blocking dialogs should be used very sparingly, only when it is critical that the user makes a choice or provides information before they can proceed. Blocking dialogs are generally used for irreversible or potentially destructive tasks. Defaults to false.
        primary: Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to false.
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


def meta_card(
        box: str,
        title: Optional[str] = None,
        refresh: Optional[int] = None,
        notification: Optional[str] = None,
        redirect: Optional[str] = None,
        icon: Optional[str] = None,
        layouts: Optional[List[Layout]] = None,
        dialog: Optional[Dialog] = None,
        theme: Optional[str] = None,
        tracker: Optional[Tracker] = None,
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
        redirect: Redirect the page to a new URL.
        icon: Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers).
        layouts: The layouts supported by this page.
        dialog: Display a dialog on the page.
        theme: Specify the name of the theme (color scheme) to use on this page. One of 'light' or 'neon'.
        tracker: Configure a tracker for the page (for web analytics).
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.MetaCard` instance.
    """
    return MetaCard(
        box,
        title,
        refresh,
        notification,
        redirect,
        icon,
        layouts,
        dialog,
        theme,
        tracker,
        commands,
    )


def nav_card(
        box: str,
        items: List[NavGroup],
        value: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> NavCard:
    """Create a card containing a navigation pane.

    Args:
        box: A string indicating how to place this component on the page.
        items: The navigation groups contained in this pane.
        value: The name of the active (highlighted) navigation item.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.NavCard` instance.
    """
    return NavCard(
        box,
        items,
        value,
        commands,
    )


def pixel_art_card(
        box: str,
        title: str,
        data: PackedRecord,
        commands: Optional[List[Command]] = None,
) -> PixelArtCard:
    """Create a card displaying a collaborative Pixel art tool, just for kicks.

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
        commands: Optional[List[Command]] = None,
) -> PlotCard:
    """Create a card displaying a plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        data: Data for this card.
        plot: The plot to be displayed in this card.
        events: The events to capture on this card.
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
) -> StatTableItem:
    """Create a stat item (a label and a set of values) for stat_table_card.

    Args:
        label: The label for the row.
        values: The values displayed in the row.
        name: An optional name for this row (required only if this row is clickable).
        caption: The caption for the metric, displayed below the label.
        icon: An optional icon, displayed next to the label.
        icon_color: The color of the icon.
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
        commands: Optional[List[Command]] = None,
) -> VegaCard:
    """Create a card containing a Vega-lite plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title of this card.
        specification: The Vega-lite specification.
        data: Data for the plot, if any.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_wave.types.VegaCard` instance.
    """
    return VegaCard(
        box,
        title,
        specification,
        data,
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
