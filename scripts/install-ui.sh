#!/bin/bash

pushd ui
npm run build
git rm -r ../inst/ui
mkdir ../inst/ui
cp -r build ../inst/ui/
git add ../inst/ui/
git commit -m "Update UI build"
popd
