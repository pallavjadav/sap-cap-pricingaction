const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {

    const {
        SchedulePriceRules,
        SalesOrgSchedules
    } = this.entities;

    const calculateFieldControls = async (result, req) => {
        if (!result) return;

        const records = Array.isArray(result) ? result : [result];
        if (records.length === 0) return;

        // If salesorg is missing in the result (due to $select projection in draft READ), fetch it from DB using ID
        const missingSalesOrgRecords = records.filter(r => r && r.salesorg === undefined && r.ID);
        if (missingSalesOrgRecords.length > 0) {
            const ids = missingSalesOrgRecords.map(r => r.ID);
            const targetEntity = req.target || SchedulePriceRules;
            const dbRecords = await SELECT.from(targetEntity).columns("ID", "salesorg").where({ ID: { in: ids } });
            const idToSalesOrg = new Map(dbRecords.map(r => [r.ID, r.salesorg]));
            for (const r of missingSalesOrgRecords) {
                if (idToSalesOrg.has(r.ID)) {
                    r.salesorg = idToSalesOrg.get(r.ID);
                }
            }
        }

        const salesorgs = [...new Set(records.map(r => r && r.salesorg).filter(Boolean))];

        let configs = [];
        if (salesorgs.length > 0) {
            configs = await SELECT.from(SalesOrgSchedules).where({ salesorg: { in: salesorgs } });
        }
        const configMap = new Map(configs.map(c => [c.salesorg, c]));

        for (const record of records) {
            if (!record) continue;
            const cfg = record.salesorg ? configMap.get(record.salesorg) : null;
            if (cfg) {
                record.fieldControl1 = cfg.schedule1 ? 3 : 1;
                record.fieldControl2 = cfg.schedule2 ? 3 : 1;
                record.fieldControl3 = cfg.schedule3 ? 3 : 1;
                record.fieldControl4 = cfg.schedule4 ? 3 : 1;
            } else {
                record.fieldControl1 = 1;
                record.fieldControl2 = 1;
                record.fieldControl3 = 1;
                record.fieldControl4 = 1;
            }
        }
    };

    this.after("READ", SchedulePriceRules, calculateFieldControls);
    if (SchedulePriceRules.drafts) {
        this.after("READ", SchedulePriceRules.drafts, calculateFieldControls);
    }

});
