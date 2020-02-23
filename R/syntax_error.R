handle_syntax_error <- function(trace, send_message) {
  pattern <- stringr::regex("Error: unexpected (.*) in \"(.+)\"$")
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  syntax_kind <- match[[1,2]]
  bad_expr <- match[[1,3]]

  send_message(list(kind="syntax_error", message=trace$message,
                    syntax_kind=syntax_kind, bad_expr=bad_expr))
}
