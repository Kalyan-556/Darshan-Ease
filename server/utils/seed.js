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
  await User.create({
    name: 'Rahul Sharma',
    email: 'devotee@darshanease.com',
    phone: '9876543210',
    password: userPass,
    role: 'USER',
    profileImage: '',
    address: 'Sector 62, Noida, UP'
  });

  await User.create({
    name: 'Admin System',
    email: 'admin@darshanease.com',
    phone: '9999888877',
    password: adminPass,
    role: 'ADMIN',
    profileImage: '',
    address: 'Main Office, New Delhi'
  });

  await User.create({
    name: 'Temple Trustee',
    email: 'organizer@darshanease.com',
    phone: '8888777766',
    password: orgPass,
    role: 'ORGANIZER',
    profileImage: '',
    address: 'Tirupati, AP'
  });

  // 2. Create Temples (27 Temples using Local Uploaded Images & Fallbacks)
  console.log('Seeding temples list with local uploaded images (27 temples)...');
  const templesToCreate = [
    {
      name: 'Kedarnath Temple',
      location: 'Kedarnath, Rudraprayag',
      district: 'Rudraprayag',
      state: 'Uttarakhand',
      description: 'One of the most sacred Hindu temples dedicated to Lord Shiva, located in the Garhwal Himalayan range near the Mandakini River. Open only between April and November due to extreme winter conditions.',
      history: 'Originally built by the Pandavas, the temple was later resurrected by Adi Sankaracharya in the 8th century AD. The temple survived the massive 2013 flash floods standing strong behind a giant boulder.',
      image: '/uploads/temples/Kedarnath Temple.jpg',
      gallery: [],
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
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Tirumala_090615.jpg',
      gallery: [],
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
      gallery: [],
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
      image: '/uploads/temples/Somanath mandir.jpg',
      gallery: [],
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
      image: '/uploads/temples/Kashi Vishwanath Temple.jpg',
      gallery: [],
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
      image: '/uploads/temples/Vaishno Devi Temple.jpg',
      gallery: [],
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
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
      gallery: [],
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
      image: '/uploads/temples/Jagannath Temple.jpg',
      gallery: [],
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
      image: '/uploads/temples/Siddhivinayak Temple.jpg',
      gallery: [],
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
      image: '/uploads/temples/Badrinath Temple.jpg',
      gallery: [],
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
      image: '/uploads/temples/Brihadeeswara Temple.jpg',
      gallery: [],
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
      image: '/uploads/temples/Akshardham Temple.jpg',
      gallery: [],
      openingTime: '09:30 AM',
      closingTime: '08:00 PM',
      specialDarshan: ['Exhibition Ticket (Boat Ride & IMAX)', 'Musical Fountain Show Pass'],
      facilities: ['Food Court (Premvati)', 'Massive parking zones', 'Lost & Found counter', 'A/C rest areas'],
      latitude: 28.6127,
      longitude: 77.2773
    },
    {
      name: 'Konark Sun Temple',
      location: 'Konark Coast Road',
      district: 'Puri',
      state: 'Odisha',
      description: 'A 13th-century CE Sun Temple built shaped like a gigantic chariot of Sun God Surya with 24 carved stone wheels pulled by seven horses, standing as a marvel of stone carving.',
      history: 'Built by King Narasimhadeva I of the Eastern Ganga Dynasty. Much of the temple complex is now in ruins, but the surviving structures are globally celebrated as a UNESCO World Heritage Site.',
      image: '/uploads/temples/Konark Sun Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '08:00 PM',
      specialDarshan: ['Light and Sound Show Entry', 'Guided Architectural Tour'],
      facilities: ['Tourist Info Hub', 'Drinking water kiosks', 'Gardens', 'Local craft markets'],
      latitude: 19.8876,
      longitude: 86.0945
    },
    {
      name: 'Padmanabhaswamy Temple',
      location: 'East Fort, Thiruvananthapuram',
      district: 'Trivandrum',
      state: 'Kerala',
      description: 'An ancient Hindu temple dedicated to Lord Vishnu reclining on the serpent Anantha, built in a unique blend of Kerala and Dravidian architectural styles.',
      history: 'Maintained by the Royal Family of Travancore. It became famous worldwide when subterranean vaults were opened, revealing treasures of gold, diamonds, and precious gems worth billions.',
      image: '/uploads/temples/Padmanabhaswamy Temple.jpg',
      gallery: [],
      openingTime: '03:30 AM',
      closingTime: '08:30 PM',
      specialDarshan: ['VIP Darshan Pass (₹250)', 'Special Archana Ticket'],
      facilities: ['Dhoti renting counters', 'Cloakrooms', 'Locker services', 'Traditional bathing tanks'],
      latitude: 8.4828,
      longitude: 76.9436
    },
    {
      name: 'Sabarimala Sastha Temple',
      location: 'Periyar Tiger Reserve',
      district: 'Pathanamthitta',
      state: 'Kerala',
      description: 'A popular pilgrimage center dedicated to Lord Ayyappa, situated on a hilltop surrounded by dense forests. Devotees observe strict 41-day vows before making the trek up the hills.',
      history: 'Believed to have been founded by Parashurama. The temple has a unique tradition where pilgrims carry the Irumudikettu (a two-compartment bag of offerings) on their heads during the trek.',
      image: '/uploads/temples/Sabarimala Sastha Temple.jpg',
      gallery: [],
      openingTime: '04:00 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['Virtual Q Queue Verification', 'Neyyabhishekam Ghee Offering Pass'],
      facilities: ['Transit camps (Pamba)', 'Forest path medical checkpoints', 'Free food centers'],
      latitude: 9.4404,
      longitude: 77.0819
    },
    {
      name: 'Ramanathaswamy Temple',
      location: 'Rameswaram Island',
      district: 'Ramanathapuram',
      state: 'Tamil Nadu',
      description: 'A highly sacred temple dedicated to Lord Shiva. It features the longest temple corridor in the world, lined with over 1200 intricately carved stone pillars.',
      history: 'According to Ramayana, Lord Rama constructed and prayed to the Shiva Linga here to seek absolution. The temple is famous for its 22 holy water tanks (Teerthams) in which pilgrims bathe before darshan.',
      image: '/uploads/temples/Ramanathaswamy Temple.jpg',
      gallery: [],
      openingTime: '05:00 AM',
      closingTime: '09:00 PM',
      specialDarshan: ['Spadika Linga Darshan', 'VIP Bathing queue ticket'],
      facilities: ['Teertham Guide services', 'Luggage counters', 'Resting chambers'],
      latitude: 9.2881,
      longitude: 79.3174
    },
    {
      name: 'Kamakhya Temple',
      location: 'Nilachal Hills, Guwahati',
      district: 'Kamrup',
      state: 'Assam',
      description: 'One of the oldest and most revered Shakti Peethas in India, dedicated to the Goddess Kamakhya, representing the center of tantric worship in northeastern India.',
      history: 'Rebuilt by Chilarai of the Koch Dynasty in 1565 after being damaged by invaders. Famous for the annual Ambubachi Mela festival celebrating the creative power of mother earth.',
      image: '/uploads/temples/Kamakhya Temple.jpg',
      gallery: [],
      openingTime: '05:30 AM',
      closingTime: '09:00 PM',
      specialDarshan: ['Special Entry Pass (₹501)', 'VIP Shanti Puja Ticket'],
      facilities: ['Hillside path lights', 'Drinking water kiosks', 'Prasad stalls'],
      latitude: 26.1662,
      longitude: 91.7025
    },
    {
      name: 'Dwarkadhish Temple',
      location: 'Dwarka Coast, Okha',
      district: 'Devbhumi Dwarka',
      state: 'Gujarat',
      description: 'A five-storied limestone temple dedicated to Lord Krishna, known here as Dwarkadhish (King of Dwarka), standing close to the shores of the Gomti River.',
      history: 'Dating back over 2000 years, the original structure is believed to have been constructed by Vajranabha, Krishna\'s grandson, over the legendary palace site. The current temple has a 78-meter high spire.',
      image: '/uploads/temples/Dwarkadhish Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '09:30 PM',
      specialDarshan: ['Dhwaja Rohana Ceremony Pass', 'Shringar Aarti Entry'],
      facilities: ['Locker systems', 'Devotee shelter halls', 'Gomti bathing steps assistance'],
      latitude: 22.2403,
      longitude: 68.9686
    },
    {
      name: 'Mahakaleshwar Jyotirlinga',
      location: 'Mahakal Marg, Ujjain',
      district: 'Ujjain',
      state: 'Madhya Pradesh',
      description: 'One of the twelve Jyotirlingas, featuring a swayambhu (self-manifested) Shivling that faces South (Dakshinamurti), widely revered for its daily Bhasma Aarti (ash ritual).',
      history: 'Reconstructed by the Scindias and Maratha rulers in the 18th century after historical invasions. Famous for the Mahakal Lok corridor inaugurated to expand devotee holding capacities.',
      image: '/uploads/temples/Mahakaleshwar Jyotirlinga.jpg',
      gallery: [],
      openingTime: '04:00 AM',
      closingTime: '11:00 PM',
      specialDarshan: ['Bhasma Aarti booking', 'VIP Sheeghra Darshan (₹250)', 'Garbhagriha Entry Ticket'],
      facilities: ['Queue shelter corridors', 'Annapurna Dining Hall', 'E-rickshaws for seniors'],
      latitude: 23.1828,
      longitude: 75.7682
    },
    {
      name: 'Shirdi Sai Baba Temple',
      location: 'Shirdi Center',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      description: 'The world-famous spiritual shrine dedicated to the saint Sai Baba of Shirdi, housing his white marble Samadhi and attracting devotees of all religions.',
      history: 'Established in the early 20th century around the Dwarkamai mosque where Sai Baba lived. The temple complex is run by the Shri Saibaba Sansthan Trust, hosting massive community dining halls.',
      image: '/uploads/temples/Shirdi Sai Baba Temple.jpg',
      gallery: [],
      openingTime: '05:00 AM',
      closingTime: '10:00 PM',
      specialDarshan: ['VIP Kakad Aarti booking', 'Shej Aarti Ticket', 'Fast-track Darshan Pass'],
      facilities: ['Massive Prasadalaya (Free Meals)', 'Huge Guest House complexes', 'Free local shuttle'],
      latitude: 19.7668,
      longitude: 74.4754
    },
    {
      name: 'Amarnath Cave Temple',
      location: 'Lidder Valley, Amarnath',
      district: 'Anantnag',
      state: 'Jammu and Kashmir',
      description: 'A holy cave shrine situated at an altitude of 3,888 meters, famous for the natural ice Shivling that forms inside the cave during the summer months.',
      history: 'Discovered by a shepherd named Buta Malik in the 15th century. The annual pilgrimage (Amarnath Yatra) is heavily guarded and managed by the Shri Amarnathji Shrine Board.',
      image: '/uploads/temples/Amarnath Cave Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '06:00 PM',
      specialDarshan: ['Yatra Registration Verification', 'Helicopter Yatra Pass'],
      facilities: ['Medical camps', 'Oxygen booths', 'Transit tents', 'Helipad services'],
      latitude: 34.2155,
      longitude: 75.5019
    },
    {
      name: 'Murudeshwar Temple',
      location: 'Bhatkal Coast',
      district: 'Uttara Kannada',
      state: 'Karnataka',
      description: 'A seaside temple famous for housing the world\'s second-tallest statue of Lord Shiva (123 feet) and a towering 20-story Gopura overlooking the Arabian Sea.',
      history: 'Dating back to the Pranalinga legend of Ravana and the Atmalinga. The modern complex was developed and heavily renovated by businessman R. N. Shetty.',
      image: '/uploads/temples/Murudeshwar Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '08:30 PM',
      specialDarshan: ['Gopura Lift entry ticket', 'Pradosha puja pass'],
      facilities: ['Gopura elevator', 'Beach promenade gardens', 'Seaside dining halls'],
      latitude: 14.0942,
      longitude: 74.4849
    },
    {
      name: 'Ranakpur Jain Temple',
      location: 'Sadri Ranakpur Valley',
      district: 'Pali',
      state: 'Rajasthan',
      description: 'A stunning 15th-century Jain temple constructed entirely in light-colored marble, featuring over 1400 uniquely carved pillars where no two pillars are identical.',
      history: 'Built by Dharna Shah, a Jain businessman, after a divine vision of a celestial vehicle, under the patronage of Rana Kumbha. The temple is dedicated to Adinath, the first Tirthankara.',
      image: '/uploads/temples/Ranakpur Jain Temple.jpg',
      gallery: [],
      openingTime: '06:30 AM',
      closingTime: '08:00 PM',
      specialDarshan: ['Audio Guide Heritage Tour', 'Jain Temple Prarthana Pass'],
      facilities: ['Pure vegetarian dining hall', 'Dharamshala quarters', 'Guides'],
      latitude: 25.1167,
      longitude: 73.4722
    },
    {
      name: 'Yamunotri Temple',
      location: 'Yamunotri, Garhwal Hills',
      district: 'Uttarkashi',
      state: 'Uttarakhand',
      description: 'The sacred source of the river Yamuna, located in the Garhwal Himalayas. The temple contains a black marble idol of the Goddess Yamuna.',
      history: 'Constructed by Maharani Gularia of Jaipur in the 19th century. Devotees cook rice and potatoes in the boiling water of the Surya Kund hot spring as holy prasad.',
      image: '/uploads/temples/Yamunotri Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '08:00 PM',
      specialDarshan: ['VIP Aarti entry', 'Surya Kund Prasad offering ticket'],
      facilities: ['Hot spring baths', 'Pony service tracks', 'First-aid posts'],
      latitude: 31.0100,
      longitude: 78.4500
    },
    {
      name: 'Gangotri Temple',
      location: 'Gangotri, Garhwal Hills',
      district: 'Uttarkashi',
      state: 'Uttarakhand',
      description: 'The holy origin shrine of the River Ganga (Bhagirathi), situated in a picturesque valley amidst snow-capped peaks and pine trees.',
      history: 'Built by Nepalese General Amar Singh Thapa in the early 18th century, marking the place where King Bhagiratha did severe penance to bring the Ganga down to earth.',
      image: '/uploads/temples/Gangotri Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '08:30 PM',
      specialDarshan: ['Ganga Aarti Pass', 'Bhagirathi Seva ticket'],
      facilities: ['Pilgrim rest shelters', 'Hot water taps', 'Medical clinics'],
      latitude: 30.9947,
      longitude: 78.9398
    },
    {
      name: 'Bhimashankar Jyotirlinga',
      location: 'Khed Taluka Sahyadri Hills',
      district: 'Pune',
      state: 'Maharashtra',
      description: 'A highly sacred Jyotirlinga temple situated in the Sahyadri mountains near Pune, surrounded by a dense forest reserve that is home to the giant flying squirrel.',
      history: 'Dating back to the 13th century, with significant stone additions made by Nana Phadnavis in the 18th century. Constructed in the Nagara style of architecture.',
      image: '/uploads/temples/Bhimashankar Jyotirlinga.jpg',
      gallery: [],
      openingTime: '04:30 AM',
      closingTime: '09:30 PM',
      specialDarshan: ['VIP queue ticket', 'Rudrabhishek Puja Pass'],
      facilities: ['Forest walkways', 'Shoe counters', 'Medical post'],
      latitude: 19.0720,
      longitude: 73.5358
    },
    {
      name: 'Khajuraho Lakshmana Temple',
      location: 'Khajuraho Western Group',
      district: 'Chhatarpur',
      state: 'Madhya Pradesh',
      description: 'A majestic 10th-century Hindu temple dedicated to Vaikuntha Vishnu, celebrated globally for its Nagara architecture and beautiful stone reliefs.',
      history: 'Built by the Chandela Kings around 930–950 AD. The temple is part of the Khajuraho Group of Monuments, designated as a UNESCO World Heritage Site.',
      image: '/uploads/temples/Khajuraho Lakshmana Temple.jpg',
      gallery: [],
      openingTime: '06:00 AM',
      closingTime: '06:00 PM',
      specialDarshan: ['Guided Heritage walk pass', 'Evening sound & light ticket'],
      facilities: ['Manicured gardens', 'Foreign exchange center', 'Audio guides'],
      latitude: 24.8519,
      longitude: 79.9214
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
  const dotenvPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }

  const startLocalSeed = async () => {
    await dbConfig.connectDB();
    await seedData();
    process.exit(0);
  };
  startLocalSeed();
} else {
  module.exports = { seedData };
}
