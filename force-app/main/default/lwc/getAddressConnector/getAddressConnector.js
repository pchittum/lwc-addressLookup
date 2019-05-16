//private module members
const _urlRoot = 'https://api.getAddress.io';

const _getResponseError = (response) => {

    // handling cases found in getAddress.io error docs
    /**
     * 404: address not found
     * 400: invalid request
     * 401: api key expired
     * 429: daily api request limit exceeded
     * 500: server error from service (according to getAddress, we should never see this.)
     */

    let e; 

    switch (response.statusText) {
        case 'Not Found': 
            e = new Error('No addresses were found for this post code. Please enter manually.');
            e.name = 'NotFoundError'; // flag this so we can handle 
            break;
        case 'Bad Request': 
            e = new Error('There was an error in the request to the address service. Please contact support to report this. (400)');
            break;
        case 'Unauthorized': 
            e = new Error('The subscription to the address service has lapsed. Please contact support to report this. (401)');
            break; 
        case 'Too Many Requests': 
            e = new Error('The system has exceeded the maximum requests to the address service per day. Please contact support to report this. (429)');
            break; 
        case 'Internal Server Error': 
            e = new Error('There was an failure in the address service. Please contact support. (500)');
            break;
        default: 
            //we should never get here
            e = new Error('An unexpected error condition has occurred. Please contact support.');
            break; 
    }

    return e; 

}

//exported module class
export default class GetAddressConnector {

    //class-based implementation of service component

    constructor(apiKey){
        this._apiKey = apiKey;
    }

    findAddressesFromPostcode = (postcode) => {

        const calloutURI = `${_urlRoot}/find/${postcode}?api-key=${this._apiKey}&expand=true`;
    
        return fetch(calloutURI, {
            "method": "GET"
        }).then(
            (response) => {
                if (response.ok) {
    
                    return response.json();
    
                } 
    
                throw _getResponseError(response);
    
            }
        );
    }; 

    findAddressesFromPostcodeAndHouse = (postcode, houseNumber) => {

        const calloutURI = `${_urlRoot}/find/${postcode}/${houseNumber}?api-key=${this._apiKey}&expand=true`;
    
        return fetch(calloutURI, {
            "method": "GET"
        }).then(
            (response) => {
                if (response.ok) {
    
                    return response.json();
    
                } 
    
                throw _getResponseError(response);
    
            }
        );

    };

    getDistanceBetweenPostcodes = (postcodeFrom, postcodeTo) => {

        const calloutURI = `${_urlRoot}/distance/${postcodeFrom}/${postcodeTo}?api-key=${this._apiKey}`;
    
        return fetch(calloutURI, {
            "method": "GET"
        }).then(
            (response) => {
                if (response.ok) {
    
                    return response.json();
    
                } 
    
                throw _getResponseError(response);
    
            }
        );

    };

    getLimits = () => {

        const calloutURI = `${_urlRoot}/v2/usage?api-key=${this._apiKey}`;
    
        return fetch(calloutURI, {
            "method": "GET"
        }).then(
            (response) => {
                if (response.ok) {
    
                    return response.json();
    
                } 
    
                throw _getResponseError(response);
    
            }
        );

    };

    getLimitsOnDay = (day, month, year) => {

        const calloutURI = `${_urlRoot}/v2/usage/${day}/${month}/${year}?api-key=${this._apiKey}`;
    
        return fetch(calloutURI, {
            "method": "GET"
        }).then(
            (response) => {
                if (response.ok) {
    
                    return response.json();
    
                } 
    
                throw _getResponseError(response);
    
            }
        );

    };

}