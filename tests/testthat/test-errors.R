context("Error handling")
rlang::local_options(viewer = function(url) {})
local_mock(
  `rstudioapi::translateLocalUrl` = function(url, ...) { url },
  `rstudioapi::getSourceEditorContext` = function() { NULL }
)

setup(autota::addin())
teardown(autota::stop_addin())

get_trace <- function(expr) {
  rlang::with_handlers(
    rlang::with_abort(eval(expr)),
    error = function(e) { e })
}

test_that("syntax errors work", {
  trace <- get_trace(quote(parse(text = "cat('1''2')")))
  expect_silent(autota::handle_error(trace))
})

test_that("object not found errors work", {
  trace <- get_trace(quote(asdfg))
  expect_silent(autota::handle_error(trace))
})

test_that("function not found errors work", {
  trace <- get_trace(quote(asdfg()))
  expect_silent(autota::handle_error(trace))
})

test_that("closure not subsettable errors work", {
  trace <- get_trace(quote(df$x))
  expect_silent(autota::handle_error(trace))
})

test_that("file missing path errors work", {
  trace <- expect_warning(get_trace(quote(read.csv("/an/invalid/path"))))
  expect_silent(autota::handle_error(trace))
})

