#!/bin/sh
# line endings must be \n, not \r\n !
FILE_PATH=./public/env-config.js

if [ "$#" -eq 1 ]; then
    FILE_PATH=$1
fi

echo $FILE_PATH
echo "window._env_ = {" > ${FILE_PATH}
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> ${FILE_PATH}
# eliminate double quatation
sed -i "s/\"\"/\"/g" ${FILE_PATH}

echo "}" >> ${FILE_PATH}