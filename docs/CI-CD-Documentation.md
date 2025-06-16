<h1>BrainBytes CI/CD Documentation</h1>

<p>This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the BrainBytes AI tutoring platform.</p>

<hr>

<h2>Workflows</h2>

<h3>Main CI/CD Workflow (<code>.github/workflows/ci.yml</code>)</h3>

<p><strong>Purpose</strong>: This workflow runs automated checks, tests, and builds on every push and pull request to ensure code quality and application functionality.</p>

<p><strong>Triggers</strong>:</p>
<ul>
  <li>Push to <code>master</code> or <code>development</code> branches</li>
  <li>Pull requests targeting <code>master</code> or <code>development</code></li>
</ul>

<p><strong>Stages</strong>:</p>
<ol>
  <li><strong>Checkout Repository</strong>: Fetches the latest code</li>
  <li><strong>Setup Node.js</strong>: Configures multiple Node.js versions (16.x, 18.x)</li>
  <li><strong>Cache Dependencies</strong>: Speeds up builds by caching node modules</li>
  <li><strong>Install Dependencies</strong>: Installs npm packages for frontend and backend</li>
  <li><strong>Docker Builds</strong>: Creates and caches Docker images</li>
  <li><strong>Code Quality Checks</strong>: Runs ESLint and Prettier with annotations</li>
  <li><strong>Vulnerability Scanning</strong>: Checks for security issues in dependencies</li>
  <li><strong>Unit Testing</strong>: Runs Jest tests with coverage</li>
  <li><strong>Frontend Testing</strong>: Tests React components</li>
  <li><strong>E2E Testing</strong>: Runs Cypress browser tests</li>
  <li><strong>Test Summary Reports</strong>: Publishes comprehensive test results</li>
  <li><strong>Security Checks</strong>: Scans for large files and secrets</li>
  <li><strong>Performance Testing</strong>: Runs Lighthouse for web performance</li>
  <li><strong>Build Artifacts</strong>: Creates production builds for deployment</li>
  <li><strong>Deployment Placeholder</strong>: Reserved for future deployment integration</li>
  <li><strong>Status Notifications</strong>: Reports workflow status (currently disabled)</li>
</ol>

<p><strong>Timeout</strong>: 20 minutes max execution time</p>

<h3>Deployment Workflow (<code>.github/workflows/deploy.yml</code>)</h3>

<p><strong>Purpose</strong>: Deploys the application to test or staging environments.</p>

<p><strong>Triggers</strong>:</p>
<ul>
  <li>Push to <code>master</code> or <code>development</code> branches</li>
  <li>Manual workflow dispatch</li>
</ul>

<p><strong>Environment Selection</strong>:</p>
<ul>
  <li>Default: <code>test</code></li>
  <li>Manual options: <code>test</code> or <code>staging</code></li>
  <li>Branch-based routing: <code>master</code> → production, others → staging/test</li>
</ul>

<p><strong>Stages</strong>:</p>
<ol>
  <li><strong>Checkout Repository</strong>: Fetches the latest code</li>
  <li><strong>Setup Node.js</strong>: Configures Node.js 18.x</li>
  <li><strong>Configure Environment</strong>: Sets up environment variables from secrets</li>
  <li><strong>Build Docker Images</strong>: Creates containerized application</li>
  <li><strong>Prepare Deployment</strong>: Sets deployment metadata</li>
  <li><strong>Deploy Containers</strong>: Simulates deployment to Oracle Cloud (placeholder)</li>
  <li><strong>Verify Deployment</strong>: Checks application health endpoint</li>
  <li><strong>Send Notification</strong>: Reports successful deployment status</li>
</ol>

<h2>Manual Execution</h2>

<h3>Running the CI/CD Pipeline Manually</h3>

<ol>
  <li>Go to your GitHub repository</li>
  <li>Click the <strong>Actions</strong> tab</li>
  <li>Select <strong>CI/CD Pipeline</strong> from the workflows list</li>
  <li>Click <strong>Run workflow</strong> button (top right)</li>
  <li>Select the branch to run against</li>
  <li>Click the green <strong>Run workflow</strong> button</li>
</ol>

<h3>Running the Deployment Workflow Manually</h3>

<ol>
  <li>Go to your GitHub repository</li>
  <li>Click the <strong>Actions</strong> tab</li>
  <li>Select <strong>BrainBytes Deploy</strong> from the workflows list</li>
  <li>Click <strong>Run workflow</strong> button (top right)</li>
  <li>Choose deployment environment (<code>test</code> or <code>staging</code>)</li>
  <li>Click the green <strong>Run workflow</strong> button</li>
</ol>

<h2>Workflow Status Badges</h2>

<p>Add these badges to your README.md to show current workflow status:</p>

<pre><code>[![CI/CD Pipeline](https://github.com/Sempuri/brainbytesAI/actions/workflows/ci.yml/badge.svg)](https://github.com/Sempuri/brainbytesAI/actions/workflows/ci.yml)

[![BrainBytes Deploy](https://github.com/Sempuri/brainbytesAI/actions/workflows/deploy.yml/badge.svg)](https://github.com/Sempuri/brainbytesAI/actions/workflows/deploy.yml)</code></pre>

<ul>
  <li><strong>Green</strong>: The workflow completed successfully</li>
  <li><strong>Red</strong>: The workflow failed</li>
  <li><strong>Yellow</strong>: The workflow is in progress</li>
</ul>

<h2>Troubleshooting</h2>

<h3>Common Issues</h3>

<ol>
  <li><strong>Build Failures</strong>:
    <ul>
      <li>Check for syntax errors in code</li>
      <li>Ensure all dependencies are properly listed in package.json</li>
      <li>Verify Node.js compatibility (workflow uses 16.x and 18.x)</li>
    </ul>
  </li>
  
  <li><strong>Test Failures</strong>:
    <ul>
      <li>Review the test reports in GitHub Actions artifacts</li>
      <li>Check for flaky tests that need stabilization</li>
      <li>Verify environment variables needed for tests</li>
    </ul>
  </li>
  
  <li><strong>Docker Issues</strong>:
    <ul>
      <li>Ensure Docker Compose file is valid</li>
      <li>Check for permissions issues in Dockerfiles</li>
      <li>Review image build logs for errors</li>
    </ul>
  </li>
  
  <li><strong>Deployment Problems</strong>:
    <ul>
      <li>Verify all required secrets are added to the repository</li>
      <li>Check if environment URLs are correctly configured</li>
      <li>Ensure health check endpoints are functioning</li>
    </ul>
  </li>
</ol>

<h3>Getting Help</h3>

<p>For assistance with CI/CD issues:</p>
<ol>
  <li>Check the detailed logs in the Actions tab</li>
  <li>Review error messages and stack traces</li>
  <li>Reference the workflow files for expected behavior</li>
  <li>Consult this documentation for intended workflow operation</li>
</ol>

<p>If problems persist, create an issue using the bug report template, including:</p>
<ul>
  <li>Which workflow failed</li>
  <li>The specific step that failed</li>
  <li>Any error messages displayed</li>
  <li>Screenshots of the workflow run</li>
</ul>
