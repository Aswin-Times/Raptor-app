export interface FirstAidTopic {
  id: string;
  title: string;
  shortDescription: string;
  instructions: string[];
  warnings: string[];
}

export const firstAidData: FirstAidTopic[] = [
  {
    id: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    shortDescription: "For an adult who is unresponsive and not breathing normally.",
    instructions: [
      "Ensure the scene is safe. Tap the person's shoulder and shout, 'Are you okay?'",
      "If unresponsive and not breathing (or only gasping), call 911/112 immediately and get an AED if available.",
      "Place the person flat on their back on a firm, flat surface.",
      "Place the heel of one hand in the center of their chest (lower half of the breastbone), with the other hand on top. Interlace your fingers.",
      "Push hard and fast: Compress the chest at least 2 inches deep at a rate of 100 to 120 compressions per minute.",
      "Allow the chest to return to its normal position after each compression.",
      "If trained in CPR: After 30 compressions, open the airway (tilt head back, lift chin), pinch the nose, and give 2 rescue breaths (each lasting about 1 second, watching for chest rise).",
      "Continue cycles of 30 compressions and 2 breaths (or continuous compressions if untrained) until the person shows clear signs of life, an AED is ready to use, or EMS arrives."
    ],
    warnings: [
      "Do not stop chest compressions for more than 10 seconds.",
      "For infants (under 1 year), use 2 fingers in the center of the chest and press about 1.5 inches deep."
    ]
  },
  {
    id: "choking",
    title: "Choking (Adult/Child)",
    shortDescription: "For someone whose airway is completely blocked and cannot cough, speak, or breathe.",
    instructions: [
      "Ask 'Are you choking?' If they nod yes, tell them you are going to help.",
      "Call 911/112 immediately.",
      "Give 5 Back Blows: Stand to the side and slightly behind the person. Support their chest with one hand and lean them forward. Give 5 firm blows between their shoulder blades with the heel of your other hand.",
      "Give 5 Abdominal Thrusts (Heimlich Maneuver): Stand behind them, wrap your arms around their waist. Make a fist with one hand and place the thumb side just above their belly button. Grasp your fist with your other hand and give 5 quick, upward thrusts.",
      "Alternate between 5 back blows and 5 abdominal thrusts until the object is forced out or the person becomes unresponsive."
    ],
    warnings: [
      "If the person becomes unresponsive, carefully lower them to the ground and begin CPR, starting with chest compressions.",
      "Look in the mouth before giving rescue breaths during CPR; only remove the object if you can clearly see it and sweep it out easily. Never do a blind finger sweep.",
      "For infants, do not use abdominal thrusts. Use 5 gentle back blows followed by 5 chest thrusts."
    ]
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    shortDescription: "For heavy, continuous bleeding or blood that is spurting from a wound.",
    instructions: [
      "Ensure your safety. Put on medical gloves or use a physical barrier (like a plastic bag) if available.",
      "Call emergency services immediately for severe bleeding.",
      "Apply direct pressure: Place a sterile dressing or clean cloth over the wound and press firmly with both hands.",
      "Maintain continuous, firm pressure. Do not lift the dressing to check the wound.",
      "If blood soaks through the dressing, place another dressing on top of the first and keep pressing.",
      "If possible and safe, elevate the injured body part above the level of the heart.",
      "Once bleeding stops or slows significantly, wrap a bandage tightly over the dressings to maintain pressure."
    ],
    warnings: [
      "Never remove the original dressing; removing it will tear away the clotting blood and restart the bleeding.",
      "If bleeding from an arm or leg cannot be controlled by direct pressure, a tourniquet should be applied 2-3 inches above the wound (but not on a joint) by a trained individual."
    ]
  },
  {
    id: "burns",
    title: "Burns (Thermal)",
    shortDescription: "For burns caused by heat, fire, hot objects, or hot liquids.",
    instructions: [
      "Stop the burning process: Remove the person from the source of heat. If their clothing is on fire, have them 'Stop, Drop, and Roll'.",
      "Cool the burn: Run cool (not cold or freezing) water over the affected area for at least 10 to 20 minutes. If running water isn't available, use cool, wet compresses.",
      "Remove constricting items: Gently take off jewelry, watches, rings, or belts near the burn area before swelling begins.",
      "Cover the burn: Once cooled, cover the burn loosely with a sterile, non-stick dressing, plastic wrap, or a clean, dry cloth."
    ],
    warnings: [
      "Do NOT apply ice or ice water, as this can cause further tissue damage.",
      "Do NOT apply butter, ointments, lotions, or creams to a severe burn, as they can trap heat and cause infection.",
      "Do NOT break or pop blisters.",
      "Seek immediate medical attention for burns that are deep, cover a large area, or affect the face, hands, feet, groin, or major joints."
    ]
  },
  {
    id: "heart_attack",
    title: "Heart Attack",
    shortDescription: "When blood flow to a part of the heart is blocked.",
    instructions: [
      "Call 911/112 immediately. Do not attempt to drive the person to the hospital yourself.",
      "Have the person sit down, rest, and try to stay calm. Loosen any tight clothing.",
      "Ask if they take any chest pain medication (like nitroglycerin) for a known heart condition, and help them take it if they do.",
      "If the person is fully awake and able to swallow, and has no allergy to aspirin, offer them one adult aspirin (325mg) or 2-4 low-dose aspirins (81mg each) to chew slowly.",
      "Stay with the person and monitor their condition until emergency responders arrive.",
      "Be prepared to start CPR if the person becomes unresponsive and stops breathing normally."
    ],
    warnings: [
      "Symptoms can include chest pain or pressure, pain radiating to the arm, back, neck, or jaw, shortness of breath, nausea, cold sweat, or extreme fatigue.",
      "Women, the elderly, and people with diabetes may experience atypical symptoms like stomach pain or sudden severe fatigue without classic chest pain."
    ]
  },
  {
    id: "stroke",
    title: "Stroke",
    shortDescription: "When blood supply to part of the brain is interrupted.",
    instructions: [
      "Think F.A.S.T. to check for signs of a stroke:",
      "FACE: Ask the person to smile. Does one side of the face droop?",
      "ARMS: Ask them to raise both arms. Does one arm drift downward?",
      "SPEECH: Ask them to repeat a simple phrase. Is their speech slurred or strange?",
      "TIME: If you observe any of these signs, call 911/112 immediately. Note the exact time the symptoms started.",
      "Have the person sit or lie down comfortably.",
      "Keep them calm and reassure them.",
      "Do not give them anything to eat or drink, as they may have difficulty swallowing."
    ],
    warnings: [
      "A stroke is a medical emergency. Immediate treatment can save the person's life and improve their chances of a full recovery.",
      "Even if symptoms seem to go away (a Transient Ischemic Attack or 'mini-stroke'), immediate medical attention is still required."
    ]
  },
  {
    id: "seizure",
    title: "Seizure / Epilepsy",
    shortDescription: "A sudden, uncontrolled electrical disturbance in the brain.",
    instructions: [
      "Stay calm and time the seizure.",
      "Protect the person from injury: Move hard or sharp objects away from them.",
      "Ease the person to the floor if they are standing or seated.",
      "Place something soft and flat, like a folded jacket, under their head.",
      "Loosen tight clothing around their neck (like a tie or collar).",
      "Once the jerking movements stop, gently roll the person onto their side (recovery position) to help keep their airway clear and allow fluids to drain from the mouth.",
      "Stay with them until the seizure ends and they are fully awake and aware."
    ],
    warnings: [
      "Do NOT hold the person down or try to stop their movements.",
      "Do NOT put anything in the person's mouth. They cannot swallow their tongue, but they could break their teeth or bite you.",
      "Call 911/112 if: the seizure lasts longer than 5 minutes, they have repeated seizures, they do not wake up after it stops, they are injured, pregnant, or it is their first seizure."
    ]
  },
  {
    id: "anaphylaxis",
    title: "Severe Allergic Reaction (Anaphylaxis)",
    shortDescription: "A severe, potentially life-threatening allergic reaction affecting the whole body.",
    instructions: [
      "Call 911/112 immediately.",
      "Ask if the person carries an epinephrine auto-injector (e.g., EpiPen). If they do, help them use it immediately. Usually, it is injected firmly into the outer mid-thigh and held for 3 to 10 seconds (follow the device instructions).",
      "Have the person sit in a comfortable position to help them breathe, or lie down if they feel dizzy or faint. If they vomit, lay them on their side.",
      "Loosen tight clothing.",
      "If symptoms do not improve after 5-10 minutes and emergency responders have not arrived, a second dose of epinephrine may be given if available.",
      "Monitor the person's breathing and be prepared to start CPR if they become unresponsive."
    ],
    warnings: [
      "Symptoms can include swelling of the face/lips/tongue, difficulty breathing, hives, a severe drop in blood pressure, rapid pulse, and dizziness.",
      "Do not give antihistamines as a substitute for epinephrine in a severe reaction."
    ]
  },
  {
    id: "poisoning",
    title: "Poisoning",
    shortDescription: "For suspected swallowing, inhalation, or skin contact with toxic substances.",
    instructions: [
      "Ensure the scene is safe (beware of toxic fumes or gases).",
      "Determine what was taken, how much, and exactly when.",
      "Call the national Poison Control Center (in the US: 1-800-222-1222) or emergency services (911/112) immediately.",
      "For swallowed poisons: Follow the dispatcher's or poison control's exact instructions.",
      "For inhaled poisons: Move the person to fresh air immediately.",
      "For poisons on the skin: Remove contaminated clothing using gloves. Rinse the skin with large amounts of running water for 15-20 minutes.",
      "For poisons in the eye: Flush the eye continuously with lukewarm water for 15-20 minutes, having the person blink frequently."
    ],
    warnings: [
      "Do NOT induce vomiting unless specifically told to do so by Poison Control or a medical professional. Some substances burn the throat on the way back up.",
      "Do NOT give the person water, milk, or activated charcoal unless instructed by professionals.",
      "Bring the poison container or pill bottle to the hospital with you."
    ]
  },
  {
    id: "fractures",
    title: "Fractures, Sprains & Dislocations",
    shortDescription: "For suspected broken bones, torn ligaments, or dislocated joints.",
    instructions: [
      "Tell the person to keep still and avoid moving the injured area.",
      "Call 911/112 if the injury involves the head, neck, back, thigh, or pelvis, if the bone is piercing the skin, or if the limb is deformed, cold, or blue.",
      "If there is bleeding, apply gentle pressure around the wound (not directly on a protruding bone) with a sterile dressing.",
      "Immobilize the area: Leave the limb in the exact position you found it. Do not try to straighten it. You can support it using a rolled-up towel, magazine, or a sling if you are trained.",
      "Apply ice: Wrap an ice pack in a thin towel and apply it to the injured area for 15-20 minutes to reduce swelling.",
      "Elevate the injured part if doing so does not cause more pain."
    ],
    warnings: [
      "Do NOT attempt to realign the bone or push a bone that's sticking out back in.",
      "Do NOT move the person if you suspect a spinal injury unless they are in immediate, life-threatening danger."
    ]
  },
  {
    id: "head_neck_spine",
    title: "Head, Neck, or Spinal Injuries",
    shortDescription: "For severe trauma to the head or back, often from falls or vehicle accidents.",
    instructions: [
      "Call 911/112 immediately.",
      "Keep the person completely still. Instruct them not to move.",
      "Hold their head and neck in the exact position you found them. Place your hands on both sides of their head to keep it aligned with the spine and prevent movement.",
      "If they are wearing a helmet, do NOT remove it.",
      "If there is bleeding, apply firm pressure to the wound with a clean cloth. (If you suspect a skull fracture, apply pressure around the edges of the wound, not directly on it).",
      "Monitor their breathing. If they stop breathing, begin CPR, but use the jaw-thrust maneuver to open the airway instead of tilting the head back if you are trained to do so."
    ],
    warnings: [
      "Assume a spinal injury if there is evidence of a severe head injury, the person complains of back/neck pain, numbness, or loss of control in their limbs.",
      "Never move the person unless there is an immediate threat to their life (e.g., fire, explosion risk). Moving them can cause permanent paralysis."
    ]
  },
  {
    id: "shock",
    title: "Shock",
    shortDescription: "A life-threatening condition where the body is not getting enough blood flow.",
    instructions: [
      "Call emergency services immediately.",
      "Have the person lie down flat on their back.",
      "Elevate their legs and feet about 12 inches (unless you suspect a head, neck, spine injury, or broken bones in the legs).",
      "Keep the person completely still.",
      "Maintain their body temperature: Cover them with a coat or blanket to keep them warm.",
      "Provide reassurance and keep them calm.",
      "If they begin to vomit or bleed from the mouth, roll them onto their side (unless you suspect a spinal injury) to prevent choking."
    ],
    warnings: [
      "Do NOT give the person anything to eat or drink, even if they complain of thirst.",
      "Symptoms of shock include pale, cold, clammy skin; rapid, shallow breathing; rapid, weak pulse; dizziness, fainting, or intense anxiety."
    ]
  },
  {
    id: "heatstroke",
    title: "Heat Exhaustion & Heatstroke",
    shortDescription: "Severe heat-related illnesses from prolonged exposure to high temperatures.",
    instructions: [
      "Move the person to a cooler place (shade or air-conditioned room) immediately.",
      "For Heat Exhaustion (heavy sweating, weakness, nausea): Have them lie down, loosen clothing, and apply cool, wet cloths to their body. Give small sips of cool water if they are fully awake.",
      "For Heatstroke (hot, red, dry or damp skin, confusion, passing out): Call 911/112 immediately. This is a medical emergency.",
      "Rapidly cool the heatstroke victim: Immerse them in cold water or an ice bath if possible. Alternatively, sponge them with cold water or cover them with cold, wet towels. Place ice packs on their neck, armpits, and groin."
    ],
    warnings: [
      "Heatstroke is fatal if delayed. Cooling the body rapidly is the highest priority while waiting for EMS.",
      "Do NOT give a heatstroke victim anything to drink, as their altered mental state makes choking highly likely."
    ]
  },
  {
    id: "hypothermia",
    title: "Hypothermia & Frostbite",
    shortDescription: "Life-threatening drop in body temperature and freezing of body tissues.",
    instructions: [
      "Move the person to a warm, dry place gently. Call 911/112 for severe cases.",
      "Remove any wet clothing carefully and replace it with dry, warm clothes or blankets.",
      "For Hypothermia (shivering, confusion, drowsiness): Warm the center of the body first (chest, neck, head, groin) using an electric blanket, skin-to-skin contact, or warm, dry compresses. Give warm, sweet, non-alcoholic drinks if they are fully conscious.",
      "For Frostbite (numb, waxy, white/grayish skin): Place the frostbitten area in warm (not hot) water (100°F to 105°F) for 20-30 minutes until the skin becomes flushed."
    ],
    warnings: [
      "Do NOT rub or massage frostbitten areas, as this causes severe tissue damage.",
      "Do NOT use direct heat like a heating pad, radiator, or fire to warm frostbite.",
      "Do NOT thaw frostbite if there is any chance the area might refreeze before reaching medical help."
    ]
  },
  {
    id: "animal_bites",
    title: "Animal & Snake Bites",
    shortDescription: "For bites from domestic/wild animals or venomous snakes.",
    instructions: [
      "Ensure the scene is safe. Move away from the animal or snake.",
      "For Animal Bites: Wash the wound thoroughly with soap and warm water for at least 5 minutes. Apply an antibiotic ointment and cover with a clean bandage. Seek medical attention for all deep wounds or if the animal's rabies status is unknown.",
      "For Snake Bites: Call 911/112 immediately. Note the color/shape of the snake if possible, but do not try to catch it.",
      "Keep the person calm and completely still to slow the spread of venom.",
      "Keep the bitten area at or slightly below the level of the heart.",
      "Remove rings, watches, or tight clothing near the bite area before swelling begins.",
      "Wash the bite gently with soap and water."
    ],
    warnings: [
      "For snake bites: Do NOT apply a tourniquet.",
      "Do NOT cut the wound or attempt to suck out the venom.",
      "Do NOT apply ice or immerse the wound in water."
    ]
  },
  {
    id: "electric_shock",
    title: "Electric Shock",
    shortDescription: "For injuries caused by contact with an electrical source or lightning.",
    instructions: [
      "Ensure your own safety first. Do NOT touch the person if they are still in contact with the electrical current.",
      "Call 911/112 immediately.",
      "Turn off the source of electricity if possible (e.g., unplug the cord, turn off the circuit breaker).",
      "If you cannot turn off the power, use a dry, non-conducting object made of cardboard, plastic, or dry wood to push the person away from the source. Make sure you are standing on a dry, non-conducting surface.",
      "Once the person is free from the current, check for breathing.",
      "If they are not breathing, begin CPR immediately.",
      "If they are breathing, lay them down and elevate their legs slightly to treat for shock. Cover them with a blanket.",
      "Do not move the person if you suspect a spinal injury unless there is immediate danger."
    ],
    warnings: [
      "Never use water to put out an electrical fire or try to cool an electrical burn while the power is still on.",
      "High-voltage wires (like power lines) require specialized rescue teams. Stay at least 20 feet away and do not approach."
    ]
  }
];
