// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as typescript from 'typescript';
import * as path from 'path-browserify';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function getActiveFileName(): vscode.Uri | undefined{
	if (vscode.window.activeTextEditor){
		return vscode.window.activeTextEditor.document.uri;
	} else {
		vscode.window.showErrorMessage('Could not compile image as you are not on a text editor');
		return;
	}
}
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "tsc-compiler" is now active in the web extension host!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tsc-compiler.transpile', () => {
		// Detect active file and transpile it
		let activeFileName = getActiveFileName();
		
		if (!activeFileName) {return;}

		let config = vscode.workspace.getConfiguration('tsc-compiler');
		let filePath = activeFileName.path;
		
		let pathWithoutBaseName = path.dirname(filePath);
		let pathBaseName = path.basename(filePath);
		let pathCustom:string = (config.get("outDir")||'');
		let changedBasename = pathWithoutBaseName + '/'+ (pathCustom.endsWith('/') ? pathCustom.substring(0, pathBaseName.length) : pathCustom) +'/'+ pathBaseName.substring(0, pathBaseName.length - 3) + ".js";
		if (!vscode.window.activeTextEditor) {return;}
		let fileContents = vscode.window.activeTextEditor.document.getText();
		let moduleResolution = typescript.ModuleKind.ESNext;
		
		let moduleType:string = config.get('module') || "esnext";
		let targetType:string = config.get('target') || "esnext";
		vscode.window.showInformationMessage("Target: "+targetType);
		vscode.window.showInformationMessage("Module: "+ moduleType);
		let newFileContents = typescript.transpile(fileContents, {
			"strict": true,
			"module": mapModuleType(moduleType),
			"target": mapTargetType(targetType.toLowerCase())
		});
		let buffer = new TextEncoder().encode(newFileContents);
		vscode.window.showInformationMessage(changedBasename);
		// vscode.workspace.fs.delete(vscode.Uri.file(pathWithoutBaseName + changedBasename), buffer);

		vscode.workspace.fs.writeFile(vscode.Uri.parse(changedBasename), buffer).then(()=>{
			vscode.window.showInformationMessage('TS Transpiled successfully!');
		});
		
		// vscode.window.showInformationMessage('Hello World from TSC Compiler in a web extension host!');
	});

	context.subscriptions.push(disposable);
}
function mapTargetType(type: any): typescript.ScriptTarget {
	switch (type) {
	case "es3":
		return typescript.ScriptTarget.ES3; 
	case "es5":
		return typescript.ScriptTarget.ES5; 
	case "es2015":
		return typescript.ScriptTarget.ES2015; 
	case "es2016":
		return typescript.ScriptTarget.ES2016; 
	case "es2017":
		return typescript.ScriptTarget.ES2017; 
	case "es2018":
		return typescript.ScriptTarget.ES2018; 
	case "es2019":
		return typescript.ScriptTarget.ES2019; 
	case "es2020":
		return typescript.ScriptTarget.ES2020; 
	case "es2021":
		return typescript.ScriptTarget.ES2021; 
	case "es2022":
		return typescript.ScriptTarget.ES2022; 
	case "esnext":
		return typescript.ScriptTarget.ESNext; 
	case "json":
		return typescript.ScriptTarget.JSON; 
	case "latest":
		return typescript.ScriptTarget.Latest; 
	default: 
		return typescript.ScriptTarget.ESNext;
	}
}
function mapModuleType(moduleType: string): typescript.ModuleKind {
	switch (moduleType.toLowerCase()) {
	case "none":
		return typescript.ModuleKind.None;
	case "commonjs":
		return typescript.ModuleKind.CommonJS;
	case "amd":
		return typescript.ModuleKind.AMD;
	case "umd":
		return typescript.ModuleKind.UMD;
	case "system":
		return typescript.ModuleKind.System;
	case "es2015":
		return typescript.ModuleKind.ES2015;
	case "es2020":
		return typescript.ModuleKind.ES2020;
	case "es2022":
		return typescript.ModuleKind.ES2022;
	case "esnext":
		return typescript.ModuleKind.ESNext;
	case "node16":
		return typescript.ModuleKind.Node16;
	case "nodenext":
		return typescript.ModuleKind.NodeNext;
	default: 
		return typescript.ModuleKind.ESNext;
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
