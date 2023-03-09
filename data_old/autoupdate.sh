#!/usr/bin/env bash
git pull
if [[ -n $(git status -s) ]]; then
	echo "Changes found. Pushing changes..."
	git add -A && git commit -m "auto update data" && git push
else
	echo "No changes found..."
fi
