import "./DepositFormPage.css";
import DepositForm from '../components/DepositForm';

export function DepositFormPage() {
  const handleSubmit = (data) => {
    console.log('Deposit Created:', data);
    // Add any post-submit actions here (e.g., navigate back, display a message, etc.)
  };

  const handleCancel = () => {
    console.log('Form canceled');
    // Add any cancel actions here (e.g., navigate back)
  };

  return (
    <div className="DepositFormPage">
      <header className="DepositFormPage-header">
        <h1>Deposit Form Page</h1>
        <p>Welcome to the Deposit Form Page! Fill out the form below to add/edit a deposit.</p>
      </header>
      <DepositForm mode="create" onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}

export default DepositFormPage;
