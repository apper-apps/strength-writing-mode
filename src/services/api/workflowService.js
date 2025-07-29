import { toast } from 'react-toastify';

export const workflowService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "onEvent" } },
          { field: { Name: "actions" } }
        ]
      };

      const response = await apperClient.fetchRecords('workflow', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching workflows:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (recordId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "onEvent" } },
          { field: { Name: "actions" } }
        ]
      };

      const response = await apperClient.getRecordById('workflow', recordId, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching workflow with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (workflowData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: workflowData.Name,
          onEvent: workflowData.onEvent,
          actions: typeof workflowData.actions === 'object' ? JSON.stringify(workflowData.actions) : workflowData.actions
        }]
      };

      const response = await apperClient.createRecord('workflow', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create workflow ${failedRecords.length} records: ${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating workflow records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  update: async (recordId, workflowData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: recordId,
          Name: workflowData.Name,
          onEvent: workflowData.onEvent,
          actions: typeof workflowData.actions === 'object' ? JSON.stringify(workflowData.actions) : workflowData.actions
        }]
      };

      const response = await apperClient.updateRecord('workflow', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update workflow ${failedUpdates.length} records: ${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.map(result => result.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating workflow records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  delete: async (recordIds) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: recordIds
      };

      const response = await apperClient.deleteRecord('workflow', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete workflow ${failedDeletions.length} records: ${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length === recordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting workflow records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  triggerWorkflow: async (eventName, eventData) => {
    try {
      const workflows = await workflowService.getAll();
      const matchingWorkflows = workflows.filter(workflow => workflow.onEvent === eventName);

      for (const workflow of matchingWorkflows) {
        await workflowService.executeWorkflow(workflow, eventData);
      }
    } catch (error) {
      console.error('Error triggering workflow:', error);
    }
  },

  executeWorkflow: async (workflow, eventData) => {
    try {
      const actions = typeof workflow.actions === 'string' ? JSON.parse(workflow.actions) : workflow.actions;
      
      if (Array.isArray(actions)) {
        for (const action of actions) {
          await workflowService.executeAction(action, eventData);
        }
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  },

  executeAction: async (action, eventData) => {
    try {
      if (action.assign_role) {
        // Handle role assignment
        const role = workflowService.interpolateValue(action.assign_role, eventData);
        console.log(`Assigning role: ${role} to user: ${eventData.user}`);
        // In a real implementation, this would update the user's role in the database
        toast.success(`역할이 ${role}로 업데이트되었습니다.`);
      }

      if (action.send_email) {
        // Handle email sending
        const emailTemplate = action.send_email;
        console.log(`Sending email: ${emailTemplate} to user: ${eventData.user}`);
        // In a real implementation, this would send an email
        toast.success('환영 이메일이 발송되었습니다.');
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  },

  interpolateValue: (template, data) => {
    if (typeof template !== 'string') return template;
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.trim().split('.');
      let value = data;
      
      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return match;
      }
      
      return value;
    });
  }
};