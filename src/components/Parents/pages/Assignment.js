import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_BASE_URL;

const AssignmentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchNotifications = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/Notifications/GetStudentNotifications`, {
        method: "GET",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Assignment Notifications</h2>
      {loading ? (
        <p className="text-gray-700 mt-4">Loading notifications...</p>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-4xl mt-6">
          <table className="w-full border border-gray-300 text-sm text-gray-800">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border p-3">Notification</th>
                <th className="border p-3">Teacher</th>
                <th className="border p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <tr key={notif.notificationId} className="odd:bg-gray-100 even:bg-white hover:bg-blue-100">
                    <td className="border p-3">{notif.message}</td>
                    <td className="border p-3">{notif.name}</td>
                    <td className="border p-3">{new Date(notif.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-3 text-gray-500">No assignment notifications available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentNotifications;
