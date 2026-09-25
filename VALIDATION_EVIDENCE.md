# Structured logging validation

The API was run in Docker on host port `3001` because host port `3000` was already used by an unrelated local Grafana container. The container itself still listens on port `3000`.

## Before

Before the change, `docker logs orders-api` contained unstructured messages such as:

```text
starting
connecting...
done
error happened
```

The source also emitted ambiguous messages such as `oops`, `retry`, and `ok`, with no timestamp, severity, service name, or request correlation.

## After

The same failure endpoint, `curl http://localhost:3001/simulate-error`, returned HTTP 500 and the response included:

```text
X-Request-ID: a3367e8e-db6c-4082-80e3-fbcdccb82749
```

Relevant `docker logs orders-api` output:

```json
{"ts":"2026-09-25T06:07:14.123Z","level":"info","service":"orders-api","msg":"request.start","reqId":"a3367e8e-db6c-4082-80e3-fbcdccb82749","method":"GET","path":"/simulate-error"}
{"ts":"2026-09-25T06:07:14.140Z","level":"error","service":"orders-api","msg":"request.failure","reqId":"a3367e8e-db6c-4082-80e3-fbcdccb82749","error":"simulated failure"}
```

The exact error filter used was:

```bash
docker logs orders-api | jq 'select(.level=="error")'
```

Output:

```json
{"ts":"2026-09-25T06:07:14.140Z","level":"error","service":"orders-api","msg":"request.failure","reqId":"a3367e8e-db6c-4082-80e3-fbcdccb82749","error":"simulated failure"}
```

The request trace filter was:

```bash
docker logs orders-api | jq 'select(.reqId=="a3367e8e-db6c-4082-80e3-fbcdccb82749")'
```

Output:

```json
{"ts":"2026-09-25T06:07:14.123Z","level":"info","service":"orders-api","msg":"request.start","reqId":"a3367e8e-db6c-4082-80e3-fbcdccb82749","method":"GET","path":"/simulate-error"}
{"ts":"2026-09-25T06:07:14.140Z","level":"error","service":"orders-api","msg":"request.failure","reqId":"a3367e8e-db6c-4082-80e3-fbcdccb82749","error":"simulated failure"}
```

No request body, password, token, or payment/card data is logged.