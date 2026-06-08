import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Experiences } from "./components/Experiences";
import { MembershipTiers } from "./components/MembershipTiers";
import { Footer } from "./components/Footer";

export function LandingPage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#020612',
            color: '#94a3b8',
            overflowX: 'hidden',
            position: 'relative',
            fontFamily: "'Inter', system-ui, sans-serif",
        }}>
            {/* Global atmospheric background */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(29,78,216,0.06) 0%, transparent 60%)',
            }} />
            <div style={{
                position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '1000px', height: '400px', borderRadius: '50%',
                background: 'rgba(59,130,246,0.03)', filter: 'blur(140px)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Navbar />
                <Hero />
                <Experiences />
                <MembershipTiers />
                <Footer />
            </div>
        </div>
    );
}