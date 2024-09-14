import { useState } from 'react'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [assessment, setAssessment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // AI backend?
    setAssessment("Based on the symptoms you've described, it's recommended to consult with a healthcare professional for a proper diagnosis. In the meantime, rest and stay hydrated.")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Symptom Checker</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="symptoms" className="block text-gray-700 font-semibold mb-2">
            Describe your symptoms:
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="E.g., headache, fever, cough..."
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Check Symptoms
        </button>
      </form>
      {assessment && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Assessment</h2>
          <p className="text-gray-700">{assessment}</p>
        </div>
      )}
    </div>
  )
}