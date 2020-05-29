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


def checkbox(
        name: str,
        label: str = '',
        value: bool = False,
        indeterminate: bool = False,
        disabled: bool = False,
        trigger: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a checkbox.

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
    :return: A checkbox instance.
    """
    return g.Component(checkbox=g.Checkbox(
        name=name,
        label=label,
        value=value,
        indeterminate=indeterminate,
        disabled=disabled,
        trigger=trigger,
        tooltip=tooltip,
    ))


def checklist(
        name: str,
        label: str = '',
        values: List[str] = None,
        choices: List[g.Choice] = None,
        tooltip: str = '',
) -> g.Component:
    """
    Create a set of checkboxes.

    Use this for multi-select scenarios in which a user chooses one or more items from a group of
    choices that are not mutually exclusive.

    :param name: An identifying name for this component.
    :param label: Text to be displayed above the component.
    :param values: The names of the selected choices.
    :param choices: The choices to be presented.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A checklist instance.
    """
    if choices is None:
        choices = []
    if values is None:
        values = []
    return g.Component(checklist=g.Checklist(
        name=name,
        label=label,
        values=values,
        choices=choices,
        tooltip=tooltip,
    ))


def toggle(
        name: str,
        label: str = '',
        value: bool = False,
        disabled: bool = False,
        trigger: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a toggle.

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
    :return: A toggle instance.
    """
    return g.Component(toggle=g.Toggle(
        name=name,
        label=label,
        value=value,
        disabled=disabled,
        trigger=trigger,
        tooltip=tooltip,
    ))


def choice(
        name: str,
        label: str = '',
        disabled: bool = False,
) -> g.Choice:
    """
    Create a choice for a checklist, choice group or dropdown.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param disabled: True if the checkbox is disabled.
    :return: A choice instance.
    """
    return g.Choice(
        name=name,
        label=label,
        disabled=disabled,
    )


def choice_group(
        name: str,
        label: str = '',
        value: str = '',
        choices: List[g.Choice] = None,
        required: bool = False,
        trigger: bool = False, tooltip: str = ''
) -> g.Component:
    """
    Create a choice group.

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
    :return: A choice group instance.
    """
    if choices is None:
        choices = []
    if len(choices) < 1:
        raise ValueError('Choice Group must contain at least one choice.')
    if value == '':
        value = choices[0].name
    return g.Component(choice_group=g.ChoiceGroup(
        name=name,
        label=label,
        value=value,
        choices=choices,
        required=required,
        trigger=trigger,
        tooltip=tooltip,
    ))


def dropdown(
        name: str,
        label: str = '',
        placeholder: str = '',
        value: str = '',
        values: List[str] = None,
        choices: List[g.Choice] = None,
        required: bool = False,
        disabled: bool = False,
        trigger: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a dropdown.

    A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
    a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
    selected item is visible. When users click the drop-down button, all the options become visible.
    To change the value, users open the list and click another value or use the arrow keys (up and down) to
    select a new value.

    Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
    multi-select dropdown.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected
           in the field.
    :param value: The name of the selected choice.
    :param values: The names of the selected choices. If this parameter is set, multiple selections will be allowed.
    :param choices: The choices to be presented.
    :param required: True if this is a required field.
    :param disabled: True if this field is disabled.
    :param trigger: True if the form should be submitted when the dropdown value changes.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A dropdown instance.
    """
    if choices is None:
        choices = []
    if len(choices) < 1:
        raise ValueError('Dropdown must contain at least one choice.')
    multiple = values is not None
    return g.Component(dropdown=g.Dropdown(
        name=name,
        label=label,
        placeholder=placeholder,
        multiple=multiple,
        value=value,
        values=values,
        choices=choices,
        required=required,
        disabled=disabled,
        trigger=trigger,
        tooltip=tooltip,
    ))


def combobox(
        name: str,
        label: str = '',
        placeholder: str = '',
        value: str = '',
        choices: List[str] = None,
        error: str = '',
        disabled: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a combobox.

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
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected
           in the field.
    :param value: The name of the selected choice.
    :param choices: The choices to be presented.
    :param error: Text to be displayed as an error below the text box.
    :param disabled: True if this field is disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A combobox instance.
    """
    return g.Component(combobox=g.Combobox(
        name=name,
        label=label,
        placeholder=placeholder,
        value=value,
        choices=choices,
        error=error,
        disabled=disabled,
        tooltip=tooltip,
    ))


def slider(
        name: str,
        label: str = '',
        min: float = 0,
        max: float = 100,
        step: float = 1,
        value: float = 0,
        disabled: bool = False,
        trigger: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a slider.

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
    :return: A slider instance.
    """
    return g.Component(slider=g.Slider(
        name=name,
        label=label,
        min=min,
        max=max,
        step=step,
        value=value,
        disabled=disabled,
        trigger=trigger,
        tooltip=tooltip,
    ))


def spinbox(
        name: str,
        label: str = '',
        min: float = 0,
        max: float = 100,
        step: float = 1,
        value: float = 0,
        disabled: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a spinbox.

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
    :return: A spinbox instance.
    """
    return g.Component(spinbox=g.Spinbox(
        name=name,
        label=label,
        min=min,
        max=max,
        step=step,
        value=value,
        disabled=disabled,
        tooltip=tooltip,
    ))


def date_picker(
        name: str,
        label: str = '',
        placeholder: str = '',
        value: str = '',
        disabled: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a date picker.

    A date picker allows a user to pick a date value.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param placeholder: A string that provides a brief hint to the user as to what kind of information is expected
           in the field.
    :param value: The date value in YYYY-MM-DD format.
    :param disabled: True if this field is disabled.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A date picker instance.
    """
    return g.Component(date_picker=g.DatePicker(
        name=name,
        label=label,
        placeholder=placeholder,
        value=value,
        disabled=disabled,
        tooltip=tooltip,
    ))


def color_picker(
        name: str,
        label: str = '',
        value: str = '',
        choices: List[str] = None,
        tooltip: str = '',
) -> g.Component:
    """
    Create a color picker.

    A date picker allows a user to pick a color value.

    If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param value: The selected color (CSS-compatible string)
    :param choices: A list of colors (CSS-compatible strings) to limit color choices to.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A color picker instance.
    """
    if choices is None:
        choices = []
    return g.Component(color_picker=g.ColorPicker(
        name=name,
        label=label,
        value=value,
        choices=choices,
        tooltip=tooltip,
    ))


def file_upload(
        name: str,
        label: str,
        multiple: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a file upload component.

    A file upload component allows a user to browse, select and upload one or more files.

    :param name: An identifying name for this component.
    :param label: Text to be displayed alongside the component.
    :param multiple: True if the component should allow multiple files to be uploaded.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return:
    """
    return g.Component(file_upload=g.FileUpload(
        name=name,
        label=label,
        multiple=multiple,
        tooltip=tooltip,
    ))


def button(
        name: str,
        label: str = '',
        caption: str = '',
        primary: bool = False,
        disabled: bool = False,
        link: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a button.

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

    :param name: An identifying name for this component.
    :param label: The text displayed on the button.
    :param caption: The caption displayed below the label. Setting a caption renders a compound button.
    :param primary: True if the button should be rendered as the primary button in the set.
    :param disabled: True if the button should be disabled.
    :param link: True if the button should be rendered as link text and not a standard button.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A button component instance.
    """

    return g.Component(button=g.Button(
        name=name,
        label=label,
        caption=caption,
        primary=primary,
        disabled=disabled,
        link=link,
        tooltip=tooltip,
    ))


def buttons(*items: Union[g.Component, g.Button]) -> g.Component:
    """
    Create a set of buttons to be layed out horizontally.

    :param items: The button instances.
    :return: A button set instance.
    """

    raw_buttons = [x.button for x in items]
    return g.Component(buttons=g.Buttons(buttons=raw_buttons))


def link(
        label: str = '',
        path: str = 'http://example.com',
        disabled: bool = False,
        button: bool = False,
        tooltip: str = '',
) -> g.Component:
    """
    Create a hyperlink.

    Hyperlinks can be internal or external.
    Internal hyperlinks have paths that begin with a ``/`` and point to URLs within the Q UI. All other kinds of paths
    are treated as external hyperlinks.

    :param label: The text to be displayed. If blank, the ``path`` is used as the label.
    :param path: The internal path or external URL to link to.
    :param disabled: True if the link should be disable.
    :param button: True if the link should be rendered as a button
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A link component instance.

    """

    return g.Component(link=g.Link(label=label, path=path, disabled=disabled, button=button, tooltip=tooltip))


def table_column(name: str, label: str) -> g.TableColumn:
    """
    Create a table column. See :func:`~h2o_q.ui.table`.

    :param name: An identifying name for this column.
    :param label: The text displayed on the column header.
    :return: A column instance.
    """
    return g.TableColumn(name=name, label=label)


def table_row(name: str, cells=List[str]) -> g.TableRow:
    """
    Create a table row. See :func:`~h2o_q.ui.table`.

    :param name: An identifying name for this row.
    :param cells: The cells in this row (displayed left to right).
    :return: A row instance.
    """
    return g.TableRow(name=name, cells=cells)


def table(
        name: str,
        columns: List[g.TableColumn],
        rows: List[g.TableRow],
        multiple=False,
        tooltip: str = '',
) -> g.Component:
    """
    Create an interactive table.

    This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
    display a non-interactive table of information, use a markdown table.

    If ``multiple`` is set to False (default), each row in the table is clickable. When a row is clicked, the form is
    submitted automatically, and ``q.args.table_name`` is set to ``[row_name]``, where ``table_name`` is the ``name`` of
    the table, and ``row_name`` is the ``name`` of the row that was clicked on.

    If ``multiple`` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
    Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
    ``q.args.table_name`` is set to ``[row1_name, row2_name, ...]`` where ``table_name`` is the ``name`` of the table,
    and ``row1_name``, ``row2_name`` are the ``name`` of the rows that were selected. Note that if ``multiple`` is
    set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
    submission.

    :param name: An identifying name for this component.
    :param columns: The columns in this table.
    :param rows: The rows in this table.
    :param multiple: True to allow multiple rows to be selected.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    :return: A table instance.
    """
    return g.Component(table=g.Table(
        name=name,
        columns=columns,
        rows=rows,
        multiple=multiple,
        tooltip=tooltip,
    ))


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


def command(action: str, label: str, caption: str = '', data: str = '', icon: str = '') -> g.Command:
    """
    Create a command.

    Commands are typically displayed as context menu items associated with part of notebooks or dashboards.

    :param action: The function to call when this command is invoked.
    :param label: The text displayed for this command.
    :param caption: The caption for this command (typically a tooltip).
    :param data: Data associated with this command, if any.
    :param icon: The icon to be displayed for this command.
    :return: A command instance.
    """
    return g.Command(action=action, icon=icon, label=label, caption=caption, data=data)


def dashboard(pages: List[g.DashboardPage]) -> g.Dashboard:
    """
    Create a dashboard.

    A dashboard consists of one or more pages (created using :func:`~h2o_q.ui.dashboard_page`). The dashboard is
    displayed as a tabbed layout, with each tab corresponding to a page.

    A dashboard page consists of one or more rows (created using :func:`~h2o_q.ui.dashboard_row`), laid out top to bottom.
    Each dashboard row in turn contains one or more panels (created using :func:`~h2o_q.ui.dashboard_panel`), laid out left to right.
    Each dashboard panel in turn conttains one or more cells, laid out top to bottom.

    Dashboard rows and panels support both flexible and fixed sizing.

    For flexible sizes, specify an integer without units, e.g. '2', '5', etc. These are interpreted as ratios.

    For fixed sizes, specify the size with units, e.g. '200px', '2vw', etc.
    The complete list of units can be found at https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

    You can combine fixed and flexible sizes to make your dashboard responsive (adjust to different screen sizes).

    Examples:

    * Two panels with sizes '3', '1' will result in a 3:1 split
    * Three panels with sizes '300px', '1' and '300px' will result in a an expandable center panel in between two 300px panels.
    * Four panels with sizes '200px', '400px', '1', '2' will result in two fixed-width panels followed by a 1:2 split.

    :param pages: A list of pages contained in the dashboard.
    :return: A dashboard instance.
    """
    return g.Dashboard(pages=pages)


def dashboard_page(title: str, rows: List[g.DashboardRow]) -> g.DashboardPage:
    """
    Create a dashboard page.

    :param title: The text displayed on the page's tab.
    :param rows: A list of rows to display in the dashboard page (top to bottom).
    :return: A dashboard page instance.
    """
    return g.DashboardPage(title=title, rows=rows)


def dashboard_row(panels: List[g.DashboardPanel], size: str = '') -> g.DashboardRow:
    """
    Create a dashboard row.

    :param panels: A list of panels to display in the row (left to right).
    :param size: The absolute or relative height of the row.
    :return: A dashboard row instance.
    """
    return g.DashboardRow(panels=panels, size=size)


def dashboard_panel(cells=List[g.Cell], size: str = '', commands: List[g.Command] = None,
                    data: str = '') -> g.DashboardPanel:
    """
    Create a dashboard panel.

    :param cells: A list of cells to display in the panel (top to bottom).
    :param size: The absolute or relative width of the panel.
    :param commands: A list of custom commands to allow on this panel.
    :param data: Data associated with this section, if any.
    :return: A dashboard panel instance.
    """
    return g.DashboardPanel(cells=cells, size=size, commands=commands if commands is not None else [], data=data)


def notebook(sections: List[g.NotebookSection]) -> g.Notebook:
    """
    Create a notebook.

    A notebook is rendered as a sequence of sections.

    :param sections: A list of sections to display in the notebook.
    :return: A notebook instance.
    """
    return g.Notebook(sections=sections)


def notebook_section(cells: List[g.Cell], commands: List[g.Command] = None, data: str = '') -> g.NotebookSection:
    """
    Create a notebook section.

    A notebook section is rendered as a sequence of cells.

    :param cells: A list of cells to display in this notebook section.
    :param commands: A list of custom commands to allow on this section.
    :param data: Data associated with this section, if any.
    :return:  A notebook section instance.
    """
    return g.NotebookSection(cells=cells, commands=commands if commands is not None else [], data=data)


def heading_cell(level: int, content: str) -> g.Cell:
    """
    Create a heading cell.

    A heading cell is rendered as a HTML heading (H1 to H6).

    :param level: The heading level (between 1 and 6)
    :param content: The heading text
    :return: A cell instance.
    """
    return g.Cell(heading=g.HeadingCell(level=level, content=content))


def markdown_cell(content: str) -> g.Cell:
    """
    Create a markdown cell.

    A markdown cell is rendered using Github-flavored markdown.
    HTML markup is allowed in markdown content.
    URLs, if found, are displayed as hyperlinks.
    Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.

    :param content: The markdown content of this cell.
    :return: A cell instance
    """
    return g.Cell(markdown=g.MarkdownCell(content=content))


def frame_cell(source: str, width: str, height: str) -> g.Cell:
    """
    Create a frame cell.

    A frame cell is rendered as in inline frame (iframe) element.
    See https://developer.mozilla.org/en-US/docs/Web/CSS/length for `width` and `height` parameters.

    :param source: The HTML content of the frame.
    :param width: The CSS width of the frame.
    :param height: The CSS height of the frame.
    :return: A cell instance
    """
    return g.Cell(frame=g.FrameCell(source=source, width=width, height=height))


def vega_cell(specification: str, query: g.Query) -> g.Cell:
    """
    Create a VegaLite cell.

    :param specification: VegaLite specification.
    :param query: The query to be executed to populate this visualization. A :class:`~h2o_q.api.Query` instance.
    :return: A cell instance
    """
    return g.Cell(vega=g.VegaCell(specification=specification, query=query))


def tabs(name: str, value: str = '', *items: g.Tab) -> g.Component:
    """
    Create a tab bar.  When the selected tab changes, the form is submitted
    and ```q.args.tabs_name``` is set to the new tab name selected.

    :param name: An identifying name for this component.
    :param value: The name of the tab to select.
    :param items: The tab instances.
    :return: A tab set instance.
    """
    return g.Component(tabs=g.Tabs(name=name, value=value, items=list(items)))


def tab(name: str, label: str = '', icon: str = '') -> g.Tab:
    """
    Creates a new tab entry within the tab widget.  Tabs themselves do not have content,
    and the ```q.args.tabs_name``` should be checked to include the appropriate content
    for the selected tab.

    :param name: An identifying name for this component.
    :param label: Text that appears on the tab in the UI.
    :param icon: Icon displayed in the far right end of the text field.
    :return: A tab instance.
    """
    return g.Tab(name=name, label=label, icon=icon)


def expander(name: str, label: str = '', expanded: bool = False, *items: g.Component) -> g.Component:
    """
    Creates a new expander.  Expanders can be used to show/hide a group of related components.

    :param name: An identifying name for this component.
    :param label: The text displayed on the expander.
    :param expanded: True if expanded, False if collapsed.
    :param items: List of components to be hideable by the expander.
    :return: A expander instance.
    """
    return g.Component(expander=g.Expander(name=name, label=label, expanded=expanded, items=list(items)))


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
