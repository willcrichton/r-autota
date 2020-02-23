handle_no_function <- function(trace) {
  pattern <- stringr::regex("could not find function \"(.*)\"$")
  match <- stringr::str_match(trace$message, pattern)
  if (is.na(match)) { return(FALSE); }

  missing_obj <- match[[1, 2]]
  matches <- find_closest_string(missing_obj)
  packages <- find_packages_containing_var(missing_obj)
  send_message(bulid_error(
    kind="no_function",
    trace=trace,
    query=trace$message,
    matches=matches,
    packages=packages,
    missing_obj=missing_obj))

  TRUE
}

