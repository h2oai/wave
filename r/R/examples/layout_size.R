# Each line of code has an associated description
# Layout / Size
# How to adjust the size of cards on a page

library(h2owave)

# Create a new page called "demo". 
page <- Site("/demo")
page$drop()

# A vector of box specifications for cards. Each value encloses, the column and the row number where the card is placed, and the number of columns and rows it occupies.
boxes <- c("1 1 1 1",
	"2 1 2 1",
	"4 1 3 1",
	"7 1 4 1",
	"11 1 2 2",
	"1 2 1 9",
	"2 2 1 4",
	"3 2 1 2",
	"2 6 1 5",
	"3 4 1 7",
	"4 2 7 9",
	"11 9 2 2",
	"11 3 2 6"
    )
# For-loop to cycle through the vector of box specifications for cards. 
for(box in boxes){
        # Each card is named according to its position by pasting the column and row number. 
        page$add_card(paste0("card_",gsub(" ","_",box)),
                        	# Each card is a markdown card.
                              ui_markdown_card(box=box,title=box,content='')
                              )
}
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()
