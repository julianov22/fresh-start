import React from 'react';
import { Icon } from './Icons';

/**
 * Button variants with predefined styles
 */
const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  danger: {
    backgroundColor: '#ff4d4d',
    color: 'white',
  },
  secondary: {
    backgroundColor: '#ccc',
    color: '#333',
  }
};

/**
 * Reusable Button component with icon support
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, danger, secondary)
 * @param {string} props.iconName - Name of the Lucide icon to display
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content/label
 * @param {string} props.className - Additional CSS classes
 */
export const Button = ({ 
  variant = 'primary',
  iconName,
  onClick,
  disabled = false,
  children,
  className = '',
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant} ${className}`}
      {...rest}
    >
      {iconName && <Icon name={iconName} size={16} />}
      {children}
    </button>
  );
};

/**
 * Specialized Delete Button component
 */
export const DeleteButton = ({ onClick, disabled, children = 'Delete', className = '', ...rest }) => (
  <Button
    variant="danger"
    iconName="Trash2"
    onClick={onClick}
    disabled={disabled}
    className={`delete-button ${className}`}
    {...rest}
  >
    {children}
  </Button>
); 