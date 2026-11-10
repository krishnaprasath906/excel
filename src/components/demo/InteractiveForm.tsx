'use client';

import React, { useState, forwardRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Send,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';

export interface TestFormData {
  gender: string;
  mobile: string;
  email: string;
  fullName: string;
  age: string;
  degree: string;
  weight: string;
  bloodGroup: string;
  institute: string;
  middleInitial: string;
  currentCity: string;
  stream: string;
  workExperience: string;
  ageInCompany: string;
  joiningCode: string;
  region: string;
  registrationNumber: string;
  comments?: string;
}

const INITIAL_FORM_DATA: TestFormData = {
  gender: '',
  mobile: '',
  email: '',
  fullName: '',
  age: '',
  degree: '',
  weight: '',
  bloodGroup: '',
  institute: '',
  middleInitial: '',
  currentCity: '',
  stream: '',
  workExperience: '',
  ageInCompany: '',
  joiningCode: '',
  region: '',
  registrationNumber: '',
  comments: '',
};

interface InteractiveFormProps {
  id?: string;
  isEmbedded?: boolean;
}

export const InteractiveForm = forwardRef<HTMLDivElement, InteractiveFormProps>(
  ({ id = 'demo-test-form-container', isEmbedded = false }, ref) => {
    const [formData, setFormData] = useState<TestFormData>(INITIAL_FORM_DATA);
    const [submitted, setSubmitted] = useState(false);
    const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (val: string) => {
      setFormData((prev) => ({ ...prev, gender: val }));
    };

    const handleManualSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setSubmissionNotice(
        `✓ Manual submission confirmed! Form submitted for ${formData.fullName || formData.registrationNumber || 'Candidate'}.`
      );
      setTimeout(() => setSubmissionNotice(null), 6000);
    };

    const handleReset = () => {
      setFormData(INITIAL_FORM_DATA);
      setSubmitted(false);
      setSubmissionNotice(null);
    };

    // Calculate filled count
    const filledCount = Object.values(formData).filter((v) => typeof v === 'string' && v.trim().length > 0).length;

    return (
      <div
        id={id}
        ref={ref}
        className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden ${
          isEmbedded ? 'p-6' : 'p-8 max-w-4xl mx-auto my-8'
        }`}
      >
        {/* Form Title Banner */}
        <div className="border-b border-slate-800/80 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                SCRAMBLED FIELD ORDER DEMO
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({filledCount} / 17 fields populated)
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <span>Candidate Registration & Onboarding Portal</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Field order in this form is intentionally scrambled and uses alternative labels to test NLP heuristic matching.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
        </div>

        {/* Submission Success Toast */}
        {submissionNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-200 flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold">{submissionNotice}</p>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="space-y-6">
          {/* Section 1: Demographics (Scrambled: Gender, Mobile, Email, Full Name) */}
          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span>Section 1 &bull; Personal & Contact Details (Scrambled Order)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1: GENDER (Radio) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Gender Identity <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-4 pt-1">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender.toLowerCase() === g.toLowerCase()}
                        onChange={() => handleGenderChange(g)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Field 2: MOBILE NUMBER */}
              <div>
                <label htmlFor="contact_mobile_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Phone / Mobile Number <span className="text-rose-400">*</span>
                </label>
                <input
                  id="contact_mobile_field"
                  name="mobile"
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Field 3: EMAIL ADDRESS */}
              <div>
                <label htmlFor="electronic_mail_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Electronic Mail (Email Address) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="electronic_mail_field"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Field 4: FULL NAME */}
              <div>
                <label htmlFor="full_applicant_name_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Applicant Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="full_applicant_name_field"
                  name="fullName"
                  type="text"
                  placeholder="First and Last Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical & Identity Attributes (Scrambled: Age, Degree, Weight, Blood Group, Middle Initial) */}
          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>Section 2 &bull; Attributes & Educational Background</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Field 5: AGE */}
              <div>
                <label htmlFor="applicant_current_age_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Age (Years) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="applicant_current_age_field"
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Field 6: DEGREE (Select) */}
              <div>
                <label htmlFor="qualification_degree_select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Graduated Degree / Qualification <span className="text-rose-400">*</span>
                </label>
                <select
                  id="qualification_degree_select"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                >
                  <option value="">-- Select Degree --</option>
                  <option value="Bachelor of Engineering (B.E)">Bachelor of Engineering (B.E)</option>
                  <option value="Master of Technology (M.Tech)">Master of Technology (M.Tech)</option>
                  <option value="Bachelor of Science (B.Sc)">Bachelor of Science (B.Sc)</option>
                  <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                  <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech)</option>
                  <option value="Bachelor of Commerce (B.Com)">Bachelor of Commerce (B.Com)</option>
                </select>
              </div>

              {/* Field 7: WEIGHT */}
              <div>
                <label htmlFor="body_weight_kg_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Body Weight (kg)
                </label>
                <input
                  id="body_weight_kg_field"
                  name="weight"
                  type="text"
                  placeholder="e.g. 61.65"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Field 8: BLOOD GROUP (Select) */}
              <div>
                <label htmlFor="blood_group_select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Blood Group Type <span className="text-rose-400">*</span>
                </label>
                <select
                  id="blood_group_select"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                >
                  <option value="">-- Select Blood Group --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Field 9: INSTITUTE */}
              <div>
                <label htmlFor="institute_college_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  College / Institute Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="institute_college_field"
                  name="institute"
                  type="text"
                  placeholder="Institute Name"
                  value={formData.institute}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Field 10: MIDDLE INITIAL */}
              <div>
                <label htmlFor="middle_initial_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Middle Initial (M.I.)
                </label>
                <input
                  id="middle_initial_field"
                  name="middleInitial"
                  type="text"
                  maxLength={5}
                  placeholder="Initial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional, Company & Location Info */}
          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>Section 3 &bull; Location, Company Data & Registration Identifier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Field 11: CURRENT CITY */}
              <div>
                <label htmlFor="current_residence_city_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Current Residence City <span className="text-rose-400">*</span>
                </label>
                <input
                  id="current_residence_city_field"
                  name="currentCity"
                  type="text"
                  placeholder="City"
                  value={formData.currentCity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Field 12: STREAM */}
              <div>
                <label htmlFor="academic_stream_branch_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Major / Stream <span className="text-rose-400">*</span>
                </label>
                <input
                  id="academic_stream_branch_field"
                  name="stream"
                  type="text"
                  placeholder="Stream / Branch"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Field 13: WORK EXPERIENCE (Select) */}
              <div>
                <label htmlFor="work_experience_level_select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Work Experience Level <span className="text-rose-400">*</span>
                </label>
                <select
                  id="work_experience_level_select"
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                >
                  <option value="">-- Select Experience --</option>
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Experienced">Experienced</option>
                  <option value="Senior Management">Senior Management</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              {/* Field 14: AGE IN COMPANY */}
              <div>
                <label htmlFor="company_tenure_years_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Tenure (in Years)
                </label>
                <input
                  id="company_tenure_years_field"
                  name="ageInCompany"
                  type="number"
                  placeholder="Years"
                  value={formData.ageInCompany}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Field 15: REGISTER JOINING CODE */}
              <div>
                <label htmlFor="register_joining_code_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Joining Code / ID <span className="text-rose-400">*</span>
                </label>
                <input
                  id="register_joining_code_field"
                  name="joiningCode"
                  type="text"
                  placeholder="e.g. 611-87-6140"
                  value={formData.joiningCode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>

              {/* Field 16: REGION (Select) */}
              <div>
                <label htmlFor="geographic_region_select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Geographic Region / Zone <span className="text-rose-400">*</span>
                </label>
                <select
                  id="geographic_region_select"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                >
                  <option value="">-- Select Region --</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="Northeast">Northeast</option>
                  <option value="Central">Central</option>
                </select>
              </div>

              {/* Field 17: REGISTRATION NUMBER */}
              <div className="md:col-span-3">
                <label htmlFor="candidate_registration_number_field" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Registration Number / Roll # <span className="text-rose-400">*</span>
                </label>
                <input
                  id="candidate_registration_number_field"
                  name="registrationNumber"
                  type="text"
                  placeholder="e.g. 697294"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-indigo-500/50 text-indigo-300 font-mono font-bold text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Action & Human Review Reminder */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 px-3.5 py-2 rounded-lg border border-amber-800/40">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                Manual User Verification: Review all input fields and click Submit manually when satisfied.
              </span>
            </div>

            <button
              id="manual-form-submit-button"
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Manually Submit Form</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
);

InteractiveForm.displayName = 'InteractiveForm';
