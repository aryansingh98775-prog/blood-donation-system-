#!/usr/bin/env bash
# ========================================================
# LifeFlow Blood Donation System - 1-Click Server Launcher
# ========================================================

echo "🩸 Starting LifeFlow Blood Donation System..."

# Check if Python 3 is available
if command -v python3 &>/dev/null; then
    echo "⚡ Launching Python backend server with SQLite & REST API on port 5000..."
    python3 server.py
elif command -v node &>/dev/null; then
    echo "⚡ Launching Node.js web server on port 3000..."
    node server.js
else
    echo "⚠️ Neither Python 3 nor Node.js was found in PATH."
    echo "You can still open index.html directly in any web browser!"
    open index.html 2>/dev/null || xdg-open index.html 2>/dev/null
fi
