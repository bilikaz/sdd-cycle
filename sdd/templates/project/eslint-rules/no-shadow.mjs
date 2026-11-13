/* @why
-----------
The shadow rule declares the runtime roots by hand over an ECMAScript-only lib
-----------
Left to a DOM-compiled project's lib, the scope analysis would read lib.dom's names as globals: `Text`, `name`
or `status` would count as roots and every local of that name would be refused. With the lib narrowed to
ECMAScript, only the roots a browser or Node hands every module are declared, never what is reached through them:
`window.sessionStorage` is a plain name here.
*/
export function noShadow(files) {
  return {
    files,
    languageOptions: {
      parserOptions: {
        lib: ["esnext"],
      },
      globals: {
        window: "readonly",
        document: "readonly",
        self: "readonly",
        globalThis: "readonly",
        global: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-shadow": [
        "error",
        {
          builtinGlobals: true,
        },
      ],
    },
  };
}
