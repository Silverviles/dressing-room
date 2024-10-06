export const CLOTH_REPORT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Item Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            overflow: hidden; /* Prevent overflow */
        }
        th, td {
            padding: 10px; /* Adjusted padding for better fit */
            border: 1px solid #ddd;
            text-align: left;
            font-size: 12px; /* Smaller font size */
        }
        th {
            background-color: #f4f4f4;
            color: #333;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        img {
            max-width: 40px; /* Reduce image size */
            height: auto;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 12px; /* Adjusted footer font size */
        }
    </style>
</head>
<body>
<h1>Item Report</h1>
<div class="report-header">
    <p>Date: {{currentDate}}</p>
</div>
<table>
    <thead>
    <tr>
        <th>Cloth Name</th>
        <th>Cloth Type</th>
        <th>Brand</th>
    </tr>
    </thead>
    <tbody>
    {{#each items}}
    <tr>
        <td>{{this.clothName}}</td>
        <td>{{this.clothType}}</td>
        <td>{{this.brand}}</td>
    </tr>
    {{/each}}
    </tbody>
</table>
<div class="footer">
    <p>Signature: ______________________</p>
</div>
</body>
</html>
`;

export const CLOTH_TRYOUT_REPORT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clothing Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
            background-color: #f9f9f9;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            color: #333;
            margin-bottom: 10px;
        }
        .report-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            overflow: hidden;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
            font-size: 12px;
        }
        th {
            background-color: #f4f4f4;
            color: #333;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        img {
            max-width: 40px;
            height: auto;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 12px;
        }
    </style>
</head>
<body>
<h1>Clothing Report</h1>
<div class="report-header">
    <p>Date: {{currentDate}}</p>
</div>
<table>
    <thead>
    <tr>
        <th>Username</th>
        <th>Cloth Name</th>
        <th>Brand</th>
        <th>Cloth Type</th>
        <th>Number of Tries</th>
        <th>Most Tried</th>
        <th>Feedback</th>
    </tr>
    </thead>
    <tbody>
    {{#each items}}
    <tr>
        <td>{{this.username}}</td>
        <td>{{this.clothName}}</td>
        <td>{{this.brand}}</td>
        <td>{{this.clothType}}</td>
        <td>{{this.numberOfTries}}</td>
        <td>{{this.mostTriedItem}}</td>
        <td>{{this.userFeedback}}</td>
    </tr>
    {{/each}}
    </tbody>
</table>
<div class="footer">
    <p>Signature: ______________________</p>
</div>
</body>
</html>
`;

