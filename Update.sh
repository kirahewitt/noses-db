#!/bin/bash

eval cd /etc/SealQL/sealqlteam6
gitResults=$(git pull https://sealql:6maetlqlaes@github.com/rocktothorpe/sealqlteam6 2> /dev/null)

'''
if [[ $? != 0 ]] ; then
   error=$?
   message="System attempted git pull failed with error: $error"
   echo $message | mail -s "Code pull failed" joseph.buelow@yahoo.com
   exit 1
fi
'''

if [[ $gitResults != *"Already up to date."* ]] ; then
   eval cd /etc/SealQL/sealqlteam6/noses
   eval systemctl restart SealQL.service
   '''
   if [[ $? != 0 ]] ; then
      message="System attempted to restart backend and failed with error: $error"
      echo $message | mail -s "Backend restart failed" joseph.buelow@yahoo.com
   fi
   '''
   eval set -o pipefail
   eval npm install
   buildRes=$(eval ng build --prod)
   error=${PIPSTATUS[0]}
   '''
   if [[ $error != 0 ]] ; then
      message="System attempted ng run that failed with error: $error"
      echo $message | mail -s "Auto-Build Failed" joseph.buelow@yahoo.com
      echo $message | mail -s "Auto-Build Failed" raquelb.2014@gmail.com
      exit 1
   fi
   '''
fi
exit 0
