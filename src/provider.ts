import * as vscode from 'vscode';
import { CssUpxProcess } from "./process";

export class CssUpxProvider implements vscode.CompletionItemProvider {

    constructor(private process: CssUpxProcess) { }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionItem[]> {

        return new Promise((resolve, reject) => {
            const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const res = this.process.convert(lineText);
            if (!res) {
                return resolve([]);
            }

            const item = new vscode.CompletionItem(`${res.pxValue}px -> ${res.upx}`, vscode.CompletionItemKind.Snippet);
            item.insertText = res.upx;
            return resolve([item]);

        });
    }
}