#![no_std]
mod test;

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol,
};

// Interface of the Reward Token to perform cross-contract calls
mod token {
    soroban_sdk::contractimport!(
        file = "../target/wasm32v1-none/release/reward_token.wasm"
    );
}

#[contract]
pub struct CourseManager;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    TokenContract,
    Course(u32), // course_id -> reward_amount
    Completion(Address, u32), // (user, course_id) -> bool
}

#[contractimpl]
impl CourseManager {
    pub fn initialize(env: Env, admin: Address, token_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenContract, &token_contract);
    }

    pub fn create_course(env: Env, course_id: u32, reward_amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if env.storage().persistent().has(&DataKey::Course(course_id)) {
            panic!("Course already exists");
        }

        env.storage().persistent().set(&DataKey::Course(course_id), &reward_amount);
        
        env.events().publish(
            (symbol_short!("COURSE"), symbol_short!("CREATED")),
            (course_id, reward_amount),
        );
    }

    pub fn complete_course(env: Env, user: Address, course_id: u32) {
        user.require_auth();

        let reward_amount: i128 = env.storage().persistent().get(&DataKey::Course(course_id)).unwrap_or_else(|| panic!("Course does not exist"));

        let completion_key = DataKey::Completion(user.clone(), course_id);
        if env.storage().persistent().has(&completion_key) {
            panic!("User already completed this course");
        }

        env.storage().persistent().set(&completion_key, &true);

        // Perform cross contract call
        let token_contract: Address = env.storage().instance().get(&DataKey::TokenContract).unwrap();
        let client = token::Client::new(&env, &token_contract);
        
        client.mint(&user, &reward_amount);

        env.events().publish(
            (symbol_short!("COURSE"), symbol_short!("COMPLETED")),
            (user, course_id, reward_amount),
        );
    }

    pub fn upgrade(env: Env, new_wasm_hash: soroban_sdk::BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
