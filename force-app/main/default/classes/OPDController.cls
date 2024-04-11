public with sharing class OPDController {
    
    // Method to retrieve OPD data based on the provided date
    @AuraEnabled(cacheable=true)
    public static List<OPDWrapper> getOPDData(Date searchDate) {
        List<OPDWrapper> opdList = new List<OPDWrapper>();
        
        // Query to fetch OPD records based on the search date
        List<New_Patient__c> patients = [SELECT Id, Patient_Name__c, Consultant__r.Name
                                          FROM New_Patient__c
                                          WHERE CreatedDate = :searchDate];
        
        // Transforming fetched records into OPDWrapper objects
        for(New_Patient__c patient : patients) {
            OPDWrapper wrapper = new OPDWrapper();
            wrapper.patientName = patient.Patient_Name__c;
            wrapper.consultantName = patient.Consultant__r.Name;
            // You may need to add more fields if required
            
            opdList.add(wrapper);
        }
        
        return opdList;
    }
    
    // Method to update the amount for a specific record
    @AuraEnabled
    public static void updateAmount(Id recordId, Decimal amount) {
        // Fetch the record to update
        New_Patient__c patientRecord = [SELECT Id, Amount__c FROM New_Patient__c WHERE Id = :recordId];
        
        // Update the amount field
        patientRecord.Amount__c = amount;
        
        // Update the record
        update patientRecord;
    }
    
    // Wrapper class to hold OPD data
    public class OPDWrapper {
        @AuraEnabled
        public String patientName { get; set; }
        
        @AuraEnabled
        public String consultantName { get; set; }
        
        // Add more fields if needed
    }
}
