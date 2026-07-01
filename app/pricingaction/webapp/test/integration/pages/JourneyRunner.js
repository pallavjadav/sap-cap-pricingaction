sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"pricingaction/test/integration/pages/PricingActionHeaderMain"
], function (JourneyRunner, PricingActionHeaderMain) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('pricingaction') + '/test/flp.html#app-preview',
        pages: {
			onThePricingActionHeaderMain: PricingActionHeaderMain
        },
        async: true
    });

    return runner;
});

