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
    const { image64, onImageChange, yaw, getYaw, status, human, response, time } = useDetectFace({be} as useDetectFaceProps);
    const [img, setImg] = useState<any>();
    const [isPress, setIsPress] = useState(false);
    const [isPress2, setIsPress2] = useState(false);

    // const onImageChange = (event:any) => {
    //     if (event.target.files && event.target.files[0]) {
    //         setImage(URL.createObjectURL(event.target.files[0]));

    //         const img = document.getElementsByTagName('img')[0];
    //         console.log("img", img);
    //     }
    // }


    // useEffect(() => {
    //     if (image) {
    //         console.log("image", image)
    //     }
    // }, [image])

    useEffect(()=>{
        setImg(document.getElementsByTagName('img')[0]);
    },[onImageChange])

    const imgSelect = () => {
        if (document !== undefined) {
            const img = document.getElementById('image1');
            console.log("image1", img);
            return img;
        }
    }

    return (
        <div>
            <h3>Nhập ảnh nha đồng chí</h3>

            <br />

            <input type='file' onChange={onImageChange} accept="image/png, image/jpeg, image/jpg" ></input>

            <br /><br />

            <img src={image64} alt='abc' width={256} height={256} />

            <p style={{height: '100px', overflow: 'scroll', wordWrap: 'break-word'}}>{image64 && image64}</p>

            <br /><br />

            {!isPress && <button onClick={() => { setIsPress(true); getYaw(img) }} style={{ backgroundColor: 'blue', border: '2px solid black', color: 'white', padding: '10px' }}>Get data</button>}

            <br /><br />

            {!isPress2 && <button onClick={() => { setIsPress(true); getYaw(imgSelect()) }} style={{ backgroundColor: 'blue', border: '2px solid black', color: 'white', padding: '10px' }}>Get data2</button>}

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

            <br/><br/>
            <p>--------------------------------</p>

            <img src="/anh.jpg" height={256} width={256} id="image1"/>
        </div>
    )
}

export default AIPage;