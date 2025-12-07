# Contributing to GC Geochecker Finder

Thank you for your interest in contributing!

## How to Contribute

### Reporting Bugs

- Use the GitHub issue tracker
- Describe the bug clearly
- Include steps to reproduce
- Mention your browser and userscript manager version

### Suggesting Features

- Open an issue with your suggestion
- Explain why this feature would be useful
- Provide examples if possible

### Adding New Geochecker Domains

To add support for a new geochecker domain:

1. Add the domain to `DOMAIN_CONFIG` in the script
2. Implement `extractParam` function to extract the checker ID
3. Implement `getImageUrl` function to generate the image URL
4. (optional) Implement `passCoords` function to pass corrected coordinates to the service via URL search parameters
5. Test thoroughly on actual cache pages

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Test your changes
- Submit a pull request with a clear description
