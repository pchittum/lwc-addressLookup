import { LightningElement, api, track } from 'lwc';

/*
create a playground to share with Diego and Carridy

parent component passing uninitialized array result to child that 
then tries to use the array (like where I was using array.map())
*/

export default class AddressLookupList extends LightningElement {

    @track value; 
    @track formattedOptions = [];

    @api
    get addresses(){
        return this.formattedOptions;
    }

    set addresses(value){
        this.formattedOptions = value.map((item)=>{
            return this.formatOption(item);
        });
    }

    handleRadioChange(event){
        event.preventDefault();

        const changeEvent = new CustomEvent('change', {
            detail : event.detail.value
        });

        this.dispatchEvent(changeEvent);
    }

    formatOption(address) { 

        const label = `${address.line1} ${address.line2} ${address.line3}, ${address.city}, ${address.county}`;
        const value = `${address.line1},${address.line2},${address.line3},${address.city},${address.county},${address.postcode}`;

        return {label, value};
    }

}