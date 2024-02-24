public with sharing class PatientSearchExtension {
    public String searchKeyword { get; set; }
    public List<New_Patient__c> searchResults { get; set; }
    public Boolean showHeader { get; set; }

    // Add a constructor to initialize the searchResults and showHeader on page load
    public PatientSearchExtension() {
        showHeader = true; // Show header initially on page load
        loadPatients(); // Load patients on page load
    }

    // Method to load patients on page load or when search input is null
    private void loadPatients() {
        // Query all patients with the specified columns
        String query = 'SELECT Id, Name,Patient_Name__c, Name__c, Sex__c, Date__c, Email_ID__c, Mobile_No__c FROM New_Patient__c';
        searchResults = Database.query(query);
    }

    public void searchPatients() {
        // Check if searchKeyword is null or empty
        if (String.isBlank(searchKeyword)) {
            // If searchKeyword is null or empty, load all patients
            loadPatients();
        } else {
            // Check for Auto Number format and perform the search
        if (String.isNotBlank(searchKeyword)) {
            // Check if the entered keyword matches the Auto Number format "P-{0000}"
            if (searchKeyword.startsWith('P-') && searchKeyword.substringAfter('P-').isNumeric() && searchKeyword.length() == 6) {
                // Perform the search based on the entered keyword as Patient ID (Auto Number field "Name")
                String idQuery = 'SELECT Id, Name,Patient_Name__c, Name__c, Sex__c, Date__c, Email_ID__c, Mobile_No__c FROM New_Patient__c WHERE Name = \'' + String.escapeSingleQuotes(searchKeyword) + '\'';
                searchResults = Database.query(idQuery);
            } else {
                // Perform the search based on the entered keyword as Patient Name (Text field "Name__c")
                String nameQuery = 'SELECT Id, Name,Patient_Name__c,Name__c, Sex__c, Date__c, Email_ID__c, Mobile_No__c FROM New_Patient__c WHERE Name__c LIKE \'%' + String.escapeSingleQuotes(searchKeyword) + '%\'';
                searchResults = Database.query(nameQuery);
            }

            // Set showHeader to true after the search
            showHeader = true;
        } else {
            // If searchKeyword is empty, reset searchResults and hide the header
            searchResults = new List<New_Patient__c>();
            showHeader = false;
        }
    }
        }
        
    }