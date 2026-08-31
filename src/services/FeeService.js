import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../Firebase/firebaseconfig";

class FeeService {
    // Add a new fee record (from student)
    async submitFee(data) {
        const docRef = await addDoc(collection(db, "fees"), { ...data, status: "Pending", createdAt: Date.now() });
        return docRef.id;
    }

    // Get all fees (for admin)
    async all() {
        const querySnapshot = await getDocs(collection(db, "fees"));
        let fees = [];
        querySnapshot.forEach((doc) => {
            fees.push({ id: doc.id, ...doc.data() });
        });
        return fees;
    }

    // Get fees by student ID (for student panel)
    async getByStudent(studentId) {
        const q = query(collection(db, "fees"), where("studentId", "==", studentId));
        const querySnapshot = await getDocs(q);
        let fees = [];
        querySnapshot.forEach((doc) => {
            fees.push({ id: doc.id, ...doc.data() });
        });
        return fees;
    }

    // Verify fee payment (by admin)
    async verify(id, status) {
        const docRef = doc(db, "fees", id);
        await updateDoc(docRef, { status: status, updatedAt: Date.now() });
    }
}

export default new FeeService();
