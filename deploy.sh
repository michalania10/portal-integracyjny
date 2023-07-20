#!/bin/bash

npm run build
rm -rf ../portal-integracyjny-build/*
cp -r build/* ../portal-integracyjny-build/
COMMIT_MESSAGE=`git show -s --pretty=format:"%h %s"`

cd ../portal-integracyjny-build
git add -u
git add static
git commit -m "$COMMIT_MESSAGE"
git push
