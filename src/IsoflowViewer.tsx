import React from 'react';
import { Isoflow } from './Isoflow';
import type { IsoflowProps } from './types/isoflowProps';

type ViewerProps = Omit<
  IsoflowProps,
  'editorMode' | 'mainMenuOptions' | 'enableDebugTools'
>;

export const IsoflowViewer: React.FC<ViewerProps> = (props) => (
  <Isoflow {...props} editorMode="EXPLORABLE_READONLY" />
);
