import * as vscode from "vscode"

/**
 * Map a text-document URI to the URI of the file it logically belongs to.
 *
 * A notebook cell document has scheme `vscode-notebook-cell` and no on-disk
 * path of its own, so editor-context collection would drop every cell. Resolve
 * it to its owning notebook instead; plain file URIs pass through unchanged.
 *
 * Originally lived in the vendored Continue.dev autocomplete tree; kept here
 * because the chat editor-context path depends on it, not the autocomplete
 * feature.
 */

interface NotebookResolution {
  notebook: vscode.NotebookDocument
  cells: vscode.NotebookCell[]
  index: number
  version: number
}

const resolutions = new WeakMap<vscode.Uri, NotebookResolution>()

function resolveNotebook(uri: vscode.Uri): NotebookResolution | undefined {
  const id = uri.toString()
  const cached = resolutions.get(uri)
  if (
    cached &&
    cached.notebook.version === cached.version &&
    vscode.workspace.notebookDocuments.includes(cached.notebook)
  ) {
    return cached
  }

  resolutions.delete(uri)
  for (const notebook of vscode.workspace.notebookDocuments) {
    const cells = notebook.getCells()
    const index = cells.findIndex((cell) => cell.document.uri.toString() === id)
    if (index < 0) continue
    const resolved = { notebook, cells, index, version: notebook.version }
    resolutions.set(uri, resolved)
    return resolved
  }
}

export function notebookUri(uri: vscode.Uri): vscode.Uri | undefined {
  if (uri.scheme === "file") return uri
  if (uri.scheme !== "vscode-notebook-cell") return
  return resolveNotebook(uri)?.notebook.uri
}
