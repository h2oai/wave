# R Plots / lattice
# Render a lattice artifact created in R thru Wave
# --
library(h2owave)
library(lattice)

gdURL <- "http://www.stat.ubc.ca/~jenny/notOcto/STAT545A/examples/gapminder/data/gapminderDataFiveYear.txt"
gDat <- read.delim(file = gdURL)
jDat <- droplevels(subset(gDat, continent != "Oceania"))
plot_obj <- xyplot(lifeExp ~ gdpPercap, jDat,
       grid = TRUE,
       scales = list(x = list(log = 10, equispaced.log = FALSE)),
       group = continent, auto.key = TRUE)
trellis.device("png",file="/tmp/lattice.plot.png",color=TRUE)
print(plot_obj)
dev.off()

image <- jsonlite::base64_enc(readBin("/tmp/lattice.plot.png","raw",file.info("/tmp/lattice.plot.png")[1,"size"]))

page <- Site("/demo")
page$drop()
page$add_card("lattice",ui_image_card(box="1 1 6 10"
                    ,title="lattice render"
                    ,type='png'
                    ,image=image
))
page$save()

