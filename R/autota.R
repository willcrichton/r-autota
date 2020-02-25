# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Install Package:           'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'

library(pipeR)
library(rlist)

DEV_URL <- "http://localhost:3000/"
PROD_URL <- "https://willcrichton.github.io/r-autota/autota.html"

DEBUG <- FALSE

debug_cat <- function(...) {
  if (DEBUG) {
    cat(...);
  }
}

start_autota <- function(url) {
  viewer <- getOption("viewer")
  viewer(url)

  # editor <- rstudioapi::getSourceEditorContext()

  send_message <<- function(message) {
    json <- jsonlite::toJSON(message)
    debug_cat("Sending message: ", json)
    viewer(paste0(url, "?q=", URLencode(json)))
  }

  handle_error <- function(trace) {
    handle_obj_not_found(trace) ||
    handle_no_function(trace) ||
    handle_syntax_error(trace) ||
    handle_generic_error(trace)
  }

  error_handler <- function(...) {
    rlang::entrace(...)
    trace <- rlang::last_trace()
    handle_error(trace)
  }

  options(error = error_handler)
}

#' @export
addin <- function() {
  start_autota(PROD_URL)
}

#' @export
addin_dev <- function() {
  start_autota(DEV_URL)
}


