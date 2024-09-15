import { useState } from 'react';

export default function SetupForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    sex: '',
    medicalHistory: [{ disease: '', severity: '', probability: '' }],
  });
  const [formSubmitted, setFormSubmitted] = useState(false); // New state to track submission status

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicalHistoryChange = (index, field, value) => {
    const updatedMedicalHistory = [...formData.medicalHistory];
    updatedMedicalHistory[index][field] = value;
    setFormData({ ...formData, medicalHistory: updatedMedicalHistory });
  };

  const addMedicalHistory = () => {
    setFormData({
      ...formData,
      medicalHistory: [...formData.medicalHistory, { disease: '', severity: '', probability: '' }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format the data to match the backend structure
    const formattedData = {
      ...formData,
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ')[1],
      basic_info: {
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        sex: formData.sex,
      },
    };
    localStorage.setItem('userProfile', JSON.stringify(formattedData));
    
    // Set form submission success state
    setFormSubmitted(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-gray-100 rounded-md shadow-md">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />

        {/* sex selection */}
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        >
          <option value="" disabled>Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Intersex</option>
        </select>

        {/* medical history section */}
        <h3 className="text-lg font-semibold mb-2">Medical History</h3>
        {formData.medicalHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Disease"
              value={entry.disease}
              onChange={(e) => handleMedicalHistoryChange(index, 'disease', e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Severity (1-5)"
              value={entry.severity}
              onChange={(e) => handleMedicalHistoryChange(index, 'severity', e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Probability (%)"
              value={entry.probability}
              onChange={(e) => handleMedicalHistoryChange(index, 'probability', e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="button"
          className="w-full bg-gray-500 text-white py-2 px-4 mb-4 rounded-md hover:bg-gray-600"
          onClick={addMedicalHistory}
        >
          Add Another Disease
        </button>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Save Profile
        </button>
      </form>

      {/* Success message */}
      {formSubmitted && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md shadow-md">
          <p>Profile information has been successfully saved!</p>
        </div>
      )}
    </div>
  );
}
