import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { uploadWaterReport, generateWaterReports } from "@/feature/waterReports/waterReportsSlice";
import { renderPage } from "./WaterReportsTemplate"; 
import { toast } from "react-toastify";


// helper for forcing repaint between page renders
const waitForPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });

export async function batchSendWaterReports(customers, month, year, dispatch) {
    console.log("c:",customers);
    
  for (const customer of customers) {
    const pdf = new jsPDF("p", "mm", "a4");
    const totalPages = 7;
    const userName = customer.user.display_name;
    const safeName = userName.replace(/\s+/g, "_");
    const customerId = customer.user._id;

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = String(date.getFullYear()).slice(2);
      return `${d}/${m}/${y}`;
    };

    const waterQualityData = Object.values(customer.scores)
      .flat()
      .filter((item) => !item.status)
      .map((item) => ({
        date: formatDate(item.createdAt),
        hardness: Number(item.score),
        id: item.id,
      }))
      .slice(0, 4);

    const logIds = waterQualityData.map((entry) => entry.id);

    for (let p = 1; p <= totalPages; p++) {
      const container = document.createElement("div");
      container.id = "pdf-page";
      container.style.width = "794px"; // a4 in px
      container.style.height = "1123px";
      container.style.position = "absolute";
      container.style.left = "-9999px"; // offscreen
      document.body.appendChild(container);

      const page = renderPage(p, {
        userName,
        waterQualityData,
      });

      const root = await import("react-dom/client");
      const reactRoot = root.createRoot(container);
      reactRoot.render(page);

      await waitForPaint();
      await new Promise((res) => setTimeout(res, 600));

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      if (p > 1) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);

 try {
  reactRoot.unmount();
} catch (e) {
  console.warn("Unmount failed", e);
}
try {
  document.body.removeChild(container);
} catch (e) {
  console.warn("DOM remove failed", e);
}

    }

    try {
  const blob = pdf.output("blob");
  const uploadResult = await dispatch(uploadWaterReport(blob)).unwrap();
  const docUrl = uploadResult.data.uploadedUrl;
  await dispatch(generateWaterReports({ customerId, logIds, docUrl })).unwrap(); // ensure this is unwrapped too
} catch (err) {
  console.error("PDF upload/generate failed for", userName, err);
  toast.error(`Failed for ${userName}: ${err.message}`);
}

  }
}
