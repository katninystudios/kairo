# About Kairo
Kairo is a privacy-first web browser built by Katniny Studios, who truly care about your online privacy.

## Meowser -> Kairo
Kairo was originally Meowser (which is archived at [katninystudios/meowser](https://github.com/katninystudios/meowser)), but it is a browser that is built the way we truly want it to be built.

Meowser was bare bones, hard to work with, and didn't support many things you would expect from a web browser (not even context menus!).

Kairo aims to change that. With our new browser, we hope to create a fully functional, full-fledged privacy-focused web browser with adblocking and tracker blocking built in, support for Manifest v2 and Manifest v3 extensions (even after Chrome and Firefox stop supporting Manifest v2), sync, and much more.

A web browser built to compete.

Learn more at https://studios.katniny.lol/blogs/meowser-rebranding-rebuilt

# Engine
## Why Chromium/Electron?
- **Modern Web Compatibility**: Supports the latest web standards, ensuring Kairo can render any site correctly.
- **Performance & Stability**: Chromium's multiprocess architecture keeps tabs isolated, preventing one bad page from crashing the whole browser.
- **Developer-Friendly**: Electron provides a familiar JS/HTML/CSS environment, making development easier for us and possible contributors.
- **Cross-platform**: Easier to maintain across Windows, macOS, and Linux without separate implementations.
- **Customization**: Allows for a fully custom UI while still leveraging Chromium's rendering power.
- **More Secure**: See https://x.com/gnukeith/status/1868551096190304629
## Rendering Engines for the Future
While Chromium/Electron is the best choice for Kairo right now, future developments in rendering engines could change that. Some promising options include:
- **Ladybird**: An independent browser engine making impressive progress on web standards, with a focus on speed and modern web compatibility. If it continues improving, it could be a great alternative.
- **Servo**: A parallelized engine designed for performance and safety. While not stable yet, if it matures well, it could be a strong contender.
- **A custom engine**: In the distant future, developing a completely Kairo-specific browser engine would allow for full control over performance, customization, and features tailored to my vision and web standards.

For now, Chromium provides the best balance of stability, modern web support and ease-of-development, but Kairo's long-term goal is to break away from it when the right opportunity arises.

# Practices
We want to provide a fully secure browser, with automatic updates to ensure you're always on the latest version of Kairo to keep you safe.

We also want sync, which will be 100% securely processed and imported across your Kairo installations.

We're completely open source, so you can contribute, file issues, request features, or even just look at how Kairo works.

Our default search engine is DuckDuckGo, with no shady deals with Google, Bing, Yahoo!, or other search engine providers for Kairo. We will forever default to DuckDuckGo.
