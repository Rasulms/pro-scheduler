// Importing required dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import homepageBanner from "../assets/hero_banner_image.png";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";

// Set the root element for accessibility when using react-modal
Modal.setAppElement("#root");

const Home = () => {
  const navigate = useNavigate();
  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  // State declarations
  const [modalIsOpen_1, setModalIsOpen_1] = useState(false);
  const [Slots, setSlots] = useState([]); // Stores fetched available slots
  const [selectedSlot, setSelectedSlot] = useState(null); // Stores selected slot for booking
  const [username, setUsername] = useState(""); // Stores user name
  const [selectedProviderId, setSelectedProviderId] = useState(""); // Stores selected provider ID

  // Handle provider dropdown change
  const handleChange = (e) => {
    setSelectedProviderId(e.target.value);
  };

  // Open booking modal with slot info
  const handleBookClick = (slot) => {
    setUsername("");
    setSelectedSlot(slot);
    setModalIsOpen_1(true);
    toast.info("🕒 You have 3 mins to complete your booking");
  };

  // Close modal and reset booking state
  const closeModal = () => {
    setUsername("");
    setModalIsOpen_1(false);
    setSelectedSlot(null);
  };

  // Fetch slots of selected provider
  const handleProviderClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${BACKEND_BASE_URL}/providers/${selectedProviderId}/slots`,
      );
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  // Handle booking submission
  const handleInitaiteBooking = async (slot, e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/bookings/initiate`,
        {
          slotId: slot.slot_id,
          providerId: selectedProviderId,
          userName: username,
          date: slot.date,
          time: slot.time,
          bookingStatus: "pending",
        },
      );

      toast.success(
        "Booking initiated successfully! Redirecting to payment...",
      );

      const paymentpageData = {
        bookingId: response.data.booking._id,
        providerId: response.data.booking.providerId,
        userName: response.data.booking.userId,
        date: response.data.booking.date,
        time: response.data.booking.time,
      };

      // Redirect to payment after 3 seconds
      setTimeout(() => {
        navigate("/payment", { state: paymentpageData });
      }, 3000);
    } catch (error) {
      console.error("Error initiating booking:", error);
      if (error.response?.status === 400) {
        toast.error(
          "Slot already booked for this provider at the selected time.",
        );
      } else {
        toast.error("Failed to initiate booking. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick={false}
        pauseOnHover={false}
        draggable={false}
        theme="light"
      />

      {/* Hero Section */}
      <section className="Homepage_banner_parent">
        <div className="Homepage_banner_child_1">
          <h1 className="Homepage_banner_heading">Pro-Scheduler</h1>
          <p className="Homepage_banner_description">
            Booking made easy and stress-free! Just select your preferred time
            slot and relax— our reliable scheduling system ensures everything is
            handled smoothly and efficiently.
          </p>
          <a href="#Choose_slots" className="Homepage_banner_btn">
            Explore Available Slot
          </a>
        </div>
        <div className="Homepage_banner_child_2">
          <img src={homepageBanner} alt="Homepage Banner" width="85%" />
        </div>
      </section>

      {/* Provider Selection Section */}
      <section id="Choose_slots" className="Choose_provider_section_parent">
        <div>
          <h2 className="Provider_section_heading">Choose Provider</h2>
          <p className="Provider_description">
            It shows the available slot of the selected provider
          </p>
        </div>
        <form
          onSubmit={handleProviderClick}
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <select
            id="provider"
            value={selectedProviderId}
            onChange={handleChange}
            required
            style={{
              padding: "5px 12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            <option value="" disabled>
              Select a provider
            </option>
            <option
              key="687e67492717a6d71893d8d6"
              value="687e67492717a6d71893d8d6"
            >
              Asha - Yoga Trainer
            </option>
            <option
              key="687e678f2717a6d71893d8ec"
              value="687e678f2717a6d71893d8ec"
            >
              Kumaran - English Teacher
            </option>
          </select>

          <button className="Avail_slot_btn">Show Available Slots</button>
        </form>
      </section>

      {/* Available Slots Section */}
      {Slots?.length > 0 && (
        <section
          className="Available_slots_section_parent"
          id="Available_slots_section"
        >
          <div>
            <h2 className="Available_slots_section_heading">
              Available Time Slots
            </h2>
            <p className="Homepage_banner_description">
              Choose from our available time slots and complete your booking in
              just a few steps
            </p>
          </div>

          <div className="Available_slots_section_child">
            {Slots.map((slot, index) => (
              <div key={index} className="Available_slots_section_child_grid">
                {/* Row 1 - Date and Status */}
                <div className="Available_slot_card_row1">
                  <div className="Available_slot_card">
                    <svg
                    fill="#000000"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="15px"
                    height="15px"
                    viewBox="0 0 610.398 610.398"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                     strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <path d="M159.567,0h-15.329c-1.956,0-3.811,0.411-5.608,0.995c-8.979,2.912-15.616,12.498-15.616,23.997v10.552v27.009v14.052 c0,2.611,0.435,5.078,1.066,7.44c2.702,10.146,10.653,17.552,20.158,17.552h15.329c11.724,0,21.224-11.188,21.224-24.992V62.553 V35.544V24.992C180.791,11.188,171.291,0,159.567,0z"></path>{" "}
                          <path d="M461.288,0h-15.329c-11.724,0-21.224,11.188-21.224,24.992v10.552v27.009v14.052c0,13.804,9.5,24.992,21.224,24.992 h15.329c11.724,0,21.224-11.188,21.224-24.992V62.553V35.544V24.992C482.507,11.188,473.007,0,461.288,0z"></path>{" "}
                          <path d="M539.586,62.553h-37.954v14.052c0,24.327-18.102,44.117-40.349,44.117h-15.329c-22.247,0-40.349-19.79-40.349-44.117 V62.553H199.916v14.052c0,24.327-18.102,44.117-40.349,44.117h-15.329c-22.248,0-40.349-19.79-40.349-44.117V62.553H70.818 c-21.066,0-38.15,16.017-38.15,35.764v476.318c0,19.784,17.083,35.764,38.15,35.764h468.763c21.085,0,38.149-15.984,38.149-35.764 V98.322C577.735,78.575,560.671,62.553,539.586,62.553z M527.757,557.9l-446.502-0.172V173.717h446.502V557.9z"></path>{" "}
                          <path d="M353.017,266.258h117.428c10.193,0,18.437-10.179,18.437-22.759s-8.248-22.759-18.437-22.759H353.017 c-10.193,0-18.437,10.179-18.437,22.759C334.58,256.074,342.823,266.258,353.017,266.258z"></path>{" "}
                          <path d="M353.017,348.467h117.428c10.193,0,18.437-10.179,18.437-22.759c0-12.579-8.248-22.758-18.437-22.758H353.017 c-10.193,0-18.437,10.179-18.437,22.758C334.58,338.288,342.823,348.467,353.017,348.467z"></path>{" "}
                          <path d="M353.017,430.676h117.428c10.193,0,18.437-10.18,18.437-22.759s-8.248-22.759-18.437-22.759H353.017 c-10.193,0-18.437,10.18-18.437,22.759S342.823,430.676,353.017,430.676z"></path>{" "}
                          <path d="M353.017,512.89h117.428c10.193,0,18.437-10.18,18.437-22.759c0-12.58-8.248-22.759-18.437-22.759H353.017 c-10.193,0-18.437,10.179-18.437,22.759C334.58,502.71,342.823,512.89,353.017,512.89z"></path>{" "}
                          <path d="M145.032,266.258H262.46c10.193,0,18.436-10.179,18.436-22.759s-8.248-22.759-18.436-22.759H145.032 c-10.194,0-18.437,10.179-18.437,22.759C126.596,256.074,134.838,266.258,145.032,266.258z"></path>{" "}
                          <path d="M145.032,348.467H262.46c10.193,0,18.436-10.179,18.436-22.759c0-12.579-8.248-22.758-18.436-22.758H145.032 c-10.194,0-18.437,10.179-18.437,22.758C126.596,338.288,134.838,348.467,145.032,348.467z"></path>{" "}
                          <path d="M145.032,430.676H262.46c10.193,0,18.436-10.18,18.436-22.759s-8.248-22.759-18.436-22.759H145.032 c-10.194,0-18.437,10.18-18.437,22.759S134.838,430.676,145.032,430.676z"></path>{" "}
                          <path d="M145.032,512.89H262.46c10.193,0,18.436-10.18,18.436-22.759c0-12.58-8.248-22.759-18.436-22.759H145.032 c-10.194,0-18.437,10.179-18.437,22.759C126.596,502.71,134.838,512.89,145.032,512.89z"></path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                    <span className="slot_date">
                      {new Date(slot.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="avail_label_success">Available</div>
                </div>

                {/* Row 2 - Time and Duration */}
                <div className="Available_slot_card_row2">
                  <div className="Available_slot_card">
                    <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#6db7d7"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M12 7V12L13.5 14.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#6db7d7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                    <span className="slot_time">{slot.time}</span>
                  </div>
                  <div className="Available_slot_card">
                    <svg
                    width="18px"
                    height="18px"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                        fill="#ffbb03"
                      ></path>{" "}
                      <path
                        d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                        fill="#ffbb03"
                      ></path>{" "}
                    </g>
                  </svg>
                    <span className="slot_duration">60 Mins</span>
                  </div>
                </div>

                {/* Row 3 - Book Button */}
                <div>
                  <button
                    className="Book_slot_btn"
                    onClick={() => handleBookClick(slot)}
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={modalIsOpen_1}
        onRequestClose={closeModal}
        contentLabel="Book Slot Modal"
        style={{
          content: {
            width: "65%",
            height: "40vh",
            backgroundColor: "white",
            position: "relative",
            borderRadius: "10px",
            padding: "25px 30px",
            border: "1px solid blue",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {selectedSlot && (
          <>
            <section className="modal_1_parent">
              <h2 className="modal_1_parent_heading">Complete Your Booking</h2>
              <p className="modal_1_parent_description">
                Fill in your details to reserve your time slot
              </p>
            </section>

            <section className="modal_1_content">
              <form
                onSubmit={(e) => handleInitaiteBooking(selectedSlot, e)}
                className="modal_1_form"
              >
                <label htmlFor="Username">Full Name</label>
                <input
                  required
                  type="text"
                  name="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Name"
                />

                <div style={{ display: "flex", gap: "15px" }}>
                  <button className="Form_cancel_btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="Form_submit_btn">
                    Proceed to Payment
                  </button>
                </div>
              </form>

              <div className="modal_1_booking_details">
                <h2>Booking Information</h2>
                <p>
                  <span>Time:</span> <span>{selectedSlot.time}</span>
                </p>
                <p>
                  <span>Date:</span> <span>{selectedSlot.date}</span>
                </p>
                <p>
                  <span>Duration:</span> <span>60 mins</span>
                </p>
                <p style={{ color: "#d9534f", fontSize: "0.8rem" }}>
                  <strong>Note:</strong> Complete payment within{" "}
                  <strong>3 minutes</strong> or the slot will be released.
                </p>
              </div>
            </section>
          </>
        )}
      </Modal>
    </>
  );
};

export default Home;
