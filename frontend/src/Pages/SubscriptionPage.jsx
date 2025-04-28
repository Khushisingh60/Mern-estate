// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const SubscriptionPage = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { listingData } = location.state || {}; // Receive listingId and listingData
//   //console.log(listingId);

//   const plans = [
//     { duration: '1 Month', price: 499 },
//     { duration: '2 Months', price: 799 },
//     { duration: '3 Months', price: 999 },
//   ];

//   const handlePayment = async (plan) => {
//     try {
//       const res = await fetch('http://localhost:3000/api/payment/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//         body: JSON.stringify({
//           amount: plan.price * 100,
//           //listingId,
//           plan: plan.duration,
//         }),
//       });

//       const order = await res.json();

//       if (!res.ok) {
//         throw new Error(order.message || 'Failed to create payment order');
//       }

//       const options = {
//         key: 'rzp_test_eeEFhBGZty1HYQ', // Ensure this key is correct
//         amount: order.amount,
//         currency: 'INR',
//         name: 'Subscription Payment',
//         description: `Subscription for ${plan.duration}`,
//         order_id: order.id,
//         handler: async (response) => {
//           const paymentData = {
//             //listingId,
//             plan: plan.duration,
//             paymentId: response.razorpay_payment_id,
//             orderId: response.razorpay_order_id,
//             signature: response.razorpay_signature,
//           };

//           const verifyRes = await fetch('http://localhost:3000/api/payment/verify', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//             body: JSON.stringify(paymentData),
//           });

//           const verifyData = await verifyRes.json();

//           if (!verifyRes.ok) {
//             throw new Error(verifyData.message || 'Payment verification failed');
//           }

//           const listingRes = await fetch('http://localhost:3000/api/listing/create', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//             body: JSON.stringify({
//               ...listingData,
//               userRef: currentUser._id,
//             }),
//           });

//           const createdListing = await listingRes.json();

//           if (!listingRes.ok) {
//             throw new Error(createdListing.message || 'Failed to create listing');
//           }

//           navigate(`/listing/${listingId}`);
//         },
//         prefill: {
//           email: currentUser.email,
//         },
//         theme: {
//           color: '#3399cc',
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//     }
//   };

//   return (
//     <main className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold text-center">Choose a Subscription Plan</h1>
//       <div className="flex flex-col gap-4 mt-6">
//         {plans.map((plan) => (
//           <div
//             key={plan.duration}
//             className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
//           >
//             <span>{plan.duration} - ₹{plan.price}</span>
//             <button
//               onClick={() => handlePayment(plan)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Pay
//             </button>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default SubscriptionPage;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SubscriptionPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { listingData, listingId } = location.state || {};

  const plans = [
    { duration: '1 Month', price: 499 },
    { duration: '2 Months', price: 799 },
    { duration: '3 Months', price: 999 },
  ];

  const handlePayment = async (plan) => {
    try {
      const res = await fetch('http://localhost:3000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          amount: plan.price * 100,
          plan: plan.duration,
        }),
      });

      let order;
      try {
        order = await res.json();
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }

      if (!res.ok) {
        throw new Error(order.message || 'Failed to create payment order');
      }

      const options = {
        key: 'rzp_test_eeEFhBGZty1HYQ', // Ideally from .env
        amount: order.amount,
        currency: 'INR',
        name: 'Subscription Payment',
        description: `Subscription for ${plan.duration}`,
        order_id: order.id,
        handler: async (response) => {
          const paymentData = {
            plan: plan.duration,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          };

          const verifyRes = await fetch('http://localhost:3000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify(paymentData),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            throw new Error(verifyData.message || 'Payment verification failed');
          }

          const listingRes = await fetch('http://localhost:3000/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify({
              ...listingData,
              userRef: currentUser._id,
            }),
          });

          const createdListing = await listingRes.json();

          if (!listingRes.ok) {
            throw new Error(createdListing.message || 'Failed to create listing');
          }

          navigate(`/listing/${createdListing._id}`);
        },
        prefill: {
          email: currentUser.email,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error.message);
    }
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Choose a Subscription Plan</h1>
      <div className="flex flex-col gap-4 mt-6">
        {plans.map((plan) => (
          <div
            key={plan.duration}
            className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
          >
            <span>{plan.duration} - ₹{plan.price}</span>
            <button
              onClick={() => handlePayment(plan)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Pay
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default SubscriptionPage;
