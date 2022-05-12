# R Plots / ggplot2
# Render a ggplot artifact created in R thru Wave
# --

library(h2owave)
library(ggplot2)
gg <- ggplot(midwest, aes(x=area, y=poptotal)) + 
  geom_point(aes(col=state), size=3) +  # Set color to vary based on state categories.
  geom_smooth(method="lm", col="firebrick", size=2) + 
  coord_cartesian(xlim=c(0, 0.1), ylim=c(0, 1000000)) + 
  labs(title="Area Vs Population", subtitle="From midwest dataset", y="Population", x="Area", caption="Midwest Demographics")

ggsave("/tmp/tmp.plot.png",plot=gg,device="png")

image <- jsonlite::base64_enc(readBin("/tmp/tmp.plot.png","raw",file.info("/tmp/tmp.plot.png")[1,"size"]))

page <- Site("/demo")
page$drop()

page$add_card("ggplot2",ui_image_card(box="1 1 6 10"
                    ,title="ggplot render"
                    ,type='png'
                    ,image=image
))
page$save()

