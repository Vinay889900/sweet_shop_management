import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
    const variantClass = variant === 'primary' ? 'btn-primary' : '';
    return (
        <button className={`btn ${variantClass} ${className}`} {...props} />
    );
};

export default Button;
