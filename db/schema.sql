-- Agency Pulse Database Schema

-- 1. Roles Enum
CREATE TYPE user_role AS ENUM ('owner', 'hr', 'manager', 'employee');

-- 2. Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role user_role DEFAULT 'employee' NOT NULL,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Evaluation Questions Table
CREATE TABLE public.evaluation_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- 4. Evaluations Table (Ratings from Managers)
CREATE TABLE public.evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manager_id UUID REFERENCES public.profiles(id) NOT NULL,
    employee_id UUID REFERENCES public.profiles(id) NOT NULL,
    question_id UUID REFERENCES public.evaluation_questions(id) NOT NULL,
    score NUMERIC(3,1) CHECK (score >= 1.0 AND score <= 5.0),
    period DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Feedback Table (Anonymous/Named Comments)
CREATE TABLE public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES public.profiles(id), -- Null if anonymous
    department TEXT NOT NULL, -- Always required
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Users can view their own profile. Owner/HR can view all.
CREATE POLICY "Profiles visibility" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'hr'))
    );

-- Feedback: Anyone authenticated can insert. Only Owner/HR can read.
CREATE POLICY "Feedback submission" ON public.feedback
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Feedback visibility" ON public.feedback
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'hr'))
    );

-- Evaluation Questions: HR can manage. Everyone can read.
CREATE POLICY "Questions visibility" ON public.evaluation_questions
    FOR SELECT USING (true);

CREATE POLICY "Questions management" ON public.evaluation_questions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hr')
    );

-- Evaluations: Managers can see/add for their department. Owner/HR see all.
CREATE POLICY "Evaluations access" ON public.evaluations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'hr')) OR
        manager_id = auth.uid()
    );
