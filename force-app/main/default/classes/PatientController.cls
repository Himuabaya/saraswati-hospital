public with sharing class PatientController {

    @AuraEnabled(cacheable=true)
    public static List<New_Patient__c> getAllPatientsList() {
        return [
            SELECT Id, Name, Patient_Name__c, Sex__c, Date__c, Email_ID__c, Mobile_No__c
            FROM New_Patient__c
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<New_Patient__c> searchPatients(String searchTerm) {
        // Return all patients when no search term
        if (String.isBlank(searchTerm)) {
            return getAllPatientsList();
        }
        
        searchTerm = '%' + searchTerm + '%';
        
        return [
            SELECT Id, Name, Patient_Name__c, Sex__c, Date__c, Email_ID__c, Mobile_No__c
            FROM New_Patient__c
            WHERE Name LIKE :searchTerm OR Patient_Name__c LIKE :searchTerm 
            ORDER BY Name
            LIMIT 50
        ];
    }

    @AuraEnabled(cacheable=true)
    public static String navigateToFollowUp(String patientId) {
        try {
            Patient_Follow_Up__c followUp = [SELECT Id FROM Patient_Follow_Up__c WHERE Patient__c = :patientId LIMIT 1];
            return followUp != null ? followUp.Id : null;
        } catch (Exception e) {
            // Handle error
            System.debug('Error fetching follow-up Id for navigation: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static New_Patient__c getReadOnlyPatientDetails(String patientId) {
        return [SELECT Id, Name, Sex__c, Email_ID__c, Mobile_No__c, Title__c,Age__c, Address__c, Landline_no__c FROM New_Patient__c WHERE Id = :patientId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static New_Patient__c getPatientData(Id recordId) {
        try {
            return [SELECT Name, Name__c, Sex__c, Email_ID__c, Mobile_No__c, Title__c, Age__c, Address__c, Landline_no__c
                    FROM New_Patient__c
                    WHERE Id = :recordId];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching patient data: ' + e.getMessage());
        }
    }

} 