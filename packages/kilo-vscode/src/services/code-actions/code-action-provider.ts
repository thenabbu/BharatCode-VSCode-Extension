import * as vscode from "vscode"

export class KiloCodeActionProvider implements vscode.CodeActionProvider {
  static readonly metadata: vscode.CodeActionProviderMetadata = {
    providedCodeActionKinds: [vscode.CodeActionKind.QuickFix, vscode.CodeActionKind.RefactorRewrite],
  }

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    if (range.isEmpty) return []

    const actions: vscode.CodeAction[] = []

    const add = new vscode.CodeAction("Add to BharatCode", vscode.CodeActionKind.RefactorRewrite)
    add.command = { command: "kilo-code.new.addToContext", title: "Add to BharatCode" }
    actions.push(add)

    const hasDiagnostics = context.diagnostics.length > 0

    if (hasDiagnostics) {
      const fix = new vscode.CodeAction("Fix with BharatCode", vscode.CodeActionKind.QuickFix)
      fix.command = { command: "kilo-code.new.fixCode", title: "Fix with BharatCode" }
      fix.isPreferred = true
      actions.push(fix)
    }

    if (!hasDiagnostics) {
      const explain = new vscode.CodeAction("Explain with BharatCode", vscode.CodeActionKind.RefactorRewrite)
      explain.command = { command: "kilo-code.new.explainCode", title: "Explain with BharatCode" }
      actions.push(explain)

      const improve = new vscode.CodeAction("Improve with BharatCode", vscode.CodeActionKind.RefactorRewrite)
      improve.command = { command: "kilo-code.new.improveCode", title: "Improve with BharatCode" }
      actions.push(improve)
    }

    return actions
  }
}
