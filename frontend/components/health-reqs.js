export default function HealthRecommendations() {
    const recommendations = [
      { id: 1, title: 'Exercise regularly', description: 'Aim for at least 30 minutes of moderate exercise daily.' },
      { id: 2, title: 'Stay hydrated', description: 'Drink at least 8 glasses of water per day.' },
      { id: 3, title: 'Get enough sleep', description: 'Aim for 7-9 hours of sleep each night.' },
    ]
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Health Recommendations</h2>
        <ul className="space-y-2">
          {recommendations.map(rec => (
            <li key={rec.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{rec.title}</h3>
              <p>{rec.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  