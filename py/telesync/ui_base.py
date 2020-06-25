#
# THIS FILE IS GENERATED; DO NOT EDIT
#

from typing import Optional, Union, List
from .types import Value, PackedRecord, PackedRecords, PackedData
from .types import \
    Button, \
    Buttons, \
    Card1Card, \
    Card2Card, \
    Card3Card, \
    Card4Card, \
    Card5Card, \
    Card6Card, \
    Card7Card, \
    Card8Card, \
    Card9Card, \
    Cell, \
    Checkbox, \
    Checklist, \
    Choice, \
    ChoiceGroup, \
    ColorPicker, \
    Combobox, \
    Command, \
    Component, \
    DashboardCard, \
    DashboardPage, \
    DashboardPanel, \
    DashboardRow, \
    DataSource, \
    DataSourceQuery, \
    DatePicker, \
    Dropdown, \
    Expander, \
    FileUpload, \
    FlexCard, \
    FormCard, \
    FrameCard, \
    FrameCell, \
    GridCard, \
    HeadingCell, \
    Label, \
    Link, \
    ListCard, \
    ListItem1Card, \
    Mark, \
    MarkdownCard, \
    MarkdownCell, \
    MarkupCard, \
    MessageBar, \
    MetaCard, \
    Nav, \
    NavGroup, \
    NavItem, \
    NotebookCard, \
    NotebookSection, \
    PixelArtCard, \
    PlotCard, \
    Progress, \
    RepeatCard, \
    Separator, \
    Slider, \
    Spinbox, \
    Tab, \
    Table, \
    TableColumn, \
    TableRow, \
    Tabs, \
    TemplateCard, \
    Text, \
    Textbox, \
    Toggle, \
    VegaCell, \
    Vis


def card1_card(
        box: str,
        title: str,
        value: str,
        data: Optional[PackedRecord] = None,
) -> Card1Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param data: No documentation available.
    """
    return Card1Card(
        box,
        title,
        value,
        data,
    )


def card2_card(
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
        plot_curve: Optional[str] = None,
) -> Card2Card:
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
    :param plot_curve: No documentation available. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    """
    return Card2Card(
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


def card3_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        caption: str,
        data: PackedRecord,
) -> Card3Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param caption: No documentation available.
    :param data: No documentation available.
    """
    return Card3Card(
        box,
        title,
        value,
        aux_value,
        caption,
        data,
    )


def card4_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card4Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card4Card(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card5_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card5Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card5Card(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card6_card(
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
        plot_curve: Optional[str] = None,
) -> Card6Card:
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
    :param plot_curve: No documentation available. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    """
    return Card6Card(
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


def card7_card(
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
        plot_curve: Optional[str] = None,
) -> Card7Card:
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
    :param plot_curve: No documentation available. One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
    """
    return Card7Card(
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


def card8_card(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card8Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card8Card(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card9_card(
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
) -> Card9Card:
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
    return Card9Card(
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


def heading_cell(
        level: int,
        content: str,
) -> Cell:
    """Create a heading cell.

    A heading cell is rendered as a HTML heading (H1 to H6).

    :param level: The heading level (between 1 and 6)
    :param content: The heading text.
    """
    return Cell(heading=HeadingCell(
        level,
        content,
    ))


def markdown_cell(
        content: str,
) -> Cell:
    """Create a markdown cell.

    A markdown cell is rendered using Github-flavored markdown.
    HTML markup is allowed in markdown content.
    URLs, if found, are displayed as hyperlinks.
    Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.

    :param content: The markdown content of this cell.
    """
    return Cell(markdown=MarkdownCell(
        content,
    ))


def frame_cell(
        source: str,
        width: str,
        height: str,
) -> Cell:
    """Create a frame cell

    A frame cell is rendered as in inline frame (iframe) element.
    See https://developer.mozilla.org/en-US/docs/Web/CSS/length for `width` and `height` parameters.

    :param source: The HTML content of the frame.
    :param width: The CSS width of the frame.
    :param height: The CSS height of the frame.
    """
    return Cell(frame=FrameCell(
        source,
        width,
        height,
    ))


def data_source(
        t: str,
        id: int,
) -> DataSource:
    """Create a reference to a data source.

    :param t: The type of the data source. One of 'table', 'view'.
    :param id: The ID of the data source
    """
    return DataSource(
        t,
        id,
    )


def data_source_query(
        sql: str,
        sources: List[DataSource],
) -> DataSourceQuery:
    """Create a stored query.

    :param sql: The SQL query.
    :param sources: The data sources referred to in the SQL query.
    """
    return DataSourceQuery(
        sql,
        sources,
    )


def vega_cell(
        specification: str,
        query: DataSourceQuery,
) -> Cell:
    """Create a VegaLite cell.

    :param specification: The VegaLite specification.
    :param query: The query to be executed to populate this visualization.
    """
    return Cell(vega=VegaCell(
        specification,
        query,
    ))


def cell(
        heading: Optional[HeadingCell] = None,
        markdown: Optional[MarkdownCell] = None,
        frame: Optional[FrameCell] = None,
        vega: Optional[VegaCell] = None,
) -> Cell:
    """Create a cell.

    :param heading: A heading cell.
    :param markdown: A markdown cell.
    :param frame: A frame cell.
    :param vega: A vega cell.
    """
    return Cell(
        heading,
        markdown,
        frame,
        vega,
    )


def command(
        action: str,
        label: str,
        caption: Optional[str] = None,
        icon: Optional[str] = None,
        data: Optional[str] = None,
) -> Command:
    """Create a command.

    Commands are typically displayed as context menu items associated with
    parts of notebooks or dashboards.

    :param action: The function to call when this command is invoked.
    :param label: The text displayed for this command.
    :param caption: The caption for this command (typically a tooltip).
    :param icon: Data associated with this command, if any.
    :param data: The icon to be displayed for this command.
    """
    return Command(
        action,
        label,
        caption,
        icon,
        data,
    )


def dashboard_panel(
        cells: List[Cell],
        size: Optional[str] = None,
        commands: Optional[List[Command]] = None,
        data: Optional[str] = None,
) -> DashboardPanel:
    """Create a dashboard panel.

    :param cells: A list of cells to display in the panel (top to bottom).
    :param size: The absolute or relative width of the panel.
    :param commands: A list of custom commands to allow on this panel.
    :param data: Data associated with this section, if any.
    """
    return DashboardPanel(
        cells,
        size,
        commands,
        data,
    )


def dashboard_row(
        panels: List[DashboardPanel],
        size: Optional[str] = None,
) -> DashboardRow:
    """Create a dashboard row.

    :param panels: A list of panels to display in the row (left to right).
    :param size: The absolute or relative height of the row.
    """
    return DashboardRow(
        panels,
        size,
    )


def dashboard_page(
        title: str,
        rows: List[DashboardRow],
) -> DashboardPage:
    """Create a dashboard page.

    :param title: The text displayed on the page's tab.
    :param rows: A list of rows to display in the dashboard page (top to bottom).
    """
    return DashboardPage(
        title,
        rows,
    )


def dashboard_card(
        box: str,
        pages: List[DashboardPage],
) -> DashboardCard:
    """Create a dashboard.

    A dashboard consists of one or more pages.
    The dashboard is displayed as a tabbed layout, with each tab corresponding to a page.

    A dashboard page consists of one or more rows, laid out top to bottom.
    Each dashboard row in turn contains one or more panels, laid out left to right.
    Each dashboard panel in turn conttains one or more cells, laid out top to bottom.

    Dashboard rows and panels support both flexible and fixed sizing.

    For flexible sizes, specify an integer without units, e.g. '2', '5', etc. These are interpreted as ratios.

    For fixed sizes, specify the size with units, e.g. '200px', '2vw', etc.
    The complete list of units can be found at https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

    You can combine fixed and flexible sizes to make your dashboard responsive (adjust to different screen sizes).

    Examples:
    Two panels with sizes '3', '1' will result in a 3:1 split.
    Three panels with sizes '300px', '1' and '300px' will result in a an expandable center panel in between two 300px panels.
    Four panels with sizes '200px', '400px', '1', '2' will result in two fixed-width panels followed by a 1:2 split.

    :param box: A string indicating how to place this component on the page.
    :param pages: A list of pages contained in the dashboard.
    """
    return DashboardCard(
        box,
        pages,
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
) -> FlexCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    :param direction: No documentation available. One of 'horizontal', 'vertical'.
    :param justify: No documentation available. One of 'start', 'end', 'center', 'between', 'around'.
    :param align: No documentation available. One of 'start', 'end', 'center', 'baseline', 'stretch'.
    :param wrap: No documentation available. One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
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
    )


def text(
        content: str,
        size: Optional[str] = None,
        tooltip: Optional[str] = None,
) -> Component:
    """Create text content.

    :param content: The text content.
    :param size: The font size of the text content. One of "xl" (extra large), "l" (large), "m" (medium), "s" (small), "xs" (extra small).
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
    """
    return Component(text=Text(
        content,
        size,
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

    :param name: An identifying name for this component.
    :param label: The text displayed on the button.
    :param caption: The caption displayed below the label. Setting a caption renders a compound button.
    :param primary: True if the button should be rendered as the primary button in the set.
    :param disabled: True if the button should be disabled.
    :param link: True if the button should be rendered as link text and not a standard button.
    :param tooltip: An optional tooltip message displayed when a user clicks the help icon to the right of the component.
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
    """
    return Component(expander=Expander(
        name,
        label,
        expanded,
        items,
    ))


def nav_item(
        name: str,
        label: str,
) -> NavItem:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    """
    return NavItem(
        name,
        label,
    )


def nav_group(
        label: str,
        items: List[NavItem],
) -> NavGroup:
    """No documentation available.

    :param label: No documentation available.
    :param items: No documentation available.
    """
    return NavGroup(
        label,
        items,
    )


def nav(
        name: str,
        items: List[NavGroup],
) -> Component:
    """No documentation available.

    :param name: No documentation available.
    :param items: No documentation available.
    """
    return Component(nav=Nav(
        name,
        items,
    ))


def component(
        text: Optional[Text] = None,
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
        nav: Optional[Nav] = None,
) -> Component:
    """Create a component.

    :param text: Text block.
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
    :param nav: Navigation.
    """
    return Component(
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
        button,
        buttons,
        file_upload,
        table,
        link,
        tabs,
        expander,
        nav,
    )


def form_card(
        box: str,
        items: Union[List[Component], str],
) -> FormCard:
    """Create a form.

    :param box: A string indicating how to place this component on the page.
    :param items: The components in this form.
    """
    return FormCard(
        box,
        items,
    )


def frame_card(
        box: str,
        title: str,
        path: Optional[str] = None,
        content: Optional[str] = None,
) -> FrameCard:
    """Render a card containing a HTML page inside an inline frame (iframe).

    Either a path or content can be provided as arguments.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param path: The path or URL of the web page, e.g. '/foo.html' or 'http://example.com/foo.html'
    :param content: The HTML content of the page. A string containing '<html>...</html>'
    """
    return FrameCard(
        box,
        title,
        path,
        content,
    )


def grid_card(
        box: str,
        title: str,
        cells: PackedData,
        data: PackedData,
) -> GridCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param cells: No documentation available.
    :param data: No documentation available.
    """
    return GridCard(
        box,
        title,
        cells,
        data,
    )


def list_card(
        box: str,
        title: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
) -> ListCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    return ListCard(
        box,
        title,
        item_view,
        item_props,
        data,
    )


def list_item1_card(
        box: str,
        title: str,
        caption: str,
        value: str,
        aux_value: str,
        data: PackedRecord,
) -> ListItem1Card:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param data: No documentation available.
    """
    return ListItem1Card(
        box,
        title,
        caption,
        value,
        aux_value,
        data,
    )


def markdown_card(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
) -> MarkdownCard:
    """Render Markdown content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
    :param data: Additional data for the card.
    """
    return MarkdownCard(
        box,
        title,
        content,
        data,
    )


def markup_card(
        box: str,
        title: str,
        content: str,
) -> MarkupCard:
    """Render HTML content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The HTML content.
    """
    return MarkupCard(
        box,
        title,
        content,
    )


def meta_card(
        box: str,
        title: Optional[str] = None,
) -> MetaCard:
    """Represents page-global state.

    This card is invisible.
    It is used to control attributes of the active page.

    :param box: A string indicating how to place this component on the page.
    :param title: The title of the page.
    """
    return MetaCard(
        box,
        title,
    )


def notebook_section(
        cells: List[Cell],
        commands: Optional[List[Command]] = None,
        data: Optional[str] = None,
) -> NotebookSection:
    """Create a notebook section.

    A notebook section is rendered as a sequence of cells.

    :param cells: A list of cells to display in this notebook section.
    :param commands: A list of custom commands to allow on this section.
    :param data: Data associated with this section, if any.
    """
    return NotebookSection(
        cells,
        commands,
        data,
    )


def notebook_card(
        box: str,
        sections: List[NotebookSection],
) -> NotebookCard:
    """Create a notebook.

    A notebook is rendered as a sequence of sections.

    :param box: A string indicating how to place this component on the page.
    :param sections: A list of sections to display in the notebook.
    """
    return NotebookCard(
        box,
        sections,
    )


def pixel_art_card(
        box: str,
        title: str,
        data: PackedRecord,
) -> PixelArtCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    """
    return PixelArtCard(
        box,
        title,
        data,
    )


def mark(
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
        label_rotation: Optional[float] = None,
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
    return Mark(
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


def vis(
        marks: List[Mark],
) -> Vis:
    """No documentation available.

    :param marks: No documentation available.
    """
    return Vis(
        marks,
    )


def plot_card(
        box: str,
        title: str,
        data: PackedRecord,
        vis: Vis,
) -> PlotCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    :param vis: No documentation available.
    """
    return PlotCard(
        box,
        title,
        data,
        vis,
    )


def repeat_card(
        box: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
) -> RepeatCard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    return RepeatCard(
        box,
        item_view,
        item_props,
        data,
    )


def template_card(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
) -> TemplateCard:
    """Render dynamic content using a HTML template.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The Handlebars template. https://handlebarsjs.com/guide/
    :param data: Data for the Handlebars template
    """
    return TemplateCard(
        box,
        title,
        content,
        data,
    )
