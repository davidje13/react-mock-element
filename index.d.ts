import React from 'react';

declare global {
  interface HTMLElement {
    readonly mockProps: Record<string, any>;
  }
}

export default function (name: string): () => React.ReactElement;
