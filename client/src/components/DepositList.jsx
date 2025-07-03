import { useState, useEffect } from "react";
import { getAllDeposits, deleteDeposit } from "../api/deposits.api";
import DepositForm from './DepositForm';
import Modal from './Modal';
import "./DepositList.css";

export function DepositList() {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newDepositModalOpen, setNewDepositModalOpen] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const handleEditDeposit = (deposit) => {
        setSelectedDeposit(deposit);
        setEditModalOpen(true);
    };

    const handleDeleteDeposit = (deposit) => {
        setSelectedDeposit(deposit);
        setDeleteModalOpen(true);
    };

    const handleEditSubmit = (updatedDeposit) => {
        setDeposits(prevDeposits => 
            prevDeposits.map(deposit => 
                deposit.id === updatedDeposit.id ? updatedDeposit : deposit
            )
        );
        setEditModalOpen(false);
        setSelectedDeposit(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedDeposit) return;
        
        try {
            setDeleteLoading(true);
            await deleteDeposit(selectedDeposit.id);
            setDeposits(prevDeposits => 
                prevDeposits.filter(deposit => deposit.id !== selectedDeposit.id)
            );
            setDeleteModalOpen(false);
            setSelectedDeposit(null);
        } catch (error) {
            console.error('Error deleting deposit:', error);
            setError('Failed to delete deposit');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddDeposit = () => {
        setNewDepositModalOpen(true);
    };

    const handleNewDepositSubmit = (newDeposit) => {
        setDeposits(prevDeposits => [newDeposit, ...prevDeposits]);
        setNewDepositModalOpen(false);
    };

    const closeModals = () => {
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setNewDepositModalOpen(false);
        setSelectedDeposit(null);
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
                    <div className="add-deposit-button-container">
                        <button onClick={handleAddDeposit} className="add-deposit-button">
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add New Deposit
                        </button>
                    </div>
                </div>
            </div>

            {deposits.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💰</div>
                    <h3>No deposits found</h3>
                    <p>Start building your portfolio by creating your first deposit.</p>
                    <button onClick={handleAddDeposit} className="add-deposit-button empty-state-button">
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Your First Deposit
                    </button>
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
                                    <button 
                                        className="card-action-button edit"
                                        onClick={() => handleEditDeposit(deposit)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="card-action-button delete"
                                        onClick={() => handleDeleteDeposit(deposit)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add New Deposit Modal */}
            <Modal
                isOpen={newDepositModalOpen}
                onClose={closeModals}
                title="Add New Deposit"
                size="large"
            >
                <DepositForm
                    mode="create"
                    onSubmit={handleNewDepositSubmit}
                    onCancel={closeModals}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={closeModals}
                title="Edit Deposit"
                size="large"
            >
                {selectedDeposit && (
                    <DepositForm
                        mode="edit"
                        depositId={selectedDeposit.id}
                        onSubmit={handleEditSubmit}
                        onCancel={closeModals}
                    />
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={closeModals}
                title="Delete Deposit"
                size="small"
            >
                {selectedDeposit && (
                    <div className="delete-confirmation">
                        <p className="delete-message">
                            Are you sure you want to delete this deposit?
                        </p>
                        <div className="deposit-summary">
                            <strong>{formatCurrency(selectedDeposit.deposit_amount)}</strong>
                            <br />
                            <span className="text-muted">{selectedDeposit.bank_name}</span>
                            <br />
                            <span className="text-muted">
                                Maturity: {formatDate(selectedDeposit.maturity_date)}
                            </span>
                        </div>
                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>
                        <div className="delete-actions">
                            <button
                                onClick={closeModals}
                                className="btn btn-secondary"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-danger"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Deposit'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
