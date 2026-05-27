// @ts-nocheck
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
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
        <div className="">
            <Button className="mt-4" onClick={generatePDF}>
                Download Report
            </Button>
        </div>
    );
};

export default ClothTryoutReport;
