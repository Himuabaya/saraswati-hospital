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
        public static New_Patient__c getPatientDetails(String patientId) {
            // Implement your logic to fetch patient details based on the patientId
            return [SELECT Id,Name, Patient_Name__c, Sex__c, Email_ID__c,
             Mobile_No__c, Title__c, Age__c, Address__c, Landline_no__c 
             FROM New_Patient__c WHERE Id = :patientId LIMIT 1];
        }
    
        @AuraEnabled(cacheable=true)
        public static Patient_Follow_Up__c getPatientFollowUpDetails(String patientId) {  
            return [
                SELECT Id, Followup_Date__c, Ref_By__c, Name, Blood_Urea__c, Urine_PC__c, 
                X24hr_Urine_Protien_P_C_ratio__c, Consultant__c, Height_cm__c, Sr_Creatine__c, 
                Urine_RBC__c, Serum_Cholesterol__c, Other_1__c, Other_2__c,
                Urine_Protein__c, Urine_PH__c, Serium_Albumin__c
                FROM Patient_Follow_Up__c
                WHERE Patient__c = :patientId 
                ORDER BY CreatedDate DESC LIMIT 1
            ];
        }
    
        @AuraEnabled
        public static String savePatientFollowUp(Map<String, Object> followUpDetails) {
            try {
                // Extract values from followUpDetails
                String patientId = (String)followUpDetails.get('patientId');
                Date followUpDate = (Date)followUpDetails.get('followUpDate');
                String refBy = (String)followUpDetails.get('refBy');
                Decimal weight = (Decimal)followUpDetails.get('weight');
                String bloodUrea = (String)followUpDetails.get('bloodUrea');
                String urinePC = (String)followUpDetails.get('urinePC');
                String urineProteinRatio = (String)followUpDetails.get('urineProteinRatio');
                String consultant = (String)followUpDetails.get('consultant');
                String height = (String)followUpDetails.get('height');
                String srCreatine = (String)followUpDetails.get('srCreatine');
                String urineRBC = (String)followUpDetails.get('urineRBC');
                String serumCholesterol = (String)followUpDetails.get('serumCholesterol');
                String other1 = (String)followUpDetails.get('other1');
                String other2 = (String)followUpDetails.get('other2');
                String urineProtein = (String)followUpDetails.get('urineProtein');
                String urinePH = (String)followUpDetails.get('urinePH');
                String seriumAlbumin = (String)followUpDetails.get('seriumAlbumin');
    
                // Create a new Patient_Follow_Up__c record and set the values
                Patient_Follow_Up__c followUpRecord = new Patient_Follow_Up__c(
                    Patient__c = patientId,
                    Followup_Date__c = followUpDate,
                    Ref_By__c = refBy,
                    Name = String.valueOf(weight),
                    Blood_Urea__c = bloodUrea,
                    Urine_PC__c = urinePC,
                    X24hr_Urine_Protien_P_C_ratio__c = urineProteinRatio,
                    Consultant__c = consultant,
                    Height_cm__c = height,
                    Sr_Creatine__c = srCreatine,
                    Urine_RBC__c = urineRBC,
                    Serum_Cholesterol__c = serumCholesterol,
                    Other_1__c = other1,
                    Other_2__c = other2,
                    Urine_Protein__c = urineProtein,
                    Urine_PH__c = urinePH,
                    Serium_Albumin__c = seriumAlbumin
                );
    
                // Insert the new record
                insert followUpRecord;
    
                return 'Success';
            } catch (Exception e) {
                return 'Error: ' + e.getMessage();
            }
        }
}

