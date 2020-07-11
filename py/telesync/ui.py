#
# THIS FILE IS GENERATED; DO NOT EDIT
#

from .types import *

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

    :param name: An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed.
    :param label: The text displayed for this command.
    :param caption: The caption for this command (typically a tooltip).
    :param icon: The icon to be displayed for this command.
    :param items: Sub-commands, if any
    :param data: Data associated with this command, if any.
    :return: A :class:`telesync.types.Command` instance.
    """
    return Command(
        name,
        label,
        caption,
        icon,
        items,
        data,
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

    :param box: A string indicating how to place this component on the page.
    :param item_view: The child card type.
    :param item_props: The child card properties.
    :param data: Data for this card.
    :param direction: Layout direction. One of 'horizontal', 'vertical'.
    :param justify: Layout strategy for main axis. One of 'start', 'end', 'center', 'between', 'around'.
    :param align: Layout strategy for cross axis. One of 'start', 'end', 'center', 'baseline', 'stretch'.
    :param wrap: Wrapping strategy. One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.FlexCard` instance.
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

    :param content: The text content.
    :param size: The font size of the text content. One of 'xl', 'l', 'm', 's', 'xs'.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.Text` instance.
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

    :param content: The text content.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.TextXl` instance.
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

    :param content: The text content.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.TextL` instance.
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

    :param content: The text content.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.TextM` instance.
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

    :param content: The text content.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.TextS` instance.
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

    :param content: The text content.
    :param tooltip: Tooltip message.
    :return: A :class:`telesync.types.TextXs` instance.
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

    :param label: The text displayed on the label.
    :param required: True if the field is required.
    :param disabled: True if the label should be disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Label` instance.
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

    :param label: The text displayed on the separator.
    :return: A :class:`telesync.types.Separator` instance.
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

    :param label: The text displayed above the bar.
    :param caption: The text displayed below the bar.
    :param value: The progress, between 0.0 and 1.0, or -1 (default) if indeterminate.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Progress` instance.
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

    :param type: The icon and color of the message bar. One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'.
    :param text: The text displayed on the message bar.
    :return: A :class:`telesync.types.MessageBar` instance.
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
        tooltip: Optional[str] = None,
) -> Component:
    """Create a text box.

    The text box component enables a user to type text into an app.
    It's typically used to capture a single line of text, but can be configured to capture multiple lines of text.
    The text displays on the screen in a simple, uniform format.

    :param name: An identifying name for this component.
    :param label: The text displayed above the field.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that demonstrates the expected type of data, rather than an explanatory message.
    :param value: Text to be displayed inside the text box.
    :param mask: The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9].
    :param icon: Icon displayed in the far right end of the text field.
    :param prefix: Text to be displayed before the text box contents.
    :param suffix: Text to be displayed after the text box contents.
    :param error: Text to be displayed as an error below the text box.
    :param required: True if the text box is a required field.
    :param disabled: True if the text box is disabled.
    :param readonly: True if the text box is a read-only field.
    :param multiline: True if the text box should allow multi-line text entry.
    :param password: True if the text box should hide text content.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Textbox` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the checkbox.
    :param value: True if selected, False if unselected.
    :param indeterminate: True if the selection is indeterminate (neither selected nor unselected).
    :param disabled: True if the checkbox is disabled.
    :param trigger: True if the form should be submitted when the checkbox value changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Checkbox` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param value: True if selected, False if unselected.
    :param disabled: True if the checkbox is disabled.
    :param trigger: True if the form should be submitted when the toggle value changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Toggle` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param disabled: True if the checkbox is disabled.
    :return: A :class:`telesync.types.Choice` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param value: The name of the selected choice.
    :param choices: The choices to be presented.
    :param required: True if this field is required.
    :param trigger: True if the form should be submitted when the selection changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.ChoiceGroup` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed above the component.
    :param values: The names of the selected choices.
    :param choices: The choices to be presented.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Checklist` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
    :param value: The name of the selected choice.
    :param values: The names of the selected choices. If this parameter is set, multiple selections will be allowed.
    :param choices: The choices to be presented.
    :param required: True if this is a required field.
    :param disabled: True if this field is disabled.
    :param trigger: True if the form should be submitted when the dropdown value changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Dropdown` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
    :param value: The name of the selected choice.
    :param choices: The choices to be presented.
    :param error: Text to be displayed as an error below the text box.
    :param disabled: True if this field is disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Combobox` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param min: The minimum value of the slider.
    :param max: The maximum value of the slider.
    :param step: The difference between two adjacent values of the slider.
    :param value: The current value of the slider.
    :param disabled: True if this field is disabled.
    :param trigger: True if the form should be submitted when the slider value changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Slider` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param min: The minimum value of the spinbox.
    :param max: The maximum value of the spinbox.
    :param step: The difference between two adjacent values of the spinbox.
    :param value: The current value of the spinbox.
    :param disabled: True if this field is disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Spinbox` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected in the field.
    :param value: The date value in YYYY-MM-DD format.
    :param disabled: True if this field is disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.DatePicker` instance.
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

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param value: The selected color (CSS-compatible string)
    :param choices: A list of colors (CSS-compatible strings) to limit color choices to.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.ColorPicker` instance.
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

    :param name: An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked.
    :param label: The text displayed on the button.
    :param caption: The caption displayed below the label. Setting a caption renders a compound button.
    :param primary: True if the button should be rendered as the primary button in the set.
    :param disabled: True if the button should be disabled.
    :param link: True if the button should be rendered as link text and not a standard button.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Button` instance.
    """
    return Component(button=Button(
        name,
        label,
        caption,
        primary,
        disabled,
        link,
        tooltip,
    ))


def buttons(
        items: List[Component],
) -> Component:
    """Create a set of buttons to be layed out horizontally.

    :param items: The button in this set.
    :return: A :class:`telesync.types.Buttons` instance.
    """
    return Component(buttons=Buttons(
        items,
    ))


def file_upload(
        name: str,
        label: Optional[str] = None,
        multiple: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a file upload component.
    A file upload component allows a user to browse, select and upload one or more files.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param multiple: True if the component should allow multiple files to be uploaded.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.FileUpload` instance.
    """
    return Component(file_upload=FileUpload(
        name,
        label,
        multiple,
        tooltip,
    ))


def table_column(
        name: str,
        label: str,
) -> TableColumn:
    """Create a table column.

    :param name: An identifying name for this column.
    :param label: The text displayed on the column header.
    :return: A :class:`telesync.types.TableColumn` instance.
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

    :param name: An identifying name for this row.
    :param cells: The cells in this row (displayed left to right).
    :return: A :class:`telesync.types.TableRow` instance.
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

    :param name: An identifying name for this component.
    :param columns: The columns in this table.
    :param rows: The rows in this table.
    :param multiple: True to allow multiple rows to be selected.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Table` instance.
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
        button: Optional[bool] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a `/` and point to URLs within the Q UI.
    All other kinds of paths are treated as external hyperlinks.

    :param label: The text to be displayed. If blank, the `path` is used as the label.
    :param path: The path or URL to link to.
    :param disabled: True if the link should be disable.
    :param button: True if the link should be rendered as a button
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A :class:`telesync.types.Link` instance.
    """
    return Component(link=Link(
        label,
        path,
        disabled,
        button,
        tooltip,
    ))


def tab(
        name: str,
        label: Optional[str] = None,
        icon: Optional[str] = None,
) -> Tab:
    """Create a tab.

    :param name: An identifying name for this component.
    :param label: The text displayed on the tab.
    :param icon: The icon displayed on the tab.
    :return: A :class:`telesync.types.Tab` instance.
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

    :param name: An identifying name for this component.
    :param value: The name of the tab to select.
    :param items: The tabs in this tab bar.
    :return: A :class:`telesync.types.Tabs` instance.
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

    :param name: An identifying name for this component.
    :param label: The text displayed on the expander.
    :param expanded: True if expanded, False if collapsed.
    :param items: List of components to be hideable by the expander.
    :return: A :class:`telesync.types.Expander` instance.
    """
    return Component(expander=Expander(
        name,
        label,
        expanded,
        items,
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
) -> Component:
    """Create a component.

    :param text: Text block.
    :param text_xl: Extra-large sized text block.
    :param text_l: Large sized text block.
    :param text_m: Medium sized text block.
    :param text_s: Small sized text block.
    :param text_xs: Extra-small sized text block.
    :param label: Label.
    :param separator: Separator.
    :param progress: Progress bar.
    :param message_bar: Message bar.
    :param textbox: Textbox.
    :param checkbox: Checkbox.
    :param toggle: Toggle.
    :param choice_group: Choice group.
    :param checklist: Checklist.
    :param dropdown: Dropdown.
    :param combobox: Combobox.
    :param slider: Slider.
    :param spinbox: Spinbox.
    :param date_picker: Date picker.
    :param color_picker: Color picker.
    :param button: Button.
    :param buttons: Button set.
    :param file_upload: File upload.
    :param table: Table.
    :param link: Link.
    :param tabs: Tabs.
    :param expander: Expander.
    :return: A :class:`telesync.types.Component` instance.
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
    )


def form_card(
        box: str,
        items: Union[List[Component], str],
        commands: Optional[List[Command]] = None,
) -> FormCard:
    """Create a form.

    :param box: A string indicating how to place this component on the page.
    :param items: The components in this form.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.FormCard` instance.
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
    """Render a card containing a HTML page inside an inline frame (iframe).

    Either a path or content can be provided as arguments.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param path: The path or URL of the web page, e.g. '/foo.html' or 'http://example.com/foo.html'
    :param content: The HTML content of the page. A string containing '<html>...</html>'
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.FrameCard` instance.
    """
    return FrameCard(
        box,
        title,
        path,
        content,
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

    :param box: A string indicating how to place this component on the page.
    :param title: EXPERIMENTAL. DO NOT USE.
    :param cells: EXPERIMENTAL. DO NOT USE.
    :param data: EXPERIMENTAL. DO NOT USE.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.GridCard` instance.
    """
    return GridCard(
        box,
        title,
        cells,
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param caption: The card's caption.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value, typically a target value.
    :param value_caption: The caption displayed below the primary value.
    :param aux_value_caption: The caption displayed below the auxiliary value.
    :param progress: The value of the progress bar, between 0 and 1.
    :param plot_color: The color of the progress bar.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.LargeBarStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed next to the primary value.
    :param caption: The caption displayed below the primary value.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.LargeStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param item_view: The child card type.
    :param item_props: The child card properties.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.ListCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: EXPERIMENTAL. DO NOT USE.
    :param caption: EXPERIMENTAL. DO NOT USE.
    :param value: EXPERIMENTAL. DO NOT USE.
    :param aux_value: EXPERIMENTAL. DO NOT USE.
    :param data: EXPERIMENTAL. DO NOT USE.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.ListItem1Card` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
    :param data: Additional data for the card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.MarkdownCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The HTML content.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.MarkupCard` instance.
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
        commands: Optional[List[Command]] = None,
) -> MetaCard:
    """Represents page-global state.

    This card is invisible.
    It is used to control attributes of the active page.

    :param box: A string indicating how to place this component on the page.
    :param title: The title of the page.
    :param refresh: Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use).
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.MetaCard` instance.
    """
    return MetaCard(
        box,
        title,
        refresh,
        commands,
    )


def nav_item(
        name: str,
        label: str,
) -> NavItem:
    """Create a navigation item.

    :param name: The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
    :param label: The label to display.
    :return: A :class:`telesync.types.NavItem` instance.
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

    :param label: The label to display for this group.
    :param items: The navigation items contained in this group.
    :return: A :class:`telesync.types.NavGroup` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param items: The navigation groups contained in this pane.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.NavCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param data: The data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.PixelArtCard` instance.
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

    :param coord: Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`. One of 'rect', 'cartesian', 'polar', 'theta', 'helix'.
    :param type: Graphical geometry. One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'.
    :param x: X field or value.
    :param x0: X base field or value.
    :param x1: X bin lower bound field or value. For histograms.
    :param x2: X bin upper bound field or value. For histograms.
    :param x_min: X axis scale minimum.
    :param x_max: X axis scale maximum.
    :param x_nice: Whether to nice X axis scale ticks.
    :param x_scale: X axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
    :param x_title: X axis title.
    :param y: Y field or value.
    :param y0: Y base field or value.
    :param y1: Y bin lower bound field or value. For histograms.
    :param y2: Y bin upper bound field or value. For histograms.
    :param y_min: Y axis scale minimum.
    :param y_max: Y axis scale maximum.
    :param y_nice: Whether to nice Y axis scale ticks.
    :param y_scale: Y axis scale type. One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
    :param y_title: Y axis title.
    :param color: Mark color field or value.
    :param color_range: Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`
    :param shape: Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'.
    :param shape_range: Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`
    :param size: Mark size field or value.
    :param size_range: Mark size range. A string containing space-separated integers, e.g. `'4 30'`
    :param stack: Field to stack marks by, or 'auto' to infer.
    :param dodge: Field to dodge marks by, or 'auto' to infer.
    :param curve: Curve type for `line` and `area` mark types. One of 'none', 'smooth', 'step-before', 'step', 'step-after'.
    :param fill_color: Mark fill color.
    :param fill_opacity: Mark fill opacity.
    :param stroke_color: Mark stroke color.
    :param stroke_opacity: Mark stroke opacity.
    :param stroke_size: Mark stroke size.
    :param stroke_dash: Mark stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
    :param label: Label field or value.
    :param label_offset: Distance between label and mark.
    :param label_offset_x: Horizontal distance between label and mark.
    :param label_offset_y: Vertical distance between label and mark.
    :param label_rotation: Label rotation angle, in degrees, or 'none' to disable automatic rotation. The default behavior is 'auto' for automatic rotation.
    :param label_position: Label position relative to the mark.
    :param label_overlap: Strategy to use if labels overlap.
    :param label_fill_color: Label fill color.
    :param label_fill_opacity: Label fill opacity.
    :param label_stroke_color: Label stroke color.
    :param label_stroke_opacity: Label stroke opacity.
    :param label_stroke_size: Label stroke size (line width or pen thickness).
    :param label_font_size: Label font size.
    :param label_font_weight: Label font weight.
    :param label_line_height: Label line height.
    :param label_align: Label text alignment. One of 'left', 'right', 'center', 'start', 'end'.
    :param ref_stroke_color: Reference line stroke color.
    :param ref_stroke_opacity: Reference line stroke opacity.
    :param ref_stroke_size: Reference line stroke size (line width or pen thickness).
    :param ref_stroke_dash: Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
    :return: A :class:`telesync.types.Mark` instance.
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

    :param marks: The graphical mark layers contained in this plot.
    :return: A :class:`telesync.types.Plot` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param data: Data for this card.
    :param plot: The plot to be displayed in this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.PlotCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param item_view: EXPERIMENTAL. DO NOT USE.
    :param item_props: The child card properties.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.RepeatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param plot_data: The plot's data.
    :param plot_value: The data field to use for y-axis values.
    :param plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
    :param plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
    :param plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
    :param plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    :param plot_color: The plot's color.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.SmallSeriesStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.SmallStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param items: Items to render.
    :param link: True if tabs should be rendered as links and not a standard tab.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.TabCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed next to the primary value.
    :param progress: The value of the progress gauge, between 0 and 1.
    :param plot_color: The color of the progress gauge.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.TallGaugeStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed below the primary value.
    :param plot_data: The plot's data.
    :param plot_value: The data field to use for y-axis values.
    :param plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
    :param plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
    :param plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
    :param plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    :param plot_color: The plot's color.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.TallSeriesStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The Handlebars template. https://handlebarsjs.com/guide/
    :param data: Data for the Handlebars template
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.TemplateCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param items: Items to render.
    :param secondary_items: Items to render on the right side (or left, in RTL).
    :param overflow_items: Items to render in an overflow menu.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.ToolbarCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The title of this card.
    :param specification: The Vega-lite specification.
    :param data: Data for the plot, if any.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.VegaCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed next to the primary value.
    :param progress: The value of the progress bar, between 0 and 1.
    :param plot_color: The color of the progress bar.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.WideBarStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed next to the primary value.
    :param progress: The value of the progress gauge, between 0 and 1.
    :param plot_color: The color of the progress gauge.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.WideGaugeStatCard` instance.
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

    :param box: A string indicating how to place this component on the page.
    :param title: The card's title.
    :param value: The primary value displayed.
    :param aux_value: The auxiliary value displayed below the primary value.
    :param plot_data: The plot's data.
    :param plot_value: The data field to use for y-axis values.
    :param plot_zero_value: The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
    :param plot_category: The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
    :param plot_type: The type of plot. Defaults to `area`. One of 'area', 'interval'.
    :param plot_curve: The plot's curve style. Defaults to `linear`. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    :param plot_color: The plot's color.
    :param data: Data for this card.
    :param commands: Contextual menu commands for this component.
    :return: A :class:`telesync.types.WideSeriesStatCard` instance.
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
