import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmitSection({ formData, collegeId }) {
  const [loading, setLoading] = useState(false);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/college/${collegeId}`)
      .then((res) => res.json())
      .then((data) => {
        setPaymentEnabled(!!data?.data?.payment?.enabled);
        setPaymentLink(data?.data?.payment?.razorpayLink || '');
      })
      .catch(console.error);
  }, [collegeId]);

  const submitConfession = async (paymentResponse = null) => {
    if (!formData.message?.trim()) {
      alert('Please write your confession first');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/confessions/submit?collegeId=${collegeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            confession: formData.message, // 🔥 FIX
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

      if (data.success) {
        sessionStorage.setItem(
          'confessionDetails',
          JSON.stringify({
            confessionNo: data.confessionNo,
            queueAhead: data.queueAhead,
            eta: data.eta,
          }),
        );
      } else {
        alert('Submission failed');
      }
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!formData.message?.trim()) {
      alert('Please write your confession first');
      return;
    }

    setLoading(true);

    if (!paymentEnabled) {
      navigate(`/${collegeId}/success`, {
        state: { loadingDetails: true },
      });

      // 🔥 background submission
      submitConfession();

      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 200,
      currency: 'INR',
      name: 'Confession Wallah',
      handler: function (response) {
        navigate(`/${collegeId}/success`, {
          state: { loadingDetails: true },
        });

        // background call
        submitConfession(response);
      },

      theme: {
        color: '#000000',
      },

      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function () {
      setLoading(false);
      alert('Payment failed ❌');
    });

    rzp.open();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white">
      {/* Heading */}
      <h3 className="text-xl font-semibold">Final Step</h3>

      <p className="mt-2 text-gray-400 text-sm">
        Submit your confession securely and anonymously.
      </p>

      {/* Info Box */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        <p>
          💌 You’ll instantly get your{' '}
          <span className="text-white font-medium">Confession Number</span> and
          ETA.
        </p>

        <p className="mt-2">🔒 Your identity stays private.</p>

        <p className="mt-2 text-red-400">⚠️ Cannot edit after submission.</p>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-white text-black py-4 font-semibold transition hover:scale-[1.02] disabled:opacity-50"
      >
        {loading
          ? 'Processing...'
          : paymentEnabled
            ? 'Pay ₹2 & Submit'
            : 'Submit Confession'}
      </button>
    </div>
  );
}
