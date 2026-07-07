#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_minting() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RewardToken, ());
    let client = RewardTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&admin, &String::from_str(&env, "Learn"), &String::from_str(&env, "LRN"));
    
    assert_eq!(client.name(), String::from_str(&env, "Learn"));
    assert_eq!(client.symbol(), String::from_str(&env, "LRN"));

    client.set_minter(&minter);

    client.mint(&user, &100);

    assert_eq!(client.balance(&user), 100);
}
