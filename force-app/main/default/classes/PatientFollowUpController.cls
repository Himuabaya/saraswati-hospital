public with sharing class PatientFollowUpController {
        @AuraEnabled(cacheable=true)
        public static void savePatientFollowUp( String weight, String urinePC) {
            // Input validation (optional)
            // You can add additional validation here if needed
        
            // Create a new Patient_Follow_Up__c record
            Patient_Follow_Up__c followUp = new Patient_Follow_Up__c();
            followUp.Name = weight; // Assuming Weight is a text field in your object
            followUp.Urine_PC__c = urinePC;
        
            // Insert the record
            insert followUp;
        }

    }
