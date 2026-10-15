#!/usr/bin/env bash
# ========================================================
# LifeFlow Blood Donation System - GitHub Push Helper
# Target Account: aryansingh98775-prog
# ========================================================

REPO_NAME="blood-donation-system-"
GH_USER="aryansingh98775-prog"
REPO_URL="https://github.com/${GH_USER}/${REPO_NAME}.git"

echo "========================================================"
echo "  🐙 Uploading LifeFlow to GitHub (${GH_USER})"
echo "========================================================"
echo ""
echo "1. Make sure you have created an empty repository named '${REPO_NAME}'"
echo "   at: https://github.com/new"
echo ""

# Ensure git remote is set correctly
git remote remove origin 2>/dev/null
git remote add origin "${REPO_URL}"
git branch -M main

echo "Remote set to: ${REPO_URL}"
echo ""
echo "Choose your push method:"
echo "  1) Push using GitHub Personal Access Token (Recommended)"
echo "  2) Standard Git Push (Uses your Keychain / SSH / Browser auth)"
echo ""
read -p "Select option (1 or 2, default 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Generate a Personal Access Token with 'repo' scope at:"
    echo "https://github.com/settings/tokens/new"
    echo ""
    read -sp "Enter your GitHub Personal Access Token: " token
    echo ""
    if [ -n "$token" ]; then
        echo "Pushing code to GitHub..."
        git push "https://${GH_USER}:${token}@github.com/${GH_USER}/${REPO_NAME}.git" main
        echo ""
        echo "✅ Successfully uploaded to: https://github.com/${GH_USER}/${REPO_NAME}"
    else
        echo "❌ Token cannot be empty. Aborting."
        exit 1
    fi
else
    echo ""
    echo "Pushing code to GitHub..."
    git push -u origin main
    echo ""
    echo "✅ Successfully uploaded to: https://github.com/${GH_USER}/${REPO_NAME}"
fi
