const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {

    const {
        SchedulePriceRules,
        SalesOrgSchedules
    } = this.entities;

    this.after("READ", SchedulePriceRules.drafts, async (result, req) => {

        console.log("================================================");
        console.log("AFTER READ - SchedulePriceRules");
        console.log("Event:", req.event);
        console.log("Query:");
        console.dir(req.query, { depth: null });
        console.log("Result:");
        console.dir(result, { depth: null });

        if (!result) {
            console.log("No result returned.");
            return;
        }

        if (!result.salesorg) {
            console.log("salesorg not present in READ result.");
            return;
        }

        console.log(`Looking up SalesOrgSchedules for ${result.salesorg}`);

        const cfg = await SELECT.one
            .from(SalesOrgSchedules)
            .where({
                salesorg: result.salesorg
            });

        console.log("Configuration found:");
        console.dir(cfg, { depth: null });

        if (!cfg) {
            console.log("No configuration found. Setting all field controls to Hidden.");

            result.fieldControl1 = 0;
            result.fieldControl2 = 0;
            result.fieldControl3 = 0;
            result.fieldControl4 = 0;

            return;
        }

        result.fieldControl1 = cfg.schedule1 ? 3 : 0;
        result.fieldControl2 = cfg.schedule2 ? 3 : 0;
        result.fieldControl3 = cfg.schedule3 ? 3 : 0;
        result.fieldControl4 = cfg.schedule4 ? 3 : 0;

        console.log("Calculated Field Controls:");
        console.log({
            fieldControl1: result.fieldControl1,
            fieldControl2: result.fieldControl2,
            fieldControl3: result.fieldControl3,
            fieldControl4: result.fieldControl4
        });

        console.log("Final Result:");
        console.dir(result, { depth: null });
        console.log("================================================");
    });

});