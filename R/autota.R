# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Install Package:           'Cmd + Shift + B'
#   Check Package:             'Cmd + Shift + E'
#   Test Package:              'Cmd + Shift + T'

#' @importFrom stringr regex str_match
#' @importFrom magrittr %>%
#' @importFrom rlist list.zip list.filter list.map list.find
#' @importFrom rlang sym
#' @importFrom glue glue

# Prevent CHECK from raising a NOTE about use of "." operator
# https://github.com/tidyverse/magrittr/issues/29#issuecomment-74313262
utils::globalVariables(".")

# Have package global mutable variables that won't break
# https://www.r-bloggers.com/global-variables-in-r-packages/
pkg.globals <- new.env()
pkg.globals$cur_url <- NULL
pkg.globals$debug <- FALSE

DEV_URL <- "http://localhost:3000/"

debug_print <- function(...) {
  if (pkg.globals$debug) {
    cat(...);
  }
}

open_webpage <- function(url) {
  viewer <- getOption("viewer")
  viewer(url)
}

start_autota <- function(url) {
  pkg.globals$cur_url <- url
  open_webpage(url)

  handle_error <- function(trace) {
    handle_obj_not_found(trace) ||
    handle_no_function(trace) ||
    handle_syntax_error(trace) ||
    handle_no_path(trace) ||
    handle_closure_not_subsettable(trace) ||
    handle_generic_error(trace)
  }

  error_handler <- function(...) {
    rlang::entrace(...)
    trace <- rlang::last_trace()
    withCallingHandlers({
      withRestarts(
        { handle_error(trace) },
        ignoreError = function(e) { })
    }, error = function(e) {
      if (pkg.globals$debug) {
        print(sys.calls())
        stop(e)
      } else {
        cat("Auto TA failed while trying to handle your error. Try re-installing the package to see if that fixes your issue. Otherwise, click Addins > Disable Auto TA for now.
To help us improve the Auto TA, please take a screenshot and file an issue on our GitHub:
  https://github.com/willcrichton/r-autota
The specific error was:\n  ")
        cat(toString(e))
      }
      invokeRestart("ignoreError")
    })
  }

  options(error = error_handler)
}

send_message <- function(message) {
  json <- RJSONIO::toJSON(message, asIs = TRUE)
  debug_print("Sending message: ", json)
  encoded_json <- json %>%
    charToRaw(.) %>%
    base64enc::base64encode(.) %>%
    gsub("\\+", ".", .) %>%
    gsub("\\/", "_", .)
  open_webpage(paste0(pkg.globals$cur_url, "?q=", encoded_json))
}

start_server <- function() {
  servr::daemon_stop()
  ui_dir <- system.file("ui", "build", package = "autota")
  servr::httd(ui_dir)
}

#' Run the AutoTA RStudio addin.
#'
#' @export
addin <- function() {
  server <- start_server()
  url <- rstudioapi::translateLocalUrl(server$url, absolute=TRUE)
  start_autota(url)
}

#' Disable the AutoTA RSTudio addin.
#'
#' @export
stop_addin <- function() {
  servr::daemon_stop()
  options(error = rlang::entrace)
}

#' Run the AutoTA RStudio addin in developer mode.
#'
#' @export
addin_dev <- function() {
  pkg.globals$debug <- TRUE
  start_autota(DEV_URL)
}


