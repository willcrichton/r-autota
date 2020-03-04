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
pkg.globals$file_server <- NULL
pkg.globals$file_url <- NULL
pkg.globals$socket_server <- NULL
pkg.globals$socket_url <- NULL

DEV_URL <- "http://localhost:3000/"

debug_print <- function(...) {
  if (pkg.globals$debug) {
    cat(...);
  }
}

open_webpage <- function(args = "") {
  viewer <- getOption("viewer")
  full_url <-  paste0(pkg.globals$file_url, "/?", args,
                      "&socket=", utils::URLencode(pkg.globals$socket_url))
  viewer(full_url)
}

#' Runs all error handlers against an rlang trace.
#' For internal use only.
#'
#' @param trace the rlang trace to handle
#' @export
handle_error <- function(trace) {
  handle_obj_not_found(trace) ||
    handle_no_function(trace) ||
    handle_syntax_error(trace) ||
    handle_no_path(trace) ||
    handle_closure_not_subsettable(trace) ||
    handle_generic_error(trace)
}

start_autota <- function() {
  open_webpage()

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
  open_webpage(paste0("&q=", encoded_json))
}

start_file_server <- function() {
  stop_file_server()
  ui_dir <- system.file("ui", "build", package = "autota")
  port <- httpuv::randomPort()
  pkg.globals$file_server <- httpuv::startServer(
    "127.0.0.1", port,
    list(staticPaths=list("/" = ui_dir)))
  url <- rstudioapi::translateLocalUrl(
    paste0("http://127.0.0.1:", port), absolute=TRUE)
  pkg.globals$file_url <- url
  url
}

stop_file_server <- function() {
  if (!is.null(pkg.globals$file_server)) {
    httpuv::stopServer(pkg.globals$file_server)
  }
}

start_socket_server <- function() {
  stop_socket_server()
  port <- httpuv::randomPort()
  pkg.globals$socket_server <- httpuv::startServer(
    "127.0.0.1", port,
    list(
      onWSOpen = function(ws) {
        ws$onMessage(function(binary, message) {
          message <- RJSONIO::fromJSON(message)
          command <- message$command
          args <- message$args
          if (command == "show_help") {
            code <- if (!is.null(args$package[[1]])) {
              glue("help(topic='{args$name}', package='{args$package}')")
            } else {
              glue("help(topic='{args$name}')")
            }
            rstudioapi::sendToConsole(code)
          }
        })
      }
    ))
  url <- rstudioapi::translateLocalUrl(paste0("http://127.0.0.1:", port), absolute=TRUE)
  pkg.globals$socket_url <- url
  url
}

stop_socket_server <- function() {
  if (!is.null(pkg.globals$socket_server)) {
    httpuv::stopServer(pkg.globals$socket_server)
  }
}

#' Run the AutoTA RStudio addin.
#'
#' @export
addin <- function() {
  file_url <- start_file_server()
  socket_url <- start_socket_server()
  start_autota()
}

#' Disable the AutoTA RSTudio addin.
#'
#' @export
stop_addin <- function() {
  stop_file_server()
  stop_socket_server()
}

#' Run the AutoTA RStudio addin in developer mode.
#'
#' @export
addin_dev <- function() {
  servr::daemon_stop()
  httpuv::stopAllServers()
  pkg.globals$debug <- TRUE
  pkg.globals$file_url <- DEV_URL
  socket_url <- start_socket_server()
  start_autota()
}


