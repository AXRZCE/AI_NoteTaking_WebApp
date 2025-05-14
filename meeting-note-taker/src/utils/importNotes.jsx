/**
 * Utility functions for importing notes from files
 */

/**
 * Import notes from a text file
 * @param {File} file - The file to import
 * @returns {Promise<string>} - A promise that resolves with the file content
 */
export const importFromText = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      reject(new Error('File must be a text file (.txt)'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        resolve(content);
      } catch (error) {
        reject(new Error(`Failed to read text file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import notes from a Word document
 * @param {File} file - The file to import
 * @returns {Promise<string>} - A promise that resolves with the file content
 */
export const importFromWord = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.docx') && file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      reject(new Error('File must be a Word document (.docx)'));
      return;
    }
    
    // We need to use a library like mammoth.js to extract text from Word documents
    // Since we don't have it installed, we'll provide a message
    reject(new Error('Word document import is not supported in this version. Please convert to text first.'));
  });
};

/**
 * Import notes from a file (auto-detect type)
 * @param {File} file - The file to import
 * @returns {Promise<string>} - A promise that resolves with the file content
 */
export const importFromFile = (file) => {
  if (!file) {
    return Promise.reject(new Error('No file provided'));
  }
  
  if (file.name.endsWith('.txt') || file.type === 'text/plain') {
    return importFromText(file);
  } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return importFromWord(file);
  } else {
    return Promise.reject(new Error('Unsupported file type. Please use .txt or .docx files.'));
  }
};
