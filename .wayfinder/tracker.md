# Issue Tracker: Local Markdown

Issues and tickets for this project are stored as plain markdown files inside `.wayfinder/`.

## Structure

```
.wayfinder/
├── map.md                 # The canonical wayfinder map
└── tickets/
    ├── WF-01-<title>.md
    ├── WF-02-<title>.md
    └── ...
```

## Conventions

- **Create a ticket**: Create a markdown file `.wayfinder/tickets/WF-<ID>-<slug>.md` with frontmatter (`title`, `type`, `status`, `assigned_to`, `blocked_by`).
- **Read a ticket**: Read the markdown file.
- **List tickets**: Inspect the files in `.wayfinder/tickets/`.
- **Claim a ticket**: Set `assigned_to: jasperboyn` in frontmatter.
- **Close a ticket**: Set `status: closed` in frontmatter and append `## Resolution`.
- **Map updates**: Append to `## Decisions so far` in `.wayfinder/map.md`.
