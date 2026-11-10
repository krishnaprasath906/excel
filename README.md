# Excel AutoFill — Production Web Application & Extension

Excel AutoFill is a client-side web application and Chrome/Edge Manifest V3 extension that bridges Excel spreadsheets with web forms. It allows users to upload Excel records, search candidates by **Registration Number**, dynamically inspect all attributes, intelligently map fields to destination forms with NLP confidence scoring, and safely autofill forms across native HTML, React, Vue, and Angular frameworks with **strict human-in-the-loop manual submission enforcement**.

---

## 🚀 Key Features

1. **Client-Side Excel Processing (SheetJS / XLSX)**
   - 100% in-browser parsing for `.xlsx` and `.xls` files.
   - Zero-server transmission: personal records remain confidential and local.
   - Auto-detection of Registration Number columns (e.g. `Registration Number`, `Reg No`, `Roll No`, `Candidate ID`).

2. **Smart Lookup by Registration Number**
   - Exact matching with case and whitespace normalization.
   - Instant dynamic column resolution for 17+ fields without hardcoding.

3. **Intelligent NLP & Heuristic Field Matching Engine**
   - Multi-signal DOM detection: `<label for>`, `aria-label`, `aria-labelledby`, `placeholder`, `name`, `id`, adjacent text, `<select>` options, and `<input type="radio">` groups.
   - Text normalization (removing units like `(Years)` or `in Kgs.`, punctuation, casing).
   - Multi-domain synonyms dictionary and Levenshtein token similarity.
   - Confidence scoring:
     - **90–100%**: High confidence (Automatic 1-to-1 match)
     - **75–89%**: Medium confidence (Marked for review)
     - **< 75%**: Low confidence (Requires manual selection)
   - Manual override with instant field reassignment.
   - Per-domain mapping persistence in `localStorage`.

4. **Framework-Resilient Autofill Engine**
   - Compatible with **React, Next.js, Vue, and Angular** reactive state managers.
   - Native property descriptor setters (`HTMLInputElement.prototype`) + synthetic event dispatching (`focus`, `input`, `change`, `blur`).
   - Intelligent `<select>` dropdown option matching and radio button group selection.
   - Temporary visual glow animation on populated fields.

5. **Strict Safety & Submission Policy**
   - **NEVER** automatically clicks Submit, Save, Next, or triggers form actions.
   - Clear banner: *"Form filled successfully. Please review all information before manually submitting."*

6. **Triple Execution Architecture**
   - **In-App Live Scrambled Demo Form**: 17 fields in completely different order for instant testing.
   - **Universal One-Click Bookmarklet**: Zero-installation autofill for any web page.
   - **Chrome / Edge Manifest V3 Extension**: Cross-origin background script and popup.

---

## 🛠 Project Structure

```
excel-autofill/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with Dark mode and fonts
│   │   ├── page.tsx               # Main Dashboard with 6-step workflow
│   │   ├── demo-form/page.tsx     # 17-field test form with scrambled order
│   │   ├── history/page.tsx       # Autofill audit log & history
│   │   ├── mappings/page.tsx      # Saved domain field mappings
│   │   ├── extension/page.tsx     # Extension setup & Bookmarklet generator
│   │   └── globals.css            # Tailwind & glassmorphism styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   └── Header.tsx         # Quick actions and status header
│   │   ├── steps/
│   │   │   ├── Step1Upload.tsx    # Drag & drop upload + sample generator
│   │   │   ├── Step2Search.tsx    # Registration number lookup
│   │   │   ├── Step3Profile.tsx   # Dynamic profile card
│   │   │   ├── Step4FormLink.tsx  # Target URL validator & connector
│   │   │   ├── Step5Mapping.tsx   # Confidence scoring table & manual override
│   │   │   └── Step6Autofill.tsx  # Value preview & autofill trigger
│   │   └── demo/
│   │       └── InteractiveForm.tsx # 17-field test form in scrambled order
│   ├── excel/
│   │   ├── excelParser.ts         # SheetJS XLSX parser
│   │   ├── dataNormalizer.ts      # Normalization and string similarity
│   │   └── sampleDataGenerator.ts # Generates demo .xlsx dataset
│   ├── matching/
│   │   ├── synonyms.ts            # Multi-domain synonyms dictionary
│   │   ├── fieldDetector.ts       # DOM element inspector
│   │   └── fieldMatcher.ts        # Confidence scoring algorithm
│   ├── autofill/
│   │   ├── formFiller.ts          # Core framework autofill engine
│   │   ├── dropdownHandler.ts     # Select option matcher
│   │   └── radioHandler.ts        # Radio button group matcher
│   ├── validation/
│   │   └── validator.ts           # Pre-autofill data validation
│   ├── storage/
│   │   └── mappingStorage.ts      # LocalStorage & privacy wiper
│   ├── extension/
│   │   ├── manifest.json          # Manifest V3 configuration
│   │   ├── background.ts          # Service worker
│   │   ├── contentScript.ts       # Content script for web pages
│   │   └── popup.html             # Extension popup UI
│   └── types/
│       └── index.ts               # TypeScript interfaces
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🏃 Getting Started

### 1. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser.

### 2. Test Flow
1. Click **"Load Instant 17-Field Demo"** or upload your own `.xlsx` file.
2. Search for Registration Number **`697294`** (Krishna Prasad) and click **"Find Person"**.
3. Inspect all 17 dynamic fields in the profile card.
4. Connect to the built-in **Demo Form** (`/demo-form`).
5. Review the **Field Mapping** table with confidence scores.
6. Click **"START AUTOFILL"** and watch all 17 scrambled fields populate and highlight.
7. Verify the human review reminder banner and manually submit the form.

---

## 🔒 Security & Privacy

- All Excel parsing is performed **strictly inside your browser**.
- Personal data is never transmitted to any third-party servers or AI APIs.
- The **"Clear All Data"** button instantly purges in-memory records and session cache.
