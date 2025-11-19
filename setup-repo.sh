#!/bin/bash

# NanoLearn Repository Setup Script
# This script helps you complete the setup of your GitHub repository

echo "🚀 NanoLearn Repository Setup"
echo "================================"
echo ""

# Check if logo.png exists
if [ ! -f "logo.png" ]; then
    echo "📸 Logo not found! Let's create it..."
    echo ""
    echo "Option 1 (Recommended): Open the HTML generator"
    echo "  open generate-logo.html"
    echo ""
    echo "Option 2: Use the SVG directly (GitHub will display it)"
    echo "  cp logo.svg logo.png"
    echo ""
    read -p "Press Enter to open the logo generator, or Ctrl+C to skip... "
    open generate-logo.html
    echo ""
    echo "✅ Once downloaded, move the logo here:"
    echo "   mv ~/Downloads/logo.png ."
    echo ""
else
    echo "✅ Logo found: logo.png"
fi

echo ""
echo "📋 Repository Files Status:"
echo "================================"
ls -lh README.md logo* generate-logo.html LOGO-INSTRUCTIONS.md 2>/dev/null | tail -n +2

echo ""
echo "🎯 Next Steps:"
echo "================================"
echo "1. Generate and place logo.png in the root directory"
echo "2. Review README.md to customize any sections"
echo "3. Add your Gemini API key setup instructions"
echo "4. Push to GitHub:"
echo "   git add README.md logo.png logo-animated.svg"
echo "   git commit -m '📚 Add interactive README and logo'"
echo "   git push origin main"
echo ""
echo "5. View your beautiful README on GitHub! 🎉"
echo ""

# Check if we're in a git repo
if [ -d ".git" ]; then
    echo "📊 Git Status:"
    echo "================================"
    git status --short
else
    echo "⚠️  Not a git repository yet. Initialize with:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit with interactive README'"
fi

echo ""
echo "✨ Setup complete! Happy coding! ✨"
