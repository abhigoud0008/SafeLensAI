import type { AcademyLesson } from '../types/safety';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'password-security',
    title: 'Password Security',
    durationMinutes: 4,
    category: 'privacy',
    summary: 'Why unique passphrases outperform complex reused passwords and how password managers help.',
    explanation: [
      'Reusing the same password across websites is one of the biggest everyday risks online. When one small website suffers a data breach, automated tools try that same email and password combination on banking, shopping, and email accounts.',
      'Length matters far more than confusing symbols. A 4-word random passphrase like "timber-lantern-cloud-harbor" is much harder to crack—and easier to remember—than "P@ssw0rd1!".',
    ],
    realExample: {
      scenario: 'A forum you joined three years ago leaks user passwords.',
      breakdown:
        'Even though the forum felt unimportant, if you used the same password for your primary email, an attacker can access password resets for all your other accounts.',
    },
    preventionTips: [
      'Use a different password for every important account—especially your primary email and bank.',
      'Use your browser or a reputable password manager so you only need to remember one strong master passphrase.',
      'Aim for 14+ characters using memorable unrelated words.',
    ],
    quiz: [
      {
        id: 'pw-1',
        question: 'Which password habit offers the strongest real-world protection?',
        options: [
          'Using one very complicated 8-character password everywhere',
          'Using a unique 14+ character passphrase for every important account',
          'Changing your password by adding "1" or "2" at the end each year',
        ],
        correctIndex: 1,
        explanation:
          'Unique passphrases stop a single leaked site from unlocking your other accounts, and length dramatically slows guessing attacks.',
      },
      {
        id: 'pw-2',
        question: 'Which account deserves your strongest, most unique password first?',
        options: [
          'Your primary email account',
          'A local restaurant loyalty page',
          'A free wallpaper site',
        ],
        correctIndex: 0,
        explanation:
          'Your primary email receives password-reset links for almost every other service you use.',
      },
    ],
  },
  {
    id: 'mfa',
    title: 'Multi-Factor Authentication (MFA)',
    durationMinutes: 4,
    category: 'privacy',
    summary: 'Adding a second lock so a stolen password alone is not enough.',
    explanation: [
      'Multi-Factor Authentication (MFA) requires a second proof of identity beyond your password—such as an authenticator app code, security key, or biometric prompt.',
      'Even if a phishing site tricks you into typing your password, MFA blocks unauthorized sign-ins in the vast majority of cases.',
    ],
    realExample: {
      scenario: 'You receive an unexpected login approval prompt on your phone while watching TV.',
      breakdown:
        'This means someone already has your password and is trying to sign in. Tapping "Deny" and changing your password stops the takeover before it starts.',
    },
    preventionTips: [
      'Prefer authenticator apps or passkeys over SMS text codes when available.',
      'Never approve a login push notification you did not just trigger yourself.',
      'Save your backup recovery codes offline in a safe place.',
    ],
    quiz: [
      {
        id: 'mfa-1',
        question: 'What should you do if an MFA approval prompt pops up when you are NOT trying to log in?',
        options: [
          'Tap Approve so the notification goes away',
          'Deny the request and update your account password right away',
          'Send the code to support in a text message',
        ],
        correctIndex: 1,
        explanation:
          'An unexpected MFA prompt means someone knows your password. Denying it blocks them and signals that you should change your password.',
      },
    ],
  },
  {
    id: 'qr-risks',
    title: 'QR Code Risks',
    durationMinutes: 3,
    category: 'digital',
    summary: 'Why QR codes hide destinations and how Safe Preview protects you.',
    explanation: [
      'A QR code is simply a visual barcode that encodes text, a web link, Wi-Fi settings, or a payment request. Human eyes cannot read where a QR code points just by looking at the squares.',
      'Because of this, scammers sometimes paste fake QR stickers over parking meters, café tables, or mailers—or send QR codes claiming you need to scan them to receive a refund.',
    ],
    realExample: {
      scenario: 'An online marketplace buyer sends a QR code saying "Scan to receive your payout."',
      breakdown:
        'Payment QR codes initiate outgoing transfers. Scanning and entering your PIN sends money out rather than bringing money in.',
    },
    preventionTips: [
      'Always preview the decoded URL or payment recipient before confirming any action.',
      'Inspect physical QR signs for stickers pasted over the original print.',
      'Use SafeLens AI’s QR Scanner to inspect suspicious QR images safely.',
    ],
    quiz: [
      {
        id: 'qr-1',
        question: 'Do you ever need to scan a QR code and enter your PIN to RECEIVE money?',
        options: [
          'Yes, for instant bank refunds',
          'No—entering a payment PIN after scanning a QR only sends money out',
          'Only if the buyer sends a verified screenshot',
        ],
        correctIndex: 1,
        explanation:
          'Entering a payment PIN authorizes money leaving your account. Receiving money never requires entering your PIN.',
      },
    ],
  },
  {
    id: 'fake-websites',
    title: 'Fake Websites & Lookalike Domains',
    durationMinutes: 5,
    category: 'scam',
    summary: 'Reading domain names right-to-left to spot typosquatting and misleading subdomains.',
    explanation: [
      'Imitation websites often replace letters with lookalike characters (such as "0" for "o" in amaz0n-login.com) or add trustworthy words in subdomains like "paypal.security-check-user.com".',
      'To find the true owner of a web address, look immediately to the left of the ".com", ".org", or country ending before the first single slash "/". In "paypal.security-check-user.com", the real owner is "security-check-user.com", NOT PayPal.',
    ],
    realExample: {
      scenario: 'A link reads https://login.amazon.account-verify-help.com/update.',
      breakdown:
        'Even though "https" and "amazon" appear at the front, the actual domain before the slash is "account-verify-help.com".',
    },
    preventionTips: [
      'Read the domain directly before the first "/" carefully.',
      'Do not rely on the HTTPS padlock alone—imitation sites can get free HTTPS certificates too.',
      'Bookmark banks, shopping portals, and work logins instead of clicking links in texts.',
    ],
    quiz: [
      {
        id: 'web-1',
        question: 'Who actually owns the website "chase.verify-card-alert.com"?',
        options: [
          'Chase Bank',
          'verify-card-alert.com',
          'Cannot tell without HTTPS',
        ],
        correctIndex: 1,
        explanation:
          'The true root domain is immediately before the ".com" ending: verify-card-alert.com. "chase" is just a subdomain prefix anyone can create.',
      },
    ],
  },
  {
    id: 'job-scams',
    title: 'Job & Income Scams',
    durationMinutes: 4,
    category: 'scam',
    summary: 'Recognizing fee-first hiring traps, fake checks, and task-scam escalation.',
    explanation: [
      'Job scams target people looking for flexible remote work or quick side income. Common variants include "task scams" (paying small rewards first, then demanding big deposits to unlock higher tiers) and fake equipment-check scams.',
      'Legitimate companies conduct verified interviews via official corporate email domains and never charge candidates registration or onboarding fees.',
    ],
    realExample: {
      scenario: 'A message promises $300/day liking videos, then asks for a $120 "account activation deposit."',
      breakdown:
        'Early small payouts build false trust before larger deposits are trapped behind fake "withdrawal fees."',
    },
    preventionTips: [
      'Never pay a fee or deposit personal funds to start a job or unlock earnings.',
      'Verify the recruiter through the company’s official careers page.',
      'Be cautious of text-only "interviews" on messaging apps.',
    ],
    quiz: [
      {
        id: 'job-1',
        question: 'Which sign strongly indicates a potential job scam?',
        options: [
          'Asking for a registration or equipment deposit before onboarding',
          'Scheduling a video interview from a verified company domain',
          'Posting the role on the company’s official careers page',
        ],
        correctIndex: 0,
        explanation:
          'Legitimate employers do not ask job applicants to pay registration fees or deposit money to unlock tasks.',
      },
    ],
  },
  {
    id: 'social-engineering',
    title: 'Social Engineering',
    durationMinutes: 4,
    category: 'scam',
    summary: 'Understanding urgency, authority, and fear—the emotional levers behind scams.',
    explanation: [
      'Social engineering targets human psychology rather than software bugs. Attackers manufacture urgency ("Act within 30 minutes"), fear ("Account suspended"), or authority ("This is IT Support / Fraud Department") so you act before verifying.',
      'Your single best defense is the 60-second pause: step out of the message or call and verify through an independent official channel.',
    ],
    realExample: {
      scenario: 'A caller pretending to be your bank’s fraud desk warns of a $900 charge and asks for a verification code.',
      breakdown:
        'The panic about losing $900 prevents you from realizing the code is actually resetting your bank password.',
    },
    preventionTips: [
      'Treat extreme urgency or demands for secrecy as immediate pause signals.',
      'Hang up and dial the official number on the back of your card or official app.',
    ],
    quiz: [
      {
        id: 'se-1',
        question: 'Why do social engineering messages frequently include countdowns or threats?',
        options: [
          'Because banks delete accounts in 15 minutes',
          'To create panic and rush you past your normal habit of double-checking',
          'To speed up internet connections',
        ],
        correctIndex: 1,
        explanation:
          'Urgency and fear bypass careful thinking. Slowing down breaks the tactic immediately.',
      },
    ],
  },
  {
    id: 'identity-theft',
    title: 'Identity Theft Prevention',
    durationMinutes: 5,
    category: 'preparedness',
    summary: 'Minimizing sensitive ID exposure and locking down credit and accounts.',
    explanation: [
      'Identity theft happens when someone uses your government ID, tax number, birthdate, or financial credentials to open accounts or claim benefits in your name.',
      'Reducing how often you share ID scans, freezing credit reports when not applying for loans, and watching account alerts dramatically lowers your risk.',
    ],
    realExample: {
      scenario: 'An unverified rental listing asks for a photo of your passport and bank statement before showing the apartment.',
      breakdown:
        'Legitimate landlords verify identity in person or through reputable tenant-screening portals after a viewing.',
    },
    preventionTips: [
      'Only share government ID numbers when legally required and over verified official portals.',
      'Consider placing a free security freeze on your credit files if available in your region.',
      'Shred paper mail showing account numbers or pre-approved credit offers.',
    ],
    quiz: [
      {
        id: 'id-1',
        question: 'When is it safest to share sensitive identity documents for an apartment or job?',
        options: [
          'In the first text message to reserve a spot',
          'Only after verifying the organization or viewing the property through official channels',
          'Over public Wi-Fi on an unencrypted form',
        ],
        correctIndex: 1,
        explanation:
          'Always verify the legitimacy of the landlord or employer before transmitting sensitive identity records.',
      },
    ],
  },
  {
    id: 'privacy-protection',
    title: 'App & Device Privacy Protection',
    durationMinutes: 4,
    category: 'privacy',
    summary: 'Reviewing mobile permissions and reducing unnecessary data collection.',
    explanation: [
      'Many apps ask for broad permissions—Contacts, Precise Location, Camera, Microphone—even when their core feature does not require them.',
      'Granting only what an app needs ("least privilege") keeps your contacts, photos, and daily movements private.',
    ],
    realExample: {
      scenario: 'A simple document scanner app asks for Always-On Location and Contacts access.',
      breakdown:
        'A scanner only needs Camera and File access to save PDFs—Contacts and background GPS are unnecessary.',
    },
    preventionTips: [
      'Choose "While using the app" or "Approximate location" whenever possible.',
      'Audit phone app permissions every few months and uninstall unused apps.',
      'Use SafeLens AI’s Permission Translator when an app prompt looks confusing.',
    ],
    quiz: [
      {
        id: 'priv-1',
        question: 'If a simple flashlight or calculator app asks for access to your Contacts, what should you do?',
        options: [
          'Deny the permission—it is unrelated to the app’s purpose',
          'Allow it so the app runs faster',
          'Share your password as well',
        ],
        correctIndex: 0,
        explanation:
          'Apps should only receive permissions directly needed for the feature you want to use.',
      },
    ],
  },
];
