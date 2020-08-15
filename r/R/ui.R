#
# THIS FILE IS GENERATED; DO NOT EDIT
#

.to_json <- function(x) {
  # TODO: Eliminate NULL-valued entries from x first.
  jsonlite::toJSON(x, auto_unbox = TRUE)
}

.h2oq_obj <- "h2oq_Object"

dump_object <- function(x) {
  if(is(x, .h2oq_obj)) {
    to_json(x)
  } else {
    stop("cannot dump")
  }
}


#' Create a breadcrumb for a `h2o_q.types.BreadcrumbsCard()`.
#'
#' @param name The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
#' @param label The label to display.
#' @return A Breadcrumb instance.
ui_breadcrumb <- function(
  name,
  label) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  .o <- list(
    name=name,
    label=label)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Breadcrumb"))
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
#' @param data Data associated with this command, if any.
#' @return A Command instance.
ui_command <- function(
  name,
  label = NULL,
  caption = NULL,
  icon = NULL,
  items = NULL,
  data = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  if(!is.null(icon)) {
    if(!is(icon, "character")) {
      stop("icon: expected character")
    }
  }
  # TODO Validate items: repeated Command
  if(!is.null(data)) {
    if(!is(data, "character")) {
      stop("data: expected character")
    }
  }
  .o <- list(
    name=name,
    label=label,
    caption=caption,
    icon=icon,
    items=items,
    data=data)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Command"))
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
#' @param items A list of `h2o_q.types.Breadcrumb` instances to display. See `h2o_q.ui.breadcrumb()`
#' @param commands Contextual menu commands for this component.
#' @return A BreadcrumbsCard instance.
ui_breadcrumbs_card <- function(
  box,
  items,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  # TODO Validate items: repeated Breadcrumb
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    items=items,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_BreadcrumbsCard"))
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
#'   One of 'horizontal', 'vertical'.
#' @param justify Layout strategy for main axis.
#'   One of 'start', 'end', 'center', 'between', 'around'.
#' @param align Layout strategy for cross axis.
#'   One of 'start', 'end', 'center', 'baseline', 'stretch'.
#' @param wrap Wrapping strategy.
#'   One of 'start', 'end', 'center', 'between', 'around', 'stretch'.
#' @param commands Contextual menu commands for this component.
#' @return A FlexCard instance.
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
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(item_view)) {
    if(!is(item_view, "character")) {
      stop("item_view: expected character")
    }
  }
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  # TODO Validate direction
  # TODO Validate justify
  # TODO Validate align
  # TODO Validate wrap
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    item_view=item_view,
    item_props=item_props,
    data=data,
    direction=direction,
    justify=justify,
    align=align,
    wrap=wrap,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_FlexCard"))
  return(.o)
}

#' Create text content.
#'
#' @param content The text content.
#' @param size The font size of the text content.
#'   One of 'xl', 'l', 'm', 's', 'xs'.
#' @param tooltip Tooltip message.
#' @return A Text instance.
ui_text <- function(
  content,
  size = NULL,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  # TODO Validate size
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text=list(
    content=content,
    size=size,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create extra-large sized text content.
#'
#' @param content The text content.
#' @param tooltip Tooltip message.
#' @return A TextXl instance.
ui_text_xl <- function(
  content,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text_xl=list(
    content=content,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create large sized text content.
#'
#' @param content The text content.
#' @param tooltip Tooltip message.
#' @return A TextL instance.
ui_text_l <- function(
  content,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text_l=list(
    content=content,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create medium sized text content.
#'
#' @param content The text content.
#' @param tooltip Tooltip message.
#' @return A TextM instance.
ui_text_m <- function(
  content,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text_m=list(
    content=content,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create small sized text content.
#'
#' @param content The text content.
#' @param tooltip Tooltip message.
#' @return A TextS instance.
ui_text_s <- function(
  content,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text_s=list(
    content=content,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create extra-small sized text content.
#'
#' @param content The text content.
#' @param tooltip Tooltip message.
#' @return A TextXs instance.
ui_text_xs <- function(
  content,
  tooltip = NULL) {
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(text_xs=list(
    content=content,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Label instance.
ui_label <- function(
  label,
  required = NULL,
  disabled = NULL,
  tooltip = NULL) {
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(required)) {
    if(!is(required, "logical")) {
      stop("required: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(label=list(
    label=label,
    required=required,
    disabled=disabled,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a separator.
#' 
#' A separator visually separates content into groups.
#'
#' @param label The text displayed on the separator.
#' @return A Separator instance.
ui_separator <- function(
  label = NULL) {
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  .o <- list(separator=list(
    label=label))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param label The text displayed above the bar.
#' @param caption The text displayed below the bar.
#' @param value The progress, between 0.0 and 1.0, or -1 (default) if indeterminate.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Progress instance.
ui_progress <- function(
  label,
  caption = NULL,
  value = NULL,
  tooltip = NULL) {
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "numeric")) {
      stop("value: expected numeric")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(progress=list(
    label=label,
    caption=caption,
    value=value,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a message bar.
#' 
#' A message bar is an area at the top of a primary view that displays relevant status information.
#' You can use a message bar to tell the user about a situation that does not require their immediate attention and
#' therefore does not need to block other activities.
#'
#' @param type The icon and color of the message bar.
#'   One of 'info', 'error', 'warning', 'success', 'danger', 'blocked'.
#' @param text The text displayed on the message bar.
#' @return A MessageBar instance.
ui_message_bar <- function(
  type = NULL,
  text = NULL) {
  # TODO Validate type
  if(!is.null(text)) {
    if(!is(text, "character")) {
      stop("text: expected character")
    }
  }
  .o <- list(message_bar=list(
    type=type,
    text=text))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Textbox instance.
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
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(placeholder)) {
    if(!is(placeholder, "character")) {
      stop("placeholder: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(mask)) {
    if(!is(mask, "character")) {
      stop("mask: expected character")
    }
  }
  if(!is.null(icon)) {
    if(!is(icon, "character")) {
      stop("icon: expected character")
    }
  }
  if(!is.null(prefix)) {
    if(!is(prefix, "character")) {
      stop("prefix: expected character")
    }
  }
  if(!is.null(suffix)) {
    if(!is(suffix, "character")) {
      stop("suffix: expected character")
    }
  }
  if(!is.null(error)) {
    if(!is(error, "character")) {
      stop("error: expected character")
    }
  }
  if(!is.null(required)) {
    if(!is(required, "logical")) {
      stop("required: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(readonly)) {
    if(!is(readonly, "logical")) {
      stop("readonly: expected logical")
    }
  }
  if(!is.null(multiline)) {
    if(!is(multiline, "logical")) {
      stop("multiline: expected logical")
    }
  }
  if(!is.null(password)) {
    if(!is(password, "logical")) {
      stop("password: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
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
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Checkbox instance.
ui_checkbox <- function(
  name,
  label = NULL,
  value = NULL,
  indeterminate = NULL,
  disabled = NULL,
  trigger = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "logical")) {
      stop("value: expected logical")
    }
  }
  if(!is.null(indeterminate)) {
    if(!is(indeterminate, "logical")) {
      stop("indeterminate: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(trigger)) {
    if(!is(trigger, "logical")) {
      stop("trigger: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(checkbox=list(
    name=name,
    label=label,
    value=value,
    indeterminate=indeterminate,
    disabled=disabled,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Toggle instance.
ui_toggle <- function(
  name,
  label = NULL,
  value = NULL,
  disabled = NULL,
  trigger = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "logical")) {
      stop("value: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(trigger)) {
    if(!is(trigger, "logical")) {
      stop("trigger: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(toggle=list(
    name=name,
    label=label,
    value=value,
    disabled=disabled,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a choice for a checklist, choice group or dropdown.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param disabled True if the checkbox is disabled.
#' @return A Choice instance.
ui_choice <- function(
  name,
  label = NULL,
  disabled = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  .o <- list(
    name=name,
    label=label,
    disabled=disabled)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Choice"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A ChoiceGroup instance.
ui_choice_group <- function(
  name,
  label = NULL,
  value = NULL,
  choices = NULL,
  required = NULL,
  trigger = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  # TODO Validate choices: repeated Choice
  if(!is.null(required)) {
    if(!is(required, "logical")) {
      stop("required: expected logical")
    }
  }
  if(!is.null(trigger)) {
    if(!is(trigger, "logical")) {
      stop("trigger: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(choice_group=list(
    name=name,
    label=label,
    value=value,
    choices=choices,
    required=required,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Checklist instance.
ui_checklist <- function(
  name,
  label = NULL,
  values = NULL,
  choices = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(values)) {
    if(FALSE %in% unlist(lapply(values,function(x){ is(x, "character") }))) {
       stop("values: expected list of character")
    }
  }
  # TODO Validate choices: repeated Choice
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(checklist=list(
    name=name,
    label=label,
    values=values,
    choices=choices,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Dropdown instance.
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
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(placeholder)) {
    if(!is(placeholder, "character")) {
      stop("placeholder: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(values)) {
    if(FALSE %in% unlist(lapply(values,function(x){ is(x, "character") }))) {
       stop("values: expected list of character")
    }
  }
  # TODO Validate choices: repeated Choice
  if(!is.null(required)) {
    if(!is(required, "logical")) {
      stop("required: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(trigger)) {
    if(!is(trigger, "logical")) {
      stop("trigger: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
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
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param choices The choices to be presented.
#' @param error Text to be displayed as an error below the text box.
#' @param disabled True if this field is disabled.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Combobox instance.
ui_combobox <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  choices = NULL,
  error = NULL,
  disabled = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(placeholder)) {
    if(!is(placeholder, "character")) {
      stop("placeholder: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(choices)) {
    if(FALSE %in% unlist(lapply(choices,function(x){ is(x, "character") }))) {
       stop("choices: expected list of character")
    }
  }
  if(!is.null(error)) {
    if(!is(error, "character")) {
      stop("error: expected character")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(combobox=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    choices=choices,
    error=error,
    disabled=disabled,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Slider instance.
ui_slider <- function(
  name,
  label = NULL,
  min = NULL,
  max = NULL,
  step = NULL,
  value = NULL,
  disabled = NULL,
  trigger = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(min)) {
    if(!is(min, "numeric")) {
      stop("min: expected numeric")
    }
  }
  if(!is.null(max)) {
    if(!is(max, "numeric")) {
      stop("max: expected numeric")
    }
  }
  if(!is.null(step)) {
    if(!is(step, "numeric")) {
      stop("step: expected numeric")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "numeric")) {
      stop("value: expected numeric")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(trigger)) {
    if(!is(trigger, "logical")) {
      stop("trigger: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(slider=list(
    name=name,
    label=label,
    min=min,
    max=max,
    step=step,
    value=value,
    disabled=disabled,
    trigger=trigger,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a spinbox.
#' 
#' A spinbox allows the user to incrementally adjust a value in small steps.
#' It is mainly used for numeric values, but other values are supported too.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param min The minimum value of the spinbox.
#' @param max The maximum value of the spinbox.
#' @param step The difference between two adjacent values of the spinbox.
#' @param value The current value of the spinbox.
#' @param disabled True if this field is disabled.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Spinbox instance.
ui_spinbox <- function(
  name,
  label = NULL,
  min = NULL,
  max = NULL,
  step = NULL,
  value = NULL,
  disabled = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(min)) {
    if(!is(min, "numeric")) {
      stop("min: expected numeric")
    }
  }
  if(!is.null(max)) {
    if(!is(max, "numeric")) {
      stop("max: expected numeric")
    }
  }
  if(!is.null(step)) {
    if(!is(step, "numeric")) {
      stop("step: expected numeric")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "numeric")) {
      stop("value: expected numeric")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(spinbox=list(
    name=name,
    label=label,
    min=min,
    max=max,
    step=step,
    value=value,
    disabled=disabled,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A DatePicker instance.
ui_date_picker <- function(
  name,
  label = NULL,
  placeholder = NULL,
  value = NULL,
  disabled = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(placeholder)) {
    if(!is(placeholder, "character")) {
      stop("placeholder: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(date_picker=list(
    name=name,
    label=label,
    placeholder=placeholder,
    value=value,
    disabled=disabled,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a color picker.
#' 
#' A date picker allows a user to pick a color value.
#' If the 'choices' parameter is set, a swatch picker is displayed instead of the standard color picker.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param value The selected color (CSS-compatible string)
#' @param choices A list of colors (CSS-compatible strings) to limit color choices to.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A ColorPicker instance.
ui_color_picker <- function(
  name,
  label = NULL,
  value = NULL,
  choices = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(choices)) {
    if(FALSE %in% unlist(lapply(choices,function(x){ is(x, "character") }))) {
       stop("choices: expected list of character")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(color_picker=list(
    name=name,
    label=label,
    value=value,
    choices=choices,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @param caption The caption displayed below the label. Setting a caption renders a compound button.
#' @param value A value for this button. If a value is set, it is used for the button's submitted instead of a boolean True.
#' @param primary True if the button should be rendered as the primary button in the set.
#' @param disabled True if the button should be disabled.
#' @param link True if the button should be rendered as link text and not a standard button.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Button instance.
ui_button <- function(
  name,
  label = NULL,
  caption = NULL,
  value = NULL,
  primary = NULL,
  disabled = NULL,
  link = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(primary)) {
    if(!is(primary, "logical")) {
      stop("primary: expected logical")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(link)) {
    if(!is(link, "logical")) {
      stop("link: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(button=list(
    name=name,
    label=label,
    caption=caption,
    value=value,
    primary=primary,
    disabled=disabled,
    link=link,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a set of buttons to be layed out horizontally.
#'
#' @param items The button in this set.
#' @return A Buttons instance.
ui_buttons <- function(
  items) {
  # TODO Validate items: repeated Component
  .o <- list(buttons=list(
    items=items))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a file upload component.
#' A file upload component allows a user to browse, select and upload one or more files.
#'
#' @param name An identifying name for this component.
#' @param label Text to be displayed alongside the component.
#' @param multiple True if the component should allow multiple files to be uploaded.
#' @param file_extensions List of allowed file extensions, e.g. `pdf`, `docx`, etc.
#' @param max_file_size Maximum allowed size (Mb) per file. Defaults to no limit.
#' @param max_size Maximum allowed size (Mb) for all files combined. Defaults to no limit.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A FileUpload instance.
ui_file_upload <- function(
  name,
  label = NULL,
  multiple = NULL,
  file_extensions = NULL,
  max_file_size = NULL,
  max_size = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(multiple)) {
    if(!is(multiple, "logical")) {
      stop("multiple: expected logical")
    }
  }
  if(!is.null(file_extensions)) {
    if(FALSE %in% unlist(lapply(file_extensions,function(x){ is(x, "character") }))) {
       stop("file_extensions: expected list of character")
    }
  }
  if(!is.null(max_file_size)) {
    if(!is(max_file_size, "numeric")) {
      stop("max_file_size: expected numeric")
    }
  }
  if(!is.null(max_size)) {
    if(!is(max_size, "numeric")) {
      stop("max_size: expected numeric")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(file_upload=list(
    name=name,
    label=label,
    multiple=multiple,
    file_extensions=file_extensions,
    max_file_size=max_file_size,
    max_size=max_size,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a table column.
#'
#' @param name An identifying name for this column.
#' @param label The text displayed on the column header.
#' @return A TableColumn instance.
ui_table_column <- function(
  name,
  label) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  .o <- list(
    name=name,
    label=label)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TableColumn"))
  return(.o)
}

#' Create a table row.
#'
#' @param name An identifying name for this row.
#' @param cells The cells in this row (displayed left to right).
#' @return A TableRow instance.
ui_table_row <- function(
  name,
  cells) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(cells)) {
    if(FALSE %in% unlist(lapply(cells,function(x){ is(x, "character") }))) {
       stop("cells: expected list of character")
    }
  }
  .o <- list(
    name=name,
    cells=cells)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TableRow"))
  return(.o)
}

#' Create an interactive table.
#' 
#' This table differs from a markdown table in that it supports clicking or selecting rows. If you simply want to
#' display a non-interactive table of information, use a markdown table.
#' 
#' If `multiple` is set to False (default), each row in the table is clickable. When a row is clicked, the form is
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
#' @param name An identifying name for this component.
#' @param columns The columns in this table.
#' @param rows The rows in this table.
#' @param multiple True to allow multiple rows to be selected.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Table instance.
ui_table <- function(
  name,
  columns,
  rows,
  multiple = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  # TODO Validate columns: repeated TableColumn
  # TODO Validate rows: repeated TableRow
  if(!is.null(multiple)) {
    if(!is(multiple, "logical")) {
      stop("multiple: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(table=list(
    name=name,
    columns=columns,
    rows=rows,
    multiple=multiple,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a hyperlink.
#' 
#' Hyperlinks can be internal or external.
#' Internal hyperlinks have paths that begin with a `/` and point to URLs within the Q UI.
#' All other kinds of paths are treated as external hyperlinks.
#'
#' @param label The text to be displayed. If blank, the `path` is used as the label.
#' @param path The path or URL to link to.
#' @param disabled True if the link should be disabled.
#' @param download True if the link should be used for file download.
#' @param button True if the link should be rendered as a button.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Link instance.
ui_link <- function(
  label = NULL,
  path = NULL,
  disabled = NULL,
  download = NULL,
  button = NULL,
  tooltip = NULL) {
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(path)) {
    if(!is(path, "character")) {
      stop("path: expected character")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(download)) {
    if(!is(download, "logical")) {
      stop("download: expected logical")
    }
  }
  if(!is.null(button)) {
    if(!is(button, "logical")) {
      stop("button: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(link=list(
    label=label,
    path=path,
    disabled=disabled,
    download=download,
    button=button,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a tab.
#'
#' @param name An identifying name for this component.
#' @param label The text displayed on the tab.
#' @param icon The icon displayed on the tab.
#' @return A Tab instance.
ui_tab <- function(
  name,
  label = NULL,
  icon = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(icon)) {
    if(!is(icon, "character")) {
      stop("icon: expected character")
    }
  }
  .o <- list(
    name=name,
    label=label,
    icon=icon)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Tab"))
  return(.o)
}

#' Create a tab bar.
#'
#' @param name An identifying name for this component.
#' @param value The name of the tab to select.
#' @param items The tabs in this tab bar.
#' @return A Tabs instance.
ui_tabs <- function(
  name,
  value = NULL,
  items = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  # TODO Validate items: repeated Tab
  .o <- list(tabs=list(
    name=name,
    value=value,
    items=items))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
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
#' @return A Expander instance.
ui_expander <- function(
  name,
  label = NULL,
  expanded = NULL,
  items = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(expanded)) {
    if(!is(expanded, "logical")) {
      stop("expanded: expected logical")
    }
  }
  # TODO Validate items: repeated Component
  .o <- list(expander=list(
    name=name,
    label=label,
    expanded=expanded,
    items=items))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a new inline frame (an `iframe`).
#'
#' @param path The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
#' @param content The HTML content of the page. A string containing `<html>...</html>`.
#' @param width The width of the frame, e.g. `200px`, `50%`, etc. Defaults to `100%`.
#' @param height The height of the frame, e.g. `200px`, `50%`, etc. Defaults to `150px`.
#' @return A Frame instance.
ui_frame <- function(
  path = NULL,
  content = NULL,
  width = NULL,
  height = NULL) {
  if(!is.null(path)) {
    if(!is(path, "character")) {
      stop("path: expected character")
    }
  }
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  if(!is.null(width)) {
    if(!is(width, "character")) {
      stop("width: expected character")
    }
  }
  if(!is.null(height)) {
    if(!is(height, "character")) {
      stop("height: expected character")
    }
  }
  .o <- list(frame=list(
    path=path,
    content=content,
    width=width,
    height=height))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a picker.
#' Pickers are used to select one or more choices, such as tags or files, from a list.
#' Use a picker to allow the user to quickly search for or manage a few tags or files.
#'
#' @param name An identifying name for this component.
#' @param choices The choices to be presented.
#' @param label Text to be displayed above the component.
#' @param values The names of the selected choices.
#' @param max_choices Maximum number of selectable choices. Defaults to no limit.
#' @param disabled Controls whether the picker should be disabled or not.
#' @param tooltip An optional tooltip message displayed when a user clicks the help icon to the right of the component.
#' @return A Picker instance.
ui_picker <- function(
  name,
  choices,
  label = NULL,
  values = NULL,
  max_choices = NULL,
  disabled = NULL,
  tooltip = NULL) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  # TODO Validate choices: repeated Choice
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(values)) {
    if(FALSE %in% unlist(lapply(values,function(x){ is(x, "character") }))) {
       stop("values: expected list of character")
    }
  }
  if(!is.null(max_choices)) {
    if(!is(max_choices, "numeric")) {
      stop("max_choices: expected numeric")
    }
  }
  if(!is.null(disabled)) {
    if(!is(disabled, "logical")) {
      stop("disabled: expected logical")
    }
  }
  if(!is.null(tooltip)) {
    if(!is(tooltip, "character")) {
      stop("tooltip: expected character")
    }
  }
  .o <- list(picker=list(
    name=name,
    choices=choices,
    label=label,
    values=values,
    max_choices=max_choices,
    disabled=disabled,
    tooltip=tooltip))
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a component.
#'
#' @param text Text block.
#' @param text_xl Extra-large sized text block.
#' @param text_l Large sized text block.
#' @param text_m Medium sized text block.
#' @param text_s Small sized text block.
#' @param text_xs Extra-small sized text block.
#' @param label Label.
#' @param separator Separator.
#' @param progress Progress bar.
#' @param message_bar Message bar.
#' @param textbox Textbox.
#' @param checkbox Checkbox.
#' @param toggle Toggle.
#' @param choice_group Choice group.
#' @param checklist Checklist.
#' @param dropdown Dropdown.
#' @param combobox Combobox.
#' @param slider Slider.
#' @param spinbox Spinbox.
#' @param date_picker Date picker.
#' @param color_picker Color picker.
#' @param button Button.
#' @param buttons Button set.
#' @param file_upload File upload.
#' @param table Table.
#' @param link Link.
#' @param tabs Tabs.
#' @param expander Expander.
#' @param frame Frame
#' @param picker Picker
#' @return A Component instance.
ui_component <- function(
  text = NULL,
  text_xl = NULL,
  text_l = NULL,
  text_m = NULL,
  text_s = NULL,
  text_xs = NULL,
  label = NULL,
  separator = NULL,
  progress = NULL,
  message_bar = NULL,
  textbox = NULL,
  checkbox = NULL,
  toggle = NULL,
  choice_group = NULL,
  checklist = NULL,
  dropdown = NULL,
  combobox = NULL,
  slider = NULL,
  spinbox = NULL,
  date_picker = NULL,
  color_picker = NULL,
  button = NULL,
  buttons = NULL,
  file_upload = NULL,
  table = NULL,
  link = NULL,
  tabs = NULL,
  expander = NULL,
  frame = NULL,
  picker = NULL) {
  # TODO Validate text: Text
  # TODO Validate text_xl: TextXl
  # TODO Validate text_l: TextL
  # TODO Validate text_m: TextM
  # TODO Validate text_s: TextS
  # TODO Validate text_xs: TextXs
  # TODO Validate label: Label
  # TODO Validate separator: Separator
  # TODO Validate progress: Progress
  # TODO Validate message_bar: MessageBar
  # TODO Validate textbox: Textbox
  # TODO Validate checkbox: Checkbox
  # TODO Validate toggle: Toggle
  # TODO Validate choice_group: ChoiceGroup
  # TODO Validate checklist: Checklist
  # TODO Validate dropdown: Dropdown
  # TODO Validate combobox: Combobox
  # TODO Validate slider: Slider
  # TODO Validate spinbox: Spinbox
  # TODO Validate date_picker: DatePicker
  # TODO Validate color_picker: ColorPicker
  # TODO Validate button: Button
  # TODO Validate buttons: Buttons
  # TODO Validate file_upload: FileUpload
  # TODO Validate table: Table
  # TODO Validate link: Link
  # TODO Validate tabs: Tabs
  # TODO Validate expander: Expander
  # TODO Validate frame: Frame
  # TODO Validate picker: Picker
  .o <- list(
    text=text,
    text_xl=text_xl,
    text_l=text_l,
    text_m=text_m,
    text_s=text_s,
    text_xs=text_xs,
    label=label,
    separator=separator,
    progress=progress,
    message_bar=message_bar,
    textbox=textbox,
    checkbox=checkbox,
    toggle=toggle,
    choice_group=choice_group,
    checklist=checklist,
    dropdown=dropdown,
    combobox=combobox,
    slider=slider,
    spinbox=spinbox,
    date_picker=date_picker,
    color_picker=color_picker,
    button=button,
    buttons=buttons,
    file_upload=file_upload,
    table=table,
    link=link,
    tabs=tabs,
    expander=expander,
    frame=frame,
    picker=picker)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Component"))
  return(.o)
}

#' Create a form.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The components in this form.
#' @param commands Contextual menu commands for this component.
#' @return A FormCard instance.
ui_form_card <- function(
  box,
  items,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  # TODO Validate items: repeated Component
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    items=items,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_FormCard"))
  return(.o)
}

#' Render a card containing a HTML page inside an inline frame (an `iframe`).
#' 
#' Either a path or content can be provided as arguments.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param path The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html`
#' @param content The HTML content of the page. A string containing `<html>...</html>`
#' @param commands Contextual menu commands for this component.
#' @return A FrameCard instance.
ui_frame_card <- function(
  box,
  title,
  path = NULL,
  content = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(path)) {
    if(!is(path, "character")) {
      stop("path: expected character")
    }
  }
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    path=path,
    content=content,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_FrameCard"))
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
ui_graphics_card <- function(
  box,
  view_box,
  stage = NULL,
  scene = NULL,
  width = NULL,
  height = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(view_box)) {
    if(!is(view_box, "character")) {
      stop("view_box: expected character")
    }
  }
  # TODO Validate stage: Recs
  # TODO Validate scene: Data
  if(!is.null(width)) {
    if(!is(width, "character")) {
      stop("width: expected character")
    }
  }
  if(!is.null(height)) {
    if(!is(height, "character")) {
      stop("height: expected character")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    view_box=view_box,
    stage=stage,
    scene=scene,
    width=width,
    height=height,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_GraphicsCard"))
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
ui_grid_card <- function(
  box,
  title,
  cells,
  data,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  # TODO Validate cells: Data
  # TODO Validate data: Data
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    cells=cells,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_GridCard"))
  return(.o)
}

#' Render a card containing a HTML page inside an inline frame (iframe).
#' 
#' Either a path or content can be provided as arguments.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title.
#' @param subtitle The subtitle, displayed below the title.
#' @param icon The icon type, displayed to the left.
#' @param icon_color The icon's color.
#' @param commands Contextual menu commands for this component.
#' @return A HeaderCard instance.
ui_header_card <- function(
  box,
  title,
  subtitle,
  icon = NULL,
  icon_color = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(subtitle)) {
    if(!is(subtitle, "character")) {
      stop("subtitle: expected character")
    }
  }
  if(!is.null(icon)) {
    if(!is(icon, "character")) {
      stop("icon: expected character")
    }
  }
  if(!is.null(icon_color)) {
    if(!is(icon_color, "character")) {
      stop("icon_color: expected character")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    subtitle=subtitle,
    icon=icon,
    icon_color=icon_color,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_HeaderCard"))
  return(.o)
}

#' Create a card that displays a base64-encoded image.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The card's title.
#' @param type The image MIME subtype. One of `apng`, `bmp`, `gif`, `x-icon`, `jpeg`, `png`, `webp`.
#' @param image Image data, base64-encoded.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A ImageCard instance.
ui_image_card <- function(
  box,
  title,
  type,
  image,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(type)) {
    if(!is(type, "character")) {
      stop("type: expected character")
    }
  }
  if(!is.null(image)) {
    if(!is(image, "character")) {
      stop("image: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    type=type,
    image=image,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_ImageCard"))
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
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  if(!is.null(value_caption)) {
    if(!is(value_caption, "character")) {
      stop("value_caption: expected character")
    }
  }
  if(!is.null(aux_value_caption)) {
    if(!is(aux_value_caption, "character")) {
      stop("aux_value_caption: expected character")
    }
  }
  if(!is.null(progress)) {
    if(!is(progress, "numeric")) {
      stop("progress: expected numeric")
    }
  }
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
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
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_LargeBarStatCard"))
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
ui_large_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  caption,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    caption=caption,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_LargeStatCard"))
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
ui_list_card <- function(
  box,
  title,
  item_view,
  item_props,
  data,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(item_view)) {
    if(!is(item_view, "character")) {
      stop("item_view: expected character")
    }
  }
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    item_view=item_view,
    item_props=item_props,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_ListCard"))
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
ui_list_item1_card <- function(
  box,
  title,
  caption,
  value,
  aux_value,
  data,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(caption)) {
    if(!is(caption, "character")) {
      stop("caption: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    caption=caption,
    value=value,
    aux_value=aux_value,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_ListItem1Card"))
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
#' @param commands Contextual menu commands for this component.
#' @return A MarkdownCard instance.
ui_markdown_card <- function(
  box,
  title,
  content,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    content=content,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_MarkdownCard"))
  return(.o)
}

#' Render HTML content.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param content The HTML content.
#' @param commands Contextual menu commands for this component.
#' @return A MarkupCard instance.
ui_markup_card <- function(
  box,
  title,
  content,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    content=content,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_MarkupCard"))
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
#' @param notification Display a desktop notification to the user.
#' @param commands Contextual menu commands for this component.
#' @return A MetaCard instance.
ui_meta_card <- function(
  box,
  title = NULL,
  refresh = NULL,
  notification = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(refresh)) {
    if(!is(refresh, "numeric")) {
      stop("refresh: expected numeric")
    }
  }
  if(!is.null(notification)) {
    if(!is(notification, "character")) {
      stop("notification: expected character")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    refresh=refresh,
    notification=notification,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_MetaCard"))
  return(.o)
}

#' Create a navigation item.
#'
#' @param name The name of this item. Prefix the name with a '#' to trigger hash-change navigation.
#' @param label The label to display.
#' @return A NavItem instance.
ui_nav_item <- function(
  name,
  label) {
  if(!is.null(name)) {
    if(!is(name, "character")) {
      stop("name: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  .o <- list(
    name=name,
    label=label)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_NavItem"))
  return(.o)
}

#' Create a group of navigation items.
#'
#' @param label The label to display for this group.
#' @param items The navigation items contained in this group.
#' @return A NavGroup instance.
ui_nav_group <- function(
  label,
  items) {
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  # TODO Validate items: repeated NavItem
  .o <- list(
    label=label,
    items=items)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_NavGroup"))
  return(.o)
}

#' Create a card containing a navigation pane.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items The navigation groups contained in this pane.
#' @param commands Contextual menu commands for this component.
#' @return A NavCard instance.
ui_nav_card <- function(
  box,
  items,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  # TODO Validate items: repeated NavGroup
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    items=items,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_NavCard"))
  return(.o)
}

#' Create a card displaying a collaborative Pixel art tool, just for kicks.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param data The data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A PixelArtCard instance.
ui_pixel_art_card <- function(
  box,
  title,
  data,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_PixelArtCard"))
  return(.o)
}

#' Create a specification for a layer of graphical marks such as bars, lines, points for a plot.
#' A plot can contain multiple such layers of marks.
#'
#' @param coord Coordinate system. `rect` is synonymous to `cartesian`. `theta` is transposed `polar`.
#'   One of 'rect', 'cartesian', 'polar', 'theta', 'helix'.
#' @param type Graphical geometry.
#'   One of 'interval', 'line', 'path', 'point', 'area', 'polygon', 'schema', 'edge', 'heatmap'.
#' @param x X field or value.
#' @param x0 X base field or value.
#' @param x1 X bin lower bound field or value. For histograms.
#' @param x2 X bin upper bound field or value. For histograms.
#' @param x_min X axis scale minimum.
#' @param x_max X axis scale maximum.
#' @param x_nice Whether to nice X axis scale ticks.
#' @param x_scale X axis scale type.
#'   One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
#' @param x_title X axis title.
#' @param y Y field or value.
#' @param y0 Y base field or value.
#' @param y1 Y bin lower bound field or value. For histograms.
#' @param y2 Y bin upper bound field or value. For histograms.
#' @param y_min Y axis scale minimum.
#' @param y_max Y axis scale maximum.
#' @param y_nice Whether to nice Y axis scale ticks.
#' @param y_scale Y axis scale type.
#'   One of 'linear', 'cat', 'category', 'identity', 'log', 'pow', 'time', 'timeCat', 'quantize', 'quantile'.
#' @param y_title Y axis title.
#' @param color Mark color field or value.
#' @param color_range Mark color range for multi-series plots. A string containing space-separated colors, e.g. `'#fee8c8 #fdbb84 #e34a33'`
#' @param shape Mark shape field or value for `point` mark types. Possible values are 'circle', 'square', 'bowtie', 'diamond', 'hexagon', 'triangle', 'triangle-down', 'cross', 'tick', 'plus', 'hyphen', 'line'.
#' @param shape_range Mark shape range for multi-series plots using `point` mark types. A string containing space-separated shapes, e.g. `'circle square diamond'`
#' @param size Mark size field or value.
#' @param size_range Mark size range. A string containing space-separated integers, e.g. `'4 30'`
#' @param stack Field to stack marks by, or 'auto' to infer.
#' @param dodge Field to dodge marks by, or 'auto' to infer.
#' @param curve Curve type for `line` and `area` mark types.
#'   One of 'none', 'smooth', 'step-before', 'step', 'step-after'.
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
#' @param label_overlap Strategy to use if labels overlap.
#' @param label_fill_color Label fill color.
#' @param label_fill_opacity Label fill opacity.
#' @param label_stroke_color Label stroke color.
#' @param label_stroke_opacity Label stroke opacity.
#' @param label_stroke_size Label stroke size (line width or pen thickness).
#' @param label_font_size Label font size.
#' @param label_font_weight Label font weight.
#' @param label_line_height Label line height.
#' @param label_align Label text alignment.
#'   One of 'left', 'right', 'center', 'start', 'end'.
#' @param ref_stroke_color Reference line stroke color.
#' @param ref_stroke_opacity Reference line stroke opacity.
#' @param ref_stroke_size Reference line stroke size (line width or pen thickness).
#' @param ref_stroke_dash Reference line stroke dash style. A string containing space-separated integers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25].
#' @return A Mark instance.
ui_mark <- function(
  coord = NULL,
  type = NULL,
  x = NULL,
  x0 = NULL,
  x1 = NULL,
  x2 = NULL,
  x_min = NULL,
  x_max = NULL,
  x_nice = NULL,
  x_scale = NULL,
  x_title = NULL,
  y = NULL,
  y0 = NULL,
  y1 = NULL,
  y2 = NULL,
  y_min = NULL,
  y_max = NULL,
  y_nice = NULL,
  y_scale = NULL,
  y_title = NULL,
  color = NULL,
  color_range = NULL,
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
  ref_stroke_dash = NULL) {
  # TODO Validate coord
  # TODO Validate type
  # TODO Validate x: V
  # TODO Validate x0: V
  # TODO Validate x1: V
  # TODO Validate x2: V
  if(!is.null(x_min)) {
    if(!is(x_min, "numeric")) {
      stop("x_min: expected numeric")
    }
  }
  if(!is.null(x_max)) {
    if(!is(x_max, "numeric")) {
      stop("x_max: expected numeric")
    }
  }
  if(!is.null(x_nice)) {
    if(!is(x_nice, "logical")) {
      stop("x_nice: expected logical")
    }
  }
  # TODO Validate x_scale
  if(!is.null(x_title)) {
    if(!is(x_title, "character")) {
      stop("x_title: expected character")
    }
  }
  # TODO Validate y: V
  # TODO Validate y0: V
  # TODO Validate y1: V
  # TODO Validate y2: V
  if(!is.null(y_min)) {
    if(!is(y_min, "numeric")) {
      stop("y_min: expected numeric")
    }
  }
  if(!is.null(y_max)) {
    if(!is(y_max, "numeric")) {
      stop("y_max: expected numeric")
    }
  }
  if(!is.null(y_nice)) {
    if(!is(y_nice, "logical")) {
      stop("y_nice: expected logical")
    }
  }
  # TODO Validate y_scale
  if(!is.null(y_title)) {
    if(!is(y_title, "character")) {
      stop("y_title: expected character")
    }
  }
  if(!is.null(color)) {
    if(!is(color, "character")) {
      stop("color: expected character")
    }
  }
  if(!is.null(color_range)) {
    if(!is(color_range, "character")) {
      stop("color_range: expected character")
    }
  }
  if(!is.null(shape)) {
    if(!is(shape, "character")) {
      stop("shape: expected character")
    }
  }
  if(!is.null(shape_range)) {
    if(!is(shape_range, "character")) {
      stop("shape_range: expected character")
    }
  }
  # TODO Validate size: V
  if(!is.null(size_range)) {
    if(!is(size_range, "character")) {
      stop("size_range: expected character")
    }
  }
  if(!is.null(stack)) {
    if(!is(stack, "character")) {
      stop("stack: expected character")
    }
  }
  if(!is.null(dodge)) {
    if(!is(dodge, "character")) {
      stop("dodge: expected character")
    }
  }
  # TODO Validate curve
  if(!is.null(fill_color)) {
    if(!is(fill_color, "character")) {
      stop("fill_color: expected character")
    }
  }
  if(!is.null(fill_opacity)) {
    if(!is(fill_opacity, "numeric")) {
      stop("fill_opacity: expected numeric")
    }
  }
  if(!is.null(stroke_color)) {
    if(!is(stroke_color, "character")) {
      stop("stroke_color: expected character")
    }
  }
  if(!is.null(stroke_opacity)) {
    if(!is(stroke_opacity, "numeric")) {
      stop("stroke_opacity: expected numeric")
    }
  }
  if(!is.null(stroke_size)) {
    if(!is(stroke_size, "numeric")) {
      stop("stroke_size: expected numeric")
    }
  }
  if(!is.null(stroke_dash)) {
    if(!is(stroke_dash, "character")) {
      stop("stroke_dash: expected character")
    }
  }
  if(!is.null(label)) {
    if(!is(label, "character")) {
      stop("label: expected character")
    }
  }
  if(!is.null(label_offset)) {
    if(!is(label_offset, "numeric")) {
      stop("label_offset: expected numeric")
    }
  }
  if(!is.null(label_offset_x)) {
    if(!is(label_offset_x, "numeric")) {
      stop("label_offset_x: expected numeric")
    }
  }
  if(!is.null(label_offset_y)) {
    if(!is(label_offset_y, "numeric")) {
      stop("label_offset_y: expected numeric")
    }
  }
  if(!is.null(label_rotation)) {
    if(!is(label_rotation, "character")) {
      stop("label_rotation: expected character")
    }
  }
  if(!is.null(label_position)) {
    if(!is(label_position, "character")) {
      stop("label_position: expected character")
    }
  }
  if(!is.null(label_overlap)) {
    if(!is(label_overlap, "character")) {
      stop("label_overlap: expected character")
    }
  }
  if(!is.null(label_fill_color)) {
    if(!is(label_fill_color, "character")) {
      stop("label_fill_color: expected character")
    }
  }
  if(!is.null(label_fill_opacity)) {
    if(!is(label_fill_opacity, "numeric")) {
      stop("label_fill_opacity: expected numeric")
    }
  }
  if(!is.null(label_stroke_color)) {
    if(!is(label_stroke_color, "character")) {
      stop("label_stroke_color: expected character")
    }
  }
  if(!is.null(label_stroke_opacity)) {
    if(!is(label_stroke_opacity, "numeric")) {
      stop("label_stroke_opacity: expected numeric")
    }
  }
  if(!is.null(label_stroke_size)) {
    if(!is(label_stroke_size, "numeric")) {
      stop("label_stroke_size: expected numeric")
    }
  }
  if(!is.null(label_font_size)) {
    if(!is(label_font_size, "numeric")) {
      stop("label_font_size: expected numeric")
    }
  }
  if(!is.null(label_font_weight)) {
    if(!is(label_font_weight, "character")) {
      stop("label_font_weight: expected character")
    }
  }
  if(!is.null(label_line_height)) {
    if(!is(label_line_height, "numeric")) {
      stop("label_line_height: expected numeric")
    }
  }
  # TODO Validate label_align
  if(!is.null(ref_stroke_color)) {
    if(!is(ref_stroke_color, "character")) {
      stop("ref_stroke_color: expected character")
    }
  }
  if(!is.null(ref_stroke_opacity)) {
    if(!is(ref_stroke_opacity, "numeric")) {
      stop("ref_stroke_opacity: expected numeric")
    }
  }
  if(!is.null(ref_stroke_size)) {
    if(!is(ref_stroke_size, "numeric")) {
      stop("ref_stroke_size: expected numeric")
    }
  }
  if(!is.null(ref_stroke_dash)) {
    if(!is(ref_stroke_dash, "character")) {
      stop("ref_stroke_dash: expected character")
    }
  }
  .o <- list(
    coord=coord,
    type=type,
    x=x,
    x0=x0,
    x1=x1,
    x2=x2,
    x_min=x_min,
    x_max=x_max,
    x_nice=x_nice,
    x_scale=x_scale,
    x_title=x_title,
    y=y,
    y0=y0,
    y1=y1,
    y2=y2,
    y_min=y_min,
    y_max=y_max,
    y_nice=y_nice,
    y_scale=y_scale,
    y_title=y_title,
    color=color,
    color_range=color_range,
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
    ref_stroke_dash=ref_stroke_dash)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Mark"))
  return(.o)
}

#' Create a plot. A plot is composed of one or more graphical mark layers.
#'
#' @param marks The graphical mark layers contained in this plot.
#' @return A Plot instance.
ui_plot <- function(
  marks) {
  # TODO Validate marks: repeated Mark
  .o <- list(
    marks=marks)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_Plot"))
  return(.o)
}

#' Create a card displaying a plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param data Data for this card.
#' @param plot The plot to be displayed in this card.
#' @param commands Contextual menu commands for this component.
#' @return A PlotCard instance.
ui_plot_card <- function(
  box,
  title,
  data,
  plot,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate plot: Plot
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    data=data,
    plot=plot,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_PlotCard"))
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
ui_repeat_card <- function(
  box,
  item_view,
  item_props,
  data,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(item_view)) {
    if(!is(item_view, "character")) {
      stop("item_view: expected character")
    }
  }
  # TODO Validate item_props: Rec
  # TODO Validate data: Data
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    item_view=item_view,
    item_props=item_props,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_RepeatCard"))
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
#'   One of 'area', 'interval'.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A SmallSeriesStatCard instance.
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
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  # TODO Validate plot_data: Data
  if(!is.null(plot_value)) {
    if(!is(plot_value, "character")) {
      stop("plot_value: expected character")
    }
  }
  if(!is.null(plot_zero_value)) {
    if(!is(plot_zero_value, "numeric")) {
      stop("plot_zero_value: expected numeric")
    }
  }
  if(!is.null(plot_category)) {
    if(!is(plot_category, "character")) {
      stop("plot_category: expected character")
    }
  }
  # TODO Validate plot_type
  # TODO Validate plot_curve
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
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
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_SmallSeriesStatCard"))
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
ui_small_stat_card <- function(
  box,
  title,
  value,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    value=value,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_SmallStatCard"))
  return(.o)
}

#' Create a card containing tabs for navigation.
#'
#' @param box A string indicating how to place this component on the page.
#' @param items Items to render.
#' @param link True if tabs should be rendered as links and not a standard tab.
#' @param commands Contextual menu commands for this component.
#' @return A TabCard instance.
ui_tab_card <- function(
  box,
  items,
  link = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  # TODO Validate items: repeated Tab
  if(!is.null(link)) {
    if(!is(link, "logical")) {
      stop("link: expected logical")
    }
  }
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    items=items,
    link=link,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TabCard"))
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
ui_tall_gauge_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  if(!is.null(progress)) {
    if(!is(progress, "numeric")) {
      stop("progress: expected numeric")
    }
  }
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TallGaugeStatCard"))
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
#'   One of 'area', 'interval'.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A TallSeriesStatCard instance.
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
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  # TODO Validate plot_data: Data
  if(!is.null(plot_value)) {
    if(!is(plot_value, "character")) {
      stop("plot_value: expected character")
    }
  }
  if(!is.null(plot_zero_value)) {
    if(!is(plot_zero_value, "numeric")) {
      stop("plot_zero_value: expected numeric")
    }
  }
  if(!is.null(plot_category)) {
    if(!is(plot_category, "character")) {
      stop("plot_category: expected character")
    }
  }
  # TODO Validate plot_type
  # TODO Validate plot_curve
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
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
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TallSeriesStatCard"))
  return(.o)
}

#' Render dynamic content using a HTML template.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title for this card.
#' @param content The Handlebars template. https://handlebarsjs.com/guide/
#' @param data Data for the Handlebars template
#' @param commands Contextual menu commands for this component.
#' @return A TemplateCard instance.
ui_template_card <- function(
  box,
  title,
  content,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(content)) {
    if(!is(content, "character")) {
      stop("content: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    content=content,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_TemplateCard"))
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
ui_toolbar_card <- function(
  box,
  items,
  secondary_items = NULL,
  overflow_items = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  # TODO Validate items: repeated Command
  # TODO Validate secondary_items: repeated Command
  # TODO Validate overflow_items: repeated Command
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    items=items,
    secondary_items=secondary_items,
    overflow_items=overflow_items,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_ToolbarCard"))
  return(.o)
}

#' Create a card containing a Vega-lite plot.
#'
#' @param box A string indicating how to place this component on the page.
#' @param title The title of this card.
#' @param specification The Vega-lite specification.
#' @param data Data for the plot, if any.
#' @param commands Contextual menu commands for this component.
#' @return A VegaCard instance.
ui_vega_card <- function(
  box,
  title,
  specification,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(specification)) {
    if(!is(specification, "character")) {
      stop("specification: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    specification=specification,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_VegaCard"))
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
ui_wide_bar_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  if(!is.null(progress)) {
    if(!is(progress, "numeric")) {
      stop("progress: expected numeric")
    }
  }
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_WideBarStatCard"))
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
ui_wide_gauge_stat_card <- function(
  box,
  title,
  value,
  aux_value,
  progress,
  plot_color = NULL,
  data = NULL,
  commands = NULL) {
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  if(!is.null(progress)) {
    if(!is(progress, "numeric")) {
      stop("progress: expected numeric")
    }
  }
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
  .o <- list(
    box=box,
    title=title,
    value=value,
    aux_value=aux_value,
    progress=progress,
    plot_color=plot_color,
    data=data,
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_WideGaugeStatCard"))
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
#'   One of 'area', 'interval'.
#' @param plot_curve The plot's curve style. Defaults to `linear`.
#'   One of 'linear', 'smooth', 'step', 'step-after', 'step-before'.
#' @param plot_color The plot's color.
#' @param data Data for this card.
#' @param commands Contextual menu commands for this component.
#' @return A WideSeriesStatCard instance.
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
  if(!is.null(box)) {
    if(!is(box, "character")) {
      stop("box: expected character")
    }
  }
  if(!is.null(title)) {
    if(!is(title, "character")) {
      stop("title: expected character")
    }
  }
  if(!is.null(value)) {
    if(!is(value, "character")) {
      stop("value: expected character")
    }
  }
  if(!is.null(aux_value)) {
    if(!is(aux_value, "character")) {
      stop("aux_value: expected character")
    }
  }
  # TODO Validate plot_data: Data
  if(!is.null(plot_value)) {
    if(!is(plot_value, "character")) {
      stop("plot_value: expected character")
    }
  }
  if(!is.null(plot_zero_value)) {
    if(!is(plot_zero_value, "numeric")) {
      stop("plot_zero_value: expected numeric")
    }
  }
  if(!is.null(plot_category)) {
    if(!is(plot_category, "character")) {
      stop("plot_category: expected character")
    }
  }
  # TODO Validate plot_type
  # TODO Validate plot_curve
  if(!is.null(plot_color)) {
    if(!is(plot_color, "character")) {
      stop("plot_color: expected character")
    }
  }
  # TODO Validate data: Rec
  # TODO Validate commands: repeated Command
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
    commands=commands)
  class(.o) <- append(class(.o), c(.h2oq_obj, "h2oq_WideSeriesStatCard"))
  return(.o)
}