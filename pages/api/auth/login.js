export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Mock credentials check
    const validEmail = 'admin@example.com';
    const validPassword = 'admin123';

    if (email === validEmail && password === validPassword) {
      const token = 'mock-jwt-token-123456';
      return res.status(200).json({ token, message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}