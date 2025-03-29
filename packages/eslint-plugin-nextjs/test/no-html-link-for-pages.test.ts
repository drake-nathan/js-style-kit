/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-conditional-in-test */
import { describe, expect, it, spyOn } from "bun:test";
import { Linter as ESLintLinterV9 } from "eslint";
import { Linter as ESLintLinterV8 } from "eslint-v8";
import assert from "node:assert";
import path from "node:path";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-html-link-for-pages");

const withCustomPagesDir = path.join(__dirname, "with-custom-pages-dir");
const withNestedPagesDir = path.join(__dirname, "with-nested-pages-dir");
const withoutPagesDir = path.join(__dirname, "without-pages-dir");
const withAppDir = path.join(__dirname, "with-app-dir");

const linters = {
  v8: {
    withApp: new ESLintLinterV8({
      cwd: withAppDir,
    }),
    withCustomPages: new ESLintLinterV8({
      cwd: withCustomPagesDir,
    }),
    withNestedPages: new ESLintLinterV8({
      cwd: withNestedPagesDir,
    }),
    withoutPages: new ESLintLinterV8({
      cwd: withoutPagesDir,
    }),
  },
  v9: {
    withApp: new ESLintLinterV9({
      configType: "eslintrc",
      cwd: withAppDir,
    }),
    withCustomPages: new ESLintLinterV9({
      configType: "eslintrc",
      cwd: withCustomPagesDir,
    }),
    withNestedPages: new ESLintLinterV9({
      configType: "eslintrc",
      cwd: withNestedPagesDir,
    }),
    withoutPages: new ESLintLinterV9({
      configType: "eslintrc",
      cwd: withoutPagesDir,
    }),
  },
};

const linterConfig: any = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "no-html-link-for-pages": [2],
  },
};
const linterConfigWithCustomDirectory: any = {
  ...linterConfig,
  rules: {
    "no-html-link-for-pages": [
      2,
      path.join(withCustomPagesDir, "custom-pages"),
    ],
  },
};
const linterConfigWithMultipleDirectories = {
  ...linterConfig,
  rules: {
    "no-html-link-for-pages": [
      2,
      [
        path.join(withCustomPagesDir, "custom-pages"),
        path.join(withCustomPagesDir, "custom-pages/list"),
      ],
    ],
  },
};
const linterConfigWithNestedContentRootDirDirectory = {
  ...linterConfig,
  settings: {
    next: {
      rootDir: path.join(withNestedPagesDir, "demos/with-nextjs"),
    },
  },
};

for (const version of ["v8", "v9"] as const) {
  for (const linter of Object.values(linters[version])) {
    linter.defineRules({
      "no-html-link-for-pages": NextESLintRule,
    });
  }
}

const validCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <Link href='/'>
          <a>Homepage</a>
        </Link>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const validAnchorCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='#heading'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const validExternalLinkCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='https://google.com/'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const validDownloadLinkCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/static-file.csv' download>Download</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;
const validTargetBlankLinkCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a target="_blank" href='/new-tab'>New Tab</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const validPublicFile = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/presentation.pdf'>View PDF</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const invalidStaticCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const invalidDynamicCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/list/foo/bar'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;
const secondInvalidDynamicCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/list/foo/'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const thirdInvalidDynamicCode = `
import Link from 'next/link';

export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/list/lorem-ipsum/'>Homepage</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;
const validInterceptedRouteCode = `
import Link from 'next/link';
export class Blah extends Head {
  render() {
    return (
      <div>
        <Link href='/photo/1/'>Photo</Link>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

const invalidInterceptedRouteCode = `
import Link from 'next/link';
export class Blah extends Head {
  render() {
    return (
      <div>
        <a href='/photo/1/'>Photo</a>
        <h1>Hello title</h1>
      </div>
    );
  }
}
`;

describe("no-html-link-for-pages", () => {
  for (const version of ["v8", "v9"]) {
    it(`does not print warning when there are "pages" or "app" directories with rootDir in context settings (${version})`, () => {
      const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});
      linters[version].withNestedPages.verify(
        validCode,
        linterConfigWithNestedContentRootDirDirectory,
        { filename: "foo.js" },
      );

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it(`prints warning when there are no "pages" or "app" directories (${version})`, () => {
      // TODO(jiwon): unskip v8 test
      // If this test runs standalone, it correctly calls warning,
      // but on the second run, it doesn't. Skip the v8 test for now as
      // there were no rule changes. Maybe related to:
      // https://github.com/facebook/react/issues/7047#issuecomment-228614964
      if (version === "v8") {
        return;
      }

      const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});
      linters[version].withoutPages.verify(validCode, linterConfig, {
        filename: "foo.js",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `Pages directory cannot be found at ${path.join(
          withoutPagesDir,
          "pages",
        )} or ${path.join(
          withoutPagesDir,
          "src",
          "pages",
        )}. If using a custom path, please configure with the \`no-html-link-for-pages\` rule in your eslint config file.`,
      );

      consoleSpy.mockRestore();
    });

    it(`does not print warning when there is "app" directory and no "pages" directory (${version})`, () => {
      const consoleSpy = spyOn(console, "warn").mockImplementation(() => {});
      linters[version].withApp.verify(validCode, linterConfig, {
        filename: "foo.js",
      });

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it(`valid link element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid link element with multiple directories (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validCode,
        linterConfigWithMultipleDirectories,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid anchor element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validAnchorCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid external link element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validExternalLinkCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid download link element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validDownloadLinkCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid target="_blank" link element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validTargetBlankLinkCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid public file link element (${version})`, () => {
      const report = linters[version].withCustomPages.verify(
        validPublicFile,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`invalid static route (${version})`, () => {
      const [report] = linters[version].withCustomPages.verify(
        invalidStaticCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.notEqual(report, undefined, "No lint errors found.");
      assert.equal(
        report.message,
        "Do not use an `<a>` element to navigate to `/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
    });

    it(`invalid dynamic route (${version})`, () => {
      const [report] = linters[version].withCustomPages.verify(
        invalidDynamicCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.notEqual(report, undefined, "No lint errors found.");
      assert.equal(
        report.message,
        "Do not use an `<a>` element to navigate to `/list/foo/bar/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
      const [secondReport] = linters[version].withCustomPages.verify(
        secondInvalidDynamicCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.notEqual(secondReport, undefined, "No lint errors found.");
      assert.equal(
        secondReport.message,
        "Do not use an `<a>` element to navigate to `/list/foo/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
      const [thirdReport] = linters[version].withCustomPages.verify(
        thirdInvalidDynamicCode,
        linterConfigWithCustomDirectory,
        { filename: "foo.js" },
      );
      assert.notEqual(thirdReport, undefined, "No lint errors found.");
      assert.equal(
        thirdReport.message,
        "Do not use an `<a>` element to navigate to `/list/lorem-ipsum/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
    });

    it(`valid link element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(validCode, linterConfig, {
        filename: "foo.js",
      });
      assert.deepEqual(report, []);
    });

    it(`valid link element with multiple directories with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(validCode, linterConfig, {
        filename: "foo.js",
      });
      assert.deepEqual(report, []);
    });

    it(`valid anchor element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validAnchorCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid external link element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validExternalLinkCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid download link element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validDownloadLinkCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid target="_blank" link element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validTargetBlankLinkCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`valid public file link element with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validPublicFile,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`invalid static route with appDir (${version})`, () => {
      const [report] = linters[version].withApp.verify(
        invalidStaticCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.notEqual(report, undefined, "No lint errors found.");
      assert.equal(
        report.message,
        "Do not use an `<a>` element to navigate to `/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
    });

    it(`invalid dynamic route with appDir (${version})`, () => {
      const [report] = linters[version].withApp.verify(
        invalidDynamicCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.notEqual(report, undefined, "No lint errors found.");
      assert.equal(
        report.message,
        "Do not use an `<a>` element to navigate to `/list/foo/bar/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
      const [secondReport] = linters[version].withApp.verify(
        secondInvalidDynamicCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.notEqual(secondReport, undefined, "No lint errors found.");
      assert.equal(
        secondReport.message,
        "Do not use an `<a>` element to navigate to `/list/foo/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
      const [thirdReport] = linters[version].withApp.verify(
        thirdInvalidDynamicCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.notEqual(thirdReport, undefined, "No lint errors found.");
      assert.equal(
        thirdReport.message,
        "Do not use an `<a>` element to navigate to `/list/lorem-ipsum/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
    });

    it(`valid intercepted route with appDir (${version})`, () => {
      const report = linters[version].withApp.verify(
        validInterceptedRouteCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.deepEqual(report, []);
    });

    it(`invalid intercepted route with appDir (${version})`, () => {
      const [report] = linters[version].withApp.verify(
        invalidInterceptedRouteCode,
        linterConfig,
        { filename: "foo.js" },
      );
      assert.notEqual(report, undefined, "No lint errors found.");
      assert.equal(
        report.message,
        "Do not use an `<a>` element to navigate to `/photo/1/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-link-for-pages",
      );
    });
  }
});
