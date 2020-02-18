handle_no_function <- function(trace, send_message) {
  #TODO: This check was already done outside, just pass match through
  pattern <- stringr::regex("could not find function (.*)")
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }
  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  send_message(list(kind="no_function", message=trace$message, matches=matches))
}
