find_closest_path <- function(s, max_dist = 2, max_matches = 3) {
  all_files <- list.files(path = getwd(), pattern = NULL, all.files = FALSE,
                          full.names = TRUE, recursive = FALSE,
                          ignore.case = FALSE, include.dirs = FALSE, no.. = FALSE)
  dists <- stringdist::stringdist(s, all_files)
  sorted_dists <- sort(dists, index.return=TRUE)
  idxs_within_max <- sorted_dists$ix[sorted_dists$x <= max_dist]
  if (length(idxs_within_max) == 0) { return(list()) }

  files_within_max <- all_files[idxs_within_max]
  files_within_max[1:min(length(files_within_max), max_matches)]
}

handle_no_path <- function(trace) {
  missing_path <- trace[["trace"]][["calls"]][[1]][[2]]
  if (is.na(missing_path)) { return(FALSE); }
  matches <- find_closest_path(missing_path)
  send_message(build_error(
    kind="missing_path",
    trace=trace,
    query=trace$message,
    missing_path=matches
    ))

  TRUE
}






# err <- "Error in file(file, \"rt\") : cannot open the connection
# In addition: Warning message:
# In file(file, \"rt\") :
#   cannot open file '/Users/Emma/Documents/r/r-autota/trry.csv': No such file or directory"
# pattern <- stringr::regex("cannot open file \'(.*)\': No such file or directory$")
# match <- stringr::str_match(err, pattern)
# missing_path <- match[[1, 2]]


