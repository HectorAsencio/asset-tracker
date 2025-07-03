import { useState, useEffect } from "react";
import { getAllDeposits } from "../api/deposits.api";
import "./DepositList.css";

export function DepositList() {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadDeposits() {
            try {
                setLoading(true);
                const res = await getAllDeposits();
                setDeposits(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to load deposits');
                console.error('Error loading deposits:', err);
            } finally {
                setLoading(false);
            }
        }
        loadDeposits();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateDaysToMaturity = (maturityDate) => {
        const today = new Date();
        const maturity = new Date(maturityDate);
        const diffTime = maturity - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusBadge = (maturityDate) => {
        const daysToMaturity = calculateDaysToMaturity(maturityDate);
        if (daysToMaturity < 0) {
            return { text: 'Matured', className: 'status-matured' };
        } else if (daysToMaturity <= 30) {
            return { text: 'Maturing Soon', className: 'status-maturing-soon' };
        } else {
            return { text: 'Active', className: 'status-active' };
        }
    };

    if (loading) {
        return (
            <div className="DepositList">
                <div className="deposit-list-header">
                    <h1>Deposit Portfolio</h1>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading deposits...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="DepositList">
                <div className="deposit-list-header">
                    <h1>Deposit Portfolio</h1>
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="DepositList">
            <div className="deposit-list-header">
                <h1>Deposit Portfolio</h1>
                <div className="portfolio-summary">
                    <div className="summary-item">
                        <span className="summary-label">Total Deposits</span>
                        <span className="summary-value">{deposits.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Total Value</span>
                        <span className="summary-value">
                            {formatCurrency(deposits.reduce((sum, deposit) => sum + parseFloat(deposit.deposit_amount || 0), 0))}
                        </span>
                    </div>
                </div>
            </div>

            {deposits.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💰</div>
                    <h3>No deposits found</h3>
                    <p>Start building your portfolio by creating your first deposit.</p>
                </div>
            ) : (
                <div className="deposits-grid">
                    {deposits.map((deposit) => {
                        const status = getStatusBadge(deposit.maturity_date);
                        const daysToMaturity = calculateDaysToMaturity(deposit.maturity_date);
                        
                        return (
                            <div key={deposit.id} className="deposit-card">
                                <div className="deposit-card-header">
                                    <div className="deposit-id">#{deposit.id}</div>
                                    <div className={`status-badge ${status.className}`}>
                                        {status.text}
                                    </div>
                                </div>
                                
                                <div className="deposit-card-body">
                                    <div className="deposit-amount">
                                        <span className="amount-label">Deposit Amount</span>
                                        <span className="amount-value">
                                            {formatCurrency(deposit.deposit_amount)}
                                        </span>
                                    </div>
                                    
                                    <div className="deposit-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Maturity Date</span>
                                            <span className="detail-value">
                                                {formatDate(deposit.maturity_date)}
                                            </span>
                                        </div>
                                        
                                        <div className="detail-item">
                                            <span className="detail-label">Days to Maturity</span>
                                            <span className="detail-value">
                                                {daysToMaturity >= 0 ? `${daysToMaturity} days` : 'Matured'}
                                            </span>
                                        </div>
                                        
                                        {deposit.interest_rate && (
                                            <div className="detail-item">
                                                <span className="detail-label">Interest Rate</span>
                                                <span className="detail-value">
                                                    {deposit.interest_rate}%
                                                </span>
                                            </div>
                                        )}
                                        
                                        {deposit.bank_name && (
                                            <div className="detail-item">
                                                <span className="detail-label">Bank</span>
                                                <span className="detail-value">
                                                    {deposit.bank_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="deposit-card-footer">
                                    <button className="card-action-button view-details">
                                        View Details
                                    </button>
                                    <button className="card-action-button edit">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
