import axiosConfig from "@/app/axiosConfig";

export const fetchWaterReports = async (month, year, startDate, endDate, search) => {
  try {
    let params = { search };

    if (startDate && endDate) {
      // If date range is provided, use it
      params.startDate = startDate;
      params.endDate = endDate;
    } else if (month && year) {
      // Otherwise, use month/year
      params.month = month;
      params.year = year;
    }

    const response = await axiosConfig.get("waterReport/getReports", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching water reports:", error);
    throw error;
  }
};

export const generateReports = async (customerId, logIds, docUrl) => {
    try {
        const response = await axiosConfig.post(`waterReport/genrateReports`, {
            customerId,
            logIds,
            docUrl
        });
        return response.data;
    } catch (error) {
        console.error('Error While Generating Water Reports:', error);
        throw error;
    }
};


export const createReports = async (payload) => {
  try {
    const response = await axiosConfig.post(`waterReport/admin-add-or-update`, payload);
    return response.data;
  } catch (error) {
    console.error('Error While Creating Water Reports:', error);
    throw error;
  }
};

export const deleteWaterReports = async (logId) => {
  try {
    //   console.log("payload", payload);
    console.log("logId",logId)
      const response = await axiosConfig.delete(`waterReport/deleteWaterReports/${logId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching delete WaterReport :", error);
      throw error;
    }
  };

export const uploadWaterReportPdf = async (pdfBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', pdfBlob, `${Date.now()}-report.pdf`);

    const response = await axiosConfig.post(`waterReport/uploadWaterReportPdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading water report PDF:', error);
    throw error;
  }
};
  




