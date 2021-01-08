source("../core.R") 
source("../ui.R")


test_page <- page("/page_demo")

#box template column number (left to right), row number (top to bottom),the number of columns the cell occupies , the number of rows the cell occupies.

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
curves = c('linear','smooth','step','stepAfter','stepBefore')

simples <- list()
for(i in 1:7)
{
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

simples[[length(simples)+1]] <- paste0("a",i)
test_page <- page.add(test_page,"/page_demo",paste0("a",i),
                      ui_small_stat_card(box=paste0(i," 1 1 1"),title=card_title,value=card_value))
}


simples_colored <- list()
for(i in 1:7){

card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

simples_colored[[length(simples_colored)+1]] <- paste0("aa",i)
test_page <- page.add(test_page,"/page_demo",paste0("aa",i),
                      ui_small_series_stat_card(box=paste0(i+6," 1 1 1")
                                                ,title=card_title
                                                ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                ,data=list(qux=card_value,quux=card_pc/100)
                                                ,plot_category='foo'
                                                ,plot_value='qux'
                                                ,plot_color=card_color
                                                ,plot_data=data.dump(fields=list('foo','qux'), size=-15)
                                                ,plot_zero_value = 0
                                                ,plot_curve=card_curve
)
                      )
}

lines <- list()
for(i in seq(1,13,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

lines[[length(lines)+1]] <- paste0("b",i)
test_page <- page.add(test_page,"/page_demo",paste0("b",i),
                      ui_wide_series_stat_card(box=paste0(i," 2 2 1")
                                               ,title=card_title
                                               ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                               ,data=list(qux=card_value,quux=card_pc/100)
                                               ,plot_category='foo'
                                               ,plot_value='qux'
                                               ,plot_color=card_color
                                               ,plot_data=data.dump(fields=list('foo','qux'),size=-15)
                                               ,plot_zero_value = 0
                                               ,plot_curve=card_curve

                                               ))
}


bars <- list()
for(i in seq(1,13,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

bars[[length(bars)+1]] <- paste0("c",i)
test_page <- page.add(test_page,"/page_demo",paste0("c",i),
                      ui_wide_series_stat_card(box=paste0(i," 3 2 1")
                                               ,title=card_title
                                               ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                               ,data=list(qux=card_value,quux=card_pc)
                                               ,plot_type='interval'
                                               ,plot_category='foo'
                                               ,plot_value='qux'
                                               ,plot_color=card_color
                                               ,plot_data=data.dump(fields=list('foo','qux'),size=-25)
                                               ,plot_zero_value = 0

                                               ))
}


large_pcs <- list()
for(i in seq(1,13,1)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

large_pcs[[length(large_pcs)+1]] <- paste0("d",i)
test_page <- page.add(test_page,"/page_demo",paste0("d",i),
                      ui_tall_gauge_stat_card(box=paste0(i," 4 1 2")
                                               ,title=card_title
                                               ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,plot_color=card_color
                                               ,progress=card_pc/100
                                               ,data=list(foo=card_value,bar=card_pc/100)
                                               ))
}


large_lines <- list()
for(i in seq(1,13,1)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

large_lines[[length(large_lines)+1]] <- paste0("e",i)
test_page <- page.add(test_page,"/page_demo",paste0("e",i),
                      ui_tall_series_stat_card(box=paste0(i," 6 1 2")
                                               ,title=card_title
                                               ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl quux style="percent" minimum_fraction_digits=1 maximum_fraction_digits=1}}'
                                               ,data=list(foo=card_value,bar=card_pc)
                                               ,plot_type='area'
                                               ,plot_category='foo'
                                               ,plot_value='qux'
                                               ,plot_color=card_color
                                               ,plot_data=data.dump(fields=list('foo','qux'),size=-15)
                                               ,plot_zero_value=0
                                               ,plot_curve=card_curve
                                               ))
}


small_pcs <- list()
for(i in seq(1,7,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

small_pcs[[length(small_pcs)+1]] <- paste0("f",i)
test_page <- page.add(test_page,"/page_demo",paste0("f",i),
                      ui_wide_gauge_stat_card(box=paste0(i," 8 2 1")
                                               ,title=card_title
                                               ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,plot_color=card_color
                                               ,progress=card_pc/100
                                               ,data=list(foo=card_value,bar=card_pc/100)
                                               ))
}


small_pbs <- list()
for(i in seq(7,13,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

small_pbs[[length(small_pbs)+1]] <- paste0("f",i)
test_page <- page.add(test_page,"/page_demo",paste0("f",i),
                      ui_wide_bar_stat_card(box=paste0(i," 8 2 1")
                                               ,title=card_title
                                               ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,plot_color=card_color
                                               ,progress=card_pc
                                               ,data=list(foo=card_value,bar=card_pc/100)
                                               ))
}


large_cards <- list()
for(i in seq(1,7,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

large_cards[[length(large_cards)+1]] <- paste0("g",i)
test_page <- page.add(test_page,"/page_demo",paste0("g",i),
                      ui_large_stat_card(box=paste0(i," 9 2 2")
                                               ,title=card_title
                                               ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value='={{intl quux style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,data=list(qux=card_value,quux=card_pc/100)
                                               ,caption=" Hello Test"
                                               ))
}


large_pbs <- list()
for(i in seq(7,13,2)){
card_title <- sample(row.names(mtcars),1)
card_value <- as.character(sample(mtcars[['mpg']],1))
card_color <- sample(dark_theme_colors,1)
card_curve <- sample(curves,1)
card_pc <- as.integer(runif(1,1,100))

large_pbs[[length(large_pbs)+1]] <- paste0("g",i)
test_page <- page.add(test_page,"/page_demo",paste0("g",i),
                      ui_large_bar_stat_card(box=paste0(i," 9 2 2")
                                               ,title=card_title
                                               ,value='=${{intl foo minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,value_caption='This Month'
                                               ,aux_value='={{intl bar style="percent" minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                               ,aux_value_caption='Previous Month'
                                               ,plot_color=card_color
                                               ,progress=card_pc
                                               ,data=list(foo=card_value,bar=card_pc/100)
                                               ,caption=" Hello Test"
                                               ))
}

page.save(test_page,"/page_demo")
print("est")

while(TRUE){
        Sys.sleep(1)
        for(i in simples){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                test_page[[i]]$value$value <- card_value
        }

        for(i in simples_colored){
                card_title <- sample(row.names(mtcars),1)
                card_pc <- as.integer(runif(1,1,100))
                card_value <- as.character(sample(mtcars[['mpg']],1))
                test_page[[i]]$value$data$qux <- card_value
                test_page[[i]]$value$data$quux <- card_pc/100
                test_page[[i]]$value$"plot_data -1"<- glist(card_title,card_value)
        }

        for(i in lines){
                card_title <- sample(row.names(mtcars),1)
                card_pc <- as.integer(runif(1,1,100))
                card_value <- as.character(sample(mtcars[['mpg']],1))
                test_page[[i]]$value$data$qux <- card_value
                test_page[[i]]$value$data$quux <- card_pc/100
                test_page[[i]]$value$"plot_data -1"<- glist(card_title,card_value)
        }

        for(i in bars){
                card_title <- sample(row.names(mtcars),1)
                card_pc <- as.integer(runif(1,1,100))
                card_value <- as.character(sample(mtcars[['mpg']],1))
                test_page[[i]]$value$data$qux <- card_value
                test_page[[i]]$value$data$quux <- card_pc/100
                test_page[[i]]$value$"plot_data -1"<- glist(card_title,card_value)
        }

        for(i in large_lines){
                card_title <- sample(row.names(mtcars),1)
                card_pc <- as.integer(runif(1,1,100))
                card_value <- as.character(sample(mtcars[['mpg']],1))
                test_page[[i]]$value$data$qux <- card_value
                test_page[[i]]$value$data$quux <- card_pc/100
                test_page[[i]]$value$"plot_data -1"<- glist(card_title,card_value)
        }

        for(i in large_pcs){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                card_pc <- as.integer(runif(1,1,100))
                test_page[[i]]$value$data$foo <- card_value
                test_page[[i]]$value$data$bar <- card_pc/100
                test_page[[i]]$value$progress <- card_pc/100
        }

        for(i in small_pcs){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                card_pc <- as.integer(runif(1,1,100))
                test_page[[i]]$value$data$foo <- card_value
                test_page[[i]]$value$data$bar <- card_pc/100
                test_page[[i]]$value$progress <- card_pc/100
        }

        for(i in small_pbs){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                card_pc <- as.integer(runif(1,1,100))
                test_page[[i]]$value$data$foo <- card_value
                test_page[[i]]$value$data$bar <- card_pc/100
                test_page[[i]]$value$progress <- card_pc/100
        }

        for(i in large_cards){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                card_pc <- as.integer(runif(1,1,100))
                test_page[[i]]$value$data$qux <- card_value
                test_page[[i]]$value$data$quux <- card_pc/100
        }

        for(i in large_pbs){
                card_value <- as.character(sample(mtcars[['mpg']],1))
                card_pc <- as.integer(runif(1,1,100))
                test_page[[i]]$value$data$foo <- card_value
                test_page[[i]]$value$data$bar <- card_pc/100
                test_page[[i]]$value$progress <- card_pc/100
        }
        page.save(test_page,"/page_demo")
}
