#
# THIS FILE IS GENERATED; DO NOT EDIT
#

from .types import *

def breadcrumb(
        name: str,
        label: str,
) -> Breadcrumb:
    """Create a breadcrumb for a `h2o_q.types.BreadcrumbsCard()`.

    Args:
        name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
        label: The label to display.
    Returns:
        A `h2o_q.types.Breadcrumb` instance.
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
        data: Data associated with this command, if any.
    Returns:
        A `h2o_q.types.Command` instance.
    """
    return Command(
        name,
        label,
        caption,
        icon,
        items,
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
        items: A list of `h2o_q.types.Breadcrumb` instances to display. See `h2o_q.ui.breadcrumb()`
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.BreadcrumbsCard` instance.
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
        direction: Layout direction. One of 'horizontal', 'vertical'.
        justify: Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'.
        align: Layout strategy for cross axis. One of 'start', 'end', 'center', 'baseline', 'stretch'.
        wrap: Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.FlexCard` instance.
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


def text(
        content: str,
        size: Optional[str] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create text content.

    Args:
        content: The text content.
        size: The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.Text` instance.
    """
    return Component(text=Text(
        content,
        size,
        tooltip,
    ))


def text_xl(
        content: str,
        tooltip: Optional[str] = None,
) -> Component:
    """Create extra-large sized text content.

    Args:
        content: The text content.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.TextXl` instance.
    """
    return Component(text_xl=TextXl(
        content,
        tooltip,
    ))


def text_l(
        content: str,
        tooltip: Optional[str] = None,
) -> Component:
    """Create large sized text content.

    Args:
        content: The text content.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.TextL` instance.
    """
    return Component(text_l=TextL(
        content,
        tooltip,
    ))


def text_m(
        content: str,
        tooltip: Optional[str] = None,
) -> Component:
    """Create medium sized text content.

    Args:
        content: The text content.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.TextM` instance.
    """
    return Component(text_m=TextM(
        content,
        tooltip,
    ))


def text_s(
        content: str,
        tooltip: Optional[str] = None,
) -> Component:
    """Create small sized text content.

    Args:
        content: The text content.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.TextS` instance.
    """
    return Component(text_s=TextS(
        content,
        tooltip,
    ))


def text_xs(
        content: str,
        tooltip: Optional[str] = None,
) -> Component:
    """Create extra-small sized text content.

    Args:
        content: The text content.
        tooltip: Tooltip message.
    Returns:
        A `h2o_q.types.TextXs` instance.
    """
    return Component(text_xs=TextXs(
        content,
        tooltip,
    ))


def label(
        label: str,
        required: Optional[bool] = None,
        disabled: Optional[bool] = None,
        tooltip: Optional[str] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Label` instance.
    """
    return Component(label=Label(
        label,
        required,
        disabled,
        tooltip,
    ))


def separator(
        label: Optional[str] = None,
) -> Component:
    """Create a separator.

    A separator visually separates content into groups.

    Args:
        label: The text displayed on the separator.
    Returns:
        A `h2o_q.types.Separator` instance.
    """
    return Component(separator=Separator(
        label,
    ))


def progress(
        label: str,
        caption: Optional[str] = None,
        value: Optional[float] = None,
        tooltip: Optional[str] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Progress` instance.
    """
    return Component(progress=Progress(
        label,
        caption,
        value,
        tooltip,
    ))


def message_bar(
        type: Optional[str] = None,
        text: Optional[str] = None,
) -> Component:
    """Create a message bar.

    A message bar is an area at the top of a primary view that displays relevant status information.
    You can use a message bar to tell the user about a situation that does not require their immediate attention and
    therefore does not need to block other activities.

    Args:
        type: The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'.
        text: The text displayed on the message bar.
    Returns:
        A `h2o_q.types.MessageBar` instance.
    """
    return Component(message_bar=MessageBar(
        type,
        text,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Textbox` instance.
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
        tooltip,
    ))


def checkbox(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        indeterminate: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Checkbox` instance.
    """
    return Component(checkbox=Checkbox(
        name,
        label,
        value,
        indeterminate,
        disabled,
        trigger,
        tooltip,
    ))


def toggle(
        name: str,
        label: Optional[str] = None,
        value: Optional[bool] = None,
        disabled: Optional[bool] = None,
        trigger: Optional[bool] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Toggle` instance.
    """
    return Component(toggle=Toggle(
        name,
        label,
        value,
        disabled,
        trigger,
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
        A `h2o_q.types.Choice` instance.
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.ChoiceGroup` instance.
    """
    return Component(choice_group=ChoiceGroup(
        name,
        label,
        value,
        choices,
        required,
        trigger,
        tooltip,
    ))


def checklist(
        name: str,
        label: Optional[str] = None,
        values: Optional[List[str]] = None,
        choices: Optional[List[Choice]] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Checklist` instance.
    """
    return Component(checklist=Checklist(
        name,
        label,
        values,
        choices,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Dropdown` instance.
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Combobox` instance.
    """
    return Component(combobox=Combobox(
        name,
        label,
        placeholder,
        value,
        choices,
        error,
        disabled,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Slider` instance.
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Spinbox` instance.
    """
    return Component(spinbox=Spinbox(
        name,
        label,
        min,
        max,
        step,
        value,
        disabled,
        tooltip,
    ))


def date_picker(
        name: str,
        label: Optional[str] = None,
        placeholder: Optional[str] = None,
        value: Optional[str] = None,
        disabled: Optional[bool] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.DatePicker` instance.
    """
    return Component(date_picker=DatePicker(
        name,
        label,
        placeholder,
        value,
        disabled,
        tooltip,
    ))


def color_picker(
        name: str,
        label: Optional[str] = None,
        value: Optional[str] = None,
        choices: Optional[List[str]] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a color picker.

    A date picker allows a user to pick a color value.
    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.

    Args:
        name: An identifying name for this component.
        label: Text to be displayed alongside the component.
        value: The selected color (CSS-compatible string)
        choices: A list of colors (CSS-compatible strings) to limit color choices to.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.ColorPicker` instance.
    """
    return Component(color_picker=ColorPicker(
        name,
        label,
        value,
        choices,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Button` instance.
    """
    return Component(button=Button(
        name,
        label,
        caption,
        value,
        primary,
        disabled,
        link,
        tooltip,
    ))


def buttons(
        items: List[Component],
) -> Component:
    """Create a set of buttons to be layed out horizontally.

    Args:
        items: The button in this set.
    Returns:
        A `h2o_q.types.Buttons` instance.
    """
    return Component(buttons=Buttons(
        items,
    ))


def file_upload(
        name: str,
        label: Optional[str] = None,
        multiple: Optional[bool] = None,
        file_extensions: Optional[List[str]] = None,
        max_file_size: Optional[float] = None,
        max_size: Optional[float] = None,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.FileUpload` instance.
    """
    return Component(file_upload=FileUpload(
        name,
        label,
        multiple,
        file_extensions,
        max_file_size,
        max_size,
        tooltip,
    ))


def table_column(
        name: str,
        label: str,
) -> TableColumn:
    """Create a table column.

    Args:
        name: An identifying name for this column.
        label: The text displayed on the column header.
    Returns:
        A `h2o_q.types.TableColumn` instance.
    """
    return TableColumn(
        name,
        label,
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
        A `h2o_q.types.TableRow` instance.
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Table` instance.
    """
    return Component(table=Table(
        name,
        columns,
        rows,
        multiple,
        tooltip,
    ))


def link(
        label: Optional[str] = None,
        path: Optional[str] = None,
        disabled: Optional[bool] = None,
        download: Optional[bool] = None,
        button: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a `/` and point to URLs within the Q UI.
    All other kinds of paths are treated as external hyperlinks.

    Args:
        label: The text to be displayed. If blank, the `path` is used as the label.
        path: The path or URL to link to.
        disabled: True if the link should be disabled.
        download: True if the link should be used for file download.
        button: True if the link should be rendered as a button.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Link` instance.
    """
    return Component(link=Link(
        label,
        path,
        disabled,
        download,
        button,
        tooltip,
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
        A `h2o_q.types.Tab` instance.
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
) -> Component:
    """Create a tab bar.

    Args:
        name: An identifying name for this component.
        value: The name of the tab to select.
        items: The tabs in this tab bar.
    Returns:
        A `h2o_q.types.Tabs` instance.
    """
    return Component(tabs=Tabs(
        name,
        value,
        items,
    ))


def expander(
        name: str,
        label: Optional[str] = None,
        expanded: Optional[bool] = None,
        items: Optional[List[Component]] = None,
) -> Component:
    """Creates a new expander.

    Expanders can be used to show or hide a group of related components.

    Args:
        name: An identifying name for this component.
        label: The text displayed on the expander.
        expanded: True if expanded, False if collapsed.
        items: List of components to be hideable by the expander.
    Returns:
        A `h2o_q.types.Expander` instance.
    """
    return Component(expander=Expander(
        name,
        label,
        expanded,
        items,
    ))


def frame(
        path: Optional[str] = None,
        content: Optional[str] = None,
        width: Optional[str] = None,
        height: Optional[str] = None,
) -> Component:
    """Create a new inline frame (an `iframe`).

    Args:
        path: The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
        content: The HTML content of the page. A string containing `<html>...</html>`.
        width: The width of the frame, e.g. `200px`, `50%`, etc. Defaults to `100%`.
        height: The height of the frame, e.g. `200px`, `50%`, etc. Defaults to `150px`.
    Returns:
        A `h2o_q.types.Frame` instance.
    """
    return Component(frame=Frame(
        path,
        content,
        width,
        height,
    ))


def picker(
        name: str,
        choices: List[Choice],
        label: Optional[str] = None,
        values: Optional[List[str]] = None,
        max_choices: Optional[int] = None,
        disabled: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a picker.
    Pickers are used to select one or more choices, such as tags or files, from a list.
    Use a picker to allow the user to quickly search for or manage a few tags or files.

    Args:
        name: An identifying name for this component.
        choices: The choices to be presented.
        label: Text to be displayed above the component.
        values: The names of the selected choices.
        max_choices: Maximum number of selectable choices. Defaults to no limit.
        disabled: Controls whether the picker should be disabled or not.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Picker` instance.
    """
    return Component(picker=Picker(
        name,
        choices,
        label,
        values,
        max_choices,
        disabled,
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
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.RangeSlider` instance.
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
        A `h2o_q.types.Step` instance.
    """
    return Step(
        label,
        icon,
        done,
    )


def stepper(
        name: str,
        items: List[Step],
        tooltip: Optional[str] = None,
) -> Component:
    """Create a component that displays a sequence of steps in a process.
    The steps keep users informed about where they are in the process and how much is left to complete.

    Args:
        name: An identifying name for this component.
        items: The sequence of steps to be displayed.
        tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    Returns:
        A `h2o_q.types.Stepper` instance.
    """
    return Component(stepper=Stepper(
        name,
        items,
        tooltip,
    ))


def component(
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
) -> Component:
    """Create a component.

    Args:
        text: Text block.
        text_xl: Extra-large sized text block.
        text_l: Large sized text block.
        text_m: Medium sized text block.
        text_s: Small sized text block.
        text_xs: Extra-small sized text block.
        label: Label.
        separator: Separator.
        progress: Progress bar.
        message_bar: Message bar.
        textbox: Textbox.
        checkbox: Checkbox.
        toggle: Toggle.
        choice_group: Choice group.
        checklist: Checklist.
        dropdown: Dropdown.
        combobox: Combobox.
        slider: Slider.
        spinbox: Spinbox.
        date_picker: Date picker.
        color_picker: Color picker.
        button: Button.
        buttons: Button set.
        file_upload: File upload.
        table: Table.
        link: Link.
        tabs: Tabs.
        expander: Expander.
        frame: Frame
        picker: Picker
        range_slider: RangeSlider
        stepper: Stepper
    Returns:
        A `h2o_q.types.Component` instance.
    """
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


def form_card(
        box: str,
        items: Union[List[Component], str],
        commands: Optional[List[Command]] = None,
) -> FormCard:
    """Create a form.

    Args:
        box: A string indicating how to place this component on the page.
        items: The components in this form.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.FormCard` instance.
    """
    return FormCard(
        box,
        items,
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
        A `h2o_q.types.FrameCard` instance.
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
        A `h2o_q.types.GraphicsCard` instance.
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
        A `h2o_q.types.GridCard` instance.
    """
    return GridCard(
        box,
        title,
        cells,
        data,
        commands,
    )


def header_card(
        box: str,
        title: str,
        subtitle: str,
        icon: Optional[str] = None,
        icon_color: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> HeaderCard:
    """Render a card containing a HTML page inside an inline frame (iframe).

    Either a path or content can be provided as arguments.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title.
        subtitle: The subtitle, displayed below the title.
        icon: The icon type, displayed to the left.
        icon_color: The icon's color.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.HeaderCard` instance.
    """
    return HeaderCard(
        box,
        title,
        subtitle,
        icon,
        icon_color,
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
        A `h2o_q.types.ImageCard` instance.
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
        A `h2o_q.types.LargeBarStatCard` instance.
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
        A `h2o_q.types.LargeStatCard` instance.
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
        A `h2o_q.types.ListCard` instance.
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
        A `h2o_q.types.ListItem1Card` instance.
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
        A `h2o_q.types.MarkdownCard` instance.
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
        A `h2o_q.types.MarkupCard` instance.
    """
    return MarkupCard(
        box,
        title,
        content,
        commands,
    )


def meta_card(
        box: str,
        title: Optional[str] = None,
        refresh: Optional[int] = None,
        notification: Optional[str] = None,
        commands: Optional[List[Command]] = None,
) -> MetaCard:
    """Represents page-global state.

    This card is invisible.
    It is used to control attributes of the active page.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title of the page.
        refresh: Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use).
        notification: Display a desktop notification to the user.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.MetaCard` instance.
    """
    return MetaCard(
        box,
        title,
        refresh,
        notification,
        commands,
    )


def nav_item(
        name: str,
        label: str,
) -> NavItem:
    """Create a navigation item.

    Args:
        name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
        label: The label to display.
    Returns:
        A `h2o_q.types.NavItem` instance.
    """
    return NavItem(
        name,
        label,
    )


def nav_group(
        label: str,
        items: List[NavItem],
) -> NavGroup:
    """Create a group of navigation items.

    Args:
        label: The label to display for this group.
        items: The navigation items contained in this group.
    Returns:
        A `h2o_q.types.NavGroup` instance.
    """
    return NavGroup(
        label,
        items,
    )


def nav_card(
        box: str,
        items: List[NavGroup],
        commands: Optional[List[Command]] = None,
) -> NavCard:
    """Create a card containing a navigation pane.

    Args:
        box: A string indicating how to place this component on the page.
        items: The navigation groups contained in this pane.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.NavCard` instance.
    """
    return NavCard(
        box,
        items,
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
        A `h2o_q.types.PixelArtCard` instance.
    """
    return PixelArtCard(
        box,
        title,
        data,
        commands,
    )


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
        coord: Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'.
        type: Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'.
        x: X field or value.
        x0: X base field or value.
        x1: X bin lower bound field or value. For histograms.
        x2: X bin upper bound field or value. For histograms.
        x_min: X axis scale minimum.
        x_max: X axis scale maximum.
        x_nice: Whether to nice X axis scale ticks.
        x_scale: X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
        x_title: X axis title.
        y: Y field or value.
        y0: Y base field or value.
        y1: Y bin lower bound field or value. For histograms.
        y2: Y bin upper bound field or value. For histograms.
        y_min: Y axis scale minimum.
        y_max: Y axis scale maximum.
        y_nice: Whether to nice Y axis scale ticks.
        y_scale: Y axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
        y_title: Y axis title.
        color: Mark color field or value.
        color_range: Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`
        shape: Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'.
        shape_range: Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`
        size: Mark size field or value.
        size_range: Mark size range. A string containing space-separated integers, e.g. `'4 30'`
        stack: Field to stack marks by, or 'auto' to infer.
        dodge: Field to dodge marks by, or 'auto' to infer.
        curve: Curve type for `line` and `area` mark types. One of 'none', 'smooth', 'step-before', 'step', 'step-after'.
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
        label_position: Label position relative to the mark. One of 'top', 'bottom', 'middle', 'left', 'right'.
        label_overlap: Strategy to use if labels overlap. One of 'hide', 'overlap', 'constrain'.
        label_fill_color: Label fill color.
        label_fill_opacity: Label fill opacity.
        label_stroke_color: Label stroke color.
        label_stroke_opacity: Label stroke opacity.
        label_stroke_size: Label stroke size (line width or pen thickness).
        label_font_size: Label font size.
        label_font_weight: Label font weight.
        label_line_height: Label line height.
        label_align: Label text alignment. One of 'left', 'right', 'center', 'start', 'end'.
        ref_stroke_color: Reference line stroke color.
        ref_stroke_opacity: Reference line stroke opacity.
        ref_stroke_size: Reference line stroke size (line width or pen thickness).
        ref_stroke_dash: Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
    Returns:
        A `h2o_q.types.Mark` instance.
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
        A `h2o_q.types.Plot` instance.
    """
    return Plot(
        marks,
    )


def plot_card(
        box: str,
        title: str,
        data: PackedRecord,
        plot: Plot,
        commands: Optional[List[Command]] = None,
) -> PlotCard:
    """Create a card displaying a plot.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        data: Data for this card.
        plot: The plot to be displayed in this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.PlotCard` instance.
    """
    return PlotCard(
        box,
        title,
        data,
        plot,
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
        A `h2o_q.types.RepeatCard` instance.
    """
    return RepeatCard(
        box,
        item_view,
        item_props,
        data,
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
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.SmallSeriesStatCard` instance.
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
        A `h2o_q.types.SmallStatCard` instance.
    """
    return SmallStatCard(
        box,
        title,
        value,
        data,
        commands,
    )


def tab_card(
        box: str,
        items: List[Tab],
        link: Optional[bool] = None,
        commands: Optional[List[Command]] = None,
) -> TabCard:
    """Create a card containing tabs for navigation.

    Args:
        box: A string indicating how to place this component on the page.
        items: Items to render.
        link: True if tabs should be rendered as links and not a standard tab.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.TabCard` instance.
    """
    return TabCard(
        box,
        items,
        link,
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
        A `h2o_q.types.TallGaugeStatCard` instance.
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
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.TallSeriesStatCard` instance.
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
    """Render dynamic content using a HTML template.

    Args:
        box: A string indicating how to place this component on the page.
        title: The title for this card.
        content: The Handlebars template. https://handlebarsjs.com/guide/
        data: Data for the Handlebars template
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.TemplateCard` instance.
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
        A `h2o_q.types.ToolbarCard` instance.
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
        A `h2o_q.types.VegaCard` instance.
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
        A `h2o_q.types.WideBarStatCard` instance.
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
        A `h2o_q.types.WideGaugeStatCard` instance.
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
        plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
        plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
        plot_color: The plot's color.
        data: Data for this card.
        commands: Contextual menu commands for this component.
    Returns:
        A `h2o_q.types.WideSeriesStatCard` instance.
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
