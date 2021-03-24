# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


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
#' app_mode
#' They are stored in a list \code{.config}
#' @return
#' @export
#'
#' @examples

.onLoad <- function(...){
        .config <<- list()
        .config$internal_address <<- .get_env_var(c("INTERNAL_ADDRESS",.default_internal_address))
        .config$external_address <<- .get_env_var(c("EXTERNAL_ADDRESS",.config$internal_address))
        .config$hub_address <<- .get_env_var(c("ADDRESS",'http://localhost:10101'))
        .config$hub_access_key_id <<- .get_env_var(c('ACCESS_KEY_ID', 'access_key_id'))
        .config$hub_access_key_secret <<- .get_env_var(c('ACCESS_KEY_SECRET','access_key_secret'))
        .config$shutdown_timeout <<- as.integer(.get_env_var(c('SHUTDOWN_TIMEOUT','3')))
        .config$app_mode <<- .get_env_var(c('APP_MODE',UNICAST))
}

#' @export 
UNICAST <- 'unicast'