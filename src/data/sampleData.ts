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
  points_spent: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  claim_code: string;
  created_at: string;
}

export const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    slug: 'alps-matterhorn-traverse',
    name: 'Matterhorn Hörnli Ridge Traverse',
    category: 'mountaineering',
    description: 'A classic high-alpine technical climb navigating the iconic Hörnli Ridge in the Pennine Alps with knife-edge arêtes and breathtaking summit views.',
    difficulty: 5,
    latitude: 45.976500,
    longitude: 7.658500,
    base_points: 500,
    estimated_cost: 450.00,
    requirements: ['Crampons & technical ice axe', 'Certified alpine guide or alpine climbing certification', 'High altitude acclimatization'],
    safety_info: 'Severe exposure, rockfall risk, unpredictable weather changes above 4,000m. Helmets and technical ropes mandatory.',
    is_published: true,
    location_name: 'Zermatt, Switzerland',
    duration_hours: 12,
    image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    slug: 'verdon-gorge-climbing',
    name: 'Verdon Gorge Multi-Pitch Limestone',
    category: 'climbing',
    description: 'Dramatic limestone multi-pitch climbing suspended high above the turquoise ribbon waters of the Grand Canyon du Verdon.',
    difficulty: 4,
    latitude: 43.743100,
    longitude: 6.386200,
    base_points: 350,
    estimated_cost: 80.00,
    requirements: ['6a lead grade competency', 'Dual 60m dynamic ropes', 'Quickdraw rack (14+)'],
    safety_info: 'Rappelling into the canyon requires absolute self-rescue knowledge. High summer temperatures require minimum 3L hydration.',
    is_published: true,
    location_name: 'Provence-Alpes-Côte d\'Azur, France',
    duration_hours: 6,
    image_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    slug: 'red-sea-blue-hole-freediving',
    name: 'Dahab Blue Hole Freedive Expedition',
    category: 'diving',
    description: 'World-renowned submarine sinkhole famous for 130m deep crystal-clear indigo waters, vibrant coral gardens, and the legendary Arch gateway.',
    difficulty: 3,
    latitude: 28.572200,
    longitude: 34.536700,
    base_points: 250,
    estimated_cost: 65.00,
    requirements: ['AIDA 2 / PADI Freediver certification or equivalent', 'Safety lanyard', 'Dive computer'],
    safety_info: 'Do not dive beyond certified depths. Never dive alone; adhere strictly to the one-buddy-up protocol.',
    is_published: true,
    location_name: 'South Sinai, Egypt',
    duration_hours: 4,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    slug: 'interlaken-tandem-paraglide',
    name: 'Jungfrau Vista Alpine Paragliding',
    category: 'paragliding',
    description: 'High-altitude launch from Beatenberg soaring over Interlaken with sweeping panoramic vistas of Eiger, Mönch, Jungfrau, Lake Thun and Lake Brienz.',
    difficulty: 2,
    latitude: 46.702500,
    longitude: 7.795800,
    base_points: 150,
    estimated_cost: 190.00,
    requirements: ['Sturdy ankle-high footwear', 'Windbreaker jacket', 'Maximum participant weight 100kg'],
    safety_info: 'Weather dependent; launch suspended under high thermal turbulence or gust fronts.',
    is_published: true,
    location_name: 'Bernese Oberland, Switzerland',
    duration_hours: 2,
    image_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    slug: 'slovenia-soca-whitewater-kayak',
    name: 'Soča Valley Emerald Rapids Kayaking',
    category: 'kayaking',
    description: 'Navigate pure glacial emerald waters through class II to IV whitewater rapids surrounded by the dramatic Julian Alps limestone canyons.',
    difficulty: 4,
    latitude: 46.339200,
    longitude: 13.551100,
    base_points: 300,
    estimated_cost: 120.00,
    requirements: ['Whitewater roll proficiency', 'Level III whitewater experience', 'Neoprene wetsuit'],
    safety_info: 'Siphon hazards and cold mountain snowmelt water require type V PFD and cold-water immersion gear.',
    is_published: true,
    location_name: 'Bovec, Slovenia',
    duration_hours: 5,
    image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    slug: 'postojna-pivka-cave-spelunking',
    name: 'Pivka Karst Cave Subterranean Spelunking',
    category: 'caving',
    description: 'Off-trail deep karst speleology trekking along subterranean river systems, crystal stalactite chambers, and pitch-black chambers.',
    difficulty: 4,
    latitude: 45.782000,
    longitude: 14.204000,
    base_points: 350,
    estimated_cost: 95.00,
    requirements: ['Speleology helmet with backup headlamp', 'Waterproof cave suit', 'Rubber grip boots'],
    safety_info: 'Confined space navigation, underground flash flooding risk during rainstorms. Strictly guided access only.',
    is_published: true,
    location_name: 'Postojna, Slovenia',
    duration_hours: 6,
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a7777777-7777-7777-7777-777777777777',
    slug: 'iceland-laugavegur-trek',
    name: 'Laugavegur Geothermal Highlands Trek',
    category: 'hiking',
    description: 'A 55km multi-day wilderness trek traversing boiling hot springs, obsidian volcanic fields, neon green moss rhyolite mountains, and glacial valleys.',
    difficulty: 3,
    latitude: 63.983000,
    longitude: -19.066700,
    base_points: 280,
    estimated_cost: 150.00,
    requirements: ['4-season waterproof shell', 'GPS navigation track', 'High-calorie expedition rations'],
    safety_info: 'Rapid blizzards possible even in midsummer. Unbridged glacial river crossings require wading technique and poles.',
    is_published: true,
    location_name: 'Landmannalaugar, Iceland',
    duration_hours: 36,
    image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'a8888888-8888-8888-8888-888888888888',
    slug: 'whistler-top-of-the-world-bike',
    name: 'Whistler Top of the World Alpine Downhill',
    category: 'biking',
    description: 'Epic rugged sub-alpine mountain bike descent on raw granitic rock slabs, technical berms, and steep alpine ridgelines.',
    difficulty: 4,
    latitude: 50.059400,
    longitude: -122.955000,
    base_points: 320,
    estimated_cost: 110.00,
    requirements: ['Full suspension enduro/downhill MTB', 'Full-face helmet', 'Knee and elbow pads'],
    safety_info: 'High speeds on loose shale and granite berms. Medical evacuation can take extended time from peak altitudes.',
    is_published: true,
    location_name: 'British Columbia, Canada',
    duration_hours: 4,
    image_url: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SAMPLE_DESTINATIONS: DestinationItem[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Derinkuyu Underground City',
    category: 'historical',
    description: 'An astounding multi-level subterranean labyrinth carved 85 meters into volcanic tuff, once sheltering over 20,000 people along with their livestock and food stores.',
    historical_context: 'Built during the Phrygian era and heavily expanded during the Byzantine period (8th–12th centuries) as an impenetrable underground sanctuary during the Arab-Byzantine wars.',
    source_url: 'https://whc.unesco.org/en/list/356',
    latitude: 38.373600,
    longitude: 34.734700,
    access_notes: 'Open year-round with electric lighting. Low stone doorways require careful stooping; not recommended for severe claustrophobia.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 4,
    folklore_legend: 'Local Cappadocia legends speak of an ancient race of subterranean earth dwellers who carved the deep ventilation shafts using acoustic resonance.',
    safety_advisory: 'Stick strictly to marked tourist tunnels. Do not cross chain barricades into unmapped ventilation tunnels.',
    location_name: 'Nevşehir Province, Turkey',
    image_url: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Skellig Michael Monastic Crag',
    category: 'cultural_heritage',
    description: 'A precipitously sheer sea crag rising 218 meters out of the wild Atlantic Ocean, crowned by a breathtaking 6th-century early Christian beehive stone monastery.',
    historical_context: 'Founded between the 6th and 8th century by ascetics seeking God in total isolation at the very edge of the medieval Western world.',
    source_url: 'https://whc.unesco.org/en/list/702',
    latitude: 51.770800,
    longitude: -10.540300,
    access_notes: 'Access strictly regulated by seasonal licensed boats; involves ascending 618 hand-hewn drystone cliff steps with no handrails.',
    is_published: true,
    is_spooky: false,
    spooky_rating: 2,
    location_name: 'County Kerry, Ireland',
    image_url: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Richat Structure (Eye of the Sahara)',
    category: 'mystery_trail',
    description: 'A colossal 40km circular geologic concentric ring formation clearly visible from low Earth orbit in the heart of the desolate Mauritanian desert.',
    historical_context: 'Discovered in early space missions; modern geology attributes it to an eroded alkaline igneous domal intrusion, though alternative ancient civilization theories persist in local lore.',
    source_url: 'https://earthobservatory.nasa.gov/images/92071/richat-structure',
    latitude: 21.126900,
    longitude: -11.401600,
    access_notes: 'Extreme remote desert expedition requiring four-wheel drive convoy, satellite comms, and authorized local Saharan guides.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 3,
    folklore_legend: 'Nomadic Berber tribes long whispered that the concentric rings were the petrified footprint of a prehistoric giant or the celestial center of the desert wind spirit.',
    safety_advisory: 'Daytime desert temperatures exceed 48°C in summer. Mandatory convoy provisions: 10L water per person per day.',
    location_name: 'Adrar Plateau, Mauritania',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Kolmanskop Ghost Town in the Dunes',
    category: 'abandoned',
    description: 'An opulent 1908 German diamond boomtown abandoned to the relentless sands of the Namib desert, where grand ballrooms and villas now sit knee-deep in golden dunes.',
    historical_context: 'Constructed after diamond discoveries in 1908 with extravagant European architecture, ice factories, and bowling alleys, then abandoned in 1956 when richer diamond fields opened south.',
    source_url: 'https://namibiatourism.org.na',
    latitude: -26.704200,
    longitude: 15.231900,
    access_notes: 'Daylight entry permits issued at Lüderitz entry gate. Photographers permit grants golden hour dawn/dusk access.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 5,
    folklore_legend: 'Desert travelers claim the whistling south-westerly winds create eerie orchestral echoes through the hollowed wooden ballroom floorboards at twilight.',
    safety_advisory: 'Roofs and floorboards in dilapidated buildings are subject to structural collapse. Watch for horned adders resting in shaded dunes.',
    location_name: 'Namib Desert, Namibia',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Plitvice Lakes Terraced Karst Cascades',
    category: 'natural_wonder',
    description: 'A fairytale chain of 16 crystalline stepped lakes connected by cascading waterfalls through dense virgin beech forest, sculpted by travertine limestone barriers.',
    historical_context: 'Formed by continuous geochemical travertine deposition over thousands of years; Croatia\'s oldest and largest national park, protected by UNESCO since 1979.',
    source_url: 'https://whc.unesco.org/en/list/98',
    latitude: 44.865400,
    longitude: 15.603100,
    access_notes: 'Designated wooden boardwalks and zero-emission electric boats. Strictly prohibited from swimming or leaving designated trails.',
    is_published: true,
    is_spooky: false,
    spooky_rating: 1,
    location_name: 'Lika-Senj County, Croatia',
    image_url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'd6666666-6666-6666-6666-666666666666',
    name: 'Hoia-Baciu Twisted Forest',
    category: 'mystery_trail',
    description: 'An ancient Transylvanian oak forest famous for eerie curved trees growing in uniform spirals and an unexplained circular clearing where no vegetation grows.',
    historical_context: 'Known as the "Bermuda Triangle of Romania" since biological and paranormal research expeditions in the 1960s documented unusual electromagnetic readings.',
    source_url: 'https://romaniatourism.com',
    latitude: 46.772500,
    longitude: 23.518600,
    access_notes: 'Public trail open during daylight hours. Night visits only advised with experienced local historical guides.',
    is_published: true,
    is_spooky: true,
    spooky_rating: 5,
    folklore_legend: 'Transylvanian folklore recounts centuries of legends about the clearing being an ancient mystical nexus where compass needles spin wildly and clocks lose minutes.',
    safety_advisory: 'Stick to marked forest pathways. Dense fog and identical twisted tree trunks make night navigation hazardous without compass or GPS track.',
    location_name: 'Cluj-Napoca, Transylvania, Romania',
    image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  },
];

export const SAMPLE_REWARDS: RewardItem[] = [
  {
    id: 'r1111111-1111-1111-1111-111111111111',
    name: 'Official Adventure Passport Enamel Pin & Iron-On Patch',
    description: 'Solid antiqued brass expedition lapel badge and high-density embroidered traveler patch commemorating your verified achievements.',
    cost_points: 300,
    stock: 480,
    is_active: true,
    category: 'badge',
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
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'r3333333-3333-3333-3333-333333333333',
    name: 'Global Wilderness First Aid & Survival Pocket Handbook',
    description: 'Waterproof, tear-resistant field reference guide covering alpine altitude sickness, hypothermia, wilderness triage, and oceanic envenomation.',
    cost_points: 450,
    stock: 220,
    is_active: true,
    category: 'gear',
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
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
  },
];

export const SAMPLE_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u1',
    username: 'elena_alps',
    display_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    total_points: 2450,
    completed_count: 8,
    rank: 1,
    badge_title: 'Alpine Legend',
  },
  {
    id: 'u2',
    username: 'kai_zenith',
    display_name: 'Kai Nakamura',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    total_points: 1980,
    completed_count: 6,
    rank: 2,
    badge_title: 'Ridge Master',
  },
  {
    id: 'u3',
    username: 'maya_wanders',
    display_name: 'Maya Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    total_points: 1620,
    completed_count: 5,
    rank: 3,
    badge_title: 'Abyss Explorer',
  },
  {
    id: 'u4',
    username: 'mateo_canyon',
    display_name: 'Mateo Silva',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    total_points: 1350,
    completed_count: 4,
    rank: 4,
    badge_title: 'Rapids Navigator',
  },
  {
    id: 'u5',
    username: 'zara_spooky',
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
    activity_id: 'a4444444-4444-4444-4444-444444444444',
    activity_name: 'Jungfrau Vista Alpine Paragliding',
    activity_category: 'paragliding',
    points: 150,
    evidence_path: 'evidence/u6/paraglide_interlaken_flight.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 46.702500,
    claimed_longitude: 7.795800,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Clear launch photograph showing certified pilot harness and flight log.',
    submitted_at: '2026-10-02T14:30:00Z',
    reviewed_at: '2026-10-03T09:15:00Z',
  },
  {
    id: 'sub-002',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a3333333-3333-3333-3333-333333333333',
    activity_name: 'Dahab Blue Hole Freedive Expedition',
    activity_category: 'diving',
    points: 250,
    evidence_path: 'evidence/u6/dahab_blue_hole_dive.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 28.572200,
    claimed_longitude: 34.536700,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Depth computer readout photo verified at 20m with safety buddy present.',
    submitted_at: '2026-10-05T11:20:00Z',
    reviewed_at: '2026-10-05T18:00:00Z',
  },
  {
    id: 'sub-003',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a2222222-2222-2222-2222-222222222222',
    activity_name: 'Verdon Gorge Multi-Pitch Limestone',
    activity_category: 'climbing',
    points: 350,
    evidence_path: 'evidence/u6/verdon_pitch3_belay.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 43.743100,
    claimed_longitude: 6.386200,
    status: 'approved',
    reviewer_id: 'admin-01',
    review_notes: 'Top-out photograph at Belvedere de l’Escales verified with summit marker.',
    submitted_at: '2026-10-08T16:45:00Z',
    reviewed_at: '2026-10-09T10:30:00Z',
  },
  {
    id: 'sub-004',
    user_id: 'u6',
    user_display_name: 'Alex Mercer',
    activity_id: 'a1111111-1111-1111-1111-111111111111',
    activity_name: 'Matterhorn Hörnli Ridge Traverse',
    activity_category: 'mountaineering',
    points: 500,
    evidence_path: 'evidence/u6/matterhorn_solvay_summit.jpg',
    evidence_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    claimed_latitude: 45.976500,
    claimed_longitude: 7.658500,
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
    reward_name: 'Official Adventure Passport Enamel Pin & Iron-On Patch',
    points_spent: 300,
    status: 'fulfilled',
    claim_code: 'TT-PIN-8942-XF',
    created_at: '2026-10-06T12:00:00Z',
  },
];
