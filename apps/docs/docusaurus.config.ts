import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  favicon: "img/favicon.ico",
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  presets: [
    [
      "classic",
      {
        docs: {
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/drake-nathan/js-style-kit/tree/main/apps/docs",
          sidebarPath: "./sidebars.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  tagline: "The best style guide ever.",

  themeConfig: {
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      links: [
        {
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
          title: "Docs",
        },
        {
          items: [
            {
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
              label: "Stack Overflow",
            },
            {
              href: "https://discordapp.com/invite/docusaurus",
              label: "Discord",
            },
            {
              href: "https://x.com/docusaurus",
              label: "X",
            },
          ],
          title: "Community",
        },
        {
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              href: "https://github.com/facebook/docusaurus",
              label: "GitHub",
            },
          ],
          title: "More",
        },
      ],
      style: "dark",
    },
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      items: [
        {
          label: "Tutorial",
          position: "left",
          sidebarId: "tutorialSidebar",
          type: "docSidebar",
        },
        { label: "Blog", position: "left", to: "/blog" },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
      logo: {
        alt: "JS Style Kit Logo",
        src: "img/logo.svg",
      },
      title: "JS Style Kit",
    },
    prism: {
      darkTheme: prismThemes.dracula,
      theme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,

  title: "JS Style Kit",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
};

export default config;
