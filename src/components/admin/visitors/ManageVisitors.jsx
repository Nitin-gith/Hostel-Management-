import { useEffect, useState } from "react";
import VisitorService from "../../../services/VisitorService";

export default function ManageVisitors() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisitors();
    }, []);

    async function fetchVisitors() {
        setLoading(true);
        const res = await VisitorService.all();
        setVisitors(res);
        setLoading(false);
    }

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-person-lines-fill" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Hostel Management</p>
                            <h1 className="h3 mb-1">Visitor Log</h1>
                            <p className="text-muted mb-0">View all visitors registered by students.</p>
                        </div>
                    </div>
                </div>

                <section className="panel">
                    {loading && <p className="text-muted p-3">Loading...</p>}
                    {!loading && visitors.length === 0 && <p className="text-muted p-3">No visitors found.</p>}
                    {!loading && visitors.length > 0 && (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Visitor Name</th>
                                        <th>Relation</th>
                                        <th>Phone</th>
                                        <th>Student Host</th>
                                        <th>Visit Date</th>
                                        <th>Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.map((v) => (
                                        <tr key={v.id}>
                                            <td>{v.visitorName}</td>
                                            <td>{v.relation}</td>
                                            <td>{v.phone}</td>
                                            <td>{v.studentName}</td>
                                            <td>{v.visitDate}</td>
                                            <td>{v.purpose}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
