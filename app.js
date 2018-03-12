const Homey = require('homey');

module.exports = class FlowEventBus extends Homey.App {

  onInit() {
    this.log('FlowEventBus is running...');

    // Register triggers.
    this.triggers = [
      this.registerTrigger('receive_event'),
      this.registerTrigger('receive_event_with_value'),
    ];

    // Register actions.
    this.registerAction('emit_event');
    this.registerAction('emit_event_with_value');
  }

  registerTrigger(name) {
    return new Homey.FlowCardTrigger(name)
                    .register()
                    .registerRunListener(this.handleTrigger.bind(this, name));
  }

  async handleTrigger(name, args, state) {
    // Check for matching event names.
    let isMatch = args.name === state.name;

    // Optionally check for matching event values.
    if (isMatch && 'value' in args) {
      isMatch = args.value === state.value;
    }

    if (isMatch) {
      this.log(`[${ name }] got trigger for event with args`, args, ' and state', state);
    }

    return isMatch;
  }

  registerAction(name) {
    return new Homey.FlowCardAction(name)
                    .register()
                    .registerRunListener(this.handleAction.bind(this, name));
  }

  async handleAction(name, args, state) {
    this.log(`[${ name }] emitting event with args`, args);

    // Prevent `missing_tokens` error in `receive_event` trigger.
    if (args.value == null) {
      args.value = '';
    }

    // Trigger triggers.
    this.triggers.forEach(trigger => trigger.trigger(args, args));

    // Done.
    return true;
  }

}
