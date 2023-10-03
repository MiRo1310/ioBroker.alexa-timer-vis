//ANCHOR createStates
//----------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * States erstellen
 * @param {number} value Wieviele Elemente sollen erstellt werden
 */
const createState = async (value, _this) => {
  try {
    for (let i = 1; i <= value; i++) {
      // Datenpunkt für allgemeine Anzeige das ein Timer aktiv ist
      await _this.setObjectNotExistsAsync("all_Timer.alive", {
        type: "state",
        common: {
          name: "Ist ein Timer activ?",
          type: "boolean",
          role: "indicator",
          read: true,
          write: true,
          def: false,
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".percent", {
        type: "state",
        common: {
          name: "Percent",
          type: "number",
          role: "indicator",
          read: true,
          write: true,
          def: 0,
        },
        native: {},
      });

      await _this.setObjectNotExistsAsync("timer" + i + ".alive", {
        type: "state",
        common: {
          name: "Timer activ",
          type: "boolean",
          role: "indicator",
          read: true,
          write: true,
          def: false,
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".hour", {
        type: "state",
        common: {
          name: "Hours",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".minute", {
        type: "state",
        common: {
          name: "Minutes",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".second", {
        type: "state",
        common: {
          name: "Seconds",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".string", {
        type: "state",
        common: {
          name: "String",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00:00:00 Std",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".string_2", {
        type: "state",
        common: {
          name: "String_2",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".name", {
        type: "state",
        common: {
          name: "Name des Timers",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "Timer",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".TimeStart", {
        type: "state",
        common: {
          name: "Start Time",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00:00:00",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".TimeEnd", {
        type: "state",
        common: {
          name: "End Time",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "00:00:00",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".InputDeviceName", {
        type: "state",
        common: {
          name: "Input of Device",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "",
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".Reset", {
        type: "state",
        common: {
          name: "Reset Timer",
          type: "boolean",
          role: "button",
          read: false,
          write: true,
          def: false,
        },
        native: {},
      });
      await _this.setObjectNotExistsAsync("timer" + i + ".lengthTimer", {
        type: "state",
        common: {
          name: "Gestellter Timer",
          type: "string",
          role: "value",
          read: true,
          write: true,
          def: "",
        },
        native: {},
      });
      // id zusammenbauen
      const id = `alexa-timer-vis.${_this.instance}.timer${i}.Reset`;
      // Subscribe Reset Button
      _this.subscribeForeignStates(id);
    }
  } catch (e) {
    _this.log.error(e);
  }
};
module.exports = { createState };
