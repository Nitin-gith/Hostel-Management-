import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FeeService from "../../../services/FeeService";

export default function ManageFees() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetchFees();
    }, []);

    async function fetchFees() {
        setLoading(true);
        const res = await FeeService.all();
        setFees(res);
        setLoading(false);
    }

    async function handleToggleStatus(fee) {
        try {
            const newStatus = fee.status === "Verified" ? "Pending" : "Verified";
            await FeeService.verify(fee.id, newStatus);
            toast.success(`Fee marked as ${newStatus}`);
            setFees((prev) =>
                prev.map((f) => (f.id === fee.id ? { ...f, status: newStatus } : f))
            );
        } catch (err) {
            toast.error(err.message);
        }
    }

    const visibleFees = filter === "All" ? fees : fees.filter((f) => f.status === filter);

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-cash-coin" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Financials</p>
                            <h1 className="h3 mb-1">Manage Fees</h1>
                            <p className="text-muted mb-0">Verify student hostel fee payments.</p>
                        </div>
                    </div>
                </div>

                <div className="btn-group mb-3" role="group">
                    {["All", "Pending", "Verified"].map((option) => (
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
                    {!loading && visibleFees.length === 0 && <p className="text-muted p-3">No fees found.</p>}
                    {!loading && visibleFees.length > 0 && (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Amount</th>
                                        <th>Date Submitted</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleFees.map((f) => (
                                        <tr key={f.id}>
                                            <td>{f.studentName}</td>
                                            <td>₹{f.amount}</td>
                                            <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${f.status === "Verified" ? "bg-success" : "bg-warning text-dark"}`}>
                                                    {f.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${f.status === "Verified" ? "btn-outline-warning" : "btn-outline-success"}`}
                                                    onClick={() => handleToggleStatus(f)}
                                                >
                                                    Mark {f.status === "Verified" ? "Pending" : "Verified"}
                                                </button>
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
