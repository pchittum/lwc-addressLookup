public with sharing class UKAddressResponse {
    public String latitude {get;set;}
    public String longitude {get;set;}
    public String responseMessage {get;set;}
    public Integer responseCode {get;set;}
    public List<String> addresses {get;set;}
}
