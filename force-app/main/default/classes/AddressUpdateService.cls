public with sharing class AddressUpdateService {

    @AuraEnabled
    public static String updateAddress(GetAddressIoAddress newAddress, String recIdString){

        String response = '';

        Id recId = recIdString;

        SObject record = recId.getSobjectType().newSObject(recId);
        System.debug(record);
        System.debug(recId);
        System.debug(newAddress);

        if (newAddress.postcode == null){
            response = 'Save Aborted: Insufficient Address Data.';
        } else {

            switch on record {
                when Account a {
                    System.debug('Account Save Flow');
                    a.BillingStreet = newAddress.line1; //needs line2 and line3 as well
                    a.BillingCity = newAddress.city;
                    a.BillingState = newAddress.county;
                    a.BillingPostalCode = newAddress.postcode;
                }
                when else {
                    response = 'Address Lookup is not implemented with the ' + recId.getSobjectType().getDescribe().getName() + ' object.';
                    System.debug(response);
                    return response;
                }
            }

            Database.SaveResult result = Database.update(record);

            if (result.isSuccess()){
                response = 'Success';
            } else {
                for (Database.Error err : result.getErrors()){
                    if (response.length() > 0) {
                        response = response + ',';
                    }
                    response = response + err.getMessage();
                }
            }
        }

    
        return response; 
        
    }

}
