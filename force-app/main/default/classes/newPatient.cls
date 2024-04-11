public with sharing class newPatient {
    @AuraEnabled
    public static List<New_Patient__c> searchPatientRecord(String toDate) {
        try {
            if (toDate != null) {
                Date dateToSearch = Date.valueOf(toDate);
                // Query only date part of the CreatedDate
                return [SELECT Id, Name, Patient_Name__c, Sex__c, Email_ID__c, Ref_By__r.Name, Consultant__c, Mobile_No__c, CreatedDate FROM New_Patient__c WHERE DAY_ONLY(CreatedDate) = :dateToSearch];
            } else {
                return null;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
