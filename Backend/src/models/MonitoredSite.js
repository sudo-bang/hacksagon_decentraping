import mongoose from 'mongoose';

const MonitoredSiteSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastStatus: { type: String, default: 'PENDING' }, // PENDING, UP, DOWN
  lastChecked: { type: Date, default: null },
  notifyByEmail: { type: Boolean, default: true },
  notifyBySms: { type: Boolean, default: true }, // For WhatsApp
  createdAt: { type: Date, default: Date.now },
});

const MonitoredSite = mongoose.model('MonitoredSite', MonitoredSiteSchema);
export default MonitoredSite;