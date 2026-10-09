// English runtime translations for autocomplete (kilocode:autocomplete.* namespace)
// Source: src/i18n/locales/en/kilocode.json → "autocomplete" section

export const dict = {
  "kilocode:autocomplete.statusBar.enabled": "$(sparkle) Autocomplete",
  "kilocode:autocomplete.statusBar.snoozed": "snoozed",
  "kilocode:autocomplete.statusBar.warning": "$(warning) Autocomplete",
  "kilocode:autocomplete.statusBar.tooltip.basic": "BharatCode Autocomplete",
  "kilocode:autocomplete.statusBar.tooltip.noUsableProvider":
    "**No autocomplete model configured**\n\nTo enable autocomplete, add a profile with one of these supported providers: {{providers}}.\n\n[Open Settings]({{command}})",
  "kilocode:autocomplete.statusBar.tooltip.completionSummary":
    "Performed {{count}} completions between {{startTime}} and {{endTime}}, for a total cost of {{cost}}.",
  "kilocode:autocomplete.statusBar.tooltip.providerInfo": "Autocompletions provided by {{model}} via {{provider}}.",
  "kilocode:autocomplete.statusBar.cost.zero": "$0.00",
  "kilocode:autocomplete.statusBar.cost.lessThanCent": "<$0.01",
  "kilocode:autocomplete.codeAction.title": "BharatCode: Suggested Edits",
  "kilocode:autocomplete.incompatibilityExtensionPopup.message":
    "The BharatCode Autocomplete is being blocked by a conflict with GitHub Copilot. To fix this, you must disable Copilot's inline suggestions.",
  "kilocode:autocomplete.incompatibilityExtensionPopup.disableCopilot": "Disable Copilot",
  "kilocode:autocomplete.incompatibilityExtensionPopup.disableInlineAssist": "Disable Autocomplete",
  "kilocode:autocomplete.creditsExhausted.message":
    "BharatCode Autocomplete has been paused. Possible causes: your BharatCode account has no remaining credits, or your configured API key (BYOK) has reached its quota limit. Add BharatCode credits or check your API key configuration to resume autocomplete.",
  "kilocode:autocomplete.creditsExhausted.addCredits": "Add Credits",
  "kilocode:autocomplete.authError.message":
    "BharatCode Autocomplete has been paused due to an authentication issue. Possible causes: you are not signed in to BharatCode, or your API key (BYOK) is invalid or missing. Please sign in again or check your provider API key settings.",
}
