library(RJSONIO)

ast_node <- function(type, str_rep, children) {
  list(
    type=type,
    str_rep=str_rep,
    children=children
  )
}

# x created from rlang::parse_expr("SOME_EXPRESSION")
lang2list <- function(x) {
  if (rlang::is_syntactic_literal(x)) {
    return(ast_node("constant", x, NULL))
  } else if (is.symbol(x)) {
    return(ast_node("symbol", x, NULL))
  } else if (is.call(x)) {
    childrenList <- list()
    for (i in 2:length(x)) {
      val <- expr_type(x[[i]])
      childrenList[[i-1]] <- val
    }
    return(ast_node("call", x[[1]], childrenList))
  } else if (is.pairlist(x)) {
    # TODO: add support for pairlists
    return(ast_node("pairlist", x, NULL))
  } else {
    return(ast_node(typeof(x), x, NULL))
  }
}

lang2json <- function(x) {
  RJSONIO::toJSON(lang2list(x))
}
# cat(lang2json(str2lang("y <- x(10) * 2 + 1")))

