using SchedulePriceRulesService as service from '../../srv/priveser';

annotate service.SchedulePriceRules with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : seqno,
            },
            {
                $Type : 'UI.DataField',
                Value : salesorg,
            },
            {
                $Type : 'UI.DataField',
                Value : division,
            },
            {
                $Type : 'UI.DataField',
                Value : sched1Price,
            },
            {
                $Type : 'UI.DataField',
                Value : sched2Price,
            },
            {
                $Type : 'UI.DataField',
                Value : sched3Price,
            },
            {
                $Type : 'UI.DataField',
                Value : sched4Price,
            },
            {
                $Type : 'UI.DataField',
                Value : sched1ScaleQty,
            },
            {
                $Type : 'UI.DataField',
                Value : sched2ScaleQty,
            },
            {
                $Type : 'UI.DataField',
                Value : sched3ScaleQty,
            },
            {
                $Type : 'UI.DataField',
                Value : sched4ScaleQty,
            },
            {
                $Type : 'UI.DataField',
                Value : schedScaleQtyUom,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : seqno,
        },
        {
            $Type : 'UI.DataField',
            Value : salesorg,
        },
        {
            $Type : 'UI.DataField',
            Value : division,
        },
        {
            $Type : 'UI.DataField',
            Value : sched1Price,
        },
        {
            $Type : 'UI.DataField',
            Value : sched2Price,
        },
        {
            $Type : 'UI.DataField',
            Value : sched3Price,
        },
        {
            $Type : 'UI.DataField',
            Value : sched4Price,
        },
    ],
);

annotate service.SchedulePriceRules with {

    salesorg
    @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'SalesOrgSchedules',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : salesorg,
                    ValueListProperty : 'salesorg',
                },
            ],
            Label : 'Sales Organization',
        },
        Common.ValueListWithFixedValues : true,
    );

    sched1Price
    @Common.FieldControl: fieldControl1;

    sched2Price
    @Common.FieldControl: fieldControl2;

    sched3Price
    @Common.FieldControl: fieldControl3;

    sched4Price
    @Common.FieldControl: fieldControl4;

    sched1ScaleQty
    @Common.FieldControl: fieldControl1;

    sched2ScaleQty
    @Common.FieldControl: fieldControl2;

    sched3ScaleQty
    @Common.FieldControl: fieldControl3;

    sched4ScaleQty
    @Common.FieldControl: fieldControl4;
};

annotate service.SchedulePriceRules with @(Common.SideEffects #SalesOrgChanged: {
    SourceProperties: [salesorg],
    TargetProperties: [
        'fieldControl1',
        'fieldControl2',
        'fieldControl3',
        'fieldControl4',
        'sched1Price',
        'sched2Price',
        'sched3Price',
        'sched4Price',
        'sched1ScaleQty',
        'sched2ScaleQty',
        'sched3ScaleQty',
        'sched4ScaleQty'
    ]
});

annotate service.SchedulePriceRules with @UI.PresentationVariant: {RequestAtLeast: [
    fieldControl1,
    fieldControl2,
    fieldControl3,
    fieldControl4
]};
