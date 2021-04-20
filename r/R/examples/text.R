# Each line of code has an associated description
# Form /Text 
# Use #markdown in a #text component to display formatted content within a #form.
# ui_form_box

library(h2owave)

# Create a new page called "demo". 
page <- Site("/demo")
#page$drop()
# Markdown content
sample_markdown = "

The **quick** _brown_ fox jumped over the lazy dog.

Block quote:

> The quick brown fox jumped over the lazy dog.

Unordered list:

- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.
- The quick brown fox jumped over the lazy dog.

Ordered list:

1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.
1. The quick brown fox jumped over the lazy dog.

Image:

![Monty Python](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg)

Links:

Here's a [link to an image](https://upload.wikimedia.org/wikipedia/en/c/cb/Flyingcircus_2.jpg).

Table:

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |
| Item 1   | Item 2   | Item 3   |

"

# Add a new card called "markdown", which is a form card on the newly created page "demo".
# The position of the card is at column 1, and row 1, and the card occupies 4 columns and all the available rows.
page$add_card("markdown",
        ui_form_card(box="1 1 4 -1",
                # The sample markdown is fed into the ui_text function which creates text content. This is converted to a list and passed on as the items into the form card. 
                     items=list(ui_text(sample_markdown))
                     )
        )
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()
