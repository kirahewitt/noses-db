   eval cd /home/noses/noses-db/noses
   eval systemctl restart SealQL.service
   #eval set -o pipefail
   eval npm install
   #buildRes=$(eval ng build --prod)
   #error=${PIPSTATUS[0]}
   #if [[ $error != 0 ]] ; then
   #   exit 1
   #fi
   eval ng build --prod
   error=$?
   if [[ $error != 0 ]] ; then
      exit $error
   fi
   eval cp /home/jbuelow/htaccess /home/noses/noses-db/noses/dist/noses/.htaccess
   eval systemctl restart apache2
