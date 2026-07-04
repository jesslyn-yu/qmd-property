/* =============================================================================
   PLACEHOLDER DATA — replace with live Domain API or Google Sheets connection
   when ready.
   -----------------------------------------------------------------------------
   This file is intentionally kept separate from all page logic. Every page that
   needs property data reads from the global `QMD_LISTINGS` array defined below.

   To go live later, replace the contents of this file so that `QMD_LISTINGS`
   is populated from a real source (Domain API, Google Sheets, a CMS, etc.).
   As long as each listing object keeps the same shape (the keys used below),
   no other file needs to change. See README.md for a worked example.

   Each listing object shape:
   {
     id:           Number  - unique id, used by listing.html?id=...
     name:         String  - property/marketing name
     suburb:       String  - Sydney suburb
     price:        Number  - asking price in AUD
     type:         String  - "Apartment" | "House" | "Townhouse" | "Duplex" | "Studio"
     listingType:  String  - "Buy" | "Rent"
     rentalYield:  Number  - gross rental yield, %
     capRate:      Number  - capitalisation rate, %
     roi:          Number  - projected return on investment, %
     bedrooms:     Number
     bathrooms:    Number
     parking:      Number
     description:  String
     photo:        String  - hero image URL
     gallery:      [String]- additional image URLs
   }
   ========================================================================== */

const QMD_LISTINGS = [
  {
    id: 1,
    name: "Harbourview Residences",
    suburb: "Mosman",
    price: 1850000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 3.4,
    capRate: 3.1,
    roi: 8.6,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    description:
      "A blue-chip apartment with district harbour glimpses, in one of Sydney's most tightly held suburbs. Strong long-term capital growth credentials with steady tenant demand.",
    photo: "https://placehold.co/800x560/0d2240/ff7a1a?text=Harbourview+Residences",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Living",
      "https://placehold.co/800x560/12305a/ff944d?text=Kitchen",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Master+Suite"
    ]
  },
  {
    id: 2,
    name: "The Parkside Collection",
    suburb: "Parramatta",
    price: 720000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 5.2,
    capRate: 4.7,
    roi: 11.3,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "High-yield apartment in Sydney's second CBD. Walk to rail, university and the new light rail. A classic cash-flow play in a growth corridor.",
    photo: "https://placehold.co/800x560/12305a/ff7a1a?text=Parkside+Collection",
    gallery: [
      "https://placehold.co/800x560/12305a/ff7a1a?text=Lounge",
      "https://placehold.co/800x560/0d2240/ff944d?text=Balcony",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Ensuite"
    ]
  },
  {
    id: 3,
    name: "Coastal Heights Townhomes",
    suburb: "Cronulla",
    price: 1320000,
    type: "Townhouse",
    listingType: "Buy",
    rentalYield: 4.1,
    capRate: 3.8,
    roi: 9.4,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    description:
      "Modern beachside townhouse moments from the sand. Lifestyle appeal underpins consistent rental demand and resilient values.",
    photo: "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Coastal+Heights",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Courtyard",
      "https://placehold.co/800x560/12305a/ff944d?text=Open+Plan",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Bedroom"
    ]
  },
  {
    id: 4,
    name: "Metro Yield Studios",
    suburb: "Chippendale",
    price: 545000,
    type: "Studio",
    listingType: "Buy",
    rentalYield: 5.8,
    capRate: 5.1,
    roi: 12.1,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    description:
      "Inner-city studio with outstanding yield, surrounded by universities and dining precincts. A low-entry, high-occupancy investment.",
    photo: "https://placehold.co/800x560/12305a/ff944d?text=Metro+Yield+Studios",
    gallery: [
      "https://placehold.co/800x560/12305a/ff944d?text=Studio",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Kitchenette",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Building"
    ]
  },
  {
    id: 5,
    name: "Garden Grove House",
    suburb: "Epping",
    price: 1680000,
    type: "House",
    listingType: "Buy",
    rentalYield: 3.6,
    capRate: 3.3,
    roi: 8.9,
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    description:
      "Full brick family home on a generous block in a top school catchment. Land value and family demand drive long-term growth.",
    photo: "https://placehold.co/800x560/0d2240/ff944d?text=Garden+Grove+House",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff944d?text=Frontage",
      "https://placehold.co/800x560/12305a/ff7a1a?text=Backyard",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Dining"
    ]
  },
  {
    id: 6,
    name: "Skyline Duplex",
    suburb: "Marrickville",
    price: 1450000,
    type: "Duplex",
    listingType: "Buy",
    rentalYield: 4.6,
    capRate: 4.2,
    roi: 10.2,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    description:
      "Architect-designed duplex in a fast-gentrifying inner-west pocket. Dual income potential with strong creative-class tenant demand.",
    photo: "https://placehold.co/800x560/0a1a2f/ff944d?text=Skyline+Duplex",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff944d?text=Facade",
      "https://placehold.co/800x560/12305a/ff7a1a?text=Living",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Terrace"
    ]
  },
  {
    id: 7,
    name: "Riverbend Apartments",
    suburb: "Rhodes",
    price: 815000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 4.9,
    capRate: 4.4,
    roi: 10.7,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "Waterfront-precinct apartment with resort facilities and a direct rail line to the CBD. Popular with professional tenants.",
    photo: "https://placehold.co/800x560/12305a/ff7a1a?text=Riverbend+Apartments",
    gallery: [
      "https://placehold.co/800x560/12305a/ff7a1a?text=Pool",
      "https://placehold.co/800x560/0d2240/ff944d?text=Interior",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=View"
    ]
  },
  {
    id: 8,
    name: "The Foundry Lofts",
    suburb: "Alexandria",
    price: 980000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 4.7,
    capRate: 4.3,
    roi: 10.4,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    description:
      "Converted warehouse loft with high ceilings and industrial character. A standout in a sought-after employment hub.",
    photo: "https://placehold.co/800x560/0d2240/ff7a1a?text=Foundry+Lofts",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Loft",
      "https://placehold.co/800x560/12305a/ff944d?text=Kitchen",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Mezzanine"
    ]
  },
  {
    id: 9,
    name: "Sapphire Bay Apartment",
    suburb: "Wollstonecraft",
    price: 1120000,
    type: "Apartment",
    listingType: "Rent",
    rentalYield: 4.0,
    capRate: 3.7,
    roi: 9.1,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "Leafy lower-north-shore apartment available to rent, steps from rail and parkland. Quiet, blue-chip and tenant-ready.",
    photo: "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Sapphire+Bay",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Living",
      "https://placehold.co/800x560/12305a/ff944d?text=Balcony",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Bedroom"
    ]
  },
  {
    id: 10,
    name: "Westgate Family House",
    suburb: "Blacktown",
    price: 890000,
    type: "House",
    listingType: "Buy",
    rentalYield: 5.0,
    capRate: 4.6,
    roi: 11.0,
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    description:
      "Affordable detached house in a high-growth western Sydney corridor. Land-rich entry point with strong rental fundamentals.",
    photo: "https://placehold.co/800x560/12305a/ff944d?text=Westgate+House",
    gallery: [
      "https://placehold.co/800x560/12305a/ff944d?text=Frontage",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Yard",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Lounge"
    ]
  },
  {
    id: 11,
    name: "Vantage Point Penthouse",
    suburb: "North Sydney",
    price: 2450000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 3.2,
    capRate: 3.0,
    roi: 8.1,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    description:
      "Premium penthouse in the heart of the North Sydney business district. Trophy asset with enduring executive-tenant appeal.",
    photo: "https://placehold.co/800x560/0d2240/ff7a1a?text=Vantage+Penthouse",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Skyline",
      "https://placehold.co/800x560/12305a/ff944d?text=Living",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Terrace"
    ]
  },
  {
    id: 12,
    name: "Orchard Lane Townhomes",
    suburb: "Castle Hill",
    price: 1180000,
    type: "Townhouse",
    listingType: "Buy",
    rentalYield: 4.3,
    capRate: 3.9,
    roi: 9.7,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    description:
      "Spacious townhouse in the booming Hills District, close to the metro line. Family-friendly with reliable growth and rent.",
    photo: "https://placehold.co/800x560/12305a/ff7a1a?text=Orchard+Lane",
    gallery: [
      "https://placehold.co/800x560/12305a/ff7a1a?text=Exterior",
      "https://placehold.co/800x560/0d2240/ff944d?text=Open+Plan",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Garden"
    ]
  },
  {
    id: 13,
    name: "The Exchange Apartments",
    suburb: "Burwood",
    price: 760000,
    type: "Apartment",
    listingType: "Rent",
    rentalYield: 5.1,
    capRate: 4.6,
    roi: 11.2,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    description:
      "Transport-hub apartment available to rent above a thriving retail precinct. Consistently low vacancy and strong yield.",
    photo: "https://placehold.co/800x560/0a1a2f/ff944d?text=The+Exchange",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff944d?text=Living",
      "https://placehold.co/800x560/12305a/ff7a1a?text=Kitchen",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Bedroom"
    ]
  },
  {
    id: 14,
    name: "Beacon Hill Residence",
    suburb: "Manly",
    price: 1990000,
    type: "House",
    listingType: "Buy",
    rentalYield: 3.5,
    capRate: 3.2,
    roi: 8.7,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    description:
      "Northern-beaches family home a short stroll from the ocean. Premier lifestyle location with exceptional long-term growth.",
    photo: "https://placehold.co/800x560/0d2240/ff944d?text=Beacon+Hill",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff944d?text=Frontage",
      "https://placehold.co/800x560/12305a/ff7a1a?text=Deck",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Living"
    ]
  },
  {
    id: 15,
    name: "Quarter Mile Lofts",
    suburb: "Redfern",
    price: 935000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 4.8,
    capRate: 4.4,
    roi: 10.6,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "Design-led apartment in a rapidly transforming inner-city village. Walk to tech employers and Central Station.",
    photo: "https://placehold.co/800x560/12305a/ff944d?text=Quarter+Mile+Lofts",
    gallery: [
      "https://placehold.co/800x560/12305a/ff944d?text=Lounge",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Balcony",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Ensuite"
    ]
  },
  {
    id: 16,
    name: "Lakeside Duplex",
    suburb: "Liverpool",
    price: 845000,
    type: "Duplex",
    listingType: "Buy",
    rentalYield: 5.4,
    capRate: 4.9,
    roi: 11.6,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    description:
      "Brand-new duplex half in a major south-west growth precinct near the new airport. Excellent cash flow and depreciation benefits.",
    photo: "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Lakeside+Duplex",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Exterior",
      "https://placehold.co/800x560/12305a/ff944d?text=Living",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Bedroom"
    ]
  },
  {
    id: 17,
    name: "The Atrium Apartment",
    suburb: "Hurstville",
    price: 690000,
    type: "Apartment",
    listingType: "Rent",
    rentalYield: 5.3,
    capRate: 4.8,
    roi: 11.4,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "Well-appointed apartment to rent in a busy southern Sydney hub. Strong transport links and dependable tenant demand.",
    photo: "https://placehold.co/800x560/12305a/ff7a1a?text=The+Atrium",
    gallery: [
      "https://placehold.co/800x560/12305a/ff7a1a?text=Living",
      "https://placehold.co/800x560/0d2240/ff944d?text=Kitchen",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Balcony"
    ]
  },
  {
    id: 18,
    name: "Stonecutters House",
    suburb: "Balmain",
    price: 2150000,
    type: "House",
    listingType: "Buy",
    rentalYield: 3.3,
    capRate: 3.0,
    roi: 8.3,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    description:
      "Restored heritage terrace in a prestige peninsula suburb. Scarcity and character drive premium values and rents.",
    photo: "https://placehold.co/800x560/0d2240/ff7a1a?text=Stonecutters+House",
    gallery: [
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Facade",
      "https://placehold.co/800x560/12305a/ff944d?text=Courtyard",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Living"
    ]
  },
  {
    id: 19,
    name: "Horizon Apartments",
    suburb: "Macquarie Park",
    price: 785000,
    type: "Apartment",
    listingType: "Buy",
    rentalYield: 5.0,
    capRate: 4.5,
    roi: 10.9,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    description:
      "Apartment beside a major tech and university employment node, on the metro line. Built-in tenant base of students and professionals.",
    photo: "https://placehold.co/800x560/12305a/ff944d?text=Horizon+Apartments",
    gallery: [
      "https://placehold.co/800x560/12305a/ff944d?text=Living",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Bedroom",
      "https://placehold.co/800x560/0a1a2f/ff7a1a?text=Balcony"
    ]
  },
  {
    id: 20,
    name: "Cedar Court House",
    suburb: "Penrith",
    price: 815000,
    type: "House",
    listingType: "Buy",
    rentalYield: 5.2,
    capRate: 4.7,
    roi: 11.3,
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    description:
      "Modern detached home in a far-western growth city benefiting from major infrastructure investment. Affordable with strong yield.",
    photo: "https://placehold.co/800x560/0a1a2f/ff944d?text=Cedar+Court+House",
    gallery: [
      "https://placehold.co/800x560/0a1a2f/ff944d?text=Frontage",
      "https://placehold.co/800x560/12305a/ff7a1a?text=Backyard",
      "https://placehold.co/800x560/0d2240/ff7a1a?text=Living"
    ]
  }
];

// Expose globally for non-module scripts.
if (typeof window !== "undefined") {
  window.QMD_LISTINGS = QMD_LISTINGS;
}
