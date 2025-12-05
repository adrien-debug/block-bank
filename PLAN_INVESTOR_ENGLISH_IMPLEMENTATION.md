# Plan: Investor Section - English Translation & Full Implementation

## Overview
Complete implementation plan to:
1. Translate all investor-related content to English
2. Align APY values with the detailed proposal document
3. Add "Detailed Proposal" section
4. Implement interactive calculations

## Current State Analysis

### Document Status
- ✅ `PROPOSITION_INVESTISSEURS_DETAILLEE.md` exists (French, 600+ lines)
- ❌ No English version exists

### Component Status
- ✅ `components/dashboard/Investor.tsx` exists with 4 tabs
- ⚠️ Mixed French/English content
- ⚠️ APY values don't match document
- ❌ No "Detailed Proposal" tab
- ❌ No interactive calculators

### Value Discrepancies
| Pool | Tranche | Document | Current | Action |
|------|---------|----------|---------|--------|
| USDC | Senior | 8.0% | 8.5% | Update to 8.0% |
| USDC | Junior | 18.5% | 18.0% | Update to 18.5% |
| USDT | Senior | 8.5% | 9.0% | Update to 8.5% |
| USDT | Mezzanine | 13.0% | 13.5% | Update to 13.0% |
| USDT | Junior | 20.0% | 20.5% | Update to 20.0% |
| DAI | Junior | 17.0% | 16.5% | Update to 17.0% |

## Implementation Plan

### Phase 1: Create English Document
**File:** `INVESTOR_PROPOSAL_DETAILED.md`

**Tasks:**
1. Translate entire `PROPOSITION_INVESTISSEURS_DETAILLEE.md` to English
2. Maintain all structure, tables, formulas
3. Keep all numerical values identical
4. Translate section headers, descriptions, examples

**Sections to translate:**
- Executive Summary
- Market Analysis
- Interest Rate Structure (APY)
- Fee Structure
- Net APR Calculation
- Margin Analysis
- Performance Scenarios
- Competition Comparison
- Strategic Recommendations
- Numerical Examples
- Calculation Formulas
- Appendices

### Phase 2: Translate Investor Component
**File:** `components/dashboard/Investor.tsx`

**Translation tasks:**
1. Translate all French strings to English:
   - "Investisseur" → "Investor"
   - "Financez les pools..." → "Fund liquidity pools..."
   - "Mes investissements" → "My Investments"
   - "Informations investisseur" → "Investor Information"
   - All descriptions, labels, buttons

2. Update helper functions:
   - `getRiskLabel()`: "Faible/Moyen/Élevé" → "Low/Medium/High"
   - `getStatusLabel()`: "Actif/Verrouillé/Maturé/Retiré" → "Active/Locked/Matured/Withdrawn"
   - `getPoolTypeLabel()`: "Pool Institutionnel" → "Institutional Pool"

3. Translate all UI text:
   - Modal titles and content
   - Form labels
   - Button text
   - Info section content
   - Error messages

### Phase 3: Align Values with Document
**File:** `components/dashboard/Investor.tsx`

**Update pool data:**
1. USDC Pool:
   - Senior: APY 8.5% → 8.0%, lossAbsorption 0% (already correct)
   - Mezzanine: APY 12.5% (already correct), lossAbsorption 20% (already correct)
   - Junior: APY 18.0% → 18.5%, lossAbsorption 100% (already correct)

2. USDT Pool:
   - Senior: APY 9.0% → 8.5%
   - Mezzanine: APY 13.5% → 13.0%, lossAbsorption 25% (already correct)
   - Junior: APY 20.5% → 20.0%

3. DAI Pool:
   - Senior: APY 7.5% (already correct)
   - Mezzanine: APY 11.8% (already correct), lossAbsorption 15% (already correct)
   - Junior: APY 16.5% → 17.0%

4. Update descriptions to match document:
   - Senior: "Secure senior tranche, low loss probability"
   - Mezzanine: "Higher yield with moderate risk"
   - Junior: "Maximum premium capture, absorbs first losses"

### Phase 4: Add Detailed Proposal Tab
**File:** `components/dashboard/Investor.tsx`

**New tab:** `'detailed-proposal'`

**Implementation:**
1. Add new tab to tabs array:
   ```typescript
   { id: 'detailed-proposal' as InvestorTab, label: 'Detailed Proposal', icon: DocumentIcon }
   ```

2. Create new section component with:
   - Table of contents (scrollable navigation)
   - All sections from document:
     - Executive Summary
     - Market Analysis (with comparison tables)
     - APY Structure (detailed tables)
     - Fee Structure (with examples)
     - Net APR Calculation (with formulas)
     - Margin Analysis
     - Performance Scenarios (Normal/Stress/Extreme)
     - Competition Comparison
     - Strategic Recommendations
     - Numerical Examples
     - Calculation Formulas
     - Appendices

3. Style with:
   - Collapsible sections
   - Tables with proper formatting
   - Formula blocks with syntax highlighting
   - Charts/graphs for scenarios (optional)

### Phase 5: Interactive Calculators
**File:** `components/dashboard/Investor.tsx` or new component

**Calculator 1: Net APR Calculator**
- Inputs: Pool, Tranche, Investment Amount, Duration
- Calculate:
  - Gross APY (from pool data)
  - Management Fee (0.5% annual)
  - Performance Fee (10% on excess, if applicable)
  - Withdrawal Fee (0-1% based on conditions)
  - Net APR result
- Display breakdown with formula

**Calculator 2: Return Simulator**
- Inputs: Investment Amount, Tranche, Duration, Scenario (Normal/Stress/Extreme)
- Calculate:
  - Expected returns per scenario
  - Loss absorption impact
  - Final net return
- Display comparison table

**Calculator 3: Fee Calculator**
- Inputs: Investment Amount, Duration, Early Withdrawal (yes/no)
- Calculate:
  - Deposit fee (0% or 0.1% if < 1000)
  - Management fee (0.5% annual, prorated)
  - Performance fee (if applicable)
  - Withdrawal fee (0%, 0.5%, or 1%)
  - Total fees
  - Net amount received

**UI Implementation:**
- Add calculator section in "Info" tab or new "Calculators" tab
- Interactive forms with real-time calculations
- Visual breakdown charts
- Export results option

### Phase 6: Additional Features

**Fee Structure Display:**
- Add fee information cards in pool details
- Show fee breakdown in deposit modal
- Display fee impact in investment cards

**Performance Scenarios Visualization:**
- Add scenario comparison charts
- Show impact on each tranche
- Visual risk/reward indicators

**Document Integration:**
- Link to full document (PDF export option)
- Print-friendly version
- Download detailed proposal

## File Structure

```
components/dashboard/Investor.tsx (updated)
├── Translation to English
├── Value alignment
├── New "Detailed Proposal" tab
└── Interactive calculators

INVESTOR_PROPOSAL_DETAILED.md (new)
└── Complete English translation

lib/utils/investmentCalculations.ts (new)
├── calculateNetAPR()
├── calculateReturns()
├── calculateFees()
└── simulateScenario()

types/investor.ts (new/update)
├── FeeStructure
├── ScenarioType
└── CalculationResult
```

## Testing Checklist

- [ ] All French text translated to English
- [ ] All APY values match document
- [ ] Detailed Proposal tab displays correctly
- [ ] Calculators produce correct results
- [ ] Formulas match document
- [ ] Tables render properly
- [ ] Mobile responsive
- [ ] Print/export functions work

## Estimated Effort

- Phase 1 (Document): 2-3 hours
- Phase 2 (Translation): 2-3 hours
- Phase 3 (Value Alignment): 30 minutes
- Phase 4 (Detailed Proposal Tab): 3-4 hours
- Phase 5 (Calculators): 4-5 hours
- Phase 6 (Additional Features): 2-3 hours

**Total:** ~14-18 hours


