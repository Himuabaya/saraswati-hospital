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
    public static String getFollowUpId(String patientId) {
        List<Patient_Follow_Up__c> followUps = [
            SELECT Id
            FROM Patient_Follow_Up__c 
            WHERE Patient__c = :patientId 
            LIMIT 1
        ];
    
        if (followUps != null && !followUps.isEmpty()) {
            return followUps[0].Id;
        } else {
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getPatientfollowupDetails(Patient_Follow_Up__c objfoll )
    {

    try {
        if(objfoll !=null){
            insert objfoll;
            return 'Record has been Created Successfully..!!';

        }
        else {
            return 'error';
        }
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
        
    }

}

}
