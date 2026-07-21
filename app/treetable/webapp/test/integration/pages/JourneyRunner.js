sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"treetable/test/integration/pages/ProductsMain.gen"
], function (JourneyRunner, ProductsMainGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('treetable') + '/test/flpSandbox.html#treetable-tile',
        pages: {
			onTheProductsMainGenerated: ProductsMainGenerated
        },
        async: true
    });

    return runner;
});

