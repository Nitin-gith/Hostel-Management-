import { useEffect, useState } from "react";
import VisitorService from "../../../services/VisitorService";
import UserService from "../../../services/UserService";
import { toast } from "react-toastify";

export default function VisitorRegistration() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visitorName, setVisitorName] = useState("");
    const [relation, setRelation] = useState("");
    const [phone, setPhone] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [purpose, setPurpose] = useState("");
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
            const res = await VisitorService.getByStudent(studentId);
            setVisitors(res);
        }
        setLoading(false);
    }

    async function submitVisitor(e) {
        e.preventDefault();
        try {
            await VisitorService.register({
                studentId: profile.id,
                studentName: profile.name,
                visitorName,
                relation,
                phone,
                visitDate,
                purpose
            });
            toast.success("Visitor registered successfully");
            setVisitorName("");
            setRelation("");
            setPhone("");
            setVisitDate("");
            setPurpose("");
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
                        <span className="page-icon"><i className="bi bi-people" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Visitors</p>
                            <h1 className="h3 mb-1">Visitor Registration</h1>
                            <p className="text-muted mb-0">Register your visitors and view visit history.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">New Visitor</h2>
                            </div>
                            <form className="p-3" onSubmit={submitVisitor}>
                                <div className="mb-3">
                                    <label className="form-label">Visitor Name</label>
                                    <input type="text" className="form-control" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Relation</label>
                                    <input type="text" className="form-control" value={relation} onChange={(e) => setRelation(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Visit Date</label>
                                    <input type="date" className="form-control" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Purpose</label>
                                    <input type="text" className="form-control" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-8">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Visitor History</h2>
                            </div>
                            <div className="table-responsive p-3">
                                {loading && <p>Loading...</p>}
                                {!loading && visitors.length === 0 && <p>No visitor history.</p>}
                                {!loading && visitors.length > 0 && (
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Relation</th>
                                                <th>Date</th>
                                                <th>Purpose</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visitors.map(v => (
                                                <tr key={v.id}>
                                                    <td>{v.visitorName}</td>
                                                    <td>{v.relation}</td>
                                                    <td>{v.visitDate}</td>
                                                    <td>{v.purpose}</td>
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
