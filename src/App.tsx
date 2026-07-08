import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CustomCursor } from "./components/CustomCursor";
import { AuthProvider } from "./context/AuthContext";
import { MembershipProvider } from "./context/MembershipContext";

export default function App() {
    return (
        <AuthProvider>
            <MembershipProvider>
                <CustomCursor />
                <RouterProvider router={router} />
            </MembershipProvider>
        </AuthProvider>
    );
}
