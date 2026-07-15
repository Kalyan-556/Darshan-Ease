const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/db');

// Models
const User = require('../models/User');
const Temple = require('../models/Temple');
const DarshanSlot = require('../models/DarshanSlot');
const Booking = require('../models/Booking');
const Donation = require('../models/Donation');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const mockDb = require('../services/mockDbService');

const seedData = async () => {
  console.log('Starting seed operations...');

  // Setup salt for password hashing
  const salt = await bcrypt.genSalt(10);
  const userPass = await bcrypt.hash('password123', salt);
  const adminPass = await bcrypt.hash('admin123', salt);
  const orgPass = await bcrypt.hash('org123', salt);

  // Clear existing databases
  if (dbConfig.isMockDB()) {
    console.log('Resetting local simulated JSON files...');
    mockDb.clearCollection('users');
    mockDb.clearCollection('temples');
    mockDb.clearCollection('darshanslots');
    mockDb.clearCollection('bookings');
    mockDb.clearCollection('donations');
    mockDb.clearCollection('feedbacks');
    mockDb.clearCollection('notifications');
  } else {
    console.log('Resetting connected MongoDB collections...');
    try {
      await User.mongooseModel.deleteMany({});
      await Temple.mongooseModel.deleteMany({});
      await DarshanSlot.mongooseModel.deleteMany({});
      await Booking.mongooseModel.deleteMany({});
      await Donation.mongooseModel.deleteMany({});
      await Feedback.mongooseModel.deleteMany({});
      await Notification.mongooseModel.deleteMany({});
    } catch (e) {
      console.warn('MongoDB collections reset warning:', e.message);
    }
  }

  // 1. Create Default Users
  console.log('Seeding default accounts...');
  const uDevotee = await User.create({
    name: 'Rahul Sharma',
    email: 'devotee@darshanease.com',
    phone: '9876543210',
    password: userPass,
    role: 'USER',
    profileImage: '',
    address: 'Sector 62, Noida, UP'
  });

  const uAdmin = await User.create({
    name: 'Admin System',
    email: 'admin@darshanease.com',
    phone: '9999888877',
    password: adminPass,
    role: 'ADMIN',
    profileImage: '',
    address: 'Main Office, New Delhi'
  });

  const uOrganizer = await User.create({
    name: 'Temple Trustee',
    email: 'organizer@darshanease.com',
    phone: '8888777766',
    password: orgPass,
    role: 'ORGANIZER',
    profileImage: '',
    address: 'Tirupati, AP'
  });

  // 2. Create Temples (12 Temples)
  console.log('Seeding expanded temples list...');
  const templesToCreate = [
    {
      name: 'Kedarnath Temple',
      location: 'Kedarnath, Rudraprayag',
      district: 'Rudraprayag',
      state: 'Uttarakhand',
      description: 'One of the most sacred Hindu temples dedicated to Lord Shiva, located in the Garhwal Himalayan range near the Mandakini River. Open only between April and November due to extreme winter conditions.',
      history: 'Originally built by the Pandavas, the temple was later resurrected by Adi Sankaracharya in the 8th century AD. The temple survived the massive 2013 flash floods standing strong behind a giant boulder.',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1627894483216-2138af692e2e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '06:00 AM',
      closingTime: '09:00 PM',
      specialDarshan: ['VIP Rudrabhishek Puja', 'Shringar Darshan', 'Maha Aarti Pass'],
      facilities: ['Medical Center', 'Dharamshala Lodging', 'Helipad Access', 'Wheelchair Ramps'],
      latitude: 30.7352,
      longitude: 79.0669
    },
    {
      name: 'Tirumala Venkateswara Temple',
      location: 'Tirupati Hills',
      district: 'Chittoor',
      state: 'Andhra Pradesh',
      description: 'A landmark Vaishnavite temple dedicated to Lord Venkateswara, an incarnation of Vishnu, who is believed to have appeared here to save mankind from trials and troubles of Kali Yuga.',
      history: 'Dating back to the 3rd century AD, Vijayanagara Emperors and Pallava Kings heavily patronized this holy shrine. It is the richest temple in the world in terms of donations received.',
      image: 'https://images.unsplash.com/photo-1600100397990-24b320d41dfc?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '03:00 AM',
      closingTime: '11:00 PM',
      specialDarshan: ['Special Entry Darshan (₹300)', 'Kalyanotsavam (₹1000)', 'Suprabhatha Seva'],
      facilities: ['Free Locker Rooms', 'Massive Dining Hall (Annaprasadam)', 'Free Bus Transit', 'Tonsure Halls'],
      latitude: 13.6833,
      longitude: 79.3500
    },
    {
      name: 'Golden Temple (Harmandir Sahib)',
      location: 'Amritsar City Center',
      district: 'Amritsar',
      state: 'Punjab',
      description: 'The preeminent spiritual shrine of Sikhism. Built around a beautiful pool (Amrit Sarovar), the temple welcomes people of all religions, creeds, and backgrounds to experience divine calm.',
      history: 'Founded in 1577 by Guru Ram Das, the fourth Sikh Guru. The pool was completed, and Guru Arjan Dev designed the shrine structure. Maharaja Ranjit Singh gilded the upper floors in gold leaf in 1830.',
      image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1563258225-b461bd3d68de?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '04:00 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['Free Langar Entry', 'Palki Sahib Ceremony Pass'],
      facilities: ['24/7 Langar Hall', 'Foreign Devotee Helpdesk', 'Clean Resting Areas', 'Sikh Museum'],
      latitude: 31.6200,
      longitude: 74.8765
    },
    {
      name: 'Somnath Temple',
      location: 'Prabhas Patan, Veraval',
      district: 'Gir Somnath',
      state: 'Gujarat',
      description: 'Believed to be the first among the twelve Jyotirlinga shrines of Shiva. A magnificent seaside temple built in the Chalukya style, standing tall against the Arabian Sea winds.',
      history: 'Reconstructed several times throughout history after repeated destruction by foreign invaders. The present majestic structure was built in 1951 under the leadership of Sardar Vallabhbhai Patel.',
      image: 'https://images.unsplash.com/photo-1621535787680-d61cc5cb58c1?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '06:00 AM',
      closingTime: '09:30 PM',
      specialDarshan: ['Somnath Light & Sound Show', 'Sankalp Puja', 'Mahapuja Ticket'],
      facilities: ['Sea-view Guest Houses', 'Digital Cloakrooms', 'Golf Cart Transits', 'Shopping Arcade'],
      latitude: 20.8880,
      longitude: 70.4012
    },
    {
      name: 'Kashi Vishwanath Temple',
      location: 'Lahori Tola, Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      description: 'One of the most famous Hindu temples dedicated to Lord Shiva, located on the western bank of the holy river Ganga in Varanasi. The temple has been a core center of worship for centuries.',
      history: 'Destructed and rebuilt multiple times. The current structure was built by Queen Ahilyabai Holkar of Indore in 1780. In 2021, the Kashi Vishwanath Corridor was inaugurated, expanding entry spaces.',
      image: 'https://images.unsplash.com/photo-1601579899395-5dbd80911762?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '04:00 AM',
      closingTime: '11:00 PM',
      specialDarshan: ['Sugam Darshan (₹300)', 'Mangala Aarti Ticket', 'Rudra Abhishek Seva'],
      facilities: ['Corridor Walkway', 'Drinking Water stations', 'Security Lockers', 'Wheelchairs'],
      latitude: 25.3109,
      longitude: 83.0105
    },
    {
      name: 'Vaishno Devi Temple',
      location: 'Trikuta Hills, Katra',
      district: 'Reasi',
      state: 'Jammu and Kashmir',
      description: 'A holy cave temple located in the folds of the Trikuta Mountains, dedicated to the Hindu Goddess Durga (Vaishno Devi). Millions of pilgrims trek up the mountain slope annually.',
      history: 'Dating back thousands of years, references to the Goddess are found in Mahabharata. The modern shrine administration is maintained under the Shri Mata Vaishno Devi Shrine Board since 1986.',
      image: 'https://images.unsplash.com/photo-1599839818816-09dfba5196f7?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '05:00 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['VIP Darshan Pass', 'Atka Aarti Seva'],
      facilities: ['Pony & Palki services', 'Battery Car Transit', 'Free Dormitories', 'Helicopter booking'],
      latitude: 33.0300,
      longitude: 74.9490
    },
    {
      name: 'Meenakshi Amman Temple',
      location: 'Madurai City Center',
      district: 'Madurai',
      state: 'Tamil Nadu',
      description: 'A historic Hindu temple located on the southern bank of the Vaigai River in Madurai. It is dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar.',
      history: 'Built during the Pandyan dynasty, the temple was looted in the 14th century and later rebuilt by Nayak rulers. It features 14 majestic Gopurams (gateway towers) covered in thousands of stone figures.',
      image: 'https://images.unsplash.com/photo-1600100397990-24b320d41dfc?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '05:00 AM',
      closingTime: '09:00 PM',
      specialDarshan: ['Special Entrance (₹100)', 'Thanga Ther (Golden Chariot) Seva'],
      facilities: ['Cloak Rooms', 'Traditional Dress Rentals', 'Resting Halls', 'Pure drinking water'],
      latitude: 9.9195,
      longitude: 78.1193
    },
    {
      name: 'Jagannath Temple',
      location: 'Grand Road, Puri',
      district: 'Puri',
      state: 'Odisha',
      description: 'An important Hindu temple dedicated to Jagannath, a form of Sri Krishna. Famous for its annual Ratha Yatra (Chariot Festival) where the three deities are pulled in massive wooden carts.',
      history: 'Constructed by King Anantavarman Chodaganga Deva in the 12th century AD. It is one of the four sacred Char Dham pilgrimage sites of Hinduism and features unique non-metal deities.',
      image: 'https://images.unsplash.com/photo-1601579899395-5dbd80911762?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '05:30 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['Sahan Mela (Free entry close-up)', 'Special Mahaprasad Dining Ticket'],
      facilities: ['Massive Kitchen (Ananda Bazar)', 'Shoe stands', 'Devotee assistance center'],
      latitude: 19.8049,
      longitude: 85.8179
    },
    {
      name: 'Siddhivinayak Temple',
      location: 'Prabhadevi, Mumbai',
      district: 'Mumbai City',
      state: 'Maharashtra',
      description: 'A highly popular Hindu temple dedicated to Lord Ganesha, featuring a small sanctum containing a monolithic stone statue of Ganesha with his trunk positioned to the right.',
      history: 'Initially constructed by Laxman Vithu and Deubai Patil in 1801. It has evolved from a small shrine to one of the most visited and richest temples in Mumbai, frequented by celebrities.',
      image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1600100397990-24b320d41dfc?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '05:30 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['VIP Fast-Track Pass (₹150)', 'Atharvasheersha Havan entry'],
      facilities: ['A/C Queue Complexes', 'Online Live Stream access', 'Digital cloakrooms'],
      latitude: 19.0166,
      longitude: 72.8300
    },
    {
      name: 'Badrinath Temple',
      location: 'Garhwal Himalayas, Badrinath',
      district: 'Chamoli',
      state: 'Uttarakhand',
      description: 'A sacred temple dedicated to Lord Vishnu, situated along the Alaknanda River in the hill state of Uttarakhand. It is a major component of both the Char Dham and Chota Char Dham routes.',
      history: 'Mentioned in ancient Vedic texts, the temple was established as a major pilgrimage site by Adi Shankara in the 8th century. Constructed with a colorful stone facade resembling a Buddhist temple.',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e2e?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '04:30 AM',
      closingTime: '09:00 PM',
      specialDarshan: ['VIP Maha Pooja Ticket', 'Vishnu Sahasranama Path Pass'],
      facilities: ['Hot water Springs access (Tapt Kund)', 'Medical rooms', 'Mountain shelters'],
      latitude: 30.7423,
      longitude: 79.4938
    },
    {
      name: 'Brihadeeswara Temple',
      location: 'Thanjavur Center',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      description: 'A magnificent Chola architectural marvel dedicated to Lord Shiva. Also known as the Big Temple, it features a massive stone Vimana tower standing 216 feet high, carved out of granite blocks.',
      history: 'Built by Chola Emperor Raja Raja I between 1003 and 1010 AD. The temple is part of the UNESCO World Heritage Site known as the Great Living Chola Temples.',
      image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '06:00 AM',
      closingTime: '08:30 PM',
      specialDarshan: ['Free Heritage walk pass', 'Brihadeeswara Pradosham Special Puja'],
      facilities: ['Massive stone gardens', 'Audio Tour guides', 'Wheelchair access paths'],
      latitude: 10.7828,
      longitude: 79.1318
    },
    {
      name: 'Akshardham Temple',
      location: 'Noida Link Road, New Delhi',
      district: 'East Delhi',
      state: 'Delhi',
      description: 'A massive modern spiritual-cultural campus displaying millennia of traditional Hindu and Indian culture, spirituality, and architecture. Constructed using pink sandstone and Italian marble.',
      history: 'Inaugurated in November 2005 by Pramukh Swami Maharaj, the spiritual leader of BAPS. The complex features an IMAX theater, cultural boat rides, and a musical fountain show.',
      image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1600100397990-24b320d41dfc?auto=format&fit=crop&q=80&w=800'
      ],
      openingTime: '09:30 AM',
      closingTime: '08:00 PM',
      specialDarshan: ['Exhibition Ticket (Boat Ride & IMAX)', 'Musical Fountain Show Pass'],
      facilities: ['Food Court (Premvati)', 'Massive parking zones', 'Lost & Found counter', 'A/C rest areas'],
      latitude: 28.6127,
      longitude: 77.2773
    }
  ];

  const seededTemples = [];
  for (let temple of templesToCreate) {
    const t = await Temple.create(temple);
    seededTemples.push(t);
  }

  // 3. Create Darshan Slots for each Temple
  console.log('Seeding darshan slot schedules...');
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const times = [
    { time: '06:00 AM - 08:00 AM', price: 100 },
    { time: '09:00 AM - 11:00 AM', price: 250 },
    { time: '12:00 PM - 02:00 PM', price: 150 },
    { time: '03:00 PM - 05:00 PM', price: 200 },
    { time: '06:00 PM - 08:00 PM', price: 300 }
  ];

  for (let temple of seededTemples) {
    for (let date of dates) {
      for (let timeItem of times) {
        await DarshanSlot.create({
          templeId: temple._id,
          date,
          time: timeItem.time,
          capacity: 50,
          availableSeats: 50,
          price: timeItem.price,
          status: 'Active'
        });
      }
    }
  }

  console.log('Successfully completed database seeding!');
  console.log('--------------------------------------------------');
  console.log('Account Credentials Available:');
  console.log('User Role: devotee@darshanease.com | password123');
  console.log('Organizer: organizer@darshanease.com | org123');
  console.log('Admin Role: admin@darshanease.com | admin123');
  console.log('--------------------------------------------------');
};

// Check if run directly
if (require.main === module) {
  // Load environment if run directly
  const dotenvPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }

  // Set mock status based on MongoDB connection check
  const startLocalSeed = async () => {
    await dbConfig.connectDB();
    await seedData();
    process.exit(0);
  };
  startLocalSeed();
} else {
  module.exports = { seedData };
}
