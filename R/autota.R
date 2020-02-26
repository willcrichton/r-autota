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
#' @importFrom pipeR %>>%
#' @importFrom rlist list.zip list.filter


DEV_URL <- "http://localhost:3000/"
DEBUG <- FALSE

debug_print <- function(...) {
  if (DEBUG) {
    cat(...);
  }
}

open_webpage <- function(url) {
  viewer <- getOption("viewer")
  viewer(url)
}


# https://www.r-bloggers.com/global-variables-in-r-packages/
pkg.globals <- new.env()
pkg.globals$cur_url <- NULL

start_autota <- function(url) {
  pkg.globals$cur_url <- url
  open_webpage(url)

  handle_error <- function(trace) {
    handle_obj_not_found(trace) ||
    handle_no_function(trace) ||
    handle_syntax_error(trace) ||
    handle_no_path(trace) ||
    handle_generic_error(trace)

  }

  error_handler <- function(...) {
    rlang::entrace(...)
    trace <- rlang::last_trace()
    withCallingHandlers({
      handle_error(trace)
    }, error = function(e) {
      if (DEBUG) {
        print(sys.calls())
        print(e)
      }
    })
  }

  options(error = error_handler)
}

send_message <- function(message) {
  json <- jsonlite::toJSON(message)
  debug_print("Sending message: ", json)
  open_webpage(paste0(pkg.globals$cur_url, "?q=", utils::URLencode(json)))
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

#' Run the AutoTA RStudio addin in developer mode.
#'
#' @export
addin_dev <- function() {
  DEBUG <<- TRUE
  start_autota(DEV_URL)
}


