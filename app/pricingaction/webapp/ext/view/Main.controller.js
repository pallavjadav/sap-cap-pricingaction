sap.ui.define(
    [
        'sap/fe/core/PageController'
    ],
    function(PageController) {
        'use strict';

        return PageController.extend('pricingaction.ext.view.Main', {
            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf pricingaction.ext.view.Main
             */
             onInit: function () {
                 PageController.prototype.onInit.apply(this, arguments); // needs to be called to properly initialize the page controller
                this.getAppComponent().getModel("ui").setProperty("/isEditable", true);
                },
                refresh: function() {
                    console.log("refresh");
                    this.getView().byId("pricingaction::PricingActionHeaderObjectPage--fe::table::items::LineItem::ItemTable").getModel().refresh()
                },
                pressDay2Day: function() {
                    console.log("pressDay2Day");
                    const list = this.getView().getModel().bindList("/PricingActionHeader")
                    this.editFlow.createDocument(list, {
                        creationMode:"NewPage",
                        data:{
                            Pricing_Type: "D"
                        }
                    });
                },
                createMass: function() {
                    console.log("mass");
                    const list = this.getView().getModel().bindList("/PricingActionHeader")
                    this.editFlow.createDocument(list, {
                        creationMode: "NewPage",
                        data: {
                            Pricing_Type: "M"
                        }
                    });
                },

            /**
             * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
             * (NOT before the first rendering! onInit() is used for that one!).
             * @memberOf pricingaction.ext.view.Main
             */
            //  onBeforeRendering: function() {
            //
            //  },

            /**
             * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
             * This hook is the same one that SAPUI5 controls get after being rendered.
             * @memberOf pricingaction.ext.view.Main
             */
            //  onAfterRendering: function() {
            //
            //  },

            /**
             * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
             * @memberOf pricingaction.ext.view.Main
             */
            //  onExit: function() {
            //
            //  }
        });
    }
);
