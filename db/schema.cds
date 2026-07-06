namespace enhancedpricing;

using {
    managed,
    cuid

} from '@sap/cds/common';

// 1. Pricing Action Header Entity
entity PricingActionHeader : cuid, managed {
    Pricing_Action_ID   : String(20)           @Core.Computed;
    Pricing_Action_Name : localized String(50) @changelog; // Must be unique
    Pricing_Type        : String(20)           @changelog; // "Mass Pricing" or "Day-to-Day"
    Description         : String(255)          @changelog;
    Sales_Org           : String(4)            @changelog; // Mandatory single-select
    Season              : String(20)           @changelog; // Optional
    SNOW_Ticket_Number  : String(20)           @changelog; // Optional ServiceNow reference
    Overall_Status      : String(20)           @changelog;
    Change_Date         : Timestamp            @changelog;

    // Composition link to individual material items
    items               : Composition of many PricingActionItems
                              on items.parent = $self;
}

// 2. Pricing Action Items (Records) Entity
entity PricingActionItems : managed, cuid {
    parent               : Association to PricingActionHeader; // Foreign Key
    Material_Number      : String(40)     @changelog;
    PPG                  : String(20)     @changelog;
    Material_Description : String(100)    @changelog;
    Material_Level       : String(20)     @changelog; // Shopper, Shelf, or Shipper

    // Old Prices from S/4HANA (Read-Only)
    Old_Sch1             : Decimal(15, 2);
    Old_Sch2             : Decimal(15, 2);
    Old_Sch3             : Decimal(15, 2);
    Old_Sch4             : Decimal(15, 2); // List Price

    // New Prices Calculated/Entered
    New_Sch1             : Decimal(15, 2) @changelog;
    New_Sch2             : Decimal(15, 2) @changelog;
    New_Sch3             : Decimal(15, 2) @changelog;
    New_Sch4             : Decimal(15, 2) @changelog; // List Price

    From_Date            : Date           @changelog;
    To_Date              : Date           @changelog;

    Record_Status        : String(20)     @changelog; // New, In Validation, Valid, Published, Error, Cancelled, Rejected
    Comments             : LargeString    @changelog; // Captures exception notes, SAP errors, and validations
}

/*
 * Stream Content (as BLOB)
 */
@title         : 'Stream Content'
@Core.MediaType: 'application/octet-stream'
type Stream : LargeBinary;

extend entity PricingActionHeader with {
    @title    : 'Notes File'
    File : Stream       @(
        Core.MediaType                  : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        Core.AcceptableMediaTypes       : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        Core.ContentDisposition.Filename: FileName
    );
    FileName : String;

    @title    : 'Notes File (hidden filename)'
    FileHidden : Stream @(
        Core.MediaType                  : 'text/plain',
        Core.AcceptableMediaTypes       : ['text/plain'],
        Core.ContentDisposition.Filename: HiddenFileName
    );
    @UI.Hidden: true
    HiddenFileName : String;
};


entity Season {
    key Name : String(20);
        Desc : String(100);
}
