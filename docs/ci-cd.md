# BrainBytes CI/CD Documentation

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup for the BrainBytes AI tutoring platform.

---

## Workflows

### Main CI/CD Workflow (`.github/workflows/ci.yml`)

**Purpose**: This workflow runs automated checks and tests on every push and pull request to ensure code quality and application health.

**Stages**:
1. **Dependency Caching**: Speeds up builds by caching node modules.
2. **Linting**: Runs ESLint and Prettier on frontend and backend.
3. **Testing**:
   - **Backend Tests**: Runs unit tests with coverage.
   - **Frontend Tests**: Placeholder for React unit tests.
   - **End-to-End Tests**: Runs Cypress tests.
4. **Code Coverage**: Uploads coverage reports as artifacts.
5. **Performance Testing**: Runs Lighthouse CI.
6. **Artifacts**: Uploads build outputs.
7. **Deployment Placeholder**: (To be implemented)

---

## Manual Execution

You can run the CI/CD pipeline manually:
1. Go to the **Actions** tab in GitHub.
2. Select **CI/CD Pipeline**.
3. Click **Run workflow** to trigger the pipeline manually.

---

## Workflow Status Badges

- **Main CI/CD**:  
  ![CI/CD Status](https://github.com/Sempuri/brainbytesAI/actions/workflows/ci.yml/badge.svg)

---

## Troubleshooting

### Common Issues

1. **Workflow Failures**:
   - Check the detailed logs in the Actions tab.
   - Ensure all dependencies are installed.
   - Make sure Docker is configured correctly.

2. **Test Failures**:
   - Run tests locally with `npm test`.
   - Check for missing configuration or environment variables.

3. **Deployment**:
   - Ensure deployment steps are correctly configured before enabling.

---

## Getting Help

- Check the **Actions** tab for logs and details.
- Consult **GitHub Actions documentation**.
- Contact the repository maintainers for support.