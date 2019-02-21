import { LightningElement, track, api } from 'lwc';
import updateAddress from '@salesforce/apex/AddressUpdateService.updateAddress';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAddressIo from 'c/getAddressIo'; 

/**
 * ToDo:
 * - API Key stored on server
 * - handle other failures
 * - refactor connection to its own class/module
 * - add in error panel/better visual error handling
 * - veryify handling child event bubbling in parent
 * 
 * Nice To Have:
 * - WTF is up with not being able to post the request
 * 
 */
export default class AddressLookupCalloutApex extends LightningElement {

    // Salesforce record
    @api recordId;

    //tracked reactive private props
    @track result = [];
    @track selectedAddress = '';
    @track error;
    @track stack; 

    //private props
    searchKey = 'TR19 7AA'; 
    latitude; 
    longitude;
    apikey = getAddressIo.apiKey; //this is silly for now, but will fix later
    
    //unused
    // postcode;
    // getAddressApiRoot = 'https://api.getAddress.io';
    // getAddressFind = 'find';

    handleSearchKeyChange(event){
        this.searchKey = event.target.value;
    }

    handleFind(){

        this.result = [];
        this.error = undefined;
        this.stack = undefined;

        if (this.searchKey && this.searchKey !== ''){
            let postcode = this.searchKey.replace(/\s/, '');
        
            getAddressIo
                .findAddressesFromPostcode( this.apikey, postcode)
                .then(respAddressesObj => {
                    let addressList = respAddressesObj.addresses.map( item => {
                            // scrubbing out commas as we'll end up passing this around as a string
                            return {
                                "line1": item.formatted_address[0],
                                "line2": item.formatted_address[1],
                                "line3": item.formatted_address[2],
                                "city": item.formatted_address[3].replace(/,/g, ''),
                                "county": item.formatted_address[4],
                                "postcode": this.searchKey,
                            };
                    });
                    this.result = addressList; 
                    this.latitude = respAddressesObj.latitude; 
                    this.longitude = respAddressesObj.longitude; 
                })
                .catch(error => {
                    this.error = `Error: ${error}`; 
                });

        }    

    }

    handleChange(event){
        this.selectedAddress = event.detail;
        window.console.log(this.selectedAddress);
    }

    handleSave(){
        window.console.log('invoking handle save with: ' + JSON.stringify(this.selectedAddress));
        if (this.selectedAddress){
            window.console.log('we have an address');

            const addressArray = this.selectedAddress.value.split(',');
            let addressObj = {};

            window.console.log('address array length: ' +addressArray.length);
            if (addressArray.length === 6){
                addressObj = {
                    "line1": addressArray[0],
                    "line2": addressArray[1],
                    "line3": addressArray[2],
                    "city": addressArray[3],
                    "county": addressArray[4],
                    "postcode": addressArray[5],
                }
            }


            //need to save this to something. 
            window.console.log(JSON.stringify(addressObj));
            window.console.log(this.recordId);

            //call apex method
            updateAddress({
                newAddress: addressObj, 
                recIdString: this.recordId
            })
                .then(result => {
                    window.console.log(result);
                    this.error = undefined; 

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Record Updated',
                            message: 'The record has been updated with a new address',
                            variant: 'success'
                        })
                    );
                })
                .catch (error => {
                    this.error = error; 
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Update Failed',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                })
        } else {
            this.error = new Error('You must select an address to save');
        }
    }

    get hasRecordId(){
        return this.recordId ? true : false;
    }

    get saveable(){
        return !this.hasRecordId;
    }

    get hasResults(){
        return this.result.length > 0; 
    }

    errorCallback(error, stack){
        this.error = error; 
        this.stack = stack; 
    }

}