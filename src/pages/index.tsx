// Page that will check if there is an id and username in localStorage, if not, it will ask for a name and create an id, then it will redirect to the chatRooms page
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const Index = () => {
    const router = useRouter();
    const [name, setName] = useState('');

    useEffect(() => {
        if (localStorage.getItem('name')) {
            router.push('/chatRooms')
        }
    }, []);

    const submitName = () => {
        if (name) {
            localStorage.setItem('name', name);
            router.push('/chatRooms')
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className={'flex flex-col items-center'}>
                <div className={'text-left w-full'}>
                    <span>Username</span>
                </div>
                <input
                    className={'p-2 rounded-lg border-2 border-gray-900'}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder={'Enter your name'}
                />
                <br/>
                <div>
                    <button className={'btn border-2 text-white bg-gray-900 py-2 px-8 rounded-lg'} onClick={submitName}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Index;