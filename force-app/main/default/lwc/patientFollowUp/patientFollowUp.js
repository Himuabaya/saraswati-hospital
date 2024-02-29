import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getPatientDetails from '@salesforce/apex/PatientController.getPatientDetails';
import getPatientFollowUpDetails from '@salesforce/apex/PatientController.getPatientFollowUpDetails';
import savePatientFollowUp from '@salesforce/apex/PatientController.savePatientFollowUp';

export default class PatientFollowUp extends LightningElement {
    @api recordId;
    patient;
    followUpDate = '';
    refBy = '';
    weight = '';
    bloodUrea = '';
    urinePC = '';
    urineProteinRatio = '';
    consultant = '';
    height = '';
    srCreatine = '';
    urineRBC = '';
    serumCholesterol = '';
    other1 = '';
    other2 = '';
    urineProtein = '';
    urinePH = '';
    seriumAlbumin = '';

    @wire(getRecord, { recordId: '$recordId', fields: [
        'Patient_Follow_Up__c.Patient__c',
        'Patient_Follow_Up__c.Patient__r.Id',
        'Patient_Follow_Up__c.Patient__r.Name',
        'Patient_Follow_Up__c.Patient__r.Sex__c',
        'Patient_Follow_Up__c.Patient__r.Email_ID__c',
        'Patient_Follow_Up__c.Patient__r.Mobile_No__c',
        'Patient_Follow_Up__c.Patient__r.Title__c',
        'Patient_Follow_Up__c.Patient__r.Age_c',
        'Patient_Follow_Up__c.Patient__r.Address__c',
        'Patient_Follow_Up__c.Patient__r.Landline_no__c'
    ] }) wiredRecord({ data, error }) {
        if (data) {
            this.recordId = data.fields.Patient_Follow_Up__c.value;
            getPatientDetails({ patientId: this.recordId })
                .then(result => {
                    this.patient = result;
                })
                .catch(error => {
                    console.error('Error retrieving patient details:', error);
                });
        } else if (error) {
            console.error('Error retrieving patient details:', error);
        }
    }

    @wire(getPatientFollowUpDetails, { patientId: '$recordId' })
    wiredFollowUpDetails({ data, error }) {
        if (data) {
            const followUp = data[0];
            this.patient = followUp.patientId;
            this.followUpDate = followUp.Followup_Date__c;
            this.refBy = followUp.Ref_By__c;
            this.weight = followUp.Name;
            this.bloodUrea = followUp.Blood_Urea__c;
            this.urinePC = followUp.Urine_PC__c;
            this.urineProteinRatio = followUp.X24hr_Urine_Protien_P_C_ratio__c;
            this.consultant = followUp.Consultant__c;
            this.height = followUp.Height_cm__c;
            this.srCreatine = followUp.Sr_Creatine__c;
            this.urineRBC = followUp.Urine_RBC__c;
            this.serumCholesterol = followUp.Serum_Cholesterol__c;
            this.other1 = followUp.Other_1__c;
            this.other2 = followUp.Other_2__c;
            this.urineProtein = followUp.Urine_Protein__c;
            this.urinePH = followUp.Urine_PH__c;
            this.seriumAlbumin = followUp.Serium_Albumin__c;
        } else if (error) {
            console.error('Error retrieving follow-up details:', error);
        }
    }

    handleSuccess(event) {
        // Handle success event after saving record
        // For example:
        const updatedRecordId = event.detail.id;
        console.log('Record saved successfully with Id: ' + updatedRecordId);
    }

    handleSave() {
        const followUpDetails = {
            patientId: this.recordId,
            followUpDate: this.followUpDate,
            refBy: this.refBy,
            weight: this.weight,
            bloodUrea: this.bloodUrea,
            urinePC: this.urinePC,
            urineProteinRatio: this.urineProteinRatio,
            consultant: this.consultant,
            height: this.height,
            srCreatine: this.srCreatine,
            urineRBC: this.urineRBC,
            serumCholesterol: this.serumCholesterol,
            other1: this.other1,
            other2: this.other2,
            urineProtein: this.urineProtein,
            urinePH: this.urinePH,
            seriumAlbumin: this.seriumAlbumin
        };

        savePatientFollowUp({ followUpDetails: followUpDetails })
            .then(result => {
                console.log('Save successful:', result);
            })
            .catch(error => {
                console.error('Error saving follow-up:', error);
            });
    }
}
    