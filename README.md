# Address Lookup Lightning Web Component

Ligtning web component that demonstrates a client-side callout to non-Salesforce endpoint. 

**Use Case:**
UK Post Codes contain a relatively small number of addresses (on average fewer than 50), often contained in a single street. So when asking for a person's address (whether over the phone, or on a website), the convention is to ask for a postcode first, then lookup an address. You can then use this information to populate the full address required. 

Postcodes are also dynamic and change constantly as new construction happens. 

Perfect use case for a web service, of which there are many. 

This project currently uses getAddress.io. This is not an endorsement or recommendation of this web service. Rather, it was a relatively straightforward webservice to build a callout to (even if it is a narrow use case that only is relevant to folks in the UK). 

getAddress.io makes requires an API key, which is free for 30 days. During this time, you can test requests relating to any UK postcode within the daily limit. After that time, there are a handfull of test post codes (including two real ones) that you can continue to test against

## Dev, Build and Test


## Resources

**The Actual Service**
This project currently uses getAddress.io. This is not an endorsement or recommendation of this web service. Rather, it was a relatively straightforward webservice to build a callout to (even if it is a narrow use case that only is relevant to folks in the UK). 

getAddress.io requires an API key, which you can obtain quickly from their website. It is free for 30 days. During this time, you can test requests relating to any UK postcode within the daily limit. After that time, there are a handful of test post codes (including two real ones) that you can continue to test with without purchasing the minimum license API key (which is pretty cheap, to be fair). 

The API key is stored in the `Get_Address_IO__c` custom setting. I've chosen this over a custom metadata type to prevent the accidental storing and propagation of API keys in git history of the project. 

There is also an admin API key. This project implements none of the REST endpoints that require the admin key. 

**Enabling Fetch with LockerService**

Client side security is implemented with Locker Service. One feature is the implementation of content security policy (CSP). The default CSP policies for Lightning prohibit the use of `fetch` to any domain, but self. To enable `fetch` for a third party website, you'll be required to update the CSP Trusted Site setting

## Description of Files and Directories


## Issues


