import { Link } from "react-router-dom";


export default function Sidebar() {
    return (
        <>

            <aside className="admin-sidebar" id="adminSidebar" aria-label="Main navigation">
                <div className="sidebar-header">
                    <Link className="brand-mark" to="/student" aria-label="adminHMD dashboard">
                        <span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true" /></span>
                        <span className="brand-copy">
                            <span className="brand-title">Hostel Management</span>
                            <span className="brand-subtitle">Menu</span>
                        </span>
                    </Link>
                </div>
                <nav className="sidebar-nav">
                    <Link className="nav-link" to="/student">
                        <span className="nav-icon"><i className="bi bi-speedometer2" aria-hidden="true" /></span>
                        <span className="nav-text">Dashboard</span>
                    </Link>
                    
                    <Link className="nav-link" to="/student/profile">
                        <span className="nav-icon"><i className="bi bi-person-badge" aria-hidden="true" /></span>
                        <span className="nav-text">Profile</span>
                    </Link>
                    
                    <Link className="nav-link" to="/student/mycomplaints">
                        <span className="nav-icon"><i className="bi bi-ui-checks-grid" aria-hidden="true" /></span>
                        <span className="nav-text">Complaint History</span>
                    </Link>

                    <Link className="nav-link" to="/student/hostel">
                        <span className="nav-icon"><i className="bi bi-building" aria-hidden="true" /></span>
                        <span className="nav-text">Hostel</span>
                    </Link>

                    <Link className="nav-link" to="/student/fees">
                        <span className="nav-icon"><i className="bi bi-credit-card" aria-hidden="true" /></span>
                        <span className="nav-text">Fees</span>
                    </Link>

                    <Link className="nav-link" to="/student/leaves">
                        <span className="nav-icon"><i className="bi bi-calendar2-minus" aria-hidden="true" /></span>
                        <span className="nav-text">Leaves</span>
                    </Link>

                    <Link className="nav-link" to="/student/visitors">
                        <span className="nav-icon"><i className="bi bi-people" aria-hidden="true" /></span>
                        <span className="nav-text">Visitors</span>
                    </Link>

                    <Link className="nav-link" to="/student/settings">
                        <span className="nav-icon"><i className="bi bi-gear" aria-hidden="true" /></span>
                        <span className="nav-text">Settings</span>
                    </Link>
                   
                </nav>
    
                <div className="sidebar-footer">
                    <span className="status-dot" />
                    <span className="sidebar-footer-text">System running smoothly</span>
                </div>
            </aside>


        </>
    )
}