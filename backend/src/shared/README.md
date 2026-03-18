This folder holds cross-cutting code shared across layers.

Guidelines:
- No direct imports from presentation (HTTP) or infrastructure (DB) in shared.
- Prefer small, dependency-free utilities.
