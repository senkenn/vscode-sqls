import { ExtensionContext } from "vscode";

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from "vscode-languageclient/node";

import vscode = require("vscode");

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const config = parseLanguageServerConfig();
	const serverOptions: ServerOptions = {
		command: "sqls",

		args: [...config.flags],
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{ scheme: "file", language: "sql", pattern: "**/*.sql" },
		],
	};

	client = new LanguageClient(
		"languageServerExample",
		serverOptions,
		clientOptions,
	);
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

interface LanguageServerConfig {
	flags: string[];
}

export function parseLanguageServerConfig(): LanguageServerConfig {
	const sqlsConfig = vscode.workspace.getConfiguration("sqls");
	const config = {
		flags: sqlsConfig.languageServerFlags || [],
	};
	return config;
}
