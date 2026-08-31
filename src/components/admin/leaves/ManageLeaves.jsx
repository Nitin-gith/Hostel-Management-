import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LeaveService from "../../../services/LeaveService";

export default function ManageLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetchLeaves();
    }, []);

    async function fetchLeaves() {
        setLoading(true);
        const res = await LeaveService.all();
        setLeaves(res);
        setLoading(false);
    }

    async function handleStatusChange(leave, newStatus) {
        try {
            await LeaveService.updateStatus(leave.id, newStatus);
            toast.success(`Leave ${newStatus}`);
            setLeaves((prev) =>
                prev.map((l) => (l.id === leave.id ? { ...l, status: newStatus } : l))
            );
        } catch (err) {
            toast.error(err.message);
        }
    }

    const visibleLeaves = filter === "All" ? leaves : leaves.filter((l) => l.status === filter);

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-calendar2-x" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Hostel Management</p>
                            <h1 className="h3 mb-1">Manage Leaves</h1>
                            <p className="text-muted mb-0">Approve or reject student leave requests.</p>
                        </div>
                    </div>
                </div>

                <div className="btn-group mb-3" role="group">
                    {["All", "Pending", "Approved", "Rejected"].map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`btn btn-sm ${filter === option ? "btn-primary" : "btn-outline-secondary"}`}
                            onClick={() => setFilter(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <section className="panel">
                    {loading && <p className="text-muted p-3">Loading...</p>}
                    {!loading && visibleLeaves.length === 0 && <p className="text-muted p-3">No leaves found.</p>}
                    {!loading && visibleLeaves.length > 0 && (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleLeaves.map((l) => (
                                        <tr key={l.id}>
                                            <td>{l.studentName}</td>
                                            <td>{l.fromDate}</td>
                                            <td>{l.toDate}</td>
                                            <td>{l.reason}</td>
                                            <td>
                                                <span className={`badge ${l.status === "Approved" ? "bg-success" : l.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td>
                                                {l.status === "Pending" && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-success me-2"
                                                            onClick={() => handleStatusChange(l, "Approved")}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleStatusChange(l, "Rejected")}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {l.status !== "Pending" && (
                                                    <span className="text-muted">No actions</span>
                                                )}
                                            </td>
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
