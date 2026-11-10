#!/usr/bin/env bash
# Antigravity Mobile Login Helper
# Disables terminal paging so the full Google login link is printed directly on screen

export PAGER=cat
export TERM=xterm-256color

echo "🚀 Starting Antigravity with full link display..."
echo "📋 If you see a login link, copy and open it in your browser:"
echo ""

agy "$@"

