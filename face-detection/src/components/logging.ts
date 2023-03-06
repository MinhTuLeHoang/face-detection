const dom: { log: HTMLDivElement | undefined, status: HTMLDivElement | undefined, perf: HTMLDivElement | undefined, yaw: HTMLDivElement | undefined } = { log: undefined, status: undefined, perf: undefined, yaw: undefined };

let isFirstTime = true;

export const log = (...msg: any) => {
  if (typeof document !== 'undefined') {
    if (!dom.log) dom.log = document.getElementById('log') as HTMLDivElement;
    dom.log.innerText += msg.join(' ') + '\n';
  }
  console.log(...msg);
};

export const status = (msg: string) => {
  if (typeof document !== 'undefined') {
    if (!dom.status) dom.status = document.getElementById('status') as HTMLDivElement,
    console.log('status', msg, dom.status?.innerText);
    dom.status.innerText = msg;
  }
}

export const yaw = (msg: string) => {
  if (typeof document !== 'undefined') {
    if (!dom.yaw) dom.yaw = document.getElementById('yaw') as HTMLDivElement,
    console.log('yaw', msg, dom.yaw?.innerText);
    dom.yaw.innerText = msg;
  }
}

export const saveImg = (degree:number) => {
  if (typeof document !== 'undefined' && isFirstTime) {
    isFirstTime = false;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const img = document.getElementById('resultImage') as HTMLImageElement;
    const result = document.getElementById('result') as HTMLDivElement;
    const imgURL = canvas.toDataURL('image/png');
    img.src = imgURL;
    result.innerHTML = String(degree);
    // const link = document.createElement('a');
    // link.download = 'image.png';
    // link.href = imgURL;
    // link.click();
  }
}