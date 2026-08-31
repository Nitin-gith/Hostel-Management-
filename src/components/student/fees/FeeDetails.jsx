import { useEffect, useState } from "react";
import FeeService from "../../../services/FeeService";
import UserService from "../../../services/UserService";
import { toast } from "react-toastify";

export default function FeeDetails() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
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
            const res = await FeeService.getByStudent(studentId);
            setFees(res);
        }
        setLoading(false);
    }

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    async function submitPayment(e) {
        e.preventDefault();
        try {
            if (!amount || isNaN(amount) || amount <= 0) {
                toast.error("Enter a valid amount");
                return;
            }

            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                return;
            }

            const options = {
                key: "rzp_test_TYdummyKeyHere123", 
                amount: parseFloat(amount) * 100, 
                currency: "INR",
                name: "Hostel Management",
                description: "Hostel Fee Payment",
                image: "https://example.com/your_logo",
                handler: async function (response) {
                    // Payment successful
                    try {
                        await FeeService.submitFee({
                            studentId: profile.id,
                            studentName: profile.name,
                            amount: parseFloat(amount),
                            paymentId: response.razorpay_payment_id,
                            status: "Verified" 
                        });
                        toast.success("Payment successful and verified!");
                        setAmount("");
                        fetchData();
                    } catch (err) {
                        toast.error("Failed to record payment in database.");
                    }
                },
                prefill: {
                    name: profile?.name || "",
                    email: profile?.email || "",
                    contact: profile?.phone || ""
                },
                theme: {
                    color: "#0d6efd"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <main className="dashboard-content">
            <div className="container-fluid px-3 px-lg-4 py-4">
                <div className="page-heading">
                    <div className="page-heading-copy">
                        <span className="page-icon"><i className="bi bi-credit-card" aria-hidden="true" /></span>
                        <div>
                            <p className="eyebrow mb-1">Financials</p>
                            <h1 className="h3 mb-1">Fee Details</h1>
                            <p className="text-muted mb-0">Pay your hostel fees securely via Razorpay.</p>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Make a Payment</h2>
                            </div>
                            <form className="p-3" onSubmit={submitPayment}>
                                <div className="mb-3">
                                    <label className="form-label">Amount (INR)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Pay with Razorpay</button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-8">
                        <div className="panel">
                            <div className="panel-header">
                                <h2 className="h5 mb-0">Payment History</h2>
                            </div>
                            <div className="table-responsive p-3">
                                {loading && <p>Loading...</p>}
                                {!loading && fees.length === 0 && <p>No payment history.</p>}
                                {!loading && fees.length > 0 && (
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees.map(f => (
                                                <tr key={f.id}>
                                                    <td>₹{f.amount}</td>
                                                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge ${f.status === "Verified" ? "bg-success" : "bg-warning text-dark"}`}>
                                                            {f.status}
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
