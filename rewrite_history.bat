@echo off
git update-ref -d HEAD
git add .
git commit -m "Initial commit"
git push -f origin main
