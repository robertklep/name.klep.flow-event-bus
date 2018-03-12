# Flow Event Bus

Event bus for flows. Allows flows to:
* send events as an action
* trigger on events

### What are events?

Events are messages to indicate that _something_ has happened. Events have a (user-definable) name, and optionally a value.

### Why not use Logic's _"a variable has changed"_?

Logic's _"a variable has changed"_ works well for switches, but not for buttons: buttons are unary (it only has one state, "pressed"), whereas switches are binary (typically two states, "on" or "off").

If you have a device that has buttons, and you are triggering on a button press, there is no specific value that you can set a variable to to indicate that the button is pressed. You either have to set the variable to some random value or use Better Logic's _"increment a variable's value"_ action (or something similar).

### Why not use _"Start a flow"_?

Because using events makes decoupling easier.

I have a bunch of cheap 433Mhz remote controls, for which I have created some simple "trigger" flows: _"If button 1 of remote A is pressed, emit event `trigger-remote-a-1`"_.

Whenever I want to assign an action to a particular button, I create a new flow: _"If event `trigger-remote-a-1` is received, turn on coffee machine"_.

This decouples a specific remote from a specific device, making it easy to re-assign remotes and devices, or be more flexible in general.

With events, you can also filter on specific event values, something that's not possible with _"Start a flow"_.

### Changelog

1.0.0 (2018-03-12):
- Initial release
