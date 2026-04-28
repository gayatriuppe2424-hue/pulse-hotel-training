export interface Option {
  label: string;
  nextId: string;
  points: number;
  outcome: string;
  outcomeImageUrl?: string;
}

export interface Scenario {
  id: string;
  category: string;
  narrative: string;
  visualCue: string;
  imageUrl?: string;
  options: Option[];
}

export const MODULES = [
  { id: 'K-01', title: 'Kitchen', desc: 'Grease fires & chemical hazard management.', type: 'fire', imgUrl: '/kitchen.jpg' },
  { id: 'G-01', title: 'Guest Room', desc: 'Protocol for suspected room fires or hazards.', type: 'guest', imgUrl: '/guest_hallway_smoke_base.png' },
  { id: 'L-01', title: 'Lobby Evacuation', desc: 'Crowd control and rapid evacuation protocols.', type: 'general', imgUrl: '/lobby_evacuation_base.jpeg' },
  { id: 'S-01', title: 'Suspicious Object', desc: 'Bomb threat and suspicious package handling.', type: 'danger', imgUrl: '/suspicious_object_base.png' },
  { id: 'M-01', title: 'Medical Emergency', desc: 'First aid and rapid EMS response procedures.', type: 'medical', imgUrl: '/medical_emergency_base.png' },
  { id: 'C-01', title: 'Cyber Security Branch', desc: 'Ransomware response and data protection.', type: 'cyber', imgUrl: '/cyber-security.jpg' }
];

export const CRISIS_DATASET: Scenario[] = [
  // 1. Kitchen
  {
    "id": "K-01",
    "category": "Kitchen",
    "narrative": "A pan of oil ignites in the kitchen. Flames are 2 feet high.",
    "visualCue": "Large pan on a stove with bright orange flames rising.",
    "imageUrl": "/kitchen.jpg",
    "options": [
      { "label": "A: Throw water on it", "nextId": "GAMEOVER", "points": 0, "outcome": "Fire explodes!", "outcomeImageUrl": "/kitchen_water_explosion.png" },
      { "label": "B: Cover with a metal lid", "nextId": "K-02", "points": 20, "outcome": "Fire is smothered.", "outcomeImageUrl": "/kitchen_metal_lid.png" },
      { "label": "C: Use Class K Fire Extinguisher", "nextId": "SUCCESS", "points": 50, "outcome": "Fire completely extinguished.", "outcomeImageUrl": "/kitchen_extinguisher_foam.png" }
    ]
  },
  {
    "id": "K-02",
    "category": "Kitchen",
    "narrative": "The fire is out, but thick smoke is filling the kitchen.",
    "visualCue": "Hazy kitchen filled with gray smoke, stove is off.",
    "imageUrl": "/kitchen_smoke_base.png",
    "options": [
      { "label": "A: Open all windows", "nextId": "GAMEOVER", "points": 5, "outcome": "Oxygen feeds embers causing property damage.", "outcomeImageUrl": "/kitchen_open_windows.png" },
      { "label": "B: Turn on exhaust fan", "nextId": "SUCCESS", "points": 10, "outcome": "Smoke clears slightly but takes time.", "outcomeImageUrl": "/kitchen_exhaust_fan.png" },
      { "label": "C: Evacuate and close door", "nextId": "SUCCESS", "points": 20, "outcome": "Smoke is perfectly contained. Great job.", "outcomeImageUrl": "/kitchen_evacuate_door.png" }
    ]
  },

  // 2. Guest Room
  {
    "id": "G-01",
    "category": "Guest Room",
    "narrative": "You smell smoke under Room 402. You knock, but there’s no answer.",
    "visualCue": "Hotel hallway, smoke seeping from under a wooden door.",
    "imageUrl": "/guest_hallway_smoke_base.png",
    "options": [
      { "label": "A: Open door immediately", "nextId": "GAMEOVER", "points": 0, "outcome": "Backdraft hits you!", "outcomeImageUrl": "/guest_backdraft_door.png" },
      { "label": "B: Touch handle first", "nextId": "G-02", "points": 20, "outcome": "Handle is cold.", "outcomeImageUrl": "/guest_touch_handle.png" },
      { "label": "C: Call front desk", "nextId": "G-02", "points": 10, "outcome": "Help is on the way.", "outcomeImageUrl": "/guest_call_desk.png" }
    ]
  },
  {
    "id": "G-02",
    "category": "Guest Room",
    "narrative": "The door handle is cold. You enter the room safely. A small iron is smoking heavily.",
    "visualCue": "A hotel iron left face down on an ironing board, thick smoke rising.",
    "imageUrl": "/guest_iron_smoke_base.png",
    "options": [
      { "label": "A: Throw water on it", "nextId": "GAMEOVER", "points": -20, "outcome": "Electrocution hazard!", "outcomeImageUrl": "/guest_iron_water_shock.png" },
      { "label": "B: Unplug and use Fire Extinguisher", "nextId": "SUCCESS", "points": 40, "outcome": "Hazard eliminated.", "outcomeImageUrl": "/guest_iron_extinguished.png" },
      { "label": "C: Ignore and close the door", "nextId": "GAMEOVER", "points": -50, "outcome": "Fire spreads.", "outcomeImageUrl": "/guest_iron_fire_spread.png" }
    ]
  },

  // 3. Lobby Evacuation
  {
    "id": "L-01",
    "category": "Lobby Evacuation",
    "narrative": "The fire alarm is triggered system-wide. Guests in the lobby are panicking and running towards the revolving doors.",
    "visualCue": "Crowded lobby with alarming strobes. People rushing.",
    "imageUrl": "/lobby_evacuation_base.png",
    "options": [
      { "label": "A: Yell loudly to get their attention", "nextId": "GAMEOVER", "points": -10, "outcome": "Panic increases.", "outcomeImageUrl": "/lobby_yell_panic.png" },
      { "label": "B: Lock the revolving doors", "nextId": "GAMEOVER", "points": -50, "outcome": "Guests are trapped.", "outcomeImageUrl": "/lobby_doors_locked.png" },
      { "label": "C: Direct guests to emergency side exits calmly", "nextId": "SUCCESS", "points": 30, "outcome": "Guests safely evacuate.", "outcomeImageUrl": "/lobby_calm_exit.png" }
    ]
  },

  // 4. Suspicious Object
  {
    "id": "S-01",
    "category": "Suspicious Object",
    "narrative": "Housekeeping reports a strange unmarked briefcase left abandoned near the main structural column in the lobby.",
    "visualCue": "A silver metal briefcase sitting alone next to a marble pillar.",
    "imageUrl": "/suspicious_object_scenario.png",
    "options": [
      { "label": "A: Open it to see what's inside", "nextId": "GAMEOVER", "points": -100, "outcome": "Potentially triggering a device.", "outcomeImageUrl": "/suspicious_object_open.png" },
      { "label": "B: Move it to the lost and found", "nextId": "GAMEOVER", "points": -50, "outcome": "Endangering personnel.", "outcomeImageUrl": "/suspicious_object_move.png" },
      { "label": "C: Clear the area and call authorities", "nextId": "SUCCESS", "points": 50, "outcome": "Bomb squad safely retrieves it.", "outcomeImageUrl": "/suspicious_object_squad.png" }
    ]
  },

  // 5. Medical Emergency
  {
    "id": "M-01",
    "category": "Medical Emergency",
    "narrative": "A guest collapses in the lobby, clutching their chest and struggling to breathe.",
    "visualCue": "Guest sitting on the lobby floor, holding their chest with worried staff nearby.",
    "imageUrl": "/medical_scenario.png",
    "options": [
      { "label": "A: Perform CPR immediately", "nextId": "GAMEOVER", "points": -10, "outcome": "Did not check airway.", "outcomeImageUrl": "/medical_outcome_cpr.png" },
      { "label": "B: Call EMS & locate the AED", "nextId": "SUCCESS", "points": 50, "outcome": "Help successfully arrives.", "outcomeImageUrl": "/medical_outcome_aed.png" },
      { "label": "C: Offer the guest a glass of water", "nextId": "GAMEOVER", "points": -20, "outcome": "Choking hazard induced.", "outcomeImageUrl": "/medical_outcome_water.png" }
    ]
  },

  // 6. Cyber Security Branch
  {
    "id": "C-01",
    "category": "Cyber Security Branch",
    "narrative": "The front desk management system suddenly displays a red screen demanding Bitcoin. Keycard systems are offline.",
    "visualCue": "Computer monitor showing a red skull logo and a countdown timer.",
    "imageUrl": "/cyber_scenario.png",
    "options": [
      { "label": "A: Pay the ransom immediately", "nextId": "GAMEOVER", "points": -100, "outcome": "Funds lost, systems still locked.", "outcomeImageUrl": "/cyber_outcome_pay.png" },
      { "label": "B: Disconnect servers from the internet", "nextId": "SUCCESS", "points": 40, "outcome": "Infection contained.", "outcomeImageUrl": "/cyber_outcome_disconnect.png" },
      { "label": "C: Restart the computer", "nextId": "GAMEOVER", "points": -10, "outcome": "Bootloader is encrypted.", "outcomeImageUrl": "/cyber_outcome_restart.png" }
    ]
  }
];
