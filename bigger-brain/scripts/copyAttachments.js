// scripts/copyAttachments.js
const fs = require('fs-extra');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(process.cwd(), 'content', 'attachments');
const destPath = path.join(process.cwd(), 'public', 'attachments');

async function copyAttachments() {
  try {
    // Ensure the destination directory exists
    await fs.ensureDir(destPath);

    // Copy the directory content
    await fs.copy(sourcePath, destPath, {
      overwrite: true,
      errorOnExist: false,
      filter: (src) => {
        // Optional: Add filters here to exclude certain files
        // Example: exclude .DS_Store files
        return !src.includes('.DS_Store');
      }
    });

    console.log('✅ Attachments copied successfully!');
    
    // List copied files
    const files = await fs.readdir(destPath);
    console.log('\nCopied files:');
    files.forEach(file => console.log(`- ${file}`));

  } catch (err) {
    console.error('❌ Error copying attachments:', err.message);
    process.exit(1);
  }
}

copyAttachments();