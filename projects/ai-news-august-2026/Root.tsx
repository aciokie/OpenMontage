import { Composition } from "remotion";
import { Scene, calculateMetadata, SceneProps } from "./Composition";

export const Root: React.FC = () => (
  <Composition
    id="AiNewsAugust2026"
    component={Scene}
    durationInFrames={30 * 30}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={ { /* fill from artifacts/props.json at render time */ } as SceneProps }
    calculateMetadata={calculateMetadata}
  />
);
