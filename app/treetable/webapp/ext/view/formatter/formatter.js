sap.ui.define([], function () {
    "use strict";

    return {

        getIcon: function (sTitle) {
            switch (sTitle) {
                case "Desktop":
                    return "sap-icon://desktop-mobile";
                case "Laptop":
                    return "sap-icon://laptop";
                case "CPU":
                    return "sap-icon://physical-activity";
                case "Graphics card":
                    return "sap-icon://palette";
                case "RAM":
                    return "sap-icon://memory";
                case "Keyboard":
                    return "sap-icon://keyboard-and-mouse";
                case "Mouse":
                    return "sap-icon://cursor-arrow";
                case "Screen":
                    return "sap-icon://screen";
                default:
                    return "sap-icon://product";
            }
        }

    };
});