import { DocumentTemplate } from '../types/document';

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start fresh with a clean, unformatted A4 document.',
    category: 'General',
    content: `
      <h1>Untitled Document</h1>
      <p>Start typing your document here. Format headings, add tables, customize fonts, or export whenever you're ready.</p>
    `,
  },
  {
    id: 'business-proposal',
    name: 'Executive Business Proposal',
    description: 'A formal executive summary with objectives, deliverables table, and budget.',
    category: 'Business',
    content: `
      <h1>Project Proposal: Cloud Infrastructure Modernization</h1>
      <p><strong>Prepared for:</strong> Executive Leadership Team<br />
      <strong>Date:</strong> November 2026<br />
      <strong>Author:</strong> Engineering & Architecture Advisory</p>
      
      <hr />

      <h2>1. Executive Summary</h2>
      <p>This proposal outlines the strategic roadmap for transitioning legacy compute infrastructure into an elastic, microservices-oriented cloud architecture. The initiative aims to reduce infrastructure operational overhead by <strong>35%</strong> while boosting deployment velocity.</p>

      <blockquote>
        "Modernizing our core infrastructure is not merely an operational upgrade; it establishes the foundation for real-time customer data processing and enterprise reliability."
      </blockquote>

      <h2>2. Key Objectives & Milestones</h2>
      <ul>
        <li>Zero-downtime migration of critical relational database clusters.</li>
        <li>Automated container orchestration with continuous security scanning.</li>
        <li>Sub-second query latencies across regional multi-zone deployments.</li>
        <li>Full disaster recovery redundancy with 15-minute RPO benchmarks.</li>
      </ul>

      <h2>3. Proposed Implementation Timeline</h2>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Deliverable</th>
            <th>Duration</th>
            <th>Lead Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Phase 1</td>
            <td>Architecture Discovery & Security Audit</td>
            <td>4 Weeks</td>
            <td>DevOps Lead</td>
          </tr>
          <tr>
            <td>Phase 2</td>
            <td>Staging Environment & Data Mirroring</td>
            <td>6 Weeks</td>
            <td>Data Engineering</td>
          </tr>
          <tr>
            <td>Phase 3</td>
            <td>Production Cutover & Traffic Routing</td>
            <td>2 Weeks</td>
            <td>Site Reliability Team</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Resource Allocation</h2>
      <ol>
        <li>Initial cloud provision and network isolation setup.</li>
        <li>Load testing under simulated peak traffic (15,000 requests/sec).</li>
        <li>Engineering handover documentation and staff workshop series.</li>
      </ol>
    `,
  },
  {
    id: 'newsletter',
    name: 'Corporate Newsletter',
    description: 'Multi-column style internal company newsletter with news, highlights, and team spotlight.',
    category: 'Marketing',
    content: `
      <h1>THE QUARTERLY DISPATCH</h1>
      <p><em>Issue 14 · November 2026 · Global Communications Bulletin</em></p>
      <hr />

      <h2>CEO Message: Celebrating Our 10th Anniversary</h2>
      <p>Welcome to this special edition of our corporate dispatch. Over the last decade, our team has grown from a handful of innovators in a basement office to a vibrant international organization serving millions of users across 40 countries.</p>

      <blockquote>
        "Our journey has always been guided by curiosity, craft, and unwavering dedication to our community."
      </blockquote>

      <h2>Product Spotlight: Introducing DocEditor v2.0</h2>
      <p>We are thrilled to unveil our redesigned word processor. Built with desktop-class typography, zero-latency local caching, full mail merge capabilities, and comprehensive document security, it provides an uncompromising writing workspace.</p>

      <h2>Key Performance Highlights</h2>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Q3 Benchmark</th>
            <th>Q4 Actual</th>
            <th>Growth %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Active Writers</td>
            <td>120,000</td>
            <td>185,000</td>
            <td>+54%</td>
          </tr>
          <tr>
            <td>Documents Exported</td>
            <td>450,000</td>
            <td>720,000</td>
            <td>+60%</td>
          </tr>
          <tr>
            <td>Customer Satisfaction</td>
            <td>94.2%</td>
            <td>98.1%</td>
            <td>+3.9%</td>
          </tr>
        </tbody>
      </table>

      <h2>Upcoming Global Townhall</h2>
      <p>Join us on December 12th for our annual worldwide townhall. Bring your questions, stories, and ideas as we look forward into 2027.</p>
    `,
  },
  {
    id: 'certificate',
    name: 'Certificate of Achievement',
    description: 'Formal award certificate layout with recipient, citation of merit, and date.',
    category: 'Certificates',
    content: `
      <div style="text-align: center;">
        <h1>CERTIFICATE OF EXCELLENCE</h1>
        <p><em>THIS PRESTIGIOUS HONOR IS PROUDLY PRESENTED TO</em></p>
        
        <h2>ALEXANDER R. HAMILTON</h2>
        
        <p>In recognition of exceptional dedication, visionary leadership, and groundbreaking contributions to the advancement of client-side document processing architectures.</p>

        <hr style="width: 60%; margin: 2rem auto;" />

        <p><strong>AWARDED ON THIS 3RD DAY OF NOVEMBER, 2026</strong></p>

        <table>
          <thead>
            <tr>
              <th style="text-align: center;">Dr. Eleanor Vance</th>
              <th style="text-align: center;">Marcus Sterling</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center;">Dean of Faculty & Research</td>
              <td style="text-align: center;">President of Global Foundation</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: 'academic-paper',
    name: 'Academic Research Paper',
    description: 'Scholarly paper template with abstract, section hierarchy, citations, and references list.',
    category: 'Academic',
    content: `
      <h1>Comparative Analysis of In-Memory State Synchronization in Modern Web Applications</h1>
      <p><strong>Dr. Samantha Reynolds, Ph.D.</strong><br />
      <em>Department of Computer Science, Institute of Advanced Technologies</em><br />
      s.reynolds@institute.example · November 2026</p>

      <hr />

      <h2>Abstract</h2>
      <p>In-browser rich text processing engines have historically faced trade-offs between responsiveness and document integrity. This paper analyzes local storage transactional persistence paradigms compared against traditional client-server round-trips. Empirical benchmarks indicate that optimistic local snapshotting achieves 99.98% recovery fidelity while eliminating input latency.</p>

      <h2>1. Introduction & Background</h2>
      <p>Modern browser runtimes have evolved significantly with WebAssembly, modern DOM diffing heuristics, and efficient memory managers. As observed by Knuth (1984) and later expanded by Lamport (1998), deterministic local ordering provides robust fault tolerance in distributed document models.</p>

      <blockquote>
        "The primary challenge in interactive document composition is maintaining responsive typographic flow while guaranteeing immediate persistence."
      </blockquote>

      <h2>2. Methodology & Architecture</h2>
      <p>Our evaluation examined 50,000 synthetic document permutations varying from short memos (500 words) to book-length manuscripts (120,000 words). Memory utilization and serialization overhead were recorded at 10-second intervals.</p>

      <h2>3. Empirical Findings</h2>
      <table>
        <thead>
          <tr>
            <th>Document Size</th>
            <th>Parse Time (ms)</th>
            <th>Save Latency (ms)</th>
            <th>Memory Overhead</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Small (1k words)</td>
            <td>1.2 ms</td>
            <td>0.4 ms</td>
            <td>2.1 MB</td>
          </tr>
          <tr>
            <td>Medium (10k words)</td>
            <td>4.8 ms</td>
            <td>1.1 ms</td>
            <td>6.4 MB</td>
          </tr>
          <tr>
            <td>Large (100k words)</td>
            <td>18.5 ms</td>
            <td>4.2 ms</td>
            <td>24.8 MB</td>
          </tr>
        </tbody>
      </table>

      <h2>References</h2>
      <ol>
        <li>Knuth, D. E. (1984). Literate Programming. <em>The Computer Journal</em>, 27(2), 97–111.</li>
        <li>Lamport, L. (1998). The Part-Time Parliament. <em>ACM Transactions on Computer Systems</em>, 16(2), 133–169.</li>
        <li>Berners-Lee, T., et al. (1994). Uniform Resource Locators (URL). RFC 1738.</li>
      </ol>
    `,
  },
  {
    id: 'formal-letter',
    name: 'Formal Business Letter',
    description: 'Classic professional correspondence layout with sender, recipient, and signature space.',
    category: 'General',
    content: `
      <p><strong>Nexus Technology Partners</strong><br />
      450 Innovation Parkway, Suite 800<br />
      Boston, MA 02110<br />
      contact@nexustech.example</p>

      <p>November 3, 2026</p>

      <p><strong>Mr. Arthur Vance</strong><br />
      Director of Operations<br />
      Horizon Logistics International<br />
      1200 Harbor Boulevard<br />
      Seattle, WA 98101</p>

      <h2>RE: Partnership Agreement Confirmation & Next Steps</h2>

      <p>Dear Mr. Vance,</p>

      <p>I am pleased to confirm our formal agreement regarding the deployment of our enterprise management platform across your regional distribution hubs. Following our extensive technical review in September, both our engineering and legal teams have finalized all integration specifications.</p>

      <p>As outlined in our master agreement, the implementation schedule will begin promptly on the first Monday of next month. Our senior integration specialist will contact your technical lead to coordinate authentication and initial data migration pipelines.</p>

      <blockquote>
        "Our mutual goal remains an uninterrupted operational handover while unlocking real-time tracking across all logistics channels."
      </blockquote>

      <p>Should you require any additional clarifications or adjustments before our kickoff briefing, please feel free to reach out directly to my office.</p>

      <p>Sincerely,</p>

      <p><strong>Eleanor Vance-Sterling</strong><br />
      Senior Vice President of Enterprise Solutions<br />
      Nexus Technology Partners</p>
    `,
  },
  {
    id: 'resume',
    name: 'Executive Resume / CV',
    description: 'Clean typographic curriculum vitae with experience, education, and technical competencies.',
    category: 'Personal',
    content: `
      <h1>Jonathan Rivera</h1>
      <p><strong>Senior Software Engineer & Systems Architect</strong><br />
      San Francisco, CA · jonathan.rivera@example.com · +1 (555) 349-2810</p>

      <hr />

      <h2>Professional Summary</h2>
      <p>Results-driven software architect with 8+ years of experience engineering high-throughput web applications, fault-tolerant distributed services, and responsive client-side desktop-class software. Proven expertise in React, TypeScript, and rich client-side document systems.</p>

      <h2>Core Competencies</h2>
      <ul>
        <li><strong>Frontend Architecture:</strong> React 19, TypeScript, TipTap / ProseMirror, Tailwind CSS, Responsive Design</li>
        <li><strong>Backend & Systems:</strong> Node.js, Express, PostgreSQL, Microservices, REST & GraphQL APIs</li>
        <li><strong>Engineering Leadership:</strong> Agile project management, CI/CD pipeline automation, code review rigor</li>
      </ul>

      <h2>Work Experience</h2>

      <h3>Staff Systems Engineer — CloudVanguard Corp</h3>
      <p><em>January 2023 – Present · San Francisco, CA</em></p>
      <ul>
        <li>Architected real-time client-side document processing engine serving over 450,000 monthly active users.</li>
        <li>Reduced initial asset bundle size by 42% through aggressive tree-shaking and dynamic component loading.</li>
        <li>Led an 8-engineer cross-functional squad delivering core desktop-fidelity editing features.</li>
      </ul>

      <h2>Education</h2>
      <p><strong>Bachelor of Science in Computer Science</strong><br />
      University of Michigan, Ann Arbor · Graduated Magna Cum Laude</p>
    `,
  },
];
