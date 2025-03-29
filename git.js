#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// run "node git " cli command to make it automate the git actions
const { execSync } = require('child_process');
const path = require('path');

// Array of random commit messages
const commitMessages = [
    "✅ Successful update",
    "✨ Made new changes",
    "🔄 Updated codebase",
    "🐛 Fixed minor issues",
    "♻️ Refactored code",
    "⚡ Improved performance",
    "🚀 Added new features",
    "📦 Updated dependencies",
    "🔧 Bug fixes",
    "🧹 Code cleanup",
    "🦾 TypeScript improvements",
    "🏷️ Enhanced typing",
    "🔀 Resolved conflicts",
    "📝 Documentation updates",
    "🎨 UI/UX enhancements",
    "✅ Successfully implemented new requirements",
    "🔥 Hot fix for critical issue",
    "🎉 Completed new milestone",
    "🧪 Added unit tests",
    "📊 Improved analytics",
    "⚙️ Configuration updates",
    "🔒 Enhanced security measures",
    "📱 Mobile responsiveness improvements",
    "🚧 Work in progress commit",
    "💾 Data structure optimizations",
    "🧩 Added new component",
    "⚠️ Fixed edge case issues",
    "✨ Code quality improvements",
    "🔍 Improved search functionality",
    "🏎️ Performance optimization",
    "🧠 Implemented smarter algorithm",
    "💅 Style adjustments",
    "🔌 API integration updates",
    "🧰 Updated tooling",
    "📈 Improved error handling"
  ];

// Function to execute git commands
function executeGitCommands() {
  try {
    // Get current directory name for logging
    const currentDir = path.basename(process.cwd());
    
    console.log(`\n🚀 Starting git automation for: ${currentDir}\n`);
    
    // Stage all files
    console.log('📁 Staging all files...');
    execSync('git add .', { stdio: 'inherit' });
    
    // Select a random commit message
    const randomIndex = Math.floor(Math.random() * commitMessages.length);
    const commitMessage = commitMessages[randomIndex];
    
    // Commit with the random message
    console.log(`📝 Committing with message: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to remote repository
    console.log('🚀 Pushing to remote repository...');
    execSync('git push', { stdio: 'inherit' });
    
    console.log('\n✅ Git automation completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the function
executeGitCommands();