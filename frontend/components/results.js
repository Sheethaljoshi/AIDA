import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const medicalData = {
  firstName: "John",
  lastName: "Joe",
  age: 44,
  height: 181,
  weight: 154,
  sex: "Male",
  medicalHistory: [
    { disease: "Arthritis", severity: 4, probability: 70 },
    { disease: "Asthma", severity: 2, probability: 50 },
    { disease: "Psoriasis", severity: 2, probability: 40 }
  ],
  latestVisit: {
    date: "09/14/24",
    title: "Schizophrenia-Induced Hallucinations",
    symptoms: ["Vomiting", "Headache", "Fatigue"]
  }
};

export default function Results() {
  const [sentimentData, setSentimentData] = useState([]);

  useEffect(() => {
    // simulated sentiment data for the graph
    setSentimentData([
      { name: 'Positive', frequency: 25 },
      { name: 'Negative', frequency: 15 },
      { name: 'Neutral', frequency: 20 },
      { name: 'Surprised', frequency: 10 },
      { name: 'Anxious', frequency: 30 }
    ]);
  }, []);

  const generateMedicalSummary = () => {
    return `
      Patient: ${medicalData.firstName} ${medicalData.lastName}
      Age: ${medicalData.age}
      Height: ${medicalData.height} cm
      Weight: ${medicalData.weight} lbs
      Sex: ${medicalData.sex}

      Medical History:
      ${medicalData.medicalHistory.map(history => `- ${history.disease}: Severity ${history.severity}/5, Probability ${history.probability}%`).join("\n")}

      Latest Visit on ${medicalData.latestVisit.date}:
      Symptoms reported: ${medicalData.latestVisit.symptoms.join(", ")}

      Additional Notes: Further consultation recommended based on recurring symptoms and treatment plan for schizophrenia.
    `;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">Patient Medical Record</h1>

      {/* med summary */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p><strong>Patient:</strong> {medicalData.firstName} {medicalData.lastName}</p>
          <p><strong>Age:</strong> {medicalData.age}</p>
          <p><strong>Height:</strong> {medicalData.height} cm</p>
          <p><strong>Weight:</strong> {medicalData.weight} lbs</p>
          <p><strong>Sex:</strong> {medicalData.sex}</p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Medical History</h2>
        <ul className="text-lg text-gray-700 leading-relaxed list-disc list-inside">
          {medicalData.medicalHistory.map((history, index) => (
            <li key={index}>
              {history.disease}: Severity {history.severity}/5, Probability {history.probability}%
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Latest Visit</h2>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p><strong>Date:</strong> {medicalData.latestVisit.date}</p>
          <p><strong>Symptoms:</strong> {medicalData.latestVisit.symptoms.join(", ")}</p>
          <p className="mt-4"><strong>Additional Notes:</strong> Further consultation recommended based on recurring symptoms and treatment plan for schizophrenia.</p>
        </div>
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
