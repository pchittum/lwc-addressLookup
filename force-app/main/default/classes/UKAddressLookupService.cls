public with sharing class UKAddressLookupService {

    private static final String NAMED_CREDENTIAL_ROOT = 'callout:getAddress_io';
    private static final String FIND_RESOURCE = 'find';

    @AuraEnabled
    public static UKAddressResponse getAddressesForPostcode(String postcode){
        // test call UKAddressLookupService.getAddressesForPostcode('TR19 7AA');

        HttpRequest req = getGetAddressIoRequest(postcode);

        HttpResponse res = new Http().send(req);

        UKAddressResponse respObject = unpackGetAddressResponse(res); 

        return respObject;
    }

    @AuraEnabled
    public static UKAddressResponse getAddressForPostcodeAndHouse(String postcode, String house){
        // test call UKAddressLookupService.getAddressForPostcodeAndHouse('KW1 4YT','10');

        HttpRequest req = getGetAddressIoRequest(postcode, house);

        HttpResponse res = new Http().send(req);

        UKAddressResponse respObject = unpackGetAddressResponse(res); 

        return respObject;
    }

    private static HttpRequest getGetAddressIoRequest(String postcode, String house){

        String encodedPostcode = postcode.deleteWhitespace();

        String endpoint = NAMED_CREDENTIAL_ROOT + '/' + FIND_RESOURCE + '/' + encodedPostcode;
        endpoint = endpoint + (house == null ? '' : '/' + house.deleteWhitespace() ); 

        HttpRequest req = new HttpRequest();

        req.setMethod('GET');
        req.setEndpoint(endpoint);
        req.setHeader('api-key', '{!$Credential.Password}');

        return req;
    }

    private static HttpRequest getGetAddressIoRequest(String postcode){
        return getGetAddressIoRequest(postcode, null);
    }

    private static UKAddressResponse unpackGetAddressResponse(HttpResponse response){
        UKAddressResponse respObject;

        switch on response.getStatusCode() {
            when 200 {
                //success
                respObject = (UKAddressResponse) JSON.deserialize(response.getBody(), UKAddressResponse.class);
                respObject.responseMessage = response.getStatus();
                respObject.responseCode = response.getStatusCode();
            }
            when 404 {
                //address not found
                respObject = new UKAddressResponse();
                respObject.responseMessage = response.getStatus() + ' No Address Found';
                respObject.responseCode = response.getStatusCode();
                System.debug(LoggingLevel.WARN,'getAddress.io was not able to locate the searched postcode.');
            }
            when 400 {
                //Postcode not valid
                respObject = new UKAddressResponse();
                respObject.responseMessage = response.getStatus() + ' Invalid Postcode';
                respObject.responseCode = response.getStatusCode();
                System.debug(LoggingLevel.WARN,'This post code is not valid.');
            }
            when 401 {
                //Invalid API key
                respObject = new UKAddressResponse();
                respObject.responseMessage = response.getStatus() + ' API Key is Invalid';
                respObject.responseCode = response.getStatusCode();
                System.debug(LoggingLevel.WARN,'This getAddress.io API key is invalid.');
            }
            when 429 {
                //Exceeded max requests for API key
                respObject = new UKAddressResponse();
                respObject.responseMessage = response.getStatus() + ' Exceeded request limit for this period';
                respObject.responseCode = response.getStatusCode();
                System.debug(LoggingLevel.WARN,'Exceeded max requests for api key for getAddress.io.');
            }
            when else {
                // some other error
                respObject = new UKAddressResponse();
                respObject.responseMessage = response.getStatus();
                respObject.responseCode = response.getStatusCode();
                System.debug(LoggingLevel.ERROR,'There was an unknown failure in the getAddress.io API request.');
            }
        }

        return respObject;
    }

    private static final String TEST_SUCCESS_RESPONSE_DATA = '{"latitude":51.360535,"longitude":-0.694378,"addresses":["20 High Street, , , , , Bagshot, Surrey","22 High Street, , , , , Bagshot, Surrey","24a High Street, , , , , Bagshot, Surrey","24b High Street, , , , , Bagshot, Surrey","26 High Street, , , , , Bagshot, Surrey","Alma Interiors, 24 High Street, , , , Bagshot, Surrey","Flat, 28 High Street, , , , Bagshot, Surrey","Regal Credit Consultants Ltd, Regal House, 18 High Street, , , Bagshot, Surrey","Royal Mail, Bagshot Delivery Office, 28 High Street, , , Bagshot, Surrey"]}';
    private static final String TEST_NOT_FOUND_RESPONSE_DATA = '{"statusCode": 404,"message": "Not Found"}';

/*
Exec Anonymous tests: 

UKAddressResponse resp = UKAddressLookupService.getAddressesForPostcode('TR19 7AA');
System.debug(resp.addresses);
System.debug(resp.responseCode);

UKAddressResponse resp = UKAddressLookupService.getAddressForPostcodeAndHouse('KW1 4YT','10');
System.debug(resp.addresses);
System.debug(resp.responseCode);
*/

}
