![Logo](admin/alexa-timer-vis.png)
# ioBroker.alexa-timer-vis



[![NPM version](https://img.shields.io/npm/v/iobroker.alexa-timer-vis.svg)](https://www.npmjs.com/package/iobroker.alexa-timer-vis)
[![Downloads](https://img.shields.io/npm/dm/iobroker.alexa-timer-vis.svg)](https://www.npmjs.com/package/iobroker.alexa-timer-vis)
![Number of Installations](https://iobroker.live/badges/alexa-timer-vis-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/alexa-timer-vis-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.alexa-timer-vis.png?downloads=true)](https://nodei.co/npm/iobroker.alexa-timer-vis/)

**Tests:** ![Test and Release](https://github.com/MiRo1310/ioBroker.alexa-timer-vis/workflows/Test%20and%20Release/badge.svg)

## alexa-timer-vis adapter für den ioBroker

Alexa Timer ausgeben um in der Vis anzuzeigen

### Das ist ein Beispiel aus meiner Vis

![](admin/timer.png)


## Funktionsweise

Es können unbegrenzt Timer mit Alexa per Sprachbefehl erstellt werden. 
Bei Start des Adapters werden 4 Ordner erstellt, mit den ganzen States.
Zusätzliche Ordner werden erstellt sobald ein 5. und mehr Timer per Alexas Spracheingabe erstellt werden. 

### Timer hinzufügen ( Beispiele )

* Alexa, Timer 5 Minuten
* Alexa, Pommes Timer 9 Minuten
* Alexa, stelle einen Timer auf 1 Stunde und 30 Minuten,
* Alexa, setzte Timer auf 2 Stunden
* Alexa, Timer auf 120 Minuten
* Alexa, Timer 9 Minuten Spaghetti

### Timer löschen ( Beispiele )

* Alexa, lösche alle Timer
* Alexa, lösche Pommes Timer
* Alexa, lösche 5 Minuten Timer


#### Wenn ihr Anregungen habt, um etwas besser zu machen, oder andere Funktionen hinzu zu fügen immer gerne melden






## Changelog
### 0.1.0 (28.12.021)
* Fehler beim Löschen von Intervallen und Timeouts nach dem Shutdown, behoben
### 0.0.4 (27.12.2021)
* Anpassung an verschiedener Möglichkeiten der Eingabe eines Timers
### 0.0.3 (26.12.2021)
* (Michael Roling) Bugfix
### 0.0.2 (26.12.2021)
* (Michael Roling) Bugfix
### 0.0.1 (25.12.2021)
* (Michael Roling) initial release

## License
MIT License

Copyright (c) 2021 Michael Roling <michael.roling@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.