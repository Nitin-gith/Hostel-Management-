import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintSummary from "./complaint/ComplaintSummary";
import UserService from "../../services/UserService";
import ComplaintService from "../../services/ComplaintService";
import FeeService from "../../services/FeeService";
import LeaveService from "../../services/LeaveService";
import VisitorService from "../../services/VisitorService";

export default function Home() {

    const navigate = useNavigate();
    const studentId = localStorage.getItem("id");

    const [profile, setProfile] = useState(null);
    const [myComplaints, setMyComplaints] = useState([]);
    const [myFees, setMyFees] = useState([]);
    const [myLeaves, setMyLeaves] = useState([]);
    const [myVisitors, setMyVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetrics();
    }, []);

    async function fetchMetrics() {
        setLoading(true);
        try {
            const [profileData, complaints, fees, leaves, visitors] = await Promise.all([
                UserService.single(studentId),
                ComplaintService.all(),
                FeeService.getByStudent(studentId),
                LeaveService.getByStudent(studentId),
                VisitorService.getByStudent(studentId),
            ]);

            setProfile(profileData);
            // filter complaints belonging to the current student
            const mine = complaints.filter((c) => c.studentId === studentId);
            setMyComplaints(mine);
            setMyFees(fees);
            setMyLeaves(leaves);
            setMyVisitors(visitors);
        } catch (err) {
            console.log("Error fetching dashboard metrics: ", err);
        } finally {
            setLoading(false);
        }
    }

    // derived counts
    const pendingComplaints = myComplaints.filter((c) => c.status === "Pending").length;
    const pendingFees = myFees.filter((f) => f.status === "Pending").length;
    const approvedLeaves = myLeaves.filter((l) => l.status === "Approved").length;
    const totalVisitors = myVisitors.length;

    // total paid
    const totalPaid = myFees
        .filter((f) => f.status === "Verified")
        .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

    function handleClick(){
        navigate("/student/addcomplaint");
    }

    return (
        <>
            <main className="dashboard-content">
                <div className="container-fluid px-3 px-lg-4 py-4">

                    <div className="page-heading">
                        <div className="page-heading-copy">
                            <span className="page-icon"><i className="bi bi-speedometer2" aria-hidden="true" /></span>
                            <div>
                                <p className="eyebrow mb-1">Welcome back, {profile?.name || "Student"}</p>
                                <h1 className="h3 mb-1">Dashboard</h1>
                                <p className="text-muted mb-0">Your hostel activity at a glance</p>
                            </div>
                        </div>

                        {/* raise issue */}
                        <div className="heading-actions">
                            <button className="btn btn-primary btn-sm" type="button" onClick={handleClick}><i className="bi bi-file-earmark-plus" aria-hidden="true" /> Raise Issue</button>
                        </div>
                    </div>
                    <section className="row g-3 mt-1" aria-label="Dashboard metrics">
                        <div className="col-12 col-sm-6 col-xl-3">
                            <article className="metric-card metric-primary" style={{cursor:"pointer"}} onClick={() => navigate("/student/mycomplaints")}>
                                <div className="metric-top">
                                    <span className="metric-label">Pending Complaints</span>
                                    <span className="metric-icon"><i className="bi-exclamation-circle-fill" aria-hidden="true" /></span>
                                </div>
                                <div className="metric-value">{loading ? "..." : pendingComplaints}</div>
                                <div className="metric-meta">
                                    <span>{myComplaints.length} total raised</span>
                                </div>
                            </article>
                        </div>
                        <div className="col-12 col-sm-6 col-xl-3">
                            <article className="metric-card metric-success" style={{cursor:"pointer"}} onClick={() => navigate("/student/fees")}>
                                <div className="metric-top">
                                    <span className="metric-label">Fees Paid</span>
                                    <span className="metric-icon"><i className="bi-credit-card-fill" aria-hidden="true" /></span>
                                </div>
                                <div className="metric-value">{loading ? "..." : `₹${totalPaid}`}</div>
                                <div className="metric-meta">
                                    <span>{pendingFees} pending</span>
                                </div>
                            </article>
                        </div>
                        <div className="col-12 col-sm-6 col-xl-3">
                            <article className="metric-card metric-warning" style={{cursor:"pointer"}} onClick={() => navigate("/student/leaves")}>
                                <div className="metric-top">
                                    <span className="metric-label">Leaves Approved</span>
                                    <span className="metric-icon"><i className="bi bi-calendar-check" aria-hidden="true" /></span>
                                </div>
                                <div className="metric-value">{loading ? "..." : approvedLeaves}</div>
                                <div className="metric-meta">
                                    <span>{myLeaves.length} total applied</span>
                                </div>
                            </article>
                        </div>
                        <div className="col-12 col-sm-6 col-xl-3">
                            <article className="metric-card metric-danger" style={{cursor:"pointer"}} onClick={() => navigate("/student/visitors")}>
                                <div className="metric-top">
                                    <span className="metric-label">Visitors Registered</span>
                                    <span className="metric-icon"><i className="bi bi-people-fill" aria-hidden="true" /></span>
                                </div>
                                <div className="metric-value">{loading ? "..." : totalVisitors}</div>
                                <div className="metric-meta">
                                    <span>all time</span>
                                </div>
                            </article>
                        </div>
                    </section>
                    <section className="row g-3 mt-1">
                        <div className="col-12 col-xl-8">
                            <div className="panel">
                                <div className="panel-header">
                                    <div>
                                        <h2 className="h5 mb-1 section-title"><i className="bi bi-graph-up-arrow" aria-hidden="true" /><span>My Complaints</span></h2>
                                        <p className="text-muted mb-0">Recent issues you've raised</p>
                                    </div>
                                    <button className="btn btn-light btn-sm" onClick={() => navigate("/student/mycomplaints")}>View All</button>
                                </div>
                                <div className="table-responsive p-3">
                                    {loading && <p className="text-muted">Loading...</p>}
                                    {!loading && myComplaints.length === 0 && <p className="text-muted">No complaints raised yet.</p>}
                                    {!loading && myComplaints.length > 0 && (
                                        <table className="table align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myComplaints.slice(0, 5).map(c => (
                                                    <tr key={c.id}>
                                                        <td>{c.title}</td>
                                                        <td>
                                                            <span className={`badge ${c.status === "Solved" ? "bg-success" : "bg-warning text-dark"}`}>
                                                                {c.status}
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
                        <div className="col-12 col-xl-4">
                            <div className="panel h-100">
                                <div className="panel-header">
                                    <div>
                                        <h2 className="h5 mb-1 section-title"><i className="bi bi-info-circle" aria-hidden="true" /><span> Quick Info</span></h2>
                                        <p className="text-muted mb-0">Your hostel details</p>
                                    </div>
                                </div>
                                <div className="activity-list">
                                    <div className="activity-item"><span className="activity-dot bg-primary" /><div><p className="mb-1 fw-semibold">Hostel</p><p className="text-muted small mb-0">{profile?.hostelName || profile?.hostel || "Not Allocated"}</p></div></div>
                                    <div className="activity-item"><span className="activity-dot bg-success" /><div><p className="mb-1 fw-semibold">Room</p><p className="text-muted small mb-0">{profile?.room || "Not Allocated"}</p></div></div>
                                    <div className="activity-item"><span className="activity-dot bg-warning" /><div><p className="mb-1 fw-semibold">Phone</p><p className="text-muted small mb-0">{profile?.phone || "N/A"}</p></div></div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>


        </>
    )
}
