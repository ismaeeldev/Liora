import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting seeding of Phoenix area healthcare facilities...");

  // 1. Clean existing records (avoid duplicate key violations)
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.facilityImage.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.facilityCategory.deleteMany();
  await prisma.facilityService.deleteMany();
  await prisma.adminUser.deleteMany();

  const now = new Date();

  // 2. Create Owner/Admin User
  const passwordHash = await bcrypt.hash("Phoenix123!", 10);
  const owner = await prisma.adminUser.create({
    data: {
      email: "admissions@phoenixrecovery.com",
      name: "Phoenix Care Admissions Team",
      password: passwordHash,
      role: "OWNER",
      createdAt: now,
      updatedAt: now,
    },
  });

  // 3. Create Categories
  const catDetox = await prisma.facilityCategory.create({
    data: { name: "Detox", slug: "detox", description: "Medical detoxification services", createdAt: now, updatedAt: now },
  });
  const catResidential = await prisma.facilityCategory.create({
    data: { name: "Residential", slug: "residential", description: "Inpatient residential rehab stays", createdAt: now, updatedAt: now },
  });
  const catMentalHealth = await prisma.facilityCategory.create({
    data: { name: "Mental Health", slug: "mental-health", description: "Psychiatric & behavioral wellness programs", createdAt: now, updatedAt: now },
  });
  const catIOP = await prisma.facilityCategory.create({
    data: { name: "IOP", slug: "iop", description: "Intensive Outpatient Programs", createdAt: now, updatedAt: now },
  });

  // 4. Create Services
  const servicesData = [
    { name: "Medical Detoxification", slug: "medical-detox", category: "Clinical Care", iconName: "detox", createdAt: now, updatedAt: now },
    { name: "Individual CBT/DBT Therapy", slug: "cbt-dbt", category: "Clinical Care", iconName: "therapy", createdAt: now, updatedAt: now },
    { name: "Medication Assisted Treatment (MAT)", slug: "mat", category: "Clinical Care", iconName: "medical", createdAt: now, updatedAt: now },
    { name: "Group Therapy Workshops", slug: "group-therapy", category: "Program Services", iconName: "group", createdAt: now, updatedAt: now },
    { name: "Family Counselling Sessions", slug: "family-counselling", category: "Program Services", iconName: "family", createdAt: now, updatedAt: now },
    { name: "Relapse Prevention Seminars", slug: "relapse-prevention", category: "Program Services", iconName: "aftercare", createdAt: now, updatedAt: now },
    { name: "Patient Transportation Services", slug: "transportation", category: "Lifestyle Support", iconName: "transport", createdAt: now, updatedAt: now },
    { name: "Chef-Prepared Nutritional Meals", slug: "chef-meals", category: "Lifestyle Support", iconName: "meals", createdAt: now, updatedAt: now },
    { name: "Aftercare & Sober Living Match", slug: "aftercare-living", category: "Lifestyle Support", iconName: "aftercare", createdAt: now, updatedAt: now },
  ];

  const dbServices = [];
  for (const s of servicesData) {
    const created = await prisma.facilityService.create({ data: s });
    dbServices.push(created);
  }

  // Helper arrays for review generation
  const reviewAuthors = [
    "Sarah Jenkins", "David Miller", "Amanda R.", "Robert H.", "Elizabeth Cole",
    "Michael Vance", "Jessica L.", "James K.", "Patricia G.", "Christopher M.",
    "Linda W.", "Thomas B.", "Barbara D.", "Daniel S.", "Nancy J.",
    "Matthew F.", "Karen K.", "Donald P.", "Lisa R.", "Paul N.",
    "Betty T.", "Mark E.", "Sandra S.", "George G.", "Ashley C.",
    "Kenneth L.", "Dorothy A.", "Steven H.", "Emily O.", "Frank B."
  ];

  const reviewComments = [
    "The clinical care I received was absolutely top-notch. The therapists truly understood my dual diagnosis and gave me tools to succeed.",
    "Beautiful environment and supportive staff. The medical detox team kept me safe and comfortable throughout the hardest phase.",
    "Life-changing experience. Highly recommend their inpatient rehab programs for anyone looking for holistic and medical healing.",
    "The group therapy sessions were incredibly helpful. It was great to connect with others on a similar journey to recovery.",
    "Excellent facility with dedicated doctors. The chef-prepared meals and peaceful scenery made a huge difference in my healing.",
    "Professional, empathetic staff who go above and beyond. The sober living transition planning was seamless and very supportive.",
    "Clean rooms, great amenities, and solid clinical support. They helped me get my life back on track when I hit rock bottom.",
    "Outstanding psychiatric care. The trauma-informed approach helped me address core issues I had been ignoring for years.",
    "Wonderful outpatient program. I was able to maintain my work schedule while receiving high-quality CBT/DBT clinical care.",
    "Incredible staff who coordinated perfectly with my private insurance provider. Felt supported from the initial intake call."
  ];

  // 10 Phoenix Facilities Data
  const facilitiesData = [
    {
      name: "Phoenix Recovery & Wellness Center",
      slug: "phoenix-recovery",
      description: "A premier luxury behavioral wellness resort located in the scenic desert of Phoenix, AZ. Offering client-focused rehabilitation, medical detox support, and clinical healing programs in a peaceful, supportive setting.",
      address: "10220 N 25th Ave",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85021",
      latitude: 33.5794,
      longitude: -112.1124,
      phone: "602-555-0101",
      website: "https://phoenixrecoverycenter.com",
      isVerified: true,
      priceMin: 7500,
      priceMax: 11000,
      bedsCount: 16,
      bedsAvailable: 4,
      insuranceAccepted: "Accepts Aetna, BCBS, Cigna, Humana",
      genderSupport: "Co-Ed / All Genders Welcome",
      sameDayAdmission: true,
      licenseStatus: "Active State License: #AZ-9874-H",
      conditionsTreated: ["Substance Abuse", "Alcohol Addiction", "PTSD & Trauma", "Depression", "Anxiety Disorders", "Co-occurring Disorders"],
      isFeatured: true,
      categoryId: catResidential.id,
      imageUrls: ["/images/wellness_hero_bg.png", "/images/clinic_one.png", "/images/clinic_two.png"],
    },
    {
      name: "Desert Cove Medical Detox",
      slug: "desert-cove-detox",
      description: "A medical detox clinic in Scottsdale specializing in safe, supervised chemical withdrawal and physical stabilization.",
      address: "15215 N Kierland Blvd",
      city: "Scottsdale",
      state: "AZ",
      zipCode: "85254",
      latitude: 33.6247,
      longitude: -111.9301,
      phone: "480-555-0102",
      website: "https://desertcovedetox.com",
      isVerified: true,
      priceMin: 9000,
      priceMax: 13500,
      bedsCount: 10,
      bedsAvailable: 2,
      insuranceAccepted: "Accepts Aetna, BCBS, UnitedHealth",
      genderSupport: "Co-Ed Programs",
      sameDayAdmission: true,
      licenseStatus: "Active DHS License: #AZ-1209-D",
      conditionsTreated: ["Alcohol Detox", "Opioid Withdrawal", "Prescription Drug Abuse"],
      isFeatured: true,
      categoryId: catDetox.id,
      imageUrls: ["/images/wellness_hero_bg.png"],
    },
    {
      name: "Camelback Mental Health Clinic",
      slug: "camelback-mental-health",
      description: "Comprehensive inpatient and outpatient behavioral health care, psychiatric support, and trauma-informed therapies.",
      address: "5055 N 12th St",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85014",
      latitude: 33.5103,
      longitude: -112.0561,
      phone: "602-555-0103",
      website: "https://camelbackmentalhealth.com",
      isVerified: true,
      priceMin: 5500,
      priceMax: 8200,
      bedsCount: 22,
      bedsAvailable: 6,
      insuranceAccepted: "Aetna, Cigna, Humana, Medicare",
      genderSupport: "All Genders Welcome",
      sameDayAdmission: true,
      licenseStatus: "Active Board License: #AZ-3341-MH",
      conditionsTreated: ["Depression", "Bipolar Disorder", "PTSD & Trauma", "Anxiety Disorders"],
      isFeatured: true,
      categoryId: catMentalHealth.id,
      imageUrls: ["/images/clinic_one.png"],
    },
    {
      name: "Valley Hope Outpatient Care",
      slug: "valley-hope-iop",
      description: "Intensive outpatient counseling, CBT sessions, group therapy, and career rehabilitation support.",
      address: "2415 W Colter St",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85015",
      latitude: 33.5186,
      longitude: -112.1105,
      phone: "602-555-0104",
      website: "https://valleyhopephoenix.com",
      isVerified: true,
      priceMin: 3200,
      priceMax: 5000,
      bedsCount: 0,
      bedsAvailable: 0,
      insuranceAccepted: "Accepts Most Private Insurances",
      genderSupport: "Co-Ed Programs",
      sameDayAdmission: false,
      licenseStatus: "State Health License: #AZ-5521",
      conditionsTreated: ["Substance Abuse", "Relapse Prevention", "Family Support"],
      isFeatured: false,
      categoryId: catIOP.id,
      imageUrls: ["/images/clinic_two.png"],
    },
    {
      name: "Scottsdale Recovery Mansion",
      slug: "scottsdale-mansion",
      description: "An ultra-luxury executive inpatient resort offering private suites, personal chefs, and top accreditation.",
      address: "8600 E Shoal Creek",
      city: "Scottsdale",
      state: "AZ",
      zipCode: "85258",
      latitude: 33.5732,
      longitude: -111.9001,
      phone: "480-555-0105",
      website: "https://scottsdalemansionrehab.com",
      isVerified: true,
      priceMin: 15000,
      priceMax: 25000,
      bedsCount: 8,
      bedsAvailable: 1,
      insuranceAccepted: "Accepts Out-of-Network Private",
      genderSupport: "Co-Ed / All Genders",
      sameDayAdmission: true,
      licenseStatus: "Accredited Luxury Facility: #AZ-8812",
      conditionsTreated: ["Addiction Rehabilitation", "Executive Burnout", "Dual Diagnosis"],
      isFeatured: true,
      categoryId: catResidential.id,
      imageUrls: ["/images/wellness_hero_bg.png", "/images/clinic_one.png"],
    },
    {
      name: "Phoenix Medical Detox Center",
      slug: "phoenix-medical-detox",
      description: "State-of-the-art medical detox facilities providing 24/7 nursing care and physician supervision.",
      address: "4045 E Bell Rd",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85032",
      latitude: 33.6398,
      longitude: -111.9934,
      phone: "602-555-0106",
      website: "https://phoenixmeddetox.com",
      isVerified: true,
      priceMin: 11000,
      priceMax: 16000,
      bedsCount: 14,
      bedsAvailable: 3,
      insuranceAccepted: "Aetna, BCBS, Cigna",
      genderSupport: "Co-Ed",
      sameDayAdmission: true,
      licenseStatus: "Active DHS License: #AZ-7762",
      conditionsTreated: ["Alcohol Detox", "Prescription Drug Abuse", "Medical Stabilization"],
      isFeatured: true,
      categoryId: catDetox.id,
      imageUrls: ["/images/wellness_hero_bg.png"],
    },
    {
      name: "Biltmore Wellness Resort",
      slug: "biltmore-wellness",
      description: "Luxury behavioral healing programs and physical wellness training in the historic Biltmore area.",
      address: "2400 E Missouri Ave",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85016",
      latitude: 33.5072,
      longitude: -112.0298,
      phone: "602-555-0107",
      website: "https://biltmorewellness.com",
      isVerified: true,
      priceMin: 12500,
      priceMax: 19000,
      bedsCount: 12,
      bedsAvailable: 2,
      insuranceAccepted: "Accepts Aetna, BCBS, Cigna",
      genderSupport: "Co-Ed Programs",
      sameDayAdmission: true,
      licenseStatus: "Accredited State License: #AZ-9982",
      conditionsTreated: ["Substance Abuse", "Co-occurring Disorders", "Anxiety Disorders"],
      isFeatured: true,
      categoryId: catResidential.id,
      imageUrls: ["/images/clinic_one.png", "/images/clinic_two.png"],
    },
    {
      name: "Sonoran Desert Rehab",
      slug: "sonoran-desert-rehab",
      description: "Affordable inpatient rehabilitation offering community living, group support, and clinical healing.",
      address: "1201 E Sonoran Desert Dr",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85085",
      latitude: 33.7483,
      longitude: -112.0556,
      phone: "602-555-0108",
      website: "https://sonoranrehab.com",
      isVerified: true,
      priceMin: 6800,
      priceMax: 9500,
      bedsCount: 20,
      bedsAvailable: 5,
      insuranceAccepted: "BCBS, Cigna, Humana, Medicaid",
      genderSupport: "All Genders Welcome",
      sameDayAdmission: true,
      licenseStatus: "State License: #AZ-4421-R",
      conditionsTreated: ["Substance Abuse", "Alcohol Addiction", "Depression"],
      isFeatured: false,
      categoryId: catResidential.id,
      imageUrls: ["/images/wellness_hero_bg.png"],
    },
    {
      name: "Arcadia Psychiatric & Trauma Center",
      slug: "arcadia-psychiatric",
      description: "Specialized clinical trauma therapy, PTSD counselors, and dual diagnosis support in Arcadia.",
      address: "4455 E Camelback Rd",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85018",
      latitude: 33.5098,
      longitude: -111.9842,
      phone: "602-555-0109",
      website: "https://arcadiapsychiatric.com",
      isVerified: true,
      priceMin: 8900,
      priceMax: 13000,
      bedsCount: 15,
      bedsAvailable: 3,
      insuranceAccepted: "Aetna, BCBS, Cigna, UnitedHealth",
      genderSupport: "All Genders Welcome",
      sameDayAdmission: true,
      licenseStatus: "DHS Inpatient License: #AZ-8813",
      conditionsTreated: ["PTSD & Trauma", "Depression", "Co-occurring Disorders"],
      isFeatured: true,
      categoryId: catMentalHealth.id,
      imageUrls: ["/images/clinic_two.png"],
    },
    {
      name: "Aura IOP Care Scottsdale",
      slug: "aura-iop-scottsdale",
      description: "Convenient outpatient therapy, group counseling workshops, and sober living match arrangements.",
      address: "7301 E 2nd St",
      city: "Scottsdale",
      state: "AZ",
      zipCode: "85251",
      latitude: 33.4925,
      longitude: -111.9238,
      phone: "480-555-0110",
      website: "https://auraiopscottsdale.com",
      isVerified: true,
      priceMin: 2800,
      priceMax: 4200,
      bedsCount: 0,
      bedsAvailable: 0,
      insuranceAccepted: "Accepts Most Private Insurances",
      genderSupport: "Co-Ed / LGBTQ+ Focused",
      sameDayAdmission: true,
      licenseStatus: "Outpatient Provider License: #AZ-1129",
      conditionsTreated: ["Substance Abuse", "Addiction Recovery", "Relapse Prevention"],
      isFeatured: false,
      categoryId: catIOP.id,
      imageUrls: ["/images/clinic_one.png"],
    }
  ];

  let reviewIndex = 0;

  for (const fData of facilitiesData) {
    const { categoryId, imageUrls, ...facilityFields } = fData;

    // Create the facility
    const facility = await prisma.facility.create({
      data: {
        ...facilityFields,
        ownerId: owner.id,
        createdAt: now,
        updatedAt: now,
        categories: { connect: [{ id: categoryId }] },
        services: {
          connect: dbServices.map(s => ({ id: s.id })) // Connect all services
        }
      }
    });

    // Create image records
    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.facilityImage.create({
        data: {
          url: imageUrls[i],
          altText: `${facility.name} Image ${i + 1}`,
          isPrimary: i === 0,
          facilityId: facility.id,
          createdAt: now,
          updatedAt: now,
        }
      });
    }

    // Create exactly 3 approved reviews for each of the 10 facilities (30 reviews total)
    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const author = reviewAuthors[reviewIndex % reviewAuthors.length];
      const comment = reviewComments[reviewIndex % reviewComments.length];
      const rating = 4 + (reviewIndex % 2) * 1; // Generates 4s and 5s
      
      await prisma.review.create({
        data: {
          authorName: author,
          authorEmail: `${author.toLowerCase().replace(/ /g, ".")}@example.com`,
          rating: rating,
          comment: comment,
          isApproved: true,
          facilityId: facility.id,
          createdAt: now,
          updatedAt: now,
        }
      });
      
      reviewIndex++;
    }
  }

  console.log("Seeding of 10 facilities and 30 reviews in Phoenix area completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
