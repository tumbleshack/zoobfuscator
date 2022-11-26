// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function getURIs(): Promise<vscode.Uri[]> {
    var toReturn = new Array<vscode.Uri>();
    if(vscode.workspace.workspaceFolders === undefined) {
        return toReturn;
    }
    let p = vscode.workspace.findFiles("**/*.java").then(uris => {
        return uris;
    });
    return Promise.resolve(p);
}

function getSymbolsFromURI(symbolSet : Set<vscode.DocumentSymbol>, uri: vscode.Uri) : Thenable<void> {
    let t = (vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri) as  Thenable<vscode.DocumentSymbol[]>)
        .then((symbols: vscode.DocumentSymbol[]) => {
            //console.log(symbols);
            for (const symbol of symbols) {
                symbolSet = recursiveAdd(symbolSet, symbol);
            }
        });
    return t;
}

function recursiveAdd(set : Set<vscode.DocumentSymbol>, symbol : vscode.DocumentSymbol): Set<vscode.DocumentSymbol> {
    set.add(symbol);
    if (symbol.children.length > 0) {
        symbol.children.forEach(element => {
            set = recursiveAdd(set, element);
        });
    }
    return set;
}

async function renameAll() {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showWarningMessage('There must be an active text editor');
        return;
    }

    // Set of symbols to rename
    let symbolMap = new Map<vscode.Uri, Set<vscode.DocumentSymbol>>();
    // Set of symbols we have already renamed
    let renamedSet = new Set<String>();
    // Set of animal names we have already used
    let usedAnimalSet = new Set<String>();
    let uris = await getURIs();
    for (var uri of uris) {
        let symbolSet = new Set<vscode.DocumentSymbol>();
        await Promise.resolve(getSymbolsFromURI(symbolSet, uri));
        symbolMap.set(uri, symbolSet);
    }
    console.log(symbolMap);
    for (var pair of symbolMap) {
        let uri = pair[0];
        let symbolSet = pair[1];
        for (var symbol of symbolSet) {
            if (!renamedSet.has(symbol.name)) {
                renamedSet.add(symbol.name);
                let newName = getRandomAnimalName();
                while(usedAnimalSet.has(newName)) {
                    newName = getRandomAnimalName();
                }
                usedAnimalSet.add(newName);            
                let t = (vscode.commands.executeCommand("vscode.executeDocumentRenameProvider", uri, symbol.selectionRange.start, newName) as 
                Thenable<vscode.WorkspaceEdit>).then(edit => {
                    if (edit) {
                        vscode.workspace.applyEdit(edit);
                    }
                    console.log(edit);
                });                
                await Promise.resolve(t);
            }
        }
    }
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

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

    let disposableRenameAll = vscode.commands.registerCommand('zoobfuscator.renameAll', async () => {
        await renameAll();
    });

    context.subscriptions.push(disposableRenameAll);
    context.subscriptions.push(disposableHelloWorld);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getRandomAnimalName(): String {
    let names = [
        "Frog",
        "Crocodile",
        "Alligator",
        "Monitor lizard",
        "Salamander",
        "Toad",
        "Newt",
        "Iguana",
        "Snake",
        "Snake",
        "Lion",
        "Tiger",
        "Goat",
        "Horse",
        "Donkey",
        "Dog",
        "Cat",
        "Pig",
        "Panther",
        "Leopard",
        "Cheetah",
        "Cow",
        "Walrus",
        "Otter",
        "Giraffe",
        "Sheep",
        "Rabbit",
        "Monkey",
        "Snake",
        "Crocodile",
        "Alligator",
        "Tortoise",
        "Turtle",
        "Lizard",
        "Chameleon",
        "Basilisk",
        "Gecko",
        "Herring",
        "Crab",
        "Brill",
        "Haddock",
        "Eel",
        "Whale",
        "Salmon",
        "Sardines",
        "Pike",
        "Carp",
        "Shark",
        "Tuna",
        "Pufferfish",
        "Flamingo",
        "Crow",
        "Hen",
        "Vulture",
        "Eagle",
        "Peacock",
        "Pigeon",
        "Emu",
        "Ostrich",
        "Dove",
        "Stork",
    ]
    let index = Math.floor(Math.random() * names.length);
    return names[index];
}
