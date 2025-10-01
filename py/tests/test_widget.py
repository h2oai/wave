import pytest
from h2o_wave import ui

# t stands for test

def test_text():
    t = ui.text(content = "testing", name = "my_text")
    assert t.text.name == "my_text"

def test_command():
    t = ui.command(name = "my_command")
    assert t.name == "my_command"

def test_text_xl():
    t = ui.text_xl(content = "testing", name = "my_text_xl")
    assert t.text_xl.name == "my_text_xl"

def test_text_l():
    t = ui.text_l(content = "testing", name = "my_text_l")
    assert t.text_l.name == "my_text_l"

def test_text_m():
    t = ui.text_m(content = "testing", name = "my_text_m")
    assert t.text_m.name == "my_text_m"

def test_text_s():
    t = ui.text_s(content = "testing", name = "my_text_s")
    assert t.text_s.name == "my_text_s"

def test_text_xs():
    t = ui.text_xs(content = "testing", name = "my_text_xs")
    assert t.text_xs.name == "my_text_xs"

def test_label():
    t = ui.label(label = "testing", name = "my_label")
    assert t.label.name == "my_label"

def test_separator():
    t = ui.separator(name = "my_separator")
    assert t.separator.name == "my_separator"

def test_progress():
    t = ui.progress(label = "testing", name = "my_progress")
    assert t.progress.name == "my_progress"

def test_message_bar():
    t = ui.message_bar(name = "my_message_bar")
    assert t.message_bar.name == "my_message_bar"

def test_textbox():
    t = ui.textbox(name = "my_textbox")
    assert t.textbox.name == "my_textbox"

def test_checkbox():
    t = ui.checkbox(name = "my_checkbox")
    assert t.checkbox.name == "my_checkbox"

def test_toggle():
    t = ui.toggle(name = "my_toggle")
    assert t.toggle.name == "my_toggle"

def test_choice():
    t = ui.choice(name = "my_choice")
    assert t.name == "my_choice"

def test_choice_group():
    t = ui.choice_group(name = "my_choice_group")
    assert t.choice_group.name == "my_choice_group"

def test_checklist():
    t = ui.checklist(name = "my_checklist")
    assert t.checklist.name == "my_checklist"

def test_dropdown():
    t = ui.dropdown(name = "my_dropdown")
    assert t.dropdown.name == "my_dropdown"

def test_combobox():
    t = ui.combobox(name = "my_combobox")
    assert t.combobox.name == "my_combobox"

def test_slider():
    t = ui.slider(name = "my_slider")
    assert t.slider.name == "my_slider"

def test_spinbox():
    t = ui.spinbox(name = "my_spinbox")
    assert t.spinbox.name == "my_spinbox"

def test_date_picker():
    t = ui.date_picker(name = "my_date_picker")
    assert t.date_picker.name == "my_date_picker"

def test_color_picker():
    t = ui.color_picker(name = "my_color_picker")
    assert t.color_picker.name == "my_color_picker"

def test_button():
    t = ui.button(name = "my_button")
    assert t.button.name == "my_button"

def test_buttons():
    t = ui.buttons(name = "my_buttons", items = [ui.button(name = "testing")])
    assert t.buttons.name == "my_buttons"

def test_mini_button():
    t = ui.mini_button(label = "testing", name = "my_mini_button")
    assert t.mini_button.name == "my_mini_button"

def test_file_upload():
    t = ui.file_upload(name = "my_file_upload")
    assert t.file_upload.name == "my_file_upload"

def test_progress_table_cell_type():
    t = ui.progress_table_cell_type(name = "my_progress_table_cell_type")
    assert t.progress.name == "my_progress_table_cell_type"

def test_icon_table_cell_type():
    t = ui.icon_table_cell_type(name = "my_icon_table_cell_type")
    assert t.icon.name == "my_icon_table_cell_type"

def test_tag_table_cell_type():
    t = ui.tag_table_cell_type(name = "my_tag_table_cell_type")
    assert t.tag.name == "my_tag_table_cell_type"

def test_menu_table_cell_type():
    t = ui.menu_table_cell_type(name = "my_menu_table_cell_type", commands = [ui.command(name = "my_command")])
    assert t.menu.name == "my_menu_table_cell_type"

def test_markdown_table_cell_type():
    t = ui.markdown_table_cell_type(name = "my_markdown_table_cell_type")
    assert t.markdown.name == "my_markdown_table_cell_type"

def test_table_column():
    t = ui.table_column(name = "my_table_column", label = "testing")
    assert t.name == "my_table_column"

def test_table_row():
    t = ui.table_row(name = "my_table_row", cells = ["testing"])
    assert t.name == "my_table_row"

def test_table():
    t = ui.table(name = "my_table", columns = [ui.table_column(name = "my_table_column", label = "testing")], rows = [ui.table_row(name = "my_table_row", cells = ["testing"])])
    assert t.table.name == "my_table"

def test_link():
    t = ui.link(name = "my_link")
    assert t.link.name == "my_link"

def test_tab():
    t = ui.tab(name="my_tab", label="Tab 1", icon="Star")
    assert t.name == "my_tab"

def test_tabs():
    t = ui.tabs(name="my_tabs", items=[ui.tab(name="tab1", label="First")])
    assert t.tabs.name == "my_tabs"

def test_expander():
    t = ui.expander(name="my_expander", label="Expand me")
    assert t.expander.name == "my_expander"

def test_frame():
    t = ui.frame(name="my_frame", path="/foo.html")
    assert t.frame.name == "my_frame"

def test_markup():
    t = ui.markup(name="my_markup", content="<b>hello</b>")
    assert t.markup.name == "my_markup"

def test_template():
    t = ui.template(name="my_template", content="<div>{{text}}</div>")
    assert t.template.name == "my_template"

def test_picker():
    choices = [ui.choice(name="choice1", label="Choice 1")]
    t = ui.picker(name="my_picker", choices=choices)
    assert t.picker.name == "my_picker"

def test_range_slider():
    t = ui.range_slider(name="my_range_slider", min=0, max=10)
    assert t.range_slider.name == "my_range_slider"

def test_stepper():
    steps = [ui.step(label="Step 1", icon="Star", done=True)]
    t = ui.stepper(name="my_stepper", items=steps)
    assert t.stepper.name == "my_stepper"

def test_visualization():
    m = ui.mark(type="point", x="x", y="y")
    p = ui.plot(marks=[m])
    t = ui.visualization(name="my_vis", plot=p, data={})
    assert t.visualization.name == "my_vis"

def test_vega_visualization():
    spec = '{"mark": "point", "encoding": {}, "data": {}}'
    t = ui.vega_visualization(name="my_vega_vis", specification=spec)
    assert t.vega_visualization.name == "my_vega_vis"

def test_stat():
    s = ui.stat(name="my_stat", label="Accuracy", value="95%")
    assert s.name == "my_stat"

def test_stats():
    s1 = ui.stat(name="s1", label="Metric 1", value="10")
    s2 = ui.stat(name="s2", label="Metric 2", value="20")
    t = ui.stats(name="my_stats", items=[s1, s2])
    assert t.stats.name == "my_stats"

def test_persona():
    t = ui.persona(name="my_persona", title="John Doe")
    assert t.persona.name == "my_persona"

def test_text_annotator_tag():
    t = ui.text_annotator_tag(name="tag1", label="Entity", color="#FF0000")
    assert t.name == "tag1"

def test_text_annotator():
    tags = [ui.text_annotator_tag(name="t1", label="Entity", color="#FF0000")]
    items = [ui.text_annotator_item(text="hello", tag="t1")]
    t = ui.text_annotator(name="my_text_annotator", title="Annotate", tags=tags, items=items)
    assert t.text_annotator.name == "my_text_annotator"

def test_image_annotator_tag():
    t = ui.image_annotator_tag(name="img_tag1", label="Car", color="#00FF00")
    assert t.name == "img_tag1"

def test_image_annotator():
    tags = [ui.image_annotator_tag(name="i1", label="Object", color="#00FF00")]
    t = ui.image_annotator(name="my_img_annotator", image="car.png", title="Label image", tags=tags)
    assert t.image_annotator.name == "my_img_annotator"

def test_audio_annotator_tag():
    t = ui.audio_annotator_tag(name="a1", label="Speech", color="#0000FF")
    assert t.name == "a1"

def test_audio_annotator():
    tags = [ui.audio_annotator_tag(name="a1", label="Speech", color="#0000FF")]
    t = ui.audio_annotator(name="my_audio_annotator", title="Audio labels", path="file.wav", tags=tags)
    assert t.audio_annotator.name == "my_audio_annotator"

def test_facepile():
    items = [ui.persona(name="p1", title="Jane")]
    t = ui.facepile(name="my_facepile", items=items)
    assert t.facepile.name == "my_facepile"

def test_copyable_text():
    t = ui.copyable_text(name="my_copytext", value="secret", label="API Key")
    assert t.copyable_text.name == "my_copytext"

def test_menu():
    cmds = [ui.command(name="c1", label="Do")]
    t = ui.menu(name="my_menu", items=cmds)
    assert t.menu.name == "my_menu"

def test_time_picker():
    t = ui.time_picker(name="my_time_picker", label="Pick a time")
    assert t.time_picker.name == "my_time_picker"

def test_breadcrumb():
    t = ui.breadcrumb(name="crumb1", label="Home")
    assert t.name == "crumb1"

def test_nav_item():
    t = ui.nav_item(name="nav1", label="Dashboard")
    assert t.name == "nav1"

def test_chat_suggestion():
    t = ui.chat_suggestion(name="s1", label="Hello")
    assert t.name == "s1"

def test_chatbot_card():
    t = ui.chatbot_card(box="1 1 2 2", name="bot1", data={})
    assert t.name == "bot1"

def test_notification_bar():
    t = ui.notification_bar(text="Hello", name="notif1")
    assert t.name == "notif1"

def test_zone():
    t = ui.zone(name="zone1")
    assert t.name == "zone1"

def test_layout():
    z = ui.zone(name="zone_in_layout")
    t = ui.layout(breakpoint="xs", zones=[z], name="layout1")
    assert t.name == "layout1"

def test_dialog():
    t = ui.dialog(title="Dialog", items=[], name="dialog1")
    assert t.name == "dialog1"

def test_side_panel():
    t = ui.side_panel(title="Side Panel", items=[], name="panel1")
    assert t.name == "panel1"

def test_theme():
    t = ui.theme(name="theme1", text="black", card="white", page="grey", primary="blue")
    assert t.name == "theme1"

def test_preview_card():
    t = ui.preview_card(box="1 1 1 1", name="preview1", image="img.png")
    assert t.name == "preview1"

def test_stat_list_item():
    t = ui.stat_list_item(label="Metric", name="stat1")
    assert t.name == "stat1"

def test_stat_table_item_name():
    t = ui.stat_table_item(label="Test", values=["1"], name="row1")
    assert t.name == "row1"

def test_stat_table_card_name():
    item = ui.stat_table_item(label="Label", values=["Val"])
    t = ui.stat_table_card(box="1", title="Title", columns=["Col"], items=[item], name="card1")
    assert t.name == "card1"

def test_tab_card_name():
    tab = ui.tab(name="tab1", label="Tab 1")
    t = ui.tab_card(box="1", items=[tab], name="my_tab_card")
    assert t.name == "my_tab_card"

def test_tall_info_card_name():
    t = ui.tall_info_card(box="1", name="info1", title="Title", caption="Caption")
    assert t.name == "info1"

def test_tall_stats_card_name():
    stat = ui.stat(label="Label", value="Val")
    t = ui.tall_stats_card(box="1", items=[stat], name="stats1")
    assert t.name == "stats1"

def test_wide_info_card_name():
    t = ui.wide_info_card(box="1", name="wide1", title="Title", caption="Caption")
    assert t.name == "wide1"
