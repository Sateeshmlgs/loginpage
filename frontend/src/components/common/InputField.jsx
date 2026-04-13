import React from 'react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, name, error }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-container">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;
