#!/usr/bin/env bash
set -e

echo "🚀 [SupportFlow] Fully setting up Antigravity and Codespaces Environment..."

# 1. Disable pager so links and output are always printed in full
export PAGER=cat
if ! grep -q 'export PAGER=cat' "$HOME/.bashrc" 2>/dev/null; then
    echo 'export PAGER=cat' >> "$HOME/.bashrc"
fi

# 2. Install Antigravity CLI (agy)
echo "📦 Installing Google Antigravity CLI..."
if ! command -v agy &> /dev/null; then
    curl -fsSL https://antigravity.google/cli/install.sh | bash || true
fi

# Ensure agy is in global PATH
mkdir -p "$HOME/.local/bin"
if [ -f "$HOME/.local/bin/agy" ]; then
    sudo ln -sf "$HOME/.local/bin/agy" /usr/local/bin/agy 2>/dev/null || true
elif [ -f "$HOME/.gemini/bin/agy" ]; then
    sudo ln -sf "$HOME/.gemini/bin/agy" /usr/local/bin/agy 2>/dev/null || true
fi

# Append to bashrc and zshrc so it persists across every shell session
if ! grep -q 'export PATH="$HOME/.local/bin:$HOME/.gemini/bin:$PATH"' "$HOME/.bashrc" 2>/dev/null; then
    echo 'export PATH="$HOME/.local/bin:$HOME/.gemini/bin:$PATH"' >> "$HOME/.bashrc"
fi
if [ -f "$HOME/.zshrc" ] && ! grep -q 'export PATH="$HOME/.local/bin:$HOME/.gemini/bin:$PATH"' "$HOME/.zshrc"; then
    echo 'export PATH="$HOME/.local/bin:$HOME/.gemini/bin:$PATH"' >> "$HOME/.zshrc"
fi

# 3. Install Server Python Dependencies
echo "🐍 Installing Backend Python Dependencies..."
if [ -f "server/requirements.txt" ]; then
    pip install -r server/requirements.txt --quiet
fi

# 4. Install Client Node Dependencies
echo "⚡ Installing Frontend Node Dependencies..."
if [ -f "client/package.json" ]; then
    (cd client && npm install --silent)
fi

echo ""
echo "========================================================="
echo "🎉 Antigravity & SupportFlow are FULLY SETUP and READY!"
echo "👉 Type 'PAGER=cat agy' to launch Antigravity with full links!"
echo "========================================================="
