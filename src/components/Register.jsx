import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserService from "../services/UserService";
import { useTheme } from "../context/ThemeContext";


export default function Register() {

    const { isDark, toggleTheme } = useTheme();
    const nav = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    async function submitForm(e) {
        e.preventDefault();

        let payload = {
            name,
            email,
            password,
            phone,
            gender: "Not Specified",
            course: "Not Specified",
            year: "Not Specified",
            address: "Not Specified",
            room: "Not Allocated",
            hostelName: "Not Allocated",
            userType: "2" // Student
        };

        if (email === "" || password === "" || name === "") {
            toast.error("Required fields cannot be empty!")
        }
        else if(password.length <= 6){
            toast.error("Password must be more than 6 characters long")
        }
        else {
            try {
                await UserService.add(payload);
                toast.success("Registration Success. Please login.");
                nav("/"); // redirect to login
            } catch (err) {
                toast.error(err.message);
            }
        }
    }


    return (
        <>
            <div>
                <button className="icon-button theme-toggle auth-theme-toggle" type="button" onClick={toggleTheme} aria-label="Switch color theme" title="Switch color theme">
                    <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`} aria-hidden="true" />
                </button>
                <main className="auth-page">
                    <section className="auth-card">
                        <Link className="auth-brand" to="/"><span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true" /></span><span><h3>Hostel Management Portal</h3></span></Link>
                        
                        {/* Input Form */}
                        <form className="needs-validation" noValidate onSubmit={submitForm}>
                            <div className="mb-4">
                                <p className="eyebrow mb-1">Student Access</p>
                                <h1 className="h3 mb-1">Register</h1>
                                <p className="text-muted mb-0">Create a new student account.</p>
                            </div>
                            <div className="mb-3"><label className="form-label" htmlFor="regName">Full Name</label>
                                <input
                                    className="form-control"
                                    id="regName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required />
                            </div>
                            <div className="mb-3"><label className="form-label" htmlFor="regEmail">Email address</label>
                                <input
                                    className="form-control"
                                    id="regEmail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                            </div>
                            <div className="mb-3"><label className="form-label" htmlFor="regPhone">Phone Number</label>
                                <input
                                    className="form-control"
                                    id="regPhone"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="regPassword">Password</label>
                                <input
                                    className="form-control"
                                    id="regPassword"
                                    type="password"
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                <div className="invalid-feedback">Password must be at least 6 characters.</div>
                            </div>
                            <button className="btn btn-primary w-100" type="submit"><i className="bi bi-person-plus" aria-hidden="true" /> Register</button>
                            
                            <div className="mt-3 text-center">
                                <span className="text-muted">Already have an account? </span>
                                <Link to="/">Login here</Link>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </>
    )
}
