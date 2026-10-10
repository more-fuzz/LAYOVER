-- Adventure Passport Demonstration Seed Data
-- Realistic sample activities, destinations, and rewards with valid coordinates and sensible score values.
-- Note: User accounts and personal information are omitted to avoid inserting fabricated user data.

-- 1. Example Activities (8 items)
INSERT INTO public.activities (
  id, slug, name, category, description, difficulty, 
  latitude, longitude, base_points, estimated_cost, requirements, safety_info, is_published
) VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'alps-matterhorn-traverse',
  'Matterhorn Ridge Traverse',
  'mountaineering',
  'A classic high-alpine technical climb navigating the Hörnli Ridge in the Pennine Alps.',
  5,
  45.976500,
  7.658500,
  500,
  450.00,
  ARRAY['Crampons & ice axe required', 'Certified alpine guide or alpine climbing certification', 'High altitude acclimatization'],
  'Severe exposure, rockfall risk, unpredictable weather changes above 4,000m. Helmets and technical ropes mandatory.',
  true
),
(
  'a2222222-2222-2222-2222-222222222222',
  'verdon-gorge-climbing',
  'Verdon Gorge Multi-Pitch Climbing',
  'climbing',
  'Dramatic limestone multi-pitch climbing above the turquoise waters of the Verdon River.',
  4,
  43.743100,
  6.386200,
  350,
  80.00,
  ARRAY['6a lead grade competency', 'Dual 60m ropes', 'Quickdraw rack (14+)'],
  'Rappelling into the canyon requires absolute self-rescue knowledge. High summer temperatures require minimum 3L hydration.',
  true
),
(
  'a3333333-3333-3333-3333-333333333333',
  'red-sea-blue-hole-freediving',
  'Dahab Blue Hole Freedive Exploration',
  'diving',
  'World-famous natural submarine sinkhole renowned for crystal-clear visibility and coral walls.',
  3,
  28.572200,
  34.536700,
  250,
  65.00,
  ARRAY['AIDA 2 / PADI Freediver certification or equivalent', 'Safety lanyard', 'Dive computer'],
  'Do not dive beyond certified depths. Never dive alone; adhere strictly to the one-buddy-up protocol.',
  true
),
(
  'a4444444-4444-4444-4444-444444444444',
  'interlaken-tandem-paraglide',
  'Interlaken Jungfrau Vista Flight',
  'paragliding',
  'High-altitude launch from Beatenberg offering sweeping panoramic views of Lake Thun and Lake Brienz.',
  2,
  46.702500,
  7.795800,
  150,
  190.00,
  ARRAY['Sturdy ankle-high footwear', 'Windbreaker jacket', 'Maximum participant weight 100kg'],
  'Weather dependent; launch suspended under high thermal turbulence or gust fronts.',
  true
),
(
  'a5555555-5555-5555-5555-555555555555',
  'slovenia-soca-whitewater-kayak',
  'Soča Valley Whitewater Run',
  'kayaking',
  'Navigate emerald rapids ranging from class II to class IV through limestone gorges.',
  4,
  46.339200,
  13.551100,
  300,
  120.00,
  ARRAY['Whitewater roll proficiency', 'Level III whitewater experience', 'Neoprene wetsuit'],
  'Siphon hazards and cold mountain snowmelt water require type V PFD and cold-water immersion gear.',
  true
),
(
  'a6666666-6666-6666-6666-666666666666',
  'postojna-pivka-cave-spelunking',
  'Pivka Cave Subterranean Passage',
  'caving',
  'Off-trail karst subterranean exploration along subterranean river routes and limestone chambers.',
  4,
  45.782000,
  14.204000,
  350,
  95.00,
  ARRAY['Speleology helmet with backup headlamp', 'Waterproof cave suit', 'Rubber grip boots'],
  'Confined space navigation, underground flash flooding risk during rainstorms. Strictly guided access only.',
  true
),
(
  'a7777777-7777-7777-7777-777777777777',
  'iceland-laugavegur-trek',
  'Laugavegur Geothermal Highlands Trek',
  'hiking',
  'A multi-day 55km trek passing active geysers, obsidian lava fields, and glacial valleys.',
  3,
  63.983000,
  -19.066700,
  280,
  150.00,
  ARRAY['4-season waterproof shell', 'GPS navigation track', 'High-calorie expedition rations'],
  'Rapid blizzards possible even during midsummer. Unbridged glacial river crossings require wading technique.',
  true
),
(
  'a8888888-8888-8888-8888-888888888888',
  'whistler-top-of-the-world-bike',
  'Whistler Alpine Singletrack Descent',
  'biking',
  'Rugged sub-alpine mountain bike descent on granitic rock slabs and steep switchbacks.',
  4,
  50.059400,
  -122.955000,
  320,
  110.00,
  ARRAY['Full suspension enduro/downhill MTB', 'Full-face helmet', 'Knee and elbow pads'],
  'High speeds on loose shale and granite berms. Medical evacuation can take extended time from peak altitudes.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Example Destinations (5 items)
INSERT INTO public.destinations (
  id, name, category, description, historical_context, 
  source_url, latitude, longitude, access_notes, is_published
) VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  'Derinkuyu Underground City',
  'historical',
  'Multi-level subterranean troglodyte city excavated deep into volcanic tuff rock.',
  'Used primarily in the Byzantine era as a defensive sanctuary against Arab-Byzantine raids during the 8th to 12th centuries.',
  'https://whc.unesco.org/en/list/356',
  38.373600,
  34.734700,
  'Open year-round with controlled stairways; low clearance passages require comfortable stooping mobility.',
  true
),
(
  'd2222222-2222-2222-2222-222222222222',
  'Skellig Michael Monastic Settlement',
  'cultural_heritage',
  'Precipitous Atlantic sea crag crowned by an early Christian monastic enclosure.',
  'Founded between the 6th and 8th century by Christian monks seeking extreme ascetic contemplation on the edge of the known world.',
  'https://whc.unesco.org/en/list/702',
  51.770800,
  -10.540300,
  'Access strictly regulated by seasonal licensed boats; involves ascending over 600 hand-hewn drystone steps without handrails.',
  true
),
(
  'd3333333-3333-3333-3333-333333333333',
  'Richat Structure (Eye of the Sahara)',
  'mystery_trail',
  'A deeply eroded circular geological dome measuring 40km in diameter in the Mauritanian desert.',
  'Originally hypothesized to be a meteorite impact crater, modern geological research indicates an alkaline igneous intrusion with differential erosion.',
  'https://earthobservatory.nasa.gov/images/92071/richat-structure',
  21.126900,
  -11.401600,
  'Remote 4x4 expedition required from Ouadane. Extreme desert conditions require licensed local desert guides and convoy provisions.',
  true
),
(
  'd4444444-4444-4444-4444-444444444444',
  'Kolmanskop Ghost Town',
  'abandoned',
  'Once-affluent diamond mining settlement slowly swallowed by the advancing sand dunes of the Namib Desert.',
  'Built following the 1908 diamond discovery in German South West Africa; abandoned in 1956 as richer deposits were discovered south.',
  'https://namibiatourism.org.na',
  -26.704200,
  15.231900,
  'Permits required from Lüderitz town center; photographic permit required for golden hour entrance.',
  true
),
(
  'd5555555-5555-5555-5555-555555555555',
  'Plitvice Lakes Terraced Karst System',
  'natural_wonder',
  'A chain of 16 terraced cascade lakes formed by biodynamic tufa barriers amidst dense beech and fir forests.',
  'Formed through ongoing biochemical karst travertine deposition over millennia; designated a National Park in 1949.',
  'https://whc.unesco.org/en/list/98',
  44.865400,
  15.603100,
  'Marked boardwalks and electric boat connections. Strict national park regulations: swimming and off-trail hiking prohibited.',
  true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Example Rewards (4 items)
INSERT INTO public.rewards (
  id, name, description, cost_points, stock, is_active
) VALUES
(
  'r1111111-1111-1111-1111-111111111111',
  'Adventure Passport Enamel Pin & Patch',
  'Commemorative embroidered traveler patch and brass adventure badge sent by mail.',
  300,
  500,
  true
),
(
  'r2222222-2222-2222-2222-222222222222',
  'Ultralight Carabiner & Dry Bag Set',
  'Heavy-duty 10L waterproof dry pack and lightweight locking carabiner for water expeditions.',
  600,
  150,
  true
),
(
  'r3333333-3333-3333-3333-333333333333',
  'Global Wilderness First Aid Guidebook',
  'Compact field reference handbook for alpine, backcountry, and oceanic emergency response.',
  450,
  null,
  true
),
(
  'r4444444-4444-4444-4444-444444444444',
  'Guided Expedition Gear Voucher ($50)',
  'Redeemable digital voucher towards technical rental equipment at partnered gear hubs.',
  1200,
  50,
  true
)
ON CONFLICT (id) DO NOTHING;
