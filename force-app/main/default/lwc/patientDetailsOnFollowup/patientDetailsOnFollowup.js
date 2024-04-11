// patientFollowUpFields.js
import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import styles from './patientDetailsOnFollowup.css';

const FIELDS = [
    'Patient_follow_Up__c.Patient__r.Name',
    'Patient_follow_Up__c.Patient__c',
    'Patient_follow_Up__c.Patient__r.Title__c',
    'Patient_follow_Up__c.Patient__r.Name__c',
    'Patient_follow_Up__c.Patient__r.Sex__c',
    'Patient_follow_Up__c.Patient__r.Email_ID__c',
    'Patient_follow_Up__c.Patient__r.Mobile_No__c',
    'Patient_follow_Up__c.Patient__r.Age__c',
    'Patient_follow_Up__c.Patient__r.Address__c',
    'Patient_follow_Up__c.Patient__r.Landline_No__c',
];

export default class PatientFollowUpFields extends LightningElement {
    @api recordId;
    patient;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    patientFollowUpRecord({ error, data }) {
        if (data) {
            this.patient = {
                Name: data.fields.Patient__r.value.fields.Name.value,
                Title__c: data.fields.Patient__r.value.fields.Title__c.value,
                Name__c: data.fields.Patient__r.value.fields.Name__c.value,
                Sex__c: data.fields.Patient__r.value.fields.Sex__c.value,
                Email_ID__c: data.fields.Patient__r.value.fields.Email_ID__c.value,
                Mobile_No__c: data.fields.Patient__r.value.fields.Mobile_No__c.value,
                Age__c: data.fields.Patient__r.value.fields.Age__c.value,
                Address__c: data.fields.Patient__r.value.fields.Address__c.value,
                Landline_No__c: data.fields.Patient__r.value.fields.Landline_No__c.value,
            };
        } else if (error) {
            console.error('Error retrieving patient follow-up record', error);
        }
    }
    get containerClass() {
        return styles.container;
    }

    get leftClass() {
        return styles.left;
    }

    get middleClass() {
        return styles.middle;
    }

    get rightClass() {
        return styles.right;
    }

}
