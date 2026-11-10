/**
 * Multi-domain synonym dictionary for intelligent form field matching.
 * Maps canonical concepts to lists of synonyms and common alias phrases.
 */

export interface FieldSynonymGroup {
  canonical: string;
  aliases: string[];
}

export const SYNONYM_GROUPS: FieldSynonymGroup[] = [
  {
    canonical: 'registration number',
    aliases: [
      'registration number',
      'registration no',
      'reg number',
      'reg no',
      'regno',
      'reg_no',
      'registration_number',
      'registration #',
      'candidate id',
      'student id',
      'roll number',
      'roll no',
      'application number',
      'app no',
      'reg id',
    ],
  },
  {
    canonical: 'name',
    aliases: [
      'name',
      'full name',
      'fullname',
      'person name',
      'candidate name',
      'student name',
      'employee name',
      'applicant name',
      'first and last name',
      'your name',
    ],
  },
  {
    canonical: 'email',
    aliases: [
      'email address',
      'email',
      'e mail',
      'e-mail',
      'email id',
      'electronic mail',
      'contact email',
      'user email',
    ],
  },
  {
    canonical: 'middle initial',
    aliases: [
      'middle initial',
      'middle name',
      'initial',
      'm i',
      'middle name initial',
      'mid initial',
    ],
  },
  {
    canonical: 'blood group',
    aliases: [
      'blood group',
      'blood type',
      'blood',
      'bg',
      'rh factor',
      'blood group type',
    ],
  },
  {
    canonical: 'age',
    aliases: [
      'age',
      'years of age',
      'applicant age',
      'person age',
      'current age',
    ],
  },
  {
    canonical: 'mobile',
    aliases: [
      'mobile number',
      'mobile',
      'phone',
      'phone number',
      'telephone',
      'tel number',
      'cell number',
      'cellphone',
      'contact number',
      'contact no',
      'cell',
      'whatsapp number',
    ],
  },
  {
    canonical: 'weight',
    aliases: [
      'weight in kgs',
      'weight in kg',
      'weight kgs',
      'weight',
      'body weight',
      'weight kg',
      'weight (kgs)',
      'weight (kg)',
    ],
  },
  {
    canonical: 'gender',
    aliases: [
      'gender',
      'sex',
      'gender identity',
    ],
  },
  {
    canonical: 'degree',
    aliases: [
      'degree',
      'qualification',
      'highest qualification',
      'highest degree',
      'education',
      'educational qualification',
      'course',
      'graduated degree',
      'academic degree',
    ],
  },
  {
    canonical: 'institute',
    aliases: [
      'institute',
      'college',
      'university',
      'institution',
      'school',
      'college name',
      'institute name',
      'university name',
      'alma mater',
    ],
  },
  {
    canonical: 'stream',
    aliases: [
      'stream',
      'branch',
      'department',
      'major',
      'specialization',
      'discipline',
      'course stream',
      'field of study',
    ],
  },
  {
    canonical: 'register joining code',
    aliases: [
      'register joining code',
      'joining code',
      'joining code / id',
      'joining id',
      'registration code',
      'joining reference',
      'joining ref code',
      'onboarding code',
    ],
  },
  {
    canonical: 'age in company',
    aliases: [
      'age in company',
      'age in company years',
      'years in company',
      'company tenure',
      'tenure',
      'tenure (years)',
      'service length',
      'years at company',
    ],
  },
  {
    canonical: 'work experience',
    aliases: [
      'work experience',
      'experience',
      'prior experience',
      'experience level',
      'total experience',
      'years of experience',
      'professional experience',
    ],
  },
  {
    canonical: 'city',
    aliases: [
      'current city',
      'city',
      'location',
      'town',
      'residence city',
      'current location',
      'present city',
      'metro',
    ],
  },
  {
    canonical: 'region',
    aliases: [
      'region',
      'zone',
      'territory',
      'state/region',
      'geographic region',
      'area',
    ],
  },
  {
    canonical: 'address',
    aliases: [
      'address',
      'street address',
      'residential address',
      'permanent address',
      'home address',
    ],
  },
  {
    canonical: 'pincode',
    aliases: [
      'pincode',
      'pin code',
      'postal code',
      'zip code',
      'zip',
      'postal',
    ],
  },
];

/**
 * Finds the canonical field concept if a string matches any alias.
 */
export function getCanonicalConcept(fieldString: string): string | null {
  const norm = fieldString.toLowerCase().trim().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!norm) return null;

  for (const group of SYNONYM_GROUPS) {
    if (group.canonical === norm) return group.canonical;
    for (const alias of group.aliases) {
      const aliasNorm = alias.toLowerCase().trim().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      if (norm === aliasNorm || norm.includes(aliasNorm) || aliasNorm.includes(norm)) {
        return group.canonical;
      }
    }
  }

  return null;
}
