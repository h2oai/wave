library(h2owave)

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
curves = c('linear','smooth','step','step-after','step-before')
crypto_name <- c("ETH","BTC","ZCH","LTC")

sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
sample_crypto_price <- runif(1,1,500)
sample_crypto_price_percent_change <- runif(1,0,1)
card_color <- sample(dark_theme_colors,1)
caption <- paste0("The card shows the price (in USD) and price percentage change of ",sample_crypto_name,".")

page <- Site("/demo")
page$drop()
page$add_card("large_bar",ui_large_bar_stat_card(box="1 1 2 2"
                                                                          ,title=sample_crypto_name
                                                                          ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                          ,value_caption='This Month'
                                                                          ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                          ,aux_value_caption='Previous Month'
                                                                          ,plot_color=card_color
                                                                          ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                                                          ,progress = sample_crypto_price_percent_change
                                                                          ,caption=caption
))

page$save()

while(TRUE){
  Sys.sleep(3)
  sample_crypto_price <- runif(1,1,500)
  sample_crypto_price_percent_change <- runif(1,0,1)
  page$set("large_bar","data","price",sample_crypto_price)
  page$set("large_bar","data","change",sample_crypto_price_percent_change)
  page$set("large_bar","progress",sample_crypto_price_percent_change)
  page$save()
}
