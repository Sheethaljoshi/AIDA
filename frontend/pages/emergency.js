export default function Emergency() {
  return (
    <div className="max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Emergency Alert System</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Emergency Contacts</h2>
        <ul className="space-y-2">
          <li><strong>Emergency Services:</strong> 911</li>
          <li><strong>Poison Control:</strong> 1-800-222-1222</li>
          <li><strong>Crisis Helpline:</strong> 1-800-273-8255</li>
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-400">Nearby Hospitals</h2>
        <p className="mb-4">Use the map below to find nearby hospitals and urgent care centers:</p>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d96714.68291250926!2d-74.05953969406828!3d40.75468158321536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shospitals!5e0!3m2!1sen!2sus!4v1617902138404!5m2!1sen!2sus"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
