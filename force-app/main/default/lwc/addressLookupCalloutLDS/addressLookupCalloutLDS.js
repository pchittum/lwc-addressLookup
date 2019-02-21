import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';   

//apex imports
import getApiKey from '@salesforce/apex/GetAddressIoConnectSettings.getApiKey';

//connector
import getAddressIo from 'c/getAddressIo'; 

/**
 * ToDo:
 * - [DONE] API Key stored on server
 * - [DONE] handle specific callout failures
 * - [DONE] refactor connection to its own class/module
 * - add in error panel/better visual error handling
 * - veryify handling child event bubbling in parent
 * 
 * Nice To Have:
 * - Investigate post to REST service with api key in header
 */
export default class AddressLookupCalloutLDS extends LightningElement {

    // Salesforce record
    @api recordId;

    //tracked reactive private props
    @track result = [];
    @track selectedAddress = '';
    @track error;
    @track stack; 
    @track searchKey = ''; 

    //private props
    _latitude; 
    _longitude;

    // apikey = getAddressIo.apiKey;
    @wire(getApiKey) apikey;

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
                            // item at index 3 can contain two comma separated values.
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
                    this._latitude = respAddressesObj.latitude; 
                    this._longitude = respAddressesObj.longitude; 
            })
                .catch(error => {
                    this.error = `Error: ${error}`; 
                });

        }    

    }

    handleChange(event){
        this.selectedAddress = event.detail;
    }

    handleSave(){

        if (this.selectedAddress){

            const addressArray = this.selectedAddress.value.split(',');
            const updateObject = {};//this.getUpdateObject();
            //let recordInput = {};

            if (addressArray.length === 6){

                updateObject.fields = {
                    Id: this.recordId,
                    BillingStreet: `${addressArray[0]} ${addressArray[1]} ${addressArray[2]}`,
                    BillingCity: addressArray[3],
                    BillingState: addressArray[4],
                    BillingPostalCode: addressArray[5],
                    BillingCountry: 'United Kingdom', 
                    BillingLatitude: this.latitude,
                    BillingLongitude: this.longitude
                };
                // updateObject.fields = {
                //     Id: {value: this.recordId},
                //     BillingStreet : {value: `${addressArray[0]} ${addressArray[1]} ${addressArray[2]}`},
                //     BillingCity : { value: addressArray[3]},
                //     BillingState : { value: addressArray[4]},
                //     BillingPostalCode : { value: addressArray[5]},
                //     BillingCountry : { value: 'United Kingdom'}
                // };
            }

            updateRecord(updateObject)
                .then( result => {

                    this.error = undefined; 

                    window.console.log(`result with result.fields.BillingCity: ${result.fields.BillingCity}`);
                    window.console.log(`result with result.BillingCity: ${result.BillingCity}`);

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Record Updated',
                            message: 'The record has been updated with a new address',
                            variant: 'success'
                        })
                    );

                })
                .catch( error => {
                    this.error = error; 
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Update Failed',
                            message: error.message,
                            variant: 'error'
                        })
                    );

                });
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

    getUpdateObject(){
        return {
            apiName: '',
            fields: {}
        }
    }

    errorCallback(error, stack){
        this.error = error; 
        this.stack = stack; 
    }

}