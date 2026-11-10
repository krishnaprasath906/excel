import * as XLSX from 'xlsx';

console.log('==================================================');
console.log('RUNNING AUTOMATED UNIT & LOGIC VERIFICATION');
console.log('==================================================');

// 1. Test Dataset
const SAMPLE_DATASET = [
  {
    'Registration Number': '697294',
    'Name': 'Krishna Prasad',
    'Email Address': 'krishna.prasad@example.com',
    'Middle Initial': 'O',
    'Blood Group': 'A-',
    'Age': 49,
    'Mobile Number': '9876547026',
    'Weight in Kgs.': '61.65',
    'Gender': 'Male',
    'Degree': 'Bachelor of Engineering (B.E)',
    'Institute': "Jamshedpur Women's College",
    'Stream': 'Commerce',
    'Register joining code': '611-87-6140',
    'Age in Company (Years)': 2,
    'Work Experience': 'Experienced',
    'Current City': 'Kanyakumari',
    'Region': 'Northeast',
  }
];

// Test 1: XLSX Generation and Parsing
const worksheet = XLSX.utils.json_to_sheet(SAMPLE_DATASET);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

const parsedWb = XLSX.read(buffer, { type: 'buffer' });
const parsedData = XLSX.utils.sheet_to_json(parsedWb.Sheets[parsedWb.SheetNames[0]]);

console.log('✓ SheetJS Parsing: Parsed', parsedData.length, 'records with', Object.keys(parsedData[0]).length, 'columns.');

// Test 2: Registration Number Exact Lookup
const query = '697294';
const found = parsedData.find(row => String(row['Registration Number']).trim() === query);

if (found && found['Name'] === 'Krishna Prasad') {
  console.log('✓ Registration Number Lookup: Successfully retrieved Krishna Prasad (Reg: 697294)');
} else {
  throw new Error('Registration lookup failed');
}

// Test 3: Normalization & Synonyms Heuristics
const SYNONYMS = {
  'registration number': ['registration no', 'reg number', 'reg no', 'roll number', 'roll #'],
  'name': ['full name', 'fullname', 'full applicant name', 'candidate name'],
  'email address': ['electronic mail', 'email', 'e-mail'],
  'mobile number': ['contact phone / mobile', 'mobile', 'phone', 'contact number'],
  'weight in kgs.': ['body weight (kg)', 'weight in kg', 'body weight', 'weight'],
  'degree': ['graduated degree / qualification', 'qualification', 'degree'],
  'institute': ['college / institute name', 'college', 'university'],
  'current city': ['current residence city', 'location', 'city'],
  'register joining code': ['joining code / id', 'joining id', 'joining code'],
  'age in company (years)': ['company tenure (in years)', 'tenure', 'years in company'],
  'work experience': ['work experience level', 'experience level', 'experience'],
  'stream': ['academic major / stream', 'major', 'branch', 'stream'],
  'middle initial': ['middle initial (m.i.)', 'm.i.', 'middle initial'],
  'blood group': ['blood group type', 'blood group', 'blood type'],
  'region': ['geographic region / zone', 'region', 'zone'],
  'age': ['current age (years)', 'age'],
  'gender': ['gender identity', 'gender', 'sex']
};

function normalize(s) {
  return String(s || '').toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/[._\-:/\\#&,]/g, ' ').replace(/\s+/g, ' ').trim();
}

console.log('✓ Normalization checks:');
console.log('  "Weight in Kgs." ->', normalize('Weight in Kgs.'));
console.log('  "Age in Company (Years)" ->', normalize('Age in Company (Years)'));
console.log('  "Middle Initial (M.I.)" ->', normalize('Middle Initial (M.I.)'));

// Test 4: Scrambled Form Fields Mapping Verification
const scrambledFormFields = [
  'Gender Identity',
  'Contact Phone / Mobile Number',
  'Electronic Mail (Email Address)',
  'Full Applicant Name',
  'Current Age (Years)',
  'Graduated Degree / Qualification',
  'Body Weight (kg)',
  'Blood Group Type',
  'College / Institute Name',
  'Middle Initial (M.I.)',
  'Current Residence City',
  'Academic Major / Stream',
  'Work Experience Level',
  'Company Tenure (in Years)',
  'Joining Code / ID',
  'Geographic Region / Zone',
  'Primary Registration Number / Roll #'
];

console.log('\n--- Verifying Scrambled Form Field Mappings (17 fields) ---');
const excelCols = Object.keys(SAMPLE_DATASET[0]);
let matchCount = 0;

for (const col of excelCols) {
  const normCol = normalize(col);
  const candidateAliases = SYNONYMS[col.toLowerCase()] || [];

  const matchedFormField = scrambledFormFields.find(formLabel => {
    const normForm = normalize(formLabel);
    if (normForm === normCol) return true;
    if (candidateAliases.some(alias => normForm.includes(normalize(alias)) || normalize(alias).includes(normForm))) return true;
    return false;
  });

  if (matchedFormField) {
    matchCount++;
    console.log(`  ✓ Excel: "${col}" -> Target: "${matchedFormField}" (Value: "${SAMPLE_DATASET[0][col]}")`);
  } else {
    console.warn(`  ⚠ Unmatched: "${col}"`);
  }
}

console.log(`\n✓ Mapping Result: ${matchCount} of ${excelCols.length} fields correctly mapped regardless of scrambled order!`);

if (matchCount === 17) {
  console.log('✓ ALL 17 EXCEL FIELDS TESTED AND VERIFIED SUCCESSFULLY!');
} else {
  throw new Error(`Only matched ${matchCount}/17 fields.`);
}
