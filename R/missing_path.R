find_closest_path <- function(s, max_dist = 1, max_matches = 3) {
  is_absolute_path <- substr(toString(s), 1, 1) == "/"
  all_files <- list.files(path = getwd(), pattern = NULL, all.files = FALSE,
                          full.names = is_absolute_path, recursive = FALSE,
                          ignore.case = TRUE, include.dirs = FALSE, no.. = FALSE)

  dists <- stringdist::stringdist(s, all_files)
  sorted_dists <- sort(dists, index.return=TRUE)
  idxs_within_max <- sorted_dists$ix[sorted_dists$x <= max_dist]
  if (length(idxs_within_max) == 0) { return(list()) }
  files_within_max <- all_files[idxs_within_max]
  files_within_max[1:min(length(files_within_max), max_matches)]
}

handle_no_path <- function(trace) {
  pattern1 <- stringr::regex("Error in .* : cannot open the connection")
  pattern2 <- stringr::regex("Error: .* does not exist in current working directory .*.")
  pattern3 <- stringr::regex("Error: .* does not exist.")
  match1 <- stringr::str_match(trace$message, pattern1)
  match2 <- stringr::str_match(trace$message, pattern2)
  match3 <- stringr::str_match(trace$message, pattern3)
  if (is.na(match1) && is.na(match2) && is.na(match3)) { return(FALSE); }
  if (is.null(trace$trace$calls)) {
    missing_path <- NULL;
    matches <- NULL;
  } else if (length(trace$trace$calls) < 2 || length(trace$trace$calls[[1]]) < 2) {
    missing_path <- NULL;
    matches <- NULL;
  } else {
    missing_path <- trace$trace$calls[[1]][[2]]
    matches <- find_closest_path(missing_path)
  }


  send_message(build_error(
    kind="missing_path",
    trace=trace,
    query=trace$message,
    query_explain="",
    matches=matches,
    missing_path=missing_path
    ))

  TRUE
}


