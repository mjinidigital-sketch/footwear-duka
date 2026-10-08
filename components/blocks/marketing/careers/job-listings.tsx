import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ChevronRightIcon,
  Search,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full-time' | 'part-time' | 'contract';
  postedDate: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  featured?: boolean;
}

export type LocationType = 'remote' | 'hybrid' | 'onsite';
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship';

export default function JobListings() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeLocation, setActiveLocation] = React.useState<string | null>(
    null
  );
  const [activeDepartment, setActiveDepartment] = React.useState<string | null>(
    null
  );

  // Sample job data
  const jobs: JobPosition[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      postedDate: '2023-06-15',
      description:
        "We're looking for a Senior Frontend Developer to join our team and help build our next-generation web applications. You'll be responsible for architecting and implementing UI components, optimizing performance, and mentoring junior developers.",
      requirements: [
        '5+ years of experience with modern JavaScript frameworks (React, Vue, Angular)',
        'Strong knowledge of TypeScript, HTML and CSS',
        'Experience with state management solutions',
        'Understanding of web accessibility standards',
        'Excellent communication skills',
      ],
      salaryRange: '$120,000 - $150,000',
      featured: true,
    },
    {
      id: '2',
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY',
      locationType: 'onsite',
      employmentType: 'full-time',
      postedDate: '2023-06-20',
      description:
        "We are seeking a creative Product Designer to join our growing design team. You'll collaborate with product managers, engineers, and other designers to create intuitive and visually appealing user experiences for our products.",
      requirements: [
        '3+ years of experience in product design',
        'Proficiency in design tools like Figma and Adobe Creative Suite',
        'Experience with user research and usability testing',
        'Strong portfolio showcasing your design process',
        'Excellent problem-solving skills',
      ],
      salaryRange: '$90,000 - $120,000',
      featured: true,
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      postedDate: '2023-06-25',
      description:
        "We're looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You'll work closely with our development team to implement CI/CD pipelines, optimize system performance, and ensure high availability of our services.",
      requirements: [
        '4+ years of experience in DevOps or system administration',
        'Experience with AWS, GCP, or Azure',
        'Knowledge of container orchestration (Kubernetes, Docker)',
        'Experience with infrastructure as code (Terraform, CloudFormation)',
        'Strong scripting skills (Bash, Python)',
      ],
      salaryRange: '$110,000 - $140,000',
    },
    {
      id: '4',
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Chicago, IL',
      locationType: 'hybrid',
      employmentType: 'full-time',
      postedDate: '2023-07-01',
      description:
        "We're seeking a Content Marketing Manager to develop and execute our content strategy. You'll create compelling content for various channels, manage our editorial calendar, and analyze content performance to drive engagement and conversions.",
      requirements: [
        '3+ years of experience in content marketing',
        'Excellent writing and editing skills',
        'Experience with SEO and content analytics',
        'Strong project management abilities',
        'Knowledge of content management systems',
      ],
      salaryRange: '$80,000 - $100,000',
    },
    {
      id: '5',
      title: 'Data Scientist',
      department: 'Data',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      postedDate: '2023-07-05',
      description:
        "We're looking for a Data Scientist to help us extract insights from our vast amounts of data. You'll develop machine learning models, conduct statistical analyses, and work with product teams to implement data-driven features.",
      requirements: [
        'MSc or PhD in Computer Science, Statistics, or related field',
        '3+ years of experience in data science or machine learning',
        'Proficiency in Python and data science libraries (NumPy, Pandas, Scikit-learn)',
        'Experience with SQL and database systems',
        'Strong communication skills to explain complex concepts to non-technical stakeholders',
      ],
      salaryRange: '$130,000 - $160,000',
      featured: true,
    },
    {
      id: '6',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Austin, TX',
      locationType: 'onsite',
      employmentType: 'full-time',
      postedDate: '2023-07-10',
      description:
        "We're looking for a Customer Success Manager to ensure our customers achieve their business goals using our product. You'll manage customer relationships, drive product adoption, and work cross-functionally to address customer needs.",
      requirements: [
        '3+ years of experience in customer success or account management',
        'Strong interpersonal and communication skills',
        'Problem-solving abilities and attention to detail',
        'Experience with CRM software',
        'Ability to prioritize and manage multiple customers',
      ],
      salaryRange: '$75,000 - $95,000',
    },
    {
      id: '7',
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Remote',
      locationType: 'remote',
      employmentType: 'full-time',
      postedDate: '2023-07-15',
      description:
        "We're seeking a skilled Backend Developer to help build and scale our API services. You'll design and implement efficient, secure, and reliable backend systems that power our applications.",
      requirements: [
        '4+ years of experience in backend development',
        'Proficiency in at least one backend language (Node.js, Python, Go, etc.)',
        'Experience with relational and NoSQL databases',
        'Knowledge of API design and development',
        'Understanding of distributed systems and microservices architecture',
      ],
      salaryRange: '$110,000 - $140,000',
    },
    {
      id: '8',
      title: 'QA Engineer',
      department: 'Engineering',
      location: 'Seattle, WA',
      locationType: 'hybrid',
      employmentType: 'full-time',
      postedDate: '2023-07-20',
      description:
        "We're looking for a QA Engineer to ensure the quality of our products. You'll design and execute test plans, automate testing processes, and collaborate with developers to identify and resolve issues.",
      requirements: [
        '3+ years of experience in software testing',
        'Experience with test automation frameworks',
        'Knowledge of testing methodologies',
        'Attention to detail and analytical thinking',
        'Good understanding of the software development lifecycle',
      ],
      salaryRange: '$90,000 - $110,000',
    },
  ];

  // Extract unique departments and locations for filters
  const departments = Array.from(new Set(jobs.map((job) => job.department)));
  const locations = Array.from(new Set(jobs.map((job) => job.location)));

  const locationTypeIcons: Record<string, React.ReactNode> = {
    remote: (
      <Badge
        variant="outline"
        className="rounded-full border-green-200 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      >
        Remote
      </Badge>
    ),
    hybrid: (
      <Badge
        variant="outline"
        className="rounded-full border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      >
        Hybrid
      </Badge>
    ),
    onsite: (
      <Badge
        variant="outline"
        className="rounded-full border-orange-200 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      >
        On-site
      </Badge>
    ),
  };

  // Calculate days ago for a job posting
  const calculateDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - postedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Yesterday';
    } else {
      return `${differenceInDays} days ago`;
    }
  };

  // Filter jobs based on search query and selected filters
  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());

      // Department filter
      const matchesDepartment =
        activeDepartment === null || job.department === activeDepartment;

      // Location filter
      const matchesLocation =
        activeLocation === null || job.location === activeLocation;

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, searchQuery, activeDepartment, activeLocation]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 text-center md:mb-10">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
          Join Our Team
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm md:text-base">
          We&apos;re looking for passionate people to join us on our mission.
          Check out our open positions and find your dream job.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-0">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Departments</h3>
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start px-2 text-sm font-normal',
                      activeDepartment === null ? 'bg-muted' : ''
                    )}
                    onClick={() => setActiveDepartment(null)}
                  >
                    All Departments
                  </Button>
                </li>
                {departments.map((department) => (
                  <li key={department}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start px-2 text-sm font-normal',
                        activeDepartment === department ? 'bg-muted' : ''
                      )}
                      onClick={() => setActiveDepartment(department)}
                    >
                      {department}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:mt-4">
              <h3 className="mb-2 text-sm font-semibold">Locations</h3>
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start px-2 text-sm font-normal',
                      activeLocation === null ? 'bg-muted' : ''
                    )}
                    onClick={() => setActiveLocation(null)}
                  >
                    All Locations
                  </Button>
                </li>
                {locations.map((location) => (
                  <li key={location}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start px-2 text-sm font-normal',
                        activeLocation === location ? 'bg-muted' : ''
                      )}
                      onClick={() => setActiveLocation(location)}
                    >
                      {location}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Jobs list */}
        <div>
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                  All Jobs
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="flex-1 sm:flex-initial"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger value="remote" className="flex-1 sm:flex-initial">
                  Remote
                </TabsTrigger>
              </TabsList>
              <p className="text-muted-foreground text-sm">
                {filteredJobs.length} jobs found
              </p>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No jobs found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveDepartment(null);
                      setActiveLocation(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              {filteredJobs.filter((j) => j.featured).length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No featured jobs found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveDepartment(null);
                      setActiveLocation(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredJobs
                  .filter((job) => job.featured)
                  .map((job) => <JobCard key={job.id} job={job} />)
              )}
            </TabsContent>

            <TabsContent value="remote" className="space-y-4">
              {filteredJobs.filter((j) => j.locationType === 'remote')
                .length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">
                    No remote jobs found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveDepartment(null);
                      setActiveLocation(null);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredJobs
                  .filter((job) => job.locationType === 'remote')
                  .map((job) => <JobCard key={job.id} job={job} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  function JobCard({ job }: { job: JobPosition }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <Card
        className={cn(
          'overflow-hidden transition-all',
          job.featured ? 'border-primary/20' : ''
        )}
      >
        <CardHeader className="">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {job.title}
                {job.featured && (
                  <Badge className="ml-2 font-medium">Featured</Badge>
                )}
              </CardTitle>
              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="flex items-center">
                  <BriefcaseIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {job.department}
                </span>
                <span className="flex items-center">
                  <MapPinIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {calculateDaysAgo(job.postedDate)}
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 sm:mt-0">
              {locationTypeIcons[job.locationType]}
              <Badge
                variant="outline"
                className="text-xs font-normal sm:text-sm"
              >
                {job.employmentType === 'full-time'
                  ? 'Full-time'
                  : job.employmentType === 'part-time'
                    ? 'Part-time'
                    : 'Contract'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="">
          <div
            className={cn(
              'relative text-xs sm:text-sm',
              !expanded && 'max-h-16 overflow-hidden sm:max-h-24'
            )}
          >
            <p>{job.description}</p>
            {!expanded && (
              <div className="from-card absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t to-transparent sm:h-16"></div>
            )}
          </div>
          {expanded && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Requirements</h4>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              {job.salaryRange && (
                <p className="mt-4 text-sm font-medium">
                  Salary Range:{' '}
                  <span className="text-muted-foreground">
                    {job.salaryRange}
                  </span>
                </p>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground mt-2 h-auto p-0 text-xs sm:text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Apply Now
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            Share
          </Button>
        </CardFooter>
      </Card>
    );
  }
}
