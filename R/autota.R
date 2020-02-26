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

DEV_URL <- "http://localhost:3000/r-autota/index.html"

DEBUG <- TRUE

debug_print <- function(...) {
  if (DEBUG) {
    cat(...);
  }
}

start_autota <- function(url) {
  viewer <- getOption("viewer")
  viewer(url)

  send_message <<- function(message) {
    json <- jsonlite::toJSON(message)
    debug_print("Sending message: ", json)
    viewer(paste0(url, "?q=", utils::URLencode(json)))
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

last_server <- NULL

start_server <- function() {
  if (!is.null(last_server)) {
    last_server$stop_server()
  }

  ui_dir <- system.file("ui", "build", package = "autota")
  last_server <<- servr::httd(ui_dir)
}

#' Run the AutoTA RStudio addin.
#'
#' @export
addin <- function() {
  start_server()
  url <- rstudioapi::translateLocalUrl(last_server$url)
  start_autota(url)
}

#' Run the AutoTA RStudio addin in developer mode.
#'
#' @export
addin_dev <- function() {
  DEBUG <<- TRUE
  start_autota(DEV_URL)
}


