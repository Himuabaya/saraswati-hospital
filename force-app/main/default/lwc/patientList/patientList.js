import { LightningElement, wire, api} from 'lwc';
import searchPatients from '@salesforce/apex/PatientController.searchPatients';
import getAllPatientsList from '@salesforce/apex/PatientController.getAllPatientsList';
import getFollowUpId from '@salesforce/apex/PatientController.getFollowUpId';

export default class PatientListLWC extends LightningElement {
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
        { label: 'Follow Up', fieldName: 'followUpUrl', type: 'url', typeAttributes: { label: 'Follow Up'} }
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
            return {
                Name: patient.Name,
                patientName: patient.Patient_Name__c,
                patientNameUrl: this.getPatientDetailsUrl(patient.Id),
                Sex__c: patient.Sex__c,
                Date__c: patient.Date__c,
                Email_ID__c: patient.Email_ID__c,
                Mobile_No__c: patient.Mobile_No__c,
                followUpUrl: this.getFollowUpUrl(patient.Id)
            };
        });
    }

    getPatientDetailsUrl(patientId) {
     return `/lightning/r/New_Patient__c/${patientId}/view`;
    }

    getFollowUpUrl(patientId) {
        const followUpId = this.getFollowUpId(patientId);
        return followUpId ? { url: `/lightning/r/Patient_Follow_Up__c/${followUpId}/view`, label: 'Follow Up' } : { url: '#', label: 'Follow Up' };
    }
    
    getFollowUpId(patientId) {
        try {
            const result = getFollowUpId({ patientId });
            return result;
        } catch (error) {
            // Handle error
            console.error('Error fetching follow-up Id:', error);
            return null;
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;

        // If search term is empty, show the full patient list
        if (!this.searchTerm) {
            this.patients = this.mapDataForDisplay(this.fullPatientList);
        }
    }
}

