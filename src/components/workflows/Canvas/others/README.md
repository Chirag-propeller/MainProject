# Workflow Test Components

This directory contains the components needed for testing workflows with voice interaction.

## Components

### Test.tsx
The main test modal component that:
- Opens a slide-in modal from the right side
- Handles credit checking before starting a test
- Fetches a LiveKit token for workflow testing
- Manages the voice assistant state

### VoiceAssistant.tsx
A LiveKit-based voice assistant component that:
- Connects to LiveKit room using the provided token
- Handles audio streaming and transcription
- Provides voice interaction capabilities
- Shows conversation messages in real-time

### SimpleVoiceAssistance.tsx
The voice interaction interface that:
- Displays conversation messages (User vs Workflow)
- Handles auto-scrolling for new messages
- Provides voice control bar for managing the call
- Shows real-time transcription

## Usage

1. In the WorkflowsList component, click the "Test" button on any workflow
2. The test modal will open with a "Test Workflow" button
3. Click to start the voice test (credits will be checked)
4. A LiveKit room will be created and the voice assistant will connect
5. You can then interact with your workflow through voice

## API Endpoints

- `/api/livekit/workflow` - Generates LiveKit tokens for workflow testing
- `/api/user/getCurrentUser` - Checks user credits before testing

## Dependencies

- @livekit/components-react
- @livekit/components-styles
- livekit-client
- axios
- React hooks (useState, useEffect, useRef)

## Features

- Credit validation before testing
- Real-time voice interaction
- Conversation history display
- Auto-scrolling message container
- Responsive modal design
- Click outside to close functionality 