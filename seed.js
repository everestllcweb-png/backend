require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Admin = require('./models/Admin');
const Settings = require('./models/Settings');
const Slider = require('./models/Slider');
const University = require('./models/University');
const Course = require('./models/Course');
const Destination = require('./models/Destination');
const Class = require('./models/Class');
const Blog = require('./models/Blog');
const Review = require('./models/Review');

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Admin.deleteMany({}),
      Settings.deleteMany({}),
      Slider.deleteMany({}),
      University.deleteMany({}),
      Course.deleteMany({}),
      Destination.deleteMany({}),
      Class.deleteMany({}),
      Blog.deleteMany({}),
      Review.deleteMany({})
    ]);

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('✓ Admin created (username: admin, password: admin123)');

    // Create settings
    console.log('Creating settings...');
    await Settings.create({
      companyName: 'Everest Worldwide Consultancy Pvt. Ltd.',
      tagline: 'Your Gateway to Global Education',
      email: 'info@everestworldwide.com',
      phone: '+977-1-4567890',
      address: 'Kathmandu, Nepal',
      facebook: 'https://facebook.com/everestworldwide',
      instagram: 'https://instagram.com/everestworldwide',
      twitter: 'https://twitter.com/everestworldwide',
      linkedin: 'https://linkedin.com/company/everestworldwide'
    });

    // Create sliders
    console.log('Creating sliders...');
    await Slider.create([
      {
        title: 'Study Abroad Dreams',
        subtitle: 'Make Them Reality',
        description: 'Expert guidance for international education opportunities',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',
        buttonText: 'Get Started',
        buttonLink: '/contact',
        order: 1,
        isActive: true
      },
      {
        title: 'Top Universities Worldwide',
        subtitle: 'Your Future Awaits',
        description: 'Partner institutions across USA, UK, Canada, Australia & more',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920',
        buttonText: 'Explore Universities',
        buttonLink: '/universities',
        order: 2,
        isActive: true
      }
    ]);

    // Create universities
    console.log('Creating universities...');
    await University.create([
      {
        name: 'Harvard University',
        country: 'USA',
        city: 'Cambridge, MA',
        description: 'Ivy League research university',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        ranking: '#1 USA',
        website: 'https://www.harvard.edu'
      },
      {
        name: 'University of Oxford',
        country: 'UK',
        city: 'Oxford',
        description: 'Oldest university in the English-speaking world',
        imageUrl: 'https://images.unsplash.com/photo-1580229080131-e29e1e7f8c41?w=800',
        ranking: '#1 UK',
        website: 'https://www.ox.ac.uk'
      },
      {
        name: 'University of Toronto',
        country: 'Canada',
        city: 'Toronto',
        description: 'Leading Canadian research university',
        imageUrl: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?w=800',
        ranking: '#1 Canada',
        website: 'https://www.utoronto.ca'
      }
    ]);

    // Create courses
    console.log('Creating courses...');
    await Course.create([
      {
        name: 'Computer Science',
        level: 'Bachelor',
        duration: '4 years',
        description: 'Software development, AI, and computing fundamentals',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
      },
      {
        name: 'Business Administration',
        level: 'Master',
        duration: '2 years',
        description: 'MBA program with global business focus',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
      },
      {
        name: 'Medicine',
        level: 'Doctorate',
        duration: '6 years',
        description: 'Medical degree program',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
      }
    ]);

    // Create destinations
    console.log('Creating destinations...');
    await Destination.create([
      {
        name: 'United States',
        description: 'World-class universities and diverse study opportunities',
        imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800'
      },
      {
        name: 'United Kingdom',
        description: 'Historic institutions and excellent education system',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800'
      },
      {
        name: 'Canada',
        description: 'High quality education and welcoming environment',
        imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800'
      },
      {
        name: 'Australia',
        description: 'Top-ranked universities and beautiful campuses',
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'
      }
    ]);

    // Create classes
    console.log('Creating classes...');
    await Class.create([
      {
        name: 'IELTS Preparation',
        type: 'English Test Prep',
        description: 'Comprehensive IELTS training for all modules',
        duration: '8 weeks',
        schedule: 'Mon-Fri, 6:00 AM - 8:00 AM',
        price: 'NPR 15,000',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'
      },
      {
        name: 'TOEFL Preparation',
        type: 'English Test Prep',
        description: 'Complete TOEFL iBT preparation course',
        duration: '8 weeks',
        schedule: 'Mon-Fri, 8:00 AM - 10:00 AM',
        price: 'NPR 18,000',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800'
      },
      {
        name: 'SAT Preparation',
        type: 'Standardized Test',
        description: 'SAT Math and English preparation',
        duration: '12 weeks',
        schedule: 'Sat-Sun, 10:00 AM - 2:00 PM',
        price: 'NPR 25,000',
        imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800'
      }
    ]);

    // Create blogs
    console.log('Creating blogs...');
    await Blog.create([
      {
        title: 'Top 10 Universities in USA for International Students',
        excerpt: 'Discover the best American universities welcoming international students',
        content: 'The United States remains the top destination for international students...',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        isPublished: true
      },
      {
        title: 'How to Prepare for IELTS: Complete Guide',
        excerpt: 'Step-by-step guide to ace your IELTS exam',
        content: 'IELTS is one of the most important tests for studying abroad...',
        author: 'Admin',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        isPublished: true
      }
    ]);

    // Create reviews
    console.log('Creating reviews...');
    await Review.create([
      {
        name: 'Rajesh Kumar',
        rating: 5,
        comment: 'Excellent service! They helped me get admission to my dream university in the USA.',
        university: 'Harvard University',
        course: 'Computer Science',
        country: 'USA',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        isApproved: true
      },
      {
        name: 'Priya Sharma',
        rating: 5,
        comment: 'Very professional and supportive throughout the entire process.',
        university: 'University of Oxford',
        course: 'Business Administration',
        country: 'UK',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        isApproved: true
      }
    ]);

    console.log('✓ Seed data created successfully!');
    console.log('\nYou can now login with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
