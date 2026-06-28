import { TopNav } from "./TopNav";
import { useAuth } from "../../../context/AuthContext";
import { NewsfeedTab } from "./provider/NewsfeedTab";

export function NewsfeedPage() {
    const { user } = useAuth();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--bg-main)",
            }}
        >
            <TopNav />

            <div
                style={{
                    padding: "100px 16px 24px",
                    maxWidth: "900px",
                    margin: "0 auto",
                }}
            >
                <h1
                    style={{
                        color: "var(--text-primary)",
                        marginBottom: "24px",
                    }}
                >
                    News Feed
                </h1>

                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    <NewsfeedTab myName={user?.username ?? ""} />
                </div>
            </div>
        </div>
    );
}

