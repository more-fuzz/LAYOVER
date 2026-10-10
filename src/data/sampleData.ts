export interface ActivityItem {
  id: string;
  slug: string;
  name: string;
  category: 'hiking' | 'climbing' | 'diving' | 'kayaking' | 'paragliding' | 'caving' | 'biking' | 'mountaineering';
  description: string;
  difficulty: number;
  latitude: number;
  longitude: number;
  base_points: number;
  estimated_cost: number | null;
  requirements: string[];
  safety_info: string;
  is_published: boolean;
  image_url: string;
  location_name: string;
  duration_hours?: number;
}

export interface DestinationItem {
  id: string;
  name: string;
  category: 'historical' | 'natural_wonder' | 'mystery_trail' | 'abandoned' | 'cultural_heritage';
  description: string;
  historical_context: string | null;
  source_url: string | null;
  latitude: number;
  longitude: number;
  access_notes: string | null;
  is_published: boolean;
  is_spooky?: boolean;
  spooky_rating?: number; // 1 to 5
  folklore_legend?: string;
  safety_advisory?: string;
  image_url: string;
  location_name: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost_points: number;
  stock: number | null;
  is_active: boolean;
  image_url: string;
  category: 'gear' | 'voucher' | 'badge' | 'apparel';
  merchant_name?: string;
  merchant_url?: string;
  usage_instructions?: string[];
}

export interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  total_points: number;
  completed_count: number;
  rank: number;
  badge_title: string;
}

export interface SubmissionItem {
  id: string;
  user_id: string;
  user_display_name: string;
  activity_id: string;
  activity_name: string;
  activity_category: string;
  points: number;
  evidence_path: string;
  evidence_url: string;
  claimed_latitude: number | null;
  claimed_longitude: number | null;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string | null;
  reviewer_id?: string | null;
  review_notes?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
}

export interface RedemptionItem {
  id: string;
  user_id: string;
  reward_id: string;
  reward_name: string;
  reward_description?: string;
  reward_image?: string;
  points_spent: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  claim_code: string;
  created_at: string;
  merchant_name?: string;
  merchant_url?: string;
  usage_instructions?: string[];
}

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'roopkund-glacial-traverse',
    name: 'Roopkund High-Altitude Glacial Trek',
    category: 'hiking',
    description: 'A demanding 5,029m Himalayan glacial expedition crossing lush Bugyal alpine meadows into high moraines.',
    difficulty: 5,
    latitude: 30.264200,
    longitude: 79.731700,
    base_points: 500,
    estimated_cost: 280.00,
    requirements: ['Microspikes or crampons', 'Trekking poles', 'High-altitude medical fitness certificate'],
    safety_info: 'Acute Mountain Sickness (AMS) risk above 3,500m. Mandatory acclimatization halts at Bedni Bugyal. Weather turns sub-zero rapidly.',
    is_published: true,
    location_name: 'Chamoli, Uttarakhand, India',
    duration_hours: 48,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    slug: 'rishikesh-ganga-whitewater',
    name: 'Ganges Gorge Class IV Whitewater Run',
    category: 'kayaking',
    description: 'Navigate turbulent rapids through the forested Shivalik foothills between Marine Drive and Rishikesh.',
    difficulty: 4,
    latitude: 30.086900,
    longitude: 78.267600,
    base_points: 350,
    estimated_cost: 45.00,
    requirements: ['Whitewater roll proficiency', 'Certified Class III/IV whitewater guide accompaniment', 'Type V PFD'],
    safety_info: 'Hydraulic undertow near Roller Coaster and Golf Course rapids. Helmets and dry gear mandatory.',
    is_published: true,
    location_name: 'Rishikesh, Uttarakhand, India',
    duration_hours: 5,
    image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'hampi-granite-bouldering',
    name: 'Tungabhadra Granite Bouldering Crag',
    category: 'climbing',
    description: 'Technical bouldering amidst surreal precariously balanced granite boulder landscapes along the Tungabhadra riverbanks.',
    difficulty: 3,
    latitude: 15.335000,
    longitude: 76.460000,
    base_points: 250,
    estimated_cost: 30.00,
    requirements: ['Crash pad (min. 2)', 'Chalk bag & climbing shoes', 'Spotter companion'],
    safety_info: 'Intense midday heat requires early dawn or dusk ascents. Watch for thorny acacia and venomous reptiles around low crevices.',
    is_published: true,
    location_name: 'Hampi, Karnataka, India',
    duration_hours: 6,
    image_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    slug: 'havelock-andaman-scuba',
    name: 'Havelock Dixon Pinnacle Deep Coral Dive',
    category: 'diving',
    description: 'Submarine reef exploration down to submerged barracuda pinnacles and untouched coral shelves in the Bay of Bengal.',
    difficulty: 3,
    latitude: 11.980000,
    longitude: 92.980000,
    base_points: 280,
    estimated_cost: 85.00,
    requirements: ['PADI / SSI Advanced Open Water certification', 'Surface Marker Buoy (SMB)', 'Dive computer'],
    safety_info: 'Strong oceanic cross-currents. Maintain strict buddy system and observe 3-minute safety stop at 5 meters.',
    is_published: true,
    location_name: 'Havelock, Andaman & Nicobar, India',
    duration_hours: 4,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    slug: 'spiti-kunzum-pass-bike',
    name: 'Kunzum Pass High-Altitude MTB Crossing',
    category: 'biking',
    description: 'Ride across rugged 4,551m gravel switchbacks linking the Chandra and Spiti valleys against a backdrop of glaciers.',
    difficulty: 4,
    latitude: 32.400000,
    longitude: 77.633300,
    base_points: 380,
    estimated_cost: 95.00,
    requirements: ['Hardtail or full-suspension mountain bike with hydraulic disc brakes', 'Cold-weather thermal shell', 'Puncture repair kit'],
    safety_info: 'Loose scree and meltwater river crossings. No cellular service for 60km; carrying offline maps is mandatory.',
    is_published: true,
    location_name: 'Lahaul & Spiti, Himachal Pradesh, India',
    duration_hours: 8,
    image_url: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    slug: 'alps-matterhorn-traverse',
    name: 'Matterhorn Hörnli Ridge Alpine Traverse',
    category: 'mountaineering',
    description: 'Iconic technical high-alpine ridge ascent navigating knife-edge arêtes in the Pennine Alps with knife-edge exposure.',
    difficulty: 5,
    latitude: 45.976500,
    longitude: 7.658500,
    base_points: 500,
    estimated_cost: 450.00,
    requirements: ['Technical crampons & ice axe', 'Certified alpine climbing guide or IFMGA certification', 'Acclimatization'],
    safety_info: 'High exposure, rockfall risk, unpredictable blizzard fronts above 4,000m. Technical ropes and helmets mandatory.',
    is_published: true,
    location_name: 'Zermatt, Valais, Switzerland',
    duration_hours: 12,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    slug: 'interlaken-tandem-paraglide',
    name: 'Interlaken Alpine Thermal Flight',
    category: 'paragliding',
    description: 'High-altitude launch from Beatenberg soaring over Interlaken with sweeping vistas of Eiger, Mönch, and Lake Brienz.',
    difficulty: 2,
    latitude: 46.702500,
    longitude: 7.795800,
    base_points: 150,
    estimated_cost: 190.00,
    requirements: ['Sturdy ankle-high footwear', 'Windbreaker jacket', 'Maximum participant weight 100kg'],
    safety_info: 'Weather dependent; flights suspended under high thermal turbulence or gust fronts.',
    is_published: true,
    location_name: 'Bernese Oberland, Switzerland',
    duration_hours: 2,
    image_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    slug: 'postojna-pivka-cave-spelunking',
    name: 'Pivka Karst Subterranean River Caving',
    category: 'caving',
    description: 'Off-trail speleology trek along dark subterranean limestone river corridors and crystal stalactite chambers.',
    difficulty: 4,
    latitude: 45.782000,
    longitude: 14.204000,
    base_points: 350,
    estimated_cost: 95.00,
    requirements: ['Speleology helmet with backup headlamps', 'Waterproof cave suit', 'High-traction rubber boots'],
    safety_info: 'Confined space navigation, subterranean flash flood risk during surface rainfall. Strictly guided access only.',
    is_published: true,
    location_name: 'Postojna, Notranjska, Slovenia',
    duration_hours: 6,
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SAMPLE_DESTINATIONS: DestinationItem[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Bhangarh Fort Ruins',
    category: 'historical',
    description: 'A 17th-century fortified city containing palaces, temples, and stone bazaars, protected by the Archaeological Survey of India (ASI).',
    historical_context: 'Built in 1613 by King Madho Singh; deserted in the early 18th century following famines and military sieges. Regulated by ASI as a protected national heritage monument.',
    source_url: 'https://asi.nic.in',
    latitude: 27.096400,
    longitude: 76.286300,
    access_notes: 'Open to the public strictly between sunrise and sunset under ASI statutory guidelines. Entry after sunset is strictly prohibited for safety and wildlife protection.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 4,
    folklore_legend: 'Local Rajasthani folklore tells of a legendary sorcerer whose curse allegedly decreed that no building within the fort walls would ever retain its roof.',
    safety_advisory: 'Steep cobblestone ruins and wild langur monkeys. Strictly depart the premises before dusk in accordance with archaeological notice boards.',
    location_name: 'Alwar District, Rajasthan, India',
    image_url: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Lonar Meteorite Impact Lake',
    category: 'natural_wonder',
    description: 'A national geo-heritage saline soda lake formed inside an ancient hypervelocity meteorite crater in the basalt plateau.',
    historical_context: 'Created approximately 52,000 years ago when an extraterrestrial meteor struck Deccan Traps basalt; one of only four known hypervelocity impact craters in basalt rock on Earth.',
    source_url: 'https://whc.unesco.org',
    latitude: 19.975300,
    longitude: 76.507200,
    access_notes: 'Designated nature trail down the crater rim. Highly alkaline water; swimming is strictly forbidden to preserve unique endemic microbial life.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 3,
    folklore_legend: 'Mentioned in ancient texts including the Padma Purana and Ain-i-Akbari as the site of a mythological confrontation between subterranean spirits.',
    safety_advisory: 'Loose basalt rubble on the rim descent. Wear sturdy hiking shoes with ankle support.',
    location_name: 'Buldhana District, Maharashtra, India',
    image_url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Derinkuyu Subterranean City',
    category: 'historical',
    description: 'An 18-level underground troglodyte sanctuary carved 85 meters into soft volcanic tuff rock, equipped with stone rolling doors and ventilation shafts.',
    historical_context: 'Excavated during the Phrygian period and expanded during Byzantine Arab-Byzantine wars (8th–12th centuries) to shelter up to 20,000 people and their livestock.',
    source_url: 'https://whc.unesco.org/en/list/356',
    latitude: 38.373600,
    longitude: 34.734700,
    access_notes: 'Open year-round with artificial illumination. Low clearances require comfortable bending mobility; not recommended for claustrophobic travelers.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 4,
    folklore_legend: 'Early Cappadocian legends spoke of subterranean earth artisans who utilized harmonic vibrations to hollow the volcanic tuff caverns.',
    safety_advisory: 'Stick strictly to marked tourist pathways. Never cross chained barricades into unlit ventilation shafts.',
    location_name: 'Nevşehir Province, Cappadocia, Turkey',
    image_url: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Kolmanskop Ghost Settlement in the Dunes',
    category: 'abandoned',
    description: 'An affluent 1908 diamond boomtown gradually reclaimed by the encroaching golden barchan dunes of the Namib Desert.',
    historical_context: 'Built following diamond discoveries in 1908 and abandoned in 1956 when richer diamond fields opened south; now a preserved open-air museum.',
    source_url: 'https://namibiatourism.org.na',
    latitude: -26.704200,
    longitude: 15.231900,
    access_notes: 'Daylight entry permits issued at Lüderitz entry office. Special photography permits granted for dawn and dusk entry.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 5,
    folklore_legend: 'Travelers recount eerie acoustic harmonics produced when desert gales blow across the empty timber ballroom floorboards at sundown.',
    safety_advisory: 'Dilapidated roofs and unstable floorboards. Watch out for horned adders resting in shaded sand drifts.',
    location_name: 'Lüderitz, Namib Desert, Namibia',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Richat Structure (Eye of the Sahara)',
    category: 'mystery_trail',
    description: 'A 40km concentric circular geological domal structure prominent from low Earth orbit in the western Sahara.',
    historical_context: 'Identified during early Gemini space missions; modern geologic studies explain it as a deeply eroded alkaline igneous intrusion.',
    source_url: 'https://earthobservatory.nasa.gov/images/92071/richat-structure',
    latitude: 21.126900,
    longitude: -11.401600,
    access_notes: 'Challenging remote 4x4 desert convoy expedition from Ouadane. Licensed local Saharan guides required.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 3,
    folklore_legend: 'Nomadic Berber folklore regarded the concentric rings as a petrified nexus of ancestral desert spirits.',
    safety_advisory: 'Summer daytime temperatures exceed 48°C. Carrying minimum 10L water per traveler per day is mandatory.',
    location_name: 'Adrar Plateau, Mauritania',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd6666666-6666-6666-6666-666666666666',
    name: 'Plitvice Cascading Karst Waterfalls',
    category: 'natural_wonder',
    description: 'A stepped staircase of 16 crystalline karst lakes connected by waterfalls through dense virgin beech forest.',
    historical_context: 'Created by geochemical travertine tufa deposition over millennia; protected as a UNESCO World Heritage site since 1979.',
    source_url: 'https://whc.unesco.org/en/list/98',
    latitude: 44.865400,
    longitude: 15.603100,
    access_notes: 'Designated timber boardwalks and electric boats. Strictly prohibited from leaving designated paths or entering water.',
    is_published: true,
    is_spooky: false,
    spooky_rating: 1,
    location_name: 'Lika-Senj County, Croatia',
    image_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SAMPLE_REWARDS: RewardItem[] = [
  {
    id: 'r1111111-1111-1111-1111-111111111111',
    name: 'Official Expedition Brass Enamel Pin & Iron-On Patch',
    description: 'Solid antiqued brass field pin and heavy-duty embroidered traveler patch verifying your verified platform accomplishments.',
    cost_points: 300,
    stock: 480,
    is_active: true,
    category: 'badge',
    merchant_name: 'Trails & Tales Outfitter Depot',
    merchant_url: 'https://example.com/outfitter',
    usage_instructions: [
      'Copy your unique voucher code below.',
      'Present your code at any verified partner gear hub or enter at checkout on the Outfitter Depot website.',
      'Your commemorative brass pin and embroidered patch will be mailed to your verified address free of shipping charges.',
    ],
    image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r2222222-2222-2222-2222-222222222222',
    name: 'Ultralight Heavy-Duty 15L Dry Bag & Locking Carabiner',
    description: 'Roll-top 500D waterproof expedition dry pack with welded seams and aviation-grade aluminum twist-lock carabiner for water sports.',
    cost_points: 600,
    stock: 145,
    is_active: true,
    category: 'gear',
    merchant_name: 'Apex Alpine & Water Sports',
    merchant_url: 'https://example.com/apex-gear',
    usage_instructions: [
      'Copy your unique claim voucher code.',
      'Visit the Apex Gear online storefront or partner outlet.',
      'Apply the coupon code in the "Promotional / Voucher Code" field during checkout.',
      'The 100% equipment discount will immediately apply to your cart.',
    ],
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r3333333-3333-3333-3333-333333333333',
    name: 'Global Wilderness First Aid & Survival Pocket Handbook',
    description: 'Waterproof, tear-resistant field reference guide covering alpine altitude sickness, hypothermia, wilderness triage, and snakebite response.',
    cost_points: 450,
    stock: 220,
    is_active: true,
    category: 'gear',
    merchant_name: 'Wilderness Medicine Institute',
    merchant_url: 'https://example.com/wilderness-med',
    usage_instructions: [
      'Copy your claim voucher code.',
      'Redeem through the Wilderness Institute digital field guide portal.',
      'Download your waterproof digital handbook or request your printed pocket guide.',
    ],
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r4444444-4444-4444-4444-444444444444',
    name: '$50 Partner Expedition Gear Rental Voucher',
    description: 'Instant digital voucher redeemable towards crampons, ice axes, wetsuits, or mountain bike rental at certified partner gear depots worldwide.',
    cost_points: 1200,
    stock: 42,
    is_active: true,
    category: 'voucher',
    merchant_name: 'Global Trailhead Gear Rentals',
    merchant_url: 'https://example.com/trailhead-rentals',
    usage_instructions: [
      'Copy your $50 rental coupon code.',
      'Select any partner gear depot from the verified partner directory.',
      'Enter the coupon code in the partner reservation form or present at depot counter.',
      'A $50 credit will be deducted from your equipment rental balance.',
    ],
    image_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r5555555-5555-5555-5555-555555555555',
    name: 'Vacuum Insulated Stainless Steel Expedition Flask (1L)',
    description: 'Double-wall vacuum flask keeping fluids piping hot for 24 hours in freezing blizzards or ice-cold in extreme desert expeditions.',
    cost_points: 850,
    stock: 90,
    is_active: true,
    category: 'gear',
    merchant_name: 'Karakoram Thermal Labs',
    merchant_url: 'https://example.com/karakoram',
    usage_instructions: [
      'Copy your voucher code.',
      'Navigate to the Karakoram Thermal order verification portal.',
      'Select your flask finish and input your coupon code at checkout.',
    ],
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r6666666-6666-6666-6666-666666666666',
    name: 'Trails & Tales Organic Merino Wool Adventure Beanie',
    description: '100% breathable thermal merino wool headwear engineered for sub-zero alpine ascents and crisp twilight ridge hikes.',
    cost_points: 500,
    stock: 175,
    is_active: true,
    category: 'apparel',
    merchant_name: 'Trails & Tales Outfitter Depot',
    merchant_url: 'https://example.com/outfitter',
    usage_instructions: [
      'Copy your voucher code.',
      'Enter the promotional code at the Outfitter Depot merchandise store.',
      'Confirm your shipping details to receive your beanie.',
    ],
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
  },
];

export const SAMPLE_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u1',
    username: 'aarav_himalayas',
    display_name: 'Aarav Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    total_points: 2450,
    completed_count: 8,
    rank: 1,
    badge_title: 'Alpine Legend',
  },
  {
    id: 'u2',
    username: 'priya_zenith',
    display_name: 'Priya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    total_points: 1980,
    completed_count: 6,
    rank: 2,
    badge_title: 'Ridge Master',
  },
  {
    id: 'u3',
    username: 'rohan_rapids',
    display_name: 'Rohan Verma',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    total_points: 1620,
    completed_count: 5,
    rank: 3,
    badge_title: 'Abyss Explorer',
  },
  {
    id: 'u4',
    username: 'maya_boulders',
    display_name: 'Maya Nair',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    total_points: 1350,
    completed_count: 4,
    rank: 4,
    badge_title: 'Granite Crusher',
  },
  {
    id: 'u5',
    username: 'zara_enigmas',
    display_name: 'Zara Thorne',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    total_points: 1100,
    completed_count: 3,
    rank: 5,
    badge_title: 'Crypt Walker',
  },
  {
    id: 'u6',
    username: 'traveler_you',
    display_name: 'Alex Mercer (You)',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    total_points: 850,
    completed_count: 3,
    rank: 6,
    badge_title: 'Pathfinder',
  },
];

export const SAMPLE_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'sub-001',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a2222222-2222-2222-2222-222222222222',
    activity_name: 'Ganges Gorge Class IV Whitewater Run',
    activity_category: 'kayaking',
    points: 350,
    evidence_path: 'evidence/u6/rishikesh_rapids_run.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 30.086900,
    claimed_longitude: 78.267600,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Verified guide safety log and rapid exit photograph with helmet and Type V PFD.',
    submitted_at: '2026-10-02T14:30:00Z',
    reviewed_at: '2026-10-03T09:15:00Z',
  },
  {
    id: 'sub-002',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a3333333-3333-3333-3333-333333333333',
    activity_name: 'Tungabhadra Granite Bouldering Crag',
    activity_category: 'climbing',
    points: 250,
    evidence_path: 'evidence/u6/hampi_boulder_topout.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 15.335000,
    claimed_longitude: 76.460000,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Top-out photograph verified with dual crash pad setup at Rishimukh crag.',
    submitted_at: '2026-10-05T11:20:00Z',
    reviewed_at: '2026-10-05T18:00:00Z',
  },
  {
    id: 'sub-003',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a4444444-4444-4444-4444-444444444444',
    activity_name: 'Havelock Dixon Pinnacle Deep Coral Dive',
    activity_category: 'diving',
    points: 250,
    evidence_path: 'evidence/u6/havelock_dive_log.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 11.980000,
    claimed_longitude: 92.980000,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Dive computer depth readout verified at 18m with certified dive master signature.',
    submitted_at: '2026-10-08T16:45:00Z',
    reviewed_at: '2026-10-09T10:30:00Z',
  },
  {
    id: 'sub-004',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a1111111-1111-1111-1111-111111111111',
    activity_name: 'Roopkund High-Altitude Glacial Trek',
    activity_category: 'hiking',
    points: 500,
    evidence_path: 'evidence/u6/roopkund_pass_summit.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 30.264200,
    claimed_longitude: 79.731700,
    status: 'pending',
    reviewer_id: null,
    review_notes: null,
    submitted_at: '2026-10-10T22:15:00Z',
    reviewed_at: null,
  },
];

export const SAMPLE_REDEMPTIONS: RedemptionItem[] = [
  {
    id: 'red-001',
    user_id: 'u6',
    reward_id: 'r1111111-1111-1111-1111-111111111111',
    reward_name: 'Official Expedition Brass Enamel Pin & Iron-On Patch',
    reward_description: 'Solid antiqued brass field pin and heavy-duty embroidered traveler patch verifying your verified platform accomplishments.',
    reward_image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    points_spent: 300,
    status: 'fulfilled',
    claim_code: 'TT-PIN-8942-XF',
    created_at: '2026-10-06T12:00:00Z',
    merchant_name: 'Trails & Tales Outfitter Depot',
    merchant_url: 'https://example.com/outfitter',
    usage_instructions: [
      'Copy your unique voucher code below.',
      'Present your code at any verified partner gear hub or enter at checkout on the Outfitter Depot website.',
      'Your commemorative brass pin and embroidered patch will be mailed to your verified address free of shipping charges.',
    ],
  },
];
