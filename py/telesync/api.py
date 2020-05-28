#
# THIS FILE IS GENERATED; DO NOT EDIT
#

from typing import Optional, Union, List
from .cards import Value, PackedRecord, PackedRecords, PackedData
from .cards import \
    BasicList, \
    Card1, \
    Card2, \
    Card3, \
    Card4, \
    Card5, \
    Card6, \
    Card7, \
    Card8, \
    Card9, \
    Cell, \
    Command, \
    Dashboard, \
    DashboardPage, \
    DashboardPanel, \
    DashboardRow, \
    DataCell, \
    DataSource, \
    Flex, \
    Form, \
    FormButton, \
    FormButtons, \
    FormCheckbox, \
    FormChecklist, \
    FormChoice, \
    FormChoiceGroup, \
    FormColorPicker, \
    FormCombobox, \
    FormComponent, \
    FormDatePicker, \
    FormDropdown, \
    FormExpander, \
    FormFileUpload, \
    FormLabel, \
    FormLink, \
    FormMessageBar, \
    FormNav, \
    FormNavGroup, \
    FormNavItem, \
    FormProgress, \
    FormSeparator, \
    FormSlider, \
    FormSpinbox, \
    FormTab, \
    FormTable, \
    FormTableColumn, \
    FormTableRow, \
    FormTabs, \
    FormText, \
    FormTextbox, \
    FormToggle, \
    FrameCell, \
    HeadingCell, \
    ListItem1, \
    Markdown, \
    MarkdownCell, \
    Markup, \
    Notebook, \
    NotebookSection, \
    PixelArt, \
    Plot, \
    PlotMark, \
    PlotVis, \
    Query, \
    Repeat, \
    Table, \
    Template, \
    VegaCell


def basic_list(
        box: str,
        title: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
) -> BasicList:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    return BasicList(
        box,
        title,
        item_view,
        item_props,
        data,
    )


def card1(
        box: str,
        title: str,
        value: str,
        data: Optional[PackedRecord] = None,
) -> Card1:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param data: No documentation available.
    """
    return Card1(
        box,
        title,
        value,
        data,
    )


def card2(
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
        plot_curve: str,
) -> Card2:
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
    :param plot_curve: No documentation available.
    """
    return Card2(
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


def card3(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        caption: str,
        data: PackedRecord,
) -> Card3:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param caption: No documentation available.
    :param data: No documentation available.
    """
    return Card3(
        box,
        title,
        value,
        aux_value,
        caption,
        data,
    )


def card4(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card4:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card4(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card5(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card5:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card5(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card6(
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
        plot_curve: str,
) -> Card6:
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
    :param plot_curve: No documentation available.
    """
    return Card6(
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


def card7(
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
        plot_curve: str,
) -> Card7:
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
    :param plot_curve: No documentation available.
    """
    return Card7(
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


def card8(
        box: str,
        title: str,
        value: str,
        aux_value: str,
        progress: float,
        plot_color: str,
        data: PackedRecord,
) -> Card8:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param progress: No documentation available.
    :param plot_color: No documentation available.
    :param data: No documentation available.
    """
    return Card8(
        box,
        title,
        value,
        aux_value,
        progress,
        plot_color,
        data,
    )


def card9(
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
) -> Card9:
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
    return Card9(
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
) -> HeadingCell:
    """No documentation available.

    :param level: No documentation available.
    :param content: No documentation available.
    """
    return HeadingCell(
        level,
        content,
    )


def markdown_cell(
        content: str,
) -> MarkdownCell:
    """No documentation available.

    :param content: No documentation available.
    """
    return MarkdownCell(
        content,
    )


def frame_cell(
        source: str,
        width: str,
        height: str,
) -> FrameCell:
    """No documentation available.

    :param source: No documentation available.
    :param width: No documentation available.
    :param height: No documentation available.
    """
    return FrameCell(
        source,
        width,
        height,
    )


def data_cell(
        content: str,
) -> DataCell:
    """No documentation available.

    :param content: No documentation available.
    """
    return DataCell(
        content,
    )


def data_source(
        t: str,
        id: int,
) -> DataSource:
    """No documentation available.

    :param t: No documentation available. One of 'Table', 'View'.
    :param id: No documentation available.
    """
    return DataSource(
        t,
        id,
    )


def query(
        sql: str,
        sources: List[DataSource],
) -> Query:
    """No documentation available.

    :param sql: No documentation available.
    :param sources: No documentation available.
    """
    return Query(
        sql,
        sources,
    )


def vega_cell(
        specification: str,
        query: Query,
) -> VegaCell:
    """No documentation available.

    :param specification: No documentation available.
    :param query: No documentation available.
    """
    return VegaCell(
        specification,
        query,
    )


def cell(
        heading: Optional[HeadingCell] = None,
        markdown: Optional[MarkdownCell] = None,
        frame: Optional[FrameCell] = None,
        data: Optional[DataCell] = None,
        vega: Optional[VegaCell] = None,
) -> Cell:
    """No documentation available.

    :param heading: No documentation available.
    :param markdown: No documentation available.
    :param frame: No documentation available.
    :param data: No documentation available.
    :param vega: No documentation available.
    """
    return Cell(
        heading,
        markdown,
        frame,
        data,
        vega,
    )


def command(
        action: str,
        icon: str,
        label: str,
        caption: str,
        data: str,
) -> Command:
    """No documentation available.

    :param action: No documentation available.
    :param icon: No documentation available.
    :param label: No documentation available.
    :param caption: No documentation available.
    :param data: No documentation available.
    """
    return Command(
        action,
        icon,
        label,
        caption,
        data,
    )


def dashboard_panel(
        cells: List[Cell],
        size: str,
        commands: List[Command],
        data: str,
) -> DashboardPanel:
    """No documentation available.

    :param cells: No documentation available.
    :param size: No documentation available.
    :param commands: No documentation available.
    :param data: No documentation available.
    """
    return DashboardPanel(
        cells,
        size,
        commands,
        data,
    )


def dashboard_row(
        panels: List[DashboardPanel],
        size: str,
) -> DashboardRow:
    """No documentation available.

    :param panels: No documentation available.
    :param size: No documentation available.
    """
    return DashboardRow(
        panels,
        size,
    )


def dashboard_page(
        title: str,
        rows: List[DashboardRow],
) -> DashboardPage:
    """No documentation available.

    :param title: No documentation available.
    :param rows: No documentation available.
    """
    return DashboardPage(
        title,
        rows,
    )


def dashboard(
        box: str,
        pages: List[DashboardPage],
) -> Dashboard:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param pages: No documentation available.
    """
    return Dashboard(
        box,
        pages,
    )


def flex(
        box: str,
        title: str,
        item_view: str,
        item_props: PackedRecord,
        direction: str,
        justify: str,
        align: str,
        wrap: str,
        data: PackedData,
) -> Flex:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param direction: No documentation available. One of 'horizontal', 'vertical'.
    :param justify: No documentation available. One of 'start', 'end', 'center', 'between', 'around'.
    :param align: No documentation available. One of 'start', 'end', 'center', 'baseline', 'stretch'.
    :param wrap: No documentation available. One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
    :param data: No documentation available.
    """
    return Flex(
        box,
        title,
        item_view,
        item_props,
        direction,
        justify,
        align,
        wrap,
        data,
    )


def form_text(
        size: str,
        text: str,
        tooltip: str,
) -> FormText:
    """No documentation available.

    :param size: No documentation available.
    :param text: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormText(
        size,
        text,
        tooltip,
    )


def form_label(
        label: str,
        required: bool,
        disabled: bool,
        tooltip: str,
) -> FormLabel:
    """No documentation available.

    :param label: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormLabel(
        label,
        required,
        disabled,
        tooltip,
    )


def form_separator(
        label: str,
) -> FormSeparator:
    """No documentation available.

    :param label: No documentation available.
    """
    return FormSeparator(
        label,
    )


def form_progress(
        label: str,
        caption: str,
        value: float,
        tooltip: str,
) -> FormProgress:
    """No documentation available.

    :param label: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormProgress(
        label,
        caption,
        value,
        tooltip,
    )


def form_message_bar(
        type: str,
        text: str,
) -> FormMessageBar:
    """No documentation available.

    :param type: No documentation available.
    :param text: No documentation available.
    """
    return FormMessageBar(
        type,
        text,
    )


def form_textbox(
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
) -> FormTextbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param mask: No documentation available.
    :param icon: No documentation available.
    :param prefix: No documentation available.
    :param suffix: No documentation available.
    :param value: No documentation available.
    :param error: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param readonly: No documentation available.
    :param multiline: No documentation available.
    :param password: No documentation available.
    :param tooltip: No documentation available.
    """
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


def form_checkbox(
        name: str,
        label: str,
        value: bool,
        indeterminate: bool,
        disabled: bool,
        trigger: bool,
        tooltip: str,
) -> FormCheckbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param indeterminate: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormCheckbox(
        name,
        label,
        value,
        indeterminate,
        disabled,
        trigger,
        tooltip,
    )


def form_toggle(
        name: str,
        label: str,
        value: bool,
        disabled: bool,
        trigger: bool,
        tooltip: str,
) -> FormToggle:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormToggle(
        name,
        label,
        value,
        disabled,
        trigger,
        tooltip,
    )


def form_choice(
        name: str,
        label: str,
        disabled: bool,
) -> FormChoice:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param disabled: No documentation available.
    """
    return FormChoice(
        name,
        label,
        disabled,
    )


def form_choice_group(
        name: str,
        label: str,
        value: str,
        choices: List[FormChoice],
        required: bool,
        trigger: bool,
        tooltip: str,
) -> FormChoiceGroup:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param required: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormChoiceGroup(
        name,
        label,
        value,
        choices,
        required,
        trigger,
        tooltip,
    )


def form_checklist(
        name: str,
        label: str,
        values: List[str],
        choices: List[FormChoice],
        tooltip: str,
) -> FormChecklist:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param values: No documentation available.
    :param choices: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormChecklist(
        name,
        label,
        values,
        choices,
        tooltip,
    )


def form_dropdown(
        name: str,
        label: str,
        placeholder: str,
        multiple: bool,
        value: str,
        values: List[str],
        choices: List[FormChoice],
        required: bool,
        disabled: bool,
        trigger: bool,
        tooltip: str,
) -> FormDropdown:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param multiple: No documentation available.
    :param value: No documentation available.
    :param values: No documentation available.
    :param choices: No documentation available.
    :param required: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
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


def form_combobox(
        name: str,
        label: str,
        placeholder: str,
        value: str,
        choices: List[str],
        error: str,
        disabled: bool,
        tooltip: str,
) -> FormCombobox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param error: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
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


def form_slider(
        name: str,
        label: str,
        min: float,
        max: float,
        step: float,
        value: float,
        disabled: bool,
        trigger: bool,
        tooltip: str,
) -> FormSlider:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param min: No documentation available.
    :param max: No documentation available.
    :param step: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param trigger: No documentation available.
    :param tooltip: No documentation available.
    """
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


def form_spinbox(
        name: str,
        label: str,
        min: float,
        max: float,
        step: float,
        value: float,
        disabled: bool,
        tooltip: str,
) -> FormSpinbox:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param min: No documentation available.
    :param max: No documentation available.
    :param step: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
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


def form_date_picker(
        name: str,
        label: str,
        placeholder: str,
        value: str,
        disabled: bool,
        tooltip: str,
) -> FormDatePicker:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param placeholder: No documentation available.
    :param value: No documentation available.
    :param disabled: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormDatePicker(
        name,
        label,
        placeholder,
        value,
        disabled,
        tooltip,
    )


def form_color_picker(
        name: str,
        label: str,
        value: str,
        choices: List[str],
        tooltip: str,
) -> FormColorPicker:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param value: No documentation available.
    :param choices: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormColorPicker(
        name,
        label,
        value,
        choices,
        tooltip,
    )


def form_button(
        name: str,
        label: str,
        caption: str,
        primary: bool,
        disabled: bool,
        link: bool,
        tooltip: str,
) -> FormButton:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param caption: No documentation available.
    :param primary: No documentation available.
    :param disabled: No documentation available.
    :param link: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormButton(
        name,
        label,
        caption,
        primary,
        disabled,
        link,
        tooltip,
    )


def form_buttons(
        buttons: List[FormButton],
) -> FormButtons:
    """No documentation available.

    :param buttons: No documentation available.
    """
    return FormButtons(
        buttons,
    )


def form_file_upload(
        name: str,
        label: str,
        multiple: bool,
        tooltip: str,
) -> FormFileUpload:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param multiple: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormFileUpload(
        name,
        label,
        multiple,
        tooltip,
    )


def form_table_column(
        name: str,
        label: str,
) -> FormTableColumn:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    """
    return FormTableColumn(
        name,
        label,
    )


def form_table_row(
        name: str,
        cells: List[str],
) -> FormTableRow:
    """No documentation available.

    :param name: No documentation available.
    :param cells: No documentation available.
    """
    return FormTableRow(
        name,
        cells,
    )


def form_table(
        name: str,
        columns: List[FormTableColumn],
        rows: List[FormTableRow],
        multiple: bool,
        tooltip: str,
) -> FormTable:
    """No documentation available.

    :param name: No documentation available.
    :param columns: No documentation available.
    :param rows: No documentation available.
    :param multiple: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormTable(
        name,
        columns,
        rows,
        multiple,
        tooltip,
    )


def form_link(
        label: str,
        path: str,
        disabled: bool,
        button: bool,
        tooltip: str,
) -> FormLink:
    """No documentation available.

    :param label: No documentation available.
    :param path: No documentation available.
    :param disabled: No documentation available.
    :param button: No documentation available.
    :param tooltip: No documentation available.
    """
    return FormLink(
        label,
        path,
        disabled,
        button,
        tooltip,
    )


def form_tab(
        name: str,
        label: str,
        icon: str,
) -> FormTab:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param icon: No documentation available.
    """
    return FormTab(
        name,
        label,
        icon,
    )


def form_tabs(
        name: str,
        value: str,
        items: List[FormTab],
) -> FormTabs:
    """No documentation available.

    :param name: No documentation available.
    :param value: No documentation available.
    :param items: No documentation available.
    """
    return FormTabs(
        name,
        value,
        items,
    )


def form_expander(
        name: str,
        label: str,
        expanded: bool,
        items: List[FormComponent],
) -> FormExpander:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    :param expanded: No documentation available.
    :param items: No documentation available.
    """
    return FormExpander(
        name,
        label,
        expanded,
        items,
    )


def form_nav_item(
        name: str,
        label: str,
) -> FormNavItem:
    """No documentation available.

    :param name: No documentation available.
    :param label: No documentation available.
    """
    return FormNavItem(
        name,
        label,
    )


def form_nav_group(
        label: str,
        items: List[FormNavItem],
) -> FormNavGroup:
    """No documentation available.

    :param label: No documentation available.
    :param items: No documentation available.
    """
    return FormNavGroup(
        label,
        items,
    )


def form_nav(
        name: str,
        items: List[FormNavGroup],
) -> FormNav:
    """No documentation available.

    :param name: No documentation available.
    :param items: No documentation available.
    """
    return FormNav(
        name,
        items,
    )


def form_component(
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
        nav: Optional[FormNav] = None,
) -> FormComponent:
    """No documentation available.

    :param text: No documentation available.
    :param label: No documentation available.
    :param separator: No documentation available.
    :param progress: No documentation available.
    :param message_bar: No documentation available.
    :param textbox: No documentation available.
    :param checkbox: No documentation available.
    :param toggle: No documentation available.
    :param choice_group: No documentation available.
    :param checklist: No documentation available.
    :param dropdown: No documentation available.
    :param combobox: No documentation available.
    :param slider: No documentation available.
    :param spinbox: No documentation available.
    :param date_picker: No documentation available.
    :param color_picker: No documentation available.
    :param buttons: No documentation available.
    :param file_upload: No documentation available.
    :param table: No documentation available.
    :param link: No documentation available.
    :param tabs: No documentation available.
    :param button: No documentation available.
    :param expander: No documentation available.
    :param nav: No documentation available.
    """
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
        nav,
    )


def form(
        box: str,
        url: str,
        args: PackedRecord,
        items: Union[List[FormComponent], str],
) -> Form:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param url: No documentation available.
    :param args: No documentation available.
    :param items: No documentation available.
    """
    return Form(
        box,
        url,
        args,
        items,
    )


def list_item1(
        box: str,
        title: str,
        caption: str,
        value: str,
        aux_value: str,
        data: PackedRecord,
) -> ListItem1:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param caption: No documentation available.
    :param value: No documentation available.
    :param aux_value: No documentation available.
    :param data: No documentation available.
    """
    return ListItem1(
        box,
        title,
        caption,
        value,
        aux_value,
        data,
    )


def markdown(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
) -> Markdown:
    """Render Markdown content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
    :param data: Additional data for the card.
    """
    return Markdown(
        box,
        title,
        content,
        data,
    )


def markup(
        box: str,
        title: str,
        content: str,
) -> Markup:
    """Render HTML content.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The HTML content.
    """
    return Markup(
        box,
        title,
        content,
    )


def notebook_section(
        cells: List[Cell],
        commands: List[Command],
        data: str,
) -> NotebookSection:
    """No documentation available.

    :param cells: No documentation available.
    :param commands: No documentation available.
    :param data: No documentation available.
    """
    return NotebookSection(
        cells,
        commands,
        data,
    )


def notebook(
        box: str,
        sections: List[NotebookSection],
) -> Notebook:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param sections: No documentation available.
    """
    return Notebook(
        box,
        sections,
    )


def pixel_art(
        box: str,
        title: str,
        data: PackedRecord,
) -> PixelArt:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    """
    return PixelArt(
        box,
        title,
        data,
    )


def plot_mark(
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
) -> PlotMark:
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


def plot_vis(
        marks: List[PlotMark],
) -> PlotVis:
    """No documentation available.

    :param marks: No documentation available.
    """
    return PlotVis(
        marks,
    )


def plot(
        box: str,
        title: str,
        data: PackedRecord,
        vis: PlotVis,
) -> Plot:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param data: No documentation available.
    :param vis: No documentation available.
    """
    return Plot(
        box,
        title,
        data,
        vis,
    )


def repeat(
        box: str,
        title: str,
        item_view: str,
        item_props: PackedRecord,
        data: PackedData,
) -> Repeat:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param item_view: No documentation available.
    :param item_props: No documentation available.
    :param data: No documentation available.
    """
    return Repeat(
        box,
        title,
        item_view,
        item_props,
        data,
    )


def table(
        box: str,
        title: str,
        cells: PackedData,
        data: PackedData,
) -> Table:
    """No documentation available.

    :param box: A string indicating how to place this component on the page.
    :param title: No documentation available.
    :param cells: No documentation available.
    :param data: No documentation available.
    """
    return Table(
        box,
        title,
        cells,
        data,
    )


def template(
        box: str,
        title: str,
        content: str,
        data: Optional[PackedRecord] = None,
) -> Template:
    """Render dynamic content using a HTML template.

    :param box: A string indicating how to place this component on the page.
    :param title: The title for this card.
    :param content: The Handlebars template. https://handlebarsjs.com/guide/
    :param data: Data for the Handlebars template
    """
    return Template(
        box,
        title,
        content,
        data,
    )
