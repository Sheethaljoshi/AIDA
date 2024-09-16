import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Results() {
  const [userData, setUserData] = useState(null);
  const [sentimentData, setSentimentData] = useState([]);

  useEffect(() => {
    // getEmotionsAvgs()
    // Retrieve the user profile from localStorage
    const storedUserData = localStorage.getItem('userProfile');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Simulate sentiment data for the graph
    setSentimentData([
      { name: 'Positive', frequency: 13.78 },
      { name: 'Negative', frequency: 21.36 },
      { name: 'Neutral', frequency: 20 },
      { name: 'Surprised', frequency: 10 },
      { name: 'Anxious', frequency: 30 }
    ]);
  }, []);

  const getEmotionsAvgs = () => {
    fetch('http://127.0.0.1:8000/avgs')
      .then(response => response.json())
      .then(data => setSentimentData([
        { name: 'Anger', frequency: data['Anger'] },
        { name: 'Anxiety', frequency: data['Anxiety'] },
        { name: 'Distress', frequency: data['Distress'] },
        { name: 'Horror', frequency: data['Horror'] },
        { name: 'Pain', frequency: data['Pain'] },
      ]))
    
  }

  const generateMedicalSummary = () => {
    if (!userData) return '';
    return `
      Patient: ${userData.first_name} ${userData.last_name}
      Age: ${userData.basic_info.age}
      Height: ${userData.basic_info.height} cm
      Weight: ${userData.basic_info.weight} lbs
      Sex: ${userData.basic_info.sex}

      Medical History:
      ${userData.medicalHistory.map(history => `- ${history.disease}: Severity ${history.severity}/5, Probability ${history.probability}%`).join("\n")}

      Latest Visit: Please see symptoms and recommendations from your recent checkups.
    `;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Patient Medical Record</h1>

      {/* med summary */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
        {userData ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
            <div className="text-lg text-gray-700 leading-relaxed">
              <p><strong>Patient:</strong> {userData.first_name} {userData.last_name}</p>
              <p><strong>Age:</strong> {userData.basic_info.age}</p>
              <p><strong>Height:</strong> {userData.basic_info.height} cm</p>
              <p><strong>Weight:</strong> {userData.basic_info.weight} lbs</p>
              <p><strong>Sex:</strong> {userData.basic_info.sex}</p>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-4">Medical History</h2>
            <ul className="text-lg text-gray-700 leading-relaxed list-disc list-inside">
              {userData.medicalHistory.map((history, index) => (
                <li key={index}>
                  {history.disease}: Severity {history.severity}/5, Probability {history.probability}%
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading medical data...</p>
        )}
      </div>

      {/* sentiment chart */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Sentiment Analysis Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="frequency" fill="#1D4ED8" />
        </BarChart>
      </ResponsiveContainer>

      {/* ex doctor submission button */}
      <button
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition duration-300"
        onClick={() => alert(generateMedicalSummary())}
      >
        Send to Doctor
      </button>
    </div>
  );
}
