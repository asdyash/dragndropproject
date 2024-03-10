import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({tasks , setTasks}) => {

    const [todos,setTodos]=useState([])
    const [InProgress,setInProgress]=useState([])
    const [Closed,setClosed]=useState([])

    useEffect(()=>{
        const ftodos=tasks.filter(task => task.status==="todo")
        const finprogress=tasks.filter(task => task.status==="inprogress")
        const fclosed=tasks.filter(task => task.status==="closed")
        setTodos(ftodos)
        setInProgress(finprogress)
        setClosed(fclosed)
    },[tasks])
    const statuses=["todo", "inprogress","closed"]
    return ( <div className="flex gap-16">
        {statuses.map((status,index) =>( 
        <Section key={index} status={status} 
        tasks={tasks} setTasks={setTasks} todos={todos} InProgress={InProgress} Closed={Closed}
        />
        ))}
    </div> 
    )
};
 
export default ListTasks;
 const Section = ({status , tasks,setTasks,todos,InProgress,Closed}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "tasks",
        drop: (item)=> addItemToSection(item.id),
        collect: (monitor) => ({
          isOver: !!monitor.isOver()
        })
      }))
    let text="TODO";
    let bg="bg-slate-500";
    let tasksToMap=todos
    if(status==="inprogress"){
        text="In Progress"
        bg="bg-purple-500"
        tasksToMap=InProgress
    }
    if(status==="closed"){
        text="Closed"
        bg="bg-green-500"
        tasksToMap=Closed
    }
    
    const addItemToSection=(id)=>{
        setTasks(prev => {
            const mTasks=prev.map(t =>{
                if(t.id===id){
                   return{...t , status: status} 
                }
                return t
            })
            localStorage.setItem("tasks",JSON.stringify(mTasks))
            toast("Task Status Changed !")
            return mTasks
        })
    }


    return ( <div ref={drop} className={' ${...isOver ? "bg-slate-200": ""} w-64  bg-slate-400' }>
    <Header  text={text} bg={bg} count={tasksToMap.length}/> 
    {tasksToMap.length>0 && tasksToMap.map(task => <Task key={task.id} tasks={tasks} task={task} setTasks={setTasks}/> )}
    </div> )
 };

 const Header = ({text,bg,count}) => {
    return ( <div className={'${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white'}>{text}<div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">{count}</div>
    
    </div> )
 };

 const Task = ({task,tasks,setTasks}) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "tasks",
        item: {id : task.id},
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))

console.log(isDragging)
    const handleRemove=(id)=>{
        
        const fTasks=tasks.filter((t)=>t.id !== id)
        localStorage.setItem("tasks",JSON.stringify(fTasks))
        setTasks(fTasks)
        toast("Task Removed")
    }
    return ( <div  ref={drag} 
    className={
        'relative p-4 mt-8 shadow-md rounded-md cursor-grab bg-slate-200 ${isDragging ? " opacity-25" : "opacity-100" }'
        }>
        <p>{task.name}</p>
        <button className="absolute bottom-1 right-1" onClick={() => handleRemove(task.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</button>
    </div> )
 };
  

