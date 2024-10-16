import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );
  const [conversation, setConversation] = useState([]);
  const [messages, setMessages] = useState({ chats: [], username: "" });
  const [sender_msg, setSender_msg] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const messageEndRef = useRef(null);

  // Login notification
  useEffect(() => {
    const isFirstLogin = localStorage.getItem("firstLogin");
    if (user?.id && isFirstLogin) {
      toast.success("Logged in successfully!");
      localStorage.removeItem("firstLogin");
    }
  }, [user?.id]);

  // Logout Function
  const handleLogout = async () => {
    try {
      const url = `https://serverapi-2.vercel.app/api/logout/${user.id}`;
      const response = await axios.post(url);
      if (response.data.message === "log out sucessfully") {
        // Clear user data from local storage
        localStorage.removeItem("user:token");
        localStorage.removeItem("user:detail");
        localStorage.setItem("logout", "3242");
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // Initialize socket connection
  const socket = useMemo(() => io("https://serverapi-2.vercel.app/user-namespace"), []);

  useEffect(() => {
    if (user?.id) {
      socket.emit("adduser", user.id);
      socket.on("getUser", (users) => {
        console.log(users, "active");
      });

      socket.on("getMessage", (data) => {
        setMessages((prev) => ({
          ...prev,
          chats: [...prev.chats, { user: data.user, message: data.message }],
        }));
      });
    }
  }, [socket, user?.id]);

  // Fetch conversation list
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const url = `https://serverapi-2.vercel.app/api/get-conversation/${user.id}`;
        const response = await axios.get(url);
        setConversation(response.data);
      } catch (error) {
        console.error("Error fetching conversations", error);
      }
    };
    fetchConversation();
  }, [user.id]);

  // Fetch messages for a selected conversation
  const fetchMessage = async (conversation_id, users) => {
    try {
      const url = `https://serverapi-2.vercel.app/api/get-message/${conversation_id}`;
      const response = await axios.get(url);
      setMessages({
        chats: response.data,
        username: users.name,
        id: users.id,
        conv_id: conversation_id,
      });
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  // Send message function
  const sendMessage = async () => {
    try {
      if (!sender_msg.trim()) return;
      socket.emit("sendMessage", {
        sender_id: user.id,
        conversation_id: messages.conv_id,
        message: sender_msg,
        reciver_id: messages.id,
      });

      const url = `https://serverapi-2.vercel.app/api/save-message/`;
      const payload = {
        sender_id: user.id,
        conversation_id: messages.conv_id,
        message: sender_msg,
        reciver_id: messages.id,
      };
      const response = await axios.post(url, payload);
      if (response) {
        setSender_msg("");
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.chats]);

 return (
    <div className="container">
      <ToastContainer
        className="toast-container-center"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="chatlisting">
        <div className="chat">
          <div className="search_chat">
            <div style={{ display: "flex" }}>
              <h1 className="mt-2 text-3xl font-semibold">Chats</h1>
              <div
                style={{
                  fontSize: "larger",
                  marginLeft: "160px",
                  marginTop: "8px",
                }}
              >
                <h2
                  className="cursor-pointer flex items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <i className="fa-solid fa-user"></i>&nbsp; {user.name}
                </h2>
                {showDropdown && (
                  <div className="z-10 absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <i className="fa-solid fa-arrow-right-from-bracket"></i>
                          &nbsp; Logout
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <Link to={"/users"}>
                            <i className="fa-solid fa-user-plus"> &nbsp;</i>Add
                            Friends
                          </Link>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <form className="example">
              <button type="submit">
                <i className="fa fa-search"></i>
              </button>
              <input
                type="text"
                placeholder="Search or start a new chat"
                name="search2"
              />
            </form>
          </div>
        </div>

        <div className="chat_div">
          {conversation.length > 0 ? (
            conversation.map(({ users, conversation_id }) => (
              <div
                key={conversation_id}
                onClick={() => fetchMessage(conversation_id, users)}
                className="chat_profile cursor-pointer"
              >
                <div className="dp">
                  <img src="peakpx (1).jpg" alt="dp" />
                </div>
                <div className="user_name">
                  <h4>{users.name}</h4>
                  <p className="message_preview">{users.email}</p>
                </div>
              </div>
            ))
          ) : (
            "No conversations are available"
          )}
        </div>
      </div>

      <div className="chatHelper_utility">
        <div className="name_section dp1">
          <img src="peakpx (1).jpg" alt="" />
          <h4>{messages.username || "sonu chaudhary"}</h4>
        </div>

        <div className="message_box" style={{
            backgroundImage: 'url("1.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }} >
          {messages.chats.length > 0 ? (
            messages.chats.map(({ message, user: { id } }, index) =>
              id === user.id ? (
                <div key={`msg-${index}-${id}`} className="mesaage_packet">
                  <p className="msg">{message}</p>
                </div>
              ) : (
                <div key={`msg-${index}-${id}`} className="mesaage_packet1">
                  <p className="msg1">{message}</p>
                </div>
              )
            )
          ) : (
            <div className="flex justify-center items-center">
              No messages available
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        {messages.username && (
          <div className="Send_message">
            <input
              onChange={(e) => setSenderMsg(e.target.value)}
              value={senderMsg}
              placeholder="Type To Chat..."
              type="text"
              name="Send_message"
              id="message"
            />
            <button type="button" onClick={sendMessage}>
              Send{" "}
              <i
                className="fa-solid fa-arrow-right"
                style={{ fontSize: "large" }}
              ></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
