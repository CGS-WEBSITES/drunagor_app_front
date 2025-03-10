# Contributing to the Drunagor Companion App

Thank you for your interest in contributing to the Drunagor Companion App! We welcome contributions from developers, designers, and community members alike. By contributing, you help make the app better for everyone.

## Table of Contents

- [Reporting Issues](#reporting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Style Guidelines](#style-guidelines)
- [License](#license)
- [Code of Conduct](#code-of-conduct)
- [Getting Help](#getting-help)

## Reporting Issues

Before opening a new issue, please search the [existing issues](https://github.com/CGS-WEBSITES/drunagor_app_front/issues) to see if the problem has already been reported or if a feature request already exists. When reporting a bug or suggesting a feature, include as much detail as possible:

- **Title:** A clear, concise summary of the issue.
- **Description:** A detailed description of the issue or feature request.
- **Steps to Reproduce:** For bugs, include steps to reproduce the issue.
- **Expected vs. Actual Behavior:** Explain what you expected to happen and what actually happened.
- **Screenshots/Logs:** Include relevant screenshots or error logs if available.

## Submitting Pull Requests

We appreciate your efforts to improve the project! Follow these steps to submit a pull request (PR):

1. **Fork the Repository:**Click the **Fork** button at the top right of the repository page to create your own copy.
2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/yourusername/drunagor-app.git
   cd drunagor-app
   ```

Below is a sample CONTRIBUTING.md file for the Drunagor Companion App repository:

3. **Create a New Branch:**

   Create a branch for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes:**

   * Adhere to the coding and style guidelines described below.
   * Write tests for new features or bug fixes.
   * Update documentation where necessary.
5. **Commit Your Changes:**

   Use clear, descriptive commit messages (see Commit Messages below).
6. **Push Your Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request:**

   Navigate to the repository on GitHub and click on  **Compare & pull request** . Provide a detailed description of your changes and reference any related issues.
8. **Review Process:**

   Your PR will be reviewed by one or more maintainers. Be prepared to discuss your changes and make adjustments based on feedback.

## Coding Standards

* **Language & Framework:** The project is built with TypeScript and Vue 3. Follow TypeScript best practices and the Vue style guide.
* **UI Library:** Use Vuetify components to maintain a consistent look and feel.
* **Formatting:** Ensure code is formatted using Prettier and linted using ESLint. You can run:

  ```bash
  npm run format
  ```

  before committing changes.

## Commit Messages

Please write clear, descriptive commit messages. A good commit message should include:

* A concise summary of the change (preferably 50 characters or less).
* A more detailed explanation if necessary.
* References to related issues, e.g., `Closes #42`.

Example:

```
feat: add dark mode toggle

This feature allows users to switch between light and dark mode.
Closes #42.
```

## Style Guidelines

* **Code Structure:** Follow the existing project structure and naming conventions.
* **.md**
* **Testing:** Include tests for any new functionality or bug fixes.
* **Documentation:** Update relevant documentation and inline comments as needed.

## License

By contributing to this repository, you agree that your contributions will be licensed under the MIT License. Please review the [LICENSE](./LICENSE.md) file for details.

## Code of Conduct

Please adhere to our [Code of Conduct](./Code_of_conduct.md) to ensure a welcoming and respectful community.

## Getting Help

If you have any questions or need further assistance, please open an issue in the repository using GitHub Issues.

Thank you for contributing to the Drunagor Companion App!
