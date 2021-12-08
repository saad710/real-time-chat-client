import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from "react";

import axios from "axios";
import { io } from "socket.io-client";
import { LoginContext } from "../../context/LoginProvider";

export default function Messenger() {

  const history = useHistory()
  const { userData,setUserData } = useContext(LoginContext);
 
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  console.log(messages)
  const [newMessage, setNewMessage] = useState("");
  console.log(newMessage)
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  
  

  async function populateQuote() {
		const req = await fetch('http://localhost:8800/api/auth/me', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		console.log(data)
		if (data) {
		
			setUserData(data)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				populateQuote()
			}
		}
	}, [])

  // console.log(userData._id)
  const scrollRef = useRef();

 
 

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    console.log(socket.current)
    socket.current.on("getMessage", (data) => {
      console.log(data)
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  console.log(arrivalMessage)

  console.log(socket)

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  console.log(currentChat)

  useEffect(() => {
    socket.current.emit("addUser", userData._id);
    socket.current.on("getUsers", (users) => {
      console.log(users)
      setOnlineUsers(
        userData?.followings?.filter((f) => users?.some((u) => u.userId === f))
      );
    });
  }, [userData]);
  console.log(onlineUsers)

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/conversations/${userData._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userData._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);
        console.log(res.data)
        setMessages(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userData._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat?.members.find(
      (member) => member !== userData._id
    );

    socket.current.emit("sendMessage", {
      senderId: userData._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:8800/api/messages", message);
      console.log(res.data)
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(conversations)

  return (
    <>
    {/* <h1>messenger page</h1> */}
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={userData} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === userData._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={userData._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
