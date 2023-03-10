import { Component } from "react";
import type { Human, Config } from '@vladmandic/human';
import { log, status, yaw, saveImg } from './logging';

export const deg = (rad: any) => {
  if (!rad && rad !== 0) return -9999;
  return Math.round((rad || 0) * 180 / Math.PI)
};

const config: Partial<Config> = {
  debug: true,
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/modelsn',
  filter: { enabled: false, equalization: false, flip: false },
  face: {
    enabled: true,
    detector: { rotation: false },
    mesh: { enabled: true },
    attention: { enabled: false },
    iris: { enabled: false },
    description: { enabled: false },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false }
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
  gesture: { enabled: false },
}

interface Props { inputId: string, outputId: string };
interface State { ready: boolean, frame: number };

class RunHuman extends Component<Props, State> {
  HumanImport: any;
  human: Human | undefined = undefined;
  video: HTMLVideoElement | undefined = undefined;
  canvas: HTMLCanvasElement | undefined = undefined;
  timestamp: number = 0;
  fps: number = 0;
  yaw: number = 0;

  constructor(props: Props) { // human is loaded as dynamic import in component constructor and then sets ready state
    super(props)
    if (typeof document === 'undefined') return;
    console.log("video", this.video);
    this.video = document.getElementById(this.props.inputId) as (HTMLVideoElement | undefined) || document.createElement('video');
    this.canvas = document.getElementById(this.props.outputId) as (HTMLCanvasElement | undefined) || document.createElement('canvas');
    import('@vladmandic/human').then((H) => {
      this.human = new H.default(config) as Human;
      console.log("human", this.human);
      log('human version:', this.human.version, '| tfjs version:', this.human.tf.version['tfjs-core']);
      log('platform:', this.human.env.platform, '| agent:', this.human.env.agent);
      status('loading models...');
      this.human.load().then(() => { // preload all models
        log('backend:', this.human!.tf.getBackend(), '| available:', this.human!.env.backends);
        log('loaded models:' + Object.values(this.human!.models).filter((model) => model !== null).length);
        status('initializing...');
        this.human!.warmup().then(() => { // warmup function to initialize backend for future faster detection
          this.setState({ ready: true });
          status('ready...');
        });
      });
    });
  }

  override async componentDidMount() { // add event handlers for resize and click
    if (this.video) this.video.onresize = () => {
      this.canvas!.width = this.video!.videoWidth;
      this.canvas!.height = this.video!.videoHeight;
    }
    if (this.canvas) this.canvas.onclick = () => {
      this.video?.paused ? this.video?.play() : this.video?.pause();
    }
  }

  override render(this: RunHuman) {
    if (this && this.state && this.state.ready) this.detect(); // start detection loop once component is created and human state is ready trigger detection and draw loops
    if (!this || !this.video || !this.canvas || !this.human || !this.human.result) return null;
    if (!this.video.paused) {
      // const interpolated = this.human.next(this.human.result); // smoothen result using last-known results
      this.human.draw.canvas(this.video, this.canvas); // draw canvas to screen
      // this.human.draw.all(this.canvas, interpolated); // draw labels, boxes, lines, etc.
    }
    status(this.video.paused ? 'paused' : `fps: ${this.fps.toFixed(1).padStart(5, ' ')}`); // write status
    return null;
  }

  async detect(this: RunHuman) { // main detection loop
    if (!this || !this.human || !this.video || !this.canvas) return;
    // console.log("video: ", this.video)
    const res = await this.human.detect(this.video); // actual detection; were not capturing output in a local variable as it can also be reached via this.human.result
    this.yaw = deg(res.face[0]?.rotation?.angle?.yaw); // get yaw angle of first face detected
    yaw(`yaw: ${String(this.yaw)}`);
    if ((-50 < this.yaw && this.yaw < -20) || (20 < this.yaw && this.yaw < 50)) saveImg(this.yaw);
    const now = this.human.now();
    this.fps = 1000 / (now - this.timestamp);
    this.timestamp = now;
    this.setState({ ready: true, frame: this.state.frame + 1 });
  }
}

export default RunHuman;
