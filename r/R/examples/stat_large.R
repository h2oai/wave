#library(h2owave)

crypto.name <- c("ETH","BTC","ZCH","LTC")
sample.crypto.name <- crypto.name[sample(1:length(crypto.name),1)]
sample.crypto.price <- runif(1,1,500)
sample.crypto.price.percent.change <- runif(1,0,1)
caption <- paste0("The card shows the price (in USD) and price percentage change of ",sample.crypto.name,".")

if("page.name" %in% names(page)) page$drop()
page <- Site("/demo")
page$add.card("crypto",ui_large_stat_card(box="1 1 2 2"
                                        ,title=sample.crypto.name
                                        ,value='=${{intl price minimum_fraction_digits=0 maximum_fraction_digits=1}}'
                                        ,aux_value='={{intl change style="percent" minimum_fraction_digits=0 maximum_fraction_digits=1}}'
                                        ,data=list(price=sample.crypto.price,change=sample.crypto.price.percent.change)
                                        ,caption=caption
                                        ))
page$save()

while(TRUE)
{
        Sys.sleep(3)
        sample.crypto.name <- crypto.name[sample(1:length(crypto.name),1)]
        sample.crypto.price <- runif(1,1,500)
        sample.crypto.price.percent.change <- runif(1,0,1)
        caption <- paste0("The card shows the price (in USD) and price percentage change of ",sample.crypto.name,".")
        
        page$set("crypto","title",sample.crypto.name)
        page$set("crypto","data","price",sample.crypto.price)
        page$set("crypto","data","change",sample.crypto.price.percent.change)
        page$set("crypto","caption",caption)
        page$save()
}
