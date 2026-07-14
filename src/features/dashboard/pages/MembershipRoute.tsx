import { useAuth } from '../../../context/AuthContext';
import { ProviderMembershipPage } from './ProviderMembershipPage';
import { MembershipPage } from './MembershipPage';

export default function MembershipRoute() {
    const { user } = useAuth();

    if (user?.role === 'provider') {
        return <ProviderMembershipPage />;
    }

    return <MembershipPage />;
}
