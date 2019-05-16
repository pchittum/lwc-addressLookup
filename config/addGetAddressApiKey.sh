#!/bin/bash

# script to create sandbox with using record:create command from salesforce cli
# also a template for performing any Salesforce single record update
# this script could also serve as a template for invoking any sfdx command through a shell script

# possible fields for sandbox refresh: ApexClassId, AutoActivate, CopyArchivedActivities, CopyChatter, Description,
#   HistoryDays, LicenseType*, SandboxName, SourceId, TemplateId

# is salesforce cli installed?
if [[ ! -e $(which sfdx) ]]; then
  
  echo "The Salesforce CLI is not installed on this machine."
  echo "Please install from https://developer.salesforce.com/tools/sfdxcli."
  exit 1

fi

echo "Add api key for getAddress.io service for default scratch org."

read -p "Org to add API key ([ENTER] if using default org): " user

read -p "getAddresio.io api key: " key 

# construct sfdx command and arguments
# here's where a few tweaks could be done either to change the sobject or field(s) to update
# or different a different command and and its parameters could be used
command="sfdx force:data:record:create"
#adminuser=""
sobject="-s Get_Address_IO__c"  #add a -t for tooling api
values="-v \"Name='api-key' apiKey__c='$key'\""

# check if user is specified and if not use default env for this project
if [[ -z "$user" ]]; then

  adminuser=""

else 

  adminuser="-u $user"

fi

# reflect back command to user
echo "RUNNING COMMAND: $command $sobject $values $adminuser"
  
# run command using eval
# eval currently required with complex value sets passed into the -v flag
# otherwise the single quote ASCII code is being passed to the API

eval "$command" "$sobject" "$values"

echo "Done."
exit 0
