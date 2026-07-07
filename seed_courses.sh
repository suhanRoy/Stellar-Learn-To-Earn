#!/bin/bash
# Seed the CourseManager contract with the 3 mock courses
# using the stellar CLI identity "admin"

MANAGER_ID=$(grep NEXT_PUBLIC_COURSE_MANAGER_ID frontend/.env.local | cut -d '=' -f2)

echo "Seeding courses into CourseManager ($MANAGER_ID)..."

# Course 1: reward_amount = 50
stellar contract invoke --id $MANAGER_ID --source admin --network testnet -- create_course --course_id 1 --reward_amount 50
echo "Course 1 seeded."

# Course 2: reward_amount = 100
stellar contract invoke --id $MANAGER_ID --source admin --network testnet -- create_course --course_id 2 --reward_amount 100
echo "Course 2 seeded."

# Course 3: reward_amount = 200
stellar contract invoke --id $MANAGER_ID --source admin --network testnet -- create_course --course_id 3 --reward_amount 200
echo "Course 3 seeded."

echo "All courses seeded!"
