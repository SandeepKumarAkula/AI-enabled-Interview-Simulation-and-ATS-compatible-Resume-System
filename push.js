const { execSync } = require('child_process');
const path = require('path');

// Get the workspace path
const workspacePath = path.resolve(__dirname);

// Change to workspace directory
process.chdir(workspacePath);

try {
  console.log('Current directory:', process.cwd());
  console.log('');

  // Configure git
  console.log('Configuring git...');
  execSync('git config user.name "AI2SARS Bot"', { stdio: 'inherit' });
  execSync('git config user.email "bot@ai2sars.com"', { stdio: 'inherit' });

  // Check status
  console.log('\nChecking git status...');
  execSync('git status', { stdio: 'inherit' });

  // Add files
  console.log('\nAdding files...');
  execSync('git add README.md', { stdio: 'inherit' });
  execSync('git add app/help/page.tsx', { stdio: 'inherit' });

  // Commit
  console.log('\nCommitting changes...');
  execSync('git commit -m "docs: add comprehensive README and fix help page syntax"', { stdio: 'inherit' });

  // Push
  console.log('\nPushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('\n✅ Successfully pushed to GitHub!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
