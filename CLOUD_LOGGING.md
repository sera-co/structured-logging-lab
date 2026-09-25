# Cloud logging mapping

The API writes one JSON object per line to standard output. A container log collector can ingest each line as a structured record, preserving the top-level fields as searchable attributes:

- `ts` is the event timestamp.
- `level` maps to the cloud service's severity field (`INFO`, `WARNING`, or `ERROR`).
- `service` identifies the workload as `orders-api`.
- `msg` is the event name used for dashboards and alert filters.
- `reqId` is the correlation field used to trace one request across all events.
- Other fields, such as `method`, `path`, `port`, and `error`, remain structured labels or payload fields.

In Google Cloud Logging, configure the container runtime or collector to parse stdout as JSON and map `level` to `severity`. Queries can then use expressions such as `jsonPayload.service="orders-api" AND severity>=ERROR` or `jsonPayload.reqId="..."`.

In Grafana Loki, ship the JSON lines with Promtail or Grafana Alloy, parse them with a JSON pipeline stage, and filter with LogQL such as `{service="orders-api"} | json | level="error"` or `{service="orders-api"} | json | reqId="..."`. Keep high-cardinality values such as `reqId` parsed for filtering rather than indexing every request ID as a Loki label.

The application never logs passwords, tokens, card numbers, or request bodies. Error messages are included only to identify the failed operation and should be reviewed before forwarding third-party or database error text to a shared logging system.