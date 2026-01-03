import { useEffect } from 'react';

export function FontLoader() {
  useEffect(() => {
    // Load Google Fonts dynamically
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

    return () => {
      // Cleanup
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  return null;
}
