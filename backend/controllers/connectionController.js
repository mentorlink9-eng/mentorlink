const User = require('../models/User');

// @desc    Toggle connection (connect/disconnect)
// @route   POST /api/connect/:userId
// @access  Private
const toggleConnection = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected
    const isConnected = currentUser.connections.includes(targetUserId);

    if (isConnected) {
      // Disconnect: Remove from both users' connections
      currentUser.connections = currentUser.connections.filter(
        (id) => id.toString() !== targetUserId
      );
      currentUser.connectionsCount = Math.max(0, currentUser.connectionsCount - 1);

      targetUser.connections = targetUser.connections.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      targetUser.connectionsCount = Math.max(0, targetUser.connectionsCount - 1);

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: 'Disconnected successfully',
        isConnected: false,
        currentUserConnectionsCount: currentUser.connectionsCount,
        targetUserConnectionsCount: targetUser.connectionsCount,
      });
    } else {
      // Connect: Add to both users' connections
      currentUser.connections.push(targetUserId);
      currentUser.connectionsCount += 1;

      targetUser.connections.push(currentUserId);
      targetUser.connectionsCount += 1;

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: 'Connected successfully',
        isConnected: true,
        currentUserConnectionsCount: currentUser.connectionsCount,
        targetUserConnectionsCount: targetUser.connectionsCount,
      });
    }
  } catch (error) {
    console.error('Error in toggleConnection:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all connections for logged-in user
// @route   GET /api/connect
// @access  Private
const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('connections', 'name email profileImage role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      connections: user.connections,
      connectionsCount: user.connectionsCount,
    });
  } catch (error) {
    console.error('Error in getConnections:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if connected with a specific user
// @route   GET /api/connect/check/:userId
// @access  Private
const checkConnection = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isConnected = currentUser.connections.includes(targetUserId);

    res.json({ isConnected });
  } catch (error) {
    console.error('Error in checkConnection:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleConnection,
  getConnections,
  checkConnection,
};
