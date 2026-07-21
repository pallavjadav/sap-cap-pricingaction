using { enhancedpricing as db  } from '../db/schema';
using {API_SALESORGANIZATION_SRV as external} from './external/API_SALESORGANIZATION_SRV';
using {API_PRODUCT_SRV as external1} from './external/API_PRODUCT_SRV';

@path: '/enhancedpricing'
service EnhancedPricingService {

    @odata.draft.enabled
    @odata.draft.bypass
    @cds.redirection.target
    @Common: {SideEffects #MySourceProperty: {SourceProperties: [File],TargetEntities: [items], }, }
    entity PricingActionHeader as projection on db.PricingActionHeader actions{
        @Common : { SideEffects #MySourceProperty : {
            TargetEntities : ['items'],
        }
        }
        action GetMaterials();
    };

    entity A_SalesOrganization as projection on external.A_SalesOrganization;
    entity A_Product as projection on external1.A_Product;
    entity Seasons as projection on db.Season;

    annotate PricingActionHeader with @Common : {SideEffects #Percent: {
        SourceProperties: ['items/New_Sch3'],
        TargetProperties: ['items/priceChangePercentage'],
    }, };

    // tree table for products hierarchy
    @Aggregation.RecursiveHierarchy #ProductsHierarchy: {
        NodeProperty            : ID,
        ParentNavigationProperty: Parent
    }
    @Hierarchy.RecursiveHierarchy #ProductsHierarchy  : {
        ExternalKey           : ID,
        LimitedDescendantCount: LimitedDescendantCount,
        DistanceFromRoot      : DistanceFromRoot,
        DrillState            : DrillState,
        Matched               : Matched,
        MatchedDescendantCount: MatchedDescendantCount
    }
    @Capabilities.FilterRestrictions                  : {NonFilterableProperties: [
        LimitedDescendantCount,
        DistanceFromRoot,
        DrillState,
        Matched,
        MatchedDescendantCount
    ]}
    @Capabilities.SortRestrictions                    : {NonSortableProperties: [
        LimitedDescendantCount,
        DistanceFromRoot,
        DrillState,
        Matched,
        MatchedDescendantCount
    ]}
    entity Products as projection on db.Products;

}