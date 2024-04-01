# cam-processing-preview-demo

A simple app that demonstrates how to preview different local camera effects (i.e. background blur or replacement) before applying them to the live camera track that is shared with others on a call.

The approach here is to use a secondary Daily call instance (`previewer`) that's not meant to join a call but simply for viewing the camera and background processes. You can check out the setup of this instance in the [call-clients.ts](src/call-clients.ts) file. All the logic for selecting a background effect and applying it can be found in [effect-selector.ts](src/effect-selector.ts).

This demo also includes a device selector to demonstrate how to keep the to two instances synchronized to the user's current camera device selection. See [device-selector.ts](src/device-selector.ts)

## Setup

Edit `setupLiveCallClient()` in [call-clients.ts](src/call-clients.ts#L5) to use your own Daily room url.

## Run

```bash
nvm i

npm i

# Run the dev server. The demo will open automatically.
npm run dev
```
