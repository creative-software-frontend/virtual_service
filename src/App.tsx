import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CustomCursor } from "./components/CustomCursor";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <CustomCursor />
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
