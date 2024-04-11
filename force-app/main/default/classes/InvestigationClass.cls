public with sharing class InvestigationClass {
@AuraEnabled
public static String getPatientDetails(New_Patient__c objPat ){

    try {
        if(objPat !=null){
            insert objPat;
            return 'Record has been Created Successfully..!!';

        }
        else {
            return 'Locha';
        }
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
        
    }

}
}
