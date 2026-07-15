const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('==================================================');
  console.log('   STARTING AUTOMATED E2E INTEGRATION TEST SUITE   ');
  console.log('==================================================\n');

  let devoteeToken = '';
  let adminToken = '';
  let testUserId = '';
  let firstTempleId = '';
  let firstSlotId = '';
  let testBookingId = '';
  let testBookingDocId = '';

  const randEmail = `test_devotee_${Math.floor(1000 + Math.random() * 9000)}@test.com`;

  try {
    // 1. Test Devotee Registration
    console.log('[TEST 1] Registering a new Devotee user...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'E2E Test Pilgrim',
        email: randEmail,
        phone: '9898989898',
        password: 'password123',
        role: 'USER'
      })
    });
    const regJson = await regRes.json();
    if (regJson.success) {
      console.log('✅ Registration SUCCESS!');
      devoteeToken = regJson.accessToken;
      testUserId = regJson.user.id;
      console.log(`Registered Email: ${randEmail}`);
    } else {
      throw new Error(`Registration failed: ${regJson.message}`);
    }

    // 2. Test User Login
    console.log('\n[TEST 2] Logging in as the registered Devotee...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randEmail,
        password: 'password123'
      })
    });
    const loginJson = await loginRes.json();
    if (loginJson.success) {
      console.log('✅ Login SUCCESS!');
      devoteeToken = loginJson.accessToken;
    } else {
      throw new Error(`Login failed: ${loginJson.message}`);
    }

    // 3. Test Temple Listing
    console.log('\n[TEST 3] Fetching temple listings...');
    const templeRes = await fetch(`${API_URL}/temples`);
    const templeJson = await templeRes.json();
    if (templeJson.success && templeJson.temples.length > 0) {
      console.log(`✅ Temple fetch SUCCESS! Found ${templeJson.temples.length} temples.`);
      firstTempleId = templeJson.temples[0]._id;
      console.log(`Target Temple: ${templeJson.temples[0].name}`);
    } else {
      throw new Error('Temple list fetch failed or returned empty');
    }

    // 4. Test Slot Availability
    console.log('\n[TEST 4] Retrieving slot timings for temple...');
    const slotRes = await fetch(`${API_URL}/slots/temple/${firstTempleId}`);
    const slotJson = await slotRes.json();
    if (slotJson.success && slotJson.slots.length > 0) {
      const activeSlot = slotJson.slots.find(s => s.status === 'Active');
      if (activeSlot) {
        firstSlotId = activeSlot._id;
        console.log(`✅ Slot fetch SUCCESS! Found active slot: ${activeSlot.time} (Price: ₹${activeSlot.price})`);
      } else {
        throw new Error('No active slots found');
      }
    } else {
      throw new Error('Slot details fetch failed');
    }

    // 5. Test Darshan Slot Booking
    console.log('\n[TEST 5] Booking tickets for 2 pilgrims...');
    const bookRes = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${devoteeToken}`
      },
      body: JSON.stringify({
        templeId: firstTempleId,
        slotId: firstSlotId,
        persons: [
          { name: 'Traveller One', age: 32, gender: 'Male' },
          { name: 'Traveller Two', age: 28, gender: 'Female' }
        ],
        paymentMethod: 'UPI'
      })
    });
    const bookJson = await bookRes.json();

    if (bookJson.success) {
      testBookingId = bookJson.booking.bookingId;
      testBookingDocId = bookJson.booking._id;
      console.log(`✅ Booking SUCCESS! Ticket Generated: ${testBookingId}`);
    } else {
      throw new Error(`Booking transaction failed: ${bookJson.message}`);
    }

    // 6. Test Devotee Notifications
    console.log('\n[TEST 6] Fetching devotee notifications log...');
    const notifRes = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${devoteeToken}` }
    });
    const notifJson = await notifRes.json();
    if (notifJson.success) {
      console.log(`✅ Notifications SUCCESS! Total logs: ${notifJson.notifications.length}`);
      console.log(`Latest notification: "${notifJson.notifications[0].title} - ${notifJson.notifications[0].message}"`);
    } else {
      throw new Error('Failed to load notifications');
    }

    // 7. Test Charitable Donation
    console.log('\n[TEST 7] Contributing ₹1001 donation to temple...');
    const donateRes = await fetch(`${API_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${devoteeToken}`
      },
      body: JSON.stringify({
        templeId: firstTempleId,
        amount: 1001,
        paymentMethod: 'UPI'
      })
    });
    const donateJson = await donateRes.json();
    if (donateJson.success) {
      console.log(`✅ Donation SUCCESS! Receipt TXN generated: ${donateJson.donation.transactionId}`);
    } else {
      throw new Error('Donation failed');
    }

    // 8. Test Admin Login & Stats Panel
    console.log('\n[TEST 8] Logging in as Admin & loading dashboard metrics...');
    const adminLogin = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@darshanease.com',
        password: 'admin123'
      })
    });
    const adminLoginJson = await adminLogin.json();
    if (adminLoginJson.success) {
      adminToken = adminLoginJson.accessToken;
      console.log('✅ Admin login SUCCESS!');
      
      const statsRes = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        console.log('✅ Admin stats fetch SUCCESS!');
        console.log('Current System Metrics:');
        console.log(` - Total Registered Users: ${statsJson.stats.users}`);
        console.log(` - Total Temples: ${statsJson.stats.temples}`);
        console.log(` - Total Revenue Aggregated: ₹${statsJson.stats.totalRevenue}`);
      }
    } else {
      throw new Error('Admin authentication failed');
    }

    // 9. Test QR entry verification
    console.log('\n[TEST 9] Simulating QR ticket validation at entry gate...');
    const qrVerifyRes = await fetch(`${API_URL}/bookings/verify-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        bookingId: testBookingId
      })
    });
    const qrVerifyJson = await qrVerifyRes.json();
    if (qrVerifyJson.success) {
      console.log('✅ QR Code Verification SUCCESS!');
      console.log(`Gate scan result: Devotee "${qrVerifyJson.details.devotee}" entry APPROVED for ${qrVerifyJson.details.templeName}`);
    } else {
      throw new Error('QR verification failed');
    }

    // 10. Test Cancel Booking & Seat Restore
    console.log('\n[TEST 10] Cancelling devotee booking and checking seat restoration...');
    
    // Check available seats BEFORE cancellation
    const slotBeforeRes = await fetch(`${API_URL}/slots/temple/${firstTempleId}`);
    const slotBeforeJson = await slotBeforeRes.json();
    const slotBefore = slotBeforeJson.slots.find(s => s._id === firstSlotId);
    const seatsBefore = slotBefore.availableSeats;
    
    // Perform cancellation
    const cancelRes = await fetch(`${API_URL}/bookings/${testBookingDocId}/cancel`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${devoteeToken}` }
    });
    const cancelJson = await cancelRes.json();
    
    if (cancelJson.success) {
      console.log('✅ Booking cancellation SUCCESS!');
      
      // Check available seats AFTER cancellation
      const slotAfterRes = await fetch(`${API_URL}/slots/temple/${firstTempleId}`);
      const slotAfterJson = await slotAfterRes.json();
      const slotAfter = slotAfterJson.slots.find(s => s._id === firstSlotId);
      const seatsAfter = slotAfter.availableSeats;

      console.log(` - Seats before cancellation: ${seatsBefore}`);
      console.log(` - Seats after cancellation: ${seatsAfter}`);
      if (seatsAfter === seatsBefore + 2) {
        console.log('✅ SEAT RESTORATION SUCCESS! 2 seats restored correctly.');
      } else {
        throw new Error('Seats were not restored correctly');
      }
    } else {
      throw new Error(`Cancellation failed: ${cancelJson.message}`);
    }

    console.log('\n==================================================');
    console.log('    CONGRATULATIONS: ALL E2E TESTS PASSED 100%     ');
    console.log('==================================================');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILURE Encountered:');
    console.error(err.message);
    process.exit(1);
  }
};

runTests();
