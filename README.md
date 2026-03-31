# getcourse-mcp

MCP-сервер для API GetCourse — пользователи, заказы (сделки), создание пользователей.

## Возможности (3 инструмента)

| Инструмент | Описание |
|---|---|
| `get_users` | Список пользователей аккаунта |
| `create_user` | Создание / обновление пользователя |
| `get_deals` | Список заказов (сделок) |

## Быстрый старт

```json
{
  "mcpServers": {
    "getcourse": {
      "command": "npx",
      "args": ["-y", "@theyahia/getcourse-mcp"],
      "env": {
        "GETCOURSE_DOMAIN": "<YOUR_DOMAIN>.getcourse.ru",
        "GETCOURSE_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|---|---|---|
| `GETCOURSE_DOMAIN` | Да | Домен аккаунта (например, myschool.getcourse.ru) |
| `GETCOURSE_API_KEY` | Да | Секретный ключ API из настроек аккаунта |

## Лицензия

MIT
