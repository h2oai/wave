# Each line of code has an associated description
# Layout / Position
# How to adjust the positons of cards on a page

#library(h2owave)

# Check if a variable with the name "page_name" exists in an object page. This is a check to remove any previous page objects.
if("page_name" %in% names(page)) page$drop()
# Create a new page called "demo". 
page <- Site("/demo")

# Number of columns on the page.
columns = 12
# Number of rows on the page.
rows = 10

# For-loop to cycle through 12 columns.
for(column in 1:columns){
        # And a nested for-loop to cycle through 10 rows.
        for(row in 1:rows){
                # Multiple cards are added to page "demo". Each card is dynamically placed by the column number and row number. And each card is of column size 1, and row size 1. 
               box = paste0(column," ",row," 1 1") 
        # Each card is named according to its position by pasting the column and row number. 
        page$add_card(paste0("card_",column,"_",row),
                        # Each card is a markdown card.
                              ui_markdown_card(box=box,title=box,content=''))
        }}
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()
