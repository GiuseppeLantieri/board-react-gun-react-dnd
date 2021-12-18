import React, { useEffect } from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Gun from 'gun'
import SEA from 'gun/sea';
import { useParams } from 'react-router'

const gun = Gun(process.env.REACT_APP_GUN_RELAY);

export default function TakeNote() {
    const [Notes, setNotes] = useState([])
    const [Text, setText] = useState("")
    const [NoteName, setNoteName] = useState("")
    const [ModifiedId, setModifiedId] = useState();
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            gun.get(id).get('note').map(async (ele, id_node) => {
                console.log(ele);
                if (ele != undefined) {
                    const decrypted = await SEA.decrypt(ele, process.env.REACT_APP_SECRET);
                    if (decrypted && !decrypted.id) decrypted["id"] = id_node;
                    if (decrypted != undefined) {
                        let aux = Notes;

                        if (aux.filter(ele => ele.id == id_node).length == 0) {
                            aux.push(decrypted);
                            aux.sort((a, b) => a.createdAt - b.createdAt);
                            aux = [... new Set(aux.map(e => (JSON.stringify(e))))]
                                .map(e => (JSON.parse(e)));
                            setNotes(aux);
                        } else {
                            aux = aux.map(e => {
                                if (e.id == id_node) {
                                    return { name: e.name, text: decrypted.text, createdAt: decrypted.createdAt, id: id_node };
                                } else {
                                    return e;
                                }
                            });
                            setNotes(aux);
                        }
                    }
                }
            });
        })();
    }, [])

    async function deleteNote(note) {
        const nodeMessage = gun.get(id).get('note').get(note.id);
        nodeMessage.put(null);
        setNotes((prex) => (prex.filter(ele => ele != note)));
        setModifiedId(undefined);
        setText("");
        setNoteName("");
    }

    return (
        <>
            <div style={{ margin: "1em", display: "flex" }}>
                <label style={{ marginRight: "2em" }}>Name:</label>
                <input type="text" value={NoteName} onChange={(e) => { setNoteName(e.currentTarget.value) }} />
                <button onClick={async () => {
                    if (NoteName != "") {
                        console.log("Salvataggio...")
                        if (ModifiedId) {
                            console.log("Modifica...")
                            const nodeMessage = gun.get(id).get('note').get(ModifiedId);
                            const encrypted = await SEA.encrypt(JSON.stringify(
                                { name: NoteName, text: Text, createdAt: Date.now() }
                            ), process.env.REACT_APP_SECRET);
                            nodeMessage.put(encrypted);
                        } else {
                            const encrypted = await SEA.encrypt(JSON.stringify(
                                { name: NoteName, text: Text, createdAt: Date.now() }
                            ), process.env.REACT_APP_SECRET);
                            gun.get(id).get("note").set(encrypted);
                        }
                    } else {
                        alert("Name of Note can't be empty")
                    }
                }}>Salva Nota</button>
            </div>
            <div style={{
                display: "flex", justifyContent: "space-between",
                width: "90vw"
            }}>
                <div style={{ display: "flex", flexDirection: "column", width: "10vw", alignItems: "start" }}>
                    {Notes && Notes.map((ele, index) => {
                        return (
                            <div key={index} style={{ display: "flex" }}>
                                <button onClick={() => {
                                    console.log(ele.text);
                                    setText(ele.text);
                                    setNoteName(ele.name);
                                    setModifiedId(ele.id);
                                }} >
                                    {ele.name}
                                </button>
                                <button onClick={() => { deleteNote(ele) }}>❌</button>
                            </div>
                        )
                    })}
                </div>
                <textarea value={Text} style={{ width: "50vw", height: "60vh" }} onInput={
                    (e) => {
                        setText(e.currentTarget.value)
                    }
                } />
                <div style={{
                    display: "flex", flexDirection: "column", width: "50vw",
                    height: "60vh", alignItems: "start", overflow: "auto",
                    marginLeft: "1em"
                }}>
                    <ReactMarkdown >
                        {Text}
                    </ReactMarkdown>
                </div>
            </div>
        </>
    )
}
