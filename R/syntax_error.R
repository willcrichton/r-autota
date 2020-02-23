handle_syntax_error <- function(trace, send_message) {
  pattern <- stringr::regex("Error: unexpected (.*) in:?\\s+\"(.+)\"$", dotall=TRUE)
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  syntax_kind <- match[[1,2]]
  bad_expr <- match[[1,3]]

  # Extract the partial parse information for the malformed expression.
  #   A dummy "srcfile" is required to store the parse data extracted by getParseData.
  srcfile <- srcfilecopy(filename='', lines=c(bad_expr))
  parse_ret <- tryCatch(
    {parse(text=bad_expr, keep.source=TRUE, srcfile=srcfile)},
    error=function(e){NULL})
  parse_info <- if (is.null(parse_ret)) {
    parse_data <- getParseData(srcfile)
    purrr::transpose(parse_data) %>>%
      list.filter(.$terminal)
  } else {
    NULL
  }

  send_message(list(kind="syntax_error", message=trace$message,
                    syntax_kind=syntax_kind, bad_expr=bad_expr, parse_info=parse_info))
}
