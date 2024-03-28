import  { useEffect } from 'react';

const PreventContextMenu = () => {
  useEffect(() => {
    const preventContextMenu = (event: any) => {
      event.preventDefault();
    };
    window.addEventListener('contextmenu', preventContextMenu);
    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PreventContextMenu;
