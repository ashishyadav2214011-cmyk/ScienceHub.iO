# Upgrade Guard Architecture

Workflow: Detect → Analyze → Dependency/Conflict Check → Experiment/Sandbox/Dry Run → Recovery/Safety Check → Report → required user approval → Execute → Monitor → Verify → Rollback/Recovery → Report.

Read-only analysis may run under user policy. State-changing upgrades require user approval. Emergency rollback may occur only under user-configured policy, followed immediately by notification and history.
