import { useEffect, useState } from "react";
import useDetectFace, { useDetectFaceProps } from "hooks/useDetectFace";
// import Image from "next/image";
import { useRouter } from 'next/router'


const AIPage = () => {
    const router = useRouter();
    let {be} = router.query;
    const beList = ['cpu', 'wasm', 'webgl', 'webgpu'];
    if (typeof(be) !== 'string') be = 'webgl';
    if (beList.indexOf(be) < 0) be = 'webgl';
    const { image, onImageChange, yaw, getYaw, status, human, response, time } = useDetectFace({be} as useDetectFaceProps);
    const [img, setImg] = useState<any>();
    const [isPress, setIsPress] = useState(false);

    // const onImageChange = (event:any) => {
    //     if (event.target.files && event.target.files[0]) {
    //         setImage(URL.createObjectURL(event.target.files[0]));

    //         const img = document.getElementsByTagName('img')[0];
    //         console.log("img", img);
    //     }
    // }


    useEffect(() => {
        if (image) {
            console.log("image", image)
        }
    }, [image])

    useEffect(()=>{
        setImg(document.getElementsByTagName('img')[0]);
    },[onImageChange])

    return (
        <div>
            <h3>Nhập ảnh nha đồng chí</h3>

            <br />

            <input type='file' onChange={onImageChange} accept="image/png, image/jpeg, image/jpg" ></input>

            <br /><br />

            <img src={image} alt='abc' width={300} height={400} />

            <br /><br />

            {!isPress && <button onClick={() => { setIsPress(true); getYaw(img) }} style={{ backgroundColor: 'blue', border: '2px solid black', color: 'white', padding: '10px' }}>Get data</button>}

            <br /><br />

            <button onClick={() => { console.log(human) }} style={{ backgroundColor: 'yellow', border: '2px solid white', color: 'white', padding: '10px' }}>Show Human</button>

            <br /><br />

            <p>status: {status?.map((s)=><span key={s}>{s} - </span>)}</p>
            <p>human version:{human?.version}, tfjs version: {human?.tf.version['tfjs-core']}</p>
            <p>platform: {human?.env.platform}</p>
            <p>agent: {human?.env.agent}</p>
            <p>backend: {human?.tf?.getBackend()}, available: {human?.env?.backends?.map((be)=><span key={be}>{be} - </span>)}</p>
            {human && <p>loaded models: {Object.values(human!.models).filter((model) => model !== null).length}</p>}

            <br/><br/>
            <p>--------------------------------</p>
            <p>yaw: {yaw}</p>
            <p>in: {time}ms</p>


            <br/><br/>
            <p>--------------------------------</p>
            <p>{response && JSON.stringify(response?.face?.score)}</p>
            <p>{response && JSON.stringify(response?.face?.faceScore)}</p>
            <p>{response && JSON.stringify(response?.face?.boxScore)}</p>
            <p>{response && JSON.stringify(response?.face?.rotation)}</p>
        </div>
    )
}

export default AIPage;