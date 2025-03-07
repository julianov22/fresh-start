import React from 'react';
import * as LucideIcons from 'lucide-react';

// Default styling for icons
const defaultIconProps = {
  size: 20,
  strokeWidth: 2
};

/**
 * Icon component that wraps Lucide icons with consistent styling
 * @param {string} name - Name of the Lucide icon
 * @param {object} props - Additional props to pass to the icon
 */
export const Icon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }
  
  return <LucideIcon {...defaultIconProps} {...props} />;
};

/**
 * Export all Lucide icons directly
 * This allows importing specific icons when needed
 */
export const Icons = LucideIcons; 