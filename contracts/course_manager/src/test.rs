#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_course_creation_and_completion() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Deploy and setup Reward Token natively
    let token_contract_id = env.register(reward_token::RewardToken, ());
    let token_client = token::Client::new(&env, &token_contract_id);
    
    let admin = Address::generate(&env);
    token_client.initialize(&admin, &String::from_str(&env, "Learn"), &String::from_str(&env, "LRN"));

    // 2. Deploy Course Manager
    let manager_contract_id = env.register(CourseManager, ());
    let manager_client = CourseManagerClient::new(&env, &manager_contract_id);

    manager_client.initialize(&admin, &token_contract_id);

    // 3. Set Course Manager as minter on the token
    token_client.set_minter(&manager_contract_id);

    // 4. Create a course
    let course_id = 1;
    let reward = 500;
    manager_client.create_course(&course_id, &reward);

    // 5. User completes course
    let user = Address::generate(&env);
    manager_client.complete_course(&user, &course_id);

    // 6. Verify user got the reward
    assert_eq!(token_client.balance(&user), 500);
}
