// Shared UI state: the ⌘K terminal sheet, the INDEX overlay, and an
// optional one-shot line the terminal prints when it next opens
// (used by easter eggs to hand the visitor over to the shell).
export const ui = $state({ terminal: false, index: false, greeting: '' });
