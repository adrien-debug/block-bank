-- Schéma complet pour Block Bank - Toutes les tables avec relations
-- Date : 2025-12-05

-- ============================================
-- 1. TABLE CREDIT_SCORES
-- ============================================
CREATE TABLE IF NOT EXISTS credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000),
  tier VARCHAR(2) NOT NULL CHECK (tier IN ('A+', 'A', 'B', 'C', 'D')),
  on_chain_score INTEGER DEFAULT 0 CHECK (on_chain_score >= 0 AND on_chain_score <= 350),
  off_chain_score INTEGER DEFAULT 0 CHECK (off_chain_score >= 0 AND off_chain_score <= 300),
  assets_score INTEGER DEFAULT 0 CHECK (assets_score >= 0 AND assets_score <= 200),
  reputation_score INTEGER DEFAULT 0 CHECK (reputation_score >= 0 AND reputation_score <= 150),
  previous_score INTEGER,
  nft_token_id VARCHAR(255),
  nft_contract_address VARCHAR(42),
  model_version VARCHAR(20) DEFAULT 'v2.1',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  data_hash VARCHAR(255),
  kyc_verified BOOLEAN DEFAULT false,
  aml_verified BOOLEAN DEFAULT false,
  verification_level VARCHAR(20) DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_score ON credit_scores(score);
CREATE INDEX IF NOT EXISTS idx_credit_scores_tier ON credit_scores(tier);

-- ============================================
-- 2. TABLE NFT_ASSETS (sans foreign key vers loans pour l'instant)
-- ============================================
CREATE TABLE IF NOT EXISTS nft_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_id VARCHAR(255) NOT NULL,
  contract_address VARCHAR(42) NOT NULL,
  type VARCHAR(50) NOT NULL,
  asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('REAL_ESTATE', 'VEHICLE', 'COLLECTIBLE', 'MINING', 'INFRASTRUCTURE', 'OTHER')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  current_value DECIMAL(18, 2),
  original_value DECIMAL(18, 2),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'locked')),
  locked_in_loan_id UUID,
  risk_class VARCHAR(20) DEFAULT 'MODERATE' CHECK (risk_class IN ('SAFE', 'MODERATE', 'RISKY')),
  risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
  marketplace VARCHAR(50),
  spv_name VARCHAR(255),
  spv_jurisdiction VARCHAR(100),
  spv_registration_number VARCHAR(100),
  spv_legal_form VARCHAR(100),
  metadata_location VARCHAR(255),
  metadata_size VARCHAR(100),
  metadata_year_built INTEGER,
  metadata_condition VARCHAR(50),
  metadata_documentation_hash VARCHAR(255),
  metadata_inspection_date DATE,
  metadata_maintenance_history TEXT[],
  metadata_uri TEXT,
  image_uri TEXT,
  owner_address VARCHAR(42),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nft_assets_user_id ON nft_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_nft_assets_token_id ON nft_assets(token_id);
CREATE INDEX IF NOT EXISTS idx_nft_assets_contract_address ON nft_assets(contract_address);
CREATE INDEX IF NOT EXISTS idx_nft_assets_status ON nft_assets(status);
-- ============================================
-- 3. TABLE LOANS
-- ============================================
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  loan_number VARCHAR(50) UNIQUE NOT NULL,
  nft_asset_id UUID REFERENCES nft_assets(id) ON DELETE SET NULL,
  amount DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  ltv DECIMAL(5, 2) NOT NULL CHECK (ltv >= 0 AND ltv <= 100),
  rate DECIMAL(5, 2) NOT NULL CHECK (rate >= 0),
  term_months INTEGER NOT NULL CHECK (term_months > 0),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'default', 'liquidated', 'closed')),
  profile VARCHAR(20) DEFAULT 'BALANCED' CHECK (profile IN ('SAFE', 'BALANCED', 'MAX_LEVERAGE')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  next_payment_date DATE,
  next_payment_amount DECIMAL(18, 2),
  remaining_balance DECIMAL(18, 2) NOT NULL,
  total_paid DECIMAL(18, 2) DEFAULT 0,
  monthly_payment DECIMAL(18, 2) NOT NULL,
  down_payment DECIMAL(18, 2) DEFAULT 0,
  days_until_due INTEGER,
  tx_hash VARCHAR(66),
  block_number BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_loan_number ON loans(loan_number);
CREATE INDEX IF NOT EXISTS idx_loans_nft_asset_id ON loans(nft_asset_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);

-- Ajouter la foreign key pour locked_in_loan_id après création de loans
ALTER TABLE nft_assets 
  ADD CONSTRAINT fk_nft_assets_locked_in_loan 
  FOREIGN KEY (locked_in_loan_id) 
  REFERENCES loans(id) 
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_nft_assets_locked_in_loan_id ON nft_assets(locked_in_loan_id);

-- ============================================
-- 4. TABLE PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  tx_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_loan_id ON payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- ============================================
-- 5. TABLE INSURANCE_POLICIES
-- ============================================
CREATE TABLE IF NOT EXISTS insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  policy_number VARCHAR(50) UNIQUE NOT NULL,
  loan_number VARCHAR(50) NOT NULL,
  loan_amount DECIMAL(18, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  renewal_date DATE,
  borrower_default_coverage INTEGER DEFAULT 0 CHECK (borrower_default_coverage IN (0, 50, 75, 100)),
  market_risk_coverage INTEGER DEFAULT 0 CHECK (market_risk_coverage IN (0, 50, 75)),
  asset_risk_coverage INTEGER DEFAULT 0 CHECK (asset_risk_coverage IN (0, 50, 75)),
  operational_risk_coverage INTEGER DEFAULT 0 CHECK (operational_risk_coverage IN (0, 50, 75)),
  legal_risk_coverage INTEGER DEFAULT 0 CHECK (legal_risk_coverage IN (0, 50, 75)),
  total_coverage INTEGER NOT NULL CHECK (total_coverage >= 0 AND total_coverage <= 100),
  annual_premium DECIMAL(18, 2) NOT NULL,
  monthly_premium DECIMAL(18, 2) NOT NULL,
  credit_tier VARCHAR(2) NOT NULL CHECK (credit_tier IN ('A+', 'A', 'B', 'C', 'D')),
  nft_risk_class VARCHAR(20) DEFAULT 'MODERATE' CHECK (nft_risk_class IN ('SAFE', 'MODERATE', 'RISKY')),
  impact_on_ltv DECIMAL(5, 2) DEFAULT 0,
  impact_on_rate DECIMAL(5, 2) DEFAULT 0,
  covered_risks TEXT[],
  tx_hash VARCHAR(66),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insurance_policies_user_id ON insurance_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_insurance_policies_loan_id ON insurance_policies(loan_id);
CREATE INDEX IF NOT EXISTS idx_insurance_policies_status ON insurance_policies(status);

-- ============================================
-- 6. TABLE INSURANCE_CLAIMS
-- ============================================
CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  claim_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('BORROWER_DEFAULT', 'MARKET_RISK', 'ASSET_RISK', 'OPERATIONAL_RISK', 'LEGAL_RISK')),
  amount DECIMAL(18, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  submitted_date DATE NOT NULL,
  processed_date DATE,
  description TEXT NOT NULL,
  evidence TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insurance_claims_policy_id ON insurance_claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_loan_id ON insurance_claims(loan_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- ============================================
-- 7. TABLE INSURANCE_HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS insurance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES insurance_policies(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE SET NULL,
  entry_type VARCHAR(50) NOT NULL CHECK (entry_type IN ('CREATED', 'RENEWED', 'CANCELLED', 'CLAIM_SUBMITTED', 'CLAIM_APPROVED', 'CLAIM_PAID')),
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT NOT NULL,
  amount DECIMAL(18, 2),
  currency VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insurance_history_policy_id ON insurance_history(policy_id);
CREATE INDEX IF NOT EXISTS idx_insurance_history_claim_id ON insurance_history(claim_id);

-- ============================================
-- 8. TABLE CREDIT_SCORE_PARTNERS
-- ============================================
CREATE TABLE IF NOT EXISTS credit_score_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_name VARCHAR(100) NOT NULL,
  authorized BOOLEAN DEFAULT false,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  read_score BOOLEAN DEFAULT false,
  read_metadata BOOLEAN DEFAULT false,
  read_full_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_credit_score_partners_user_id ON credit_score_partners(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_score_partners_platform ON credit_score_partners(platform);

-- ============================================
-- TRIGGERS POUR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_credit_scores_updated_at BEFORE UPDATE ON credit_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nft_assets_updated_at BEFORE UPDATE ON nft_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_score_partners_updated_at BEFORE UPDATE ON credit_score_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTAIRES
-- ============================================
COMMENT ON TABLE credit_scores IS 'Scores de crédit des utilisateurs';
COMMENT ON TABLE nft_assets IS 'NFT RWA (Real World Assets) tokenisés';
COMMENT ON TABLE loans IS 'Prêts accordés aux utilisateurs';
COMMENT ON TABLE payments IS 'Paiements effectués pour les prêts';
COMMENT ON TABLE insurance_policies IS 'Polices d''assurance pour les prêts';
COMMENT ON TABLE insurance_claims IS 'Réclamations d''assurance';
COMMENT ON TABLE insurance_history IS 'Historique des polices d''assurance';
COMMENT ON TABLE credit_score_partners IS 'Accès des partenaires aux scores de crédit';

