#!/bin/bash

eval cd /etc/SealQL

gitResults=`git pull`

if [[ $? != 0 ]] ; then
   error=$?
   message="System attempted git pull failed with error: $error"
   echo $message | mail -s "Code pull failed" joseph.buelow@yahoo.com
   exit 1
fi

if [[ $gitResults != "Already up to date." ]] ; then
   eval cd /etc/SealQL/sealqlteam6/noses
   eval set -o pipefail
   buildRes=$(eval ng buil --prod)
   error=${PIPSTATUS[0]}
   if [[ $error != 0 ]] ; then
      message="System attempted ng run that failed with error: $error"
      echo $message | mail -s "Auto-Build Failed" joseph.buelow@yahoo.com
      echo $message | mail -s "Auto-Build Failed" raquelb.2014@gmail.com
      exit 1
   fi
fi
exit 0
