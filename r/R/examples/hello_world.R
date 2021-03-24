# Each line of code has an associated description
# Layout / Size
# How to adjust the size of cards on a page

#library(h2owave)

# Assign "ETH" a crypto currency symbol to sample_crypto_name
sample_crypto_name <- "ETH"
# Generate a random value from an uniform distribution between 1 - 500. The value variable in small_stat currently expects a character, so we convert the variable to a character.
sample_crypto_price <- as.character(runif(1,1,500))

# Check if a variable with the name "page_name" exists in an object page. This is a check to remove any previous page objects.
if("page_name" %in% names(page)) page$drop()
# Create a new page called "demo". 
page <- Site("/demo")
# Add a new card called "crypto", which is a small stat card on the newly created page "demo".
# The position of the card is at column 1, and row 1, and the card occupies 1 columns and 1 row. 
page$add_card("crypto",ui_small_stat_card(box="1 1 1 1",
                    title=sample_crypto_name
                    ,value=sample_crypto_price
                    ))
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()

