// components/PopupComponent.tsx
'use client';

import React from 'react';
import { usePopup } from '@/context/popupContext';

const PopupComponent: React.FC = () => {
  const { isVisible, popupContent, hidePopup } = usePopup();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[901]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {popupContent}
        <button
          onClick={hidePopup}
          className="mt-4 mx-auto block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default PopupComponent;
