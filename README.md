# ReactSignpad
https://github.com/user-attachments/assets/15ef641f-e82c-430e-9845-9e99df66c990

ReactSignpad is a technological prototype designed to showcase how **SharedWorker** can be used to share data between multiple browser tabs in real-time. This project demonstrates a multiple-tab Signpad application where one tab acts as the Operator and the other as the Customer.

The Customer can sign using a mouse or touch input, and the signature is mirrored instantly on the Operator's screen.

## Features
- Real-Time Synchronization: Utilizes SharedWorker to sync data between the multiple tabs instantly.
- Multiple-Tabs Interaction: One tab serves as the Operator view, while the other is the Customer view.
- User-Friendly Signing: Supports both mouse and touch input for signing.
- Efficient Communication: Demonstrates the power of SharedWorker for real-time, inter-tab communication.

## How It Works
1. SharedWorker is used to establish a shared data channel between the multiple tabs.
2. The Customer tab allows the user to draw their signature using mouse or touch input.
3. The signature data is sent to the Operator tab in real-time, where it is mirrored instantly.

## Getting Started
### Prerequisites
- Node.js and npm installed
- A modern browser that supports SharedWorker (e.g., Chrome, Firefox)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/soulee-dev/ReactSignpad.git
cd ReactSignpad

```
2. Install dependencies:
```bash
npm install
Start the development server:
```

```bash
npm run dev
```

4. Open two or more tabs in your browser and navigate to the same URL provided by the development server.

## Debug
To debug SharedWorker, type `chrome://inspect/#workers` on browser.
