# Auto TA

Auto TA is an educational effort to help novice data scientists debug common R errors. The tool aims to provide real-time in-context support for common "object not found" and "could not find function" errors, for example.

## Installation

First, run the following R commands:

```r
install.packages('devtools')
devtools::install_github('willcrichton/r-autota')
```

If you're in RStudio, refresh the page (make sure to clear your cache using Control-Shift-R, Command-Shift-R, or Command-Option-R).

## Usage

In RStudio, click "Addins" (rightmost item on the toolbar near the top) and click "Enable Auto TA". Then run a piece of code that generates an error, like `cat(1 2)` and watch the magic happen!
