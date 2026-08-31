import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/firebaseconfig";

class VisitorService {
    async register(data) {
        const docRef = await addDoc(collection(db, "visitors"), { ...data, createdAt: Date.now() });
        return docRef.id;
    }

    async all() {
        const querySnapshot = await getDocs(collection(db, "visitors"));
        let visitors = [];
        querySnapshot.forEach((doc) => {
            visitors.push({ id: doc.id, ...doc.data() });
        });
        return visitors;
    }

    async getByStudent(studentId) {
        const q = query(collection(db, "visitors"), where("studentId", "==", studentId));
        const querySnapshot = await getDocs(q);
        let visitors = [];
        querySnapshot.forEach((doc) => {
            visitors.push({ id: doc.id, ...doc.data() });
        });
        return visitors;
    }
}

export default new VisitorService();
