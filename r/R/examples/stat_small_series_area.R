source("../core.R") 
source("../ui.R")

#box template column number (left to right), row number (top to bottom),the number of columns the cell occupies , the number of rows the cell occupies.

dark_theme_colors = c('$red', '$pink', '$blue', '$azure', '$cyan', '$teal', '$mint', '$green', '$lime', '$yellow', '$amber', '$orange' ,'$tangerine')
curves = c('linear','smooth','step','stepAfter','stepBefore')

test_page <- page("/page_demo")
cards = list()

for( i in 1:length(curves))
{
  card_title <- sample(row.names(mtcars),1)
  card_value <- as.character(sample(mtcars[['mpg']],1))
  card_color <- sample(dark_theme_colors,1)
  card_curve <- sample(curves,1)
  card_pc <- as.integer(runif(1,1,100))
  
  cards[[length(cards)+1]] <- paste0("c",i)
  test_page <- page.add(test_page,"/page_demo",paste0("c",i),
                        ui_small_series_stat_card(box=paste0("1 ",i," 1 1")
                                                  ,title=card_title
                                                  ,value='=${{intl qux minimum_fraction_digits=2 maximum_fraction_digits=2}}'
                                                  ,data=list(qux=card_value,quux=card_pc/100)
                                                  ,plot_data=data.dump(fields=list('qux','quux'),size=-15)
                                                  ,plot_category='qux'
                                                  ,plot_type='area'
                                                  ,plot_value='quux'
                                                  ,plot_color=card_color
                                                  ,plot_zero_value = 0
                                                  ,plot_curve=card_curve
                        ))
}
  page.save(test_page,"/page_demo")

while(TRUE){
  Sys.sleep(3)
  for(i in cards){
          card_title <- sample(row.names(mtcars),1)
          card_pc <- as.integer(runif(1,1,100))
          card_value <- as.character(sample(mtcars[['mpg']],1))
          test_page[[i]]$value$data$qux <- card_value
          test_page[[i]]$value$data$quux <- card_pc/100
          test_page[[i]]$value$"plot_data -1"<- glist(card_title,card_value)
  }
    page.save(test_page,"/page_demo")
}
