import type { AdminStats } from '../../src/api/admin';
interface StatsCardsProps {
    stats: AdminStats;
}

/**
 * elena
 * displays dashboard statistics of employees in a grid of cards
 */

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="stats-container">
            <div className="stat-card">
                <h3>Total Employees</h3>
                <p className="stat-number">{stats.totalEmployees}</p>
            </div>
            <div className="stat-card">
                <h3>Admins</h3>
                <p className="stat-number">{stats.totalAdmins}</p>
            </div>
            <div className="stat-card">
                <h3>Regular Users</h3>
                <p className="stat-number">{stats.totalRegularUsers}</p>
            </div>
            <div className="stat-card">
                <h3>Total Coins</h3>
                <p className="stat-number">{stats.totalCoins}</p>
            </div>
            <div className="stat-card">
                <h3>Average Coins per user</h3>
                <p className="stat-number">{stats.averageCoinsPerUser.toFixed(1)}</p>
            </div>
        </div>
    );
}

