/* eslint-env node */
const express = require("express");
const Event = require("../models/Events");
const { upload, uploadToCloudinary } = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/events
// Accepts multipart/form-data with optional 'banner' file, parses text fields via multer
router.post("/", protect, (req, res, next) => {
  const singleUpload = upload.single('banner');
  singleUpload(req, res, function (err) {
    if (err) {
      const message = err.message || 'File upload error';
      return res.status(400).json({ error: message });
    }
    next();
  });
}, uploadToCloudinary, async (req, res) => {
  try {
    const {
      eventName,
      tagline,
      eventType,
      eventMode,
      isPaid,
      amount,
      startDate,
      endDate,
      timings,
      registrationLink,
      details,
      importantToRemember,
      additionalInfo,
      contactAddress,
      organizerId
    } = req.body;

    // Validate required fields
    if (!eventName || !eventType || !eventMode || !startDate || !endDate || !timings || !registrationLink || !details || !contactAddress || !organizerId) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Convert isPaid to boolean
    const isPaidBool = isPaid === 'true' || isPaid === true;

    // Validate amount if paid
    if (isPaidBool && (!amount || parseFloat(amount) <= 0)) {
      return res.status(400).json({ error: "Amount is required for paid events" });
    }

    const event = new Event({
      eventName,
      tagline: tagline || '',
      eventType,
      eventMode,
      isPaid: isPaidBool,
      amount: isPaidBool ? parseFloat(amount) : 0,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      timings,
      bannerImageUrl: req.cloudinaryResult?.secure_url,
      registrationLink,
      details,
      importantToRemember: importantToRemember || '',
      additionalInfo: additionalInfo || '',
      contactAddress,
      organizerId,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/get-events", async (req, res) => {
  const events = await Event.find();
  console.log(events);
  res.status(200).json({ events });
});

// GET /api/events/:eventId
// Fetch a single event by ID
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /api/events/organizer/:organizerId
// Fetch events created by a specific organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const { organizerId } = req.params;
    const events = await Event.find({ organizerId }).sort({ startDate: -1 });
    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching organizer events:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// DELETE /api/events/:eventId
// Delete an event by ID
router.delete("/:eventId", protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// PUT /api/events/:eventId
// Update an event by ID
router.put("/:eventId", protect, (req, res, next) => {
  const singleUpload = upload.single('banner');
  singleUpload(req, res, function (err) {
    if (err) {
      const message = err.message || 'File upload error';
      return res.status(400).json({ error: message });
    }
    next();
  });
}, uploadToCloudinary, async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      eventName,
      tagline,
      eventType,
      eventMode,
      isPaid,
      amount,
      startDate,
      endDate,
      timings,
      registrationLink,
      details,
      importantToRemember,
      additionalInfo,
      contactAddress,
    } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Update fields
    if (eventName) event.eventName = eventName;
    if (tagline !== undefined) event.tagline = tagline;
    if (eventType) event.eventType = eventType;
    if (eventMode) event.eventMode = eventMode;
    if (isPaid !== undefined) event.isPaid = isPaid === 'true' || isPaid === true;
    if (amount !== undefined) event.amount = parseFloat(amount) || 0;
    if (startDate) event.startDate = new Date(startDate);
    if (endDate) event.endDate = new Date(endDate);
    if (timings) event.timings = timings;
    if (registrationLink) event.registrationLink = registrationLink;
    if (details) event.details = details;
    if (importantToRemember !== undefined) event.importantToRemember = importantToRemember;
    if (additionalInfo !== undefined) event.additionalInfo = additionalInfo;
    if (contactAddress) event.contactAddress = contactAddress;
    if (req.cloudinaryResult?.secure_url) event.bannerImageUrl = req.cloudinaryResult.secure_url;

    await event.save();
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
