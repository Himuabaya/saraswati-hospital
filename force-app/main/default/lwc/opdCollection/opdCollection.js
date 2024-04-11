import { LightningElement, track, api } from 'lwc';
import getOPDData from '@salesforce/apex/OPDController.getOPDData';
import updateAmount from '@salesforce/apex/OPDController.updateAmount';

export default class OPDCollection extends LightningElement {
    @track searchDate;
    @track opdList = [];
    @track totalAmount = 0;

    handleDateChange(event) {
        this.searchDate = event.target.value;
    }

    async handleSearch() {
        try {
            this.opdList = await getOPDData({ searchDate: this.searchDate });
            this.calculateTotalAmount();
        } catch(error) {
            // Handle error
            console.error('Error fetching OPD data:', error);
        }
    }

    async handleUpdateAmount(event) {
        const recordId = event.target.dataset.recordid;
        const amount = event.target.value;

        try {
            await updateAmount({ recordId, amount });
            // Assuming you want to refresh data after update
            await this.handleSearch();
        } catch(error) {
            // Handle error
            console.error('Error updating amount:', error);
        }
    }

    calculateTotalAmount() {
        this.totalAmount = this.opdList.reduce((total, opd) => total + opd.amount, 0);
    }
}
