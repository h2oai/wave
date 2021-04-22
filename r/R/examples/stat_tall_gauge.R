library(h2owave)

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
crypto_name <- c("ETH","BTC","ZCH","LTC")
sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
sample_crypto_price <- runif(1,1,500)
sample_crypto_price_percent_change <- runif(1,0,1)
card_color <- sample(dark_theme_colors,1)

page <- Site("/demo")
page$add_card("crypto_tall_gauge",ui_tall_gauge_stat_card(box="1 1 1 2"
                                                                            ,title=sample_crypto_name
                                                                            ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                            ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                                            ,plot_color=card_color
                                                                            ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                                                            ,progress = sample_crypto_price_percent_change
                                                                            )
)
page$save()

while(TRUE){
  Sys.sleep(3)
  sample_crypto_price <- runif(1,1,500)
  sample_crypto_price_percent_change <- runif(1,0,1)
  page$set("crypto_tall_gauge","data","price",sample_crypto_price)
  page$set("crypto_tall_gauge","data","change",sample_crypto_price_percent_change)
  page$set("crypto_tall_gauge","progress",sample_crypto_price_percent_change)
  page$save()
}
