import { createContext } from 'react';

export type CommandParams = Record<string, unknown>;

export interface SocketContextValue {
  sendCommand: (method: string, params?: CommandParams) => string | null;
  addListener: (listener: (data: unknown) => void) => () => void;
}

export const SocketContext = createContext<SocketContextValue | undefined>(
  undefined
);
