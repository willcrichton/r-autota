# Auto TA

[![Build Status](https://travis-ci.com/willcrichton/r-autota.svg?branch=master)](https://travis-ci.com/willcrichton/r-autota)

Auto TA is an RStudio addin to help novice data scientists debug common R errors. Auto TA provides real-time, in-context support for common errors like `object not found` and `unexpected string constant`.

![](https://preview.redd.it/gt09yy5yoij41.png?width=3584&format=png&auto=webp&s=8e3ad2b6a38c1dab29b98f2c448749b128d3a663)

## Installation

Run this R command:

```r
install.packages('autota')
```

If you're using RStudio Cloud, refresh the webpage (make sure to clear your cache using Control-Shift-R, Command-Shift-R, or Command-Option-R).

### From source

If you want the latest version of Auto TA, or if you want to contribute to Auto TA, then install it from source using `devtools`:

```r
install.packages('devtools')
devtools::install_github('willcrichton/r-autota')
```

## Usage

In RStudio, click "Addins" (rightmost item on the toolbar near the top) and click "Enable Auto TA". Then run a piece of code that generates an error, like `cat(1 2)` and watch the magic happen!
