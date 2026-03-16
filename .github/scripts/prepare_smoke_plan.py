"""
Rewrites Performance_Testing.jmx into a lightweight CI smoke plan for one scenario.
Usage: python prepare_smoke_plan.py <scenario>
       scenario: baseline | load | peak | stress | endurance
"""
import sys
import pathlib
import xml.etree.ElementTree as ET

SCENARIO_MAP = {
    'baseline':  'TG1 - Baseline Test (50 Users)',
    'load':      'TG2 - Load Test (150 Users)',
    'peak':      'TG3 - Peak Load Test (300 Users)',
    'stress':    'TG4 - Stress Test (500 Users)',
    'endurance': 'TG5 - Endurance Test (100 Users)',
}

scenario = sys.argv[1]
if scenario not in SCENARIO_MAP:
    raise SystemExit(f'Unknown scenario: {scenario}. Choose from: {list(SCENARIO_MAP)}')

selected_name = SCENARIO_MAP[scenario]
plan_path = pathlib.Path('Performance_Testing.jmx')
output_path = pathlib.Path(f'artifacts/{scenario}-smoke-test.jmx')
output_path.parent.mkdir(parents=True, exist_ok=True)

tree = ET.parse(plan_path)
root = tree.getroot()

selected_group = None
for thread_group in root.findall('.//ThreadGroup'):
    test_name = thread_group.attrib.get('testname', '')
    thread_group.set('enabled', 'true' if test_name == selected_name else 'false')
    if test_name == selected_name:
        selected_group = thread_group

if selected_group is None:
    raise SystemExit(f'Unable to find thread group for scenario: {scenario}')


def set_child_text(parent, tag, name, value):
    for child in parent.findall(tag):
        if child.attrib.get('name') == name:
            child.text = value
            return
    raise SystemExit(f'Missing {tag} with name={name}')


set_child_text(selected_group, 'intProp',  'ThreadGroup.num_threads', '1')
set_child_text(selected_group, 'intProp',  'ThreadGroup.ramp_time',   '1')
set_child_text(selected_group, 'longProp', 'ThreadGroup.duration',    '15')
set_child_text(selected_group, 'boolProp', 'ThreadGroup.scheduler',   'false')
set_child_text(selected_group, 'longProp', 'ThreadGroup.delay',       '0')

controller = selected_group.find("elementProp[@name='ThreadGroup.main_controller']")
if controller is None:
    raise SystemExit('Missing LoopController in selected thread group')

loops = controller.find("stringProp[@name='LoopController.loops']")
if loops is None:
    loops = controller.find("intProp[@name='LoopController.loops']")
if loops is None:
    raise SystemExit('Missing LoopController.loops in selected thread group')
loops.text = '1'

continue_forever = controller.find("boolProp[@name='LoopController.continue_forever']")
if continue_forever is not None:
    continue_forever.text = 'false'

tree.write(output_path, encoding='UTF-8', xml_declaration=True)
print(f'Prepared smoke plan for scenario: {scenario} -> {output_path}')
