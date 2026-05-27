// @ts-nocheck
import { useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { api } from "../api/client";

const ReportComponent = () => {
    const token = useSelector((state) => state.user.token);

    const generatePDF = async (event) => {
        event.preventDefault();
        if (!token) return;
        const blob = await api.downloadClothReport(token);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cloth-inventory-report.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div>
            <Button variant={'outlined'} onClick={generatePDF}>
                Download Report
            </Button>
        </div>
    );
};

export default ReportComponent;
