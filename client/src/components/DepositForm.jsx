import React, { useState, useEffect } from 'react';
import { createDeposit, updateDeposit, getDeposit } from '../api/deposits.api';
import './DepositForm.css';

const DepositForm = ({ depositId = null, onSubmit, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    deposit_amount: '',
    maturity_date: '',
    interest_rate: '',
    bank_name: '',
    account_number: '',
    deposit_type: 'fixed',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const depositTypes = [
    { value: 'fixed', label: 'Fixed Deposit' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'recurring', label: 'Recurring Deposit' },
    { value: 'certificate', label: 'Certificate of Deposit' }
  ];

  // Load deposit data if editing
  useEffect(() => {
    if (mode === 'edit' && depositId) {
      loadDepositData();
    }
  }, [depositId, mode]);

  const loadDepositData = async () => {
    try {
      setInitialLoading(true);
      const response = await getDeposit(depositId);
      const deposit = response.data;
      
      setFormData({
        deposit_amount: deposit.deposit_amount || '',
        maturity_date: deposit.maturity_date || '',
        interest_rate: deposit.interest_rate || '',
        bank_name: deposit.bank_name || '',
        account_number: deposit.account_number || '',
        deposit_type: deposit.deposit_type || 'fixed',
        description: deposit.description || ''
      });
    } catch (error) {
      console.error('Error loading deposit:', error);
      setErrors({ general: 'Failed to load deposit data' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.deposit_amount || parseFloat(formData.deposit_amount) <= 0) {
      newErrors.deposit_amount = 'Please enter a valid deposit amount';
    }

    if (!formData.maturity_date) {
      newErrors.maturity_date = 'Please select a maturity date';
    } else {
      const today = new Date();
      const maturityDate = new Date(formData.maturity_date);
      if (maturityDate <= today) {
        newErrors.maturity_date = 'Maturity date must be in the future';
      }
    }

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'Please enter the bank name';
    }

    // Optional validations
    if (formData.interest_rate && (parseFloat(formData.interest_rate) < 0 || parseFloat(formData.interest_rate) > 100)) {
      newErrors.interest_rate = 'Interest rate must be between 0 and 100';
    }

    if (formData.account_number && formData.account_number.length < 5) {
      newErrors.account_number = 'Account number must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const submitData = {
        ...formData,
        deposit_amount: parseFloat(formData.deposit_amount),
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null
      };

      let response;
      if (mode === 'edit' && depositId) {
        response = await updateDeposit(depositId, submitData);
      } else {
        response = await createDeposit(submitData);
      }

      // Call parent callback
      if (onSubmit) {
        onSubmit(response.data);
      }

      // Reset form if creating new deposit
      if (mode === 'create') {
        setFormData({
          deposit_amount: '',
          maturity_date: '',
          interest_rate: '',
          bank_name: '',
          account_number: '',
          deposit_type: 'fixed',
          description: ''
        });
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.response?.data) {
        // Handle validation errors from backend
        const backendErrors = error.response.data;
        setErrors(backendErrors);
      } else {
        setErrors({ 
          general: mode === 'edit' ? 'Failed to update deposit' : 'Failed to create deposit' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (initialLoading) {
    return (
      <div className="deposit-form-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading deposit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deposit-form-container">
      <div className="deposit-form-header">
        <h2>{mode === 'edit' ? 'Edit Deposit' : 'Add New Deposit'}</h2>
        <p className="form-description">
          {mode === 'edit' 
            ? 'Update the deposit information below'
            : 'Fill in the details to create a new deposit'
          }
        </p>
      </div>

      {errors.general && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="deposit-form">
        <div className="form-grid">
          {/* Deposit Amount */}
          <div className="form-group">
            <label htmlFor="deposit_amount" className="form-label required">
              Deposit Amount
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                id="deposit_amount"
                name="deposit_amount"
                value={formData.deposit_amount}
                onChange={handleInputChange}
                className={`form-input ${errors.deposit_amount ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            {errors.deposit_amount && (
              <span className="error-message">{errors.deposit_amount}</span>
            )}
            {formData.deposit_amount && (
              <span className="input-help">
                {formatCurrency(formData.deposit_amount)}
              </span>
            )}
          </div>

          {/* Maturity Date */}
          <div className="form-group">
            <label htmlFor="maturity_date" className="form-label required">
              Maturity Date
            </label>
            <input
              type="date"
              id="maturity_date"
              name="maturity_date"
              value={formData.maturity_date}
              onChange={handleInputChange}
              className={`form-input ${errors.maturity_date ? 'error' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.maturity_date && (
              <span className="error-message">{errors.maturity_date}</span>
            )}
          </div>

          {/* Interest Rate */}
          <div className="form-group">
            <label htmlFor="interest_rate" className="form-label">
              Interest Rate
            </label>
            <div className="input-wrapper">
              <input
                type="number"
                id="interest_rate"
                name="interest_rate"
                value={formData.interest_rate}
                onChange={handleInputChange}
                className={`form-input ${errors.interest_rate ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
              />
              <span className="input-suffix">%</span>
            </div>
            {errors.interest_rate && (
              <span className="error-message">{errors.interest_rate}</span>
            )}
          </div>

          {/* Deposit Type */}
          <div className="form-group">
            <label htmlFor="deposit_type" className="form-label">
              Deposit Type
            </label>
            <select
              id="deposit_type"
              name="deposit_type"
              value={formData.deposit_type}
              onChange={handleInputChange}
              className="form-input form-select"
            >
              {depositTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Name */}
          <div className="form-group">
            <label htmlFor="bank_name" className="form-label required">
              Bank Name
            </label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
              className={`form-input ${errors.bank_name ? 'error' : ''}`}
              placeholder="Enter bank name"
              required
            />
            {errors.bank_name && (
              <span className="error-message">{errors.bank_name}</span>
            )}
          </div>

          {/* Account Number */}
          <div className="form-group">
            <label htmlFor="account_number" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              value={formData.account_number}
              onChange={handleInputChange}
              className={`form-input ${errors.account_number ? 'error' : ''}`}
              placeholder="Enter account number"
            />
            {errors.account_number && (
              <span className="error-message">{errors.account_number}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input form-textarea"
            placeholder="Add any additional notes about this deposit..."
            rows="3"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                {mode === 'edit' ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              mode === 'edit' ? 'Update Deposit' : 'Create Deposit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;
