using {hersheys.otc.hpr as hpr} from '../db/pricesch.cds';

service SchedulePriceRulesService {
    @odata.draft.enabled
    entity SchedulePriceRules as projection on hpr.SchedulePriceRules;

    entity SalesOrgSchedules  as projection on hpr.SalesOrgSchedules;
}

annotate SchedulePriceRulesService.SchedulePriceRules with @(Common.SideEffects #SalesOrgChanged: {
    SourceProperties: [salesorg],
    TargetProperties: [
        sched1Price,
        sched2Price,
        sched3Price,
        sched4Price
    ],
    EffectTypes     : #FieldControlChange
});
