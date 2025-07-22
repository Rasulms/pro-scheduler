import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import payment_banner from "../assets/payment_banner.png";
import { toast, ToastContainer } from "react-toastify";

const Payment = () => {
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();
  const [ProviderName, setProviderName] = useState("");

  const { state } = useLocation();

  useEffect(() => {
    if (state.providerId) {
      fetchProviderName(state.providerId);
    }
  }, [state.providerId]);

  const fetchProviderName = async (provider_Id) => {
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/providerInfo/${provider_Id}`,
      );
      setProviderName(response.data.name);
    } catch (error) {
      console.error("Error fetching provider name:", error);
    }
  };

  // CANCEL BOOKING

  const handleSimulatePayment = async (e, bookingId, status) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/bookings/payment`,
        {
          bookingId: bookingId,
          Payment_Status: status,
        },
      );
      if (response.data.updatedBooking.bookingStatus === "completed") {
        toast.success("Payment was successfully!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }

      if (response.data.updatedBooking.bookingStatus === "failed") {
        toast.error("Payment Failed! Redirecting to home");
          setTimeout(() => {
            navigate("/");
          }, 3500);
      }

      // alert("Booking cancelled");
      // Optionally, you can redirect or update the UI after cancellation
    } catch (error) {
      console.error("Error payment:", error);
      toast.error("Unable to process - contact support");
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
      <section className="Payment_banner_parent">
        <div className="Payment_banner_child_1">
          <h1 className="payment_banner_heading">Complete your Payment</h1>
          <div className="payment_modal_booking_details">
            <h2>Booking Information</h2>
            <div className="payment_modal_booking_details_child">
              <div style={{ width: "50%" }}>
                {ProviderName && (
                  <p>
                    <span>Provider Name:</span> <span>{ProviderName}</span>
                  </p>
                )}
                <p>
                  <span>Time:</span> <span>{state.time}</span>
                </p>
                <p>
                  <span>Date:</span> <span>{state.date}</span>
                </p>
              </div>
              <div style={{ width: "50%" }}>
                {" "}
                <p>
                  <span>Duration:</span> <span>{"60"} mins</span>
                </p>
                <p>
                  <span>Customer Name:</span> <span>{state?.userName}</span>
                </p>
                <p>
                  <span>Amount Payable:</span> <span>{`$100`}</span>
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              <button
                className="Form_cancel_btn"
                onClick={(e) => {
                  handleSimulatePayment(e, state.bookingId, "failed");
                }}

                //   onClick={closeModal}
              >
                Simulate Failure
              </button>
              <button
                className="Form_submit_btn_payment"
                onClick={(e) => {
                  handleSimulatePayment(e, state.bookingId, "completed");
                }}
              >
                Simulate Success
              </button>
              {/* <button
                  className="Cancel_booking_btn"
                  onClick={(e) => {handleCancelBooking(e, state.bookingId)}}
                >
Cancel Booking 
                </button> */}
            </div>
          </div>
        </div>
        <div className="Payment_banner_child_2">
          <img src={payment_banner} alt="" width={"90%"} />
        </div>
      </section>
    </>
  );
};

export default Payment;
