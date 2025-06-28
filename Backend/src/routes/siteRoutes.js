import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import MonitoredSite from '../models/MonitoredSite.js'; // Import the MonitoredSite model
import MonitoringResult from '../models/MonitoringResult.js'; // Import the MonitoredSite model

const router = express.Router();

// @route   POST /api/sites/add
// @desc    Add a new site to monitor
// @access  Private (requires JWT)
router.post('/add', authMiddleware, async (req, res) => {
    const { url, name } = req.body;

    // Basic validation
    if (!url || !name) {
        return res.status(400).json({ msg: 'Please provide a URL and a name' });
    }

    try {
        // Create a new MonitoredSite document
        const newSite = new MonitoredSite({
            ownerId: req.user.id, // Get user ID from the authMiddleware
            url,
            name,
        });

        // Save the site to the database
        const site = await newSite.save();

        // Return the newly created site object
        res.json(site);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/sites
// @desc    Get all sites for a logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find all MonitoredSite documents where ownerId matches the logged-in user
        const sites = await MonitoredSite.find({ ownerId: req.user.id }).sort({ createdAt: -1 });

        // Return the list of sites
        res.json(sites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/sites/sitesdata/:siteId
// @desc    Get a single site for a user with recent monitoring data and stats
// @access  Private
router.get('/sitesdata/:siteId', authMiddleware, async (req, res) => {
    try {
        // 1. Find the specific site owned by the logged-in user.
        const site = await MonitoredSite.findOne({
            _id: req.params.siteId,
            ownerId: req.user.id,
        }).lean();

        if (!site) {
            return res.status(404).json({ msg: 'Site not found' });
        }

        // 2. Fetch the last 10 monitoring results for the site.
        const results = await MonitoringResult.find({ siteId: site._id })
            .sort({ timestamp: -1 }) // Get the most recent results
            .limit(10)
            .lean(); // Use .lean() for better performance

        // Initialize containers for the processed data.
        const uptime = [];
        const loadTime = [];
        const sslValid = [];
        let upCount = 0;
        let totalLoadTime = 0;

        // 3. Process each of the 10 monitoring results.
        for (const result of results) {
            uptime.push(result.result.uptime);
            loadTime.push(result.result.loadTime);
            sslValid.push(result.result.sslValid);

            if (result.result.uptime) {
                upCount++;
            }
            totalLoadTime += result.result.loadTime;
        }

        // The data was fetched in reverse chronological order (newest first).
        // We reverse it back to chronological order (oldest first) which is better for charting.
        uptime.reverse();
        loadTime.reverse();
        sslValid.reverse();
        // Create a chronologically ordered copy of the full results for the response.
        const chronologicalResults = [...results].reverse();

        // ========================= CONSISTENT LOGIC START =========================
        const desiredLength = 10;
        while (uptime.length < desiredLength) {
            uptime.unshift(null);
            loadTime.unshift(null);
            sslValid.unshift(null);
        }
        // ========================== CONSISTENT LOGIC END ==========================

        // 4. Calculate averages.
        const averageLoadTime = results.length > 0 ? totalLoadTime / results.length : 9999;
        const averageUptime = results.length > 0 ? (upCount / results.length) * 100 : 0;

        // 5. Combine the original site info with the new monitoring data and stats.
        const siteWithData = {
            ...site,
            monitoringData: {
                uptime,
                loadTime,
                sslValid,
                averageUptime: parseFloat(averageUptime.toFixed(2)),
                averageLoadTime: parseFloat(averageLoadTime.toFixed(2)),
                // [NEW] Add the full, chronologically-ordered monitoring results.
                results: chronologicalResults,
            },
        };

        res.json(siteWithData);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Site not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/sites/sitesdata
// @desc    Get all sites for a user with recent monitoring data and stats
// @access  Private
router.get('/sitesdata', authMiddleware, async (req, res) => {
    try {
        // 1. Find all sites owned by the logged-in user.
        // We use .lean() to get plain JavaScript objects, which is more performant
        // and makes it easier to add the aggregated data.
        const sites = await MonitoredSite.find({ ownerId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        // 2. Concurrently fetch and process monitoring data for each site.
        const sitesWithData = await Promise.all(
            sites.map(async (site) => {
                // Fetch the last 10 monitoring results for the current site.
                const results = await MonitoringResult.find({ siteId: site._id })
                    .sort({ timestamp: -1 }) // Get the most recent results
                    .limit(10);

                // Initialize containers for the processed data.
                const uptime = [];
                const loadTime = [];
                const sslValid = [];
                let upCount = 0;
                let totalLoadTime = 0;

                // 3. Process each of the 10 monitoring results.
                for (const result of results) {
                    uptime.push(result.result.uptime);
                    loadTime.push(result.result.loadTime);
                    sslValid.push(result.result.sslValid);

                    if (result.result.uptime) {
                        upCount++;
                    }
                    totalLoadTime += result.result.loadTime;
                }

                // The data was fetched in reverse chronological order (newest first).
                // We reverse it back to chronological order (oldest first) which is better for charting.
                uptime.reverse();
                loadTime.reverse();
                sslValid.reverse();

                // ========================= NEW LOGIC START =========================
                // If there are fewer than 10 results, pad the beginning of the arrays with 'null'.
                // This ensures the arrays always have a length of 10 for consistent charting,
                // representing the empty slots before the first data point was recorded.
                const desiredLength = 10;
                while (uptime.length < desiredLength) {
                    // .unshift() adds an element to the beginning of the array.
                    uptime.unshift(null);
                    loadTime.unshift(null);
                    sslValid.unshift(null);
                }
                // ========================== NEW LOGIC END ==========================

                // 4. Calculate averages, handling the case of zero results to prevent division by zero.
                // NOTE: This calculation correctly uses 'results.length' (the actual number of data points)
                // and is not affected by the null padding.
                const averageLoadTime = results.length > 0 ? totalLoadTime / results.length : 9999;
                const averageUptime = results.length > 0 ? (upCount / results.length) * 100 : 0;

                // 5. Combine the original site info with the new monitoring data and stats.
                return {
                    ...site,
                    monitoringData: {
                        uptime,
                        loadTime,
                        sslValid,
                        // Format averages to two decimal places for a clean API response.
                        averageUptime: parseFloat(averageUptime.toFixed(2)),
                        averageLoadTime: parseFloat(averageLoadTime.toFixed(2)),
                    },
                };
            })
        );

        res.json(sitesWithData);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;