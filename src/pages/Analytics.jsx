import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Analytics() {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Listen for real-time payment updates
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPayment = snapshot.docChanges().find(c => c.type === 'added');
      if (newPayment) {
        const p = newPayment.doc.data();
        toast.success(`💵 New sale: $${p.amount.toFixed(2)} from ${p.email}`);
      }

      // Update payments list
      const paymentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(paymentsList);

      // Calculate total revenue
      const total = paymentsList.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      setTotalRevenue(total);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-blush p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-diamond mb-6 text-dark">
          📊 Analytics Dashboard
        </h1>

        {/* Revenue Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Total Revenue</h2>
          <p className="text-4xl font-bold text-rose-dark">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-gray-600 mt-2">{payments.length} total transactions</p>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Payments</h2>
          {payments.length === 0 ? (
            <p className="text-gray-600">No payments yet. Waiting for real-time updates...</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-blush rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{payment.email}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-rose-dark">
                      ${payment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 uppercase">{payment.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
