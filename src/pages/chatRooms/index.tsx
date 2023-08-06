//get all chatRooms from db and show a button that will call makechatRooms to create them
import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
const Index = () => {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState([]);

    const makeChatRooms = () => {
        console.log('e')
        //post request to makechatRooms
        fetch('/api/makeChatRooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        }).then(r => getChatRooms())
    }

    const getChatRooms = () => {
        //get request to getChatRooms
        fetch('/api/makeChatRooms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(r => r.json()).then(r => {
            console.log(r)
            setChatRooms(r)
        })
    }

    useEffect(() => {
        if(! localStorage.getItem('name')){
            router.push('/');
            return;
        }

        getChatRooms()
    }, [])

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <h1>Chat Rooms</h1>
                {/*<button className={'btn'} onClick={makeChatRooms}>Make Chat Rooms</button>*/}
                <br/>
                <div className={'flex flex-col gap-2'}>
                    {chatRooms.map((chatRoom, index) => (
                        <Link
                            className={'bg-gray-200 rounded-lg p-2 mt-2'}
                            href={`/chatRooms/${chatRoom.id}`}
                            key={index}
                        >

                            <span>{chatRoom.name}</span><br/>

                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Index;