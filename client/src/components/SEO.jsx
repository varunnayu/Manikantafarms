import { useEffect } from 'react';

export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    // Dynamically update the document title
    if (title) {
      document.title = `${title} | Manikanta Nursery & Farm`;
    } else {
      document.title = 'Manikanta Nursery & Farm | Premium Coffee, Arecanut & Exotic Plants';
    }
    
    // Dynamically update the Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Dynamically update the Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags for social sharing preview dynamic links
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) ogTitle.setAttribute('content', `${title} | Manikanta Nursery`);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute('content', description);

  }, [title, description, keywords]);

  return null;
}
