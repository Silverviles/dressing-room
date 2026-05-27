import {
  FilesetResolver,
  PoseLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm";
const MODEL_ASSET =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";

export type ShoulderPoints = {
  leftShoulder: [number, number] | null;
  rightShoulder: [number, number] | null;
};

const getPoint = (
  landmarks: NormalizedLandmark[] | undefined,
  index: number
): [number, number] | null => {
  if (!landmarks || !landmarks[index]) {
    return null;
  }
  return [landmarks[index].x, landmarks[index].y];
};

export class PoseService {
  private poseLandmarker: PoseLandmarker | null = null;

  async init() {
    if (this.poseLandmarker) return;

    const vision = await FilesetResolver.forVisionTasks(WASM_ROOT);
    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_ASSET,
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
  }

  estimate(video: HTMLVideoElement): ShoulderPoints {
    if (!this.poseLandmarker) {
      return { leftShoulder: null, rightShoulder: null };
    }

    const result = this.poseLandmarker.detectForVideo(video, performance.now());
    const landmarks = result.landmarks?.[0];

    return {
      leftShoulder: getPoint(landmarks, 11),
      rightShoulder: getPoint(landmarks, 12),
    };
  }

  close() {
    this.poseLandmarker?.close();
    this.poseLandmarker = null;
  }
}
