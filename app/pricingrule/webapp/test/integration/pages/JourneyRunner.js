sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"pricingrule/test/integration/pages/SchedulePriceRulesList.gen",
	"pricingrule/test/integration/pages/SchedulePriceRulesObjectPage.gen"
], function (JourneyRunner, SchedulePriceRulesListGenerated, SchedulePriceRulesObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('pricingrule') + '/test/flpSandbox.html#pricingrule-tile',
        pages: {
			onTheSchedulePriceRulesListGenerated: SchedulePriceRulesListGenerated,
			onTheSchedulePriceRulesObjectPageGenerated: SchedulePriceRulesObjectPageGenerated
        },
        async: true
    });

    return runner;
});

