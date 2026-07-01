# Pricing Action  

[![SAP CAP](https://img.shields.io/badge/SAP%20CAP-v9.x-blue.svg)](https://cap.cloud.sap)
[![Node.js](https://img.shields.io/badge/Node.js->=18.x-green.svg)](https://nodejs.org)
[![UI5 Theme](https://img.shields.io/badge/Theme-sap__horizon-orange.svg)](https://ui5.sap.com)

A robust, enterprise-grade **SAP Cloud Application Programming Model (CAP)** application designed for managing, auditing, and executing complex pricing action workflows (such as mass pricing strategies and day-to-day tier adjustments).

---

## 🚀 Key Features

- **Pricing Action Orchestration**: Structured parent-child data models for organizing pricing campaigns ([PricingActionHeader](file:///c:/Users/PallavkumarJadav/Downloads/Data/pricingaction/db/schema.cds#L9)) and target material items ([PricingActionItems](file:///c:/Users/PallavkumarJadav/Downloads/Data/pricingaction/db/schema.cds#L26)).
- **Excel Spreadsheet Import**: Directly upload spreadsheets (`.xlsx`) to populate and update pricing schedules in real time, automatically parsing row data into draft items.
- **Mock Integration (`GetMaterials`)**: Retrieve active material records from simulated S/4HANA systems directly into draft items using custom OData actions.
- **Audit Compliance (Change Tracking)**: Automated out-of-the-box change logs for critical fields using the `@cap-js/change-tracking` plugin.
- **Embedded Analytics**: Quick-glance status visibility with a Fiori-native donut chart showing current statuses across all pricing campaigns.
- **Draft-Enabled User Interface**: Built-in draft support (`@odata.draft.enabled`) to prevent work loss and enable offline editing before activation.

---

## 📂 Project Structure

```
pricingaction/
├── app/                  # UI Frontend Applications
│   └── pricingaction/    # SAP Fiori Elements List Report & Object Page app
├── db/                   # Database Layer
│   ├── data/             # CSV Files for Mock/Seed Data
│   └── schema.cds        # CDS Schema Definitions
├── srv/                  # Business Logic Layer
│   ├── service.cds       # OData Service Definition
│   └── service.js        # Excel Parsing and Custom Action Handlers
├── mta.yaml              # Multi-Target Application Deployment Descriptor
└── package.json          # Package Dependencies and Project Scripts
```

---

## 🛠️ Data Model & Domain Schema

The core domain model is defined under the `enhancedpricing` namespace in [db/schema.cds](file:///c:/Users/PallavkumarJadav/Downloads/Data/pricingaction/db/schema.cds):

### 1. `PricingActionHeader`
Acts as the root container for a pricing campaign.
- **Attributes**: Unique Pricing Action ID, Name, Pricing Type (e.g., *Mass Pricing*, *Day-to-Day*), Sales Org, Season, ServiceNow (SNOW) Ticket reference, and Overall Status.
- **Attachment Integration**: Extends to support an Excel file stream input (`File`) and name tracking (`FileName`).
- **Compositions**: Holds a composition of many `PricingActionItems` (1:N relationship).

### 2. `PricingActionItems`
Contains individual material pricing targets.
- **Attributes**: Material Number, PPG, Description, Material Level (*Shopper*, *Shelf*, *Shipper*), Validation Status, and Comments.
- **Pricing Tier Comparisons**: Tracks both **Old Prices** (Old_Sch1 to Old_Sch4) fetched from S/4HANA and **New Prices** (New_Sch1 to New_Sch4) to be published.

---

## ⚙️ Service Logic & Actions

The service layer is defined in [srv/service.cds](file:///c:/Users/PallavkumarJadav/Downloads/Data/pricingaction/srv/service.cds) and implemented in [srv/service.js](file:///c:/Users/PallavkumarJadav/Downloads/Data/pricingaction/srv/service.js):

1. **`GetMaterials()` Action**
   - Retrieves active materials for the specified campaign.
   - Currently mocks fetching records and writing them directly into the item drafts table.
2. **Excel Import Handler**
   - Intercepts `UPDATE` events on the header's draft file property.
   - Parses the binary buffer into sheet objects using the `xlsx` library and automatically maps sheets to list rows to insert into `PricingActionItems.drafts`.
3. **Change Logs**
   - Any database writes automatically record changes via `@cap-js/change-tracking`.

---

## 💻 Getting Started (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and the CAP tools globally available:
```bash
npm i -g @sap/cds-dk
```

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the database deployer and application service:
   ```bash
   cds watch
   # OR run specific target task:
   npm run watch-pricingaction
   ```
3. Open http://localhost:4004 in your browser.
   - Launch the Fiori App: `/pricingaction/webapp/index.html`
   - Browse OData Metadata: `/enhancedpricing/$metadata`

---

## ☁️ Deployment

The project is structured to deploy to **SAP Business Technology Platform (BTP)** as a Multi-Target Application (MTA).

1. **Build the MTA archive**:
   ```bash
   npm run build
   ```
2. **Deploy to SAP Cloud Foundry**:
   ```bash
   npm run deploy
   ```
   *Note: Ensure you are logged into your Cloud Foundry CLI space (`cf login`) prior to deploying.*

---

## 📑 Core Dependencies

| Package | Purpose | Version |
| :--- | :--- | :--- |
| `@sap/cds` | Core SAP CAP framework | `^9` |
| `@cap-js/change-tracking` | Automatic audit trails and change logs | `^2.0.1` |
| `xlsx` | Parsing Excel attachments during imports | `^0.18.5` |
| `@cap-js/sqlite` | Local development database runtime | `^2.4` |
| `@cap-js/hana` | SAP HANA Cloud Database connector (Production) | `^2` |
