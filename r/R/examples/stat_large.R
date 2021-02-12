#library(h2owave)


crypto.data <- get.crypto.data()
caption <- paste0("The data shows the closing price (in USD), and net change in price by percentage for ",crypto.data$get.crypto.symbol," on ",crypto.data$get.date)

if("page.name" %in% names(page)) page$drop()
page <- Site("/demo")
page$add.card("crypto",ui_large_stat_card(box="1 1 2 2"
                                        ,title=crypto.data$get.crypto.symbol
                                        ,value='=${{intl close minimum_fraction_digits=2 maximum_fraction_digits=1}}'
                                        ,aux_value='={{intl pc style="percent" minimum_fraction_digits=0 maximum_fraction_digits=2}}'
                                        ,data=list(close=crypto.data$get.symbol.close,pc=crypto.data$get.symbol.net.price.change.percent)
                                        ,caption=caption
                                        ))
page$save()

while(TRUE)
{
        Sys.sleep(3)
        crypto.data <- get.crypto.data()
        caption <- paste0("The data shows the closing price (in USD), and net change in price by percentage for ",crypto.data$get.crypto.symbol," on ",crypto.data$get.date)
        page$set("crypto","title",crypto.data$get.crypto.symbol)
        page$set("crypto","data","close",crypto.data$get.symbol.close)
        page$set("crypto","data","pc",crypto.data$get.symbol.net.price.change.percent)
        page$set("crypto","caption",caption)
        page$save()
}
