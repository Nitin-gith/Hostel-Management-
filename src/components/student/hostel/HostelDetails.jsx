import { useEffect, useState } from "react";
import UserService from "../../../services/UserService";
import { toast } from "react-toastify";

export default function HostelDetails() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const studentId = localStorage.getItem("id");
            if (!studentId) return;
            const res = await UserService.single(studentId);
            setProfile(res);
        } catch (err) {
            toast.error("Could not load your hostel details.");
        } finally {
            setLoading(false);
        }
    }

    async function applyForHostel() {
        toast.info("Hostel application submitted to admin!");
        // We could write to a new "hostel_applications" collection,
        // but for now, we just show a toast per instructions.
    }

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-building" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Accommodation</p>
                            <h1 className="h3 mb-1">Hostel Details</h1>
                            <p className="text-muted mb-0">View your current room allocation and apply for a hostel.</p>
                        </div>
                    </div>
                </div>

                <section className="row g-3">
                    <div className="col-12 col-xl-6">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Current Allocation</h2>
                            </div>
                            <div className="panel-body p-4">
                                {loading && <p>Loading...</p>}
                                {!loading && profile && (
                                    <>
                                        <p><strong>Hostel Name:</strong> {profile.hostelName || profile.hostel || "Not Allocated"}</p>
                                        <p><strong>Room Number:</strong> {profile.room || "Not Allocated"}</p>
                                        
                                        {(profile.room === "Not Allocated" || !profile.room) && (
                                            <button className="btn btn-primary mt-3" onClick={applyForHostel}>
                                                Apply for Hostel
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
