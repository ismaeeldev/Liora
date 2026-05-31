# Complete User Acceptance Testing (UAT) Guide

Welcome to the testing portal for the Behavioral Health Facility Marketplace. This document is an absolute beginner's guide designed to help you test every single page, form, filter, route, and admin interaction on both desktop and mobile viewports.

---

## 📋 PRE-TESTING CHECKLIST
1. **Accessing the Portal**: Open your browser and navigate to the application homepage (locally: `http://localhost:3000`).
2. **Accessing Admin Panel**: 
   - Click the **Admin Access** button in the top-right corner of the navigation bar (or inside the mobile drawer menu on smaller screens).
   - Alternatively, navigate directly to: `http://localhost:3000/admin/login`.
3. **Admin Credentials**: Use the following seeded database test credentials:
   - **Email**: `admissions@phoenixrecovery.com`
   - **Password**: `Phoenix123!`
4. **Simulating Mobile View (Crucial for Mobile UX Tests)**:
   - Right-click anywhere on the page and select **Inspect** (or press `F12`).
   - Click the **Toggle Device Toolbar** icon (looks like a phone/tablet) at the top-left of the inspect panel.
   - Select a device (e.g., **iPhone 12 Pro** or **Pixel 7**) to simulate mobile touch interactions.

---

## 🔍 PHASE 1: HOMEPAGE TESTING (The Gateway)
*Goal: Verify search accuracy, tab syncing, filter applications, and map interactions.*

### Test Case 1.1: Tabbed Category Selection & Search
- **Steps**:
  1. Click on the different category tabs above the search bar: **All Programs**, **Inpatient Rehab**, **Detox Programs**, etc.
  2. Notice the placeholder text in the search input changes dynamically to match the selected category.
  3. Enter a city name (e.g., `Phoenix`) in the search bar.
  4. Select **Detox Programs** and click **Search**.
- **Expected Result**: You should be redirected to the `/listings` page. The search bar should display `Phoenix`, and the listings should filter to show only Detox clinics.

### Test Case 1.2: Homepage Advanced Filters
- **Steps**:
  1. On the homepage, click the **Filters** button next to the search bar.
  2. Select one or more **Accepted Insurances** (e.g., `Aetna`, `Cigna`).
  3. Select one or more **Luxury Amenities** (e.g., `Private Rooms`, `Pet Friendly`).
  4. Click **Apply Filters**, then click **Search**.
- **Expected Result**: You are redirected to `/listings` with the filters applied in the URL search parameters (e.g., `?q=...&insurance=aetna,cigna&amenities=private-room,pet-friendly`), and the cards display only matching clinics.

### Test Case 1.3: Interactive Filter Bar & Map Pins
- **Steps**:
  1. Verify the sticky Filter Bar below the navbar exists and displays options: **Treatment Type**, **Insurance Accepted**, **Availability**, etc.
  2. Click on the Leaflet map pins displayed in the "Explore Care Nationwide" section at the bottom.
- **Expected Result**: Clicking map pins opens Leaflet info popups showing the facility name, monthly pricing, and available beds.

---

## 🗺️ PHASE 2: SEARCH DIRECTORY & MAP VIEW (`/listings`)
*Goal: Test advanced filtering, mobile toggle states, and map-to-card sync.*

### Test Case 2.1: Floating View Toggle on Mobile Viewports
- **Steps**:
  1. Open the inspector and toggle the mobile emulator tool.
  2. Navigate to `/listings`.
  3. Look for the floating **Map View** action pill at the bottom center of the viewport.
  4. Tap **Map View**.
  5. The listing cards should slide away, displaying a full-screen Leaflet map.
  6. Tap the floating **List View** action pill.
- **Expected Result**: The interface toggles smoothly between Map and List views on mobile screens, avoiding cluttered views.

### Test Case 2.2: Map-to-Card Dynamic Sync
- **Steps**:
  1. On desktop view, find a marker on the map.
  2. Click on the marker.
- **Expected Result**: The map automatically pans and zooms closer to the selected marker. In addition, the left-hand listings panel will automatically scroll the matching facility card into view with a smooth scroll animation.

### Test Case 2.3: Multiple Filter Combinations
- **Steps**:
  1. Click **Reset All** (or **Clear All**) to remove any filters.
  2. Under **Treatment Type**, select `Residential / Inpatient`.
  3. Under **Insurance Accepted**, select `Blue Cross Blue Shield` (represented as `bluecross` in search params).
  4. Click **More Filters** and select `Chef-prepared Meals`.
- **Expected Result**: The matching facility count updates immediately in the header text, and only clinics matching all three rules display.

---

## 🏥 PHASE 3: CLINIC DETAIL PAGE (`/facility/[slug]`)
*Goal: Test gallery, room selection, review summaries, and contact forms.*

### Test Case 3.1: Hero Gallery Modal
- **Steps**:
  1. Click on any facility card from the listings page to open its details.
  2. Click on the main feature image in the gallery.
- **Expected Result**: A lightbox modal opens displaying a high-resolution, full-screen slide view of the images.

### Test Case 3.2: Submitting a Patient Lead (Inquiry Form)
- **Steps**:
  1. Scroll down to the **Request Information** form in the right-hand sidebar.
  2. Attempt to submit the form without filling in mandatory fields (Name, Email, Message).
     - *Expected*: Red error messages appear immediately below the empty fields.
  3. Fill out the form with valid information (e.g., Name: `UAT Tester`, Email: `tester@example.com`, Message: `Need immediate bed space details`).
  4. Click **Send Inquiry**.
- **Expected Result**: A green success notification pop-up ("Inquiry Sent Successfully") appears. In the backend, a Nodemailer SMTP transmission is logged and an email notice is sent to the administrator.

---

## 🔐 PHASE 4: SECURED ADMIN PORTAL & CRUD OPERATIONS
*Goal: Verify route shield protection, content moderation, and dashboard metrics.*

### Test Case 4.1: Routing Shield & Authentication
- **Steps**:
  1. Clear your browser cookies or open an Incognito window.
  2. Try to navigate directly to `http://localhost:3000/admin/dashboard`.
- **Expected Result**: The `proxy.ts` router immediately blocks access and redirects you to the login screen at `/admin/login`.
- **Steps**:
  1. Enter invalid login credentials.
     - *Expected*: Red "Invalid credentials" error appears.
  2. Enter the valid test credentials and click **Sign In**.
- **Expected Result**: You are authenticated, a signed JWT cookie (`admin_session`) is set, and you are redirected to the Console Overview.

### Test Case 4.2: Creating a New Facility listing
- **Steps**:
  1. Go to the **Facilities** tab in the sidebar.
  2. Click the **Add New Facility** button at the top right.
     - *Verify*: The URL points to `/admin/dashboard/facilities/new`.
  3. Fill out the form. Ensure you enter a unique URL Slug (e.g., `uat-recovery-resort`).
  4. Choose assigned categories and services by clicking the toggle pill buttons.
  5. Add one or two image URLs and click **Create Facility**.
- **Expected Result**: The form submits, redirects you to the listings tab, and the new recovery center appears in the managed list.

### Test Case 4.3: Editing & Deleting Facility listings
- **Steps**:
  1. Locate the new facility you created in the managed table.
  2. Click **Edit** next to it.
  3. Change the monthly price and total bed counts, then click **Save Changes**.
     - *Expected*: The dashboard updates the metrics, and details are updated.
  4. Click **Delete** next to the facility.
  5. Click **Cancel** on the confirmation popup first to ensure it remains active.
  6. Click **Delete** again, and click **OK**.
- **Expected Result**: The facility is immediately purged from the database, and the listing disappears from the overview table.

### Test Case 4.4: Moderate Patient inquiries
- **Steps**:
  1. Go to the **Inquiries** tab in the admin sidebar.
  2. Locate the UAT inquiry you submitted in Test Case 3.2.
  3. Click **Open Details**.
  4. Click **Mark Contacted**.
- **Expected Result**: The status badge updates to a green "Contacted" badge instantly, updating the live records.
