-- First check if the problematic table exists, and if not, handle it gracefully
DO $$
BEGIN
    -- Drop policies on cashflow_cells only if the table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cashflow_cells') THEN
        DROP POLICY IF EXISTS "Users can view cells for their own rows" ON cashflow_cells;
        DROP POLICY IF EXISTS "Users can insert cells for their own rows" ON cashflow_cells;
        DROP POLICY IF EXISTS "Users can update cells for their own rows" ON cashflow_cells;
        DROP POLICY IF EXISTS "Users can delete cells for their own rows" ON cashflow_cells;
    END IF;
END
$$;

-- Now update the populate_sample_data_for_current_user function to make sure it has no ambiguous column references
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

-- Update views to prevent ambiguous user_id references
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