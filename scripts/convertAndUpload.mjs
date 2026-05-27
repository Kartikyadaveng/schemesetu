import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const newSchemesRaw = [
  {
    "title": "Atal Pension Yojana",
    "titleHindi": "अटल पेंशन योजना",
    "category": "senior-citizens",
    "benefit": "Monthly pension of ₹1,000 to ₹5,000 from age 60",
    "description": "Atal Pension Yojana (APY) is a government-backed pension scheme for unorganized sector workers. Subscribers receive a guaranteed minimum monthly pension of ₹1,000 to ₹5,000 depending on their contributions. The government co-contributes 50% of the contribution or ₹1,000 per year, whichever is lower, for subscribers who join before December 31, 2015 and are not income-tax payers. The scheme is administered by the Pension Fund Regulatory and Development Authority (PFRDA) and is open to all Indian citizens aged 18-40 years.",
    "benefits": [
      "Guaranteed monthly pension of ₹1,000/₹2,000/₹3,000/₹4,000/₹5,000 after 60 years of age",
      "Government co-contribution of 50% of contribution or ₹1,000/year (whichever is lower) for eligible subscribers",
      "Pension is guaranteed for lifetime of subscriber",
      "After subscriber's death, spouse gets same pension",
      "After both pass away, corpus returned to nominee",
      "Tax benefits under Section 80CCD of Income Tax Act",
      "Choice of pension amount (5 slabs) based on contribution period"
    ],
    "eligibility": [
      "Must be an Indian citizen",
      "Age between 18 and 40 years at time of joining",
      "Must have a savings bank account",
      "Aadhaar card mandatory",
      "Mobile number linked to Aadhaar"
    ],
    "documents": [
      "Aadhaar Card",
      "Savings Bank Account Passbook",
      "Mobile Number linked to Aadhaar",
      "Passport size photographs",
      "Nominee details and photo"
    ],
    "deadline": "Open - No deadline (ongoing scheme)",
    "ministry": "Ministry of Finance (Department of Financial Services)",
    "officialLink": "https://npscra.nsdl.co.in/nsdl/APY/Index",
    "tags": ["pension", "senior citizens", "retirement", "social security", "unorganized sector", "monthly income"],
    "state": "All India",
    "searchKeywords": ["atal pension yojana", "apy", "pension scheme", "retirement pension", "monthly pension", "old age pension", "unorganized worker pension"]
  },
  {
    "title": "Pradhan Mantri Suraksha Bima Yojana",
    "titleHindi": "प्रधानमंत्री सुरक्षा बीमा योजना",
    "category": "insurance",
    "benefit": "Accident insurance cover of ₹2 lakh at just ₹20/year",
    "description": "Pradhan Mantri Suraksha Bima Yojana (PMSBY) is a government-backed accident insurance scheme available to all bank account holders aged 18-70 years. It offers accidental death and disability cover of ₹2 lakh (₹1 lakh for partial disability) at a nominal premium of just ₹20 per annum. The premium is auto-debited from the subscriber's bank account annually. The scheme is administered through public sector general insurance companies and runs from June 1 to May 31 each year.",
    "benefits": [
      "Accidental death cover: ₹2,00,000",
      "Permanent total disability cover: ₹2,00,000",
      "Permanent partial disability cover: ₹1,00,000",
      "Very low premium: just ₹20 per year",
      "Auto-renewal from bank account",
      "Coverage for all death and disability due to accident",
      "Available to all bank account holders"
    ],
    "eligibility": [
      "Indian citizen",
      "Age between 18 and 70 years",
      "Must have a savings bank account linked to Aadhaar",
      "Must provide consent for auto-debit of premium"
    ],
    "documents": [
      "Aadhaar Card",
      "Bank Account with Aadhaar linkage",
      "Mobile Number"
    ],
    "deadline": "Open enrollment - covers June 1 to May 31 annually",
    "ministry": "Ministry of Finance (Department of Financial Services)",
    "officialLink": "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/PMSBY",
    "tags": ["insurance", "accident cover", "disability", "social security", "bank account", "affordable"],
    "state": "All India",
    "searchKeywords": ["pmsby", "suraksha bima yojana", "accident insurance", "personal accident", "disability cover", "₹20 insurance"]
  },
  {
    "title": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    "titleHindi": "प्रधानमंत्री जीवन ज्योति बीमा योजना",
    "category": "insurance",
    "benefit": "Life insurance cover of ₹2 lakh at just ₹436/year",
    "description": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) is a government-backed life insurance scheme offering a renewable one-year life cover of ₹2 lakh to all savings bank account holders aged 18-50 years at a premium of ₹436 per annum. The premium is auto-debited from the subscriber's account. In case of death of the insured (due to any cause), the nominee receives ₹2 lakh. The scheme is administered by LIC and other life insurers.",
    "benefits": [
      "Life cover of ₹2,00,000 for death due to any reason",
      "Very low premium: ₹436 per year (less than ₹37/month)",
      "Auto-renewal through bank auto-debit",
      "No medical examination required",
      "Cover continues as long as premium is paid",
      "Available to all bank account holders aged 18-50",
      "Can be linked to any savings account"
    ],
    "eligibility": [
      "Indian citizen",
      "Age between 18 and 50 years (cover up to 55 if enrolled before 50)",
      "Must have a savings bank account",
      "Must provide consent for auto-debit of premium"
    ],
    "documents": [
      "Aadhaar Card",
      "Bank Account Passbook / Statement",
      "Mobile Number",
      "Nominee details"
    ],
    "deadline": "Open enrollment - cover period June 1 to May 31 annually",
    "ministry": "Ministry of Finance (Department of Financial Services)",
    "officialLink": "https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/PMJJBY",
    "tags": ["life insurance", "term cover", "social security", "family protection", "bank account", "affordable"],
    "state": "All India",
    "searchKeywords": ["pmjjby", "jeevan jyoti bima", "life insurance", "term insurance", "₹436 insurance", "life cover scheme"]
  },
  {
    "title": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
    "titleHindi": "दीन दयाल उपाध्याय ग्रामीण कौशल्य योजना",
    "category": "skill-development",
    "benefit": "Free skill training and guaranteed placement for rural youth",
    "description": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY) is a placement-linked skill training program for rural youth aged 15-35 years. It is the skilling arm of the National Rural Livelihoods Mission (NRLM). The scheme provides free residential skill training with a focus on employability and guarantees placement with a minimum salary. Trainees also receive post-placement support, career progression opportunities, and a monetary incentive upon completion. Special focus is given to women, SC/ST communities, and persons with disabilities.",
    "benefits": [
      "Free residential skill training in job-oriented trades",
      "Guaranteed placement after training",
      "Post-placement support for 6-12 months",
      "Training allowance and stipend during training",
      "Travel allowance (to and from training center)",
      "Free food and accommodation during residential training",
      "Monetary incentive upon successful completion",
      "Career progression and upskilling opportunities"
    ],
    "eligibility": [
      "Rural youth (age 15-35 years)",
      "Family income less than ₹1.5 lakh per annum",
      "Minimum educational qualification varies by trade (Class 5 to 12)",
      "Priority to women, SC/ST, minorities, and persons with disabilities"
    ],
    "documents": [
      "Aadhaar Card",
      "Residence Certificate / Domicile",
      "Income Certificate (BPL or ≤₹1.5 lakh)",
      "Caste Certificate (if applicable)",
      "Educational Qualification Certificates",
      "Bank Account Details",
      "Passport size photographs"
    ],
    "deadline": "Open - ongoing scheme through empaneled training partners",
    "ministry": "Ministry of Rural Development",
    "officialLink": "https://ddugky.gov.in",
    "tags": ["skill training", "rural youth", "placement", "employment", "free training", "residential", "job guarantee"],
    "state": "All India (rural areas)",
    "searchKeywords": ["ddugky", "deen dayal", "grameen kaushalya", "rural skill training", "free placement training", "rural youth employment"]
  },
  {
    "title": "Deen Dayal Antyodaya Yojana - National Rural Livelihoods Mission",
    "titleHindi": "दीन दयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन",
    "category": "livelihood",
    "benefit": "Self-employment and livelihood support for rural poor women",
    "description": "DAY-NRLM (Ajeevika) is a flagship poverty alleviation program that organizes rural poor women into Self Help Groups (SHGs) and provides them with access to affordable credit, livelihood support, skill training, and market linkages. The mission aims to reduce poverty by enabling rural poor households to access gainful self-employment and skilled wage employment opportunities. It covers all districts of India with special focus on 250 identified backward districts. The program provides revolving funds, community investment funds, and interest subvention to SHGs.",
    "benefits": [
      "Organization into Self Help Groups (SHGs) for collective bargaining",
      "Revolving Fund of ₹10,000-15,000 per SHG",
      "Community Investment Fund (CIF) up to ₹50,000 per SHG",
      "Interest subvention (7% or less) on bank loans to SHGs",
      "Access to bank credit without collateral",
      "Skill training for livelihood activities",
      "Market linkages for SHG products",
      "Vulnerability reduction fund for emergencies",
      "Promotion of farm and non-farm livelihoods"
    ],
    "eligibility": [
      "Rural poor households (identified through Participatory Identification of Poor)",
      "Priority to women from SC/ST communities",
      "Women-headed households and differently-abled persons",
      "Landless laborers, marginal farmers, and artisans"
    ],
    "documents": [
      "Aadhaar Card of all family members",
      "BPL/Identification of Poor Household certificate",
      "Caste Certificate (if applicable)",
      "Bank Account details",
      "Passport size photographs of all members"
    ],
    "deadline": "Open - ongoing mission till 2026-27 (extendable)",
    "ministry": "Ministry of Rural Development",
    "officialLink": "https://www.aajeevika.gov.in",
    "tags": ["self help groups", "shg", "rural livelihoods", "women empowerment", "poverty alleviation", "microfinance", "aajeevika"],
    "state": "All India (all rural districts)",
    "searchKeywords": ["day nrlma", "aajeevika", "shg loan", "self help group", "rural livelihood mission", "women self help group"]
  },
  {
    "title": "Swachh Bharat Mission (Phase II)",
    "titleHindi": "स्वच्छ भारत मिशन (चरण II)",
    "category": "sanitation",
    "benefit": "O&M of community toilets, faecal sludge management, solid waste management",
    "description": "Swachh Bharat Mission Phase II (Urban) focuses on sustaining the Open Defecation Free (ODF) status achieved in Phase I and extending solid waste management across all urban local bodies. It emphasizes faecal sludge and septage management, wastewater treatment, and source segregation of solid waste. The mission provides financial assistance for community and public toilet operations, waste processing facilities, and information, education, and communication (IEC) activities targeting behavioral change. It covers all statutory towns in India.",
    "benefits": [
      "Community and public toilet O&M support",
      "Faecal sludge and septage management facilities",
      "Solid waste processing plants (composting, recycling, WTE)",
      "Door-to-door waste collection infrastructure",
      "Plastic waste management units",
      "Information, education, and communication activities",
      "Training for sanitation workers",
      "Support for decentralized wastewater treatment"
    ],
    "eligibility": [
      "All urban local bodies (ULBs) across India",
      "Residents of urban areas",
      "Sanitation workers eligible for training and support"
    ],
    "documents": [
      "ULB resolution for project implementation",
      "Detailed Project Report (DPR)",
      "Land ownership documents for facilities",
      "Environmental clearance (if required)"
    ],
    "deadline": "Phase II: till 2025-26 (mission mode)",
    "ministry": "Ministry of Housing and Urban Affairs",
    "officialLink": "https://swachhbharatmission.gov.in",
    "tags": ["sanitation", "waste management", "odf", "cleanliness", "toilets", "recycling", "urban development"],
    "state": "All India (urban areas)",
    "searchKeywords": ["swachh bharat", "swachhata", "waste management", "toilet scheme", "sanitation scheme", "odf plus"]
  },
  {
    "title": "National Health Mission",
    "titleHindi": "राष्ट्रीय स्वास्थ्य मिशन",
    "category": "health",
    "benefit": "Strengthening public health systems, free maternal & child health services",
    "description": "The National Health Mission (NHM) encompasses the National Rural Health Mission (NRHM) and the National Urban Health Mission (NUHM). It aims to provide accessible, affordable, and quality healthcare to rural and urban areas. NHM supports state health systems through funding for infrastructure, human resources, drugs, equipment, and health programs. Key focus areas include maternal and child health, communicable diseases (TB, Malaria, HIV), non-communicable diseases, and health system strengthening. The mission covers all states and union territories.",
    "benefits": [
      "Free maternal health services including Janani Suraksha Yojana",
      "Free child health services and immunization",
      "Free TB diagnosis and treatment (NIKSHAY platform)",
      "Free malaria, dengue, and vector-borne disease treatment",
      "Free HIV testing and antiretroviral therapy",
      "Non-communicable disease screening at primary health centers",
      "Free medicines and diagnostics at public health facilities",
      "ASHA worker support for community health",
      "Mobile health units and telemedicine"
    ],
    "eligibility": [
      "All residents of India (rural and urban areas)",
      "Priority to pregnant women, children under 5, and elderly",
      "Below Poverty Line (BPL) families get additional support"
    ],
    "documents": [
      "Aadhaar Card",
      "Residence Proof",
      "BPL Card (if applicable)",
      "MCP Card for pregnant women",
      "Referral slip from sub-center (for specialist services)"
    ],
    "deadline": "Open - ongoing mission (yearly plans under National Health Mission)",
    "ministry": "Ministry of Health and Family Welfare",
    "officialLink": "https://nhm.gov.in",
    "tags": ["healthcare", "maternal health", "child health", "free medicines", "immunization", "tb control", "public health"],
    "state": "All India",
    "searchKeywords": ["nhm", "nrhm", "national health mission", "free health services", "maternal health scheme", "janani suraksha", "asha worker"]
  },
  {
    "title": "Anganwadi Services (Integrated Child Development Services)",
    "titleHindi": "आंगनवाड़ी सेवाएं (एकीकृत बाल विकास सेवाएं)",
    "category": "child-development",
    "benefit": "Supplementary nutrition, immunization, and pre-school education for children 0-6 years",
    "description": "ICDS (Anganwadi Services) is India's flagship early childhood development program providing a package of six services: supplementary nutrition, pre-school education, nutrition and health education, immunization, health check-ups, and referral services. It targets children aged 0-6 years, pregnant and lactating mothers, and adolescent girls (11-18 years). Services are delivered through community-based Anganwadi centers. Over 13 lakh Anganwadi centers operate nationwide making it the largest community-based program of its kind globally.",
    "benefits": [
      "Supplementary nutrition (take-home ration or hot cooked meals)",
      "Free immunization (as per national immunization schedule)",
      "Pre-school non-formal education for 3-6 year olds",
      "Health check-ups including growth monitoring",
      "Referral services to primary health centers",
      "Nutrition and health education for mothers",
      "Take-home rations for pregnant and lactating women",
      "Iron and folic acid supplementation"
    ],
    "eligibility": [
      "Children aged 0-6 years",
      "Pregnant women and lactating mothers (up to 6 months after delivery)",
      "Adolescent girls aged 11-18 years (in select areas)",
      "Priority to SC/ST communities and chronically undernourished children"
    ],
    "documents": [
      "Aadhaar Card of child and mother",
      "Birth Certificate of child",
      "MCP Card (Mother and Child Protection Card)",
      "BPL Certificate (if applicable)",
      "Residence Proof"
    ],
    "deadline": "Open - ongoing scheme",
    "ministry": "Ministry of Women and Child Development",
    "officialLink": "https://icds-wcd.nic.in",
    "tags": ["child nutrition", "anganwadi", "preschool", "immunization", "maternal nutrition", "early childhood", "icds"],
    "state": "All India",
    "searchKeywords": ["icds", "anganwadi", "child development", "supplementary nutrition", "take home ration", "preschool", "balwadi"]
  },
  {
    "title": "PM POSHAN (formerly Mid-Day Meal Scheme)",
    "titleHindi": "पीएम पोषण (पूर्व में मध्याह्न भोजन योजना)",
    "category": "education",
    "benefit": "Free hot cooked meal every school day for government school children",
    "description": "PM POSHAN (formerly known as the Mid-Day Meal Scheme) is India's largest school feeding program providing one free hot cooked meal every school day to children in Classes 1-8 in government and government-aided schools. The scheme aims to improve nutritional status, enhance school enrollment and attendance, and promote socialization among children. A meal provides a minimum of 450-700 calories and 12-20 grams of protein per serving. The scheme covers over 11 crore children across 11 lakh schools nationwide.",
    "benefits": [
      "Free hot cooked nutritious meal every school day",
      "Minimum 450 calories + 12g protein for primary classes",
      "Minimum 700 calories + 20g protein for upper primary classes",
      "Improved school enrollment and reduced dropout rates",
      "Socialization and community bonding through shared meals",
      "Nutritional support reduces classroom hunger",
      "Eggs/milk/banana provided in many states (varies by state policy)",
      "Taste testing by parents and community participation"
    ],
    "eligibility": [
      "Children enrolled in Classes 1-8 in government schools",
      "Children enrolled in government-aided schools",
      "Children enrolled in National Child Labour Project schools",
      "Children enrolled in Madarsas and Maqtabs supported by Sarva Shiksha Abhiyan"
    ],
    "documents": [
      "School enrollment proof",
      "Aadhaar Card of child",
      "Birth Certificate for age verification"
    ],
    "deadline": "Open - ongoing scheme (school year basis)",
    "ministry": "Ministry of Education (Department of School Education and Literacy)",
    "officialLink": "https://pmposhan.education.gov.in",
    "tags": ["mid day meal", "school nutrition", "children", "education", "hot cooked meal", "school enrollment", "pm poshan"],
    "state": "All India",
    "searchKeywords": ["pm poshan", "mid day meal", "school meal", "free lunch", "children nutrition", "midday meal scheme"]
  },
  {
    "title": "Samagra Shiksha Abhiyan",
    "titleHindi": "समग्र शिक्षा अभियान",
    "category": "education",
    "benefit": "Holistic school education from pre-primary to Class 12",
    "description": "Samagra Shiksha Abhiyan is an integrated school education scheme covering pre-primary to Class 12. It subsumes three erstwhile schemes: Sarva Shiksha Abhiyan (SSA), Rashtriya Madhyamik Shiksha Abhiyan (RMSA), and Teacher Education (TE). The scheme treats school education as a continuum from pre-school to senior secondary and aims to improve school effectiveness measured in terms of equal opportunities, learning outcomes, and quality. It provides infrastructure support, teacher training, digital learning resources, and gender-inclusive facilities.",
    "benefits": [
      "Free and compulsory education for 6-14 years (RTE)",
      "Infrastructure grants for school buildings, toilets, and libraries",
      "Free textbooks and uniforms for children from disadvantaged groups",
      "ICT and digital classroom facilities",
      "Vocational education at secondary and senior secondary levels",
      "Sports and physical education equipment",
      "Transport allowance for girls and children with special needs",
      "Teacher training and professional development",
      "Kasturba Gandhi Balika Vidyalayas for girls' education"
    ],
    "eligibility": [
      "All children aged 6-14 years for elementary education (RTE mandate)",
      "Children from economically weaker sections and disadvantaged groups",
      "Girls, SC/ST, OBC, minority communities, and children with special needs"
    ],
    "documents": [
      "Aadhaar Card of child and parent",
      "Birth Certificate",
      "BPL Certificate (if applying for specific benefits)",
      "Caste Certificate (if applying for SC/ST/OBC benefits)",
      "Income Certificate (for fee reimbursement)"
    ],
    "deadline": "Open - ongoing scheme (2021-22 to 2025-26)",
    "ministry": "Ministry of Education (Department of School Education and Literacy)",
    "officialLink": "https://samagra.education.gov.in",
    "tags": ["school education", "rte", "free education", "girls education", "teacher training", "vocational training", "digital classrooms"],
    "state": "All India",
    "searchKeywords": ["samagra shiksha", "ssa", "sarva shiksha", "rte act", "school education scheme", "free education scheme"]
  },
  {
    "title": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana",
    "titleHindi": "प्रधानमंत्री भारतीय जनऔषधि परियोजना",
    "category": "health",
    "benefit": "High-quality generic medicines at 50-90% lower prices",
    "description": "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) provides high-quality generic medicines at affordable prices through dedicated Janaushadhi Kendras across India. Medicines are priced 50-90% lower than branded alternatives. The scheme covers over 1,900 medicines and 285 surgical items including cardiovascular, diabetes, antibiotics, antipyretics, and oncology drugs. All medicines are tested at NABL-accredited labs to ensure quality. The scheme is implemented by the Bureau of Pharma PSUs of India (BPPI) under the Department of Pharmaceuticals.",
    "benefits": [
      "Generic medicines at 50-90% lower prices than branded drugs",
      "Over 1,900 medicines and 285 surgical items available",
      "NABL-accredited lab testing ensures quality",
      "Free medical check-up at select Janaushadhi Kendras",
      "Monthly savings of ₹2,000-5,000 for families on regular medication",
      "Wide network of 10,000+ Janaushadhi Kendras",
      "Medicines for chronic diseases (diabetes, BP, heart, cancer, etc.)",
      "Easy availability of over-the-counter medicines"
    ],
    "eligibility": [
      "Open to all Indian citizens",
      "No income or eligibility criteria",
      "Anyone can purchase medicines from any Janaushadhi Kendra"
    ],
    "documents": [
      "Doctor's prescription (for prescription medicines)",
      "No other documents required for purchase"
    ],
    "deadline": "Open - ongoing scheme",
    "ministry": "Ministry of Chemicals and Fertilizers (Department of Pharmaceuticals)",
    "officialLink": "https://janaushadhi.gov.in",
    "tags": ["generic medicines", "affordable healthcare", "janaushadhi", "low cost medicines", "quality drugs", "pharmacy"],
    "state": "All India",
    "searchKeywords": ["janaushadhi", "generic medicine", "pmbjp", "affordable medicines", "jan aushadhi kendra", "generic drug store"]
  },
  {
    "title": "Saubhagya Yojana (Pradhan Mantri Sahaj Bijli Har Ghar Yojana)",
    "titleHindi": "सौभाग्य योजना (प्रधानमंत्री सहज बिजली हर घर योजना)",
    "category": "infrastructure",
    "benefit": "Free electricity connection to all unelectrified households",
    "description": "Saubhagya Yojana aims to provide last-mile electricity connections to all remaining unelectrified households in rural and urban areas. The scheme provides free electricity connections to Below Poverty Line (BPL) households and connections at a nominal cost of ₹500 (payable in 10 installments) to non-BPL households. The connection includes a metered connection, LED bulbs, and a power bank. Over 2.5 crore households have been electrified under this scheme making it one of the most successful electrification drives globally.",
    "benefits": [
      "Free electricity connection for BPL households",
      "Nominal ₹500 connection (payable in 10 installments) for non-BPL",
      "LED bulbs (3-5) provided free of cost",
      "Power bank for DUE (Declared Un-electrified) households",
      "Metered connection including service line and meter",
      "No monthly minimum charges for BPL households (state-specific)",
      "24x7 electricity supply under Saubhagya + DDUGJY integration"
    ],
    "eligibility": [
      "Unelectrified households (no existing electricity connection)",
      "BPL households get completely free connection",
      "Non-BPL households pay ₹500 (installments of ₹50/month)",
      "Covered both rural and urban areas"
    ],
    "documents": [
      "Aadhaar Card of household head",
      "BPL Certificate (for free connection)",
      "Proof of residence (address proof)",
      "Passport size photograph of head of household",
      "Application form (available at local electricity office)"
    ],
    "deadline": "Scheme largely complete; new connections under regular rural electrification programs",
    "ministry": "Ministry of Power",
    "officialLink": "https://saubhagya.gov.in",
    "tags": ["electricity", "rural electrification", "free connection", "saubhagya", "power", "led bulbs", "household electrification"],
    "state": "All India",
    "searchKeywords": ["saubhagya yojana", "free electricity connection", "bijli connection", "household electrification", "power scheme"]
  },
  {
    "title": "Jal Jeevan Mission",
    "titleHindi": "जल जीवन मिशन",
    "category": "infrastructure",
    "benefit": "Individual household tap water connection in every rural home",
    "description": "Jal Jeevan Mission (JJM) aims to provide Functional Household Tap Connection (FHTC) to every rural household in India by 2024-25. The mission focuses on ensuring water quality, sustainability, and community participation. Each connection provides at least 55 liters per capita per day (lpcd) of potable water. The mission also emphasizes greywater treatment, source sustainability, and monitoring of water quality through field test kits and laboratory testing. Villages are declared 'Har Ghar Jal' when every household gets a tap connection.",
    "benefits": [
      "Individual household tap connection (FHTC) to every rural home",
      "Minimum 55 liters per capita per day potable water",
      "Water quality testing through Field Test Kits (FTK) and labs",
      "Greywater treatment and management infrastructure",
      "Community involvement through Village Water & Sanitation Committees",
      "Solar-powered water supply systems for remote areas",
      "Trainings for local pump operators and community members",
      "Information, Education and Communication (IEC) activities"
    ],
    "eligibility": [
      "All rural households in India",
      "Priority to villages in water-stressed areas (desert, dryland)",
      "SC/ST dominated villages, Aspirational Districts, and quality-affected areas"
    ],
    "documents": [
      "Aadhaar Card of household head",
      "Residence Proof (village panchayat certificate)",
      "BPL certificate (where applicable)",
      "Joint photograph of family members",
      "Application at village panchayat or PHE department"
    ],
    "deadline": "By 2024-25 (all rural households)",
    "ministry": "Ministry of Jal Shakti (Department of Drinking Water and Sanitation)",
    "officialLink": "https://jaljeevanmission.gov.in",
    "tags": ["drinking water", "tap connection", "rural development", "water quality", "har ghar jal", "pipe water"],
    "state": "All India (rural areas)",
    "searchKeywords": ["jal jeevan mission", "tap water", "drinking water scheme", "har ghar jal", "fhtc", "piped water supply"]
  },
  {
    "title": "National Ayush Mission",
    "titleHindi": "राष्ट्रीय आयुष मिशन",
    "category": "health",
    "benefit": "Promotion and development of AYUSH systems of medicine",
    "description": "National Ayush Mission (NAM) promotes the development of Ayurveda, Yoga & Naturopathy, Unani, Siddha, Sowa Rigpa, and Homoeopathy (AYUSH) systems. It provides financial assistance to states for setting up AYUSH healthcare facilities, drug quality control labs, cultivation of medicinal plants, and awareness programs. The mission aims to strengthen AYUSH infrastructure, improve availability of quality AYUSH drugs, and integrate AYUSH with the national healthcare delivery system through co-location in primary health centers and district hospitals.",
    "benefits": [
      "AYUSH health facilities (dispensaries, hospitals, clinics)",
      "Co-location of AYUSH facilities at PHCs, CHCs, and district hospitals",
      "Quality control and standardization of AYUSH drugs",
      "Medicinal plant cultivation and conservation support",
      "Research and development in AYUSH systems",
      "Awareness campaigns on traditional medicine",
      "Ayushman Arogya Mandir (AYUSH Health and Wellness Centers)",
      "Educational scholarships and training programs"
    ],
    "eligibility": [
      "State Governments through DPR-based proposals",
      "AYUSH practitioners and institutions",
      "Farmers and entrepreneurs for medicinal plant cultivation (up to 60% subsidy)",
      "Common citizens seeking AYUSH treatment at subsidized rates"
    ],
    "documents": [
      "Aadhaar Card",
      "Prescription from AYUSH practitioner (for treatment)",
      "Land documents (for medicinal plant cultivation)",
      "Project proposal (for institutional grants)"
    ],
    "deadline": "Open - ongoing scheme till 2025-26",
    "ministry": "Ministry of Ayush",
    "officialLink": "https://namayush.gov.in",
    "tags": ["ayurveda", "yoga", "homeopathy", "traditional medicine", "unani", "siddha", "medicinal plants", "ayush"],
    "state": "All India",
    "searchKeywords": ["ayush mission", "ayurveda scheme", "yoga promotion", "medicinal plants subsidy", "nam", "traditional medicine"]
  },
  {
    "title": "Pradhan Mantri Kisan Sampada Yojana",
    "titleHindi": "प्रधानमंत्री किसान संपदा योजना",
    "category": "food-processing",
    "benefit": "Capital subsidy for food processing infrastructure and units",
    "description": "Pradhan Mantri Kisan Sampada Yojana (PMKSY) is a central sector scheme for creating modern infrastructure for food processing. It provides financial assistance (capital subsidy) for setting up mega food parks, cold chain projects, food processing units, and quality testing labs. The scheme aims to reduce post-harvest losses, enhance processing levels, create employment, and increase the income of farmers through better market linkages. Components include Mega Food Parks (subsidy up to ₹50 crore), Integrated Cold Chain (subsidy up to ₹10 crore), and Unit/Infrastructure schemes (subsidy up to 35-50%).",
    "benefits": [
      "Mega Food Park: capital subsidy up to ₹50 crore (50% of project cost)",
      "Integrated Cold Chain: subsidy up to ₹10 crore (50-35%)",
      "Food Processing Unit: subsidy up to ₹5 crore (35-50% depending on category)",
      "Quality testing lab: subsidy up to 75% of project cost",
      "Backward and forward linkages for processed food",
      "Creation of common infrastructure for food processing",
      "Employment generation (estimated 5 lakh+ direct jobs)",
      "Reduction of post-harvest wastage (currently ~16%)"
    ],
    "eligibility": [
      "Registered companies, cooperatives, FPOs, proprietorship firms",
      "Minimum net worth requirements vary by component",
      "Project must be commercially viable with technical feasibility",
      "Land ownership or long-term lease (≥30 years) required"
    ],
    "documents": [
      "Detailed Project Report (DPR) with techno-economic feasibility",
      "Certificate of Incorporation / Registration",
      "Land documents (ownership or lease deed)",
      "Project cost estimates with quotations",
      "Financial statements (audited for last 3 years)",
      "Environmental clearance (if required)",
      "NOC from State Pollution Control Board"
    ],
    "deadline": "Open - scheme till 2025-26 (applications reviewed periodically)",
    "ministry": "Ministry of Food Processing Industries",
    "officialLink": "https://pmksy.gov.in",
    "tags": ["food processing", "cold chain", "mega food park", "agri infrastructure", "post harvest", "subsidy", "kisan"],
    "state": "All India",
    "searchKeywords": ["pmksy", "kisan sampada", "food processing subsidy", "mega food park", "cold chain subsidy", "agro processing"]
  },
  {
    "title": "Smart Cities Mission",
    "titleHindi": "स्मार्ट सिटीज़ मिशन",
    "category": "urban-development",
    "benefit": "Citizen-centric urban development with smart infrastructure",
    "description": "Smart Cities Mission is a flagship urban renewal program covering 100 selected cities. It aims to promote sustainable and inclusive cities that provide core infrastructure, clean environment, and a decent quality of life to citizens through smart solutions. The mission operates through Special Purpose Vehicles (SPVs) that implement Area-Based Development (ABD) and Pan-City smart solutions. Core infrastructure includes 24x7 water supply, assured electricity, sanitation, intelligent traffic management, e-governance, and safety systems.",
    "benefits": [
      "24x7 water supply with smart metering",
      "Assured electricity supply with smart grid",
      "Intelligent traffic management systems",
      "Integrated command and control centers",
      "Smart street lighting and public Wi-Fi",
      "E-governance and citizen service portals",
      "Safe city solutions (CCTV surveillance, emergency response)",
      "Green buildings and energy-efficient infrastructure",
      "Mixed land use and walkable neighborhoods",
      "Transit-oriented development (TOD)"
    ],
    "eligibility": [
      "Residents of 100 selected smart cities",
      "Citizens can participate through area-level committees",
      "Urban local bodies implementing projects"
    ],
    "documents": [
      "Residence proof for citizen services",
      "Property documents for smart building approvals",
      "Aadhaar for citizen ID-based services"
    ],
    "deadline": "Mission period: 2015-2025 (project completion timelines vary by city)",
    "ministry": "Ministry of Housing and Urban Affairs",
    "officialLink": "https://smartcities.gov.in",
    "tags": ["smart city", "urban development", "digital infrastructure", "e-governance", "intelligent transport", "clean energy", "smart solutions"],
    "state": "100 cities across India",
    "searchKeywords": ["smart cities mission", "smart city", "urban development scheme", "city modernization", "smart infrastructure"]
  },
  {
    "title": "Pradhan Mantri Gramin Digital Saksharta Abhiyan",
    "titleHindi": "प्रधानमंत्री ग्रामीण डिजिटल साक्षरता अभियान",
    "category": "digital-literacy",
    "benefit": "Free digital literacy training for rural households",
    "description": "Pradhan Mantri Gramin Digital Saksharta Abhiyan (PMGDISHA) aims to make 6 crore rural households digitally literate by providing free basic digital literacy training. The training covers operating computers/digital devices, accessing the internet, using digital payment systems, filling online forms, and using government e-services. Training is provided through registered training partners and Common Service Centers (CSCs). Each beneficiary receives a certificate upon passing a competency test. Special focus on women, SC/ST, and economically weaker sections.",
    "benefits": [
      "Free digital literacy training program",
      "Training on computer and mobile device operation",
      "Internet browsing and email usage",
      "Digital payment systems (UPI, net banking, mobile wallets)",
      "Filling online government application forms",
      "Accessing e-governance services",
      "Certificate upon successful completion",
      "Training allowance/incentive in some cases"
    ],
    "eligibility": [
      "Rural household members (one per household)",
      "Age 14-60 years",
      "Must not be digitally literate (no prior formal computer training)",
      "Priority to women, SC/ST, BPL families, and persons with disabilities"
    ],
    "documents": [
      "Aadhaar Card",
      "Residence proof (rural area domicile)",
      "BPL Certificate (if applicable)",
      "Caste Certificate (if applicable)",
      "Passport size photograph"
    ],
    "deadline": "Open - till target of 6 crore households is achieved",
    "ministry": "Ministry of Electronics and Information Technology",
    "officialLink": "https://www.pmgdisha.in",
    "tags": ["digital literacy", "computer training", "rural empowerment", "internet", "digital payments", "e-governance", "pmgdisha"],
    "state": "All India (rural areas)",
    "searchKeywords": ["pmgdisha", "digital saksharta", "computer training free", "digital literacy scheme", "internet training rural"]
  },
  {
    "title": "Mission Indradhanush",
    "titleHindi": "मिशन इंद्रधनुष",
    "category": "health",
    "benefit": "Free full immunization for children and pregnant women who missed doses",
    "description": "Mission Indradhanush (MI) is a special drive to immunize all children under 2 years and pregnant women who are partially vaccinated or unvaccinated. It targets 12 vaccine-preventable diseases including diphtheria, tetanus, pertussis, polio, measles, rubella, TB, hepatitis B, meningitis, pneumonia, rotavirus, and Japanese encephalitis. The mission operates in intensive phases covering high-priority districts with low immunization coverage. It uses a catch-up approach through special immunization sessions, mobile teams, and community mobilization by ASHA workers.",
    "benefits": [
      "Free immunization against 12 vaccine-preventable diseases",
      "Special catch-up sessions for children who missed routine vaccines",
      "Immunization for pregnant women (TT vaccine)",
      "Mobile vaccination teams for hard-to-reach areas",
      "Community mobilization through ASHA and Anganwadi workers",
      "Vaccine safety monitoring and adverse event management",
      "Complete immunization card and tracking"
    ],
    "eligibility": [
      "Children aged 0-2 years who missed or partially received routine immunization",
      "Pregnant women who missed tetanus toxoid vaccination",
      "Priority to high-burden districts with low immunization coverage"
    ],
    "documents": [
      "Child's immunization card (MCP card)",
      "Aadhaar Card of parent/guardian (for tracking)",
      "Pregnancy registration card (for pregnant women)"
    ],
    "deadline": "Ongoing in phases (Intensified Mission Indradhanush 5.0 completed; new phases announced)",
    "ministry": "Ministry of Health and Family Welfare",
    "officialLink": "https://main.mohfw.gov.in/‌major-programmes/universal-immunization-programme/mission-indradhanush",
    "tags": ["immunization", "vaccination", "children health", "polio", "measles", "tetanus", "india child health", "vaccine"],
    "state": "All India (high-priority districts)",
    "searchKeywords": ["mission indradhanush", "immunization drive", "free vaccination", "children vaccine", "pregnancy vaccination", "imi"]
  },
  {
    "title": "Pradhan Mantri Gram Sadak Yojana",
    "titleHindi": "प्रधानमंत्री ग्राम सड़क योजना",
    "category": "infrastructure",
    "benefit": "All-weather road connectivity to unconnected rural habitations",
    "description": "Pradhan Mantri Gram Sadak Yojana (PMGSY) provides all-weather road connectivity to eligible unconnected rural habitations in rural India. PMGSY Phase I (2000-2025) connects habitations with population >500 in plain areas and >250 in hilly/desert/tribal areas. PMGSY Phase III focuses on consolidation of rural roads including upgrading routes to State Highway standards and connecting habitations to market centers, schools, and hospitals. The scheme has constructed over 7 lakh km of rural roads benefiting millions of rural households.",
    "benefits": [
      "All-weather road connectivity to rural habitations",
      "Improved access to markets, education, and healthcare",
      "Reduced travel time and transportation costs",
      "Year-round connectivity even during monsoon",
      "Employment generation in rural areas",
      "Better access to emergency services",
      "Increased property value in connected villages",
      "Social integration of remote communities"
    ],
    "eligibility": [
      "Unconnected rural habitations meeting population criteria",
      "Plain areas: population >500 (and >250 for tribal/hilly/desert areas)",
      "Under PMGSY-III: habitations with population >200 in plain areas"
    ],
    "documents": [
      "Habitation survey report and GIS mapping data",
      "Detailed Project Report (DPR) with engineering design",
      "Land availability certificate from state government",
      "Forest and environmental clearances (if needed)",
      "Utility shifting plan (existing utilities on proposed road)"
    ],
    "deadline": "Open - Phase III till 2024-25 (extended in Union Budget)",
    "ministry": "Ministry of Rural Development",
    "officialLink": "https://pmgsy.gov.in",
    "tags": ["rural roads", "infrastructure", "connectivity", "village road", "pmgsy", "all weather road", "rural development"],
    "state": "All India (rural areas)",
    "searchKeywords": ["pmgsy", "gram sadak", "rural road", "village connectivity", "all weather road", "sadak yojana"]
  },
  {
    "title": "Rashtriya Uchchatar Shiksha Abhiyan",
    "titleHindi": "राष्ट्रीय उच्चतर शिक्षा अभियान",
    "category": "education",
    "benefit": "Financial assistance to state universities and colleges for infrastructure and quality",
    "description": "Rashtriya Uchchatar Shiksha Abhiyan (RUSA) is a centrally sponsored scheme that provides strategic funding to state higher educational institutions. It aims to improve the quality, accessibility, and equity of higher education in India by funding infrastructure development, faculty recruitment, research, and quality improvement initiatives. RUSA supports state universities, affiliated colleges, professional colleges, and polytechnics. Components include new model colleges, upgradation of existing institutions, research and innovation grants, and equity initiatives for improving access for marginalized communities.",
    "benefits": [
      "Infrastructure development grants for universities and colleges",
      "Faculty recruitment support and training",
      "Research and innovation grants",
      "New model colleges and professional colleges",
      "Upgradation of autonomous colleges to universities",
      "E-learning and digital infrastructure support",
      "Scholarships and equity support for SC/ST/OBC/minorities",
      "Accreditation support for NAAC grading improvement"
    ],
    "eligibility": [
      "State public universities and affiliated colleges",
      "Institutions must have valid UGC recognition",
      "Accredited by NAAC (minimum 'C' grade for funding)",
      "State government must provide matching share (at least 60%)"
    ],
    "documents": [
      "Institutional Development Plan (IDP)",
      "NAAC accreditation certificate and score card",
      "UGC recognition documents",
      "State government concurrence letter",
      "Audited financial statements (last 3 years)",
      "Detailed Project Report for infrastructure components"
    ],
    "deadline": "Open - RUSA 2.0 till 2024-25 (RUSA 3.0 under formulation)",
    "ministry": "Ministry of Education (Department of Higher Education)",
    "officialLink": "https://rusa.gov.in",
    "tags": ["higher education", "college funding", "university grants", "infrastructure", "rashtriya uchchatar", "state universities"],
    "state": "All India (state higher education institutions)",
    "searchKeywords": ["rusa", "rashtriya uchchatar shiksha", "higher education grant", "college infrastructure", "university funding scheme"]
  }
];

// Slugify title to create id
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Extract amount from benefits or shortDesc
function extractAmount(scheme) {
  const text = [scheme.benefit, ...scheme.benefits].join(' ');
  const amountPatterns = [
    /₹\s*[\d,]+(?:\s*(?:lakh|crore|k))/i,
    /₹\s*[\d,]+(?:\s*-\s*₹?\s*[\d,]+)?/,
  ];
  for (const pat of amountPatterns) {
    const m = text.match(pat);
    if (m) return m[0].trim();
  }
  return undefined;
}

const existing = JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', 'schemes.json'), 'utf-8'));

const existingIds = new Set(existing.map(s => s.id));

const converted = newSchemesRaw
  .map(s => {
    const id = slugify(s.title);
    return {
      id,
      name: s.title,
      nameHindi: s.titleHindi,
      ministry: s.ministry,
      category: s.category,
      shortDesc: s.benefit,
      description: s.description,
      benefits: s.benefits,
      eligibility: s.eligibility,
      documents: s.documents,
      deadline: s.deadline,
      amount: extractAmount(s),
      isNew: true,
      isPopular: false,
      applicationUrl: s.officialLink,
      tags: s.tags,
      state: s.state,
      searchKeywords: s.searchKeywords,
    };
  })
  .filter(s => !existingIds.has(s.id));

console.log(`Existing schemes: ${existing.length}`);
console.log(`New schemes to add: ${converted.length}`);

if (converted.length > 0) {
  const merged = [...existing, ...converted];
  writeFileSync(join(__dirname, '..', 'src', 'data', 'schemes.json'), JSON.stringify(merged, null, 2));
  console.log(`Written ${merged.length} schemes to schemes.json`);
} else {
  console.log('All schemes already exist in the file.');
}
