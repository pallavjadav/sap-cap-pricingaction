using EnhancedPricing as service from '../../srv/service';
using from '../../db/schema';

annotate EnhancedPricingService.PricingActionHeader with @(
    UI.SelectionFields #filterBarMacro : [
        Pricing_Action_Name,
        Pricing_Type,
    ],
    UI.LineItem #tableMacro : [
        {
            $Type : 'UI.DataField',
            Value : Pricing_Action_ID,
            Label : 'Pricing_Action_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : Pricing_Action_Name,
        },
        {
            $Type : 'UI.DataField',
            Value : Change_Date,
            Label : 'Change_Date',
        },
        {
            $Type : 'UI.DataField',
            Value : Overall_Status,
            Label : 'Overall_Status',
        },
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Header Data',
            ID : 'HeaderData',
            Target : '@UI.FieldGroup#HeaderData',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'ItemTable',
            ID : 'ItemTable',
            Target : 'items/@UI.LineItem#ItemTable',
        },
    ],
    UI.FieldGroup #HeaderData : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : Sales_Org,
                Label : 'Sales_Org',
            },
            {
                $Type : 'UI.DataField',
                Value : Season,
                Label : 'Season',
            },
            {
                $Type : 'UI.DataField',
                Value : Pricing_Action_Name,
                Label : 'Pricing_Action_Name',
            },
            {
                $Type : 'UI.DataField',
                Value : items.Material_Number,
                Label : 'Material_Number',
            },
            {
                $Type : 'UI.DataField',
                Value : SNOW_Ticket_Number,
                Label : 'SNOW_Ticket_Number',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'EnhancedPricingService.GetMaterials',
                Label : 'GetMaterials',
            },
            {
                $Type : 'UI.DataField',
                Value : File,
                Label : 'Import Pricing',
            },
        ],
    },
    UI.HeaderInfo : {
        TypeName : 'PricingAction',
        TypeNamePlural : 'PricingAction',
        Title : {
            $Type : 'UI.DataField',
            Value : Pricing_Action_Name,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : Pricing_Action_ID,
        },
    },
);




annotate EnhancedPricingService.PricingActionItems with @(
    UI.LineItem #ItemTable : [
        {
            $Type : 'UI.DataField',
            Value : Material_Number,
            Label : 'Material_Number',
           
        },
        {
            $Type : 'UI.DataField',
            Value : Material_Description,
            Label : 'Material_Description',
            
        },
        {
            $Type : 'UI.DataField',
            Value : Old_Sch3,
            Label : 'Old_Sch3',
        },
        {
            $Type : 'UI.DataField',
            Value : New_Sch3,
            Label : 'New_Sch3',
        },
        {
            $Type : 'UI.DataField',
            Value : From_Date,
            Label : 'From_Date',
        },
        {
            $Type : 'UI.DataField',
            Value : To_Date,
            Label : 'To_Date',
        },
        {
            $Type : 'UI.DataField',
            Value : priceChangePercentage,
            Label : 'priceChangePercentage',
        },
    ]
);

annotate EnhancedPricingService.PricingActionHeader with {
    Sales_Org @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'A_SalesOrganization',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Sales_Org,
                    ValueListProperty : 'SalesOrganization',
                },
            ],
            Label : 'Sales Organization',
        },
        Common.ValueListWithFixedValues : true,
        Common.FieldControl : #Mandatory,
)};

annotate EnhancedPricingService.A_SalesOrganization with {
    SalesOrganization @Common.Text : CompanyCode
};

annotate EnhancedPricingService.PricingActionItems with {
    Material_Number @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'A_Product',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Material_Number,
                    ValueListProperty : 'Product',
                },
            ],
            Label : 'Material',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate EnhancedPricingService.PricingActionHeader with {
    Season @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Seasons',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : Season,
                    ValueListProperty : 'Name',
                },
            ],
            Label : 'Season',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate EnhancedPricingService.Seasons with {
    Name @Common.Text : Desc
};

annotate EnhancedPricingService.PricingActionHeader with {
    Pricing_Action_Name @Common.FieldControl : #Mandatory
};

