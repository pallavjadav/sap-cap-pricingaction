using EnhancedPricingService as service from '../../srv/service';
annotate service.Products with @(
    UI.SelectionFields #filterBarMacro : [
    ],
    UI.LineItem #tableMacro : [
        {
            $Type: 'UI.DataField',
            Value: Title,
            Criticality: 0,
            CriticalityRepresentation : #OnlyIcon
        },
        {
            $Type: 'UI.DataField',
            Value: ID,
            IconUrl : 'sap-icon://desktop-mobile',
        },
        {
            $Type: 'UI.DataField',
            Value: Description,
        },
    ],
   
);

