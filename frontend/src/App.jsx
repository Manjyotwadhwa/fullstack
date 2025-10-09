import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [orderUpdates, setOrderUpdates] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("orderStatusUpdate", (update) =>
      setOrderUpdates((prev) => [...prev, `${update.orderId}: ${update.status}`])
    );

    return () => {
      socket.off("chatMessage");
      socket.off("orderStatusUpdate");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("chatMessage", newMessage);
      setNewMessage("");
    }
  };

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <ToastContainer />
      <Navbar setShowLogin={setShowLogin} />

      <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
        <h3>💬 Real-time Chat</h3>
        <div style={{ maxHeight: "150px", overflowY: "auto", marginBottom: "10px" }}>
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>

        <h3>📦 Order Updates</h3>
        <ul>
          {orderUpdates.map((update, idx) => (
            <li key={idx}>{update}</li>
          ))}
        </ul>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;

