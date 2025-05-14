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
