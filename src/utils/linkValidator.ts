const OFFICIAL_DOMAINS = [
  'gov.in',
  'nic.in',
  'myScheme.gov.in',
  'nsp.gov.in',
  'pmkisan.gov.in',
  'pmjay.gov.in',
  'pmfby.gov.in',
  'pmuy.gov.in',
  'pmjdy.gov.in',
  'pmayg.nic.in',
  'nsap.nic.in',
  'rsby.gov.in',
  'pmvishwakarma.gov.in',
  'pmsvanidhi.mohua.gov.in',
  'startupindia.gov.in',
  'skillindia.gov.in',
  'apprenticeshipindia.gov.in',
  'scholarships.gov.in',
  'pmegp.kviconline.gov.in',
  'wcd.nic.in',
  'indiapost.gov.in',
  'npscra.nsdl.co.in',
  'standupmitra.in',
  'maandhan.in',
  'mudra.org.in',
];

export function isValidOfficialUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('https://')) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    return OFFICIAL_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

export function getDomainHint(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function getMySchemeFallbackUrl(schemeName: string): string {
  const query = encodeURIComponent(schemeName.replace(/[^a-zA-Z0-9 ]/g, '').trim());
  return `https://www.myscheme.gov.in/search?q=${query}`;
}
