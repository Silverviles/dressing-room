// @ts-nocheck
import { useSelector } from "react-redux";
import { Button } from "../common/ui";
import { api } from "../api/client";

const ClothTryoutReport = () => {
    const token = useSelector((state) => state.user.token);

    const generatePDF = async (event) => {
        event.preventDefault();
        if (!token) return;
        const blob = await api.downloadTryoutReport(token);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cloth-tryout-summary-report.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-2 mb-3 flex justify-center">
            <Button className="px-5 py-2" onClick={generatePDF}>
                Download Report
            </Button>
        </div>
    );
};

export default ClothTryoutReport;
