import { toast } from 'react-toastify';

export const stripePlanService = {
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
          { field: { Name: "planId" } },
          { field: { Name: "price" } },
          { field: { Name: "currency1" } },
          { field: { Name: "grantRole" } }
        ],
        orderBy: [
          {
            fieldName: "price",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('stripe_plan', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching stripe plans:", error?.response?.data?.message);
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
          { field: { Name: "planId" } },
          { field: { Name: "price" } },
          { field: { Name: "currency1" } },
          { field: { Name: "grantRole" } }
        ]
      };

      const response = await apperClient.getRecordById('stripe_plan', recordId, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching stripe plan with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (planData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: planData.Name,
          planId: planData.planId,
          price: parseInt(planData.price),
          currency1: planData.currency1,
          grantRole: planData.grantRole
        }]
      };

      const response = await apperClient.createRecord('stripe_plan', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create stripe plans ${failedRecords.length} records: ${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating stripe plan records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  update: async (recordId, planData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: recordId,
          Name: planData.Name,
          planId: planData.planId,
          price: parseInt(planData.price),
          currency1: planData.currency1,
          grantRole: planData.grantRole
        }]
      };

      const response = await apperClient.updateRecord('stripe_plan', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update stripe plans ${failedUpdates.length} records: ${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating stripe plan records:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('stripe_plan', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete stripe plans ${failedDeletions.length} records: ${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length === recordIds.length;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting stripe plan records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
    }
  },

  subscribeToPlan: async (planId, userId) => {
    try {
      // This would typically integrate with Stripe API
      // For now, we'll simulate the subscription process
      const plans = await stripePlanService.getAll();
      const selectedPlan = plans.find(p => p.planId === planId);
      
      if (!selectedPlan) {
        throw new Error('선택한 플랜을 찾을 수 없습니다.');
      }

      // Create payment record
      const { paymentService } = await import('./paymentService');
      const paymentData = {
        Name: `${selectedPlan.grantRole} 플랜 결제`,
        user: userId,
        stripePlanId: planId,
        amount: selectedPlan.price,
        currency1: selectedPlan.currency1
      };

      const paymentResult = await paymentService.create(paymentData);

      if (paymentResult && paymentResult.length > 0) {
        // Trigger workflow for role assignment
        const { workflowService } = await import('./workflowService');
        await workflowService.triggerWorkflow('stripe.invoice.paid', {
          plan: selectedPlan,
          user: userId,
          payment: paymentResult[0]
        });

        return { success: true, message: '결제가 완료되었습니다.' };
      } else {
        throw new Error('결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      return { success: false, message: error.message };
    }
  }
};