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

.recursive_null_extractor <- function(x){
     attribute_holder <- attributes(x)$class
     x <- lapply(x,function(y){
          if(is.list(y)){
             return(.recursive_null_extractor(y))
          }
          else {
             return(y)
          }
     })
     x[sapply(x,is.null)] <- NULL
     attributes(x)$class <- attribute_holder
 return(x)
}

.to_json <- function(x) {
  x <- .recursive_null_extractor(x)
  jsonlite::toJSON(x, auto_unbox = TRUE)
}

.guard_scalar <- function(n, t, x) {
  if(!is.null(x) && !is(x, t)) {
    stop(sprintf("%s: expected %s", n, t))
  }
}

.guard_vector <- function(n, t, xs) {
  if(!is.null(xs) && (FALSE %in% unlist(lapply(xs, function(x){ is(x, t) })))) {
    stop(sprintf("%s: expected list of %s", n, t))
  }
}
.wave_obj <- "WaveObject"

dump_object <- function(x) {
  if(is(x, .wave_obj)) {
    .to_json(x)
  } else {
    stop("cannot dump")
  }
}


#' Create text content.
#'
#' @param content The text content.
#' @param size The font size of the text content.
#'   One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.TextSize.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param name An identifying name for this component.
#' @return A Text instance.
#' @export
ui_text <- function(
  content,
  size = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  # TODO Validate size
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(text=list(
    content=content,
    size=size,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a command.
#' 
#' Commands are typically displayed as context menu items or toolbar button.
#'
#' @param name An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed.
#' @param label The text displayed for this command.
#' @param caption The caption for this command (typically a tooltip).
#' @param icon The icon to be displayed for this command.
#' @param items Sub-commands, if any
#' @param value Data associated with this command, if any.
#' @return A Command instance.
#' @export
ui_command <- function(
  name,
  label = NULL,
  caption = NULL,
  icon = NULL,
  items = NULL,
  value = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("icon", "character", icon)
  .guard_vector("items", "WaveCommand", items)
  .guard_scalar("value", "character", value)
  .o <- list(
    name=name,
    label=label,
    caption=caption,
    icon=icon,
    items=items,
    value=value)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveCommand"))
  return(.o)
}

#' Create extra-large sized text content.
#'
#' @param content The text content.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param commands Contextual menu commands for this component.
#' @param name An identifying name for this component.
#' @return A TextXl instance.
#' @export
ui_text_xl <- function(
  content,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  commands = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_vector("commands", "WaveCommand", commands)
  .guard_scalar("name", "character", name)
  .o <- list(text_xl=list(
    content=content,
    width=width,
    visible=visible,
    tooltip=tooltip,
    commands=commands,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create large sized text content.
#'
#' @param content The text content.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param commands Contextual menu commands for this component.
#' @param name An identifying name for this component.
#' @return A TextL instance.
#' @export
ui_text_l <- function(
  content,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  commands = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_vector("commands", "WaveCommand", commands)
  .guard_scalar("name", "character", name)
  .o <- list(text_l=list(
    content=content,
    width=width,
    visible=visible,
    tooltip=tooltip,
    commands=commands,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create medium sized text content.
#'
#' @param content The text content.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param name An identifying name for this component.
#' @return A TextM instance.
#' @export
ui_text_m <- function(
  content,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(text_m=list(
    content=content,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create small sized text content.
#'
#' @param content The text content.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param name An identifying name for this component.
#' @return A TextS instance.
#' @export
ui_text_s <- function(
  content,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(text_s=list(
    content=content,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create extra-small sized text content.
#'
#' @param content The text content.
#' @param width The width of the text , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip Tooltip message.
#' @param name An identifying name for this component.
#' @return A TextXs instance.
#' @export
ui_text_xs <- function(
  content,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(text_xs=list(
    content=content,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a label.
#' 
#' Labels give a name or title to a component or group of components.
#' Labels should be in close proximity to the component or group they are paired with.
#' Some components, such as textboxes, dropdowns, or toggles, already have labels
#' incorporated, but other components may optionally add a Label if it helps inform
#' the user of the component’s purpose.
#'
#' @param label The text displayed on the label.
#' @param required True if the field is required.
#' @param disabled True if the label should be disabled.
#' @param width The width of the label , e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param name An identifying name for this component.
#' @return A Label instance.
#' @export
ui_label <- function(
  label,
  required = NULL,
  disabled = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("required", "logical", required)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(label=list(
    label=label,
    required=required,
    disabled=disabled,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a separator.
#' 
#' A separator visually separates content into groups.
#'
#' @param label The text displayed on the separator.
#' @param name An identifying name for this component.
#' @param width The width of the separator , e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Separator instance.
#' @export
ui_separator <- function(
  label = NULL,
  name = NULL,
  width = NULL,
  visible = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("name", "character", name)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .o <- list(separator=list(
    label=label,
    name=name,
    width=width,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a progress bar.
#' 
#' Progress bars are used to show the completion status of an operation lasting more than 2 seconds.
#' If the state of progress cannot be determined, do not set a value.
#' Progress bars feature a bar showing total units to completion, and total units finished.
#' The label appears above the bar, and the caption appears below.
#' The label should tell someone exactly what the operation is doing.
#' 
#' Examples of formatting include:
#' [Object] is being [operation name], or
#' [Object] is being [operation name] to [destination name] or
#' [Object] is being [operation name] from [source name] to [destination name]
#' 
#' Status text is generally in units elapsed and total units.
#' Real-world examples include copying files to a storage location, saving edits to a file, and more.
#' Use units that are informative and relevant to give the best idea to users of how long the operation will take to complete.
#' Avoid time units as they are rarely accurate enough to be trustworthy.
#' Also, combine steps of a complex operation into one total bar to avoid “rewinding” the bar.
#' Instead change the label to reflect the change if necessary. Bars moving backwards reduce confidence in the service.
#'
#' @param label The text displayed above the bar or right to the spinner.
#' @param caption The text displayed below the bar or spinner.
#' @param value The progress, between 0.0 and 1.0, or -1 (default) if indeterminate.
#' @param width The width of the separator, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param name An identifying name for this component.
#' @param type The type of progress bar to be displayed. One of 'bar', 'spinner'. Defaults to 'bar'.
#'   One of 'bar', 'spinner'. See enum h2o_wave.ui.ProgressType.
#' @return A Progress instance.
#' @export
ui_progress <- function(
  label,
  caption = NULL,
  value = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  name = NULL,
  type = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("value", "numeric", value)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  # TODO Validate type
  .o <- list(progress=list(
    label=label,
    caption=caption,
    value=value,
    width=width,
    visible=visible,
    tooltip=tooltip,
    name=name,
    type=type))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a message bar.
#' 
#' A message bar is an area at the top of a primary view that displays relevant status information.
#' You can use a message bar to tell the user about a situation that does not require their immediate attention and
#' therefore does not need to block other activities.
#'
#' @param type The icon and color of the message bar.
#'   One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.MessageBarType.
#' @param text The text displayed on the message bar.
#' @param name An identifying name for this component.
#' @param width The width of the message bar, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param buttons Specify one or more action buttons.
#' @return A MessageBar instance.
#' @export
ui_message_bar <- function(
  type = NULL,
  text = NULL,
  name = NULL,
  width = NULL,
  visible = NULL,
  buttons = NULL) {
  # TODO Validate type
  .guard_scalar("text", "character", text)
  .guard_scalar("name", "character", name)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_vector("buttons", "WaveComponent", buttons)
  .o <- list(message_bar=list(
    type=type,
    text=text,
    name=name,
    width=width,
    visible=visible,
    buttons=buttons))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a text box.
#' 
#' The text box component enables a user to type text into an app.
#' It's typically used to capture a single line of text, but can be configured to capture multiple lines of text.
#' The text displays on the screen in a simple, uniform format.
#'
#' @param name An identifying name for this component.
#' @param label The text displayed above the field.
#' @param placeholder A string that provides a brief hint to the user as to what kind of information is expected in the field. It should be a word or short phrase that demonstrates the expected type of data, rather than an explanatory message.
#' @param value Text to be displayed inside the text box.
#' @param mask The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9].
#' @param icon Icon displayed in the far right end of the text field.
#' @param prefix Text to be displayed before the text box contents.
#' @param suffix Text to be displayed after the text box contents.
#' @param error Text to be displayed as an error below the text box.
#' @param required True if the text box is a required field.
#' @param disabled True if the text box is disabled.
#' @param readonly True if the text box is a read-only field.
#' @param multiline True if the text box should allow multi-line text entry.
#' @param password True if the text box should hide text content.
#' @param trigger True if the form should be submitted when the text value changes.
#' @param height The height of the text box, e.g. '100px'. Percentage values not supported. Applicable only if `multiline` is true.
#' @param width The width of the text box, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param spellcheck True if the text may be checked for spelling errors. Defaults to True.
#' @param type Keyboard to be shown on mobile devices. Defaults to 'text'.
#'   One of 'text', 'number', 'tel'. See enum h2o_wave.ui.TextboxType.
#' @return A Textbox instance.
#' @export
ui_textbox <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  mask = NULL,
  icon = NULL,
  prefix = NULL,
  suffix = NULL,
  error = NULL,
  required = NULL,
  disabled = NULL,
  readonly = NULL,
  multiline = NULL,
  password = NULL,
  trigger = NULL,
  height = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  spellcheck = NULL,
  type = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("placeholder", "character", placeholder)
  .guard_scalar("value", "character", value)
  .guard_scalar("mask", "character", mask)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("prefix", "character", prefix)
  .guard_scalar("suffix", "character", suffix)
  .guard_scalar("error", "character", error)
  .guard_scalar("required", "logical", required)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("readonly", "logical", readonly)
  .guard_scalar("multiline", "logical", multiline)
  .guard_scalar("password", "logical", password)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("height", "character", height)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("spellcheck", "logical", spellcheck)
  # TODO Validate type
  .o <- list(textbox=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    mask=mask,
    icon=icon,
    prefix=prefix,
    suffix=suffix,
    error=error,
    required=required,
    disabled=disabled,
    readonly=readonly,
    multiline=multiline,
    password=password,
    trigger=trigger,
    height=height,
    width=width,
    visible=visible,
    tooltip=tooltip,
    spellcheck=spellcheck,
    type=type))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a checkbox.
#' 
#' A checkbox allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through
#' a single click or tap. It can also be used to indicate a subordinate setting or preference when paired with another
#' component.
#' 
#' A checkbox is used to select or deselect action items. It can be used for a single item or for a list of multiple
#' items that a user can choose from. The component has two selection states: unselected and selected.
#' 
#' For a binary choice, the main difference between a checkbox and a toggle switch is that the checkbox is for status
#' and the toggle switch is for action.
#' 
#' Use multiple checkboxes for multi-select scenarios in which a user chooses one or more items from a group of
#' choices that are not mutually exclusive.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the checkbox.
#' @param value True if selected, False if unselected.
#' @param indeterminate True if the selection is indeterminate (neither selected nor unselected).
#' @param disabled True if the checkbox is disabled.
#' @param trigger True if the form should be submitted when the checkbox value changes.
#' @param width The width of the checkbox, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Checkbox instance.
#' @export
ui_checkbox <- function(
  name,
  label = NULL,
  value = NULL,
  indeterminate = NULL,
  disabled = NULL,
  trigger = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "logical", value)
  .guard_scalar("indeterminate", "logical", indeterminate)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(checkbox=list(
    name=name,
    label=label,
    value=value,
    indeterminate=indeterminate,
    disabled=disabled,
    trigger=trigger,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a toggle.
#' Toggles represent a physical switch that allows users to turn things on or off.
#' Use toggles to present users with two mutually exclusive options (like on/off), where choosing an option results
#' in an immediate action.
#' 
#' Use a toggle for binary operations that take effect right after the user flips the Toggle.
#' For example, use a Toggle to turn services or hardware components on or off.
#' In other words, if a physical switch would work for the action, a Toggle is probably the best component to use.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param value True if selected, False if unselected.
#' @param disabled True if the checkbox is disabled.
#' @param trigger True if the form should be submitted when the toggle value changes.
#' @param width The width of the toggle, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Toggle instance.
#' @export
ui_toggle <- function(
  name,
  label = NULL,
  value = NULL,
  disabled = NULL,
  trigger = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "logical", value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(toggle=list(
    name=name,
    label=label,
    value=value,
    disabled=disabled,
    trigger=trigger,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a choice for a checklist, choice group or dropdown.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param disabled True if the checkbox is disabled.
#' @return A Choice instance.
#' @export
ui_choice <- function(
  name,
  label = NULL,
  disabled = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("disabled", "logical", disabled)
  .o <- list(
    name=name,
    label=label,
    disabled=disabled)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveChoice"))
  return(.o)
}

#' Create a choice group.
#' The choice group component, also known as radio buttons, let users select one option from two or more choices.
#' Each option is represented by one choice group button; a user can select only one choice group in a button group.
#' 
#' Choice groups emphasize all options equally, and that may draw more attention to the options than necessary.
#' Consider using other components, unless the options deserve extra attention from the user.
#' For example, if the default option is recommended for most users in most situations, use a dropdown instead.
#' 
#' If there are only two mutually exclusive options, combine them into a single Checkbox or Toggle switch.
#' For example, use a checkbox for "I agree" instead of choice group buttons for "I agree" and "I don't agree."
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param value The name of the selected choice.
#' @param choices The choices to be presented.
#' @param required True if this field is required.
#' @param trigger True if the form should be submitted when the selection changes.
#' @param inline True if choices should be rendered horizontally. Defaults to False.
#' @param width The width of the choice group, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A ChoiceGroup instance.
#' @export
ui_choice_group <- function(
  name,
  label = NULL,
  value = NULL,
  choices = NULL,
  required = NULL,
  trigger = NULL,
  inline = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "character", value)
  .guard_vector("choices", "WaveChoice", choices)
  .guard_scalar("required", "logical", required)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("inline", "logical", inline)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(choice_group=list(
    name=name,
    label=label,
    value=value,
    choices=choices,
    required=required,
    trigger=trigger,
    inline=inline,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a set of checkboxes.
#' Use this for multi-select scenarios in which a user chooses one or more items from a group of
#' choices that are not mutually exclusive.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed above the component.
#' @param values The names of the selected choices.
#' @param choices The choices to be presented.
#' @param trigger True if the form should be submitted when the checklist value changes.
#' @param inline True if checklist should be rendered horizontally. Defaults to False.
#' @param width The width of the checklist, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Checklist instance.
#' @export
ui_checklist <- function(
  name,
  label = NULL,
  values = NULL,
  choices = NULL,
  trigger = NULL,
  inline = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_vector("values", "character", values)
  .guard_vector("choices", "WaveChoice", choices)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("inline", "logical", inline)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(checklist=list(
    name=name,
    label=label,
    values=values,
    choices=choices,
    trigger=trigger,
    inline=inline,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a dropdown.
#' 
#' A dropdown is a list in which the selected item is always visible, and the others are visible on demand by clicking
#' a drop-down button. They are used to simplify the design and make a choice within the UI. When closed, only the
#' selected item is visible. When users click the drop-down button, all the options become visible.
#' 
#' To change the value, users open the list and click another value or use the arrow keys (up and down) to
#' select a new value.
#' 
#' Note: Use either the 'value' parameter or the 'values' parameter. Setting the 'values' parameter renders a
#' multi-select dropdown.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param placeholder A string that provides a brief hint to the user as to what kind of information is expected in the field.
#' @param value The name of the selected choice.
#' @param values The names of the selected choices. If this parameter is set, multiple selections will be allowed.
#' @param choices The choices to be presented.
#' @param required True if this is a required field.
#' @param disabled True if this field is disabled.
#' @param trigger True if the form should be submitted when the dropdown value changes.
#' @param width The width of the dropdown, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param popup Whether to present the choices using a pop-up dialog. By default pops up a dialog only for more than 100 choices. Defaults to 'auto'.
#'   One of 'auto', 'always', 'never'. See enum h2o_wave.ui.DropdownPopup.
#' @return A Dropdown instance.
#' @export
ui_dropdown <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  values = NULL,
  choices = NULL,
  required = NULL,
  disabled = NULL,
  trigger = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  popup = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("placeholder", "character", placeholder)
  .guard_scalar("value", "character", value)
  .guard_vector("values", "character", values)
  .guard_vector("choices", "WaveChoice", choices)
  .guard_scalar("required", "logical", required)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  # TODO Validate popup
  .o <- list(dropdown=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    values=values,
    choices=choices,
    required=required,
    disabled=disabled,
    trigger=trigger,
    width=width,
    visible=visible,
    tooltip=tooltip,
    popup=popup))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a combobox.
#' 
#' A combobox is a list in which the selected item is always visible, and the others are visible on demand by
#' clicking a drop-down button or by typing in the input.
#' They are used to simplify the design and make a choice within the UI.
#' 
#' When closed, only the selected item is visible.
#' When users click the drop-down button, all the options become visible.
#' To change the value, users open the list and click another value or use the arrow keys (up and down)
#' to select a new value.
#' When collapsed the user can select a new value by typing.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param placeholder A string that provides a brief hint to the user as to what kind of information is expected in the field.
#' @param value The name of the selected choice.
#' @param values The names of the selected choices. If set, multiple selections will be allowed.
#' @param choices The choices to be presented.
#' @param error Text to be displayed as an error below the text box.
#' @param disabled True if this field is disabled.
#' @param width The width of the combobox, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param trigger True if the choice should be submitted when an item from the dropdown is selected or the textbox value changes.
#' @param required True if this is a required field. Defaults to False.
#' @return A Combobox instance.
#' @export
ui_combobox <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  values = NULL,
  choices = NULL,
  error = NULL,
  disabled = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  trigger = NULL,
  required = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("placeholder", "character", placeholder)
  .guard_scalar("value", "character", value)
  .guard_vector("values", "character", values)
  .guard_vector("choices", "character", choices)
  .guard_scalar("error", "character", error)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("required", "logical", required)
  .o <- list(combobox=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    values=values,
    choices=choices,
    error=error,
    disabled=disabled,
    width=width,
    visible=visible,
    tooltip=tooltip,
    trigger=trigger,
    required=required))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a slider.
#' 
#' A slider is an element used to set a value. It provides a visual indication of adjustable content, as well as the
#' current setting in the total range of content. It is displayed as a horizontal track with options on either side.
#' A knob or lever is dragged to one end or the other to make the choice, indicating the current value.
#' Marks on the slider bar can show values and users can choose where they want to drag the knob or lever to
#' set the value.
#' 
#' A slider is a good choice when you know that users think of the value as a relative quantity, not a numeric value.
#' For example, users think about setting their audio volume to low or medium — not about setting the
#' value to two or five.
#' 
#' The default value of the slider will be zero or be constrained to the min and max values. The min will be returned
#' if the value is set under the min and the max will be returned if set higher than the max value.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param min The minimum value of the slider.
#' @param max The maximum value of the slider.
#' @param step The difference between two adjacent values of the slider.
#' @param value The current value of the slider.
#' @param disabled True if this field is disabled.
#' @param trigger True if the form should be submitted when the slider value changes.
#' @param width The width of the slider, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Slider instance.
#' @export
ui_slider <- function(
  name,
  label = NULL,
  min = NULL,
  max = NULL,
  step = NULL,
  value = NULL,
  disabled = NULL,
  trigger = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("min", "numeric", min)
  .guard_scalar("max", "numeric", max)
  .guard_scalar("step", "numeric", step)
  .guard_scalar("value", "numeric", value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(slider=list(
    name=name,
    label=label,
    min=min,
    max=max,
    step=step,
    value=value,
    disabled=disabled,
    trigger=trigger,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a spinbox.
#' 
#' A spinbox allows the user to incrementally adjust a value in small steps.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param min The minimum value of the spinbox. Defaults to 0.
#' @param max The maximum value of the spinbox. Defaults to 100.
#' @param step The difference between two adjacent values of the spinbox. Defaults to 1.
#' @param value The current value of the spinbox. Defaults to 0.
#' @param disabled True if this field is disabled.
#' @param width The width of the spinbox, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param trigger True if the form should be submitted when the spinbox value changes.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Spinbox instance.
#' @export
ui_spinbox <- function(
  name,
  label = NULL,
  min = NULL,
  max = NULL,
  step = NULL,
  value = NULL,
  disabled = NULL,
  width = NULL,
  visible = NULL,
  trigger = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("min", "numeric", min)
  .guard_scalar("max", "numeric", max)
  .guard_scalar("step", "numeric", step)
  .guard_scalar("value", "numeric", value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(spinbox=list(
    name=name,
    label=label,
    min=min,
    max=max,
    step=step,
    value=value,
    disabled=disabled,
    width=width,
    visible=visible,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a date picker.
#' 
#' A date picker allows a user to pick a date value.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param placeholder A string that provides a brief hint to the user as to what kind of information is expected in the field.
#' @param value The date value in YYYY-MM-DD format.
#' @param disabled True if this field is disabled.
#' @param trigger True if the form should be submitted when the datepicker value changes.
#' @param width The width of the date picker, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param min The minimum allowed date value in YYYY-MM-DD format.
#' @param max The maximum allowed date value in YYYY-MM-DD format.
#' @return A DatePicker instance.
#' @export
ui_date_picker <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  disabled = NULL,
  trigger = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  min = NULL,
  max = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("placeholder", "character", placeholder)
  .guard_scalar("value", "character", value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("min", "character", min)
  .guard_scalar("max", "character", max)
  .o <- list(date_picker=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    disabled=disabled,
    trigger=trigger,
    width=width,
    visible=visible,
    tooltip=tooltip,
    min=min,
    max=max))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a color picker.
#' 
#' A color picker allows a user to pick a color value.
#' If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param value The selected color (CSS-compatible string).
#' @param choices A list of colors (CSS-compatible strings) to limit color choices to.
#' @param width The width of the color picker, e.g. '100px'. Defaults to '300px'.
#' @param alpha True if user should be allowed to pick color transparency. Defaults to True.
#' @param inline True if color picker should be displayed inline (takes less space). Doesn't work with choices specified. Defaults to False.
#' @param visible True if the component should be visible. Defaults to True.
#' @param trigger True if the form should be submitted when the color picker value changes.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A ColorPicker instance.
#' @export
ui_color_picker <- function(
  name,
  label = NULL,
  value = NULL,
  choices = NULL,
  width = NULL,
  alpha = NULL,
  inline = NULL,
  visible = NULL,
  trigger = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "character", value)
  .guard_vector("choices", "character", choices)
  .guard_scalar("width", "character", width)
  .guard_scalar("alpha", "logical", alpha)
  .guard_scalar("inline", "logical", inline)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(color_picker=list(
    name=name,
    label=label,
    value=value,
    choices=choices,
    width=width,
    alpha=alpha,
    inline=inline,
    visible=visible,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a button.
#' 
#' Buttons are best used to enable a user to commit a change or complete steps in a task.
#' They are typically found inside forms, dialogs, panels or pages.
#' An example of their usage is confirming the deletion of a file in a confirmation dialog.
#' 
#' When considering their place in a layout, contemplate the order in which a user will flow through the UI.
#' As an example, in a form, the individual will need to read and interact with the form fields before submitting
#' the form. Therefore, as a general rule, the button should be placed at the bottom of the UI container
#' which holds the related UI elements.
#' 
#' Buttons may be placed within a "buttons" component which will lay out the buttons horizontally, or used
#' individually and they will be stacked vertically.
#' 
#' While buttons can technically be used to navigate a user to another part of the experience, this is not
#' recommended unless that navigation is part of an action or their flow.
#'
#' @param name An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked.
#' @param label The text displayed on the button.
#' @param caption The caption displayed below the label.
#' @param value A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True.
#' @param primary True if the button should be rendered as the primary button in the set.
#' @param disabled True if the button should be disabled.
#' @param link True if the button should be rendered as link text and not a standard button.
#' @param icon An optional icon to display next to the button label (not applicable for links).
#' @param width The width of the button, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param path The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab.
#' @param commands When specified, a split button is rendered with extra actions tied to it within a context menu. Mutually exclusive with `link` attribute.
#' @return A Button instance.
#' @export
ui_button <- function(
  name,
  label = NULL,
  caption = NULL,
  value = NULL,
  primary = NULL,
  disabled = NULL,
  link = NULL,
  icon = NULL,
  width = NULL,
  visible = NULL,
  tooltip = NULL,
  path = NULL,
  commands = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("value", "character", value)
  .guard_scalar("primary", "logical", primary)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("link", "logical", link)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("path", "character", path)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(button=list(
    name=name,
    label=label,
    caption=caption,
    value=value,
    primary=primary,
    disabled=disabled,
    link=link,
    icon=icon,
    width=width,
    visible=visible,
    tooltip=tooltip,
    path=path,
    commands=commands))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a set of buttons laid out horizontally.
#'
#' @param items The buttons in this set.
#' @param justify Specifies how to lay out buttons horizontally.
#'   One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ButtonsJustify.
#' @param name An identifying name for this component.
#' @param width The width of the buttons, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Buttons instance.
#' @export
ui_buttons <- function(
  items,
  justify = NULL,
  name = NULL,
  width = NULL,
  visible = NULL) {
  .guard_vector("items", "WaveComponent", items)
  # TODO Validate justify
  .guard_scalar("name", "character", name)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .o <- list(buttons=list(
    items=items,
    justify=justify,
    name=name,
    width=width,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a mini button - same as regular button, but smaller in size.
#'
#' @param name An identifying name for this component. If the name is prefixed with a '#', the button sets the location hash to the name when clicked.
#' @param label The text displayed on the button.
#' @param icon An optional icon to display next to the button label.
#' @return A MiniButton instance.
#' @export
ui_mini_button <- function(
  name,
  label,
  icon = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("icon", "character", icon)
  .o <- list(mini_button=list(
    name=name,
    label=label,
    icon=icon))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a set of mini buttons laid out horizontally.
#'
#' @param items The buttons in this set.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A MiniButtons instance.
#' @export
ui_mini_buttons <- function(
  items,
  visible = NULL) {
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("visible", "logical", visible)
  .o <- list(mini_buttons=list(
    items=items,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a file upload component.
#' A file upload component allows a user to browse, select and upload one or more files.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed in the bottom button or as a component title when the component is displayed compactly. Defaults to "Upload".
#' @param multiple True if the component should allow multiple files to be uploaded.
#' @param file_extensions List of allowed file extensions, e.g. `pdf`, `docx`, etc.
#' @param max_file_size Maximum allowed size (Mb) per file. No limit by default.
#' @param max_size Maximum allowed size (Mb) for all files combined. No limit by default.
#' @param height The height of the file upload, e.g. '400px', '50%', etc. Defaults to '300px'.
#' @param width The width of the file upload, e.g. '100px'. Defaults to '100%'.
#' @param compact True if the component should be displayed compactly (without drag-and-drop capabilities). Defaults to False.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param required True if this is a required field. Defaults to False.
#' @return A FileUpload instance.
#' @export
ui_file_upload <- function(
  name,
  label = NULL,
  multiple = NULL,
  file_extensions = NULL,
  max_file_size = NULL,
  max_size = NULL,
  height = NULL,
  width = NULL,
  compact = NULL,
  visible = NULL,
  tooltip = NULL,
  required = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("multiple", "logical", multiple)
  .guard_vector("file_extensions", "character", file_extensions)
  .guard_scalar("max_file_size", "numeric", max_file_size)
  .guard_scalar("max_size", "numeric", max_size)
  .guard_scalar("height", "character", height)
  .guard_scalar("width", "character", width)
  .guard_scalar("compact", "logical", compact)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("required", "logical", required)
  .o <- list(file_upload=list(
    name=name,
    label=label,
    multiple=multiple,
    file_extensions=file_extensions,
    max_file_size=max_file_size,
    max_size=max_size,
    height=height,
    width=width,
    compact=compact,
    visible=visible,
    tooltip=tooltip,
    required=required))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a cell type that renders a column's cells as progress bars instead of plain text.
#' If set on a column, the cell value must be between 0.0 and 1.0.
#'
#' @param color Color of the progress arc.
#' @param name An identifying name for this component.
#' @return A ProgressTableCellType instance.
#' @export
ui_progress_table_cell_type <- function(
  color = NULL,
  name = NULL) {
  .guard_scalar("color", "character", color)
  .guard_scalar("name", "character", name)
  .o <- list(progress=list(
    color=color,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableCellType"))
  return(.o)
}

#' Create a cell type that renders a column's cells as icons instead of plain text.
#' If set on a column, the cell value is interpreted as the name of the icon to be displayed.
#'
#' @param color Icon color.
#' @param name An identifying name for this component.
#' @return A IconTableCellType instance.
#' @export
ui_icon_table_cell_type <- function(
  color = NULL,
  name = NULL) {
  .guard_scalar("color", "character", color)
  .guard_scalar("name", "character", name)
  .o <- list(icon=list(
    color=color,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableCellType"))
  return(.o)
}

#' Create a tag.
#'
#' @param label The text displayed within the tag.
#' @param color Tag's background color.
#' @param label_color Tag's label color. If not specified, black or white will be picked based on correct contrast with background.
#' @return A Tag instance.
#' @export
ui_tag <- function(
  label,
  color,
  label_color = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("color", "character", color)
  .guard_scalar("label_color", "character", label_color)
  .o <- list(
    label=label,
    color=color,
    label_color=label_color)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTag"))
  return(.o)
}

#' Creates a collection of tags, usually used for rendering state values.
#' In case of multiple tags per row, make sure the row values are
#' separated by "," within a single cell string.
#' E.g. ui.table_row(name="...", cells=["cell1", "TAG1,TAG2"]).
#' Each value should correspond to a `ui.tag.label` attr.
#' For the example above: [
#' ui.tag(label="TAG1", color="red"),
#' ui.tag(label="TAG2", color="green"),
#' ]
#'
#' @param name An identifying name for this component.
#' @param tags Tags to be rendered.
#' @return A TagTableCellType instance.
#' @export
ui_tag_table_cell_type <- function(
  name,
  tags = NULL) {
  .guard_scalar("name", "character", name)
  .guard_vector("tags", "WaveTag", tags)
  .o <- list(tag=list(
    name=name,
    tags=tags))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableCellType"))
  return(.o)
}

#' Create a cell type that renders command menu.
#' 
#' Commands are typically displayed as context menu items. Useful when you need to provide
#' multiple actions within a single row.
#'
#' @param commands Items to render.
#' @param name An identifying name for this component.
#' @return A MenuTableCellType instance.
#' @export
ui_menu_table_cell_type <- function(
  commands,
  name = NULL) {
  .guard_vector("commands", "WaveCommand", commands)
  .guard_scalar("name", "character", name)
  .o <- list(menu=list(
    commands=commands,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableCellType"))
  return(.o)
}

#' Create a cell type that renders Markdown content.
#'
#' @param name An identifying name for this component.
#' @param target Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab.
#' @return A MarkdownTableCellType instance.
#' @export
ui_markdown_table_cell_type <- function(
  name = NULL,
  target = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("target", "character", target)
  .o <- list(markdown=list(
    name=name,
    target=target))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableCellType"))
  return(.o)
}

#' Create a table column.
#'
#' @param name An identifying name for this column.
#' @param label The text displayed on the column header.
#' @param min_width The minimum width of this column, e.g. '50px'. Only `px` units are supported at this time.
#' @param max_width The maximum width of this column, e.g. '100px'. Only `px` units are supported at this time.
#' @param sortable Indicates whether the column is sortable.
#' @param searchable Indicates whether the contents of this column can be searched through. Enables a search box for the table if true.
#' @param filterable Indicates whether the contents of this column are displayed as filters in a dropdown.
#' @param link Indicates whether each cell in this column should be displayed as a clickable link. Applies to exactly one text column in the table.
#' @param data_type Defines the data type of this column. Time column takes either ISO 8601 date string or unix epoch miliseconds. Defaults to `string`.
#'   One of 'string', 'number', 'time'. See enum h2o_wave.ui.TableColumnDataType.
#' @param cell_type Defines how to render each cell in this column. Renders as plain text by default.
#' @param cell_overflow Defines what to do with a cell's contents in case it does not fit inside the cell.
#'   One of 'tooltip', 'wrap'. See enum h2o_wave.ui.TableColumnCellOverflow.
#' @param filters Explicit list of values to allow filtering by, needed when pagination is set or custom order is needed. Only applicable to filterable columns.
#' @param align Defines how to align values in a column.
#'   One of 'left', 'center', 'right'. See enum h2o_wave.ui.TableColumnAlign.
#' @return A TableColumn instance.
#' @export
ui_table_column <- function(
  name,
  label,
  min_width = NULL,
  max_width = NULL,
  sortable = NULL,
  searchable = NULL,
  filterable = NULL,
  link = NULL,
  data_type = NULL,
  cell_type = NULL,
  cell_overflow = NULL,
  filters = NULL,
  align = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("min_width", "character", min_width)
  .guard_scalar("max_width", "character", max_width)
  .guard_scalar("sortable", "logical", sortable)
  .guard_scalar("searchable", "logical", searchable)
  .guard_scalar("filterable", "logical", filterable)
  .guard_scalar("link", "logical", link)
  # TODO Validate data_type
  .guard_scalar("cell_type", "WaveTableCellType", cell_type)
  # TODO Validate cell_overflow
  .guard_vector("filters", "character", filters)
  # TODO Validate align
  .o <- list(
    name=name,
    label=label,
    min_width=min_width,
    max_width=max_width,
    sortable=sortable,
    searchable=searchable,
    filterable=filterable,
    link=link,
    data_type=data_type,
    cell_type=cell_type,
    cell_overflow=cell_overflow,
    filters=filters,
    align=align)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableColumn"))
  return(.o)
}

#' Create a table row.
#'
#' @param name An identifying name for this row.
#' @param cells The cells in this row (displayed left to right).
#' @return A TableRow instance.
#' @export
ui_table_row <- function(
  name,
  cells) {
  .guard_scalar("name", "character", name)
  .guard_vector("cells", "character", cells)
  .o <- list(
    name=name,
    cells=cells)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableRow"))
  return(.o)
}

#' Make rows within the table collapsible/expandable.
#' 
#' This type of table is best used for cases when your data makes sense to be presented in chunks rather than a single flat list.
#'
#' @param label The title of the group.
#' @param rows The rows in this group.
#' @param collapsed Indicates whether the table group should be collapsed by default. Defaults to True.
#' @return A TableGroup instance.
#' @export
ui_table_group <- function(
  label,
  rows,
  collapsed = NULL) {
  .guard_scalar("label", "character", label)
  .guard_vector("rows", "WaveTableRow", rows)
  .guard_scalar("collapsed", "logical", collapsed)
  .o <- list(
    label=label,
    rows=rows,
    collapsed=collapsed)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTableGroup"))
  return(.o)
}

#' Configure table pagination. Use as `pagination` parameter to `ui.table()`
#'
#' @param total_rows Total count of all the rows in your dataset.
#' @param rows_per_page The maximum amount of rows to be displayed in a single page.
#' @return A TablePagination instance.
#' @export
ui_table_pagination <- function(
  total_rows,
  rows_per_page) {
  .guard_scalar("total_rows", "numeric", total_rows)
  .guard_scalar("rows_per_page", "numeric", rows_per_page)
  .o <- list(
    total_rows=total_rows,
    rows_per_page=rows_per_page)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTablePagination"))
  return(.o)
}

#' Create an interactive table.
#' 
#' This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
#' display a non-interactive table of information, use a markdown table.
#' 
#' If `multiple` is set to False (default), each row in the table is clickable. When a cell in the column with `link=True`
#' (defaults to first column) is clicked or the row is doubleclicked, the form is
#' submitted automatically, and `q.args.table_name` is set to `[row_name]`, where `table_name` is the `name` of
#' the table, and `row_name` is the `name` of the row that was clicked on.
#' 
#' If `multiple` is set to True, each row in the table is selectable. A row can be selected by clicking on it.
#' Multiple rows can be selected either by shift+clicking or using marquee selection. When the form is submitted,
#' `q.args.table_name` is set to `[row1_name, row2_name, ...]` where `table_name` is the `name` of the table,
#' and `row1_name`, `row2_name` are the `name` of the rows that were selected. Note that if `multiple` is
#' set to True, the form is not submitted automatically, and one or more buttons are required in the form to trigger
#' submission.
#' 
#' If `pagination` is set, you have to handle search/filter/sort/download/page_change/reset events yourself since
#' none of these features will work automatically like in non-paginated table.
#'
#' @param name An identifying name for this component.
#' @param columns The columns in this table.
#' @param rows The rows in this table. Mutually exclusive with `groups` attr.
#' @param multiple True to allow multiple rows to be selected. Mutually exclusive with `single` attr.
#' @param groupable True to allow group by feature.
#' @param downloadable Indicates whether the table rows can be downloaded as a CSV file. Defaults to False.
#' @param resettable Indicates whether a Reset button should be displayed to reset search / filter / group-by values to their defaults. Defaults to False.
#' @param height The height of the table in px (e.g. '200px') or '1' to fill the remaining card space.
#' @param width The width of the table, e.g. '100px'. Defaults to '100%'.
#' @param values The names of the selected rows. If this parameter is set, multiple selections will be allowed (`multiple` is assumed to be `True`).
#' @param checkbox_visibility Controls visibility of table rows when `multiple` is set to `True`. Defaults to 'on-hover'.
#'   One of 'always', 'on-hover', 'hidden'. See enum h2o_wave.ui.TableCheckboxVisibility.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param groups Creates collapsible / expandable groups of data rows. Mutually exclusive with `rows` attr.
#' @param pagination Display a pagination control at the bottom of the table. Set this value using `ui.table_pagination()`.
#' @param events The events to capture on this table when pagination is set. One of 'search' | 'sort' | 'filter' | 'download' | 'page_change' | 'reset' | 'select'.
#' @param single True to allow only one row to be selected at time. Mutually exclusive with `multiple` attr.
#' @param value The name of the selected row. If this parameter is set, single selection will be allowed (`single` is assumed to be `True`).
#' @return A Table instance.
#' @export
ui_table <- function(
  name,
  columns,
  rows = NULL,
  multiple = NULL,
  groupable = NULL,
  downloadable = NULL,
  resettable = NULL,
  height = NULL,
  width = NULL,
  values = NULL,
  checkbox_visibility = NULL,
  visible = NULL,
  tooltip = NULL,
  groups = NULL,
  pagination = NULL,
  events = NULL,
  single = NULL,
  value = NULL) {
  .guard_scalar("name", "character", name)
  .guard_vector("columns", "WaveTableColumn", columns)
  .guard_vector("rows", "WaveTableRow", rows)
  .guard_scalar("multiple", "logical", multiple)
  .guard_scalar("groupable", "logical", groupable)
  .guard_scalar("downloadable", "logical", downloadable)
  .guard_scalar("resettable", "logical", resettable)
  .guard_scalar("height", "character", height)
  .guard_scalar("width", "character", width)
  .guard_vector("values", "character", values)
  # TODO Validate checkbox_visibility
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_vector("groups", "WaveTableGroup", groups)
  .guard_scalar("pagination", "WaveTablePagination", pagination)
  .guard_vector("events", "character", events)
  .guard_scalar("single", "logical", single)
  .guard_scalar("value", "character", value)
  .o <- list(table=list(
    name=name,
    columns=columns,
    rows=rows,
    multiple=multiple,
    groupable=groupable,
    downloadable=downloadable,
    resettable=resettable,
    height=height,
    width=width,
    values=values,
    checkbox_visibility=checkbox_visibility,
    visible=visible,
    tooltip=tooltip,
    groups=groups,
    pagination=pagination,
    events=events,
    single=single,
    value=value))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a hyperlink.
#' 
#' Hyperlinks can be internal or external.
#' Internal hyperlinks have paths that begin with a `/` and point to URLs within the Wave UI.
#' All other kinds of paths are treated as external hyperlinks.
#'
#' @param label The text to be displayed. If blank, the `path` is used as the label.
#' @param path The path or URL to link to.
#' @param disabled True if the link should be disabled.
#' @param download True if the link should prompt the user to save the linked URL instead of navigating to it.
#' @param button True if the link should be rendered as a button.
#' @param width The width of the link, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param target Where to display the link. An empty string or `'_blank'` opens the link in a new tab. `_self` opens in the current tab.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @param name An identifying name for this component.
#' @return A Link instance.
#' @export
ui_link <- function(
  label = NULL,
  path = NULL,
  disabled = NULL,
  download = NULL,
  button = NULL,
  width = NULL,
  visible = NULL,
  target = NULL,
  tooltip = NULL,
  name = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("path", "character", path)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("download", "logical", download)
  .guard_scalar("button", "logical", button)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("target", "character", target)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("name", "character", name)
  .o <- list(link=list(
    label=label,
    path=path,
    disabled=disabled,
    download=download,
    button=button,
    width=width,
    visible=visible,
    target=target,
    tooltip=tooltip,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a collection of links.
#'
#' @param items The links contained in this group.
#' @param label The name of the link group.
#' @param inline Render links horizontally. Defaults to False.
#' @param width The width of the links, e.g. '100px'.
#' @return A Links instance.
#' @export
ui_links <- function(
  items,
  label = NULL,
  inline = NULL,
  width = NULL) {
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("label", "character", label)
  .guard_scalar("inline", "logical", inline)
  .guard_scalar("width", "character", width)
  .o <- list(links=list(
    items=items,
    label=label,
    inline=inline,
    width=width))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a tab.
#'
#' @param name An identifying name for this component.
#' @param label The text displayed on the tab.
#' @param icon The icon displayed on the tab.
#' @return A Tab instance.
#' @export
ui_tab <- function(
  name,
  label = NULL,
  icon = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("icon", "character", icon)
  .o <- list(
    name=name,
    label=label,
    icon=icon)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTab"))
  return(.o)
}

#' Create a tab bar.
#'
#' @param name An identifying name for this component.
#' @param value The name of the tab to select initially.
#' @param items The tabs in this tab bar.
#' @param width The width of the tabs, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param link True if tabs should be rendered as links instead of buttons.
#' @return A Tabs instance.
#' @export
ui_tabs <- function(
  name,
  value = NULL,
  items = NULL,
  width = NULL,
  visible = NULL,
  link = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("value", "character", value)
  .guard_vector("items", "WaveTab", items)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("link", "logical", link)
  .o <- list(tabs=list(
    name=name,
    value=value,
    items=items,
    width=width,
    visible=visible,
    link=link))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Creates a new expander.
#' 
#' Expanders can be used to show or hide a group of related components.
#'
#' @param name An identifying name for this component.
#' @param label The text displayed on the expander.
#' @param expanded True if expanded, False if collapsed.
#' @param items List of components to be hideable by the expander.
#' @param width The width of the expander, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Expander instance.
#' @export
ui_expander <- function(
  name,
  label = NULL,
  expanded = NULL,
  items = NULL,
  width = NULL,
  visible = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("expanded", "logical", expanded)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .o <- list(expander=list(
    name=name,
    label=label,
    expanded=expanded,
    items=items,
    width=width,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a new inline frame (an `iframe`).
#'
#' @param path The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
#' @param content The HTML content of the page. A string containing `<html>...</html>`.
#' @param width The width of the frame, e.g. `200px`, `50%`, etc. Defaults to '100%'.
#' @param height The height of the frame, e.g. `200px`, `50%`, etc. Defaults to '150px'.
#' @param name An identifying name for this component.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Frame instance.
#' @export
ui_frame <- function(
  path = NULL,
  content = NULL,
  width = NULL,
  height = NULL,
  name = NULL,
  visible = NULL) {
  .guard_scalar("path", "character", path)
  .guard_scalar("content", "character", content)
  .guard_scalar("width", "character", width)
  .guard_scalar("height", "character", height)
  .guard_scalar("name", "character", name)
  .guard_scalar("visible", "logical", visible)
  .o <- list(frame=list(
    path=path,
    content=content,
    width=width,
    height=height,
    name=name,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Render HTML content.
#'
#' @param content The HTML content.
#' @param name An identifying name for this component.
#' @param width The width of the markup, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Markup instance.
#' @export
ui_markup <- function(
  content,
  name = NULL,
  width = NULL,
  visible = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("name", "character", name)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .o <- list(markup=list(
    content=content,
    name=name,
    width=width,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Render dynamic content using an HTML template.
#'
#' @param content The Handlebars template. https://handlebarsjs.com/guide/
#' @param data Data for the Handlebars template
#' @param name An identifying name for this component.
#' @param width The width of the template, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @return A Template instance.
#' @export
ui_template <- function(
  content,
  data = NULL,
  name = NULL,
  width = NULL,
  visible = NULL) {
  .guard_scalar("content", "character", content)
  # TODO Validate data: Rec
  .guard_scalar("name", "character", name)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .o <- list(template=list(
    content=content,
    data=data,
    name=name,
    width=width,
    visible=visible))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a picker.
#' Pickers are used to select one or more choices, such as tags or files, from a list.
#' Use a picker to allow the user to quickly search for or manage a few tags or files.
#'
#' @param name An identifying name for this component.
#' @param choices The choices to be presented.
#' @param label Text to be displayed above the component.
#' @param values The names of the selected choices.
#' @param max_choices Maximum number of selectable choices.
#' @param required True if the picker is a required field.
#' @param disabled Controls whether the picker should be disabled or not.
#' @param width The width of the picker, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param trigger True if the form should be submitted when the picker value changes.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Picker instance.
#' @export
ui_picker <- function(
  name,
  choices,
  label = NULL,
  values = NULL,
  max_choices = NULL,
  required = NULL,
  disabled = NULL,
  width = NULL,
  visible = NULL,
  trigger = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_vector("choices", "WaveChoice", choices)
  .guard_scalar("label", "character", label)
  .guard_vector("values", "character", values)
  .guard_scalar("max_choices", "numeric", max_choices)
  .guard_scalar("required", "logical", required)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(picker=list(
    name=name,
    choices=choices,
    label=label,
    values=values,
    max_choices=max_choices,
    required=required,
    disabled=disabled,
    width=width,
    visible=visible,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a range slider.
#' 
#' A range slider is an element used to select a value range. It provides a visual indication of adjustable content, as well as the
#' current setting in the total range of content. It is displayed as a horizontal track with options on either side.
#' Knobs or levers are dragged to one end or the other to make the choice, indicating the current max and min value.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param min The minimum value of the slider. Defaults to 0.
#' @param max The maximum value of the slider. Defaults to 100.
#' @param step The difference between two adjacent values of the slider.
#' @param min_value The lower bound of the selected range.
#' @param max_value The upper bound of the selected range. Default value is `max`.
#' @param disabled True if this field is disabled.
#' @param width The width of the range slider, e.g. '100px'. Defaults to '100%'.
#' @param trigger True if the form should be submitted when the slider value changes.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A RangeSlider instance.
#' @export
ui_range_slider <- function(
  name,
  label = NULL,
  min = NULL,
  max = NULL,
  step = NULL,
  min_value = NULL,
  max_value = NULL,
  disabled = NULL,
  width = NULL,
  trigger = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("min", "numeric", min)
  .guard_scalar("max", "numeric", max)
  .guard_scalar("step", "numeric", step)
  .guard_scalar("min_value", "numeric", min_value)
  .guard_scalar("max_value", "numeric", max_value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(range_slider=list(
    name=name,
    label=label,
    min=min,
    max=max,
    step=step,
    min_value=min_value,
    max_value=max_value,
    disabled=disabled,
    width=width,
    trigger=trigger,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a step for a stepper.
#'
#' @param label Text displayed below icon.
#' @param icon Icon to be displayed.
#' @param done Indicates whether this step has already been completed.
#' @return A Step instance.
#' @export
ui_step <- function(
  label,
  icon = NULL,
  done = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("done", "logical", done)
  .o <- list(
    label=label,
    icon=icon,
    done=done)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStep"))
  return(.o)
}

#' Create a component that displays a sequence of steps in a process.
#' The steps keep users informed about where they are in the process and how much is left to complete.
#'
#' @param name An identifying name for this component.
#' @param items The sequence of steps to be displayed.
#' @param width The width of the stepper, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Stepper instance.
#' @export
ui_stepper <- function(
  name,
  items,
  width = NULL,
  visible = NULL,
  tooltip = NULL) {
  .guard_scalar("name", "character", name)
  .guard_vector("items", "WaveStep", items)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("tooltip", "character", tooltip)
  .o <- list(stepper=list(
    name=name,
    items=items,
    width=width,
    visible=visible,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
#' A plot can contain multiple such layers of marks.
#'
#' @param coord Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`.
#'   One of 'rect', 'cartesian', 'polar', 'theta', 'helix'. See enum h2o_wave.ui.MarkCoord.
#' @param type Graphical geometry.
#'   One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'. See enum h2o_wave.ui.MarkType.
#' @param x X field or value.
#' @param x0 X base field or value.
#' @param x1 X bin lower bound field or value. For histograms and box plots.
#' @param x2 X bin upper bound field or value. For histograms and box plots.
#' @param x_q1 X lower quartile. For box plots.
#' @param x_q2 X median. For box plots.
#' @param x_q3 X upper quartile. For box plots.
#' @param x_min X axis scale minimum.
#' @param x_max X axis scale maximum.
#' @param x_nice Whether to nice X axis scale ticks.
#' @param x_scale X axis scale type.
#'   One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkXScale.
#' @param x_title X axis title.
#' @param y Y field or value.
#' @param y0 Y base field or value.
#' @param y1 Y bin lower bound field or value. For histograms and box plots.
#' @param y2 Y bin upper bound field or value. For histograms and box plots.
#' @param y_q1 Y lower quartile. For box plots.
#' @param y_q2 Y median. For box plots.
#' @param y_q3 Y upper quartile. For box plots.
#' @param y_min Y axis scale minimum.
#' @param y_max Y axis scale maximum.
#' @param y_nice Whether to nice Y axis scale ticks.
#' @param y_scale Y axis scale type.
#'   One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'power', 'time', 'time-category', 'quantize', 'quantile'. See enum h2o_wave.ui.MarkYScale.
#' @param y_title Y axis title.
#' @param color Mark color field or value.
#' @param color_range Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`
#' @param color_domain The unique values in the data (labels or categories or classes) to map colors to, e.g. `['high', 'medium', 'low']`. If this is not provided, the unique values are automatically inferred from the `color` attribute.
#' @param shape Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'.
#' @param shape_range Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`
#' @param size Mark size field or value.
#' @param size_range Mark size range. A string containing space-separated integers, e.g. `'4 30'`
#' @param stack Field to stack marks by, or 'auto' to infer.
#' @param dodge Field to dodge marks by, or 'auto' to infer.
#' @param curve Curve type for `line` and `area` mark types.
#'   One of 'none', 'smooth', 'step-before', 'step', 'step-after'. See enum h2o_wave.ui.MarkCurve.
#' @param fill_color Mark fill color.
#' @param fill_opacity Mark fill opacity.
#' @param stroke_color Mark stroke color.
#' @param stroke_opacity Mark stroke opacity.
#' @param stroke_size Mark stroke size.
#' @param stroke_dash Mark stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
#' @param label Label field or value.
#' @param label_offset Distance between label and mark.
#' @param label_offset_x Horizontal distance between label and mark.
#' @param label_offset_y Vertical distance between label and mark.
#' @param label_rotation Label rotation angle, in degrees, or 'none' to disable automatic rotation. The default behavior is 'auto' for automatic rotation.
#' @param label_position Label position relative to the mark.
#'   One of 'top', 'bottom', 'middle', 'left', 'right'. See enum h2o_wave.ui.MarkLabelPosition.
#' @param label_overlap Strategy to use if labels overlap.
#'   One of 'hide', 'overlap', 'constrain'. See enum h2o_wave.ui.MarkLabelOverlap.
#' @param label_fill_color Label fill color.
#' @param label_fill_opacity Label fill opacity.
#' @param label_stroke_color Label stroke color.
#' @param label_stroke_opacity Label stroke opacity.
#' @param label_stroke_size Label stroke size (line width or pen thickness).
#' @param label_font_size Label font size.
#' @param label_font_weight Label font weight.
#' @param label_line_height Label line height.
#' @param label_align Label text alignment.
#'   One of 'left', 'right', 'center', 'start', 'end'. See enum h2o_wave.ui.MarkLabelAlign.
#' @param ref_stroke_color Reference line stroke color.
#' @param ref_stroke_opacity Reference line stroke opacity.
#' @param ref_stroke_size Reference line stroke size (line width or pen thickness).
#' @param ref_stroke_dash Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
#' @param interactive Defines whether to raise events on interactions with the mark. Defaults to True.
#' @return A Mark instance.
#' @export
ui_mark <- function(
  coord = NULL,
  type = NULL,
  x = NULL,
  x0 = NULL,
  x1 = NULL,
  x2 = NULL,
  x_q1 = NULL,
  x_q2 = NULL,
  x_q3 = NULL,
  x_min = NULL,
  x_max = NULL,
  x_nice = NULL,
  x_scale = NULL,
  x_title = NULL,
  y = NULL,
  y0 = NULL,
  y1 = NULL,
  y2 = NULL,
  y_q1 = NULL,
  y_q2 = NULL,
  y_q3 = NULL,
  y_min = NULL,
  y_max = NULL,
  y_nice = NULL,
  y_scale = NULL,
  y_title = NULL,
  color = NULL,
  color_range = NULL,
  color_domain = NULL,
  shape = NULL,
  shape_range = NULL,
  size = NULL,
  size_range = NULL,
  stack = NULL,
  dodge = NULL,
  curve = NULL,
  fill_color = NULL,
  fill_opacity = NULL,
  stroke_color = NULL,
  stroke_opacity = NULL,
  stroke_size = NULL,
  stroke_dash = NULL,
  label = NULL,
  label_offset = NULL,
  label_offset_x = NULL,
  label_offset_y = NULL,
  label_rotation = NULL,
  label_position = NULL,
  label_overlap = NULL,
  label_fill_color = NULL,
  label_fill_opacity = NULL,
  label_stroke_color = NULL,
  label_stroke_opacity = NULL,
  label_stroke_size = NULL,
  label_font_size = NULL,
  label_font_weight = NULL,
  label_line_height = NULL,
  label_align = NULL,
  ref_stroke_color = NULL,
  ref_stroke_opacity = NULL,
  ref_stroke_size = NULL,
  ref_stroke_dash = NULL,
  interactive = NULL) {
  # TODO Validate coord
  # TODO Validate type
  # TODO Validate x: V
  # TODO Validate x0: V
  # TODO Validate x1: V
  # TODO Validate x2: V
  # TODO Validate x_q1: V
  # TODO Validate x_q2: V
  # TODO Validate x_q3: V
  .guard_scalar("x_min", "numeric", x_min)
  .guard_scalar("x_max", "numeric", x_max)
  .guard_scalar("x_nice", "logical", x_nice)
  # TODO Validate x_scale
  .guard_scalar("x_title", "character", x_title)
  # TODO Validate y: V
  # TODO Validate y0: V
  # TODO Validate y1: V
  # TODO Validate y2: V
  # TODO Validate y_q1: V
  # TODO Validate y_q2: V
  # TODO Validate y_q3: V
  .guard_scalar("y_min", "numeric", y_min)
  .guard_scalar("y_max", "numeric", y_max)
  .guard_scalar("y_nice", "logical", y_nice)
  # TODO Validate y_scale
  .guard_scalar("y_title", "character", y_title)
  .guard_scalar("color", "character", color)
  .guard_scalar("color_range", "character", color_range)
  .guard_vector("color_domain", "character", color_domain)
  .guard_scalar("shape", "character", shape)
  .guard_scalar("shape_range", "character", shape_range)
  # TODO Validate size: V
  .guard_scalar("size_range", "character", size_range)
  .guard_scalar("stack", "character", stack)
  .guard_scalar("dodge", "character", dodge)
  # TODO Validate curve
  .guard_scalar("fill_color", "character", fill_color)
  .guard_scalar("fill_opacity", "numeric", fill_opacity)
  .guard_scalar("stroke_color", "character", stroke_color)
  .guard_scalar("stroke_opacity", "numeric", stroke_opacity)
  .guard_scalar("stroke_size", "numeric", stroke_size)
  .guard_scalar("stroke_dash", "character", stroke_dash)
  .guard_scalar("label", "character", label)
  .guard_scalar("label_offset", "numeric", label_offset)
  .guard_scalar("label_offset_x", "numeric", label_offset_x)
  .guard_scalar("label_offset_y", "numeric", label_offset_y)
  .guard_scalar("label_rotation", "character", label_rotation)
  # TODO Validate label_position
  # TODO Validate label_overlap
  .guard_scalar("label_fill_color", "character", label_fill_color)
  .guard_scalar("label_fill_opacity", "numeric", label_fill_opacity)
  .guard_scalar("label_stroke_color", "character", label_stroke_color)
  .guard_scalar("label_stroke_opacity", "numeric", label_stroke_opacity)
  .guard_scalar("label_stroke_size", "numeric", label_stroke_size)
  .guard_scalar("label_font_size", "numeric", label_font_size)
  .guard_scalar("label_font_weight", "character", label_font_weight)
  .guard_scalar("label_line_height", "numeric", label_line_height)
  # TODO Validate label_align
  .guard_scalar("ref_stroke_color", "character", ref_stroke_color)
  .guard_scalar("ref_stroke_opacity", "numeric", ref_stroke_opacity)
  .guard_scalar("ref_stroke_size", "numeric", ref_stroke_size)
  .guard_scalar("ref_stroke_dash", "character", ref_stroke_dash)
  .guard_scalar("interactive", "logical", interactive)
  .o <- list(
    coord=coord,
    type=type,
    x=x,
    x0=x0,
    x1=x1,
    x2=x2,
    x_q1=x_q1,
    x_q2=x_q2,
    x_q3=x_q3,
    x_min=x_min,
    x_max=x_max,
    x_nice=x_nice,
    x_scale=x_scale,
    x_title=x_title,
    y=y,
    y0=y0,
    y1=y1,
    y2=y2,
    y_q1=y_q1,
    y_q2=y_q2,
    y_q3=y_q3,
    y_min=y_min,
    y_max=y_max,
    y_nice=y_nice,
    y_scale=y_scale,
    y_title=y_title,
    color=color,
    color_range=color_range,
    color_domain=color_domain,
    shape=shape,
    shape_range=shape_range,
    size=size,
    size_range=size_range,
    stack=stack,
    dodge=dodge,
    curve=curve,
    fill_color=fill_color,
    fill_opacity=fill_opacity,
    stroke_color=stroke_color,
    stroke_opacity=stroke_opacity,
    stroke_size=stroke_size,
    stroke_dash=stroke_dash,
    label=label,
    label_offset=label_offset,
    label_offset_x=label_offset_x,
    label_offset_y=label_offset_y,
    label_rotation=label_rotation,
    label_position=label_position,
    label_overlap=label_overlap,
    label_fill_color=label_fill_color,
    label_fill_opacity=label_fill_opacity,
    label_stroke_color=label_stroke_color,
    label_stroke_opacity=label_stroke_opacity,
    label_stroke_size=label_stroke_size,
    label_font_size=label_font_size,
    label_font_weight=label_font_weight,
    label_line_height=label_line_height,
    label_align=label_align,
    ref_stroke_color=ref_stroke_color,
    ref_stroke_opacity=ref_stroke_opacity,
    ref_stroke_size=ref_stroke_size,
    ref_stroke_dash=ref_stroke_dash,
    interactive=interactive)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveMark"))
  return(.o)
}

#' Create a plot. A plot is composed of one or more graphical mark layers.
#'
#' @param marks The graphical mark layers contained in this plot.
#' @return A Plot instance.
#' @export
ui_plot <- function(
  marks) {
  .guard_vector("marks", "WaveMark", marks)
  .o <- list(
    marks=marks)
  class(.o) <- append(class(.o), c(.wave_obj, "WavePlot"))
  return(.o)
}

#' Create a visualization for display inside a form.
#'
#' @param plot The plot to be rendered in this visualization.
#' @param data Data for this visualization.
#' @param width The width of the visualization. Defaults to '100%'.
#' @param height The hight of the visualization. Defaults to '300px'.
#' @param name An identifying name for this component.
#' @param visible True if the component should be visible. Defaults to True.
#' @param events The events to capture on this visualization. One of 'select_marks'.
#' @param interactions The interactions to be allowed for this plot. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event.
#' @param animate EXPERIMENTAL: True to turn on the chart animations. Defaults to False.
#' @return A Visualization instance.
#' @export
ui_visualization <- function(
  plot,
  data,
  width = NULL,
  height = NULL,
  name = NULL,
  visible = NULL,
  events = NULL,
  interactions = NULL,
  animate = NULL) {
  .guard_scalar("plot", "WavePlot", plot)
  # TODO Validate data: Rec
  .guard_scalar("width", "character", width)
  .guard_scalar("height", "character", height)
  .guard_scalar("name", "character", name)
  .guard_scalar("visible", "logical", visible)
  .guard_vector("events", "character", events)
  .guard_vector("interactions", "character", interactions)
  .guard_scalar("animate", "logical", animate)
  .o <- list(visualization=list(
    plot=plot,
    data=data,
    width=width,
    height=height,
    name=name,
    visible=visible,
    events=events,
    interactions=interactions,
    animate=animate))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a Vega-lite plot for display inside a form.
#'
#' @param specification The Vega-lite specification.
#' @param data Data for the plot, if any.
#' @param width The width of the visualization. Defaults to '100%'.
#' @param height The height of the visualization. Defaults to '300px'.
#' @param name An identifying name for this component.
#' @param visible True if the component should be visible. Defaults to True.
#' @param grammar Vega grammar to use. Defaults to 'vega-lite'.
#'   One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaVisualizationGrammar.
#' @return A VegaVisualization instance.
#' @export
ui_vega_visualization <- function(
  specification,
  data = NULL,
  width = NULL,
  height = NULL,
  name = NULL,
  visible = NULL,
  grammar = NULL) {
  .guard_scalar("specification", "character", specification)
  # TODO Validate data: Rec
  .guard_scalar("width", "character", width)
  .guard_scalar("height", "character", height)
  .guard_scalar("name", "character", name)
  .guard_scalar("visible", "logical", visible)
  # TODO Validate grammar
  .o <- list(vega_visualization=list(
    specification=specification,
    data=data,
    width=width,
    height=height,
    name=name,
    visible=visible,
    grammar=grammar))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a stat (a label-value pair) for displaying a metric.
#'
#' @param label The label for the metric.
#' @param value The value of the metric.
#' @param caption The caption displayed below the primary value.
#' @param icon An optional icon, displayed next to the label.
#' @param icon_color The color of the icon.
#' @param name An identifying name for this item.
#' @return A Stat instance.
#' @export
ui_stat <- function(
  label,
  value = NULL,
  caption = NULL,
  icon = NULL,
  icon_color = NULL,
  name = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "character", value)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("icon_color", "character", icon_color)
  .guard_scalar("name", "character", name)
  .o <- list(
    label=label,
    value=value,
    caption=caption,
    icon=icon,
    icon_color=icon_color,
    name=name)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStat"))
  return(.o)
}

#' Create a set of stats laid out horizontally.
#'
#' @param items The individual stats to be displayed.
#' @param justify Specifies how to lay out the individual stats. Defaults to 'start'.
#'   One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.StatsJustify.
#' @param inset Whether to display the stats with a contrasting background.
#' @param width The width of the stats, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param name An identifying name for this component.
#' @return A Stats instance.
#' @export
ui_stats <- function(
  items,
  justify = NULL,
  inset = NULL,
  width = NULL,
  visible = NULL,
  name = NULL) {
  .guard_vector("items", "WaveStat", items)
  # TODO Validate justify
  .guard_scalar("inset", "logical", inset)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("name", "character", name)
  .o <- list(stats=list(
    items=items,
    justify=justify,
    inset=inset,
    width=width,
    visible=visible,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create an inline (horizontal) list of components.
#'
#' @param items The components laid out inline.
#' @param justify Specifies how to lay out the individual components. Defaults to 'start'.
#'   One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.InlineJustify.
#' @param align Specifies how the individual components are aligned on the vertical axis. Defaults to 'center'.
#'   One of 'start', 'end', 'center', 'baseline'. See enum h2o_wave.ui.InlineAlign.
#' @param inset Whether to display the components inset from the parent form, with a contrasting background.
#' @param height Height of the inline container. Accepts any valid CSS unit e.g. '100vh', '300px'. Use '1' to fill the remaining card space.
#' @param direction Container direction. Defaults to 'row'.
#'   One of 'row', 'column'. See enum h2o_wave.ui.InlineDirection.
#' @return A Inline instance.
#' @export
ui_inline <- function(
  items,
  justify = NULL,
  align = NULL,
  inset = NULL,
  height = NULL,
  direction = NULL) {
  .guard_vector("items", "WaveComponent", items)
  # TODO Validate justify
  # TODO Validate align
  .guard_scalar("inset", "logical", inset)
  .guard_scalar("height", "character", height)
  # TODO Validate direction
  .o <- list(inline=list(
    items=items,
    justify=justify,
    align=align,
    inset=inset,
    height=height,
    direction=direction))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create an image.
#'
#' @param title The image title, typically displayed as a tooltip.
#' @param type The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`. Required only if `image` is set.
#' @param image Image data, base64-encoded.
#' @param path The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`.
#' @param width The width of the image, e.g. '100px'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param path_popup The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property.
#' @return A Image instance.
#' @export
ui_image <- function(
  title,
  type = NULL,
  image = NULL,
  path = NULL,
  width = NULL,
  visible = NULL,
  path_popup = NULL) {
  .guard_scalar("title", "character", title)
  .guard_scalar("type", "character", type)
  .guard_scalar("image", "character", image)
  .guard_scalar("path", "character", path)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("path_popup", "character", path_popup)
  .o <- list(image=list(
    title=title,
    type=type,
    image=image,
    path=path,
    width=width,
    visible=visible,
    path_popup=path_popup))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create an individual's persona or avatar, a visual representation of a person across products.
#' Can be used to display an individual's avatar (or a composition of the person’s initials on a background color), their name or identification, and online status.
#'
#' @param title Primary text, displayed next to the persona coin.
#' @param subtitle Secondary text, displayed under the title.
#' @param caption Tertiary text, displayed under the subtitle. Only visible for sizes >= 'm'.
#' @param size The size of the persona coin. Defaults to 'm'.
#'   One of 'xl', 'l', 'm', 's', 'xs'. See enum h2o_wave.ui.PersonaSize.
#' @param image Image, URL or base64-encoded (`data:image/png;base64,???`).
#' @param initials Initials, if `image` is not specified.
#' @param initials_color Initials background color (CSS-compatible string).
#' @param name An identifying name for this component.
#' @return A Persona instance.
#' @export
ui_persona <- function(
  title,
  subtitle = NULL,
  caption = NULL,
  size = NULL,
  image = NULL,
  initials = NULL,
  initials_color = NULL,
  name = NULL) {
  .guard_scalar("title", "character", title)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_scalar("caption", "character", caption)
  # TODO Validate size
  .guard_scalar("image", "character", image)
  .guard_scalar("initials", "character", initials)
  .guard_scalar("initials_color", "character", initials_color)
  .guard_scalar("name", "character", name)
  .o <- list(persona=list(
    title=title,
    subtitle=subtitle,
    caption=caption,
    size=size,
    image=image,
    initials=initials,
    initials_color=initials_color,
    name=name))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a tag.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed for this tag.
#' @param color HEX or RGB color string used as background for highlighted phrases.
#' @return A TextAnnotatorTag instance.
#' @export
ui_text_annotator_tag <- function(
  name,
  label,
  color) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("color", "character", color)
  .o <- list(
    name=name,
    label=label,
    color=color)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTextAnnotatorTag"))
  return(.o)
}

#' Create an annotator item with initial selected tags or no tag for plaintext.
#'
#' @param text Text to be highlighted.
#' @param tag The `name` of the text annotator tag to refer to for the `label` and `color` of this item.
#' @return A TextAnnotatorItem instance.
#' @export
ui_text_annotator_item <- function(
  text,
  tag = NULL) {
  .guard_scalar("text", "character", text)
  .guard_scalar("tag", "character", tag)
  .o <- list(
    text=text,
    tag=tag)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTextAnnotatorItem"))
  return(.o)
}

#' Create a text annotator component.
#' 
#' The text annotator component enables user to manually annotate parts of text. Useful for NLP data prep.
#'
#' @param name An identifying name for this component.
#' @param title The text annotator's title.
#' @param tags List of tags the user can annotate with.
#' @param items Pretagged parts of text content.
#' @param trigger True if the form should be submitted when the annotator value changes.
#' @param readonly True to prevent user interaction with the annotator component. Defaults to False.
#' @return A TextAnnotator instance.
#' @export
ui_text_annotator <- function(
  name,
  title,
  tags,
  items,
  trigger = NULL,
  readonly = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("title", "character", title)
  .guard_vector("tags", "WaveTextAnnotatorTag", tags)
  .guard_vector("items", "WaveTextAnnotatorItem", items)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("readonly", "logical", readonly)
  .o <- list(text_annotator=list(
    name=name,
    title=title,
    tags=tags,
    items=items,
    trigger=trigger,
    readonly=readonly))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a unique tag type for use in an image annotator.
#'
#' @param name An identifying name for this tag.
#' @param label Text to be displayed for the annotation.
#' @param color Hex or RGB color string to be used as the background color.
#' @return A ImageAnnotatorTag instance.
#' @export
ui_image_annotator_tag <- function(
  name,
  label,
  color) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("color", "character", color)
  .o <- list(
    name=name,
    label=label,
    color=color)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageAnnotatorTag"))
  return(.o)
}

#' Create a rectangular annotation shape.
#'
#' @param x1 `x` coordinate of the rectangle's corner.
#' @param y1 `y` coordinate of the rectangle's corner.
#' @param x2 `x` coordinate of the diagonally opposite corner.
#' @param y2 `y` coordinate of the diagonally opposite corner.
#' @return A ImageAnnotatorRect instance.
#' @export
ui_image_annotator_rect <- function(
  x1,
  y1,
  x2,
  y2) {
  .guard_scalar("x1", "numeric", x1)
  .guard_scalar("y1", "numeric", y1)
  .guard_scalar("x2", "numeric", x2)
  .guard_scalar("y2", "numeric", y2)
  .o <- list(rect=list(
    x1=x1,
    y1=y1,
    x2=x2,
    y2=y2))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageAnnotatorShape"))
  return(.o)
}

#' Create a polygon annotation point with x and y coordinates..
#'
#' @param x `x` coordinate of the point.
#' @param y `y` coordinate of the point.
#' @return A ImageAnnotatorPoint instance.
#' @export
ui_image_annotator_point <- function(
  x,
  y) {
  .guard_scalar("x", "numeric", x)
  .guard_scalar("y", "numeric", y)
  .o <- list(
    x=x,
    y=y)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageAnnotatorPoint"))
  return(.o)
}

#' Create a polygon annotation shape.
#'
#' @param vertices List of polygon points.
#' @return A ImageAnnotatorPolygon instance.
#' @export
ui_image_annotator_polygon <- function(
  vertices) {
  .guard_vector("vertices", "WaveImageAnnotatorPoint", vertices)
  .o <- list(polygon=list(
    vertices=vertices))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageAnnotatorShape"))
  return(.o)
}

#' Create an annotator item with initial selected tags or no tag for plaintext.
#'
#' @param shape The annotation shape.
#' @param tag The `name` of the image annotator tag to refer to for the `label` and `color` of this item.
#' @return A ImageAnnotatorItem instance.
#' @export
ui_image_annotator_item <- function(
  shape,
  tag) {
  .guard_scalar("shape", "WaveImageAnnotatorShape", shape)
  .guard_scalar("tag", "character", tag)
  .o <- list(
    shape=shape,
    tag=tag)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageAnnotatorItem"))
  return(.o)
}

#' Create an image annotator component.
#' 
#' This component allows annotating and labeling parts of an image by drawing shapes with a pointing device.
#'
#' @param name An identifying name for this component.
#' @param image The path or URL of the image to be presented for annotation.
#' @param title The image annotator's title.
#' @param tags The master list of tags that can be used for annotations.
#' @param items Annotations to display on the image, if any.
#' @param trigger True if the form should be submitted as soon as an annotation is drawn.
#' @param image_height The card’s image height. The actual image size is used by default.
#' @param allowed_shapes List of allowed shapes. Available values are 'rect' and 'polygon'. If not set, all shapes are available by default.
#' @param events The events to capture on this image annotator. One of `click` | `tool_change`.
#' @return A ImageAnnotator instance.
#' @export
ui_image_annotator <- function(
  name,
  image,
  title,
  tags,
  items = NULL,
  trigger = NULL,
  image_height = NULL,
  allowed_shapes = NULL,
  events = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("image", "character", image)
  .guard_scalar("title", "character", title)
  .guard_vector("tags", "WaveImageAnnotatorTag", tags)
  .guard_vector("items", "WaveImageAnnotatorItem", items)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("image_height", "character", image_height)
  .guard_vector("allowed_shapes", "character", allowed_shapes)
  .guard_vector("events", "character", events)
  .o <- list(image_annotator=list(
    name=name,
    image=image,
    title=title,
    tags=tags,
    items=items,
    trigger=trigger,
    image_height=image_height,
    allowed_shapes=allowed_shapes,
    events=events))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a unique tag type for use in an audio annotator.
#'
#' @param name An identifying name for this tag.
#' @param label Text to be displayed for the annotation.
#' @param color Hex or RGB color string to be used as the background color.
#' @return A AudioAnnotatorTag instance.
#' @export
ui_audio_annotator_tag <- function(
  name,
  label,
  color) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("color", "character", color)
  .o <- list(
    name=name,
    label=label,
    color=color)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveAudioAnnotatorTag"))
  return(.o)
}

#' Create an annotator item with initial selected tags or no tags.
#'
#' @param start The start of the audio annotation in seconds.
#' @param end The end of the audio annotation in seconds.
#' @param tag The `name` of the audio annotator tag to refer to for the `label` and `color` of this item.
#' @return A AudioAnnotatorItem instance.
#' @export
ui_audio_annotator_item <- function(
  start,
  end,
  tag) {
  .guard_scalar("start", "numeric", start)
  .guard_scalar("end", "numeric", end)
  .guard_scalar("tag", "character", tag)
  .o <- list(
    start=start,
    end=end,
    tag=tag)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveAudioAnnotatorItem"))
  return(.o)
}

#' Create an audio annotator component.
#' 
#' This component allows annotating and labeling parts of audio file.
#'
#' @param name An identifying name for this component.
#' @param title The audio annotator's title.
#' @param path The path to the audio file. Use mp3 or wav formats to achieve the best cross-browser support. See https://caniuse.com/?search=audio%20format for other formats.
#' @param tags The master list of tags that can be used for annotations.
#' @param items Annotations to display on the image, if any.
#' @param trigger True if the form should be submitted as soon as an annotation is made.
#' @return A AudioAnnotator instance.
#' @export
ui_audio_annotator <- function(
  name,
  title,
  path,
  tags,
  items = NULL,
  trigger = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("title", "character", title)
  .guard_scalar("path", "character", path)
  .guard_vector("tags", "WaveAudioAnnotatorTag", tags)
  .guard_vector("items", "WaveAudioAnnotatorItem", items)
  .guard_scalar("trigger", "logical", trigger)
  .o <- list(audio_annotator=list(
    name=name,
    title=title,
    path=path,
    tags=tags,
    items=items,
    trigger=trigger))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' A face pile displays a list of personas. Each circle represents a person and contains their image or initials.
#' Often this control is used when sharing who has access to a specific view or file.
#'
#' @param items List of personas to be displayed.
#' @param name An identifying name for this component. If specified `Add button` will be rendered.
#' @param max Maximum number of personas to be displayed.
#' @param value A value for the facepile. If a value is set, it is used for the button's submitted instead of a boolean True.
#' @return A Facepile instance.
#' @export
ui_facepile <- function(
  items,
  name = NULL,
  max = NULL,
  value = NULL) {
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("name", "character", name)
  .guard_scalar("max", "numeric", max)
  .guard_scalar("value", "character", value)
  .o <- list(facepile=list(
    items=items,
    name=name,
    max=max,
    value=value))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a copyable text component.
#' Use this component when you want to enable your users to quickly copy paste sections of text.
#'
#' @param value Text to be displayed inside the component.
#' @param label The text displayed above the textbox.
#' @param name An identifying name for this component.
#' @param multiline True if the component should allow multi-line text entry.
#' @param height Custom height in px (e.g. '200px') or '1' to fill the remaining card space. Requires `multiline` to be set.
#' @return A CopyableText instance.
#' @export
ui_copyable_text <- function(
  value,
  label,
  name = NULL,
  multiline = NULL,
  height = NULL) {
  .guard_scalar("value", "character", value)
  .guard_scalar("label", "character", label)
  .guard_scalar("name", "character", name)
  .guard_scalar("multiline", "logical", multiline)
  .guard_scalar("height", "character", height)
  .o <- list(copyable_text=list(
    value=value,
    label=label,
    name=name,
    multiline=multiline,
    height=height))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a contextual menu component. Useful when you have a lot of links and want to conserve the space.
#'
#' @param items Commands to render.
#' @param icon The card's icon.
#' @param image The card’s image, preferably user avatar.
#' @param name An identifying name for this component.
#' @param label The text displayed next to the chevron.
#' @return A Menu instance.
#' @export
ui_menu <- function(
  items,
  icon = NULL,
  image = NULL,
  name = NULL,
  label = NULL) {
  .guard_vector("items", "WaveCommand", items)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("image", "character", image)
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .o <- list(menu=list(
    items=items,
    icon=icon,
    image=image,
    name=name,
    label=label))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a set of tags laid out horizontally.
#'
#' @param items Tags in this set.
#' @return A Tags instance.
#' @export
ui_tags <- function(
  items) {
  .guard_vector("items", "WaveTag", items)
  .o <- list(tags=list(
    items=items))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create a time picker.
#' 
#' A time picker allows a user to pick a time value.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param placeholder A string that provides a brief hint to the user as to what kind of information is expected in the field.
#' @param value The time value in hh:mm format. E.g. '10:30', '14:25', '23:59', '00:00'
#' @param disabled True if this field is disabled.
#' @param width The width of the time picker, e.g. '100px'. Defaults to '100%'.
#' @param visible True if the component should be visible. Defaults to True.
#' @param trigger True if the form should be submitted when the time is selected.
#' @param required True if this is a required field. Defaults to False.
#' @param hour_format Specifies 12-hour or 24-hour time format. One of `12` or `24`. Defaults to `12`.
#' @param min The minimum allowed time value in hh:mm format. E.g.: '08:00', '13:30'
#' @param max The maximum allowed time value in hh:mm format. E.g.: '15:30', '00:00'
#' @param minutes_step Limits the available minutes to select from. One of `1`, `5`, `10`, `15`, `20`, `30` or `60`. Defaults to `1`.
#' @return A TimePicker instance.
#' @export
ui_time_picker <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  disabled = NULL,
  width = NULL,
  visible = NULL,
  trigger = NULL,
  required = NULL,
  hour_format = NULL,
  min = NULL,
  max = NULL,
  minutes_step = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("placeholder", "character", placeholder)
  .guard_scalar("value", "character", value)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("width", "character", width)
  .guard_scalar("visible", "logical", visible)
  .guard_scalar("trigger", "logical", trigger)
  .guard_scalar("required", "logical", required)
  .guard_scalar("hour_format", "character", hour_format)
  .guard_scalar("min", "character", min)
  .guard_scalar("max", "character", max)
  .guard_scalar("minutes_step", "numeric", minutes_step)
  .o <- list(time_picker=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    disabled=disabled,
    width=width,
    visible=visible,
    trigger=trigger,
    required=required,
    hour_format=hour_format,
    min=min,
    max=max,
    minutes_step=minutes_step))
  class(.o) <- append(class(.o), c(.wave_obj, "WaveComponent"))
  return(.o)
}

#' Create an article card for longer texts.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card’s title, displayed at the top.
#' @param content Markdown text.
#' @param items Collection of small buttons rendered under the title.
#' @param commands Contextual menu commands for this component.
#' @return A ArticleCard instance.
#' @export
ui_article_card <- function(
  box,
  title,
  content = NULL,
  items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("content", "character", content)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    content=content,
    items=items,
    commands=commands,
    view='article')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveArticleCard"))
  return(.o)
}

#' Create a breadcrumb for a `h2o_wave.types.BreadcrumbsCard()`.
#'
#' @param name The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
#' @param label The label to display.
#' @return A Breadcrumb instance.
#' @export
ui_breadcrumb <- function(
  name,
  label) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .o <- list(
    name=name,
    label=label)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveBreadcrumb"))
  return(.o)
}

#' Create a card containing breadcrumbs.
#' Breadcrumbs should be used as a navigational aid in your app or site.
#' They indicate the current page’s location within a hierarchy and help
#' the user understand where they are in relation to the rest of that hierarchy.
#' They also afford one-click access to higher levels of that hierarchy.
#' Breadcrumbs are typically placed, in horizontal form, under the masthead
#' or navigation of an experience, above the primary content area.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items A list of `h2o_wave.types.Breadcrumb` instances to display. See `h2o_wave.ui.breadcrumb()`
#' @param commands Contextual menu commands for this component.
#' @return A BreadcrumbsCard instance.
#' @export
ui_breadcrumbs_card <- function(
  box,
  items,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveBreadcrumb", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    commands=commands,
    view='breadcrumbs')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveBreadcrumbsCard"))
  return(.o)
}

#' WARNING: Experimental and subject to change.
#' Do not use in production sites!
#' 
#' Create a card that displays a drawing canvas (whiteboard).
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param width Canvas width, in pixels.
#' @param height Canvas height, in pixels.
#' @param data The data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A CanvasCard instance.
#' @export
ui_canvas_card <- function(
  box,
  title,
  width,
  height,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("width", "numeric", width)
  .guard_scalar("height", "numeric", height)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    width=width,
    height=height,
    data=data,
    commands=commands,
    view='canvas')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveCanvasCard"))
  return(.o)
}

#' WARNING: Experimental and subject to change.
#' Do not use in production sites!
#' 
#' Create a card that displays a chat room.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param data The data for this card.
#' @param capacity The maximum number of messages contained in this card. Defaults to 50.
#' @param commands Contextual menu commands for this component.
#' @return A ChatCard instance.
#' @export
ui_chat_card <- function(
  box,
  title,
  data,
  capacity = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  # TODO Validate data: Rec
  .guard_scalar("capacity", "numeric", capacity)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    data=data,
    capacity=capacity,
    commands=commands,
    view='chat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveChatCard"))
  return(.o)
}

#' Create a chatbot card to allow getting prompts from users and providing them with LLM generated answers.
#'
#' @param box A string indicating how to place this component on the page.
#' @param name An identifying name for this component.
#' @param data Chat messages data. Requires cyclic buffer.
#' @param placeholder Chat input box placeholder. Use for prompt examples.
#' @param events The events to capture on this chatbot. One of 'stop' | 'scroll_up' | 'feedback'.
#' @param generating True to show a button to stop the text generation. Defaults to False.
#' @param commands Contextual menu commands for this component.
#' @return A ChatbotCard instance.
#' @export
ui_chatbot_card <- function(
  box,
  name,
  data,
  placeholder = NULL,
  events = NULL,
  generating = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("name", "character", name)
  # TODO Validate data: Rec
  .guard_scalar("placeholder", "character", placeholder)
  .guard_vector("events", "character", events)
  .guard_scalar("generating", "logical", generating)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    name=name,
    data=data,
    placeholder=placeholder,
    events=events,
    generating=generating,
    commands=commands,
    view='chatbot')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveChatbotCard"))
  return(.o)
}

#' WARNING: Experimental and subject to change.
#' Do not use in production sites!
#' 
#' Create a card that enables WYSIWYG editing on a page.
#' Adding this card to a page makes the page editable by end-users.
#'
#' @param box A string indicating how to place this component on the page.
#' @param mode The editing mode. Defaults to `public`.
#'   One of 'public', 'private'. See enum h2o_wave.ui.EditorCardMode.
#' @param commands Contextual menu commands for this component.
#' @return A EditorCard instance.
#' @export
ui_editor_card <- function(
  box,
  mode,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  # TODO Validate mode
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    mode=mode,
    commands=commands,
    view='editor')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveEditorCard"))
  return(.o)
}

#' EXPERIMENTAL. DO NOT USE.
#' Create a card containing other cards laid out using a one-dimensional model with flexible alignemnt and wrapping capabilities.
#'
#' @param box A string indicating how to place this component on the page.
#' @param item_view The child card type.
#' @param item_props The child card properties.
#' @param data Data for this card.
#' @param direction Layout direction.
#'   One of 'horizontal', 'vertical'. See enum h2o_wave.ui.FlexCardDirection.
#' @param justify Layout strategy for main axis.
#'   One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.FlexCardJustify.
#' @param align Layout strategy for cross axis.
#'   One of 'start', 'end', 'center', 'baseline', 'stretch'. See enum h2o_wave.ui.FlexCardAlign.
#' @param wrap Wrapping strategy.
#'   One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.FlexCardWrap.
#' @param commands Contextual menu commands for this component.
#' @return A FlexCard instance.
#' @export
ui_flex_card <- function(
  box,
  item_view,
  item_props,
  data,
  direction = NULL,
  justify = NULL,
  align = NULL,
  wrap = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("item_view", "character", item_view)
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  # TODO Validate direction
  # TODO Validate justify
  # TODO Validate align
  # TODO Validate wrap
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    item_view=item_view,
    item_props=item_props,
    data=data,
    direction=direction,
    justify=justify,
    align=align,
    wrap=wrap,
    commands=commands,
    view='flex')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveFlexCard"))
  return(.o)
}

#' Render a page footer displaying a caption.
#' Footer cards are typically displayed at the bottom of a page.
#'
#' @param box A string indicating how to place this component on the page.
#' @param caption The caption. Supports markdown. *
#' @param items The components displayed to the right of the caption.
#' @param commands Contextual menu commands for this component.
#' @return A FooterCard instance.
#' @export
ui_footer_card <- function(
  box,
  caption,
  items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("caption", "character", caption)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    caption=caption,
    items=items,
    commands=commands,
    view='footer')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveFooterCard"))
  return(.o)
}

#' Create a form.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The components in this form.
#' @param title The title for this card.
#' @param commands Contextual menu commands for this component.
#' @return A FormCard instance.
#' @export
ui_form_card <- function(
  box,
  items,
  title = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("title", "character", title)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    title=title,
    commands=commands,
    view='form')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveFormCard"))
  return(.o)
}

#' Render a card containing a HTML page inside an inline frame (an `iframe`).
#' 
#' Either a path or content can be provided as arguments.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param path The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`.
#' @param content The HTML content of the page. A string containing `<html>...</html>`.
#' @param compact True if title and padding should be removed. Defaults to False.
#' @param commands Contextual menu commands for this component.
#' @return A FrameCard instance.
#' @export
ui_frame_card <- function(
  box,
  title,
  path = NULL,
  content = NULL,
  compact = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("path", "character", path)
  .guard_scalar("content", "character", content)
  .guard_scalar("compact", "logical", compact)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    path=path,
    content=content,
    compact=compact,
    commands=commands,
    view='frame')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveFrameCard"))
  return(.o)
}

#' Create a card for displaying vector graphics.
#'
#' @param box A string indicating how to place this component on the page.
#' @param view_box The position and dimension of the SVG viewport, in user space.
#'   A space-separated list of four numbers: min-x, min-y, width and height.
#'   For example, '0 0 400 300'.
#'   See: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
#' @param stage Background layer for rendering static SVG elements. Must be packed to conserve memory.
#' @param scene Foreground layer for rendering dynamic SVG elements.
#' @param width The displayed width of the rectangular viewport.
#'   (Not the width of its coordinate system.)
#' @param height The displayed height of the rectangular viewport.
#'   (Not the height of its coordinate system.)
#' @param commands Contextual menu commands for this component.
#' @return A GraphicsCard instance.
#' @export
ui_graphics_card <- function(
  box,
  view_box,
  stage = NULL,
  scene = NULL,
  width = NULL,
  height = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("view_box", "character", view_box)
  # TODO Validate stage: Recs
  # TODO Validate scene: Data
  .guard_scalar("width", "character", width)
  .guard_scalar("height", "character", height)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    view_box=view_box,
    stage=stage,
    scene=scene,
    width=width,
    height=height,
    commands=commands,
    view='graphics')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveGraphicsCard"))
  return(.o)
}

#' EXPERIMENTAL. DO NOT USE.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title EXPERIMENTAL. DO NOT USE.
#' @param cells EXPERIMENTAL. DO NOT USE.
#' @param data EXPERIMENTAL. DO NOT USE.
#' @param commands Contextual menu commands for this component.
#' @return A GridCard instance.
#' @export
ui_grid_card <- function(
  box,
  title,
  cells,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  # TODO Validate cells: Data
  # TODO Validate data: Data
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    cells=cells,
    data=data,
    commands=commands,
    view='grid')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveGridCard"))
  return(.o)
}

#' Create a navigation item.
#'
#' @param name The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
#' @param label The label to display.
#' @param icon An optional icon to display next to the label.
#' @param disabled True if this item should be disabled.
#' @param tooltip An optional tooltip message displayed when a user hovers over this item.
#' @param path The path or URL to link to. If specified, the `name` is ignored. The URL is opened in a new browser window or tab. E.g. `/foo.html` or `http://example.com/foo.html`
#' @return A NavItem instance.
#' @export
ui_nav_item <- function(
  name,
  label,
  icon = NULL,
  disabled = NULL,
  tooltip = NULL,
  path = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("label", "character", label)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("disabled", "logical", disabled)
  .guard_scalar("tooltip", "character", tooltip)
  .guard_scalar("path", "character", path)
  .o <- list(
    name=name,
    label=label,
    icon=icon,
    disabled=disabled,
    tooltip=tooltip,
    path=path)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveNavItem"))
  return(.o)
}

#' Create a group of navigation items.
#'
#' @param label The label to display for this group.
#' @param items The navigation items contained in this group.
#' @param collapsed Indicates whether nav groups should be rendered as collapsed initially
#' @return A NavGroup instance.
#' @export
ui_nav_group <- function(
  label,
  items,
  collapsed = NULL) {
  .guard_scalar("label", "character", label)
  .guard_vector("items", "WaveNavItem", items)
  .guard_scalar("collapsed", "logical", collapsed)
  .o <- list(
    label=label,
    items=items,
    collapsed=collapsed)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveNavGroup"))
  return(.o)
}

#' Render a page header displaying a title, subtitle and an optional navigation menu.
#' Header cards are typically used for top-level navigation.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title. *
#' @param subtitle The subtitle, displayed below the title. *
#' @param icon The icon, displayed to the left. *
#' @param icon_color The icon's color. *
#' @param image The URL of an image (usually logo) displayed to the left. Mutually exclusive with icon. *
#' @param nav The navigation menu to display when the header's icon is clicked. Recommended for mobile screens only. *
#' @param items Items that should be displayed on the right side of the header.
#' @param secondary_items Items that should be displayed in the center of the header.
#' @param color Header background color. Defaults to 'primary'.
#'   One of 'card', 'transparent', 'primary'. See enum h2o_wave.ui.HeaderCardColor.
#' @param commands Contextual menu commands for this component.
#' @return A HeaderCard instance.
#' @export
ui_header_card <- function(
  box,
  title,
  subtitle,
  icon = NULL,
  icon_color = NULL,
  image = NULL,
  nav = NULL,
  items = NULL,
  secondary_items = NULL,
  color = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("icon_color", "character", icon_color)
  .guard_scalar("image", "character", image)
  .guard_vector("nav", "WaveNavGroup", nav)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("secondary_items", "WaveComponent", secondary_items)
  # TODO Validate color
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    subtitle=subtitle,
    icon=icon,
    icon_color=icon_color,
    image=image,
    nav=nav,
    items=items,
    secondary_items=secondary_items,
    color=color,
    commands=commands,
    view='header')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveHeaderCard"))
  return(.o)
}

#' Create a card that displays a base64-encoded image.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param type The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`.
#' @param image Image data, base64-encoded.
#' @param data Data for this card.
#' @param path The path or URL or data URL of the image, e.g. `/foo.png` or `http://example.com/foo.png` or `data:image/png;base64,???`.
#' @param path_popup The path or URL or data URL of the image displayed in the popup after clicking the image. Does not replace the `path` property.
#' @param commands Contextual menu commands for this component.
#' @return A ImageCard instance.
#' @export
ui_image_card <- function(
  box,
  title,
  type = NULL,
  image = NULL,
  data = NULL,
  path = NULL,
  path_popup = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("type", "character", type)
  .guard_scalar("image", "character", image)
  # TODO Validate data: Rec
  .guard_scalar("path", "character", path)
  .guard_scalar("path_popup", "character", path_popup)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    type=type,
    image=image,
    data=data,
    path=path,
    path_popup=path_popup,
    commands=commands,
    view='image')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveImageCard"))
  return(.o)
}

#' Create a large captioned card displaying a primary value, an auxiliary value and a progress bar, with captions for each value.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param caption The card's caption.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value, typically a target value.
#' @param value_caption The caption displayed below the primary value.
#' @param aux_value_caption The caption displayed below the auxiliary value.
#' @param progress The value of the progress bar, between 0 and 1.
#' @param plot_color The color of the progress bar.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A LargeBarStatCard instance.
#' @export
ui_large_bar_stat_card <- function(
  box,
  title,
  caption,
  value,
  aux_value,
  value_caption,
  aux_value_caption,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("value_caption", "character", value_caption)
  .guard_scalar("aux_value_caption", "character", aux_value_caption)
  .guard_scalar("progress", "numeric", progress)
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    caption=caption,
    value=value,
    aux_value=aux_value,
    value_caption=value_caption,
    aux_value_caption=aux_value_caption,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='large_bar_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveLargeBarStatCard"))
  return(.o)
}

#' Create a stat card displaying a primary value, an auxiliary value and a caption.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed next to the primary value.
#' @param caption The caption displayed below the primary value.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A LargeStatCard instance.
#' @export
ui_large_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  caption,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("caption", "character", caption)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    caption=caption,
    data=data,
    commands=commands,
    view='large_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveLargeStatCard"))
  return(.o)
}

#' EXPERIMENTAL. DO NOT USE.
#' Create a card containing other cards laid out in the form of a list (vertically, top-to-bottom).
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param item_view The child card type.
#' @param item_props The child card properties.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A ListCard instance.
#' @export
ui_list_card <- function(
  box,
  title,
  item_view,
  item_props,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("item_view", "character", item_view)
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    item_view=item_view,
    item_props=item_props,
    data=data,
    commands=commands,
    view='list')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveListCard"))
  return(.o)
}

#' EXPERIMENTAL. DO NOT USE.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title EXPERIMENTAL. DO NOT USE.
#' @param caption EXPERIMENTAL. DO NOT USE.
#' @param value EXPERIMENTAL. DO NOT USE.
#' @param aux_value EXPERIMENTAL. DO NOT USE.
#' @param data EXPERIMENTAL. DO NOT USE.
#' @param commands Contextual menu commands for this component.
#' @return A ListItem1Card instance.
#' @export
ui_list_item1_card <- function(
  box,
  title,
  caption,
  value,
  aux_value,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    caption=caption,
    value=value,
    aux_value=aux_value,
    data=data,
    commands=commands,
    view='list_item1')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveListItem1Card"))
  return(.o)
}

#' Create a card that renders Markdown content.
#' 
#' Github-flavored markdown is supported.
#' HTML markup is allowed in markdown content.
#' URLs, if found, are displayed as hyperlinks.
#' Copyright, reserved, trademark, quotes, etc. are replaced with language-neutral symbols.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param content The markdown content. Supports Github Flavored Markdown (GFM): https://guides.github.com/features/mastering-markdown/
#' @param data Additional data for the card.
#' @param compact Make spacing tighter. Defaults to True.
#' @param commands Contextual menu commands for this component.
#' @return A MarkdownCard instance.
#' @export
ui_markdown_card <- function(
  box,
  title,
  content,
  data = NULL,
  compact = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("content", "character", content)
  # TODO Validate data: Rec
  .guard_scalar("compact", "logical", compact)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    content=content,
    data=data,
    compact=compact,
    commands=commands,
    view='markdown')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveMarkdownCard"))
  return(.o)
}

#' Render HTML content.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param content The HTML content.
#' @param compact True if outer spacing should be removed. Defaults to False.
#' @param commands Contextual menu commands for this component.
#' @return A MarkupCard instance.
#' @export
ui_markup_card <- function(
  box,
  title,
  content,
  compact = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("content", "character", content)
  .guard_scalar("compact", "logical", compact)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    content=content,
    compact=compact,
    commands=commands,
    view='markup')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveMarkupCard"))
  return(.o)
}

#' Create a notification bar.
#' 
#' A notification bar is an area at the edge of a primary view that displays relevant status information.
#' You can use a notification bar to tell the user about a result of an action, e.g. "Data has been successfully saved".
#'
#' @param text The text displayed on the notification bar.
#' @param type The icon and color of the notification bar. Defaults to 'info'.
#'   One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'. See enum h2o_wave.ui.NotificationBarType.
#' @param timeout How long the notification stays visible, in seconds. If set to -1, the notification has to be closed manually. Defaults to 5.
#' @param buttons Specify one or more action buttons.
#' @param position Specify the location of notification. Defaults to 'top-right'.
#'   One of 'top-right', 'bottom-right', 'bottom-center', 'bottom-left', 'top-left', 'top-center'. See enum h2o_wave.ui.NotificationBarPosition.
#' @param events The events to capture on this notification bar. One of 'dismissed'.
#' @param name An identifying name for this component.
#' @return A NotificationBar instance.
#' @export
ui_notification_bar <- function(
  text,
  type = NULL,
  timeout = NULL,
  buttons = NULL,
  position = NULL,
  events = NULL,
  name = NULL) {
  .guard_scalar("text", "character", text)
  # TODO Validate type
  .guard_scalar("timeout", "numeric", timeout)
  .guard_vector("buttons", "WaveComponent", buttons)
  # TODO Validate position
  .guard_vector("events", "character", events)
  .guard_scalar("name", "character", name)
  .o <- list(
    text=text,
    type=type,
    timeout=timeout,
    buttons=buttons,
    position=position,
    events=events,
    name=name)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveNotificationBar"))
  return(.o)
}

#' Represents an zone within a page layout.
#'
#' @param name An identifying name for this zone.
#' @param size The size of this zone.
#' @param direction Layout direction.
#'   One of 'row', 'column'. See enum h2o_wave.ui.ZoneDirection.
#' @param justify Layout strategy for main axis.
#'   One of 'start', 'end', 'center', 'between', 'around'. See enum h2o_wave.ui.ZoneJustify.
#' @param align Layout strategy for cross axis.
#'   One of 'start', 'end', 'center', 'stretch'. See enum h2o_wave.ui.ZoneAlign.
#' @param wrap Wrapping strategy.
#'   One of 'start', 'end', 'center', 'between', 'around', 'stretch'. See enum h2o_wave.ui.ZoneWrap.
#' @param zones The sub-zones contained inside this zone.
#' @return A Zone instance.
#' @export
ui_zone <- function(
  name,
  size = NULL,
  direction = NULL,
  justify = NULL,
  align = NULL,
  wrap = NULL,
  zones = NULL) {
  .guard_scalar("name", "character", name)
  .guard_scalar("size", "character", size)
  # TODO Validate direction
  # TODO Validate justify
  # TODO Validate align
  # TODO Validate wrap
  .guard_vector("zones", "WaveZone", zones)
  .o <- list(
    name=name,
    size=size,
    direction=direction,
    justify=justify,
    align=align,
    wrap=wrap,
    zones=zones)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveZone"))
  return(.o)
}

#' Represents the layout structure for a page.
#'
#' @param breakpoint The minimum viewport width at which to use this layout.
#'   Values must be pixel widths (e.g. '0px', '576px', '768px') or a named preset.
#'   The named presets are:
#'   'xs': '0px' for extra small devices (portrait phones),
#'   's': '576px' for small devices (landscape phones),
#'   'm': '768px' for medium devices (tablets),
#'   'l': '992px' for large devices (desktops),
#'   'xl': '1200px' for extra large devices (large desktops).
#'   
#'   A breakpoint value of 'xs' (or '0') matches all viewport widths, unless other breakpoints are set.
#' @param zones The zones in this layout. Each zones can in turn contain sub-zones.
#' @param width The width of the layout. Defaults to `100%`.
#' @param min_width The minimum width of the layout.
#' @param max_width The maximum width of the layout.
#' @param height The height of the layout. Defaults to `auto`.
#' @param min_height The minimum height of the layout.
#' @param max_height The maximum height of the layout.
#' @param name An identifying name for this zone.
#' @return A Layout instance.
#' @export
ui_layout <- function(
  breakpoint,
  zones,
  width = NULL,
  min_width = NULL,
  max_width = NULL,
  height = NULL,
  min_height = NULL,
  max_height = NULL,
  name = NULL) {
  .guard_scalar("breakpoint", "character", breakpoint)
  .guard_vector("zones", "WaveZone", zones)
  .guard_scalar("width", "character", width)
  .guard_scalar("min_width", "character", min_width)
  .guard_scalar("max_width", "character", max_width)
  .guard_scalar("height", "character", height)
  .guard_scalar("min_height", "character", min_height)
  .guard_scalar("max_height", "character", max_height)
  .guard_scalar("name", "character", name)
  .o <- list(
    breakpoint=breakpoint,
    zones=zones,
    width=width,
    min_width=min_width,
    max_width=max_width,
    height=height,
    min_height=min_height,
    max_height=max_height,
    name=name)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveLayout"))
  return(.o)
}

#' A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
#' and requires people to interact with it. It’s primarily used for confirming actions,
#' such as deleting a file, or asking people to make a choice.
#'
#' @param title The dialog's title.
#' @param items The components displayed in this dialog.
#' @param width The width of the dialog, e.g. '400px'. Defaults to '600px'.
#' @param closable True if the dialog should have a closing 'X' button at the top right corner.
#' @param blocking True to prevent closing when clicking or tapping outside the dialog. Prevents interacting with the page behind the dialog. Defaults to False.
#' @param primary Dialog with large header banner, mutually exclusive with `closable` prop. Defaults to False.
#' @param name An identifying name for this component.
#' @param events The events to capture on this dialog. One of 'dismissed'.
#' @return A Dialog instance.
#' @export
ui_dialog <- function(
  title,
  items,
  width = NULL,
  closable = NULL,
  blocking = NULL,
  primary = NULL,
  name = NULL,
  events = NULL) {
  .guard_scalar("title", "character", title)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("width", "character", width)
  .guard_scalar("closable", "logical", closable)
  .guard_scalar("blocking", "logical", blocking)
  .guard_scalar("primary", "logical", primary)
  .guard_scalar("name", "character", name)
  .guard_vector("events", "character", events)
  .o <- list(
    title=title,
    items=items,
    width=width,
    closable=closable,
    blocking=blocking,
    primary=primary,
    name=name,
    events=events)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveDialog"))
  return(.o)
}

#' A dialog box (Dialog) is a temporary pop-up that takes focus from the page or app
#' and requires people to interact with it. It’s primarily used for confirming actions,
#' such as deleting a file, or asking people to make a choice.
#'
#' @param title The side panel's title.
#' @param items The components displayed in this side panel.
#' @param width The width of the dialog, e.g. '400px'. Defaults to '600px'.
#' @param name An identifying name for this component.
#' @param events The events to capture on this side panel. One of 'dismissed'.
#' @param blocking True to prevent closing when clicking or tapping outside the side panel. Prevents interacting with the page behind the side panel. Defaults to False.
#' @param closable True if the side panel should have a closing 'X' button at the top right corner.
#' @return A SidePanel instance.
#' @export
ui_side_panel <- function(
  title,
  items,
  width = NULL,
  name = NULL,
  events = NULL,
  blocking = NULL,
  closable = NULL) {
  .guard_scalar("title", "character", title)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("width", "character", width)
  .guard_scalar("name", "character", name)
  .guard_vector("events", "character", events)
  .guard_scalar("blocking", "logical", blocking)
  .guard_scalar("closable", "logical", closable)
  .o <- list(
    title=title,
    items=items,
    width=width,
    name=name,
    events=events,
    blocking=blocking,
    closable=closable)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveSidePanel"))
  return(.o)
}

#' Theme (color scheme) to apply colors to the app.
#'
#' @param name An identifying name for this theme.
#' @param text Base color of the textual components.
#' @param card Card background color.
#' @param page Page background color.
#' @param primary Primary color used to accent components.
#' @return A Theme instance.
#' @export
ui_theme <- function(
  name,
  text,
  card,
  page,
  primary) {
  .guard_scalar("name", "character", name)
  .guard_scalar("text", "character", text)
  .guard_scalar("card", "character", card)
  .guard_scalar("page", "character", page)
  .guard_scalar("primary", "character", primary)
  .o <- list(
    name=name,
    text=text,
    card=card,
    page=page,
    primary=primary)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTheme"))
  return(.o)
}

#' Configure user interaction tracking (analytics) for a page.
#'
#' @param type The tracking provider. Supported providers are `ga` (Google Analytics) and `gtag` (Google Global Site Tags or gtag.js)
#'   One of 'ga', 'gtag'. See enum h2o_wave.ui.TrackerType.
#' @param id The tracking ID or measurement ID.
#' @return A Tracker instance.
#' @export
ui_tracker <- function(
  type,
  id) {
  # TODO Validate type
  .guard_scalar("id", "character", id)
  .o <- list(
    type=type,
    id=id)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTracker"))
  return(.o)
}

#' Create a reference to an external Javascript file to be included on a page.
#'
#' @param path The URI of an external script.
#' @param asynchronous Whether to fetch and load this script in parallel to parsing and evaluated as soon as it is available.
#' @param cross_origin The CORS setting for this script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
#' @param referrer_policy Indicates which referrer to send when fetching the script. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
#' @param integrity The cryptographic hash to verify the script's integrity. See https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
#' @return A Script instance.
#' @export
ui_script <- function(
  path,
  asynchronous = NULL,
  cross_origin = NULL,
  referrer_policy = NULL,
  integrity = NULL) {
  .guard_scalar("path", "character", path)
  .guard_scalar("asynchronous", "logical", asynchronous)
  .guard_scalar("cross_origin", "character", cross_origin)
  .guard_scalar("referrer_policy", "character", referrer_policy)
  .guard_scalar("integrity", "character", integrity)
  .o <- list(
    path=path,
    asynchronous=asynchronous,
    cross_origin=cross_origin,
    referrer_policy=referrer_policy,
    integrity=integrity)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveScript"))
  return(.o)
}

#' Create a block of inline Javascript to be executed immediately on a page.
#'
#' @param content The Javascript source code to be executed.
#' @param requires The names of modules required on the page's `window` global before running this script.
#' @param targets The HTML elements required to be present on the page before running this script. Each 'target' can either be the ID of the element (`foo`) or a CSS selector (`#foo`, `.foo`, `table > td.foo`, etc.).
#' @return A InlineScript instance.
#' @export
ui_inline_script <- function(
  content,
  requires = NULL,
  targets = NULL) {
  .guard_scalar("content", "character", content)
  .guard_vector("requires", "character", requires)
  .guard_vector("targets", "character", targets)
  .o <- list(
    content=content,
    requires=requires,
    targets=targets)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveInlineScript"))
  return(.o)
}

#' Create an inline CSS to be injected into a page.
#'
#' @param content The CSS to be applied to this page.
#' @param media A valid media query to set conditions for when the style should be applied. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style#attr-media.
#' @return A InlineStylesheet instance.
#' @export
ui_inline_stylesheet <- function(
  content,
  media = NULL) {
  .guard_scalar("content", "character", content)
  .guard_scalar("media", "character", media)
  .o <- list(
    content=content,
    media=media)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveInlineStylesheet"))
  return(.o)
}

#' Create a reference to an external CSS file to be included on a page.
#'
#' @param path The URI of an external stylesheet.
#' @param media A valid media query to set conditions for when the stylesheet should be loaded. More info at https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-media.
#' @param cross_origin The CORS setting. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-crossorigin
#' @return A Stylesheet instance.
#' @export
ui_stylesheet <- function(
  path,
  media = NULL,
  cross_origin = NULL) {
  .guard_scalar("path", "character", path)
  .guard_scalar("media", "character", media)
  .guard_scalar("cross_origin", "character", cross_origin)
  .o <- list(
    path=path,
    media=media,
    cross_origin=cross_origin)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStylesheet"))
  return(.o)
}

#' Represents page-global state.
#' 
#' This card is invisible.
#' It is used to control attributes of the active page.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title of the page.
#' @param refresh Refresh rate in seconds. A value of 0 turns off live-updates. Values != 0 are currently ignored (reserved for future use).
#' @param notification Display a desktop notification.
#' @param notification_bar Display an in-app notification bar.
#' @param redirect Redirect the page to a new URL.
#' @param icon Shortcut icon path. Preferably a `.png` file (`.ico` files may not work in mobile browsers).
#'   Not supported in Safari.
#' @param layouts The layouts supported by this page.
#' @param dialog Display a dialog on the page.
#' @param side_panel Display a side panel on the page.
#' @param theme Specify the name of the theme (color scheme) to use on this page. One of 'light', 'neon' or 'h2o-dark'.
#' @param themes * Themes (color schemes) that define color used in the app.
#' @param tracker Configure a tracker for the page (for web analytics).
#' @param scripts External Javascript files to load into the page.
#' @param script Javascript code to execute on this page.
#' @param stylesheet CSS stylesheet to be applied to this page.
#' @param stylesheets External CSS files to load into the page.
#' @param animate EXPERIMENTAL: True to turn on the card animations. Defaults to False.
#' @param commands Contextual menu commands for this component.
#' @return A MetaCard instance.
#' @export
ui_meta_card <- function(
  box,
  title = NULL,
  refresh = NULL,
  notification = NULL,
  notification_bar = NULL,
  redirect = NULL,
  icon = NULL,
  layouts = NULL,
  dialog = NULL,
  side_panel = NULL,
  theme = NULL,
  themes = NULL,
  tracker = NULL,
  scripts = NULL,
  script = NULL,
  stylesheet = NULL,
  stylesheets = NULL,
  animate = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("refresh", "numeric", refresh)
  .guard_scalar("notification", "character", notification)
  .guard_scalar("notification_bar", "WaveNotificationBar", notification_bar)
  .guard_scalar("redirect", "character", redirect)
  .guard_scalar("icon", "character", icon)
  .guard_vector("layouts", "WaveLayout", layouts)
  .guard_scalar("dialog", "WaveDialog", dialog)
  .guard_scalar("side_panel", "WaveSidePanel", side_panel)
  .guard_scalar("theme", "character", theme)
  .guard_vector("themes", "WaveTheme", themes)
  .guard_scalar("tracker", "WaveTracker", tracker)
  .guard_vector("scripts", "WaveScript", scripts)
  .guard_scalar("script", "WaveInlineScript", script)
  .guard_scalar("stylesheet", "WaveInlineStylesheet", stylesheet)
  .guard_vector("stylesheets", "WaveStylesheet", stylesheets)
  .guard_scalar("animate", "logical", animate)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    refresh=refresh,
    notification=notification,
    notification_bar=notification_bar,
    redirect=redirect,
    icon=icon,
    layouts=layouts,
    dialog=dialog,
    side_panel=side_panel,
    theme=theme,
    themes=themes,
    tracker=tracker,
    scripts=scripts,
    script=script,
    stylesheet=stylesheet,
    stylesheets=stylesheets,
    animate=animate,
    commands=commands,
    view='meta')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveMetaCard"))
  return(.o)
}

#' Create a card containing a navigation pane.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The navigation groups contained in this pane.
#' @param value The name of the active (highlighted) navigation item.
#' @param title The card's title.
#' @param subtitle The card's subtitle.
#' @param icon The icon, displayed to the left. *
#' @param icon_color The icon's color. *
#' @param image The URL of an image (usually logo) displayed at the top. *
#' @param persona The user avatar displayed at the top. Mutually exclusive with image, title and subtitle. *
#' @param secondary_items Items that should be displayed at the bottom of the card if items are not empty, otherwise displayed under subtitle.
#' @param color Card background color. Defaults to 'card'.
#'   One of 'card', 'primary'. See enum h2o_wave.ui.NavCardColor.
#' @param commands Contextual menu commands for this component.
#' @return A NavCard instance.
#' @export
ui_nav_card <- function(
  box,
  items,
  value = NULL,
  title = NULL,
  subtitle = NULL,
  icon = NULL,
  icon_color = NULL,
  image = NULL,
  persona = NULL,
  secondary_items = NULL,
  color = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveNavGroup", items)
  .guard_scalar("value", "character", value)
  .guard_scalar("title", "character", title)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("icon_color", "character", icon_color)
  .guard_scalar("image", "character", image)
  .guard_scalar("persona", "WaveComponent", persona)
  .guard_vector("secondary_items", "WaveComponent", secondary_items)
  # TODO Validate color
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    value=value,
    title=title,
    subtitle=subtitle,
    icon=icon,
    icon_color=icon_color,
    image=image,
    persona=persona,
    secondary_items=secondary_items,
    color=color,
    commands=commands,
    view='nav')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveNavCard"))
  return(.o)
}

#' WARNING: Experimental and subject to change.
#' Do not use in production sites!
#' 
#' Create a card displaying a collaborative Pixel art tool.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param data The data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A PixelArtCard instance.
#' @export
ui_pixel_art_card <- function(
  box,
  title,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    data=data,
    commands=commands,
    view='pixel_art')
  class(.o) <- append(class(.o), c(.wave_obj, "WavePixelArtCard"))
  return(.o)
}

#' Create a card displaying a plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param data Data for this card.
#' @param plot The plot to be displayed in this card.
#' @param events The events to capture on this card. One of 'select_marks'.
#' @param interactions The interactions to be allowed for this card. One of 'drag_move' | 'scale_zoom' | 'brush'. Note: `brush` does not raise `select_marks` event.
#' @param animate EXPERIMENTAL: True to turn on the chart animations. Defaults to False.
#' @param commands Contextual menu commands for this component.
#' @return A PlotCard instance.
#' @export
ui_plot_card <- function(
  box,
  title,
  data,
  plot,
  events = NULL,
  interactions = NULL,
  animate = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  # TODO Validate data: Rec
  .guard_scalar("plot", "WavePlot", plot)
  .guard_vector("events", "character", events)
  .guard_vector("interactions", "character", interactions)
  .guard_scalar("animate", "logical", animate)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    data=data,
    plot=plot,
    events=events,
    interactions=interactions,
    animate=animate,
    commands=commands,
    view='plot')
  class(.o) <- append(class(.o), c(.wave_obj, "WavePlotCard"))
  return(.o)
}

#' Create a postcard displaying a persona, image, caption and optional buttons.
#'
#' @param box A string indicating how to place this component on the page.
#' @param persona The card's user avatar, 'size' prop is restricted to 'xs'.
#' @param image The card’s image.
#' @param aux_value The card's aux_value, displayed on the right hand side of the image.
#' @param caption The card's caption, displayed below the image.
#' @param items The card's buttons, displayed at the bottom.
#' @param commands Contextual menu commands for this component.
#' @return A PostCard instance.
#' @export
ui_post_card <- function(
  box,
  persona,
  image,
  aux_value = NULL,
  caption = NULL,
  items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("persona", "WaveComponent", persona)
  .guard_scalar("image", "character", image)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("caption", "character", caption)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    persona=persona,
    image=image,
    aux_value=aux_value,
    caption=caption,
    items=items,
    commands=commands,
    view='post')
  class(.o) <- append(class(.o), c(.wave_obj, "WavePostCard"))
  return(.o)
}

#' Create a preview card displaying an image with shadow overlay, title, social icons, caption, and button.
#'
#' @param box A string indicating how to place this component on the page.
#' @param name An identifying name for this card. Makes the card clickable if label is not provided, similar to a button.
#' @param image The card’s image.
#' @param title The card's title
#' @param items Mini buttons displayed at the top-right corner
#' @param caption The card's caption, displayed below the title.
#' @param label Label of a button rendered at the bottom of the card. If specified, the whole card is not clickable anymore.
#' @param commands Contextual menu commands for this component.
#' @return A PreviewCard instance.
#' @export
ui_preview_card <- function(
  box,
  name,
  image,
  title = NULL,
  items = NULL,
  caption = NULL,
  label = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("name", "character", name)
  .guard_scalar("image", "character", image)
  .guard_scalar("title", "character", title)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("label", "character", label)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    name=name,
    image=image,
    title=title,
    items=items,
    caption=caption,
    label=label,
    commands=commands,
    view='preview')
  class(.o) <- append(class(.o), c(.wave_obj, "WavePreviewCard"))
  return(.o)
}

#' Create a profile card to display information about a user.
#'
#' @param box A string indicating how to place this component on the page.
#' @param persona The persona represented by this card.
#' @param image The card’s image, either a base64-encoded image, a path to an image hosted externally (starting with `https://` or `http://`)
#'   or a path to an image hosted on the Wave daemon (starting with `/`).
#'   .
#' @param items Components in this card displayed below the image.
#' @param height The height of the bottom content (items), e.g. '400px'. Use sparingly, e.g. in grid views.
#' @param commands Contextual menu commands for this component.
#' @return A ProfileCard instance.
#' @export
ui_profile_card <- function(
  box,
  persona,
  image,
  items = NULL,
  height = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("persona", "WaveComponent", persona)
  .guard_scalar("image", "character", image)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("height", "character", height)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    persona=persona,
    image=image,
    items=items,
    height=height,
    commands=commands,
    view='profile')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveProfileCard"))
  return(.o)
}

#' EXPERIMENTAL. DO NOT USE.
#' Create a card containing other cards.
#'
#' @param box A string indicating how to place this component on the page.
#' @param item_view EXPERIMENTAL. DO NOT USE.
#' @param item_props The child card properties.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A RepeatCard instance.
#' @export
ui_repeat_card <- function(
  box,
  item_view,
  item_props,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("item_view", "character", item_view)
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    item_view=item_view,
    item_props=item_props,
    data=data,
    commands=commands,
    view='repeat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveRepeatCard"))
  return(.o)
}

#' Render a card displaying a title, a subtitle, and optional components.
#' Section cards are typically used to demarcate different sections on a page.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title.
#' @param subtitle The subtitle, displayed below the title. Supports Markdown.
#' @param items The components to display in this card
#' @param commands Contextual menu commands for this component.
#' @return A SectionCard instance.
#' @export
ui_section_card <- function(
  box,
  title,
  subtitle,
  items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    subtitle=subtitle,
    items=items,
    commands=commands,
    view='section')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveSectionCard"))
  return(.o)
}

#' Create a small stat card displaying a primary value and a series plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param plot_data The plot's data.
#' @param plot_value The data field to use for y-axis values.
#' @param plot_zero_value The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
#' @param plot_category The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
#' @param plot_type The type of plot. Defaults to `area`.
#'   One of 'area', 'interval'. See enum h2o_wave.ui.SmallSeriesStatCardPlotType.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.SmallSeriesStatCardPlotCurve.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A SmallSeriesStatCard instance.
#' @export
ui_small_series_stat_card <- function(
  box,
  title,
  value,
  plot_data,
  plot_value,
  plot_zero_value = NULL,
  plot_category = NULL,
  plot_type = NULL,
  plot_curve = NULL,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  # TODO Validate plot_data: Data
  .guard_scalar("plot_value", "character", plot_value)
  .guard_scalar("plot_zero_value", "numeric", plot_zero_value)
  .guard_scalar("plot_category", "character", plot_category)
  # TODO Validate plot_type
  # TODO Validate plot_curve
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    plot_data=plot_data,
    plot_value=plot_value,
    plot_zero_value=plot_zero_value,
    plot_category=plot_category,
    plot_type=plot_type,
    plot_curve=plot_curve,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='small_series_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveSmallSeriesStatCard"))
  return(.o)
}

#' Create a stat card displaying a single value.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A SmallStatCard instance.
#' @export
ui_small_stat_card <- function(
  box,
  title,
  value,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    data=data,
    commands=commands,
    view='small_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveSmallStatCard"))
  return(.o)
}

#' Create a stat item (a label-value pair) for stat_list_card.
#'
#' @param label The label for the metric.
#' @param name An optional name for this item (required only if this item is clickable).
#' @param caption The caption for the metric, displayed below the label.
#' @param value The primary value of the metric.
#' @param value_color The font color of the primary value.
#' @param aux_value The auxiliary value, displayed below the primary value.
#' @param icon An optional icon, displayed next to the label.
#' @param icon_color The color of the icon.
#' @return A StatListItem instance.
#' @export
ui_stat_list_item <- function(
  label,
  name = NULL,
  caption = NULL,
  value = NULL,
  value_color = NULL,
  aux_value = NULL,
  icon = NULL,
  icon_color = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("name", "character", name)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("value", "character", value)
  .guard_scalar("value_color", "character", value_color)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("icon_color", "character", icon_color)
  .o <- list(
    label=label,
    name=name,
    caption=caption,
    value=value,
    value_color=value_color,
    aux_value=aux_value,
    icon=icon,
    icon_color=icon_color)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStatListItem"))
  return(.o)
}

#' Render a card displaying a list of stats.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title.
#' @param items The individual stats to be displayed.
#' @param name An optional name for this item.
#' @param subtitle The subtitle, displayed below the title.
#' @param commands Contextual menu commands for this component.
#' @return A StatListCard instance.
#' @export
ui_stat_list_card <- function(
  box,
  title,
  items,
  name = NULL,
  subtitle = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_vector("items", "WaveStatListItem", items)
  .guard_scalar("name", "character", name)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    items=items,
    name=name,
    subtitle=subtitle,
    commands=commands,
    view='stat_list')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStatListCard"))
  return(.o)
}

#' Create a stat item (a label and a set of values) for stat_table_card.
#'
#' @param label The label for the row.
#' @param values The values displayed in the row.
#' @param name An optional name for this row (required only if this row is clickable).
#' @param caption The caption for the metric, displayed below the label.
#' @param icon An optional icon, displayed next to the label.
#' @param icon_color The color of the icon.
#' @param colors List of colors used for each value in values ordered respectively.
#' @return A StatTableItem instance.
#' @export
ui_stat_table_item <- function(
  label,
  values,
  name = NULL,
  caption = NULL,
  icon = NULL,
  icon_color = NULL,
  colors = NULL) {
  .guard_scalar("label", "character", label)
  .guard_vector("values", "character", values)
  .guard_scalar("name", "character", name)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("icon_color", "character", icon_color)
  .guard_vector("colors", "character", colors)
  .o <- list(
    label=label,
    values=values,
    name=name,
    caption=caption,
    icon=icon,
    icon_color=icon_color,
    colors=colors)
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStatTableItem"))
  return(.o)
}

#' Render a card displaying a table of stats.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title.
#' @param columns The names of this table's columns.
#' @param items The rows displayed in this table.
#' @param name An optional name for this item.
#' @param subtitle The subtitle, displayed below the title.
#' @param commands Contextual menu commands for this component.
#' @return A StatTableCard instance.
#' @export
ui_stat_table_card <- function(
  box,
  title,
  columns,
  items,
  name = NULL,
  subtitle = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_vector("columns", "character", columns)
  .guard_vector("items", "WaveStatTableItem", items)
  .guard_scalar("name", "character", name)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    columns=columns,
    items=items,
    name=name,
    subtitle=subtitle,
    commands=commands,
    view='stat_table')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveStatTableCard"))
  return(.o)
}

#' Create a card containing tabs for navigation.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The tabs to display in this card
#' @param value The name of the tab to select.
#' @param link True if tabs should be rendered as links instead of buttons.
#' @param name An optional name for the card. If provided, the selected tab can be accessed using the name of the card.
#' @param commands Contextual menu commands for this component.
#' @return A TabCard instance.
#' @export
ui_tab_card <- function(
  box,
  items,
  value = NULL,
  link = NULL,
  name = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveTab", items)
  .guard_scalar("value", "character", value)
  .guard_scalar("link", "logical", link)
  .guard_scalar("name", "character", name)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    value=value,
    link=link,
    name=name,
    commands=commands,
    view='tab')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTabCard"))
  return(.o)
}

#' Create a tall article preview card.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param image The card’s background image URL, either a base64-encoded image, a path to an image hosted
#'   externally (starting with `https://` or `http://`) or a path to an
#'   image hosted on the Wave daemon (starting with `/`)
#' @param subtitle The card's subtitle, displayed below the title.
#' @param value The value displayed to the right of the title/subtitle.
#' @param content Markdown text.
#' @param name An identifying name for this card. Makes the card clickable, similar to a button.
#' @param items Components displayed in the body of the card.
#' @param commands Contextual menu commands for this component.
#' @return A TallArticlePreviewCard instance.
#' @export
ui_tall_article_preview_card <- function(
  box,
  title,
  image,
  subtitle = NULL,
  value = NULL,
  content = NULL,
  name = NULL,
  items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("image", "character", image)
  .guard_scalar("subtitle", "character", subtitle)
  .guard_scalar("value", "character", value)
  .guard_scalar("content", "character", content)
  .guard_scalar("name", "character", name)
  .guard_vector("items", "WaveComponent", items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    image=image,
    subtitle=subtitle,
    value=value,
    content=content,
    name=name,
    items=items,
    commands=commands,
    view='tall_article_preview')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTallArticlePreviewCard"))
  return(.o)
}

#' Create a tall stat card displaying a primary value, an auxiliary value and a progress gauge.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed next to the primary value.
#' @param progress The value of the progress gauge, between 0 and 1.
#' @param plot_color The color of the progress gauge.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A TallGaugeStatCard instance.
#' @export
ui_tall_gauge_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("progress", "numeric", progress)
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='tall_gauge_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTallGaugeStatCard"))
  return(.o)
}

#' Create a tall information card displaying a title, caption and either an icon or image.
#'
#' @param box A string indicating how to place this component on the page.
#' @param name An identifying name for this card. Makes the card clickable only if name is not empty and label is empty
#' @param title The card's title.
#' @param caption The card's caption, displayed below the title. Supports markdown.
#' @param label Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore.
#' @param icon The card's icon.
#' @param image The card’s image.
#' @param image_height The card’s image height in px. Defaults to '150px'.
#' @param category The card's category, displayed below the title.
#' @param commands Contextual menu commands for this component.
#' @return A TallInfoCard instance.
#' @export
ui_tall_info_card <- function(
  box,
  name,
  title,
  caption,
  label = NULL,
  icon = NULL,
  image = NULL,
  image_height = NULL,
  category = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("name", "character", name)
  .guard_scalar("title", "character", title)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("label", "character", label)
  .guard_scalar("icon", "character", icon)
  .guard_scalar("image", "character", image)
  .guard_scalar("image_height", "character", image_height)
  .guard_scalar("category", "character", category)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    name=name,
    title=title,
    caption=caption,
    label=label,
    icon=icon,
    image=image,
    image_height=image_height,
    category=category,
    commands=commands,
    view='tall_info')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTallInfoCard"))
  return(.o)
}

#' Create a tall stat card displaying a primary value, an auxiliary value and a series plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed below the primary value.
#' @param plot_data The plot's data.
#' @param plot_value The data field to use for y-axis values.
#' @param plot_zero_value The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
#' @param plot_category The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
#' @param plot_type The type of plot. Defaults to `area`.
#'   One of 'area', 'interval'. See enum h2o_wave.ui.TallSeriesStatCardPlotType.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.TallSeriesStatCardPlotCurve.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A TallSeriesStatCard instance.
#' @export
ui_tall_series_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  plot_data,
  plot_value,
  plot_zero_value = NULL,
  plot_category = NULL,
  plot_type = NULL,
  plot_curve = NULL,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  # TODO Validate plot_data: Data
  .guard_scalar("plot_value", "character", plot_value)
  .guard_scalar("plot_zero_value", "numeric", plot_zero_value)
  .guard_scalar("plot_category", "character", plot_category)
  # TODO Validate plot_type
  # TODO Validate plot_curve
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    plot_data=plot_data,
    plot_value=plot_value,
    plot_zero_value=plot_zero_value,
    plot_category=plot_category,
    plot_type=plot_type,
    plot_curve=plot_curve,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='tall_series_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTallSeriesStatCard"))
  return(.o)
}

#' Create a vertical label-value pairs collection. Icon in `ui.stat` is not yet supported in this card.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The individual stats to be displayed.
#' @param name An identifying name for this component.
#' @param commands Contextual menu commands for this component.
#' @return A TallStatsCard instance.
#' @export
ui_tall_stats_card <- function(
  box,
  items,
  name = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveStat", items)
  .guard_scalar("name", "character", name)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    name=name,
    commands=commands,
    view='tall_stats')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTallStatsCard"))
  return(.o)
}

#' Render dynamic content using an HTML template.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param content The Handlebars template. https://handlebarsjs.com/guide/
#' @param data Data for the Handlebars template.
#' @param commands Contextual menu commands for this component.
#' @return A TemplateCard instance.
#' @export
ui_template_card <- function(
  box,
  title,
  content,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("content", "character", content)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    content=content,
    data=data,
    commands=commands,
    view='template')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveTemplateCard"))
  return(.o)
}

#' Create a card containing a toolbar.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items Items to render.
#' @param secondary_items Items to render on the right side (or left, in RTL).
#' @param overflow_items Items to render in an overflow menu.
#' @param commands Contextual menu commands for this component.
#' @return A ToolbarCard instance.
#' @export
ui_toolbar_card <- function(
  box,
  items,
  secondary_items = NULL,
  overflow_items = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_vector("items", "WaveCommand", items)
  .guard_vector("secondary_items", "WaveCommand", secondary_items)
  .guard_vector("overflow_items", "WaveCommand", overflow_items)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    items=items,
    secondary_items=secondary_items,
    overflow_items=overflow_items,
    commands=commands,
    view='toolbar')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveToolbarCard"))
  return(.o)
}

#' Create a card containing a Vega-lite plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title of this card.
#' @param specification The Vega-lite specification.
#' @param data Data for the plot, if any.
#' @param grammar Vega grammar to use. Defaults to 'vega-lite'.
#'   One of 'vega-lite', 'vega'. See enum h2o_wave.ui.VegaCardGrammar.
#' @param commands Contextual menu commands for this component.
#' @return A VegaCard instance.
#' @export
ui_vega_card <- function(
  box,
  title,
  specification,
  data = NULL,
  grammar = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("specification", "character", specification)
  # TODO Validate data: Rec
  # TODO Validate grammar
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    specification=specification,
    data=data,
    grammar=grammar,
    commands=commands,
    view='vega')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveVegaCard"))
  return(.o)
}

#' Create a wide article preview card displaying a persona, image, title, caption, and optional buttons.
#'
#' @param box A string indicating how to place this component on the page.
#' @param persona The card's user avatar, 'size' prop is restricted to 'xs'.
#' @param image The card’s image displayed on the left-hand side.
#' @param title The card's title on the right-hand side
#' @param name An identifying name for this card. Makes the card clickable, similar to a button.
#' @param aux_value The card's auxiliary text, displayed on the right-hand side of the header.
#' @param items The card's buttons, displayed under the caption.
#' @param content The card's markdown content, displayed below the title on the right-hand side.
#' @param commands Contextual menu commands for this component.
#' @return A WideArticlePreviewCard instance.
#' @export
ui_wide_article_preview_card <- function(
  box,
  persona,
  image,
  title,
  name = NULL,
  aux_value = NULL,
  items = NULL,
  content = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("persona", "WaveComponent", persona)
  .guard_scalar("image", "character", image)
  .guard_scalar("title", "character", title)
  .guard_scalar("name", "character", name)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_vector("items", "WaveComponent", items)
  .guard_scalar("content", "character", content)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    persona=persona,
    image=image,
    title=title,
    name=name,
    aux_value=aux_value,
    items=items,
    content=content,
    commands=commands,
    view='wide_article_preview')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWideArticlePreviewCard"))
  return(.o)
}

#' Create a wide stat card displaying a primary value, an auxiliary value and a progress bar.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed next to the primary value.
#' @param progress The value of the progress bar, between 0 and 1.
#' @param plot_color The color of the progress bar.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A WideBarStatCard instance.
#' @export
ui_wide_bar_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("progress", "numeric", progress)
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='wide_bar_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWideBarStatCard"))
  return(.o)
}

#' Create a wide stat card displaying a primary value, an auxiliary value and a progress gauge.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed next to the primary value.
#' @param progress The value of the progress gauge, between 0 and 1.
#' @param plot_color The color of the progress gauge.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A WideGaugeStatCard instance.
#' @export
ui_wide_gauge_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  .guard_scalar("progress", "numeric", progress)
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='wide_gauge_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWideGaugeStatCard"))
  return(.o)
}

#' Create a wide information card displaying a title, caption, and either an icon or image.
#'
#' @param box A string indicating how to place this component on the page.
#' @param name An identifying name for this card. Makes the card clickable, similar to a button.
#' @param title The card's title.
#' @param caption The card's caption, displayed below the subtitle. Supports markdown.
#' @param label Label of a button rendered at the bottom of the card. If specified, whole card is not clickable anymore..
#' @param subtitle The card's subtitle, displayed below the title.
#' @param align The card's alignment, determines the position of an image / icon. Defaults to 'left'.
#'   One of 'left', 'right'. See enum h2o_wave.ui.WideInfoCardAlign.
#' @param icon The card's icon.
#' @param image The card’s image.
#' @param category The card's category, displayed above the title.
#' @param commands Contextual menu commands for this component.
#' @return A WideInfoCard instance.
#' @export
ui_wide_info_card <- function(
  box,
  name,
  title,
  caption,
  label = NULL,
  subtitle = NULL,
  align = NULL,
  icon = NULL,
  image = NULL,
  category = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("name", "character", name)
  .guard_scalar("title", "character", title)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("label", "character", label)
  .guard_scalar("subtitle", "character", subtitle)
  # TODO Validate align
  .guard_scalar("icon", "character", icon)
  .guard_scalar("image", "character", image)
  .guard_scalar("category", "character", category)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    name=name,
    title=title,
    caption=caption,
    label=label,
    subtitle=subtitle,
    align=align,
    icon=icon,
    image=image,
    category=category,
    commands=commands,
    view='wide_info')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWideInfoCard"))
  return(.o)
}

#' Card's pie chart data to be displayed.
#'
#' @param label The description for the pie, displayed in the legend.
#' @param value The formatted value displayed on the pie.
#' @param fraction A value between 0 and 1 indicating the size of the pie.
#' @param color The color of the pie.
#' @param aux_value The auxiliary value, displayed below the label.
#' @return A Pie instance.
#' @export
ui_pie <- function(
  label,
  value,
  fraction,
  color,
  aux_value = NULL) {
  .guard_scalar("label", "character", label)
  .guard_scalar("value", "character", value)
  .guard_scalar("fraction", "numeric", fraction)
  .guard_scalar("color", "character", color)
  .guard_scalar("aux_value", "character", aux_value)
  .o <- list(
    label=label,
    value=value,
    fraction=fraction,
    color=color,
    aux_value=aux_value)
  class(.o) <- append(class(.o), c(.wave_obj, "WavePie"))
  return(.o)
}

#' Create a wide pie stat card displaying a title and pie chart with legend.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param pies The pies to be included in the pie chart.
#' @param commands Contextual menu commands for this component.
#' @return A WidePieStatCard instance.
#' @export
ui_wide_pie_stat_card <- function(
  box,
  title,
  pies,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_vector("pies", "WavePie", pies)
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    pies=pies,
    commands=commands,
    view='wide_pie_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWidePieStatCard"))
  return(.o)
}

#' Create a wide plot card displaying a title, caption and a plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param caption The card's caption, displayed below the title.
#' @param plot The card's plot.
#' @param data The card's plot data.
#' @param commands Contextual menu commands for this component.
#' @return A WidePlotCard instance.
#' @export
ui_wide_plot_card <- function(
  box,
  title,
  caption,
  plot,
  data,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("caption", "character", caption)
  .guard_scalar("plot", "WavePlot", plot)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    caption=caption,
    plot=plot,
    data=data,
    commands=commands,
    view='wide_plot')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWidePlotCard"))
  return(.o)
}

#' Create a wide stat card displaying a primary value, an auxiliary value and a series plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param value The primary value displayed.
#' @param aux_value The auxiliary value displayed below the primary value.
#' @param plot_data The plot's data.
#' @param plot_value The data field to use for y-axis values.
#' @param plot_zero_value The base value to use for each y-axis mark. Set this to `0` if you want to pin the x-axis at `y=0`. If not provided, the minimum value from the data is used.
#' @param plot_category The data field to use for x-axis values (ignored if `plot_type` is `area`; must be provided if `plot_type` is `interval`). Defaults to 'x'.
#' @param plot_type The type of plot. Defaults to `area`.
#'   One of 'area', 'interval'. See enum h2o_wave.ui.WideSeriesStatCardPlotType.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'. See enum h2o_wave.ui.WideSeriesStatCardPlotCurve.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A WideSeriesStatCard instance.
#' @export
ui_wide_series_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  plot_data,
  plot_value,
  plot_zero_value = NULL,
  plot_category = NULL,
  plot_type = NULL,
  plot_curve = NULL,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  .guard_scalar("box", "character", box)
  .guard_scalar("title", "character", title)
  .guard_scalar("value", "character", value)
  .guard_scalar("aux_value", "character", aux_value)
  # TODO Validate plot_data: Data
  .guard_scalar("plot_value", "character", plot_value)
  .guard_scalar("plot_zero_value", "numeric", plot_zero_value)
  .guard_scalar("plot_category", "character", plot_category)
  # TODO Validate plot_type
  # TODO Validate plot_curve
  .guard_scalar("plot_color", "character", plot_color)
  # TODO Validate data: Rec
  .guard_vector("commands", "WaveCommand", commands)
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    plot_data=plot_data,
    plot_value=plot_value,
    plot_zero_value=plot_zero_value,
    plot_category=plot_category,
    plot_type=plot_type,
    plot_curve=plot_curve,
    plot_color=plot_color,
    data=data,
    commands=commands,
    view='wide_series_stat')
  class(.o) <- append(class(.o), c(.wave_obj, "WaveWideSeriesStatCard"))
  return(.o)
}