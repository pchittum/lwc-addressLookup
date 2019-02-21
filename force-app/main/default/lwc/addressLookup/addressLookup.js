import { LightningElement, track, wire } from 'lwc';
import getAddressesForPostcode from '@salesforce/apex/UKAddressLookupService.getAddressesForPostcode';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class AddressLookup extends LightningElement {
    @track searchKey = '';
    @track addresses;

    @wire(getAddressesForPostcode, { postcode: '$searchKey' })
    addressResponse({ error, data }) {
        this.error = undefined;
        if (data) {
            if (data.responseCode === 200) {
                this.addresses = data.addresses; 
            } else {
                window.console.log('there is no response');
            }
        } else if (error) {
            this.error = JSON.stringify(error); 
        }
    }

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
}
