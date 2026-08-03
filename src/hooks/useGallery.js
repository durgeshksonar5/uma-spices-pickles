import { useContext } from 'react';
import { GalleryContext } from '../context/GalleryContext';

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

export default useGallery;
