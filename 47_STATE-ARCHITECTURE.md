# State Architecture

State classes: UI state, navigation state, learning state, user-control state, permission state, AI state, notification state, offline/sync state, Upgrade Guard state, recovery state.

State changes affecting the user require the universal user-affecting protocol unless a valid persistent/temporary permission already covers the action.
