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

  disposables.forEach((disposable) => context.subscriptions.push(disposable));
}

// This method is called when your extension is deactivated
export function deactivate() {}
