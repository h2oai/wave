# R Plots / plotly
# Render a plotly artifact created in R thru Wave
# ---

library(h2owave)
library(plotly)
library(htmlwidgets)

trace_0 <- rnorm(100, mean = 5)
trace_1 <- rnorm(100, mean = 0)
trace_2 <- rnorm(100, mean = -5)
x <- c(1:100)

data <- data.frame(x, trace_0, trace_1, trace_2)

fig <- plot_ly(data, x = ~x)
fig <- fig %>% add_trace(y = ~trace_0, name = 'trace 0',mode = 'lines')
fig <- fig %>% add_trace(y = ~trace_1, name = 'trace 1', mode = 'lines+markers')
fig <- fig %>% add_trace(y = ~trace_2, name = 'trace 2', mode = 'markers')

saveWidget(fig, "/tmp/fig.html", selfcontained = T)
rawHTML <- paste(readLines("/tmp/fig.html"), collapse="\n")

page <- Site("/demo")

page$add_card("plotly_render",
                    ui_form_card(
                        box= '1 1 -1 -1'
                        ,items = list(
                            ui_frame(content=rawHTML,height='800px',width='1500px')
                        )
                    ))
page$save()