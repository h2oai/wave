get.crypto.data <- function(){
        crypto.data <- read.csv("../data/gemini.crypto.csv")
        sample.row <- crypto.data[sample(1:nrow(crypto.data),1),]
        get.date <- strsplit(sample.row$Date,split=" ")[[1]][1]
        get.symbol.close <- sample.row$Close
        get.symbol.open <- sample.row$Open
        get.symbol.net.price.change.percent <- round((sample.row$Close - sample.row$Open)*100/sample.row$Open,digits=1)
        get.crypto.symbol <- sample.row$Symbol
        return(list(get.symbol.close=get.symbol.close
                    ,get.date=get.date
               ,get.symbol.open=get.symbol.open
               ,get.symbol.net.price.change.percent=get.symbol.net.price.change.percent
               ,get.crypto.symbol=get.crypto.symbol))
}
