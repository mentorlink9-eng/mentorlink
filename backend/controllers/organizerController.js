/* eslint-env node */
/* eslint-disable no-undef */
const Organizer = require('../models/Organizer');
const { upload, uploadToCloudinary } = require('../middleware/upload');

// @desc    Create or update organizer profile
// @route   POST /api/organizers
// @access  Public (or private if you add auth)
const createOrUpdateOrganizer = async (req, res) => {
  try {
    const {
      user,
      pastEvents,
      eventTypes,
      mode,
      domains,
      help,
      motivation,
      audience,
    } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build organizer fields
    const organizerFields = {
      user,
      pastEvents,
      eventTypes,
      mode,
      domains,
      help,
      motivation,
      audience,
    };

    // Check if organizer already exists
    let organizer = await Organizer.findOne({ user });

    if (organizer) {
      // Update existing organizer
      organizer = await Organizer.findOneAndUpdate(
        { user },
        { $set: organizerFields },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ message: 'Organizer profile updated', organizer });
    }

    // Create new organizer
    organizer = new Organizer(organizerFields);
    await organizer.save();
    res.status(201).json({ message: 'Organizer profile created', organizer });
  } catch (error) {
    console.error('Organizer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get organizer profile for current user
// @route   GET /api/organizers/profile
// @access  Private
const getOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const organizer = await Organizer.findOne({ user: userId }).populate('user', 'name email bio');
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer profile not found' });
    }

    res.json({ organizer });
  } catch (error) {
    console.error('getOrganizerProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload profile image to Cloudinary
// @route   POST /api/organizers/upload-profile-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!req.cloudinaryResult) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Update organizer profile with new image URL
    const organizer = await Organizer.findOneAndUpdate(
      { user: userId },
      { profileImage: req.cloudinaryResult.secure_url },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer profile not found' });
    }

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: req.cloudinaryResult.secure_url,
      organizer
    });
  } catch (error) {
    console.error('uploadProfileImage error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload cover image to Cloudinary
// @route   POST /api/organizers/upload-cover-image
// @access  Private
const uploadCoverImage = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!req.cloudinaryResult) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Update organizer profile with new cover image URL
    const organizer = await Organizer.findOneAndUpdate(
      { user: userId },
      { coverImage: req.cloudinaryResult.secure_url },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer profile not found' });
    }

    res.json({
      message: 'Cover image uploaded successfully',
      imageUrl: req.cloudinaryResult.secure_url,
      organizer
    });
  } catch (error) {
    console.error('uploadCoverImage error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update organizer profile
// @route   PUT /api/organizers/profile
// @access  Private
const updateOrganizerProfile = async (req, res) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      domains,
      motivation,
      audience,
      eventTypes
    } = req.body;

    const updateFields = {};
    if (domains) updateFields.domains = domains;
    if (motivation) updateFields.motivation = motivation;
    if (audience) updateFields.audience = audience;
    if (eventTypes) updateFields.eventTypes = eventTypes;

    const organizer = await Organizer.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      organizer
    });
  } catch (error) {
    console.error('updateOrganizerProfile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrUpdateOrganizer,
  getOrganizerProfile,
  uploadProfileImage,
  uploadCoverImage,
  updateOrganizerProfile,
  upload,
  uploadToCloudinary
};
