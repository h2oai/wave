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



#' @title Non Existence
#' 
#' @description A variable that checks for non-existence
#' 
`%notin%` <- Negate(`%in%`)


#' @title Default Internal Address
#' 
#' @description The default internal address used by \code{waved}
#' 
.default_internal_address = 'ws://localhost:10101'


#' @title Fetch Environment Variable
#' 
#' @param object An environment variable object string
#' 
#' @description Fetches the value associated with an environment variable. 
#' The associated value is obtained when the user passes the specific environment
#' object string. 
#' 
#' @return The \code{var} value that was found/associated with the provided
#' environment variable object string. 
#' 
#' @examples
#' .get_env_var("INTERNAL_ADDRESS")
#' 
.get_env_var <- function(object) {
        var <- Sys.getenv(paste0("H2O_WAVE_", object[1]))
        ifelse(var != "", return(var), return(object[2]))
}
