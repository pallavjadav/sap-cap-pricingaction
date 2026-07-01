using { enhancedpricing as db  } from '../db/schema';


@path: '/enhancedpricing'
service EnhancedPricingService {

    @odata.draft.enabled
    @odata.draft.bypass
    @cds.redirection.target
    @Common: {SideEffects #MySourceProperty: {SourceProperties: [File],TargetEntities: [items], }, }
    entity PricingActionHeader as projection on db.PricingActionHeader actions{
        @Common : { SideEffects #MySourceProperty : {
            TargetEntities : ['items'],
        }, }
        action GetMaterials();
    };


entity PricingStatusChart  as
        select from db.PricingActionHeader {
         key   Overall_Status as Status,
         key   cast(
                    count( * ) as Integer
                )              as Count
        }
        group by
            Overall_Status;


annotate PricingStatusChart with @(UI:{
PresentationVariant #StatusPath: {
            Visualizations: ['@UI.Chart#StatusPath'],
           
        },
Chart: {
    Title              : 'Pricing Status',
    ChartType          : #Donut,
    Dimensions         : [Status],
    DimensionAttributes: [{
        Dimension: Status,
        Role     : #Category
    }],
    Measures           : [Count],
    MeasureAttributes  : [{
        Measure: Count,
        Role   : #Axis1
    }]
}});

}