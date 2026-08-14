const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'public/img');

function toKebabCase(str) {
  return str
    .replace(/&/g, 'y')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

async function processDirectory() {
  const folders = fs.readdirSync(imgDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of folders) {
    const oldFolderPath = path.join(imgDir, folder);
    const kebabFolder = toKebabCase(folder);
    const newFolderPath = path.join(imgDir, kebabFolder);

    let targetFolderPath = oldFolderPath;
    if (oldFolderPath !== newFolderPath) {
      if (!fs.existsSync(newFolderPath)) {
        fs.renameSync(oldFolderPath, newFolderPath);
        console.log(`Renamed folder: ${folder} -> ${kebabFolder}`);
      }
      targetFolderPath = newFolderPath;
    }

    const files = fs.readdirSync(targetFolderPath);
    for (const file of files) {
      const oldFilePath = path.join(targetFolderPath, file);
      if (fs.statSync(oldFilePath).isDirectory()) continue;
      
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        if (ext === '.webp') {
             const newFile = toKebabCase(path.basename(file, ext)) + '.webp';
             if (file !== newFile) {
                fs.renameSync(oldFilePath, path.join(targetFolderPath, newFile));
                console.log(`Renamed webp: ${file} -> ${newFile}`);
             }
        }
        continue;
      }

      const basename = path.basename(file, path.extname(file));
      const kebabFile = toKebabCase(basename) + '.webp';
      const newFilePath = path.join(targetFolderPath, kebabFile);

      try {
        await sharp(oldFilePath)
          .webp({ quality: 80 })
          .toFile(newFilePath);
        fs.unlinkSync(oldFilePath);
        console.log(`Converted: ${folder}/${file} -> ${kebabFolder}/${kebabFile}`);
      } catch (err) {
        console.error(`Error processing ${oldFilePath}:`, err.message);
      }
    }
  }
}

processDirectory().then(() => console.log('All images processed successfully.'));
