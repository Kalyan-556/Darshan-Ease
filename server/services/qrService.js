// Offline SVG QR Code generator
exports.generateQRCode = (text) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
    <rect width="100" height="100" fill="white"/>
    
    <!-- Position locator (top-left) -->
    <rect x="5" y="5" width="25" height="25" fill="black"/>
    <rect x="9" y="9" width="17" height="17" fill="white"/>
    <rect x="13" y="13" width="9" height="9" fill="black"/>
    
    <!-- Position locator (top-right) -->
    <rect x="70" y="5" width="25" height="25" fill="black"/>
    <rect x="74" y="9" width="17" height="17" fill="white"/>
    <rect x="78" y="13" width="9" height="9" fill="black"/>
    
    <!-- Position locator (bottom-left) -->
    <rect x="5" y="70" width="25" height="25" fill="black"/>
    <rect x="9" y="74" width="17" height="17" fill="white"/>
    <rect x="13" y="78" width="9" height="9" fill="black"/>

    <!-- Small alignment square (bottom-right area) -->
    <rect x="70" y="70" width="10" height="10" fill="black"/>
    <rect x="72" y="72" width="6" height="6" fill="white"/>
    <rect x="74" y="74" width="2" height="2" fill="black"/>
    
    <!-- Simulated data matrix dots -->
    <rect x="35" y="10" width="5" height="15" fill="black"/>
    <rect x="45" y="5" width="10" height="5" fill="black"/>
    <rect x="60" y="20" width="5" height="10" fill="black"/>
    <rect x="35" y="35" width="15" height="5" fill="black"/>
    <rect x="55" y="35" width="5" height="20" fill="black"/>
    <rect x="10" y="45" width="15" height="5" fill="black"/>
    <rect x="20" y="55" width="5" height="10" fill="black"/>
    <rect x="35" y="50" width="10" height="10" fill="black"/>
    <rect x="50" y="50" width="20" height="5" fill="black"/>
    <rect x="80" y="35" width="15" height="15" fill="black"/>
    <rect x="85" y="55" width="10" height="5" fill="black"/>
    <rect x="70" y="85" width="10" height="5" fill="black"/>
    <rect x="85" y="80" width="10" height="10" fill="black"/>
    
    <!-- Tiny data modules -->
    <rect x="35" y="5" width="3" height="3" fill="black"/>
    <rect x="40" y="30" width="3" height="3" fill="black"/>
    <rect x="50" y="15" width="3" height="3" fill="black"/>
    <rect x="55" y="25" width="3" height="3" fill="black"/>
    <rect x="45" y="45" width="3" height="3" fill="black"/>
    <rect x="30" y="55" width="3" height="3" fill="black"/>
    <rect x="65" y="65" width="3" height="3" fill="black"/>
    
    <!-- Text Label -->
    <text x="50" y="96" font-size="3" font-family="monospace" text-anchor="middle" fill="#666666">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
