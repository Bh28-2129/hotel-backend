// Rooms JS

let allRooms = [];
const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);

// Load rooms on page load
document.addEventListener('DOMContentLoaded', () => {
  loadRooms();
  setupFilters();
  setupBookingForm();
  hideDateFilters();
  relaxBookingFields();
});

// Load all rooms
async function loadRooms() {
  try {
    const data = await apiRequest('/rooms');
    allRooms = data.data || [];
    console.log('✓ Rooms loaded:', allRooms.length, 'rooms');
    allRooms.forEach(room => {
      console.log(`  - Room ${room.roomNumber}: Type="${room.roomType}", Capacity=${room.capacity}, Price=$${room.pricePerNight}`);
    });
    // If no rooms exist, trigger seed endpoint once then reload list
    if (allRooms.length === 0) {
      console.warn('No rooms found. Seeding sample rooms...');
      await seedRoomsAndReload();
      return;
    }

    displayRooms(allRooms);
  } catch (error) {
    console.error('✗ Error loading rooms:', error);
  }
}

// Seed sample rooms when database is empty
let hasSeeded = false;
async function seedRoomsAndReload() {
  if (hasSeeded) {
    console.warn('Seed already attempted. Skipping.');
    displayRooms([]);
    return;
  }

  hasSeeded = true;
  try {
    await apiRequest('/seed-rooms');
    console.log('✓ Seeded sample rooms. Reloading...');
    await loadRooms();
  } catch (error) {
    console.error('✗ Failed to seed rooms:', error);
    displayRooms([]);
  }
}

// Display rooms
function displayRooms(rooms) {
  const container = document.getElementById('roomsContainer');
  if (!container) return;

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          No rooms available at the moment. Please try again later.
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = rooms.map(room => {
    const imageUrl = room.images && room.images.length > 0 ? room.images[0] : `https://via.placeholder.com/400x250?text=${room.roomType}`;
    return `
    <div class="col-md-6 col-lg-4">
      <div class="card room-card shadow-sm h-100">
        <img src="${imageUrl}" alt="${room.roomNumber}" class="card-img-top room-image">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="card-title mb-0">Room ${room.roomNumber}</h5>
            <span class="badge bg-primary">${room.roomType}</span>
          </div>
          <p class="text-muted small mb-2">Capacity: ${room.capacity} guests</p>
          <p class="card-text">${room.description || 'Comfortable room with modern amenities'}</p>
          <div class="mb-3">
            <strong class="text-primary">${formatINR(room.pricePerNight * 1000)}</strong>
            <span class="text-muted">/night</span>
          </div>
          <button class="btn btn-primary w-100" onclick="bookRoom('${room._id}')">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

// Book room
function bookRoom(roomId) {
  const room = allRooms.find(r => r._id === roomId);
  if (!room) return;

  // Set hidden field with room ID
  document.getElementById('bookingRoomId').value = roomId;
  document.getElementById('bookingRoomNumber').textContent = room.roomNumber;

  // Show booking modal
  const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
  bookingModal.show();
}

// Setup booking form
function setupBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roomId = document.getElementById('bookingRoomId').value;
    const checkInInput = document.getElementById('bookingCheckInDate');
    const checkOutInput = document.getElementById('bookingCheckOutDate');
    const guestsInput = document.getElementById('bookingNumberOfGuests');

    // Default dates if not provided
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkInDate = checkInInput?.value || today.toISOString().split('T')[0];
    const checkOutDate = checkOutInput?.value || tomorrow.toISOString().split('T')[0];
    const numberOfGuests = guestsInput?.value || 1;

    await createBooking(roomId, checkInDate, checkOutDate, numberOfGuests);
  });
}

// Hide date filters since booking without check-in/out selection
function hideDateFilters() {
  const checkInFilter = document.getElementById('checkInFilter');
  const checkOutFilter = document.getElementById('checkOutFilter');
  if (checkInFilter?.parentElement) checkInFilter.parentElement.style.display = 'none';
  if (checkOutFilter?.parentElement) checkOutFilter.parentElement.style.display = 'none';
}

// Make booking modal fields non-required and optional
function relaxBookingFields() {
  ['bookingCheckInDate', 'bookingCheckOutDate', 'bookingNumberOfGuests'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.removeAttribute('required');
    }
  });
}

// Show booking alert
function showBookingAlert(message, type = 'info') {
  const alertDiv = document.getElementById('bookingAlert');
  alertDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

// Create booking
async function createBooking(roomId, checkInDate, checkOutDate, numberOfGuests) {
  try {
    const data = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        checkInDate,
        checkOutDate,
        numberOfGuests: parseInt(numberOfGuests)
      })
    });

    showBookingAlert('Booking created successfully! Redirecting...', 'success');
    
    // Clear form
    document.getElementById('bookingForm').reset();
    
    // Close modal after 2 seconds
    setTimeout(() => {
      const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
      if (bookingModal) bookingModal.hide();
      window.location.href = 'bookings.html';
    }, 2000);
  } catch (error) {
    showBookingAlert('Error creating booking: ' + error.message, 'danger');
  }
}

// Setup filters
function setupFilters() {
  const roomTypeFilter = document.getElementById('roomTypeFilter');
  const maxPriceFilter = document.getElementById('maxPriceFilter');
  const checkInFilter = document.getElementById('checkInFilter');
  const checkOutFilter = document.getElementById('checkOutFilter');

  console.log('Setting up filters...');
  console.log('roomTypeFilter:', roomTypeFilter);

  if (roomTypeFilter) {
    roomTypeFilter.addEventListener('change', function() {
      console.log('Room type changed to:', this.value);
      applyFilters();
    });
  }
  if (maxPriceFilter) {
    maxPriceFilter.addEventListener('change', applyFilters);
  }
  if (checkInFilter) {
    checkInFilter.addEventListener('change', applyFilters);
  }
  if (checkOutFilter) {
    checkOutFilter.addEventListener('change', applyFilters);
  }
}

// Apply filters
function applyFilters() {
  const roomTypeSelect = document.getElementById('roomTypeFilter');
  const maxPriceInput = document.getElementById('maxPriceFilter');
  
  const selectedType = roomTypeSelect ? roomTypeSelect.value.trim() : '';
  const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) : Infinity;

  console.log('\n🔍 APPLYING FILTERS:');
  console.log('  Selected Type:', `"${selectedType}"`, `(length: ${selectedType.length})`);
  console.log('  Max Price:', maxPrice);
  console.log('  Total Rooms:', allRooms.length);

  if (allRooms.length === 0) {
    console.log('  ⚠️ No rooms loaded!');
    displayRooms([]);
    return;
  }

  let filtered = allRooms;

  // Filter by type if selected
  if (selectedType && selectedType !== '') {
    console.log(`  Filtering by type: "${selectedType}"`);
    filtered = filtered.filter(room => {
      const roomTypeNormalized = room.roomType.toLowerCase().trim();
      const selectedTypeNormalized = selectedType.toLowerCase().trim();
      const matches = roomTypeNormalized === selectedTypeNormalized;
      if (matches) {
        console.log(`    ✓ Room ${room.roomNumber} (${room.roomType}) MATCHES`);
      }
      return matches;
    });
    console.log(`  After type filter: ${filtered.length} rooms`);
  }

  // Filter by price
  if (maxPrice && maxPrice !== Infinity) {
    filtered = filtered.filter(room => room.pricePerNight <= maxPrice);
    console.log(`  After price filter: ${filtered.length} rooms`);
  }

  console.log('  📊 Final Result:', filtered.length, 'rooms');
  console.log('');

  displayRooms(filtered);
}
