import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
const CreateTask = ({tasks , setTasks}) => {
    const [task,setTask]=useState({
        id: "",
        name: "",
        status:"todo" //can also be inprogress or closed

    });
    // console.log(task)
    const handlesubmit=(e)=>{
        e.preventDefault();
        if(task.name.length<3) return toast.error("A task have atleat 3 charaters");
        if(task.name.length>100) return toast.error("A task must not have more than 100 charaters");
        setTasks((prev)=> {
            const list=[...prev,task]
            localStorage.setItem("tasks",JSON.stringify(list))
            return list
        })
        toast.success("Task Created !")
        setTask({
            id: "",
        name: "",
        status:"todo"
        })
    }
    return ( <form  onSubmit={handlesubmit}>
        <input type="text" className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
        value={task.name}
        onChange={(e)=>setTask({...task,id: uuidv4(), name: e.target.value})}
        />
        <button className="bg-cyan-500 rounded-md px-4 h-12 text-white">Create</button>

    </form> );
}
 
export default CreateTask;