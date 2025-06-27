import mongoose from 'mongoose';

const MonitoringResultSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MonitoredSite',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  result: {
    uptime: { type: Boolean, required: true },
    loadTime: { type: Number, required: true },
    sslValid: { type: Boolean, required: true },
  },
  participatingValidators: [
    {
      type: String, // Storing public keys as strings
    },
  ],
});

const MonitoringResult = mongoose.model('MonitoringResult', MonitoringResultSchema);
export default MonitoringResult;