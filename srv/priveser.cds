using {hersheys.otc.hpr as hpr} from '../db/pricesch.cds';

service SchedulePriceRulesService {
    @odata.draft.enabled
    entity SchedulePriceRules as projection on hpr.SchedulePriceRules;

    entity SalesOrgSchedules  as projection on hpr.SalesOrgSchedules;
}


