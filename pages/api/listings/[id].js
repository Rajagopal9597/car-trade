import { listings, updateListing, addAuditLog } from '../../../lib/mockData';

export default function handler(req, res) {
  const { id } = req.query;
  const listingId = parseInt(id);

  if (req.method === 'PUT') {
    const { action, carModel, price } = req.body;

    // Mock admin email (in a real app, get from auth session)
    const adminEmail = 'admin@example.com';

    if (action === 'approve') {
      updateListing(listingId, { status: 'approved' });
      addAuditLog('approve', listingId, adminEmail);
      return res.status(200).json({ message: 'Listing approved' });
    } else if (action === 'reject') {
      updateListing(listingId, { status: 'rejected' });
      addAuditLog('reject', listingId, adminEmail);
      return res.status(200).json({ message: 'Listing rejected' });
    } else if (action === 'edit') {
      updateListing(listingId, { carModel, price });
      addAuditLog('edit', listingId, adminEmail);
      return res.status(200).json({ message: 'Listing updated' });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}