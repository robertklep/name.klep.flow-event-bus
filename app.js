const Homey = require('homey');

module.exports = class FlowEventBus extends Homey.App {

  onInit() {
    this.homey.log('FlowEventBus is running...');

    // Register triggers.
    this.triggers = [
      this.registerTrigger('receive_event'),
      this.registerTrigger('receive_event_with_value'),
      this.registerTrigger('receive_event_with_values'),
      this.registerTrigger('receive_any_event'),
    ];

    // Register actions.
    this.registerAction('emit_event');
    this.registerAction('emit_event_with_value');
    this.registerAction('emit_event_with_values');
  }

  registerTrigger(name) {
    return this.homey.flow.getTriggerCard(name).registerRunListener(this.handleTrigger.bind(this, name));
  }

  async handleTrigger(name, args, state) {
    // Check for matching event names.
    let isMatch = args.name === state.name;

    // Optionally check for matching event values.
    if (isMatch && 'value' in args) {
      isMatch = args.value === state.value;
    }

    if (isMatch && 'value2' in args) {
      isMatch &= args.value2 === state.value2;
    }

    if (!!isMatch) {
      this.homey.log(`[${ name }] got trigger for event with args`, args, ' and state', state);
    }

    return !!isMatch;
  }

  registerAction(name) {
    return this.homey.flow.getActionCard(name).registerRunListener(this.handleAction.bind(this, name));
  }

  async handleAction(name, args, state) {
    this.homey.log(`[${ name }] emitting event with args`, args);

    // Prevent `missing_tokens` error in `receive_event` trigger.
    if (args.value == null) {
      args.value = '';
    }

    if (args.value2 == null) {
      args.value2 = '';
    }

    // Trigger triggers.
    this.triggers.forEach(trigger => trigger.trigger(args, args));

    // Done.
    return true;
  }

}
