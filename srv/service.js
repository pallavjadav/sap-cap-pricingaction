const cds = require('@sap/cds');
const XLSX = require('xlsx');


const logger = cds.log('EnhancedPricingService')
module.exports = class EnhancedPricingService extends cds.ApplicationService {
  async init() {

    const { PricingActionHeader, PricingStatusChart, PricingActionItems } = cds.entities('EnhancedPricingService')
    const API_SALESORGANIZATION_SRV = await cds.connect.to('API_SALESORGANIZATION_SRV');



    this.before('CREATE', 'PricingActionHeader', async (req) => {
      const db = await cds.connect.to('db');
      const result = await db.run(`SELECT "myseq".NEXTVAL AS NEXT_ID FROM DUMMY`);

      logger.info('Next ID from sequence:', result);

      // 1. Extract the raw numeric value from the result object
      const rawId = result[0].NEXT_ID; // 1

      // 2. Convert to string, pad with 9 zeros, and prepend 'M'
      const formattedId = req.data.Pricing_Type + String(rawId).padStart(9, '0'); // "M000000001"

      // 3. Assign it to your field
      req.data.Pricing_Action_ID = formattedId;
    });

    this.on('GetMaterials', 'PricingActionHeader.drafts', async (req) => {
      // get data from header draft table
      // get material details from S4/Virtual Table  and update the material draft table 
      // console.log('GetMaterials action called', req)

      let filterData = await SELECT.one.from(PricingActionHeader.drafts, (pah) => {
        pah`.*`,
          pah.items((items) => {
            items`.*`
          })


      }).where({ ID: req.params[0].ID })

      if (!filterData.Sales_Org) {
        req.error(400, 'Sales Organization is mandatory', 'Sales_Org')

      }
      if ((!filterData.Season || String(filterData.Season).trim() === '') &&
        (!filterData.items || filterData.items.length === 0)) {
        req.error(400, 'Either Season or at least one Item must be provided', 'Season|items')
      }


      logger.info('Filter Data:', filterData)

      await INSERT.into(PricingActionItems.drafts).entries([
        {
          "ID": "f8d2a101-1b34-4d91-9d4f-000000000045",
          "parent_ID": filterData.ID,
          "Material_Number": "MAT-100201",
          "PPG": "PPG-01",
          "Material_Description": "Eco-Friendly Detergent 1L",
          "Material_Level": "Shelf",
          "Old_Sch1": 12.50,
          "Old_Sch2": 14.00,
          "Old_Sch3": 15.50,
          "Old_Sch4": 18.00,
          "New_Sch1": 13.00,
          "New_Sch2": 14.50,
          "New_Sch3": 16.00,
          "New_Sch4": 19.00,
          "From_Date": "2026-07-01",
          "To_Date": "2026-12-31",
          "Record_Status": "New",
          "Comments": "Price adjustment for Q3 strategy",
          "createdAt": "2026-07-01T10:00:00Z",
          "createdBy": "user.one@company.com",
          "modifiedAt": "2026-07-01T10:00:00Z",
          "modifiedBy": "user.one@company.com",
          "IsActiveEntity": false,
          "DraftAdministrativeData_DraftUUID": filterData.DraftAdministrativeData_DraftUUID
        },
        {
          "ID": "f8d2a101-1b34-4d91-9d4f-000000000046",
          "parent_ID": filterData.ID,
          "Material_Number": "MAT-100202",
          "PPG": "PPG-01",
          "Material_Description": "Eco-Friendly Detergent 2L",
          "Material_Level": "Shipper",
          "Old_Sch1": 22.00,
          "Old_Sch2": 24.50,
          "Old_Sch3": 27.00,
          "Old_Sch4": 30.00,
          "New_Sch1": 24.00,
          "New_Sch2": 26.50,
          "New_Sch3": 29.00,
          "New_Sch4": 32.50,
          "From_Date": "2026-07-01",
          "To_Date": "2026-12-31",
          "Record_Status": "Valid",
          "Comments": "Bulk packaging tier adjustment",
          "createdAt": "2026-07-01T10:15:00Z",
          "createdBy": "user.one@company.com",
          "modifiedAt": "2026-07-01T10:30:00Z",
          "modifiedBy": "admin.user@company.com",
          "IsActiveEntity": false,
          "DraftAdministrativeData_DraftUUID": filterData.DraftAdministrativeData_DraftUUID

        }
      ])
    })

    this.after("UPDATE", "PricingActionHeader.drafts", async (data, req) => {
      // Ensure params are available and the File field was part of the update payload
      if (!req.params || !req.params[0] || !req.data.File) return;

      const draftId = req.params[0].ID;

      // 1. Fetch the File field stream from the HANA draft database
      const row = await SELECT.one
        .from(PricingActionHeader.drafts)
        .columns("File")
        .where({ ID: draftId });

      if (!row || !row.File) {
        return;
      }

      // 2. Helper utility to read the HANA stream into an operations buffer
      const streamToBuffer = (stream) => {
        return new Promise((resolve, reject) => {
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', (err) => reject(err));
        });
      };

      try {
        // 3. Resolve stream contents to memory buffer
        const excelBuffer = await streamToBuffer(row.File);
        console.log(`Excel file resolved completely from DB! Size: ${excelBuffer.length} bytes`);

        // 4. Parse the Excel buffer into JSON rows
        const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);
        console.log('Parsed Rows from Excel:', excelRows);

        if (excelRows.length === 0) return;

        // 5. Fetch administrative info to properly link Draft items
        const headerDraft = await SELECT.one
          .from(PricingActionHeader.drafts)
          .columns("DraftAdministrativeData_DraftUUID")
          .where({ ID: draftId });

        const draftAdminUUID = headerDraft?.DraftAdministrativeData_DraftUUID;

        // 6. Enrich Excel data objects with runtime system properties
        excelRows.forEach(item => {
          item.ID = cds.utils.uuid(); // Generate a fresh GUID for every row item
          item.parent_ID = draftId;
          item.DraftAdministrativeData_DraftUUID = draftAdminUUID;
          item.IsActiveEntity = false; // Important for Draft-to-Draft associations

          // Dynamic date calculations conversion if serial numbers are present in columns
          if (item.From_Date && typeof item.From_Date === 'number') {
            item.From_Date = new Date(Date.UTC(1899, 11, 30) + item.From_Date * 86400000)
              .toISOString()
              .split("T")[0];
          }
          if (item.To_Date && typeof item.To_Date === 'number') {
            item.To_Date = new Date(Date.UTC(1899, 11, 30) + item.To_Date * 86400000)
              .toISOString()
              .split("T")[0];
          }
        });

        // 7. Wipe out prior uploaded items first if user re-uploads file inside same draft session
        await DELETE.from(PricingActionItems.drafts).where({ parent_ID: draftId });

        // 8. Bulk insert parsed Excel rows directly into the items draft table
        await INSERT.into(PricingActionItems.drafts).entries(excelRows);
        console.log(`Successfully imported ${excelRows.length} rows to PricingActionItems.drafts`);

      } catch (streamError) {
        req.error(500, `Failed to parse Excel file from HANA stream: ${streamError.message}`);
        return;
      }
    });


    this.after('READ', 'Products', async (products,req) => {
      if (!Array.isArray(products)) {
        products = [products];
      }

      products.forEach(product => {
        switch (product.Title) {
          case "Desktop":
            product.NodeType = "sap-icon://desktop-mobile";
            break;

          case "Laptop":
            product.NodeType = "sap-icon://laptop";
            break;

          case "CPU":
            product.NodeType = "sap-icon://physical-activity";
            break;

          case "Graphics card":
            product.NodeType = "sap-icon://palette";
            break;

          case "RAM":
            product.NodeType = "sap-icon://database";
            break;

          case "Keyboard":
            product.NodeType = "sap-icon://keyboard-and-mouse";
            break;

          case "Mouse":
            product.NodeType = "sap-icon://cursor-arrow";
            break;

          case "Screen":
          case "Integrated screen":
            product.NodeType = "sap-icon://screen";
            break;

          default:
            product.NodeType = "sap-icon://product";
        }
      });

      console.log("After READ event triggered for Product:", products);
    })
    //traces example for below 
    //  [trace] - elapsed times:

    //  0.00 → 356.44 = 356.44 ms - GET / enhancedpricing / A_SalesOrganization

    //  0.99 → 355.80 = 354.81 ms - EnhancedPricingService - READ EnhancedPricingService.A_SalesOrganization

    //  1.72 → 355.64 = 353.92 ms - API_SALESORGANIZATION_SRV - READ API_SALESORGANIZATION_SRV.A_SalesOrganization

    // -----------------------------MEANING BELOW-----------------------------
    //    0 ms
    // │
    // │ HTTP request received
    // │
    // ├── 0.99 ms
    // │     Your READ handler starts
    // │
    // ├── 1.72 ms
    // │     Remote OData call starts
    // │
    // │
    // │<<<<<<<<<<<< waiting for remote system >>>>>>>>>>>>
    // │
    // │
    // ├──355.64 ms
    // │     Remote OData response received
    // │
    // ├──355.80 ms
    // │     Your handler returns result
    // │
    // └──356.44 ms
    //       HTTP response sent
    this.on('READ', 'A_SalesOrganization', async (req) => {
      const correlationId = cds.context.id
      // correlation_id: b788361d - 931c - 4aec - 42ee - f92581eca289 AND level: DEBUG AND logger: EnhancedPricingService
      logger.info(
        `Starting READ for A_SalesOrganization. correlationId=${correlationId}`
      )
      logger.debug('READ event triggered for A_SalesOrganization:', req.query)
      try {
        const result = await API_SALESORGANIZATION_SRV.send({
          query: req.query,
          headers: {
            APIKey: process.env.APIKey
          }
        })
        logger.info('Result from A_SalesOrganization:', result.length)
        logger.info(
          `Fetched ${result.length} records. correlationId=${correlationId}`
        )
        logger.debug('READ event triggered for A_SalesOrganization:', result)
        return result
      } catch (error) {

        logger.error(
          `Remote service failed. correlationId=${correlationId}`,
          error
        )
        req.error(400, `Remote service failed: use correlation id for debugging this issue : ${correlationId}`, { correlationId })
      }

    })


    this.on('READ', 'A_Product', async (req) => {
      const API_PRODUCT_SRV = await cds.connect.to('API_PRODUCT_SRV');
      return await API_PRODUCT_SRV.send({
        query: req.query,
        headers: {
          APIKey: process.env.APIKey
        }
      })
    })



    return super.init()
  }
}
