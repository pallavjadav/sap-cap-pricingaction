namespace hersheys.otc.hpr;

using {
    cuid,
    managed
} from '@sap/cds/common'; /*Schedule Pricing Rules table*/

@assert.unique.seqno: [seqno]
entity SchedulePriceRules : cuid, managed {
    seqno                 : String(3) @title : 'Sequence Number';
    salesorg              : String(4) @title : 'Sales Organization';
    division              : String(2) @title : 'Division';

    sched1Price           : Decimal(11, 3) default 0 @title : 'Schedule 1 Price';
    sched2Price           : Decimal(11, 3) default 0 @title : 'Schedule 2 Price';
    sched3Price           : Decimal(11, 3) default 0 @title : 'Schedule 3 Price';
    sched4Price           : Decimal(11, 3) default 0 @title : 'Schedule 4 Price';

    sched1ScaleQty        : Decimal(11, 2) default 0 @title : 'Schedule 1 Scale Quantity';
    sched2ScaleQty        : Decimal(11, 2) default 0 @title : 'Schedule 2 Scale Quantity';
    sched3ScaleQty        : Decimal(11, 2) default 0 @title : 'Schedule 3 Scale Quantity';
    sched4ScaleQty        : Decimal(11, 2) default 0 @title : 'Schedule 4 Scale Quantity';

    schedScaleQtyUom      : String(3) @title : 'Scale Quantity Unit of Measure';

    virtual fieldControl1 : Integer  default 0 @Core.Computed  @odata.Type: 'Edm.Byte';
    virtual fieldControl2 : Integer  default 0 @Core.Computed  @odata.Type: 'Edm.Byte';
    virtual fieldControl3 : Integer  default 0 @Core.Computed  @odata.Type: 'Edm.Byte';
    virtual fieldControl4 : Integer  default 0 @Core.Computed  @odata.Type: 'Edm.Byte';
}

/*Schedule Enablement for sales org table*/
entity SalesOrgSchedules {
    key salesorg  : String(4);

        schedule1 : Boolean default true;
        schedule2 : Boolean default true;
        schedule3 : Boolean default true;
        schedule4 : Boolean default true;
}
