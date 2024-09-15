import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SetupForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    sex: '',
    medicalHistory: [{ disease: '', severity: '', probability: '' }],
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleMedicalHistoryChange = (index, field, value) => {
    const updatedMedicalHistory = [...formData.medicalHistory]
    updatedMedicalHistory[index][field] = value
    setFormData({ ...formData, medicalHistory: updatedMedicalHistory })
  }

  const addMedicalHistory = () => {
    setFormData({
      ...formData,
      medicalHistory: [...formData.medicalHistory, { disease: '', severity: '', probability: '' }]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // format the data to match the backend structure
    const formattedData = {
      ...formData,
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ')[1],
      basic_info: {
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        sex: formData.sex
      },
    }
    localStorage.setItem('userProfile', JSON.stringify(formattedData))
    router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="input mb-4"
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="input mb-4"
        required
      />
      <input
        type="number"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        className="input mb-4"
        required
      />
      <input
        type="number"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        className="input mb-4"
        required
      />

      {/* sex selection */}
      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className="input mb-4"
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
            className="input mb-2"
            required
          />
          <input
            type="number"
            placeholder="Severity (1-5)"
            value={entry.severity}
            onChange={(e) => handleMedicalHistoryChange(index, 'severity', e.target.value)}
            className="input mb-2"
            required
          />
          <input
            type="number"
            placeholder="Probability (%)"
            value={entry.probability}
            onChange={(e) => handleMedicalHistoryChange(index, 'probability', e.target.value)}
            className="input"
            required
          />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary w-full mb-4"
        onClick={addMedicalHistory}
      >
        Add Another Disease
      </button>

      <button type="submit" className="btn btn-primary w-full">
        Save Profile
      </button>
    </form>
  )
}
