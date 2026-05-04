# Micro-Tipping Widget

A sleek, intuitive React widget optimized for community micro-tipping. 

Powered by **React**, **Tailwind CSS**, and **Framer Motion**, giving it a Creator-level "Visual Flair" while leveraging the **Arc SDK (`@arc-network/app-kit`)**.

## The "Arc" Edge

The traditional barrier for micro-payments is transaction times and gas fees. We chose the **Arc SDK** to solve this:
- **Sub-Second Finality**: You'll notice the loading overlay resolves almost instantly, preventing users from waiting and dropping out. This is critical for "live stream" and real-time creator setups.
- **Gas Station Ready**: *Pro-Tip:* To further drop user friction, implement an Arc "Gas Station" using `arc-network/paymaster`. This intercepts transaction intents and covers the sub-cent gas fees on behalf of the user, requiring zero funding in their wallet—just USDC.

## Getting Started

1. Check out the beautiful interface in development mode:
```bash
npm run dev
```

## Features
- **Modern Glassmorphism UI**: High aesthetic impact using pure Tailwind CSS and dynamic abstract shadows.
- **Micro-Animations**: Framer Motion handles tactile feedback for every tip preset and send confirmation, making it feel organic and responsive.
- **Smart Validation**: The custom amount input cleanly overrides presets, with form states tied elegantly into the final `sendTransaction` event.
# arc
