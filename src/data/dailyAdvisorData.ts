import type { AdvisorCategoryId, SafetyTopic } from '../types/safety';

export const ADVISOR_CATEGORIES: Array<{
  id: AdvisorCategoryId;
  title: string;
  description: string;
}> = [
  {
    id: 'digital',
    title: 'Digital Safety',
    description: 'Protect accounts, payments, links, and personal data in daily online routines.',
  },
  {
    id: 'physical',
    title: 'Physical Safety',
    description: 'Practical awareness habits for commuting, solo travel, and home security.',
  },
  {
    id: 'family',
    title: 'Family Safety',
    description: 'Support children, teens, and older adults with calm, shared safety habits.',
  },
  {
    id: 'emergency',
    title: 'Emergency Preparedness',
    description: 'Clear before, during, and after checklists for urgent real-world situations.',
  },
];

export const DAILY_SAFETY_TOPICS: SafetyTopic[] = [
  // DIGITAL SAFETY (8)
  {
    id: 'public-wifi',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'Public WiFi',
    summary: 'Staying safe when connecting at cafés, airports, hotels, and libraries.',
    situation:
      'You are working or checking messages on a free public Wi-Fi hotspot where anyone nearby can join the same wireless network.',
    commonRisks: [
      'Unencrypted data on older websites can be observed by others on the same network.',
      'Lookalike hotspots (such as "Airport_Free_WiFi_5G") may be set up to intercept traffic or show fake login pages.',
      'Auto-connect settings can quietly rejoin untrusted network names in the future.',
    ],
    warningSigns: [
      'Multiple nearly identical Wi-Fi network names at the same location.',
      'A captive portal asking for your social media password, email password, or card details just to get online.',
      'Browser warnings saying a site’s security certificate is invalid.',
    ],
    preventionSteps: [
      'Verify the exact Wi-Fi name and password with staff at the counter before joining.',
      'Use mobile cellular data or your phone’s personal hotspot for banking, shopping, or tax portals.',
      'Turn off "Auto-Join" for public networks and disable file sharing / AirDrop when out.',
    ],
    whatToDoIfItHappens: [
      'Disconnect immediately if you see repeated browser certificate warnings.',
      'Change passwords from a trusted mobile or home network if you signed into a sensitive account over a suspicious portal.',
    ],
  },
  {
    id: 'online-shopping',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'Online Shopping',
    summary: 'Evaluating unfamiliar storefronts, steep discounts, and checkout links.',
    situation:
      'You see an ad or link for a popular item at an unusually low price on a website you have never visited before.',
    commonRisks: [
      'Counterfeit or non-existent storefronts collect payment without shipping an item.',
      'Unsecured checkout forms can expose card numbers to unauthorized charges.',
    ],
    warningSigns: [
      'Prices 60–80% lower than every established retailer alongside a countdown timer.',
      'Missing physical return address, broken policy pages, or only accepting wire transfers / crypto / gift cards.',
      'Domain names with extra hyphens or slightly altered brand spellings.',
    ],
    preventionSteps: [
      'Search the store name plus "reviews" or "scam" independently before checking out.',
      'Use credit cards or protected payment processors that offer dispute protection rather than direct bank transfers.',
      'Save order confirmations and check statements for unexpected recurring charges.',
    ],
    whatToDoIfItHappens: [
      'Contact your card issuer or payment provider immediately to dispute unauthorized or undelivered charges.',
      'Monitor your card statement and replace the card if payment details were entered on a suspicious page.',
    ],
  },
  {
    id: 'upi-fraud',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'UPI Fraud',
    summary: 'Understanding collect requests, fake refund QR codes, and PIN rules.',
    situation:
      'A buyer, caller, or merchant asks you to approve a UPI notification or scan a QR code to "receive" money or a refund.',
    commonRisks: [
      'Approving a UPI collect request or entering your UPI PIN always sends money out of your account—it is never required to receive funds.',
      'Screen-sharing apps requested by callers let them watch balances and trigger transfers.',
    ],
    warningSigns: [
      'Anyone claiming you must enter your UPI PIN or scan a QR code to receive a prize, cashback, or marketplace payment.',
      'Urgent calls asking you to install remote-access or screen-sharing tools.',
    ],
    preventionSteps: [
      'Remember the core rule: receiving money never requires a PIN or QR scan.',
      'Read the full on-screen prompt carefully ("Paying to..." vs "Requesting...") before entering your PIN.',
      'Keep your UPI app updated and set reasonable daily transaction limits.',
    ],
    whatToDoIfItHappens: [
      'Call your bank’s official fraud helpline immediately and freeze the account or UPI handle if money left unexpectedly.',
      'Report the transaction ID through your payment app and your local cybercrime reporting portal.',
    ],
  },
  {
    id: 'otp-scams',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'OTP Scams',
    summary: 'Why one-time passcodes exist and why callers sometimes try to harvest them.',
    situation:
      'Someone calls or messages pretending to be your bank, delivery courier, or a friend asking you to read back a 6-digit code just sent to your phone.',
    commonRisks: [
      'That code is often a login, password-reset, or transaction confirmation for your own account.',
      'Sharing an OTP allows an impersonator to take over messaging apps, email, or banking sessions.',
    ],
    warningSigns: [
      'Someone says "I accidentally sent my code to your number" or "Tell me the OTP to cancel a charge."',
      'Pressure to act within seconds before a supposed penalty occurs.',
    ],
    preventionSteps: [
      'Treat every OTP like the key to your front door—never read it aloud or forward it.',
      'Read the entire SMS carefully; banks explicitly state what action the OTP approves.',
      'Hang up and call the official number printed on the back of your card if unsure.',
    ],
    whatToDoIfItHappens: [
      'If you shared an OTP, log into that account immediately from the official app and change your password.',
      'Contact your bank or service provider right away to lock the account and review recent sessions.',
    ],
  },
  {
    id: 'fake-job-offers',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'Fake Job Offers',
    summary: 'Spotting upfront-fee hiring lures, task scams, and unverified recruiters.',
    situation:
      'You receive an unexpected message offering high-paying remote work, easy daily tasks, or a fast promotion without a standard interview.',
    commonRisks: [
      'Requests for "registration fees", "training deposits", or "device shipping fees" result in direct financial loss.',
      'Sending passport, tax ID, or bank details early exposes you to identity misuse.',
    ],
    warningSigns: [
      'Recruiter uses free webmail (like Gmail/Outlook) while claiming to represent a major corporation.',
      'Interviews happen exclusively via text chat followed by immediate job approval.',
      'Asking you to pay upfront or deposit a check and send part of it back.',
    ],
    preventionSteps: [
      'Verify the recruiter’s email domain matches the company’s real website.',
      'Check the company’s official careers portal or verified LinkedIn page to confirm the role exists.',
      'Remember: legitimate employers pay you—you should never pay to be interviewed or onboarded.',
    ],
    whatToDoIfItHappens: [
      'Stop communication immediately and do not send any additional fees or documents.',
      'If you shared bank or government ID details, alert your bank and place a fraud/credit alert.',
    ],
  },
  {
    id: 'social-media-privacy',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'Social Media Privacy',
    summary: 'Managing location tags, oversharing, and impersonation profiles.',
    situation:
      'Everyday posts, quizzes, and public profiles can unintentionally reveal home routines, travel absences, and password-reset clues.',
    commonRisks: [
      'Live location check-ins tell strangers when your home is empty.',
      'Public birthdates, pet names, and high school details help attackers guess security questions.',
    ],
    warningSigns: [
      'Friend requests from duplicate accounts using a contact’s existing photos.',
      'Quizzes asking for childhood streets, mother’s maiden name, or first car.',
    ],
    preventionSteps: [
      'Set personal profiles to Friends/Followers only and review tagged-photo approvals.',
      'Post vacation photos after returning home rather than broadcasting live locations.',
      'Enable app-based Two-Factor Authentication on all social accounts.',
    ],
    whatToDoIfItHappens: [
      'Report impersonating accounts inside the platform and warn friends not to accept duplicate requests.',
      'Revoke suspicious third-party connected apps in your account privacy settings.',
    ],
  },
  {
    id: 'qr-payment-fraud',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'QR Payment Fraud',
    summary: 'Preventing sticker tampering and deceptive QR payment links.',
    situation:
      'QR codes appear on parking meters, café menus, utility bills, and peer-to-peer sales.',
    commonRisks: [
      'Tampered stickers pasted over legitimate merchant QRs divert payments or open lookalike sites.',
      'Malicious URLs inside QRs bypass careful typing and hide suspicious domain spellings.',
    ],
    warningSigns: [
      'A QR sticker looks crooked, thicker, or pasted over an older printed code.',
      'The preview link shows an unfamiliar domain instead of the venue or company name.',
    ],
    preventionSteps: [
      'Always use a QR preview that displays the full destination URL before opening.',
      'Inspect physical stickers briefly for tampering at payment counters or parking kiosks.',
      'Double-check the merchant name shown in your payment screen before confirming.',
    ],
    whatToDoIfItHappens: [
      'Close the browser tab immediately without entering credentials if the previewed site looks off.',
      'Notify the business staff if you spot a tampered sticker on their counter.',
    ],
  },
  {
    id: 'phishing-emails',
    category: 'digital',
    categoryLabel: 'Digital Safety',
    title: 'Phishing Emails',
    summary: 'Reading sender domains, urgent attachments, and lookalike login prompts.',
    situation:
      'An email resembling a bank, cloud storage provider, or HR team claims your account needs urgent verification.',
    commonRisks: [
      'Clicking embedded buttons leads to convincing lookalike sign-in pages.',
      'Unexpected PDF, ZIP, or HTML attachments can trigger malicious scripts or credential prompts.',
    ],
    warningSigns: [
      'Display name says "Support Team" but the actual email address domain is unrelated or misspelled.',
      'Generic greetings ("Dear Customer") paired with threats of immediate account deletion.',
    ],
    preventionSteps: [
      'Tap or hover to inspect the actual sender email domain and link destination before clicking.',
      'Go directly to the service via your own bookmark instead of clicking links in emails.',
      'Keep your email client and browser updated.',
    ],
    whatToDoIfItHappens: [
      'If you entered your password on a suspicious link, change that password immediately everywhere you used it and enable MFA.',
      'Mark the email as phishing so your provider filters similar attempts.',
    ],
  },

  // PHYSICAL SAFETY (5)
  {
    id: 'solo-travel',
    category: 'physical',
    categoryLabel: 'Physical Safety',
    title: 'Solo Travel',
    summary: 'Planning check-ins, verified rides, and situational awareness away from home.',
    situation:
      'Traveling alone to a new city, hotel, or unfamiliar neighborhood.',
    commonRisks: [
      'Unverified taxis or rideshares outside terminals can overcharge or take unsafe routes.',
      'Dead phone batteries or lack of offline maps leave you stranded in unfamiliar areas.',
    ],
    warningSigns: [
      'Drivers approaching inside terminals offering "cheaper cash rides" away from official queues.',
      'Strangers asking overly specific questions about where you are staying or whether you are alone.',
    ],
    preventionSteps: [
      'Share your itinerary, hotel details, and live location during transit with one trusted contact.',
      'Download offline maps and save local emergency numbers before arriving.',
      'Match rideshare license plates and driver names before getting in.',
    ],
    whatToDoIfItHappens: [
      'If a route or situation feels uncomfortable, ask to stop at a well-lit public storefront, hotel lobby, or transit station.',
      'Call local emergency services or your trusted contact while staying in a populated area.',
    ],
  },
  {
    id: 'night-commute',
    category: 'physical',
    categoryLabel: 'Physical Safety',
    title: 'Night Commute',
    summary: 'Lighting, route choices, and alert habits after dark.',
    situation:
      'Walking or waiting for transit during late evening or early morning hours.',
    commonRisks: [
      'Distracted walking with headphones or eyes locked on a phone reduces awareness of surroundings.',
      'Poorly lit shortcuts create blind spots.',
    ],
    warningSigns: [
      'Isolated unlit alleys or someone matching your pace and turns repeatedly.',
    ],
    preventionSteps: [
      'Stick to well-lit main streets with open businesses or pedestrian visibility.',
      'Keep one ear free of headphones and stay aware of exits and intersections.',
      'Have keys or transit pass ready before reaching your door or station.',
    ],
    whatToDoIfItHappens: [
      'Cross the street or step into an open convenience store, café, or staffed station if you feel followed.',
      'Call a trusted person on speaker or contact local emergency responders if needed.',
    ],
  },
  {
    id: 'public-transport',
    category: 'physical',
    categoryLabel: 'Physical Safety',
    title: 'Public Transport',
    summary: 'Protecting belongings, personal space, and late-hour boarding choices.',
    situation:
      'Riding crowded buses, subways, or trains during rush hour or off-peak times.',
    commonRisks: [
      'Pickpocketing in crowded doorways or distraction teams.',
      'Shoulder surfing when typing banking PINs or passcodes in tight seating.',
    ],
    warningSigns: [
      'Sudden artificial crowding or someone bumping into you right as doors close.',
      'Empty train cars late at night far from the conductor or driver.',
    ],
    preventionSteps: [
      'Keep bags zipped in front of your body and avoid back-pocket phone storage.',
      'Sit near the driver, conductor car, or other commuters during quiet hours.',
      'Shield your screen or use biometric unlock in crowded spaces.',
    ],
    whatToDoIfItHappens: [
      'Move to a staffed car or alert transit staff immediately if someone harasses you.',
      'If a phone or wallet is lost, lock the device remotely and freeze payment cards right away.',
    ],
  },
  {
    id: 'apartment-safety',
    category: 'physical',
    categoryLabel: 'Physical Safety',
    title: 'Apartment Safety',
    summary: 'Entry hygiene, delivery verification, and basic home locks.',
    situation:
      'Managing building access, unexpected visitors, and package deliveries at home.',
    commonRisks: [
      'Tailgating—letting strangers follow through secured lobby doors out of politeness.',
      'Unverified maintenance or utility callers requesting entry.',
    ],
    warningSigns: [
      'Someone waiting by the entrance without a key fob asking you to hold the door.',
      'Unscheduled repair visits you cannot confirm with building management.',
    ],
    preventionSteps: [
      'Allow secure building doors to close behind you and avoid buzzing in unknown visitors.',
      'Use a peephole or intercom before opening your apartment door.',
      'Verify unexpected utility or maintenance visits directly with your landlord or management office.',
    ],
    whatToDoIfItHappens: [
      'Keep your door locked if an unverified visitor insists on entering and call building security or local police.',
    ],
  },
  {
    id: 'emergency-contacts',
    category: 'physical',
    categoryLabel: 'Physical Safety',
    title: 'Emergency Contacts',
    summary: 'Setting up Medical ID, ICE contacts, and offline phone access.',
    situation:
      'If your phone is locked during an accident or medical situation, responders need quick access to critical details.',
    commonRisks: [
      'Locked phones prevent bystanders or paramedics from reaching family or knowing allergies.',
      'Relying only on cloud-stored contacts fails when cell signal is unavailable.',
    ],
    warningSigns: [
      'Not having at least two key phone numbers memorized or accessible on your lock screen.',
    ],
    preventionSteps: [
      'Configure Medical ID / Emergency Information on iOS or Android so it shows without unlocking.',
      'Memorize two trusted phone numbers and keep a small physical emergency card in your wallet.',
      'Teach family members how to trigger your phone’s Emergency SOS shortcut.',
    ],
    whatToDoIfItHappens: [
      'Use your phone’s lock-screen Emergency button to dial local emergency services or display your Medical ID.',
    ],
  },

  // FAMILY SAFETY (4)
  {
    id: 'child-online-safety',
    category: 'family',
    categoryLabel: 'Family Safety',
    title: 'Child Online Safety',
    summary: 'Building open conversations, safe settings, and pause-and-ask habits.',
    situation:
      'Children exploring videos, school apps, and social platforms where strangers or unsafe links can appear.',
    commonRisks: [
      'Oversharing school names, ages, or home locations in public comments.',
      'In-app purchases or misleading pop-ups disguised as free rewards.',
    ],
    warningSigns: [
      'Secrecy around screen activity or new online contacts asking to switch to private chat apps.',
    ],
    preventionSteps: [
      'Establish a no-blame rule: children can always show you a confusing message without getting in trouble.',
      'Enable parental account controls, purchase approvals, and SafeSearch defaults.',
      'Use SafeLens AI’s "Explain Like I’m 10" mode together when reviewing unfamiliar links.',
    ],
    whatToDoIfItHappens: [
      'Stay calm and thank your child for telling you, save screenshots if needed, block the account, and review privacy settings together.',
    ],
  },
  {
    id: 'elderly-scam-awareness',
    category: 'family',
    categoryLabel: 'Family Safety',
    title: 'Elderly Scam Awareness',
    summary: 'Protecting older relatives from tech-support, government, and grandparent scams.',
    situation:
      'Scammers frequently target older adults with urgent calls claiming a grandchild is in trouble or a computer has a virus.',
    commonRisks: [
      'High-pressure phone calls demanding gift cards, wire transfers, or remote computer access.',
      'Fear-based impersonation of tax agencies, banks, or utility shutoffs.',
    ],
    warningSigns: [
      'A caller insists "Don’t tell anyone in your family" or demands secrecy.',
      'Full-screen pop-ups claiming a computer is locked and giving a toll-free support number.',
    ],
    preventionSteps: [
      'Create a family "code word" or habit of hanging up and calling the relative directly on their known number.',
      'Remind loved ones that real government agencies and banks never demand payment in gift cards.',
      'Bookmark official bank and healthcare portals on their home screen.',
    ],
    whatToDoIfItHappens: [
      'Approach with empathy, not blame—help contact the bank immediately to freeze cards and uninstall any remote-support tools.',
    ],
  },
  {
    id: 'gaming-safety',
    category: 'family',
    categoryLabel: 'Family Safety',
    title: 'Gaming Safety',
    summary: 'Avoiding fake skin/currency trades, account theft, and voice-chat risks.',
    situation:
      'Multiplayer games feature item trading, voice lobbies, and links to external chat servers.',
    commonRisks: [
      'Fake "free currency" or rare-skin websites that steal game account logins.',
      'Moving conversations from moderated game lobbies to unmoderated external apps.',
    ],
    warningSigns: [
      'Players offering free in-game items in exchange for logging into an external link.',
      'Strangers asking personal questions about age, city, or school.',
    ],
    preventionSteps: [
      'Enable Two-Factor Authentication on gaming platforms and never share passwords for "boosting."',
      'Limit voice and text chat to verified friends for younger players.',
      'Buy game currency only inside the official game store.',
    ],
    whatToDoIfItHappens: [
      'Reset the gaming account password immediately, contact platform support for account recovery, and report abusive users.',
    ],
  },
  {
    id: 'cyberbullying',
    category: 'family',
    categoryLabel: 'Family Safety',
    title: 'Cyberbullying',
    summary: 'Documenting harassment, protecting mental wellbeing, and escalating safely.',
    situation:
      'Repeated hurtful messages, exclusion, or rumor-spreading across group chats or social media.',
    commonRisks: [
      'Emotional distress, isolation, and escalation when responding impulsively in public threads.',
    ],
    warningSigns: [
      'Sudden anxiety after checking notifications or withdrawing from friends and school.',
    ],
    preventionSteps: [
      'Tighten comment filters and message request settings so strangers cannot DM directly.',
      'Encourage saving evidence rather than replying angrily.',
    ],
    whatToDoIfItHappens: [
      'Do not retaliate; take screenshots with timestamps before blocking the sender.',
      'Report the content to the platform and involve a trusted parent, counselor, or school administrator.',
    ],
  },

  // EMERGENCY PREPAREDNESS (5)
  {
    id: 'fire',
    category: 'emergency',
    categoryLabel: 'Emergency Preparedness',
    title: 'Fire',
    summary: 'Smoke alarm checks, two exit routes, and calm evacuation steps.',
    situation:
      'A home or building fire where smoke can spread quickly and reduce visibility within minutes.',
    commonRisks: [
      'Smoke inhalation is often more dangerous than flames themselves.',
      'Returning inside for belongings or using elevators during an alarm.',
    ],
    warningSigns: [
      'Smoke detector alarms, burning electrical odors, or warm closed doors.',
    ],
    preventionSteps: [
      'Test smoke and carbon monoxide alarms monthly and replace batteries yearly.',
      'Identify two ways out of every room and pick an outdoor family meeting spot.',
      'Keep stove areas clear and never leave space heaters unattended.',
    ],
    whatToDoIfItHappens: [
      'Evacuate immediately, stay low under smoke, touch closed doors with the back of your hand before opening, and never use elevators.',
      'Call emergency services once safely outside and never go back inside.',
    ],
  },
  {
    id: 'flood',
    category: 'emergency',
    categoryLabel: 'Emergency Preparedness',
    title: 'Flood',
    summary: 'Avoiding floodwaters, power shutoffs, and emergency go-bags.',
    situation:
      'Heavy storms, rising street water, or flash-flood warnings in your area.',
    commonRisks: [
      'Just 6 inches of fast-moving water can knock an adult off their feet, and 12 inches can carry away a vehicle.',
      'Hidden electrical hazards and contaminated water.',
    ],
    warningSigns: [
      'Official flash-flood alerts, rapidly rising storm drains, or muddy water entering basements.',
    ],
    preventionSteps: [
      'Know your neighborhood’s elevation and local evacuation routes.',
      'Keep essential documents, medications, a flashlight, and power bank in a waterproof pouch.',
    ],
    whatToDoIfItHappens: [
      'Turn Around, Don’t Drown—never walk or drive through flooded streets.',
      'Move to higher ground and avoid touching electrical equipment if standing in damp areas.',
    ],
  },
  {
    id: 'medical-emergency',
    category: 'emergency',
    categoryLabel: 'Emergency Preparedness',
    title: 'Medical Emergency',
    summary: 'Recognizing urgent symptoms and giving clear dispatcher details.',
    situation:
      'Someone nearby experiences chest pain, severe allergic reaction, sudden confusion, or major injury.',
    commonRisks: [
      'Delaying professional care while unsure whether symptoms are "serious enough."',
    ],
    warningSigns: [
      'Trouble breathing, sudden facial droop or slurred speech, severe bleeding, or loss of consciousness.',
    ],
    preventionSteps: [
      'Learn basic hands-only CPR and keep a stocked first-aid kit at home and in your car.',
      'Know the exact street address of your workplace or current venue.',
    ],
    whatToDoIfItHappens: [
      'Call local emergency services immediately, state your exact location first, and put the phone on speaker so your hands stay free to follow dispatcher instructions.',
    ],
  },
  {
    id: 'power-outage',
    category: 'emergency',
    categoryLabel: 'Emergency Preparedness',
    title: 'Power Outage',
    summary: 'Safe lighting, food safety, and generator precautions.',
    situation:
      'Extended electricity loss affecting lighting, refrigeration, and phone charging.',
    commonRisks: [
      'Carbon monoxide poisoning from running generators indoors or near windows.',
      'Candle fire hazards and spoiled refrigerated food.',
    ],
    warningSigns: [
      'Flickering power during severe storms or local grid alerts.',
    ],
    preventionSteps: [
      'Keep LED flashlights (not candles) and charged USB power banks ready.',
      'Keep refrigerator and freezer doors closed to preserve cold air.',
    ],
    whatToDoIfItHappens: [
      'Unplug sensitive electronics to protect against power surges when electricity returns.',
      'Never use grills or generators indoors, and check on elderly neighbors.',
    ],
  },
  {
    id: 'earthquake',
    category: 'emergency',
    categoryLabel: 'Emergency Preparedness',
    title: 'Earthquake',
    summary: 'Drop, Cover, and Hold On—plus post-shaking safety checks.',
    situation:
      'Sudden ground shaking in a home, office, or outdoor street.',
    commonRisks: [
      'Falling shelves, glass windows, and unanchored heavy furniture.',
      'Running outside mid-shaking where exterior glass or power lines can fall.',
    ],
    warningSigns: [
      'Sudden rumbling, swaying light fixtures, or mobile earthquake early-warning alerts.',
    ],
    preventionSteps: [
      'Anchor tall bookshelves and keep sturdy shoes plus a flashlight beside your bed.',
      'Identify safe spots under sturdy tables away from windows.',
    ],
    whatToDoIfItHappens: [
      'Drop to your hands and knees, Cover your head and neck under a sturdy table, and Hold On until shaking stops.',
      'After shaking ends, expect aftershocks and check for gas leaks before using open flames.',
    ],
  },
];
