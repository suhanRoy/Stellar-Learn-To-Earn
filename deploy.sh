#!/bin/bash

# Build optimized WASMs
echo "Building optimized WASMs..."
cd contracts
stellar contract build

echo "Deploying Reward Token..."
TOKEN_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/reward_token.wasm \
  --source admin \
  --network testnet)
echo "Reward Token deployed at: $TOKEN_ID"

echo "Deploying Course Manager..."
MANAGER_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/course_manager.wasm \
  --source admin \
  --network testnet)
echo "Course Manager deployed at: $MANAGER_ID"

echo "Initializing Reward Token..."
# RewardToken::initialize(admin, "Learn Token", "LRN")
stellar contract invoke \
  --id $TOKEN_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin admin \
  --name "Learn Token" \
  --symbol "LRN"

echo "Initializing Course Manager..."
# CourseManager::initialize(admin, token_contract_id)
stellar contract invoke \
  --id $MANAGER_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin admin \
  --token_contract $TOKEN_ID

echo "Contracts deployed and initialized successfully!"
echo "TOKEN_ID=$TOKEN_ID"
echo "MANAGER_ID=$MANAGER_ID"

# Update frontend configuration
echo "Updating frontend configuration..."
cat <<EOF > ../frontend/.env.local
NEXT_PUBLIC_COURSE_MANAGER_ID=$MANAGER_ID
NEXT_PUBLIC_REWARD_TOKEN_ID=$TOKEN_ID
EOF

echo "Done!"
