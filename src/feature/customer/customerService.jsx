import axiosConfig from "@/app/axiosConfig";


export const fetchCustomers = async (page = 1, search = '',isSubscription) => {
    try {
      const queryParams = new URLSearchParams({
        page: page,
        isSubscription: isSubscription,
      });
      if (search) {
        queryParams.append('search', search);
      }
      const response = await axiosConfig.get(`customers?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  };

  export const refrestCustom = async () => {
    try {
      const response = await axiosConfig.post(`customers/zoho-customers`);
      return response.data;
    } catch (error) {
      console.error("Error refresh customer:", error);
      throw error;
    }
  };

  export const fetchCustomersDropdown = async () => {
    try {
      const response = await axiosConfig.get(`customers/customerDropdown`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer dropdown:', error);
      throw error;
    }
  };

  export const fetchCustomersMap = async () => {
    try {
      const response = await axiosConfig.get(`customers/customerLocation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };

  export const fetchCustomersClusterMap = async (customer_code) => {
    console.log("customerCode:", customer_code);
    try {
      const queryParams = new URLSearchParams();
      if(customer_code !== undefined && customer_code !== null) {
        queryParams.append('customer_code', customer_code);
      }                                 
      const response = await axiosConfig.get(`cluster/clusters?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };

  export const refetchCustomersClusterMap = async () => {
    try {
      const response = await axiosConfig.get(`cluster/customerLocationCluster`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };

  export const updateCustomersClusterMap = async (reassignments) => {
    try {
      const response = await axiosConfig.put(`cluster/clusters/reassign-batch`, reassignments);
      return response.data;
    } catch (error) {
      console.error('Error fetching products map:', error);
      throw error;
    }
  };

export const fetchClusterRoutes = async (clusterNo) => {
  console.log("clno:", clusterNo);

  try {
    const queryParams = new URLSearchParams();

    // Fix: Allow 0 as a valid value
    if (clusterNo !== undefined && clusterNo !== null) {
      queryParams.append('clusterNo', clusterNo);
    }

    const response = await axiosConfig.get(`cluster/clusters/optimize-routes?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products map:', error);
    throw error;
  }
};


  export const sendDelivery = async (customerData) => {
    try {
      const response = await axiosConfig.post(`customers/SendMissedCartidgeMsg`, customerData);
      return response.data;
    } catch (error) {
      console.error("Error send delivery:", error);
      throw error;
    }
  };

  export const fetchMissedDeliveryLogs = async ({ startDate, endDate, customerId }) => {
    try {
      const params = {
        startDate,
        endDate,
        ...(customerId && { customerId }),
      };
  
      // console.log("params", params);
  
      const response = await axiosConfig.get('customers/missedCartidgeLog', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching missed delivery logs:', error);
      throw error;
    }
  };

   export const fetchClusterDropdown = async () => {
    try {
      const response = await axiosConfig.get('clusterAssignment/clusters');
      return response.data;
    } catch (error) {
      console.error('Error fetching Technician Dropdown:', error);
      throw error;
    }
  };

 export const createAssignment = async (assignData) => {
  try {
    const response = await axiosConfig.post("clusterAssignment/assign", assignData);
    return response.data;
  } catch (error) {
    console.error("Error creating assignment:", error);
    throw error;
  }
};

 export const fetchClusterAssignment = async () => {
    try {
      const response = await axiosConfig.get('clusterAssignment/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching Technician Dropdown:', error);
      throw error;
    }
  };