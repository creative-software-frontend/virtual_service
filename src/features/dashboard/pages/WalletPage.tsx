import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "./TopNav";
import { userApi } from "../../../utils/api";

type Transaction = {
    id: number;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
};

export function WalletPage() {
    const [loading, setLoading] = useState(true);

    const [wallet, setWallet] = useState({
        balance: 0,
        earnings: 0,
        role: "",
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [depositAmount, setDepositAmount] = useState("");

    const [withdrawAmount, setWithdrawAmount] = useState("");

    async function loadWallet() {
        setLoading(true);

        const res = await userApi.getWallet();

        if (res.data) {
            setWallet({
                balance: res.data.balance,
                earnings: res.data.earnings,
                role: res.data.role,
            });

            setTransactions(res.data.transactions || []);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadWallet();
    }, []);

    async function handleDeposit() {
        const amount = Number(depositAmount);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        const res = await userApi.deposit(amount);

        if (res.error) {
            alert(res.error);
            return;
        }

        alert("Deposit successful");

        setDepositAmount("");

        loadWallet();
    }

    async function handleWithdraw() {
        const amount = Number(withdrawAmount);

        if (!amount || amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        const res = await userApi.withdraw(amount);

        if (res.error) {
            alert(res.error);
            return;
        }

        alert("Withdrawal successful");

        setWithdrawAmount("");

        loadWallet();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                minHeight: "100%",
                background: "var(--bg-main)",
                paddingBottom: 40,
            }}
        >
            <TopNav />

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "100px 20px 20px",
                }}
            >
                <h2
                    style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        marginBottom: 25,
                        color: "var(--text-primary)",
                    }}
                >
                    Wallet
                </h2>

                {/* Balance cards go here */}
<div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: "20px",
        marginBottom: "30px",
    }}
>
    {/* Wallet Balance */}
    <div
        style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "24px",
        }}
    >
        <p
            style={{
                color: "var(--text-secondary)",
                fontSize: ".8rem",
                marginBottom: "10px",
            }}
        >
            Wallet Balance
        </p>

        <h2
            style={{
                fontSize: "2rem",
                color: "var(--green-status)",
                margin: 0,
                fontWeight: 700,
            }}
        >
            ৳{Number(wallet.balance).toLocaleString()}
        </h2>
    </div>

    {/* Provider Earnings */}
    {wallet.role === "provider" && (
        <div
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                padding: "24px",
            }}
        >
            <p
                style={{
                    color: "var(--text-secondary)",
                    fontSize: ".8rem",
                    marginBottom: "10px",
                }}
            >
                Total Earnings
            </p>

            <h2
                style={{
                    fontSize: "2rem",
                    color: "#f59e0b",
                    margin: 0,
                    fontWeight: 700,
                }}
            >
                ৳{Number(wallet.earnings).toLocaleString()}
            </h2>
        </div>
    )}
</div>
                {/* Deposit & Withdraw UI */}
<div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        gap: "20px",
        marginBottom: "30px",
    }}
>
    {/* Deposit */}
    <div
        style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "24px",
        }}
    >
        <h3
            style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "var(--text-primary)",
            }}
        >
            Deposit Money
        </h3>

        <input
            type="number"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                marginBottom: "16px",
                boxSizing: "border-box",
            }}
        />

        <button
            onClick={handleDeposit}
            style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#10b981",
                color: "#fff",
                fontWeight: 700,
            }}
        >
            Deposit
        </button>
    </div>

    {/* Withdraw */}
    <div
        style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "24px",
        }}
    >
        <h3
            style={{
                marginTop: 0,
                marginBottom: "20px",
                color: "var(--text-primary)",
            }}
        >
            Withdraw Money
        </h3>

        <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                marginBottom: "16px",
                boxSizing: "border-box",
            }}
        />

        <button
            onClick={handleWithdraw}
            style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#ef4444",
                color: "#fff",
                fontWeight: 700,
            }}
        >
            Withdraw
        </button>
    </div>
</div>
                {/* Transactions */}
                
            </div>
        </motion.div>
    );
}