
#' Configure the environmental variables
#' This is a (hidden) internal function
#' 
#' The environmental variables configured here are:
#' internal_address
#' external_address
#' hub_address
#' hub_access_key_id
#' hub_access_key_secret
#' shutdown_timeout
#' They are stored in a list \code{.config}
#' @return
#' @export
#'
#' @examples
.onLoad <- function(...){
        .config <<- list()
        .config$internal_address <<- .get.env.var(c("INTERNAL_ADDRESS",.default_internal_address))
        .config$external_address <<- .get.env.var(c("EXTERNAL_ADDRESS",.config$internal_address))
        .config$hub_address <<- .get.env.var(c("ADDRESS",'http://localhost:10101'))
        .config$hub_access_key_id <<- .get.env.var(c('ACCESS_KEY_ID', 'access_key_id'))
        .config$hub_access_key_secret <<- .get.env.var(c('ACCESS_KEY_SECRET','access_key_secret'))
        .config$shutdown_timeout <<- as.integer(.get.env.var(c('SHUTDOWN_TIMEOUT','3')))
}

