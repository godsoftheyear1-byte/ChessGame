#!/bin/bash

echo "🎮 Chess Game - Multiplayer Setup"
echo "=================================="
echo ""
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the server in one terminal:"
echo "   cd server && npm start"
echo ""
echo "2. Start the frontend in another terminal:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🎯 To play: Create a game, share the URL, and enjoy!"
