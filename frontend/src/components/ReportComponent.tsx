import { Button } from "@material-tailwind/react";
import html2pdf from "html2pdf.js";
import { CLOTH_REPORT_TEMPLATE } from "../reportTemplates/temp_cloth.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ReportComponent = ({reportData}) => {

    const generatePDF = async (event) => {
        event.preventDefault();
        // Prepare data for rendering
        const templateData = {
            items: reportData,
            currentDate: new Date().toLocaleDateString()
        };

        // Render the rows using a simple template engine
        const renderTemplate = (CLOTH_REPORT_TEMPLATE, data) => {
            return CLOTH_REPORT_TEMPLATE.replace(/{{#each items}}([\s\S]*?){{\/each}}/, (match, content) => {
                return data.items.map(item => {
                    return content
                        .replace(/{{this.clothName}}/g, item.clothName)
                        .replace(/{{this.clothType}}/g, item.clothType)
                        .replace(/{{this.brand}}/g, item.brand);
                }).join('');
            }).replace(/{{currentDate}}/g, data.currentDate);
        };

        // Generate the full HTML by rendering the template with data
        const renderedTemplate = renderTemplate(CLOTH_REPORT_TEMPLATE, templateData);

        // Create a container for the HTML content
        const container = document.createElement('div');
        container.innerHTML = renderedTemplate;
        container.style.width = '210mm'; // A4 width in mm
        container.style.padding = '10mm'; // Padding for better layout
        container.style.boxSizing = 'border-box'; // Include padding in width
        container.style.overflow = 'hidden'; // Prevent overflow issues

        // Add styles to control layout and avoid overflow
        const style = document.createElement('style');
        style.textContent = `
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
            }
            table {
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 10px;
            }
            th, td {
                padding: 8px;
                border: 1px solid #ddd; 
                text-align: left;
                font-size: 10px; /* Smaller font size to fit more content */
            }
            th {
                background-color: #f4f4f4;
            }
            img {
                max-width: 50px; /* Adjust image width to fit A4 */
                height: auto; /* Maintain aspect ratio */
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);

        // Create PDF directly from the container
        const options = {
            margin:       0.5, // Margin in inches
            filename:     'report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().from(container).set(options).save().then(() => {
            // Cleanup after saving PDF
            document.body.removeChild(container);
            document.head.removeChild(style);
        });
    };

    return (
        <div>
            <Button className={"mt-4"} onClick={generatePDF}>
                Download Report
            </Button>
        </div>
    );
};

export default ReportComponent;
