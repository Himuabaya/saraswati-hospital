import { LightningElement } from 'lwc';
import searchPatientRecord from '@salesforce/apex/newPatient.searchPatientRecord';

export default class FollowUpListComnpo extends LightningElement {
    toDate;
    totalCount = 0;
    receivedFollowupList;
    showFollowUpTable = false;
    draftValues = [];
    columns = [
        { label: 'Patient Id', fieldName: 'Name', editable: false },
        { label: 'Patient Name', fieldName: 'Patient_Name__c', editable: false},
        { label: 'Sex', fieldName: 'Sex__c', editable: false},
        { label: 'Email Id', fieldName: 'Email_ID__c', editable: false },
        { label: 'Consultant', fieldName: 'Consultant__r.Name', editable: false },
        { label: 'Ref. By', fieldName: 'Ref_By__r.Name', editable: false },
        { label: 'Mobile No', fieldName: 'Mobile_No__c', editable: false },
        { label: 'Date', fieldName: 'CreatedDateFormatted', editable: false }
    ];

    searchFollowUpHandler() {
        this.toDate = this.template.querySelector('lightning-input[data-formfield="toDate"]').value;
        console.log(JSON.stringify(this.toDate));

        searchPatientRecord({ toDate: this.toDate })
            .then(result => {
                console.log(JSON.stringify(result));
                this.receivedFollowupList = result.map(record => ({
                    ...record,
                    CreatedDateFormatted: new Date(record.CreatedDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }));
                this.totalCount = this.receivedFollowupList.length;
                this.showFollowUpTable = this.totalCount > 0;
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }
}
