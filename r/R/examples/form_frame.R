# Form / Frame
# Use a #frame component in a #form card to display #HTML content inline.
# ---

library(h2owave)

html = " 
<!DOCTYPE html>
<html>
<body>
  <h1>Hello World!</h1>
</body>
</html>
"

page <- Site("/demo")

page$add_card("example",
                    ui_form_card(
                        box= '1 1 2 2'
                        ,items = list(
                            ui_frame(content=html,height='100px')
                        )
                    ))
page$save()