import { LightningElement, wire, api} from 'lwc';
import searchPatients from '@salesforce/apex/PatientController.searchPatients';
import getAllPatientsList from '@salesforce/apex/PatientController.getAllPatientsList';
import navigateToFollowUp from  '@salesforce/apex/PatientController.navigateToFollowUp';
import { NavigationMixin } from 'lightning/navigation';

export default class PatientListLWC extends NavigationMixin(LightningElement)  {
    @api recordId;
    searchTerm = '';
   patients = [];
  columns = [
        { label: 'Patient ID', fieldName: 'Name', type: 'text' },
        { label: 'Patient Name', fieldName: 'patientNameUrl', type: 'url', typeAttributes: { label: { fieldName: 'patientName' } }},
        { label: 'Sex', fieldName: 'Sex__c', type: 'text' },
        { label: 'Date', fieldName: 'Date__c', type: 'date' },
        { label: 'Email ID', fieldName: 'Email_ID__c', type: 'email' },
        { label: 'Mobile', fieldName: 'Mobile_No__c', type: 'phone' },
    ];

    @wire(getAllPatientsList)
    wiredAllPatients({ error, data }) {
        if (data) {
            this.patients = this.mapDataForDisplay(data);
        } else if (error) {
            // Handle error
        }
    }

    @wire(searchPatients, { searchTerm: '$searchTerm' })
    wiredSearchPatients({ error, data }) {
        if (data) {
            this.patients = this.mapDataForDisplay(data);
        } else if (error) {
            // Handle error
        }
    }

    mapDataForDisplay(data) {
        return data.map(patient => {
                const formattedDate = new Date(patient.Date__c).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            return {
                Name: patient.Name,
                patientName: patient.Patient_Name__c,
                patientNameUrl: this.getPatientDetailsUrl(patient.Id),
                Sex__c: patient.Sex__c,
                Date__c: formattedDate,
                Email_ID__c: patient.Email_ID__c,
                Mobile_No__c: patient.Mobile_No__c,
                Id: patient.Id
            };
        });
    }

    getPatientDetailsUrl(patientId) {
     return `/lightning/r/New_Patient__c/${patientId}/view`;
    }

    
    navigateToFollowUp(event) {
        const patientId = event.target.dataset.id;
        navigateToFollowUp({ patientId: patientId })
            .then(result => {
                if (result) {
                    this[NavigationMixin.Navigate]({
                        type: 'standard__recordPage',
                        attributes: {
                            recordId: result,
                            objectApiName: 'Patient_Follow_Up__c',
                            actionName: 'view'
                        }
                    });
                } else {
                    // Handle case where no follow-up record is found
                    console.error('No follow-up record found for the patient');
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error navigating to follow-up:', error);
            });
    }


    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;

        // If search term is empty, show the full patient list
        if (!this.searchTerm) {
            this.patients = this.mapDataForDisplay(this.fullPatientList);
        }
    }

    handleSearch(){
        // If the search term is not empty, call the searchPatients wire method
        if (this.searchTerm) {
            searchPatients({ searchTerm: this.searchTerm })
                .then(result => {
                    this.patients = this.mapDataForDisplay(result);
                })
                .catch(error => {
                    // Handle error
                    console.error('Error searching patients:', error);
                });
        } else {
            // If the search term is empty, show all patients
            getAllPatientsList()
                .then(result => {
                    this.patients = this.mapDataForDisplay(result);
                })
                .catch(error => {
                    // Handle error
                    console.error('Error fetching all patients:', error);
                });
        }
    }

}