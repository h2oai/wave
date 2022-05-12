library(h2owave)

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
curves = c('linear','smooth','step','stepAfter','stepBefore')
crypto_name <- c("ETH","BTC","ZCH","LTC")

page <- Site("/demo")
page$drop()
cards = list()

for( i in 1:length(curves))
{
  sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
  sample_crypto_price <- runif(1,1,500)
  sample_crypto_price_percent_change <- runif(1,0,1)
  card_color <- sample(dark_theme_colors,1)
  card_curve <- sample(curves,1)
  
  cards[[length(cards)+1]] <- paste0("c",i)
  page$add_card(paste0("c",i),
                        ui_small_series_stat_card(box=paste0("1 ",i," 1 1")
                                                  ,title=sample_crypto_name
                                                  ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                  ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                                  ,plot_data=data(fields='price change',size=-15)
                                                  ,plot_category='price'
                                                  ,plot_type='area'
                                                  ,plot_value='change'
                                                  ,plot_color=card_color
                                                  ,plot_zero_value = 0
                                                  ,plot_curve=card_curve
                        ))
}
page$save()

while(TRUE){
  Sys.sleep(3)
  for(i in cards){
          sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
          sample_crypto_price <- runif(1,1,500)
          sample_crypto_price_percent_change <- runif(1,0,1)

          page$set(i,"data","price",sample_crypto_price)
          page$set(i,"data","change",sample_crypto_price_percent_change)
          page$set(i,"plot_data","-","1",list(sample_crypto_name,sample_crypto_price))
  }
  page$save()
}
