-- Schema SQL pour les tables marketing dans Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Table des posts réseaux sociaux
CREATE TABLE IF NOT EXISTS marketing_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  networks TEXT[] NOT NULL,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  media_urls TEXT[] DEFAULT '{}',
  promotion_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Table des promotions
CREATE TABLE IF NOT EXISTS marketing_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  target_audience TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Table des campagnes Google AdWords
CREATE TABLE IF NOT EXISTS marketing_adwords_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  daily_budget DECIMAL(10, 2),
  total_budget DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'paused', 'completed')),
  ad_groups TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Table des sections de contenu (templates)
CREATE TABLE IF NOT EXISTS marketing_content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cta', 'promotion', 'announcement', 'custom')),
  content TEXT NOT NULL,
  template TEXT NOT NULL,
  preview_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Table des événements du calendrier
CREATE TABLE IF NOT EXISTS marketing_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  post_id UUID,
  promotion_id UUID,
  adwords_campaign_id UUID,
  networks TEXT[] NOT NULL DEFAULT '{}',
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_marketing_posts_status ON marketing_posts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_scheduled_at ON marketing_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_networks ON marketing_posts USING GIN(networks);

CREATE INDEX IF NOT EXISTS idx_marketing_promotions_status ON marketing_promotions(status);
CREATE INDEX IF NOT EXISTS idx_marketing_promotions_dates ON marketing_promotions(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_marketing_adwords_status ON marketing_adwords_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_adwords_dates ON marketing_adwords_campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_marketing_adwords_keywords ON marketing_adwords_campaigns USING GIN(keywords);

CREATE INDEX IF NOT EXISTS idx_marketing_content_sections_type ON marketing_content_sections(type);

CREATE INDEX IF NOT EXISTS idx_marketing_calendar_start_date ON marketing_calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_networks ON marketing_calendar_events USING GIN(networks);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_marketing_posts_updated_at BEFORE UPDATE ON marketing_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_promotions_updated_at BEFORE UPDATE ON marketing_promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_adwords_campaigns_updated_at BEFORE UPDATE ON marketing_adwords_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_content_sections_updated_at BEFORE UPDATE ON marketing_content_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_calendar_events_updated_at BEFORE UPDATE ON marketing_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

