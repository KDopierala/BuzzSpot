// context/PopupContext.tsx

"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopupContextType {
  isVisible: boolean;
  popupContent: React.ReactNode | null;
  showPopup: (content: React.ReactNode) => void;
  hidePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(null);

  const showPopup = (content: React.ReactNode) => {
    setPopupContent(content);
    setIsVisible(true);
  };

  const hidePopup = () => {
    console.log("hidePopup called"); 
    setPopupContent(null);
    setIsVisible(false);
  };

  return (
    <PopupContext.Provider value={{ isVisible, popupContent, showPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
