export default function ConfessionPortal() {
  const moods = [
    'Happy 😊',
    'Confused 😔',
    'Broken 💔',
    'In Love ❤️',
    'Regret 😞',
    'Sad 😓',
  ];

  const payAndSubmit = () => {
    const confession = document.getElementById('confession')?.value?.trim();
    const nickname =
      document.getElementById('nickname')?.value?.trim() || 'Anonymous';
    const mood =
      document.querySelector('input[name="mood"]:checked')?.value ||
      'Not selected';

    if (!confession) {
      alert('Please write your confession first');
      return;
    }

    const finalText = `Confession:\n${confession}\n\nNickname:\n${nickname}\n\nMood:\n${mood}`;

    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: 200,
      currency: 'INR',
      name: 'Anonymous Confession',
      description: '₹2 Submission Fee',
      handler: async function () {
        try {
          const res = await fetch('https://YOUR_RENDER_URL/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confession: finalText }),
          });

          const data = await res.json();
          if (data.success) {
            alert('Confession submitted successfully 💌');
            window.location.reload();
          } else {
            alert(data.error || 'Submission failed');
          }
        } catch (e) {
          alert('Server error');
        }
      },
      theme: {
        color: '#6d28d9',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-violet-50 py-8 px-4">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white shadow-xl p-6 border border-violet-100">
          <div className="h-40 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 mb-6"></div>
          <h1 className="text-3xl font-bold text-violet-700">
            Anonymous Confession 💌
          </h1>
          <p className="mt-3 text-gray-600 leading-7">
            This is a safe space to share your feelings anonymously.
            <br />
            No judgement. No identity reveal.
            <br />
            Speak your heart freely.
          </p>
        </div>

        <div className="rounded-3xl bg-white shadow-lg p-6">
          <label className="font-semibold text-gray-700">
            Is there something you always wanted to tell someone? *
          </label>
          <textarea
            id="confession"
            rows={6}
            className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Write your confession here..."
          />
        </div>

        <div className="rounded-3xl bg-white shadow-lg p-6">
          <label className="font-semibold text-gray-700">
            Optional Nickname
          </label>
          <input
            id="nickname"
            type="text"
            className="mt-4 w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-violet-400"
            placeholder="Stay anonymous if you want"
          />
        </div>

        <div className="rounded-3xl bg-white shadow-lg p-6">
          <p className="font-semibold text-gray-700 mb-4">
            Your Mood Right Now?
          </p>
          <div className="space-y-3">
            {moods.map((mood) => (
              <label
                key={mood}
                className="flex items-center gap-3 text-gray-700"
              >
                <input type="radio" name="mood" value={mood} />
                {mood}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white shadow-lg p-6">
          <h3 className="text-xl font-bold text-violet-700">Final Step</h3>
          <p className="mt-3 text-gray-600 leading-7">
            Once you submit, your secret becomes lighter.
            <br />
            Please avoid posting the same confession multiple times.
            <br />
            Respectful content only 🖤
          </p>
          <button
            onClick={payAndSubmit}
            className="mt-6 w-full rounded-2xl bg-violet-600 py-4 text-white font-semibold shadow-lg hover:bg-violet-700 transition"
          >
            Pay ₹2 & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
