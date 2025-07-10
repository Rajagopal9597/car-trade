import { listings } from '../../../lib/mockData';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;

    let filteredListings = listings;
    if (status) {
      filteredListings = listings.filter((listing) => listing.status === status);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedListings = filteredListings.slice(start, end);

    return res.status(200).json({
      listings: paginatedListings,
      total: filteredListings.length,
      page,
      totalPages: Math.ceil(filteredListings.length / limit),
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}