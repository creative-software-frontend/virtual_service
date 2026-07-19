import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TopNav } from "./TopNav";
import { useToast } from "../../../components/Toast";
import { userApi, type ChangePasswordPayload } from "../../../utils/api";

// ─── Styles ──────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.6rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 44px 12px 16px",
    background: "var(--bg-input)",
    border: "1px solid var(--border-default)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
};

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const PASSWORD_MAX_LENGTH = 8;

export function ChangePasswordPage() {
    const navigate = useNavigate();
    const toast = useToast();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const eyeIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const clearFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // ── Client-side validation (mirrors backend rules) ──
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (newPassword.length !== PASSWORD_MAX_LENGTH) {
            setError(`New password must be exactly ${PASSWORD_MAX_LENGTH} characters.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        if (currentPassword === newPassword) {
            setError("New password must be different from your current password.");
            return;
        }

        setLoading(true);
        try {
            const payload: ChangePasswordPayload = {
                currentPassword,
                newPassword,
                confirmPassword,
            };

            const res = await userApi.changePassword(payload);

            if (res.error || !res.data?.success) {
                setError(res.error || res.data?.message || "Failed to change password.");
                return;
            }

            toast.success(res.data.message || "Password changed successfully.");
            clearFields();
        } catch (err: any) {
            setError(err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderField = (
        id: string,
        label: string,
        value: string,
        onChange: (v: string) => void,
        show: boolean,
        toggle: () => void
    ) => (
        <div>
            <label htmlFor={id} style={labelStyle}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={value}
                    maxLength={PASSWORD_MAX_LENGTH}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-mid)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                />
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={show ? "Hide password" : "Show password"}
                    style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "var(--text-muted)",
                        cursor: "pointer",
                    }}
                >
                    {eyeIcon}
                </button>
            </div>
        </div>
    );

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            style={{ minHeight: "100vh", background: "var(--bg-main)", width: "100%" }}
        >
            <TopNav />

            <div
                style={{
                    width: "100%",
                    height: "1px",
                    background:
                        "linear-gradient(90deg, rgba(19,34,71,0.1) 0%, var(--border-default) 50%, rgba(19,34,71,0.1) 100%)",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: "2400px",
                    margin: "0 auto",
                    padding: "108px 16px 48px 16px",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ maxWidth: "520px", margin: "0 auto" }}>
                    <motion.div
                        variants={fadeUp}
                        style={{ textAlign: "center", margin: "0 0 32px 0" }}
                    >
                        <h3
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                marginBottom: "6px",
                            }}
                        >
                            Change Password
                        </h3>
                        <span
                            style={{
                                display: "inline-block",
                                fontSize: "0.65rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--blue-vivid)",
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                background: "var(--blue-glow)",
                                padding: "6px 18px",
                                borderRadius: "20px",
                                border: "1px solid var(--border-subtle)",
                            }}
                        >
                            Account Security
                        </span>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="card"
                        style={{
                            padding: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {renderField(
                                "cp-current",
                                "Current Password",
                                currentPassword,
                                setCurrentPassword,
                                showCurrent,
                                () => setShowCurrent((v) => !v)
                            )}
                            {renderField(
                                "cp-new",
                                "New Password",
                                newPassword,
                                setNewPassword,
                                showNew,
                                () => setShowNew((v) => !v)
                            )}
                            {renderField(
                                "cp-confirm",
                                "Confirm Password",
                                confirmPassword,
                                setConfirmPassword,
                                showConfirm,
                                () => setShowConfirm((v) => !v)
                            )}

                            {error && (
                                <div
                                    role="alert"
                                    style={{
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        background: "rgba(239, 68, 68, 0.08)",
                                        border: "1px solid rgba(239, 68, 68, 0.3)",
                                        color: "var(--red-status)",
                                        fontSize: "0.85rem",
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        background: loading
                                            ? "rgba(59,130,246,0.4)"
                                            : "linear-gradient(135deg, var(--blue-neon), var(--blue-vivid))",
                                        border: "none",
                                        borderRadius: 10,
                                        color: "#fff",
                                        fontSize: "0.65rem",
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        fontFamily: "'Inter', sans-serif",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        boxShadow: loading ? "none" : "var(--shadow-blue)",
                                        transition: "filter 0.2s, transform 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!e.currentTarget.disabled) {
                                            e.currentTarget.style.filter = "brightness(1.15)";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = "none";
                                        e.currentTarget.style.transform = "none";
                                    }}
                                >
                                    {loading ? "Updating…" : "Change Password"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        background: "transparent",
                                        border: "1px solid var(--border-subtle)",
                                        borderRadius: 10,
                                        color: "var(--text-primary)",
                                        fontSize: "0.65rem",
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        fontFamily: "'Inter', sans-serif",
                                        cursor: loading ? "not-allowed" : "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
