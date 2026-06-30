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
    const [error, setError] = useState("");

    const [wallet, setWallet] = useState({
        balance: 0,
        earnings: 0,
        role: "",
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [amountInput, setAmountInput] = useState("");
    const [modalError, setModalError] = useState("");
    const [modalLoading, setModalLoading] = useState(false);

    async function loadWallet() {
        setLoading(true);
        setError("");

        const res = await userApi.getWallet();

        if (res.error) {
            setError(res.error);
        } else if (res.data) {
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

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError("");
        const amt = parseFloat(amountInput);
        if (isNaN(amt) || amt <= 0) {
            setModalError("Please enter a valid positive amount.");
            return;
        }

        try {
            setModalLoading(true);
            const res = await userApi.deposit(amt);
            if (res.error) {
                setModalError(res.error);
            } else {
                setAmountInput("");
                setShowDepositModal(false);
                await loadWallet();
            }
        } catch (err: any) {
            setModalError(err.message || "Deposit failed");
        } finally {
            setModalLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError("");
        const amt = parseFloat(amountInput);
        if (isNaN(amt) || amt <= 0) {
            setModalError("Please enter a valid positive amount.");
            return;
        }
        if (amt > wallet.balance) {
            setModalError("Insufficient balance to withdraw.");
            return;
        }

        try {
            setModalLoading(true);
            const res = await userApi.withdraw(amt);
            if (res.error) {
                setModalError(res.error);
            } else {
                setAmountInput("");
                setShowWithdrawModal(false);
                await loadWallet();
            }
        } catch (err: any) {
            setModalError(err.message || "Withdrawal failed");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                minHeight: "100vh",
                background: "var(--bg-main)",
                width: "100%",
                color: "var(--text-primary)",
            }}
        >
            <TopNav />

            <div
                style={{
                    maxWidth: "2400px",
                    margin: "0 auto",
                    width: "100%",
                    padding: "120px 16px 48px 16px",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <h2
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "clamp(1.3rem, 5vw, 1.75rem)",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "4px",
                        }}
                    >
                        Wallet
                    </h2>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        Manage your balance, deposits, and withdrawals
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "24px",
                    }}
                >
                    {/* Balance & action row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                            gap: "24px",
                            width: "100%",
                            alignItems: "stretch",
                        }}
                    >
                        {/* Balance cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: "16px",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        background: "linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))",
                                        border: "1px solid var(--border-subtle)",
                                        borderRadius: "16px",
                                        padding: "24px",
                                        textAlign: "center",
                                        boxShadow: "var(--shadow-md)",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "0.65rem",
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                            color: "var(--text-secondary)",
                                            fontWeight: 700,
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Wallet Balance
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "2rem",
                                            fontWeight: 800,
                                            color: "var(--text-primary)",
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    >
                                        ৳ {Number(wallet.balance).toFixed(2)}
                                    </p>
                                </div>

                                {wallet.role === "provider" && (
                                    <div
                                        style={{
                                            background: "linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))",
                                            border: "1px solid var(--border-gold)",
                                            borderRadius: "16px",
                                            padding: "24px",
                                            textAlign: "center",
                                            boxShadow: "var(--shadow-gold)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "0.65rem",
                                                letterSpacing: "0.2em",
                                                textTransform: "uppercase",
                                                color: "var(--gold-mid)",
                                                fontWeight: 700,
                                                marginBottom: "8px",
                                            }}
                                        >
                                            ★ Total Earnings
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "2rem",
                                                fontWeight: 800,
                                                color: "var(--gold-mid)",
                                                fontFamily: "'Inter', sans-serif",
                                            }}
                                        >
                                            ৳ {Number(wallet.earnings).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "24px",
                                width: "100%",
                            }}
                        >
                            {[
                                {
                                    label: "DEPOSIT",
                                    sub: "Deposit funds to wallet",
                                    onClick: () => {
                                        setAmountInput("");
                                        setModalError("");
                                        setShowDepositModal(true);
                                    },
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: "WITHDRAW",
                                    sub: "Withdraw your earnings",
                                    onClick: () => {
                                        setAmountInput("");
                                        setModalError("");
                                        setShowWithdrawModal(true);
                                    },
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                                        </svg>
                                    ),
                                },
                            ].map((btn) => (
                                <button
                                    key={btn.label}
                                    onClick={btn.onClick}
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border-subtle)",
                                        borderRadius: "16px",
                                        padding: "32px 24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "12px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease-in-out",
                                        boxSizing: "border-box",
                                        boxShadow: "var(--shadow-sm)",
                                        width: "100%",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "var(--blue-neon)";
                                        e.currentTarget.style.boxShadow = "0 0 20px var(--blue-glow)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                                        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                        e.currentTarget.style.transform = "translateY(0px)";
                                    }}
                                >
                                    <div style={{ marginBottom: "4px" }}>{btn.icon}</div>
                                    <span
                                        style={{
                                            fontSize: "0.85rem",
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            color: "var(--text-primary)",
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {btn.label}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "var(--text-secondary)",
                                            fontFamily: "'Inter', sans-serif",
                                            textAlign: "center",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {btn.sub}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ledger history */}
                    <div
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "16px",
                            padding: "32px 24px",
                            width: "100%",
                            boxSizing: "border-box",
                            boxShadow: "var(--shadow-md)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue-vivid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                            <span
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    fontFamily: "'Inter', sans-serif",
                                }}
                            >
                                Ledger History
                            </span>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>Loading records...</div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--red-status)" }}>{error}</div>
                        ) : transactions.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px 0 24px 0" }}>
                                <p
                                    style={{
                                        color: "var(--text-primary)",
                                        fontSize: "0.9rem",
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 400,
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    No ledger records found.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {transactions.map((tx) => {
                                    const isPositive = tx.type === "deposit" || tx.type === "earning";
                                    return (
                                        <div
                                            key={tx.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                background: "var(--bg-input)",
                                                border: "1px solid var(--border-subtle)",
                                                borderRadius: "12px",
                                                padding: "16px 20px",
                                                transition: "border-color 0.2s",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                                <div
                                                    style={{
                                                        width: "36px",
                                                        height: "36px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background:
                                                            tx.type === "withdraw"
                                                                ? "rgba(239, 68, 68, 0.15)"
                                                                : tx.type === "deposit"
                                                                ? "rgba(59, 130, 246, 0.15)"
                                                                : "rgba(245, 158, 11, 0.15)",
                                                        color:
                                                            tx.type === "withdraw"
                                                                ? "var(--red-status)"
                                                                : tx.type === "deposit"
                                                                ? "var(--blue-vivid)"
                                                                : "var(--gold-mid)",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {tx.type === "withdraw" ? "↓" : tx.type === "deposit" ? "↑" : "★"}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                                                        {tx.description}
                                                    </p>
                                                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                                        {new Date(tx.created_at).toLocaleString()} •{" "}
                                                        <span style={{ textTransform: "uppercase", fontWeight: 600 }}>{tx.status}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "1rem",
                                                    fontWeight: 800,
                                                    color: isPositive ? "var(--green-status)" : "var(--red-status)",
                                                }}
                                            >
                                                {isPositive ? "+" : "-"}৳{Number(tx.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Deposit Modal */}
            {showDepositModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "var(--bg-overlay)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <form
                        onSubmit={handleDeposit}
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-gold)",
                            borderRadius: "16px",
                            padding: "32px",
                            width: "100%",
                            maxWidth: "400px",
                            boxShadow: "var(--shadow-gold)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: "linear-gradient(90deg, transparent, var(--gold-mid), transparent)",
                            }}
                        />
                        <div>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                                DEPOSIT FUNDS
                            </h3>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Enter the amount in Taka to deposit into your account wallet.
                            </p>
                        </div>

                        {modalError && (
                            <div
                                style={{
                                    padding: "8px 12px",
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    borderRadius: "6px",
                                    color: "#fca5a5",
                                    fontSize: "0.78rem",
                                }}
                            >
                                {modalError}
                            </div>
                        )}

                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--text-muted)" }}>
                                ৳
                            </span>
                            <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 36px",
                                    background: "var(--bg-input)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "1rem",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={() => setShowDepositModal(false)}
                                style={{
                                    padding: "10px 16px",
                                    background: "transparent",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "6px",
                                    color: "var(--text-secondary)",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                }}
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                disabled={modalLoading}
                                style={{
                                    padding: "10px 20px",
                                    background: "linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                }}
                            >
                                {modalLoading ? "DEPOSITING..." : "DEPOSIT"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "var(--bg-overlay)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <form
                        onSubmit={handleWithdraw}
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-gold)",
                            borderRadius: "16px",
                            padding: "32px",
                            width: "100%",
                            maxWidth: "400px",
                            boxShadow: "var(--shadow-gold)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: "linear-gradient(90deg, transparent, var(--gold-mid), transparent)",
                            }}
                        />
                        <div>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                                WITHDRAW FUNDS
                            </h3>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Enter the amount to withdraw. Available balance: ৳{Number(wallet.balance).toFixed(2)}.
                            </p>
                        </div>

                        {modalError && (
                            <div
                                style={{
                                    padding: "8px 12px",
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    borderRadius: "6px",
                                    color: "#fca5a5",
                                    fontSize: "0.78rem",
                                }}
                            >
                                {modalError}
                            </div>
                        )}

                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "var(--text-muted)" }}>
                                ৳
                            </span>
                            <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "14px 16px 14px 36px",
                                    background: "var(--bg-input)",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "8px",
                                    color: "var(--text-primary)",
                                    fontSize: "1rem",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                            <button
                                type="button"
                                onClick={() => setShowWithdrawModal(false)}
                                style={{
                                    padding: "10px 16px",
                                    background: "transparent",
                                    border: "1px solid var(--border-subtle)",
                                    borderRadius: "6px",
                                    color: "var(--text-secondary)",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                }}
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                disabled={modalLoading}
                                style={{
                                    padding: "10px 20px",
                                    background: "linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))",
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "#fff",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                }}
                            >
                                {modalLoading ? "WITHDRAWING..." : "WITHDRAW"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </motion.div>
    );
}