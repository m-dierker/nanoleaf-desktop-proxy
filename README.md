# Nanoleaf Desktop Proxy

Programatically control Nanoleaf Essentials Smart Holiday lights.

```
Twas the week before Christmas
and all through the house
Not a Scene was playing
by touch or by mouse

The Nanoleaf lights
were strung with care
In the hopes that animation
soon would be there

The wifi was active!
Even Matter connected!
But sadly the Nanoleafs
were plain and dejected

The developer sighed
and got out of this pinch
Hoping maybe one day
the lights stop being a grinch
```

# What is this?

**tl;dr:** [Nanoleaf Essentials Smart Holiday Lights](https://nanoleaf.me/en-US/products/seasonal/holiday-string-lights/?size=each) have neat animations! Sadly, the public API only permits a single color for all 250 lights. 😒 This hacky project allows you to programatically use animation scenes.

## Background

Nanoleaf came out with [Essentials Smart Holiday String Lights](https://nanoleaf.me/en-US/products/seasonal/holiday-string-lights/?size=each), individually addressable LED light strands. I saw the lights had an API and bought them on sale to integrate into my house via [Home Assistant](https://www.home-assistant.io/).

Sadly, the only external API that Nanoleaf made available is [Matter](https://www.home-assistant.io/integrations/matter/), and that only exposes a single color for all 250 lights! Animations (scenes) aren't shared. It's a little silly to sell fancy animating lights with an API that doesn't allow users to animate them. 🙃

## Workaround

Thankfully, Nanoleaf does have an API for animating the lights, they just don't share it. The [Nanoleaf Desktop app](https://nanoleaf.me/en-US/integration/desktop-app/) can set scenes on lights, and helpfully exposes a HTTP server that allows us to do the same.

**Note:** This project is not very user friendly. Hopefully one day, Nanoleaf will open a real API and avoid this hackery. If you're a developer, feel free to try it out and [file an issue](https://github.com/m-dierker/nanoleaf-desktop-proxy/issues) if you need some help.

# Usage

Follow the (non-trivial) installation steps below. Once you've completed the setup, changing scenes is as simple as:

````

POST http://localhost:7682/scene

{"scene": "Candy Cane"}

```

The scene name is case sensitive and must exactly match the app.

# Installation

## Prereqs

- A Mac or Windows PC that can be left running in the background.
- Nanoleaf Essentials Smart Holiday Lights
- Some programming expertise
- Git
- [NodeJS](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Setup

### Nanoleaf Desktop

- If you haven't already, add your Smart Holiday lights to the Nanoleaf Cloud via the Nanoleaf app.
  - If you need to factory reset your lights, [here are instructions](https://helpdesk.nanoleaf.me/en-US/how-to-control-your-holiday-string-lights-using-button-342048).
- Install [Nanoleaf Desktop](https://nanoleaf.me/en-US/integration/desktop-app/).
- Sign in with your Nanoleaf Cloud account, and link your Smart Holiday lights if needed.
  - For me, this required re-entering my 10 digit pairing code from the instructions.

At this point, you should be able to control your lights via the Nanoleaf Desktop app. Make sure you can turn them on/off and set scenes.

### Repo Setup

- Clone this repo and `cd` into the directory.
- Run `yarn` to install all dependencies.

### Config

This is the hard part. You should (hopefully) only have to do it once.

Rename `.env.sample` to `.env` and open it up. We're going to fill in the first four variables.

In order to mirror the Nanoleaf app, we need to get a packet capture of the call Nanoleaf Desktop makes to itself when setting a scene.

Setup:

- Download and install [Wireshark](https://www.wireshark.org/download.html).
  - Make sure to follow the installer's instructions for your OS. This may require additional drivers or packages to be installed.
- When Wireshark is open, click `Loopback` to start capturing on the loopback adapter. You should see packets start to appear. If not, stop and debug.
- Click the Stop (red square) top, then clear the screen (paper with an X). Continue without saving.

Record a packet:

- Prepare the Nanoleaf Desktop app. Open your lights, go to the Scenes menu, and prepare to click a Scene.
- Back in Wireshark, click `Loopback` again. Quickly, go to the Nanoleaf app and change Scenes a couple times. Go back to Wireshark and click Stop (red square).

Get the right info:

- In the Wireshark filter field, type `http`, and press Enter. This will filter to just HTTP requests.
- Under the Info column, look for a request that starts `POST /essentials/control`. This is the call from Nanoleaf to itself to set a scene.
- With this request highlighted, right click `Javascript Object Notation: application/json` in the bottom left panel, then select Copy --> ...as C string. This should copy/ a bunch of JSON that looks like this:

```

"{"devices":[{"essentialsScenes":{...},
"id":"LIGHTS_ID",
"ip":"LIGHTS_IP",
"isEssentials":true,
"model":"LIGHTS_MODEL",
"port":LIGHTS_PORT,
"token":"IGNORE_THIS",
"eui64":"IGNORE_THIS"}],
"value":{"effect":{"value":"IGNORE_THIS"}}}"

```

Paste this into a text editor. There are four fields you need to pull out. Go to .env, and find the corresponding sections of the JSON notated above. Copy/paste the four values into the .env file. Do not use quotes.

### Deploy

If you've made it this far, congratulations! You're almost done.

Leave the Nanoleaf Desktop app running. Back in the terminal in this repo's directory: Run `yarn dev` to start the server.

That's it! You should now be able to change your device's scene using the Usage instructions shown above.

# In closing...

This is pretty dumb, but it's the workaround I found that allows me to programtically animate my lights now without waiting. Questions and tips are welcome!
```
````
