import { useEffect, useState } from "react";
import LeaveService from "../../../services/LeaveService";
import UserService from "../../../services/UserService";
import { toast } from "react-toastify";

export default function LeaveApplication() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const studentId = localStorage.getItem("id");
        if (studentId) {
            const p = await UserService.single(studentId);
            setProfile(p);
            const res = await LeaveService.getByStudent(studentId);
            setLeaves(res);
        }
        setLoading(false);
    }

    async function submitLeave(e) {
        e.preventDefault();
        try {
            if (!fromDate || !toDate || !reason) {
                toast.error("Please fill all fields");
                return;
            }
            await LeaveService.apply({
                studentId: profile.id,
                studentName: profile.name,
                fromDate,
                toDate,
                reason
            });
            toast.success("Leave application submitted");
            setFromDate("");
            setToDate("");
            setReason("");
            fetchData();
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-calendar2-minus" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Leaves</p>
                            <h1 className="h3 mb-1">Leave Application</h1>
                            <p className="text-muted mb-0">Apply for leave and check the status of your applications.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Apply for Leave</h2>
                            </div>
                            <form className="p-3" onSubmit={submitLeave}>
                                <div className="mb-3">
                                    <label className="form-label">From Date</label>
                                    <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">To Date</label>
                                    <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Reason</label>
                                    <textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Submit Application</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-8">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Application History</h2>
                            </div>
                            <div className="table-responsive p-3">
                                {loading && <p>Loading...</p>}
                                {!loading && leaves.length === 0 && <p>No leave history.</p>}
                                {!loading && leaves.length > 0 && (
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaves.map(l => (
                                                <tr key={l.id}>
                                                    <td>{l.fromDate}</td>
                                                    <td>{l.toDate}</td>
                                                    <td>{l.reason}</td>
                                                    <td>
                                                        <span className={`badge ${l.status === "Approved" ? "bg-success" : l.status === "Rejected" ? "bg-danger" : "bg-warning text-dark"}`}>
                                                            {l.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
