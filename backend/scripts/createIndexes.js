/**
 * MongoDB Index Creation Script
 * Run this script to create all necessary indexes for optimal performance
 *
 * Usage: node scripts/createIndexes.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function createIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Users Collection Indexes
    console.log('\nCreating User indexes...');
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true, name: 'email_unique' },
      { key: { username: 1 }, unique: true, name: 'username_unique' },
      { key: { role: 1 }, name: 'role_idx' },
      { key: { isVerified: 1 }, name: 'verified_idx' },
      { key: { isDeleted: 1 }, name: 'deleted_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
      { key: { role: 1, isVerified: 1, isDeleted: 1 }, name: 'active_users_compound' },
      { key: { email: 1, isDeleted: 1 }, name: 'email_not_deleted' },
    ]);
    console.log('User indexes created');

    // Mentors Collection Indexes
    console.log('\nCreating Mentor indexes...');
    await db.collection('mentors').createIndexes([
      { key: { user: 1 }, unique: true, name: 'user_unique' },
      { key: { primaryDomain: 1 }, name: 'domain_idx' },
      { key: { skills: 1 }, name: 'skills_idx' },
      { key: { 'activeMentees': 1 }, name: 'active_mentees_idx' },
      { key: { totalProfileViews: -1 }, name: 'views_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
      { key: { primaryDomain: 1, skills: 1 }, name: 'domain_skills_compound' },
    ]);
    console.log('Mentor indexes created');

    // Students Collection Indexes
    console.log('\nCreating Student indexes...');
    await db.collection('students').createIndexes([
      { key: { user: 1 }, unique: true, name: 'user_unique' },
      { key: { mentorshipField: 1 }, name: 'field_idx' },
      { key: { experienceLevel: 1 }, name: 'experience_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
    ]);
    console.log('Student indexes created');

    // Mentorship Requests Collection Indexes
    console.log('\nCreating MentorshipRequest indexes...');
    await db.collection('mentorshiprequests').createIndexes([
      { key: { mentor: 1, student: 1 }, unique: true, name: 'mentor_student_unique' },
      { key: { mentor: 1, status: 1 }, name: 'mentor_status_idx' },
      { key: { student: 1, status: 1 }, name: 'student_status_idx' },
      { key: { status: 1 }, name: 'status_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
      { key: { mentor: 1, student: 1, status: 1 }, name: 'connection_lookup' },
    ]);
    console.log('MentorshipRequest indexes created');

    // Messages Collection Indexes
    console.log('\nCreating Message indexes...');
    await db.collection('messages').createIndexes([
      { key: { conversationId: 1, createdAt: -1 }, name: 'conversation_messages' },
      { key: { sender: 1, recipient: 1 }, name: 'sender_recipient_idx' },
      { key: { recipient: 1, isRead: 1 }, name: 'unread_messages_idx' },
      { key: { isDeleted: 1 }, name: 'deleted_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
      { key: { content: 'text' }, name: 'message_search' },
    ]);
    console.log('Message indexes created');

    // Conversations Collection Indexes
    console.log('\nCreating Conversation indexes...');
    await db.collection('conversations').createIndexes([
      { key: { participants: 1 }, name: 'participants_idx' },
      { key: { lastMessageAt: -1 }, name: 'last_message_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
    ]);
    console.log('Conversation indexes created');

    // Sessions Collection Indexes
    console.log('\nCreating Session indexes...');
    await db.collection('sessions').createIndexes([
      { key: { mentor: 1, date: -1 }, name: 'mentor_date_idx' },
      { key: { student: 1, date: -1 }, name: 'student_date_idx' },
      { key: { status: 1, date: 1 }, name: 'status_date_idx' },
      { key: { date: 1 }, name: 'date_idx' },
      { key: { mentor: 1, student: 1, date: -1 }, name: 'participant_sessions' },
    ]);
    console.log('Session indexes created');

    // Notifications Collection Indexes
    console.log('\nCreating Notification indexes...');
    await db.collection('notifications').createIndexes([
      { key: { userId: 1, read: 1, createdAt: -1 }, name: 'user_notifications' },
      { key: { userId: 1, createdAt: -1 }, name: 'user_created_idx' },
      { key: { type: 1 }, name: 'type_idx' },
      { key: { createdAt: 1 }, expireAfterSeconds: 2592000, name: 'ttl_30_days' }, // Auto-delete after 30 days
    ]);
    console.log('Notification indexes created');

    // Events Collection Indexes
    console.log('\nCreating Event indexes...');
    await db.collection('events').createIndexes([
      { key: { organizer: 1 }, name: 'organizer_idx' },
      { key: { eventType: 1 }, name: 'event_type_idx' },
      { key: { startDate: 1 }, name: 'start_date_idx' },
      { key: { status: 1 }, name: 'status_idx' },
      { key: { eventType: 1, startDate: 1 }, name: 'type_date_compound' },
      { key: { eventName: 'text', description: 'text' }, name: 'event_search' },
    ]);
    console.log('Event indexes created');

    // Audit Logs Collection Indexes
    console.log('\nCreating AuditLog indexes...');
    await db.collection('auditlogs').createIndexes([
      { key: { adminId: 1, createdAt: -1 }, name: 'admin_logs_idx' },
      { key: { targetType: 1, targetId: 1 }, name: 'target_idx' },
      { key: { action: 1 }, name: 'action_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
      { key: { createdAt: 1 }, expireAfterSeconds: 7776000, name: 'ttl_90_days' }, // Auto-delete after 90 days
    ]);
    console.log('AuditLog indexes created');

    // Testimonials Collection Indexes
    console.log('\nCreating Testimonial indexes...');
    await db.collection('testimonials').createIndexes([
      { key: { user: 1 }, name: 'user_idx' },
      { key: { isApproved: 1, isFeatured: 1 }, name: 'approved_featured_idx' },
      { key: { rating: -1 }, name: 'rating_idx' },
      { key: { createdAt: -1 }, name: 'created_at_idx' },
    ]);
    console.log('Testimonial indexes created');

    // Admin Sessions Collection Indexes
    console.log('\nCreating AdminSession indexes...');
    await db.collection('adminsessions').createIndexes([
      { key: { adminId: 1, isActive: 1 }, name: 'active_sessions_idx' },
      { key: { token: 1 }, name: 'token_idx' },
      { key: { lastActivity: 1 }, expireAfterSeconds: 86400, name: 'ttl_24_hours' }, // Auto-delete inactive sessions
    ]);
    console.log('AdminSession indexes created');

    console.log('\n========================================');
    console.log('All indexes created successfully!');
    console.log('========================================\n');

    // Print index stats
    const collections = await db.listCollections().toArray();
    console.log('Index Summary:');
    for (const collection of collections) {
      if (!collection.name.startsWith('system.')) {
        const indexes = await db.collection(collection.name).indexes();
        console.log(`  ${collection.name}: ${indexes.length} indexes`);
      }
    }

  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
    process.exit(0);
  }
}

createIndexes();
