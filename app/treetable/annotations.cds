using EnhancedPricingService as service from '../../srv/service';
annotate service.Products with @(
    UI.SelectionFields #filterBarMacro : [
    ],
    UI.LineItem #tableMacro : [
        {
            $Type: 'UI.DataField',
            Value: ID,
        },
        {
            $Type: 'UI.DataField',
            Value: Title,
        },
        {
            $Type: 'UI.DataField',
            Value: Description,
        },
    ],
   
);

