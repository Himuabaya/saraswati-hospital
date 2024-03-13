import { LightningElement, api } from 'lwc';

export default class PatientFollowUp extends LightningElement {
  @api recordId;
  handleSave(event) {
    const patientId = this.recordId;
    const weight = this.template.querySelector('[name="Weight__c"]').value;
    const urinePC = this.template.querySelector('[name="Urine_PC__c"]').value;

    PatientFollowUpController.savePatientFollowUp({ patientId, weight, urinePC })
    .then(() => {
      // Handle successful save (e.g., show a success message, clear the form)
    })
    .catch(error => {
      // Handle errors (e.g., display an error message)
      console.error(error);
    });
  }
}

