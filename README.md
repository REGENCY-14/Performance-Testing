# Performance-Testing

This repository contains Apache JMeter assets for running and reviewing performance tests across multiple load profiles. It includes the source test plan, raw result files, and generated HTML dashboards for each scenario.

## Contents

- `Performance_Testing.jmx`: Main JMeter test plan.
- `results/`: Raw `.jtl` outputs for each executed scenario.
- `reports/`: Generated JMeter HTML dashboards for each scenario.

## Test Scenarios

The repository currently includes report and result artifacts for these runs:

- `baseline`: Baseline performance measurements.
- `load`: Normal expected traffic/load validation.
- `peak`: Higher-volume peak traffic validation.
- `stress`: Stress behavior under heavy demand.

Each scenario has:

- A raw result file in `results/`.
- A browsable HTML report in `reports/<scenario>/index.html`.
- Aggregated statistics in `reports/<scenario>/statistics.json`.

## Prerequisites

- Apache JMeter installed locally.
- Java available on your machine.

## Running The Test Plan

Example non-GUI JMeter execution:

```powershell
jmeter -n -t Performance_Testing.jmx -l results\load.jtl -e -o reports\load
```

You can repeat the same pattern for other scenarios by changing the output `.jtl` file and the report folder.

## Viewing Reports

Open any generated dashboard in a browser, for example:

- `reports/baseline/index.html`
- `reports/load/index.html`
- `reports/peak/index.html`
- `reports/stress/index.html`

These dashboards contain response time trends, throughput charts, over-time views, and summary statistics for each run.

## Suggested Workflow

1. Update or review the test plan in `Performance_Testing.jmx`.
2. Run the desired scenario with JMeter in non-GUI mode.
3. Save the raw results to `results/`.
4. Generate the HTML dashboard into the matching folder under `reports/`.
5. Compare scenario dashboards to evaluate behavior across baseline, load, peak, and stress conditions.