public with sharing class GetAddressIoAddress {
    @AuraEnabled
    public String line1 {get;set;}

    @AuraEnabled
    public String line2 {get;set;}
    
    @AuraEnabled
    public String line3 {get;set;}
    
    @AuraEnabled
    public String city {get;set;}
    
    @AuraEnabled
    public String county {get;set;}
    
    @AuraEnabled
    public String postcode {get;set;}
}
