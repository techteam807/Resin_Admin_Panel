import axiosConfig from "@/app/axiosConfig";

export const fetchWaterReports = async (month, year) => {
    try {
        console.log("month:",month , '||' ,"year:",year);
        const response = await axiosConfig.get('waterReport/getReports', { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error fetching water reports:', error);
        throw error;
    }
};

export const generateReports = async (customerId, logIds) => {
    try {
        const response = await axiosConfig.post(`waterReport/genrateReports`, {
            customerId,
            logIds
        });
        return response.data;
    } catch (error) {
        console.error('Error While Generating Water Reports:', error);
        throw error;
    }
};
