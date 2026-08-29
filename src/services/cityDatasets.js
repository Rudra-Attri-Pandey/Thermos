/**
 * City Datasets & Polygons for Global Urban Centers
 * Includes exact coordinates, bounding boxes, baseline temperatures, and urban morphology.
 */

export const CITIES = {
  sanjose: {
    id: 'sanjose',
    name: 'San Jose, CA',
    country: 'United States',
    lat: 37.3382,
    lng: -121.8863,
    zoom: 13,
    baseTempC: 37.2,
    baseTempF: 99.0,
    peakHour: 15, // 3 PM
    humidity: 32,
    solarIrradiance: 920,
    treeCanopyCover: 15.4, // %
    builtDensity: 78.2, // %
    polygon: [
      [-121.9430, 37.2930],
      [-121.8280, 37.2930],
      [-121.8280, 37.3850],
      [-121.9430, 37.3850],
      [-121.9430, 37.2930]
    ],
    hotspots: [
      { name: 'Downtown Asphalt Canyon (Santa Clara St)', lat: 37.3355, lng: -121.8890, tempC: 41.5, type: 'extreme', shade: 8 },
      { name: 'SJSU Campus Core & Parking', lat: 37.3352, lng: -121.8810, tempC: 39.8, type: 'high', shade: 18 },
      { name: 'Guadalupe River Green Corridor', lat: 37.3320, lng: -121.8980, tempC: 33.2, type: 'cool', shade: 72 },
      { name: 'Japantown Shaded Avenues', lat: 37.3490, lng: -121.8940, tempC: 34.6, type: 'cool', shade: 64 },
      { name: 'East San Jose Industrial Logistics', lat: 37.3520, lng: -121.8450, tempC: 43.1, type: 'extreme', shade: 5 }
    ],
    coolingShelters: [
      { name: 'San Jose MLK Jr. Library Cooling Hub', lat: 37.3356, lng: -121.8850, waterStation: true, capacity: 350 },
      { name: 'Roosevelt Community Center', lat: 37.3465, lng: -121.8680, waterStation: true, capacity: 200 },
      { name: 'Arena Green Park Misting Zone', lat: 37.3330, lng: -121.9010, waterStation: true, capacity: 500 }
    ]
  },
  manhattan: {
    id: 'manhattan',
    name: 'Manhattan, NYC',
    country: 'United States',
    lat: 40.7128,
    lng: -74.0060,
    zoom: 14,
    baseTempC: 36.4,
    baseTempF: 97.5,
    peakHour: 14,
    humidity: 48,
    solarIrradiance: 870,
    treeCanopyCover: 11.2,
    builtDensity: 94.0,
    polygon: [
      [-74.0170, 40.7050],
      [-74.0030, 40.7050],
      [-74.0030, 40.7180],
      [-74.0170, 40.7180],
      [-74.0170, 40.7050]
    ],
    hotspots: [
      { name: 'Wall Street Asphalt Canyon', lat: 40.7070, lng: -74.0090, tempC: 41.2, type: 'extreme', shade: 12 },
      { name: 'Foley Square Concrete Plaza', lat: 40.7145, lng: -74.0030, tempC: 42.0, type: 'extreme', shade: 4 },
      { name: 'Battery Park Canopy Trail', lat: 40.7033, lng: -74.0160, tempC: 32.5, type: 'cool', shade: 80 }
    ],
    coolingShelters: [
      { name: 'Battery Park City Community Hub', lat: 40.7110, lng: -74.0150, waterStation: true, capacity: 400 },
      { name: 'Pace University Shaded Plaza', lat: 40.7115, lng: -74.0050, waterStation: true, capacity: 250 }
    ]
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix, AZ',
    country: 'United States',
    lat: 33.4484,
    lng: -112.0740,
    zoom: 13,
    baseTempC: 44.5,
    baseTempF: 112.1,
    peakHour: 16,
    humidity: 14,
    solarIrradiance: 1040,
    treeCanopyCover: 7.8,
    builtDensity: 82.5,
    polygon: [
      [-112.1200, 33.4200],
      [-112.0200, 33.4200],
      [-112.0200, 33.4900],
      [-112.1200, 33.4900],
      [-112.1200, 33.4200]
    ],
    hotspots: [
      { name: 'Downtown Central Bus Terminal Heat Trap', lat: 33.4490, lng: -112.0760, tempC: 48.2, type: 'extreme', shade: 2 },
      { name: 'Warehouse District Dark Roof Zone', lat: 33.4410, lng: -112.0730, tempC: 49.5, type: 'extreme', shade: 0 },
      { name: 'Civic Space Park Shaded Pavilion', lat: 33.4530, lng: -112.0735, tempC: 38.0, type: 'cool', shade: 75 }
    ],
    coolingShelters: [
      { name: 'Burton Barr Central Library Resiliency Hub', lat: 33.4610, lng: -112.0730, waterStation: true, capacity: 800 },
      { name: 'Phoenix Convention Center Cooling Oasis', lat: 33.4495, lng: -112.0670, waterStation: true, capacity: 1200 }
    ]
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai, UAE',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    zoom: 13,
    baseTempC: 43.8,
    baseTempF: 110.8,
    peakHour: 14,
    humidity: 52,
    solarIrradiance: 1010,
    treeCanopyCover: 5.2,
    builtDensity: 89.0,
    polygon: [
      [55.2300, 25.1700],
      [55.3100, 25.1700],
      [55.3100, 25.2400],
      [55.2300, 25.2400],
      [55.2300, 25.1700]
    ],
    hotspots: [
      { name: 'Business Bay Asphalt Grid', lat: 25.1850, lng: 55.2630, tempC: 47.9, type: 'extreme', shade: 6 },
      { name: 'Al Quoz Industrial Logistics District', lat: 25.1450, lng: 55.2350, tempC: 49.2, type: 'extreme', shade: 1 },
      { name: 'Zabeel Park Tree Canopy Oasis', lat: 25.2280, lng: 55.2980, tempC: 36.5, type: 'cool', shade: 68 }
    ],
    coolingShelters: [
      { name: 'Dubai Mall Air-Conditioned Transit Corridor', lat: 25.1970, lng: 55.2790, waterStation: true, capacity: 5000 },
      { name: 'DIFC Gate Village Shaded Promenade', lat: 25.2120, lng: 55.2810, waterStation: true, capacity: 1000 }
    ]
  },
  delhi: {
    id: 'delhi',
    name: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    zoom: 13,
    baseTempC: 42.1,
    baseTempF: 107.8,
    peakHour: 15,
    humidity: 40,
    solarIrradiance: 960,
    treeCanopyCover: 19.8,
    builtDensity: 86.4,
    polygon: [
      [77.1600, 28.5700],
      [77.2600, 28.5700],
      [77.2600, 28.6600],
      [77.1600, 28.6600],
      [77.1600, 28.5700]
    ],
    hotspots: [
      { name: 'Connaught Place Outer Circle Asphalt Ring', lat: 28.6320, lng: 77.2190, tempC: 46.8, type: 'extreme', shade: 10 },
      { name: 'Okhla Industrial Heavy Logistics', lat: 28.5280, lng: 77.2800, tempC: 48.0, type: 'extreme', shade: 4 },
      { name: 'Lutyens Green Canopy Corridor', lat: 28.6010, lng: 77.2150, tempC: 35.2, type: 'cool', shade: 82 }
    ],
    coolingShelters: [
      { name: 'Central Secretariat Metro Cooling Hub', lat: 28.6150, lng: 77.2110, waterStation: true, capacity: 1500 },
      { name: 'India Habitat Centre Shaded Quad', lat: 28.5890, lng: 77.2250, waterStation: true, capacity: 600 }
    ]
  },
  london: {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    zoom: 13,
    baseTempC: 33.8,
    baseTempF: 92.8,
    peakHour: 15,
    humidity: 55,
    solarIrradiance: 760,
    treeCanopyCover: 21.0,
    builtDensity: 88.0,
    polygon: [
      [-0.1800, 51.4800],
      [-0.0700, 51.4800],
      [-0.0700, 51.5400],
      [-0.1800, 51.5400],
      [-0.1800, 51.4800]
    ],
    hotspots: [
      { name: 'City of London Financial Canyon', lat: 51.5130, lng: -0.0880, tempC: 37.5, type: 'high', shade: 22 },
      { name: 'Oxford Street Pavement Heat Trap', lat: 51.5150, lng: -0.1420, tempC: 38.2, type: 'high', shade: 8 },
      { name: 'Hyde Park Meadow & Canopy', lat: 51.5070, lng: -0.1650, tempC: 28.4, type: 'cool', shade: 78 }
    ],
    coolingShelters: [
      { name: 'St. Pancras International Cool Station', lat: 51.5310, lng: -0.1260, waterStation: true, capacity: 2000 },
      { name: 'British Museum Great Court Hub', lat: 51.5190, lng: -0.1270, waterStation: true, capacity: 1200 }
    ]
  },
  // Added U.S. coverage expansion — FortyGuard is U.S.-only per docs, these show live 2m data
  losangeles: {
    id: 'losangeles',
    name: 'Los Angeles, CA',
    country: 'United States',
    lat: 34.0522,
    lng: -118.2437,
    zoom: 13,
    baseTempC: 38.9,
    baseTempF: 102.0,
    peakHour: 15,
    humidity: 28,
    solarIrradiance: 980,
    treeCanopyCover: 19.5,
    builtDensity: 81.0,
    polygon: [
      [-118.3000, 34.0200],
      [-118.1900, 34.0200],
      [-118.1900, 34.0900],
      [-118.3000, 34.0900],
      [-118.3000, 34.0200]
    ],
    hotspots: [
      { name: 'Downtown LA Asphalt Grid (Figueroa)', lat: 34.0450, lng: -118.2600, tempC: 42.8, type: 'extreme', shade: 6 },
      { name: 'Hollywood Walk Concrete Canyon', lat: 34.1010, lng: -118.3250, tempC: 40.1, type: 'high', shade: 14 },
      { name: 'Griffith Park Canopy Oasis', lat: 34.1180, lng: -118.3000, tempC: 32.8, type: 'cool', shade: 76 }
    ],
    coolingShelters: [
      { name: 'Pershing Square Cooling Hub', lat: 34.0480, lng: -118.2530, waterStation: true, capacity: 600 },
      { name: 'Echo Park Community Center', lat: 34.0770, lng: -118.2600, waterStation: true, capacity: 350 }
    ]
  },
  chicago: {
    id: 'chicago',
    name: 'Chicago, IL',
    country: 'United States',
    lat: 41.8781,
    lng: -87.6298,
    zoom: 13,
    baseTempC: 34.2,
    baseTempF: 93.6,
    peakHour: 15,
    humidity: 52,
    solarIrradiance: 840,
    treeCanopyCover: 22.4,
    builtDensity: 87.5,
    polygon: [
      [-87.6800, 41.8400],
      [-87.5800, 41.8400],
      [-87.5800, 41.9100],
      [-87.6800, 41.9100],
      [-87.6800, 41.8400]
    ],
    hotspots: [
      { name: 'The Loop Concrete Canyon (Michigan Ave)', lat: 41.8830, lng: -87.6240, tempC: 38.9, type: 'high', shade: 18 },
      { name: 'West Loop Industrial Heat Trap', lat: 41.8850, lng: -87.6450, tempC: 39.5, type: 'extreme', shade: 5 },
      { name: 'Grant Park Lakefront Canopy', lat: 41.8720, lng: -87.6180, tempC: 31.2, type: 'cool', shade: 74 }
    ],
    coolingShelters: [
      { name: 'Chicago Cultural Center Hub', lat: 41.8838, lng: -87.6240, waterStation: true, capacity: 500 },
      { name: 'Garfield Park Conservatory', lat: 41.8860, lng: -87.7170, waterStation: true, capacity: 700 }
    ]
  },
  houston: {
    id: 'houston',
    name: 'Houston, TX',
    country: 'United States',
    lat: 29.7604,
    lng: -95.3698,
    zoom: 13,
    baseTempC: 39.8,
    baseTempF: 103.6,
    peakHour: 15,
    humidity: 58,
    solarIrradiance: 920,
    treeCanopyCover: 18.6,
    builtDensity: 79.0,
    polygon: [
      [-95.4200, 29.7200],
      [-95.3200, 29.7200],
      [-95.3200, 29.8000],
      [-95.4200, 29.8000],
      [-95.4200, 29.7200]
    ],
    hotspots: [
      { name: 'Downtown Tunnel Asphalt Loop', lat: 29.7560, lng: -95.3670, tempC: 43.2, type: 'extreme', shade: 7 },
      { name: 'Galleria Parking Heat Island', lat: 29.7600, lng: -95.4620, tempC: 41.8, type: 'high', shade: 9 },
      { name: 'Buffalo Bayou Park Canopy', lat: 29.7605, lng: -95.3850, tempC: 33.5, type: 'cool', shade: 71 }
    ],
    coolingShelters: [
      { name: 'George R. Brown Convention Center', lat: 29.7520, lng: -95.3570, waterStation: true, capacity: 1200 },
      { name: 'Discovery Green Misting Oasis', lat: 29.7530, lng: -95.3590, waterStation: true, capacity: 800 }
    ]
  },
  seattle: {
    id: 'seattle',
    name: 'Seattle, WA',
    country: 'United States',
    lat: 47.6062,
    lng: -122.3321,
    zoom: 13,
    baseTempC: 32.5,
    baseTempF: 90.5,
    peakHour: 16,
    humidity: 48,
    solarIrradiance: 790,
    treeCanopyCover: 28.3,
    builtDensity: 74.0,
    polygon: [
      [-122.3800, 47.5700],
      [-122.2850, 47.5700],
      [-122.2850, 47.6400],
      [-122.3800, 47.6400],
      [-122.3800, 47.5700]
    ],
    hotspots: [
      { name: 'Downtown 3rd Ave Concrete Corridor', lat: 47.6050, lng: -122.3330, tempC: 36.8, type: 'high', shade: 16 },
      { name: 'SoDo Industrial Yard', lat: 47.5780, lng: -122.3330, tempC: 37.9, type: 'extreme', shade: 4 },
      { name: 'Kerry Park Canopy View', lat: 47.6290, lng: -122.3600, tempC: 29.2, type: 'cool', shade: 78 }
    ],
    coolingShelters: [
      { name: 'Seattle Center Exhibition Hall Hub', lat: 47.6210, lng: -122.3490, waterStation: true, capacity: 600 },
      { name: 'Pike Place Market Shaded Arcade', lat: 47.6090, lng: -122.3420, waterStation: true, capacity: 400 }
    ]
  },
  miami: {
    id: 'miami',
    name: 'Miami, FL',
    country: 'United States',
    lat: 25.7617,
    lng: -80.1918,
    zoom: 13,
    baseTempC: 36.8,
    baseTempF: 98.2,
    peakHour: 15,
    humidity: 68,
    solarIrradiance: 930,
    treeCanopyCover: 16.2,
    builtDensity: 85.5,
    polygon: [
      [-80.2400, 25.7300],
      [-80.1400, 25.7300],
      [-80.1400, 25.8000],
      [-80.2400, 25.8000],
      [-80.2400, 25.7300]
    ],
    hotspots: [
      { name: 'Brickell Asphalt Canyon', lat: 25.7600, lng: -80.1950, tempC: 40.5, type: 'extreme', shade: 8 },
      { name: 'Wynwood Concrete Art District', lat: 25.8010, lng: -80.1990, tempC: 39.8, type: 'high', shade: 11 },
      { name: 'Bayfront Park Canopy', lat: 25.7750, lng: -80.1870, tempC: 33.1, type: 'cool', shade: 69 }
    ],
    coolingShelters: [
      { name: 'Adrienne Arsht Center Hub', lat: 25.7990, lng: -80.1970, waterStation: true, capacity: 700 },
      { name: 'Miami Beach Convention Center', lat: 25.7900, lng: -80.1400, waterStation: true, capacity: 1500 }
    ]
  },
  boston: {
    id: 'boston',
    name: 'Boston, MA',
    country: 'United States',
    lat: 42.3601,
    lng: -71.0589,
    zoom: 13,
    baseTempC: 34.9,
    baseTempF: 94.8,
    peakHour: 15,
    humidity: 56,
    solarIrradiance: 810,
    treeCanopyCover: 24.5,
    builtDensity: 86.0,
    polygon: [
      [-71.1000, 42.3300],
      [-71.0100, 42.3300],
      [-71.0100, 42.3900],
      [-71.1000, 42.3900],
      [-71.1000, 42.3300]
    ],
    hotspots: [
      { name: 'Financial District Concrete Canyon', lat: 42.3560, lng: -71.0550, tempC: 38.2, type: 'high', shade: 19 },
      { name: 'South Boston Industrial Heat Trap', lat: 42.3380, lng: -71.0500, tempC: 39.0, type: 'extreme', shade: 6 },
      { name: 'Boston Common Canopy Oasis', lat: 42.3550, lng: -71.0650, tempC: 31.5, type: 'cool', shade: 75 }
    ],
    coolingShelters: [
      { name: 'Boston Public Library Courtyard', lat: 42.3495, lng: -71.0780, waterStation: true, capacity: 500 },
      { name: 'City Hall Plaza Misting Corridor', lat: 42.3605, lng: -71.0585, waterStation: true, capacity: 800 }
    ]
  },
  lasvegas: {
    id: 'lasvegas',
    name: 'Las Vegas, NV',
    country: 'United States',
    lat: 36.1699,
    lng: -115.1398,
    zoom: 13,
    baseTempC: 43.2,
    baseTempF: 109.8,
    peakHour: 16,
    humidity: 16,
    solarIrradiance: 1050,
    treeCanopyCover: 6.5,
    builtDensity: 84.0,
    polygon: [
      [-115.1900, 36.1300],
      [-115.0900, 36.1300],
      [-115.0900, 36.2100],
      [-115.1900, 36.2100],
      [-115.1900, 36.1300]
    ],
    hotspots: [
      { name: 'The Strip Asphalt Heat Corridor', lat: 36.1120, lng: -115.1720, tempC: 47.5, type: 'extreme', shade: 1 },
      { name: 'Downtown Fremont Concrete Canyon', lat: 36.1720, lng: -115.1440, tempC: 46.8, type: 'extreme', shade: 3 },
      { name: 'Springs Preserve Canopy', lat: 36.1710, lng: -115.1900, tempC: 37.2, type: 'cool', shade: 68 }
    ],
    coolingShelters: [
      { name: 'Convention Center Transit Hub', lat: 36.1320, lng: -115.1520, waterStation: true, capacity: 1000 },
      { name: 'Downtown Container Park Shade', lat: 36.1685, lng: -115.1395, waterStation: true, capacity: 400 }
    ]
  }
};
