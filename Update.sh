#!/bin/bash

eval cd /etc/SealQL/sealqlteam6
gitResults=$(git pull https://sealql:6maetlqlaes@github.com/rocktothorpe/sealqlteam6 2> /dev/null)

if [[ $gitResults != *"Already up to date."* ]] ; then
   eval cd /etc/SealQL/sealqlteam6/noses
   eval systemctl restart SealQL.service
   eval set -o pipefail
   eval npm install
   buildRes=$(eval ng build --prod)
   error=${PIPSTATUS[0]}
fi
exit 0
