-- ============================================================================
-- CASHFLOW BUDGET DATABASE SCHEMA
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DROP EXISTING TABLES (if they exist)
-- ============================================================================

DROP TABLE IF EXISTS cashflow_entries CASCADE;
DROP TABLE IF EXISTS budget_accounts CASCADE;
DROP TABLE IF EXISTS budget_groups CASCADE;

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- Create budget groups table
CREATE TABLE budget_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, user_id)
);

-- Create budget accounts table
CREATE TABLE budget_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  group_id UUID REFERENCES budget_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, group_id, user_id)
);

-- Create cashflow entries table
CREATE TABLE cashflow_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES budget_accounts(id) ON DELETE CASCADE,
  week INTEGER NOT NULL CHECK (week > 0 AND week <= 52),
  value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, week, user_id)
);

-- ============================================================================
-- CREATE INDICES
-- ============================================================================

-- Improve query performance for common access patterns
CREATE INDEX idx_budget_accounts_group_id ON budget_accounts(group_id);
CREATE INDEX idx_cashflow_entries_account_id ON cashflow_entries(account_id);
CREATE INDEX idx_cashflow_entries_week ON cashflow_entries(week);
CREATE INDEX idx_budget_groups_user_id ON budget_groups(user_id);
CREATE INDEX idx_budget_accounts_user_id ON budget_accounts(user_id);
CREATE INDEX idx_cashflow_entries_user_id ON cashflow_entries(user_id);

-- ============================================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Create function for setting updated_at
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update the updated_at column
CREATE TRIGGER set_budget_groups_updated_at
BEFORE UPDATE ON budget_groups
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER set_budget_accounts_updated_at
BEFORE UPDATE ON budget_accounts
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER set_cashflow_entries_updated_at
BEFORE UPDATE ON cashflow_entries
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE budget_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashflow_entries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- RLS policies for budget_groups
CREATE POLICY "Users can view their own groups" 
  ON budget_groups FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own groups" 
  ON budget_groups FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own groups" 
  ON budget_groups FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own groups" 
  ON budget_groups FOR DELETE USING (user_id = auth.uid());

-- RLS policies for budget_accounts
CREATE POLICY "Users can view their own accounts" 
  ON budget_accounts FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own accounts" 
  ON budget_accounts FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own accounts" 
  ON budget_accounts FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own accounts" 
  ON budget_accounts FOR DELETE USING (user_id = auth.uid());

-- RLS policies for cashflow_entries
CREATE POLICY "Users can view their own entries" 
  ON cashflow_entries FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own entries" 
  ON cashflow_entries FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own entries" 
  ON cashflow_entries FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own entries" 
  ON cashflow_entries FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- CREATE VIEWS
-- ============================================================================

-- View for complete cashflow data (groups, accounts, and entries)
CREATE OR REPLACE VIEW cashflow_complete AS
SELECT 
  g.id as group_id,
  g.name as group_name,
  a.id as account_id,
  a.name as account_name,
  e.id as entry_id,
  e.week,
  e.value,
  g.user_id
FROM budget_groups g
JOIN budget_accounts a ON g.id = a.group_id AND g.user_id = a.user_id
LEFT JOIN cashflow_entries e ON a.id = e.account_id AND a.user_id = e.user_id
WHERE g.user_id = auth.uid();

-- View for group totals
CREATE OR REPLACE VIEW group_weekly_totals AS
SELECT 
  g.id as group_id,
  g.name as group_name,
  e.week,
  SUM(e.value) as total_value,
  g.user_id
FROM budget_groups g
JOIN budget_accounts a ON g.id = a.group_id AND g.user_id = a.user_id
JOIN cashflow_entries e ON a.id = e.account_id AND a.user_id = e.user_id
WHERE g.user_id = auth.uid()
GROUP BY g.id, g.name, e.week, g.user_id;

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- This section requires the user's UUID to be inserted properly
-- Below is a template for inserting sample data - replace 'YOUR_USER_ID' with auth.uid() or an actual UUID

/*
-- Insert sample groups
INSERT INTO budget_groups (name, user_id) VALUES 
  ('Housing', 'YOUR_USER_ID'),
  ('Transportation', 'YOUR_USER_ID'),
  ('Food', 'YOUR_USER_ID'),
  ('Healthcare', 'YOUR_USER_ID'),
  ('Fun', 'YOUR_USER_ID'),
  ('Personal', 'YOUR_USER_ID'),
  ('Education', 'YOUR_USER_ID'),
  ('Savings', 'YOUR_USER_ID'),
  ('Income', 'YOUR_USER_ID'),
  ('Debt', 'YOUR_USER_ID');

-- For inserting sample accounts, first capture the group IDs from the previous inserts
DO $$
DECLARE
  housing_id UUID;
  transportation_id UUID;
  food_id UUID;
  healthcare_id UUID;
  fun_id UUID;
  personal_id UUID;
  education_id UUID;
  savings_id UUID;
  income_id UUID;
  debt_id UUID;
  rent_id UUID;
  utilities_id UUID;
  car_payment_id UUID;
  groceries_id UUID;
  user_id UUID := 'YOUR_USER_ID';
BEGIN
  -- Get the group IDs
  SELECT id INTO housing_id FROM budget_groups WHERE name = 'Housing' AND user_id = user_id;
  SELECT id INTO transportation_id FROM budget_groups WHERE name = 'Transportation' AND user_id = user_id;
  SELECT id INTO food_id FROM budget_groups WHERE name = 'Food' AND user_id = user_id;
  SELECT id INTO healthcare_id FROM budget_groups WHERE name = 'Healthcare' AND user_id = user_id;
  SELECT id INTO fun_id FROM budget_groups WHERE name = 'Fun' AND user_id = user_id;
  SELECT id INTO personal_id FROM budget_groups WHERE name = 'Personal' AND user_id = user_id;
  SELECT id INTO education_id FROM budget_groups WHERE name = 'Education' AND user_id = user_id;
  SELECT id INTO savings_id FROM budget_groups WHERE name = 'Savings' AND user_id = user_id;
  SELECT id INTO income_id FROM budget_groups WHERE name = 'Income' AND user_id = user_id;
  SELECT id INTO debt_id FROM budget_groups WHERE name = 'Debt' AND user_id = user_id;

  -- Insert Housing accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Rent', housing_id, user_id),
    ('Utilities', housing_id, user_id),
    ('Insurance', housing_id, user_id),
    ('Maintenance', housing_id, user_id),
    ('Property Tax', housing_id, user_id);

  -- Insert Transportation accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Car Payment', transportation_id, user_id),
    ('Gas', transportation_id, user_id),
    ('Insurance', transportation_id, user_id),
    ('Maintenance', transportation_id, user_id),
    ('Public Transit', transportation_id, user_id);

  -- Insert Food accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Groceries', food_id, user_id),
    ('Dining Out', food_id, user_id),
    ('Coffee Shops', food_id, user_id),
    ('Snacks', food_id, user_id);

  -- Insert Healthcare accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Insurance', healthcare_id, user_id),
    ('Medications', healthcare_id, user_id),
    ('Doctor Visits', healthcare_id, user_id),
    ('Dental Care', healthcare_id, user_id);

  -- Insert Fun accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Netflix', fun_id, user_id),
    ('Movies', fun_id, user_id),
    ('Hobbies', fun_id, user_id),
    ('Sports', fun_id, user_id);

  -- Insert Personal accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Clothing', personal_id, user_id),
    ('Hair Care', personal_id, user_id),
    ('Gym', personal_id, user_id),
    ('Personal Care', personal_id, user_id);

  -- Insert Education accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Tuition', education_id, user_id),
    ('Books', education_id, user_id),
    ('Supplies', education_id, user_id),
    ('Online Courses', education_id, user_id);

  -- Insert Savings accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Emergency Fund', savings_id, user_id),
    ('Retirement', savings_id, user_id),
    ('Investments', savings_id, user_id),
    ('Vacation Fund', savings_id, user_id);

  -- Insert Income accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Salary', income_id, user_id),
    ('Bonus', income_id, user_id),
    ('Side Gig', income_id, user_id),
    ('Investments', income_id, user_id),
    ('Rental Income', income_id, user_id);

  -- Insert Debt accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Credit Card', debt_id, user_id),
    ('Student Loans', debt_id, user_id),
    ('Personal Loan', debt_id, user_id),
    ('Line of Credit', debt_id, user_id);

  -- Get the account IDs for some sample entries
  SELECT id INTO rent_id FROM budget_accounts WHERE name = 'Rent' AND group_id = housing_id AND user_id = user_id;
  SELECT id INTO utilities_id FROM budget_accounts WHERE name = 'Utilities' AND group_id = housing_id AND user_id = user_id;
  SELECT id INTO car_payment_id FROM budget_accounts WHERE name = 'Car Payment' AND group_id = transportation_id AND user_id = user_id;
  SELECT id INTO groceries_id FROM budget_accounts WHERE name = 'Groceries' AND group_id = food_id AND user_id = user_id;

  -- Insert some cashflow entries
  INSERT INTO cashflow_entries (account_id, week, value, user_id) VALUES
    (rent_id, 1, 1200, user_id),
    (rent_id, 2, 1200, user_id),
    (utilities_id, 1, 150, user_id),
    (utilities_id, 2, 175, user_id),
    (car_payment_id, 1, 350, user_id),
    (car_payment_id, 5, 350, user_id),
    (groceries_id, 1, 120, user_id),
    (groceries_id, 2, 135, user_id);
END $$;
*/

-- ============================================================================
-- A FUNCTION TO GENERATE SAMPLE DATA FOR THE CURRENT USER
-- ============================================================================

CREATE OR REPLACE FUNCTION populate_sample_data_for_current_user()
RETURNS VOID AS $$
DECLARE
  housing_id UUID;
  transportation_id UUID;
  food_id UUID;
  healthcare_id UUID;
  fun_id UUID;
  personal_id UUID;
  education_id UUID;
  savings_id UUID;
  income_id UUID;
  debt_id UUID;
  rent_id UUID;
  utilities_id UUID;
  car_payment_id UUID;
  groceries_id UUID;
  netflix_id UUID;
  gym_id UUID;
  emergency_fund_id UUID;
  retirement_id UUID;
  salary_id UUID;
  credit_card_id UUID;
  student_loans_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be authenticated to run this function';
  END IF;

  -- Insert sample groups
  INSERT INTO budget_groups (name, user_id) VALUES 
    ('Housing', current_user_id),
    ('Transportation', current_user_id),
    ('Food', current_user_id),
    ('Healthcare', current_user_id),
    ('Fun', current_user_id),
    ('Personal', current_user_id),
    ('Education', current_user_id),
    ('Savings', current_user_id),
    ('Income', current_user_id),
    ('Debt', current_user_id);

  -- Get the group IDs
  SELECT id INTO housing_id FROM budget_groups WHERE name = 'Housing' AND user_id = current_user_id;
  SELECT id INTO transportation_id FROM budget_groups WHERE name = 'Transportation' AND user_id = current_user_id;
  SELECT id INTO food_id FROM budget_groups WHERE name = 'Food' AND user_id = current_user_id;
  SELECT id INTO healthcare_id FROM budget_groups WHERE name = 'Healthcare' AND user_id = current_user_id;
  SELECT id INTO fun_id FROM budget_groups WHERE name = 'Fun' AND user_id = current_user_id;
  SELECT id INTO personal_id FROM budget_groups WHERE name = 'Personal' AND user_id = current_user_id;
  SELECT id INTO education_id FROM budget_groups WHERE name = 'Education' AND user_id = current_user_id;
  SELECT id INTO savings_id FROM budget_groups WHERE name = 'Savings' AND user_id = current_user_id;
  SELECT id INTO income_id FROM budget_groups WHERE name = 'Income' AND user_id = current_user_id;
  SELECT id INTO debt_id FROM budget_groups WHERE name = 'Debt' AND user_id = current_user_id;

  -- Insert Housing accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Rent', housing_id, current_user_id),
    ('Utilities', housing_id, current_user_id),
    ('Insurance', housing_id, current_user_id),
    ('Maintenance', housing_id, current_user_id),
    ('Property Tax', housing_id, current_user_id);

  -- Insert Transportation accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Car Payment', transportation_id, current_user_id),
    ('Gas', transportation_id, current_user_id),
    ('Insurance', transportation_id, current_user_id),
    ('Maintenance', transportation_id, current_user_id),
    ('Public Transit', transportation_id, current_user_id);

  -- Insert Food accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Groceries', food_id, current_user_id),
    ('Dining Out', food_id, current_user_id),
    ('Coffee Shops', food_id, current_user_id),
    ('Snacks', food_id, current_user_id);

  -- Insert Healthcare accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Insurance', healthcare_id, current_user_id),
    ('Medications', healthcare_id, current_user_id),
    ('Doctor Visits', healthcare_id, current_user_id),
    ('Dental Care', healthcare_id, current_user_id);

  -- Insert Fun accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Netflix', fun_id, current_user_id),
    ('Movies', fun_id, current_user_id),
    ('Hobbies', fun_id, current_user_id),
    ('Sports', fun_id, current_user_id);

  -- Insert Personal accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Clothing', personal_id, current_user_id),
    ('Hair Care', personal_id, current_user_id),
    ('Gym', personal_id, current_user_id),
    ('Personal Care', personal_id, current_user_id);

  -- Insert Education accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Tuition', education_id, current_user_id),
    ('Books', education_id, current_user_id),
    ('Supplies', education_id, current_user_id),
    ('Online Courses', education_id, current_user_id);

  -- Insert Savings accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Emergency Fund', savings_id, current_user_id),
    ('Retirement', savings_id, current_user_id),
    ('Investments', savings_id, current_user_id),
    ('Vacation Fund', savings_id, current_user_id);

  -- Insert Income accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Salary', income_id, current_user_id),
    ('Bonus', income_id, current_user_id),
    ('Side Gig', income_id, current_user_id),
    ('Investments', income_id, current_user_id),
    ('Rental Income', income_id, current_user_id);

  -- Insert Debt accounts
  INSERT INTO budget_accounts (name, group_id, user_id) VALUES 
    ('Credit Card', debt_id, current_user_id),
    ('Student Loans', debt_id, current_user_id),
    ('Personal Loan', debt_id, current_user_id),
    ('Line of Credit', debt_id, current_user_id);

  -- Get some account IDs for entries
  SELECT id INTO rent_id FROM budget_accounts WHERE name = 'Rent' AND group_id = housing_id AND user_id = current_user_id;
  SELECT id INTO utilities_id FROM budget_accounts WHERE name = 'Utilities' AND group_id = housing_id AND user_id = current_user_id;
  SELECT id INTO car_payment_id FROM budget_accounts WHERE name = 'Car Payment' AND group_id = transportation_id AND user_id = current_user_id;
  SELECT id INTO groceries_id FROM budget_accounts WHERE name = 'Groceries' AND group_id = food_id AND user_id = current_user_id;
  SELECT id INTO netflix_id FROM budget_accounts WHERE name = 'Netflix' AND group_id = fun_id AND user_id = current_user_id;
  SELECT id INTO gym_id FROM budget_accounts WHERE name = 'Gym' AND group_id = personal_id AND user_id = current_user_id;
  SELECT id INTO emergency_fund_id FROM budget_accounts WHERE name = 'Emergency Fund' AND group_id = savings_id AND user_id = current_user_id;
  SELECT id INTO retirement_id FROM budget_accounts WHERE name = 'Retirement' AND group_id = savings_id AND user_id = current_user_id;
  SELECT id INTO salary_id FROM budget_accounts WHERE name = 'Salary' AND group_id = income_id AND user_id = current_user_id;
  SELECT id INTO credit_card_id FROM budget_accounts WHERE name = 'Credit Card' AND group_id = debt_id AND user_id = current_user_id;
  SELECT id INTO student_loans_id FROM budget_accounts WHERE name = 'Student Loans' AND group_id = debt_id AND user_id = current_user_id;

  -- Insert cashflow entries
  INSERT INTO cashflow_entries (account_id, week, value, user_id) VALUES
    -- Housing
    (rent_id, 1, 1200, current_user_id),
    (rent_id, 2, 1200, current_user_id),
    (utilities_id, 1, 150, current_user_id),
    (utilities_id, 2, 175, current_user_id),
    
    -- Transportation
    (car_payment_id, 1, 350, current_user_id),
    (car_payment_id, 5, 350, current_user_id),
    
    -- Food
    (groceries_id, 1, 120, current_user_id),
    (groceries_id, 2, 135, current_user_id),
    
    -- Fun
    (netflix_id, 1, 15, current_user_id),
    
    -- Personal
    (gym_id, 1, 50, current_user_id),
    
    -- Savings
    (emergency_fund_id, 1, 200, current_user_id),
    (retirement_id, 1, 400, current_user_id),
    
    -- Income
    (salary_id, 1, 2000, current_user_id),
    (salary_id, 3, 2000, current_user_id),
    
    -- Debt
    (credit_card_id, 2, 250, current_user_id),
    (student_loans_id, 1, 325, current_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 