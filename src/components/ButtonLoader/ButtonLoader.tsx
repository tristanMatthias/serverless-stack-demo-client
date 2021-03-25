import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './ButtonLoader.css';

export interface LoaderButtonProps extends ButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
}

export const LoaderButton: React.FC<LoaderButtonProps> = ({
  isLoading,
  className = '',
  disabled = false,
  ...props
}) =>
  <Button
    disabled={disabled || isLoading}
    className={`LoaderButton ${className}`}
    {...props}
  >
    {isLoading && <BsArrowRepeat className="spinning" />}
    {props.children}
  </Button>;
