import { Link } from "react-router-dom";

export default function Complaint() {
    return (
        <>
            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4">
                    <div className="page-heading">
                        <div className="page-heading-copy">
                            <span className="page-icon"><i className="bi bi-exclamation-triangle" aria-hidden="true" /></span>
                            <div>
                                <p className="eyebrow mb-1">Support</p>
                                <h1 className="h3 mb-1">Complaints</h1>
                                <p className="text-muted mb-0">View or raise a new complaint.</p>
                            </div>
                        </div>
                        <div className="heading-actions">
                            <Link className="btn btn-outline-secondary btn-sm" to="/student/mycomplaints">
                                <i className="bi bi-arrow-left" aria-hidden="true" /> Back to Complaints
                            </Link>
                        </div>
                    </div>
                    <section className="row g-3">
                        <div className="col-12 col-xl-8">
                            <div className="panel p-4 text-center">
                                <i className="bi bi-chat-left-text" style={{fontSize: "3rem", opacity: 0.3}} />
                                <p className="text-muted mt-3">Select a complaint from the list or raise a new issue.</p>
                                <Link className="btn btn-primary" to="/student/addcomplaint">
                                    <i className="bi bi-plus-lg" aria-hidden="true" /> Raise New Issue
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}