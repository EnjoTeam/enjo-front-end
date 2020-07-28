export interface Rule {
    error: boolean;
    message: string;
    rules: RuleObject[];
}

export interface RuleObject {
    day_in_week: string;
    deviceID: string;
    end_time: string;
    expectation_status: string;
    hub_id: string;
    isCheck: boolean;
    rule_id: string;
    start_time: string;
    user: string;
    hub_name: string;
}
