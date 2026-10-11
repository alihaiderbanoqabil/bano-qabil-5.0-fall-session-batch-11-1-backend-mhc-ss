// const fs = require('fs');

// Read file asynchronously with callback
// fs.readFile('myfile.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         return;
//     }
//     console.log('File content:', data);
// });

// // Using fs.promises (Node.js 10.0.0+)
// const fs = require('fs').promises;

// async function readFileExample() {
//     try {
//         const data = await fs.readFile('myfile.txt', 'utf8');
//         console.log('File content:', data);
//     } catch (err) {
//         console.error('Error reading file:', err);
//     }
// }

// readFileExample();
// console.log('Starting file read operation...');

// // Or with util.promisify (Node.js 8.0.0+)
// const { promisify } = require('util');
// const readFileAsync = promisify(require('fs').readFile);

// async function readWithPromisify() {
//     try {
//         const data = await readFileAsync('myfile.txt', 'utf8');
//         console.log(data);
//     } catch (err) {
//         console.error(err);
//     }
// }

// readWithPromisify();
// console.log('File read operation completed.');

// const fs = require('fs');

// try {
//     // Read file synchronously
//     const data = fs.readFileSync('myfile.txt', 'utf8');
//     console.log('File content:', data);
// } catch (err) {
//     console.error('Error reading file:', err);
// }


// const { writeFile } = require('fs').promises;

// async function writeFileExample() {
//     try {
//         // Write text to a file
//         await writeFile('myfile.txt', 'Hello, World!', 'utf8');

//         // Write JSON data
//         const data = { name: 'John', age: 30, city: 'New York' };
//         await writeFile('data.json', JSON.stringify(data, null, 4), 'utf8');

//         console.log('Files created successfully');
//     } catch (err) {
//         console.error('Error writing files:', err);
//     }
// }

// // writeFileExample();


// const fs = require('fs').promises;

// async function appendToFile() {
//   try {
//     // Append a timestamped log entry
//     const logEntry = `${new Date().toISOString()}: Application started\n`;
//     await fs.appendFile('app.log', logEntry, 'utf8');

//     console.log('Log entry added');
//   } catch (err) {
//     console.error('Error appending to file:', err);
//   }
// }

// appendToFile()

// const fs = require('fs').promises;

// async function deleteFile() {
//   const filePath = 'files/index.html';

//   try {
//     // Check if file exists before deleting
//     await fs.access(filePath);

//     // Delete the file
//     await fs.unlink(filePath);
//     console.log('File deleted successfully');
//   } catch (err) {
//     console.error('Error deleting file:', err);
//     if (err.code === 'ENOENT') {
//       console.log('File does not exist');
//     } else {
//       console.error('Error deleting file:', err);
//     }
//   }
// }

// deleteFile();


// const fs = require('fs').promises;
// const path = require('path');

// async function deleteFiles() {
//   const filesToDelete = [
//     'temp1.txt',
//     'temp2.txt',
//     'temp3.txt'
//   ];

//   try {
//     // Delete all files in parallel
//     await Promise.all(
//       filesToDelete.map(file =>
//         fs.unlink(file).catch(err => {
//           if (err.code !== 'ENOENT') {
//             console.error(`Error deleting ${file}:`, err);
//           }
//         })
//       )
//     );

//     console.log('Files deleted successfully');
//   } catch (err) {
//     console.error('Error during file deletion:', err);
//   }
// }

// async function deleteFiles(filesToDelete) {

//   try {
//     // Delete all files in parallel
//     await Promise.all(
//       filesToDelete.map(file =>
//         fs.unlink(file).catch(err => {
//           if (err.code !== 'ENOENT') {
//             console.error(`Error deleting ${file}:`, err);
//           }
//         })
//       )
//     );

//     console.log('Files deleted successfully');
//   } catch (err) {
//     console.error('Error during file deletion:', err);
//   }
// }

// deleteFiles([
//   'temp/testing/temp1.txt',
//   'temp/testing/temp2.txt',
// ]);

// deleteFiles([
//   'temp/temp1.txt',
//   'temp/temp2.txt',
// ]);

// deleteFiles([
//   'temp/temp3.txt',
//   'temp/temp4.txt',
// ]);


// const fs = require('fs').promises;

// async function deleteDirectory(dirPath) {
//   try {
//     // Check if the directory exists
//     const stats = await fs.stat(dirPath);
//    console.log(stats, 'Directory exists:', stats.isDirectory());
//     if (!stats.isDirectory()) {
//       console.log('Path is not a directory');
//       return;
//     }

//     // For Node.js 14.14.0+ (recommended)
//     await fs.rm(dirPath, { recursive: true, force: true });

//     // For older Node.js versions (deprecated but still works)
//     // await fs.rmdir(dirPath, { recursive: true });

//     console.log('Directory deleted successfully');
//   } catch (err) {
//     if (err.code === 'ENOENT') {
//       console.log('Directory does not exist');
//     } else {
//       console.error('Error deleting directory:', err);
//     }
//   }
// }

// // Usage
// // deleteDirectory('directory-to-delete');
// deleteDirectory('temp/test1');


// const fs = require('fs').promises;
// const path = require('path');

// async function emptyDirectory(dirPath) {
//   try {
//     // Read the directory
//     const files = await fs.readdir(dirPath, { withFileTypes: true });
//     console.log(files, 'files');
//     // Delete all files and directories in parallel
//     await Promise.all(
//       files.map(file => {
//         const fullPath = path.join(dirPath, file.name);
//         return file.isDirectory()
//           ? fs.rm(fullPath, { recursive: true, force: true })
//           : fs.unlink(fullPath);
//       })
//     );

//     console.log('Directory emptied successfully');
//   } catch (err) {
//     console.error('Error emptying directory:', err);
//   }
// }

// // Usage
// emptyDirectory('temp');


const fs = require('fs').promises;

async function renameFile() {
  const oldPath = 'temp/index1.html';
  const newPath = 'temp/index.html';

  try {
    // Check if source file exists
    await fs.access(oldPath);

    // Check if destination file already exists
    try {
      await fs.access(newPath);
      console.log('Destination file already exists');
      return;
    } catch (err) {
      // Destination doesn't exist, safe to proceed
    }

    // Perform the rename
    await fs.rename(oldPath, newPath);
    console.log('File renamed successfully');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Source file does not exist');
    } else {
      console.error('Error renaming file:', err);
    }
  }
}

// Usage
renameFile();