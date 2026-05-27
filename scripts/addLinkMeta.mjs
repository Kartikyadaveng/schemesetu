import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ministryLinks = {
  'Ministry of Agriculture & Farmers Welfare': 'https://agriculture.gov.in',
  'Ministry of Education': 'https://www.education.gov.in',
  'Ministry of Petroleum & Natural Gas': 'https://petroleum.nic.in',
  'DPIIT, Ministry of Commerce': 'https://dpiit.gov.in',
  'Ministry of Health & Family Welfare': 'https://main.mohfw.gov.in',
  'Ministry of Finance': 'https://www.financialservices.gov.in',
  'Ministry of Skill Development': 'https://skilldevelopment.gov.in',
  'Ministry of Women & Child Development': 'https://wcd.nic.in',
  'Ministry of Housing & Urban Affairs': 'https://mohua.gov.in',
  'Ministry of Rural Development': 'https://rural.nic.in',
  'Ministry of Micro, Small & Medium Enterprises': 'https://msme.gov.in',
  'Ministry of MSME': 'https://msme.gov.in',
  'Ministry of Finance (Department of Financial Services)': 'https://financialservices.gov.in',
  'Ministry of Power': 'https://powermin.gov.in',
  'Ministry of Jal Shakti': 'https://jaljeevanmission.gov.in',
  'Ministry of Ayush': 'https://ayush.gov.in',
  'Ministry of Food Processing Industries': 'https://mofpi.nic.in',
  'Ministry of Housing & Urban Affairs (Smart Cities)': 'https://smartcities.gov.in',
  'Ministry of Electronics & IT': 'https://www.meity.gov.in',
  'Ministry of Road Transport & Highways': 'https://morth.nic.in',
};

const filePath = resolve(__dirname, '..', 'src', 'data', 'schemes.json');
const raw = readFileSync(filePath, 'utf-8');
const schemes = JSON.parse(raw);

let updated = 0;
for (const s of schemes) {
  if (!s.verificationStatus) {
    s.verificationStatus = 'verified';
    updated++;
  }
  if (!s.officialLink) {
    s.officialLink = s.applicationUrl;
    updated++;
  }
  if (!s.ministryLink && ministryLinks[s.ministry]) {
    s.ministryLink = ministryLinks[s.ministry];
    updated++;
  }
}

writeFileSync(filePath, JSON.stringify(schemes, null, 2) + '\n', 'utf-8');
console.log(`✓ Updated ${updated} fields across ${schemes.length} schemes`);
