import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
}) => {
  const styles: React.CSSProperties = {
    backgroundColor: variant === 'primary' ? 'var(--primary-color)' : 'var(--secondary-color)',
    color: '#fff',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <button type={type} onClick={onClick} style={styles} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
