# Each line of code has an associated description
# Stat / Small
# Display a small stat card displaying a single value
# ui_small_stat_card

library(h2owave)

# Combining 5 different crypto currency symbols into a vector.
crypto_name <- c("ETH","BTC","ZCH","LTC")
# Sample a single crypto currency symbol from the above created vector.
sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
# Generate a random value from an uniform distribution between 1 - 500. The value variable in small_stat currently expects a character, so we convert the variable to a character.
sample_crypto_price <- as.character(round(runif(1,1,500),digits=2))

# Create a new page called "demo". 
page <- Site("/demo")
# Add a new card called "crypto", which is a small stat card on the newly created page "demo".
# The position of the card is at column 1, and row 1, and the card occupies 1 column and 1 row. 
page$add_card("crypto",ui_small_stat_card(box="1 1 1 1"
                                # Set the title of the card with the sample crypto currency symbol.
                                ,title=sample_crypto_name
                                # Set the value of the card with the sample crypto currency price.
                                ,value=sample_crypto_price))
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()

# (The cool part)Setup an infinite while loop to show a dynamically changing card.
while(TRUE)
{ 
        # Provide 3 seconds between card updates
        Sys.sleep(3)
        # Sample a single crypto currency symbol from the above created vector.
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        # Generate a random value from an uniform distribution between 1 - 500. The value variable in small_stat currently expects a character, so we convert the variable to a character.
        sample_crypto_price <- as.character(round(runif(1,1,500),digits=2))
        # Feed sample_crypto_name to "title" variable
        page$set("crypto","title",sample_crypto_name)
        # Feed sample_crypto_price to "price" variable
        page$set("crypto","value",sample_crypto_price)
        # Save the page object. Saving the page object pushes the card object to the wave server. 
        page$save()
}

