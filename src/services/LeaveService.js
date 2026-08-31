import { collection, addDoc, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../Firebase/firebaseconfig";

class LeaveService {
    async apply(data) {
        const docRef = await addDoc(collection(db, "leaves"), { ...data, status: "Pending", createdAt: Date.now() });
        return docRef.id;
    }

    async all() {
        const querySnapshot = await getDocs(collection(db, "leaves"));
        let leaves = [];
        querySnapshot.forEach((doc) => {
            leaves.push({ id: doc.id, ...doc.data() });
        });
        return leaves;
    }

    async getByStudent(studentId) {
        const q = query(collection(db, "leaves"), where("studentId", "==", studentId));
        const querySnapshot = await getDocs(q);
        let leaves = [];
        querySnapshot.forEach((doc) => {
            leaves.push({ id: doc.id, ...doc.data() });
        });
        return leaves;
    }

    async updateStatus(id, status) {
        const docRef = doc(db, "leaves", id);
        await updateDoc(docRef, { status: status, updatedAt: Date.now() });
    }
}

export default new LeaveService();
