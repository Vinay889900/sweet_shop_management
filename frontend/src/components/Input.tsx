import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}
            <input {...props} />
        </div>
    );
};

export default Input;
