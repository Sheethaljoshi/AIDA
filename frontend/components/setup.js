import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SetupForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    medicalHistory: '',
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // send data to backend
    localStorage.setItem('userProfile', JSON.stringify(formData))
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
      <textarea
        name="medicalHistory"
        placeholder="Brief Medical History"
        value={formData.medicalHistory}
        onChange={handleChange}
        className="input mb-4"
        rows="4"
      ></textarea>
      <button type="submit" className="btn btn-primary w-full">
        Save Profile
      </button>
    </form>
  )
}
