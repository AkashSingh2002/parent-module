import { useState, useEffect, useRef } from "react";
import { FiSend, FiTrash2, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

const API_URL = process.env.REACT_APP_BASE_URL;

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const messagesEndRef = useRef(null);

  const employeeId = sessionStorage.getItem("employeeId") || "";
  const classId = sessionStorage.getItem("classId") || "";
  const sectionId = sessionStorage.getItem("sectionId") || "";
  const authToken = sessionStorage.getItem("token") || "YOUR_AUTH_TOKEN";

  // Fetch messages when chat starts and poll every 10 seconds
  useEffect(() => {
    if (chatStarted) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [chatStarted]);

  // Scroll to bottom when messages change
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const parseCustomDate = (dateStr) => {
    if (!dateStr) return new Date(); // Fallback to current date if dateStr is missing

    // Example format: "Mar 21 2025  4:57:57:577AM"
    const regex = /^([A-Za-z]+) (\d{1,2}) (\d{4})\s+(\d{1,2}):(\d{2}):(\d{2}):(\d{3})(AM|PM)?$/;
    const match = dateStr.match(regex);

    if (!match) return new Date(); // Fallback if format is invalid

    const [, month, day, year, hour, minute, second, millisecond, period] = match;

    // Convert month name to number (0-11)
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const monthNumber = monthMap[month];

    // Convert to 24-hour format
    let hour24 = parseInt(hour, 10);
    if (period) {
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;
    }

    return new Date(
      parseInt(year, 10),
      monthNumber,
      parseInt(day, 10),
      hour24,
      parseInt(minute, 10),
      parseInt(second, 10),
      parseInt(millisecond, 10)
    );
  };

  // Format date string in the server format
  const formatCustomDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${month} ${day} ${year} ${hour12}:${minutes}:${seconds}:${milliseconds}${ampm}`;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = parseCustomDate(dateStr);

    // Handle invalid dates
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateStr);
      return "Invalid Date";
    }

    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Process and sort messages chronologically by date
  const processMessages = (allMessages) => {
    // Get timestamp for each message (sent or received date)
    const processedMessages = allMessages.map(msg => {
      // Use the appropriate date field based on message direction
      const timestamp = msg.direction === "Sent" ? msg.sentDate : msg.receivedDate;

      return {
        ...msg,
        isSent: msg.direction === "Sent" || msg.isSent === true,
        timestamp: timestamp
      };
    });

    // Sort by timestamp (strictly chronological, regardless of sent/received)
    return [...processedMessages].sort((a, b) => {
      const timeA = parseCustomDate(a.timestamp || a.sentDate || a.receivedDate);
      const timeB = parseCustomDate(b.timestamp || b.sentDate || b.receivedDate);
      return timeA - timeB;
    });
  };

  // Fetch messages from the API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const payload = {
        empId: employeeId,
        classId,
        sectionId,
      };
      if (recipientId) {
        payload.recipientId = recipientId;
      }
      const response = await fetch(
        `${API_URL}/Chats/GetMessages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
        const recipientName = data.receivedMessages?.[0]?.recipientName;
        if (recipientName) {
          setRecipientName(recipientName);
        }
        const recipientID = data.sentMessages?.[0]?.recipientId;
        if (recipientID) {
          setRecipientId(recipientID);
          
        }
        console.log("API Response:", data);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        setError("Invalid response format from server");
        return;
      }
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      // Combine sent and received messages with proper direction labels
      const allMessages = [
        ...(data.sentMessages || []).map(msg => ({
          ...msg,
          direction: "Sent",
          isSent: true,
          timestamp: msg.sentDate
        })),
        ...(data.receivedMessages || []).map(msg => ({
          ...msg,
          direction: "Received",
          isSent: false,
          timestamp: msg.receivedDate
        }))
      ];

      console.log("Combined Messages (Before Processing):", allMessages);

      // Process and sort the messages chronologically
      const processedMessages = processMessages(allMessages);

      console.log("Processed Messages:", processedMessages);

      // Filter out temporary messages that now exist in the API response
      const finalMessages = processedMessages.filter(msg => {
        if (msg.temp) {
          // Check if this temp message is now in the API response (based on text)
          const exists = processedMessages.some(
            apiMsg => !apiMsg.temp && apiMsg.messageText === msg.messageText && apiMsg.direction === "Sent"
          );
          return !exists; // Keep only if it doesn't exist in API response
        }
        return true; // Keep all non-temp messages
      });

      setApiResponse(data);
      setMessages(finalMessages);
      markMessagesAsRead(); 
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(`Failed to load messages: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to mark messages as read
const markMessagesAsRead = async () => {
  try {
    const payload = { empId: employeeId };

    const response = await fetch(`${API_URL}/Chats/ReadMessage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark messages as read: ${response.status}`);
    }

    console.log("Messages marked as read successfully");
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

  // Send a new message
  const sendMessage = async () => {
    const recipientIdString = recipientId ? String(recipientId).trim() : "";

    // Create a new Date and format it in the same format as server
    const now = new Date();
    const formattedDate = formatCustomDate(now);

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      messageId: tempId,
      isSent: true,
      direction: "Sent",
      messageText: input,
      sentDate: formattedDate,
      timestamp: formattedDate,
      senderName: "You",
      temp: true,
    };

    // Add the message and process all messages
    setMessages(prevMessages => {
      return processMessages([...prevMessages, newMessage]);
    });

    const currentInput = input;
    setInput("");

    try {
      const data = {
        senderId: employeeId,
        recipientId,
        classId,
        sectionId,
        messageText: currentInput,
      };
      const response = await fetch(
        `${API_URL}/Chats/SendMessageFromParents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      // Mark the message as sent
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.messageId === tempId ? { ...msg, temp: false, sent: true } : msg
        )
      );

      // Fetch updated messages after a short delay
      setTimeout(fetchMessages, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      // Mark message as failed
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.messageId === tempId ? { ...msg, failed: true } : msg
        )
      );
    }
  };

  // Handle Enter key for sending messages
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Exit the chat
  const exitChat = () => {
    setChatStarted(false);
    setMessages([]);
    setApiResponse(null);
  };

  // Manually refresh messages
  const manualRefresh = () => {
    fetchMessages();
  };

  // Delete a message
  const deleteMessage = async (index, message) => {
    setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));

    if (message.temp) return; // Skip API call for unsent messages

    try {
      const response = await fetch(
        `${API_URL}/Chats/${message.messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete message");

      fetchMessages(); // Refresh messages after deletion
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }
    , []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md h-full max-h-[600px] flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* {!chatStarted ? (
          <div className="p-6 bg-gray-700 flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4">Start a New Chat</h2>
            <input
              type="text"
              className="w-full p-3 bg-gray-600 text-white rounded-lg outline-none"
              placeholder="Enter teacher's employee ID..."
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => {
                if (recipientId.trim()) {
                  setChatStarted(true);
                  fetchMessages();
                }
              }}
              className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
          </div>
        ) : ( */}
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
            <div className="flex items-center">
              <button
                onClick={exitChat}
                className="p-2 mr-2 rounded-full hover:bg-gray-600"
                aria-label="Go back"
              >
                <FiArrowLeft />
              </button>
              <div>
                <h3 className="font-medium">Chat with Teacher</h3>
                <p className="text-sm text-gray-400">Name: {recipientName || "Teacher"}</p>
              </div>
            </div>
            <button
              onClick={manualRefresh}
              className="p-2 rounded-full hover:bg-gray-600"
              aria-label="Refresh messages"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && messages.length === 0 && (
              <div className="flex justify-center py-4">
                <div className="animate-pulse text-gray-400">Loading messages...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-500 text-white p-2 rounded mb-2">
                {error}
              </div>
            )}

            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isSent = msg.direction === "Sent" || msg.isSent === true;
                const messageText = msg.messageText || "No text";
                const senderName = isSent ? "You" : (msg.senderName || "Teacher");
                const timestamp = msg.timestamp || msg.sentDate || msg.receivedDate;
                const formattedTime = timestamp ? formatDate(timestamp) : "Time unknown";

                return (
                  <div
                    key={`${msg.messageId}-${index}`}
                    className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-start max-w-xs lg:max-w-md">
                      <div
                        className={`p-3 rounded-lg ${isSent ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
                          } ${msg.failed ? "opacity-50" : ""}`}
                      >
                        <p>{messageText}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 px-1 flex items-center space-x-2">
                      <span>{senderName}</span>

                      {/* Status messages */}
                      {msg.failed && <span className="text-red-400">Failed to send</span>}
                      {msg.temp && !msg.failed && <span className="text-blue-400">Sending...</span>}

                      {/* Timestamp */}
                      <span>{formattedTime}</span>

                      {/* Delete Button */}
                      {isSent && (
                        <button
                          onClick={() => deleteMessage(index, msg)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete message"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p className="text-gray-400 text-center py-6">No messages yet. Start the conversation!</p>
              </div>
            )}

            {/* Auto-scroll to latest message */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex items-center p-3 bg-gray-700 border-t border-gray-600">
            <input
              type="text"
              className="flex-1 p-3 bg-gray-600 text-white rounded-lg outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="ml-2 p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend className="text-white" size={18} />
            </button>
          </div>
        </>

      </div>
    </div>
  );
}