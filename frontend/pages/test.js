export default function handler(req, res) {
    // Check the request method
    if (req.method === 'GET') {
      // Handle GET request
      console.log('GET request');
      res.status(200).json({ message: 'Hello from Next.js!' });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }