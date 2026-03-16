# Performance Test HTML Report Summary

Generated: 2026-03-16

## Executive Summary

This summary consolidates key metrics from the JMeter dashboard statistics files and links directly to each generated HTML report.

## Scenario Metrics

| Scenario | Samples | Errors | Error % | Mean RT (ms) | P90 (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 1750 | 1004 | 57.37% | 2070.63 | 3988.70 | 4267.15 | 4708.72 | 9.29 |
| Load | 1750 | 500 | 28.57% | 271.46 | 419.70 | 532.00 | 648.47 | 14.19 |
| Peak | 7000 | 2001 | 28.59% | 285.89 | 507.00 | 545.00 | 713.95 | 22.54 |
| Stress | 1750 | 500 | 28.57% | 272.34 | 420.50 | 519.00 | 622.98 | 14.26 |
| Endurance | 7000 | 2017 | 28.81% | 383.92 | 653.00 | 892.85 | 1486.85 | 22.37 |

## Bandwidth Metrics

| Scenario | Received KB/s | Sent KB/s |
| --- | ---: | ---: |
| Baseline | 49.52 | 3.20 |
| Load | 75.78 | 4.88 |
| Peak | 120.95 | 7.75 |
| Stress | 76.59 | 4.90 |
| Endurance | 122.07 | 7.69 |

## HTML Dashboards

- Baseline: [reports/baseline/index.html](reports/baseline/index.html)
- Load: [reports/load/index.html](reports/load/index.html)
- Peak: [reports/peak/index.html](reports/peak/index.html)
- Stress: [reports/stress/index.html](reports/stress/index.html)
- Endurance: [reports/endurance/index.html](reports/endurance/index.html)

## Notes

- Error rates are high across all scenarios and require investigation of failed sampler responses before drawing performance conclusions.
- Baseline mean response time is significantly higher than the other scenarios, which may indicate environmental instability or scenario configuration differences.
- Use the linked HTML reports to inspect error distribution, transaction-level timings, and time-series trends.
