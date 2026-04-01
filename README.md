# @theyahia/getcourse-mcp

MCP server for **GetCourse** LMS API. 3 tools for users, deals, and user creation.

[![npm](https://img.shields.io/npm/v/@theyahia/getcourse-mcp)](https://www.npmjs.com/package/@theyahia/getcourse-mcp)
[![license](https://img.shields.io/npm/l/@theyahia/getcourse-mcp)](./LICENSE)

## Quick Start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "getcourse": {
      "command": "npx",
      "args": ["-y", "@theyahia/getcourse-mcp"],
      "env": {
        "GETCOURSE_DOMAIN": "myschool.getcourse.ru",
        "GETCOURSE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add getcourse -- npx -y @theyahia/getcourse-mcp
```

Set env: `GETCOURSE_DOMAIN` + `GETCOURSE_API_KEY`.

### Cursor / Windsurf

```json
{
  "getcourse": {
    "command": "npx",
    "args": ["-y", "@theyahia/getcourse-mcp"],
    "env": {
      "GETCOURSE_DOMAIN": "myschool.getcourse.ru",
      "GETCOURSE_API_KEY": "your-api-key"
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `get_users` | List users with optional status/date filters |
| `create_user` | Create or update a user, add to group/deal |
| `get_deals` | List deals (orders) with status/date filters |

## Auth

| Variable | Required | Description |
|----------|----------|-------------|
| `GETCOURSE_DOMAIN` | Yes | Account domain (e.g. myschool.getcourse.ru) |
| `GETCOURSE_API_KEY` | Yes | API secret key from account settings |

## HTTP Transport

```bash
HTTP_PORT=3000 npx @theyahia/getcourse-mcp
# or
npx @theyahia/getcourse-mcp --http 3000
```

Endpoints: `POST /mcp` (JSON-RPC), `GET /health` (status).

## Skills

- **skill-students** -- query and manage GetCourse students
- **skill-deals** -- query GetCourse deals/orders by status and date

## License

MIT
