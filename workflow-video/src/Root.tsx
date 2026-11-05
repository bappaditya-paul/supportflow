import { Composition } from "remotion";
import { MainWorkflowVideo } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AutoFixWorkflow"
        component={MainWorkflowVideo}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
