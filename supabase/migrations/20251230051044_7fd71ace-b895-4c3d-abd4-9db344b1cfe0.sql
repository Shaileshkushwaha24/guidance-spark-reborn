-- Create career_paths table with all required fields
CREATE TABLE public.career_paths (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Technology', 'Analytics', 'Design', 'Management', 'Healthcare', 'Finance', 'Education', 'Marketing')),
    short_description TEXT NOT NULL,
    full_description TEXT,
    salary_min NUMERIC NOT NULL CHECK (salary_min >= 0),
    salary_max NUMERIC NOT NULL CHECK (salary_max >= salary_min),
    growth_rate TEXT NOT NULL CHECK (growth_rate IN ('Low Growth', 'Moderate Growth', 'High Growth', 'Very High Growth')),
    skills TEXT[] NOT NULL DEFAULT '{}',
    education_required TEXT,
    experience_level TEXT CHECK (experience_level IN ('Entry Level', 'Mid Level', 'Senior Level', 'Expert')),
    tools_technologies TEXT[] DEFAULT '{}',
    demand_score INTEGER CHECK (demand_score >= 1 AND demand_score <= 10),
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for fast search and filtering
CREATE INDEX idx_career_paths_category ON public.career_paths(category);
CREATE INDEX idx_career_paths_is_active ON public.career_paths(is_active);
CREATE INDEX idx_career_paths_skills ON public.career_paths USING GIN(skills);
CREATE INDEX idx_career_paths_growth_rate ON public.career_paths(growth_rate);
CREATE INDEX idx_career_paths_demand_score ON public.career_paths(demand_score);

-- Enable RLS
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

-- Public can view active careers (no auth required for browsing)
CREATE POLICY "Anyone can view active careers"
ON public.career_paths
FOR SELECT
USING (is_active = true);

-- Admins can manage all careers
CREATE POLICY "Admins can manage careers"
ON public.career_paths
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_career_paths_updated_at
BEFORE UPDATE ON public.career_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for careers
INSERT INTO public.career_paths (title, category, short_description, full_description, salary_min, salary_max, growth_rate, skills, education_required, experience_level, tools_technologies, demand_score, icon) VALUES
(
    'Software Engineer',
    'Technology',
    'Design, develop, and maintain software applications and systems that power modern technology.',
    'Software Engineers are the architects of the digital world. They design, develop, test, and maintain software applications ranging from mobile apps to enterprise systems. This role requires strong problem-solving skills, proficiency in multiple programming languages, and the ability to work in agile teams.',
    600000,
    2500000,
    'Very High Growth',
    ARRAY['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Problem Solving', 'System Design'],
    'B.Tech/B.E. in Computer Science or related field',
    'Entry Level',
    ARRAY['VS Code', 'GitHub', 'Docker', 'AWS', 'Jira', 'Postman'],
    10,
    'Code'
),
(
    'Data Scientist',
    'Analytics',
    'Extract insights from complex datasets using statistical analysis and machine learning techniques.',
    'Data Scientists combine statistics, mathematics, and programming to analyze complex datasets and extract actionable insights. They build predictive models, create visualizations, and help organizations make data-driven decisions. This field is rapidly growing with applications in healthcare, finance, and technology.',
    800000,
    3000000,
    'Very High Growth',
    ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Data Visualization', 'Deep Learning'],
    'M.Tech/MS in Data Science, Statistics, or related field',
    'Mid Level',
    ARRAY['Jupyter', 'Pandas', 'Scikit-learn', 'Tableau', 'Power BI', 'Spark'],
    9,
    'BarChart3'
),
(
    'UX Designer',
    'Design',
    'Create intuitive and delightful user experiences through research, prototyping, and visual design.',
    'UX Designers focus on creating meaningful and relevant experiences for users. They conduct user research, create wireframes and prototypes, and work closely with developers to implement designs. The role requires a blend of creativity, empathy, and analytical thinking to solve complex user problems.',
    500000,
    2000000,
    'High Growth',
    ARRAY['Figma', 'User Research', 'Prototyping', 'Wireframing', 'UI Design', 'Design Thinking', 'Usability Testing'],
    'Bachelor''s in Design, HCI, or related field',
    'Entry Level',
    ARRAY['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Miro', 'Hotjar'],
    8,
    'Palette'
),
(
    'Product Manager',
    'Management',
    'Lead cross-functional teams to define, build, and launch products that solve real user problems.',
    'Product Managers are responsible for the strategy, roadmap, and feature definition of a product. They work at the intersection of business, technology, and user experience. PMs gather requirements, prioritize features, and coordinate with engineering, design, and marketing teams to deliver successful products.',
    1000000,
    4000000,
    'High Growth',
    ARRAY['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'A/B Testing'],
    'MBA or Bachelor''s with relevant experience',
    'Mid Level',
    ARRAY['Jira', 'Confluence', 'Mixpanel', 'Amplitude', 'Notion', 'Slack'],
    9,
    'Briefcase'
),
(
    'DevOps Engineer',
    'Technology',
    'Bridge development and operations to enable continuous delivery and infrastructure automation.',
    'DevOps Engineers automate and streamline the software development lifecycle. They manage CI/CD pipelines, cloud infrastructure, and monitoring systems. This role requires expertise in automation, cloud platforms, and a deep understanding of both development and operations practices.',
    700000,
    2800000,
    'Very High Growth',
    ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Python', 'Monitoring'],
    'B.Tech in Computer Science or IT',
    'Mid Level',
    ARRAY['Jenkins', 'GitLab CI', 'Ansible', 'Prometheus', 'Grafana', 'ELK Stack'],
    9,
    'Server'
),
(
    'Business Analyst',
    'Analytics',
    'Analyze business processes and requirements to drive organizational improvements and digital transformation.',
    'Business Analysts serve as the bridge between business stakeholders and technical teams. They analyze business processes, gather requirements, and translate them into technical specifications. BAs play a crucial role in digital transformation initiatives and process optimization.',
    500000,
    1800000,
    'High Growth',
    ARRAY['Requirements Analysis', 'SQL', 'Excel', 'Process Mapping', 'Stakeholder Communication', 'Agile', 'Documentation'],
    'Bachelor''s in Business, IT, or related field',
    'Entry Level',
    ARRAY['Excel', 'Visio', 'Power BI', 'SQL', 'Jira', 'Confluence'],
    7,
    'TrendingUp'
),
(
    'Cybersecurity Analyst',
    'Technology',
    'Protect organizations from cyber threats through security monitoring, analysis, and incident response.',
    'Cybersecurity Analysts protect organizations from digital threats. They monitor networks for security breaches, investigate incidents, and implement security measures. With increasing cyber threats, this role has become critical for organizations of all sizes.',
    600000,
    2200000,
    'Very High Growth',
    ARRAY['Network Security', 'Threat Analysis', 'SIEM', 'Penetration Testing', 'Incident Response', 'Python', 'Compliance'],
    'B.Tech in CS/IT with security certifications',
    'Mid Level',
    ARRAY['Splunk', 'Wireshark', 'Nessus', 'Metasploit', 'Burp Suite', 'OSSEC'],
    10,
    'Shield'
),
(
    'Machine Learning Engineer',
    'Technology',
    'Build and deploy machine learning models at scale to power intelligent applications.',
    'Machine Learning Engineers design and implement ML systems that can learn and improve from experience. They work on model development, optimization, and deployment at scale. This role combines software engineering expertise with deep knowledge of ML algorithms and frameworks.',
    900000,
    3500000,
    'Very High Growth',
    ARRAY['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Deep Learning', 'NLP', 'Computer Vision', 'AWS SageMaker'],
    'M.Tech/MS in CS, ML, or related field',
    'Senior Level',
    ARRAY['TensorFlow', 'PyTorch', 'Kubernetes', 'MLflow', 'Airflow', 'Docker'],
    10,
    'Brain'
);