import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmitSection({ formData, collegeId }) {
  const [loading, setLoading] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/college/${collegeId}`)
      .then((res) => res.json())
      .then((data) => {
        setPaymentEnabled(!!data?.data?.payment?.enabled);
      })
      .catch(console.error);
  }, [collegeId]);

  // ✅ FIXED FUNCTION (returns data)
  const submitConfession = async (paymentResponse = null) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/confessions/submit?collegeId=${collegeId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confession: formData.message,
          nickname: formData.nickname,
          collegeId,
          type: window.location.pathname.includes('shayari')
            ? 'shayari'
            : 'confession',
          isPaid: !!paymentResponse,
          paymentId: paymentResponse?.razorpay_payment_id || null,
        }),
      },
    );
    const data = await response.json();
    // console.log('🔥 API RESPONSE:', data);

    if (data.success) {
      sessionStorage.setItem('confessionDetails', JSON.stringify(data));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!formData.message?.trim()) {
      alert('Please write your confession first');
      return;
    }

    setLoading(true);

    // ✅ If payment NOT required → normal flow
    if (!paymentEnabled) {
      navigate(`/${collegeId}/success`, {
        state: { message: formData.message, collegeId },
      });

      sessionStorage.removeItem('confessionDetails');

      submitConfession().catch(console.error);
      return;
    }

    // 🔥 PAYMENT FLOW STARTS HERE
    try {
      // 1. Create order from backend (you need this API)
      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 200 }), // ₹2 = 200 paise
        },
      );

      const orderData = await orderRes.json();

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Confession App',
        description: 'Submit Confession',
        order_id: orderData.id,

        handler: async function (response) {
          // console.log('💰 Payment Success:', response);

          // ✅ navigate AFTER payment
          navigate(`/${collegeId}/success`, {
            state: { message: formData.message, collegeId },
          });

          sessionStorage.removeItem('confessionDetails');

          // ✅ submit with payment
          await submitConfession(response);
        },

        prefill: {
          name: 'Anonymous',
        },

        theme: {
          color: '#ffffff',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('❌ Payment error:', err);
      alert('Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white">
      <h3 className="text-xl font-semibold">Final Step</h3>

      <p className="mt-2 text-gray-400 text-sm">
        Submit your confession securely and anonymously.
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        <p>
          💌 You’ll instantly get your{' '}
          <span className="text-white font-medium">Confession Number</span>
        </p>

        <p className="mt-2">🔒 Your identity stays private.</p>

        <p className="mt-2 text-red-400">⚠️ Cannot edit after submission.</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-white text-black py-4 font-semibold transition hover:scale-[1.02] disabled:opacity-50"
      >
        {loading
          ? 'Submitting...'
          : paymentEnabled
            ? 'Pay ₹2 & Submit'
            : 'Submit Confession'}
      </button>
    </div>
  );
}
