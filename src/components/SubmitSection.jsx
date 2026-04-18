import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubmitSection({ confessionText }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitConfession = async (paymentResponse = null) => {
    if (!confessionText.trim()) {
      alert('Please write your confession first');
      return;
    }

    try {
      //setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/confessions/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: confessionText,
            isPaid: !!paymentResponse,
            paymentId: paymentResponse?.razorpay_payment_id || null,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

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
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 200, // ₹2
      currency: 'INR',
      name: 'CONFESSION WALLAH',
      description: 'Confession Submission',
      handler: async function (response) {
        console.log('Payment Success:', response);
        sessionStorage.removeItem('confessionDetails');

        navigate('/success', {
          state: {
            loadingDetails: true,
          },
        });

        submitConfession(response);
      },
      prefill: {
        name: 'Anonymous User',
      },
      theme: {
        color: '#7c3aed',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function () {
      setLoading(false);
      alert('Payment failed. Please try again.');
    });
    rzp.open();
  };
  return (
    <>
      <div className="rounded-3xl backdrop-blur-lg bg-white/70 shadow-lg p-6">
        <h3 className="text-xl font-bold text-violet-700">Final Step</h3>

        <p className="mt-3 text-gray-600 leading-7">
          Once you submit, your secret becomes lighter 💜
        </p>

        <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm leading-7 text-gray-700">
          <p>
            💌 Please wait — after submission we’ll instantly show your
            <span className="font-semibold text-violet-700">
              {' '}
              Confession Number
            </span>{' '}
            and the
            <span className="font-semibold text-violet-700">
              {' '}
              estimated posting time
            </span>
            .
          </p>

          <p className="mt-3">
            🔒 Your privacy will remain completely secret and secure.
          </p>

          <p className="mt-3 text-red-500 font-medium">
            ⚠️ Once submitted, this confession cannot be edited.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 py-4 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              Submitting<span className="animate-bounce ml-1">...</span>
            </span>
          ) : (
            'Pay ₹2 & Submit'
          )}
        </button>
      </div>
    </>
  );
}
