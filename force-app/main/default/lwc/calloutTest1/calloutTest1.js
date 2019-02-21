import { LightningElement, track } from 'lwc';
import getAddressIo from 'c/getAddressIo';

/**
 * ToDo:
 * - API Key stored on server
 * 
 * Nice To Have:
 * - WTF is up with not being able to post the request
 * 
 */

export default class CalloutTest1 extends LightningElement {

    @track result = [];
    @track error;
    latitude; 
    longitude;
    defaultSearchKey = 'TR19 7AA';
    apikey = getAddressIo.apiKey;
    searchKey = 'TR19 7AA'; 

    handleSearchKeyChange(event){
        this.searchKey = event.target.value;
    }

    handleClick(){

        let postcode = 'TR197AA';

        //window.console.log('bound value' + event.target.value); 
        window.console.log('bound var value ' + this.searchKeyNoWhiteSpace);

        if (this.searchKey && this.searchKey !== ''){
            postcode = this.searchKey.replace(/\s/, '');
        
            const calloutURI = `https://api.getAddress.io/find/${postcode}?api-key=${this.apikey}&expand=true`;

            fetch(calloutURI, {
                "method": "GET",
    /*            "mode": "cors",
                "headers": {
                    /*"api-key": apikey,
                    "Access-Control-Request-Method": "GET,POST,OPTIONS",
                    "Access-Control-Request-Headers": "Origin,Content-Type,Authorization,api-key",
                    "Origin": "https://dream-ruby-9364-dev-ed.lightning.force.com"
                    
                }*/
            }).then(
                (response) => {

                    if (response.ok) {
                    return response.json();
                    }
                    
                    throw new Error('Response was not OK.');
                }
            ).then(
                (responseJSON) => {
                    window.console.log('got to JSON');
                    let addressList = responseJSON.addresses.map(
                        (item) => {
                            return {
                                "line1": item.formatted_address[0],
                                "line2": item.formatted_address[1],
                                "line3": item.formatted_address[2],
                                "city": item.formatted_address[3],
                                "county": item.formatted_address[4],
                                "postcode": this.searchKey,
                            };
                        }
                    );
                    this.result = addressList;
                    this.latitude = responseJSON.latitude;
                    this.longitude = responseJSON.longitude;
                    window.console.log(JSON.stringify(responseJSON));
                }
            ).catch(
                error => {this.error = 'Error: ' + error}
            );
        }    

    }

    mockAddress = {
        "postcode": "NN1 3ER",
        "latitude": 52.24593734741211,
        "longitude": -0.891636312007904,
        "addresses": [{
            "formatted_address": [
                "10 Watkin Terrace",
                "",
                "",
                "Northampton",
                "Northamptonshire"
            ],
            "thoroughfare": "Watkin Terrace",
            "building_name": "",
            "sub_building_name": "",
            "sub_building_number": "",
            "building_number": "10",
            "line_1": "10 Watkin Terrace",
            "line_2": "",
            "line_3": "",
            "line_4": "",
            "locality": "",
            "town_or_city": "Northampton",
            "county": "Northamptonshire"
        }]
    }
}