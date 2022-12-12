// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import { setKozoDefaultConfig } from "./projectSettingInput";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "kozo" is now active!');
  const disposables: vscode.Disposable[] = [];
  let isViewsWelcomeVisible = true;
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (
    workspaceFolders !== undefined &&
    fs.existsSync(`${workspaceFolders[0].uri.path}/.kozo`)
  ) {
    isViewsWelcomeVisible = false;
  }
  // set context value of checking existence of .kozo folder in workspace root dir
  vscode.commands.executeCommand(
    "setContext",
    "kozo.isViewWelcomeVisible",
    isViewsWelcomeVisible
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  disposables.push(
    vscode.commands.registerCommand("kozo.createEmptyKozo", async () => {
      const state = await setKozoDefaultConfig(context);
      console.log(state);
    })
  );

  disposables.push(
    vscode.commands.registerCommand("kozo.viewGraph", () => {
      const panel = vscode.window.createWebviewPanel(
        "graph view",
        "Graph View",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      panel.webview.html = getWebviewContent(context, panel.webview);
      // console.log('Hello world');
    })
  );

  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
) {
  const localServerUrl = "http://localhost:5173";
  const jsFile = "client";

  const clientScriptUrl = `${localServerUrl}/@vite/${jsFile}`;
  const mainScriptUrl = `${localServerUrl}/src/main.tsx`;
  const svgUrl = `${localServerUrl}/vite.svg`;

  const html = `<!DOCTYPE html>
  <html lang="en">
      <head>
          <script type="module">
              import { injectIntoGlobalHook } from "${localServerUrl}/@react-refresh";
  injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
          </script>
          <script type="module" src="${clientScriptUrl}"></script>
          <meta charset="UTF-8"/>
          <link rel="icon" type="image/svg+xml" href="${svgUrl}"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Vite + React + TS</title>
         
      </head>
      <body>
          <div id="root" ></div>
          <script type="module" src="${mainScriptUrl}"></script>
      </body>
  </html>
  `;
  return html;
}
