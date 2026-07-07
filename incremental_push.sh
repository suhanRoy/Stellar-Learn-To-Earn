#!/bin/bash
commits=($(git rev-list --reverse HEAD~53..HEAD))
for commit in "${commits[@]}"; do
  echo "Pushing $commit"
  GIT_TERMINAL_PROMPT=0 git push origin $commit:refs/heads/main
done
