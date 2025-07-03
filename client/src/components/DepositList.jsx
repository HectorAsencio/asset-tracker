import { useState, useEffect } from "react";
import { getAllDeposits } from "../api/deposits.api";

export function DepositList() {
    const [deposits, setDeposits] = useState([]);
    useEffect(() => {
        async function loadDeposits() {
            const res = await getAllDeposits();
            setDeposits(res.data);
        }
        loadDeposits();
    }, []);

    return (
        <div className="DepositList">
            <h1>Deposit List</h1>
            <ul>
                {deposits.map((deposit) => (
                    <li key={deposit.id}>
                        {deposit.deposit_amount} - {deposit.maturity_date}
                    </li>
                ))}
            </ul>
        </div>
    );
}