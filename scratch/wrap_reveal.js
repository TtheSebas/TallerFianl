const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../client/app/catalogo/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Add the import at the top
if (!content.includes('import EditorialReveal')) {
  content = content.replace(
    /import Link from 'next\/link';/,
    `import Link from 'next/link';\nimport EditorialReveal from '@/components/EditorialReveal';`
  );
}

// We want to replace <div className="page-inner ..."> with <EditorialReveal className="page-inner ...">
// Since closing </div> is hard to find, we can instead wrap the <section className="editorial-page ..."> content
// Wait, an easier way is to just use a regular expression to match the opening tag of page-inner
// <div className="page-inner ...">
// Since each page-inner corresponds to a page, and pages are explicitly defined:
// <section className="editorial-page page-1 ..."> ... </section>

// Let's use a function to find and replace
function replacePageInner(str) {
  let inPageInner = false;
  let depth = 0;
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    // Look for <div className="page-inner
    if (!inPageInner && str.slice(i, i + 24) === '<div className="page-inn') {
      let endOfDiv = str.indexOf('>', i);
      let openingTag = str.slice(i, endOfDiv + 1);
      
      // Replace <div with <EditorialReveal
      openingTag = openingTag.replace('<div', '<EditorialReveal delay={150}');
      
      result += openingTag;
      inPageInner = true;
      depth = 1;
      i = endOfDiv;
      continue;
    }
    
    if (inPageInner) {
      if (str.slice(i, i + 4) === '<div') {
        depth++;
      } else if (str.slice(i, i + 5) === '</div') {
        depth--;
        if (depth === 0) {
          result += '</EditorialReveal>';
          inPageInner = false;
          i += 5; // skip </div>
          continue;
        }
      }
    }
    
    result += str[i];
  }
  return result;
}

const newContent = replacePageInner(content);
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log('Replaced successfully');
