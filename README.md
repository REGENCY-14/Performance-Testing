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

## GitHub Actions CI/CD

This repository now includes a single GitHub Actions workflow for validation and a lightweight CI execution:

- `validate-performance-assets.yml`: Runs validation on pushes, pull requests, and manual dispatch for the JMeter plan and generated report assets, then executes a reduced JMeter smoke run in CI.

### CI behavior

The validation workflow checks that:

- `Performance_Testing.jmx` exists and is valid XML.
- Each scenario report folder exists.
- Each scenario contains `index.html` and `statistics.json`.
- Each scenario has a matching `.jtl` file under `results/`.

It also uploads the `reports/` directory as a workflow artifact for easy download from the Actions run.

### CI test execution

The pipeline also runs JMeter directly in GitHub Actions.

- On `push` and `pull_request`, it runs a smoke version of the `baseline` scenario.
- On `workflow_dispatch`, you can choose `baseline`, `load`, `peak`, `stress`, or `endurance` as the source thread-group template.
- The selected scenario is automatically reduced to safe CI settings: `1` user, `1` second ramp-up, and `1` loop.

This keeps the workflow useful for validation without turning GitHub-hosted runners into a real load-generation environment.

The workflow uploads these generated CI artifacts:

- The temporary CI-ready `.jmx` file.
- The `.jtl` results from the workflow run.
- The generated HTML dashboard for that CI smoke execution.

## Suggested Workflow

1. Update or review the test plan in `Performance_Testing.jmx`.
2. Run the desired scenario with JMeter in non-GUI mode.
3. Save the raw results to `results/`.
4. Generate the HTML dashboard into the matching folder under `reports/`.
5. Compare scenario dashboards to evaluate behavior across baseline, load, peak, and stress conditions.