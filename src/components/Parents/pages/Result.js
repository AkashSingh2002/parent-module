import { useState } from "react";

function ResultComponent() {
  const [year, setYear] = useState("2024-2025");
  const [classSelected, setClassSelected] = useState("");
  const [section, setSection] = useState("");
  const [data, setData] = useState(null);

  const handleGetResult = () => {
    // Simulating API call with sample data
    setData([
      {
        rollNo: 2,
        name: "Jasmine",
        totalMarks: 1088,
        obtainedMarks: 732,
        grade: "B",
      },
      {
        rollNo: 1,
        name: "RAGHAV KUMAR",
        totalMarks: 1228,
        obtainedMarks: 978,
        grade: "B+",
      },
      {
        rollNo: 3,
        name: "Test Admission 1",
        totalMarks: 80,
        obtainedMarks: 45,
        grade: "C",
      },
    ]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-6">
      <h4 className="text-xl font-semibold mb-4">Generated Result</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>2024-2025</option>
            <option>2023-2024</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Class</label>
          <select
            value={classSelected}
            onChange={(e) => setClassSelected(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Class</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section</label>
          <select
            value={section}
            disabled
            className="w-full border-gray-300 rounded-lg p-2 bg-gray-200 cursor-not-allowed"
          >
            <option>Select Section</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleGetResult}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Get Result
        </button>
      </div>

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
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="border p-2 text-center">{student.rollNo}</td>
                  <td className="border p-2 text-center">{student.name}</td>
                  <td className="border p-2 text-center">{student.totalMarks}</td>
                  <td className="border p-2 text-center">{student.obtainedMarks}</td>
                  <td className="border p-2 text-center">{student.grade}</td>
                  <td className="border p-2 text-center">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => window.print()} // Simulating print functionality
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResultComponent;
