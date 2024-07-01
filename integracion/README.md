# Docker compose management

## Start/Stop the application

```sh
cd integracion
docker compose up
docker compose down
```

## Connect to an instance

```sh
docker compose exec -it db bash
docker compose exec -it web bash
docker compose exec -it backend bash
docker compose exec -it auditoria bash
```
