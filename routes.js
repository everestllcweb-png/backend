// backend/routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Admin = require('./models/Admin');
const Settings = require('./models/Settings');
const Slider = require('./models/Slider');
const University = require('./models/University');
const Course = require('./models/Course');
const Destination = require('./models/Destination');
const Class = require('./models/Class');
const Blog = require('./models/Blog');
const Review = require('./models/Review');
const Appointment = require('./models/Appointment');
const Team = require('./models/Team');


// ---------- Auth middleware ----------
const requireAuth = (req, res, next) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// ===================== AUTH =====================
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.adminId = admin._id.toString();
    res.json({ success: true, message: 'Logged in' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ success: true, message: 'Logged out' });
  });
});

// Frontend guard expects /api/auth/me. Keep /auth/check too.
router.get('/auth/check', (req, res) => {
  res.json({ authenticated: !!req.session?.adminId });
});

router.get('/auth/me', (req, res) => {
  if (req.session?.adminId) {
    return res.json({ id: req.session.adminId });
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

// ===================== SETTINGS =====================
router.get('/settings', async (_req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = { companyName: 'Everest Worldwide Consultancy Pvt. Ltd.', tagline: 'Your Gateway to Global Education' };
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/settings', requireAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings' });
  }
});

// ===================== SLIDERS =====================
// Admin → ALL; Public → only isActive
router.get('/sliders', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isActive: true };
    const sliders = await Slider.find(query).sort({ order: 1 });
    res.json(sliders);
  } catch {
    res.status(500).json({ message: 'Failed to fetch sliders' });
  }
});

router.post('/sliders', requireAuth, async (req, res) => {
  try {
    const slider = new Slider(req.body);
    await slider.save();
    res.json(slider);
  } catch {
    res.status(400).json({ message: 'Failed to create slider' });
  }
});

router.put('/sliders/:id', requireAuth, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(slider);
  } catch {
    res.status(400).json({ message: 'Failed to update slider' });
  }
});

router.delete('/sliders/:id', requireAuth, async (req, res) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete slider' });
  }
});
// ===================== TEAM =====================
// Public: list active (for About page)
router.get('/team', async (_req, res) => {
  try {
    const list = await Team.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// Admin: list ALL (including inactive) — optional helper for admin UIs
router.get('/team/all', requireAuth, async (_req, res) => {
  try {
    const list = await Team.find().sort({ order: 1, createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch team (all)' });
  }
});

// Admin: create
router.post('/team', requireAuth, async (req, res) => {
  try {
    const { name, position, imageUrl = '', order = 0, isActive = true } = req.body || {};
    if (!name || !position) {
      return res.status(400).json({ message: 'name and position are required' });
    }
    const doc = await Team.create({ name, position, imageUrl, order, isActive });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create team member' });
  }
});

// Admin: update
router.put('/team/:id', requireAuth, async (req, res) => {
  try {
    const update = {};
    ['name', 'position', 'imageUrl', 'order', 'isActive'].forEach((k) => {
      if (req.body?.[k] !== undefined) update[k] = req.body[k];
    });
    const doc = await Team.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update team member' });
  }
});

// Admin: delete
router.delete('/team/:id', requireAuth, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete team member' });
  }
});


// ===================== UNIVERSITIES =====================
// Admin → ALL; Public → only isActive
router.get('/universities', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isActive: true };
    const universities = await University.find(query);
    res.json(universities);
  } catch {
    res.status(500).json({ message: 'Failed to fetch universities' });
  }
});

router.post('/universities', requireAuth, async (req, res) => {
  try {
    const university = new University(req.body);
    await university.save();
    res.json(university);
  } catch {
    res.status(400).json({ message: 'Failed to create university' });
  }
});

router.put('/universities/:id', requireAuth, async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(university);
  } catch {
    res.status(400).json({ message: 'Failed to update university' });
  }
});

router.delete('/universities/:id', requireAuth, async (req, res) => {
  try {
    await University.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete university' });
  }
});

// ===================== COURSES =====================
// Admin → ALL; Public → only isActive
router.get('/courses', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isActive: true };
    const courses = await Course.find(query);
    res.json(courses);
  } catch {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

router.post('/courses', requireAuth, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch {
    res.status(400).json({ message: 'Failed to create course' });
  }
});

router.put('/courses/:id', requireAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch {
    res.status(400).json({ message: 'Failed to update course' });
  }
});

router.delete('/courses/:id', requireAuth, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete course' });
  }
});

// ===================== DESTINATIONS =====================
// Admin → ALL; Public → only isActive
router.get('/destinations', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isActive: true };
    const destinations = await Destination.find(query);
    res.json(destinations);
  } catch {
    res.status(500).json({ message: 'Failed to fetch destinations' });
  }
});

router.post('/destinations', requireAuth, async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.json(destination);
  } catch {
    res.status(400).json({ message: 'Failed to create destination' });
  }
});

router.put('/destinations/:id', requireAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(destination);
  } catch {
    res.status(400).json({ message: 'Failed to update destination' });
  }
});

router.delete('/destinations/:id', requireAuth, async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete destination' });
  }
});

// ===================== CLASSES =====================
// Admin → ALL; Public → only isActive
router.get('/classes', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isActive: true };
    const classes = await Class.find(query);
    res.json(classes);
  } catch {
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
});

router.post('/classes', requireAuth, async (req, res) => {
  try {
    const classItem = new Class(req.body);
    await classItem.save();
    res.json(classItem);
  } catch {
    res.status(400).json({ message: 'Failed to create class' });
  }
});

router.put('/classes/:id', requireAuth, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classItem);
  } catch {
    res.status(400).json({ message: 'Failed to update class' });
  }
});

router.delete('/classes/:id', requireAuth, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete class' });
  }
});

/// ===================== BLOGS =====================

/**
 * Public list:
 * - If user is NOT logged in -> only published posts
 * - If user IS logged in (admin session) -> return all posts (drafts + published)
 */
router.get('/blogs', async (req, res) => {
  try {
    const isAdmin = !!req.session?.adminId;
    const filter = isAdmin ? {} : { isPublished: true };
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

/**
 * Create blog (admin)
 * Frontend already sends: title, slug, excerpt, content, imageUrl, category, author,
 * isPublished (boolean), and publishedAt (ISO string or null).
 * We also set publishedAt automatically if isPublished=true and publishedAt missing.
 */
router.post('/blogs', requireAuth, async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.isPublished && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }
    // Basic guard: require title + slug
    if (!payload.title || !payload.slug) {
      return res.status(400).json({ message: 'Title and slug are required' });
    }

    const blog = new Blog(payload);
    await blog.save();
    res.json(blog);
  } catch (e) {
    // handle duplicate slug nicely
    if (e?.code === 11000 && e?.keyPattern?.slug) {
      return res.status(400).json({ message: 'Slug already exists. Use a different title.' });
    }
    res.status(400).json({ message: 'Failed to create blog' });
  }
});

/**
 * Update blog (admin)
 * Auto-fill publishedAt when switching from draft -> published without a timestamp
 */
router.put('/blogs/:id', requireAuth, async (req, res) => {
  try {
    const update = { ...req.body };

    // If publishing now and no publishedAt, set it
    if (update.isPublished === true && !update.publishedAt) {
      update.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(blog);
  } catch (e) {
    // handle duplicate slug on update
    if (e?.code === 11000 && e?.keyPattern?.slug) {
      return res.status(400).json({ message: 'Slug already exists. Use a different title.' });
    }
    res.status(400).json({ message: 'Failed to update blog' });
  }
});

router.delete('/blogs/:id', requireAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete blog' });
  }
});

// ===================== REVIEWS =====================
// Admin → ALL; Public → only isApproved
router.get('/reviews', async (req, res) => {
  try {
    const query = req.session?.adminId ? {} : { isApproved: true };
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json(reviews);
  } catch {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

router.post('/reviews', requireAuth, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json(review);
  } catch {
    res.status(400).json({ message: 'Failed to create review' });
  }
});

router.put('/reviews/:id', requireAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch {
    res.status(400).json({ message: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', requireAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(400).json({ message: 'Failed to delete review' });
  }
});

// ===================== APPOINTMENTS =====================
// Admin list (protected)
router.get('/appointments', requireAuth, async (_req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch {
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// Create (public)
router.post('/appointments', async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      preferredDate,
      preferredTime = '',
      message = '',
      // status ignored on create (defaults to pending)
    } = req.body || {};

    const finalName = (name || fullName || '').toString().trim();
    if (!finalName || !email || !phone) {
      return res.status(400).json({ message: 'Missing required fields (name/fullName, email, phone)' });
    }

    const doc = await Appointment.create({
      name: finalName,
      email: email.toString().trim(),
      phone: phone.toString().trim(),
      preferredDate: preferredDate ? String(preferredDate) : '',
      preferredTime: String(preferredTime || ''),
      message: String(message || ''),
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error('Failed to create appointment:', error);
    res.status(400).json({ message: 'Failed to create appointment' });
  }
});

// Update (admin)
router.put('/appointments/:id', requireAuth, async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      phone,
      preferredDate,
      preferredTime,
      message,
      status,
    } = req.body || {};

    const update = {};
    if (name !== undefined || fullName !== undefined) update.name = (name || fullName || '').toString().trim();
    if (email !== undefined) update.email = String(email);
    if (phone !== undefined) update.phone = String(phone);
    if (preferredDate !== undefined) update.preferredDate = String(preferredDate || '');
    if (preferredTime !== undefined) update.preferredTime = String(preferredTime || '');
    if (message !== undefined) update.message = String(message || '');
    if (status !== undefined) update.status = String(status);

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update appointment' });
  }
});

// Delete (admin)
router.delete('/appointments/:id', requireAuth, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete appointment' });
  }
});

module.exports = router;
