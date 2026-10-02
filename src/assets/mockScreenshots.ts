// High-resolution vector-rendered mobile screenshots for realistic app previews matching the reference image

export function generateAppScreenshot(
  appName: string,
  themeColor: string,
  screenTitle: string,
  screenType: 'dashboard' | 'detail' | 'list' | 'analytics' | 'chat' | 'media'
): string {
  // Return an SVG Data URL representing a high-detail smartphone UI screen
  const primary = themeColor;
  const darkBg = '#0b0f19';
  const cardBg = '#141c2e';
  const accent = '#38bdf8';

  let screenContent = '';

  if (screenType === 'dashboard') {
    screenContent = `
      <!-- App Header -->
      <rect x="20" y="55" width="280" height="40" rx="8" fill="${cardBg}" opacity="0.8"/>
      <circle cx="40" cy="75" r="12" fill="${primary}" />
      <text x="60" y="79" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold">${appName}</text>
      <circle cx="280" cy="75" r="6" fill="${accent}" />

      <!-- Metric Cards Grid -->
      <rect x="20" y="110" width="135" height="75" rx="10" fill="${cardBg}" stroke="${primary}" stroke-width="1" stroke-opacity="0.3"/>
      <text x="32" y="132" fill="#94a3b8" font-size="9" font-family="sans-serif">Total Properties</text>
      <text x="32" y="160" fill="#f8fafc" font-size="18" font-family="sans-serif" font-weight="bold">24</text>

      <rect x="165" y="110" width="135" height="75" rx="10" fill="${cardBg}" stroke="#10b981" stroke-width="1" stroke-opacity="0.3"/>
      <text x="177" y="132" fill="#94a3b8" font-size="9" font-family="sans-serif">Active Tenants</text>
      <text x="177" y="160" fill="#10b981" font-size="18" font-family="sans-serif" font-weight="bold">92%</text>

      <!-- Banner / Chart -->
      <rect x="20" y="200" width="280" height="110" rx="12" fill="${cardBg}"/>
      <text x="32" y="222" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="bold">Revenue Collection</text>
      <text x="32" y="240" fill="#38bdf8" font-size="16" font-family="sans-serif" font-weight="bold">$18,450.00</text>
      <path d="M 32 285 Q 90 250, 150 270 T 280 235" fill="none" stroke="${primary}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="280" cy="235" r="4" fill="#38bdf8"/>

      <!-- Recent Items List -->
      <text x="22" y="332" fill="#94a3b8" font-size="11" font-family="sans-serif" font-weight="bold">Recent Transactions</text>
      
      <rect x="20" y="345" width="280" height="48" rx="8" fill="${cardBg}"/>
      <circle cx="44" cy="369" r="12" fill="#10b981" opacity="0.2"/>
      <text x="65" y="365" fill="#f8fafc" font-size="10" font-family="sans-serif" font-weight="bold">Apt 4B - Rent Paid</text>
      <text x="65" y="380" fill="#64748b" font-size="8" font-family="sans-serif">Sept 25, 2026</text>
      <text x="245" y="374" fill="#10b981" font-size="11" font-family="sans-serif" font-weight="bold">+$1,250</text>

      <rect x="20" y="402" width="280" height="48" rx="8" fill="${cardBg}"/>
      <circle cx="44" cy="426" r="12" fill="#f59e0b" opacity="0.2"/>
      <text x="65" y="422" fill="#f8fafc" font-size="10" font-family="sans-serif" font-weight="bold">Unit 12 - Electricity</text>
      <text x="65" y="437" fill="#64748b" font-size="8" font-family="sans-serif">Sept 24, 2026</text>
      <text x="252" y="431" fill="#f59e0b" font-size="11" font-family="sans-serif" font-weight="bold">+$85</text>

      <rect x="20" y="460" width="280" height="48" rx="8" fill="${cardBg}"/>
      <circle cx="44" cy="484" r="12" fill="${primary}" opacity="0.2"/>
      <text x="65" y="480" fill="#f8fafc" font-size="10" font-family="sans-serif" font-weight="bold">Apt 2A - Water Bill</text>
      <text x="65" y="495" fill="#64748b" font-size="8" font-family="sans-serif">Sept 22, 2026</text>
      <text x="255" y="489" fill="${accent}" font-size="11" font-family="sans-serif" font-weight="bold">+$40</text>
    `;
  } else if (screenType === 'detail') {
    screenContent = `
      <!-- Header with back arrow -->
      <path d="M 30 75 L 42 67 M 30 75 L 42 83" stroke="#f8fafc" stroke-width="2" stroke-linecap="round"/>
      <text x="60" y="79" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold">${screenTitle}</text>
      
      <!-- Property Card -->
      <rect x="20" y="105" width="280" height="150" rx="12" fill="${cardBg}"/>
      <rect x="20" y="105" width="280" height="85" rx="12" fill="${primary}" opacity="0.25"/>
      <text x="35" y="165" fill="#ffffff" font-size="16" font-family="sans-serif" font-weight="bold">Skyline Deluxe Tower</text>
      <text x="35" y="210" fill="#94a3b8" font-size="10" font-family="sans-serif">Unit 502 • 3 BHK Luxury Flat</text>
      <text x="35" y="235" fill="#38bdf8" font-size="14" font-family="sans-serif" font-weight="bold">$2,800 / month</text>

      <!-- Tenant Card -->
      <rect x="20" y="275" width="280" height="90" rx="10" fill="${cardBg}"/>
      <circle cx="50" cy="320" r="18" fill="${primary}" opacity="0.4"/>
      <text x="80" y="315" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold">Alexander Wright</text>
      <text x="80" y="332" fill="#94a3b8" font-size="9" font-family="sans-serif">Lease active: Dec 2027</text>
      <text x="80" y="347" fill="#10b981" font-size="9" font-family="sans-serif">✓ Verified Identity</text>

      <!-- Action Buttons -->
      <rect x="20" y="385" width="135" height="42" rx="8" fill="${cardBg}" stroke="${primary}" stroke-width="1"/>
      <text x="50" y="411" fill="#f8fafc" font-size="10" font-family="sans-serif">Generate Bill</text>

      <rect x="165" y="385" width="135" height="42" rx="8" fill="${primary}"/>
      <text x="195" y="411" fill="#ffffff" font-size="10" font-family="sans-serif" font-weight="bold">Collect Rent</text>
    `;
  } else {
    screenContent = `
      <text x="30" y="75" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold">${screenTitle}</text>
      <rect x="20" y="95" width="280" height="35" rx="8" fill="${cardBg}"/>
      <text x="40" y="117" fill="#64748b" font-size="10" font-family="sans-serif">Search ${appName}...</text>

      <!-- Content cards -->
      <rect x="20" y="145" width="280" height="75" rx="10" fill="${cardBg}"/>
      <circle cx="50" cy="182" r="16" fill="${primary}" opacity="0.5"/>
      <text x="78" y="177" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="bold">Premium Workspace Hub</text>
      <text x="78" y="195" fill="#94a3b8" font-size="9" font-family="sans-serif">Floor 12 • 45 Desks</text>

      <rect x="20" y="235" width="280" height="75" rx="10" fill="${cardBg}"/>
      <circle cx="50" cy="272" r="16" fill="${accent}" opacity="0.5"/>
      <text x="78" y="267" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="bold">Sunset Villa Suites</text>
      <text x="78" y="285" fill="#94a3b8" font-size="9" font-family="sans-serif">Building A • All occupied</text>

      <rect x="20" y="325" width="280" height="75" rx="10" fill="${cardBg}"/>
      <circle cx="50" cy="362" r="16" fill="#10b981" opacity="0.5"/>
      <text x="78" y="357" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="bold">Northgate Commercial</text>
      <text x="78" y="375" fill="#94a3b8" font-size="9" font-family="sans-serif">18 Offices • 2 Available</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 560" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${darkBg}" />
        <stop offset="100%" stop-color="#060913" />
      </linearGradient>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primary}" />
        <stop offset="100%" stop-color="${accent}" />
      </linearGradient>
    </defs>
    <!-- Screen background -->
    <rect width="320" height="560" rx="28" fill="url(#bgGrad)"/>
    
    <!-- Phone status bar -->
    <text x="32" y="28" fill="#cbd5e1" font-size="9" font-family="sans-serif" font-weight="bold">9:41</text>
    <circle cx="270" cy="25" r="3" fill="#cbd5e1"/>
    <path d="M 280 22 L 292 22 A 2 2 0 0 1 294 24 L 294 28 A 2 2 0 0 1 292 30 L 280 30 Z" fill="#cbd5e1"/>
    <line x1="275" y1="27" x2="277" y2="25" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Dynamic content -->
    ${screenContent}

    <!-- Bottom Navigation Bar -->
    <rect x="0" y="505" width="320" height="55" fill="${cardBg}" opacity="0.95"/>
    <circle cx="60" cy="528" r="8" fill="${primary}"/>
    <circle cx="125" cy="528" r="6" fill="#475569"/>
    <circle cx="195" cy="528" r="6" fill="#475569"/>
    <circle cx="260" cy="528" r="6" fill="#475569"/>

    <!-- iPhone home indicator line -->
    <rect x="110" y="548" width="100" height="3" rx="1.5" fill="#64748b"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
