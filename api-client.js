// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// API Client functions
const API = {
    // Create a new application
    async createApplication(applicationData) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating application:', error);
            throw error;
        }
    },

    // Get all applications
    async getApplications() {
        try {
            const response = await fetch(`${API_BASE_URL}/applications`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    },

    // Get single application
    async getApplication(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching application:', error);
            throw error;
        }
    },

    // Approve application
    async approveApplication(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error approving application:', error);
            throw error;
        }
    },

    // Reject application
    async rejectApplication(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/applications/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error rejecting application:', error);
            throw error;
        }
    },

    // Get statistics
    async getStatistics() {
        try {
            const response = await fetch(`${API_BASE_URL}/statistics`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    }
};
