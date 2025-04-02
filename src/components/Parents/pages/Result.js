import { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

function ResultComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetResult = async () => {
    setLoading(true);
    setError(null);
    const token = sessionStorage.getItem("token");
    const classId = sessionStorage.getItem("classId");
    const sectionId = sessionStorage.getItem("sectionId");

    try {
      const response = await axios.post(
        `${API_URL}/Result/GetResult`,
        {
          examTypeId: 0,
          classid: classId,
          sectionId: sectionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${token}`,
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-6">
      <h4 className="text-xl font-semibold mb-4">Generated Result</h4>
      <button
        onClick={handleGetResult}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Result"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
          <h6 className="text-lg font-semibold mb-4">Result Data</h6>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-center">Roll No</th>
                <th className="border p-2 text-center">Student Name</th>
                <th className="border p-2 text-center">Total Marks</th>
                <th className="border p-2 text-center">Obtained Marks</th>
                <th className="border p-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                <tr className="border-b">
                  <td className="border p-2 text-center">{data.rollNo}</td>
                  <td className="border p-2 text-center">{data.name}</td>
                  <td className="border p-2 text-center">{data.totalMarks}</td>
                  <td className="border p-2 text-center">{data.obtainedMarks}</td>
                  <td className="border p-2 text-center">{data.grade}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="5" className="border p-2 text-center">
                    No record available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResultComponent;
