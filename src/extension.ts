// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const renameAll = () => {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showWarningMessage('There must be an active text editor');
        return;
    }

    let symbolSet = new Set<vscode.SymbolInformation>();

    (vscode.commands.executeCommand("vscode.executeWorkspaceSymbolProvider", "") as Thenable<vscode.SymbolInformation[]>)
        .then((symbols: vscode.SymbolInformation[]) => {
            for (const symbol of symbols) {
                symbolSet.add(symbol);
            }
        });

    const allSymbolsString = [...symbolSet].map((symbol : vscode.SymbolInformation) => symbol.name).join("\n");
    vscode.window.showInformationMessage(allSymbolsString);
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "zoobfuscator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableHelloWorld = vscode.commands.registerCommand('zoobfuscator.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from zoobfuscator!');
    });

    let disposableRenameAll = vscode.commands.registerCommand('zoobfuscator.renameAll', () => {
        renameAll();
    });

    context.subscriptions.push(disposableRenameAll);
    context.subscriptions.push(disposableHelloWorld);
}

// This method is called when your extension is deactivated
export function deactivate() {}
