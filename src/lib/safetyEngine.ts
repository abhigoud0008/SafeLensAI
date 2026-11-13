import type {
  AnalysisHistoryItem,
  MessageAnalysisResult,
  MessageChannel,
  PermissionAnalysisResult,
  QrAnalysisResult,
  RiskLevel,
  SafetyScoreBreakdown,
  TranslatedPermission,
  UrlAnalysisResult,
  UserProgressState,
} from '../types/safety';

const KNOWN_BRANDS: Array<{ brand: string; domain: string; core: string }> = [
  { brand: 'Amazon', domain: 'amazon.com', core: 'amazon' },
  { brand: 'Google', domain: 'google.com', core: 'google' },
  { brand: 'PayPal', domain: 'paypal.com', core: 'paypal' },
  { brand: 'Apple', domain: 'apple.com', core: 'apple' },
  { brand: 'Microsoft', domain: 'microsoft.com', core: 'microsoft' },
  { brand: 'Netflix', domain: 'netflix.com', core: 'netflix' },
  { brand: 'Chase Bank', domain: 'chase.com', core: 'chase' },
  { brand: 'WhatsApp', domain: 'whatsapp.com', core: 'whatsapp' },
  { brand: 'Instagram', domain: 'instagram.com', core: 'instagram' },
  { brand: 'LinkedIn', domain: 'linkedin.com', core: 'linkedin' },
  { brand: 'HDFC Bank', domain: 'hdfcbank.com', core: 'hdfcbank' },
  { brand: 'State Bank of India', domain: 'sbi.co.in', core: 'onlinesbi' },
];

const SUSPICIOUS_URL_WORDS = [
  'login',
  'verify',
  'secure',
  'update',
  'account',
  'confirm',
  'billing',
  'wallet',
  'claim',
  'bonus',
  'prize',
  'kyc',
  'otp',
  'unlock',
  'suspend',
  'support-desk',
];

const SHORTENER_DOMAINS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'rb.gy',
  'cutt.ly',
]);

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function normalizeHomoglyphs(input: string): string {
  return input
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w');
}

export function detectTyposquatting(hostname: string): { brand: string; domain: string } | null {
  const cleanHost = hostname.toLowerCase().replace(/^www\./, '');
  const parts = cleanHost.split('.');
  const secondLevel = parts.length >= 2 ? parts[parts.length - 2] : cleanHost;
  const normalizedHost = normalizeHomoglyphs(cleanHost);
  const normalizedSecond = normalizeHomoglyphs(secondLevel);

  for (const entry of KNOWN_BRANDS) {
    if (cleanHost === entry.domain || cleanHost.endsWith(`.${entry.domain}`)) {
      return null;
    }

    // Check direct inclusion inside a longer domain like amaz0n-login.com or paypal-verify.net
    if (
      normalizedHost.includes(entry.core) ||
      cleanHost.includes(entry.core)
    ) {
      return { brand: entry.brand, domain: entry.domain };
    }

    // Check Levenshtein distance against primary label and each hyphenated token
    const tokens = normalizedSecond.split('-').filter(Boolean);
    for (const token of [normalizedSecond, ...tokens]) {
      if (token.length >= 4 && levenshteinDistance(token, entry.core) <= 2) {
        return { brand: entry.brand, domain: entry.domain };
      }
    }
  }

  return null;
}

export function analyzeUrlHeuristics(rawInput: string): UrlAnalysisResult {
  const trimmed = rawInput.trim();
  const hasExplicitProtocol = /^https?:\/\//i.test(trimmed);
  const candidate = hasExplicitProtocol ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      normalizedUrl: trimmed,
      hostname: trimmed,
      trustScore: 25,
      riskLevel: 'High',
      confidenceScore: 72,
      summary: 'This text does not follow a standard web address structure, which may indicate a malformed or disguised link.',
      reasons: ['Possible Concern: The input could not be parsed as a standard domain or URL.'],
      safetyTips: [
        'Double-check the spelling of the website before typing it into your browser.',
        'Navigate to official services using bookmarks or trusted search results instead of copying unusual links.',
      ],
      breakdown: {
        httpsEnabled: false,
        suspiciousKeywords: [],
        typosquattingTarget: null,
        structureNotes: ['Invalid URL format detected.'],
      },
      explainLikeIm10: 'This web address looks broken or scrambled, so it is safer not to open it until you ask or check the real website name.',
      beforeYouClick: {
        scenario: 'Malformed or Obfuscated Web Link',
        possibleConsequence: 'Opening malformed links can lead to unexpected redirects or imitation sign-in pages.',
        warningSign: 'Web address lacks a clean, recognizable domain name.',
        saferAlternative: 'Type the official organization name directly into a trusted search engine or saved bookmark.',
      },
      source: 'heuristic',
    };
  }

  const httpsEnabled = hasExplicitProtocol
    ? parsed.protocol === 'https:'
    : false;
  const hostname = parsed.hostname.toLowerCase();
  const fullLower = `${hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  const suspiciousKeywords = SUSPICIOUS_URL_WORDS.filter((word) =>
    fullLower.includes(word)
  );
  const typosquatMatch = detectTyposquatting(hostname);
  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const subdomainCount = Math.max(0, hostname.split('.').length - 2);
  const hasAtSymbol = trimmed.includes('@');
  const isShortener = SHORTENER_DOMAINS.has(hostname.replace(/^www\./, ''));
  const hasManyHyphens = (hostname.match(/-/g) || []).length >= 2;

  let trustScore = 90;
  const reasons: string[] = [];
  const structureNotes: string[] = [];

  if (!hasExplicitProtocol) {
    trustScore -= 6;
    structureNotes.push('Protocol was omitted; verify whether the destination actually enforces HTTPS.');
  } else if (!httpsEnabled) {
    trustScore -= 25;
    reasons.push('Possible Concern: Uses unencrypted HTTP rather than HTTPS, so data sent on this page is not protected in transit.');
    structureNotes.push('Missing HTTPS encryption.');
  } else {
    structureNotes.push('Uses HTTPS encryption (note: HTTPS encrypts the connection, but does not prove the site owner is trustworthy).');
  }

  if (typosquatMatch) {
    trustScore -= 48;
    reasons.push(
      `Potential Risk: This website looks similar to ${typosquatMatch.domain} (${typosquatMatch.brand}) and may be attempting to imitate it.`
    );
    structureNotes.push(`Possible lookalike domain targeting ${typosquatMatch.domain}.`);
  }

  if (isIpHost) {
    trustScore -= 35;
    reasons.push('Potential Risk: Uses a raw numeric IP address instead of a registered domain name, which is uncommon for consumer services.');
    structureNotes.push('Direct IPv4 address host.');
  }

  if (hasAtSymbol) {
    trustScore -= 30;
    reasons.push('Potential Risk: Contains an "@" character in the URL, a classic trick that can hide the true destination host.');
    structureNotes.push('Contains credential/redirect "@" delimiter.');
  }

  if (isShortener) {
    trustScore -= 20;
    reasons.push('Cannot Verify Destination: Uses a link shortener, which hides the final website address until opened.');
    structureNotes.push('Shortened redirect domain.');
  }

  if (subdomainCount >= 3) {
    trustScore -= 15;
    reasons.push(`Possible Concern: Deep subdomain nesting (${subdomainCount} levels) can be used to push a trusted brand name to the left while hiding the real root domain.`);
    structureNotes.push(`${subdomainCount} nested subdomains detected.`);
  }

  if (hasManyHyphens) {
    trustScore -= 12;
    reasons.push('Possible Concern: Multiple hyphens in the domain name are frequently seen in temporary lookalike domains.');
    structureNotes.push('Multiple hyphens in hostname.');
  }

  if (suspiciousKeywords.length > 0) {
    const penalty = Math.min(24, suspiciousKeywords.length * 8);
    trustScore -= penalty;
    reasons.push(
      `Possible Concern: Contains action-focused keywords (${suspiciousKeywords.join(', ')}) commonly used in credential or payment prompts.`
    );
  }

  trustScore = Math.max(8, Math.min(96, trustScore));

  let riskLevel: RiskLevel = 'Low';
  if (trustScore < 45) riskLevel = 'High';
  else if (trustScore < 75) riskLevel = 'Medium';

  if (reasons.length === 0) {
    reasons.push(
      'No obvious structural warning signs were detected in the domain spelling or URL format, though SafeLens AI cannot verify live page contents.'
    );
  }

  const safetyTips = [
    typosquatMatch
      ? `Open ${typosquatMatch.domain} by typing it yourself or using a saved bookmark rather than clicking this link.`
      : 'Check the root domain right before ".com" (or the top-level ending) to confirm who actually owns the site.',
    'Never enter passwords, card numbers, or one-time codes unless you navigated to the site independently.',
    isShortener
      ? 'Use a link-expander preview tool or ask the sender for the full unshortened URL before visiting.'
      : 'Remember that a padlock icon (HTTPS) only means the connection is encrypted—it does not guarantee the website is legitimate.',
  ];

  const summary =
    riskLevel === 'High'
      ? `Potential Risk: ${hostname} shows strong structural warning signs${typosquatMatch ? ` and appears to imitate ${typosquatMatch.domain}` : ''}.`
      : riskLevel === 'Medium'
        ? `Possible Concern: ${hostname} includes patterns that warrant manual verification before entering personal details.`
        : `Low structural risk detected for ${hostname}. We still recommend verifying unexpected links independently.`;

  const explainLikeIm10 =
    typosquatMatch
      ? `This web address is wearing a disguise—it is spelled almost like ${typosquatMatch.domain}, trying to trick people into thinking it is the real ${typosquatMatch.brand} website.`
      : riskLevel === 'High'
        ? 'This web address has several warning clues, like missing safety locks or confusing words. It is best not to open it.'
        : riskLevel === 'Medium'
          ? 'We cannot be completely sure who owns this link yet, so check with a trusted adult or go to the website directly.'
          : 'This web address looks neat and follows normal rules, though you should still be careful about sharing private info.';

  const beforeYouClick = typosquatMatch
    ? {
        scenario: `Lookalike Website Imitating ${typosquatMatch.brand}`,
        possibleConsequence: `Entering your username or password on a lookalike domain can hand over account access or payment details to an impersonator.`,
        warningSign: `Domain "${hostname}" closely resembles "${typosquatMatch.domain}" with altered characters or extra words.`,
        saferAlternative: `Close this link and visit ${typosquatMatch.domain} directly from a bookmark or trusted search.`,
      }
    : {
        scenario: riskLevel === 'Low' ? 'Unverified External Link' : 'Suspicious Web Destination',
        possibleConsequence: 'Unverified websites may ask for login credentials, payment card details, or trigger unwanted downloads.',
        warningSign: reasons[0],
        saferAlternative: 'Navigate directly to the organization’s official website instead of following the link.',
      };

  return {
    normalizedUrl: parsed.toString(),
    hostname,
    trustScore,
    riskLevel,
    confidenceScore: typosquatMatch ? 89 : 76,
    summary,
    reasons,
    safetyTips,
    breakdown: {
      httpsEnabled,
      suspiciousKeywords,
      typosquattingTarget: typosquatMatch ? typosquatMatch.domain : null,
      structureNotes,
    },
    explainLikeIm10,
    beforeYouClick,
    source: 'heuristic',
  };
}

export function analyzeMessageHeuristics(
  rawText: string,
  channel: MessageChannel = 'sms'
): MessageAnalysisResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  const riskIndicators: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  // Urgency patterns
  if (/(urgent|immediately|within \d+ (hours?|mins?|minutes?)|act now|expires today|last chance|final notice|right away)/i.test(text)) {
    score += 25;
    riskIndicators.push('Urgency');
    reasons.push('May indicate artificial time pressure: phrases urging immediate action are often used to stop you from double-checking.');
  }

  // Fear / Threat tactics
  if (/(suspended|blocked|frozen|legal action|arrest|penalty|unauthorized|compromised|terminated|deactivated|overdue)/i.test(text)) {
    score += 25;
    riskIndicators.push('Fear tactics');
    reasons.push('Possible concern: threatens negative consequences (such as account suspension or penalties) to provoke a quick emotional reaction.');
  }

  // OTP / Credentials / Sensitive info requests
  if (/(otp|one[- ]time|verification code|pin\b|password|cvv|ssn|bank details|kyc|passcode)/i.test(text)) {
    score += 28;
    riskIndicators.push('OTP or credential requests');
    reasons.push('Potential risk: references one-time codes, passwords, or identity details. Legitimate services rarely ask you to share these over messages.');
  }

  // Payment / Registration fee / Gift cards / Crypto / UPI collect
  if (/(registration fee|processing fee|deposit|gift card|wire transfer|upi|pay now|refund fee|crypto|send \$|rs\.?\s*\d+)/i.test(text)) {
    score += 24;
    riskIndicators.push('Unusual payment request');
    reasons.push('Potential risk: requests money, upfront registration fees, or immediate transfers before verifying legitimacy.');
  }

  // Prize / Too-good-to-be-true job or lottery
  if (/(congratulations|won a|lottery|selected for|earn \$\d+|daily income|guaranteed job|no interview|part[- ]time.*per day)/i.test(text)) {
    score += 22;
    riskIndicators.push('Too-good-to-be-true offer');
    reasons.push('May indicate an unsolicited reward or job lure offering high pay or prizes without normal verification.');
  }

  // Links inside message
  const urlMatches = text.match(/https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(com|net|org|co|info|xyz|top|ly|in)\b[^\s]*/gi);
  let extractedUrlAnalysis: UrlAnalysisResult | null = null;
  if (urlMatches && urlMatches.length > 0) {
    extractedUrlAnalysis = analyzeUrlHeuristics(urlMatches[0]);
    if (extractedUrlAnalysis.riskLevel === 'High' || extractedUrlAnalysis.riskLevel === 'Medium') {
      score += extractedUrlAnalysis.riskLevel === 'High' ? 30 : 16;
      riskIndicators.push('Suspicious links');
      reasons.push(`Contains a link (${extractedUrlAnalysis.hostname}) with warning signs: ${extractedUrlAnalysis.reasons[0]}`);
    } else {
      score += 8;
      riskIndicators.push('External link');
      reasons.push(`Includes an external link (${extractedUrlAnalysis.hostname}). SafeLens AI cannot verify the sender's identity from text alone.`);
    }
  }

  let riskLevel: RiskLevel = 'Low';
  if (score >= 48) riskLevel = 'High';
  else if (score >= 22) riskLevel = 'Medium';

  if (reasons.length === 0) {
    riskIndicators.push('No strong manipulation signals');
    reasons.push(
      `No classic urgency, credential-harvesting, or suspicious link patterns were detected in this ${channel.toUpperCase()} message. However, SafeLens AI cannot verify who actually sent it.`
    );
  }

  const saferAction: string[] =
    riskLevel === 'High'
      ? [
          'Pause and do not click links, reply, or share any codes or payments.',
          'Open the official app or website independently (using a saved bookmark or official phone number) to check your account status.',
          'If this mentions a job offer, bank, or delivery, verify directly with the organization’s official directory.',
        ]
      : riskLevel === 'Medium'
        ? [
            'Verify the sender using a separate, trusted channel before taking action.',
            'Avoid entering passwords or personal details through links inside unexpected messages.',
          ]
        : [
            'Even when a message looks routine, double-check unexpected requests through official channels.',
            'Keep one-time passcodes (OTPs) private—never share them with anyone.',
          ];

  const isJobOffer = /(job|hiring|recruiter|registration fee|salary|part[- ]time)/i.test(lower);
  const isOtp = /(otp|pin|password|kyc|bank|account)/i.test(lower);

  const explainLikeIm10 =
    riskLevel === 'High'
      ? 'This message is trying to rush or scare you so you act before thinking carefully. A real helper will never mind if you stop and check with a trusted adult or official website first.'
      : riskLevel === 'Medium'
        ? 'Something in this message asks you to trust it quickly without proving who sent it. It is smart to slow down and double-check.'
        : 'This message looks calm and does not appear to push you into doing anything risky, though it is always good to check who it came from.';

  const beforeYouClick = isJobOffer
    ? {
        scenario: 'Possible Fake Job or Fee-First Offer',
        possibleConsequence: 'Loss of money through fake registration or equipment fees, or exposure of personal ID documents.',
        warningSign: 'Unsolicited offer, rushed onboarding, or request for payment before a verified interview.',
        saferAlternative: 'Verify the role on LinkedIn, the company’s official careers page, or official HR email domain.',
      }
    : isOtp
      ? {
          scenario: 'Possible Account or OTP Phishing Attempt',
          possibleConsequence: 'Sharing a one-time code or signing into an imitation link could give someone else access to your account or funds.',
          warningSign: 'Urgent warning about account closure paired with a link or request for a verification code.',
          saferAlternative: 'Open your bank or service’s official app directly instead of tapping links in messages.',
        }
      : {
          scenario: riskLevel === 'Low' ? 'Routine Message Verification' : 'Unverified Link or Request',
          possibleConsequence: 'Acting on an unverified message may lead to unwanted subscriptions, data sharing, or financial loss.',
          warningSign: riskIndicators.join(', '),
          saferAlternative: 'Confirm the message directly with the known sender or official company website.',
        };

  const confidenceScore = Math.min(91, Math.max(48, 55 + Math.round(score * 0.4)));

  return {
    riskLevel,
    confidenceScore,
    uncertaintyNote:
      'Analysis is based on language and link patterns only. SafeLens AI cannot verify the sender’s phone number or email server headers.',
    reasons,
    riskIndicators,
    saferAction,
    explainLikeIm10,
    beforeYouClick,
    source: 'heuristic',
  };
}

export function analyzeQrContentHeuristics(decodedContent: string): QrAnalysisResult {
  const trimmed = decodedContent.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith('upi://')) {
    const params = new URLSearchParams(trimmed.split('?')[1] || '');
    const payee = params.get('pn') || 'Unknown recipient';
    const pa = params.get('pa') || 'Unknown UPI ID';
    const amount = params.get('am');
    return {
      decodedContent: trimmed,
      contentType: 'upi',
      riskLevel: 'Medium',
      confidenceScore: 82,
      potentialRisks: [
        `Possible Concern: This QR code initiates a payment request to "${payee}" (${pa})${amount ? ` for amount ${amount}` : ''}.`,
        'QR codes for receiving money are a common misconception—scanning a payment QR always sends money out, never receives it.',
      ],
      safetyRecommendations: [
        'Confirm the recipient name and UPI ID aloud with the merchant or person before entering your PIN.',
        'Never scan a QR code or enter your UPI PIN if someone claims it is needed to receive a refund or prize.',
      ],
      safePreviewSummary: `UPI Payment Intent → Payee: ${payee} (${pa})${amount ? ` · Amount: ${amount}` : ''}`,
      explainLikeIm10: 'This QR code opens a money-sending screen. Only use it if you actually mean to pay this exact shop or person.',
      beforeYouClick: {
        scenario: 'QR Payment / Collect Fraud',
        possibleConsequence: 'Entering your payment PIN after scanning an unexpected QR code immediately transfers money out of your account.',
        warningSign: 'Someone tells you to scan a QR code to "receive" a refund, prize, or marketplace payment.',
        saferAlternative: 'Only scan payment QRs when you are actively paying a verified merchant, and inspect the recipient name first.',
      },
      source: 'heuristic',
    };
  }

  if (lower.startsWith('wifi:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const ssid = ssidMatch ? ssidMatch[1] : 'Unknown network';
    return {
      decodedContent: trimmed,
      contentType: 'wifi',
      riskLevel: 'Medium',
      confidenceScore: 78,
      potentialRisks: [
        `Possible Concern: Connects your device to Wi-Fi network "${ssid}".`,
        'Unknown public Wi-Fi networks can observe unencrypted traffic or present fake sign-in portals.',
      ],
      safetyRecommendations: [
        'Confirm with the venue staff that this QR code belongs to their official guest Wi-Fi.',
        'Avoid banking or entering sensitive passwords on shared public networks.',
      ],
      safePreviewSummary: `Wi-Fi Network Configuration → Network Name (SSID): ${ssid}`,
      explainLikeIm10: 'This QR code connects your device to a Wi-Fi internet network. Make sure the café or place really put it there.',
      beforeYouClick: {
        scenario: 'Unverified Public Wi-Fi QR Code',
        possibleConsequence: 'Connecting to an untrusted hotspot may expose browsing activity or redirect you to fake login pages.',
        warningSign: 'Sticker placed over an existing sign, or unfamiliar network name.',
        saferAlternative: 'Verify the official Wi-Fi name with staff or use your mobile cellular connection for sensitive tasks.',
      },
      source: 'heuristic',
    };
  }

  if (/^https?:\/\//i.test(trimmed) || /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)) {
    const urlResult = analyzeUrlHeuristics(trimmed);
    return {
      decodedContent: trimmed,
      contentType: 'url',
      riskLevel: urlResult.riskLevel,
      confidenceScore: urlResult.confidenceScore,
      potentialRisks: urlResult.reasons,
      safetyRecommendations: [
        'Review the full destination domain in the Safe Preview box before deciding whether to visit.',
        ...urlResult.safetyTips,
      ],
      safePreviewSummary: `Web Link Preview → ${urlResult.normalizedUrl}`,
      explainLikeIm10: urlResult.explainLikeIm10,
      beforeYouClick: urlResult.beforeYouClick,
      urlDetails: urlResult,
      source: 'heuristic',
    };
  }

  return {
    decodedContent: trimmed,
    contentType: 'text',
    riskLevel: 'Low',
    confidenceScore: 80,
    potentialRisks: [
      'Contains plain text rather than a web link or payment command. No automatic action is triggered.',
    ],
    safetyRecommendations: [
      'Review the decoded text carefully before copying any phone numbers or instructions from it.',
    ],
    safePreviewSummary: `Plain Text → "${trimmed.slice(0, 120)}${trimmed.length > 120 ? '...' : ''}"`,
    explainLikeIm10: 'This QR code just holds a short text note—it does not try to open a website or move money.',
    beforeYouClick: {
      scenario: 'Plain Text QR Content',
      possibleConsequence: 'Text itself is passive, though instructions or phone numbers inside text should still be verified.',
      warningSign: 'Unexpected phone numbers claiming to be tech support.',
      saferAlternative: 'Verify any phone numbers or instructions via official websites.',
    },
    source: 'heuristic',
  };
}

export function buildSamplePermissionAnalysis(note = ''): PermissionAnalysisResult {
  const lower = note.toLowerCase();
  const permissions: TranslatedPermission[] = [
    {
      permissionName: 'Camera',
      plainEnglish: 'This app can take photos and videos.',
      childFriendly: 'The app can look through your camera lens and take pictures or video.',
      riskLevel: 'Medium',
      whyAppsAsk: 'Normal for QR scanners, video calls, or photo editors; unnecessary for calculators or flashlights.',
    },
    {
      permissionName: 'Contacts',
      plainEnglish: 'This app can access names, phone numbers, and emails saved on your device.',
      childFriendly: 'The app can read your whole list of friends and family phone numbers.',
      riskLevel: 'High',
      whyAppsAsk: 'Used by messaging apps to find friends, but risky if a simple utility or game asks for it.',
    },
    {
      permissionName: 'Precise Location',
      plainEnglish: 'This app can track where you go in real time, down to your street address.',
      childFriendly: 'The app can see on a map exactly where you are standing.',
      riskLevel: 'High',
      whyAppsAsk: 'Helpful for maps and rideshares; choose "While using the app" or "Approximate" when exact GPS is not needed.',
    },
    {
      permissionName: 'Notifications',
      plainEnglish: 'This app can send alerts, sounds, and badges to your lock screen.',
      childFriendly: 'The app can pop up messages on your screen.',
      riskLevel: 'Low',
      whyAppsAsk: 'Common for reminders and chats; can always be muted later in device settings.',
    },
  ];

  const filtered = lower.includes('flashlight')
    ? permissions.slice(0, 3)
    : permissions;

  return {
    appContext: note.trim()
      ? `Permissions detected from prompt/context: ${note.trim()}`
      : 'Standard mobile app permission prompt (Camera, Contacts, Location, Notifications)',
    overallRisk: 'Medium',
    confidenceScore: 79,
    permissions: filtered,
    recommendations: [
      'Ask: "Does this app actually need this permission to do its main job?"',
      'Prefer "While using the app" or "Only this time" for Camera, Microphone, and Location.',
      'Deny Contacts access for games, wallpapers, or utility apps unless you intentionally want to sync contacts.',
    ],
    beforeYouClick: {
      scenario: 'Granting Broad Device Permissions Without Review',
      possibleConsequence: 'Over-privileged apps may collect address books or background location data beyond what their core feature requires.',
      warningSign: 'A simple utility or game asking for Contacts, SMS, or Always-On Location.',
      saferAlternative: 'Tap "Don’t Allow" or "Only While Using App" — legitimate apps still work or explain clearly why a feature needs it.',
    },
    source: 'heuristic',
  };
}

export function computeSafetyScore(
  progress: UserProgressState,
  history: AnalysisHistoryItem[]
): SafetyScoreBreakdown {
  const lessonsCount = progress.completedLessonIds.length;
  const quizValues = Object.values(progress.quizScores);
  const avgQuiz =
    quizValues.length > 0
      ? quizValues.reduce((sum, v) => sum + v, 0) / quizValues.length
      : 0;
  const analysesCount = history.length;
  const advisorCount = progress.advisorTopicsRead.length;
  const distinctModules = new Set([
    ...progress.modulesUsed,
    ...history.map((h) => h.module),
  ]).size;

  const digitalAwareness = Math.min(
    100,
    Math.round(20 + distinctModules * 14 + Math.min(24, analysesCount * 6))
  );
  const privacyProtection = Math.min(
    100,
    Math.round(
      18 +
        (progress.completedLessonIds.includes('privacy-protection') ? 22 : 0) +
        (progress.completedLessonIds.includes('password-security') ? 16 : 0) +
        (progress.completedLessonIds.includes('mfa') ? 16 : 0) +
        (progress.modulesUsed.includes('permissions') ? 18 : 0) +
        Math.min(10, lessonsCount * 2)
    )
  );
  const scamResistance = Math.min(
    100,
    Math.round(
      22 +
        Math.round(avgQuiz * 0.45) +
        Math.min(20, analysesCount * 5) +
        (progress.completedLessonIds.includes('job-scams') ? 8 : 0) +
        (progress.completedLessonIds.includes('social-engineering') ? 8 : 0)
    )
  );
  const preparedness = Math.min(
    100,
    Math.round(16 + Math.min(48, advisorCount * 12) + Math.min(36, lessonsCount * 6))
  );

  const overall = Math.round(
    (digitalAwareness + privacyProtection + scamResistance + preparedness) / 4
  );

  const suggestions: string[] = [];
  if (lessonsCount < 4) {
    suggestions.push('Complete more Safety Academy lessons and quizzes to strengthen Scam Resistance.');
  }
  if (!progress.modulesUsed.includes('permissions')) {
    suggestions.push('Try the Permission Translator to audit how apps request Camera, Contacts, and Location.');
  }
  if (advisorCount < 3) {
    suggestions.push('Review at least 3 guides in the Daily Life Safety Advisor (including Emergency Preparedness).');
  }
  if (analysesCount < 2) {
    suggestions.push('Test the Message Analyzer or URL Checker on sample scenarios to build threat-spotting habits.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Great habits! Periodically revisit Emergency Preparedness checklists and MFA backup codes.');
  }

  return {
    overall,
    digitalAwareness,
    privacyProtection,
    scamResistance,
    preparedness,
    suggestions,
  };
}

export function calculateHeatmapData(history: AnalysisHistoryItem[]) {
  const modules: Array<{ id: AnalysisHistoryItem['module']; label: string }> = [
    { id: 'message', label: 'Messages' },
    { id: 'url', label: 'URLs' },
    { id: 'qr', label: 'QR Codes' },
    { id: 'permissions', label: 'Permissions' },
  ];

  return modules.map((mod) => {
    const items = history.filter((item) => item.module === mod.id);
    return {
      module: mod.id,
      label: mod.label,
      low: items.filter((i) => i.riskLevel === 'Low').length,
      medium: items.filter((i) => i.riskLevel === 'Medium').length,
      high: items.filter((i) => i.riskLevel === 'High').length,
      total: items.length,
    };
  });
}
