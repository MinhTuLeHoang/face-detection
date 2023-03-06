import { useEffect, useState } from "react";
import useDetectFace from "hooks/useDetectFace";
import Image from "next/image";


const AIPage = () => {
    // const [image, setImage] = useState<any>(null)
    const { image, onImageChange, yaw, getYaw, status, human, time } = useDetectFace();
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

            <Image src={image} alt='abc' width={300} height={400} />

            <br /><br />

            {!isPress && <button onClick={() => { setIsPress(true); getYaw(img) }} style={{ backgroundColor: 'blue', border: '2px solid black', color: 'white', padding: '10px' }}>Get data</button>}

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

        </div>
    )
}

export default AIPage;