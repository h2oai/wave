library(h2owave)

page <- Site("/demo")

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
curves = c('linear','smooth','step','step-after','step-before')
crypto_name <- c("ETH","BTC","ZCH","LTC")

simples <- list()
for(i in 1:7)
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)

        simples[[length(simples)+1]] <- paste0("a",i)
        page$add_card(paste0("a",i),
                      ui_small_stat_card(box=paste0(i," 1 1 1")
                      ,title=sample_crypto_name
                      ,value= as.character(sample_crypto_price)))
}


simples_colored <- list()
for(i in 1:7)
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        simples_colored[[length(simples_colored)+1]] <- paste0("aa",i)
        page$add_card(paste0("aa",i),
                      ui_small_series_stat_card(box=paste0(i+6," 1 1 1")
                                                ,title=sample_crypto_name
                                                ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                                ,plot_category='foo'
                                                ,plot_value='price'
                                                ,plot_color=card_color
                                                ,plot_data=data(fields='foo price', size=-15)
                                                ,plot_zero_value = 0
                                                ,plot_curve=card_curve
                      )
        )
}

lines <- list()
for(i in seq(1,13,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        lines[[length(lines)+1]] <- paste0("b",i)
        page$add_card(paste0("b",i),
                      ui_wide_series_stat_card(box=paste0(i," 2 2 1")
                                               ,title=sample_crypto_name
                                               ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl change style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                               ,data=list(price=sample_crypto_price,sample_crypto_price_percent_change)
                                               ,plot_category='foo'
                                               ,plot_value='price'
                                               ,plot_color=card_color
                                               ,plot_data=data(fields='foo price',size=-15)
                                               ,plot_zero_value = 0
                                               ,plot_curve=card_curve
                                               ))
}


bars <- list()
for(i in seq(1,13,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        bars[[length(bars)+1]] <- paste0("c",i)
        page$add_card(paste0("c",i),
                      ui_wide_series_stat_card(box=paste0(i," 3 2 1")
                                               ,title=sample_crypto_name
                                               ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl change style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                               ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                               ,plot_type='interval'
                                               ,plot_category='foo'
                                               ,plot_value='price'
                                               ,plot_color=card_color
                                               ,plot_data=data(fields='foo price',size=-25)
                                               ,plot_zero_value = 0

                                               ))
}


large_pcs <- list()
for(i in seq(1,13,1))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        large_pcs[[length(large_pcs)+1]] <- paste0("d",i)
        page$add_card(paste0("d",i),
                      ui_tall_gauge_stat_card(box=paste0(i," 4 1 2")
                                              ,title=sample_crypto_name
                                              ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                              ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                              ,plot_color=card_color
                                              ,progress=sample_crypto_price_percent_change
                                              ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                              ))
}


large_lines <- list()
for(i in seq(1,13,1))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        large_lines[[length(large_lines)+1]] <- paste0("e",i)
        page$add_card(paste0("e",i),
                      ui_tall_series_stat_card(box=paste0(i," 6 1 2")
                                               ,title=sample_crypto_name
                                               ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                               ,plot_type='area'
                                               ,plot_category='foo'
                                               ,plot_value='price'
                                               ,plot_color=card_color
                                               ,plot_data=data(fields='foo price',size=-15)
                                               ,plot_zero_value=0
                                               ,plot_curve=card_curve
                                               ))
}


small_pcs <- list()
for(i in seq(1,7,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        small_pcs[[length(small_pcs)+1]] <- paste0("f",i)
        page$add_card(paste0("f",i),
                      ui_wide_gauge_stat_card(box=paste0(i," 8 2 1")
                                              ,title=sample_crypto_name
                                              ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                              ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                              ,plot_color=card_color
                                              ,progress=sample_crypto_price_percent_change
                                              ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                              ))
}


small_pbs <- list()
for(i in seq(7,13,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)

        small_pbs[[length(small_pbs)+1]] <- paste0("f",i)
        page$add_card(paste0("f",i),
                      ui_wide_bar_stat_card(box=paste0(i," 8 2 1")
                                            ,title=sample_crypto_name
                                            ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                            ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                            ,plot_color=card_color
                                            ,progress=sample_crypto_price_percent_change
                                            ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                            ))
}


large_cards <- list()
for(i in seq(1,7,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)
        caption <- paste0("The card shows the price (in USD) and price percentage change of ",sample_crypto_name,".")

        large_cards[[length(large_cards)+1]] <- paste0("g",i)
        page$add_card(paste0("g",i),
                      ui_large_stat_card(box=paste0(i," 9 2 2")
                                         ,title=sample_crypto_name
                                         ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                         ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                         ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                         ,caption=caption
                                         ))
}


large_pbs <- list()
for(i in seq(7,13,2))
{
        sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
        sample_crypto_price <- runif(1,1,500)
        sample_crypto_price_percent_change <- runif(1,0,1)
        card_color <- sample(dark_theme_colors,1)
        card_curve <- sample(curves,1)
        caption <- paste0("The card shows the price (in USD) and price percentage change of ",sample_crypto_name,".")

        large_pbs[[length(large_pbs)+1]] <- paste0("g",i)
        page$add_card(paste0("g",i),
                      ui_large_bar_stat_card(box=paste0(i," 9 2 2")
                                             ,title=sample_crypto_name
                                             ,value='=${{intl price minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                             ,value_caption='This Month'
                                             ,aux_value='={{intl change style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                             ,aux_value_caption='Percentage Change'
                                             ,plot_color=card_color
                                             ,progress=sample_crypto_price_percent_change
                                             ,data=list(price=sample_crypto_price,change=sample_crypto_price_percent_change)
                                             ,caption=caption
                                             ))
}

page$save()
#
while(TRUE){

        crypto_name <- c("ETH","BTC","ZCH","LTC")

        Sys.sleep(1)
        for(i in simples){
                sample_crypto_price <- runif(1,1,500)
                page$set(i,"value",sample_crypto_price)
        }

        for(i in simples_colored){
                sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"plot_data","-","1",list(sample_crypto_name,sample_crypto_price))
        }

        for(i in lines){
                sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"plot_data","-","1",list(sample_crypto_name,sample_crypto_price))
        }

        for(i in bars){
                sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"plot_data","-","1",list(sample_crypto_name,sample_crypto_price))
        }

        for(i in large_lines){
                sample_crypto_name <- crypto_name[sample(1:length(crypto_name),1)]
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"plot_data","-","1",list(sample_crypto_name,sample_crypto_price))
        }

        for(i in large_pcs){
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"progress",sample_crypto_price_percent_change)
        }

        for(i in small_pcs){
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"progress",sample_crypto_price_percent_change)
        }

        for(i in small_pbs){
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"progress",sample_crypto_price_percent_change)
        }

        for(i in large_cards){
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
        }

        for(i in large_pbs){
                sample_crypto_price <- runif(1,1,500)
                sample_crypto_price_percent_change <- runif(1,0,1)
                page$set(i,"data","price",sample_crypto_price)
                page$set(i,"data","change",sample_crypto_price_percent_change)
                page$set(i,"progress",sample_crypto_price_percent_change)
        }
        page$save()
}
