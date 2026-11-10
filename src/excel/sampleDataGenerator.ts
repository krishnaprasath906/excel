import * as XLSX from 'xlsx';
import { ExcelRow } from '../types/index';

export const KEY_SAMPLE_CANDIDATES: ExcelRow[] = [
  {
    'Registration Number': '866458',
    'Name': 'M.Aashritha',
    'Email Address': 'm.aashritha@example.com',
    'Middle Initial': 'A',
    'Blood Group': 'B+',
    'Age': 24,
    'Mobile Number': '9848022338',
    'Weight in Kgs.': '52.40',
    'Gender': 'Female',
    'Degree': 'Bachelor of Technology (B.Tech)',
    'Institute': 'Osmania University',
    'Stream': 'Information Technology',
    'Register joining code': '866-45-8001',
    'Age in Company (Years)': 1,
    'Work Experience': 'Entry-Level',
    'Current City': 'Hyderabad',
    'Region': 'South',
  },
  {
    'Registration Number': '306261',
    'Name': 'Kummari Rajeshwari',
    'Email Address': 'k.rajeshwari@example.com',
    'Middle Initial': 'R',
    'Blood Group': 'O+',
    'Age': 27,
    'Mobile Number': '9849123847',
    'Weight in Kgs.': '56.10',
    'Gender': 'Female',
    'Degree': 'Master of Science (M.Sc)',
    'Institute': 'Andhra University',
    'Stream': 'Biotechnology',
    'Register joining code': '306-26-1002',
    'Age in Company (Years)': 3,
    'Work Experience': 'Experienced',
    'Current City': 'Visakhapatnam',
    'Region': 'South',
  },
  {
    'Registration Number': '813186',
    'Name': 'T.Sunitha',
    'Email Address': 't.sunitha@example.com',
    'Middle Initial': 'S',
    'Blood Group': 'A+',
    'Age': 29,
    'Mobile Number': '9848192837',
    'Weight in Kgs.': '58.00',
    'Gender': 'Female',
    'Degree': 'Bachelor of Commerce (B.Com)',
    'Institute': 'Sri Venkateswara University',
    'Stream': 'Accounting & Finance',
    'Register joining code': '813-18-6003',
    'Age in Company (Years)': 4,
    'Work Experience': 'Experienced',
    'Current City': 'Tirupati',
    'Region': 'South',
  },
  {
    'Registration Number': '980074',
    'Name': 'Surendra Babu',
    'Email Address': 'surendra.babu@example.com',
    'Middle Initial': 'B',
    'Blood Group': 'O-',
    'Age': 35,
    'Mobile Number': '9701238471',
    'Weight in Kgs.': '68.50',
    'Gender': 'Male',
    'Degree': 'Bachelor of Technology (B.Tech)',
    'Institute': 'JNTU Kakinada',
    'Stream': 'Mechanical Engineering',
    'Register joining code': '980-07-4004',
    'Age in Company (Years)': 6,
    'Work Experience': 'Experienced',
    'Current City': 'Vijayawada',
    'Region': 'South',
  },
  {
    'Registration Number': '916423',
    'Name': 'Srinivas',
    'Email Address': 'srinivas.rao@example.com',
    'Middle Initial': 'V',
    'Blood Group': 'AB+',
    'Age': 32,
    'Mobile Number': '9866129845',
    'Weight in Kgs.': '65.20',
    'Gender': 'Male',
    'Degree': 'Master of Business Administration (MBA)',
    'Institute': 'Kakatiya University',
    'Stream': 'Human Resources',
    'Register joining code': '916-42-3005',
    'Age in Company (Years)': 5,
    'Work Experience': 'Experienced',
    'Current City': 'Warangal',
    'Region': 'South',
  },
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
  },
  {
    'Registration Number': '782341',
    'Name': 'Ananya Sharma',
    'Email Address': 'ananya.sharma@example.com',
    'Middle Initial': 'K',
    'Blood Group': 'O+',
    'Age': 28,
    'Mobile Number': '9845123901',
    'Weight in Kgs.': '54.20',
    'Gender': 'Female',
    'Degree': 'Master of Technology (M.Tech)',
    'Institute': 'National Institute of Technology',
    'Stream': 'Computer Science',
    'Register joining code': '412-99-3182',
    'Age in Company (Years)': 4,
    'Work Experience': 'Experienced',
    'Current City': 'Bengaluru',
    'Region': 'South',
  },
  {
    'Registration Number': '549102',
    'Name': 'Rohan Dasgupta',
    'Email Address': 'rohan.dasgupta@example.com',
    'Middle Initial': 'M',
    'Blood Group': 'B+',
    'Age': 34,
    'Mobile Number': '9711204855',
    'Weight in Kgs.': '72.00',
    'Gender': 'Male',
    'Degree': 'Bachelor of Science (B.Sc)',
    'Institute': 'Presidency University',
    'Stream': 'Mathematics',
    'Register joining code': '890-12-4411',
    'Age in Company (Years)': 1,
    'Work Experience': 'Entry-Level',
    'Current City': 'Kolkata',
    'Region': 'East',
  },
  {
    'Registration Number': '923841',
    'Name': 'Sneha Patil',
    'Email Address': 'sneha.patil@example.com',
    'Middle Initial': 'R',
    'Blood Group': 'AB+',
    'Age': 31,
    'Mobile Number': '9920194821',
    'Weight in Kgs.': '58.50',
    'Gender': 'Female',
    'Degree': 'Master of Business Administration (MBA)',
    'Institute': 'Symbiosis Institute',
    'Stream': 'Marketing',
    'Register joining code': '304-45-7789',
    'Age in Company (Years)': 5,
    'Work Experience': 'Experienced',
    'Current City': 'Pune',
    'Region': 'West',
  },
  {
    'Registration Number': '401928',
    'Name': 'Vikramaditya Rao',
    'Email Address': 'vikram.rao@example.com',
    'Middle Initial': 'S',
    'Blood Group': 'O-',
    'Age': 42,
    'Mobile Number': '9820019283',
    'Weight in Kgs.': '78.30',
    'Gender': 'Male',
    'Degree': 'Bachelor of Technology (B.Tech)',
    'Institute': 'IIT Madras',
    'Stream': 'Mechanical Engineering',
    'Register joining code': '551-78-9032',
    'Age in Company (Years)': 8,
    'Work Experience': 'Senior Management',
    'Current City': 'Hyderabad',
    'Region': 'South',
  },
];

export const SAMPLE_DATASET: ExcelRow[] = KEY_SAMPLE_CANDIDATES;

// Helper to generate full 2000 realistic records
const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Dhruv', 'Kabir', 'Rishi', 'Atharv', 'Rudra', 'Ananya', 'Diya', 'Aadhya', 'Pari',
  'Saanvi', 'Myra', 'Aarohi', 'Anvi', 'Prisha', 'Riya', 'Kavya', 'Avani', 'Isha', 'Ahana',
  'Surendra', 'Srinivas', 'Sunitha', 'Rajeshwari', 'Aashritha', 'Ramesh', 'Suresh', 'Mahesh',
  'Ganesh', 'Venkat', 'Lakshmi', 'Padma', 'Swathi', 'Divya', 'Deepika', 'Keerthi', 'Bhavani'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Babu', 'Kumar', 'Singh', 'Prasad', 'Das',
  'Choudhury', 'Nair', 'Menon', 'Pillai', 'Iyer', 'Iyengar', 'Gupta', 'Mishra', 'Pandey', 'Joshi',
  'Kulkarni', 'Deshmukh', 'Patil', 'Bhat', 'Hegde', 'Gowda', 'Shetty', 'Naidu', 'Chowdary', 'Varma'
];

const DEGREES = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Engineering (B.E)',
  'Master of Technology (M.Tech)',
  'Bachelor of Science (B.Sc)',
  'Master of Science (M.Sc)',
  'Bachelor of Commerce (B.Com)',
  'Master of Business Administration (MBA)',
  'Bachelor of Computer Applications (BCA)',
  'Master of Computer Applications (MCA)',
  'Bachelor of Arts (B.A)',
];

const INSTITUTES = [
  'IIT Madras',
  'IIT Bombay',
  'IIT Delhi',
  'Osmania University',
  'Andhra University',
  'JNTU Hyderabad',
  'JNTU Kakinada',
  'Sri Venkateswara University',
  'Kakatiya University',
  'National Institute of Technology',
  'Presidency University',
  'Symbiosis Institute',
  "Jamshedpur Women's College",
  'Anna University',
  'Delhi University',
];

const STREAMS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Commerce',
  'Accounting & Finance',
  'Human Resources',
  'Marketing',
  'Mathematics',
  'Biotechnology',
];

const CITIES = [
  { city: 'Hyderabad', region: 'South' },
  { city: 'Bengaluru', region: 'South' },
  { city: 'Visakhapatnam', region: 'South' },
  { city: 'Vijayawada', region: 'South' },
  { city: 'Tirupati', region: 'South' },
  { city: 'Warangal', region: 'South' },
  { city: 'Chennai', region: 'South' },
  { city: 'Mumbai', region: 'West' },
  { city: 'Pune', region: 'West' },
  { city: 'Kolkata', region: 'East' },
  { city: 'Delhi', region: 'North' },
  { city: 'Kanyakumari', region: 'South' },
  { city: 'Guwahati', region: 'Northeast' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export function generate2000SampleDataset(): ExcelRow[] {
  const result: ExcelRow[] = [...KEY_SAMPLE_CANDIDATES];
  const usedRegs = new Set<string>(KEY_SAMPLE_CANDIDATES.map((c) => String(c['Registration Number'])));

  let seed = 100000;
  while (result.length < 2000) {
    const regNum = String(seed++);
    if (usedRegs.has(regNum)) continue;
    usedRegs.add(regNum);

    const fName = FIRST_NAMES[result.length % FIRST_NAMES.length];
    const lName = LAST_NAMES[(result.length * 3) % LAST_NAMES.length];
    const fullName = `${fName} ${lName}`;
    const initial = String.fromCharCode(65 + ((result.length * 7) % 26));
    const blood = BLOOD_GROUPS[result.length % BLOOD_GROUPS.length];
    const age = 21 + (result.length % 35);
    const mobile = `98${String(10000000 + ((result.length * 947) % 89999999)).slice(0, 8)}`;
    const weight = (48 + ((result.length * 37) % 40) + ((result.length % 10) * 0.1)).toFixed(2);
    const gender = (result.length % 2 === 0) ? 'Female' : 'Male';
    const degree = DEGREES[result.length % DEGREES.length];
    const institute = INSTITUTES[(result.length * 2) % INSTITUTES.length];
    const stream = STREAMS[(result.length * 5) % STREAMS.length];
    const joinCode = `${regNum.slice(0, 3)}-${regNum.slice(3, 5)}-${String(1000 + (result.length % 8999))}`;
    const tenure = (result.length % 12) + 1;
    const exp = tenure > 5 ? 'Senior' : tenure > 2 ? 'Experienced' : 'Entry-Level';
    const location = CITIES[result.length % CITIES.length];

    result.push({
      'Registration Number': regNum,
      'Name': fullName,
      'Email Address': `${fName.toLowerCase()}.${lName.toLowerCase()}${result.length}@example.com`,
      'Middle Initial': initial,
      'Blood Group': blood,
      'Age': age,
      'Mobile Number': mobile,
      'Weight in Kgs.': weight,
      'Gender': gender,
      'Degree': degree,
      'Institute': institute,
      'Stream': stream,
      'Register joining code': joinCode,
      'Age in Company (Years)': tenure,
      'Work Experience': exp,
      'Current City': location.city,
      'Region': location.region,
    });
  }

  return result;
}

export function generateSampleExcelBlob(dataset: ExcelRow[] = SAMPLE_DATASET): Blob {
  const worksheet = XLSX.utils.json_to_sheet(dataset);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Records');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function downloadSampleExcel(
  fileName: string = 'Excel_AutoFill_Sample_Records.xlsx',
  dataset: ExcelRow[] = SAMPLE_DATASET
) {
  const blob = generateSampleExcelBlob(dataset);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
