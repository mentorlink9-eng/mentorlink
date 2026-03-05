const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Conversation = require('../models/Conversation');

// Follow or unfollow a user
const toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Prevent self-following
    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    // Find both users
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userId
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );

      currentUser.followingCount = Math.max(0, (currentUser.followingCount || 0) - 1);
      userToFollow.followersCount = Math.max(0, (userToFollow.followersCount || 0) - 1);
    } else {
      // Follow
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);

      currentUser.followingCount = (currentUser.followingCount || 0) + 1;
      userToFollow.followersCount = (userToFollow.followersCount || 0) + 1;
    }

    // Save both users
    await Promise.all([currentUser.save(), userToFollow.save()]);

    // Auto-create a conversation when following (so they can chat immediately)
    if (!isFollowing) {
      await Conversation.findOrCreateConversation(currentUserId, userId);
    }

    res.json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followersCount,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
    });

  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get followers of a user
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    // Current viewer (may be unauthenticated)
    const viewerId = req.user?._id?.toString();

    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'name email profileImage role bio following',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark mutual followers (followers who the profile owner also follows back)
    const ownerFollowingSet = new Set(user.following.map(id => id.toString()));
    const followers = user.followers.map(f => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      profileImage: f.profileImage,
      role: f.role,
      bio: f.bio,
      isMutual: ownerFollowingSet.has(f._id.toString()),
    }));

    res.json({
      followers,
      total: user.followersCount || 0,
      page: parseInt(page),
      totalPages: Math.ceil((user.followersCount || 0) / limit)
    });

  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users that a user is following
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId)
      .populate({
        path: 'following',
        select: 'name email profileImage role bio followers',
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark mutual: following users who also follow the profile owner back
    const ownerFollowersSet = new Set(user.followers.map(id => id.toString()));
    const following = user.following.map(f => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      profileImage: f.profileImage,
      role: f.role,
      bio: f.bio,
      isMutual: ownerFollowersSet.has(f._id.toString()),
    }));

    res.json({
      following,
      total: user.followingCount || 0,
      page: parseInt(page),
      totalPages: Math.ceil((user.followingCount || 0) / limit)
    });

  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if current user is following another user
const checkFollowStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(userId);

    const targetUser = await User.findById(userId);

    res.json({
      isFollowing,
      followersCount: targetUser?.followersCount || 0,
      followingCount: targetUser?.followingCount || 0
    });

  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track profile view
const trackProfileView = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const viewerId = req.user?._id;
    const ipAddress = req.ip;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if this viewer has already viewed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = mentor.profileViews.find(view => {
      if (!viewerId && view.ipAddress === ipAddress) {
        const viewDate = new Date(view.viewedAt);
        viewDate.setHours(0, 0, 0, 0);
        return viewDate.getTime() === today.getTime();
      }
      if (viewerId && view.viewer) {
        return view.viewer.toString() === viewerId.toString() &&
          new Date(view.viewedAt).toDateString() === today.toDateString();
      }
      return false;
    });

    if (!existingView) {
      // Add new view
      mentor.profileViews.push({
        viewer: viewerId || null,
        viewedAt: new Date(),
        ipAddress
      });

      // Update total views
      mentor.totalProfileViews = (mentor.totalProfileViews || 0) + 1;

      // Update weekly count
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      if (!mentor.lastViewReset || mentor.lastViewReset < weekAgo) {
        mentor.weeklyViewCount = 1;
        mentor.lastViewReset = new Date();
      } else {
        mentor.weeklyViewCount = (mentor.weeklyViewCount || 0) + 1;
      }

      // Update monthly count
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const monthlyViews = mentor.profileViews.filter(view =>
        new Date(view.viewedAt) > monthAgo
      );
      mentor.monthlyViewCount = monthlyViews.length;

      // Keep only last 100 views for performance
      if (mentor.profileViews.length > 100) {
        mentor.profileViews = mentor.profileViews.slice(-100);
      }

      await mentor.save();
    }

    res.json({
      totalViews: mentor.totalProfileViews,
      weeklyViews: mentor.weeklyViewCount,
      monthlyViews: mentor.monthlyViewCount
    });

  } catch (error) {
    console.error('Error tracking profile view:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get profile analytics
const getProfileAnalytics = async (req, res) => {
  try {
    const mentorId = req.user.mentorProfile;

    const mentor = await Mentor.findById(mentorId)
      .populate('profileViews.viewer', 'name role profileImage');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Calculate view trends
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const weeklyViews = mentor.profileViews.filter(view =>
      new Date(view.viewedAt) > weekAgo
    ).length;

    const monthlyViews = mentor.profileViews.filter(view =>
      new Date(view.viewedAt) > monthAgo
    ).length;

    // Get recent viewers (unique)
    const recentViewers = [];
    const viewerSet = new Set();

    for (let i = mentor.profileViews.length - 1; i >= 0; i--) {
      const view = mentor.profileViews[i];
      if (view.viewer && !viewerSet.has(view.viewer._id.toString())) {
        viewerSet.add(view.viewer._id.toString());
        recentViewers.push({
          viewer: view.viewer,
          viewedAt: view.viewedAt
        });
        if (recentViewers.length >= 10) break;
      }
    }

    res.json({
      totalViews: mentor.totalProfileViews || 0,
      weeklyViews,
      monthlyViews,
      recentViewers,
      viewTrend: calculateTrend(mentor.profileViews)
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate view trend
const calculateTrend = (views) => {
  if (!views || views.length < 2) return 0;

  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const thisWeek = views.filter(v =>
    new Date(v.viewedAt) > weekAgo
  ).length;

  const lastWeek = views.filter(v => {
    const date = new Date(v.viewedAt);
    return date > twoWeeksAgo && date <= weekAgo;
  }).length;

  if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
};

module.exports = {
  toggleFollow,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  trackProfileView,
  getProfileAnalytics
};