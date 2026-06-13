#!/bin/bash
read -p "Type 'yes. undeploy smeckles in firebase' to confirm: " confirmation
if [ "$confirmation" = "yes. undeploy smeckles in firebase" ]; then
  firebase hosting:disable --force
else
  echo "Confirmation failed. Hosting remains active."
  exit 1
fi
