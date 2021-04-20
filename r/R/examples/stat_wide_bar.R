# Each line of code has an associated description
# Stat / Bar / Wide
# Create a wide stat card displaying a primary value, an auxiliary value, and a progress bar.
# ui_wide_bar_stat_card

library(h2owave)

# Combining 5 different crypto currency symbols into a vector.
crypto_name <- c("ETH","BTC","ZCH","LTC")
# Sample a single crypto currency symbol from the above created vector.
sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
# Generate a random value from an uniform distribution between 1 - 500.
sample_crypto_price <- runif(1,1,500)
# Generate a random decimal value from an uniform distribution between 0 - 1.
sample_crypto_price_percent_change <- runif(1,0,1)
# Create a new page called "demo". 
page <- Site("/demo")
# Add a new card called "crypto", which is a wide bar stat card on the newly created page "demo".
# The position of the card is at column 1, and row 1, and the card occupies 2 columns and 1 row. 
page$add_card("crypto",ui_wide_bar_stat_card(box="1 1 2 1"
                                        # Set the title of the card with the sample crypto currency symbol.
                                        ,title=sample_crypto_name
                                        # Set the card value type to be integer, the variable name for the value "price", with minimum decimal -0, and maximum -1. 
                                        ,value='=${{intl price minimum_fraction_digits=0 maximum_fraction_digits=1}}'
                                        # Set the card auxiliary value type to be integer, the variable name for the aux value "change", with minimum decimal - 0, and maximum - 1.
                                        ,aux_value='={{intl change style="percent" minimum_fraction_digits=0 maximum_fraction_digits=1}}'
                                        # Set the plot color to red.
                                        ,plot_color='$red'
                                        # Setup the variables which will feed the data for the "value" in the card. the variable "price" is fed data from sample_crypto_price, and the variable "change" is fed data from sample_crypto_price_percentage_change.
                                        ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                        # Set the progress variable on the card to be fed with the sample crypto price percent change. 
                                        ,progress = sample_crypto_price_percent_change
))
# Save the page object. Saving the page object pushes the card object to the wave server. 
page$save()

# (The cool part)Setup an infinite while loop to show a dynamically changing card.
while(TRUE){
  # Provide 3 seconds between card updates
  Sys.sleep(3)
  # Generate a random value from an uniform distribution between 1 - 500.
  sample_crypto_price <- runif(1,1,500)
  # Generate a random decimal value from an uniform distribution between 0 - 1.
  sample_crypto_price_percent_change <- runif(1,0,1)
  # Feed sample_crypto_price to "price" variable
  page$set("crypto","data","price",sample_crypto_price)
  # Feed sample_crypto_percent_change to "change" variable
  page$set("crypto","data","change",sample_crypto_price_percent_change)
  # Feed sample_crypto_percent_change to "progress" variable
  page$set("crypto","progress",sample_crypto_price_percent_change)
  # Save the page object. Saving the page object pushes the card object to the wave server. 
  page$save()
}
