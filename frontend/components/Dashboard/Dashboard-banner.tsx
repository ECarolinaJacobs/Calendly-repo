import type { DashboardBannerProps } from "../../src/types/dashboard.types"

export function DashboardBanner({ userName }: DashboardBannerProps) {
    return (
        <div className="dashboard-banner">
            <header className="user-greeting">
                <h1>
                    Hello, <span className="username">{userName}!</span>
                </h1>
            </header>
        </div>
    )
}