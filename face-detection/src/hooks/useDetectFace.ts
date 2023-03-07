import type { Human, Config } from '@vladmandic/human';
import { useState, useCallback, useEffect } from 'react';


export const deg = (rad: any) => Math.round((rad || 0) * 180 / Math.PI);

export interface useDetectFaceProps {
    be: 'cpu' | 'wasm' | 'webgl' | 'webgpu';
}

const useDetectFace = ({ be }: useDetectFaceProps) => {
    const humanConfig: Partial<Config> = { // user configuration for human, used to fine-tune behavior
        debug: true,
        backend: be,
        modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human@3.0.5/models',
        filter: { enabled: true, equalization: false, flip: false },
        face: {
            enabled: true,
            detector: { rotation: false },
            mesh: { enabled: true, keepInvalid: true },
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
        gesture: { enabled: false },
        segmentation: { enabled: false },
    };

    const [time, setTime] = useState<any>(0);
    const [image64, setImage64] = useState<any>(''); // base64 image
    const [image, setImage] = useState<any>('');
    const [yaw, setYaw] = useState(0);
    const [status, setStatus] = useState<string[]>([]);
    const [human, setHuman] = useState<Human | null>(null);
    const [response, setResponse] = useState<any>();

    useEffect(() => {
        const tmpList = status;
        tmpList.push('init');
        setStatus(tmpList)
        import('@vladmandic/human').then((H) => {
            const human = new H.default(humanConfig) as Human;
            console.log('human version:', human.version, '| tfjs version:', human.tf.version['tfjs-core']);
            console.log('platform:', human.env.platform, '| agent:', human.env.agent);

            human.load().then(() => { // preload all models
                const tmpList = status;
                tmpList.push('models loaded');
                setStatus(tmpList)
                console.log('backend:', human!.tf.getBackend(), '| available:', human!.env.backends);
                console.log('loaded models:' + Object.values(human!.models).filter((model) => model !== null).length);
                human!.warmup().then(() => { // warmup function to initialize backend for future faster detection
                    const tmpList = status;
                    tmpList.push('warmup done');
                    setStatus(tmpList)
                    setHuman(human);
                });
            });
        });
        // eslint-disable-next-line
    }, [])

    // const init = useCallback(async () => {
    //     console.log('\n\n');
    //     console.log('human version:', human.version, '| tfjs version:', human.tf.version['tfjs-core']);
    //     console.log('platform:', human.env.platform, '| agent:', human.env.agent);
    //     console.log('loading...')
    //     await human.load();
    //     console.log('backend:', human.tf.getBackend(), '| available:', human.env.backends);
    //     console.log('models stats:', human.models.stats());
    //     console.log('models loaded:', human.models.loaded());
    //     console.log('environment', human.env);
    //     await human.warmup();
    //     console.log('initializing...\n\n')
    //     console.log('\n');
    // }, [human])

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            console.log("event.target.files[0]: ", event.target.files[0]);
            const tmpList = status;
            tmpList.push('image loaded');
            setStatus(tmpList);
            setImage(URL.createObjectURL(event.target.files[0]));

            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = () => {
                var base64 = reader.result;
                console.log(base64);
                setImage64(base64);
            };
        }
    }

    const getYaw = useCallback(async (imgElement: HTMLImageElement | undefined | null) => {
        console.log("human", human);
        console.log("imgElement", imgElement);
        if (!human || !imgElement) return;

        const tmpList = status;
        // tmpList.push('start detecting');
        // setStatus(tmpList);
        console.time('detect');
        const start = new Date().getTime();
        window.alert('start detecting')
        const res = await human.detect(imgElement, humanConfig);
        window.alert('finish detecting')
        const end = new Date().getTime();
        setResponse(res);
        console.timeLog('detect', 'finish detection');
        console.log("res", res);
        window.alert("yaw: " + res.face?.[0]?.rotation?.angle?.yaw);
        setYaw(deg(res.face?.[0]?.rotation?.angle?.yaw));
        tmpList.push('detecting done');
        setStatus(tmpList);
        setTime(end - start);
        return deg(res.face?.[0]?.rotation?.angle?.yaw);
        // eslint-disable-next-line
    }, [human])

    return {
        // init,
        image,
        image64,
        yaw,
        onImageChange,
        getYaw,
        status,
        human,
        response,
        time
    }
}

export default useDetectFace;